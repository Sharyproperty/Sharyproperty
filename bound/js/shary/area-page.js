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

        var trend = card.querySelector('[data-area-trend]');

        function draw(series) {
            // القسم اللي مالوش أرقام شهرية (أقل من شهرين): الرسم بيختفي
            series = Array.isArray(series) ? series : [];
            if (trend) trend.hidden = series.length < 2;
            if (series.length < 2) { values = []; return; }
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
            // مؤشر الطلب: الدايرة (مفتوحة من تحت — القوس 75 من 100) بتتملى على قد الرقم
            if (key === 'demand') card.querySelectorAll('[data-demand-arc]').forEach(function (arc) { arc.setAttribute('stroke-dasharray', (Math.max(0, Math.min(100, parseFloat(value) || 0)) * 0.75).toFixed(1) + ' 100'); });
        }

        function show(typeKey) {
            var type = data.types[typeKey];
            if (!type) return;
            ['price', 'price_range', 'change', 'label', 'demand', 'growth', 'index', 'compare_price', 'compare_range', 'compare_diff', 'compare_label', 'range', 'units', 'projects'].forEach(function (key) { set(key, type[key]); });
            var arc = card.querySelector('[data-k-arc]');
            if (arc) arc.setAttribute('stroke-dasharray', ((parseFloat(type.index) || 0) / 100 * 70.7).toFixed(1) + ' 94.2');
            (type.bars || []).forEach(function (value, i) {
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
                // + و − : الدواير بتبدأ صغيرة وبتكبر لحد 3 مرات
                var zoom = parseFloat(rings.style.getPropertyValue('--zoom') || 1) + Number(button.getAttribute('data-map-zoom')) * 0.35;
                rings.style.setProperty('--zoom', Math.max(0.65, Math.min(3, zoom)));
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
     * - صفحة البحث (search/partials/filters.blade.php):
     *   - الفلاتر السريعة: [data-sheet-open="section" data-sections="bedrooms bathrooms"] بيفتح لوحة من تحت فيها الأقسام دي نفسها
     *     (القسم [data-filter-section][data-key] بيتنقل للّوحة وبيرجع مكانه بعد القفل، فمفيش حقول متكررة). العدد: data-sheet-count="sec:bedrooms bathrooms".
     *   - الفورم اللي عليه data-filter-sidebar: على الديسك توب صفحة "تصفية" بتبقى عمود ثابت جنب النتايج، وأي تغيير فيه بيتبعت لوحده.
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
        function section(key) { return form.querySelector('[data-filter-section][data-key="' + key + '"]'); }
        function count(name) {
            if (name === 'price') return ranges.price && active(ranges.price) ? 1 : 0;
            if (name.indexOf('sec:') === 0) {
                return name.slice(4).split(' ').reduce(function (total, key) {
                    return total + (section(key) ? all('input[type="checkbox"]:checked', section(key)).length : 0);
                }, 0);
            }
            if (name === 'all') {
                var page = sheet('all');
                if (!page) return 0;
                var total = all('input[type="checkbox"]:checked', page).length;
                total += all('[data-number]', page).filter(function (el) { return el.value !== ''; }).length;
                total += all('input[type="radio"]', page).filter(function (el, i) { return el.checked && i > 0; }).length;
                Object.keys(ranges).forEach(function (key) { if (active(ranges[key])) total++; });
                // لوحات الاختيار اللي بتتفتح من جوه الصفحة (في صفحة البحث: المشروع كمان)
                ['area', 'developer'].concat(form.hasAttribute('data-filter-sidebar') ? ['project'] : []).forEach(function (key) { if (sheet(key)) total += all('input:checked', sheet(key)).length; });
                return total;
            }
            return sheet(name) ? all('input[type="checkbox"]:checked', sheet(name)).length : 0;
        }
        // ---- الفلتر الذكي: المنطقة ← المطور ← المشروع. الصف اللي مش مرتبط بالمختار بيختفي (is-unrelated) ولو كان متعلّم بيتشال اختياره.
        //      المطور: data-areas = مناطق مشاريعه. المشروع: data-developer + data-areas. من غير الخصائص دي القايمة بتفضل كاملة.
        function relate() {
            function picked(name) { return all('input[name="' + name + '[]"]:checked').map(function (box) { return box.value; }); }
            function rows(name) { var body = form.querySelector('[data-list-body="' + name + '"]'); return body ? Array.prototype.slice.call(body.querySelectorAll('label')) : []; }
            function inAreas(row, areas) {
                if (!areas.length || !row.hasAttribute('data-areas')) return true;
                var own = row.getAttribute('data-areas').split(' ');
                return areas.some(function (slug) { return own.indexOf(slug) !== -1; });
            }
            function set(row, ok) {
                row.classList.toggle('is-unrelated', !ok);
                var box = row.querySelector('input[type="checkbox"]');
                if (!ok && box && box.checked) box.checked = false;
            }
            var areas = picked('area');
            rows('developer').forEach(function (row) { set(row, inAreas(row, areas)); });
            var developers = picked('developer');
            rows('project').forEach(function (row) {
                set(row, inAreas(row, areas) && (!developers.length || !row.hasAttribute('data-developer') || developers.indexOf(row.getAttribute('data-developer')) !== -1));
            });
        }

        function badges() {
            relate();
            // شريط "الأسعار حسب الفلاتر اللي اخترتها" (صفحة البحث): ظاهر طول ما فيه فلتر مختار
            var notice = form.querySelector('[data-filter-notice]');
            if (notice) notice.classList.toggle('hidden', count('all') === 0);
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
            // الأقسام اللي اتنقلت للّوحة بترجع مكانها في صفحة "تصفية"
            (top.moved || []).forEach(function (item) { item.marker.parentNode.insertBefore(item.node, item.marker); item.marker.parentNode.removeChild(item.marker); });
            // لوحة المنطقة / المطور: البحث بيتمسح والقايمة بترجع لعمود الفلاتر (ديسك توب)
            resetListSearch(top.node);
            placeLists();
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
                var moved = [];
                if (name === 'section') {
                    var body = node.querySelector('[data-section-body]');
                    (opener.getAttribute('data-sections') || '').split(' ').forEach(function (key) {
                        var part = key && section(key);
                        if (!part || !body) return;
                        var marker = document.createComment('section ' + key);
                        part.parentNode.insertBefore(marker, part);
                        body.appendChild(part);
                        moved.push({ node: part, marker: marker });
                    });
                    if (!moved.length) return;
                }
                // لوحة المنطقة / المطور: القايمة بترجع جوه اللوحة (لو كانت معروضة في عمود الفلاتر) قبل ما نحفظ الاختيار
                var listBody = form.querySelector('[data-list-body="' + name + '"]');
                var listHome = node.querySelector('[data-list-home]');
                if (listBody && listHome && listBody.parentNode !== listHome) listHome.appendChild(listBody);
                // صفحة "تصفية" بتحفظ الفورم كله، واللوحة الصغيرة بتحفظ اختياراتها بس
                stack.push({ node: node, opener: opener, moved: moved, saved: snapshot(name === 'all' ? form : node) });
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
        // ---- "عرض النتائج" على الموبايل: لو نوع البيع اللي اتختار ليه صفحة تانية (data-offer-urls — ListingPage::offerUrls) بتتفتح هي بنفس الاختيارات:
        //      للإيجار ← صفحة الإيجار ، إعادة البيع ← صفحة إعادة البيع ، وحدات المطور ← صفحة البحث. الديسك توب (عمود الفلاتر) بيفلتر مكانه زي ما هو.
        function offerPage() {
            if (form.closest('[data-home-filter]') || wide()) return false;   // نافذة الفلتر بره صفحة البحث: js/shary/filter-window.js
            var urls = {};
            try { urls = JSON.parse(form.getAttribute('data-offer-urls') || '{}') || {}; } catch (error) { urls = {}; }
            var offer = mode();
            if (!offer || !urls[offer]) return false;
            var next = new URL(urls[offer], window.location.href);
            var plain = function (value) { try { return decodeURIComponent(value).replace(/\/+$/, ''); } catch (error) { return value.replace(/\/+$/, ''); } };
            if (plain(next.pathname) === plain(window.location.pathname)) return false;   // نفس الصفحة: الفلتر العادي
            new FormData(form).forEach(function (value, name) {
                if (typeof value !== 'string' || value === '' || name === 'page' || name === 'view') return;
                if (name === 'offer' && offer === 'rent') return;   // صفحة الإيجار كلها إيجار — إعادة البيع بتاخد offer=resale مع باقي الفلاتر
                next.searchParams.append(name, value);
            });
            window.location.href = next.toString();
            return true;
        }
        all('[data-sheet-apply]').forEach(function (button) {
            button.addEventListener('click', function () {
                Object.keys(ranges).forEach(function (name) { commit(ranges[name]); });
                close(true, function () { if (!stack.length && !offerPage()) submit(); });
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
                all('[data-default-radio]').forEach(function (radio) { radio.checked = true; });   // تبويب الصفحة يرجع لـ "الكل"
                applyMode();
                badges();
                // "مسح الفلاتر" اللي بره اللوحات (فوق النتايج) بيمسح ويبعت على طول
                if (!button.closest('[data-filter-sheet]')) {
                    Object.keys(ranges).forEach(function (name) { commit(ranges[name]); });
                    submit();
                }
            });
        });
        form.addEventListener('change', function (event) { if (event.target.type === 'checkbox' || event.target.type === 'radio' || event.target.hasAttribute('data-number')) badges(); });

        // ---- خانة البحث (Enter): نفس طريق "عرض النتائج"
        form.addEventListener('submit', function (event) { event.preventDefault(); submit(); });

        // ---- عمود الفلاتر الثابت (ديسك توب): أي تغيير بيتبعت لوحده بعد لحظة
        var sidebar = form.hasAttribute('data-filter-sidebar');
        var applyTimer = null;
        // عمود الفلاتر شغال لما الـ CSS يخلّي صفحة "تصفية" جزء من الصفحة (ديسك توب) بدل اللوحة اللي بتغطي الشاشة (موبايل)
        function wide() { var page = sheet('all'); return !!page && window.getComputedStyle(page).position !== 'fixed'; }

        // المنطقة / المطور: القايمة بتتعرض جوه العمود على الديسك توب، وبترجع للوحة الاختيار على الموبايل
        function placeLists() {
            all('[data-inline-list]').forEach(function (slot) {
                var name = slot.getAttribute('data-inline-list');
                var body = form.querySelector('[data-list-body="' + name + '"]');
                var home = sheet(name) && sheet(name).querySelector('[data-list-home]');
                if (!body || !home || !sheet(name).classList.contains('hidden')) return;   // اللوحة مفتوحة: القايمة بتفضل جواها
                var target = wide() ? slot : home;
                if (body.parentNode !== target) target.appendChild(body);
                // في العمود: المختار بيتعرض الأول (أول 3 بس ظاهرين، والباقي من "عرض المزيد")
                if (target === slot) {
                    Array.prototype.slice.call(body.children).filter(function (row) { var box = row.querySelector('input'); return box && box.checked; })
                        .reverse().forEach(function (row) { body.insertBefore(row, body.firstChild); });
                }
                var more = slot.parentNode.querySelector('[data-list-more]');
                if (more) more.classList.toggle('hidden', body.children.length <= 3);
            });
        }

        // خانة البحث جوه لوحة الاختيار: بتفلتر الصفوف بالاسم
        // (الهمزات والتاء المربوطة والألف المقصورة والتشكيل بيتوحّدوا: "اعمار" بتلقط "إعمار" ، "مدينه" بتلقط "مدينة")
        function plainText(value) {
            return String(value || '').toLowerCase().replace(/[\u064B-\u0652\u0640]/g, '').replace(/[\u0623\u0625\u0622]/g, '\u0627').replace(/\u0629/g, '\u0647').replace(/\u0649/g, '\u064A').replace(/\s+/g, ' ').trim();
        }
        all('[data-list-search]').forEach(function (input) {
            input.addEventListener('input', function () {
                var words = plainText(input.value);
                all('label', input.closest('[data-filter-sheet]').querySelector('[data-list-body]') || input.closest('[data-filter-sheet]')).forEach(function (row) {
                    row.classList.toggle('hidden', words !== '' && plainText(row.textContent).indexOf(words) === -1);
                });
            });
            input.addEventListener('keydown', function (event) { if (event.key === 'Enter') event.preventDefault(); });
        });
        function resetListSearch(node) {
            var input = node.querySelector('[data-list-search]');
            if (!input) return;
            input.value = '';
            all('label.hidden', node).forEach(function (row) { row.classList.remove('hidden'); });
        }
        function autoApply() {
            if (!sidebar || !wide() || stack.length) return;
            clearTimeout(applyTimer);
            applyTimer = setTimeout(function () {
                Object.keys(ranges).forEach(function (name) { commit(ranges[name]); });
                badges();
                submit();
            }, 450);
        }
        if (sidebar) {
            placeLists();
            var resizeTimer = null;
            window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(placeLists, 120); });
            form.addEventListener('change', function (event) {
                var page = sheet('all');
                if (page && page.contains(event.target) && event.target.name !== 'sort') autoApply();
            });
            all('[data-filter-clear], [data-filter-clear-all]').forEach(function (button) { button.addEventListener('click', autoApply); });
        }

        // ---- ديسك توب: إخفاء / إظهار عمود الفلاتر [data-side-toggle] — النتايج بتاخد عرض الصفحة كله والاختيار بيتحفظ طول الزيارة
        var layout = form.closest('.search-layout');
        if (sidebar && layout) {
            var setSide = function (hidden) {
                layout.classList.toggle('is-side-hidden', hidden);
                all('[data-side-toggle]').forEach(function (button) { button.setAttribute('aria-expanded', hidden ? 'false' : 'true'); });
                try { window.sessionStorage.setItem('shary-side-hidden', hidden ? '1' : ''); } catch (error) { /* التخزين مقفول */ }
            };
            all('[data-side-toggle]').forEach(function (button) {
                button.addEventListener('click', function () { setSide(!layout.classList.contains('is-side-hidden')); });
            });
            try { if (window.sessionStorage.getItem('shary-side-hidden') === '1') setSide(true); } catch (error) { /* التخزين مقفول */ }
        }

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

        // اختيارات على الصفحة نفسها بتتبعت أول ما تتغير (تبويب الفرش في صفحة الإيجار)
        all('[data-submit-on-change]').forEach(function (input) { input.addEventListener('change', submit); });

        applyMode();
        Object.keys(ranges).forEach(function (name) { commit(ranges[name]); });
        badges();
    });
    // العروض: "عرض الكل" بيفرد كل العروض تحت بعض (زي قايمة بتتفتح)، و"عرض أقل" بيرجّع أول 3
    document.querySelectorAll('[data-offers]').forEach(function (section) {
        var toggle = section.querySelector('[data-offers-toggle]');
        var list = section.querySelector('[data-offers-list]');
        if (!toggle || !list) return;
        toggle.addEventListener('click', function () {
            var open = !list.classList.contains('is-open');
            list.classList.toggle('is-open', open);
            list.scrollLeft = 0;
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.querySelector('[data-label]').textContent = toggle.getAttribute(open ? 'data-less' : 'data-more');
            toggle.querySelector('svg').style.transform = open ? 'rotate(180deg)' : '';
            if (!open) section.scrollIntoView({ block: 'nearest' });
        });
    });
    // خريطة جوجل جوه كارت المؤشر: بتتحمل أول ما الكارت يظهر على الشاشة، وزرار السهمين بيكبّرها جوه نفس الصفحة ويرجّعها
    // لو الصفحة مفتوحة في مكان بيمنع تضمين خرائط جوجل (سياسة أمان الصفحة): الخريطة المرسومة بتفضل ظاهرة بدل مربع فاضي
    document.addEventListener('securitypolicyviolation', function (e) {
        if (String(e.violatedDirective || '').indexOf('frame') !== 0) return;
        document.querySelectorAll('[data-map-frame]').forEach(function (frame) {
            var box = frame.parentNode;
            box.classList.remove('is-live', 'is-expanded');
            box.classList.add('is-blocked');
            frame.hidden = true;
            var expand = box.querySelector('[data-map-expand]');
            if (expand) expand.hidden = true;
        });
    });

    document.querySelectorAll('[data-map-frame]').forEach(function (frame) {
        var box = frame.parentNode;
        function load() {
            if (frame.getAttribute('src') || box.classList.contains('is-blocked')) return;
            frame.addEventListener('load', function () { if (!box.classList.contains('is-blocked')) box.classList.add('is-live'); });
            frame.setAttribute('src', frame.getAttribute('data-src'));
        }
        // الخريطة تقيلة: بتتحمل بعد ما الصفحة نفسها تخلص تحميل، ولما الكارت يقرّب يظهر على الشاشة
        function watch() {
            if ('IntersectionObserver' in window) {
                var seen = new IntersectionObserver(function (entries) {
                    if (entries[0].isIntersecting) { load(); seen.disconnect(); }
                }, { rootMargin: '200px' });
                seen.observe(box);
            } else {
                load();
            }
        }
        if (document.readyState === 'complete') watch(); else window.addEventListener('load', function () { setTimeout(watch, 300); });
        var expand = box.querySelector('[data-map-expand]');
        if (!expand) return;
        function setOpen(open) {
            if (open) load();
            box.classList.toggle('is-expanded', open);
            document.documentElement.style.overflow = open ? 'hidden' : '';
            expand.setAttribute('aria-expanded', open ? 'true' : 'false');
            expand.setAttribute('aria-label', expand.getAttribute(open ? 'data-close' : 'data-expand'));
            if (open) load();
        }
        expand.addEventListener('click', function () { setOpen(!box.classList.contains('is-expanded')); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('is-expanded')) setOpen(false); });
    });
})();
