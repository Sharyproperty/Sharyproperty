/**
 * الفلاتر من غير تحميل الصفحة — في كل صفحة فيها فورم فلاتر (js/shary/area-page.js): البحث ، الإيجار ، المنطقة ، المطور ، صفحات "عرض الكل".
 *
 * area-page.js بيطلع حدث shary:filter على الفورم قبل ما يبعته. السكربت ده بيسمع الحدث ، وبدل ما الصفحة كلها تتحمل:
 *   1) بيطلب نفس لينك الفورم (GET — نفس اللينك اللي الفورم كان هيفتحه ، والسيرفر بيرجّع نفس الصفحة متفلترة).
 *   2) بيبدّل الكروت مكانها ([data-results] / [data-projects-grid]) + العدد + رسالة "مفيش نتايج" + العنوان + مسار الصفحة + لينك الصفحة اللي بعدها.
 *   3) بيحدّث لينك المتصفح (pushState) — فاللينك يتشيّر ويفتح على نفس الفلاتر ، وزرار الرجوع بيرجّع الصفحة اللي قبلها.
 * التبويب أو الاختيار اللي العميل ضغط عليه بيفضل متعلّم زي ما هو (مفيش رجوع لـ "الكل" وبعدين للاختيار).
 * لو الطلب فشل أو شكل الصفحة الراجعة مختلف: الفورم بيتبعت عادي (تحميل كامل) — يعني مفيش حالة الفلتر ما يشتغلش فيها.
 * السيرفر مش محتاج endpoint جديد. امنعوا shary:filter (preventDefault) قبل السكربت ده لو هتجيبوا النتايج بطريقتكم.
 */
