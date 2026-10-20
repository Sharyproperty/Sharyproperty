/*
 * «شاري معاك» — small behaviour of the section's screens (no library; SweetAlert is used when the dashboard template has it).
 *   1 a question before a decision: <form data-ma3ak-confirm="…"> or <button data-ma3ak-confirm="…"> (money, and what cannot be undone)
 *   2 a form is sent once: its buttons are switched off while it is being sent (no double payment by a double click)
 *   3 parts of a form shown for one choice only: <div data-ma3ak-when="field_name=value1,value2">
 *   4 rows added / removed in a form: data-ma3ak-repeater · data-ma3ak-rows · data-ma3ak-row · <template> with __i__ · data-ma3ak-add · data-ma3ak-remove
 *   5 copy a text: data-ma3ak-copy="…"      6 a chosen picture shows at once: <input type="file" data-ma3ak-preview="#img-id">
 *   7 tick rows and add them («اختار من الوحدات»): <form data-ma3ak-pick> · row boxes data-ma3ak-pick-row (form="…") · data-ma3ak-pick-all · data-ma3ak-pick-count
 *     + «علّم الكل» / «شيل التعليم»: data-ma3ak-pick-mark="all|none" (every data-ma3ak-pick-count on the page shows the ticked count)
 *   8 the smart search box: <div data-ma3ak-suggest="JSON url" data-ma3ak-suggest-url="pick url" data-ma3ak-suggest-texts='{…}'> + input + [data-ma3ak-suggest-menu]
 * Loaded once by resources/views/shary_admin/ma3ak/partials/head.blade.php (texts: window.SharyMa3ak).
 */
