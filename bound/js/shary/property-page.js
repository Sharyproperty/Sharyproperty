/**
 * صفحة الوحدة (units/show.blade.php) وصفحة المشروع (projects/show.blade.php):
 *
 * - مؤشرات الاستثمار [data-insights] (property/partials/insights.blade.php):
 *   البيانات في <script type="application/json" data-insight-data> بنفس شكل $insights.
 *   التبويب [data-insight-tab="unfinished | finished"] بيبدّل الرسم وأرقام الإيجار وإعادة البيع
 *   ([data-insight="monthly | yield | after | profit"]) من غير تحميل.
 *   الرسم [data-insight-chart] (زي التطبيق): خطين ناعمين (بعد الاستلام / سعر السوق)، وعلى كل خط سنة معلّمة بعمود ملوّن وقيمتها بالمليون:
 *   sets[..].delivery = سنة الاستلام على خط "بعد الاستلام" ، sets[..].market_mark = السنة المعلّمة على خط "سعر السوق" (اختياري).
 *   الماوس أو الصباع على الرسم بيظهر أرقام السنة.
 *   الجدول [data-insight-table] (sr-only) بيتحدّث مع التبويب لقارئ الشاشة.
 *   لو البيانات اتغيرت بعد التحميل: window.SharyProperty.refresh(root) بيعيد قراية البيانات ويرسم من جديد.
 *
 * - شريط الملخص [data-prop-bar] (property/partials/summary-bar.blade.php): بيفضل ثابت تحت الهيدر وأنت نازل.
 *   ديسك توب: الشريط كله. موبايل: سطر الاسم المصغّر [data-bar-mini] (لوجو + اسم + مطور / مشروع) وتحته سطر السعر (.prop-bar__prices) — السكربت بيحسب المكان من ارتفاع الهيدر. وهو ثابت بياخد class="is-stuck".
 *
 * - المعرض [data-gallery-slider] (partials/photo-gallery.blade.php مع slider): على الموبايل صورة واحدة بتتسحب بالجنب وتحتها نقط.
 *   الصور بتتقلّب لوحدها كل 4.5 ثانية (موبايل وديسك توب)، وبتقف وقت ما العميل ماسكها أو عارض الصور مفتوح.
 *
 * - وحدات المشروع [data-project-units] (data-per-page = عدد الكروت في الصفحة على الديسك توب):
 *   كل كروت المشروع [data-unit] موجودة في [data-project-grid]، وعلى كل كارت: data-sale ، data-invest ، data-types ، data-beds ، data-baths ، data-size ،
 *   data-finishing ، data-delivery ، data-years ، data-price ، data-installment ، data-order.
 *   التبويب [data-unit-tab=" | developer | resale | invest"] بيظهر كروت النوع ده بس.
 *   "تصفية" والترتيب: نفس فورم فلاتر الموقع (areas/partials/filters.blade.php مع projectFilters) — صفحة الفلاتر بتفتح من js/shary/area-page.js،
 *   و"عرض النتائج" بيفلتر كروت الصفحة هنا من غير تحميل (type[] ، bedrooms[] ، bathrooms[] ، finishing[] ، delivery[] ، years[] ، السعر ، المساحة ، sort).
 *   من غير أرقام صفحات ولا "عرض المزيد" — الوحدات بتكمّل لوحدها وأنت نازل ([data-units-sentinel]):
 *   موبايل: 3 كروت في المرة. ديسك توب: صفحة كاملة (data-per-page = 9) في المرة.
 *   حدث shary:project-units ({ tab, sort, filters, url }) قبل التبديل: امنعوه (preventDefault) لو هتجيبوا الكروت من السيرفر بطريقتكم،
 *   وبعد ما تحطوا الكروت الجديدة في [data-project-grid] نادوا section.__renderUnits().
 */
