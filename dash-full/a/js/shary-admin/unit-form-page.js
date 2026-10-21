(function () {
    var form = document.querySelector('[data-unit-form]');
    if (!form) { return; }

    function type() {
        var checked = form.querySelector('[data-unit-type]:checked');
        var rent = checked && checked.value === 'rent';
        form.querySelectorAll('[data-unit-when]').forEach(function (el) { el.style.display = (el.getAttribute('data-unit-when') === 'rent') === rent ? '' : 'none'; });
        var resale = checked && checked.value === 'resale';
        form.querySelectorAll('[data-unit-sale]').forEach(function (el) {
            var show = (el.getAttribute('data-unit-sale') === 'resale') === resale;
            if (el.hasAttribute('data-unit-when') && rent) { show = false; }
            el.style.display = show ? '' : 'none';
        });
    }
    var pay = form.querySelector('[data-resale-pay]');
    var frequency = form.querySelector('[data-plan-frequency]');
    function show() {
        var checked = form.querySelector('[data-unit-type]:checked');
        var current = checked ? checked.value : 'developer_sale';
        form.querySelectorAll('[data-unit-show]').forEach(function (el) {
            el.style.display = (' ' + el.getAttribute('data-unit-show') + ' ').indexOf(' ' + current + ' ') > -1 ? '' : 'none';
        });
        var fields = form.querySelector('[data-plan-fields]');
        if (fields) { fields.style.display = current === 'resale' && pay && pay.value === 'cash' ? 'none' : ''; }
        if (frequency) {
            var cash = frequency.querySelector('option[value="cash"]');
            if (cash) { cash.hidden = current === 'resale'; cash.disabled = current === 'resale'; }
            if (current === 'resale' && frequency.value === 'cash') { frequency.value = 'quarterly'; }
        }
    }
    form.querySelectorAll('[data-unit-type]').forEach(function (radio) { radio.addEventListener('change', function () { type(); show(); }); });
    if (pay) { pay.addEventListener('change', show); }
    type();
    show();

    var price = form.querySelector('[name="price"]');
    var amount = form.querySelector('[data-down-amount]');
    var percent = form.querySelector('[data-down-percent]');
    function toPercent() { var p = parseFloat(price && price.value), a = parseFloat(amount && amount.value), r = p > 0 && a >= 0 && !isNaN(a) ? Math.round(a / p * 1000) / 10 : NaN; percent.value = r >= 0 && r <= 100 ? r : ''; }
    function toAmount() { var p = parseFloat(price && price.value), r = parseFloat(percent.value); if (p > 0 && r >= 0) { amount.value = Math.round(p * r / 100); } }
    if (price && amount && percent) {
        toPercent();
        amount.addEventListener('input', toPercent);
        price.addEventListener('input', toPercent);
        percent.addEventListener('input', toAmount);
    }

    var plans = form.querySelector('[data-more-plans]');
    if (plans) {
        var rows = plans.querySelector('[data-more-plans-rows]');
        var template = plans.querySelector('[data-more-plans-template]');
        var next = rows.children.length;
        plans.querySelector('[data-more-plans-add]').addEventListener('click', function () {
            if (rows.children.length >= 6) { return; }
            var holder = document.createElement('div');
            holder.innerHTML = template.innerHTML.replace(/__IDX__/g, String(next++));
            rows.appendChild(holder.firstElementChild);
            number();
        });
        rows.addEventListener('click', function (event) {
            var remove = event.target.closest && event.target.closest('[data-more-plan-remove]');
            if (remove) { remove.closest('[data-more-plan]').remove(); number(); }
        });
        function number() { Array.prototype.forEach.call(rows.children, function (row, i) { var title = row.querySelector('[data-more-plan-title]'); if (title) { title.textContent = title.getAttribute('data-label').replace(':n', i + 2); } }); }
        number();
    }

    var project = form.querySelector('[data-unit-project]');
    function fill() {
        var option = project.options[project.selectedIndex];
        if (!option || !option.value) { return; }
        [['[data-unit-area]', option.getAttribute('data-area')], ['[data-unit-developer]', option.getAttribute('data-developer')]].forEach(function (pair) {
            var select = form.querySelector(pair[0]);
            if (select && pair[1] && select.querySelector('option[value="' + pair[1] + '"]')) {
                select.value = pair[1];
                if (window.jQuery) { window.jQuery(select).trigger('change.select2'); }
            }
        });
    }
    if (project) {
        project.addEventListener('change', fill);
        if (window.jQuery) { window.jQuery(project).on('select2:select', fill); }
    }
})();