(function () {
    'use strict';
    var T = window.SharyMa3ak || {};
    var doc = document;

    function ask(question) {
        if (window.Swal && typeof window.Swal.fire === 'function') {
            return window.Swal.fire({
                title: T.title || '',
                text: question,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: T.yes || 'OK',
                cancelButtonText: T.no || 'Cancel',
                reverseButtons: false,
                focusCancel: true
            }).then(function (result) { return !!(result && (result.isConfirmed || result.value === true)); });
        }
        return Promise.resolve(window.confirm(question));
    }

    function lock(form) {
        Array.prototype.forEach.call(form.querySelectorAll('button[type=submit], input[type=submit]'), function (button) { button.disabled = true; });
        // a form whose page is kept by the browser's back button comes back usable
        window.addEventListener('pageshow', function () { Array.prototype.forEach.call(form.querySelectorAll('button[type=submit], input[type=submit]'), function (button) { button.disabled = false; }); }, { once: true });
    }

    // ---- 1 + 2
    doc.addEventListener('submit', function (event) {
        var form = event.target;
        if (!form || form.tagName !== 'FORM' || !form.closest('.page-wrapper, .modal')) { return; }
        if (form.__ma3akSending) { event.preventDefault(); return; }
        var submitter = event.submitter || null;
        var question = (submitter && submitter.getAttribute('data-ma3ak-confirm')) || form.getAttribute('data-ma3ak-confirm');
        var asked = form.__ma3akAsked === true;
        form.__ma3akAsked = false;
        if (!question || asked) {
            // sent: a confirmed decision (or a form marked data-ma3ak-once) cannot be sent a second time by a double click
            if (asked || question || form.hasAttribute('data-ma3ak-once')) { form.__ma3akSending = true; setTimeout(function () { lock(form); }, 0); }
            return;
        }
        event.preventDefault();
        ask(question).then(function (yes) {
            if (!yes) { return; }
            form.__ma3akAsked = true;
            if (submitter && submitter.name) {
                // keep the clicked button's own value (requestSubmit is not everywhere)
                var keep = doc.createElement('input');
                keep.type = 'hidden';
                keep.name = submitter.name;
                keep.value = submitter.value;
                form.appendChild(keep);
            }
            if (typeof form.requestSubmit === 'function') {
                form.requestSubmit();
            } else {
                form.__ma3akSending = true;
                lock(form);
                form.submit();
            }
        });
    }, true);

    // ---- 3
    function field(form, name) {
        var all = form ? form.querySelectorAll('[name="' + name + '"]') : [];
        for (var i = 0; i < all.length; i++) {
            if ((all[i].type === 'radio' || all[i].type === 'checkbox') && !all[i].checked) { continue; }
            if (all[i].type === 'hidden' && all.length > 1) { continue; }
            return all[i].type === 'checkbox' ? (all[i].checked ? all[i].value : '') : all[i].value;
        }
        return '';
    }
    function when() {
        Array.prototype.forEach.call(doc.querySelectorAll('[data-ma3ak-when]'), function (box) {
            var rule = box.getAttribute('data-ma3ak-when').split('=');
            var form = box.closest('form') || doc;
            var values = (rule[1] || '').split(',');
            var on = values.indexOf(field(form, rule[0])) > -1;
            box.hidden = !on;
            Array.prototype.forEach.call(box.querySelectorAll('input, select, textarea'), function (control) {
                if (!control.hasAttribute('data-ma3ak-was-required') && control.required) { control.setAttribute('data-ma3ak-was-required', '1'); }
                if (control.getAttribute('data-ma3ak-was-required') === '1') { control.required = on; }
            });
        });
    }
    doc.addEventListener('change', function (event) { if (event.target && event.target.name) { when(); } });
    doc.addEventListener('input', function (event) { if (event.target && event.target.type === 'radio') { when(); } });
    if (doc.readyState === 'loading') { doc.addEventListener('DOMContentLoaded', when); } else { when(); }

    // ---- 4 rows added and removed in a form (payment plan, images, package blocks …)
    //   <div data-ma3ak-repeater data-next="3" data-max="60">
    //     <div data-ma3ak-rows> <div data-ma3ak-row> … <button type="button" data-ma3ak-remove> </div> … </div>
    //     <template> one row, with __i__ where the row number goes </template>
    //     <button type="button" data-ma3ak-add>
    doc.addEventListener('click', function (event) {
        var add = event.target.closest ? event.target.closest('[data-ma3ak-add]') : null;
        if (add) {
            event.preventDefault();
            var box = add.closest('[data-ma3ak-repeater]');
            var template = box && box.querySelector('template');
            var rows = box && box.querySelector('[data-ma3ak-rows]');
            if (!template || !rows) { return; }
            var max = parseInt(box.getAttribute('data-max') || '0', 10);
            if (max && rows.querySelectorAll('[data-ma3ak-row]').length >= max) { return; }
            var next = parseInt(box.getAttribute('data-next') || String(rows.children.length), 10);
            var holder = doc.createElement('div');
            holder.innerHTML = template.innerHTML.replace(/__i__/g, String(next));
            var first = holder.firstElementChild;
            while (holder.firstElementChild) { rows.appendChild(holder.firstElementChild); }
            box.setAttribute('data-next', String(next + 1));
            when();
            var field = first && first.querySelector('input:not([type=hidden]), select, textarea');
            if (field) { field.focus(); }
            return;
        }
        var remove = event.target.closest ? event.target.closest('[data-ma3ak-remove]') : null;
        if (remove) {
            event.preventDefault();
            var row = remove.closest('[data-ma3ak-row]');
            if (row) { row.parentNode.removeChild(row); }
            return;
        }
        // ---- 5 copy a text: <button type="button" data-ma3ak-copy="text" data-ma3ak-copied="Copied">
        var copy = event.target.closest ? event.target.closest('[data-ma3ak-copy]') : null;
        if (copy && navigator.clipboard && navigator.clipboard.writeText) {
            event.preventDefault();
            navigator.clipboard.writeText(copy.getAttribute('data-ma3ak-copy')).then(function () {
                var old = copy.textContent;
                copy.textContent = copy.getAttribute('data-ma3ak-copied') || old;
                setTimeout(function () { copy.textContent = old; }, 1400);
            }, function () {});
        }
    });

    // ---- 6 a picture chosen in a file field shows at once: <input type="file" data-ma3ak-preview="#img-id">
    doc.addEventListener('change', function (event) {
        var input = event.target;
        if (!input || !input.matches || !input.matches('input[type=file][data-ma3ak-preview]') || !input.files || !input.files[0]) { return; }
        var image = doc.querySelector(input.getAttribute('data-ma3ak-preview'));
        if (image && /^image\//.test(input.files[0].type)) { image.src = URL.createObjectURL(input.files[0]); image.hidden = false; }
    });

    // ---- 7 tick units and add them: nothing is sent without a ticked row and a goal
    var pick = doc.querySelector('form[data-ma3ak-pick]');
    if (pick) {
        var pickRows = function () { return Array.prototype.slice.call(doc.querySelectorAll('[data-ma3ak-pick-row]')); };
        var pickAll = doc.querySelector('[data-ma3ak-pick-all]');
        var pickCounts = Array.prototype.slice.call(doc.querySelectorAll('[data-ma3ak-pick-count]'));
        var pickRefresh = function () {
            var list = pickRows();
            var on = list.filter(function (box) { return box.checked; }).length;
            pickCounts.forEach(function (count) { count.textContent = String(on); });
            if (pickAll) { pickAll.checked = list.length > 0 && on === list.length; pickAll.indeterminate = on > 0 && on < list.length; }
        };
        if (pickAll) {
            pickAll.addEventListener('change', function () { pickRows().forEach(function (box) { box.checked = pickAll.checked; }); pickRefresh(); });
        }
        doc.addEventListener('change', function (event) {
            if (event.target && event.target.matches && event.target.matches('[data-ma3ak-pick-row]')) { pickRefresh(); }
        });
        Array.prototype.slice.call(doc.querySelectorAll('[data-ma3ak-pick-mark]')).forEach(function (button) {
            button.addEventListener('click', function () {
                var on = button.getAttribute('data-ma3ak-pick-mark') === 'all';
                pickRows().forEach(function (box) { box.checked = on; });
                pickRefresh();
            });
        });
        pick.addEventListener('submit', function (event) {
            var problem = !pickRows().some(function (box) { return box.checked; }) ? pick.getAttribute('data-ma3ak-none')
                : (!pick.querySelector('input[name="goals[]"]:checked') ? pick.getAttribute('data-ma3ak-no-goal') : null);
            if (problem) { event.preventDefault(); event.stopImmediatePropagation(); window.alert(problem); }
        }, true);
        pickRefresh();
    }

    // ---- 8 the smart search box: projects / developers / units as you type; a choice opens the list on it
    var smart = doc.querySelector('[data-ma3ak-suggest]');
    if (smart) {
        var smartInput = smart.querySelector('input');
        var smartMenu = smart.querySelector('[data-ma3ak-suggest-menu]');
        var smartTexts = {};
        try { smartTexts = JSON.parse(smart.getAttribute('data-ma3ak-suggest-texts') || '{}'); } catch (e) { smartTexts = {}; }
        var smartTimer = null;
        var smartAsked = 0;
        var money = function (value) { return value ? Math.round(value).toLocaleString('en-US') : ''; };
        var say = function (key, n) { return String(smartTexts[key] || '').replace(':n', n).replace(':price', n); };
        var target = function (kind, id) {
            var url = new URL(smart.getAttribute('data-ma3ak-suggest-url'), window.location.href);
            if (kind === 'projects') { url.searchParams.set('compound_id', id); }
            if (kind === 'developers') { url.searchParams.set('developer_id', id); }
            if (kind === 'units') { url.searchParams.set('ids', id); }
            return url.toString();
        };
        var row = function (kind, item) {
            var link = doc.createElement('a');
            link.className = 'ma3ak-smart__item';
            link.href = target(kind, item.id);
            link.setAttribute('role', 'option');
            var pic = doc.createElement('span');
            pic.className = 'ma3ak-smart__pic' + (kind === 'developers' ? ' is-logo' : '');
            if (item.image) { var img = doc.createElement('img'); img.src = item.image; img.alt = ''; img.loading = 'lazy'; pic.appendChild(img); }
            var text = doc.createElement('span');
            text.className = 'ma3ak-smart__text';
            var name = doc.createElement('b'); name.textContent = item.name; text.appendChild(name);
            var bits = [];
            if (item.sub) { bits.push(item.sub); }
            if (kind === 'developers' && item.projects) { bits.push(say('projects_n', item.projects)); }
            if (kind !== 'units' && item.units) { bits.push(say('units_n', item.units)); }
            if (item.price) { bits.push(say('from', money(item.price))); }
            if (bits.length) { var sub = doc.createElement('span'); sub.className = 'ma3ak-sub'; sub.textContent = bits.join(' · '); text.appendChild(sub); }
            link.appendChild(pic);
            link.appendChild(text);
            return link;
        };
        var render = function (data) {
            smartMenu.innerHTML = '';
            var any = false;
            ['projects', 'developers', 'units'].forEach(function (kind) {
                var list = (data && data[kind]) || [];
                if (!list.length) { return; }
                any = true;
                var head = doc.createElement('div'); head.className = 'ma3ak-smart__group'; head.textContent = smartTexts[kind] || kind;
                smartMenu.appendChild(head);
                list.forEach(function (item) { smartMenu.appendChild(row(kind, item)); });
            });
            if (!any) { var none = doc.createElement('div'); none.className = 'ma3ak-smart__empty'; none.textContent = smartTexts.empty || ''; smartMenu.appendChild(none); }
            smartMenu.hidden = false;
        };
        var ask2 = function () {
            var q = smartInput.value.trim();
            if (q.length < 2 && !/^#?\d+$/.test(q)) { smartMenu.hidden = true; return; }
            var ticket = ++smartAsked;
            smartMenu.innerHTML = '<div class="ma3ak-smart__empty">' + (smartTexts.loading || '…') + '</div>';
            smartMenu.hidden = false;
            var url = new URL(smart.getAttribute('data-ma3ak-suggest'), window.location.href);
            url.searchParams.set('q', q);
            fetch(url.toString(), { headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'same-origin' })
                .then(function (response) { return response.ok ? response.json() : {}; })
                .then(function (data) { if (ticket === smartAsked) { render(data); } })
                .catch(function () { if (ticket === smartAsked) { render({}); } });
        };
        smartInput.addEventListener('input', function () { window.clearTimeout(smartTimer); smartTimer = window.setTimeout(ask2, 250); });
        smartInput.addEventListener('focus', function () { if (smartMenu.childNodes.length && smartInput.value.trim().length > 1) { smartMenu.hidden = false; } });
        smartInput.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') { smartMenu.hidden = true; }
            if (event.key === 'Enter') { var first = smartMenu.querySelector('a'); if (first) { event.preventDefault(); window.location.href = first.href; } }
        });
        doc.addEventListener('click', function (event) { if (!smart.contains(event.target)) { smartMenu.hidden = true; } });
    }
})();
