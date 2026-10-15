/**
 * نافذة الفلتر المتقدم بره صفحة البحث ([data-home-filter] — partials/filter-window.blade.php): نفس فورم فلتر صفحة البحث.
 *   - زرار الفلتر جنب خانة البحث [data-filter-modal-open] (المشروع / الوحدة / الفرصة / صفحات "عرض الكل") بيفتح النافذة.
 *   - الرئيسية: "بحث متقدم" (toggleHeroAdvancedSearch) وزرار الفلتر بتاع الموبايل (#openFilters) بيفتحوا نفس النافذة ،
 *     واختيار التبويب (بيع / إيجار ، من المطور / إعادة بيع) بيتنقل للفلتر.
 *   - "عرض النتائج" [data-sheet-apply] بيفتح صفحة نوع البيع اللي اتختار بكل الاختيارات (GET) — تغيير أي اختيار جوه النافذة ما بيبعتش حاجة لوحده:
 *       للإيجار ← صفحة الإيجار ، إعادة البيع ← صفحة إعادة البيع ، وحدات المطور ← صفحة البحث (data-offer-urls على الفورم — ListingPage::offerUrls).
 * الفلتر نفسه (اللوحات والقوايم والعدادات) شغل js/shary/area-page.js — لو الصفحة مش محمّلاه بيتحمّل هنا.
 */