(function () {
    if (!window.fetch || !window.DOMParser || !window.URLSearchParams || !window.history || !history.pushState) return;

    var GRID = '[data-results], [data-projects-grid]';
    var REGIONS = ['[data-results-count]', '[data-collection-count]', '[data-results-empty]', '[data-breadcrumb]', 'h1', '[data-live-region]'];
    var used = false;   // اتعمل فلتر من غير تحميل: زرار الرجوع بيحمّل الصفحة من الأول
    var shown = '';     // لينك النتايج المعروضة دلوقتي (من غير #)
    function bare(url) { return String(url || '').split('#')[0]; }
    var run = 0;        // آخر طلب بس هو اللي بيتطبق

    function all(scope, selector) { return Array.prototype.slice.call(scope.querySelectorAll(selector)); }

    // نفس اللينك اللي الفورم كان هيفتحه — من غير الخانات الفاضية
    function urlOf(form) {
        var params = new URLSearchParams();
        new FormData(form).forEach(function (value, name) { if (typeof value === 'string' && value !== '') params.append(name, value); });
        var action = form.getAttribute('action') || window.location.pathname;
        var base = new URL(action, window.location.href);
        base.search = params.toString();
        base.hash = '';
        return base.toString();
    }

    function apply(page, url) {
        var grids = all(document, GRID), incoming = all(page, GRID);
        if (!grids.length || grids.length !== incoming.length) return false;
        for (var i = 0; i < grids.length; i++) { if (grids[i].tagName !== incoming[i].tagName) return false; }

        grids.forEach(function (grid, index) {
            var next = incoming[index];
            grid.className = next.className;
            grid.textContent = '';
            all(next, ':scope > *').forEach(function (node) { grid.appendChild(document.importNode(node, true)); });
            if (window.SharyCards) window.SharyCards.refresh(grid);

            // لينك الصفحة اللي بعدها: صفحة البحث ([data-infinite]) أو باقي القوايم ([data-pagination])
            var box = grid.parentNode, nextBox = next.parentNode;
            var sentinel = box.querySelector('[data-infinite]'), nextSentinel = nextBox.querySelector('[data-infinite]');
            if (sentinel) sentinel.dispatchEvent(new CustomEvent('shary:infinite-reset', { detail: { nextUrl: nextSentinel ? nextSentinel.getAttribute('data-next-url') || '' : '' } }));
            var holder = grid.closest('section') || box, nextHolder = next.closest('section') || nextBox;
            var nav = holder.querySelector('[data-pagination]'), nextNav = nextHolder.querySelector('[data-pagination]');
            if (nav) {
                nav.innerHTML = nextNav ? nextNav.innerHTML : '';
                nav.setAttribute('data-next-url', nextNav ? nextNav.getAttribute('data-next-url') || '' : '');
            }
            grid.dispatchEvent(new CustomEvent('shary:list-replaced', { bubbles: true }));
        });

        REGIONS.forEach(function (selector) {
            var now = all(document, selector), then = all(page, selector);
            if (!now.length || now.length !== then.length) return;
            now.forEach(function (node, index) {
                if (node.closest('[data-app-popup], [data-ai-panel]')) return;
                if (node.innerHTML !== then[index].innerHTML) node.innerHTML = then[index].innerHTML;
                node.classList.toggle('hidden', then[index].classList.contains('hidden'));
            });
        });

        if (page.title) document.title = page.title;
        ['canonical'].forEach(function (rel) {
            var link = document.querySelector('link[rel="' + rel + '"]'), next = page.querySelector('link[rel="' + rel + '"]');
            if (link && next) link.setAttribute('href', next.getAttribute('href') || '');
        });
        // زرار اللغة: نفس الصفحة بنفس الفلاتر باللغة التانية
        all(document, '[data-lang-toggle]').forEach(function (toggle, index) {
            var next = all(page, '[data-lang-toggle]')[index];
            if (next && next.getAttribute('href')) toggle.setAttribute('href', next.getAttribute('href'));
        });
        history.pushState({ sharyFilter: true }, '', url);
        used = true;
        shown = bare(window.location.href);

        // لو أول الكروت طالع فوق الشاشة ننزّل لها بهدوء — من غير ما نرجع لأول الصفحة
        var top = grids[0].getBoundingClientRect().top;
        if (top < 60) window.scrollTo({ top: window.pageYOffset + top - 130, behavior: 'smooth' });
        return true;
    }

    document.addEventListener('shary:filter', function (event) {
        var form = event.target;
        if (event.defaultPrevented || !form || form.tagName !== 'FORM') return;
        if ((form.getAttribute('method') || 'get').toLowerCase() !== 'get') return;
        var grids = all(document, GRID);
        if (!grids.length) return;   // الفورم ده بيفتح صفحة تانية (نافذة الفلتر في الرئيسية / صفحة المشروع): يتبعت عادي
        if (form.closest('[data-home-filter]')) return;

        var url = urlOf(form);
        event.preventDefault();
        var mine = ++run;
        grids.forEach(function (grid) { grid.classList.add('listing-loading'); grid.setAttribute('aria-busy', 'true'); });
        function done() { grids.forEach(function (grid) { grid.classList.remove('listing-loading'); grid.removeAttribute('aria-busy'); }); }

        // الصفحة كاملة (من غير X-Requested-With): صفحة البحث بترجّع الكروت بس للطلبات اللي عليها الهيدر ده — وإحنا محتاجين العدد والعنوان ولينك الصفحة اللي بعدها
        fetch(url, { headers: { 'Accept': 'text/html' }, credentials: 'same-origin' })
            .then(function (response) {
                if (!response.ok) throw new Error(response.status);
                return response.text().then(function (html) { return { html: html, url: response.url || url }; });
            })
            .then(function (result) {
                if (mine !== run) return;
                var page = new DOMParser().parseFromString(result.html, 'text/html');
                done();
                if (!apply(page, result.url)) window.location.href = url;
                else form.dispatchEvent(new CustomEvent('shary:filter-applied', { bubbles: true, detail: { url: result.url } }));
            })
            .catch(function () { if (mine === run) window.location.href = url; });
    });

    // زرار الرجوع بعد فلتر من غير تحميل: الصفحة بتتحمل على اللينك اللي رجع له (الاختيارات بترجع مظبوطة من السيرفر)
    // (لوحات الفلتر نفسها بتضيف خطوة في تاريخ المتصفح وبتشيلها لما تتقفل — دي بتفضل على نفس اللينك وما بتتحسبش رجوع)
    window.addEventListener('popstate', function () { if (used && bare(window.location.href) !== shown) window.location.reload(); });
})();
