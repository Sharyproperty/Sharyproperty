/**
 * «المسودات» لأي فورم نصوص في لوحة التحكم (مقالات ، مطورين ، مشاريع ، مناطق ، نصوص الصفحات …) — App\Shary\FormDrafts.
 *
 *  - فوق زرار الحفظ: «حفظ كمسودة» + حالة الحفظ. وكمان بيتحفظ لوحده على السيرفر وانت بتكتب (بعد ثواني من آخر تعديل) ،
 *    فالمسودة بتفضل موجودة لو قفلت الجهاز أو الداشبورد ، وبتلاقيها من أي جهاز بنفس الحساب.
 *  - المسودة فيها اللي انت غيّرته بس (مش الفورم كله) ، والسيرفر بيضمّه على اللي قبله: نفس الفورم مفتوح في جزئين
 *    (زي «البيانات الأساسية» و«مكان المشروع على الخريطة» في صفحة المشروع) — تعديلات الاتنين بتتجمع في نفس المسودة ومحدش بيمسح التاني.
 *  - لما تفتح نفس الفورم تاني: شريط «عندك مسودة محفوظة» ← «افتح المسودة» بيرجّع كل اللي اتكتب (حتى محرر النصوص CKEditor / Summernote ،
 *    والصفوف اللي بتتزود بزرار زي خطط السداد والأسئلة ، ومكان المشروع وحدوده ومكان الماستر بلان على الخريطة).
 *    من صفحة «المسودات» زرار «كمّل» بيفتح الفورم والمسودة بترجع لوحدها (?open_draft=1).
 *  - النشر = زرار الحفظ العادي: لو الحفظ نجح المسودة بتتمسح لوحدها ، ولو رجع بغلط بتفضل زي ما هي —
 *    حتى في الفورمات اللي بتتحفظ من غير ما الصفحة تتغير (AJAX — المشروع ، المطور …): النجاح بيتعرف من رد السيرفر نفسه.
 *  - مش بيشتغل على: فورم الوحدة (ليه مسوداته بالصور) ، شيت الوحدات ، فورمات المسح / البحث / الدخول ، وأي فورم عليه data-no-draft.
 *  - الصفحة تقدر تقول (من غير ما تغيّر حاجة في الحفظ نفسه):
 *      data-draft على خانة مخفية        ← تتحفظ في المسودة (الخانات المخفية مش بتتحفظ من غير كده)
 *      data-draft-rows="name[]" على زرار «إضافة صف» (+ data-draft-row=".row-class") ← الصفوف بتتظبط على عدد صفوف المسودة
 *      حدث sx:draft-restored على الفورم بعد ما المسودة ترجع ← الصفحة ترسم الخريطة من جديد مثلاً
 * الإعدادات: window.SharyDrafts = { find, save, forget, token, ok (الصفحة دي جاية بعد حفظ ناجح) , t: { … } }
 */