(function () {
    var UNIT_COLOR = '#2A9D8F';     // بعد الاستلام
    var MARKET_COLOR = '#E9A23B';   // سعر السوق
    var INK = '#123A5C';
    var MUTED = '#5B6B7C';
    var GRID = '#E4E9EF';
    var NS = 'http://www.w3.org/2000/svg';

    function el(name, attrs, parent) {
        var node = document.createElementNS(NS, name);
        Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
        if (parent) parent.appendChild(node);
        return node;
    }

    function money(value) {
        return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function millions(value) {
        return (Math.round(value / 100000) / 10).toFixed(1);
    }

    // أرقام محور السعر: 4 خطوط بفرق "مريح" (0.5 / 1 / 2 / 5 مليون ...)
    function ticks(min, max) {
        var span = Math.max(max - min, 1);
        var raw = span / 4;
        var pow = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10));
        var step = [1, 2, 2.5, 5, 10].map(function (m) { return m * pow; }).filter(function (s) { return s >= raw; })[0];
        var from = Math.floor(min / step) * step;
        var out = [];
        for (var v = from; v < max + step; v += step) out.push(v);
        return out;
    }

    // خط ناعم بيعدّي على كل النقط من غير ما يطلع أو ينزل عن قيمها (monotone cubic)
    function smooth(points) {
        var n = points.length;
        if (n < 3) return points.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
        var slopes = [], tangents = [], i;
        for (i = 0; i < n - 1; i++) slopes.push((points[i + 1][1] - points[i][1]) / (points[i + 1][0] - points[i][0]));
        tangents.push(slopes[0]);
        for (i = 1; i < n - 1; i++) tangents.push(slopes[i - 1] * slopes[i] <= 0 ? 0 : (slopes[i - 1] + slopes[i]) / 2);
        tangents.push(slopes[n - 2]);
        for (i = 0; i < n - 1; i++) {
            if (slopes[i] === 0) { tangents[i] = 0; tangents[i + 1] = 0; continue; }
            var a = tangents[i] / slopes[i], b = tangents[i + 1] / slopes[i], h = a * a + b * b;
            if (h > 9) { var t = 3 / Math.sqrt(h); tangents[i] = t * a * slopes[i]; tangents[i + 1] = t * b * slopes[i]; }
        }
        var d = 'M' + points[0][0].toFixed(1) + ' ' + points[0][1].toFixed(1);
        for (i = 0; i < n - 1; i++) {
            var dx = (points[i + 1][0] - points[i][0]) / 3;
            d += ' C' + (points[i][0] + dx).toFixed(1) + ' ' + (points[i][1] + tangents[i] * dx).toFixed(1) + ' ' +
                (points[i + 1][0] - dx).toFixed(1) + ' ' + (points[i + 1][1] - tangents[i + 1] * dx).toFixed(1) + ' ' +
                points[i + 1][0].toFixed(1) + ' ' + points[i + 1][1].toFixed(1);
        }
        return d;
    }

    function draw(section) {
        var state = section.__insights;
        var box = section.querySelector('[data-insight-chart]');
        if (!state || !box) return;
        var set = state.data.sets[state.tab];
        var years = state.data.years;
        if (!set || !years || !years.length) return;
        var width = Math.round(box.clientWidth);
        if (!width) return;   // الصفحة مخفية دلوقتي — هيترسم أول ما تظهر
        var height = width < 480 ? 230 : 280;
        var pad = { top: 34, right: 18, bottom: 32, left: 34 };
        var all = set.unit.concat(set.market);
        var scale = ticks(Math.min.apply(null, all), Math.max.apply(null, all));
        var low = scale[0], high = scale[scale.length - 1];
        var plotW = width - pad.left - pad.right;
        var plotH = height - pad.top - pad.bottom;
        var floor = height - pad.bottom;
        var last = years.length - 1;
        function x(i) { return pad.left + (last > 0 ? plotW * i / last : plotW / 2); }
        function y(v) { return pad.top + plotH * (1 - (v - low) / (high - low)); }
        function line(values) { return smooth(values.map(function (v, i) { return [x(i), y(v)]; })); }
        function clamp(i) { return Math.max(0, Math.min(last, i)); }

        box.textContent = '';
        var svg = el('svg', { viewBox: '0 0 ' + width + ' ' + height, width: width, height: height, role: 'img', 'aria-label': box.getAttribute('data-alt') || '' }, box);
        var defs = el('defs', {}, svg);
        function gradient(name, color, from, to) {
            var id = 'prop-' + name + '-' + state.id;
            var grad = el('linearGradient', { id: id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
            el('stop', { offset: '0', 'stop-color': color, 'stop-opacity': from }, grad);
            el('stop', { offset: '1', 'stop-color': color, 'stop-opacity': to }, grad);
            return 'url(#' + id + ')';
        }
        var areaFill = gradient('area', UNIT_COLOR, 0.16, 0);
        var unitBar = gradient('unit', UNIT_COLOR, 0.08, 0.6);
        var marketBar = gradient('market', MARKET_COLOR, 0.08, 0.6);

        // السنة المعلّمة على كل خط: الاستلام على خط "بعد الاستلام" ، و market_mark على خط "سعر السوق"
        var d = clamp(set.delivery);
        var marks = [{ at: d, value: set.unit[d], color: UNIT_COLOR, bar: unitBar, ink: '#1F7F72' }];
        if (set.market_mark != null && clamp(set.market_mark) !== d) {
            var m = clamp(set.market_mark);
            marks.unshift({ at: m, value: set.market[m], color: MARKET_COLOR, bar: marketBar, ink: '#B7770D' });
        }

        // خطوط المحور وأرقامه (مليون)
        scale.forEach(function (v) {
            el('line', { x1: pad.left, x2: width - pad.right, y1: y(v), y2: y(v), stroke: GRID, 'stroke-width': 1 }, svg);
            var label = el('text', { x: pad.left - 8, y: y(v) + 4, 'text-anchor': 'end', 'font-size': 11, 'font-weight': 600, fill: MUTED }, svg);
            label.textContent = millions(v).replace(/\.0$/, '');
        });

        // العمود الملوّن تحت كل نقطة معلّمة + مربع سنتها على المحور
        marks.forEach(function (mark) {
            el('rect', { x: x(mark.at) - 12, y: y(mark.value), width: 24, height: floor - y(mark.value), fill: mark.bar, rx: 3 }, svg);
            el('rect', { x: x(mark.at) - 17, y: floor + 5, width: 34, height: 19, rx: 5, fill: mark.color, opacity: 0.22 }, svg);
        });
        years.forEach(function (year, i) {
            var marked = marks.some(function (mark) { return mark.at === i; });
            var label = el('text', { x: x(i), y: floor + 18.5, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': marked ? 800 : 600, fill: marked ? INK : MUTED }, svg);
            label.textContent = !marked && width < 360 && i % 2 ? '' : year;
        });

        // المساحة تحت خط "بعد الاستلام" + الخطين
        el('path', { d: line(set.unit) + ' L' + x(last).toFixed(1) + ' ' + floor + ' L' + x(0).toFixed(1) + ' ' + floor + ' Z', fill: areaFill }, svg);
        el('path', { d: line(set.market), fill: 'none', stroke: MARKET_COLOR, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
        el('path', { d: line(set.unit), fill: 'none', stroke: UNIT_COLOR, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);

        // النقطة المعلّمة: خط رأسي + نقطة + القيمة بالمليون جنبها
        marks.forEach(function (mark) {
            var px = x(mark.at), py = y(mark.value);
            el('line', { x1: px, x2: px, y1: py, y2: floor, stroke: INK, 'stroke-width': 1.5 }, svg);
            el('circle', { cx: px, cy: py, r: 5, fill: INK, stroke: '#fff', 'stroke-width': 2 }, svg);
            var text = millions(mark.value);
            var w = text.length * 7.2 + 14;
            var left = px - 10 - w >= pad.left;   // القيمة على شمال النقطة، ولو مفيش مكان تبقى على يمينها
            var bx = left ? px - 10 - w : px + 10;
            var by = Math.max(4, py - 24);
            el('rect', { x: bx, y: by, width: w, height: 20, rx: 6, fill: '#fff', stroke: mark.color, 'stroke-width': 1 }, svg);
            var label = el('text', { x: bx + w / 2, y: by + 14, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: mark.ink }, svg);
            label.textContent = text;
        });
        // اسم علامة الاستلام فوق عمودها
        var caption = el('text', { x: x(d), y: 12, 'text-anchor': d === 0 ? 'start' : d === last ? 'end' : 'middle', 'font-size': 11, 'font-weight': 700, fill: MUTED }, svg);
        caption.textContent = box.getAttribute('data-label-delivery') || '';

        // الماوس / الصباع: خط رأسي + نقطتين + كارت فيه أرقام السنة
        var cross = el('line', { y1: pad.top - 6, y2: floor, stroke: INK, 'stroke-width': 1, opacity: 0 }, svg);
        var dotUnit = el('circle', { r: 5, fill: UNIT_COLOR, stroke: '#fff', 'stroke-width': 2, opacity: 0 }, svg);
        var dotMarket = el('circle', { r: 5, fill: MARKET_COLOR, stroke: '#fff', 'stroke-width': 2, opacity: 0 }, svg);
        var tip = document.createElement('div');
        tip.className = 'prop-chart__tip';
        tip.hidden = true;
        var page = box.parentNode.closest ? box.parentNode.closest('[dir]') : null;
        tip.setAttribute('dir', page ? page.getAttribute('dir') : 'ltr');
        box.appendChild(tip);
        var egp = box.getAttribute('data-label-egp') || '';

        function row(color, name, value) {
            var line = document.createElement('p');
            var key = document.createElement('i');
            key.style.backgroundColor = color;
            var text = document.createElement('span');
            text.textContent = name;
            var number = document.createElement('b');
            number.setAttribute('dir', 'ltr');
            number.textContent = money(value);
            var unit = document.createElement('small');
            unit.textContent = egp;
            line.appendChild(key); line.appendChild(text); line.appendChild(number); line.appendChild(unit);
            return line;
        }

        function show(i) {
            cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.setAttribute('opacity', 0.35);
            dotUnit.setAttribute('cx', x(i)); dotUnit.setAttribute('cy', y(set.unit[i])); dotUnit.setAttribute('opacity', 1);
            dotMarket.setAttribute('cx', x(i)); dotMarket.setAttribute('cy', y(set.market[i])); dotMarket.setAttribute('opacity', 1);
            tip.textContent = '';
            var head = document.createElement('strong');
            head.textContent = years[i] + (i === d ? ' · ' + (box.getAttribute('data-label-delivery') || '') : '');
            tip.appendChild(head);
            tip.appendChild(row(UNIT_COLOR, box.getAttribute('data-label-unit') || '', set.unit[i]));
            tip.appendChild(row(MARKET_COLOR, box.getAttribute('data-label-market') || '', set.market[i]));
            tip.hidden = false;
            var half = tip.offsetWidth / 2;
            tip.style.left = Math.max(half, Math.min(width - half, x(i))) + 'px';
            tip.style.top = Math.max(0, Math.min(y(set.unit[i]), y(set.market[i])) - tip.offsetHeight - 12) + 'px';
        }
        function hide() {
            cross.setAttribute('opacity', 0); dotUnit.setAttribute('opacity', 0); dotMarket.setAttribute('opacity', 0);
            tip.hidden = true;
        }
        function at(event) {
            var rect = svg.getBoundingClientRect();
            var point = event.touches ? event.touches[0] : event;
            var ratio = (point.clientX - rect.left - pad.left) / plotW;
            show(clamp(Math.round(ratio * last)));
        }
        svg.addEventListener('mousemove', at);
        svg.addEventListener('mouseleave', hide);
        svg.addEventListener('touchstart', at, { passive: true });
        svg.addEventListener('touchmove', at, { passive: true });
        svg.addEventListener('touchend', function () { setTimeout(hide, 1600); });
    }

    function fill(section) {
        var state = section.__insights;
        var set = state.data.sets[state.tab];
        if (!set) return;
        var values = { monthly: set.rental.monthly, yield: set.rental.yield, after: set.resale.after, profit: set.resale.profit };
        Object.keys(values).forEach(function (key) {
            var node = section.querySelector('[data-insight="' + key + '"]');
            if (node) node.textContent = values[key];
        });
        section.querySelectorAll('[data-insight-tab]').forEach(function (button) {
            button.setAttribute('aria-pressed', button.getAttribute('data-insight-tab') === state.tab ? 'true' : 'false');
        });
        var body = section.querySelector('[data-insight-table] tbody');
        if (body) {
            body.textContent = '';
            state.data.years.forEach(function (year, i) {
                var tr = document.createElement('tr');
                var th = document.createElement('th');
                th.setAttribute('scope', 'row');
                th.textContent = year;
                tr.appendChild(th);
                [set.unit[i], set.market[i]].forEach(function (value) {
                    var td = document.createElement('td');
                    td.textContent = money(value);
                    tr.appendChild(td);
                });
                body.appendChild(tr);
            });
        }
        draw(section);
    }

    var counter = 0;
    function setup(section) {
        var source = section.querySelector('[data-insight-data]');
        if (!source) return;
        var data;
        try { data = JSON.parse(source.textContent); } catch (error) { return; }
        var first = !section.__insights;
        var tab = first ? (data.tabs && data.tabs[0] ? data.tabs[0].key : Object.keys(data.sets)[0]) : section.__insights.tab;
        section.__insights = { data: data, tab: tab, id: first ? ++counter : section.__insights.id };
        fill(section);
        if (!first) return;
        section.querySelectorAll('[data-insight-tab]').forEach(function (button) {
            button.addEventListener('click', function () {
                section.__insights.tab = button.getAttribute('data-insight-tab');
                fill(section);
            });
        });
        // الرسم بيتظبط على عرض مكانه: بيترسم تاني لو العرض اتغير (تدوير الموبايل / تكبير الشاشة / الصفحة ظهرت بعد ما كانت مخفية)
        var box = section.querySelector('[data-insight-chart]');
        var seen = box ? box.clientWidth : 0;
        function again() {
            if (!box || box.clientWidth === seen) return;
            seen = box.clientWidth;
            draw(section);
        }
        if (window.ResizeObserver && box) new ResizeObserver(again).observe(box);
        else window.addEventListener('resize', again);
    }

    function refresh(root) {
        (root || document).querySelectorAll('[data-insights]').forEach(setup);
    }
    window.SharyProperty = { refresh: refresh };
    refresh(document);

    // ---------- بوب أب "قريبًا" [data-soon-modal]: أيقونة المخطط / مخطط الوحدة لما الصورة لسه ما اترفعتش ([data-soon-open]) ----------
    (function () {
        var modal = document.querySelector('[data-soon-modal]');
        if (!modal) return;
        var opener = null;
        function close() {
            if (modal.hidden) return;
            modal.classList.remove('is-open');
            window.setTimeout(function () { modal.hidden = true; }, 220);
            document.documentElement.style.overflow = '';
            if (opener) opener.focus();
        }
        function open(button) {
            opener = button;
            var name = button.getAttribute('data-soon-name') || '';
            modal.querySelector('[data-soon-name]').textContent = name;
            modal.querySelector('[data-soon-text]').textContent = button.getAttribute('data-soon-text') || '';
            var wa = modal.querySelector('[data-soon-wa]');
            if (wa) {
                var page = document.querySelector('[data-wa-url]');
                var text = (wa.getAttribute('data-wa-text') || '').replace(':name', name) + (page && page.getAttribute('data-wa-url') ? '\n' + page.getAttribute('data-wa-url') : '');
                wa.href = wa.href.split('?')[0] + '?text=' + encodeURIComponent(text);
            }
            modal.hidden = false;
            document.documentElement.style.overflow = 'hidden';
            window.requestAnimationFrame(function () { window.requestAnimationFrame(function () { modal.classList.add('is-open'); }); });
            var ok = modal.querySelector('.soon-pop__ok');
            if (ok) ok.focus();
        }
        document.addEventListener('click', function (event) {
            var button = event.target.closest ? event.target.closest('[data-soon-open]') : null;
            if (button) { event.preventDefault(); open(button); return; }
            if (event.target.closest && event.target.closest('[data-soon-close]')) close();
        });
        document.addEventListener('keydown', function (event) { if (event.key === 'Escape') close(); });
    })();

    // ---------- شريط الملخص [data-prop-bar]: بيفضل ثابت تحت الهيدر وأنت نازل ----------
    // ديسك توب: الشريط كله ثابت. موبايل: سطر العنوان بيطلع مع الصفحة، واللي بيفضل ثابت تحت الهيدر: الاسم المصغّر + سطر السعر.
    document.querySelectorAll('[data-prop-bar]').forEach(function (bar) {
        var prices = bar.querySelector('.prop-bar__prices');
        var scope = bar.closest('[lang]') || document;
        var wide = window.matchMedia('(min-width: 1024px)');
        var top = null;
        function place() {
            if (!bar.offsetHeight) return;   // الصفحة مخفية دلوقتي
            var header = scope.querySelector('header');
            var base = header ? (parseFloat(window.getComputedStyle(header).top) || 0) + header.offsetHeight : 0;
            // موبايل: اللي بيفضل ثابت = سطر الاسم المصغّر [data-bar-mini] (الاسم + المطور / المشروع) وتحته سطر السعر
            var mini = bar.querySelector('[data-bar-mini] > *');
            var from = mini && mini.offsetHeight ? mini : prices;
            var shift = wide.matches || !from ? 0 : from.getBoundingClientRect().top - bar.getBoundingClientRect().top - 8;
            top = Math.round(base - shift);
            bar.style.top = top + 'px';
            stuck();
        }
        function stuck() {
            if (top === null) return;
            bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= top + 1 && window.pageYOffset > 0);
        }
        var waiting = false;
        window.addEventListener('scroll', function () {
            if (waiting) return;
            waiting = true;
            // مكان الشريط بيتحسب تاني مع السكرول: لو ارتفاع أو مكان الهيدر اتغير بعد التحميل (شريط فوقه، خط اتحمل) الشريط ما يتغطاش بالهيدر
            window.requestAnimationFrame(function () { waiting = false; place(); });
        }, { passive: true });
        window.addEventListener('resize', place);
        if (window.ResizeObserver) new ResizeObserver(place).observe(bar);
        place();
    });

    // ---------- المعرض على الموبايل [data-gallery-slider]: صورة في النص بالألوان بتتسحب بالجنب (وطرف اللي جنبها أبيض وأسود) وتحتها نقط ----------
    // الصورة اللي قدام العميل بتبقى هي المفتوحة (data-active="1")، فالضغط عليها بيفتح عارض الصور على طول
    var narrow = window.matchMedia('(max-width: 1023px)');
    document.querySelectorAll('[data-gallery-slider]').forEach(function (track) {
        var slides = Array.prototype.slice.call(track.querySelectorAll('[data-gallery-item]'));
        var holder = track.parentNode.querySelector('[data-gallery-dots]');
        if (slides.length < 2 || !holder) return;
        var dots = slides.map(function () { return holder.appendChild(document.createElement('i')); });
        // thumbs (وحدة البيع على الموبايل): صورة كبيرة وتحتها صور صغيرة — مفيش سحب، الصورة المفتوحة بتتبدّل مكانها زي الديسك توب
        var thumbs = track.classList.contains('rent-gallery--thumbs');
        function mark() {
            if (!narrow.matches || thumbs || !track.offsetWidth) return;
            var box = track.getBoundingClientRect();
            var middle = box.left + box.width / 2;
            var best = 0, gap = Infinity;
            // الصورة اللي في نص المعرض هي المفتوحة (بالألوان) — اللي جنبها أبيض وأسود
            slides.forEach(function (slide, i) {
                var r = slide.getBoundingClientRect();
                var d = Math.abs(r.left + r.width / 2 - middle);
                if (d < gap) { gap = d; best = i; }
            });
            slides.forEach(function (slide, i) { slide.setAttribute('data-active', i === best ? '1' : '0'); });
            dots.forEach(function (dot, i) { dot.setAttribute('aria-current', i === best ? 'true' : 'false'); });
        }
        var waiting = false;
        track.addEventListener('scroll', function () {
            if (waiting) return;
            waiting = true;
            window.requestAnimationFrame(function () { waiting = false; mark(); });
        }, { passive: true });
        dots[0].setAttribute('aria-current', 'true');
        mark();

        // الصور بتتقلّب لوحدها بالراحة، واحدة واحدة (كل 4.5 ثانية): موبايل بتتسحب للصورة اللي بعدها — ديسك توب الشريحة اللي بعدها هي اللي بتتفتح.
        // بتقف طول ما العميل ماسكها أو واقف عليها بالماوس، ولو عارض الصور مفتوح، ولو المعرض مش ظاهر على الشاشة، ولو الجهاز مطفّي الحركة.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var wrap = track.parentNode;
        var held = false, seen = true, resume = null;
        function hold() { held = true; if (resume) { clearTimeout(resume); resume = null; } }
        function release(wait) { if (resume) clearTimeout(resume); resume = setTimeout(function () { held = false; resume = null; }, wait); }
        wrap.addEventListener('mouseenter', hold);
        wrap.addEventListener('mouseleave', function () { release(0); });
        wrap.addEventListener('touchstart', hold, { passive: true });
        wrap.addEventListener('touchend', function () { release(5000); }, { passive: true });
        wrap.addEventListener('focusin', hold);
        wrap.addEventListener('focusout', function () { release(0); });
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) { seen = entries[0].isIntersecting; }, { threshold: 0.5 }).observe(wrap);
        }
        window.setInterval(function () {
            if (held || !seen || document.hidden || !track.offsetWidth) return;
            if (document.querySelector('[data-rent-lightbox]:not(.hidden)')) return;
            var at = 0;
            slides.forEach(function (slide, i) { if (slide.getAttribute('data-active') === '1') at = i; });
            var next = (at + 1) % slides.length;
            if (narrow.matches && !thumbs) {
                var to = slides[next].getBoundingClientRect(), frame = track.getBoundingClientRect();
                var left = track.scrollLeft + (to.left + to.width / 2) - (frame.left + frame.width / 2);
                track.scrollTo({ left: left, behavior: 'smooth' });
            } else {
                slides.forEach(function (slide, i) { slide.setAttribute('data-active', i === next ? '1' : '0'); });
            }
        }, 4500);
    });

    // ---------- متابعة المشروع [data-follow-toggle]: "متابعة" ⇄ "متابَع". بتتحفظ على جهاز العميل (localStorage: shary:follows).
    // حدث shary:follow ({ id, following }) على الزرار: اسمعوه عشان تحفظوا المتابعة على حساب العميل، أو امنعوه (preventDefault) لو محتاجين تسجيل دخول الأول.
    document.querySelectorAll('[data-follow-toggle]').forEach(function (button) {
        var label = button.querySelector('[data-label]');
        function saved() { try { return JSON.parse(window.localStorage.getItem('shary:follows') || '[]'); } catch (e) { return []; } }
        function paint(on) {
            button.setAttribute('aria-pressed', on ? 'true' : 'false');
            if (label) label.textContent = button.getAttribute(on ? 'data-on' : 'data-off');
        }
        paint(saved().indexOf(button.getAttribute('data-follow-id')) > -1);
        button.addEventListener('click', function () {
            var id = button.getAttribute('data-follow-id');
            var on = button.getAttribute('aria-pressed') !== 'true';
            var event = new CustomEvent('shary:follow', { bubbles: true, cancelable: true, detail: { id: id, following: on } });
            if (!button.dispatchEvent(event)) return;
            var list = saved().filter(function (item) { return item !== id; });
            if (on) list.push(id);
            try { window.localStorage.setItem('shary:follows', JSON.stringify(list)); } catch (e) {}
            paint(on);
            // المتابعة بتتسجل على السيرفر (shary_follows) عشان تظهر في لوحة التحكم — data-follow-url
            var url = button.getAttribute('data-follow-url');
            if (url && window.fetch) {
                var meta = document.querySelector('meta[name="csrf-token"]');
                window.fetch(url, {
                    method: 'POST', credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': meta ? meta.getAttribute('content') : '', 'X-Requested-With': 'XMLHttpRequest' },
                    body: JSON.stringify({ id: id, following: on })
                }).catch(function () {});
            }
        });
    });

    // ---------- زرار "الخريطة" على الديسك توب [data-map-open]: بيفتح خريطة المشروع على الشاشة كلها (نفس زرار التكبير في js/shary/area-page.js) ----------
    document.querySelectorAll('[data-map-open]').forEach(function (button) {
        button.addEventListener('click', function () {
            var expand = document.querySelector('.prop-map [data-map-expand]');
            if (expand) expand.click();
        });
    });

    // ---------- خطط الدفع في المشروع [data-plan-list]: "عرض كل الخطط" بيفرد باقي الخطط على الموبايل ويقفلها ----------
    document.querySelectorAll('[data-plan-list]').forEach(function (list) {
        var toggle = list.querySelector('[data-plan-toggle]');
        if (!toggle) return;
        toggle.addEventListener('click', function () {
            var open = toggle.getAttribute('aria-expanded') !== 'true';
            list.querySelectorAll('[data-plan-extra]').forEach(function (item) { item.classList.toggle('hidden', !open); item.classList.toggle('flex', open); });
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.querySelector('[data-label]').textContent = toggle.getAttribute(open ? 'data-less' : 'data-more');
            toggle.querySelector('svg').style.transform = open ? 'rotate(180deg)' : '';
        });
    });

    // ---------- وحدات المشروع: التبويب + الترتيب + الصفحات ----------
    var desktop = window.matchMedia('(min-width: 1024px)');
    document.querySelectorAll('[data-project-units]').forEach(function (section) {
        var grid = section.querySelector('[data-project-grid]');
        if (!grid) return;
        var tabs = Array.prototype.slice.call(section.querySelectorAll('[data-unit-tab]'));
        var form = section.querySelector('form[data-area-filters]');   // فورم الفلاتر والترتيب (areas/partials/filters.blade.php)
        var count = section.querySelector('[data-units-count]');
        var empty = section.querySelector('[data-units-empty]');
        var sentinel = section.querySelector('[data-units-sentinel]');
        var perPage = parseInt(section.getAttribute('data-per-page'), 10) || 9;
        var STEP = 3;          // موبايل: 3 كروت في كل مرة
        function step() { return desktop.matches ? perPage : STEP; }   // ديسك توب: صفحة كاملة في المرة
        var shown = step();
        var busy = false;

        function current(list, name) {
            var on = list.filter(function (item) { return item.getAttribute('aria-current') === 'true'; })[0];
            return on ? on.getAttribute(name) : '';
        }
        function number(card, name) { return parseFloat(card.getAttribute(name)) || 0; }

        // اختيارات فورم الفلاتر: type[] ، bedrooms[] ، bathrooms[] ، finishing[] ، delivery[] ، years[] ، السعر والمساحة (من – إلى) ، sort
        function picked(name) {
            return form ? Array.prototype.map.call(form.querySelectorAll('input[name="' + name + '[]"]:checked'), function (box) { return box.value; }) : [];
        }
        function field(selector) {
            var input = form ? form.querySelector(selector) : null;
            return input && input.value !== '' ? Number(String(input.value).replace(/,/g, '')) : null;
        }
        function sortValue() {
            var radio = form ? form.querySelector('input[name="sort"]:checked') : null;
            return radio ? radio.value : '';
        }

        // الكروت اللي تبع التبويب المفتوح والفلاتر المختارة، مترتبة بالترتيب المختار
        function matching() {
            var tab = current(tabs, 'data-unit-tab');
            var sort = sortValue();
            var types = picked('type'), beds = picked('bedrooms'), baths = picked('bathrooms'), finishing = picked('finishing'), delivery = picked('delivery'), years = picked('years');
            var priceLow = field('[data-range-min="price"]'), priceHigh = field('[data-range-max="price"]');
            var sizeLow = field('[data-range-min="size"]'), sizeHigh = field('[data-range-max="size"]');
            function has(list, value) { return !list.length || list.indexOf(String(value)) > -1; }
            function deliveryYear(card) { return card.getAttribute('data-delivery') === 'ready' ? 0 : number(card, 'data-delivery'); }
            var by = {
                price_asc: function (a, b) { return number(a, 'data-price') - number(b, 'data-price'); },
                price_desc: function (a, b) { return number(b, 'data-price') - number(a, 'data-price'); },
                installment_asc: function (a, b) { return number(a, 'data-installment') - number(b, 'data-installment'); },
                installment_desc: function (a, b) { return number(b, 'data-installment') - number(a, 'data-installment'); },
                delivery: function (a, b) { return deliveryYear(a) - deliveryYear(b); }
            }[sort] || function () { return 0; };
            return Array.prototype.slice.call(grid.querySelectorAll(':scope > [data-unit]'))
                .filter(function (card) {
                    var price = number(card, 'data-price'), size = number(card, 'data-size'), y = number(card, 'data-years');
                    return (!tab || (tab === 'invest' ? card.getAttribute('data-invest') === '1' : card.getAttribute('data-sale') === tab)) &&
                        has(types, card.getAttribute('data-types')) && has(beds, card.getAttribute('data-beds')) && has(baths, card.getAttribute('data-baths')) &&
                        has(finishing, card.getAttribute('data-finishing')) && has(delivery, card.getAttribute('data-delivery')) &&
                        (!years.length || years.indexOf(y >= 9 ? '9+' : String(y)) > -1) &&
                        (priceLow === null || price >= priceLow) && (priceHigh === null || price <= priceHigh) &&
                        (sizeLow === null || size >= sizeLow) && (sizeHigh === null || size <= sizeHigh);
                })
                .sort(function (a, b) { return by(a, b) || number(a, 'data-order') - number(b, 'data-order'); });
        }

        function render() {
            var list = matching();
            var visible = list.slice(0, shown);
            Array.prototype.forEach.call(grid.querySelectorAll(':scope > [data-unit]'), function (card) {
                card.classList.remove('lg:block');
                card.classList.add('hidden');
            });
            list.forEach(function (card) { grid.appendChild(card); });
            visible.forEach(function (card) { card.classList.remove('hidden'); });
            if (count) count.textContent = list.length;
            if (empty) empty.classList.toggle('hidden', list.length > 0);
            if (sentinel) {
                var more = shown < list.length;
                // خلصت الوحدات وكان فيه أكتر من أول صفحة: الزرار بيبقى "عرض أقل" (بيرجّع أول صفحة)
                var less = !more && !!moreButton && list.length > step();
                sentinel.classList.toggle('hidden', !more && !less);
                sentinel.setAttribute('data-state', more ? 'idle' : 'done');
                if (moreButton) {
                    var moreText = moreButton.querySelector('span');
                    var moreArrow = moreButton.querySelector('svg');
                    if (!moreButton.hasAttribute('data-more-label') && moreText) moreButton.setAttribute('data-more-label', moreText.textContent);
                    moreButton.setAttribute('data-mode', less ? 'less' : 'more');
                    if (moreText) moreText.textContent = moreButton.getAttribute(less ? 'data-less-label' : 'data-more-label') || moreText.textContent;
                    if (moreArrow) moreArrow.style.transform = less ? 'rotate(180deg)' : '';
                }
            }
        }

        // "عرض المزيد": الوحدات ما بتكمّلش لوحدها — كل ضغطة على الزرار (data-units-more) بتظهر صفحة كمان (ديسك توب 6 ، موبايل 3)
        var moreButton = sentinel ? sentinel.querySelector('[data-units-more]') : null;
        function more() {
            if (moreButton && moreButton.getAttribute('data-mode') === 'less') {
                // "عرض أقل": نرجع لأول صفحة ونطلع لأول الوحدات
                shown = step();
                render();
                var sectionTop = section.getBoundingClientRect().top;
                if (sectionTop < 0) window.scrollTo({ top: window.pageYOffset + sectionTop - 150, behavior: 'smooth' });
                return;
            }
            if (busy || shown >= matching().length) return;
            if (moreButton) { shown += step(); render(); return; }
            busy = true;
            if (sentinel) sentinel.setAttribute('data-state', 'loading');
            setTimeout(function () {
                shown += step();
                busy = false;
                render();
                if (sentinel && !sentinel.classList.contains('hidden') && sentinel.getBoundingClientRect().top < window.innerHeight + 200) more();
            }, 350);
        }
        if (moreButton) {
            moreButton.addEventListener('click', more);
        } else if (sentinel) {
            // (صفحات من غير زرار: الشكل القديم — بتكمّل وأنت نازل)
            if ('IntersectionObserver' in window) {
                new IntersectionObserver(function (entries) { if (entries[0].isIntersecting) more(); }, { rootMargin: '300px 0px' }).observe(sentinel);
            } else {
                window.addEventListener('scroll', function () { if (sentinel.getBoundingClientRect().top < window.innerHeight + 300) more(); });
            }
        }
        if (desktop.addEventListener) desktop.addEventListener('change', function () { shown = Math.max(shown, step()); render(); });

        // قبل أي تبديل: حدث shary:project-units ({ tab, sort, filters, url }) — امنعوه لو الكروت هتيجي من السيرفر
        function apply(url) {
            var filters = {};
            if (form && window.FormData) new FormData(form).forEach(function (value, key) { if (value !== '') (filters[key] = filters[key] || []).push(value); });
            var detail = { tab: current(tabs, 'data-unit-tab'), sort: sortValue(), filters: filters, url: url || '' };
            if (!section.dispatchEvent(new CustomEvent('shary:project-units', { bubbles: true, cancelable: true, detail: detail }))) return;
            shown = step();
            render();
        }

        tabs.forEach(function (link) {
            link.addEventListener('click', function (event) {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;
                event.preventDefault();
                tabs.forEach(function (item) { item.setAttribute('aria-current', item === link ? 'true' : 'false'); });
                apply(link.href);
                var href = link.getAttribute('href') || '';
                if (href && href.charAt(0) !== '#' && window.history && history.replaceState) {
                    try { history.replaceState(history.state, '', link.href); } catch (error) { /* file:// */ }
                }
            });
        });

        // فورم الفلاتر والترتيب: "عرض النتائج" / "مسح" / اختيار ترتيب بيطلعوا حدث shary:filter (js/shary/area-page.js) —
        // هنا الفلترة بتتم على كروت الصفحة من غير ما الفورم يتبعت ولا الصفحة تتحمل
        if (form) {
            form.addEventListener('shary:filter', function (event) {
                event.preventDefault();
                event.stopPropagation();
                apply(form.getAttribute('action') || '');
                var top = section.getBoundingClientRect().top;
                if (top < 0) window.scrollTo({ top: window.pageYOffset + top - 150, behavior: 'smooth' });
            });
        }

        // لو الكروت اتبدّلت من بره (مثلاً من السيرفر): section.__renderUnits() بيعيد العرض من أول صفحة
        section.__renderUnits = function () { shown = step(); render(); };
        render();
    });
})();

/*
 | "عرض المزيد" لقوايم الكروت (data-more-list) — مثال: "وحدات تانية في نفس المشروع" في صفحة الوحدة.
 | الكروت كلها في الصفحة ؛ الظاهر في الأول بيتحدد بالـ CSS (2 موبايل / 6 ديسك توب) وكل ضغطة بتظهر data-step-mobile / data-step-desktop كمان.
 | لما الكروت تخلص الزرار بيبقى "عرض أقل" (data-less-label) ويرجّع العدد الأول. "إظهار الكل" فوق هو اللي بيفتح صفحة المشروع.
 */
(function () {
    'use strict';
    Array.prototype.forEach.call(document.querySelectorAll('[data-more-list]'), function (list) {
        var button = list.querySelector('[data-more-button]');
        var items = Array.prototype.slice.call(list.querySelectorAll('[data-more-item]'));
        if (!button || !items.length) return;
        var text = button.querySelector('[data-more-text]');
        var arrow = button.querySelector('[data-more-arrow]');

        function hidden() {
            return items.filter(function (item) { return item.offsetParent === null; });
        }
        var opened = false;      // العميل ضغط "عرض المزيد" مرة على الأقل
        function sync() {
            var done = hidden().length === 0;
            var less = done && opened;          // خلصت الكروت بعد "عرض المزيد": الزرار بيبقى "عرض أقل"
            button.dataset.done = done ? '1' : '';
            button.style.display = done && !opened ? 'none' : '';     // الكروت كلها ظاهرة من الأول: مفيش زرار
            if (text) text.textContent = less ? (button.dataset.lessLabel || text.textContent) : (button.dataset.moreLabel || text.textContent);
            if (arrow) arrow.style.transform = less ? 'rotate(180deg)' : '';
        }
        button.addEventListener('click', function (event) {
            var rest = hidden();
            event.preventDefault();
            if (!rest.length) {
                // "عرض أقل": نرجع للعدد الأول (2 موبايل / 6 أكبر) ونطلع لأول القسم
                items.forEach(function (item, index) {
                    item.classList.toggle('hidden', index >= 6);
                    item.classList.toggle('max-md:hidden', index >= 2 && index < 6);
                });
                opened = false;
                sync();
                var top = list.getBoundingClientRect().top;
                if (top < 0) window.scrollTo({ top: window.pageYOffset + top - 150, behavior: 'smooth' });
                return;
            }
            opened = true;
            var desktop = window.matchMedia('(min-width: 768px)').matches;
            var step = parseInt(desktop ? list.dataset.stepDesktop : list.dataset.stepMobile, 10) || (desktop ? 6 : 2);
            rest.slice(0, step).forEach(function (item) { item.classList.remove('hidden', 'max-md:hidden'); });
            sync();
        });
        window.addEventListener('resize', sync);
        sync();
    });
})();

/*
 | أسهم الصفوف اللي بتتحرك بالجنب على الديسك توب (data-rail-arrows حوالين ul[data-rail]) — مثال: "مراحل أخرى" في صفحة المشروع:
 | 3 كروت ظاهرين ، ولو فيه أكتر بيظهر سهمين (السابق / التالي) بيحركوا الصف كارت كارت. السحب باللمس / التراك باد شغال زي ما هو.
 */
(function () {
    'use strict';
    Array.prototype.forEach.call(document.querySelectorAll('[data-rail-arrows]'), function (wrap) {
        var rail = wrap.querySelector('[data-rail]');
        if (!rail) return;
        var rtl = getComputedStyle(rail).direction === 'rtl';
        function make(dir, label) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'rail-arrow rail-arrow--' + dir;
            button.setAttribute('aria-label', label || dir);
            button.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (dir === 'prev' ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6') + '"/></svg>';
            wrap.appendChild(button);
            return button;
        }
        var prev = make('prev', wrap.getAttribute('data-prev-label'));
        var next = make('next', wrap.getAttribute('data-next-label'));
        function stepSize() {
            var card = rail.firstElementChild;
            var gap = parseFloat(getComputedStyle(rail).columnGap || getComputedStyle(rail).gap) || 0;
            return card ? card.getBoundingClientRect().width + gap : rail.clientWidth;
        }
        function sync() {
            var max = rail.scrollWidth - rail.clientWidth;
            var pos = Math.abs(rail.scrollLeft);
            var scrollable = max > 4;
            wrap.classList.toggle('is-scrollable', scrollable);
            prev.disabled = !scrollable || pos <= 2;
            next.disabled = !scrollable || pos >= max - 2;
        }
        // في العربي الصف بيبدأ من اليمين: "التالي" بيتحرك ناحية الشمال
        prev.addEventListener('click', function () { rail.scrollBy({ left: (rtl ? 1 : -1) * stepSize(), behavior: 'smooth' }); });
        next.addEventListener('click', function () { rail.scrollBy({ left: (rtl ? -1 : 1) * stepSize(), behavior: 'smooth' }); });
        rail.addEventListener('scroll', sync, { passive: true });
        window.addEventListener('resize', sync);
        sync();
    });
    // ---------- الفورم الجانبي الثابت (.prop-aside--stick) بحجمه الطبيعي على الديسك توب ----------
    // لو الفورم أطول من المساحة اللي تحت شريط الملخص (شاشة قصيرة): بيتحرك مع الصفحة لحد ما آخره يبان وأنت نازل ، ولحد ما أوله يبان وأنت طالع ،
    // وبعدين يثبت — من غير تصغير ولا قص. لو الفورم داخل في الشاشة كله: ثابت في مكانه العادي تحت الشريط.
    document.querySelectorAll('.prop-aside--stick').forEach(function (aside) {
        var wide = window.matchMedia('(min-width: 1024px)');
        var base = null, current = null, last = window.pageYOffset, waiting = false, GAP = 16;
        function measure() {
            aside.style.top = '';
            base = wide.matches ? (parseFloat(window.getComputedStyle(aside).top) || 0) : null;
            current = null;
            move(0);
        }
        function move(delta) {
            if (base === null || !aside.offsetHeight) { aside.style.top = ''; return; }
            var lowest = Math.min(base, window.innerHeight - aside.offsetHeight - GAP);
            if (lowest >= base) { if (current !== null) { current = null; aside.style.top = ''; } return; }
            if (current === null) current = base;
            current = Math.max(lowest, Math.min(base, current - delta));
            aside.style.top = Math.round(current) + 'px';
        }
        window.addEventListener('scroll', function () {
            if (waiting) return;
            waiting = true;
            window.requestAnimationFrame(function () {
                waiting = false;
                var y = window.pageYOffset;
                move(y - last);
                last = y;
            });
        }, { passive: true });
        window.addEventListener('resize', measure);
        if (window.ResizeObserver) new ResizeObserver(function () { move(0); }).observe(aside);
        measure();
    });
})();
