/**
 * وضع التجربة (معاينة بس): بديل للباك إند جوه المتصفح — نفس لينكات MapMasterplanController بالظبط ،
 * بس الصور والأماكن بتتخزن على المتصفح ده (IndexedDB) بدل السيرفر. صفحة لوحة التحكم وخريطة الاختبار بيقروا من نفس المكان.
 */
(function () {
    // نفس مشاريع خريطة المعاينة (shary-map.html) — بتتولّد وقت البناء (imap/build_demo.py). id = slug المشروع
    var CITIES = [{"id": "new-cairo", "name_ar": "القاهرة الجديدة", "name_en": "القاهرة الجديدة", "country_id": 1}, {"id": "north-coast", "name_ar": "الساحل الشمالي", "name_en": "الساحل الشمالي", "country_id": 1}, {"id": "sheikh-zayed", "name_ar": "الشيخ زايد", "name_en": "الشيخ زايد", "country_id": 1}, {"id": "ain-sokhna", "name_ar": "العين السخنة", "name_en": "العين السخنة", "country_id": 1}, {"id": "new-capital", "name_ar": "العاصمة الإدارية", "name_en": "العاصمة الإدارية", "country_id": 1}];
    var DEMO = [{"id": "scenes", "name_ar": "كمبوند سينز", "name_en": "كمبوند سينز", "developer": "تطوير مصر", "city_id": "new-cairo", "lat": 30.11297, "lng": 31.6431, "price_from": 27.16, "delivery_in": "2027", "image": "", "units": []}, {"id": "la-vista-bay", "name_ar": "قرية لافيستا باي", "name_en": "قرية لافيستا باي", "developer": "لافيستا", "city_id": "north-coast", "lat": 31.10533, "lng": 27.85772, "price_from": 14.2, "delivery_in": "2028", "image": "", "units": []}, {"id": "avelin", "name_ar": "كمبوند افيلين", "name_en": "كمبوند افيلين", "developer": "تايمز", "city_id": "new-cairo", "lat": 30.00238, "lng": 31.4602, "price_from": 6.1, "delivery_in": "2026", "image": "", "units": []}, {"id": "beyond-blue", "name_ar": "قرية بيوند بلو", "name_en": "قرية بيوند بلو", "developer": "ريدي جروب", "city_id": "north-coast", "lat": 31.03995, "lng": 28.46664, "price_from": 6.9, "delivery_in": "2029", "image": "", "units": []}, {"id": "etaje", "name_ar": "ايتاج", "name_en": "ايتاج", "developer": "مدينة مصر", "city_id": "new-cairo", "lat": 30.03225, "lng": 31.47864, "price_from": 6.7, "delivery_in": "2028", "image": "", "units": []}, {"id": "telal", "name_ar": "قرية تلال", "name_en": "قرية تلال", "developer": "رؤية", "city_id": "north-coast", "lat": 30.95731, "lng": 28.7273, "price_from": 11.8, "delivery_in": "استلام فوري", "image": "", "units": []}, {"id": "garnet", "name_ar": "كمبوند جارنيت", "name_en": "كمبوند جارنيت", "developer": "جدير", "city_id": "new-cairo", "lat": 30.02177, "lng": 31.41052, "price_from": 4.5, "delivery_in": "2027", "image": "", "units": []}, {"id": "four", "name_ar": "قرية فور", "name_en": "قرية فور", "developer": "مدينة مصر", "city_id": "north-coast", "lat": 30.85301, "lng": 28.95558, "price_from": 9.4, "delivery_in": "2027", "image": "", "units": []}, {"id": "bloomfields", "name_ar": "كمبوند بلوم فيلدز", "name_en": "كمبوند بلوم فيلدز", "developer": "تطوير مصر", "city_id": "new-cairo", "lat": 30.11626, "lng": 31.60386, "price_from": 5.84, "delivery_in": "2029", "image": "", "units": []}, {"id": "la-vista-bay-east", "name_ar": "قرية لافيستا باي ايست", "name_en": "قرية لافيستا باي ايست", "developer": "لافيستا", "city_id": "north-coast", "lat": 31.14003, "lng": 27.82352, "price_from": 16.5, "delivery_in": "2029", "image": "", "units": []}, {"id": "blue-tree", "name_ar": "كمبوند بلو تري", "name_en": "كمبوند بلو تري", "developer": "سكاي أبوظبي", "city_id": "new-cairo", "lat": 30.02402, "lng": 31.40752, "price_from": 6.51, "delivery_in": "استلام فوري", "image": "", "units": []}, {"id": "marsa", "name_ar": "قرية مرسى", "name_en": "قرية مرسى", "developer": "ميركون", "city_id": "north-coast", "lat": 30.94179, "lng": 28.66742, "price_from": 5.2, "delivery_in": "2027", "image": "", "units": []}, {"id": "el-patio-sola", "name_ar": "الباتيو سولا", "name_en": "الباتيو سولا", "developer": "لافيستا", "city_id": "new-cairo", "lat": 30.10457, "lng": 31.57746, "price_from": 9.9, "delivery_in": "2029", "image": "", "units": []}, {"id": "privado", "name_ar": "كمبوند بريفادو", "name_en": "كمبوند بريفادو", "developer": "طلعت مصطفى", "city_id": "new-cairo", "lat": 30.07921, "lng": 31.6337, "price_from": 12.74, "delivery_in": "2027", "image": "", "units": []}, {"id": "the-pulse", "name_ar": "ذا بالس", "name_en": "ذا بالس", "developer": "سكاي انوفو", "city_id": "new-cairo", "lat": 30.01812, "lng": 31.4751, "price_from": 19.35, "delivery_in": "استلام فوري", "image": "", "units": []}, {"id": "blue-walk", "name_ar": "مول بلو ووك", "name_en": "مول بلو ووك", "developer": "سكاي أبوظبي", "city_id": "new-cairo", "lat": 30.00139, "lng": 31.41076, "price_from": 4.8, "delivery_in": "2029", "image": "", "units": []}, {"id": "vie-halo", "name_ar": "مول في هالو", "name_en": "مول في هالو", "developer": "في كوميونيتيز", "city_id": "new-cairo", "lat": 29.99221, "lng": 31.40662, "price_from": 5.5, "delivery_in": "2027", "image": "", "units": []}, {"id": "jeel-plaza", "name_ar": "مول جيل", "name_en": "مول جيل", "developer": "أرابكو", "city_id": "new-cairo", "lat": 29.9968, "lng": 31.44142, "price_from": 7.0, "delivery_in": "2029", "image": "", "units": []}, {"id": "xchange-hap-town", "name_ar": "اكس تشينج هاب تاون", "name_en": "اكس تشينج هاب تاون", "developer": "حسن علام", "city_id": "new-cairo", "lat": 30.12868, "lng": 31.61472, "price_from": 16.06, "delivery_in": "2026", "image": "", "units": []}, {"id": "il-bosco-city", "name_ar": "كمبوند البوسكو سيتي", "name_en": "كمبوند البوسكو سيتي", "developer": "مصر إيطاليا", "city_id": "new-cairo", "lat": 30.11108, "lng": 31.61316, "price_from": 3.24, "delivery_in": "استلام فوري", "image": "", "units": []}, {"id": "the-butterfly", "name_ar": "كمبوند ذا بترفلاي", "name_en": "كمبوند ذا بترفلاي", "developer": "مدينة مصر", "city_id": "new-cairo", "lat": 30.11585, "lng": 31.64526, "price_from": 6.15, "delivery_in": "استلام فوري", "image": "", "units": []}, {"id": "mivida-gardens", "name_ar": "كمبوند ميفيدا جاردنز", "name_en": "كمبوند ميفيدا جاردنز", "developer": "إعمار مصر", "city_id": "new-cairo", "lat": 30.11212, "lng": 31.6377, "price_from": 12.0, "delivery_in": "2029", "image": "", "units": []}, {"id": "aliva", "name_ar": "كمبوند اليفا", "name_en": "كمبوند اليفا", "developer": "ماونتن فيو", "city_id": "new-cairo", "lat": 30.13187, "lng": 31.62312, "price_from": 8.59, "delivery_in": "2027", "image": "", "units": []}, {"id": "eastvale", "name_ar": "كمبوند ايست فالي", "name_en": "كمبوند ايست فالي", "developer": "سوديك", "city_id": "new-cairo", "lat": 30.14888, "lng": 31.61694, "price_from": 13.0, "delivery_in": "2027", "image": "", "units": []}, {"id": "el-patio-prime", "name_ar": "الباتيو برايم", "name_en": "الباتيو برايم", "developer": "لافيستا", "city_id": "new-cairo", "lat": 30.10623, "lng": 31.60098, "price_from": 24.2, "delivery_in": "استلام فوري", "image": "", "units": []}, {"id": "el-patio-casa", "name_ar": "الباتيو كازا", "name_en": "الباتيو كازا", "developer": "لافيستا", "city_id": "new-cairo", "lat": 30.12513, "lng": 31.6245, "price_from": 22.8, "delivery_in": "2028", "image": "", "units": []}, {"id": "el-patio-5-east", "name_ar": "الباتيو 5 ايست", "name_en": "الباتيو 5 ايست", "developer": "لافيستا", "city_id": "new-cairo", "lat": 30.12014, "lng": 31.58616, "price_from": 23.5, "delivery_in": "2027", "image": "", "units": []}, {"id": "el-shorouk-springs", "name_ar": "كمبوند سبرنجز", "name_en": "كمبوند سبرنجز", "developer": "حسن علام", "city_id": "new-cairo", "lat": 30.12783, "lng": 31.60098, "price_from": 31.5, "delivery_in": "استلام فوري", "image": "", "units": []}, {"id": "mountain-view-hyde-park", "name_ar": "كمبوند ماونتن فيو هايد بارك", "name_en": "كمبوند ماونتن فيو هايد بارك", "developer": "ماونتن فيو", "city_id": "sheikh-zayed", "lat": 30.02848, "lng": 30.96128, "price_from": 7.6, "delivery_in": "2028", "image": "", "units": []}, {"id": "mountain-view-sokhna", "name_ar": "كمبوند ماونتن فيو السخنة", "name_en": "كمبوند ماونتن فيو السخنة", "developer": "ماونتن فيو", "city_id": "ain-sokhna", "lat": 29.58137, "lng": 32.30812, "price_from": 7.1, "delivery_in": "استلام فوري", "image": "", "units": []}, {"id": "grand-valleys", "name_ar": "كمبوند جراند فاليز", "name_en": "كمبوند جراند فاليز", "developer": "ماونتن فيو", "city_id": "new-capital", "lat": 30.0263, "lng": 31.75604, "price_from": 8.4, "delivery_in": "استلام فوري", "image": "", "units": []}];
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
    function one(id) { return run('readonly', function (store) { return store.get(String(id)); }); }
    function put(item) { return run('readwrite', function (store) { return store.put(item); }); }
    function drop(id) { return run('readwrite', function (store) { return store.delete(String(id)); }); }
    function json(value, status) { return new Response(JSON.stringify(value), { status: status || 200, headers: { 'Content-Type': 'application/json' } }); }
    function demoOf(id) { return DEMO.filter(function (p) { return String(p.id) === String(id); })[0] || null; }
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
            return json({ success: true, data: list });
        });
        if (/\/api\/map\/masterplans$/.test(path)) return all().then(function (items) {
            var projects = {};
            items.forEach(function (item) { if (item.image && demoOf(item.id)) projects[item.id] = { masterplan: item.image, masterplan_corners: item.corners || null, masterplan_placement: item.placement || null, version: item.version || 1, override: true }; });
            return json({ projects: projects });
        });
        if (method === 'POST' && (hit = /\/admin\/map-masterplans\/([^\/]+)\/image$/.exec(path))) {
            var file = init && init.body && init.body.get ? init.body.get('image') : null;
            if (!file) return Promise.resolve(json({ message: 'الصورة مطلوبة.' }, 422));
            return Promise.all([dataUrl(file), one(decodeURIComponent(hit[1]))]).then(function (parts) {
                var demo = demoOf(decodeURIComponent(hit[1])) || {}, item = parts[1] || { id: String(decodeURIComponent(hit[1])), name: demo.name_ar || ('مشروع ' + hit[1]), lat: demo.lat, lng: demo.lng };
                item.image = parts[0]; item.version = (item.version || 0) + 1;
                return put(item).then(function () { return json({ message: 'تم رفع الصورة — اضبط مكانها على الخريطة واحفظ.', url: item.image, version: item.version, masterplan_corners: item.corners || null }); });
            });
        }
        if (method === 'POST' && (hit = /\/admin\/map-masterplans\/([^\/]+)\/placement$/.exec(path))) {
            var body = {};
            try { body = JSON.parse(init.body); } catch (error) { body = {}; }
            return one(decodeURIComponent(hit[1])).then(function (item) {
                if (!item || !item.image) return json({ message: 'ارفع صورة الماستر بلان للمشروع ده الأول.' }, 422);
                if (!Array.isArray(body.masterplan_corners) || body.masterplan_corners.length !== 4) return json({ message: 'الأركان لازم تبقى 4 نقط.' }, 422);
                item.corners = body.masterplan_corners; item.placement = body.masterplan_placement || null; item.version = (item.version || 0) + 1;
                return put(item).then(function () { return json({ message: 'تم الحفظ ✓ الماستر بلان هتظهر على الخريطة في المكان ده.', version: item.version }); });
            });
        }
        if (method === 'DELETE' && (hit = /\/admin\/map-masterplans\/([^\/]+)$/.exec(path))) return drop(decodeURIComponent(hit[1])).then(function () { return json({ message: 'اتمسحت ماستر بلان المشروع من الخريطة.' }); });
        return realFetch(input, init);
    };
    window.MP_DEMO = { all: all, projects: DEMO };
})();
