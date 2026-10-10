/*
 | Shary dashboard — the unit form on ONE page (resources/views/shary_admin/units/form.blade.php):
 |
 |   the sections      the seven parts one under the other; each folds / opens from its title (all open at first) — «فتح الكل / قفل الكل»
 |   the sections bar  stays on top while the page scrolls; a click glides to its section (and opens it); the section on screen is lit
 |   the mistakes      a field the browser stops at (or the server sent back) opens its section; each section counts its fields to look at
 |   «المسودات»        the form saves itself as a draft while it is filled (the fields, and the photos / files picked — kept with the draft),
 |                     «حفظ كمسودة» saves now; the bar says what is happening: جارٍ الحفظ / تم الحفظ / فشل الحفظ. Nothing of a draft
 |                     reaches the website; the unit is saved by «حفظ» only.
 */
(function () {
    'use strict';
    var form = document.querySelector('[data-unit-form]');
    if (!form || form.__sxUnit) { return; }
    form.__sxUnit = true;

    var L = {};
    try { L = JSON.parse(form.getAttribute('data-labels') || '{}') || {}; } catch (e) { L = {}; }
    var nav = form.querySelector('[data-unit-nav]');
    var list = nav ? nav.querySelector('.sx-unit-nav__list') : null;
    var sections = Array.prototype.slice.call(form.querySelectorAll('.sx-unit-sec'));
    var links = Array.prototype.slice.call(form.querySelectorAll('[data-unit-tab]'));
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function byKey(key) { return form.querySelector('.sx-unit-sec[data-unit-pane="' + key + '"]'); }

    // ------------------------------------------------------------------ the top of the screen (fixed header + the sections bar)
    function headerBottom() {
        var top = document.querySelector('.sx-top') || document.querySelector('.header');
        if (!top) { return 0; }
        var style = window.getComputedStyle(top);
        if (style.position !== 'fixed' && style.position !== 'sticky') { return 0; }
        return Math.max(0, Math.round(top.getBoundingClientRect().bottom));
    }
    function offsets() {
        form.style.setProperty('--sx-unit-top', headerBottom() + 'px');
        form.style.setProperty('--sx-unit-nav', (nav ? nav.offsetHeight : 0) + 'px');
    }
    offsets();
    window.addEventListener('resize', offsets);

    // ------------------------------------------------------------------ folding
    function fold(section, open) {
        if (!section) { return; }
        section.classList.toggle('is-closed', !open);
        var button = section.querySelector('[data-unit-fold]');
        if (button) { button.setAttribute('aria-expanded', open ? 'true' : 'false'); }
        var hint = section.querySelector('[data-unit-hint]');
        if (hint) {
            if (!hint.hasAttribute('data-open-text')) { hint.setAttribute('data-open-text', hint.textContent); }
            hint.textContent = open ? hint.getAttribute('data-open-text') : (L.closed || hint.getAttribute('data-open-text'));
        }
    }
    form.addEventListener('click', function (event) {
        var toggle = event.target.closest && event.target.closest('[data-unit-fold]');
        if (toggle && form.contains(toggle)) {
            event.preventDefault();
            var section = toggle.closest('.sx-unit-sec');
            fold(section, section.classList.contains('is-closed'));
            return;
        }
        var all = event.target.closest && event.target.closest('[data-unit-all]');
        if (all && form.contains(all)) {
            event.preventDefault();
            var open = all.getAttribute('data-unit-all') === 'open';
            sections.forEach(function (section) { fold(section, open); });
            spy();
        }
    });

    // ------------------------------------------------------------------ the sections bar: glide to a section, light the one on screen
    var quietUntil = 0;
    function setActive(key) {
        links.forEach(function (link) {
            var on = link.getAttribute('data-unit-tab') === key;
            link.classList.toggle('is-on', on);
            if (on) { link.setAttribute('aria-current', 'true'); } else { link.removeAttribute('aria-current'); }
            if (on && list) {
                var box = list.getBoundingClientRect();
                var rect = link.getBoundingClientRect();
                if (rect.left < box.left) { list.scrollLeft -= (box.left - rect.left + 14); } else if (rect.right > box.right) { list.scrollLeft += (rect.right - box.right + 14); }
            }
        });
    }
    function goTo(key, smooth) {
        var section = byKey(key);
        if (!section) { return; }
        fold(section, true);
        offsets();
        quietUntil = Date.now() + (smooth ? 900 : 120);
        setActive(key);
        section.scrollIntoView({ behavior: smooth && !still ? 'smooth' : 'auto', block: 'start' });
        try { history.replaceState(null, '', '#' + key); } catch (e) { /* ignore */ }
    }
    links.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            goTo(link.getAttribute('data-unit-tab'), true);
        });
    });
    function spy() {
        if (Date.now() < quietUntil || !sections.length) { return; }
        var line = headerBottom() + (nav ? nav.offsetHeight : 0) + 28;
        var current = sections[0];
        sections.forEach(function (section) { if (section.getBoundingClientRect().top - line <= 0) { current = section; } });
        var doc = document.documentElement;
        if (window.innerHeight + window.pageYOffset >= doc.scrollHeight - 6) { current = sections[sections.length - 1]; }
        setActive(current.getAttribute('data-unit-pane'));
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
        if (ticking) { return; }
        ticking = true;
        window.requestAnimationFrame(function () { ticking = false; spy(); });
    }, { passive: true });
    window.addEventListener('scrollend', function () { quietUntil = 0; spy(); });

    // a link to one section (#price, #sec-price — also the old tabs' addresses)
    var start = (window.location.hash || '').replace('#', '').replace(/^sec-/, '');
    if (start && byKey(start)) { window.setTimeout(function () { goTo(start, false); }, 80); } else { spy(); }

    // ------------------------------------------------------------------ the fields to look at: open their section, count them
    function sectionOf(field) { return field && field.closest ? field.closest('.sx-unit-sec') : null; }
    function recount() {
        sections.forEach(function (section) {
            var key = section.getAttribute('data-unit-pane');
            var count = section.querySelectorAll('.is-invalid').length;
            var badges = [section.querySelector('[data-unit-count]')];
            var link = form.querySelector('[data-unit-tab="' + key + '"] [data-unit-count]');
            if (link) { badges.push(link); }
            badges.forEach(function (badge) {
                if (!badge) { return; }
                badge.hidden = count === 0;
                badge.textContent = count ? String(count) : '';
                badge.setAttribute('title', count ? (L.errors || '').replace(':count', count) : '');
            });
        });
    }
    form.addEventListener('invalid', function (event) {
        var field = event.target;
        field.classList.add('is-invalid');
        var section = sectionOf(field);
        if (section && section.classList.contains('is-closed')) { fold(section, true); }
        recount();
    }, true);
    function clearMark(event) {
        var field = event.target;
        if (field && field.classList && field.classList.contains('is-invalid') && (!field.checkValidity || field.checkValidity())) {
            field.classList.remove('is-invalid');
            recount();
        }
    }
    form.addEventListener('input', clearMark, true);
    form.addEventListener('change', clearMark, true);
    // what the server sent back (the form came back after a mistake): mark the fields, open their sections
    var sent = [];
    try { sent = JSON.parse(form.getAttribute('data-errors') || '[]') || []; } catch (e) { sent = []; }
    var firstBad = null;
    sent.forEach(function (key) {
        var parts = String(key).split('.');
        var names = [parts[0] + (parts.length > 1 ? '[' + parts.slice(1).join('][') + ']' : ''), parts[0] + '[]', parts[0]];
        var field = null;
        names.some(function (name) { field = form.querySelector('[name="' + name.replace(/"/g, '') + '"]'); return !!field; });
        if (!field && /^(more_plans|offers)$/.test(parts[0])) { field = form.querySelector('[data-more-plans], [data-shary-repeater]'); }
        if (!field) { return; }
        field.classList.add('is-invalid');
        firstBad = firstBad || field;
    });
    if (sent.length) {
        recount();
        if (firstBad && sectionOf(firstBad) && !start) {
            window.setTimeout(function () { goTo(sectionOf(firstBad).getAttribute('data-unit-pane'), false); }, 120);
        }
    }

    // ------------------------------------------------------------------ «المسودات»: the form saves itself
    var url = form.getAttribute('data-autosave');
    var statusBox = form.querySelector('[data-draft-status]');
    var statusText = statusBox ? statusBox.querySelector('[data-draft-status-text]') : null;
    var retry = form.querySelector('[data-draft-retry]');
    var tokenInput = form.querySelector('[data-draft-token]');
    if (!url || !statusBox) { return; }

    var dirty = false;
    var timer = null;
    var inflight = null;
    var again = false;
    var failures = 0;
    var finished = false;
    var leaving = false;
    var firstChange = 0;
    var drops = [];

    function setStatus(state, text, link) {
        statusBox.setAttribute('data-state', state);
        if (statusText) {
            statusText.textContent = text;
            if (link) {
                var a = document.createElement('a');
                a.href = link;
                a.textContent = ' ' + (L.open_unit || '↗');
                a.className = 'sx-unit-status__link';
                statusText.appendChild(a);
            }
        }
        if (retry) { retry.hidden = state !== 'failed' && state !== 'offline'; }
    }
    function syncEditors() {
        if (!window.CKEDITOR || !window.CKEDITOR.instances) { return; }
        Object.keys(window.CKEDITOR.instances).forEach(function (name) {
            try { window.CKEDITOR.instances[name].updateElement(); } catch (e) { /* ignore */ }
        });
    }
    function fileField(name) {
        // image · master_plan · video_file · gallery[] → gallery · floor_plans[0][image] → floor_plans.0.image · floor_replace[12] → floor_replace.12
        return String(name).replace(/\[\]$/, '').replace(/\[(\w+)\]/g, '.$1');
    }
    function picked() {
        return Array.prototype.filter.call(form.querySelectorAll('input[type=file]'), function (input) { return input.files && input.files.length; });
    }
    function build(withFiles) {
        syncEditors();
        var all = new FormData(form);
        var body = new FormData();
        var files = 0;
        all.forEach(function (value, key) {
            if (typeof File !== 'undefined' && value instanceof File) {
                if (withFiles && value.size > 0 && value.name) { body.append(key, value, value.name); files++; }
                return;
            }
            body.append(key, value);
        });
        drops.forEach(function (id) { body.append('draft_drop[]', id); });
        return { body: body, files: files };
    }
    function schedule(delay) {
        window.clearTimeout(timer);
        if (finished) { return; }
        var wait = typeof delay === 'number' ? delay : 2500;
        if (firstChange && Date.now() - firstChange > 15000) { wait = 0; }
        timer = window.setTimeout(function () { save(false); }, wait);
    }
    function changed() {
        if (finished || leaving) { return; }
        if (!dirty) { firstChange = Date.now(); }
        dirty = true;
        if (statusBox.getAttribute('data-state') !== 'saving') { setStatus('pending', L.idle || ''); }
        schedule();
    }
    function chip(file) {
        var span = document.createElement('span');
        span.className = 'sx-dfile';
        span.setAttribute('data-draft-file', file.id);
        var keep = document.createElement('input');
        keep.type = 'hidden';
        keep.name = 'draft_keep[]';
        keep.value = file.id;
        var name = document.createElement('b');
        name.textContent = file.name;
        var small = document.createElement('small');
        small.textContent = (file.size || '') + ' · ' + (L.file_kept || '');
        var drop = document.createElement('button');
        drop.type = 'button';
        drop.setAttribute('data-draft-drop', '');
        drop.setAttribute('aria-label', (L.file_drop || '✕') + ': ' + file.name);
        drop.title = L.file_drop || '';
        drop.textContent = '✕';
        span.appendChild(keep);
        span.appendChild(name);
        span.appendChild(document.createTextNode(' '));
        span.appendChild(small);
        span.appendChild(drop);
        return span;
    }
    function showFiles(files, sentInputs, rejected) {
        var byField = {};
        (files || []).forEach(function (file) { (byField[file.field] = byField[file.field] || []).push(file); });
        Array.prototype.forEach.call(form.querySelectorAll('[data-draft-files]'), function (box) {
            var field = box.getAttribute('data-draft-files');
            box.innerHTML = '';
            (byField[field] || []).forEach(function (file) { box.appendChild(chip(file)); });
        });
        var refused = (rejected || []).map(function (one) { return one.name; });
        sentInputs.forEach(function (input) {
            var all = Array.prototype.every.call(input.files || [], function (file) { return refused.indexOf(file.name) < 0; });
            if (all) { input.value = ''; }
        });
    }
    function save(now) {
        if (finished || !url) { return Promise.resolve(); }
        if (inflight) { again = true; return inflight; }
        var sentInputs = picked();
        if (!dirty && !now && !sentInputs.length && !drops.length) { return Promise.resolve(); }
        window.clearTimeout(timer);
        var data = build(true);
        var dropped = drops.slice();
        dirty = false;
        firstChange = 0;
        setStatus('saving', data.files ? (L.files || L.saving || '') : (L.saving || ''));
        inflight = window.fetch(url, {
            method: 'POST', body: data.body, credentials: 'same-origin',
            headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
        }).then(function (response) {
            return response.json().catch(function () { return {}; }).then(function (json) { return { ok: response.ok, status: response.status, data: json || {} }; });
        }).then(function (result) {
            var data = result.data;
            if (result.status === 409 || data.done) {
                finished = true;
                setStatus('done', data.message || L.done || '', data.unit_url);
                return;
            }
            if (!result.ok || !data.ok) { throw new Error(data.message || 'failed'); }
            failures = 0;
            drops = drops.filter(function (id) { return dropped.indexOf(id) < 0; });
            if (data.token && tokenInput) { tokenInput.value = data.token; }
            if (data.files) { showFiles(data.files, sentInputs, data.rejected); }
            var text = (now ? (L.draft_saved || L.saved || '') : (L.saved || '')).replace(':time', data.saved_at || '');
            setStatus('saved', text);
            if (statusBox) { statusBox.setAttribute('title', data.saved_full || ''); }
            if (data.rejected && data.rejected.length) {
                setStatus('failed', (L.rejected || '') + ' ' + data.rejected.map(function (one) { return one.name + ' — ' + one.reason; }).join(' · '));
            }
        }).catch(function () {
            dirty = true;
            failures++;
            var offline = window.navigator && window.navigator.onLine === false;
            setStatus(offline ? 'offline' : 'failed', offline ? (L.offline || '') : (L.failed || ''));
            schedule(Math.min(60000, 4000 * Math.pow(2, Math.min(failures, 4))));
        }).then(function () {
            inflight = null;
            if (again) { again = false; if (dirty) { schedule(600); } }
        });
        return inflight;
    }

    // what counts as a change: typing, choosing, the lists and editors, adding / removing rows, a file picked or taken out
    form.addEventListener('input', function (event) { if (event.target && event.target.type !== 'file') { changed(); } }, true);
    form.addEventListener('change', function (event) {
        if (event.target && event.target.type === 'file') { changed(); schedule(800); return; }
        changed();
    }, true);
    if (window.jQuery) { window.jQuery(form).on('change', 'select', changed); }
    form.addEventListener('click', function (event) {
        var target = event.target;
        if (!target || !target.closest) { return; }
        var drop = target.closest('[data-draft-drop]');
        if (drop) {
            event.preventDefault();
            var kept = drop.closest('[data-draft-file]');
            if (kept) { drops.push(kept.getAttribute('data-draft-file')); kept.parentNode.removeChild(kept); }
            changed();
            return;
        }
        if (target.closest('[data-shary-add],[data-shary-remove],[data-shary-up],[data-shary-down],[data-more-plans-add],[data-more-plan-remove],[data-plan-extras] button')) {
            window.setTimeout(changed, 0);
        }
    });
    function hookEditors() {
        var editors = window.CKEDITOR;
        if (!editors || editors.__sxUnitHooked) { return !!editors; }
        editors.__sxUnitHooked = true;
        Object.keys(editors.instances || {}).forEach(function (name) { editors.instances[name].on('change', changed); });
        editors.on('instanceReady', function (event) { event.editor.on('change', changed); });
        return true;
    }
    if (!hookEditors()) {
        var tries = 0;
        var wait = window.setInterval(function () { if (hookEditors() || ++tries > 60) { window.clearInterval(wait); } }, 250);
    }

    // «حفظ كمسودة»: save now, stay on the page (without a script the button sends the form to the drafts' own address)
    var draftButton = form.querySelector('[data-draft-save]');
    if (draftButton) {
        draftButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            save(true);
        });
    }
    if (retry) { retry.addEventListener('click', function () { save(true); }); }

    // «حفظ»: the photos still on their way to the draft finish first, so they go with the unit (and only once)
    form.addEventListener('submit', function (event) {
        var submitter = event.submitter;
        if (submitter && submitter.hasAttribute && submitter.hasAttribute('data-draft-save')) { return; }
        if (inflight) {
            event.preventDefault();
            setStatus('saving', L.wait_files || L.saving || '');
            inflight.then(function () {
                leaving = true;
                window.clearTimeout(timer);
                if (form.requestSubmit) { form.requestSubmit(submitter || undefined); } else { form.submit(); }
            });
            return;
        }
        leaving = true;
        window.clearTimeout(timer);
    });

    // leaving the page with changes not saved yet: one last save (no files), and the browser asks first
    window.addEventListener('pagehide', function () {
        if (!dirty || leaving || finished || !navigator.sendBeacon) { return; }
        try { navigator.sendBeacon(url, build(false).body); dirty = false; } catch (e) { /* ignore */ }
    });
    window.addEventListener('beforeunload', function (event) {
        if (!dirty || leaving || finished) { return; }
        event.preventDefault();
        event.returnValue = L.leave || '';
        return L.leave || '';
    });
    window.addEventListener('online', function () { if (dirty) { schedule(300); } });
})();
