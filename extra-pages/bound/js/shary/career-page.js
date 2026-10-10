/**
 * صفحة الوظائف (resources/views/careers/index.blade.php)
 * - "قدّم الآن" [data-job-apply="slug"]: بيختار الوظيفة في فورم التقديم وينزل للفورم.
 * - السيرة الذاتية [data-cv-input]: زرارين [data-cv-pick] — "ملف" بيفتح المستندات (PDF / Word) و"صورة" بيفتح معرض الصور — واسم الملف بيظهر مكان اسم الخانة.
 * - الإرسال: بيتأكد من الاسم والرقم والسيرة الذاتية، وبعدها حدث shary:career-apply على الفورم:
 *       form.addEventListener('shary:career-apply', function (event) {
 *           event.preventDefault();                 // هنبعت AJAX
 *           // event.detail = { data: FormData, done(), fail(message) }
 *       });
 *   لو الحدث ما اتمنعش الفورم بيتبعت عادي (POST multipart).
 */
(function () {
    document.querySelectorAll('[data-career-form]').forEach(function (form) {
        var select = form.querySelector('select[name="position"]');
        var input = form.querySelector('[data-cv-input]');
        var label = form.querySelector('[data-cv-label]');
        var error = form.querySelector('[data-career-error]');
        var body = form.querySelector('[data-career-body]');
        var done = form.querySelector('[data-career-done]');

        function mark() { if (select) select.classList.toggle('has-value', !!select.value); }

        document.addEventListener('click', function (event) {
            var button = event.target.closest ? event.target.closest('[data-job-apply]') : null;
            if (!button) return;
            if (select) { select.value = button.getAttribute('data-job-apply'); mark(); select.dispatchEvent(new Event('change', { bubbles: true })); }   // change: زرار القايمة (form-select.js) بيتحدّث
            var desktop = window.matchMedia && window.matchMedia('(min-width: 1024px)').matches;
            var top = form.getBoundingClientRect().top + window.pageYOffset - 96;
            // موبايل: بينزل للفورم. ديسك توب: الفورم ثابت جنب الوظائف — بينوّر حواليه وبيقف المؤشر في خانة الاسم عشان يبان إن الوظيفة اتختارت
            if (!desktop || form.getBoundingClientRect().top < 60 || form.getBoundingClientRect().top > window.innerHeight - 200) window.scrollTo({ top: top, behavior: 'smooth' });
            form.classList.remove('is-picked');
            void form.offsetWidth;
            form.classList.add('is-picked');
            setTimeout(function () { form.classList.remove('is-picked'); }, 1600);
            if (desktop) { var first = form.querySelector('input[name="name"]'); if (first) setTimeout(function () { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }, 250); }
        });

        if (select) select.addEventListener('change', mark);
        // "ملف" / "صورة": نفس الخانة بنوع مختلف (accept) عشان الموبايل يفتح المستندات أو معرض الصور
        form.querySelectorAll('[data-cv-pick]').forEach(function (button) {
            button.addEventListener('click', function () {
                if (!input) return;
                input.setAttribute('accept', button.getAttribute('data-accept'));
                input.click();
            });
        });
        if (label && input) label.addEventListener('click', function () { input.click(); });
        if (input) input.addEventListener('change', function () {
            var file = input.files && input.files[0];
            label.textContent = file ? file.name : label.getAttribute('data-label');
            label.classList.toggle('text-shary-navy', !!file);
            input.closest('.req-field').classList.remove('is-invalid');
        });
        form.addEventListener('input', function (event) {
            var box = event.target.closest ? event.target.closest('.req-field') : null;
            if (box) box.classList.remove('is-invalid');
            if (error) error.classList.add('hidden');
        });

        form.addEventListener('submit', function (event) {
            var name = form.querySelector('input[name="name"]');
            var phone = form.querySelector('input[name="phone"]');
            var bad = [];
            if (name.value.trim().length < 2) bad.push(name);
            if (phone.value.replace(/\D/g, '').length < 6) bad.push(phone);
            if (input && !(input.files && input.files.length)) bad.push(input);
            [name, phone, input].forEach(function (field) { if (field) field.closest('.req-field').classList.toggle('is-invalid', bad.indexOf(field) !== -1); });
            if (bad.length) {
                event.preventDefault();
                if (error) error.classList.remove('hidden');
                return;
            }
            var go = form.dispatchEvent(new CustomEvent('shary:career-apply', {
                bubbles: true,
                cancelable: true,
                detail: {
                    data: new FormData(form),
                    done: function () { body.classList.add('hidden'); done.classList.remove('hidden'); done.classList.add('flex'); },
                    fail: function (message) { if (error) { if (message) error.textContent = message; error.classList.remove('hidden'); } }
                }
            }));
            if (!go) event.preventDefault();
        });

        var again = form.querySelector('[data-career-again]');
        if (again) again.addEventListener('click', function () {
            form.reset();
            mark();
            if (label) { label.textContent = label.getAttribute('data-label'); label.classList.remove('text-shary-navy'); }
            done.classList.add('hidden'); done.classList.remove('flex');
            body.classList.remove('hidden');
        });
    });
})();
