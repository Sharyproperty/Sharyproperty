/*
 * Preview copy of the Shary dashboard (static files — there is no server behind this link).
 * Everything that only needs the browser works as on the server: the menu, tabs, pop-ups, the search above the lists.
 * What needs the server is answered here: the header search uses a saved list of names, and "save / delete / status" buttons
 * say plainly that saving happens on the server.
 */
(function () {
    'use strict';
    var D = window.SharyPreviewData || { screens: [], records: {} };
    var doc = document;
    var NOTE_SAVE = 'ده لينك معاينة: الزرار شغال ، والحفظ نفسه بيتم على السيرفر.';
    var NOTE_SAMPLE = 'في لينك المعاينة بيتفتح مثال واحد من كل شاشة — على السيرفر بيفتح السجل اللي اخترته.';
    var NOTE_MISSING = 'الشاشة دي مش ضمن لينك المعاينة (موجودة على السيرفر).';
    var EN = D.lang === 'en';
    if (EN) {
        NOTE_SAVE = 'This is a preview link: the button works, and the saving itself happens on the server.';
        NOTE_SAMPLE = 'The preview opens one example of each screen — on the server it opens the record you chose.';
        NOTE_MISSING = 'This screen is not part of the preview link (it exists on the server).';
    }

    function fold(text) {
        return String(text == null ? '' : text).toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
            .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 1632); }).replace(/\s+/g, ' ').trim();
    }
    var toastTimer = null;
    function toast(text) {
        var box = doc.getElementById('sx-preview-toast');
        if (!box) {
            box = doc.createElement('div');
            box.id = 'sx-preview-toast';
            box.setAttribute('role', 'status');
            box.style.cssText = 'position:fixed;z-index:30000;bottom:18px;left:50%;transform:translateX(-50%);max-width:min(520px,92vw);background:#10263f;color:#fff;padding:12px 18px;border-radius:14px;font:800 14.5px/1.7 Cairo,Tahoma,sans-serif;text-align:center;box-shadow:0 18px 40px -16px rgba(16,38,63,.6)';
            doc.body.appendChild(box);
        }
        box.textContent = text;
        box.style.display = 'block';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { box.style.display = 'none'; }, 4200);
    }
    try {
        if (window.sessionStorage.getItem('sx-preview-note')) { var note = window.sessionStorage.getItem('sx-preview-note'); window.sessionStorage.removeItem('sx-preview-note'); setTimeout(function () { toast(note); }, 400); }
    } catch (e) { /* private mode */ }

    // ---- a small label, so nobody mistakes this copy for the live dashboard
    var pill = doc.createElement('button');
    pill.type = 'button';
    pill.textContent = EN ? 'Preview copy' : 'نسخة معاينة';
    pill.setAttribute('aria-label', 'نسخة معاينة — اضغط للتوضيح');
    pill.style.cssText = 'position:fixed;z-index:1029;bottom:14px;inset-inline-end:14px;border:0;border-radius:999px;background:#fff3dc;color:#6b4100;padding:6px 14px;font:800 12.5px/1.6 Cairo,Tahoma,sans-serif;box-shadow:0 6px 18px -8px rgba(16,38,63,.5);cursor:pointer';
    pill.addEventListener('click', function () { toast('دي نسخة معاينة من الداشبورد الحقيقية ببيانات التجربة: التنقل والبحث والتبويبات والنوافذ شغالة ، والحفظ بيتم على السيرفر.'); });
    doc.body.appendChild(pill);

    // ---- links
    doc.addEventListener('click', function (event) {
        var link = event.target.closest && event.target.closest('a');
        if (!link) { return; }
        if (link.hasAttribute('data-sx-missing')) { event.preventDefault(); toast(link.getAttribute('data-sx-note') || NOTE_MISSING); return; }
        if (link.hasAttribute('data-sx-sample')) { try { window.sessionStorage.setItem('sx-preview-note', NOTE_SAMPLE); } catch (e) { /* ignore */ } }
    }, true);

    // ---- forms: a search form filters the rows here; a filter form opens the saved screen when there is one; a save says where saving happens
    function filterRows(term) {
        var needle = fold(term), shown = 0, any = false;
        Array.prototype.forEach.call(doc.querySelectorAll('.page-wrapper table, .sx-page table'), function (table) {
            if (table.closest('.modal')) { return; }
            Array.prototype.forEach.call(table.tBodies, function (body) {
                Array.prototype.forEach.call(body.rows, function (row) { any = true; var hit = !needle || fold(row.textContent).indexOf(needle) >= 0; row.classList.toggle('sx-hide', !hit); if (hit) { shown++; } });
            });
        });
        return any ? shown : -1;
    }
