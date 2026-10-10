/**
 * فورم الخطوات [data-steps-form] — صفحة "بيع عقارك" وصفحة "أجّر عقارك" (resources/views/requests/property.blade.php)
 * - كل خطوة [data-step]: السكربت بيظهر خطوة واحدة، و"التالي" [data-steps-next] / "السابق" [data-steps-prev] بيبدّلوا بينهم.
 *   في آخر خطوة بيظهر زرار الإرسال [data-steps-submit] مكان "التالي".
 * - قبل "التالي" والإرسال: الخانات المطلوبة (required) في الخطوة الحالية لازم تتملى — الناقصة بتتعلّم (is-invalid) وبتظهر رسالة [data-steps-error].
 * - الدواير [data-step-dot]: data-state = done | current | todo.
 * - الصور [data-file-input]: المختار بيظهر مصغّر تحت الخانة وعلى كل واحدة X بتشيلها.
 * - الإرسال: بيطلع حدث shary:property-request على الفورم:
 *       form.addEventListener('shary:property-request', function (event) {
 *           event.preventDefault();                 // هنبعت AJAX
 *           // event.detail = { data: FormData, done(), fail(message) }
 *           fetch(form.action, { method: 'POST', body: event.detail.data }).then(event.detail.done, function () { event.detail.fail(); });
 *       });
 *   لو الحدث ما اتمنعش الفورم بيتبعت عادي (POST) والسيرفر يرجّع صفحة / رسالة النجاح. done() بتظهر [data-steps-done] مكان الفورم.
 * من غير السكربت: كل الخطوات ظاهرة تحت بعض وزرار الإرسال شغال.
 */
