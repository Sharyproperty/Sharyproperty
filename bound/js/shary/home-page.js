/**
 * الصفحة الرئيسية جوه layout الصفحات الجديدة (resources/views/shary/home/index.blade.php):
 * دوال عامة كان الـ layout القديم بيوفّرها لسكربتات الهوم (front/js/main.js و head): بتتعرّف هنا لو مش موجودة.
 * - initSharySwiper(selector, options): بيشغّل Swiper أول ما مكتبته تتحمّل (حدث shary:swiper-ready).
 * - togglePopup(id): "اطلب اجتماع" (zoomMeeting_… / requestMeeting) بيفتح فورم الاجتماع بتاع الموقع (partials/meeting-modal) ، وأي id تاني بيظهر / يخفي العنصر.
 * - openDropdownMenu(id): قوايم الهوم (المنطقة في فورم الاستشارة) + القفل بالضغط براها.
 * - toggleFilterBar / toggleSearchBar / filterMobileSearchItems / updateRangeSlider / hideCompareNotification / showToast.
 * لازم يتحمّل قبل سكربتات الهوم نفسها.
 */
(function () {
    'use strict';
    function byId(id) { return document.getElementById(id); }
    function def(name, fn) { if (typeof window[name] !== 'function') window[name] = fn; }

    def('initSharySwiper', function (selector, options) {
        function run() {
            try { if (window.Swiper && document.querySelector(selector)) return new window.Swiper(selector, options); } catch (error) { /* الشرائح بتفضل ثابتة */ }
        }
        function start() { window.requestAnimationFrame(function () { window.requestAnimationFrame(run); }); }
        if (window.Swiper) { start(); return; }
        window.addEventListener('shary:swiper-ready', start, { once: true });
    });

    def('togglePopup', function (id, event) {
        if (event && event.stopPropagation) event.stopPropagation();
        if (/^zoomMeeting_/.test(id) || id === 'requestMeeting') {
            var open = document.querySelector('[data-home-meeting]');
            var modal = document.querySelector('[data-meeting-modal]');
            // مفتوح بالفعل (النداء جاي بعد الإرسال عشان يقفله): نقفله ، غير كده نفتحه
            if (modal && !modal.classList.contains('hidden')) { var close = modal.querySelector('[data-meeting-close]'); if (close) close.click(); }
            else if (open) open.click();
            return;
        }
        var el = byId(id);
        if (!el) return;
        if (el.classList.contains('invisible') || el.classList.contains('opacity-0')) el.classList.remove('invisible', 'opacity-0');
        else if (el.classList.contains('hidden')) el.classList.remove('hidden');
        else el.classList.add('invisible', 'opacity-0');
    });

    // القوايم: المخفية بـ opacity-0 / invisible بتظهر بـ opacity-100 / visible ، واللي مخفية بـ hidden بيتشال منها hidden
    function dropdownOpen(el) { return !(el.classList.contains('hidden') || el.classList.contains('invisible') || el.classList.contains('opacity-0')); }
    function dropdownSet(el, open) {
        if (el.dataset.ddHidden === undefined) el.dataset.ddHidden = el.classList.contains('hidden') ? '1' : '0';
        if (el.dataset.ddHidden === '1') el.classList.toggle('hidden', !open);
        el.classList.toggle('invisible', !open); el.classList.toggle('opacity-0', !open);
        el.classList.toggle('visible', open); el.classList.toggle('opacity-100', open);
        if (open) el.style.zIndex = '30';
        var button = document.querySelector('[aria-controls="' + el.id + '"]');
        if (button) button.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    def('openDropdownMenu', function (id) { var el = byId(id); if (el) dropdownSet(el, !dropdownOpen(el)); });
    document.addEventListener('click', function (event) {
        Array.prototype.forEach.call(document.querySelectorAll('.shary-home-root .dropdown-list'), function (list) {
            if (!list.id || !dropdownOpen(list)) return;
            var button = document.querySelector('[aria-controls="' + list.id + '"]') || list.previousElementSibling;
            if (list.contains(event.target) || (button && button.contains(event.target))) return;
            dropdownSet(list, false);
        });
    });

    def('hideCompareNotification', function (id, event) { if (event) event.stopPropagation(); var el = byId(id || 'compareNotification'); if (el) el.style.display = 'none'; });
    function bar(id, state) {
        var el = byId(id);
        if (!el) return;
        var open = state === 'open' || (state !== 'close' && (el.style.maxHeight === '' || el.style.maxHeight === '0px'));
        el.style.maxHeight = open ? '100dvh' : '0px';
        el.style.overflowY = open ? 'auto' : 'hidden';
    }
    def('toggleFilterBar', function (state) { bar('filterBar', state); });
    def('toggleSearchBar', function (state, id) { bar(id || 'searchBar', state); });
    def('filterMobileSearchItems', function (input, boxId, selector) {
        var box = byId(boxId);
        if (!box) return;
        var q = (input.value || '').trim().toLowerCase();
        Array.prototype.forEach.call(box.querySelectorAll(selector), function (item) { item.style.display = !q || item.textContent.toLowerCase().indexOf(q) !== -1 ? '' : 'none'; });
    });
    def('updateRangeSlider', function () {});
    // الرسايل: toastr لو متحمّل ، وإلا رسالة الموقع (lead-forms.js)
    def('showToast', function (message, type) {
        if (window.SharyLead) window.SharyLead.toast(message, type === 'error' ? 'error' : 'success');
        else if (window.toastr) window.toastr[type === 'error' ? 'error' : 'success'](message);
    });
    if (!window.toastr) {
        var say = function (type) { return function (message) { if (window.SharyLead) window.SharyLead.toast(message, type); }; };
        window.toastr = { info: say('success'), success: say('success'), error: say('error'), warning: say('error') };
    }
})();
