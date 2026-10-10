/*
 * صفحة تسجيل الدخول / حساب جديد (resources/views/shary/auth/show.blade.php).
 * - التبويبين ([data-auth-tab]) بيبدّلوا بين الفورمين من غير تحميل ، واللينك في شريط العنوان بيتغير (/sign-in ↔ /sign-up).
 * - الفورم بيتبعت fetch (JSON) ومعاه X-CSRF-TOKEN: نجاح ← رسالة ترحيب وبعدها تحويل لـ redirect ،
 *   خطأ ← الرسالة فوق الفورم والخانة الغلط بتتعلّم (.is-invalid).
 * - زرار العين ([data-auth-eye]) بيظهر / يخفي كلمة المرور.
 * من أي كود: حدث shary:auth على document بعد الدخول — detail = { mode: 'in' | 'up', redirect }.
 */
(function () {
    'use strict';
    var root = document.querySelector('[data-auth]');
    if (!root) return;

    var alertBox = root.querySelector('[data-auth-alert]');
    var forms = {};
    root.querySelectorAll('[data-auth-form]').forEach(function (form) { forms[form.getAttribute('data-auth-form')] = form; });

    function token() { var meta = document.querySelector('meta[name="csrf-token"]'); return meta ? meta.getAttribute('content') : ''; }

    function say(text, ok) {
        if (!alertBox) return;
        alertBox.textContent = text || '';
        alertBox.classList.toggle('hidden', !text);
        alertBox.classList.toggle('is-ok', !!ok);
    }

    function clearMarks(form) { form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); }); }

    function open(mode, link) {
        if (!forms[mode]) return;
        Object.keys(forms).forEach(function (key) { forms[key].classList.toggle('hidden', key !== mode); });
        root.setAttribute('data-mode', mode);
        root.querySelectorAll('[role="tab"][data-auth-tab]').forEach(function (tab) { tab.setAttribute('aria-selected', tab.getAttribute('data-auth-tab') === mode ? 'true' : 'false'); });
        say('');
        if (link && window.history && history.replaceState) { try { history.replaceState(null, '', link); } catch (error) { /* file:// */ } }
        var first = forms[mode].querySelector('input:not([type="hidden"])');
        if (first && window.matchMedia('(min-width: 1024px)').matches) first.focus();
    }

    root.addEventListener('click', function (event) {
        var tab = event.target.closest('[data-auth-tab]');
        if (tab) { event.preventDefault(); open(tab.getAttribute('data-auth-tab'), tab.getAttribute('href')); return; }
        var eye = event.target.closest('[data-auth-eye]');
        if (eye) {
            var input = eye.parentNode.querySelector('input');
            var shown = input.type === 'text';
            input.type = shown ? 'password' : 'text';
            eye.setAttribute('aria-pressed', shown ? 'false' : 'true');
            eye.setAttribute('aria-label', root.getAttribute(shown ? 'data-show' : 'data-hide') || '');
            eye.classList.toggle('is-on', !shown);
        }
    });

    root.addEventListener('input', function (event) {
        var field = event.target.closest('.req-field');
        if (field) field.classList.remove('is-invalid');
    });

    Object.keys(forms).forEach(function (mode) {
        var form = forms[mode];
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            if (form.getAttribute('data-busy') === '1') return;
            clearMarks(form);
            say('');
            // خانة فاضية أو مش مظبوطة: علّمها واقف عندها (رسالة المتصفح نفسه)
            var bad = null;
            form.querySelectorAll('input[required]').forEach(function (input) {
                if (!bad && !input.checkValidity()) bad = input;
            });
            if (bad) {
                var holder = bad.closest('.req-field');
                if (holder) holder.classList.add('is-invalid');
                say(bad.validationMessage || root.getAttribute('data-failed'));
                bad.focus();
                return;
            }
            var button = form.querySelector('[data-auth-submit]');
            var label = button ? button.querySelector('span') : null;
            var text = label ? label.textContent : '';
            form.setAttribute('data-busy', '1');
            if (button) button.disabled = true;
            if (label) label.textContent = root.getAttribute('data-sending') || text;

            function done() {
                form.removeAttribute('data-busy');
                if (button) button.disabled = false;
                if (label) label.textContent = text;
            }

            fetch(form.getAttribute('action'), {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': token(), 'X-Requested-With': 'XMLHttpRequest' },
                body: new FormData(form)
            }).then(function (response) {
                return response.json().catch(function () { return {}; }).then(function (data) { return { status: response.status, data: data || {} }; });
            }).then(function (result) {
                var data = result.data;
                if (result.status === 429) { done(); say(root.getAttribute('data-too-many')); return; }
                if (result.status >= 200 && result.status < 300 && data.success) {
                    say(data.message || '', true);
                    document.dispatchEvent(new CustomEvent('shary:auth', { detail: { mode: mode, redirect: data.redirect || '' } }));
                    window.setTimeout(function () { window.location.href = data.redirect || '/'; }, 500);
                    return;
                }
                done();
                Object.keys(data.errors || {}).forEach(function (name) {
                    var holder = form.querySelector('[data-field="' + name + '"]');
                    if (holder) holder.classList.add('is-invalid');
                });
                say(data.message || root.getAttribute('data-failed'));
            }).catch(function () { done(); say(root.getAttribute('data-failed')); });
        });
    });
})();
