// ── masterplans.js · جزء 1 من 5: الحسابات: الإحداثيات والأركان وحدود المشروع (المصدر: resources/js/shary/masterplans/01-geometry.js — عدّل هنا وشغّل tools/minify-assets.sh)
/**
 * الماستر بلان على خريطة شاري التفاعلية (js/shary/map-page.js بيشغّله لوحده لو الملف ده محمّل).
 *
 * القاعدة:
 * 1) مكان الماستر بلان = اللي اتحفظ من أداة الضبط — بيتعرض زي ما هو بالظبط ، كل مرة ، على أي جهاز:
 *      masterplan_corners = 4 نقط [lng, lat] بالترتيب: أعلى-يسار الصورة ، أعلى-يمين ، أسفل-يمين ، أسفل-يسار.
 *      الترتيب ده جواه الدوران والقلب (Flip) والحجم والمكان — ممنوع إعادة ترتيب النقط أو تقريبها.
 *    المكان بييجي من واحد من اتنين (الأول بيكسب):
 *      أ) بيانات المشروع نفسها (masterplan_corners من الـ API / الكنترولر)
 *      ب) ملف الأماكن placementsUrl (الافتراضي /map-data/masterplan-placements.json) — بيطلع من أداة الضبط ويترفع على السيرفر من غير برمجة.
 * 2) كل مشروع له source / layer باسمه (masterplan-source-{id}) — مشروع ما بيمسحش مشروع.
 * 3) تغيير شكل الخريطة (قمر صناعي ⇄ خريطة) بيمسح الطبقات: بترجع كلها في مكانها لوحدها.
 * 4) الجودة: الصورة الأصلية بتتعرض من غير إعادة رسم + نسخة masterplan_hd بتتحمل من زوم hdZoom + دعم Tiles (masterplan_tiles).
 * 5) الذاكرة: بيتحمل اللي في الشاشة بس (من زوم minZoom) بحد أقصى maxActive ، والبعيد بيتشال. المشروع المختار دايمًا معروض.
 * 6) الخفة (موبايل وديسك توب): وهي بعيدة بتتعرض النسخة الخفيفة (masterplan_light — 1280px من السيرفر) والكاملة بتتحمل مع التقريب بس
 *    (وبترجع الخفيفة لما العميل يبعّد) ، الماستر بلان اللي لسه نقطة صغيرة على الشاشة (أقل من minPixels) ما بتتحملش ،
 *    والصور بتتحمل بالدور (parallel في نفس الوقت — المختار والأقرب لنص الشاشة الأول) ، وأي تصغير / تظليل بيتعمل في الخلفية (blob).
 *
 * بيانات كل مشروع (كلها اختيارية ما عدا masterplan):
 *   id ، lat ، lng
 *   masterplan            لينك الصورة (PNG / WebP مفرّغة — الضلع الأكبر 2048 – 4096px)
 *   masterplan_light      نسخة خفيفة من نفس الصورة (أطول ضلع 1280) — للخريطة وهي بعيدة
 *   masterplan_corners    [[lng,lat] × 4]
 *   masterplan_placement  { center:[lng,lat], width_m, height_m, rotation, flip_x, flip_y }   (بديل للأركان)
 *   masterplan_hd         نسخة أعلى دقة (لحد 8192px)
 *   masterplan_tiles      'https://.../{z}/{x}/{y}.png' + masterplan_tiles_meta { bounds:[w,s,e,n], minzoom, maxzoom }
 *   masterplan_version    رقم / تاريخ آخر تعديل (بيتحط ?v= عشان الكاش)
 *   masterplan_opacity    0 – 1 (الافتراضي 1)
 *   boundary              حدود المشروع (مضلع [[lng,lat], ...] أو GeoJSON Polygon) — للمشروع اللي لسه ما اتضبطش بس
 *
 * المشروع اللي لسه ما اتضبطش (من غير أركان محفوظة): unplaced = 'bbox' بيتحط معدول جوه حدود المشروع (تقريبي لحد ما يتضبط بالأداة) ،
 *   'hide' ما بيتعرضش خالص لحد ما يتضبط.
 *
 * التحميل (من غير ما تظهر في مكان غلط وبعدين تتحرك):
 *   - مفيش ماستر بلان بتترسم قبل ما الخريطة وصورها (Tiles) تخلص تحميل خالص (أول حدث idle) ، ولا والخريطة بتتحرك (الحركة الأولى من الكرة للمشروع) ،
 *     ولا قبل ما ملف الأماكن يوصل — فالمكان المحفوظ (الأركان = الدوران والحجم والاتجاه) بيتطبق مرة واحدة بس.
 *   - ولا بتترسم وهي صغيرة قوي (تحت زوم minZoom) حتى للمشروع المختار — مكانها جغرافي (lng/lat) مش بيكسل ، فأي زوم / تحريك بعد كده ما بيغيّرش مكانها.
 *   - أول ما تترسم بتفضل مخفية لحد ما الصورة نفسها تجهز على الخريطة وبعدين بتظهر مرة واحدة في مكانها.
 *
 * الاستخدام:  var mp = SharyMasterplans.attach(map, { projects: function () { return [...]; }, activeId: function () { return id; }, placementsUrl: '...' });
 *            mp.refresh()  ·  mp.reload(id, { masterplan_corners: [...] })  ·  mp.bounds(id)  ·  mp.has(id)  ·  mp.setHidden(id, true)
 */
