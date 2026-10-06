/**
 * صفحة مؤشر شاري (shary-index/show.blade.php)
 * - نوع الوحدة (سكني / تجاري / ...): بيغيّر أرقام السوق، جملة الشهر، الرسم، جدول المناطق، "الأبرز هذا الشهر"،
 *   ميزانيتك تجيب إيه، الحاسبة، المقارنة وبدائل الاستثمار من غير تحميل الصفحة.
 *   الأرقام جاية من الـ JSON اللي في [data-index-data] (بيتكتب من الداتا في الـ Blade).
 * - رسم سعر المتر: المدة (3 شهور / سنة / 3 سنين)، وتحريك الماوس أو الإصبع عليه بيعرض سعر كل شهر.
 * - جدول المناطق: بحث بالاسم + ترتيب + "عرض كل المناطق".
 * - ميزانيتك تجيب إيه: المبلغ ÷ سعر المتر = المساحة في كل منطقة.
 * - حاسبة العائد: المقدم، القسط، القيمة المتوقعة، دخل الإيجار، العائد الإجمالي، استرداد رأس المال (أرقام تقديرية).
 * - قارن بين منطقتين: 6 مقارنات بشريطين على نفس المقياس.
 * - المنطقة (مصر كلها أو منطقة بعينها): أرقام الهيدر والرسم وجملة الشهر بتتبعها.
 * - اختيار المنطقة والترتيب بنفس تصميم الموقع: لوحة اختيار [data-index-picker] وقايمة ترتيب تحت الزرار — والقيمة في select مخفي.
 * الأرقام كلها من قاعدة البيانات (App\Shary\Data\IndexData): الرقم اللي مالوش مصدر بييجي null وبيتكتب "—" ، والسلسلة الزمنية بتترسم بس لو جاية جاهزة
 * (series + series_labels — نقطتين أو أكتر) ، والجافاسكربت ما بيركّبش أي أرقام من عنده.
 * كل تغيير بيبعت حدث shary:index-change ({ type, area, period, sort, query, a, b, budget, advanced }) لو الباك إند عايز يتابعه.
 */
