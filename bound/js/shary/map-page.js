/**
 * خريطة شاري التفاعلية (resources/views/map/show.blade.php)
 * - بتفتح على الكرة الأرضية (قمر صناعي) وبتقرّب بحركة: على المشروع المطلوب (data-focus="1") ، أو على المنطقة (data-area) ،
 *   وإلا بتقف على الكرة الأرضية فوق مصر وقايمة "اختر المنطقة" مفتوحة — واختيار منطقة بيطير عليها.
 * - اختيار مشروع [data-smap-item] (كارت أو علامة السعر على الخريطة) بيحرّك الخريطة على مكانه وبيظهر أزراره.
 * - "اختر المنطقة" [data-smap-areas-toggle] بيفتح القايمة الجلاسي [data-smap-areas] — بتتقفل بالضغط على أي مكان فاضي (الخريطة نفسها أو [data-smap-areas-close]) أو Esc.
 * - الشريط الأبيض: البحث [data-smap-search] ، "استلام فوري" [data-smap-ready] ، وزراير الفلاتر [data-smap-filter-open="types | delivery | price | (فاضي = الكل)"]
 *   بتفتح لوحة الفلاتر [data-smap-sheet] — الاختيارات [data-smap-f="types | delivery | price"] بتفلتر الكروت والعلامات فورًا.
 *   الفلتر عمره ما بيرجّع فاضي: لو مفيش مشروع مطابق بالظبط بيتعرض أقرب المشاريع (مع تنبيه صغير).
 * - أزرار الجنب: نوع الخريطة [data-smap-layers] (قمر صناعي ⇄ خريطة) ، كل المشاريع في الكادر [data-smap-reset] ، موقعي [data-smap-locate] ، تكبير / تصغير [data-smap-zoom].
 * - "عرض القائمة" [data-smap-list-link]: صفحة البحث على المنطقة المختارة (?area[]=) — التبديل وحدات ⇄ كمبوندات من جوه صفحة البحث.
 * - الاختيار بيطلع حدث shary:map-select على الصفحة: detail = بيانات المشروع. من أي كود: window.SharyMap.select('slug') / window.SharyMap.area('north-coast').
 * - زرار الرجوع [data-smap-back]: بيرجّع للصفحة اللي قبلها (ولو مفيش: لينك الزرار = الرئيسية).
 *
 * الخريطة نفسها (أول محرك متاح) — الاتنين نفس الـ API فالكود واحد:
 *   1) Mapbox GL (لو data-mapbox-token موجود ومكتبة mapboxgl محملة): نفس خريطة الموقع الحالية ، بالكرة الأرضية (projection: globe).
 *   2) MapLibre GL (من غير توكن): المكتبة بتتحمل لوحدها من data-gl-src (+ data-gl-css) ، كرة أرضية + صور قمر صناعي (Esri World Imagery) + أسماء الأماكن.
 *
 * البيانات — واحد من اتنين:
 *   أ) من السيرفر (الكنترولر بيبعت $projects والكروت مرسومة في الـ Blade) — زي الأول.
 *   ب) من الـ API الحي (data-api="/api/map" — نفس API الخريطة الحالية): السكربت بيجيب /cities و /compounds لوحده وبيرسم الكروت من
 *      <template data-smap-item-tpl> + مناطق "اختر المنطقة" (المدن) + فلاتر الأنواع والتسليم. الحقول المقروءة من كل مشروع:
 *        id , name_ar , name_en , developer , city_id , lat , lng , image , price_from (بالمليون) , delivery_in , units[].type , price_list_pdf , url (اختياري)
 *        + الماستر بلان: masterplan , masterplan_corners , masterplan_placement , masterplan_hd , masterplan_tiles(+_meta) , masterplan_version , coordinates / boundary_coords / boundary
 *      data-compound="12" (أو ?compound_id=12 / ?project=12 / ?project=slug لو الـ API بيرجّع slug) بيفتح الخريطة على المشروع ده. data-mode="sahl" + data-sahel-city="16" = خريطة الساحل.
 *      data-project-url="/compounds/:id" = لينك "صفحة المشروع" لو الـ API ما بيرجّعش url (من غيره الزرار بيختفي وبيظهر "قائمة الأسعار" لو موجودة).
 * الماستر بلان (js/shary/masterplans.js — لو الملف محمّل): صورة كل مشروع بتتعرض فوق القمر الصناعي في مكانها المحفوظ بالظبط
 *   (masterplan_corners من البيانات أو من ملف الأماكن data-placements) — واختيار مشروع له ماستر بلان بيقرّب الخريطة على حدودها.
 *   من أي كود: window.SharyMap.plans() بيرجّع متحكم الماستر بلان (reload / refresh / has ...).
 *
 *   علامة كل مشروع = اسمه المختصر في تابة صغيرة كحلي (المختار تركواز) — وعلى الكرة الأرضية قبل اختيار منطقة: نقط صغيرة.
 *   3) لو مفيش WebGL / المكتبة ما اتحملتش: تضمين خرائط جوجل بالقمر الصناعي على المشروع المختار (من غير أي مفتاح).
 */