(function () {
    var C = window.SharyDrafts;
    if (!C || !C.save || !window.fetch) return;
    var T = C.t || {};
    var PENDING = 'sx-draft-sent';
    var $ = window.jQuery && window.jQuery.fn ? window.jQuery : null;

    function eligible(form) {
        if ((form.getAttribute('method') || 'get').toLowerCase() !== 'post') return false;
        if (form.hasAttribute('data-no-draft') || form.hasAttribute('data-unit-form') || form.getAttribute('id') === 'sx-sheet') return false;
        var action = (form.getAttribute('action') || '').toLowerCase();
        if (/delete|destroy|logout|signin|login|drafts\/|search|filter|toggle|bulk|status|import|upload/.test(action)) return false;
        // مفاتيح الربط وكلمات السر وأوامر الإيجنت (سطر بيتبعت على طول) — مش نصوص بتتكتب
        if (/\/keys\/|social-login|agent\/commands|\/better$|agent\/(.*\/)?settings|smtp|password|token|secret/.test(action)) return false;
        if (form.querySelector('input[type="password"]')) return false;
        var texts = form.querySelectorAll('textarea, input[type="text"], input:not([type])');
        var big = form.querySelectorAll('textarea').length;
        return big > 0 || texts.length >= 2;
    }

    // ---- read / write the fields
    function editors(form) {
        var list = [];
        if (window.CKEDITOR && window.CKEDITOR.instances) {
            Object.keys(window.CKEDITOR.instances).forEach(function (name) {
                var instance = window.CKEDITOR.instances[name];
                if (instance && instance.element && form.contains(instance.element.$)) list.push({ kind: 'ck', el: instance.element.$, api: instance });
            });
        }
        if ($ && $.fn.summernote) {
            form.querySelectorAll('textarea').forEach(function (el) {
                var $el = $(el);
                if ($el.next('.note-editor').length) list.push({ kind: 'sn', el: el, api: $el });
            });
        }
        return list;
    }
    function skip(el) {
        var type = (el.type || '').toLowerCase();
        if (!el.name || el.disabled || el.name === '_token' || el.name === '_method') return true;
        // الخانة المخفية بتتحفظ بس لو الصفحة طالبة كده (data-draft) — زي مكان المشروع وحدوده ومكان الماستر بلان على الخريطة
        if (type === 'hidden') return !el.hasAttribute('data-draft');
        return ['file', 'password', 'submit', 'button', 'reset', 'image'].indexOf(type) > -1;
    }
    function collect(form) {
        editors(form).forEach(function (e) { try { if (e.kind === 'ck') e.api.updateElement(); else e.el.value = e.api.summernote('code'); } catch (error) { /* محرر مش جاهز */ } });
        var fields = {};
        Array.prototype.forEach.call(form.elements, function (el) {
            if (skip(el)) return;
            var type = (el.type || '').toLowerCase();
            if (type === 'checkbox') {
                if (!(el.name in fields)) fields[el.name] = [];
                if (el.checked) fields[el.name].push(el.value);
            } else if (type === 'radio') {
                if (el.checked) fields[el.name] = el.value; else if (!(el.name in fields)) fields[el.name] = null;
            } else if (el.tagName === 'SELECT' && el.multiple) {
                fields[el.name] = Array.prototype.filter.call(el.options, function (o) { return o.selected; }).map(function (o) { return o.value; });
            } else {
                // نفس الاسم أكتر من مرة (name[]) — قايمة بالترتيب
                if (/\[\]$/.test(el.name)) { (fields[el.name] = fields[el.name] || []).push(el.value); } else { fields[el.name] = el.value; }
            }
        });
        return fields;
    }
    // اللي اتغيّر عن الفورم وهو بيتفتح (+ أي خانة اتغيّرت قبل كده في نفس الفتحة ، حتى لو رجعت زي ما كانت — عشان ترجع في المسودة كمان)
    function changes(base, now, dirty) {
        var out = {};
        Object.keys(now).forEach(function (name) {
            if (dirty[name] || JSON.stringify(base[name] === undefined ? null : base[name]) !== JSON.stringify(now[name])) { dirty[name] = true; out[name] = now[name]; }
        });
        Object.keys(base).forEach(function (name) {
            if (name in now || !Array.isArray(base[name])) return;
            dirty[name] = true;                       // كل صفوفها اتشالت (خطط السداد ، الأسئلة …)
            out[name] = [];
        });
        return out;
    }
    function fire(el) {
        ['input', 'change'].forEach(function (name) { el.dispatchEvent(new Event(name, { bubbles: true })); });
        if ($) $(el).trigger('change');
    }
    function byName(form, name) {
        return Array.prototype.filter.call(form.elements, function (el) { return el.name === name; });
    }
    // الصفوف اللي بتتزود بزرار (خطط السداد ، خصومات الكاش ، الأسئلة …): نفس عدد صفوف المسودة
    function rows(form, fields) {
        Array.prototype.forEach.call(form.querySelectorAll('[data-draft-rows]'), function (button) {
            var name = button.getAttribute('data-draft-rows');
            var want = fields[name];
            if (!Array.isArray(want)) return;
            for (var guard = 0, have = byName(form, name).length; have < want.length && guard < 60; guard++) {
                button.click();
                var now = byName(form, name).length;
                if (now <= have) break;
                have = now;
            }
            var selector = button.getAttribute('data-draft-row');
            if (!selector) return;
            var list = Array.prototype.filter.call(form.querySelectorAll(selector), function (row) {
                return Array.prototype.some.call(row.querySelectorAll('[name]'), function (el) { return el.name === name; });
            });
            for (var i = list.length - 1; i >= want.length; i--) list[i].parentNode.removeChild(list[i]);
        });
    }
    function restore(form, fields) {
        rows(form, fields);
        var seen = {};
        Array.prototype.forEach.call(form.elements, function (el) {
            if (skip(el) || !(el.name in fields)) return;
            var value = fields[el.name];
            var type = (el.type || '').toLowerCase();
            if (type === 'checkbox') { el.checked = Array.isArray(value) && value.indexOf(el.value) > -1; }
            else if (type === 'radio') { el.checked = value !== null && String(value) === el.value; }
            else if (el.tagName === 'SELECT' && el.multiple) { Array.prototype.forEach.call(el.options, function (o) { o.selected = Array.isArray(value) && value.indexOf(o.value) > -1; }); }
            else if (/\[\]$/.test(el.name)) { var i = seen[el.name] || 0; seen[el.name] = i + 1; if (Array.isArray(value) && i < value.length) el.value = value[i]; }
            else { el.value = value == null ? '' : value; }
            fire(el);
        });
        editors(form).forEach(function (e) {
            var value = fields[e.el.name];
            if (value == null) return;
            try { if (e.kind === 'ck') e.api.setData(value); else e.api.summernote('code', value); } catch (error) { /* محرر مش جاهز */ }
        });
        // الصفحة ترسم اللي مش خانات (الخريطة: الدبوس والحدود ومكان الماستر بلان)
        try { form.dispatchEvent(new CustomEvent('sx:draft-restored', { bubbles: true, detail: { fields: fields } })); } catch (error) { /* */ }
    }
    function titleOf(form, fields) {
        // اسم الحاجة باللغة اللي الداشبورد مفتوح بيها
        var keys = /^en/i.test(document.documentElement.getAttribute('lang') || '')
            ? ['title_en', 'name_en', 'title', 'name', 'title_ar', 'name_ar', 'meta_title_en']
            : ['title_ar', 'name_ar', 'title', 'name', 'title_en', 'name_en', 'meta_title_ar'];
        for (var i = 0; i < keys.length; i++) if (fields[keys[i]]) return String(fields[keys[i]]).slice(0, 180);
        for (var key in fields) if (typeof fields[key] === 'string' && fields[key].trim() && !/^\d+$/.test(fields[key].trim()) && fields[key].length < 200 && !/^[\[{]/.test(fields[key].trim())) return fields[key].replace(/<[^>]+>/g, '').slice(0, 180);
        return '';
    }
    function screenName() {
        var h = document.querySelector('.page-header h4, .page-title h4, h4.page-title, .content h4, h1');
        return (h && h.textContent.trim()) || document.title || '';
    }
    // العنوان من غير ?open_draft و ?embed (الجزء اللي جوه «كل بيانات المشروع») — «كمّل» بيفتح الشاشة كاملة
    function cleanUrl() {
        var q = new URLSearchParams(window.location.search);
        ['open_draft', 'embed', 'focus', 'hide'].forEach(function (name) { q.delete(name); });
        var s = q.toString();
        return window.location.pathname + (s ? '?' + s : '');
    }
    function address(url) {
        url = String(url || '');
        if (url.charAt(0) === '#') return url;
        try { var u = new URL(url, window.location.href); return u.origin + u.pathname.replace(/\/+$/, ''); } catch (error) { return url; }
    }

    function post(url, body, keep) {
        var data = new FormData();
        Object.keys(body).forEach(function (key) { data.append(key, body[key]); });
        data.append('_token', C.token || '');
        return fetch(url, { method: 'POST', body: data, credentials: 'same-origin', keepalive: !!keep, headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
            .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok && j.ok !== false, json: j }; }); });
    }

    // ---- بعد الحفظ (النشر): لو الصفحة دي جاية بعد حفظ ناجح ، مسودة الفورم اللي اتبعت بتتمسح
    try {
        var sent = JSON.parse(window.sessionStorage.getItem(PENDING) || 'null');
        if (sent && sent.key) {
            window.sessionStorage.removeItem(PENDING);
            var recent = !sent.at || (Date.now() - sent.at) < 30 * 60 * 1000;
            var moved = sent.path && sent.path !== window.location.pathname;
            // الفورم اللي بيتحفظ من غير ما الصفحة تتغير (AJAX) نجاحه بيتعرف من رد السيرفر (تحت) — مش من الصفحة اللي بعده
            if (!sent.ajax && recent && (C.ok || moved)) post(C.forget, { key: sent.key });
        }
    } catch (error) { /* التخزين مقفول */ }

    // رد السيرفر على الحفظ (jQuery AJAX): الطلب اللي اتبعت مع زرار الحفظ (أو اللي رايح لعنوان الفورم نفسه)
    var watchers = [], lastSend = null;
    function writes(settings) { return String((settings && (settings.type || settings.method)) || 'GET').toUpperCase() !== 'GET'; }
    if ($) {
        $(document).on('ajaxSend', function (event, xhr, settings) {
            if (!writes(settings) || !xhr) return;
            lastSend = { xhr: xhr, at: Date.now() };
            watchers.forEach(function (watch) { watch.send(xhr); });
        });
        $(document).on('ajaxComplete', function (event, xhr, settings) {
            if (!writes(settings) || !xhr) return;
            watchers.forEach(function (watch) { watch.done(xhr, settings); });
        });
    }

    var forms = Array.prototype.filter.call(document.querySelectorAll('form'), eligible);
    var params = new URLSearchParams(window.location.search);
    forms.forEach(function (form, index) {
        var key = window.location.pathname.replace(/^\/+/, '') + '#' + index;
        var url = cleanUrl();
        var timer = null, last = '', busy = false, touched = false, base = {}, dirty = {}, note = null, waiting = null, publishedAt = 0;
        try { base = collect(form); last = JSON.stringify(base); } catch (error) { /* */ }

        // ---- الشريط: «حفظ كمسودة» + الحالة
        var bar = document.createElement('div');
        bar.className = 'sx-draftbar';
        bar.innerHTML = '<button type="button" class="sx-draftbar__save"></button><span class="sx-draftbar__state"></span>';
        var saveButton = bar.firstChild, state = bar.lastChild;
        saveButton.textContent = T.draft_save || 'حفظ كمسودة';
        state.textContent = T.draft_auto || '';
        var submit = form.querySelector('[type="submit"]:not([formaction])');
        if (submit && submit.parentNode) submit.parentNode.insertBefore(bar, submit); else form.appendChild(bar);

        function save(manual) {
            if (waiting && Date.now() - waiting.at < 20000) return;      // بيتنشر دلوقتي
            var fields = collect(form);
            var json = JSON.stringify(fields);
            if (!manual && json === last) return;
            if (busy) return;
            var diff = changes(base, fields, dirty);
            if (!Object.keys(diff).length) { last = json; if (manual) state.textContent = T.draft_nothing || ''; return; }
            busy = true;
            var startedAt = Date.now();
            state.textContent = T.draft_saving || '…';
            post(C.save, { key: key, url: url, title: titleOf(form, fields), screen: screenName(), fields: JSON.stringify(diff), merge: 1 }).then(function (res) {
                busy = false;
                if (publishedAt && startedAt <= publishedAt) { post(C.forget, { key: key }, true); return; }     // اتنشر وهي بتتحفظ
                if (res.ok) { last = json; state.textContent = (T.draft_saved || 'Draft saved') + ' ' + (res.json.when || ''); bar.classList.add('is-saved'); }
                else { state.textContent = (res.json && res.json.message) || T.draft_failed || ''; bar.classList.remove('is-saved'); }
            }).catch(function () { busy = false; state.textContent = T.draft_failed || ''; });
        }
        saveButton.addEventListener('click', function () { save(true); });
        function changed() { touched = true; clearTimeout(timer); timer = setTimeout(function () { save(false); }, 4000); }
        form.addEventListener('input', changed);
        form.addEventListener('change', changed);
        // محررات النصوص: التعديل جوه المحرر نفسه
        setTimeout(function () {
            editors(form).forEach(function (e) {
                try { if (e.kind === 'ck') e.api.on('change', changed); else e.api.on('summernote.change', changed); } catch (error) { /* */ }
            });
            if (!touched) { base = collect(form); last = JSON.stringify(base); }      // اللي في الفورم وهو بيتفتح (والمحررات بتجهز) مش "تعديل"
        }, 1200);

        // الخانات المخفية (data-draft) بتتغيّر من الخريطة مش من الكيبورد: ضغطة / سحب بدأ جوه الفورم (الدبوس ، نقط الحدود ، الماستر بلان ، أدواتها)
        // ← نقارن قيمها من أول الضغطة لحد بعدها بشوية (الأدوات اللي بتسأل السيرفر بترد بعد ثواني). اللي الصفحة بتكتبه لوحدها وهي بتفتح مش «تعديل»
        var hidden = form.querySelectorAll('input[type="hidden"][data-draft]');
        if (hidden.length) {
            var snap = function () { return Array.prototype.map.call(hidden, function (h) { return h.value; }).join('\u0001'); };
            var start = null;
            document.addEventListener('pointerdown', function (event) {
                if (event.target && form.contains(event.target)) start = snap();
            }, true);
            document.addEventListener('pointercancel', function () { start = null; }, true);
            document.addEventListener('pointerup', function () {
                if (start === null) return;
                var before = start;
                start = null;
                [0, 700, 2000, 5000].forEach(function (ms) {
                    setTimeout(function () { var now = snap(); if (now !== before) { before = now; changed(); } }, ms);
                });
            }, true);
        }

        // ---- النشر (زرار الحفظ العادي)
        function sending(ajax) {
            clearTimeout(timer);
            // طلب الحفظ ممكن يكون اتبعت قبل ما الحدث يوصل هنا (الصفحة ماسكة الـ submit قبلنا) — أو هيتبعت بعد شوية
            var xhr = (waiting && waiting.xhr) || (lastSend && Date.now() - lastSend.at < 400 ? lastSend.xhr : null);
            waiting = { at: Date.now(), xhr: xhr };
            try { window.sessionStorage.setItem(PENDING, JSON.stringify({ key: key, path: window.location.pathname, at: Date.now(), ajax: !!ajax })); } catch (error) { /* */ }
        }
        form.addEventListener('submit', function (event) {
            sending(false);
            setTimeout(function () { if (event.defaultPrevented) sending(true); }, 0);
        });
        // الصفحات اللي بتبعت الفورم بـ $('#form').submit() (من غير حدث submit حقيقي) ، وبعدين AJAX
        if ($) {
            $(form).on('submit.sxdraft', function (event) {
                if (event.originalEvent) return;
                sending(false);
                setTimeout(function () { if (event.isDefaultPrevented()) sending(true); }, 0);
            });
        }
        watchers.push({ send: function (xhr) {
            if (waiting && !waiting.xhr && Date.now() - waiting.at < 5000) waiting.xhr = xhr;
        }, done: function (xhr, settings) {
            if (!waiting || Date.now() - waiting.at > 10 * 60 * 1000) return;
            if (waiting.xhr !== xhr && address(settings.url) !== address(form.getAttribute('action') || window.location.href)) return;
            var ok = xhr.status >= 200 && xhr.status < 300, body = xhr.responseJSON;
            if (body === undefined) { try { body = JSON.parse(xhr.responseText); } catch (error) { body = null; } }
            if (ok && body && typeof body === 'object' && (body.type === 'error' || body.status === 0 || body.status === false || body.success === false || body.ok === false || body.errors)) ok = false;
            waiting = null;
            try { var pending = JSON.parse(window.sessionStorage.getItem(PENDING) || 'null'); if (pending && pending.key === key) window.sessionStorage.removeItem(PENDING); } catch (error) { /* */ }
            if (!ok) return;                      // الحفظ ما نجحش: المسودة زي ما هي
            // اتنشر: المسودة بتتمسح ، واللي في الفورم دلوقتي هو الأساس الجديد (لو الصفحة فضلت مفتوحة وكمّلت تعديل ، المسودة الجديدة فيها الجديد بس)
            publishedAt = Date.now();
            clearTimeout(timer);
            base = collect(form);
            dirty = {};
            last = JSON.stringify(base);
            post(C.forget, { key: key }, true);
            if (note && note.parentNode) note.parentNode.removeChild(note);
            state.textContent = T.draft_published || '';
            bar.classList.remove('is-saved');
        } });

        // ---- فيه مسودة؟
        fetch(C.find + '?key=' + encodeURIComponent(key), { credentials: 'same-origin', headers: { 'Accept': 'application/json' } })
            .then(function (r) { return r.json(); }).then(function (j) {
                var draft = j && j.draft;
                if (!draft || publishedAt) return;
                var apply = function () {
                    if (!note || !note.parentNode) return;
                    restore(form, draft.fields || {});
                    last = JSON.stringify(collect(form));
                    note.parentNode.removeChild(note);
                    if (window.toastr) window.toastr.success(T.draft_opened || ''); else state.textContent = T.draft_opened || '';
                };
                note = document.createElement('div');
                note.className = 'sx-draftnote';
                note.innerHTML = '<span></span><button type="button" class="sx-draftnote__open"></button><button type="button" class="sx-draftnote__drop"></button>';
                note.children[0].textContent = (T.draft_found || '').replace(':when', draft.when || '');
                note.children[1].textContent = T.draft_open || '';
                note.children[2].textContent = T.draft_drop || '';
                note.children[1].addEventListener('click', function () { setTimeout(apply, 0); });
                note.children[2].addEventListener('click', function () { post(C.forget, { key: key }); note.parentNode.removeChild(note); });
                form.insertBefore(note, form.firstChild);
                if (params.get('open_draft') === '1') setTimeout(apply, 1500);   // من صفحة «المسودات»: بترجع لوحدها (بعد ما المحررات تجهز)
            }).catch(function () { /* */ });
    });
})();
