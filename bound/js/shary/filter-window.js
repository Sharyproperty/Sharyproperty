/**
 * نافذة الفلتر المتقدم بره صفحة البحث ([data-home-filter] — partials/filter-window.blade.php): نفس فورم فلتر صفحة البحث.
 *   - زرار الفلتر جنب خانة البحث [data-filter-modal-open] (المشروع / الوحدة / الفرصة / صفحات "عرض الكل") بيفتح النافذة.
 *   - الرئيسية: "بحث متقدم" (toggleHeroAdvancedSearch) وزرار الفلتر بتاع الموبايل (#openFilters) بيفتحوا نفس النافذة ،
 *     واختيار التبويب (بيع / إيجار ، من المطور / إعادة بيع) بيتنقل للفلتر.
 *   - "عرض النتائج" [data-sheet-apply] بيفتح صفحة البحث بكل الاختيارات (GET) — تغيير أي اختيار جوه النافذة ما بيبعتش حاجة لوحده.
 * الفلتر نفسه (اللوحات والقوايم والعدادات) شغل js/shary/area-page.js — لو الصفحة مش محمّلاه بيتحمّل هنا.
 */
(function () {
    'use strict';

    var box = document.querySelector('[data-home-filter]');
    var form = box && box.querySelector('form');
    if (!form) return;
    var applying = false;

    function ready(run) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
    }

    // سكربت الفلتر: مرة واحدة بس في الصفحة
    ready(function () {
        var loaded = Array.prototype.some.call(document.scripts, function (script) { return /\/js\/shary\/area-page\.js/.test(script.src || ''); });
        var config = window.SharyFilterWindow || {};
        if (!loaded && config.areaPage) {
            var script = document.createElement('script');
            script.src = config.areaPage;
            document.body.appendChild(script);
        }
    });

    function open() {
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
    ready(function () { window.toggleHeroAdvancedSearch = open; });

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

        var url = box.getAttribute('data-search-url') || form.getAttribute('action') || '';
        var query = params.toString();
        window.location.href = url + (query ? (url.indexOf('?') === -1 ? '?' : '&') + query : '');
    }, true);
})();
