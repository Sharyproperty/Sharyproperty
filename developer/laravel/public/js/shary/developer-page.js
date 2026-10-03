/**
 * صفحة المطور (developers/show.blade.php)
 * - "عرض الكل / عرض أقل" في مناطق المطور: بيفرد المناطق كلها بدل السحب الأفقي.
 * - "عرض أقل / عرض المزيد" في "عن المطور": النص مفتوح في الأول، والزرار بيقصّره ويفرده.
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

    // النص مفتوح في الأول، والزرار بيقصّره ويفرده
    document.querySelectorAll('[data-collapsible]').forEach(function (box) {
        var toggle = box.parentNode.querySelector('[data-collapsible-toggle]');
        if (!toggle) return;
        toggle.addEventListener('click', function () {
            var collapse = !box.classList.contains('is-collapsed');
            box.classList.toggle('is-collapsed', collapse);
            toggle.setAttribute('aria-expanded', collapse ? 'false' : 'true');
            toggle.textContent = toggle.getAttribute(collapse ? 'data-more' : 'data-less');
            if (collapse) box.scrollIntoView({ block: 'nearest' });
        });
    });

    document.querySelectorAll('[data-more-projects]').forEach(function (button) {
        var grid = button.parentNode.querySelector('[data-projects-grid]');
        if (!grid) return;
        var step = parseInt(button.getAttribute('data-step'), 10) || 3;
        button.addEventListener('click', function () {
            var hidden = Array.prototype.slice.call(grid.querySelectorAll('[data-project].hidden'));
            hidden.slice(0, step).forEach(function (card) { card.classList.remove('hidden', 'lg:block'); });
            if (hidden.length <= step) button.classList.add('hidden');
        });
    });
})();
