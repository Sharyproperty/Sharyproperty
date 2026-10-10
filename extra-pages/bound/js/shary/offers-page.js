/**
 * صفحة العروض الحصرية (resources/views/offers/index.blade.php)
 * الفلتر [data-offers-filter] فورم GET: المنطقة / المطور / العرض — التلاتة اختيار متعدد (area[] / developer[] / offer[]). القوايم نفسها من js/shary/form-select.js.
 * - تغيير أي اختيار بيطلع حدث shary:offers-filter على الفورم، وزرار "تطبيق" بيختفي:
 *       form.addEventListener('shary:offers-filter', function (event) {
 *           event.preventDefault();          // هنجيب النتايج AJAX ونبدّل الكروت بنفسنا
 *           // event.detail = { area: ['new-cairo'], developer: ['lavista'], offer: ['dp-5', 'cash'] }
 *       });
 *   لو الحدث ما اتمنعش الفورم بيتبعت عادي والصفحة بترجع متفلترة من السيرفر (العرض المتعدد بيتبعت لما قايمته تتقفل عشان العميل يختار أكتر من عرض).
 * - زرار "مسح" [data-offers-reset]: بيرجّع الفلاتر التلاتة للكل (نفس الحدث بقيم فاضية) — ولو الحدث ما اتمنعش بيفتح لينك الصفحة من غير فلتر.
 */
(function () {
    document.querySelectorAll('[data-offers-filter]').forEach(function (form) {
        var apply = form.querySelector('[data-offers-apply]');
        var reset = form.querySelector('[data-offers-reset]');
        var selects = Array.prototype.slice.call(form.querySelectorAll('select'));
        var silent = false, pending = false;
        if (apply) apply.classList.add('hidden');
        form.classList.add('is-live');

        function values() {
            var detail = {};
            selects.forEach(function (select) {
                var name = select.name.replace(/\[\]$/, '');
                detail[name] = select.multiple ? Array.prototype.filter.call(select.options, function (o) { return o.selected && o.value; }).map(function (o) { return o.value; }) : select.value;
            });
            return detail;
        }

        function mark(detail) {
            var active = Object.keys(detail).some(function (key) { return detail[key] && detail[key].length; });
            if (reset) reset.classList.toggle('is-active', active);
        }

        function send(event) {
            if (silent) return;
            if (event && event.type === 'submit') event.preventDefault();
            var detail = values();
            mark(detail);
            var go = form.dispatchEvent(new CustomEvent('shary:offers-filter', { bubbles: true, cancelable: true, detail: detail }));
            if (!go) return;
            // من غير AJAX: الاختيار المتعدد بيتبعت لما القايمة تتقفل
            if (event && event.target && event.target.multiple && form.querySelector('[data-select].is-open')) { pending = true; return; }
            form.submit();
        }

        form.addEventListener('change', send);
        form.addEventListener('submit', send);
        form.addEventListener('shary:select-close', function () { if (pending) { pending = false; form.submit(); } });

        if (reset) reset.addEventListener('click', function (event) {
            silent = true;
            selects.forEach(function (select) {
                if (select.multiple) Array.prototype.forEach.call(select.options, function (o) { o.selected = false; }); else select.value = '';
                select.dispatchEvent(new Event('change', { bubbles: true }));   // زرار القايمة بيتحدّث
            });
            silent = false;
            var detail = values();
            mark(detail);
            var go = form.dispatchEvent(new CustomEvent('shary:offers-filter', { bubbles: true, cancelable: true, detail: detail }));
            if (!go) event.preventDefault();   // AJAX: من غير تحميل. غير كده اللينك بيفتح الصفحة من غير فلتر
        });
    });
})();
