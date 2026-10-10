/**
 * صفحة المدونة — موبايل وديسك توب: من غير أرقام صفحات.
 * لما المستخدم يوصل لآخر المقالات بتتحمل الصفحة التالية وتتضاف تحتها تلقائي (زي صفحة البحث).
 * بيعتمد على لينك الصفحة التالية الموجود في data-next-url على عنصر ترقيم الصفحات [data-pagination] (العنصر نفسه مخفي).
 * حدث shary:load-more ({ url, append(nodes, nextUrl) }) على [data-articles-grid]: امنعوه لو هتجيبوا المقالات بطريقتكم ونادوا append.
 */
(function () {
    if (!window.fetch || !('IntersectionObserver' in window)) return;
    var separator = ['mt-7', 'border-t', 'border-shary-line', 'pt-7', 'md:mt-0', 'md:border-t-0', 'md:pt-0'];

    function usable(url) { return !!url && url.charAt(0) !== '#'; }

    Array.prototype.forEach.call(document.querySelectorAll('[data-articles-grid]'), function (grid, gridIndex) {
        var pager = grid.parentNode.querySelector('[data-pagination]');
        if (!pager) return;
        var next = pager.getAttribute('data-next-url') || '';
        if (!usable(next)) return;
        var loading = false;

        var sentinel = document.createElement('div');
        sentinel.setAttribute('aria-hidden', 'true');
        grid.insertAdjacentElement('afterend', sentinel);

        function append(nodes, nextUrl) {
            Array.prototype.slice.call(nodes || []).forEach(function (item) {
                var card = item.ownerDocument === document ? item : document.importNode(item, true);
                separator.forEach(function (name) { card.classList.add(name); });
                grid.appendChild(card);
            });
            next = nextUrl || '';
            loading = false;
            if (!usable(next)) observer.disconnect();
        }

        var observer = new IntersectionObserver(function (entries) {
            if (!entries[0].isIntersecting || loading) return;
            loading = true;
            var detail = { url: next, append: append };
            if (!grid.dispatchEvent(new CustomEvent('shary:load-more', { bubbles: true, cancelable: true, detail: detail }))) return;

            fetch(next, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                .then(function (response) { return response.ok ? response.text() : Promise.reject(); })
                .then(function (html) {
                    var page = new DOMParser().parseFromString(html, 'text/html');
                    var more = page.querySelectorAll('[data-articles-grid]')[gridIndex];
                    var nextPager = more ? more.parentNode.querySelector('[data-pagination]') : null;
                    append(more ? more.children : [], nextPager ? nextPager.getAttribute('data-next-url') || '' : '');
                })
                .catch(function () { observer.disconnect(); });
        }, { rootMargin: '400px' });

        observer.observe(sentinel);
    });
})();
