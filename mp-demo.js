/**
 * وضع التجربة (معاينة بس): بديل للباك إند جوه المتصفح — نفس لينكات MapMasterplanController بالظبط ،
 * بس الصور والأماكن بتتخزن على المتصفح ده (IndexedDB) بدل السيرفر. صفحة لوحة التحكم وخريطة الاختبار بيقروا من نفس المكان.
 */
(function () {
    var CITIES = [
        { id: 1, name_ar: 'القاهرة الجديدة', name_en: 'New Cairo', country_id: 1 },
        { id: 2, name_ar: 'الساحل الشمالي', name_en: 'North Coast', country_id: 1 },
        { id: 3, name_ar: '6 أكتوبر والشيخ زايد', name_en: 'October & Zayed', country_id: 1 },
        { id: 9, name_ar: 'مشاريع الاختبار', name_en: 'Test projects', country_id: 1 }
    ];
    // مشاريع تجريبية (الأماكن تقريبية — للتجربة بس)
    var DEMO = [
        { id: 101, name_ar: 'كمبوند سينز', name_en: 'Scenes', developer: 'تطوير مصر', city_id: 1, lat: 30.1280, lng: 31.6200, price_from: 6.9, delivery_in: '2027', units: [{ type: 'شقة' }, { type: 'دوبلكس' }] },
        { id: 102, name_ar: 'ماونتن فيو آي سيتي', name_en: 'Mountain View iCity', developer: 'ماونتن فيو', city_id: 1, lat: 30.0320, lng: 31.5230, price_from: 8.2, delivery_in: '2026', units: [{ type: 'شقة' }, { type: 'فيلا' }] },
        { id: 103, name_ar: 'هايد بارك', name_en: 'Hyde Park', developer: 'هايد بارك', city_id: 1, lat: 30.0050, lng: 31.5010, price_from: 9.4, delivery_in: 'استلام فوري', units: [{ type: 'تاون هاوس' }, { type: 'فيلا' }] },
        { id: 104, name_ar: 'ميفيدا', name_en: 'Mivida', developer: 'إعمار مصر', city_id: 1, lat: 30.0110, lng: 31.5480, price_from: 12.5, delivery_in: 'استلام فوري', units: [{ type: 'شقة' }, { type: 'توين هاوس' }] },
        { id: 105, name_ar: 'بالم هيلز نيو كايرو', name_en: 'Palm Hills New Cairo', developer: 'بالم هيلز', city_id: 1, lat: 30.0230, lng: 31.5750, price_from: 7.8, delivery_in: '2028', units: [{ type: 'شقة' }, { type: 'فيلا' }] },
        { id: 201, name_ar: 'لافيستا راس الحكمة', name_en: 'La Vista Ras El Hekma', developer: 'لافيستا', city_id: 2, lat: 31.1200, lng: 27.8300, price_from: 18, delivery_in: '2027', units: [{ type: 'شاليه' }, { type: 'فيلا' }] },
        { id: 202, name_ar: 'مراسي', name_en: 'Marassi', developer: 'إعمار مصر', city_id: 2, lat: 30.9700, lng: 28.7500, price_from: 22, delivery_in: 'استلام فوري', units: [{ type: 'شاليه' }, { type: 'تاون هاوس' }] },
        { id: 301, name_ar: 'بادية', name_en: 'Badya', developer: 'بالم هيلز', city_id: 3, lat: 29.9300, lng: 30.8900, price_from: 7.2, delivery_in: '2029', units: [{ type: 'شقة' }, { type: 'دوبلكس' }] }
    ];
    function run(type, work) {
        return new Promise(function (resolve) {
            try {
                var open = indexedDB.open('shary-mp-test', 1);
                open.onupgradeneeded = function () { open.result.createObjectStore('projects', { keyPath: 'id' }); };
                open.onsuccess = function () {
                    var request = work(open.result.transaction('projects', type).objectStore('projects'));
                    request.onsuccess = function () { resolve(request.result); };
                    request.onerror = function () { resolve(null); };
                };
                open.onerror = function () { resolve(null); };
            } catch (error) { resolve(null); }
        });
    }
    function all() { return run('readonly', function (store) { return store.getAll(); }).then(function (items) { return items || []; }); }
    function one(id) { return run('readonly', function (store) { return store.get(Number(id)); }); }
    function put(item) { return run('readwrite', function (store) { return store.put(item); }); }
    function drop(id) { return run('readwrite', function (store) { return store.delete(Number(id)); }); }
    function json(value, status) { return new Response(JSON.stringify(value), { status: status || 200, headers: { 'Content-Type': 'application/json' } }); }
    function demoOf(id) { return DEMO.filter(function (p) { return p.id === Number(id); })[0] || null; }
    function dataUrl(file) { return new Promise(function (resolve, reject) { var reader = new FileReader(); reader.onload = function () { resolve(reader.result); }; reader.onerror = reject; reader.readAsDataURL(file); }); }

    var realFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
        var url = typeof input === 'string' ? input : ((input && input.url) || '');
        var method = String((init && init.method) || 'GET').toUpperCase();
        var path = url.replace(/^https?:\/\/[^/]+/, '').split('?')[0];
        var hit;
        if (/\/api\/map\/cities$/.test(path)) return Promise.resolve(json({ success: true, data: CITIES }));
        // المشاريع: التجريبية + اللي اتعملوا من أداة الضبط الحرة — ومعاهم الماستر بلان المحفوظة (الخريطة بتقراها من هنا في التجربة)
        if (/\/api\/map\/compounds$/.test(path)) return all().then(function (items) {
            var saved = {};
            items.forEach(function (item) { saved[item.id] = item; });
            var list = DEMO.map(function (p) {
                var item = saved[p.id], out = {};
                Object.keys(p).forEach(function (key) { out[key] = p[key]; });
                if (item && item.image && item.corners) { out.masterplan = item.image; out.masterplan_corners = item.corners; }
                return out;
            });
            items.forEach(function (item) {
                if (demoOf(item.id)) return;
                list.push({ id: Number(item.id), name_ar: item.name, name_en: item.name, developer: 'اختبار', city_id: 9, lat: Number(item.lat), lng: Number(item.lng), price_from: 0, units: [], masterplan: item.image, masterplan_corners: item.corners });
            });
            return json({ success: true, data: list });
        });
        if (/\/api\/map\/masterplans$/.test(path)) return all().then(function (items) {
            var projects = {};
            items.forEach(function (item) { if (item.image) projects[item.id] = { masterplan: item.image, masterplan_corners: item.corners || null, masterplan_placement: item.placement || null, version: item.version || 1 }; });
            return json({ projects: projects });
        });
        if (method === 'POST' && (hit = /\/admin\/map-masterplans\/(\d+)\/image$/.exec(path))) {
            var file = init && init.body && init.body.get ? init.body.get('image') : null;
            if (!file) return Promise.resolve(json({ message: 'الصورة مطلوبة.' }, 422));
            return Promise.all([dataUrl(file), one(hit[1])]).then(function (parts) {
                var demo = demoOf(hit[1]) || {}, item = parts[1] || { id: Number(hit[1]), name: demo.name_ar || ('مشروع ' + hit[1]), lat: demo.lat, lng: demo.lng };
                item.image = parts[0]; item.version = (item.version || 0) + 1;
                return put(item).then(function () { return json({ message: 'تم رفع الصورة — اضبط مكانها على الخريطة واحفظ.', url: item.image, version: item.version, masterplan_corners: item.corners || null }); });
            });
        }
        if (method === 'POST' && (hit = /\/admin\/map-masterplans\/(\d+)\/placement$/.exec(path))) {
            var body = {};
            try { body = JSON.parse(init.body); } catch (error) { body = {}; }
            return one(hit[1]).then(function (item) {
                if (!item || !item.image) return json({ message: 'ارفع صورة الماستر بلان للمشروع ده الأول.' }, 422);
                if (!Array.isArray(body.masterplan_corners) || body.masterplan_corners.length !== 4) return json({ message: 'الأركان لازم تبقى 4 نقط.' }, 422);
                item.corners = body.masterplan_corners; item.placement = body.masterplan_placement || null; item.version = (item.version || 0) + 1;
                return put(item).then(function () { return json({ message: 'تم الحفظ ✓ الماستر بلان هتظهر على الخريطة في المكان ده.', version: item.version }); });
            });
        }
        if (method === 'DELETE' && (hit = /\/admin\/map-masterplans\/(\d+)$/.exec(path))) return drop(hit[1]).then(function () { return json({ message: 'اتمسحت ماستر بلان المشروع من الخريطة.' }); });
        return realFetch(input, init);
    };
    window.MP_DEMO = { all: all, projects: DEMO };
})();
