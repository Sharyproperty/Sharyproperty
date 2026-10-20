/**
 * فورم الوحدة: خطط السداد (تواريخ العرض والخطة الأساسية)
 * الصفحة: resources/views/shary_admin/units/form.blade.php
 */
// «خطط السداد»: تواريخ العرض بتظهر لما الخطة «عرض» ، و«اجعلها الأساسية» بتبدّل أرقام الخطة دي مع الخطة الأساسية (بتتحفظ مع الوحدة)
(function () {
    function syncDates(scope) {
        scope.querySelectorAll('[data-plan-offer]').forEach(function (select) {
            var box = select.closest('[data-more-plan]') || select.closest('[data-plan-fields]') || select.closest('.card-body');
            var dates = select.closest('[data-more-plan]') ? box.querySelectorAll('[data-plan-offer-dates]') : document.querySelectorAll('.card-body > .row > [data-plan-offer-dates]');
            dates.forEach(function (d) { d.hidden = select.value !== '1'; });
        });
    }
    document.addEventListener('change', function (event) { if (event.target.matches('[data-plan-offer]')) syncDates(document); });
    syncDates(document);
    var MAP = { down_payment: 'down_payment', installment_years: 'installment_years', monthly_amount: 'monthly_amount', payment_frequency: 'payment_frequency', discount: 'plan_discount', offer: 'plan_offer', offer_from: 'plan_offer_from', offer_to: 'plan_offer_to' };
    document.addEventListener('click', function (event) {
        var button = event.target.closest('[data-make-primary]');
        if (!button) return;
        var row = button.closest('[data-more-plan]'), form = button.closest('form');
        Object.keys(MAP).forEach(function (key) {
            var mine = row.querySelector('[name$="[' + key + ']"]'), main = form.querySelector('[name="' + MAP[key] + '"]');
            if (!mine || !main) return;
            var a = mine.value; mine.value = main.value; main.value = a;
            main.dispatchEvent(new Event('input', { bubbles: true })); main.dispatchEvent(new Event('change', { bubbles: true }));
        });
        syncDates(document);
        var top = form.querySelector('.sx-plan-primary');
        if (top) { top.classList.add('is-flash'); setTimeout(function () { top.classList.remove('is-flash'); }, 1200); top.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    });
})();
