/*
 * نسخة المعاينة من داشبورد شاري (ملفات ثابتة على GitHub Pages — مفيش سيرفر ورا اللينك ده).
 * كل حاجة في الصفحات بتشتغل زي الداشبورد الحقيقي: الزراير بتعمل شغلها (رسايل «أحسنت!» و«تم الحذف!» نفسها) ، القوايم المنسدلة بتتملي ،
 * البحث والفلاتر بيفلتروا الصفوف ، المسودات بتتحفظ (في المتصفح) ، الرفع بيعرض الصورة اللي اتختارت ، وكل لينك بيفتح صفحته.
 * الفرق الوحيد: الحفظ نفسه ما بيوصلش لداتابيز — على السيرفر الحقيقي بيتحفظ فعلًا.
 * الملف بيتحمّل في أول الصفحة (قبل سكربتات الصفحة) عشان أي طلب للسيرفر يترد عليه هنا.
 */
(function () {
    'use strict';
    if (window.__sharyPreview) { return; }
    window.__sharyPreview = true;
    var D = window.SharyPreviewData || { screens: [], records: {}, files: [] };
    var EN = D.lang === 'en' || /\/en\//.test(location.pathname);
    var doc = document;
    // صفحة «كمّل» القديمة (…_open_draft_1.html) = نفس الشاشة ?open_draft=1 — عشان المسودة اللي اتحفظت من الشاشة نفسها ترجع لوحدها
    (function () {
        var m = /^(.*\/)([^/]+)_open_draft_1(\.html)$/.exec(location.pathname);
        if (!m || !window.history || !history.replaceState) { return; }
        if (D.files && D.files.indexOf(m[2] + m[3]) < 0) { return; }
        try { history.replaceState(history.state, '', m[1] + m[2] + m[3] + '?open_draft=1' + location.hash); } catch (e) { /* */ }
    })();
    var L = EN ? {
        success: 'Good job!.', ok: 'OK', saved: 'Saved successfully', updated: 'updated successfully', deleted: 'Deleted successfully', deletedTitle: 'Deleted!',
        sure: 'Are you sure?', revert: "You won't be able to revert this!", yes: 'Yes, delete it!', cancel: 'Cancel', choose: 'Choose',
        filtered: ':n results on this page', cleared: 'Search cleared', filterNote: 'Filter applied to the rows on this page.',
        pill: 'Preview copy', pillNote: 'Preview copy of the dashboard with sample data: every screen, button and form works like the real one — only the saving itself does not reach the database (on the server it does).',
        sample: 'The preview opens one example of each screen — on the server it opens the record you chose.',
        missing: 'This screen is opened from the live dashboard.', downloaded: 'File downloaded ✓', uploaded: 'Uploaded ✓'
    } : {
        success: 'أحسنت!', ok: 'إغلاق', saved: 'تم الحفظ بنجاح', updated: 'تم التحديث بنجاح', deleted: 'تم الحذف بنجاح', deletedTitle: 'تم الحذف!',
        sure: 'هل أنت متأكد؟', revert: 'سيتم حذف البيانات ولا يمكن استرجاعها مرة اخرى', yes: 'نعم، احذفه!', cancel: 'إلغاء', choose: 'اختر',
        filtered: ':n نتيجة في الصفحة دي', cleared: 'اتمسح البحث', filterNote: 'الفلتر اتطبق على صفوف الصفحة دي.',
        pill: 'نسخة معاينة', pillNote: 'دي نسخة معاينة من الداشبورد ببيانات تجريبية: كل شاشة وزرار وفورم شغالين زي الحقيقي — الفرق إن الحفظ نفسه ما بيوصلش للداتابيز (على السيرفر بيتحفظ فعلًا).',
        sample: 'في لينك المعاينة بيتفتح مثال واحد من كل شاشة — على السيرفر بيفتح السجل اللي اخترته.',
        missing: 'الشاشة دي بتتفتح من الداشبورد الحقيقي.', downloaded: 'الملف اتحمّل ✓', uploaded: 'اترفعت ✓'
    };

    // ---------------------------------------------------------------- أماكن الملفات
    var me = doc.currentScript || Array.prototype.slice.call(doc.getElementsByTagName('script')).filter(function (s) { return /\/preview\.js(\?|$)/.test(s.src); }).pop();
    var ASSETS = me ? me.src.replace(/preview\.js.*$/, '') : new URL('a/', location.href).href;   // .../dash-full/a/
    var ROOT = ASSETS.replace(/a\/$/, '');                                                          // .../dash-full/
    var ROOT_PATH = new URL(ROOT).pathname;
    var HERE = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
    function pageUrl(file) { return ROOT + (EN ? 'en/' : '') + file; }
    function hasPage(file) { return !file || !D.files || D.files.indexOf(file) > -1; }
    var SITE = ROOT.replace(/dash-full\/$/, '').replace(/dash\/$/, '') + 'bound/' + (EN ? 'en' : 'ar') + '/v2';   // الموقع (نسخة المعاينة)

    function fold(text) {
        return String(text == null ? '' : text).toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
            .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 1632); }).replace(/\s+/g, ' ').trim();
    }
    function whenReady(fn) { if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', fn); } else { fn(); } }

    // ---------------------------------------------------------------- رسايل (نفس شكل الداشبورد)
    var noteTimer = null;
    function note(text) {
        whenReady(function () {
            var box = doc.getElementById('sx-preview-toast');
            if (!box) {
                box = doc.createElement('div');
                box.id = 'sx-preview-toast';
                box.setAttribute('role', 'status');
                box.style.cssText = 'position:fixed;z-index:30000;bottom:18px;left:50%;transform:translateX(-50%);max-width:min(520px,92vw);background:#fff;color:#123a5c;border:1px solid #d6e4f2;border-inline-start:4px solid #1f9a8b;padding:11px 16px;border-radius:12px;font:700 14px/1.7 Cairo,Tajawal,Tahoma,sans-serif;text-align:center;box-shadow:0 14px 34px -14px rgba(16,38,63,.45)';
                doc.body.appendChild(box);
            }
            box.textContent = text;
            box.style.display = 'block';
            clearTimeout(noteTimer);
            noteTimer = setTimeout(function () { box.style.display = 'none'; }, 3800);
        });
    }
    function swal(title, text, type) {
        if (window.Swal && window.Swal.fire) {
            window.Swal.fire({ title: title, text: text, type: type || 'success', icon: type || 'success', showCloseButton: true, buttonsStyling: false, confirmButtonText: '<i class="fa fa-thumbs-up"></i> ' + L.ok, confirmButtonClass: 'btn btn-primary', customClass: { confirmButton: 'btn btn-primary' } });
            return;
        }
        if (window.toastr && window.toastr.success) { window.toastr.success(text, title); return; }
        note(title + ' — ' + text);
    }
    // الصفحة عرضت رسالتها بنفسها؟ (SweetAlert / toastr / تنبيه جوه الصفحة)
    function pageAnswered() {
        return !!doc.querySelector('.swal2-container, #toast-container .toast, .toast.show, .alert-success:not([hidden]):not(.d-none)');
    }
    function confirmBox(done) {
        if (window.Swal && window.Swal.fire) {
            window.Swal.fire({ title: L.sure, text: L.revert, type: 'warning', icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: L.yes, cancelButtonText: L.cancel, confirmButtonClass: 'btn btn-primary', cancelButtonClass: 'btn btn-danger ml-1', buttonsStyling: false })
                .then(function (r) { if (r && (r.value || r.isConfirmed)) { done(); } });
            return;
        }
        if (window.confirm(L.sure)) { done(); }
    }

    // ---------------------------------------------------------------- المسودات (في المتصفح — زي السيرفر بالظبط)
    var DRAFTS = 'sx-preview-drafts';
    function drafts() { try { return JSON.parse(window.localStorage.getItem(DRAFTS) || '{}') || {}; } catch (e) { return {}; } }
    function keepDrafts(all) { try { window.localStorage.setItem(DRAFTS, JSON.stringify(all)); } catch (e) { /* التخزين مقفول */ } }
    function clock() { var d = new Date(); return (EN ? 'at ' : 'الساعة ') + d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'); }

    // ---------------------------------------------------------------- بيانات القوايم (من البيانات التجريبية)
    var LISTS = {"ar": {"property": [{"id": 19, "name": "شقة"}, {"id": 20, "name": "فيلا"}, {"id": 21, "name": "تاون هاوس"}, {"id": 22, "name": "توين هاوس"}, {"id": 23, "name": "دوبلكس"}, {"id": 24, "name": "بنتهاوس"}, {"id": 25, "name": "ستوديو"}, {"id": 30, "name": "شاليه"}, {"id": 31, "name": "مكتب إداري"}, {"id": 32, "name": "محل تجاري"}, {"id": 33, "name": "عيادة"}, {"id": 34, "name": "مخزن"}, {"id": 60, "name": "شقة"}, {"id": 61, "name": "شقة"}, {"id": 62, "name": "فيلا"}, {"id": 63, "name": "شاليه"}, {"id": 64, "name": "شاليه"}, {"id": 68, "name": "شقة فندقية"}], "types_finishing": [{"id": 7, "name": "تشطيب كامل"}, {"id": 8, "name": "نصف تشطيب"}, {"id": 9, "name": "بدون تشطيب"}, {"id": 10, "name": "مفروش"}], "featured_type": [{"id": 12, "name": "إطلالة على البحيرة"}, {"id": 13, "name": "إطلالة على الحديقة"}, {"id": 14, "name": "إطلالة على البحر"}, {"id": 15, "name": "وحدة ناصية"}, {"id": 69, "name": "موقع مميز"}], "areas": [{"id": 101, "name": "مدينتي"}, {"id": 102, "name": "الرحاب"}, {"id": 103, "name": "الشروق"}, {"id": 104, "name": "القطامية"}, {"id": 105, "name": "سيدي حنيش"}, {"id": 106, "name": "الضبعة"}, {"id": 107, "name": "سيدي عبد الرحمن"}, {"id": 108, "name": "العلمين"}, {"id": 109, "name": "غزالة باي"}, {"id": 110, "name": "علم الروم"}, {"id": 30, "name": "منطقة مخفية"}, {"id": 16, "name": "الساحل الشمالي"}, {"id": 14, "name": "العين السخنة"}, {"id": 13, "name": "رأس الحكمة"}, {"id": 10, "name": "مدينة الشيخ زايد"}, {"id": 9, "name": "مدينة 6 أكتوبر"}, {"id": 6, "name": "التجمع الخامس"}, {"id": 5, "name": "العاصمة الإدارية الجديدة"}, {"id": 4, "name": "مدينة المستقبل"}, {"id": 2, "name": "القاهرة الجديدة"}]}, "en": {"property": [{"id": 19, "name": "Apartment"}, {"id": 20, "name": "Villa"}, {"id": 21, "name": "Townhouse"}, {"id": 22, "name": "Twin House"}, {"id": 23, "name": "Duplex"}, {"id": 24, "name": "Penthouse"}, {"id": 25, "name": "Studio"}, {"id": 30, "name": "Chalet"}, {"id": 31, "name": "Office"}, {"id": 32, "name": "Shop"}, {"id": 33, "name": "Clinic"}, {"id": 34, "name": "Warehouse"}, {"id": 60, "name": "Apartment"}, {"id": 61, "name": "Apartment"}, {"id": 62, "name": "Villa"}, {"id": 63, "name": "Chalet"}, {"id": 64, "name": "Chalet"}, {"id": 68, "name": "Hotel Apartment"}], "types_finishing": [{"id": 7, "name": "Fully Finished"}, {"id": 8, "name": "Semi Finished"}, {"id": 9, "name": "Core & Shell"}, {"id": 10, "name": "Furnished"}], "featured_type": [{"id": 12, "name": "Lake View"}, {"id": 13, "name": "Garden View"}, {"id": 14, "name": "Sea View"}, {"id": 15, "name": "Corner Unit"}, {"id": 69, "name": "Prime location"}], "areas": [{"id": 101, "name": "Madinaty"}, {"id": 102, "name": "Al Rehab"}, {"id": 103, "name": "El Shorouk"}, {"id": 104, "name": "Katameya"}, {"id": 105, "name": "Sidi Heneish"}, {"id": 106, "name": "Al Dabaa"}, {"id": 107, "name": "Sidi Abdel Rahman"}, {"id": 108, "name": "Al Alamein"}, {"id": 109, "name": "Ghazala Bay"}, {"id": 110, "name": "Alam Al Roum"}, {"id": 30, "name": "Hidden Area"}, {"id": 16, "name": "North Coast"}, {"id": 14, "name": "Ain Sokhna"}, {"id": 13, "name": "Ras El Hekma"}, {"id": 10, "name": "Sheikh Zayed City"}, {"id": 9, "name": "6 October City"}, {"id": 6, "name": "Fifth Settlement"}, {"id": 5, "name": "New Capital"}, {"id": 4, "name": "Mostakbal City"}, {"id": 2, "name": "New Cairo"}]}};
    var LIST = LISTS[EN ? 'en' : 'ar'];
    function idOf(item) { var m = /#(\d+)/.exec(item.sub || ''); return m ? Number(m[1]) : 0; }
    function records(kind) { return ((D.records || {})[kind] || []).map(function (item) { return { id: idOf(item), name: item.title }; }).filter(function (item) { return item.id; }); }
    var USERS = EN
        ? [{ id: 1, name: 'Ahmed Samir', phone: '01001234567', email: 'ahmed@example.com' }, { id: 2, name: 'Mona Adel', phone: '01112345678', email: 'mona@example.com' }, { id: 3, name: 'Karim Hassan', phone: '01223456789', email: 'karim@example.com' }, { id: 4, name: 'Sara Nabil', phone: '01534567890', email: 'sara@example.com' }]
        : [{ id: 1, name: 'أحمد سمير', phone: '01001234567', email: 'ahmed@example.com' }, { id: 2, name: 'منى عادل', phone: '01112345678', email: 'mona@example.com' }, { id: 3, name: 'كريم حسن', phone: '01223456789', email: 'karim@example.com' }, { id: 4, name: 'سارة نبيل', phone: '01534567890', email: 'sara@example.com' }];

    // ---------------------------------------------------------------- الطلبات اللي بتروح للسيرفر
    var STATIC = /\.(html?|js|mjs|css|map|json|png|jpe?g|webp|gif|svg|ico|avif|bmp|woff2?|ttf|otf|eot|pdf|xlsx?|csv|docx?|zip|mp4|webm|mp3|txt|xml|webmanifest)$/i;
    function urlOf(raw) { try { return new URL(String(raw), location.href); } catch (e) { return null; } }
    function serverish(raw) {
        var s = String(raw == null ? '' : raw);
        if (s.indexOf('#preview') > -1) { return true; }
        var u = urlOf(s);
        if (!u || u.origin !== location.origin) { return false; }
        if (STATIC.test(u.pathname)) { return false; }
        if (u.pathname.indexOf(ROOT_PATH) === 0) { return u.pathname !== location.pathname && !/\/$/.test(u.pathname); }
        return true;      // /getMainInfo ، /admin/... ، /create-unit/315 ...
    }
    function pathOf(raw) {
        var s = String(raw == null ? '' : raw), at = s.indexOf('#preview/');
        if (at > -1) { return s.slice(at + 9); }
        var u = urlOf(s);
        return u ? u.pathname.replace(/^\/+/, '') + u.search : s;
    }
    function queryOf(path) { var q = path.split('?')[1] || ''; return new URLSearchParams(q); }
    function formEntries(body) {
        var out = {};
        try {
            if (body && typeof body.forEach === 'function' && typeof body.append === 'function') { body.forEach(function (v, k) { out[k] = v; }); }
            else if (typeof body === 'string') {
                try { var j = JSON.parse(body); if (j && typeof j === 'object') { return j; } } catch (e) { new URLSearchParams(body).forEach(function (v, k) { out[k] = v; }); }
            }
        } catch (e) { /* */ }
        return out;
    }
    function firstFile(body) {
        var file = null;
        try { if (body && typeof body.forEach === 'function') { body.forEach(function (v) { if (!file && typeof File !== 'undefined' && v instanceof File && v.size) { file = v; } }); } } catch (e) { /* */ }
        return file;
    }
    // الجدول اللي في الصفحة (صفحات البحث والترقيم بتطلبه من السيرفر تاني)
    function tableHtml(selector, term) {
        var box = doc.querySelector(selector || '#productTable');
        if (!box) { return ''; }
        if (!term) { return box.innerHTML; }
        var copy = box.cloneNode(true), needle = fold(term);
        Array.prototype.forEach.call(copy.querySelectorAll('tbody tr'), function (row) { if (fold(row.textContent).indexOf(needle) < 0) { row.parentNode.removeChild(row); } });
        return copy.innerHTML;
    }
    function nextScreen(path, method) {
        if (method !== 'GET') {
            var unit = /^create-unit\/(\d+)/.exec(path);
            if (unit && hasPage('units-' + unit[1] + '.html')) { return pageUrl('units-' + unit[1] + '.html'); }
            if (/^admin\/compounds\/?(\?|$)/.test(path) && hasPage('admin-compounds.html')) { return pageUrl('admin-compounds.html'); }
        }
        return location.href.split('#')[0];
    }

    function json(body, status) { return { status: status || 200, type: 'application/json', text: JSON.stringify(body) }; }
    function html(text) { return { status: 200, type: 'text/html', text: text || '' }; }
    // الرد على أي طلب للسيرفر — زي الكنترولر الحقيقي
    function answer(method, raw, body, headers) {
        var path = pathOf(raw), bare = path.split('?')[0].replace(/\/+$/, ''), q = queryOf(path);
        var wantsHtml = /text\/html/.test((headers && (headers.accept || headers.Accept)) || '') && !/json/.test((headers && (headers.accept || headers.Accept)) || '');

        // المسودات
        var dr = /admin\/shary\/drafts\/(find|save|forget)$/.exec(bare);
        if (dr) {
            var all = drafts(), f = formEntries(body), key = dr[1] === 'find' ? q.get('key') : f.key;
            if (dr[1] === 'find') { return json({ draft: key && all[key] ? all[key] : null }); }
            if (dr[1] === 'forget') { if (key) { delete all[key]; keepDrafts(all); } return json({ ok: true }); }
            var fields = {}; try { fields = JSON.parse(f.fields || '{}'); } catch (e) { fields = {}; }
            // merge=1: اللي اتغيّر بس — بيتضم على المسودة اللي قبله (زي السيرفر: FormDrafts::save)
            if (key && String(f.merge) === '1' && all[key] && all[key].fields) { fields = Object.assign({}, all[key].fields, fields); }
            if (key) { all[key] = { fields: fields, when: clock(), at: Date.now(), url: f.url || location.pathname, title: f.title || '', screen: f.screen || '' }; keepDrafts(all); }
            return json({ ok: true, when: clock() });
        }
        // بحث الهيدر
        if (/admin\/shary\/search$/.test(bare)) {
            var term = fold(q.get('q') || ''), groups = [];
            var labels = EN ? { screens: 'Screens', projects: 'Projects', developers: 'Developers', areas: 'Areas', units: 'Units', articles: 'Articles' } : { screens: 'شاشات', projects: 'مشاريع', developers: 'مطورين', areas: 'مناطق', units: 'وحدات', articles: 'مقالات' };
            var pick = function (list, limit) { return (list || []).filter(function (item) { return fold(item.title + ' ' + (item.sub || '')).indexOf(term) >= 0; }).slice(0, limit); };
            var found = pick(D.screens, 6);
            if (found.length) { groups.push({ label: labels.screens, items: found }); }
            ['projects', 'developers', 'areas', 'units', 'articles'].forEach(function (k) { var items = pick((D.records || {})[k], 6); if (items.length) { groups.push({ label: labels[k], items: items }); } });
            return json({ groups: term.length < 2 ? [] : groups });
        }
        // أقسام الرئيسية: البحث
        var hs = /home-sections\/([a-z_]+)\/search$/.exec(bare);
        if (hs && method === 'GET') {
            var want = fold((q.get('q') || '').replace(/\+/g, ' '));
            var pool = (D.home || {})[hs[1]] || [];
            return json({ items: pool.filter(function (item) { return !want || fold((item.name || '') + ' ' + (item.sub || '')).indexOf(want) >= 0; }).slice(0, 25) });
        }
        // صور الوحدات حسب المشروع
        var ps = /units-photo-sets\/(units|project-photos|preview)$/.exec(bare);
        if (ps && method === 'GET') {
            var P = (D.psets || {}).projects || {}, TY = (D.psets || {}).types || {};
            var proj = P[q.get('compound_id')] || P[Object.keys(P)[0]] || { units: [], photos: [] }, out;
            if (ps[1] === 'units') { out = { units: proj.units.map(function (u) { return { id: u.id, name: u.name, reference: u.reference, sale_type: u.sale_type, property_id: u.property_id }; }) }; }
            else if (ps[1] === 'project-photos') { out = { photos: proj.photos }; }
            else {
                var mode = q.get('mode') === 'units' ? 'units' : 'all', sale = q.get('sale_type') || 'developer_sale', pid = +q.get('property_id') || 0, model = (q.get('model') || '').trim().toLowerCase();
                var ids = q.getAll('unit_ids[]').map(Number), wantType = pid ? (TY[pid] || pid) : 0;
                out = { units: proj.units.filter(function (u) {
                    if (mode === 'units') { return ids.indexOf(u.id) > -1; }
                    if (u.sale_type !== sale) { return false; }
                    if (wantType && u.type !== wantType) { return false; }
                    return !model || (u.find || '').indexOf(model) > -1;
                }).map(function (u) { return { id: u.id, name: u.name, reference: u.reference, sale_type: u.sale_type, own: u.own, optout: u.optout, uses: !u.own && !u.optout }; }) };
            }
            return json(out);
        }
        // القوايم المنسدلة
        if (/(^|\/)filter-data$/.test(bare)) { return json({ developers: records('developers'), areas: LIST.areas, compounds: records('projects') }); }
        if (/(^|\/)getMainInfo$/.test(bare)) { return json({ property: LIST.property, types_finishing: LIST.types_finishing, featured_type: LIST.featured_type }); }
        if (/(^|\/)getCities$/.test(bare)) { return json(LIST.areas); }
        if (/(^|\/)getCompounds$/.test(bare)) { return json(records('projects')); }
        if (/(^|\/)getTop$/.test(bare)) { return json(/area|cit/.test(q.get('type') || '') ? LIST.areas : records('projects')); }
        if (/(^|\/)getUsers$/.test(bare)) { return json(USERS); }
        if (/units\/search-options$/.test(bare)) {
            var t = fold(q.get('q') || '');
            return json({ results: ((D.records || {}).units || []).filter(function (u) { return !t || fold(u.title + ' ' + (u.sub || '')).indexOf(t) > -1; }).slice(0, 20).map(function (u) { return { id: idOf(u) || u.title, text: u.title + (u.sub ? ' — ' + u.sub : '') }; }) });
        }
        // البحث والترقيم في الجداول: الجدول اللي في الصفحة (متفلتر)
        if (/(^|\/)search-unit$/.test(bare)) { return html(tableHtml('#productTable', q.get('query') || q.get('search') || '')); }
        if (/(^|\/)(units-list|limited-offer-units)$/.test(bare) && method === 'GET') { return json({ units: tableHtml('#productTable', q.get('query') || ''), pagination: (doc.querySelector('#paginationLinks') || {}).innerHTML || '' }); }
        if (/^admin\/compounds$/.test(bare) && method === 'GET') { return json({ compounds: tableHtml('#productTable', q.get('search') || ''), pagination: (doc.querySelector('#paginationLinks') || {}).innerHTML || '' }); }
        // معاينة الكارت والصفحة (فورم الوحدة)
        if (/units\/preview$/.test(bare)) { return { preview: true }; }
        // رفع صورة: الصورة اللي اتختارت نفسها
        var file = firstFile(body);
        if (file && /upload|image|photo|media|gallery|file/i.test(bare)) {
            var link = URL.createObjectURL(file);
            return json({ ok: true, success: true, status: 1, url: link, preview: link, path: link, image: link, location: link, message: L.uploaded, title: L.success, type: 'success' });
        }
        // أي طلب تاني
        if (method === 'GET') {
            if (wantsHtml) { return html(''); }
            if (/update-|status|display|toggle|approve|reject|publish|activate|show-?ai/i.test(bare)) {
                return json({ status: 1, success: true, ok: true, type: 'success', title: L.success, message: L.updated, data: {} });
            }
            return json({ status: 1, success: true, ok: true, data: [], items: [], results: [], html: '', message: '' });
        }
        var removing = /destroy|delete|remove/i.test(bare) || method === 'DELETE' || /^delete$/i.test(String(formEntries(body)._method || ''));
        return json({ status: 1, success: true, ok: true, type: 'success', title: removing ? L.deletedTitle : L.success, message: removing ? L.deleted : (/update|edit/i.test(bare) ? L.updated : L.saved), route: nextScreen(bare, method), redirect: null, data: {}, id: 1 });
    }

    // طلب من المستخدم (ضغطة زرار) ولا طلب في الخلفية (حفظ المسودة لوحده)؟
    var lastAction = 0;
    ['click', 'submit', 'change'].forEach(function (name) { doc.addEventListener(name, function (e) { if (name !== 'change' || (e.target && e.target.type === 'checkbox')) { lastAction = Date.now(); } }, true); });
    function byUser() { return Date.now() - lastAction < 2500; }
    function afterAction(method, raw, res) {
        // الصفحة ما عرضتش رسالة بنفسها بعد حفظ اليوزر: رسالة الداشبورد العادية
        if (method === 'GET' || !byUser() || /drafts\//.test(String(raw))) { return; }
        setTimeout(function () {
            if (pageAnswered()) { return; }
            var body = {}; try { body = JSON.parse(res.text || '{}'); } catch (e) { body = {}; }
            if (body.message) { swal(body.title || L.success, body.message, 'success'); }
        }, 900);
    }

    // fetch
    if (window.fetch) {
        var realFetch = window.fetch.bind(window);
        window.fetch = function (input, init) {
            var raw = typeof input === 'string' ? input : (input && input.url) || String(input || '');
            if (!serverish(raw)) { return realFetch(input, init); }
            var method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
            var headers = {};
            try { var h = (init && init.headers) || {}; if (typeof h.forEach === 'function') { h.forEach(function (v, k) { headers[k.toLowerCase()] = v; }); } else { Object.keys(h).forEach(function (k) { headers[k.toLowerCase()] = h[k]; }); } } catch (e) { /* */ }
            var res = answer(method, raw, init && init.body, headers);
            if (res && res.preview) {
                var page = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
                return realFetch(ASSETS + 'unit-preview/' + (EN ? 'en-' : '') + page).then(function (r) {
                    return r.ok ? r : new Response('<p style="font-family:Cairo,Tahoma;font-weight:700;padding:24px">' + L.saved + '</p>', { status: 200, headers: { 'Content-Type': 'text/html' } });
                });
            }
            return new Promise(function (done) {
                setTimeout(function () {
                    done(new Response(res.text, { status: res.status, headers: { 'Content-Type': res.type } }));
                    afterAction(method, raw, res);
                }, /drafts\//.test(raw) ? 60 : 260);
            });
        };
    }

    // XMLHttpRequest (jQuery.ajax وغيره) — الرد بيوصل للصفحة بالـ success بتاعها زي السيرفر
    if (window.XMLHttpRequest) {
        var XP = XMLHttpRequest.prototype, xOpen = XP.open, xSend = XP.send, xHeader = XP.setRequestHeader;
        XP.open = function (method, url) { this.__pv = { method: String(method || 'GET').toUpperCase(), url: String(url), headers: {} }; return xOpen.apply(this, arguments); };
        XP.setRequestHeader = function (k, v) { if (this.__pv) { this.__pv.headers[String(k).toLowerCase()] = v; } return xHeader.apply(this, arguments); };
        XP.send = function (body) {
            var pv = this.__pv;
            if (!pv || !serverish(pv.url)) { return xSend.apply(this, arguments); }
            var xhr = this, res = answer(pv.method, pv.url, body, pv.headers);
            if (res && res.preview) { res = html('<p style="font-family:Cairo,Tahoma;font-weight:700;padding:24px">' + L.saved + '</p>'); }
            var set = function (k, v) { try { Object.defineProperty(xhr, k, { configurable: true, value: v }); } catch (e) { /* */ } };
            setTimeout(function () {
                var text = res.text;
                var value = xhr.responseType === 'json' ? (function () { try { return JSON.parse(text); } catch (e) { return null; } })() : xhr.responseType === 'blob' ? new Blob([text], { type: res.type }) : text;
                set('readyState', 4); set('status', res.status); set('statusText', 'OK'); set('responseText', typeof text === 'string' ? text : ''); set('response', value); set('responseURL', String(pv.url));
                set('getAllResponseHeaders', function () { return 'content-type: ' + res.type + '\r\n'; });
                set('getResponseHeader', function (name) { return /content-type/i.test(name) ? res.type : null; });
                try { if (xhr.upload) { xhr.upload.dispatchEvent(new ProgressEvent('progress', { lengthComputable: true, loaded: 100, total: 100 })); xhr.upload.dispatchEvent(new ProgressEvent('load')); } } catch (e) { /* */ }
                try { if (typeof xhr.onreadystatechange === 'function') { xhr.onreadystatechange(new Event('readystatechange')); } } catch (e) { setTimeout(function () { throw e; }); }
                try { xhr.dispatchEvent(new Event('readystatechange')); } catch (e) { /* */ }
                try { if (typeof xhr.onload === 'function') { xhr.onload(new ProgressEvent('load')); } } catch (e) { setTimeout(function () { throw e; }); }
                try { xhr.dispatchEvent(new ProgressEvent('load')); xhr.dispatchEvent(new ProgressEvent('loadend')); } catch (e) { /* */ }
                try { if (typeof xhr.onloadend === 'function') { xhr.onloadend(new ProgressEvent('loadend')); } } catch (e) { /* */ }
                afterAction(pv.method, pv.url, res);
            }, /drafts\//.test(pv.url) ? 60 : 260);
        };
    }

    // ---------------------------------------------------------------- الفورمز
    function filterRows(terms) {
        terms = terms.map(fold).filter(Boolean);
        var shown = 0, any = false;
        Array.prototype.forEach.call(doc.querySelectorAll('.page-wrapper table, .sx-page table, table.datanew, #productTable table, table'), function (table) {
            if (table.closest('.modal') || table.__pvSeen) { return; }
            table.__pvSeen = true;
            Array.prototype.forEach.call(table.tBodies, function (body) {
                Array.prototype.forEach.call(body.rows, function (row) {
                    any = true;
                    var hay = fold(row.textContent), hit = terms.every(function (t) { return hay.indexOf(t) >= 0; });
                    row.classList.toggle('sx-hide', !hit);
                    row.style.display = hit ? '' : 'none';
                    if (hit) { shown++; }
                });
            });
        });
        Array.prototype.forEach.call(doc.querySelectorAll('table'), function (table) { table.__pvSeen = false; });
        return any ? shown : -1;
    }
    function getForm(form) {
        // فلتر محفوظ في المعاينة ← شاشته ، غير كده الصفوف اللي في الصفحة بتتفلتر بالكلام والاختيارات
        var data = new FormData(form), query = [], terms = [];
        data.forEach(function (value, key) {
            if (typeof value !== 'string' || value === '') { return; }
            if (/^(q|query|search|keyword|name)$/i.test(key)) { terms.push(value); return; }
            query.push(key + '=' + value);
            var field = form.elements[key];
            if (field && field.tagName === 'SELECT' && field.selectedIndex > -1) { var label = field.options[field.selectedIndex].text.trim(); if (label && !/^(اختر|الكل|all|choose|select)/i.test(label)) { terms.push(label); } }
        });
        var here = HERE.replace(/\.html$/, '').split('_')[0];
        var target = query.length ? here + '_' + query.join('_').replace(/[=]/g, '_').replace(/[^A-Za-z0-9_.-]+/g, '-') + '.html' : null;
        if (target && D.files && D.files.indexOf(target) >= 0 && !terms.length) { location.href = target; return; }
        var shown = filterRows(terms);
        if (shown >= 0) { note(terms.length ? L.filtered.replace(':n', shown) : L.cleared); return; }
        note(L.filterNote);
    }
    function closeModal(el) {
        var modal = el && el.closest && el.closest('.modal');
        if (!modal) { return; }
        try { if (window.bootstrap && window.bootstrap.Modal) { (window.bootstrap.Modal.getInstance(modal) || new window.bootstrap.Modal(modal)).hide(); return; } } catch (e) { /* */ }
        try { if (window.jQuery && window.jQuery.fn.modal) { window.jQuery(modal).modal('hide'); return; } } catch (e) { /* */ }
        modal.classList.remove('show'); modal.style.display = 'none';
        var back = doc.querySelector('.modal-backdrop'); if (back) { back.parentNode.removeChild(back); }
    }
    function removeRow(el) {
        var row = el && el.closest && el.closest('tr, li.list-group-item, .sx-row, .card.sx-item, .col-xl-3, .col-lg-4');
        if (!row || row.closest('.modal')) { return; }
        row.style.transition = 'opacity .3s'; row.style.opacity = '0';
        setTimeout(function () { if (row.parentNode) { row.parentNode.removeChild(row); } }, 320);
    }
    function serverSubmit(form, submitter) {
        var action = (submitter && submitter.getAttribute('formaction')) || form.getAttribute('action') || '';
        var methodField = form.querySelector('input[name="_method"]');
        var verb = String(methodField ? methodField.value : form.getAttribute('method') || 'post').toUpperCase();
        var removing = verb === 'DELETE' || /destroy|delete|remove/i.test(action);
        var buttons = form.querySelectorAll('[type="submit"], button:not([type])');
        Array.prototype.forEach.call(buttons, function (b) { b.disabled = true; });
        setTimeout(function () {
            Array.prototype.forEach.call(buttons, function (b) { b.disabled = false; });
            if (removing) { removeRow(form); }
            closeModal(form);
            if (window.scrollY > 300 && !removing) { window.scrollTo({ top: 0, behavior: 'smooth' }); }
            swal(removing ? L.deletedTitle : L.success, removing ? L.deleted : (/update|edit/i.test(action) || verb === 'PUT' || verb === 'PATCH' ? L.updated : L.saved), 'success');
        }, 350);
    }
    function handleSubmit(form, submitter) {
        var method = (form.getAttribute('method') || 'get').toLowerCase();
        var action = form.getAttribute('action') || '';
        if (method === 'get') {
            if (action && !serverish(action) && !/^#/.test(action)) { return false; }    // فورم بيروح لصفحة تانية في المعاينة
            getForm(form);
            return true;
        }
        if (action && !serverish(action) && !/^#/.test(action)) { return false; }
        serverSubmit(form, submitter);
        return true;
    }
    // بعد سكربتات الصفحة نفسها (اللي بتمنع الإرسال وبتبعت بالـ AJAX): لو الفورم لسه رايح للسيرفر — المعاينة بترد زي السيرفر
    window.addEventListener('submit', function (event) {
        var form = event.target;
        if (!form || form.tagName !== 'FORM' || event.defaultPrevented) { return; }
        if (handleSubmit(form, event.submitter)) { event.preventDefault(); }
    }, false);
    var nativeSubmit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = function () {
        if (handleSubmit(this, null)) { return; }
        return nativeSubmit.apply(this, arguments);
    };

    // ---------------------------------------------------------------- اللينكات
    var SITE_PATHS = { 'top-projects': 'top-projects', 'shary-index': 'shary-index', 'resale-opportunities': 'shary-ma3ak', 'developers': 'developers', 'areas': 'all-areas', 'offers': 'offers',
        'all-launches': 'all-launches', 'shary-card': 'shary-card', 'shary-map': 'map', 'map': 'map', 'properties-abroad': 'properties-abroad', 'search': 'for-sale', 'rent': 'rent', 'blog': 'blogs',
        'blogs': 'blogs', 'about': 'about', 'contact': 'contact', 'contact-us': 'contact', 'careers': 'careers', 'projects': 'projects', 'sell': 'sell', 'trendy': 'trendy', 'academy': 'academy', '': '' };
    function siteUrl(path) {
        path = String(path || '').trim().replace(/^https?:\/\/[^/]+/, '').replace(/^\/(ar|en)(\/|$)/, '/').replace(/^\/+|\/+$/g, '').split('?')[0];
        var parts = path.split('/'), head = parts[0];
        if (head === 'areas' && parts[1]) { return SITE + '/area/' + parts[1] + '.html'; }
        if ((head === 'blog' || head === 'blogs') && parts[1]) { return SITE + '/blog-details/' + parts.slice(1).join('/') + '.html'; }
        if (head === 'project' || head === 'compound') { return SITE + '/' + path + '.html'; }
        if (head in SITE_PATHS) { return SITE_PATHS[head] ? SITE + '/' + SITE_PATHS[head] + '.html' : SITE + '.html'; }
        return SITE + '/' + path + '.html';
    }
    function openSite(url) {
        // الصفحة موجودة في معاينة الموقع؟ وإلا الرئيسية
        var tab = window.open('about:blank', '_blank');
        var go = function (target) { if (tab) { tab.location.href = target; } else { location.href = target; } };
        realHead(url).then(function (ok) { go(ok ? url : SITE + '.html'); });
    }
    function realHead(url) {
        if (typeof realFetch !== 'function') { return Promise.resolve(true); }
        return realFetch(url, { method: 'HEAD' }).then(function (r) { return r.ok; }, function () { return false; });
    }
    function tableCsv(from) {
        var table = (from && from.closest && from.closest('.card, .page-wrapper, .content, body') || doc).querySelector('table');
        if (!table) { return null; }
        var rows = Array.prototype.map.call(table.querySelectorAll('tr'), function (tr) {
            return Array.prototype.map.call(tr.querySelectorAll('th, td'), function (cell) { return '"' + String(cell.textContent || '').replace(/\s+/g, ' ').trim().replace(/"/g, '""') + '"'; }).join(',');
        }).filter(function (line) { return line.replace(/[",]/g, ''); });
        return '﻿' + rows.join('\r\n');
    }
    function download(name, text, type) {
        var blob = new Blob([text], { type: type || 'text/csv;charset=utf-8' }), a = doc.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = name; doc.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.parentNode.removeChild(a); }, 1000);
        note(L.downloaded);
    }
    function fileLink(url, name) {
        var a = doc.createElement('a');
        a.href = url; a.download = name || ''; doc.body.appendChild(a); a.click();
        setTimeout(function () { if (a.parentNode) { a.parentNode.removeChild(a); } }, 500);
        note(L.downloaded);
    }
    function missingLink(link) {
        var text = (link.textContent || '').replace(/\s+/g, ' ').trim(), why = link.getAttribute('data-sx-note') || '';
        if (/^(إلغاء|الغاء|cancel|رجوع|back)$/i.test(text)) { if (window.history.length > 1) { window.history.back(); } else { location.href = pageUrl('index.html'); } return; }
        if (/مثال|example|sample/i.test(text)) { fileLink(ASSETS + 'downloads/shary-list-example.csv', 'shary-list-example.csv'); return; }
        if (/zip|بلجن|plugin/i.test(text)) { fileLink(ASSETS + 'downloads/shary-figma-plugin.zip', 'shary-figma-plugin.zip'); return; }
        if (/افتح الملف|open (the )?file/i.test(text)) { window.open(ASSETS + 'downloads/llms.txt', '_blank'); return; }
        if (/^(افتح|open)$/i.test(text) && /performance/.test(HERE)) { window.open(pageUrl(HERE), '_blank'); return; }
        if (/^(حسابي|my account|حسابى|profile|الملف الشخصي)$/i.test(text)) { location.href = pageUrl(hasPage('edit-supervisor-3.html') ? 'edit-supervisor-3.html' : 'supervisor.html'); return; }
        if (/^(خروج|log ?out|تسجيل الخروج|sign ?out)$/i.test(text)) { location.href = pageUrl('signin.html'); return; }
        if (/تحميل|download|csv|excel|تصدير|export|نزّل|نزل/i.test(text + ' ' + why)) {
            var csv = tableCsv(link);
            if (csv) { download((HERE.replace(/\.html$/, '') || 'export') + '.csv', csv); return; }
            download('sample.csv', '﻿' + (EN ? 'name,value\r\nSample,1\r\n' : 'الاسم,القيمة\r\nمثال,1\r\n'));
            return;
        }
        var path = link.getAttribute('data-sx-href') || (/^\//.test(text) ? text : '');
        if (path) { openSite(siteUrl(path)); return; }
        var links = window.SharySiteLinks || {};
        var named = links[fold(text)];
        if (named) { openSite(named); return; }
        // لينك «الصفحة على الموقع» جوه صفحة مشروع / مطور / منطقة: صفحة نفس الاسم في معاينة الموقع
        var titles = Array.prototype.map.call(doc.querySelectorAll('.shub-hero h1, .shub-head h1, .shub__title, h1, .page-header h4, .page-title h4'), function (el) { return el.textContent; });
        for (var i = 0; i < titles.length; i++) {
            var parts = String(titles[i] || '').split(/\s+[—–|·-]\s+|[«»]/);
            for (var j = 0; j < parts.length; j++) { var hit = links[fold(parts[j])]; if (hit) { openSite(hit); return; } }
        }
        openSite(SITE + '.html');
    }
    doc.addEventListener('click', function (event) {
        var link = event.target.closest && event.target.closest('a');
        if (!link) { return; }
        if (link.hasAttribute('data-sx-missing')) { event.preventDefault(); event.stopImmediatePropagation(); missingLink(link); return; }
        if (link.hasAttribute('data-sx-sample')) { try { window.sessionStorage.setItem('sx-preview-note', L.sample); } catch (e) { /* */ } }
        var href = link.getAttribute('href') || '';
        if (/^#preview/.test(href)) {
            event.preventDefault();
            var path = href.slice(9);
            if (/agent[./-]masterplans/.test(path) && hasPage('admin-shary-agent-masterplans.html')) { window.open(pageUrl('admin-shary-agent-masterplans.html'), link.target === '_blank' ? '_blank' : '_self'); return; }
            if (/destroy|delete|remove/i.test(path)) { confirmBox(function () { removeRow(link); swal(L.deletedTitle, L.deleted, 'success'); }); return; }
            if (/export|excel|csv|download/i.test(path)) { var csv = tableCsv(link); if (csv) { download('export.csv', csv); return; } }
            swal(L.success, L.updated, 'success');
        }
    }, true);
    doc.addEventListener('click', function (event) {
        var row = event.target.closest && event.target.closest('.sx-find__row a');
        if (row && row.getAttribute('data-sample') !== '0') { try { window.sessionStorage.setItem('sx-preview-note', L.sample); } catch (e) { /* */ } }
    }, true);

    // ---------------------------------------------------------------- صفحة «المسودات»: مسوداتك انت (اللي اتحفظت من المعاينة على الجهاز ده) — زي الداشبورد بالظبط
    var PROJECT_DRAFT = /compounds|shary-projects|masterplans|project-landing-pages/;     // FormDrafts::KINDS['projects']
    var UNIT_DRAFTS = 9;                                                                     // صفحة مسودات الوحدات والشيتات (بيانات تجريبية)
    function draftList(kind) {
        var all = drafts();
        return Object.keys(all).map(function (key) { var d = all[key] || {}; return { key: key, title: d.title || '', screen: d.screen || '', url: d.url || '', at: d.at || 0, when: d.when || '' }; })
            .filter(function (d) { return kind !== 'projects' || PROJECT_DRAFT.test(d.key); })
            .sort(function (a, b) { return b.at - a.at; });
    }
    function stamp(ms) {
        if (!ms) { return ''; }
        var d = new Date(ms), p = function (n) { return String(n).padStart(2, '0'); };
        return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    }
    function esc(text) { return String(text == null ? '' : text).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function setTag(link, n) {
        var tag = link.querySelector('.sx-tag');
        if (!n) { if (tag) { tag.parentNode.removeChild(tag); } return; }
        if (!tag) { tag = doc.createElement('b'); tag.className = 'sx-tag'; link.appendChild(tag); }
        tag.textContent = String(n);
    }
    function draftCounts() {
        var all = draftList().length, projects = draftList('projects').length;
        Array.prototype.forEach.call(doc.querySelectorAll('a.sx-one[href$="admin-shary-drafts.html"]'), function (a) { setTag(a, all + UNIT_DRAFTS); });
        Array.prototype.forEach.call(doc.querySelectorAll('.sx-grp a[href$="admin-shary-drafts_only_projects.html"]'), function (a) { setTag(a, projects); });
        Array.prototype.forEach.call(doc.querySelectorAll('.page-btn a.btn[href$="admin-shary-drafts_only_projects.html"]'), function (a) {
            a.textContent = (EN ? 'Project drafts' : 'مسودات المشاريع') + (projects ? ' (' + projects + ')' : '');
        });
    }
    whenReady(function () {
        draftCounts();
        var page = /^admin-shary-drafts(_only_projects)?\.html$/.exec(HERE);
        var body = page && doc.querySelector('.page-wrapper .content .card .card-body');
        if (!body) { return; }
        var kind = page[1] ? 'projects' : '';
        var T = EN
            ? { title: 'Drafts', screen: 'Screen', when: 'Last change', open: 'Continue', drop: 'Delete the draft',
                none: kind ? 'No project drafts right now. Any project you add or edit is saved as a draft by itself while you work.' : 'No drafts right now.' }
            : { title: 'المسودات', screen: 'الشاشة', when: 'آخر تعديل', open: 'كمّل', drop: 'امسح المسودة',
                none: kind ? 'مفيش مسودات مشاريع دلوقتي. أي مشروع بتضيفه أو بتعدّله بيتحفظ كمسودة لوحده وانت شغال.' : 'مفيش مسودات دلوقتي.' };
        function paint() {
            var rows = draftList(kind);
            if (!rows.length) { body.innerHTML = '<p class="shary-help" style="margin:0">' + esc(T.none) + '</p>'; return; }
            body.innerHTML = '<div class="table-responsive"><table class="table"><thead><tr><th>' + esc(T.title) + '</th><th>' + esc(T.screen) + '</th><th>' + esc(T.when) + '</th><th></th></tr></thead><tbody>'
                + rows.map(function (d) {
                    var href = d.url ? d.url + (d.url.indexOf('?') > -1 ? '&' : '?') + 'open_draft=1' : '';
                    return '<tr data-sx-draft="' + esc(d.key) + '"><td style="font-weight:800">' + esc(d.title || '—') + '</td><td>' + esc(d.screen || d.key) + '</td>'
                        + '<td dir="ltr" style="text-align:start">' + esc(stamp(d.at) || d.when) + '</td><td style="white-space:nowrap">'
                        + (href ? '<a class="btn btn-primary btn-sm" href="' + esc(href) + '">' + esc(T.open) + '</a> ' : '')
                        + '<button type="button" class="btn btn-outline-danger btn-sm" data-sx-draft-drop="' + esc(d.key) + '">' + esc(T.drop) + '</button></td></tr>';
                }).join('') + '</tbody></table></div>';
        }
        paint();
        body.addEventListener('click', function (event) {
            var button = event.target.closest && event.target.closest('[data-sx-draft-drop]');
            if (!button) { return; }
            if (!window.confirm(T.drop + (EN ? '?' : '؟'))) { return; }
            var all = drafts();
            delete all[button.getAttribute('data-sx-draft-drop')];
            keepDrafts(all);
            paint();
            draftCounts();
        });
    });

    // ---------------------------------------------------------------- علامة «نسخة معاينة» + رسالة الصفحة اللي قبلها
    whenReady(function () {
        try { var carried = window.sessionStorage.getItem('sx-preview-note'); if (carried) { window.sessionStorage.removeItem('sx-preview-note'); setTimeout(function () { note(carried); }, 400); } } catch (e) { /* */ }
        if (window.name === 'sx-embed' || /[?&]embed=1/.test(location.search)) { return; }
        var pill = doc.createElement('button');
        pill.type = 'button';
        pill.textContent = L.pill;
        pill.setAttribute('aria-label', L.pill);
        pill.style.cssText = 'position:fixed;z-index:1029;bottom:14px;inset-inline-end:14px;border:0;border-radius:999px;background:#fff3dc;color:#6b4100;padding:6px 14px;font:800 12.5px/1.6 Cairo,Tahoma,sans-serif;box-shadow:0 6px 18px -8px rgba(16,38,63,.5);cursor:pointer';
        pill.addEventListener('click', function () { note(L.pillNote); });
        doc.body.appendChild(pill);
    });
})();