(function () {
    var maps = [];
    var MAPBOX_STYLES = { h: 'mapbox://styles/mapbox/satellite-streets-v12', m: 'mapbox://styles/mapbox/streets-v12' };
    var ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/';
    var EGYPT = [30.2, 27.4];                     // [lng, lat] — نص مصر
    var START = { center: [8, 12], zoom: -0.6 };  // أول فتحة: الكرة الأرضية صغيرة من بعيد — وبتكبر بحركة ناعمة
    function easeOut(t) { return 1 - Math.pow(1 - t, 2.2); }
    var INTRO = 4600;   // مدة حركة الفتح (مللي ثانية) — نفس السرعة لخريطة مصر (الكرة الأرضية) وخريطة المنطقة (?area= — زي خريطة الساحل)

    // ستايل MapLibre (من غير توكن): كرة أرضية + قمر صناعي وأسماء الأماكن (h) أو خريطة الشوارع (m)
    function libreStyle(type) {
        var sources = type === 'h' ? {
            base: { type: 'raster', tiles: [ESRI + 'World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 19, attribution: 'Imagery &copy; Esri' },
            labels: { type: 'raster', tiles: [ESRI + 'Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 19 }
        } : {
            base: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, maxzoom: 19, attribution: '&copy; OpenStreetMap' }
        };
        var layers = [{ id: 'ground', type: 'background', paint: { 'background-color': type === 'h' ? '#0d2238' : '#dfe9f3' } }, { id: 'base', type: 'raster', source: 'base' }];
        if (sources.labels) layers.push({ id: 'labels', type: 'raster', source: 'labels' });
        // حوالين الكرة: الفضا بالنجوم (خلفية .smap__map) — الكرة عليها هالة زرقا خفيفة زي الغلاف الجوي ، والسما نفسها شفافة عشان النجوم تبان
        return { version: 8, projection: { type: 'globe' }, sources: sources, layers: layers,
            sky: { 'sky-color': 'rgba(0, 0, 0, 0)', 'horizon-color': 'rgba(120, 180, 255, 0.55)', 'fog-color': 'rgba(186, 210, 235, 0.9)', 'sky-horizon-blend': 0.5, 'horizon-fog-blend': 0.6, 'fog-ground-blend': 0.5, 'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 7, 0] } };
    }

    // ---------- البيانات من الـ API الحي (data-api): بيرسم الكروت والمناطق والفلاتر وبعدها الخريطة بتشتغل عادي ----------
    function deliveryOf(text) {
        var value = String(text || ''), year = /20\d{2}/.exec(value);
        if (year) return Number(year[0]) <= new Date().getFullYear() ? 0 : Number(year[0]);
        return /فوري|جاهز|ready|immediate/i.test(value) ? 0 : null;
    }
    function adapt(p, cities, config) {
        var lat = parseFloat(p.lat), lng = parseFloat(p.lng);
        if (!isFinite(lat) || !isFinite(lng) || (!lat && !lng)) return null;
        var en = config.lang === 'en';
        var city = cities[p.city_id] || {};
        var cityName = (en ? (city.name_en || city.name_ar) : (city.name_ar || city.name_en)) || '';
        // price_from في الـ API بالمليون (3.2 = 3,200,000)
        var from = parseFloat(p.price_from) || 0, value = from > 0 ? (from < 100000 ? from * 1000000 : from) : 0;
        var types = [];
        (p.units || []).forEach(function (unit) { var type = String((unit && unit.type) || '').trim(); if (type && types.indexOf(type) === -1) types.push(type); });
        var url = p.url || p.link || (config.pattern ? config.pattern.replace(':id', p.id).replace(':slug', p.slug || p.id) : '');
        return {
            id: p.id, slug: String(p.id), alias: p.slug ? String(p.slug) : '', alt: (en ? p.name_ar : p.name_en) || '', name: (en ? (p.name_en || p.name_ar) : (p.name_ar || p.name_en)) || '', developer_name: p.developer || '',
            location: p.address || cityName, area_label: cityName, group: 'c' + p.city_id, group_label: cityName,
            price: value ? Math.round(value).toLocaleString('en-US') : '', price_value: value, types: types.slice(0, 3).join(' · '), type_keys: types,
            delivery: deliveryOf(p.delivery_in), image: p.image || '', url: url, price_list_pdf: p.price_list_pdf || '', lat: lat, lng: lng,
            masterplan: p.masterplan || '', masterplan_corners: p.masterplan_corners || null, masterplan_placement: p.masterplan_placement || null, masterplan_annotations: p.masterplan_annotations || null,
            masterplan_hd: p.masterplan_hd || '', masterplan_tiles: p.masterplan_tiles || '', masterplan_tiles_meta: p.masterplan_tiles_meta || null,
            masterplan_version: p.masterplan_version || p.masterplan_updated_at || '', masterplan_opacity: p.masterplan_opacity,
            boundary: p.boundary_coords || p.boundary || p.coordinates || null
        };
    }
    function chip(attribute, value, label, extra) {
        var button = document.createElement('button');
        button.type = 'button'; button.className = 'smap__chip'; button.textContent = label;
        button.setAttribute(attribute, value); button.setAttribute('aria-pressed', 'false');
        Object.keys(extra || {}).forEach(function (key) { button.setAttribute(key, extra[key]); });
        return button;
    }
    function build(root, list) {
        var template = root.querySelector('[data-smap-item-tpl]'), box = root.querySelector('[data-smap-list]');
        if (!template || !box) return;
        var first = template.content ? template.content.firstElementChild : template.firstElementChild;
        list.forEach(function (p) {
            var row = first.cloneNode(true), item = row.querySelector('[data-smap-item]');
            item.setAttribute('data-slug', p.slug); item.setAttribute('data-area', p.group); item.setAttribute('data-lat', p.lat); item.setAttribute('data-lng', p.lng);
            item.__project = p;
            var part = function (name) { return row.querySelector('[data-t="' + name + '"]'); };
            var image = part('image');
            if (image) {
                // من غير صورة (أو الصورة ما اتحملتش): مربع هادي بدل أيقونة الصورة المكسورة
                var blank = function () { var box = document.createElement('span'); box.className = image.className + ' is-empty'; if (image.parentNode) image.parentNode.replaceChild(box, image); };
                if (p.image) { image.onerror = blank; image.src = p.image; } else blank();
            }
            if (part('name')) part('name').textContent = p.name;
            if (part('meta')) part('meta').textContent = [p.developer_name, p.area_label].filter(Boolean).join(' · ');
            if (part('price')) part('price').textContent = p.price;
            if (part('price-row')) part('price-row').hidden = !p.price;
            if (part('no-price')) part('no-price').hidden = !!p.price;
            if (part('url')) { if (p.url) part('url').href = p.url; else part('url').hidden = true; }
            if (part('pdf')) { if (p.price_list_pdf && !p.url) { part('pdf').href = p.price_list_pdf; part('pdf').hidden = false; } else part('pdf').hidden = true; }
            box.appendChild(row);
        });
        // "اختر المنطقة": المدن اللي ليها مشاريع (الأكتر مشاريع الأول) — قبل زرار "الكل"
        var areas = {}, order = [];
        list.forEach(function (p) { if (!areas[p.group]) { areas[p.group] = { label: p.group_label || p.group, count: 0 }; order.push(p.group); } areas[p.group].count += 1; });
        order.sort(function (a, b) { return areas[b].count - areas[a].count; });
        var all = root.querySelector('[data-smap-areas] [data-smap-area=""]');
        if (all) order.forEach(function (slug) { all.parentNode.insertBefore(chip('data-smap-area', slug, areas[slug].label, { 'data-label': areas[slug].label }), all); });
        // فلاتر الأنواع والتسليم من البيانات نفسها
        var types = [], years = [];
        list.forEach(function (p) {
            p.type_keys.forEach(function (type) { if (types.indexOf(type) === -1) types.push(type); });
            if (p.delivery !== null && years.indexOf(p.delivery) === -1) years.push(p.delivery);
        });
        years.sort(function (a, b) { return a - b; });
        var typesBox = root.querySelector('[data-smap-fsec="types"] .smap__chips'), yearsBox = root.querySelector('[data-smap-fsec="delivery"] .smap__chips');
        if (typesBox) types.forEach(function (type) { typesBox.appendChild(chip('data-smap-f', 'types', type, { 'data-value': type })); });
        if (yearsBox) years.forEach(function (year) { yearsBox.appendChild(chip('data-smap-f', 'delivery', year === 0 ? (root.getAttribute('data-ready-label') || '0') : String(year), { 'data-value': String(year) })); });
        // قسم فلتر من غير اختيارات: يختفي هو وزراره
        [['types', types.length], ['delivery', years.length]].forEach(function (pair) {
            if (pair[1]) return;
            var section = root.querySelector('[data-smap-fsec="' + pair[0] + '"]'), opener = root.querySelector('[data-smap-filter-open="' + pair[0] + '"]');
            if (section) section.setAttribute('data-empty', '1');
            if (opener) opener.hidden = true;
            if (pair[0] === 'delivery' && root.querySelector('[data-smap-ready]')) root.querySelector('[data-smap-ready]').hidden = true;
        });
    }
    function fromApi(root) {
        var base = String(root.getAttribute('data-api') || '').replace(/\/+$/, '');
        var query = new URLSearchParams(window.location.search);
        var mode = root.getAttribute('data-mode') || '', sahel = root.getAttribute('data-sahel-city') || '16';
        var config = { lang: root.getAttribute('data-lang') || 'ar', pattern: root.getAttribute('data-project-url') || '' };
        var note = root.querySelector('[data-smap-note]');
        if (note && root.getAttribute('data-loading')) { note.textContent = root.getAttribute('data-loading'); note.hidden = false; }
        root.classList.add('is-loading');
        function get(path) { return fetch(base + path, { headers: { 'Accept': 'application/json' } }).then(function (response) { if (!response.ok) throw new Error(response.status); return response.json(); }); }
        return Promise.all([get('/cities').catch(function () { return {}; }), get('/compounds' + (mode === 'sahl' ? '?city_id=' + encodeURIComponent(sahel) : ''))]).then(function (results) {
            var cities = {};
            ((results[0] && results[0].data) || []).forEach(function (city) { cities[city.id] = city; });
            var list = ((results[1] && results[1].data) || (Array.isArray(results[1]) ? results[1] : [])).map(function (p) { return adapt(p, cities, config); }).filter(Boolean);
            build(root, list);
            var count = root.querySelectorAll('[data-smap-count]');
            Array.prototype.forEach.call(count, function (node) { node.textContent = list.length; });
            // المشروع المطلوب: data-compound أو ?compound_id= أو ?project=
            var wanted = root.getAttribute('data-compound') || query.get('compound_id') || query.get('project') || '';
            // بالـ id ، أو بالـ slug لو الـ API بيرجّعه (لينكات صفحات المشاريع ?project=slug)
            var found = wanted ? list.filter(function (p) { return p.slug === String(wanted) || (p.alias && p.alias === String(wanted)); })[0] : null;
            if (found) { root.setAttribute('data-selected', found.slug); root.setAttribute('data-focus', '1'); }
            else if (mode === 'sahl' && list.length) root.setAttribute('data-area', 'c' + sahel);
            if (note) note.hidden = true;
            root.classList.remove('is-loading');
            if (!list.length) { var empty = root.querySelector('[data-smap-empty]'); if (empty) empty.classList.remove('hidden'); }
        }, function () {
            root.classList.remove('is-loading');
            if (note) { note.textContent = root.getAttribute('data-load-fail') || ''; note.hidden = !note.textContent; }
        });
    }

    function setup(root) {
        var frame = root.querySelector('[data-smap-frame]');
        var glBox = root.querySelector('[data-smap-gl]');
        var items = Array.prototype.slice.call(root.querySelectorAll('[data-smap-item]'));
        var search = root.querySelector('[data-smap-search]');
        var empty = root.querySelector('[data-smap-empty]');
        var areasBox = root.querySelector('[data-smap-areas]');
        var areasToggle = root.querySelector('[data-smap-areas-toggle]');
        var areasVeil = root.querySelector('[data-smap-areas-close]');
        var areaLabel = root.querySelector('[data-smap-area-label]');
        var listLink = root.querySelector('[data-smap-list-link]');
        var counts = root.querySelectorAll('[data-smap-count]');
        var sheet = root.querySelector('[data-smap-sheet]');
        var note = root.querySelector('[data-smap-note]');
        var layersButton = root.querySelector('[data-smap-layers]');
        var lang = root.getAttribute('data-lang') || 'ar';
        var token = root.getAttribute('data-mapbox-token') || '';
        var state = {
            type: 'h', zoom: 16, current: null, live: false, intro: false,
            area: root.getAttribute('data-area') || '', focus: root.getAttribute('data-focus') === '1', fit: root.getAttribute('data-fit') === '1',
            types: [], delivery: [], price: ''
        };
        var gl = null, glLib = null, libState = '';   // المكتبة: '' لسه ، loading ، ready ، failed
        var noteTimer = null, meMarker = null;
        var plans = null;          // متحكم الماستر بلان (js/shary/masterplans.js)
        // من غير صفحة بحث (data-search-url فاضي): زرار "عرض القائمة" بيختفي
        if (listLink && !root.getAttribute('data-search-url')) listLink.hidden = true;
        if (!frame || !items.length) return;

        function priceLabel(p) {
            return p.price_value ? (Math.round(p.price_value / 100000) / 10) + (root.getAttribute('data-million') || 'M') : '•';
        }

        function info(item) {
            if (!item.__project) { try { item.__project = JSON.parse(item.getAttribute('data-project')); } catch (e) { item.__project = {}; } }
            if (item.__project.id == null) item.__project.id = item.__project.slug;
            return item.__project;
        }
        // حدود الماستر بلان / حدود المشروع (لو معروفة) — الخريطة بتقرّب عليها بدل نقطة المشروع
        function planBox(p) { return plans && p.masterplan ? plans.bounds(p.id) : null; }
        function goTo(p, duration) {
            var box = planBox(p);
            if (box) {
                var wideScreen = window.matchMedia('(min-width: 1024px)').matches;
                gl.fitBounds([[box[0], box[1]], [box[2], box[3]]], { padding: wideScreen ? 90 : { top: 60, right: 26, bottom: 240, left: 26 }, maxZoom: 17.5, duration: duration, essential: true });
            } else gl.flyTo({ center: [p.lng, p.lat], zoom: Math.max(16, Math.min(18, state.zoom)), duration: duration, essential: true });   // قريب كفاية عشان علامات وحدات المشروع تبان متفرّقة
        }
        // العلامات اللي ماستر بلان مشروعها معروضة: بتختفي لما العميل يقرّب (عشان ما تغطيش المخطط)
        function markPlans(ids) {
            items.forEach(function (item) {
                if (!item.__pin) return;
                var p = info(item), on = ids.indexOf(String(p.id)) > -1;
                item.__pin.classList.toggle('has-plan', on);
                // الفريق كاتب اسم المشروع بنفسه على الماستر بلان: علامة الاسم بتختفي مع التقريب (من غير تكرار)
                var ann = p.masterplan_annotations; if (typeof ann === 'string') { try { ann = JSON.parse(ann); } catch (error) { ann = null; } }
                item.__pin.classList.toggle('has-name', on && !!(ann && Array.isArray(ann.labels) && ann.labels.some(function (label) { return label && label.kind === 'project'; })));
                // اسم المشروع بيتحط في نص الماستر بلان نفسها (مش على نقطة المشروع اللي ممكن تكون بره المخطط)
                if (item.__marker) {
                    var box = on ? planBox(p) : null;
                    item.__marker.setLngLat(box ? [(box[0] + box[2]) / 2, (box[1] + box[3]) / 2] : [p.lng, p.lat]);
                }
            });
        }

        function plain(text) {
            return String(text || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\s+/g, ' ').trim();
        }

        function shown() { return items.filter(function (item) { return !item.parentNode.hidden; }); }

        function say(text) {
            if (!note || !text) return;
            note.textContent = text;
            note.hidden = false;
            clearTimeout(noteTimer);
            noteTimer = setTimeout(function () { note.hidden = true; }, 3800);
        }

        // الخروج من وضع "الكرة الأرضية" (أول ما العميل يختار منطقة / مشروع / فلتر): كروت المشاريع بتظهر
        function leaveGlobe() { root.classList.remove('is-globe'); }

        // ---- المكتبة: Mapbox (بتوكن — متحملة في الصفحة) أو MapLibre (بتتحمل لوحدها مرة واحدة)
        function loadLib() {
            if (libState) return;
            if (token) { libState = window.mapboxgl ? 'ready' : 'failed'; return; }
            if (window.maplibregl) { libState = 'ready'; return; }
            var src = root.getAttribute('data-gl-src');
            if (!src) { libState = 'failed'; return; }
            libState = 'loading';
            var done = function (ok) { if (libState !== 'loading') return; libState = ok && window.maplibregl ? 'ready' : 'failed'; paint(); };
            var css = root.getAttribute('data-gl-css');
            if (css) { var sheetLink = document.createElement('link'); sheetLink.rel = 'stylesheet'; sheetLink.href = css; document.head.appendChild(sheetLink); }
            var script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = function () { done(true); };
            script.onerror = function () { done(false); };
            document.head.appendChild(script);
            window.setTimeout(function () { done(false); }, 12000);
        }

        function bounds(list) {
            var box = new glLib.LngLatBounds();
            list.forEach(function (item) {
                var p = info(item);
                box.extend([p.lng, p.lat]);
                // الماستر بلان كلها جوه الكادر (مش نقطة المشروع بس)
                var plan = planBox(p);
                if (plan) { box.extend([plan[0], plan[1]]); box.extend([plan[2], plan[3]]); }
            });
            return box;
        }

        // كل المشاريع الظاهرة في الكادر
        function fitAll(duration) {
            var list = shown();
            if (!gl || !list.length) return;
            var wide = window.matchMedia('(min-width: 1024px)').matches;
            gl.fitBounds(bounds(list), { padding: wide ? 90 : { top: 70, right: 46, bottom: 230, left: 46 }, maxZoom: 13.5, duration: duration || 1400, essential: true });
        }

        // ---- الخريطة: الكرة الأرضية + علامة سعر لكل مشروع
        function startGL() {
            if (gl) return true;
            var lib = token ? window.mapboxgl : window.maplibregl;
            if (!lib || !lib.Map || !glBox) return false;
            try {
                if (token) lib.accessToken = token;
                glBox.hidden = false;
                glBox.setAttribute('dir', 'ltr');
                var options = { container: glBox, style: token ? MAPBOX_STYLES[state.type] : libreStyle(state.type), center: START.center, zoom: START.zoom, minZoom: -1, attributionControl: false };
                if (token) options.projection = 'globe';
                // جاي من صفحة مشروع / وحدة: الخريطة بتتفتح على المشروع نفسه من أول لحظة (مش على الكرة الأرضية)
                if (state.asked && state.focus && state.current) {
                    var here = info(state.current);
                    if (isFinite(here.lng) && isFinite(here.lat)) { options.center = [here.lng, here.lat]; options.zoom = 14; leaveGlobe(); }
                }
                gl = new lib.Map(options);
                glLib = lib;
                // مصدر صور الخريطة: مفيش علامة فوق الخريطة — المصدر مكتوب سطر صغير آخر قايمة "اختر المنطقة" ([data-smap-credit]) وبيتحدّث مع نوع الخريطة
                var creditNode = root.querySelector('[data-smap-credit]');
                var showCredit = function () {
                    if (!creditNode) return;
                    creditNode.textContent = token ? '\u00a9 Mapbox \u00a9 OpenStreetMap' : (state.type === 'h' ? 'Imagery \u00a9 Esri' : '\u00a9 OpenStreetMap');
                };
                showCredit(); gl.on('styledata', showCredit);
                // Mapbox: السما ورا الكرة سحابي فاتح بدل الأسود
                // Mapbox: نفس الغلاف الجوي بتاع الخريطة القديمة — والفضا بالنجوم ورا الكرة
                if (token) gl.on('style.load', function () { try { gl.setFog({ color: 'rgb(186, 210, 235)', 'high-color': 'rgb(36, 92, 223)', 'horizon-blend': 0.02, 'space-color': 'rgb(5, 9, 20)', 'star-intensity': 0.6 }); } catch (e) { /* نسخة أقدم من غير الغلاف الجوي */ } });
                items.forEach(function (item) {
                    var p = info(item);
                    var pin = document.createElement('button');
                    pin.type = 'button';
                    pin.className = 'smap__marker';
                    pin.setAttribute('aria-label', p.name || '');
                    // اسم المشروع المختصر (من غير "كمبوند / قرية / Compound") جوه تابة صغيرة — السعر في الـ title
                    var label = document.createElement('span');
                    label.textContent = String(p.name || '').replace(/^(كمبوند|قرية|مشروع|Compound|Village)\s+/i, '') || priceLabel(p);
                    pin.appendChild(label);
                    pin.title = (p.name || '') + ' — ' + priceLabel(p);
                    pin.addEventListener('click', function (event) { event.stopPropagation(); select(item, true); });
                    pin.style.display = item.parentNode.hidden ? 'none' : '';
                    item.__pin = pin;
                    item.__marker = new lib.Marker({ element: pin, anchor: 'bottom' }).setLngLat([p.lng, p.lat]).addTo(gl);
                });
                // الضغط على أي مكان فاضي في الخريطة بيقفل قايمة المناطق وكارت الوحدة
                gl.on('click', function () { toggleAreas(false); closeUnit(); });
                // وحدات المشروع المختار: بتظهر / تختفي مع التقريب والتحريك
                gl.on('moveend', showUnits);
                // الماستر بلان فوق القمر الصناعي — كل مشروع في مكانه المحفوظ (المشاريع الظاهرة بعد الفلتر بس)
                if (window.SharyMasterplans) {
                    plans = window.SharyMasterplans.attach(gl, {
                        projects: function () { return shown().map(info); },
                        activeId: function () { return state.current ? info(state.current).id : null; },
                        placementsUrl: root.getAttribute('data-placements') || '',
                        unplaced: root.getAttribute('data-unplaced') || 'bbox',
                        onChange: markPlans
                    });
                    gl.on('zoom', function () { root.classList.toggle('is-close', gl.getZoom() >= 14.5); });
                }
                var started = false;
                var begin = function () { if (started) return; started = true; intro(); };
                gl.on('load', function () { window.setTimeout(begin, 350); });
                window.setTimeout(begin, 2200);   // لو صور الخريطة اتأخرت: الحركة بتبدأ برضه
                frame.hidden = true;
                root.classList.add('is-gl');
                return true;
            } catch (error) {
                gl = null;
                if (glBox) glBox.hidden = true;
                return false;
            }
        }

        // أول حركة بعد ما الخريطة تفتح: من الكرة الأرضية للمشروع / المنطقة — أو تقريب بسيط على مصر والقايمة مفتوحة
        function intro() {
            state.intro = true;
            if (state.focus && state.current) {
                var p = info(state.current);
                leaveGlobe();
                if (plans) plans.refresh();
                // جاي من صفحة المشروع / الوحدة: على الماستر بلان على طول (من غير لفة الكرة الأرضية) — وإلا حركة الدخول العادية
                goTo(p, state.asked ? 0 : INTRO + 600);   // على حدود الماستر بلان لو معروفة — وإلا قريب من نقطة المشروع (علامات الوحدات بتظهر)
                revealRow(state.current);                  // كارت المشروع ظاهر في القايمة من الأول
                return;
            }
            // data-fit="1" (خريطة الساحل): الخريطة بتفتح مقرّبة على كل المشاريع المعروضة من غير اختيار منطقة
            if (state.area || state.fit) { leaveGlobe(); fitAll(INTRO); return; }
            // الكرة بتيجي من بعيد وتكبر بالراحة لحد ما تقف فوق مصر — وبعدها قايمة "اختر المنطقة" بتنزل
            gl.easeTo({ center: EGYPT, zoom: window.matchMedia('(min-width: 1024px)').matches ? 2.6 : 1.9, duration: INTRO, easing: easeOut, essential: true });
            // جاي من صفحة مشروع / وحدة (?project=): قايمة "اختر المنطقة" ما بتفتحش لوحدها أبدًا
            window.setTimeout(function () { if (root.classList.contains('is-globe') && !state.area && !state.current && !state.asked) toggleAreas(true); }, INTRO - 1400);
        }

        // الخريطة بتتحدّث لما تبقى ظاهرة بس (ولما المشروع / النوع / التكبير يتغيّر)
        function paint(fly) {
            if (!state.live) return;
            loadLib();
            if (libState === 'loading') return;   // مستنيين المكتبة
            if (libState === 'ready' && startGL()) {
                items.forEach(function (item) { if (item.__pin) item.__pin.classList.toggle('is-on', item === state.current); });
                if (plans) plans.refresh();
                if (fly !== false && state.intro && state.current) goTo(info(state.current), 1600);
                return;
            }
            // من غير WebGL: تضمين خرائط جوجل على المشروع المختار (أو أول مشروع ظاهر)
            var item = state.current || shown()[0] || items[0];
            var q = info(item);
            frame.hidden = false;
            leaveGlobe();
            // صورة القمر الصناعي للمكان (نفس خلفية الخريطة — مش خرائط جوجل)
            var z = Math.max(3, Math.min(18, Number(state.zoom) || 14)), per = 360 / (256 * Math.pow(2, z)), hw = 1200 * per / 2, hh = 800 * per * Math.cos(q.lat * Math.PI / 180) / 2;
            var url = ESRI + 'World_Imagery/MapServer/export?bbox=' + [q.lng - hw, q.lat - hh, q.lng + hw, q.lat + hh].map(function (n) { return n.toFixed(6); }).join(',') + '&bboxSR=4326&imageSR=3857&size=1200,800&format=jpg&f=image';
            if (frame.getAttribute('src') !== url) frame.setAttribute('src', url);
            frame.setAttribute('title', (root.getAttribute('data-frame-title') || '').replace(':name', q.name || ''));
        }

        // الكارت المختار يبان في القايمة (بالعرض على الموبايل / بالطول على الديسك توب) من غير ما الصفحة تتحرك
        function revealRow(item, behavior) {
            var list = item && item.closest('[data-smap-list]');
            var row = item && item.parentNode;
            if (!list || !row) return;
            if (list.scrollWidth > list.clientWidth + 4) list.scrollTo({ left: row.offsetLeft - (list.clientWidth - row.offsetWidth) / 2, behavior: behavior || 'auto' });
            else if (list.scrollHeight > list.clientHeight + 4) list.scrollTo({ top: row.offsetTop - list.offsetTop - 8, behavior: behavior || 'auto' });
        }
        function select(item, reveal) {
            state.current = item || null;
            items.forEach(function (other) { other.setAttribute('aria-current', other === item ? 'true' : 'false'); });
            if (!item) { paint(false); return; }
            if (state.intro || !gl) leaveGlobe();
            paint();
            if (reveal) revealRow(item, 'smooth');
            root.dispatchEvent(new CustomEvent('shary:map-select', { bubbles: true, detail: info(item) }));
            // مشروع تاني: علامات وحدات المشروع القديم بتتشال ، ووحدات الجديد بتتحمل (وبتظهر أول ما الخريطة تقرّب عليه)
            if (unitsFor !== null && unitsFor !== info(item).id) clearUnits();
            showUnits();
        }

        // ---- وحدات المشروع على الخريطة: لما العميل يقرّب على المشروع المختار بتظهر علامة لكل وحدة (shary/map/units?project=) ،
        //      والضغط على العلامة بيفتح كارت الوحدة بتاع الموقع ([data-smap-unit]) بلينك صفحتها وأزرار المشاركة / المفضلة / المقارنة.
        //      الوحدة اللي ليها مكان متسجل بتتحط فيه ، والباقي بيتوزّع جوه حدود الماستر بلان (أو حوالين نقطة المشروع).
        var wantedUnit = '';   // ?unit= من اللينك — بيتفتح كارتها أول ما وحدات المشروع تتحمّل
        var UNITS_ZOOM = 15;
        var unitsUrl = root.getAttribute('data-units-url') || '';
        var unitBox = root.querySelector('[data-smap-unit]');
        var unitBody = unitBox ? unitBox.querySelector('[data-smap-unit-body]') : null;
        var unitCache = {}, unitMarkers = [], unitsFor = null, unitHinted = {};

        function closeUnit() {
            if (unitBox) unitBox.hidden = true;
            unitMarkers.forEach(function (entry) { entry.pin.classList.remove('is-on'); });
        }
        function clearUnits() {
            unitMarkers.forEach(function (entry) { entry.marker.remove(); });
            unitMarkers = [];
            unitsFor = null;
            closeUnit();
        }
        // أماكن الوحدات اللي من غير مكان متسجل: شبكة جوه حدود الماستر بلان — ومن غير حدود: دواير حوالين نقطة المشروع
        function spread(p, count) {
            var out = [], box = planBox(p), i;
            if (box) {
                var w = (box[2] - box[0]) * 0.62, h = (box[3] - box[1]) * 0.62, cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2;
                var ratio = (w * Math.cos(cy * Math.PI / 180)) / Math.max(h, 1e-9);
                var cols = Math.max(1, Math.min(count, Math.ceil(Math.sqrt(count * ratio)))), rows = Math.ceil(count / cols);
                for (i = 0; i < count; i++) {
                    var c = i % cols, r = Math.floor(i / cols);
                    out.push([cx - w / 2 + (cols === 1 ? w / 2 : w * c / (cols - 1)), cy + h / 2 - (rows === 1 ? h / 2 : h * r / (rows - 1))]);
                }
                return out;
            }
            var ring = 1, used = 0, stretch = 1 / Math.max(0.2, Math.cos(p.lat * Math.PI / 180));
            while (used < count) {
                var size = Math.min(count - used, ring * 6), radius = 0.0013 * ring;
                for (i = 0; i < size; i++) {
                    var angle = (i / size) * Math.PI * 2 + ring * 0.5;
                    out.push([p.lng + Math.cos(angle) * radius * stretch, p.lat + Math.sin(angle) * radius]);
                }
                used += size; ring++;
            }
            return out;
        }
        function openUnit(unit, pin) {
            if (!unitBox || !unitBody) return;
            unitBody.innerHTML = unit.html || '';
            unitMarkers.forEach(function (entry) { entry.pin.classList.toggle('is-on', entry.pin === pin); });
            unitBox.hidden = false;
            unitBox.scrollTop = 0;
            // حالة المفضلة / المقارنة على الكارت الجديد + لوجو المطور جوه الدايرة
            if (window.SharyCards) window.SharyCards.refresh(unitBody);
            if (window.SharyLogoFit) window.SharyLogoFit.scan(unitBody);
            root.dispatchEvent(new CustomEvent('shary:map-unit', { bubbles: true, detail: { id: unit.id } }));
        }
        // وحدات العمارة: صفوف صغيرة تحت اسم العمارة (العمارة نفسها في النص فوقهم)
        function aroundBuilding(at, count) {
            var out = [], cols = Math.min(4, Math.max(1, Math.ceil(Math.sqrt(count)))), dx = 0.00042 / Math.max(0.3, Math.cos(at[1] * Math.PI / 180)), dy = 0.00024;
            for (var i = 0; i < count; i++) {
                var c = i % cols, r = Math.floor(i / cols);
                out.push([at[0] + (c - (cols - 1) / 2) * dx, at[1] - dy * (r + 1)]);
            }
            return out;
        }
        function hasBuildings(list) { return (list || []).some(function (unit) { return unit.building_at; }); }
        function drawUnits(p, list) {
            clearUnits();
            unitsFor = p.id;
            var loose = list.filter(function (unit) { return !unit.building_at && (!unit.placed || unit.lat == null); });
            var spots = spread(p, loose.length), next = 0;
            // الوحدات اللي ليها عمارة: حوالين العمارة بتاعتها
            var groups = {};
            list.forEach(function (unit) { if (unit.building_at) { var k = unit.building_at.join(','); (groups[k] = groups[k] || []).push(unit); } });
            var near = {};
            Object.keys(groups).forEach(function (k) { var at = groups[k][0].building_at.map(Number); aroundBuilding(at, groups[k].length).forEach(function (spot, i) { near[groups[k][i].id] = spot; }); });
            list.forEach(function (unit) {
                var at = near[unit.id] || (unit.placed && unit.lat != null ? [Number(unit.lng), Number(unit.lat)] : spots[next++]);
                if (!at || !isFinite(at[0]) || !isFinite(at[1])) return;
                var pin = document.createElement('button');
                pin.type = 'button';
                pin.className = 'smap__marker smap__marker--unit' + (unit.code ? ' has-code' : '');
                pin.title = unit.title || unit.label || '';
                pin.setAttribute('aria-label', unit.title || unit.label || '');
                var label = document.createElement('span');
                label.textContent = unit.label || '';
                pin.appendChild(label);
                pin.addEventListener('click', function (event) { event.stopPropagation(); toggleAreas(false); openUnit(unit, pin); });
                unitMarkers.push({ pin: pin, unit: unit, at: at, marker: new glLib.Marker({ element: pin, anchor: 'bottom' }).setLngLat(at).addTo(gl) });
            });
        }
        function showUnits() {
            if (!gl || !unitsUrl) return;
            var item = state.current;
            if (!item || item.parentNode.hidden) { if (unitsFor !== null) clearUnits(); return; }
            var p = info(item);
            var list = unitCache[p.id];
            // المشروع فيه عماير عليها وحدات: المشروع ← العماير (زوم 15) ← الوحدات (زوم 16.5) — وإلا الوحدات من زوم 15
            var close = gl.getZoom() >= (hasBuildings(list) ? UNITS_ZOOM + 1.5 : UNITS_ZOOM);
            if (list === undefined) {
                unitCache[p.id] = null;   // بيتحمّل
                // اللينك: shary/map/units?project={id} — أو قالب فيه {id} (ملفات ثابتة: .../units/{id}.json)
                fetch(unitsUrl.indexOf('{id}') > -1 ? unitsUrl.replace('{id}', encodeURIComponent(p.id)) : unitsUrl + (unitsUrl.indexOf('?') === -1 ? '?' : '&') + 'project=' + encodeURIComponent(p.id), { headers: { 'Accept': 'application/json' } })
                    .then(function (response) { return response.ok ? response.json() : { units: [] }; })
                    .then(function (data) { unitCache[p.id] = (data && data.units) || []; showUnits(); }, function () { unitCache[p.id] = []; });
                return;
            }
            if (list === null) return;
            if (wantedUnit && list.some(function (unit) { return String(unit.id) === wantedUnit; })) {
                // اللينك جاي على وحدة بعينها (?unit=): علامات وحدات المشروع بتترسم ، والخريطة بتقرّب على مكان الوحدة وكارتها بيتفتح
                var id = wantedUnit;
                wantedUnit = '';
                if (unitsFor !== p.id) drawUnits(p, list);
                var entry = unitMarkers.filter(function (marker) { return String(marker.unit.id) === id; })[0];
                if (entry) {
                    toggleAreas(false);
                    // الكارت بيغطي نص الشاشة تحت على الموبايل: علامة الوحدة بتقف في الجزء الظاهر فوقه
                    var wideScreen = window.matchMedia('(min-width: 1024px)').matches;
                    // الوحدة في عمارة: الخريطة بتدخل على العمارة نفسها (العمارة ووحداتها ظاهرين) وكارت الوحدة مفتوح
                    var b = entry.unit.building_at, focus = b ? [Number(b[0]), Number(b[1]) - 0.0005] : entry.at;
                    gl.flyTo({ center: focus, zoom: Math.max(b ? 17.4 : 17, gl.getZoom()), duration: 900, essential: true, offset: wideScreen ? [0, 0] : [0, -Math.round(window.innerHeight * 0.24)] });
                    openUnit(entry.unit, entry.pin);
                }
                return;
            }
            if (!close) {
                if (unitsFor !== null) clearUnits();
                // المشروع فيه وحدات والخريطة لسه بعيدة: سطر صغير مرة واحدة لكل مشروع
                if (list.length && !unitHinted[p.id]) { unitHinted[p.id] = true; say((root.getAttribute('data-units-hint') || '').replace(':count', list.length)); }
                return;
            }
            if (unitsFor !== p.id) drawUnits(p, list);
        }
        // الضغط على عمارة فيها وحدات (الكتابة على الماستر بلان): الخريطة بتقرّب عليها والوحدات بتظهر حواليها
        root.addEventListener('shary:mp-building', function (event) {
            var d = event.detail || {}, item = items.filter(function (it) { return String(info(it).id) === String(d.project); })[0];
            if (!gl || !item) return;
            if (state.current !== item) select(item, true);
            var wideScreen = window.matchMedia('(min-width: 1024px)').matches;
            gl.flyTo({ center: [d.lng, d.lat - 0.0005], zoom: Math.max(17.4, gl.getZoom()), duration: 900, essential: true, offset: wideScreen ? [0, 0] : [0, -Math.round(window.innerHeight * 0.12)] });
        });
        // الضغط على كتابة وحدة مربوطة بوحدة: كارت الوحدة
        root.addEventListener('shary:mp-unit', function (event) {
            var d = event.detail || {}, item = items.filter(function (it) { return String(info(it).id) === String(d.project); })[0];
            if (!gl || !item) return;
            wantedUnit = String(d.unit || '');
            if (state.current !== item) select(item, true); else showUnits();
        });
        if (unitBox) {
            unitBox.addEventListener('click', function (event) { if (event.target.closest('[data-smap-unit-close]')) closeUnit(); });
            document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !unitBox.hidden) closeUnit(); });
        }

        // ---- الفلترة: المنطقة + البحث + أنواع الوحدات + التسليم + السعر. لو مفيش مطابق بالظبط: بنفك الشروط واحد واحد لحد ما يبقى فيه نتيجة
        function matches(item, use) {
            var p = info(item);
            if (state.area && item.getAttribute('data-area') !== state.area) return false;
            if (use.words && use.words.length && window.SharyText) {
                // البحث الذكي (js/shary/smart-text.js)
                if (!(window.SharyText.score(use.query, [p.name, p.alt, String(p.slug || '').replace(/-/g, ' '), p.developer_name, p.area_label, p.group_label, p.location].join(' | ')) > 0)) return false;
            } else if (use.words && use.words.length) {
                if (!item.__hay) item.__hay = plain([p.name, p.alt, p.developer_name, p.area_label, p.group_label, p.location, p.types, String(p.slug || '').replace(/-/g, ' ')].join(' '));
                if (!use.words.every(function (word) { return item.__hay.indexOf(word) > -1; })) return false;
            }
            if (use.types && state.types.length && !(p.type_keys || []).some(function (key) { return state.types.indexOf(key) > -1; })) return false;
            if (use.delivery && state.delivery.length && state.delivery.indexOf(String(p.delivery)) === -1) return false;
            if (use.price && state.price !== '') {
                var chip = root.querySelector('[data-smap-f="price"][data-value="' + state.price + '"]');
                var min = chip ? Number(chip.getAttribute('data-min')) : 0, max = chip ? Number(chip.getAttribute('data-max')) : 0;
                if (p.price_value < min || (max && p.price_value > max)) return false;
            }
            return true;
        }

        function filter(keep) {
            var words = plain(search && search.value).split(' ').filter(Boolean);
            var query = search ? search.value : '';
            var levels = [
                { words: words, query: query, types: 1, delivery: 1, price: 1 },
                { words: words, query: query, types: 1, delivery: 1 },
                { words: words, query: query, types: 1 },
                { words: words, query: query },
                {}
            ];
            var list = [], level = 0;
            for (; level < levels.length; level++) {
                list = items.filter(function (item) { return matches(item, levels[level]); });
                if (list.length) break;
            }
            if (!list.length) { list = items.slice(); }
            if (level > 0) say(root.getAttribute('data-closest'));
            items.forEach(function (item) {
                var ok = list.indexOf(item) > -1;
                item.parentNode.hidden = !ok;
                if (item.__pin) item.__pin.style.display = ok ? '' : 'none';
            });
            if (empty) empty.classList.add('hidden');
            Array.prototype.forEach.call(counts, function (count) { count.textContent = list.length; });
            if (listLink) listLink.setAttribute('href', (root.getAttribute('data-search-url') || '#') + (state.area ? '?area[]=' + state.area : ''));
            // شارات عدد الاختيارات على زراير الفلاتر
            [['types', state.types.length], ['delivery', state.delivery.length], ['price', state.price !== '' ? 1 : 0]].forEach(function (pair) {
                var badge = root.querySelector('[data-smap-fcount="' + pair[0] + '"]');
                if (badge) { badge.textContent = pair[1]; badge.hidden = !pair[1]; badge.parentNode.classList.toggle('is-set', !!pair[1]); }
            });
            var ready = root.querySelector('[data-smap-ready]');
            if (ready) ready.setAttribute('aria-pressed', state.delivery.length === 1 && state.delivery[0] === '0' ? 'true' : 'false');
            if (plans) plans.refresh();
            if (keep) return;
            if (state.current && list.indexOf(state.current) === -1) select(null);
            leaveGlobe();
            if (gl) { if (state.intro) fitAll(); }
            else { if (!state.current) select(list[0], true); else paint(); }
        }

        function setArea(slug) {
            state.area = slug;
            root.querySelectorAll('[data-smap-area]').forEach(function (chip) {
                var on = chip.getAttribute('data-smap-area') === slug;
                chip.setAttribute('aria-pressed', on ? 'true' : 'false');
                if (on && areaLabel) areaLabel.textContent = chip.getAttribute('data-label') || '';
            });
            if (areasToggle) areasToggle.classList.toggle('is-set', !!slug);
        }

        function toggleAreas(open) {
            if (!areasBox) return;
            areasBox.hidden = !open;
            if (areasVeil) areasVeil.hidden = !open;   // طبقة شفافة فوق الخريطة: الضغط على أي مكان فاضي بيقفل القايمة
            if (areasToggle) areasToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        }

        // ---- لوحة الفلاتر: section = types | delivery | price | '' (الكل)
        function toggleSheet(open, section) {
            if (!sheet) return;
            sheet.hidden = !open;
            if (!open) return;
            toggleAreas(false);
            sheet.querySelectorAll('[data-smap-fsec]').forEach(function (part) { part.hidden = !!section && part.getAttribute('data-smap-fsec') !== section; });
        }

        function paintChips() {
            root.querySelectorAll('[data-smap-f]').forEach(function (chip) {
                var kind = chip.getAttribute('data-smap-f'), value = chip.getAttribute('data-value');
                var on = kind === 'price' ? state.price === value : state[kind].indexOf(value) > -1;
                chip.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
        }

        items.forEach(function (item) {
            item.addEventListener('click', function (event) { if (!event.target.closest('a')) select(item, true); });
            item.addEventListener('keydown', function (event) { if ((event.key === 'Enter' || event.key === ' ') && event.target === item) { event.preventDefault(); select(item, true); } });
        });

        if (areasToggle) areasToggle.addEventListener('click', function () { toggleAreas(areasBox.hidden); });
        if (areasVeil) areasVeil.addEventListener('click', function () { toggleAreas(false); });
        document.addEventListener('keydown', function (event) { if (event.key === 'Escape') { toggleAreas(false); toggleSheet(false); } });
        document.addEventListener('click', function (event) {
            if (areasBox && !areasBox.hidden && !event.target.closest('[data-smap-areas], [data-smap-areas-toggle]')) toggleAreas(false);
        });
        root.querySelectorAll('[data-smap-area]').forEach(function (chip) {
            chip.addEventListener('click', function () { setArea(chip.getAttribute('data-smap-area')); toggleAreas(false); filter(); });
        });

        // زرار الرجوع: الصفحة اللي قبلها (لو جاي من صفحة في الموقع) — وإلا لينك الزرار (الرئيسية)
        var back = root.querySelector('[data-smap-back]');
        if (back) back.addEventListener('click', function (event) {
            if (window.history.length > 1 && document.referrer && document.referrer.indexOf(window.location.host) > -1) { event.preventDefault(); window.history.back(); }
        });


        // ---- البحث الذكي: اقتراحات وهو بيكتب — مشروع / مطور / منطقة / نوع وحدة (بيفهم الهمزات والتاء المربوطة و"ال" وغلطة حرف)
        var suggestBox = null, suggestRows = [];
        var suggestText = {};
        try { suggestText = JSON.parse(root.getAttribute('data-suggest') || '{}') || {}; } catch (e) { suggestText = {}; }
        var SUGGEST_ICONS = {
            project: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5M9 10h.01M15 10h.01M9 13h.01M15 13h.01"/></svg>',
            developer: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>',
            area: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.500C5 14.800 12 21 12 21Z"/><circle cx="12" cy="9.500" r="2.500"/></svg>',
            type: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.500 12 4l9 7.500M5.500 10v10h13V10M10 20v-5h4v5"/></svg>'
        };
        function bare(word) { return word.length > 4 && word.indexOf('ال') === 0 ? word.slice(2) : word; }
        function near(a, b) {   // غلطة حرف واحد (زيادة / نقص / تبديل)
            if (Math.abs(a.length - b.length) > 1) return false;
            var i = 0, j = 0, miss = 0;
            while (i < a.length && j < b.length) {
                if (a[i] === b[j]) { i++; j++; continue; }
                if (++miss > 1) return false;
                if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
            }
            return miss + (a.length - i) + (b.length - j) <= 1;
        }
        // درجة تطابق كلمات البحث مع نص: 0 = مفيش ، أعلى = أقرب (أول الاسم > أول كلمة > جوه الكلمة > غلطة حرف)
        function rank(text, words) {
            if (window.SharyText) return window.SharyText.score(words.join(' '), text) * 2.5;   // البحث الذكي (js/shary/smart-text.js)
            var hay = plain(text);
            if (!hay) return 0;
            var parts = hay.split(' ').map(bare), total = 0;
            for (var n = 0; n < words.length; n++) {
                var word = bare(words[n]), best = 0;
                if (bare(hay).indexOf(word) === 0 && n === 0) best = 4;
                else if (parts.some(function (part) { return part.indexOf(word) === 0; })) best = 3;
                else if (hay.indexOf(word) > -1) best = 2;
                else if (word.length >= 4 && parts.some(function (part) { return near(part.slice(0, Math.max(word.length, Math.min(part.length, word.length + 1))), word) || near(part.slice(0, word.length), word); })) best = 1;
                if (!best) return 0;
                total += best;
            }
            return total / words.length;
        }
        function closeSuggest() { if (suggestBox) suggestBox.hidden = true; suggestRows = []; if (search) search.setAttribute('aria-expanded', 'false'); }
        function resetFilters() { state.types = []; state.delivery = []; state.price = ''; paintChips(); }
        function suggest() {
            if (!search) return;
            var words = plain(search.value).split(' ').filter(Boolean);
            if (!words.length) return closeSuggest();
            if (!suggestBox) {
                suggestBox = document.createElement('div');
                suggestBox.className = 'smap__suggest shary-scroll';
                suggestBox.setAttribute('role', 'listbox');
                suggestBox.setAttribute('data-smap-suggest', '');
                (search.closest('.smap__row') || search.parentNode).appendChild(suggestBox);
            }
            var found = [];
            // مشاريع: الاسم (بالعربي والإنجليزي) + المطور + المنطقة
            var developers = {};
            items.forEach(function (item) {
                var p = info(item);
                var byName = Math.max(rank(p.name, words), rank(p.alt, words), rank(String(p.slug || '').replace(/-/g, ' '), words));
                var score = byName ? byName + 1 : Math.max(rank([p.name, p.developer_name, p.area_label, p.group_label, p.location, p.types].join(' '), words) - 1.5, 0);
                if (score > 0) found.push({ kind: 'project', score: score, title: p.name, sub: [p.developer_name, p.area_label || p.group_label].filter(Boolean).join(' · '), item: item });
                if (p.developer_name) (developers[p.developer_name] = developers[p.developer_name] || []).push(item);
            });
            Object.keys(developers).forEach(function (name) {
                var score = rank(name, words);
                if (score > 0) found.push({ kind: 'developer', score: score + 0.5, title: name, sub: String(suggestText.count || ':n').replace(':n', developers[name].length), name: name });
            });
            root.querySelectorAll('[data-smap-area]').forEach(function (chip) {
                var slug = chip.getAttribute('data-smap-area'), label = chip.getAttribute('data-label') || chip.textContent.trim();
                if (!slug) return;
                var score = rank(label, words);
                var count = items.filter(function (item) { return item.getAttribute('data-area') === slug; }).length;
                if (score > 0 && count) found.push({ kind: 'area', score: score + 0.6, title: label, sub: String(suggestText.count || ':n').replace(':n', count), area: slug });
            });
            var seenTypes = {};
            root.querySelectorAll('[data-smap-f="types"]').forEach(function (chip) {
                var value = chip.getAttribute('data-value'), label = chip.textContent.trim();
                if (seenTypes[value]) return;
                seenTypes[value] = true;
                var score = rank(label, words);
                var count = items.filter(function (item) { return (info(item).type_keys || []).indexOf(value) > -1; }).length;
                if (score > 0 && count) found.push({ kind: 'type', score: score + 0.2, title: label, sub: String(suggestText.count || ':n').replace(':n', count), type: value });
            });
            found.sort(function (a, b) { return b.score - a.score; });
            var room = { project: 6, developer: 3, area: 3, type: 3 };
            suggestRows = found.filter(function (row) { return room[row.kind]-- > 0; }).slice(0, 10);
            suggestBox.textContent = '';
            if (!suggestRows.length) {
                var none = document.createElement('p');
                none.className = 'smap__suggest-none';
                none.textContent = suggestText.none || '';
                suggestBox.appendChild(none);
            }
            suggestRows.forEach(function (row, at) {
                var button = document.createElement('button');
                button.type = 'button';
                button.className = 'smap__suggest-row';
                button.setAttribute('role', 'option');
                button.setAttribute('data-kind', row.kind);
                var icon = document.createElement('span'); icon.className = 'smap__suggest-icon'; icon.innerHTML = SUGGEST_ICONS[row.kind];
                var body = document.createElement('span'); body.className = 'smap__suggest-body';
                var title = document.createElement('b'); title.textContent = row.title;
                var subText = document.createElement('small'); subText.textContent = row.sub;
                body.appendChild(title); if (row.sub) body.appendChild(subText);
                var tag = document.createElement('i'); tag.textContent = suggestText[row.kind] || '';
                button.appendChild(icon); button.appendChild(body); button.appendChild(tag);
                button.addEventListener('click', function () { pickSuggest(at); });
                suggestBox.appendChild(button);
            });
            suggestBox.hidden = false;
            search.setAttribute('aria-expanded', 'true');
        }
        function pickSuggest(at) {
            var row = suggestRows[at];
            if (!row) return;
            closeSuggest();
            toggleAreas(false);
            if (search.blur) search.blur();
            if (row.kind === 'project') {
                search.value = '';
                if (state.area && row.item.getAttribute('data-area') !== state.area) setArea('');
                resetFilters();
                filter(true);
                leaveGlobe();
                state.focus = true;
                select(row.item, true);
                return;
            }
            resetFilters();
            if (row.kind === 'developer') { setArea(''); search.value = row.name; }
            if (row.kind === 'area') { search.value = ''; setArea(row.area); }
            if (row.kind === 'type') { search.value = ''; state.types = [row.type]; paintChips(); }
            filter();
            if (gl) fitAll(900);
        }
        if (search) {
            search.setAttribute('role', 'combobox'); search.setAttribute('aria-autocomplete', 'list'); search.setAttribute('aria-expanded', 'false');
            search.addEventListener('input', function () { filter(true); suggest(); });
            search.addEventListener('focus', function () { if (search.value) suggest(); });
            search.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') { closeSuggest(); return; }
                if (event.key !== 'Enter') return;
                event.preventDefault();
                if (suggestRows.length) pickSuggest(0); else { closeSuggest(); filter(); if (search.blur) search.blur(); }
            });
            // ✕ بتاعة خانة البحث (type=search): بترجّع كل المشاريع
            search.addEventListener('search', function () { if (!search.value) { closeSuggest(); filter(); } });
            document.addEventListener('click', function (event) { if (suggestBox && !suggestBox.hidden && !event.target.closest('.smap__row')) closeSuggest(); });
        }

        root.querySelectorAll('[data-smap-filter-open]').forEach(function (button) {
            button.addEventListener('click', function () { toggleSheet(true, button.getAttribute('data-smap-filter-open')); });
        });
        root.querySelectorAll('[data-smap-sheet-close]').forEach(function (button) {
            button.addEventListener('click', function () { toggleSheet(false); });
        });
        root.querySelectorAll('[data-smap-f]').forEach(function (chip) {
            chip.addEventListener('click', function () {
                var kind = chip.getAttribute('data-smap-f'), value = chip.getAttribute('data-value');
                if (kind === 'price') state.price = state.price === value ? '' : value;
                else { var at = state[kind].indexOf(value); if (at > -1) state[kind].splice(at, 1); else state[kind].push(value); }
                paintChips();
                filter();
            });
        });
        var clear = root.querySelector('[data-smap-fclear]');
        if (clear) clear.addEventListener('click', function () { state.types = []; state.delivery = []; state.price = ''; paintChips(); filter(); });
        // "مسح" جنب عنوان كل قسم: بيفضّي القسم ده بس
        root.querySelectorAll('[data-smap-fclear-one]').forEach(function (button) {
            button.addEventListener('click', function () {
                var kind = button.getAttribute('data-smap-fclear-one');
                if (kind === 'price') state.price = ''; else if (state[kind]) state[kind] = [];
                paintChips();
                filter();
            });
        });
        // "استلام فوري": المشاريع اللي فيها وحدات جاهزة بس
        var readyButton = root.querySelector('[data-smap-ready]');
        if (readyButton) readyButton.addEventListener('click', function () {
            state.delivery = state.delivery.length === 1 && state.delivery[0] === '0' ? [] : ['0'];
            paintChips();
            filter();
        });

        // نوع الخريطة: قمر صناعي ⇄ خريطة
        if (layersButton) layersButton.addEventListener('click', function () {
            state.type = state.type === 'h' ? 'm' : 'h';
            layersButton.setAttribute('data-type', state.type);
            layersButton.classList.toggle('is-on', state.type === 'm');
            root.classList.toggle('is-roadmap', state.type === 'm');
            if (gl) gl.setStyle(token ? MAPBOX_STYLES[state.type] : libreStyle(state.type));
            else paint();
        });

        root.querySelectorAll('[data-smap-zoom]').forEach(function (button) {
            button.addEventListener('click', function () {
                var step = Number(button.getAttribute('data-smap-zoom'));
                if (gl) { if (step > 0) gl.zoomIn(); else gl.zoomOut(); return; }
                state.zoom = Math.max(9, Math.min(20, state.zoom + step));
                paint();
            });
        });

        // "كل المشاريع في الكادر"
        var reset = root.querySelector('[data-smap-reset]');
        if (reset) reset.addEventListener('click', function () {
            toggleAreas(false);
            leaveGlobe();
            if (gl) fitAll(); else { state.zoom = 12; paint(); }
        });

        // "موقعي": الخريطة بتروح لمكان العميل (بعد إذن المتصفح)
        var locate = root.querySelector('[data-smap-locate]');
        if (locate) locate.addEventListener('click', function () {
            var fail = function () { say(root.getAttribute('data-locate-fail')); };
            if (!navigator.geolocation || !gl) { fail(); return; }
            navigator.geolocation.getCurrentPosition(function (position) {
                var here = [position.coords.longitude, position.coords.latitude];
                toggleAreas(false);
                leaveGlobe();
                if (!meMarker) { var dot = document.createElement('span'); dot.className = 'smap__me'; meMarker = new glLib.Marker({ element: dot }).setLngLat(here).addTo(gl); } else meMarker.setLngLat(here);
                gl.flyTo({ center: here, zoom: 12, duration: 2200, essential: true });
            }, fail, { enableHighAccuracy: false, timeout: 8000 });
        });

        function bySlug(slug) { return items.filter(function (item) { return item.getAttribute('data-slug') === slug; })[0]; }

        // المشروع / الوحدة المطلوبين من اللينك نفسه: ?project= (رقم المشروع أو الـ slug — و ?compound_id=) و ?unit= (رقم الوحدة).
        // الخريطة بتفتح عليهم على طول من غير قايمة "اختر المنطقة" — حتى لو السيرفر ما حددش المشروع في الصفحة.
        var asked = new URLSearchParams(window.location.search);
        var askedProject = asked.get('project') || asked.get('compound_id') || '';
        wantedUnit = (asked.get('unit') || '').replace(/[^0-9]/g, '');
        if (askedProject) state.asked = true;
        if (askedProject && !state.focus) {
            var askedItem = items.filter(function (item) { var p = info(item); return String(p.id) === askedProject || p.slug === askedProject || p.alias === askedProject; })[0];
            if (askedItem) { state.focus = true; state.area = ''; root.setAttribute('data-selected', askedItem.getAttribute('data-slug')); }
        }
        if (!state.focus) wantedUnit = '';

        // البداية: فلتر المنطقة (لو موجود) + المشروع المطلوب (لو اللينك جاي عليه)
        if (state.area) setArea(state.area);
        if (state.focus) { state.current = bySlug(root.getAttribute('data-selected')) || null; if (state.current) state.current.setAttribute('aria-current', 'true'); }
        if (state.focus || state.area || state.fit) leaveGlobe();
        filter(true);

        if ('IntersectionObserver' in window) {
            // أول ما الخريطة تظهر بتتحمل — ولو اتخفت ورجعت (صفحة واحدة بأكتر من عرض) بنظبط مقاسها
            new IntersectionObserver(function (entries) {
                if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
                if (!state.live) { state.live = true; paint(); return; }
                if (gl && gl.resize) gl.resize();
            }, { rootMargin: '200px' }).observe(frame.parentNode);
        } else { state.live = true; paint(); }

        maps.push({
            root: root,
            plans: function () { return plans; },
            area: function (slug) { setArea(slug); filter(); },
            select: function (slug) {
                var item = bySlug(slug);
                if (!item) return false;
                if (item.parentNode.hidden) { if (search) search.value = ''; setArea(''); state.types = []; state.delivery = []; state.price = ''; paintChips(); filter(true); }
                toggleAreas(false);
                state.focus = true;
                select(item, true);
                return true;
            }
        });
    }

    document.querySelectorAll('[data-smap]').forEach(function (root) {
        // data-api: البيانات من الـ API الحي الأول وبعدها الخريطة — من غيره: الكروت جاية مرسومة من السيرفر
        if (root.getAttribute('data-api') && window.fetch) fromApi(root).then(function () { setup(root); });
        else setup(root);
    });

    window.SharyMap = {
        // متحكم الماستر بلان للخريطة الظاهرة (reload / refresh / has / bounds ...)
        plans: function () {
            var visible = maps.filter(function (map) { return map.root.offsetParent !== null; });
            return (visible[0] || maps[0] || { plans: function () { return null; } }).plans();
        },
        // بيفلتر الخريطة الظاهرة على منطقة (slug المنطقة الرئيسية) — '' = كل المناطق
        area: function (slug) {
            var visible = maps.filter(function (map) { return map.root.offsetParent !== null; });
            (visible.length ? visible : maps).forEach(function (map) { map.area(slug || ''); });
        },
        // بيختار المشروع في الخريطة الظاهرة (أو أول خريطة)
        select: function (slug) {
            var visible = maps.filter(function (map) { return map.root.offsetParent !== null; });
            return (visible.length ? visible : maps).some(function (map) { return map.select(slug); });
        }
    };
})();
