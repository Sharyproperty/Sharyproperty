/**
 * صفحة الدولة في "عقارات دولية" (abroad/country.blade.php):
 * اختيار منطقة [data-abroad-area="slug"] (كارت المنطقة أو الشريط فوق "كل المشاريع" — "" = كل المناطق) بيعرض مشاريع المنطقة دي بس
 * [data-abroad-project][data-area] من غير تحميل: العنوان [data-abroad-title] ، النبذة [data-abroad-area-text] ، العدد [data-abroad-count] ،
 * واللينك في المتصفح بيبقى /properties-abroad/{country}/{area}. من غير السكربت اللينك نفسه بيفتح الصفحة متفلترة من السيرفر.
 * من أي كود: window.SharyAbroad.area('dubai-marina')
 */
(function () {
    var pages = document.querySelectorAll('[data-abroad-page][data-country]');
    var api = { area: function () {} };

    pages.forEach(function (page) {
        var projects = Array.prototype.slice.call(page.querySelectorAll('[data-abroad-project]'));
        var picks = Array.prototype.slice.call(page.querySelectorAll('[data-abroad-area]'));
        var title = page.querySelector('[data-abroad-title]');
        var text = page.querySelector('[data-abroad-area-text]');
        var count = page.querySelector('[data-abroad-count]');
        var empty = page.querySelector('[data-abroad-empty]');
        var section = (title && title.closest('section')) || page;
        if (!projects.length) return;

        function choose(area, scroll) {
            var shown = 0, pick = null;
            projects.forEach(function (card) {
                var on = !area || card.getAttribute('data-area') === area;
                card.classList.toggle('hidden', !on);
                if (on) shown++;
            });
            picks.forEach(function (item) {
                var on = item.getAttribute('data-abroad-area') === area;
                item.setAttribute('aria-pressed', on ? 'true' : 'false');
                if (on && item.getAttribute('data-name')) pick = item;
            });
            if (title) title.textContent = pick ? page.getAttribute('data-title-area').replace(':name', pick.getAttribute('data-name')) : page.getAttribute('data-title-all');
            if (text) { text.textContent = pick ? pick.getAttribute('data-text') || '' : ''; text.classList.toggle('hidden', !pick || !text.textContent); }
            if (count) count.textContent = shown;
            if (empty) empty.classList.toggle('hidden', shown > 0);
            page.setAttribute('data-area', area);
            if (scroll) window.setTimeout(function () { section.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
        }

        picks.forEach(function (item) {
            item.addEventListener('click', function (event) {
                event.preventDefault();
                var area = item.getAttribute('data-abroad-area') || '';
                choose(area, true);
                // لينك نضيف في المتصفح (السيو والمشاركة) — المعاينة / الملفات المحلية من غير تغيير اللينك
                if (window.history && window.history.replaceState && /^https?:/.test(window.location.protocol) && !document.querySelector('[data-view]')) {
                    try { window.history.replaceState(null, '', item.getAttribute('href').replace(/#.*$/, '')); } catch (error) { /* اللينك زي ما هو */ }
                }
            });
        });
        api.area = function (area) { choose(area || '', true); };
    });

    window.SharyAbroad = api;
})();
