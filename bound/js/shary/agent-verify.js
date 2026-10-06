/**
 * صفحة "التحقق من الوكيل" (resources/views/agents/verify.blade.php)
 * - الفورم [data-agent-form] GET عادي: من غير السكربت الصفحة بترجع بالنتيجة من السيرفر.
 * - السكربت بيتأكد إن الرقم مكتوب، وبعدها بيطلع حدث shary:agent-verify على الفورم:
 *       form.addEventListener('shary:agent-verify', function (event) {
 *           event.preventDefault();                       // هنجيب النتيجة AJAX
 *           // event.detail = { phone, country_code, show }
 *           event.detail.show({ found: true, agent: { name, role, email, phone, phone_display, whatsapp, image } });
 *           // أو: event.detail.show({ found: false });
 *       });
 *   لو الحدث ما اتمنعش الفورم بيتبعت عادي.
 * - "تحقق من رقم آخر" [data-agent-again] بيخفي النتيجة ويرجّع للخانة.
 */
(function () {
    document.querySelectorAll('[data-agent-verify]').forEach(function (box) {
        var form = box.querySelector('[data-agent-form]');
        if (!form) return;
        var input = form.querySelector('input[name="phone"]');
        var error = form.querySelector('[data-agent-error]');
        var found = box.querySelector('[data-agent-result="found"]');
        var missing = box.querySelector('[data-agent-result="missing"]');

        function text(root, name, value) {
            root.querySelectorAll('[data-agent-field="' + name + '"]').forEach(function (node) { node.textContent = value || ''; });
        }

        function show(result) {
            var ok = !!(result && result.found && result.agent);
            var checked = (result && result.checked) || (form.querySelector('[data-phone-value]').value + ' ' + input.value);
            found.classList.toggle('hidden', !ok);
            missing.classList.toggle('hidden', ok);
            box.setAttribute('data-state', ok ? 'found' : 'missing');
            if (ok) {
                var agent = result.agent;
                text(found, 'name', agent.name);
                text(found, 'role', agent.role);
                text(found, 'email', agent.email);
                text(found, 'phone', agent.phone_display || agent.phone);
                found.querySelectorAll('[data-agent-link="email"]').forEach(function (a) { a.setAttribute('href', 'mailto:' + (agent.email || '')); });
                found.querySelectorAll('[data-agent-link="phone"]').forEach(function (a) { a.setAttribute('href', 'tel:' + (agent.phone || '')); });
                found.querySelectorAll('[data-agent-link="whatsapp"]').forEach(function (a) { a.setAttribute('href', 'https://wa.me/' + (agent.whatsapp || String(agent.phone || '').replace(/\D/g, ''))); });
                var photo = found.querySelector('[data-agent-photo]');
                var blank = found.querySelector('[data-agent-photo-blank]');
                if (photo) {
                    if (agent.image) photo.setAttribute('src', agent.image);
                    photo.setAttribute('alt', agent.name || '');
                    photo.classList.toggle('hidden', !agent.image);
                }
                if (blank) blank.classList.toggle('hidden', !!agent.image);
            } else {
                text(missing, 'checked', checked);
            }
            var card = ok ? found : missing;
            if (card.scrollIntoView) card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }

        form.addEventListener('submit', function (event) {
            var digits = input.value.replace(/\D/g, '');
            if (digits.length < 6) {   // رقم ناقص: رسالة تحت الخانة
                event.preventDefault();
                if (error) error.classList.remove('hidden');
                input.focus();
                return;
            }
            if (error) error.classList.add('hidden');
            var go = form.dispatchEvent(new CustomEvent('shary:agent-verify', {
                bubbles: true,
                cancelable: true,
                detail: { phone: input.value, country_code: form.querySelector('[data-phone-value]').value, show: show }
            }));
            if (!go) event.preventDefault();   // النتيجة هتيجي من اللي سمع الحدث (AJAX) بـ detail.show(...)
        });

        input.addEventListener('input', function () { if (error) error.classList.add('hidden'); });

        box.querySelectorAll('[data-agent-again]').forEach(function (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                found.classList.add('hidden');
                missing.classList.add('hidden');
                box.setAttribute('data-state', 'idle');
                input.value = '';
                input.focus();
                if (form.scrollIntoView) form.scrollIntoView({ block: 'center', behavior: 'smooth' });
            });
        });
    });
})();
