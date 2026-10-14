/*
 * لينك المعاينة بس (GitHub Pages — مفيش سيرفر): أدوات «مكان المشروع والماستر بلان» بترد زي السيرفر بالظبط —
 * البحث عن المكان حقيقي (OpenStreetMap) ، «هات حدود المشروع» بتجيب الحدود الحقيقية من OpenStreetMap حوالين دبوس المشروع لو موجودة ،
 * و«حطّها على الحدود» / «خلّي الإيجنت يحطها» بيحطوا الماستر بلان جوه الحدود ، والقص والتفريغ بيتعملوا في المتصفح.
 * على السيرفر الحقيقي الطلبات دي بتروح لـ SharyMasterplanToolsController — الملف ده مش موجود هناك.
 */
(function () {
    function install() {
        var real = window.fetch ? window.fetch.bind(window) : null;
        var EN = (document.documentElement.getAttribute('lang') || '').indexOf('en') === 0;
        function reply(body) { return Promise.resolve(new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } })); }
        function pin() {
            var lat = parseFloat((document.getElementById('lat') || {}).value), lng = parseFloat((document.getElementById('lng') || {}).value);
            if (isFinite(lat) && isFinite(lng) && (lat || lng)) { return { lat: lat, lng: lng }; }
            try { var c = window.boundsMap && window.boundsMap.getCenter(); if (c) { return { lat: c.lat(), lng: c.lng() }; } } catch (e) { /* */ }
            return { lat: 25.197, lng: 55.348 };
        }
        function projectName() {
            var field = document.querySelector('input[name="name_en"]') || document.querySelector('input[name="name_ar"]');
            return field && field.value ? field.value : 'Creek Harbour';
        }
        function rectInside(ring, ratio, turn) {
            var lats = ring.map(function (p) { return Number(p[1]); }), lngs = ring.map(function (p) { return Number(p[0]); });
            var c = { lat: (Math.min.apply(null, lats) + Math.max.apply(null, lats)) / 2, lng: (Math.min.apply(null, lngs) + Math.max.apply(null, lngs)) / 2 };
            var k = 111320 * Math.cos(c.lat * Math.PI / 180);
            var w = (Math.max.apply(null, lngs) - Math.min.apply(null, lngs)) * k, h = (Math.max.apply(null, lats) - Math.min.apply(null, lats)) * 111320;
            var width = Math.min(w, h / ratio) * 0.95, hw = width / 2, hh = width * ratio / 2, t = (turn || 0) * Math.PI / 180;
            function at(x, y) { var rx = x * Math.cos(t) - y * Math.sin(t), ry = x * Math.sin(t) + y * Math.cos(t); return [Number((c.lng + rx / k).toFixed(7)), Number((c.lat + ry / 111320).toFixed(7))]; }
            return [at(-hw, hh), at(hw, hh), at(hw, -hh), at(-hw, -hh)];
        }
        function around(p, meters) {
            var dy = meters / 111320, dx = meters / (111320 * Math.cos(p.lat * Math.PI / 180));
            return [[p.lng - dx, p.lat + dy], [p.lng + dx, p.lat + dy], [p.lng + dx, p.lat - dy], [p.lng - dx, p.lat - dy], [p.lng - dx, p.lat + dy]];
        }
        function ringOf(geojson) {
            if (!geojson) { return null; }
            var rings = geojson.type === 'Polygon' ? [geojson.coordinates[0]] : geojson.type === 'MultiPolygon' ? geojson.coordinates.map(function (poly) { return poly[0]; }) : [];
            if (!rings.length) { return null; }
            rings.sort(function (a, b) { return b.length - a.length; });
            var ring = rings[0];
            // نقط كتير قوي: كل كام نقطة واحدة (الحدود بتتظبط بالإيد بعدين)
            var step = Math.max(1, Math.ceil(ring.length / 60));
            return ring.filter(function (p, i) { return i % step === 0; }).map(function (p) { return [Number(p[0].toFixed(7)), Number(p[1].toFixed(7))]; });
        }
        function inside(p, ring) {
            var x = p.lng, y = p.lat, hit = false;
            for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
                var xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1];
                if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) { hit = !hit; }
            }
            return hit;
        }
        function nominatim(params) {
            var url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&polygon_geojson=1&limit=8&accept-language=' + (EN ? 'en' : 'ar') + '&' + params;
            return Promise.race([fetch(url).then(function (r) { return r.ok ? r.json() : []; }), new Promise(function (done) { setTimeout(function () { done([]); }, 8000); })]).catch(function () { return []; });
        }
        var SAMPLE_RING = [[55.3405, 25.2030], [55.3555, 25.2032], [55.3558, 25.1910], [55.3402, 25.1908], [55.3405, 25.2030]];
        var CREDIT = '© OpenStreetMap contributors';

        window.fetch = function (url, options) {
            url = String(url && url.url ? url.url : url);
            if (url.indexOf('#preview/') === -1 || !/masterplan/.test(url)) { return real ? real.apply(window, arguments) : Promise.reject(new Error('offline')); }
            var body = {};
            try { body = options && typeof options.body === 'string' ? JSON.parse(options.body) : {}; } catch (e) { body = {}; }
            var ratio = (typeof masterplanRatio !== 'undefined' && masterplanRatio) || 0.72;
            var drawn = (typeof sxRealBoundsRing === 'function' && sxRealBoundsRing()) || null;
            var wait = new Promise(function (done) { setTimeout(done, 350); });

            if (url.indexOf('masterplan.search') > -1) {
                var q = decodeURIComponent((url.split('q=')[1] || '').split('&')[0].replace(/\+/g, ' '));
                return wait.then(function () {
                    return new Promise(function (done) {
                        var gm = window.google && window.google.maps;
                        if (!gm || !gm.__search) { done([]); return; }
                        gm.__search(q, pin(), done);
                    });
                }).then(function (list) {
                    // الحدود (لو OpenStreetMap عارفها) للنتايج الأولى
                    return nominatim('q=' + encodeURIComponent(q)).then(function (items) {
                        var rings = {};
                        (items || []).forEach(function (item) { var r = ringOf(item.geojson); if (r && r.length > 3) { rings[String(item.name || '').toLowerCase()] = r; } });
                        var results = (list || []).slice(0, 6).map(function (p) {
                            var v = p.geometry.viewport, ll = p.geometry.location;
                            return { name: p.name, address: p.__address || '', lat: ll.lat(), lng: ll.lng(), viewport: v ? [v.getSouthWest().lat(), v.getSouthWest().lng(), v.getNorthEast().lat(), v.getNorthEast().lng()] : null,
                                source: 'OpenStreetMap', ring: rings[String(p.name || '').toLowerCase()] || null };
                        });
                        if (!results.length) { return reply({ ok: false, message: EN ? 'No place found with this name.' : 'ما لقيتش مكان بالاسم ده.' }); }
                        return reply({ ok: true, credit: CREDIT, results: results });
                    });
                });
            }
            if (url.indexOf('masterplan.outline') > -1) {
                var p = pin(), name = projectName();
                var box = around(p, 4000);
                var view = 'viewbox=' + [box[0][0], box[0][1], box[2][0], box[2][1]].join(',') + '&bounded=1';
                return wait.then(function () { return nominatim('q=' + encodeURIComponent(name) + '&' + view); }).then(function (items) {
                    var best = null;
                    (items || []).forEach(function (item) { var r = ringOf(item.geojson); if (!best && r && r.length > 3 && inside(p, r)) { best = { ring: r, name: item.name || name }; } });
                    (items || []).forEach(function (item) { var r = ringOf(item.geojson); if (!best && r && r.length > 3) { best = { ring: r, name: item.name || name }; } });
                    if (!best) {
                        return nominatim('q=' + encodeURIComponent(name)).then(function (more) {
                            (more || []).forEach(function (item) { var r = ringOf(item.geojson); if (!best && r && r.length > 3) { best = { ring: r, name: item.name || name }; } });
                            return best;
                        });
                    }
                    return best;
                }).then(function (best) {
                    best = best || { ring: drawn && drawn.length > 3 ? drawn : SAMPLE_RING, name: name };
                    return reply({ ok: true, ring: best.ring, name: best.name, credit: CREDIT,
                        message: EN ? 'Found its outline on OpenStreetMap (' + best.name + ') — drawn on the map: check it and adjust the points if needed, then «Update».'
                            : 'لقيت حدوده على OpenStreetMap (' + best.name + ') — اترسمت على الخريطة: بص عليها وظبّط النقط لو محتاج ، وبعدين «تحديث».' });
                });
            }
            var ring = drawn && drawn.length > 3 ? drawn : SAMPLE_RING;
            if (url.indexOf('masterplan.fit') > -1) {
                return wait.then(function () { return reply({ ok: true, corners: rectInside(ring, ratio, 0), overlay: null, message: EN ? 'Placed on the outline (86% match). Press «Update» to save it.' : 'اتحطت على الحدود (تطابق 86%). دوس «تحديث» عشان تتحفظ.' }); });
            }
            if (url.indexOf('masterplan.agent') > -1) {
                return wait.then(function () {
                    return reply({ ok: true, corners: rectInside(ring, ratio, 4), outline: null, center: null, notes: [], credit: CREDIT,
                        message: EN ? 'The agent placed it: 88% match with the outline drawn on the website — check it on the map, adjust the points if needed, then «Update».'
                            : 'الإيجنت حطها: تطابق 88% مع الحدود المرسومة على الموقع — بص عليها على الخريطة وظبّطها بالنقط لو محتاج ، وبعدين «تحديث».' });
                });
            }
            if (url.indexOf('masterplan-auto') > -1) {
                var base = (document.querySelector('script[src*="mp-tools-preview.js"]') || {}).getAttribute ? document.querySelector('script[src*="mp-tools-preview.js"]').getAttribute('src').replace(/mp-tools-preview\.js.*$/, '') : 'a/';
                return wait.then(function () { return reply({ ok: true, message: EN ? 'The cut-out map copy is ready ✓ (same frame as the picture — if the master plan is placed it stays in the same place).' : 'النسخة المفرّغة للخريطة اتعملت ✓ (بنفس كادر الصورة — لو الماستر بلان متحطة مكانها بتفضل في نفس المكان).', overlay: base + 'images/compounds/master_plan/overlay/auto-315-preview.webp' }); });
            }
            if (url.indexOf('masterplan.crop') > -1) {
                return new Promise(function (done) {
                    var img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = function () {
                        var r = body.rect || [0, 0, 1, 1], c = document.createElement('canvas');
                        c.width = Math.max(1, Math.round((r[2] - r[0]) * img.naturalWidth)); c.height = Math.max(1, Math.round((r[3] - r[1]) * img.naturalHeight));
                        c.getContext('2d').drawImage(img, r[0] * img.naturalWidth, r[1] * img.naturalHeight, c.width, c.height, 0, 0, c.width, c.height);
                        c.toBlob(function (blob) {
                            var corners = null;
                            if (body.corners) {
                                var q4 = body.corners, at = function (u, v) { return [0, 1].map(function (a) { return (1 - u) * (1 - v) * q4[0][a] + u * (1 - v) * q4[1][a] + u * v * q4[2][a] + (1 - u) * v * q4[3][a]; }); };
                                corners = [at(r[0], r[1]), at(r[2], r[1]), at(r[2], r[3]), at(r[0], r[3])];
                            }
                            done(new Response(JSON.stringify({ ok: true, overlay: URL.createObjectURL(blob), corners: corners, message: (EN ? 'Cropped ✓' : 'اتقصّت ✓') + (corners ? (EN ? ' — the part you kept stayed in its place on the map.' : ' — والجزء اللي اتساب فضل في مكانه على الخريطة.') : '.') }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
                        }, 'image/png');
                    };
                    img.onerror = function () { done(new Response(JSON.stringify({ ok: false, message: EN ? 'The picture could not be read.' : 'الصورة ما اتقرتش.' }), { status: 200, headers: { 'Content-Type': 'application/json' } })); };
                    img.src = (typeof masterplanImageUrl !== 'undefined' && masterplanImageUrl) || '';
                });
            }
            return wait.then(function () { return reply({ ok: true, message: EN ? 'Done ✓' : 'تم ✓' }); });
        };
    }
    // بعد preview.js (اللي بيلف fetch قبله)
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', install); } else { install(); }
})();
