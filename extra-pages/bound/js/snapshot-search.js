/*
 * Static preview only (GitHub Pages — no server): the search and every filter work here like on the live site.
 * The cards are the site's own cards (rendered by Laravel when the preview was built — {lang}/v2/pv-data.html) and the
 * filtering follows the server's rules (App\Shary\Data\ListingFilters, OffersData, HomeData::search). On the live site this file does not exist.
 */
(function () {
    var en = document.documentElement.lang === 'en';
    var LANG = en ? 'en' : 'ar';
    var BASE = window.SHARY_PV_BASE || '/Sharyproperty/bound/';
    var DATA_URL = new URL(BASE + LANG + '/v2/pv-data.html', location.href).href;
    var IGNORE = ['fresh', 'v', 'ver', 'snap', 'page', 'view'];
    var LEGACY = { location: 'area', property_type: 'type', min_price: 'price_min', max_price: 'price_max', min_area: 'size_min', max_area: 'size_max',
        installment_years: 'years', monthly_amount: 'monthly_installment', delivery_in: 'delivery', search: 'q' };
    var LISTS = ['type', 'area', 'developer', 'project', 'bedrooms', 'bathrooms', 'finishing', 'amenities', 'delivery', 'years'];
    var NUMBERS = ['price_min', 'price_max', 'size_min', 'size_max', 'down_payment', 'monthly_installment'];
    var READY = ['1', 'ready', 'ready_for_delivery', 'delivered', 'جاهز', 'جاهز للتسليم'];
    var STOP = ['شركه', 'شركة', 'مجموعه', 'كمبوند', 'كومباوند', 'كمباوند', 'قريه', 'مشروع', 'منتجع', 'company', 'co', 'group', 'compound', 'village', 'project',
        'في', 'the', 'in', 'of', 'للبيع', 'البيع', 'بيع', 'للايجار', 'الايجار', 'ايجار', 'for', 'sale', 'rent'];
    var ALIASES = { 'التجمع': ['القاهره الجديده', 'التجمع الخامس', 'new cairo'], 'زايد': ['الشيخ زايد', 'sheikh zayed'], 'اكتوبر': ['6 اكتوبر', 'october'],
        'العاصمه': ['العاصمه الاداريه'], 'الساحل': ['الساحل الشمالي', 'north coast'], 'السخنه': ['العين السخنه', 'sokhna'], 'المستقبل': ['مدينه المستقبل', 'mostakbal'],
        'new cairo': ['القاهره الجديده'], 'zayed': ['الشيخ زايد'], 'sahel': ['الساحل الشمالي'] };

    function fold(text) {
        return String(text || '').toLowerCase()
            .replace(/[ً-ْـ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
            .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 1632); })
            .replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim();
    }
    function bare(word) { var m = word.match(/^(وال|بال|فال|كال|لل|ال)(.{2,})$/); return m ? m[2] : word; }
    function words(text) { return fold(text).split(' ').filter(function (w) { return w && STOP.indexOf(w) === -1; }); }
    // every word of the query is found in the name (as a word start — with or without «ال»)
    function nameHas(name, qWords) {
        var nw = fold(name).split(' ');
        return qWords.every(function (q) {
            var qb = bare(q);
            return nw.some(function (w) { var wb = bare(w); return w.indexOf(q) === 0 || wb.indexOf(qb) === 0 || (qb.length >= 4 && wb.indexOf(qb) !== -1); });
        });
    }
    function variants(text) {
        var f = fold(text), out = [words(text)];
        Object.keys(ALIASES).forEach(function (k) { if ((' ' + f + ' ').indexOf(' ' + k + ' ') !== -1) ALIASES[k].forEach(function (a) { out.push(words((' ' + f + ' ').replace(' ' + k + ' ', ' ' + a + ' '))); }); });
        return out.filter(function (w) { return w.length; });
    }
    function matches(name, text) { return variants(text).some(function (w) { return nameHas(name, w); }); }

    // ---------------------------------------------------------------- the data (loaded once, when it is first needed)
    var dataP = null;
    function data() {
        if (!dataP) dataP = fetch(DATA_URL).then(function (r) { return r.text(); }).then(parse);
        return dataP;
    }
    function absolute(el) {
        [el].concat(Array.prototype.slice.call(el.querySelectorAll('[href],[src],[srcset],[data-src],[poster]'))).forEach(function (n) {
            ['href', 'src', 'poster', 'data-src'].forEach(function (a) {
                var v = n.getAttribute(a);
                if (v && !/^(https?:|data:|#|mailto:|tel:|javascript:|\/)/.test(v)) n.setAttribute(a, new URL(v, DATA_URL).href);
            });
            var ss = n.getAttribute('srcset');
            if (ss) n.setAttribute('srcset', ss.split(',').map(function (p) { var b = p.trim().split(/\s+/); if (b[0] && !/^(https?:|data:|\/)/.test(b[0])) b[0] = new URL(b[0], DATA_URL).href; return b.join(' '); }).join(', '));
        });
        return el;
    }
    function parse(html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var facts = JSON.parse(doc.querySelector('[data-pv-facts]').textContent);
        function tpl(name) { var t = doc.querySelector('template[data-pv="' + name + '"]'); return t ? Array.prototype.map.call(t.content.children, absolute) : []; }
        var D = { facts: facts, tpl: tpl, units: [], projects: [], bySlug: {}, projBySlug: {}, links: {}, typeLinks: {} };
        facts.units.forEach(function (u) { u.slugs.forEach(function (s) { D.bySlug[s] = u; }); });
        facts.projects.forEach(function (p) { p.slugs.forEach(function (s) { D.projBySlug[s] = p; }); });
        tpl('units').forEach(function (el) { var f = D.bySlug[el.getAttribute('data-slug')]; if (f) D.units.push({ el: el, f: f }); });
        tpl('projects').forEach(function (el) { var f = D.projBySlug[el.getAttribute('data-slug')]; if (f) D.projects.push({ el: el, f: f }); });
        tpl('links').forEach(function (a) {
            if (a.getAttribute('data-pv-item')) D.links[a.getAttribute('data-pv-item')] = { url: a.getAttribute('href'), image: (a.querySelector('img') || {}).getAttribute && a.querySelector('img').getAttribute('src') };
            if (a.getAttribute('data-pv-type')) D.typeLinks[a.getAttribute('data-pv-type')] = a.getAttribute('href');
            if (a.hasAttribute('data-pv-fallback')) D.fallbackImg = (a.querySelector('img') || {}).getAttribute ? a.querySelector('img').getAttribute('src') : '';
        });
        D.typeById = {}; D.typeBySeg = {};
        Object.keys(facts.types).forEach(function (k) { var t = facts.types[k]; (t.ids || [t.id]).forEach(function (id) { D.typeById[id] = k; }); D.typeBySeg[String(t.seg).toLowerCase()] = k; });
        D.projectNames = {}; facts.projects.forEach(function (p) { D.projectNames[p.id] = p.n; });
        return D;
    }

    // ---------------------------------------------------------------- the choices (same reading as ListingFilters::fromQuery)
    function readParams(params, D) {
        var sel = {}; LISTS.forEach(function (k) { sel[k] = []; });
        params.forEach(function (value, name) {
            var key = name.replace(/\[\d*\]$/, ''); key = LEGACY[key] || key;
            if (IGNORE.indexOf(key) !== -1) return;
            value = String(value).trim(); if (value === '') return;
            if (key === 'sale_type' || key === 'status') { var m = { rent: 'rent', resale: 'resale', developer_sale: 'developer' }; if (m[value]) sel.offer = m[value]; return; }
            if (LISTS.indexOf(key) !== -1) sel[key].push(value); else sel[key] = value;
        });
        var f = D.facts;
        sel.type = sel.type.map(function (v) { return /^\d+$/.test(v) ? D.typeById[+v] : (f.types[v] ? v : D.typeBySeg[v.toLowerCase()]); }).filter(Boolean);
        sel.area = sel.area.map(function (v) { return /^\d+$/.test(v) ? +v : f.areaSlugs[v.toLowerCase()]; }).filter(Boolean);
        sel.developer = sel.developer.map(function (v) { if (/^\d+$/.test(v)) return +v; var id = null; Object.keys(f.devs).forEach(function (d) { if (f.devs[d].slugs.indexOf(v) !== -1) id = +d; }); return id; }).filter(Boolean);
        sel.project = sel.project.map(function (v) { return /^\d+$/.test(v) ? +v : (D.projBySlug[v] || {}).id; }).filter(Boolean);
        ['bedrooms', 'bathrooms', 'finishing', 'amenities'].forEach(function (k) { sel[k] = sel[k].filter(function (v) { return /^\d+$/.test(v); }).map(Number); });
        sel.delivery = sel.delivery.map(function (v) { v = v.toLowerCase(); return v === '1' ? 'ready' : v; }).filter(function (v) { return v === 'ready' || /^(19|20)\d\d$/.test(v); });
        sel.years = sel.years.map(function (v) { v = v.trim(); return (v === '9+' || +v >= 9) ? '9+' : v; }).filter(function (v) { return v === '9+' || /^\d+$/.test(v); });
        NUMBERS.forEach(function (k) { if (sel[k] !== undefined) { var n = parseFloat(String(sel[k]).replace(/[^\d.]/g, '')); if (n > 0) sel[k] = n; else delete sel[k]; } });
        if (['developer', 'resale', 'rent'].indexOf(sel.offer) === -1) delete sel.offer;
        if (['furnished', 'unfurnished'].indexOf(sel.furnished) === -1) delete sel.furnished;
        return sel;
    }
    // «شقة في التجمع»: the type in the words is a type filter, the rest is searched (App\Shary\SmartSearch::types)
    function saidType(text, D) {
        var t = ' ' + fold(text) + ' ', keys = [];
        Object.keys(D.facts.typeWords).sort(function (a, b) { return b.length - a.length; }).forEach(function (w) {
            if (w.length >= 3 && t.indexOf(' ' + fold(w) + ' ') !== -1) { keys = keys.concat(D.facts.typeWords[w]); t = t.replace(' ' + fold(w) + ' ', ' '); }
        });
        return { keys: keys.filter(function (k, i) { return keys.indexOf(k) === i; }), rest: words(t).join(' ') };
    }
    function areaIds(D, ids) { var out = []; ids.forEach(function (id) { ((D.facts.areas[id] || {}).kids || [id]).forEach(function (k) { if (out.indexOf(k) === -1) out.push(k); }); }); return out; }
    // the unit's area and every area it sits in («التجمع» finds the units of New Cairo's sub-areas too — like ListingFilters::smartHits + Areas::withChildren)
    function areaNames(D, id) {
        if (!D.parentOf) { D.parentOf = {}; Object.keys(D.facts.areas).forEach(function (k) { ((D.facts.areas[k] || {}).kids || []).forEach(function (kid) { if (+kid !== +k) D.parentOf[kid] = +k; }); }); }
        var out = [], seen = {};
        while (id && !seen[id]) { seen[id] = 1; out.push((D.facts.areas[id] || {}).n || ''); id = D.parentOf[id]; }
        return out.join(' ');
    }
    function placeName(D, u) { return [D.projectNames[u.c] || '', areaNames(D, u.a), (D.facts.devs[u.cd || u.dv] || {}).n || ''].join(' '); }

    // ---------------------------------------------------------------- one unit against the choices (App\Shary\Data\ListingFilters\UnitQuery)
    function unitFits(u, sel, D, base) {
        var offer = sel.offer || '';
        var rent = base === 'rent' || offer === 'rent';
        if (rent ? u.k !== 'rent' : u.k === 'rent') return false;
        if (!rent && offer === 'resale' && u.k !== 'resale') return false;
        if (sel.type.length && sel.type.indexOf(u.t) === -1) return false;
        if (sel.bedrooms.length && sel.bedrooms.indexOf(u.b) === -1) return false;
        if (sel.bathrooms.length && sel.bathrooms.indexOf(u.ba) === -1) return false;
        if (sel.finishing.length && sel.finishing.indexOf(u.fi) === -1) return false;
        if (sel.furnished === 'furnished' && !u.fu) return false;
        if (sel.furnished === 'unfurnished' && u.fu) return false;
        if (sel.delivery.length) {
            var year = D.facts.year, d = String(u.d || ''), isReady = READY.indexOf(d) !== -1 || (+d >= 1900 && +d < year);
            var past = sel.delivery.some(function (v) { return v !== 'ready' && +v < year; });
            if (!(sel.delivery.indexOf(d) !== -1 || ((sel.delivery.indexOf('ready') !== -1 || past) && isReady))) return false;
        }
        if (sel.years.length) {
            var y = Math.floor(u.y || 0);
            if (!sel.years.some(function (v) { return v === '9+' ? y >= 9 : (+v === 0 ? !u.y : +v === y); })) return false;
        }
        function range(v, min, max) { if (min === undefined && max === undefined) return true; if (v === null || v === undefined) return false; return (min === undefined || v >= min) && (max === undefined || v <= max); }
        if (!range(u.p, sel.price_min, sel.price_max)) return false;
        if (!range(u.s, sel.size_min, sel.size_max)) return false;
        if (!range(u.dp, undefined, sel.down_payment)) return false;
        if (!range(u.m, undefined, sel.monthly_installment)) return false;
        if (sel.amenities.length && !sel.amenities.every(function (a) { return u.am.indexOf(a) !== -1; })) return false;
        if (sel.area.length && areaIds(D, sel.area).indexOf(u.a) === -1) return false;
        if (sel.project.length && sel.project.indexOf(u.c) === -1) return false;
        if (sel.developer.length && sel.developer.indexOf(u.dv) === -1 && sel.developer.indexOf(u.cd) === -1) return false;
        if (sel.q && !(matches(u.n, sel.q) || matches(placeName(D, u), sel.q))) return false;
        var place = sel.area.length || sel.project.length || sel.developer.length || sel.q;
        if (!place && u.ab) return false;
        return true;
    }
    function withSaidType(sel, D) {
        if (!sel.q) return sel;
        var said = saidType(sel.q, D);
        if (said.keys.length) { said.keys.forEach(function (k) { if (sel.type.indexOf(k) === -1) sel.type.push(k); }); sel.q = said.rest; }
        return sel;
    }
    var UNIT_KEYS = ['type', 'bedrooms', 'bathrooms', 'finishing', 'furnished', 'delivery', 'years', 'price_min', 'price_max', 'size_min', 'size_max', 'down_payment', 'monthly_installment'];
    function hasUnitFilters(sel) { return UNIT_KEYS.some(function (k) { return Array.isArray(sel[k]) ? sel[k].length : sel[k] !== undefined; }) || sel.offer === 'resale' || sel.offer === 'rent'; }
    function projectFits(p, sel, D, areaRules) {
        if (sel.area.length && areaIds(D, sel.area).indexOf(p.a) === -1) return false;
        if (sel.project.length && sel.project.indexOf(p.id) === -1) return false;
        if (sel.developer.length && sel.developer.indexOf(p.dv) === -1) return false;
        if (sel.q && !(matches(p.n, sel.q) || matches(((D.facts.areas[p.a] || {}).n || '') + ' ' + ((D.facts.devs[p.dv] || {}).n || ''), sel.q))) return false;
        if (!(sel.area.length || sel.project.length || sel.developer.length || sel.q) && p.ab) return false;
        if (hasUnitFilters(sel) || (areaRules && sel.offer !== 'developer' && sel.offer)) {
            var unitSel = Object.assign({}, sel, { area: [], project: [], developer: [], q: '' });
            // صفحة المنطقة / المطور (AreaPage::saleScope): «وحدات المطور» = بيع المطور بس (من غير إعادة البيع)
            if (!D.facts.units.some(function (u) { return u.c === p.id && (!areaRules || (sel.offer || 'developer') !== 'developer' || u.k !== 'resale') && unitFits(u, unitSel, D, 'sale'); })) return false;
        }
        return true;
    }
    function sortUnits(list, sel) {
        var by = sel.sort || '', resale = sel.offer === 'resale';
        list.sort(function (a, b) {
            var x = a.f, y = b.f;
            if (by === 'price_asc' || by === 'price_desc') { var px = x.p === null ? Infinity : x.p, py = y.p === null ? Infinity : y.p; if (px !== py) return by === 'price_asc' ? px - py : (py === Infinity ? -1 : px === Infinity ? 1 : py - px); }
            if (by === 'installment_asc' || by === 'installment_desc') { var mx = x.m || Infinity, my = y.m || Infinity; if (mx !== my) return by === 'installment_asc' ? mx - my : my - mx; }
            if (by === 'delivery') { var rx = READY.indexOf(String(x.d)) !== -1 ? 0 : (+x.d || 9999), ry = READY.indexOf(String(y.d)) !== -1 ? 0 : (+y.d || 9999); if (rx !== ry) return rx - ry; }
            return (y.ts - x.ts) || (y.id - x.id);
        });
        return list;
    }

    // ---------------------------------------------------------------- what this page lists (from its address — like the routes of the site)
    function scope(D) {
        var file = decodeURIComponent(location.pathname).replace(/\/+$/, '').replace(/\.html$/, '');
        var m = file.match(/\/(ar|en)\/v2(?:\/(.*))?$/), path = m ? (m[2] || '') : '';
        var base = { kind: '', sel: {} };
        var s;
        if ((s = path.match(/^for-sale(?:--offer-(resale|rent))?$/))) base = { kind: 'units', base: 'sale', sel: s[1] ? { offer: s[1] } : {} };
        else if ((s = path.match(/^for-sale\/([^/]+)(?:\/([^/]+))?$/))) { base = { kind: 'units', base: 'sale', sel: {} }; var t = D.typeBySeg[s[1].toLowerCase()]; if (t) base.sel.type = [t]; if (s[2] && D.facts.areaSlugs[s[2].toLowerCase()]) base.sel.area = [D.facts.areaSlugs[s[2].toLowerCase()]]; }
        else if ((s = path.match(/^for-rent(?:--furnished-(furnished|unfurnished))?$/))) base = { kind: 'units', base: 'rent', sel: s[1] ? { furnished: s[1] } : {} };
        else if (path === 'projects') base = { kind: 'projects', sel: {} };
        else if ((s = path.match(/^area\/([^/]+)$/)) && D.facts.areaSlugs[s[1].toLowerCase()]) base = { kind: 'projects', areaPage: true, sel: { area: [D.facts.areaSlugs[s[1].toLowerCase()]] } };
        else if ((s = path.match(/^developer-details\/([^/]+)$/))) {
            Object.keys(D.facts.devs).forEach(function (d) { if (D.facts.devs[d].slugs.indexOf(s[1]) !== -1) base = { kind: 'dev', dev: d, sel: { developer: [+d] } }; });
        }
        else if (path === 'offers') base = { kind: 'offers', sel: {} };
        return base;
    }
    function merge(sel, extra) { Object.keys(extra).forEach(function (k) { if (Array.isArray(extra[k])) extra[k].forEach(function (v) { if (sel[k].indexOf(v) === -1) sel[k].push(v); }); else if (sel[k] === undefined) sel[k] = extra[k]; }); return sel; }

    // ---------------------------------------------------------------- showing the result in the page's own list
    function show(grid, items, counters, empties) {
        Array.prototype.slice.call(grid.children).forEach(function (c) { c.remove(); });
        items.forEach(function (item) { grid.appendChild(item.cloneNode(true)); });
        counters.forEach(function (sel) { document.querySelectorAll(sel).forEach(function (n) { n.textContent = items.length.toLocaleString('en'); }); });
        empties.forEach(function (sel) { document.querySelectorAll(sel).forEach(function (n) { n.classList.toggle('hidden', items.length > 0); }); });
        document.querySelectorAll('[data-pagination], [data-infinite], [data-auto-sentinel], [data-units-sentinel], .search-more').forEach(function (n) { n.style.display = 'none'; });
        if (window.SharyCards && window.SharyCards.refresh) window.SharyCards.refresh(grid);
        grid.dispatchEvent(new CustomEvent('shary:list-replaced', { bubbles: true }));
    }
    function run(params) {
        return data().then(function (D) {
            var base = scope(D); if (!base.kind || base.kind === 'offers') return;
            var sel = merge(withSaidType(readParams(params, D), D), base.sel);
            if (base.kind === 'units') {
                var grid = document.querySelector('[data-results]'); if (!grid) return;
                var list = sortUnits(D.units.filter(function (it) { return unitFits(it.f, sel, D, base.base); }), sel);
                show(grid, list.map(function (it) { return it.el; }), ['[data-results-count]'], ['[data-results-empty]']);
            } else {
                var g = document.querySelector('[data-projects-grid]') || document.querySelector('[data-results]'); if (!g) return;
                var pool = base.kind === 'dev' ? D.tpl('dev-' + base.dev).map(function (el) { return { el: el, f: D.projBySlug[el.getAttribute('data-slug')] }; }).filter(function (it) { return it.f; }) : D.projects;
                var areaRules = base.kind === 'dev' || !!base.areaPage;
                var picked = pool.filter(function (it) { return projectFits(it.f, sel, D, areaRules); });
                show(g, picked.map(function (it) { return it.el; }), ['[data-results-count]', '[data-projects-count]', '[data-collection-count]'], ['[data-results-empty]', '[data-projects-empty]']);
            }
        });
    }
    function own(form) {
        var action = form.getAttribute('action') || location.href;
        var a = new URL(action, location.href), here = new URL(location.href);
        var clean = function (u) { return decodeURIComponent(u.pathname).replace(/\.html$/, '').replace(/\/+$/, ''); };
        return clean(a) === clean(here);
    }
    function formParams(form) {
        var params = new URLSearchParams();
        new FormData(form).forEach(function (value, name) { if (typeof value === 'string' && value !== '') params.append(name, value); });
        return params;
    }
    // a filter form of this page: filtered here (the in-place filtering script needs the server)
    document.addEventListener('shary:filter', function (event) {
        var form = event.target;
        if (!form || form.tagName !== 'FORM' || !own(form)) return;
        event.preventDefault(); event.stopImmediatePropagation();
        var params = formParams(form);
        var url = new URL(location.href); url.search = params.toString();
        history.pushState({ sharyPreview: true }, '', url.href);
        run(params);
    }, true);

    // the page was opened with choices in its address (a link, the home search, the filter window of another page)
    function restore() {
        var params = new URLSearchParams(location.search);
        var useful = false; params.forEach(function (v, k) { if (IGNORE.indexOf(k.replace(/\[\d*\]$/, '')) === -1 && v !== '') useful = true; });
        if (!useful) return;
        // the form shows the same choices
        document.querySelectorAll('form').forEach(function (form) {
            if (!own(form)) return;
            params.forEach(function (value, name) {
                var key = name.replace(/\[\d*\]$/, ''); key = LEGACY[key] || key;
                form.querySelectorAll('input[name="' + key + '[]"], input[name="' + key + '"]').forEach(function (input) {
                    if ((input.type === 'checkbox' || input.type === 'radio') && input.value === value) input.checked = true;
                    else if (input.type !== 'checkbox' && input.type !== 'radio' && NUMBERS.indexOf(key) !== -1) input.value = value;
                });
                form.querySelectorAll('input[name="q"]').forEach(function (input) { if (key === 'q') input.value = value; });
            });
            form.dispatchEvent(new CustomEvent('shary:filter-restored', { bubbles: true }));
        });
        run(params);
    }
    window.addEventListener('popstate', function () { restore(); });

    // ---------------------------------------------------------------- the offers page: the lists follow each other (OffersData::available)
    function offersPage(D) {
        var form = document.querySelector('[data-offers-filter]'), grid = document.querySelector('[data-projects-grid]');
        if (!form || !grid) return;
        var cards = D.tpl('offers'), rows = D.facts.offers;
        function apply(detail, push) {
            var sel = { area: detail.area || [], developer: detail.developer || [], offer: detail.offer || [] };
            function fits(row, skip) {
                return ['area', 'developer'].every(function (g) { return g === skip || !sel[g].length || sel[g].indexOf(row[g]) !== -1; })
                    && (skip === 'offer' || !sel.offer.length || row.offer.some(function (k) { return sel.offer.indexOf(k) !== -1; }));
            }
            var shown = [], avail = { area: {}, developer: {}, offer: {} };
            rows.forEach(function (row, i) {
                if (row && fits(row, '') && cards[i]) shown.push(cards[i]);
                if (!row) return;
                ['area', 'developer'].forEach(function (g) { if (row[g] && fits(row, g)) avail[g][row[g]] = true; });
                if (fits(row, 'offer')) row.offer.forEach(function (k) { avail.offer[k] = true; });
            });
            Object.keys(sel).forEach(function (g) { sel[g].forEach(function (k) { avail[g][k] = true; }); });
            show(grid, shown, ['[data-offers-count]'], ['[data-offers-empty]']);
            // every list shows only what still has offers with the other choices (the chosen ones stay)
            form.querySelectorAll('select').forEach(function (select) {
                var g = select.name.replace('[]', '');
                Array.prototype.forEach.call(select.options, function (o) { var ok = !o.value || avail[g][o.value]; o.hidden = !ok; o.disabled = !ok; });
                var box = select.closest('[data-select]');
                if (box) box.querySelectorAll('[data-select-list] [data-value]').forEach(function (li) { var v = li.getAttribute('data-value'); li.hidden = !!v && !avail[g][v]; });
            });
            if (push) {
                var url = new URL(location.href), p = new URLSearchParams();
                ['area', 'developer', 'offer'].forEach(function (g) { sel[g].forEach(function (v) { p.append(g + '[]', v); }); });
                url.search = p.toString(); history.pushState({ sharyPreview: true }, '', url.href);
            }
        }
        form.addEventListener('shary:offers-filter', function (event) { event.preventDefault(); apply(event.detail || {}, true); });
        var params = new URLSearchParams(location.search), first = { area: [], developer: [], offer: [] }, any = false;
        params.forEach(function (v, k) { var g = k.replace(/\[\d*\]$/, ''); if (first[g]) { first[g].push(v); any = true; } });
        if (any) {
            form.querySelectorAll('select').forEach(function (select) {
                var g = select.name.replace('[]', '');
                Array.prototype.forEach.call(select.options, function (o) { o.selected = first[g].indexOf(o.value) !== -1; });
                select.dispatchEvent(new Event('change', { bubbles: false }));
                var box = select.closest('[data-select]'); if (box) box.dispatchEvent(new CustomEvent('shary:select-refresh'));
            });
        }
        apply(first, false);
    }

    // ---------------------------------------------------------------- search boxes (HomeData::search and the project's own search)
    function homeSearch(D, q, page) {
        q = String(q || '').trim(); var items = [];
        var said = saidType(q, D);
        if (said.keys.length) {
            var city = null;
            if (said.rest) D.facts.search.some(function (it) { if (it.type === 'area' && matches(it.name, said.rest)) { city = it; return true; } return false; });
            said.keys.forEach(function (k) {
                var t = D.facts.types[k]; if (!t) return;
                var n = D.facts.units.filter(function (u) { return u.k !== 'rent' && u.t === k && (!city || areaIds(D, [city.id]).indexOf(u.a) !== -1) && (city || !u.ab); }).length;
                var url = D.typeLinks[k] || '#';
                items.push({ id: 'type-' + k, type: 'unit-type', name: t.label + (city ? ' — ' + city.name : ''), image: D.fallbackImg || '', location: (en ? n + ' units' : n + ' وحدة'), url: url + (city ? '?area[]=' + city.id : '') });
            });
            q = said.rest;
            if (!q) return { data: page === 1 ? items : [], pagination: { current_page: page, last_page: 1, per_page: 10, total: items.length, has_more: false } };
        }
        var found = D.facts.search.filter(function (it) { return !q || matches(it.name, q); }).map(function (it) {
            var l = D.links[it.type + ':' + it.id] || {}; return Object.assign({}, it, { url: l.url || '#', image: l.image || '' });
        });
        var rank = { area: 0, developer: 1, project: 2 };
        if (q) found.sort(function (a, b) { var x = fold(a.name).indexOf(fold(q)) === 0 ? 0 : 1, y = fold(b.name).indexOf(fold(q)) === 0 ? 0 : 1; return (x - y) || (rank[a.type] - rank[b.type]); });
        var all = items.concat(found), per = 10, last = Math.max(1, Math.ceil(all.length / per));
        return { data: all.slice((page - 1) * per, page * per), pagination: { current_page: page, last_page: last, per_page: per, total: all.length, has_more: page < last } };
    }
    function projectSuggest(D, projectId, q) {
        var out = [];
        D.units.forEach(function (it) {
            if (it.f.c !== +projectId || out.length >= 8) return;
            var title = (it.el.querySelector('h3, [data-title]') || {}).textContent || it.f.n;
            if (!matches(it.f.n + ' ' + title, q)) return;
            var link = it.el.querySelector('a[href]'), price = (it.el.querySelector('[data-price], .unit-card__price') || {}).textContent || '';
            out.push({ title: String(title).trim(), sub: String(price).trim(), url: link ? link.href : '#' });
        });
        return out;
    }
    var realFetch = window.fetch ? window.fetch.bind(window) : null;
    if (realFetch) window.fetch = function (input, init) {
        var url = typeof input === 'string' ? input : (input && input.url) || '';
        var u; try { u = new URL(url, location.href); } catch (e) { return realFetch(input, init); }
        var path = decodeURIComponent(u.pathname);
        var json = function (body) { return new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }); };
        if (/\/shary\/home\/search(\.html)?$/.test(path)) return data().then(function (D) { return json(homeSearch(D, u.searchParams.get('q') || u.searchParams.get('search') || '', Math.max(1, +(u.searchParams.get('page') || 1)))); });
        var pm = path.match(/\/shary\/project\/(\d+)\/suggest(\.html)?$/);
        if (pm) return data().then(function (D) { return json(projectSuggest(D, pm[1], u.searchParams.get('q') || '')); });
        return realFetch(input, init);
    };

    function boot() {
        restore();
        if (document.querySelector('[data-offers-filter]')) data().then(offersPage);
        // load the data early on pages that can filter or search, so the first choice answers at once
        if (document.querySelector('[data-filter-sheet], [data-offers-filter], #heroSearchInput, [data-strip-suggest-url]')) setTimeout(function () { data(); }, 1500);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