(function () {
    document.querySelectorAll('[data-steps-form]').forEach(function (form) {
        var steps = Array.prototype.slice.call(form.querySelectorAll('[data-step]'));
        if (!steps.length) return;
        var dots = Array.prototype.slice.call(form.querySelectorAll('[data-step-dot]'));
        var prev = form.querySelector('[data-steps-prev]');
        var next = form.querySelector('[data-steps-next]');
        var submit = form.querySelector('[data-steps-submit]');
        var error = form.querySelector('[data-steps-error]');
        var body = form.querySelector('[data-steps-body]');
        var done = form.querySelector('[data-steps-done]');
        var current = 0;

        function show(index, scroll) {
            current = Math.max(0, Math.min(steps.length - 1, index));
            steps.forEach(function (step, i) {
                step.classList.toggle('hidden', i !== current);
                step.classList.remove('mt-8');
            });
            dots.forEach(function (dot, i) { dot.setAttribute('data-state', i < current ? 'done' : i === current ? 'current' : 'todo'); });
            var last = current === steps.length - 1;
            prev.classList.toggle('hidden', current === 0);
            next.classList.toggle('hidden', last);
            submit.classList.toggle('hidden', !last);
            // أول خطوة: "التالي" بعرض الصف كله. الباقي: السابق + التالي / الإرسال
            next.classList.toggle('col-span-2', current === 0);
            submit.classList.toggle('col-span-2', current === 0);
            if (error) error.classList.add('hidden');
            if (scroll) {
                var top = form.getBoundingClientRect().top + window.pageYOffset - 96;
                if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: 'smooth' });
            }
        }

        // الخانات المطلوبة في الخطوة: الفاضية بتتعلّم
        function valid(step) {
            var ok = true;
            Array.prototype.forEach.call(step.querySelectorAll('[required]'), function (field) {
                var value = String(field.value || '').trim();
                var bad = !value || (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(value)) || (field.type === 'tel' && value.replace(/\D/g, '').length < 6);
                // القايمة اللي بالصور (form-select.js): العلامة على الزرار الظاهر مش على القايمة الأصلية المخفية
                var custom = field.closest('[data-select]');
                var box = (custom && custom.querySelector('[data-select-toggle]:not(.hidden)')) || field.closest('.req-field') || field;
                box.classList.toggle('is-invalid', bad);
                if (bad && ok) field.focus();
                if (bad) ok = false;
            });
            // البريد اختياري، لكن لو اتكتب لازم يبقى صح
            Array.prototype.forEach.call(step.querySelectorAll('input[type="email"]:not([required])'), function (field) {
                var value = String(field.value || '').trim();
                var bad = !!value && !/^\S+@\S+\.\S+$/.test(value);
                field.closest('.req-field').classList.toggle('is-invalid', bad);
                if (bad) ok = false;
            });
            if (error) error.classList.toggle('hidden', ok);
            return ok;
        }

        form.addEventListener('input', function (event) {
            var box = event.target.closest ? event.target.closest('.req-field') : null;
            if (box) box.classList.remove('is-invalid');
            if (event.target.hasAttribute && event.target.hasAttribute('data-number')) event.target.value = event.target.value.replace(/[^\d.,]/g, '');   // خانات الأرقام: أرقام بس
        });
        form.addEventListener('change', function (event) {
            var box = event.target.closest ? event.target.closest('.req-field') : null;
            if (box) box.classList.remove('is-invalid');
            if (event.target.tagName === 'SELECT') event.target.classList.toggle('has-value', !!event.target.value);
        });

        next.addEventListener('click', function () { if (valid(steps[current])) show(current + 1, true); });
        prev.addEventListener('click', function () { show(current - 1, true); });

        // ---- الصور: مصغّرات تحت الخانة + X
        Array.prototype.forEach.call(form.querySelectorAll('[data-file-input]'), function (input) {
            var holder = input.closest('[data-field]');
            var label = holder.querySelector('[data-file-label]');
            var previews = holder.querySelector('[data-file-previews]');
            var files = [];
            function sync() {
                if (window.DataTransfer) {
                    try { var bag = new DataTransfer(); files.forEach(function (file) { bag.items.add(file); }); input.files = bag.files; } catch (e) { /* متصفح قديم: الملفات زي ما اختارها */ }
                }
                label.textContent = files.length ? files.length + ' ' + label.getAttribute('data-count') : label.getAttribute('data-label');
                label.classList.toggle('text-shary-navy', files.length > 0);
                if (files.length) input.closest('.req-field').classList.remove('is-invalid');
                previews.textContent = '';
                previews.classList.toggle('hidden', files.length === 0);
                previews.classList.toggle('flex', files.length > 0);
                files.forEach(function (file, index) {
                    var item = document.createElement('div');
                    item.className = 'req-thumb';
                    if (/^image\//.test(file.type) && window.URL) {
                        var img = document.createElement('img');
                        img.src = URL.createObjectURL(file);
                        img.alt = file.name;
                        item.appendChild(img);
                    } else if (/^video\//.test(file.type) && window.URL) {
                        // فيديو: أول لقطة منه + علامة تشغيل
                        var clip = document.createElement('video');
                        clip.src = URL.createObjectURL(file) + '#t=0.1';
                        clip.muted = true; clip.preload = 'metadata'; clip.setAttribute('playsinline', '');
                        item.classList.add('req-thumb--video');
                        item.appendChild(clip);
                    } else {
                        var name = document.createElement('span');
                        name.textContent = file.name;
                        item.appendChild(name);
                    }
                    var remove = document.createElement('button');
                    remove.type = 'button';
                    remove.setAttribute('aria-label', previews.getAttribute('data-remove-label') || 'Remove');
                    remove.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
                    remove.addEventListener('click', function () { files.splice(index, 1); sync(); });
                    item.appendChild(remove);
                    previews.appendChild(item);
                });
            }
            input.addEventListener('change', function () {
                files = files.concat(Array.prototype.slice.call(input.files || []));
                sync();
            });
            form.addEventListener('reset', function () { files = []; setTimeout(sync, 0); });
        });

        function finish() {
            if (body) body.classList.add('hidden');
            if (done) { done.classList.remove('hidden'); done.classList.add('flex'); }
            var top = form.getBoundingClientRect().top + window.pageYOffset - 96;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }

        form.addEventListener('submit', function (event) {
            // لازم كل الخطوات تبقى سليمة (لو العميل رجع لخطوة قديمة وفضّى خانة)
            for (var i = 0; i < steps.length; i++) {
                if (!valid(steps[i])) { event.preventDefault(); show(i, true); valid(steps[i]); return; }
            }
            var go = form.dispatchEvent(new CustomEvent('shary:property-request', {
                bubbles: true,
                cancelable: true,
                detail: { data: new FormData(form), done: finish, fail: function (message) { if (error) { if (message) error.textContent = message; error.classList.remove('hidden'); } } }
            }));
            if (!go) event.preventDefault();   // الإرسال هيتم من اللي سمع الحدث (AJAX) وينادي done()
        });

        // التاريخ بطريقتين: العميل يكتبه بإيده في الخانة ، أو يضغط على النتيجة ويختار — واللي يختاره بيتكتب في الخانة (يوم/شهر/سنة)
        Array.prototype.forEach.call(form.querySelectorAll('[data-date-native]'), function (native) {
            var label = native.closest('label');
            var text = label ? label.querySelector('[data-date-text]') : null;
            if (!text) return;
            native.addEventListener('change', function () {
                var parts = String(native.value || '').split('-');
                if (parts.length !== 3) return;
                text.value = parts[2] + '/' + parts[1] + '/' + parts[0];
                text.dispatchEvent(new Event('input', { bubbles: true }));
            });
            // الضغط على النتيجة بيفتح اختيار التاريخ (مش بيحط المؤشر في خانة الكتابة)
            native.parentNode.addEventListener('click', function (event) {
                event.preventDefault();
                try { if (native.showPicker) native.showPicker(); else native.focus(); } catch (error) { native.focus(); }
            });
            // الكتابة: أرقام وبينهم / لوحدها (15032027 ← 15/03/2027)
            text.addEventListener('input', function (event) {
                if (event.isTrusted === false) return;
                var digits = text.value.replace(/[٠-٩]/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(d); });
                if (/^\d{3,8}$/.test(digits)) text.value = digits.slice(0, 2) + '/' + (digits.length > 4 ? digits.slice(2, 4) + '/' + digits.slice(4) : digits.slice(2));
                else if (digits !== text.value) text.value = digits;
            });
        });
        // اختيارات جاهزة تحت خانة الكتابة (datalist — سنة التسليم): الخانة بتتربط بالقايمة اللي جنبها حتى لو الـ id اتغيّر
        Array.prototype.forEach.call(form.querySelectorAll('input[list]'), function (input) {
            var holder = input.closest('[data-field]');
            var options = holder ? holder.querySelector('datalist') : null;
            if (options && options.id && options.id !== input.getAttribute('list')) input.setAttribute('list', options.id);
        });
        // "اكتبه بنفسك" في القايمة (other): بيظهر خانة كتابة تحتها — العميل يختار من القايمة أو يكتب بإيده
        Array.prototype.forEach.call(form.querySelectorAll('[data-select-other]'), function (box) {
            var holder = box.closest('[data-select]');
            var select = holder ? holder.querySelector('select') : null;
            if (!select) return;
            function sync(focus) {
                var on = select.value === 'other';
                box.classList.toggle('hidden', !on);
                if (on && focus === true) { var input = box.querySelector('input'); if (input) input.focus(); }
            }
            select.addEventListener('change', function () { sync(true); });
            form.addEventListener('reset', function () { window.setTimeout(sync, 0); });
            sync();
        });

        var again = form.querySelector('[data-steps-again]');
        if (again) again.addEventListener('click', function () {
            form.reset();
            Array.prototype.forEach.call(form.querySelectorAll('select'), function (select) { select.classList.remove('has-value'); });
            if (done) { done.classList.add('hidden'); done.classList.remove('flex'); }
            if (body) body.classList.remove('hidden');
            show(0, true);
        });

        show(0, false);
    });
})();
