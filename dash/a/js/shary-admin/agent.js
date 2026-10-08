/* Shary dashboard agent — small behaviours of the screens (no library). */
(function () {
    'use strict';
    var $ = function (selector, root) { return (root || document).querySelector(selector); };
    var $$ = function (selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); };
    var token = ($('meta[name="csrf-token"]') || {}).content || '';

    // phone menu
    var burger = $('[data-ag-menu]');
    if (burger) {
        burger.addEventListener('click', function () {
            var open = $('[data-ag-nav]').classList.toggle('is-open');
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    // open / close dialogs: <button data-ag-open="id">, <button data-ag-close>
    document.addEventListener('click', function (event) {
        var opener = event.target.closest('[data-ag-open]');
        if (opener) {
            var dialog = document.getElementById(opener.getAttribute('data-ag-open'));
            if (dialog) {
                $$('[data-ag-fill]', dialog).forEach(function (field) { field.value = opener.getAttribute('data-' + field.getAttribute('data-ag-fill')) || ''; });
                if (opener.hasAttribute('data-action')) { $('form', dialog).setAttribute('action', opener.getAttribute('data-action')); }
                if (dialog.showModal) { dialog.showModal(); } else { dialog.setAttribute('open', ''); }
            }
        }
        var closer = event.target.closest('[data-ag-close]');
        if (closer) {
            var parent = closer.closest('dialog');
            if (parent) { parent.close ? parent.close() : parent.removeAttribute('open'); }
        }
        // show / hide a block: <button data-ag-toggle="id">
        var toggle = event.target.closest('[data-ag-toggle]');
        if (toggle) {
            var block = document.getElementById(toggle.getAttribute('data-ag-toggle'));
            if (block) { block.classList.toggle('hide'); if (!block.classList.contains('hide')) { var first = $('textarea, input:not([type=hidden])', block); if (first) { first.focus(); } } }
        }
        // a ready phrase into a text box: <button data-ag-say="text" data-ag-into="id">
        var say = event.target.closest('[data-ag-say]');
        if (say) {
            var box = document.getElementById(say.getAttribute('data-ag-into') || 'ag-command');
            if (box) { box.value = say.getAttribute('data-ag-say'); box.focus(); box.setSelectionRange(box.value.length, box.value.length); }
        }
        // copy a drafted reply
        var copy = event.target.closest('[data-ag-copy]');
        if (copy && navigator.clipboard) {
            navigator.clipboard.writeText(copy.getAttribute('data-ag-copy')).then(function () {
                var old = copy.textContent; copy.textContent = 'اتنسخ'; setTimeout(function () { copy.textContent = old; }, 1500);
            });
        }
    });

    // one press only on forms that take time; a question first on forms that publish / cancel
    document.addEventListener('submit', function (event) {
        var form = event.target;
        var ask = form.getAttribute('data-ag-confirm');
        if (ask && !window.confirm(ask)) { event.preventDefault(); return; }
        if (form.hasAttribute('data-ag-chat')) { return; }
        var button = form.querySelector('button[type=submit], button:not([type])');
        if (button && form.hasAttribute('data-ag-slow')) {
            setTimeout(function () { button.disabled = true; button.textContent = form.getAttribute('data-ag-slow') || 'الإيجنت شغال…'; }, 10);
        }
    });

    // switches that save themselves
    $$('[data-ag-autosubmit]').forEach(function (input) { input.addEventListener('change', function () { input.form.submit(); }); });

    // names of the chosen files
    $$('[data-ag-filelist]').forEach(function (input) {
        input.addEventListener('change', function () {
            var list = document.getElementById(input.getAttribute('data-ag-filelist'));
            if (!list) { return; }
            list.innerHTML = '';
            Array.prototype.forEach.call(input.files, function (file) { var tag = document.createElement('span'); tag.textContent = file.name; list.appendChild(tag); });
        });
    });

    // the commands chat: send the order, then ask the agent to answer (the answer can take a minute or two)
    var chatForm = $('[data-ag-chat]');
    if (chatForm) {
        var thread = $('[data-ag-thread]');
        var bottom = function () { if (thread) { thread.scrollTop = thread.scrollHeight; } };
        bottom();
        var add = function (html) { var holder = document.createElement('div'); holder.innerHTML = html; while (holder.firstChild) { thread.appendChild(holder.firstChild); } bottom(); };
        var run = function (url) {
            var typing = document.createElement('div');
            typing.className = 'ag-typing';
            typing.setAttribute('role', 'status');
            typing.textContent = 'الإيجنت شغال على الأمر… ممكن ياخد دقيقة أو اتنين';
            thread.appendChild(typing); bottom();
            return fetch(url, { method: 'POST', headers: { 'X-CSRF-TOKEN': token, 'Accept': 'application/json' } })
                .then(function (response) { return response.json(); })
                .then(function (data) { typing.remove(); add(data.html || ''); })
                .catch(function () { typing.textContent = 'الاتصال اتقطع — الإيجنت هيكمل الأمر لوحده والرد هيظهر لما تحدّث الصفحة.'; });
        };
        chatForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var text = $('textarea', chatForm);
            var files = $('input[type=file]', chatForm);
            if (!text.value.trim() && !(files && files.files.length)) { text.focus(); return; }
            var button = $('button[type=submit]', chatForm);
            button.disabled = true;
            fetch(chatForm.action, { method: 'POST', headers: { 'X-CSRF-TOKEN': token, 'Accept': 'application/json' }, body: new FormData(chatForm) })
                .then(function (response) { return response.json().then(function (data) { return { ok: response.ok, data: data }; }); })
                .then(function (result) {
                    if (!result.ok) { throw new Error((result.data && (result.data.message || (result.data.errors && Object.values(result.data.errors)[0][0]))) || 'error'); }
                    add(result.data.html || '');
                    text.value = '';
                    if (files) { files.value = ''; var list = document.getElementById(files.getAttribute('data-ag-filelist')); if (list) { list.innerHTML = ''; } }
                    return run(result.data.run_url);
                })
                .catch(function (error) { window.alert('الأمر ما اتبعتش: ' + error.message); })
                .then(function () { button.disabled = false; });
        });
        // an order that came from another screen (today / new page) and still waits for its answer
        if (chatForm.getAttribute('data-ag-pending')) { run(chatForm.getAttribute('data-ag-pending')); }
    }
})();
