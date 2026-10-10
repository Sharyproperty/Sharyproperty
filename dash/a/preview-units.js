/*
 * Preview copy — the units tools (the one-page unit form, «المسودات», the review of a units sheet) answer here the way the server
 * does, so every button can be tried: the automatic save and «حفظ كمسودة» keep the draft in this browser (it comes back with
 * «استكمل»), the review's changes are checked in the page, «احفظ الوحدات الجاهزة» marks the ready rows saved, the upload opens the
 * sample review. Nothing leaves the browser.
 */
(function () {
    'use strict';
    // the English copy lives under /en/ (the preview's data file is read after this script)
    var EN = /\/en\//.test(window.location.pathname);
    var CFG = window.SharyUnitsPreview || {};
    var KEY = 'sx-units-preview-drafts';
    var T = EN ? {
        note: 'Preview: the draft is kept in this browser — on the server it is kept for the whole team.',
        resumed: 'You are continuing a draft (kept in this browser in the preview).',
        removed: 'The draft was removed (in the preview).',
        upload: 'The preview opens a sample sheet — on the server the file you upload is read.',
        saved: 'In the preview the saving is a try: on the server each ready row becomes a unit.',
        kept: 'kept in the draft', local: 'this browser', untitled: 'A unit with no name yet', newUnit: 'New unit', editUnit: 'Unit changes',
        draft: 'Draft — not published', cont: 'Continue the draft', drop: 'Remove', today: 'today', need: 'Choose the project first.', file: 'Choose the sheet file.',
        tryFail: 'Preview: try «Saving failed»', tryFailNote: 'The next save fails on purpose (preview only): you see «Saving failed» and «Try again» — then it saves by itself a few seconds later, nothing is lost.'
    } : {
        note: 'معاينة: المسودة اتحفظت في المتصفح ده — على السيرفر بتتحفظ للفريق كله.',
        resumed: 'إنت بتكمّل مسودة (متحفظة في المتصفح ده في المعاينة).',
        removed: 'المسودة اتحذفت (في المعاينة).',
        upload: 'في المعاينة بيتفتح شيت تجربة — على السيرفر بيتقري الملف اللي رفعته.',
        saved: 'في المعاينة الحفظ تجريبي: على السيرفر كل صف جاهز بيبقى وحدة.',
        kept: 'محفوظ في المسودة', local: 'المتصفح ده', untitled: 'وحدة من غير اسم لسه', newUnit: 'وحدة جديدة', editUnit: 'تعديل وحدة',
        draft: 'مسودة — مش منشورة', cont: 'استكمل المسودة', drop: 'احذف', today: 'النهارده', need: 'اختار المشروع الأول.', file: 'اختار ملف الشيت.',
        tryFail: 'معاينة: جرّب «فشل الحفظ»', tryFailNote: 'الحفظ الجاي هيفشل عن قصد (في المعاينة بس): هتشوف «فشل الحفظ» وزرار «حاول تاني» — وبعدها بثواني بيتحفظ لوحده ومفيش حاجة بتضيع.'
    };

    function store() { try { return JSON.parse(window.localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
    function keep(all) { try { window.localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) { /* private mode */ } }
    function clock() { var d = new Date(); return (EN ? 'today ' : 'النهارده ') + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); }
    function size(bytes) { return bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(bytes / 1024)) + ' KB'; }
    // like the server: the answer takes a moment (so «جارٍ الحفظ…» shows), and «جرّب فشل الحفظ» makes the next one fail like a dropped line
    var failNext = 0;
    function json(data, status) {
        return new Promise(function (resolve, reject) {
            window.setTimeout(function () {
                if (failNext > 0) { failNext--; reject(new TypeError('Failed to fetch (preview)')); return; }
                resolve(new Response(JSON.stringify(data), { status: status || 200, headers: { 'Content-Type': 'application/json' } }));
            }, 700);
        });
    }
    function page() { return (window.location.pathname.split('/').pop() || '').replace(/\?.*$/, ''); }
    function toast(text) {
        var box = document.getElementById('sx-preview-toast');
        if (!box) {
            box = document.createElement('div');
            box.id = 'sx-preview-toast';
            box.setAttribute('role', 'status');
            box.style.cssText = 'position:fixed;z-index:30000;bottom:18px;left:50%;transform:translateX(-50%);max-width:min(520px,92vw);background:#10263f;color:#fff;padding:12px 18px;border-radius:14px;font:800 14.5px/1.7 Cairo,Tahoma,sans-serif;text-align:center;box-shadow:0 18px 40px -16px rgba(16,38,63,.6)';
            document.body.appendChild(box);
        }
        box.textContent = text;
        box.style.display = 'block';
        clearTimeout(box.__t);
        box.__t = setTimeout(function () { box.style.display = 'none'; }, 4200);
    }

    // ------------------------------------------------------------------ the server's answers (installed after the preview's own runtime)
    function answer(url, init) {
        var method = String((init && init.method) || 'GET').toUpperCase();
        if (method !== 'POST') { return null; }
        if (/#preview-units\/autosave/.test(url)) {
            var data = init.body;
            var fields = {};
            var files = [];
            var drops = [];
            data.forEach(function (value, key) {
                if (typeof File !== 'undefined' && value instanceof File) {
                    files.push({ id: 'p' + Math.random().toString(36).slice(2, 12), field: key.replace(/\[\]$/, '').replace(/\[(\w+)\]/g, '.$1'), name: value.name, size: size(value.size) });
                    return;
                }
                if (key === 'draft_drop[]') { drops.push(value); return; }
                if (key === '_token' || key === 'draft_keep[]') { return; }
                if (key.slice(-2) === '[]') { (fields[key] = fields[key] || []).push(value); } else { fields[key] = value; }
            });
            var token = fields._draft || ('p-' + Date.now());
            var all = store();
            var one = all[token] || { files: [] };
            one.fields = fields;
            one.page = page();
            one.title = fields.name_ar || fields.name_en || '';
            one.unit = fields._unit || '';
            one.updated = clock();
            one.files = (one.files || []).filter(function (file) { return drops.indexOf(file.id) < 0; }).filter(function (file) {
                // one file per field (a new one replaces it), the gallery adds up
                return file.field === 'gallery' || !files.some(function (fresh) { return fresh.field === file.field; });
            }).concat(files);
            all[token] = one;
            keep(all);
            return json({ ok: true, token: token, saved_at: one.updated, saved_full: one.updated, files: one.files, rejected: [] });
        }
        if (/#preview-units\/rows/.test(url)) {
            var sent = {};
            try { sent = JSON.parse(init.body || '{}'); } catch (e) { sent = {}; }
            var key = 'sx-units-preview-sheet-' + page();
            var saved = {};
            try { saved = JSON.parse(window.localStorage.getItem(key) || '{}') || {}; } catch (e) { saved = {}; }
            Object.keys(sent.edits || {}).forEach(function (id) { saved[id] = Object.assign(saved[id] || {}, sent.edits[id]); });
            try { window.localStorage.setItem(key, JSON.stringify(saved)); } catch (e) { /* ignore */ }
            return json({ ok: true, saved_at: clock(), rows: {}, states: {} });
        }
        if (/#preview-units\/save/.test(url)) {
            var rows = Array.prototype.slice.call(document.querySelectorAll('tr.sx-rv-row[data-state="open"][data-ready="1"]'));
            var out = {};
            rows.forEach(function (tr, index) {
                var name = tr.querySelector('[data-cell="name_ar"]');
                out[tr.getAttribute('data-row')] = { id: 9001 + index, url: '#', name: name ? name.value : '' };
            });
            setTimeout(function () { toast(T.saved); }, 600);
            var count = rows.length;
            var message = EN ? (count === 1 ? '1 unit was saved.' : count + ' units were saved.') : (count === 1 ? 'اتحفظت وحدة واحدة.' : count === 2 ? 'اتحفظت وحدتين.' : 'اتحفظت ' + count + ' وحدات.');
            return json({ ok: true, message: message, saved: out, rows: {}, states: {} });
        }
        return null;
    }
    document.addEventListener('DOMContentLoaded', function () {
        var inner = window.fetch;
        window.fetch = function (input, init) {
            var url = typeof input === 'string' ? input : (input && input.url) || '';
            var mine = answer(url, init);
            return mine || inner.apply(this, arguments);
        };
        resume();
        draftsPage();
        sheetEdits();
        tryFailure();
    });

    // ------------------------------------------------------------------ the unit form: a draft kept in this browser comes back
    function resume() {
        var form = document.querySelector('[data-unit-form]');
        if (!form) { return; }
        var token = (window.location.search.match(/[?&]draft=([^&]+)/) || [])[1];
        var one = token ? store()[decodeURIComponent(token)] : null;
        if (!one) { return; }
        var fields = one.fields || {};
        Object.keys(fields).forEach(function (name) {
            var value = fields[name];
            var nodes = form.querySelectorAll('[name="' + name.replace(/"/g, '') + '"]');
            Array.prototype.forEach.call(nodes, function (node) {
                if (node.type === 'checkbox' || node.type === 'radio') {
                    node.checked = Array.isArray(value) ? value.indexOf(node.value) >= 0 : node.value === value;
                } else if (node.type !== 'file' && node.type !== 'hidden') {
                    node.value = Array.isArray(value) ? value[0] : value;
                    if (window.jQuery && node.tagName === 'SELECT') { window.jQuery(node).trigger('change.select2'); }
                    if (window.CKEDITOR && node.id && window.CKEDITOR.instances[node.id]) { window.CKEDITOR.instances[node.id].setData(node.value); }
                }
                node.dispatchEvent(new Event('change', { bubbles: false }));
            });
        });
        var tokenInput = form.querySelector('[data-draft-token]');
        if (tokenInput) { tokenInput.value = decodeURIComponent(token); }
        (one.files || []).forEach(function (file) {
            var box = form.querySelector('[data-draft-files="' + file.field + '"]');
            if (!box) { return; }
            var chip = document.createElement('span');
            chip.className = 'sx-dfile';
            chip.setAttribute('data-draft-file', file.id);
            chip.innerHTML = '<input type="hidden" name="draft_keep[]"><b></b> <small></small><button type="button" data-draft-drop>✕</button>';
            chip.querySelector('input').value = file.id;
            chip.querySelector('b').textContent = file.name;
            chip.querySelector('small').textContent = file.size + ' · ' + T.kept;
            box.appendChild(chip);
        });
        var note = document.createElement('div');
        note.className = 'sx-draft-note is-on';
        note.setAttribute('role', 'status');
        note.innerHTML = '<b></b> <span></span>';
        note.querySelector('b').textContent = T.resumed;
        note.querySelector('span').textContent = one.updated || '';
        form.parentNode.insertBefore(note, form);
        var status = form.querySelector('[data-draft-status-text]');
        if (status) { status.textContent = T.resumed; }
    }

    // ------------------------------------------------------------------ «المسودات»: the drafts kept in this browser are listed too; removing works
    function draftsPage() {
        var table = document.querySelector('table.sx-drafts tbody');
        if (!table) { return; }
        var all = store();
        Object.keys(all).reverse().forEach(function (token) {
            var one = all[token];
            var tr = document.createElement('tr');
            var url = (one.page || CFG.create || 'admin-shary-units-create.html') + '?draft=' + encodeURIComponent(token);
            tr.innerHTML = '<td><span class="sx-kind-chip sx-kind-chip--' + (one.unit ? 'edit' : 'new') + '"></span></td><td><a class="fw-bold"></a><small class="d-block text-muted"></small></td>'
                + '<td>—</td><td><span class="sx-state-chip"></span></td><td><time class="fw-bold"></time></td><td><span class="fw-bold"></span></td>'
                + '<td class="sx-drafts__acts"><a class="btn btn-sm btn-primary"></a> <button type="button" class="btn btn-sm btn-light sx-text-red" data-local-drop></button></td>';
            tr.querySelector('.sx-kind-chip').textContent = one.unit ? T.editUnit : T.newUnit;
            tr.querySelector('td:nth-child(2) a').textContent = one.title || T.untitled;
            tr.querySelector('td:nth-child(2) a').href = url;
            tr.querySelector('td:nth-child(2) small').textContent = '(' + T.local + ')';
            tr.querySelector('.sx-state-chip').textContent = T.draft;
            tr.querySelector('time').textContent = one.updated || '';
            tr.querySelector('td:nth-child(6) span').textContent = CFG.user || '';
            tr.querySelector('.sx-drafts__acts a').textContent = T.cont;
            tr.querySelector('.sx-drafts__acts a').href = url;
            tr.querySelector('[data-local-drop]').textContent = T.drop;
            tr.querySelector('[data-local-drop]').addEventListener('click', function () {
                var now = store();
                delete now[token];
                keep(now);
                tr.parentNode.removeChild(tr);
                toast(T.removed);
            });
            var empty = table.querySelector('td[colspan]');
            if (empty) { empty.parentNode.parentNode.removeChild(empty.parentNode); }
            table.insertBefore(tr, table.firstChild);
        });
    }
    // removing a sample draft: the row goes (the page's own question first)
    window.addEventListener('submit', function (event) {
        var form = event.target;
        if (!form || !form.hasAttribute) { return; }
        if (form.hasAttribute('data-confirm-drop')) {
            event.preventDefault();
            event.stopImmediatePropagation();
            if (!window.confirm(form.getAttribute('data-confirm-drop'))) { return; }
            var tr = form.closest('tr');
            if (tr) { tr.parentNode.removeChild(tr); }
            toast(T.removed);
            return;
        }
        // the upload of a sheet: the sample review opens
        if (form.id === 'sx-sheet' && form.getAttribute('data-review') === '1') {
            event.preventDefault();
            event.stopImmediatePropagation();
            var message = document.getElementById('sx-sheet-msg');
            var say = function (text) { if (message) { message.textContent = text; message.className = 'alert alert-warning'; message.hidden = false; } };
            if (!form.querySelector('input[name=compound_id]:checked')) { say(T.need); return; }
            if (!form.querySelector('input[name=unit_file]').files.length) { say(T.file); return; }
            try { window.sessionStorage.setItem('sx-preview-note', T.upload); } catch (e) { /* ignore */ }
            window.location.href = CFG.review || '#';
        }
    }, true);

    // ------------------------------------------------------------------ preview only: see «فشل الحفظ» (on the server it shows when the line drops)
    function tryFailure() {
        var bar = document.querySelector('[data-unit-savebar], .sx-rv-savebar');
        if (!bar || bar.querySelector('.sx-preview-fail')) { return; }
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'sx-preview-fail';
        button.textContent = T.tryFail;
        button.title = T.tryFailNote;
        var look = document.createElement('style');
        look.textContent = '.sx-preview-fail{flex:0 0 auto;min-height:32px;padding:3px 12px;border:1.5px dashed #d7a64a;border-radius:999px;background:#fffaf0;color:#6b4100;font:800 12.5px/1.6 Cairo,Tahoma,sans-serif;cursor:pointer}'
            + '.sx-preview-fail:hover{background:#fff3dc}@media (max-width:800px){.sx-preview-fail{order:4;margin-inline:auto}}';
        document.head.appendChild(look);
        button.addEventListener('click', function () {
            failNext = 1;
            // the unit form: «حفظ كمسودة» now · the review: the first open cell is sent again (same value)
            var draft = document.querySelector('[data-unit-form] [data-draft-save]');
            if (draft) { draft.click(); return; }
            var cell = document.querySelector('tr.sx-rv-row[data-state="open"] [data-cell]');
            if (cell) { cell.dispatchEvent(new Event('input', { bubbles: true })); }
        });
        var status = bar.querySelector('[data-draft-status], [data-rv-status]');
        if (status && status.nextSibling) { bar.insertBefore(button, status.nextSibling); } else { bar.appendChild(button); }
    }

    // ------------------------------------------------------------------ the review: the changes made here come back after a reload
    function sheetEdits() {
        if (!document.querySelector('[data-rv-table]')) { return; }
        var saved = {};
        try { saved = JSON.parse(window.localStorage.getItem('sx-units-preview-sheet-' + page()) || '{}') || {}; } catch (e) { saved = {}; }
        Object.keys(saved).forEach(function (id) {
            var tr = document.querySelector('tr.sx-rv-row[data-row="' + id + '"]');
            if (!tr) { return; }
            Object.keys(saved[id]).forEach(function (key) {
                var input = tr.querySelector('[data-cell="' + key + '"]');
                if (input && !input.disabled) { input.value = saved[id][key]; input.dispatchEvent(new Event('input', { bubbles: true })); }
            });
        });
    }
})();
