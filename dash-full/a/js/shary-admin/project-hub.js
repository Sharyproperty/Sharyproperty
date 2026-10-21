(function () {
    var CONF = JSON.parse(document.currentScript.getAttribute('data-conf') || '{}');
    var checksUrl = CONF.checksUrl;
    var secs = [].slice.call(document.querySelectorAll('[data-sec]'));
    var top = function () { var bar = document.querySelector('.sx-top'); return (bar ? bar.offsetHeight : 0) + 12; };

    function load(sec) {
        var frame = sec.querySelector('iframe');
        if (!frame.getAttribute('src')) frame.setAttribute('src', frame.getAttribute('data-src'));
    }
    function go(key) {
        var sec = document.getElementById('sec-' + key); if (!sec) return;
        load(sec); sec.classList.remove('is-folded');
        window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - top(), behavior: 'smooth' });
    }
    document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-tab],[data-go]');
        if (t) { go(t.getAttribute('data-tab') || t.getAttribute('data-go')); return; }
        var f = e.target.closest('[data-fold]');
        if (f) { var sec = f.closest('[data-sec]'); var folded = sec.classList.toggle('is-folded'); f.textContent = folded ? 'افتح' : 'طيّ'; f.setAttribute('aria-expanded', folded ? 'false' : 'true'); if (!folded) load(sec); }
    });

    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) { if (en.isIntersecting) { load(en.target); io.unobserve(en.target); } });
        }, { rootMargin: '900px 0px' });
        secs.forEach(function (sec) { io.observe(sec); });
    } else { secs.forEach(load); }

    var tabs = document.querySelectorAll('[data-tabs] [data-tab]');
    function mark() {
        var current = secs[0];
        secs.forEach(function (sec) { if (sec.getBoundingClientRect().top - top() < 80) current = sec; });
        tabs.forEach(function (b) { b.classList.toggle('is-on', !!current && b.getAttribute('data-tab') === current.getAttribute('data-sec')); });
    }
    window.addEventListener('scroll', mark, { passive: true }); mark();

    function size(sec) {
        var frame = sec.querySelector('iframe'), doc;
        try { doc = frame.contentDocument; } catch (e) { return; }
        if (!doc || !doc.body) return;
        var popup = sec.hasAttribute('data-modal') || /\b(modal-open|swal2-shown)\b/.test(doc.body.className);
        if (popup) { frame.style.height = Math.max(560, window.innerHeight - top() - 70) + 'px'; return; }
        var h = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
        if (Math.abs((parseInt(frame.style.height, 10) || 0) - h) > 4) frame.style.height = Math.max(320, h) + 'px';
    }
    var first = {};
    secs.forEach(function (sec) {
        var frame = sec.querySelector('iframe');
        frame.addEventListener('load', function () {
            var wait = sec.querySelector('[data-wait]'); if (wait) wait.hidden = true;
            size(sec);
            try {
                var doc = frame.contentDocument;
                if (window.ResizeObserver) new ResizeObserver(function () { size(sec); }).observe(doc.body);
                new MutationObserver(function () { size(sec); }).observe(doc.body, { attributes: true, attributeFilter: ['class'] });
                setTimeout(function () { size(sec); }, 800); setTimeout(function () { size(sec); }, 2500);
            } catch (e) {}
            var key = sec.getAttribute('data-sec');
            if (key === 'map') kickMap(sec, frame);
            if (first[key]) { refresh(); sync(sec); } else first[key] = true;
        });
    });
    window.addEventListener('resize', function () { secs.forEach(size); });

    function kickMap(sec, frame) {
        var win; try { win = frame.contentWindow; } catch (e) { return; }
        [600, 1500, 3000, 6000, 10000].forEach(function (ms) {
            setTimeout(function () {
                try {
                    win.dispatchEvent(new win.Event('resize'));
                    if (win.google && win.google.maps) {
                        ['map', 'boundsMap'].forEach(function (n) {
                            var m = win[n];
                            if (m && m.getCenter) { var c = m.getCenter(); win.google.maps.event.trigger(m, 'resize'); if (c) m.setCenter(c); }
                        });
                    }
                } catch (e) {}
            }, ms);
        });
        setTimeout(function () {
            var ok = false; try { ok = !!(win.google && win.google.maps); } catch (e) {}
            if (ok || sec.querySelector('[data-map-note]')) return;
            var note = document.createElement('div');
            note.setAttribute('data-map-note', '');
            note.className = 'alert alert-warning m-3 fw-bold d-flex flex-wrap align-items-center gap-2';
            note.innerHTML = 'خرايط جوجل ما حمّلتش هنا. افتح الجزء ده في صفحة لوحده:';
            var a = document.createElement('a');
            a.className = 'btn btn-sm btn-primary fw-bold'; a.target = '_blank'; a.rel = 'noopener';
            a.href = frame.getAttribute('data-src') + (frame.getAttribute('data-src').indexOf('?') === -1 ? '?' : '&') + 'embed=1';
            a.textContent = 'افتح الخرايط والماستر بلان ↗';
            note.appendChild(a);
            sec.querySelector('.shub-sec__body').prepend(note);
        }, 12000);
    }

    function path(frame) { try { return frame.contentWindow.location.pathname; } catch (e) { return ''; } }
    function sync(saved) {
        var p = path(saved.querySelector('iframe'));
        secs.forEach(function (sec) {
            if (sec === saved) return;
            var frame = sec.querySelector('iframe');
            if (frame.getAttribute('src') && p && path(frame) === p) { first[sec.getAttribute('data-sec')] = false; try { frame.contentWindow.location.reload(); } catch (e) {} }
        });
    }

    var list = document.querySelector('[data-checks]');
    function refresh() {
        if (!list) return;
        fetch(checksUrl, { headers: { 'Accept': 'application/json' }, credentials: 'same-origin' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (checks) {
                if (!Array.isArray(checks)) return;
                var html = '', done = 0, byTab = {};
                checks.forEach(function (c) {
                    var label = String(c.label).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; });
                    if (c.ok) { done++; html += '<li><i>✓</i><span>' + label + '</span></li>'; }
                    else { byTab[c.tab] = (byTab[c.tab] || 0) + 1; html += '<li class="is-miss"><i>!</i><button type="button" data-go="' + c.tab + '">' + label + '</button></li>'; }
                });
                list.innerHTML = html;
                var score = checks.length ? Math.round(done * 100 / checks.length) : 100;
                document.querySelector('[data-score]').textContent = score + '% كامل';
                var meter = document.querySelector('[data-meter]');
                meter.querySelector('i').style.width = score + '%';
                meter.classList.toggle('is-full', score >= 100); meter.classList.toggle('is-low', score < 60);
                document.querySelectorAll('[data-miss]').forEach(function (em) {
                    var n = byTab[em.getAttribute('data-miss')] || 0;
                    em.hidden = !n; em.textContent = 'ناقص ' + n;
                });
            }).catch(function () {});
    }
    var saveAll = document.querySelector('[data-save-all]');
    var note = document.querySelector('[data-dirty-note]');
    var saving = false;
    function dirtyForms() {
        var out = [];
        secs.forEach(function (sec) {
            var frame = sec.querySelector('iframe'), doc;
            try { doc = frame.contentDocument; } catch (e) { return; }
            if (!doc) return;
            [].forEach.call(doc.querySelectorAll('form[data-sx-dirty]'), function (form) { out.push({ sec: sec, frame: frame, form: form }); });
        });
        return out;
    }
    function paintDirty() {
        var list = dirtyForms();
        secs.forEach(function (sec) { sec.classList.toggle('is-dirty', list.some(function (d) { return d.sec === sec; })); });
        if (saveAll) saveAll.disabled = saving || !list.length;
        if (note) { note.hidden = !list.length; note.textContent = list.length ? 'فيه تعديلات مش محفوظة في ' + new Set(list.map(function (d) { return d.sec; })).size + ' جزء' : ''; }
    }
    function watch(sec) {
        var frame = sec.querySelector('iframe'), doc;
        try { doc = frame.contentDocument; } catch (e) { return; }
        if (!doc || doc.__sxWatch) return;
        doc.__sxWatch = true;
        var mark = function (e) {
            var form = e.target && e.target.form ? e.target.form : (e.target && e.target.closest ? e.target.closest('form') : null);
            if (!form || (form.method || '').toLowerCase() !== 'post' || form.hasAttribute('data-shary-confirm')) return;
            if (form.querySelector('input[name="delete"]')) return;
            form.setAttribute('data-sx-dirty', '1');
            var names = (form.getAttribute('data-sx-changed') || '').split('|').filter(Boolean);
            if (e.target.name && names.indexOf(e.target.name) === -1) names.push(e.target.name);
            form.setAttribute('data-sx-changed', names.join('|'));
            paintDirty();
        };
        doc.addEventListener('input', mark, true);
        doc.addEventListener('change', mark, true);
        doc.addEventListener('submit', function (e) { if (e.target && e.target.removeAttribute) e.target.removeAttribute('data-sx-dirty'); setTimeout(paintDirty, 50); }, true);
    }
    secs.forEach(function (sec) { sec.querySelector('iframe').addEventListener('load', function () { watch(sec); paintDirty(); }); });

    function merge(list) {
        var byPath = {}, out = [];
        list.forEach(function (d) {
            var key = path(d.frame) + '|' + (d.form.getAttribute('action') || '');
            if (!byPath[key]) { byPath[key] = d; out.push(d); return; }
            var main = byPath[key].form;
            var changed = (d.form.getAttribute('data-sx-changed') || '').split('|');
            ['lat', 'lng', 'address', 'bounds', 'coordinates', 'masterplan_corners'].forEach(function (n) { if (changed.indexOf(n) === -1) changed.push(n); });
            [].forEach.call(d.form.elements, function (el) {
                if (changed.indexOf(el.name) === -1) return;
                if (!el.name || el.type === 'file' || el.name === '_token' || el.name === '_method' || /\[\]$/.test(el.name)) return;
                var same = main.querySelectorAll('[name="' + el.name.replace(/"/g, '\\"') + '"]');
                if (same.length !== 1) return;
                var target = same[0];
                if (el.type === 'checkbox' || el.type === 'radio') target.checked = el.checked; else target.value = el.value;
            });
        });
        return out;
    }
    function submitOne(d) {
        return new Promise(function (resolve) {
            var done = false, finish = function () { if (!done) { done = true; resolve(); } };
            d.frame.addEventListener('load', finish, { once: true });
            setTimeout(finish, 45000);
            try {
                var button = d.form.querySelector('[type=submit]');
                if (d.form.requestSubmit) d.form.requestSubmit(button || undefined); else d.form.submit();
            } catch (e) { finish(); }
        });
    }
    if (saveAll) saveAll.addEventListener('click', function () {
        var list = merge(dirtyForms());
        if (!list.length || saving) return;
        saving = true; saveAll.disabled = true; saveAll.textContent = 'بيحفظ… (' + list.length + ')';
        list.reduce(function (p, d, i) {
            return p.then(function () { saveAll.textContent = 'بيحفظ ' + (i + 1) + ' من ' + list.length + '…'; return submitOne(d); });
        }, Promise.resolve()).then(function () {
            saving = false; saveAll.textContent = '✅ اتحفظ — 💾 احفظ كل التعديلات';
            setTimeout(function () { saveAll.textContent = '💾 احفظ كل التعديلات'; }, 4000);
            secs.forEach(function (sec) { var f = sec.querySelector('iframe'); try { [].forEach.call(f.contentDocument.querySelectorAll('form[data-sx-dirty]'), function (x) { x.removeAttribute('data-sx-dirty'); }); } catch (e) {} });
            paintDirty(); refresh(); reloadPreview();
        });
    });
    window.addEventListener('beforeunload', function (e) { if (!saving && dirtyForms().length) { e.preventDefault(); e.returnValue = ''; } });

    var preview = document.querySelector('[data-preview] iframe');
    function reloadPreview() { if (preview && preview.getAttribute('src')) preview.setAttribute('src', preview.getAttribute('data-src') + (preview.getAttribute('data-src').indexOf('?') === -1 ? '?' : '&') + 'sxp=' + Date.now()); }
    if (preview) {
        var pv = document.querySelector('[data-preview]');
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (en, ob) { if (en[0].isIntersecting) { preview.setAttribute('src', preview.getAttribute('data-src')); ob.disconnect(); } }, { rootMargin: '600px 0px' }).observe(pv);
        } else preview.setAttribute('src', preview.getAttribute('data-src'));
        document.querySelector('[data-preview-reload]').addEventListener('click', function () { if (!preview.getAttribute('src')) preview.setAttribute('src', preview.getAttribute('data-src')); else reloadPreview(); });
    }

    var start = new URLSearchParams(location.search).get('tab');
    if (start) {
        var moved = false, auto = false;
        window.addEventListener('wheel', function () { moved = true; }, { passive: true });
        window.addEventListener('touchstart', function () { moved = true; }, { passive: true });
        [300, 1500, 3000, 5000, 8000].forEach(function (ms) { setTimeout(function () { if (!moved) go(start); }, ms); });
    }
})();
