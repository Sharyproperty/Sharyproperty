/**
 * الهيدر والفوتر:
 * - زرار القائمة في الموبايل بيفتح ويقفل روابط الهيدر.
 * - مجموعات الفوتر في الموبايل بتفتح وتقفل (في الديسك توب مفتوحة دايمًا من الـ CSS).
 * - رابط له قايمة فرعية في الهيدر (زي "الوكلاء" ← "الوكلاء المعتمدون"): الضغط بيفتح القايمة ويقفلها،
 *   وبتتقفل لما تضغط براها أو تدوس Esc.
 */
(function () {
    document.querySelectorAll('[data-nav-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
            var nav = document.getElementById(button.getAttribute('aria-controls'));
            if (!nav) return;
            var isOpen = !nav.classList.toggle('hidden');
            button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    });

    document.querySelectorAll('[data-footer-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
            var list = button.nextElementSibling;
            if (!list) return;
            var isOpen = !list.classList.toggle('hidden');
            list.classList.toggle('flex', isOpen);
            button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    });
    var dropdowns = Array.prototype.slice.call(document.querySelectorAll('[data-nav-dropdown]'));

    function setDropdown(dropdown, open) {
        var toggle = dropdown.querySelector('[data-nav-dropdown-toggle]');
        var menu = dropdown.querySelector('[data-nav-dropdown-menu]');
        if (!toggle || !menu) return;
        menu.classList.toggle('hidden', !open);
        menu.classList.toggle('flex', open && menu.classList.contains('flex-col'));
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        var arrow = toggle.querySelector('svg');
        if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
    }

    dropdowns.forEach(function (dropdown) {
        var toggle = dropdown.querySelector('[data-nav-dropdown-toggle]');
        if (!toggle) return;
        toggle.addEventListener('click', function () {
            var open = toggle.getAttribute('aria-expanded') !== 'true';
            dropdowns.forEach(function (other) { setDropdown(other, other === dropdown && open); });
        });
        dropdown.querySelectorAll('[data-nav-dropdown-menu] a').forEach(function (link) {
            link.addEventListener('click', function () { setDropdown(dropdown, false); });
        });
    });

    document.addEventListener('click', function (event) {
        dropdowns.forEach(function (dropdown) {
            if (!dropdown.contains(event.target)) setDropdown(dropdown, false);
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') dropdowns.forEach(function (dropdown) { setDropdown(dropdown, false); });
    });
})();
