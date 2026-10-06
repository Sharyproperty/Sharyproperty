/**
 * صفحة شاري كارد (resources/views/card/show.blade.php)
 * - شريط الكود [data-card-strip]: العميل اللي معاه كارت بيشوف رقم الكود [data-card-code] على الكارت (is-revealed) وتحت الكارت [data-card-code-text].
 *   الضغط على الشريط بيغطي / يكشف الكود. الزائر: الشريط رمادي والضغط عليه بينزّله للفورم.
 * - زرار النسخ [data-card-copy]: بينسخ الكود وبيكتب "تم نسخ الكود" لحظة.
 * - فورم طلب الكارت [data-card-form]: بيتأكد من الاسم والرقم، وبعدها بيطلع حدث shary:card-request على الفورم:
 *       form.addEventListener('shary:card-request', function (event) {
 *           event.preventDefault();                         // هنطلب الكارت AJAX
 *           // event.detail = { name, phone, country_code, show(card), pending(), fail(message) }
 *           event.detail.pending();                                           // الطلب اتسجل والكود لسه هيصدر من الأدمن: رسالة "طلبك وصل"
 *           event.detail.show({ name: 'نبيل سليمان', code: 'SH-482913' });   // الكود صدر: الكارت بيظهر باسمه وكوده + دعوة صديق
 *       });
 *   لو الحدث ما اتمنعش الفورم بيتبعت عادي (POST) والسيرفر يرجّع الصفحة بالكارت ($card).
 */
(function () {
    document.querySelectorAll('[data-card-page]').forEach(function (page) {
        var strip = page.querySelector('[data-card-strip]');
        var code = page.querySelector('[data-card-code]');
        var name = page.querySelector('[data-card-name]');
        var form = page.querySelector('[data-card-form]');
        var ready = page.querySelector('[data-card-ready]');
        var copyButton = page.querySelector('[data-card-copy]');

        var codeText = page.querySelector('[data-card-code-text]');

        if (strip) strip.addEventListener('click', function () {
            if (!code.textContent.trim()) {
                // زائر لسه ما أخدش كارت: ينزل لفورم الطلب
                var first = form && form.querySelector('input[name="name"]');
                if (first) { form.scrollIntoView({ behavior: 'smooth', block: 'center' }); first.focus({ preventScroll: true }); }
                return;
            }
            strip.classList.toggle('is-revealed');
        });

        if (copyButton) copyButton.addEventListener('click', function () {
            var value = code.textContent.trim();
            if (!value) return;
            var label = copyButton.querySelector('[data-card-copy-label]');
            var original = label.textContent;
            function done() { label.textContent = copyButton.getAttribute('data-done') || original; setTimeout(function () { label.textContent = original; }, 1800); }
            if (strip) strip.classList.add('is-revealed');
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(value).then(done, done); else done();
        });

        var pendingBox = page.querySelector('[data-card-pending]');
        var invite = page.querySelector('[data-card-invite]');

        // الطلب اتسجل ولسه الكود ما صدرش من الأدمن: رسالة "طلبك وصل" مكان الفورم
        function pending() {
            if (form) form.classList.add('hidden');
            if (pendingBox) pendingBox.classList.remove('hidden');
        }

        // الكارت بيظهر باسم العميل وكوده
        function show(card) {
            if (!card || !card.code) return;
            if (pendingBox) pendingBox.classList.add('hidden');
            if (invite) invite.href = 'https://wa.me/?text=' + encodeURIComponent((invite.getAttribute('data-message') || '').replace(':code', card.code));
            name.textContent = card.name || name.getAttribute('data-empty');
            code.textContent = card.code;
            if (codeText) codeText.textContent = card.code;
            strip.classList.add('is-revealed');
            page.setAttribute('data-state', 'member');
            if (form) form.classList.add('hidden');
            if (ready) ready.classList.remove('hidden');
            var top = page.getBoundingClientRect().top + window.pageYOffset - 90;
            if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: 'smooth' });
        }

        if (!form) return;
        var error = form.querySelector('[data-card-error]');
        form.addEventListener('input', function () { if (error) error.classList.add('hidden'); });
        form.addEventListener('submit', function (event) {
            var nameInput = form.querySelector('input[name="name"]');
            var phoneInput = form.querySelector('input[name="phone"]');
            var ok = nameInput.value.trim().length > 1 && phoneInput.value.replace(/\D/g, '').length >= 6;
            if (!ok) {
                event.preventDefault();
                if (error) error.classList.remove('hidden');
                (nameInput.value.trim().length > 1 ? phoneInput : nameInput).focus();
                return;
            }
            var go = form.dispatchEvent(new CustomEvent('shary:card-request', {
                bubbles: true,
                cancelable: true,
                detail: {
                    name: nameInput.value.trim(), phone: phoneInput.value, country_code: (form.querySelector('[data-phone-value]') || {}).value || '',
                    show: show,
                    pending: pending,
                    fail: function (message) { if (error) { if (message) error.textContent = message; error.classList.remove('hidden'); } }
                }
            }));
            if (!go) event.preventDefault();
        });
    });
})();
