/**
 * صفحة المطور (developers/show.blade.php)
 * - "عرض الكل / عرض أقل" في مناطق المطور: بيفرد المناطق كلها بدل السحب الأفقي.
 * - "عرض أقل / عرض المزيد" في "عن المطور" بقى في js/shary/site-chrome.js (مشترك لكل الصفحات).
 * - "عرض المزيد" تحت المشاريع (موبايل): بيظهر 3 مشاريع كمان كل مرة.
 */
(function () {
    document.querySelectorAll('[data-dev-areas]').forEach(function (section) {
        var toggle = section.querySelector('[data-dev-areas-toggle]');
        var list = section.querySelector('[data-dev-areas-list]');
        if (!toggle || !list) return;
        toggle.addEventListener('click', function () {
            var open = !list.classList.contains('is-open');
            list.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.querySelector('[data-label]').textContent = toggle.getAttribute(open ? 'data-less' : 'data-more');
            toggle.querySelector('svg').style.transform = open ? 'rotate(180deg)' : '';
        });
    });
})();
