/**
 * قوايم الكروت في الموقع كله (مشاريع المنطقة / مشاريع المطور / الإيجار / العروض / التريندي / القوايم الجاهزة):
 *
 * من غير أرقام صفحات ولا "عرض المزيد" — موبايل وديسك توب: القايمة بتكمّل لوحدها وأنت نازل (زي صفحة البحث).
 *   - القايمة اللي عليها data-auto-more="3": شغالة على الموبايل والديسك توب.
 *     موبايل: الأول بتظهر الكروت المتحملة والمخفية على الموبايل (class="hidden lg:block") 3 بـ 3 ، وبعدها بتطلب الصفحة اللي بعدها.
 *     ديسك توب: كروت الصفحة الأولى كلها ظاهرة ، ولما العميل ينزل بتطلب الصفحة اللي بعدها وتضيف كروتها تحت.
 *   - القايمة اللي عليها data-auto-desktop (مشاريع المنطقة): ديسك توب بس (الموبايل عليه زرار "شوف الكل").
 *   لينك الصفحة اللي بعدها: data-next-url على [data-pagination] (أرقام الصفحات نفسها مخفية — blog/partials/pagination).
 *   حدث shary:load-more ({ url, append(nodes, nextUrl) }): امنعوه لو هتجيبوا الكروت بطريقتكم ونادوا append.
 *   العنصر [data-auto-sentinel] تحت القايمة: data-state="idle | loading | done".
 *
 * (تبديل الصفحات بالأرقام [data-pagination] a لسه مدعوم لو حد رجّع الأرقام ، بس هي مخفية دلوقتي.)
 * (شريط الإعلانات [data-ad-strip] في js/shary/site-chrome.js عشان يشتغل في كل الصفحات.)
 *
 * السيرفر مش محتاج endpoint جديد: نفس الصفحة بـ ?page=N، والسكربت بياخد منها القايمة ولينك اللي بعدها.
 */
