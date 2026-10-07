/*
 * لوحة التحكم — تفاصيل خطط السداد الزيادة في فورم الوحدة (القديم والجديد): resources/views/shary_admin/partials/unit-plan-extras.blade.php
 *   - لكل خطة سداد في الفورم (الخطة الأساسية + أي خطة مضافة): مقدم 2 ، مقدم 3 ... (إضافة / حذف) + عدد الشهور بين كل دفعة والتانية.
 *   - إجمالي الأقساط ودفعة الاستلام بيتحسبوا قدامك تلقائي من بيانات الخطة (السعر − المقدمات ، القسط × عدد الدفعات) — مش بيتكتبوا.
 *   - الكل بيتحفظ نص JSON في الخانة المخفية shary_plan_extras (units.shary_plan_extras) ؛ كل بند مربوط بخطته ببصمتها
 *     (المقدم|القسط|السنين|الدورية) — نفس حسبة App\Shary\PlanExtras::sig / compute.
 */
(function () {
    'use strict';
    var box = document.querySelector('[data-plan-extras]');
    if (!box) return;
    var form = box.closest('form');
    var list = box.querySelector('[data-plan-extras-list]');
    var hidden = box.querySelector('[data-plan-extras-value]');
    if (!form || !list || !hidden) return;
    var T = {};
    try { T = JSON.parse(box.getAttribute('data-labels') || '{}'); } catch (error) { T = {}; }
    var MAX_EXTRA = 5;
    var DEFAULT_MONTHS = { monthly: 1, quarterly: 3, semi_annual: 6, annual: 12 };

    function num(value) {
        var plain = String(value == null ? '' : value).replace(/[,٬\s ]/g, '');
        var n = parseFloat(plain);
        return isFinite(n) && /^-?\d*\.?\d+$/.test(plain) ? n : 0;
    }
    function plain(value) { return String(Math.round(value * 100) / 100); }
    function money(value) { return Math.round(value).toLocaleString('en-US'); }
    function freq(value) { return ({ monthly: 1, quarterly: 1, semi_annual: 1, annual: 1, cash: 1 })[value] ? value : 'quarterly'; }

    // ---- خطط الفورم: الأساسية (خانات الفورم نفسها) + كل صف خطة مضافة (.payment-plan-row)
    var mainState = { downs: [], months: '' };
    var rowState = new WeakMap();
    function field(scope, name, nested) {
        return nested ? scope.querySelector('[name$="[' + name + ']"]') : form.querySelector('[name="' + name + '"]');
    }
    function plans() {
        var out = [{ el: null, state: mainState, nested: false, scope: form }];
        form.querySelectorAll('#payment-plans-container .payment-plan-row').forEach(function (row) {
            if (!rowState.has(row)) rowState.set(row, { downs: [], months: '' });
            out.push({ el: row, state: rowState.get(row), nested: true, scope: row });
        });
        return out;
    }
    function core(plan) {
        var get = function (name) { var input = field(plan.scope, name, plan.nested); return input ? input.value : ''; };
        return { down: num(get('down_payment')), amount: num(get('monthly_amount')), years: num(get('installment_years')), frequency: freq(get('payment_frequency')) };
    }
    function sig(c) { return plain(c.down) + '|' + plain(c.amount) + '|' + plain(c.years) + '|' + c.frequency; }

    function compute(price, downs, amount, years, months) {
        months = Math.max(1, months);
        var down = Math.min(price, downs.reduce(function (a, b) { return a + b; }, 0));
        var rest = Math.max(price - down, 0);
        var periods = years > 0 ? Math.max(1, Math.round(years * 12 / months)) : 0;
        var typed = amount > 0;
        if (!typed && periods > 0 && rest > 0) amount = Math.round(rest / periods);
        var total = typed && periods > 0 ? amount * periods : rest;
        var delivery = rest - total;
        if (delivery < Math.max(1000, price * 0.001)) { delivery = 0; total = rest; }
        return { down: down, periods: periods, amount: amount, total: total, delivery: delivery };
    }

    // ---- القيم المحفوظة ← حالة كل خطة (بالبصمة)
    (function load() {
        var saved = [];
        try { saved = JSON.parse(hidden.value || '[]') || []; } catch (error) { saved = []; }
        if (!Array.isArray(saved)) saved = [];
        plans().forEach(function (plan) {
            var key = sig(core(plan));
            for (var i = 0; i < saved.length; i++) {
                if (saved[i] && saved[i].sig === key) {
                    plan.state.downs = (saved[i].downs || []).map(function (value) { return String(value); });
                    plan.state.months = saved[i].months ? String(saved[i].months) : '';
                    saved.splice(i, 1);
                    break;
                }
            }
        });
    })();

    function serialize() {
        var out = [];
        plans().forEach(function (plan) {
            var c = core(plan);
            if (c.frequency === 'cash') return;
            var downs = plan.state.downs.map(num).filter(function (value) { return value > 0; });
            var months = Math.round(num(plan.state.months));
            if (!downs.length && !(months >= 1)) return;
            out.push({ sig: sig(c), downs: downs, months: months >= 1 ? months : null });
        });
        hidden.value = out.length ? JSON.stringify(out) : '';
    }

    function totals() {
        var price = num((form.querySelector('[name="price"]') || {}).value);
        var all = plans();
        list.querySelectorAll('[data-plan-line]').forEach(function (line, index) {
            var plan = all[index];
            if (!plan) return;
            var c = core(plan);
            var months = Math.round(num(plan.state.months)) || DEFAULT_MONTHS[c.frequency] || 3;
            var downs = [c.down].concat(plan.state.downs.map(num)).filter(function (value) { return value > 0; });
            var r = compute(price, downs, c.amount, c.years, months);
            var cash = c.frequency === 'cash';
            line.classList.toggle('is-cash', cash);
            var set = function (key, text) { var el = line.querySelector('[data-plan-out="' + key + '"]'); if (el) el.textContent = text; };
            set('downs', price > 0 && r.down > 0 ? money(r.down) + ' (' + (Math.round(r.down / price * 1000) / 10) + '%)' : '—');
            set('total', !cash && price > 0 && r.total > 0 ? money(r.total) : '—');
            set('every', !cash && r.amount > 0 && r.periods > 0 ? (T.pays || '').replace(':amount', money(r.amount)).replace(':months', months).replace(':count', r.periods) : '');
            set('delivery', !cash && price > 0 && r.delivery > 0 ? money(r.delivery) : '—');
            var input = line.querySelector('[data-plan-months]');
            if (input) input.placeholder = String(DEFAULT_MONTHS[c.frequency] || 3);
        });
    }

    function el(tag, attrs, text) {
        var node = document.createElement(tag);
        Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
        if (text != null) node.textContent = text;
        return node;
    }

    function render() {
        list.innerHTML = '';
        plans().forEach(function (plan, index) {
            var line = el('div', { 'data-plan-line': String(index), 'class': 'shary-plan-line' });
            line.appendChild(el('strong', { 'class': 'shary-plan-line__title' }, (T.plan || 'Plan') + ' ' + (index + 1) + (index === 0 ? ' — ' + (T.main || '') : '')));
            var grid = el('div', { 'class': 'shary-plan-line__grid' });
            plan.state.downs.forEach(function (value, i) {
                var cell = el('label', { 'class': 'shary-plan-line__cell' });
                cell.appendChild(el('span', {}, (T.down || 'Down payment') + ' ' + (i + 2)));
                var wrap = el('span', { 'class': 'shary-plan-line__input' });
                wrap.appendChild(el('input', { type: 'text', inputmode: 'decimal', dir: 'ltr', 'class': 'form-control', 'data-plan-down': String(i), value: value, placeholder: '0' }));
                wrap.appendChild(el('button', { type: 'button', 'class': 'btn btn-outline-danger btn-sm', 'data-plan-remove': String(i), title: T.remove || '' }, '×'));
                cell.appendChild(wrap);
                grid.appendChild(cell);
            });
            if (plan.state.downs.length < MAX_EXTRA) {
                var add = el('div', { 'class': 'shary-plan-line__cell shary-plan-line__cell--add' });
                add.appendChild(el('span', {}, ' '));
                add.appendChild(el('button', { type: 'button', 'class': 'btn btn-outline-primary btn-sm', 'data-plan-add': '1' }, '+ ' + (T.add || 'Add down payment')));
                grid.appendChild(add);
            }
            var monthsCell = el('label', { 'class': 'shary-plan-line__cell' });
            monthsCell.appendChild(el('span', {}, T.months || 'Months between payments'));
            monthsCell.appendChild(el('input', { type: 'number', min: '1', max: '120', step: '1', dir: 'ltr', 'class': 'form-control', 'data-plan-months': '1', value: plan.state.months }));
            grid.appendChild(monthsCell);
            line.appendChild(grid);
            var auto = el('div', { 'class': 'shary-plan-line__auto' });
            [['downs', T.out_downs], ['total', T.out_total], ['delivery', T.out_delivery]].forEach(function (pair) {
                var item = el('span', {});
                item.appendChild(el('small', {}, pair[1] || pair[0]));
                item.appendChild(el('b', { 'data-plan-out': pair[0], dir: 'ltr' }, '—'));
                auto.appendChild(item);
            });
            line.appendChild(auto);
            line.appendChild(el('small', { 'class': 'shary-plan-line__every', 'data-plan-out': 'every' }, ''));
            line.appendChild(el('small', { 'class': 'shary-plan-line__cashnote' }, T.cash || ''));
            list.appendChild(line);
        });
        totals();
        serialize();
    }

    function planOf(target) {
        var line = target.closest('[data-plan-line]');
        return line ? plans()[parseInt(line.getAttribute('data-plan-line'), 10)] : null;
    }

    list.addEventListener('click', function (event) {
        var plan = planOf(event.target);
        if (!plan) return;
        if (event.target.closest('[data-plan-add]')) { plan.state.downs.push(''); render(); var inputs = list.querySelectorAll('[data-plan-line="' + plans().indexOf(plan) + '"] [data-plan-down]'); if (inputs.length) inputs[inputs.length - 1].focus(); return; }
        var remove = event.target.closest('[data-plan-remove]');
        if (remove) { plan.state.downs.splice(parseInt(remove.getAttribute('data-plan-remove'), 10), 1); render(); }
    });
    list.addEventListener('input', function (event) {
        var plan = planOf(event.target);
        if (!plan) return;
        if (event.target.hasAttribute('data-plan-down')) plan.state.downs[parseInt(event.target.getAttribute('data-plan-down'), 10)] = event.target.value;
        if (event.target.hasAttribute('data-plan-months')) plan.state.months = event.target.value;
        totals();
        serialize();
    });
    // أي تغيير في خانات الخطة نفسها (السعر / المقدم / القسط / السنين / الدورية): الحسابات والبصمة بتتحدّث
    form.addEventListener('input', function (event) { if (!list.contains(event.target)) { totals(); serialize(); } });
    form.addEventListener('change', function (event) { if (!list.contains(event.target)) { totals(); serialize(); } });
    form.addEventListener('submit', serialize, true);
    // زرار الحفظ في الفورم القديم بيبعت بـ AJAX من غير حدث submit: القيمة بتتحدّث مع كل تغيير (فوق) وكمان قبل أي ضغطة على زرار في الفورم
    form.addEventListener('click', function (event) { if (event.target.closest('button, input[type="submit"]') && !list.contains(event.target)) serialize(); }, true);

    // خطة اتضافت أو اتحذفت من الفورم (زرار "إضافة خطة سداد")
    var container = form.querySelector('#payment-plans-container');
    if (container && window.MutationObserver) {
        new MutationObserver(function () { render(); }).observe(container, { childList: true });
    }
    render();
})();