(function () {
    'use strict';

    var box = document.querySelector('[data-home-filter]');
    if (!box) return;
    var form = box.querySelector('form');
    var applying = false;

    // الفورم مش جوه كود الصفحة (SEO): بيتجاب من data-filter-src أول ما العميل يقرّب من زرار الفلتر (تحميل مسبق) ، ويتحط في الصفحة لما يدوس بس
    var src = box.getAttribute('data-filter-src') || '';
    var html = null, fetching = null;
    function prefetch() {
        if (form || html !== null || fetching || !src || !window.fetch) return fetching;
        fetching = fetch(src, { credentials: 'same-origin', headers: { 'Accept': 'text/html', 'X-Requested-With': 'XMLHttpRequest' } })
            .then(function (r) { return r.ok ? r.text() : ''; })
            // لازم يكون جزء الفلتر بس (فيه فورم) — لو رجع صفحة كاملة (لينك غلط / صفحة خطأ) ما يتحطش جوه الصفحة (كان بيوسّعها ويزقها يمين)
            .then(function (text) { text = text || ''; html = (/<html[\s>]|<body[\s>]/i.test(text) || !/<form[\s>]/i.test(text)) ? '' : text; return html; })
            .catch(function () { html = ''; return ''; });
        return fetching;
    }
    function ensure(run) {
        if (form) { run(); return; }
        (prefetch() || Promise.resolve(html)).then(function () {
            if (!form && html) {
                box.innerHTML = html;
                form = box.querySelector('form');
                if (window.SharyAreaFilters) window.SharyAreaFilters.init(box);
            }
            if (form) run();
        });
    }
    document.addEventListener('pointerover', function (event) { if (event.target.closest && event.target.closest('[data-filter-modal-open], #openFilters')) prefetch(); }, { passive: true });
    document.addEventListener('touchstart', function (event) { if (event.target.closest && event.target.closest('[data-filter-modal-open], #openFilters')) prefetch(); }, { passive: true });
    document.addEventListener('focusin', function (event) { if (event.target.closest && event.target.closest('[data-search-strip], #heroSearchInput')) prefetch(); });

    function ready(run) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
    }

    // سكربت الفلتر: مرة واحدة بس في الصفحة — بيتحمّل على طول (مش بعد ما الصفحة تخلص) عشان النافذة تفتح من أول ضغطة
    var filterReady = true, waiting = false;
    (function () {
        var loaded = Array.prototype.some.call(document.scripts, function (script) { return /\/js\/shary\/area-page\.js/.test(script.src || ''); });
        var config = window.SharyFilterWindow || {};
        if (!loaded && config.areaPage) {
            filterReady = false;
            var script = document.createElement('script');
            script.src = config.areaPage;
            script.onload = script.onerror = function () { filterReady = true; if (form && window.SharyAreaFilters) window.SharyAreaFilters.init(box); if (waiting) { waiting = false; ready(open); } };
            document.body.appendChild(script);
        }
    })();

    function open() {
        if (!filterReady) { waiting = true; return; }   // الضغطة اتسجّلت: النافذة بتفتح أول ما السكربت يجهز
        if (!form) { ensure(open); return; }
        // الرئيسية: تبويب البحث (بيع / إيجار) وحالة العقار (من المطور / إعادة بيع) بيتعلّموا في الفلتر
        var tab = document.querySelector('.home-search-tab.is-active, .home-search-tab.active');
        var status = document.querySelector('.property-status.active');
        if (tab || status) {
            var sale = (tab && tab.getAttribute('data-value')) || '';
            var state = (status && status.getAttribute('data-value')) || '';
            var offer = sale === 'rent' ? 'rent' : (state === 'resale' ? 'resale' : 'developer');
            var radio = form.querySelector('input[name="offer"][value="' + offer + '"]');
            if (radio && !radio.checked) { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true })); }
        }
        var opener = form.querySelector('[data-sheet-open="all"]');
        if (opener) opener.click();
    }

    document.addEventListener('click', function (event) {
        var target = event.target.closest ? event.target : null;
        if (!target) return;
        if (target.closest('[data-filter-modal-open]') || target.closest('#openFilters')) {
            event.preventDefault();
            event.stopImmediatePropagation();
            open();
            return;
        }
        if (target.closest('[data-home-filter] [data-sheet-apply]')) applying = true;
    }, true);

    // "بحث متقدم" في الرئيسية (الزرار بينده الدالة دي)
    ready(function () {
        window.toggleHeroAdvancedSearch = open;
        window.SharyFilterWindowReady = true;
        if (window.SharyFilterWanted) { window.SharyFilterWanted = false; open(); }   // العميل ضغط قبل ما السكربت يشتغل
    });

    box.addEventListener('shary:filter', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (!applying) return;
        applying = false;

        var params = new URLSearchParams();
        Array.prototype.forEach.call(form.querySelectorAll('input[name]:checked'), function (input) {
            if (input.value !== '' && !input.disabled) params.append(input.name, input.value);
        });
        Array.prototype.forEach.call(form.querySelectorAll('input[name][type="hidden"], input[name][type="number"], input[name][type="text"], input[name][type="search"]'), function (input) {
            if (input.value !== '' && !input.disabled && input.name !== 'view') params.append(input.name, input.value);
        });
        // خانة البحث بتاعة الصفحة (الرئيسية / شريط البحث): الكلمة المكتوبة بتتبعت مع الفلتر
        var typed = document.getElementById('heroSearchInput') || document.querySelector('[data-search-strip] input[name="q"]');
        if (typed && typed.value.trim() !== '' && !params.has('q')) params.set('q', typed.value.trim());

        // نوع البيع اللي اتختار ليه صفحته — صفحة الإيجار كلها إيجار (من غير offer في اللينك) ، وصفحة إعادة البيع بتاخد offer=resale مع باقي الفلاتر
        var offer = (form.querySelector('input[name="offer"]:checked') || {}).value || '';
        var urls = {};
        try { urls = JSON.parse(form.getAttribute('data-offer-urls') || '{}') || {}; } catch (error) { urls = {}; }
        if (!urls.rent && box.getAttribute('data-rent-url')) urls.rent = box.getAttribute('data-rent-url');
        if (!urls.resale && box.getAttribute('data-resale-url')) urls.resale = box.getAttribute('data-resale-url');
        var url = urls[offer] || box.getAttribute('data-search-url') || form.getAttribute('action') || '';
        if (urls[offer] && offer === 'rent') params.delete('offer');
        var query = params.toString();
        window.location.href = url + (query ? (url.indexOf('?') === -1 ? '?' : '&') + query : '');
    }, true);
})();
