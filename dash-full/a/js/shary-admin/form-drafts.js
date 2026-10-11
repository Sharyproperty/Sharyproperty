/**
 * «المسودات» لأي فورم نصوص في لوحة التحكم (مقالات ، مطورين ، مشاريع ، مناطق ، نصوص الصفحات …) — App\Shary\FormDrafts.
 *
 *  - فوق زرار الحفظ: «حفظ كمسودة» + حالة الحفظ. وكمان بيتحفظ لوحده على السيرفر وانت بتكتب (بعد ثواني من آخر تعديل) ،
 *    فالمسودة بتفضل موجودة لو قفلت الجهاز أو الداشبورد ، وبتلاقيها من أي جهاز بنفس الحساب.
 *  - لما تفتح نفس الفورم تاني: شريط «عندك مسودة محفوظة» ← «افتح المسودة» بيرجّع كل اللي اتكتب (حتى محرر النصوص CKEditor / Summernote).
 *    من صفحة «المسودات» زرار «كمّل» بيفتح الفورم والمسودة بترجع لوحدها (?open_draft=1).
 *  - النشر = زرار الحفظ العادي: لو الحفظ نجح المسودة بتتمسح لوحدها ، ولو رجع بغلط بتفضل زي ما هي.
 *  - مش بيشتغل على: فورم الوحدة (ليه مسوداته بالصور) ، شيت الوحدات ، فورمات المسح / البحث / الدخول ، وأي فورم عليه data-no-draft.
 * الإعدادات: window.SharyDrafts = { find, save, forget, token, ok (الصفحة دي جاية بعد حفظ ناجح) , t: { … } }
 */
(function () {
    var C = window.SharyDrafts;
    if (!C || !C.save || !window.fetch) return;
    var T = C.t || {};
    var PENDING = 'sx-draft-sent';

    function eligible(form) {
        if ((form.getAttribute('method') || 'get').toLowerCase() !== 'post') return false;
        if (form.hasAttribute('data-no-draft') || form.hasAttribute('data-unit-form') || form.id === 'sx-sheet') return false;
        var action = (form.getAttribute('action') || '').toLowerCase();
        if (/delete|destroy|logout|signin|login|drafts\/|search|filter|toggle|bulk|status|import|upload/.test(action)) return false;
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
        if (window.jQuery && window.jQuery.fn && window.jQuery.fn.summernote) {
            form.querySelectorAll('textarea').forEach(function (el) {
                var $el = window.jQuery(el);
                if ($el.next('.note-editor').length) list.push({ kind: 'sn', el: el, api: $el });
            });
        }
        return list;
    }
    function skip(el) {
        var type = (el.type || '').toLowerCase();
        return !el.name || el.disabled || ['file', 'password', 'hidden', 'submit', 'button', 'reset', 'image'].indexOf(type) > -1 || el.name === '_token' || el.name === '_method';
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
    function fire(el) {
        ['input', 'change'].forEach(function (name) { el.dispatchEvent(new Event(name, { bubbles: true })); });
        if (window.jQuery) window.jQuery(el).trigger('change');
    }
    function restore(form, fields) {
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
    }
    function titleOf(form, fields) {
        var keys = ['title_ar', 'name_ar', 'title', 'name', 'title_en', 'name_en', 'meta_title_ar'];
        for (var i = 0; i < keys.length; i++) if (fields[keys[i]]) return String(fields[keys[i]]).slice(0, 180);
        for (var key in fields) if (typeof fields[key] === 'string' && fields[key].trim() && !/^\d+$/.test(fields[key].trim()) && fields[key].length < 200) return fields[key].replace(/<[^>]+>/g, '').slice(0, 180);
        return '';
    }
    function screenName() {
        var h = document.querySelector('.page-header h4, .page-title h4, h4.page-title, .content h4, h1');
        return (h && h.textContent.trim()) || document.title || '';
    }

    function post(url, body) {
        var data = new FormData();
        Object.keys(body).forEach(function (key) { data.append(key, body[key]); });
        data.append('_token', C.token || '');
        return fetch(url, { method: 'POST', body: data, credentials: 'same-origin', headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
            .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok && j.ok !== false, json: j }; }); });
    }

    // ---- بعد الحفظ (النشر): لو الصفحة دي جاية بعد حفظ ناجح ، مسودة الفورم اللي اتبعت بتتمسح
    try {
        var sent = JSON.parse(window.sessionStorage.getItem(PENDING) || 'null');
        if (sent && sent.key) {
            window.sessionStorage.removeItem(PENDING);
            var moved = sent.path && sent.path !== window.location.pathname;
            if (C.ok || moved) post(C.forget, { key: sent.key });
        }
    } catch (error) { /* التخزين مقفول */ }

    var forms = Array.prototype.filter.call(document.querySelectorAll('.page-wrapper form, .content form, main form'), eligible);
    var params = new URLSearchParams(window.location.search);
    forms.forEach(function (form, index) {
        var key = window.location.pathname.replace(/^\/+/, '') + '#' + index;
        var url = window.location.pathname + window.location.search.replace(/([?&])open_draft=1(&|$)/, '$1').replace(/[?&]$/, '');
        var timer = null, last = '', busy = false, touched = false;
        try { last = JSON.stringify(collect(form)); } catch (error) { /* */ }

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
            var fields = collect(form);
            var json = JSON.stringify(fields);
            if (!manual && json === last) return;
            if (busy) return;
            busy = true;
            state.textContent = T.draft_saving || '…';
            post(C.save, { key: key, url: url, title: titleOf(form, fields), screen: screenName(), fields: json }).then(function (res) {
                busy = false;
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
            if (!touched) last = JSON.stringify(collect(form));      // اللي في الفورم وهو بيتفتح (والمحررات بتجهز) مش "تعديل"
        }, 1200);
        form.addEventListener('submit', function () {
            try { window.sessionStorage.setItem(PENDING, JSON.stringify({ key: key, path: window.location.pathname })); } catch (error) { /* */ }
        });

        // ---- فيه مسودة؟
        fetch(C.find + '?key=' + encodeURIComponent(key), { credentials: 'same-origin', headers: { 'Accept': 'application/json' } })
            .then(function (r) { return r.json(); }).then(function (j) {
                var draft = j && j.draft;
                if (!draft) return;
                var apply = function () {
                    restore(form, draft.fields || {});
                    last = JSON.stringify(collect(form));
                    note.remove();
                    if (window.toastr) window.toastr.success(T.draft_opened || ''); else state.textContent = T.draft_opened || '';
                };
                var note = document.createElement('div');
                note.className = 'sx-draftnote';
                note.innerHTML = '<span></span><button type="button" class="sx-draftnote__open"></button><button type="button" class="sx-draftnote__drop"></button>';
                note.children[0].textContent = (T.draft_found || '').replace(':when', draft.when || '');
                note.children[1].textContent = T.draft_open || '';
                note.children[2].textContent = T.draft_drop || '';
                note.children[1].addEventListener('click', function () { setTimeout(apply, 0); });
                note.children[2].addEventListener('click', function () { post(C.forget, { key: key }); note.remove(); });
                form.insertBefore(note, form.firstChild);
                if (params.get('open_draft') === '1') setTimeout(apply, 1500);   // من صفحة «المسودات»: بترجع لوحدها (بعد ما المحررات تجهز)
            }).catch(function () { /* */ });
    });
})();
