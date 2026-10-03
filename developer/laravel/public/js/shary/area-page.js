/**
 * صفحة المنطقة:
 * - نوع الوحدة (سكني / تجاري / ...): بيغيّر أرقام المؤشر والمقارنة ونطاق السعر ورسم سعر المتر من غير تحميل الصفحة.
 *   الأرقام جاية من الـ JSON اللي في [data-area-index-data] (بيتكتب من الداتا في الـ Blade).
 * - رسم سعر المتر لآخر 12 شهر: بيترسم من series، وتحريك الماوس أو الإصبع عليه بيعرض سعر كل شهر.
 * - "إزاي اتحسب؟" بيفتح ويقفل تفاصيل المؤشر، وزراير + و − بتكبّر وتصغّر الخريطة.
 * - زرار "قارن" في كارت المشروع: بيتعلّم (aria-pressed) وبيبعت حدث shary:compare ({ active }).
 * - الفلاتر: أي اختيار بيبعت الفورم (GET) عشان الباك إند يرجّع النتايج.
 */
(function () {
    function format(number) {
        return Number(number).toLocaleString('en-US');
    }

    document.querySelectorAll('[data-area-index]').forEach(function (card) {
        var source = card.querySelector('[data-area-index-data]');
        if (!source) return;
        var data;
        try { data = JSON.parse(source.textContent); } catch (error) { return; }

        var plot = card.querySelector('[data-plot]');
        var line = card.querySelector('[data-plot-line]');
        var fill = card.querySelector('[data-plot-area]');
        var cursor = card.querySelector('[data-plot-cursor]');
        var endDot = card.querySelector('[data-plot-end]');
        var endTip = card.querySelector('[data-plot-end-tip]');
        var hoverDot = card.querySelector('[data-plot-dot]');
        var hoverTip = card.querySelector('[data-plot-tip]');
        var table = card.querySelector('[data-plot-table]');
        var values = [];
        var toY = function () { return 0; };

        function draw(series) {
            values = series;
            var min = Math.min.apply(null, series);
            var max = Math.max.apply(null, series);
            var pad = (max - min) * 0.25 || 1;
            var low = min - pad * 0.2;
            toY = function (value) { return 90 - ((value - low) / (max + pad - low)) * 80; };
            var points = series.map(function (value, i) { return (i / (series.length - 1) * 100).toFixed(2) + ',' + toY(value).toFixed(2); });

            line.setAttribute('d', 'M' + points.join('L'));
            fill.setAttribute('d', 'M' + points.join('L') + 'L100,100L0,100Z');
            var last = series[series.length - 1];
            endDot.style.left = '100%';
            endDot.style.top = toY(last) + '%';
            endTip.style.top = toY(last) + '%';
            endTip.textContent = format(last);
            table.innerHTML = '<caption>' + data.caption + '</caption>' + series.map(function (value, i) {
                return '<tr><th>' + data.months[i] + '</th><td>' + format(value) + '</td></tr>';
            }).join('');
        }

        function set(key, value) {
            card.querySelectorAll('[data-k="' + key + '"]').forEach(function (el) { el.textContent = value; });
        }

        function show(typeKey) {
            var type = data.types[typeKey];
            if (!type) return;
            ['price', 'change', 'label', 'demand', 'growth', 'index', 'compare_price', 'compare_diff', 'compare_label', 'range', 'units', 'projects'].forEach(function (key) { set(key, type[key]); });
            var arc = card.querySelector('[data-k-arc]');
            if (arc) arc.setAttribute('stroke-dasharray', (type.index / 100 * 70.7).toFixed(1) + ' 94.2');
            type.bars.forEach(function (value, i) {
                var bar = card.querySelector('[data-bar="' + i + '"]');
                var label = card.querySelector('[data-bar-value="' + i + '"]');
                if (bar) bar.style.width = value + '%';
                if (label) label.textContent = value;
            });
            draw(type.series);
        }

        var buttons = Array.prototype.slice.call(card.querySelectorAll('[data-unit-type]'));
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                buttons.forEach(function (other) { other.setAttribute('aria-pressed', other === button ? 'true' : 'false'); });
                show(button.getAttribute('data-unit-type'));
            });
        });
        var current = card.querySelector('[data-unit-type][aria-pressed="true"]') || buttons[0];
        if (current) show(current.getAttribute('data-unit-type'));

        // سعر كل شهر مع تحريك الماوس أو الإصبع
        if (plot) {
            plot.addEventListener('pointermove', function (event) {
                if (!values.length) return;
                var box = plot.getBoundingClientRect();
                var ratio = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
                var i = Math.round(ratio * (values.length - 1));
                var x = i / (values.length - 1) * 100;
                plot.classList.add('is-active');
                cursor.setAttribute('x1', x);
                cursor.setAttribute('x2', x);
                hoverDot.style.left = x + '%';
                hoverDot.style.top = toY(values[i]) + '%';
                hoverTip.innerHTML = data.months[i] + '<br><b>' + format(values[i]) + '</b> ' + data.perMeter;
                hoverTip.style.left = Math.min(78, Math.max(22, x)) + '%';
            });
            plot.addEventListener('pointerleave', function () { plot.classList.remove('is-active'); });
        }

        var how = card.querySelector('[data-index-how]');
        var bars = card.querySelector('[data-index-bars]');
        if (how && bars) {
            how.addEventListener('click', function () {
                var open = bars.hidden;
                bars.hidden = !open;
                how.setAttribute('aria-expanded', open ? 'true' : 'false');
                var arrow = how.querySelector('svg');
                if (arrow) arrow.style.transform = open ? '' : 'rotate(180deg)';
            });
        }

        var rings = card.querySelector('[data-map-rings]');
        card.querySelectorAll('[data-map-zoom]').forEach(function (button) {
            button.addEventListener('click', function () {
                var zoom = parseFloat(rings.style.getPropertyValue('--zoom') || 1) + Number(button.getAttribute('data-map-zoom')) * 0.2;
                rings.style.setProperty('--zoom', Math.max(0.6, Math.min(1.6, zoom)));
            });
        });
    });



    /**
     * فلاتر المشاريع (areas/partials/filters.blade.php)
     * - [data-sheet-open="اسم"] بيفتح اللوحة [data-filter-sheet="اسم"] (بتطلع من تحت). اللوحات: developer / project / area / price / all (صفحة "تصفية").
     * - "تطبيق" أو "عرض النتائج" [data-sheet-apply]: بيقفل اللوحة ويبعت الفورم. القفل من غير تطبيق بيرجّع الاختيار زي ما كان.
     * - لوحة مفتوحة من جوه صفحة "تصفية" (المنطقة / المطور): "تطبيق" بيرجع للصفحة من غير إرسال، والإرسال من "عرض النتائج".
     * - التبويب (وحدات المطور / إعادة البيع / للإيجار) بيغيّر الاختيارات: أي عنصر عليه data-modes بيظهر مع تبويباته بس، وحدود السعر والمساحة بتتغير من data-bounds.
     * - قبل الإرسال بيطلع حدث shary:filter على الفورم. امنعوه (preventDefault) لو هتجيبوا النتايج AJAX.
     */
    document.querySelectorAll('[data-area-filters]').forEach(function (form) {
        var STEPS = 1000;
        var stack = [];      // اللوحات المفتوحة فوق بعض
        var ranges = {};     // price / size

        function all(selector, root) { return Array.prototype.slice.call((root || form).querySelectorAll(selector)); }
        function sheet(name) { return form.querySelector('[data-filter-sheet="' + name + '"]'); }
        function commas(number) { return String(Math.round(number)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
        function digits(text) { return Number(String(text).replace(/[^\d]/g, '')) || 0; }
        function mode() { var picked = form.querySelector('input[name="offer"]:checked'); return picked ? picked.value : ''; }
        function bounds(range) { return range.bounds[mode()] || range.base; }

        // ---- شريط من–إلى: نفس المدى ممكن يكون مرسوم في أكتر من مكان، وكلهم بيتحركوا مع بعض
        function toValue(range, step) {
            if (step <= 0) return range.min;
            if (step >= STEPS) return range.max;
            if (!range.log) return Math.round(range.min + (range.max - range.min) * step / STEPS);
            var raw = range.min * Math.exp(Math.log(range.max / range.min) * step / STEPS);
            var unit = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10) - 1);
            return Math.round(raw / unit) * unit;
        }
        function toStep(range, value) {
            value = Math.max(range.min, Math.min(range.max, value));
            if (!range.log) return Math.round((value - range.min) / (range.max - range.min) * STEPS);
            return Math.round(Math.log(value / range.min) / Math.log(range.max / range.min) * STEPS);
        }
        function paint(range, skip) {
            var a = toStep(range, range.low);
            var b = toStep(range, range.high);
            range.views.forEach(function (view) {
                if (skip !== view.low) view.low.value = a;
                if (skip !== view.high) view.high.value = b;
                view.fill.style.insetInlineStart = (a / STEPS * 100) + '%';
                view.fill.style.insetInlineEnd = (100 - b / STEPS * 100) + '%';
                if (skip !== view.lowText) view.lowText.value = commas(range.low);
                if (skip !== view.highText) view.highText.value = commas(range.high);
            });
        }
        function commit(range) {
            range.minField.value = range.low > range.min ? range.low : '';
            range.maxField.value = range.high < range.max ? range.high : '';
        }
        function active(range) { return range.low > range.min || range.high < range.max; }

        all('[data-range]').forEach(function (root) {
            var name = root.getAttribute('data-range');
            var range = ranges[name];
            if (!range) {
                var extra = {};
                try { extra = JSON.parse(root.getAttribute('data-bounds') || '{}') || {}; } catch (error) { extra = {}; }
                range = ranges[name] = {
                    base: { min: Number(root.getAttribute('data-min')), max: Number(root.getAttribute('data-max')) }, bounds: Array.isArray(extra) ? {} : extra,
                    log: root.getAttribute('data-scale') === 'log',
                    minField: form.querySelector('[data-range-min="' + name + '"]'), maxField: form.querySelector('[data-range-max="' + name + '"]'), views: []
                };
                range.min = bounds(range).min;
                range.max = bounds(range).max;
                range.low = range.minField.value === '' ? range.min : Number(range.minField.value);
                range.high = range.maxField.value === '' ? range.max : Number(range.maxField.value);
            }
            var view = {
                low: root.querySelector('[data-range-low]'), high: root.querySelector('[data-range-high]'), fill: root.querySelector('[data-range-fill]'),
                lowText: root.querySelector('[data-range-low-text]'), highText: root.querySelector('[data-range-high-text]')
            };
            range.views.push(view);

            view.low.addEventListener('input', function () {
                if (Number(view.low.value) > Number(view.high.value) - 20) view.low.value = Number(view.high.value) - 20;
                range.low = toValue(range, Number(view.low.value));
                view.low.style.zIndex = 3; view.high.style.zIndex = 2;
                paint(range, view.low);
            });
            view.high.addEventListener('input', function () {
                if (Number(view.high.value) < Number(view.low.value) + 20) view.high.value = Number(view.low.value) + 20;
                range.high = toValue(range, Number(view.high.value));
                view.high.style.zIndex = 3; view.low.style.zIndex = 2;
                paint(range, view.high);
            });
            view.lowText.addEventListener('input', function () { view.lowText.value = commas(digits(view.lowText.value)); });
            view.highText.addEventListener('input', function () { view.highText.value = commas(digits(view.highText.value)); });
            view.lowText.addEventListener('change', function () { range.low = Math.max(range.min, Math.min(digits(view.lowText.value), range.high)); paint(range); });
            view.highText.addEventListener('change', function () { range.high = Math.min(range.max, Math.max(digits(view.highText.value) || range.max, range.low)); paint(range); });
        });
        Object.keys(ranges).forEach(function (name) { paint(ranges[name]); });

        // ---- التبويب بيحدد الاختيارات الظاهرة وحدود السعر والمساحة
        function applyMode() {
            var current = mode();
            all('[data-modes]').forEach(function (node) {
                var list = node.getAttribute('data-modes').trim();
                var shown = !list || list.split(' ').indexOf(current) > -1;
                node.classList.toggle('hidden', !shown);
                all('input', node).forEach(function (el) {
                    el.disabled = !shown;
                    if (!shown && (el.type === 'checkbox' || el.type === 'radio')) el.checked = false;
                });
            });
            Object.keys(ranges).forEach(function (name) {
                var range = ranges[name];
                var next = bounds(range);
                if (next.min !== range.min || next.max !== range.max) {
                    range.min = next.min; range.max = next.max;
                    range.low = next.min; range.high = next.max;
                }
                paint(range);
            });
        }
        all('input[name="offer"]').forEach(function (radio) { radio.addEventListener('change', function () { applyMode(); badges(); }); });

        // اختيار واحد ممكن يتشال بالضغط عليه تاني (مفروش / غير مفروش)
        all('[data-toggle-off]').forEach(function (radio) {
            radio.addEventListener('click', function () {
                if (radio.getAttribute('data-was') === '1') radio.checked = false;
                all('input[name="' + radio.name + '"]').forEach(function (other) { other.setAttribute('data-was', other.checked ? '1' : '0'); });
                badges();
            });
            radio.setAttribute('data-was', radio.checked ? '1' : '0');
        });

        // خانات الأرقام (المقدم / القسط): فواصل الآلاف وهو بيكتب
        all('[data-number]').forEach(function (input) {
            input.addEventListener('input', function () { input.value = digits(input.value) ? commas(digits(input.value)) : ''; });
        });

        // ---- حفظ الاختيار وقت الفتح عشان يرجع لو اللوحة اتقفلت من غير تطبيق
        function snapshot(root) {
            return {
                inputs: all('input', root).filter(function (el) { return el.type !== 'range' && el.type !== 'hidden'; }).map(function (el) { return [el, el.checked, el.value]; }),
                ranges: Object.keys(ranges).map(function (name) { return [name, ranges[name].low, ranges[name].high]; })
            };
        }
        function restore(state) {
            state.inputs.forEach(function (item) {
                if (item[0].type === 'checkbox' || item[0].type === 'radio') item[0].checked = item[1];
                else item[0].value = item[2];
            });
            applyMode();
            all('[data-toggle-off]').forEach(function (radio) { radio.setAttribute('data-was', radio.checked ? '1' : '0'); });
            state.ranges.forEach(function (item) { ranges[item[0]].low = item[1]; ranges[item[0]].high = item[2]; paint(ranges[item[0]]); });
        }

        // ---- عدد الاختيارات جنب اسم كل فلتر
        function count(name) {
            if (name === 'price') return ranges.price && active(ranges.price) ? 1 : 0;
            if (name === 'all') {
                var page = sheet('all');
                if (!page) return 0;
                var total = all('input[type="checkbox"]:checked', page).length;
                total += all('[data-number]', page).filter(function (el) { return el.value !== ''; }).length;
                total += all('input[type="radio"]', page).filter(function (el, i) { return el.checked && i > 0; }).length;
                Object.keys(ranges).forEach(function (key) { if (active(ranges[key])) total++; });
                ['area', 'developer'].forEach(function (key) { if (sheet(key)) total += all('input:checked', sheet(key)).length; });
                return total;
            }
            return sheet(name) ? all('input[type="checkbox"]:checked', sheet(name)).length : 0;
        }
        function badges() {
            all('[data-sheet-count]').forEach(function (badge) {
                var name = badge.getAttribute('data-sheet-count');
                var total = count(name);
                badge.textContent = total ? (name === 'price' ? '✓' : total) : '';
                var opener = badge.closest('[data-sheet-open]');
                if (opener) opener.classList.toggle('is-active', total > 0);
            });
        }

        function submit() {
            var go = form.dispatchEvent(new CustomEvent('shary:filter', { bubbles: true, cancelable: true }));
            if (go) form.submit();
        }

        // after: بتتنفذ بعد القفل (وبعد ما تاريخ المتصفح يرجع خطوة) — "عرض النتائج" بتبعت الفورم منها
        function close(keep, after) {
            var top = stack.pop();
            if (!top) { if (after) after(); return; }
            if (!keep) restore(top.saved);
            top.node.classList.add('hidden');
            top.opener.setAttribute('aria-expanded', 'false');
            if (!stack.length) document.documentElement.style.overflow = '';
            badges();
            top.opener.focus({ preventScroll: true });
            if (window.SharyBack) window.SharyBack.closed(after); else if (after) after();
        }

        all('[data-sheet-open]').forEach(function (opener) {
            opener.addEventListener('click', function () {
                var name = opener.getAttribute('data-sheet-open');
                var node = sheet(name);
                if (!node) return;
                closeSort();
                // صفحة "تصفية" بتحفظ الفورم كله، واللوحة الصغيرة بتحفظ اختياراتها بس
                stack.push({ node: node, opener: opener, saved: snapshot(name === 'all' ? form : node) });
                node.classList.remove('hidden');
                opener.setAttribute('aria-expanded', 'true');
                document.documentElement.style.overflow = 'hidden';
                // زرار الرجوع بيقفل اللوحة (زي X) والعميل بيفضل في الصفحة
                if (window.SharyBack) window.SharyBack.opened(function () { close(false); });
            });
        });
        all('[data-sheet-close]').forEach(function (node) { node.addEventListener('click', function () { close(false); }); });
        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') return;
            if (stack.length) close(false); else closeSort();
        });
        all('[data-sheet-apply]').forEach(function (button) {
            button.addEventListener('click', function () {
                Object.keys(ranges).forEach(function (name) { commit(ranges[name]); });
                close(true, function () { if (!stack.length) submit(); });
            });
        });

        // ---- "مسح": لقسم واحد، أو لكل الفلاتر
        function clear(root) {
            all('input', root).forEach(function (el) {
                if (el.type === 'checkbox') el.checked = false;
                else if (el.type === 'radio' && el.name !== 'offer' && el.name !== 'sort') { el.checked = false; el.setAttribute('data-was', '0'); }
                else if (el.type === 'text') el.value = '';
            });
            all('[data-range]', root).forEach(function (node) {
                var range = ranges[node.getAttribute('data-range')];
                range.low = range.min; range.high = range.max; paint(range);
            });
        }
        all('[data-filter-clear]').forEach(function (button) {
            button.addEventListener('click', function () {
                var section = button.closest('[data-filter-section]');
                clear(section);
                (section.getAttribute('data-clears') || '').split(' ').forEach(function (name) { if (name && sheet(name)) clear(sheet(name)); });
                badges();
            });
        });
        all('[data-filter-clear-all]').forEach(function (button) {
            button.addEventListener('click', function () {
                all('[data-filter-sheet]').forEach(function (node) { clear(node); });
                var first = form.querySelector('input[name="offer"]');
                if (first) first.checked = true;
                applyMode();
                badges();
            });
        });
        form.addEventListener('change', function (event) { if (event.target.type === 'checkbox' || event.target.type === 'radio' || event.target.hasAttribute('data-number')) badges(); });

        // ---- الترتيب: قايمة تحت الزرار
        var sortOpen = form.querySelector('[data-sort-open]');
        var sortMenu = form.querySelector('[data-sort-menu]');
        function closeSort() {
            if (!sortMenu || sortMenu.classList.contains('hidden')) return;
            sortMenu.classList.add('hidden');
            sortOpen.setAttribute('aria-expanded', 'false');
        }
        if (sortOpen && sortMenu) {
            sortOpen.addEventListener('click', function () {
                var open = sortMenu.classList.toggle('hidden');
                sortOpen.setAttribute('aria-expanded', open ? 'false' : 'true');
            });
            document.addEventListener('click', function (event) {
                if (!sortMenu.contains(event.target) && !sortOpen.contains(event.target)) closeSort();
            });
            all('input[name="sort"]', sortMenu).forEach(function (radio) {
                radio.addEventListener('change', function () { closeSort(); sortOpen.classList.add('is-active'); submit(); });
            });
        }

        applyMode();
        Object.keys(ranges).forEach(function (name) { commit(ranges[name]); });
        badges();
    });
})();