(function () {
    if (!window.fetch || !window.DOMParser) return;

    var GRID = '[data-projects-grid], [data-articles-grid], [data-results]';
    var desktop = window.matchMedia('(min-width: 1024px)');

    function usable(url) { return !!url && url.charAt(0) !== '#'; }

    // القايمة اللي تبع أرقام الصفحات دي: أقرب عنصر فوقها جواه قايمة كروت
    function gridOf(nav) {
        var box = nav.parentNode;
        while (box && box.querySelector) {
            var grid = box.querySelector(GRID);
            if (grid) return grid;
            box = box.parentNode;
        }
        return null;
    }

    function navs(doc) { return Array.prototype.slice.call(doc.querySelectorAll('[data-pagination]')); }

    function load(url) {
        return fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then(function (response) { if (!response.ok) throw new Error(response.status); return response.text(); })
            .then(function (html) { return new DOMParser().parseFromString(html, 'text/html'); });
    }

    function copies(grid) {
        return Array.prototype.map.call(grid ? grid.children : [], function (node) { return document.importNode(node, true); });
    }

    // بعد تبديل الكروت: لو أول القايمة فوق الشاشة ننزّلها بهدوء لأول كارت — من غير ما نرجع لأول الصفحة
    function settle(grid) {
        var top = grid.getBoundingClientRect().top;
        if (top < 96) window.scrollTo({ top: window.pageYOffset + top - 120, behavior: 'smooth' });
    }

    // ---------- ديسك توب: تبديل الكروت مكانها ----------
    function swap(nav, url, push) {
        var grid = gridOf(nav);
        if (!grid || grid.__busy) return;
        var index = navs(document).indexOf(nav);
        grid.__busy = true;
        grid.classList.add('listing-loading');

        var detail = {
            url: url,
            replace: function (nodes, paginationHtml, nextUrl) {
                grid.textContent = '';
                Array.prototype.slice.call(nodes || []).forEach(function (node) { grid.appendChild(node); });
                if (typeof paginationHtml === 'string') nav.innerHTML = paginationHtml;
                nav.setAttribute('data-next-url', nextUrl || '');
                if (window.SharyCards) window.SharyCards.refresh(grid);
                grid.__busy = false;
                grid.classList.remove('listing-loading');
                if (push) history.pushState({ sharyListing: true }, '', url);
                settle(grid);
            }
        };
        if (!nav.dispatchEvent(new CustomEvent('shary:page', { bubbles: true, cancelable: true, detail: detail }))) return;

        load(url)
            .then(function (page) {
                var nextNav = navs(page)[index];
                var nextGrid = nextNav ? gridOf(nextNav) : null;
                if (!nextGrid) throw new Error('no list');
                detail.replace(copies(nextGrid), nextNav.innerHTML, nextNav.getAttribute('data-next-url'));
            })
            .catch(function () { window.location.href = url; });
    }

    document.addEventListener('click', function (event) {
        var link = event.target.closest ? event.target.closest('[data-pagination] a[href]') : null;
        if (!link || event.defaultPrevented || !desktop.matches) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;   // فتح في تاب جديد يفضل عادي
        var url = link.getAttribute('href');
        if (!usable(url)) return;
        event.preventDefault();
        swap(link.closest('[data-pagination]'), link.href, true);
    });

    // زرار الرجوع في المتصفح بعد تبديل الصفحات
    window.addEventListener('popstate', function () {
        var nav = navs(document)[0];
        if (nav && desktop.matches && (history.state && history.state.sharyListing || nav.__turned)) swap(nav, window.location.href, false);
    });
    document.addEventListener('shary:page', function (event) { event.target.__turned = true; });

    // ---------- القايمة بتكمّل لوحدها وأنت نازل (موبايل وديسك توب) ----------
    var AUTO = '[data-auto-more], [data-auto-desktop]';
    document.querySelectorAll(AUTO).forEach(function (grid) {
        var mobileToo = grid.hasAttribute('data-auto-more');   // data-auto-desktop لوحدها = ديسك توب بس
        var step = parseInt(grid.getAttribute('data-auto-more'), 10) || 3;
        var box = grid.parentNode;
        var sentinel = box.querySelector('[data-auto-sentinel]');
        if (!sentinel) return;
        var gridIndex = Array.prototype.indexOf.call(document.querySelectorAll(AUTO), grid);
        var busy = false;
        var observer = null;

        function state(name) { sentinel.setAttribute('data-state', name); }
        // الكروت المتحملة والمخفية على الموبايل — على الديسك توب هي ظاهرة أصلًا
        function waiting() { return desktop.matches ? [] : Array.prototype.slice.call(grid.querySelectorAll(':scope > .hidden.lg\\:block')); }
        function nextUrl() { var nav = box.querySelector('[data-pagination]'); return nav ? nav.getAttribute('data-next-url') || '' : ''; }

        function finish() {
            state('done');
            sentinel.classList.add('hidden');
            if (observer) { observer.disconnect(); observer = null; }
        }

        function near() {
            var rect = sentinel.getBoundingClientRect();
            return rect.width + rect.height > 0 && rect.top < window.innerHeight + 300;
        }

        function again() {
            busy = false;
            if (!waiting().length && !usable(nextUrl())) { finish(); return; }
            state('idle');
            setTimeout(function () { if (near()) more(); }, 80);
        }

        function more() {
            if (busy || (!desktop.matches && !mobileToo)) return;
            var hidden = waiting();
            if (hidden.length) {
                busy = true;
                state('loading');
                setTimeout(function () {
                    hidden.slice(0, step).forEach(function (card) { card.classList.remove('hidden', 'lg:block'); });
                    again();
                }, 350);
                return;
            }
            var url = nextUrl();
            if (!usable(url)) { finish(); return; }
            busy = true;
            state('loading');
            var detail = {
                url: url,
                append: function (nodes, next) {
                    Array.prototype.slice.call(nodes || []).forEach(function (node) {
                        node.classList.remove('hidden', 'lg:block');
                        grid.appendChild(node);
                    });
                    var nav = box.querySelector('[data-pagination]');
                    if (nav) nav.setAttribute('data-next-url', next || '');
                    if (window.SharyCards) window.SharyCards.refresh(grid);
                    again();
                }
            };
            if (!grid.dispatchEvent(new CustomEvent('shary:load-more', { bubbles: true, cancelable: true, detail: detail }))) return;
            load(url)
                .then(function (page) {
                    var incoming = page.querySelectorAll(AUTO)[gridIndex];
                    var nav = incoming ? incoming.parentNode.querySelector('[data-pagination]') : null;
                    detail.append(copies(incoming), nav ? nav.getAttribute('data-next-url') : '');
                })
                .catch(function () { busy = false; finish(); });
        }

        if (!waiting().length && !usable(nextUrl())) { finish(); return; }
        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver(function (entries) { if (entries[0].isIntersecting) more(); }, { rootMargin: '300px 0px' });
            observer.observe(sentinel);
        } else {
            window.addEventListener('scroll', function () { if (near()) more(); });
        }
    });
})();