/* sx:units-ma3ak */
    doc.addEventListener('submit', function (event) {
        var form = event.target, pick = form && form.querySelector ? form.querySelector('select[name="action"]') : null;
        if (!pick || pick.value !== 'ma3ak') { return; }
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.href = 'admin-shary-ma3ak-opportunities-pick.html';
    }, true);
    doc.addEventListener('submit', function (event) {
        var form = event.target;
        if (!form || form.tagName !== 'FORM') { return; }
        event.preventDefault();
        event.stopImmediatePropagation();
        var method = (form.getAttribute('method') || 'get').toLowerCase();
        if (method === 'get') {
            var text = form.querySelector('input[name="q"], input[name="query"], input[name="search"], input[type="search"]');
            var data = new FormData(form), query = [];
            data.forEach(function (value, key) { if (value !== '' && typeof value === 'string' && key !== 'q' && key !== 'query' && key !== 'search') { query.push(key + '=' + value); } });
            var here = (window.location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '').split('_')[0];
            var target = query.length ? here + '_' + query.join('_').replace(/[=]/g, '_').replace(/[^A-Za-z0-9_.-]+/g, '-') + '.html' : null;
            if (target && D.files && D.files.indexOf(target) >= 0 && !(text && text.value)) { window.location.href = target; return; }
            if (text) {
                var shown = filterRows(text.value);
                if (shown >= 0) { toast(text.value ? shown + ' نتيجة في الصفحة دي — على السيرفر البحث في كل الصفحات.' : 'اتمسح البحث.'); return; }
            }
            toast('الفلتر ده بيتطبق على السيرفر — في المعاينة الصفحة ثابتة.');
            return;
        }
        toast(NOTE_SAVE);
    }, true);

    // ---- requests the page makes by script
    var SERVER = /update-|status|display|delete|destroy|remove|store|create-|save|reorder|sort|upload|photo/i;
    if (window.fetch) {
        var realFetch = window.fetch;
        window.fetch = function (input, init) {
            var url = typeof input === 'string' ? input : (input && input.url) || '';
            var method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
            if (/admin\/shary\/search/.test(url)) {
                var term = fold(decodeURIComponent((url.split('q=')[1] || '').split('&')[0] || ''));
                var groups = [];
                var labels = { screens: 'شاشات', projects: 'مشاريع', developers: 'مطورين', areas: 'مناطق', units: 'وحدات', articles: 'مقالات' };
                var pick = function (list, limit) { return (list || []).filter(function (item) { return fold(item.title + ' ' + (item.sub || '')).indexOf(term) >= 0; }).slice(0, limit); };
                var found = pick(D.screens, 6);
                if (found.length) { groups.push({ label: labels.screens, items: found }); }
                ['projects', 'developers', 'areas', 'units', 'articles'].forEach(function (key) {
                    var items = pick((D.records || {})[key], 6);
                    if (items.length) { groups.push({ label: labels[key], items: items }); }
                });
                return Promise.resolve(new Response(JSON.stringify({ groups: term.length < 2 ? [] : groups }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
            }
            // the home sections screen: type a name → the matching projects / developers / areas / units (saved with this copy)
            var hs = /home-sections\/([a-z_]+)\/search/.exec(url);
            if (hs && method === 'GET') {
                var want = fold(decodeURIComponent(((url.split('q=')[1] || '').split('&')[0] || '').replace(/\+/g, ' ')));
                var all = (D.home || {})[hs[1]] || [];
                var hits = all.filter(function (item) { return !want || fold((item.name || '') + ' ' + (item.sub || '')).indexOf(want) >= 0; }).slice(0, 25);
                return Promise.resolve(new Response(JSON.stringify({ items: hits }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
            }
            if (method !== 'GET' || /#preview/.test(url)) {
                toast(NOTE_SAVE);
                return Promise.resolve(new Response(JSON.stringify({ status: 0, preview: true, message: NOTE_SAVE }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
            }
            return realFetch.apply(this, arguments);
        };
    }
    doc.addEventListener('click', function (event) {
        // search results that point at one record open the saved example of that screen
        var row = event.target.closest && event.target.closest('.sx-find__row a');
        if (row && row.getAttribute('data-sample') !== '0') { try { window.sessionStorage.setItem('sx-preview-note', NOTE_SAMPLE); } catch (e) { /* ignore */ } }
    }, true);
    var jq = window.jQuery;
    if (jq && jq.ajax) {
        var realAjax = jq.ajax;
        jq.ajax = function (first, second) {
            var options = typeof first === 'string' ? jq.extend({ url: first }, second || {}) : (first || {});
            var method = String(options.type || options.method || 'GET').toUpperCase();
            var url = String(options.url || '');
            // lists the old screens fill from the server (units of a project, a developer's details): nothing in the preview copy
            if (method === 'GET' && /(^|\/)(filter-data|getMainInfo)\b/.test(url)) {
                var quiet = jq.Deferred();
                setTimeout(function () { quiet.resolve([], 'success', { status: 200 }); }, 10);
                return quiet.promise({ abort: function () {} });
            }
            if (method !== 'GET' || SERVER.test(url) || /#preview/.test(url)) {
                toast(NOTE_SAVE);
                var answer = { status: 1, type: 'success', title: 'معاينة', message: NOTE_SAVE, preview: true };
                var deferred = jq.Deferred();
                setTimeout(function () {
                    if (typeof options.beforeSend === 'function') { try { options.beforeSend(); } catch (e) { /* ignore */ } }
                    if (typeof options.complete === 'function') { try { options.complete({ status: 200 }, 'success'); } catch (e) { /* ignore */ } }
                    deferred.resolve(answer, 'success', { status: 200 });
                }, 30);
                return deferred.promise({ abort: function () {} });
            }
            return realAjax.apply(this, arguments);
        };
        jq.get = function (url, data, success) { return jq.ajax({ url: url, data: data, success: typeof data === 'function' ? data : success, type: 'GET' }); };
        jq.post = function (url, data, success) { return jq.ajax({ url: url, data: data, success: typeof data === 'function' ? data : success, type: 'POST' }); };
    }
    // links that do their work by opening an address ("change the status", "delete") — not a screen
    doc.addEventListener('click', function (event) {
        var link = event.target.closest && event.target.closest('a[href^="#preview"]');
        if (link) { event.preventDefault(); toast(NOTE_SAVE); }
    }, true);
})();