(function () {
    function format(number) { return Math.round(Number(number)).toLocaleString('en-US'); }
    function percent(value, digits) { return (value >= 0 ? '+' : '−') + Math.abs(value).toFixed(digits === undefined ? 1 : digits) + '%'; }
    function has(value) { return value !== null && value !== undefined && value !== ''; }
    function dash(value) { return has(value) ? value : '—'; }
    function signOf(value) { return has(value) ? (Number(value) >= 0 ? 'up' : 'down') : 'none'; }
    function escapeHtml(text) { return String(text == null ? '' : text).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function digits(text) { return Number(String(text || '').replace(/[^\d.]/g, '')) || 0; }
    function plain(text) {
        return String(text || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').trim();
    }

    document.querySelectorAll('[data-shary-index]').forEach(function (page) {
        var source = page.querySelector('[data-index-data]');
        if (!source) return;
        var data;
        try { data = JSON.parse(source.textContent); } catch (error) { return; }

        var areas = {};
        data.areas.forEach(function (area) { areas[area.slug] = area; });
        var typeKey = Object.keys(data.types)[0];
        if (!typeKey) return;
        // '' = مصر كلها ، أو slug منطقة: أرقام الهيدر والرسم بتتبعه. الصفحة ممكن تتفتح على منطقة (/shary-index/area/{slug} ← data-initial-area)
        var areaKey = page.getAttribute('data-initial-area') || '';
        if (!areas[areaKey]) areaKey = '';
        function valuesOf(slug) { return (areas[slug] && areas[slug].values[typeKey]) || {}; }
        var period = 12;    // عدد الشهور في الرسم
        var limit = 8;      // عدد المناطق الظاهرة قبل "عرض كل المناطق"

        // ---------- أرقام السوق + الرسم ----------
        var plot = page.querySelector('[data-plot]');
        var line = page.querySelector('[data-plot-line]');
        var fill = page.querySelector('[data-plot-area]');
        var cursor = page.querySelector('[data-plot-cursor]');
        var endDot = page.querySelector('[data-plot-end]');
        var endTip = page.querySelector('[data-plot-end-tip]');
        var hoverDot = page.querySelector('[data-plot-dot]');
        var hoverTip = page.querySelector('[data-plot-tip]');
        var table = page.querySelector('[data-plot-table]');
        var values = [];
        var labels = [];
        var unit = data.perMeter;
        var toY = function () { return 0; };

        function draw() {
            if (!plot) return;
            var now = scope();
            var all = now.series || [];
            // سلسلة سنوية (قيمة المؤشر سنة بسنة) بتتعرض كلها — الشهرية: آخر N شهر (+ الشهر اللي قبلهم عشان نسبة التغير تتحسب من أول المدة)
            var yearly = now.series_kind === 'index';
            var drawable = all.length >= 2;
            // من غير سلسلة حقيقية: الرسم بيختفي والأرقام اللي جنبه بتاخد العرض كله
            var plotBox = page.querySelector('[data-plot-box]');
            var plotGrid = page.querySelector('[data-plot-grid]');
            if (plotBox) plotBox.classList.toggle('hidden', !drawable);
            if (plotGrid && plotGrid.getAttribute('data-plot-cols')) plotGrid.classList.toggle(plotGrid.getAttribute('data-plot-cols'), drawable);
            var periodBox = page.querySelector('[data-period-box]');
            if (periodBox) periodBox.classList.toggle('hidden', yearly || all.length < 5);
            if (!drawable) { values = []; labels = []; return; }
            var count = yearly ? all.length : Math.max(2, Math.min(all.length, period === 36 ? 36 : period + 1));
            values = all.slice(-count);
            labels = (now.series_labels || []).slice(-count);
            while (labels.length < values.length) labels.unshift('');
            unit = now.series_unit || data.perMeter;
            var min = Math.min.apply(null, values);
            var max = Math.max.apply(null, values);
            var pad = (max - min) * 0.25 || 1;
            var low = min - pad * 0.2;
            toY = function (value) { return 90 - ((value - low) / (max + pad - low)) * 80; };
            var points = values.map(function (value, i) { return (i / (values.length - 1) * 100).toFixed(2) + ',' + toY(value).toFixed(2); });
            line.setAttribute('d', 'M' + points.join('L'));
            fill.setAttribute('d', 'M' + points.join('L') + 'L100,100L0,100Z');
            var last = values[values.length - 1];
            endDot.style.left = '100%';
            endDot.style.top = toY(last) + '%';
            endTip.style.top = toY(last) + '%';
            endTip.textContent = format(last);
            table.innerHTML = '<caption>' + escapeHtml(now.series_caption || data.caption) + '</caption>' + values.map(function (value, i) {
                return '<tr><th>' + escapeHtml(labels[i]) + '</th><td>' + format(value) + '</td></tr>';
            }).join('');

            var text = function (selector, value) { var el = page.querySelector(selector); if (el) el.textContent = value; };
            text('[data-plot-from]', labels[0]);
            text('[data-plot-mid]', labels[Math.floor((labels.length - 1) / 2)]);
            text('[data-plot-to]', labels[labels.length - 1]);
            var change = values[0] ? (last / values[0] - 1) * 100 : null;
            text('[data-period-value]', change === null ? '' : percent(change));
            var pill = page.querySelector('[data-period-change]');
            if (pill) { pill.setAttribute('data-sign', signOf(change)); pill.classList.toggle('hidden', change === null); }
        }

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
                hoverTip.innerHTML = escapeHtml(labels[i]) + '<br><b>' + format(values[i]) + '</b> ' + escapeHtml(unit);
                hoverTip.style.left = Math.min(78, Math.max(22, x)) + '%';
            });
            plot.addEventListener('pointerleave', function () { plot.classList.remove('is-active'); });
        }

        var periods = Array.prototype.slice.call(page.querySelectorAll('[data-index-period]'));
        periods.forEach(function (button) {
            button.addEventListener('click', function () {
                periods.forEach(function (other) { other.setAttribute('aria-pressed', other === button ? 'true' : 'false'); });
                period = Number(button.getAttribute('data-index-period')) || 12;
                draw();
                announce();
            });
        });

        function set(key, value) {
            page.querySelectorAll('[data-k="' + key + '"]').forEach(function (el) { el.textContent = value == null ? '' : value; });
            // مؤشر الطلب: الدايرة (مفتوحة من تحت — القوس 75 من 100) بتتملى على قد الرقم
            if (key === 'demand') page.querySelectorAll('[data-demand-arc]').forEach(function (arc) { arc.setAttribute('stroke-dasharray', (Math.max(0, Math.min(100, parseFloat(value) || 0)) * 0.75).toFixed(1) + ' 100'); });
        }

        // جدول "متوسط سعر المتر حسب نوع الوحدة" [data-type-row]: أرقام المنطقة المختارة في الفلتر (أو السوق كله لو "مصر كلها")
        function fillTypeRows() {
            page.querySelectorAll('[data-type-row]').forEach(function (row) {
                var key = row.getAttribute('data-type-row');
                var market = data.types[key] ? data.types[key].market : null;
                var own = areaKey && areas[areaKey] && areas[areaKey].values[key] ? areas[areaKey].values[key] : null;
                var from = own || market;
                if (!from) return;
                var cell = function (name, value) { var node = row.querySelector('[data-cell="' + name + '"]'); if (node) node.textContent = dash(value); return node; };
                cell('price', from.price_range_text || (has(from.price) ? from.price_text : ''));
                var yearly = cell('yearly', from.yearly_text);
                if (yearly) yearly.setAttribute('data-sign', signOf(from.yearly));
                cell('yield', from.yield_text);
                cell('range', own ? (own.resale_range_text || (has(own.resale) ? own.resale_text : '')) : market.range_text);
                cell('demand', from.demand);
            });
        }

        // أرقام الاختيار الحالي: السوق كله (مصر) أو منطقة بعينها — نفس المفاتيح في الحالتين
        function scope() {
            var type = data.types[typeKey];
            if (!areaKey || !areas[areaKey]) {
                var market = type.market;
                return { name: data.scopeAll, price_text: market.price_range_text || (has(market.price) ? market.price_text : ''), yearly_text: market.yearly_text, monthly_text: market.monthly_text, yield_text: market.yield_text,
                    units_text: market.units_text, demand: market.demand, range_label: data.range, range_text: market.range_text,
                    series: market.series || [], series_labels: market.series_labels || [], series_kind: market.series_kind || '', series_unit: market.series_unit || '', series_title: market.series_title || '', series_caption: market.series_caption || '',
                    headline: data.headlines[typeKey] || '', insights: data.insights[typeKey] || [] };
            }
            var area = areas[areaKey];
            var v = area.values[typeKey] || {};
            // أرقام المنطقة وجملتها وسلسلتها الشهرية جاية جاهزة من الباك إند (الجدول الشهري) — من غير سلسلة الرسم بيختفي
            return { name: area.name, price_text: v.price_range_text || (has(v.price) ? v.price_text : ''), yearly_text: v.yearly_text, monthly_text: v.monthly_text, yield_text: v.yield_text,
                units_text: v.units_text, demand: v.demand, range_label: data.resaleRange, range_text: v.resale_range_text || (has(v.resale) ? v.resale_text : ''),
                series: v.series || [], series_labels: v.series_labels || [], series_kind: v.series_kind || '', series_unit: v.series_unit || '', series_title: '', series_caption: v.series_caption || '',
                headline: v.headline || '', insights: v.insights || [] };
        }

        function showMarket() {
            var type = data.types[typeKey];
            var now = scope();
            set('label', type.label);
            set('label_in_units', type.label);
            set('scope', now.name);
            set('headline', now.headline);
            page.querySelectorAll('[data-k="headline"]').forEach(function (el) { el.classList.toggle('hidden', !now.headline); });
            set('trend_title', areaKey ? data.trendTitleIn.replace(':area', now.name) : (now.series_title || data.trendTitle || ''));
            set('price', dash(now.price_text));
            set('yearly', dash(now.yearly_text));
            set('monthly', dash(now.monthly_text));
            set('yield', dash(now.yield_text));
            set('units', dash(now.units_text));
            set('demand', dash(now.demand));
            set('range_label', now.range_label);
            set('range', now.range_text);
            // نطاق السعر وكارت "أهم ما في الشهر": من غير قيمة ما بيظهروش
            var rangeBox = page.querySelector('[data-range-box]');
            if (rangeBox) rangeBox.classList.toggle('hidden', !now.range_text);
            draw();
            fillTypeRows();

            var insights = page.querySelector('[data-insights]');
            if (insights) {
                insights.textContent = '';
                (now.insights || []).forEach(function (text) {
                    var li = document.createElement('li');
                    li.textContent = text;
                    insights.appendChild(li);
                });
                var insightsBox = page.querySelector('[data-insights-box]');
                if (insightsBox) insightsBox.classList.toggle('hidden', !(now.insights || []).length);
            }
        }

        // ---------- جدول المناطق ----------
        var section = page.querySelector('[data-index-areas]');
        var body = page.querySelector('[data-index-rows]');
        var rows = body ? Array.prototype.slice.call(body.querySelectorAll('tr[data-slug]')) : [];
        var search = page.querySelector('[data-index-search]');
        var sort = page.querySelector('[data-index-sort]');
        var more = page.querySelector('[data-index-more]');
        var empty = page.querySelector('[data-index-empty]');
        var expanded = false;
        // الفلتر المتقدم المتطبّق على الجدول: الجهة / التقييم / أقل نمو سنوي / أقل عائد إيجار
        var adv = { group: '', verdict: '', growth: 0, yield: 0 };
        function advMatch(slug, filter) {
            var area = areas[slug], v = valuesOf(slug);
            // المنطقة اللي مالهاش الرقم المطلوب (null) ما بتعدّيش من شرط النسبة
            return (!filter.group || area.group_key === filter.group) && (!filter.verdict || v.verdict === filter.verdict)
                && (!filter.growth || (has(v.yearly) && v.yearly >= filter.growth)) && (!filter.yield || (has(v.yield) && v.yield >= filter.yield));
        }
        function advOn(filter) { return !!(filter.group || filter.verdict || filter.growth || filter.yield); }

        function fillRows() {
            rows.forEach(function (row) {
                var v = valuesOf(row.getAttribute('data-slug'));
                var cell = function (name) { return row.querySelector('[data-c="' + name + '"]'); };
                var put = function (name, value) { var el = cell(name); if (el) el.textContent = dash(value); };
                put('price', v.price_range_text || (has(v.price) ? v.price_text : ''));
                put('yield', v.yield_text);
                put('units', v.units_text);
                put('demand', v.demand);
                // التقييم: من غير مؤشر للمنطقة الشارة بتختفي
                var verdict = cell('verdict');
                if (verdict) {
                    verdict.textContent = v.verdict_text || '';
                    verdict.setAttribute('data-verdict', v.verdict || '');
                    verdict.classList.toggle('hidden', !v.verdict_text);
                }
                [['yearly', v.yearly, v.yearly_text], ['resale_diff', v.resale_diff, v.resale_diff_text]].forEach(function (entry) {
                    var el = cell(entry[0]);
                    if (!el) return;
                    el.textContent = dash(entry[2]);
                    el.setAttribute('data-sign', signOf(entry[1]));
                });
                var bar = row.querySelector('[data-c-bar="demand"]');
                if (bar) bar.style.width = Math.max(0, Math.min(100, Number(v.demand) || 0)) + '%';
            });
        }

        function arrange() {
            if (!body) return;
            var by = sort ? sort.value : 'price';
            var query = plain(search ? search.value : '');
            rows.sort(function (x, y) {
                if (by === 'name') return x.getAttribute('data-name').localeCompare(y.getAttribute('data-name'), document.documentElement.lang || 'ar');
                // المنطقة اللي مالهاش الرقم بتيجي في الآخر
                var vx = valuesOf(x.getAttribute('data-slug'))[by], vy = valuesOf(y.getAttribute('data-slug'))[by];
                if (!has(vx) || !has(vy)) return (has(vx) ? 0 : 1) - (has(vy) ? 0 : 1);
                return vy - vx;
            });
            var shown = 0;
            rows.forEach(function (row) {
                body.appendChild(row);
                // المنطقة اللي مالهاش سعر متر لنوع الوحدة المختار ما بتظهرش في جدوله
                var match = has(valuesOf(row.getAttribute('data-slug')).price)
                    && (!query || plain(row.getAttribute('data-name')).indexOf(query) !== -1) && advMatch(row.getAttribute('data-slug'), adv);
                var visible = match && (expanded || query || advOn(adv) || shown < limit);
                if (match) shown++;
                row.hidden = !visible;
                var rank = row.querySelector('[data-c="rank"]');
                if (visible && rank) rank.textContent = shown;
            });
            if (empty) {
                empty.textContent = advOn(adv) ? data.advNone : data.noAreas;
                empty.classList.toggle('hidden', shown > 0);
            }
            if (more) more.classList.toggle('hidden', !!query || advOn(adv) || shown <= limit);
        }

        if (search) search.addEventListener('input', function () { arrange(); announce(); });
        if (sort) sort.addEventListener('change', function () { arrange(); announce(); });
        if (more) {
            more.addEventListener('click', function () {
                expanded = !expanded;
                more.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                more.querySelector('[data-label]').textContent = more.getAttribute(expanded ? 'data-less' : 'data-more');
                more.querySelector('svg').style.transform = expanded ? 'rotate(180deg)' : '';
                arrange();
                if (!expanded && section) section.scrollIntoView({ block: 'nearest' });
            });
        }

        // ---------- الأبرز هذا الشهر ----------
        function showMovers() {
            var field = { growth: 'yearly_text', yield: 'yield_text', demand: 'demand', value: 'price_range_text' };
            var total = 0;
            page.querySelectorAll('[data-movers]').forEach(function (list) {
                var kind = list.getAttribute('data-movers');
                var slugs = ((data.movers[typeKey] || {})[kind] || []).filter(function (slug) { return !!areas[slug]; });
                total += slugs.length;
                // الكارت اللي مالوش ترتيب للنوع المختار بيختفي ، والسطور الزيادة بتتخبى
                var card = list.closest('[data-movers-card]');
                if (card) card.classList.toggle('hidden', !slugs.length);
                Array.prototype.slice.call(list.children).forEach(function (item, i) {
                    var slug = slugs[i];
                    item.classList.toggle('hidden', !slug);
                    if (!slug) return;
                    var name = item.querySelector('[data-mover-name]');
                    name.textContent = areas[slug].name;
                    name.setAttribute('href', areas[slug].url || areas[slug].index_url || '#');
                    var values = valuesOf(slug);
                    item.querySelector('[data-mover-value]').textContent = has(values[field[kind]]) ? values[field[kind]] : dash(has(values.price) ? values.price_text : '');
                    // الأعلى طلبًا: الدايرة (مفتوحة من تحت — القوس 75 من 100) بتتملى على قد الرقم
                    var arc = item.querySelector('[data-mover-arc]');
                    if (arc) arc.setAttribute('stroke-dasharray', (Math.max(0, Math.min(100, Number(values.demand) || 0)) * 0.75).toFixed(1) + ' 100');
                });
            });
            var holder = page.querySelector('[data-index-movers]');
            if (holder) holder.classList.toggle('hidden', !total);
        }

        // ---------- ميزانيتك تجيب إيه ----------
        var budget = page.querySelector('[data-index-budget]');
        var budgetInput = budget ? budget.querySelector('[data-budget-input]') : null;
        function showBudget() {
            if (!budget || !budgetInput) return;
            var amount = digits(budgetInput.value);
            var list = budget.querySelector('[data-budget-results]');
            var none = budget.querySelector('[data-budget-empty]');
            // المساحة = المبلغ ÷ سعر المتر (للحساب بس، مش بتتعرض). بنعرض أغلى 6 مناطق المبلغ يجيب فيها 60 م² أو أكتر (أحسن منطقة تقدر عليها الأول)،
            // ولو مفيش: المناطق اللي يجيب فيها 40 م² على الأقل
            // المناطق اللي لها سعر متر حقيقي للنوع المختار بس
            var all = data.areas.filter(function (area) { return Number((area.values[typeKey] || {}).price) > 0; }).map(function (area) {
                var price = Number(area.values[typeKey].price);
                return { area: area, price: price, size: Math.floor(amount / price) };
            });
            var options = all.filter(function (option) { return option.size >= 60; });
            if (!options.length) options = all.filter(function (option) { return option.size >= 40; });
            options = options.sort(function (x, y) { return y.price - x.price; }).slice(0, 6);
            list.textContent = '';
            options.forEach(function (option) {
                var item = document.createElement('li');
                item.className = 'index-budget__item card-stretch';
                // اسم المنطقة بس وجنبه صورتها (من غير سعر متر ولا مساحة). الصورة من صف المنطقة في لوحة الاختيار
                var row = page.querySelector('[data-index-picker] input[name="index-area-pick"][value="' + option.area.slug + '"]');
                var shown = row ? row.closest('label').querySelector('img') : null;
                if (shown) {
                    var image = document.createElement('img');
                    image.className = 'index-budget__image';
                    image.alt = '';
                    image.loading = 'lazy';
                    image.setAttribute('data-fallback', shown.getAttribute('data-fallback') || '');
                    // الصورة البديلة مرة واحدة ، ولو هي كمان مش موجودة الصورة بتتشال (من غير علامة صورة مكسورة)
                    image.onerror = function () { var spare = this.getAttribute('data-fallback'); if (spare && !this.__spare) { this.__spare = true; this.src = spare; } else { this.onerror = null; this.remove(); } };
                    image.src = shown.currentSrc || shown.getAttribute('src');
                    item.appendChild(image);
                }
                var name = document.createElement(option.area.url ? 'a' : 'span');
                if (option.area.url) name.setAttribute('href', option.area.url);
                name.className = 'index-budget__name' + (option.area.url ? ' card-link' : '');
                name.textContent = option.area.name;
                item.appendChild(name);
                list.appendChild(item);
            });
            none.classList.toggle('hidden', options.length > 0);
            budget.querySelectorAll('[data-budget-chip]').forEach(function (chip) {
                chip.setAttribute('aria-pressed', Number(chip.getAttribute('data-budget-chip')) === amount ? 'true' : 'false');
            });
        }
        if (budgetInput) {
            budgetInput.addEventListener('input', function () {
                var amount = digits(budgetInput.value);
                budgetInput.value = amount ? format(amount) : '';
                showBudget();
                announce();
            });
            budget.querySelectorAll('[data-budget-chip]').forEach(function (chip) {
                chip.addEventListener('click', function () {
                    budgetInput.value = format(chip.getAttribute('data-budget-chip'));
                    showBudget();
                    announce();
                });
            });
        }

        // ---------- حاسبة العائد ----------
        var calc = page.querySelector('[data-index-calc]');
        function field(name) { return calc ? calc.querySelector('[data-calc="' + name + '"]') : null; }
        function calcDefaults() {
            // النمو والعائد بيتملوا من أرقام المنطقة المختارة المسجلة (والعميل يقدر يغيّرهم) — الرقم اللي مش متسجل خانته بتفضل فاضية يكتبها العميل
            var select = field('area');
            if (!select || !areas[select.value]) return;
            // نمو المنطقة وعائدها متسجلين على المنطقة كلها (مش لكل نوع وحدة): لو النوع المختار مالوش رقم بناخد رقم المنطقة العام
            var v = valuesOf(select.value);
            var base = areas[select.value].values[Object.keys(data.types)[0]] || {};
            field('growth').value = has(v.yearly) ? v.yearly : (has(base.yearly) ? base.yearly : '');
            field('yield').value = has(v.yield) ? v.yield : (has(base.yield) ? base.yield : '');
        }
        function showCalc() {
            if (!calc) return;
            var price = digits(field('price').value);
            var down = Math.min(100, digits(field('down').value)) / 100;
            var years = Math.max(1, digits(field('years').value));
            var hold = Math.max(1, digits(field('hold').value));
            var growth = digits(field('growth').value) / 100;
            var rentYield = digits(field('yield').value) / 100;
            var value = price * Math.pow(1 + growth, hold);
            var gain = value - price;
            var rent = price * rentYield * hold;
            var out = function (name, text) { var el = calc.querySelector('[data-calc-out="' + name + '"]'); if (el) el.textContent = text; };
            out('down', format(price * down) + ' ' + data.egp);
            out('installment', format(price * (1 - down) / (years * 12)) + ' ' + data.egp);
            out('value', format(value) + ' ' + data.egp);
            out('gain', format(gain) + ' ' + data.egp);
            out('rent', format(rent) + ' ' + data.egp);
            out('payback', rentYield > 0 ? (1 / rentYield).toFixed(1) + ' ' + data.yearsUnit : '—');
            out('total', price > 0 ? percent((gain + rent) / price * 100, 0) : '—');
            var label = calc.querySelector('[data-calc-label="value"]');
            if (label) label.textContent = data.outValue.replace(':years', hold);
        }
        if (calc) {
            calc.querySelectorAll('[data-calc]').forEach(function (input) {
                input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', function () {
                    if (input.getAttribute('data-calc') === 'area') calcDefaults();
                    if (input.getAttribute('data-calc') === 'price') {
                        var amount = digits(input.value);
                        input.value = amount ? format(amount) : '';
                    }
                    showCalc();
                });
            });
        }

        // ---------- قارن بين منطقتين ----------
        var compare = page.querySelector('[data-index-compare]');
        function picked(side) {
            var select = compare ? compare.querySelector('[data-compare-select="' + side + '"]') : null;
            return select ? select.value : '';
        }
        function showCompare() {
            if (!compare) return;
            var a = areas[picked('a')];
            var b = areas[picked('b')];
            if (!a || !b) return;
            var known = 0;
            compare.querySelectorAll('[data-compare-metric]').forEach(function (block) {
                var metric = block.getAttribute('data-compare-metric');
                var va = (a.values[typeKey] || {})[metric];
                var vb = (b.values[typeKey] || {})[metric];
                // المقياس اللي مالوش رقم للمنطقتين بيختفي ، واللي ناقص لمنطقة واحدة بيتكتب "—" من غير شريط
                block.classList.toggle('hidden', !has(va) && !has(vb));
                if (has(va) || has(vb)) known++;
                // الشريطين على نفس المقياس: من صفر لـ 100 (الطلب والمؤشر) أو لأكبر رقم في الاتنين (الباقي)
                var top = metric === 'demand' || metric === 'score' ? 100 : Math.max(Math.abs(Number(va) || 0), Math.abs(Number(vb) || 0)) || 1;
                [['a', a, va], ['b', b, vb]].forEach(function (entry) {
                    var value = entry[2];
                    var given = has(value);
                    value = Number(value) || 0;
                    block.querySelector('[data-compare-name="' + entry[0] + '"]').textContent = entry[1].name;
                    block.querySelector('[data-compare-fill="' + entry[0] + '"]').style.width = given ? Math.max(2, Math.abs(value) / top * 100) + '%' : '0';
                    block.querySelector('[data-compare-value="' + entry[0] + '"]').textContent = !given ? '—' :
                        metric === 'price' || metric === 'resale' ? ((entry[1].values[typeKey] || {})[metric + '_range_text'] || format(value)) : metric === 'yearly' ? percent(value) : metric === 'yield' ? value.toFixed(1) + '%' : value;
                });
            });
            // المنطقتين مالهمش أرقام للنوع المختار: رسالة بدل الكارت الفاضي
            var none = compare.querySelector('[data-compare-empty]');
            if (none) none.classList.toggle('hidden', known > 0);
        }
        // نوع الوحدة في المقارنة [data-compare-type]: نفس اختيار الفلتر اللي فوق — الضغط هنا بيغيّر الفلتر (والصفحة كلها) ، وتغيير الفلتر بيعلّم هنا
        function markCompareType() {
            if (!compare) return;
            var label = '';
            compare.querySelectorAll('[data-compare-type]').forEach(function (chip) {
                var on = chip.getAttribute('data-compare-type') === typeKey;
                chip.setAttribute('aria-pressed', on ? 'true' : 'false');
                if (on) label = chip.textContent.trim();
            });
            if (label) compare.querySelectorAll('[data-compare-type-label]').forEach(function (node) { node.textContent = label; });
        }
        if (compare) {
            compare.querySelectorAll('[data-compare-select]').forEach(function (select) {
                select.addEventListener('change', function () { showCompare(); announce(); });
            });
            compare.querySelectorAll('[data-compare-type]').forEach(function (chip) {
                chip.addEventListener('click', function () {
                    var target = page.querySelector('[data-index-type="' + chip.getAttribute('data-compare-type') + '"]');
                    if (target) target.click();
                });
            });
        }

        // ---------- مليون جنيه من سنة بقوا كام؟ ----------
        function showAlternatives() {
            var holder = page.querySelector('[data-alt-rows]');
            var list = (data.alternatives || {})[typeKey] || [];
            // النوع اللي مالوش نمو سنوي مسجل: القسم بيختفي (مفيش رقم للعقار نقارن بيه)
            var altSection = page.querySelector('[data-index-alt]');
            if (altSection) altSection.classList.toggle('hidden', !list.length);
            if (!holder || !list.length) return;
            var top = Math.max.apply(null, list.map(function (item) { return item.rate; }));
            Array.prototype.slice.call(holder.children).forEach(function (row, i) {
                var item = list[i];
                row.classList.toggle('hidden', !item);
                if (!item) return;
                row.querySelector('span').textContent = item.label;
                row.querySelector('i').style.width = ((100 + item.rate) / (100 + top) * 100).toFixed(1) + '%';
                row.querySelector('b').textContent = format(1000000 * (1 + item.rate / 100));
            });
        }

        function announce() {
            page.dispatchEvent(new CustomEvent('shary:index-change', { bubbles: true, detail: {
                type: typeKey, area: areaKey, period: period, sort: sort ? sort.value : 'price', query: search ? search.value : '',
                a: picked('a'), b: picked('b'), budget: budgetInput ? digits(budgetInput.value) : 0, advanced: adv
            } }));
        }

        function show() {
            showMarket();
            fillRows();
            arrange();
            showMovers();
            showBudget();
            if (calc) { calcDefaults(); showCalc(); }
            showCompare();
            showAlternatives();
        }

        var buttons = Array.prototype.slice.call(page.querySelectorAll('[data-index-type]'));
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                buttons.forEach(function (other) { other.setAttribute('aria-pressed', other === button ? 'true' : 'false'); });
                typeKey = button.getAttribute('data-index-type');
                show();
                markCompareType();
                announce();
            });
        });
        var areaSelect = page.querySelector('[data-index-area]');
        if (areaSelect) {
            areaSelect.addEventListener('change', function () {
                areaKey = areaSelect.value;
                showMarket();
                announce();
            });
        }
        // ---------- الترتيب: زرار + قايمة تحته (نفس تصميم صفحة المنطقة). الاختيار بيتكتب في الـ select المخفي ----------
        var sortOpen = page.querySelector('[data-index-sort-open]');
        var sortMenu = page.querySelector('[data-index-sort-menu]');
        if (sortOpen && sortMenu && sort) {
            var closeSort = function () { sortMenu.classList.add('hidden'); sortOpen.setAttribute('aria-expanded', 'false'); };
            sortOpen.addEventListener('click', function () {
                var closed = sortMenu.classList.toggle('hidden');
                sortOpen.setAttribute('aria-expanded', closed ? 'false' : 'true');
                // علّم الاختيار الحالي كل مرة القايمة تتفتح
                sortMenu.querySelectorAll('input[type="radio"]').forEach(function (radio) { radio.checked = radio.value === sort.value; });
            });
            document.addEventListener('click', function (event) {
                if (!sortMenu.contains(event.target) && !sortOpen.contains(event.target)) closeSort();
            });
            sortMenu.querySelectorAll('input[type="radio"]').forEach(function (radio) {
                radio.addEventListener('change', function () {
                    sort.value = radio.value;
                    var label = page.querySelector('[data-index-sort-label]');
                    if (label) label.textContent = radio.parentNode.querySelector('span').textContent;
                    closeSort();
                    sort.dispatchEvent(new Event('change'));
                });
            });
        }

        // "غيّر المنطقة" جنب جدول الأنواع: بيفتح نفس قايمة مناطق الفلتر (من غير ما الصفحة تطلع لفوق)
        page.querySelectorAll('[data-index-area-open]').forEach(function (button) {
            button.addEventListener('click', function () {
                var hero = page.querySelector('[data-picker-open="hero"]');
                if (hero) hero.click();
            });
        });
        // "إزاي المؤشر بيتحسب": زراير الحسابات التلاتة (المنطقة / المشروع والوحدة / المطور)
        page.querySelectorAll('[data-index-method]').forEach(function (box) {
            var tabs = Array.prototype.slice.call(box.querySelectorAll('[data-method-tab]'));
            tabs.forEach(function (tab) {
                tab.addEventListener('click', function () {
                    var key = tab.getAttribute('data-method-tab');
                    tabs.forEach(function (other) { other.setAttribute('aria-pressed', other === tab ? 'true' : 'false'); });
                    box.querySelectorAll('[data-method-panel]').forEach(function (panel) { panel.classList.toggle('hidden', panel.getAttribute('data-method-panel') !== key); });
                });
            });
        });

        // ---------- جدول أنواع الوحدات: الضغط على النوع بيغيّر الصفحة كلها للنوع ده ويطلع للفلتر ----------
        page.querySelectorAll('[data-index-type-jump]').forEach(function (jump) {
            jump.addEventListener('click', function () {
                var target = page.querySelector('[data-index-type="' + jump.getAttribute('data-index-type-jump') + '"]');
                if (!target) return;
                target.click();
                var filter = page.querySelector('[data-index-filter]');
                if (filter) filter.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });

        // ---------- الفلتر المتقدم: لوحة بتصميم الموقع، الاختيارات مسودة لحد ما يضغط "اعرض" ----------
        var advDialog = page.querySelector('[data-index-advanced]');
        var advOpen = page.querySelector('[data-adv-open]');
        if (advDialog && advOpen) {
            var draft = { group: '', verdict: '', growth: 0, yield: 0 };
            var advChips = Array.prototype.slice.call(advDialog.querySelectorAll('[data-adv-chip]'));
            var advApply = advDialog.querySelector('[data-adv-apply]');
            var advActive = page.querySelector('[data-adv-active]');
            var chipValue = function (chip) {
                var key = chip.getAttribute('data-adv-chip'), value = chip.getAttribute('data-adv-value');
                return key === 'growth' || key === 'yield' ? Number(value) : value;
            };
            var paintDraft = function () {
                advChips.forEach(function (chip) { chip.setAttribute('aria-pressed', draft[chip.getAttribute('data-adv-chip')] === chipValue(chip) ? 'true' : 'false'); });
                var count = rows.filter(function (row) { return advMatch(row.getAttribute('data-slug'), draft); }).length;
                advApply.textContent = advApply.getAttribute('data-label').replace(':count', count);
            };
            var paintApplied = function () {
                var labels = advChips.filter(function (chip) { return chip.getAttribute('data-adv-label') && adv[chip.getAttribute('data-adv-chip')] === chipValue(chip); })
                    .map(function (chip) { return chip.getAttribute('data-adv-label'); });
                var badge = advOpen.querySelector('[data-adv-count]');
                if (badge) { badge.textContent = labels.length; badge.classList.toggle('hidden', !labels.length); }
                if (advActive) {
                    advActive.classList.toggle('hidden', !labels.length);
                    advActive.querySelector('[data-adv-summary]').textContent = labels.join(' · ');
                }
            };
            var closeAdv = function () { advDialog.classList.add('hidden'); document.documentElement.style.overflow = ''; advOpen.focus(); };
            advOpen.addEventListener('click', function () {
                draft = { group: adv.group, verdict: adv.verdict, growth: adv.growth, yield: adv.yield };
                paintDraft();
                advDialog.classList.remove('hidden');
                document.documentElement.style.overflow = 'hidden';
            });
            advChips.forEach(function (chip) {
                chip.addEventListener('click', function () { draft[chip.getAttribute('data-adv-chip')] = chipValue(chip); paintDraft(); });
            });
            advDialog.querySelectorAll('[data-adv-close]').forEach(function (button) { button.addEventListener('click', closeAdv); });
            advDialog.querySelector('[data-adv-reset]').addEventListener('click', function () { draft = { group: '', verdict: '', growth: 0, yield: 0 }; paintDraft(); });
            advApply.addEventListener('click', function () {
                adv = draft;
                arrange(); paintApplied(); closeAdv(); announce();
                if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            var advClear = page.querySelector('[data-adv-clear]');
            if (advClear) advClear.addEventListener('click', function () { adv = { group: '', verdict: '', growth: 0, yield: 0 }; arrange(); paintApplied(); announce(); });
            document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !advDialog.classList.contains('hidden')) closeAdv(); });
        }

        // ---------- أخبار السوق: تصفية بنوع الخبر (الكل / طروحات / أسعار / تسليمات / قرارات) ----------
        var newsFilters = page.querySelectorAll('[data-news-filter]');
        if (newsFilters.length) {
            var newsItems = page.querySelectorAll('[data-news-kind]');
            var newsEmpty = page.querySelector('[data-news-empty]');
            newsFilters.forEach(function (button) {
                button.addEventListener('click', function () {
                    var kind = button.getAttribute('data-news-filter');
                    var shown = 0;
                    newsFilters.forEach(function (other) { other.setAttribute('aria-pressed', other === button ? 'true' : 'false'); });
                    newsItems.forEach(function (item) {
                        var match = kind === 'all' || item.getAttribute('data-news-kind') === kind;
                        item.classList.toggle('hidden', !match);
                        if (match) shown += 1;
                    });
                    if (newsEmpty) newsEmpty.classList.toggle('hidden', shown > 0);
                    document.dispatchEvent(new CustomEvent('shary:news-filter', { detail: { kind: kind } }));
                });
            });
        }

        // ---------- لوحة اختيار المنطقة (نفس تصميم لوحات الاختيار في الموقع) ----------
        // أي زرار [data-picker-open] بيفتحها، والاختيار بيتكتب في الـ select المخفي اللي جنب الزرار وبيحدّث اسم الزرار
        var picker = page.querySelector('[data-index-picker]');
        if (picker) {
            var target = null;      // الزرار اللي فتح اللوحة
            var pickerSearch = picker.querySelector('[data-picker-search]');
            var options = Array.prototype.slice.call(picker.querySelectorAll('[data-picker-list] label'));
            var holder = function (button) { return button.parentNode.querySelector('select'); };
            // زرار الهيدر بيعرض صورة المنطقة + الاسم، وباقي الأزرار (المقارنة والحاسبة) الاسم بس
            var paint = function (button) {
                var slug = holder(button).value;
                var image = button.querySelector('[data-pick-image]');
                button.querySelector('[data-pick-name]').textContent = slug && areas[slug] ? areas[slug].name : data.scopeAll;
                if (!image) return;
                if (!slug || !areas[slug]) {
                    image.src = image.getAttribute('data-all') || image.src;
                    image.classList.add('index-pick__mark');
                    return;
                }
                // الصورة بتتاخد من صف المنطقة في اللوحة نفسها
                var row = picker.querySelector('input[name="index-area-pick"][value="' + slug + '"]');
                var shown = row ? row.closest('label').querySelector('img') : null;
                var fallback = (shown && shown.getAttribute('data-fallback')) || areas[slug].image_fallback || '';
                image.classList.remove('index-pick__mark');
                image.setAttribute('data-fallback', fallback);
                image.onerror = function () { image.onerror = null; image.src = image.getAttribute('data-fallback'); };
                image.src = (shown && (shown.currentSrc || shown.getAttribute('src'))) || areas[slug].image || fallback;
            };
            var closePicker = function () {
                picker.classList.add('hidden');
                document.documentElement.style.overflow = '';
                if (target) { try { target.focus({ preventScroll: true }); } catch (error) { target.focus(); } }
                target = null;
            };
            page.querySelectorAll('[data-picker-open]').forEach(function (button) {
                var image = button.querySelector('[data-pick-image]');
                // زرار الهيدر: علامة شاري لـ "مصر كلها" ، ولو الصفحة مفتوحة على منطقة بتتعرض صورتها من أول تحميل
                if (image) {
                    image.setAttribute('data-all', image.getAttribute('src'));
                    if (holder(button).value && areas[holder(button).value]) paint(button); else image.classList.add('index-pick__mark');
                }
                button.addEventListener('click', function () {
                    target = button;
                    var value = holder(button).value;
                    var all = picker.querySelector('[data-picker-all]');
                    if (all) all.classList.toggle('hidden', !holder(button).querySelector('option[value=""]'));
                    options.forEach(function (row) { row.querySelector('input').checked = row.querySelector('input').value === value; if (row !== all) row.classList.remove('hidden'); });
                    if (pickerSearch) pickerSearch.value = '';
                    picker.classList.remove('hidden');
                    document.documentElement.style.overflow = 'hidden';
                });
            });
            options.forEach(function (row) {
                // click مش change: عشان اللوحة تتقفل حتى لو اختار نفس المنطقة المختارة
                row.querySelector('input').addEventListener('click', function () {
                    if (!target) return;
                    var select = holder(target);
                    select.value = row.querySelector('input').value;
                    paint(target);
                    closePicker();
                    select.dispatchEvent(new Event('change'));
                });
            });
            picker.querySelectorAll('[data-picker-close]').forEach(function (node) { node.addEventListener('click', closePicker); });
            document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !picker.classList.contains('hidden')) closePicker(); });
            if (pickerSearch) {
                pickerSearch.addEventListener('input', function () {
                    var query = plain(pickerSearch.value);
                    options.forEach(function (row) {
                        if (row.hasAttribute('data-picker-all') && target && !holder(target).querySelector('option[value=""]')) return;
                        row.classList.toggle('hidden', !!query && plain(row.querySelector('[data-picker-name]').textContent).indexOf(query) === -1);
                    });
                });
            }
        }

        var current = page.querySelector('[data-index-type][aria-pressed="true"]');
        if (current) typeKey = current.getAttribute('data-index-type');
        show();
    });
})();
