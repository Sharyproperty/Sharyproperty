/**
 * صفحة المدونة على الموبايل والتابلت (أقل من 1024px):
 * أرقام الصفحات مخفية، ولما المستخدم يوصل لآخر المقالات بتتحمّل الصفحة التالية وتتضاف تحتها تلقائي.
 * بيعتمد على لينك الصفحة التالية الموجود في data-next-url على عنصر ترقيم الصفحات.
 * على الديسك توب السكربت ما بيعملش حاجة (الأرقام هي اللي شغالة).
 * لو الموقع عنده تحميل تلقائي جاهز، استغنوا عن الملف ده.
 */
(function () {
    var grid = document.querySelector('[data-articles-grid]');
    var pager = document.querySelector('[data-pagination]');
    if (!grid || !pager || !window.fetch || !('IntersectionObserver' in window)) return;

    var next = pager.getAttribute('data-next-url') || '';
    var desktop = window.matchMedia('(min-width: 1024px)');
    var separator = ['mt-7', 'border-t', 'border-shary-line', 'pt-7', 'md:mt-0', 'md:border-t-0', 'md:pt-0'];
    var loading = false;

    function usable(url) {
        return url && url.charAt(0) !== '#';
    }
    if (!usable(next)) return;

    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    grid.insertAdjacentElement('afterend', sentinel);

    var observer = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting || loading || desktop.matches) return;
        loading = true;

        fetch(next, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then(function (response) { return response.ok ? response.text() : Promise.reject(); })
            .then(function (html) {
                var page = new DOMParser().parseFromString(html, 'text/html');
                var more = page.querySelector('[data-articles-grid]');
                var nextPager = page.querySelector('[data-pagination]');

                if (more) {
                    Array.prototype.slice.call(more.children).forEach(function (item) {
                        var card = document.importNode(item, true);
                        separator.forEach(function (name) { card.classList.add(name); });
                        grid.appendChild(card);
                    });
                }

                next = nextPager ? nextPager.getAttribute('data-next-url') || '' : '';
                loading = false;
                if (!usable(next)) observer.disconnect();
            })
            .catch(function () { observer.disconnect(); });
    }, { rootMargin: '400px' });

    observer.observe(sentinel);
})();
