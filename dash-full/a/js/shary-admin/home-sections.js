(function () {
    var CONF = JSON.parse(document.currentScript.getAttribute('data-conf') || '{}');
    'use strict';
    var T = CONF.texts;
    function make(tag, className, text) { var node = document.createElement(tag); if (className) { node.className = className; } if (text != null) { node.textContent = text; } return node; }

    document.querySelectorAll('[data-hs-search]').forEach(function (box) {
        var input = box.querySelector('[data-hs-input]');
        var list = box.querySelector('[data-hs-results]');
        var form = box.querySelector('[data-hs-form]');
        var idField = form.querySelector('input[name="id"]');
        var timer = null, last = null, round = 0;
        function state(text) { list.textContent = ''; list.appendChild(make('div', 'sx-hs-state', text)); list.hidden = false; }
        function render(items) {
            list.textContent = '';
            if (!items.length) { state(T.none); return; }
            items.forEach(function (item) {
                var row = make('div', 'sx-hs-hit');
                var thumb = make('span', 'sx-hs-thumb' + (box.getAttribute('data-kind') === 'developer' ? ' sx-hs-thumb--logo' : ''));
                if (item.image) { var img = make('img'); img.src = item.image; img.alt = ''; img.loading = 'lazy'; thumb.appendChild(img); } else { thumb.textContent = (item.name || '#').charAt(0); }
                row.appendChild(thumb);
                var text = make('span', 'sx-hs-hit__text');
                text.appendChild(make('strong', '', item.name || ('#' + item.id)));
                if (item.sub) { text.appendChild(make('small', '', item.sub)); }
                var badges = make('span', 'sx-hs-row__badges');
                if (item.launch) { badges.appendChild(make('span', 'sx-hs-badge sx-hs-badge--launch', T.launch)); }
                if (item.published === false) { badges.appendChild(make('span', 'sx-hs-badge sx-hs-badge--off', T.hidden)); }
                if (badges.childNodes.length) { text.appendChild(badges); }
                row.appendChild(text);
                if (item.chosen) {
                    row.appendChild(make('span', 'sx-hs-badge sx-hs-badge--home', '✓ ' + T.chosen));
                } else {
                    var button = make('button', 'btn btn-primary sx-hs-btn', T.add);
                    button.type = 'button';
                    button.setAttribute('data-hs-pick', String(item.id));
                    row.appendChild(button);
                }
                list.appendChild(row);
            });
            list.hidden = false;
        }
        function run(force) {
            var q = input.value.trim();
            if (!force && q === last && list.childNodes.length) { list.hidden = false; return; }
            last = q;
            var mine = ++round;
            state(T.searching);
            var url = box.getAttribute('data-url') + (box.getAttribute('data-url').indexOf('?') < 0 ? '?' : '&') + 'q=' + encodeURIComponent(q);
            fetch(url, { credentials: 'same-origin', headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
                .then(function (response) { if (!response.ok) { throw new Error(response.status); } return response.json(); })
                .then(function (data) { if (mine === round) { render((data && data.items) || []); } })
                .catch(function () { if (mine === round) { state(T.failed); last = null; } });
        }
        input.addEventListener('focus', function () { run(false); });
        input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { run(false); }, 260); });
        input.addEventListener('keydown', function (event) { if (event.key === 'Escape') { list.hidden = true; } if (event.key === 'Enter') { event.preventDefault(); run(true); } });
        document.addEventListener('click', function (event) { if (!box.contains(event.target)) { list.hidden = true; } });
        list.addEventListener('click', function (event) {
            var button = event.target.closest && event.target.closest('[data-hs-pick]');
            if (!button) { return; }
            idField.value = button.getAttribute('data-hs-pick');
            button.disabled = true;
            button.textContent = '…';
            if (form.requestSubmit) { form.requestSubmit(); } else { form.querySelector('button[type="submit"]').click(); }
            setTimeout(function () { button.disabled = false; button.textContent = T.add; }, 4000);
        });
    });

    document.querySelectorAll('form[data-hs-confirm]').forEach(function (form) {
        form.addEventListener('submit', function (event) { if (!window.confirm(form.getAttribute('data-hs-confirm'))) { event.preventDefault(); event.stopImmediatePropagation(); } });
    });

    function openTabOf(hash) {
        if (!hash) { return; }
        var target = null;
        try { target = document.querySelector(hash); } catch (e) { target = null; }
        var pane = target ? (target.classList.contains('tab-pane') ? target : target.closest('.tab-pane')) : null;
        if (!pane) { return; }
        var trigger = document.querySelector('[data-bs-toggle="tab"][href="#' + pane.id + '"]');
        if (trigger && !trigger.classList.contains('active') && window.bootstrap && window.bootstrap.Tab) { window.bootstrap.Tab.getOrCreateInstance(trigger).show(); }
        if (target !== pane) { setTimeout(function () { target.scrollIntoView({ block: 'center' }); }, 200); }
    }
    openTabOf(window.location.hash);
    document.querySelectorAll('[data-hs-tab]').forEach(function (link) {
        link.addEventListener('shown.bs.tab', function () {
            try { var url = new URL(window.location.href); url.searchParams.set('tab', link.getAttribute('data-hs-tab')); url.hash = ''; window.history.replaceState(null, '', url.toString()); } catch (e) { }
        });
    });

    var box = document.querySelector('[data-hero-crop]');
    if (!box) { return; }
    var stage = box.querySelector('[data-crop-stage]');
    var image = box.querySelector('[data-crop-image]');
    var zoom = box.querySelector('[data-crop-zoom]');
    var error = box.querySelector('[data-crop-error]');
    var crop = null;
    var token = CONF.token;
    var labels = CONF.crop;
    function clamp() {
        var sw = stage.clientWidth, sh = stage.clientHeight;
        crop.x = Math.min(0, Math.max(sw - image.naturalWidth * crop.scale, crop.x));
        crop.y = Math.min(0, Math.max(sh - image.naturalHeight * crop.scale, crop.y));
        image.style.transform = 'translate(' + crop.x + 'px,' + crop.y + 'px) scale(' + crop.scale + ')';
    }
    function open(trigger, source) {
        var w = parseInt(trigger.getAttribute('data-width'), 10), h = parseInt(trigger.getAttribute('data-height'), 10), slot = trigger.getAttribute('data-slot');
        error.style.display = 'none';
        image.onload = function () {
            box.classList.add('is-open');
            box.querySelector('[data-crop-title]').textContent = labels[slot] + ' — ' + w + ' × ' + h;
            var maxWidth = Math.min(box.querySelector('.shary-crop__box').clientWidth - 32, slot === 'mobile' ? 520 : 940);
            stage.style.width = maxWidth + 'px';
            stage.style.height = Math.round(maxWidth * h / w) + 'px';
            var min = Math.max(stage.clientWidth / image.naturalWidth, stage.clientHeight / image.naturalHeight);
            crop = { trigger: trigger, w: w, h: h, slot: slot, scale: min, min: min, x: 0, y: 0 };
            crop.x = (stage.clientWidth - image.naturalWidth * min) / 2;
            crop.y = (stage.clientHeight - image.naturalHeight * min) / 2;
            zoom.value = 100;
            if (image.naturalWidth < w * 0.6) { error.style.display = 'block'; error.textContent = labels.small.replace(':width', w); }
            clamp();
        };
        image.onerror = function () { window.alert(labels.failed); };
        image.src = source;
    }
    document.querySelectorAll('[data-hero-file]').forEach(function (input) {
        input.addEventListener('change', function () { if (input.files && input.files[0]) { open(input, URL.createObjectURL(input.files[0])); } });
    });
    document.querySelectorAll('[data-hero-adjust]').forEach(function (button) {
        button.addEventListener('click', function () { open(button, button.getAttribute('data-src')); });
    });
    zoom.addEventListener('input', function () {
        if (!crop) { return; }
        var cx = stage.clientWidth / 2, cy = stage.clientHeight / 2;
        var before = crop.scale, after = crop.min * zoom.value / 100;
        crop.x = cx - (cx - crop.x) * after / before;
        crop.y = cy - (cy - crop.y) * after / before;
        crop.scale = after;
        clamp();
    });
    var drag = null;
    stage.addEventListener('pointerdown', function (event) { if (!crop) { return; } drag = { x: event.clientX - crop.x, y: event.clientY - crop.y }; stage.setPointerCapture(event.pointerId); });
    stage.addEventListener('pointermove', function (event) { if (!drag || !crop) { return; } crop.x = event.clientX - drag.x; crop.y = event.clientY - drag.y; clamp(); });
    stage.addEventListener('pointerup', function () { drag = null; });
    function close() { box.classList.remove('is-open'); if (crop && crop.trigger.tagName === 'INPUT') { crop.trigger.value = ''; } crop = null; }
    box.querySelector('[data-crop-cancel]').addEventListener('click', close);
    box.querySelector('[data-crop-save]').addEventListener('click', function () {
        if (!crop) { return; }
        var button = this;
        var canvas = document.createElement('canvas');
        canvas.width = crop.w; canvas.height = crop.h;
        var context = canvas.getContext('2d');
        context.imageSmoothingQuality = 'high';
        context.drawImage(image, -crop.x / crop.scale, -crop.y / crop.scale, stage.clientWidth / crop.scale, stage.clientHeight / crop.scale, 0, 0, crop.w, crop.h);
        button.disabled = true; button.textContent = labels.saving;
        var done = function (ok, message) {
            button.disabled = false; button.textContent = labels.save;
            if (ok) { window.location.reload(); return; }
            error.style.display = 'block'; error.textContent = message || labels.failed;
        };
        try {
            canvas.toBlob(function (blob) {
                if (!blob) { done(false); return; }
                var data = new FormData();
                data.append('_token', token);
                data.append('slot', crop.slot);
                data.append('photo', blob, 'hero-' + crop.slot + '.jpg');
                fetch(crop.trigger.getAttribute('data-url'), { method: 'POST', body: data, credentials: 'same-origin', headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
                    .then(function (response) { return response.json().then(function (json) { return { ok: response.ok, json: json }; }); })
                    .then(function (result) { if (result.json && result.json.preview) { close(); button.disabled = false; button.textContent = labels.save; return; } done(result.ok && result.json && result.json.url, result.json && result.json.message); })
                    .catch(function () { done(false); });
            }, 'image/jpeg', 0.92);
        } catch (e) { done(false); }
    });
})();