(function () {
    var R = 6378137;
    function toMerc(p) { return [R * p[0] * Math.PI / 180, R * Math.log(Math.tan(Math.PI / 4 + p[1] * Math.PI / 360))]; }
    function fromMerc(p) { return [p[0] / R * 180 / Math.PI, (2 * Math.atan(Math.exp(p[1] / R)) - Math.PI / 2) * 180 / Math.PI]; }
    function deepJson(value) {
        for (var i = 0; i < 3 && typeof value === 'string'; i++) { try { value = JSON.parse(value); } catch (error) { return null; } }
        return value;
    }
    function wide() { return window.innerWidth > 768; }

    // 4 نقط [lng, lat] بالترتيب TL, TR, BR, BL — من غير أي إعادة ترتيب
    function parseCorners(value) {
        var raw = deepJson(value);
        if (raw && !Array.isArray(raw) && typeof raw === 'object') raw = raw.corners || raw.coordinates || [raw.tl || raw.top_left, raw.tr || raw.top_right, raw.br || raw.bottom_right, raw.bl || raw.bottom_left];
        if (!Array.isArray(raw)) return null;
        if (raw.length === 5) raw = raw.slice(0, 4);
        if (raw.length !== 4) return null;
        var corners = raw.map(function (point) {
            if (Array.isArray(point)) return [Number(point[0]), Number(point[1])];
            if (point && typeof point === 'object') return [Number(point.lng != null ? point.lng : point.lon), Number(point.lat)];
            return [NaN, NaN];
        });
        if (!corners.every(function (c) { return isFinite(c[0]) && isFinite(c[1]) && Math.abs(c[0]) <= 180 && Math.abs(c[1]) <= 85; })) return null;
        var m = corners.map(toMerc), area = 0;
        for (var i = 0; i < 4; i++) { var a = m[i], b = m[(i + 1) % 4]; area += a[0] * b[1] - b[0] * a[1]; }
        return Math.abs(area) > 1 ? corners : null;
    }
    // { center:[lng,lat], width_m, height_m, rotation (درجات مع عقارب الساعة), flip_x, flip_y } ← 4 أركان
    function placementToCorners(value) {
        var p = deepJson(value);
        if (!p || typeof p !== 'object' || Array.isArray(p)) return null;
        var center = Array.isArray(p.center) ? p.center.map(Number) : [Number(p.lng), Number(p.lat)];
        var width = Number(p.width_m), height = Number(p.height_m);
        if (![center[0], center[1], width, height].every(isFinite) || width <= 0 || height <= 0) return null;
        var k = 1 / Math.cos(center[1] * Math.PI / 180), hw = width * k / 2, hh = height * k / 2;
        var t = (Number(p.rotation) || 0) * Math.PI / 180, right = [Math.cos(t), -Math.sin(t)], up = [Math.sin(t), Math.cos(t)], c = toMerc(center);
        function at(sx, sy) { return fromMerc([c[0] + right[0] * hw * sx + up[0] * hh * sy, c[1] + right[1] * hw * sx + up[1] * hh * sy]); }
        var out = [at(-1, 1), at(1, 1), at(1, -1), at(-1, -1)];
        if (p.flip_x) out = [out[1], out[0], out[3], out[2]];
        if (p.flip_y) out = [out[3], out[2], out[1], out[0]];
        return out;
    }
    // متحسبة مرة واحدة لكل مشروع (لحد ما الأركان نفسها تتغير) — الحساب كان بيتعاد لكل مشروع مع كل حركة للخريطة
    function savedCorners(project) {
        if (!project) return null;
        var memo = project.__mpCorners;
        if (memo && memo.c === project.masterplan_corners && memo.p === project.masterplan_placement) return memo.v;
        var value = parseCorners(project.masterplan_corners) || placementToCorners(project.masterplan_placement);
        project.__mpCorners = { c: project.masterplan_corners, p: project.masterplan_placement, v: value };
        return value;
    }
    // حدود المشروع: مضلع [[lng,lat], ...] أو GeoJSON Polygon — ولو النقط مكتوبة [lat,lng] بنعرف من مكان المشروع نفسه
    function polygonOf(project) {
        if (!project) return null;
        var memo = project.__mpRing;
        if (memo && memo.b === project.boundary) return memo.v;
        var value = ringOf(project);
        project.__mpRing = { b: project.boundary, v: value };
        return value;
    }
    function ringOf(project) {
        var raw = deepJson(project && project.boundary);
        if (raw && raw.type === 'Polygon' && Array.isArray(raw.coordinates)) raw = raw.coordinates[0];
        if (raw && raw.type === 'Feature' && raw.geometry && Array.isArray(raw.geometry.coordinates)) raw = raw.geometry.coordinates[0];
        if (!Array.isArray(raw) || raw.length < 3 || !raw.every(function (q) { return Array.isArray(q) && q.length >= 2; })) return null;
        var ring = raw.map(function (q) { return [Number(q[0]), Number(q[1])]; });
        if (!ring.every(function (q) { return isFinite(q[0]) && isFinite(q[1]); })) return null;
        var lat = Number(project.lat), lng = Number(project.lng);
        if (isFinite(lat) && isFinite(lng) && (lat || lng)) {
            var cx = ring.reduce(function (s, q) { return s + q[0]; }, 0) / ring.length, cy = ring.reduce(function (s, q) { return s + q[1]; }, 0) / ring.length;
            if (Math.hypot(cx - lat, cy - lng) < Math.hypot(cx - lng, cy - lat)) ring = ring.map(function (q) { return [q[1], q[0]]; });
        }
        return ring;
    }
    function boxOf(points) {
        var xs = points.map(function (p) { return p[0]; }), ys = points.map(function (p) { return p[1]; });
        return [Math.min.apply(null, xs), Math.min.apply(null, ys), Math.max.apply(null, xs), Math.max.apply(null, ys)];
    }
    function usableImage(url) {
        url = String(url || '').trim().toLowerCase();
        if (!url || /\.pdf(\?|#|$)/.test(url)) return false;
        return !/(placeholder\.com|\/logo\.png|no-image|\/default\.)/.test(url);
    }
    function absolute(url) { try { return new URL(String(url), window.location.href).href; } catch (error) { return String(url || ''); } }

// ── masterplans.js · جزء 2 من 5: ربط الخريطة وملف الأماكن (المصدر: resources/js/shary/masterplans/02-attach-and-places.js — عدّل هنا وشغّل tools/minify-assets.sh)
    function attach(map, options) {
        options = options || {};
        var MP = {
            minZoom: options.minZoom || 9,         // من زوم المنطقة (مش مصر كلها)
            hdZoom: options.hdZoom || 15.5,
            labelZoom: options.labelZoom || 13.5,
            // كل الماستر بلانز اللي في الكادر بتظهر مع بعض (زي ناوي) — بحد أقصى ده (الأقرب لنص الشاشة الأول): كل واحدة صورة على كارت الشاشة
            maxActive: options.maxActive || (wide() ? 40 : 18),
            // وهي كتير مع بعض (بعيد شوية): النسخة الخفيفة (masterplan_light) أو الصورة متصغّرة للمقاس ده — والكاملة بترجع لوحدها مع التقريب (zoom >= hdZoom - 1)
            overviewCap: options.overviewCap || (wide() ? 1280 : 1024),
            // الماستر بلان اللي مقاسها على الشاشة أقل من كده (بيكسل) لسه نقطة: ما بتتحملش لحد ما العميل يقرّب
            minPixels: options.minPixels || 36,
            // كام صورة بتتحمل في نفس الوقت (الباقي بالدور)
            parallel: options.parallel || (wide() ? 4 : 2),
            viewBuffer: options.viewBuffer || 0.5,
            unplaced: options.unplaced || 'bbox',
            rendered: {},          // id -> { token, sourceId, layerId, coords, hd, tiles, saved }
            hidden: {},
            failed: {},
            placements: {}
        };
        var maxTexture = 0, retryTimer = null, retries = 0, styleTimer = null, dead = false;
        // الخريطة خلّصت تحميل (أول idle) + ملف الأماكن وصل (أو مفيش ملف) — قبلهم مفيش رسم
        var mapReady = false, placementsDone = !options.placementsUrl;
        function canDraw() {
            if (!mapReady) { try { mapReady = map.loaded(); } catch (error) { mapReady = true; } }
            if (!mapReady || !placementsDone) return false;
            // والخريطة واقفة وصورها (Tiles) اللي في الشاشة خلصت تحميل — لو لسه: الرسم بييجي مع الـ idle الجاي
            try { return !map.isMoving() && (typeof map.areTilesLoaded !== 'function' || map.areTilesLoaded()); } catch (error) { return true; }
        }
        function projects() { return (typeof options.projects === 'function' ? options.projects() : options.projects) || []; }
        function activeId() { return typeof options.activeId === 'function' ? options.activeId() : null; }
        function byId(id) { return projects().filter(function (p) { return String(p.id) === String(id); })[0] || null; }
        function ids(id) { return { sourceId: 'masterplan-source-' + id, layerId: 'masterplan-layer-' + id }; }
        function changed() { if (typeof options.onChange === 'function') options.onChange(Object.keys(MP.rendered)); }

        function textureCap() {
            if (maxTexture) return maxTexture;
            try { var gl = document.createElement('canvas').getContext('webgl'); maxTexture = gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 4096; } catch (error) { maxTexture = 4096; }
            maxTexture = Math.min(maxTexture || 4096, wide() ? 8192 : 4096);
            return maxTexture;
        }
        // صورة أكبر من اللي كارت الشاشة يستحمله: بتتصغّر لأقصى مقاس مسموح (بدل ما تفشل)
        // المرحلة "الظاهرة": الصورة بتتلوّن في المتصفح — باقي الماستر بلان بيغمق (على رسمها المفرّغ بالظبط) والمرحلة نفسها بتفضل بألوانها
        function activeRings(project) {
            var ann = deepJson(project && project.masterplan_annotations);
            return ann && Array.isArray(ann.phases) ? ann.phases.filter(function (phase) { return phase && phase.active && Array.isArray(phase.ring) && phase.ring.length >= 3; }).map(function (phase) { return phase.ring; }) : [];
        }
        function toPixel(quad, point, w, h) {
            // عكس التحويل من أركان الصورة (TL, TR, BR, BL) لمكان النقطة جوه الصورة
            var u = 0.5, v = 0.5;
            for (var i = 0; i < 12; i++) {
                var fx = (1 - u) * (1 - v) * quad[0][0] + u * (1 - v) * quad[1][0] + u * v * quad[2][0] + (1 - u) * v * quad[3][0] - point[0];
                var fy = (1 - u) * (1 - v) * quad[0][1] + u * (1 - v) * quad[1][1] + u * v * quad[2][1] + (1 - u) * v * quad[3][1] - point[1];
                var au = (1 - v) * (quad[1][0] - quad[0][0]) + v * (quad[2][0] - quad[3][0]), av = (1 - u) * (quad[3][0] - quad[0][0]) + u * (quad[2][0] - quad[1][0]);
                var bu = (1 - v) * (quad[1][1] - quad[0][1]) + v * (quad[2][1] - quad[3][1]), bv = (1 - u) * (quad[3][1] - quad[0][1]) + u * (quad[2][1] - quad[1][1]);
                var det = au * bv - av * bu;
                if (!det) break;
                u -= (fx * bv - fy * av) / det; v -= (fy * au - fx * bu) / det;
            }
            return [u * w, v * h];
        }
        // الصورة اللي هتتحط على الخريطة: الصورة نفسها لو مقاسها مناسب ومفيش مرحلة متظللة — وإلا نسخة متصغّرة / متظللة ،
        // بتتعمل في الخلفية (canvas.toBlob — مش toDataURL اللي كان بيوقف الصفحة مع كل ماستر بلان) ← done(لينك ، blob؟)
        function texture(img, limit, project, coords, done) {
            var cap = Math.min(textureCap(), limit || Infinity), w = img.naturalWidth, h = img.naturalHeight, side = Math.max(w, h);
            var rings = coords ? activeRings(project) : [];
            // قريبة من المقاس (لحد 30% أكبر): زي ما هي من غير إعادة رسم
            if (side <= Math.min(cap * 1.3, textureCap()) && !rings.length) { done(img.src, false); return; }
            var canvas = fitTexture(img, cap, project, coords, rings);
            if (!canvas) { done(img.src, false); return; }
            if (canvas.toBlob && window.URL && URL.createObjectURL) {
                try {
                    canvas.toBlob(function (blob) {
                        if (blob) { done(URL.createObjectURL(blob), true); return; }
                        try { done(canvas.toDataURL('image/png'), false); } catch (error) { done(img.src, false); }
                    }, 'image/png');
                    return;
                } catch (error) { /* المتصفح ما بيدعمش — تحت */ }
            }
            try { done(canvas.toDataURL('image/png'), false); } catch (error) { done(img.src, false); }
        }
        function fitTexture(img, cap, project, coords, rings) {
            var w = img.naturalWidth, h = img.naturalHeight;
            try {
                var scale = Math.min(1, cap / Math.max(w, h)), canvas = document.createElement('canvas');
                canvas.width = Math.round(w * scale); canvas.height = Math.round(h * scale);
                var ctx = canvas.getContext('2d');
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                if (rings.length) {
                    ctx.save();
                    ctx.beginPath(); ctx.rect(0, 0, canvas.width, canvas.height);
                    rings.forEach(function (ring) { ring.forEach(function (point, i) { var px = toPixel(coords, [Number(point[0]), Number(point[1])], canvas.width, canvas.height); if (i) ctx.lineTo(px[0], px[1]); else ctx.moveTo(px[0], px[1]); }); ctx.closePath(); });
                    ctx.clip('evenodd');
                    ctx.globalCompositeOperation = 'source-atop';            // بيغمّق الرسم بس — الأجزاء المفرّغة تفضل شفافة
                    ctx.fillStyle = 'rgba(11, 31, 51, 0.58)';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.restore();
                }
                return canvas;
            } catch (error) { return null; }
        }
        function revokeLater(url) {
            if (!url || !/^blob:/.test(url)) return;
            // المكتبة بتقرا الصورة من اللينك بعد ما يتحط — بنسيبه شوية قبل ما يتمسح
            setTimeout(function () { try { URL.revokeObjectURL(url); } catch (error) { /* */ } }, 20000);
        }
        function setBlob(entry, url, isBlob) {
            var old = entry.blob;
            entry.blob = isBlob ? url : null;
            if (old && old !== url) revokeLater(old);
        }
        function loadImage(url, done) {
            var img = new Image(), finished = false;
            var finish = function (value) { if (finished) return; finished = true; done(value); };
            try { if (!/^(data:|blob:)/.test(url) && new URL(url, window.location.href).origin !== window.location.origin) img.crossOrigin = 'anonymous'; } catch (error) { /* لينك غريب */ }
            img.onload = function () { finish(img); };
            img.onerror = function () { finish(null); };
            // صورة علّقت (الشبكة): الدور ما يقفش عليها
            setTimeout(function () { finish(img.complete && img.naturalWidth ? img : null); }, 30000);
            img.src = url;
        }
        // الدور: كام صورة بتتحمل وتتجهز في نفس الوقت (MP.parallel) — المختار والأقرب لنص الشاشة الأول
        var jobs = [], running = 0;
        function enqueue(job, urgent) { if (urgent) jobs.unshift(job); else jobs.push(job); pump(); }
        function pump() { while (running < MP.parallel && jobs.length) start(jobs.shift()); }
        function start(job) {
            var finished = false;
            running++;
            var next = function () { if (finished) return; finished = true; running--; setTimeout(pump, 0); };
            try { job(next); } catch (error) { next(); }
        }
        function withVersion(url, project) {
            var v = project.masterplan_version;
            if (!url || !v || /^(data:|blob:)/.test(url)) return url;
            return url + (url.indexOf('?') > -1 ? '&' : '?') + 'v=' + encodeURIComponent(v);
        }

        // ---------- ملف الأماكن ----------
        function applyPlacements() {
            projects().forEach(function (project) {
                var item = MP.placements[project.id];
                if (!item || project.__mpFile === item) return;
                if (project.__mpFile === undefined) project.__mpOwn = !!savedCorners(project);
                project.__mpFile = item;
                var corners = parseCorners(item.masterplan_corners || item.corners);
                if (corners && (!project.__mpOwn || item.override)) { project.masterplan_corners = corners; project.masterplan_placement = null; }
                if (item.masterplan) project.masterplan = item.masterplan;
                if (item.masterplan_annotations) project.masterplan_annotations = item.masterplan_annotations;
                if (item.masterplan_hd) project.masterplan_hd = item.masterplan_hd;
                if (item.version && !project.masterplan_version) project.masterplan_version = item.version;
                if (MP.rendered[project.id]) remove(project.id);
                delete MP.failed[project.id];
            });
        }
        function loadPlacements() {
            var url = options.placementsUrl;
            if (!url || !window.fetch) { placementsDone = true; return; }
            fetch(url, { cache: 'no-cache' })
                .then(function (response) { return response.ok ? response.json() : null; })
                .then(function (data) {
                    if (!data || typeof data !== 'object') return;
                    MP.placements = data.projects && typeof data.projects === 'object' ? data.projects : data;
                })
                .catch(function () { /* الملف مش موجود: الخريطة شغالة ببيانات المشاريع بس */ })
                .then(function () { placementsDone = true; refresh(); });
            // الملف اتأخر: ما نستناش للأبد
            setTimeout(function () { if (!placementsDone) { placementsDone = true; refresh(); } }, 5000);
        }

// ── masterplans.js · جزء 3 من 5: مكان الصورة والكتابة والمراحل فوقها (المصدر: resources/js/shary/masterplans/03-image-place-and-labels.js — عدّل هنا وشغّل tools/minify-assets.sh)
        // ---------- مكان الصورة ----------
        function coordsFor(project, img) {
            var saved = savedCorners(project);
            if (saved) return { coords: saved, saved: true };
            if (MP.unplaced !== 'bbox') return null;
            // لسه ما اتضبطش: معدول (الشمال فوق) جوه حدود المشروع بنفس نسبة الصورة — تقريبي لحد ما يتضبط بالأداة
            var ring = polygonOf(project);
            if (!ring) return null;
            var box = boxOf(ring.map(toMerc)), w = box[2] - box[0], h = box[3] - box[1];
            if (!(w > 0) || !(h > 0)) return null;
            var ratio = img.naturalHeight / img.naturalWidth, width = Math.min(w, h / ratio), height = width * ratio;
            var cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2;
            return { coords: [[cx - width / 2, cy + height / 2], [cx + width / 2, cy + height / 2], [cx + width / 2, cy - height / 2], [cx - width / 2, cy - height / 2]].map(fromMerc), saved: false };
        }
        function boundsOf(project) {
            var corners = savedCorners(project);
            if (corners) return boxOf(corners);
            var entry = MP.rendered[project.id];
            if (entry && entry.coords) return boxOf(entry.coords);
            var ring = polygonOf(project);
            if (ring) return boxOf(ring);
            var lat = Number(project.lat), lng = Number(project.lng);
            return isFinite(lat) && isFinite(lng) ? [lng - 0.01, lat - 0.01, lng + 0.01, lat + 0.01] : null;
        }
        // الكادر + هامش (viewBuffer) — بيتحسب مرة واحدة لكل تحديث (مش لكل مشروع)
        function viewBox() {
            var b = map.getBounds(), padLng = (b.getEast() - b.getWest()) * MP.viewBuffer, padLat = (b.getNorth() - b.getSouth()) * MP.viewBuffer;
            return [b.getWest() - padLng, b.getSouth() - padLat, b.getEast() + padLng, b.getNorth() + padLat];
        }
        function inView(project, view) {
            var box = boundsOf(project);
            if (!box) return false;
            view = view || viewBox();
            return box[2] >= view[0] && box[0] <= view[2] && box[3] >= view[1] && box[1] <= view[3];
        }
        // مقاس الماستر بلان على الشاشة (بيكسل — الضلع الأكبر)
        function pixels(project) {
            var box = boundsOf(project);
            if (!box) return 0;
            try {
                var a = map.project([box[0], box[3]]), b = map.project([box[2], box[1]]);
                return Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
            } catch (error) { return Infinity; }
        }

        // ---------- الكتابة والمراحل فوق الماستر بلان (masterplan_annotations من لوحة التحكم) ----------
        // المراحل: مساحة ملوّنة بحدود + اسمها ، والمرحلة "الظاهرة" (active) واضحة وباقي الماستر بلان متظلّل.
        // الكتابة (اسم المشروع / المرحلة / العمارة / الوحدة): بتظهر مع التقريب (zoom >= labelZoom) فوق الماستر بلان في مكانها.
        function annIds(id) { return { source: 'mp-ann-src-' + id, mask: 'mp-ann-mask-' + id, fill: 'mp-ann-fill-' + id, line: 'mp-ann-line-' + id }; }
        function dropAnnotations(id) {
            var a = annIds(id), entry = MP.rendered[id];
            try { [a.line, a.fill, a.mask].forEach(function (layer) { if (map.getLayer(layer)) map.removeLayer(layer); }); if (map.getSource(a.source)) map.removeSource(a.source); } catch (error) { /* الخريطة بتغيّر شكلها */ }
            if (entry && entry.labels) { entry.labels.forEach(function (marker) { marker.remove(); }); entry.labels = []; }
        }
        function ringClosed(ring) { var r = ring.slice(); var a = r[0], b = r[r.length - 1]; if (a[0] !== b[0] || a[1] !== b[1]) r.push(a); return r; }
        function centroid(ring) { var x = 0, y = 0; ring.forEach(function (p) { x += p[0]; y += p[1]; }); return [x / ring.length, y / ring.length]; }
        function drawAnnotations(project) {
            var id = project.id, entry = MP.rendered[id], ann = deepJson(project.masterplan_annotations);
            if (!entry || !ann || typeof ann !== 'object') return;
            dropAnnotations(id);
            var a = annIds(id), features = [], phases = Array.isArray(ann.phases) ? ann.phases : [];
            var active = phases.filter(function (phase) { return phase.active && Array.isArray(phase.ring) && phase.ring.length >= 3; });
            // الظل نفسه بيتعمل في صورة الماستر بلان (fitTexture) — هنا الحدود والألوان بس
            phases.forEach(function (phase) {
                if (!Array.isArray(phase.ring) || phase.ring.length < 3) return;
                features.push({ type: 'Feature', properties: { kind: 'phase', color: phase.color || '#1f9a8b', active: phase.active ? 1 : 0 }, geometry: { type: 'Polygon', coordinates: [ringClosed(phase.ring)] } });
            });
            try {
                if (features.length) {
                    map.addSource(a.source, { type: 'geojson', data: { type: 'FeatureCollection', features: features } });
                    map.addLayer({ id: a.fill, type: 'fill', source: a.source, filter: ['==', ['get', 'kind'], 'phase'], paint: { 'fill-color': ['get', 'color'], 'fill-opacity': ['case', ['==', ['get', 'active'], 1], 0, 0.22] } });
                    map.addLayer({ id: a.line, type: 'line', source: a.source, filter: ['==', ['get', 'kind'], 'phase'], paint: { 'line-color': ['get', 'color'], 'line-width': ['case', ['==', ['get', 'active'], 1], 3, 2] } });
                }
            } catch (error) { /* الخريطة بتغيّر شكلها: بترجع مع الرسم الجاي */ }
            // الكتابة: اللي اتحطت بإيد الفريق + اسم كل مرحلة في نصها (لو مالهاش كتابة)
            var labels = (Array.isArray(ann.labels) ? ann.labels : []).slice();
            phases.forEach(function (phase) {
                if (!phase.name || !Array.isArray(phase.ring) || phase.ring.length < 3) return;
                if (labels.some(function (label) { return label.text === phase.name; })) return;
                var c = centroid(phase.ring);
                labels.push({ text: phase.name, kind: 'phase', lng: c[0], lat: c[1] });
            });
            var lib = window.maplibregl || window.mapboxgl;
            if (!lib || !lib.Marker) return;
            // العماير: لو الفريق ربط وحدات بعماير ، اللي بتظهر هي العماير اللي فيها وحدات متاحة بس (بعددها) — والضغط عليها بيقرّب ويظهر وحداتها
            var inventory = labels.some(function (label) { return label.kind === 'building' && Array.isArray(label.units) && label.units.length; });
            entry.labels = labels.filter(function (label) {
                if (!label || !label.text || !isFinite(label.lng) || !isFinite(label.lat)) return false;
                return !(inventory && label.kind === 'building' && !(Array.isArray(label.units) && label.units.length));
            }).map(function (label) {
                var count = label.kind === 'building' && Array.isArray(label.units) ? label.units.length : 0;
                var el = document.createElement(count || label.unit_id ? 'button' : 'div');
                el.className = 'mp-label mp-label--' + (label.kind || 'phase') + (count ? ' has-units' : '') + (label.unit_id ? ' has-unit' : '');
                var name = document.createElement('span'); name.textContent = label.text; el.appendChild(name);
                if (count) {
                    el.type = 'button';
                    var badge = document.createElement('b'); badge.className = 'mp-label__count'; badge.textContent = count; el.appendChild(badge);
                    el.setAttribute('aria-label', label.text + ' — ' + count);
                    el.addEventListener('click', function (event) { event.stopPropagation(); el.dispatchEvent(new CustomEvent('shary:mp-building', { bubbles: true, detail: { project: id, lng: Number(label.lng), lat: Number(label.lat), units: label.units } })); });
                } else if (label.unit_id) {
                    el.type = 'button';
                    el.addEventListener('click', function (event) { event.stopPropagation(); el.dispatchEvent(new CustomEvent('shary:mp-unit', { bubbles: true, detail: { project: id, unit: label.unit_id } })); });
                }
                return new lib.Marker({ element: el, anchor: 'center' }).setLngLat([Number(label.lng), Number(label.lat)]).addTo(map);
            });
        }
        // الكتابة بتظهر من زوم labelZoom (قبلها الماستر بلانز صغيرة والكتابة هتزحم الشاشة)
        function labelsByZoom() {
            var box = map.getContainer && map.getContainer();
            if (!box) return;
            var z = map.getZoom();
            box.classList.toggle('mp-labels-on', z >= MP.labelZoom);   // اسم المشروع والمراحل
            box.classList.toggle('mp-buildings-on', z >= 15);           // العماير
            box.classList.toggle('mp-units-on', z >= 16.5);             // الوحدات
        }

// ── masterplans.js · جزء 4 من 5: طبقات الماستر بلان على الخريطة (المصدر: resources/js/shary/masterplans/04-layers.js — عدّل هنا وشغّل tools/minify-assets.sh)
        // ---------- الطبقات ----------
        function drop(x) {
            try {
                if (map.getLayer(x.layerId)) map.removeLayer(x.layerId);
                if (map.getSource(x.sourceId)) map.removeSource(x.sourceId);
            } catch (error) { /* الخريطة بتغيّر شكلها */ }
        }
        function remove(id) { var entry = MP.rendered[id]; if (entry && entry.blob) revokeLater(entry.blob); dropAnnotations(id); drop(ids(id)); delete MP.rendered[id]; changed(); }
        function paintFor(project) {
            var opacity = Number(project.masterplan_opacity);
            return { 'raster-opacity': isFinite(opacity) && opacity > 0 && opacity <= 1 ? opacity : 1, 'raster-fade-duration': 0, 'raster-resampling': 'linear' };
        }
        function show(id) {
            var x = ids(id);
            if (map.getLayer(x.layerId)) map.setLayoutProperty(x.layerId, 'visibility', MP.hidden[id] ? 'none' : 'visible');
        }
        function render(project) {
            var id = project.id, x = ids(id);
            if (MP.rendered[id] || (MP.failed[id] || 0) >= 2) return;
            var token = {};
            MP.rendered[id] = { token: token, sourceId: x.sourceId, layerId: x.layerId, coords: null, hd: false, tiles: false, saved: false, level: '', blob: null };
            function alive() { return !dead && MP.rendered[id] && MP.rendered[id].token === token; }
            function fail(error) { MP.failed[id] = (MP.failed[id] || 0) + 1; remove(id); if (error && window.console) console.warn('masterplan', id, error); }

            // 1) Tiles (لو السيرفر مجهّزها): أعلى جودة مع أي زوم
            var meta = deepJson(project.masterplan_tiles_meta) || {};
            if (project.masterplan_tiles && Array.isArray(meta.bounds) && meta.bounds.length === 4) {
                try {
                    drop(x);
                    map.addSource(x.sourceId, { type: 'raster', tiles: [project.masterplan_tiles], tileSize: Number(meta.tile_size) || 256, bounds: meta.bounds.map(Number), minzoom: Number(meta.minzoom) || 12, maxzoom: Number(meta.maxzoom) || 20 });
                    map.addLayer({ id: x.layerId, type: 'raster', source: x.sourceId, paint: paintFor(project) });
                    MP.rendered[id].tiles = true; MP.rendered[id].saved = true;
                    show(id); changed();
                } catch (error) { fail(error); }
                return;
            }
            // 2) صورة واحدة فوق الخريطة — بالدور (المختار الأول): وهي بعيدة النسخة الخفيفة ، ومع التقريب (أو المختار) الكاملة
            var urgent = String(id) === String(activeId());
            enqueue(function (next) {
                if (!alive()) { next(); return; }
                var close = map.getZoom() >= MP.hdZoom - 1 || String(id) === String(activeId());
                var full = withVersion(absolute(project.masterplan), project);
                var lightUrl = usableImage(project.masterplan_light) ? withVersion(absolute(project.masterplan_light), project) : '';
                var useLight = !close && !!lightUrl;
                var got = function (img) {
                    if (!alive()) { next(); return; }
                    if (!img && useLight) { useLight = false; loadImage(full, got); return; }   // النسخة الخفيفة مش موجودة: الكاملة
                    if (!img) { next(); fail('image'); return; }
                    var place = null;
                    try { place = coordsFor(project, img); } catch (error) { place = null; }
                    if (!place) { next(); MP.failed[id] = 2; remove(id); return; }      // لسه ما اتضبطش ومفيش حدود: ما يتعرضش
                    var cap = close ? 0 : MP.overviewCap;
                    texture(img, cap, project, place.coords, function (src, isBlob) {
                        next();
                        if (!alive()) { if (isBlob) revokeLater(src); return; }
                        try {
                            drop(x);
                            map.addSource(x.sourceId, { type: 'image', url: src, coordinates: place.coords });
                            var entry = MP.rendered[id];
                            setBlob(entry, src, isBlob);
                            entry.full = full; entry.lightUrl = lightUrl;
                            // light = متعروضة بنسخة أخف من الكاملة (الكاملة بتتحمل مع التقريب)
                            entry.level = !close && (useLight || Math.max(img.naturalWidth, img.naturalHeight) > Math.min(cap * 1.3, textureCap())) ? 'light' : 'full';
                            entry.url = img.src;
                            // بتتضاف مخفية (شفافة) وبتظهر مرة واحدة لما الصورة تجهز على الخريطة — من غير ما تتشاف وهي بتترسم
                            var paint = paintFor(project), target = paint['raster-opacity'];
                            paint['raster-opacity'] = 0;
                            map.addLayer({ id: x.layerId, type: 'raster', source: x.sourceId, paint: paint });
                            entry.coords = place.coords; entry.saved = place.saved;
                            delete MP.failed[id];
                            show(id); changed(); upgrade();
                            var revealed = false;
                            var reveal = function () {
                                if (revealed || !alive()) return;
                                revealed = true;
                                try { map.setPaintProperty(x.layerId, 'raster-opacity', target); } catch (error) { /* اتشالت */ }
                                drawAnnotations(project);
                            };
                            map.once('idle', reveal);
                            setTimeout(reveal, 1500);
                        } catch (error) {
                            // الخريطة لسه بتحمّل شكلها: مش فشل — هتترسم في المحاولة الجاية
                            if (/style/i.test(String(error && error.message))) { if (isBlob) revokeLater(src); delete MP.rendered[id]; schedule(); } else fail(error);
                        }
                    });
                };
                loadImage(useLight ? lightUrl : full, got);
            }, urgent);
        }
        // صورة تانية لنفس الماستر بلان (الكاملة مع التقريب ، الخفيفة لما العميل يبعّد ، أو الـ HD) — بالدور
        function swap(id, url, level, limit) {
            var entry = MP.rendered[id], project = byId(id);
            if (!entry || !entry.coords || !project || !url) return;
            var token = entry.token;
            if (level) entry.level = level;          // ما يتطلبش تاني وهو بيتحمّل
            enqueue(function (next) {
                var now = MP.rendered[id];
                if (!now || now.token !== token) { next(); return; }
                loadImage(url, function (img) {
                    var still = MP.rendered[id];
                    if (!img || !still || still.token !== token) { next(); return; }
                    texture(img, limit, project, still.coords, function (src, isBlob) {
                        next();
                        var again = MP.rendered[id];
                        if (!again || again.token !== token) { if (isBlob) revokeLater(src); return; }
                        try {
                            var source = map.getSource(again.sourceId);
                            if (source && source.updateImage) { source.updateImage({ url: src, coordinates: again.coords }); setBlob(again, src, isBlob); again.url = img.src; }
                            else if (isBlob) revokeLater(src);
                        } catch (error) { if (isBlob) revokeLater(src); }
                    });
                });
            });
        }
        // الجودة مع الزوم: الكاملة لما العميل يقرّب ، الخفيفة ترجع لما يبعّد (ذاكرة الموبايل) ، ونسخة HD من hdZoom
        function upgrade() {
            var zoom = map.getZoom(), active = String(activeId()), view = null;
            Object.keys(MP.rendered).forEach(function (id) {
                var entry = MP.rendered[id], project = byId(id);
                if (!entry || !entry.coords || entry.tiles || !project) return;
                if (zoom >= MP.hdZoom - 1) {
                    if (entry.level !== 'light') return;
                    view = view || viewBox();
                    if (inView(project, view)) swap(id, entry.full, 'full', 0);
                } else if (zoom < MP.hdZoom - 2.5 && entry.level === 'full' && entry.lightUrl && String(id) !== active) {
                    entry.hd = false;
                    swap(id, entry.lightUrl, 'light', MP.overviewCap);
                }
            });
            if (zoom < MP.hdZoom) return;
            Object.keys(MP.rendered).forEach(function (id) {
                var entry = MP.rendered[id], project = byId(id);
                if (!entry || entry.hd || entry.tiles || !entry.coords || !project || !project.masterplan_hd) return;
                view = view || viewBox();
                if (!inView(project, view)) return;
                entry.hd = true;
                swap(id, withVersion(absolute(project.masterplan_hd), project), 'full', 0);
            });
        }

// ── masterplans.js · جزء 5 من 5: اللي في الشاشة بس والتصدير (المصدر: resources/js/shary/masterplans/05-on-screen-only.js — عدّل هنا وشغّل tools/minify-assets.sh)
        // ---------- اللي في الشاشة بس ----------
        function styleReady() {
            try { if (map.style && typeof map.style._loaded === 'boolean') return map.style._loaded; } catch (error) { /* نسخة مختلفة من المكتبة */ }
            return map.isStyleLoaded();
        }
        function schedule() { clearTimeout(retryTimer); if (retries++ < 80) retryTimer = setTimeout(refresh, 150); }
        function refresh() {
            if (dead) return;
            if (!styleReady()) { schedule(); return; }
            retries = 0;
            if (!canDraw()) return;          // الخريطة لسه بتحمّل / بتتحرك: الرسم بييجي مع أول idle
            applyPlacements();
            // طبقة اتمسحت من بره (تغيير شكل الخريطة): تتسجل إنها مش معروضة عشان ترجع
            Object.keys(MP.rendered).forEach(function (id) { var entry = MP.rendered[id]; if ((entry.coords || entry.tiles) && !map.getSource(entry.sourceId)) delete MP.rendered[id]; });
            var zoom = map.getZoom(), center = map.getCenter(), active = activeId(), view = viewBox();
            var wanted = projects().filter(function (project) {
                if (!usableImage(project.masterplan) && !project.masterplan_tiles) return false;
                // تحت minZoom مفيش رسم حتى للمشروع المختار (ما تظهرش متجمعة في نقطة) — والخريطة بتقرّب عليه أصلًا
                if (zoom < MP.minZoom) return false;
                if (String(project.id) === String(active)) return true;
                // في الكادر ومقاسها على الشاشة يستاهل (مش نقطة)
                return inView(project, view) && (MP.rendered[project.id] || pixels(project) >= MP.minPixels);
            });
            // اللي بقت نقطة صغيرة (العميل بعّد قوي): بتتشال (ذاكرة) — وبترجع لما يقرّب
            Object.keys(MP.rendered).forEach(function (id) {
                if (String(id) === String(active)) return;
                var project = byId(id);
                if (project && MP.rendered[id].coords && pixels(project) < MP.minPixels * 0.35) remove(id);
            });
            wanted = wanted.filter(function (project) { return String(project.id) === String(active) || MP.rendered[project.id] || pixels(project) >= MP.minPixels; });
            // ماستر بلان مكانها غلط (متسجلة بأركان غريبة) أو داخلة في ماستر بلان تانية: ما بتترسمش — عشان الخريطة ما يبقاش فيها صور فوق بعض.
            //   المقاس: أصغر من 60 متر أو أكبر من 12 كم = أركان غلط.  التداخل: لو أكتر من 35% من الأصغر جوه واحدة اتقبلت قبلها
            //   (الأولوية: المشروع المختار ، وبعده اللي اتضبط بإيد الفريق ، وبعده الأقرب لنص الشاشة).
            var rectOf = function (project) {
                var corners = savedCorners(project);
                if (!corners) return null;
                var m = boxOf(corners.map(toMerc)), k = Math.cos(((m[1] + m[3]) / 2 / R));   // تقريب: متر ميركاتور ← متر حقيقي
                return { box: m, w: (m[2] - m[0]) * k, h: (m[3] - m[1]) * k };
            };
            var accepted = [], clash = {};
            wanted.slice().sort(function (a, b) {
                var aa = String(a.id) === String(active), bb = String(b.id) === String(active);
                if (aa !== bb) return aa ? -1 : 1;
                var ma = !!(a.__mpOwn || savedCorners(a)), mb = !!(b.__mpOwn || savedCorners(b));
                if (ma !== mb) return ma ? -1 : 1;
                return 0;
            }).forEach(function (project) {
                var r = rectOf(project);
                if (!r) { accepted.push({ id: project.id, r: null }); return; }
                if (String(project.id) !== String(active) && (r.w < 60 || r.h < 60 || r.w > 12000 || r.h > 12000)) { clash[project.id] = 'size'; return; }
                var areaOf = function (b) { return Math.max(0, b[2] - b[0]) * Math.max(0, b[3] - b[1]); };
                var hit = accepted.some(function (other) {
                    if (!other.r) return false;
                    var o = other.r.box, b = r.box, inter = [Math.max(o[0], b[0]), Math.max(o[1], b[1]), Math.min(o[2], b[2]), Math.min(o[3], b[3])];
                    return areaOf(inter) > 0.35 * Math.min(areaOf(o), areaOf(b));
                });
                if (hit && String(project.id) !== String(active)) { clash[project.id] = 'overlap'; return; }
                accepted.push({ id: project.id, r: r });
            });
            MP.clash = clash;
            wanted = wanted.filter(function (project) { return !clash[project.id]; });
            Object.keys(clash).forEach(function (id) { if (MP.rendered[id]) remove(id); });
            if (wanted.length > MP.maxActive) {
                var far = function (project) { var b = boundsOf(project) || [0, 0, 0, 0]; return Math.hypot((b[0] + b[2]) / 2 - center.lng, (b[1] + b[3]) / 2 - center.lat); };
                wanted = wanted.sort(function (a, b) { return (String(b.id) === String(active)) - (String(a.id) === String(active)) || far(a) - far(b); }).slice(0, MP.maxActive);
            }
            var keep = {};
            wanted.forEach(function (project) { keep[project.id] = true; });
            // ثبات: الماستر بلان اللي اترسمت بتفضل مكانها وإنت بتحرّك الخريطة (من غير ما تختفي وترجع) —
            // بتتشال بس لو المشروع اتشال من الفلتر ، أو العدد عدّى الحد (الأبعد الأول)
            var visibleIds = {};
            projects().forEach(function (project) { visibleIds[project.id] = true; });
            Object.keys(MP.rendered).forEach(function (id) { if (!visibleIds[id]) remove(id); });
            var extra = Object.keys(MP.rendered).filter(function (id) { return !keep[id]; });
            var room = MP.maxActive - wanted.length;
            if (extra.length > room) {
                var dist = function (id) { var b = boundsOf(byId(id) || {}) || [0, 0, 0, 0]; return Math.hypot((b[0] + b[2]) / 2 - center.lng, (b[1] + b[3]) / 2 - center.lat); };
                extra.sort(function (a, b) { return dist(b) - dist(a); }).slice(0, extra.length - Math.max(0, room)).forEach(remove);
            }
            // الأقرب لنص الشاشة بيتحمل الأول
            var distance = function (project) { var b = boundsOf(project) || [0, 0, 0, 0]; return Math.hypot((b[0] + b[2]) / 2 - center.lng, (b[1] + b[3]) / 2 - center.lat); };
            wanted.slice().sort(function (a, b) { return distance(a) - distance(b); }).forEach(render);
            labelsByZoom();
            upgrade();
        }

        map.on('moveend', refresh);
        // أول idle = الخريطة وصورها خلصت تحميل: من هنا الرسم مسموح
        map.on('idle', refresh);
        // بعض الأجهزة ما بتطلّعش idle (الخريطة بترسم على طول): كل ما الخريطة تقف وصورها تخلص بنحاول — ومرة كل 400ms لحد أول رسم
        var settleTimer = null;
        map.on('data', function () { clearTimeout(settleTimer); settleTimer = setTimeout(refresh, 200); });
        var firstPoll = setInterval(function () { if (dead || Object.keys(MP.rendered).length) { clearInterval(firstPoll); return; } refresh(); }, 400);
        setTimeout(function () { clearInterval(firstPoll); }, 60000);
        map.on('zoomend', upgrade);
        map.on('zoom', labelsByZoom);
        // أي تغيير لشكل الخريطة بيمسح كل الطبقات: نرجّع الماستر بلان كلها في مكانها
        map.on('style.load', function () { Object.keys(MP.rendered).forEach(function (id) { var e = MP.rendered[id]; if (e && e.labels) e.labels.forEach(function (m) { m.remove(); }); if (e && e.blob) revokeLater(e.blob); }); MP.rendered = {}; jobs = []; setTimeout(refresh, 80); });
        map.on('styledata', function () { clearTimeout(styleTimer); styleTimer = setTimeout(refresh, 250); });
        loadPlacements();
        refresh();

        MP.refresh = refresh;
        MP.status = function () { return { mapReady: mapReady, placementsDone: placementsDone, canDraw: canDraw(), projects: projects().length, rendered: Object.keys(MP.rendered).length, loading: running, waiting: jobs.length }; };
        MP.map = map;
        MP.savedCorners = savedCorners;
        MP.has = function (id) { var entry = MP.rendered[id]; return !!(entry && (entry.coords || entry.tiles)); };
        MP.placed = function (id) { var project = byId(id); return !!(project && savedCorners(project)); };
        MP.bounds = function (id) { var project = byId(id); return project && (savedCorners(project) || polygonOf(project) || (MP.rendered[id] && MP.rendered[id].coords)) ? boundsOf(project) : null; };
        MP.setHidden = function (id, hidden) { if (hidden) MP.hidden[id] = true; else delete MP.hidden[id]; show(id); };
        // بعد حفظ مكان جديد من أداة الضبط (أو تغيير الصورة): mp.reload(id, { masterplan_corners: [...] })
        MP.reload = function (id, changes) {
            var project = byId(id);
            if (!project) return;
            Object.keys(changes || {}).forEach(function (key) { project[key] = changes[key]; });
            delete MP.failed[id];
            if (MP.rendered[id]) remove(id);
            refresh();
        };
        MP.destroy = function () { dead = true; clearTimeout(retryTimer); clearTimeout(styleTimer); Object.keys(MP.rendered).forEach(remove); };
        return MP;
    }

    window.SharyMasterplans = { attach: attach, parseCorners: parseCorners, placementToCorners: placementToCorners };
})();
