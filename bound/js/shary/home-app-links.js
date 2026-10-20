/**
 * الرئيسية: كروت «ما يميزنا» المربوطة بالتطبيق (تفتح التطبيق لو متحمل ، أو المتجر) + «قريبًا».
 * الكلام واللينكات من window.SharyHomeConf (resources/views/shary/home/index.blade.php).
 */
function showInvestmentComingSoon() {
    window.toastr && toastr.info(window.SharyHomeConf.featureSoon);
}

/*
 * كروت «ما يميزنا» (shary/home/sections/investment.blade.php):
 *   href = صفحة الكارت على الموقع (https — للكمبيوتر وجوجل ومن غير جافاسكريبت) ، data-app-link = نفس الصفحة للتطبيق ('/ar/academy' …)
 *   والكروت اللي في التطبيق بس (من غير صفحة على الموقع): href = صفحة التحميل ، data-app-link = مسارها في التطبيق.
 * الموبايل: SharyApp.open (site-chrome/06-app-button.js) — أندرويد: التطبيق متسطّب ← بيفتح على طول على الشاشة دي ، مش متسطّب ← صفحة الكارت
 * على الموقع (أو المتجر للكروت اللي في التطبيق بس) — عمره ما بيروح جوجل بلاي على طول. آيفون: متسطّب ← التطبيق ، مش معروف ← صفحة الموقع.
 * الكمبيوتر: الكارت بيفتح صفحته عادي ، وكروت التطبيق بس ← صفحة التطبيق على المتجر (site-chrome/11-photo-fit-forms-misc.js).
 */
function handleInvestmentLink(event, link) {
    // اللينك كامل (link.href): اللينك النسبي بيتعامل زي الكامل بالظبط — صفحة الكارت تفضل صفحة على الموقع
    const href = link.href || link.getAttribute('href') || '';
    const appPath = link.getAttribute('data-app-link') || '';
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!isAndroid && !isIOS) {
        return;
    }
    if (!window.SharyApp || !window.SharyApp.open) {
        return;      // من غير السكربت: اللينك العادي
    }
    const stores = (window.SharyHomeConf && window.SharyHomeConf.appStores) || {};
    // صفحة على الموقع (مش لينك تطبيق / متجر / تحميل): لو التطبيق مش متسطّب العميل بيروح لها
    const isWeb = /^(https?:\/\/|\/)/i.test(href)
        && !/play\.google\.com|apps\.apple\.com|itunes\.apple\.com/i.test(href)
        && !/^(?:https?:\/\/[^\/]+)?(?:\/(?:ar|en))?\/(?:download|app|download-app)\/?(?:[?#].*)?$/i.test(href);
    // صفحة على الموقع التطبيق ما بيفتحهاش (أو لينك موقع تاني): اللينك العادي
    if (!appPath && isWeb) {
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    window.SharyApp.open(appPath, {
        webUrl: isWeb ? link.href : '',
        storeUrl: isIOS ? stores.ios : stores.android,
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const buttons = [
        ...document.querySelectorAll('.property-status-filter .property-status')
    ];

    if (buttons.length < 3) return;

    const originalOptions = buttons.map(button => ({
        text: button.textContent.trim(),
        value: button.dataset.value
    }));

    const isArabic = window.SharyHomeConf.isRtl;

    document.querySelectorAll('.home-search-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const isRent = tab.dataset.value === 'rent';
            
            if(tab.id == "rent-filter-btn"){
                window.toastr && toastr.info(window.SharyHomeConf.featureSoon);                        
                return;
            }

            const options = isRent
                ? [
                    originalOptions[0],
                    {
                        text: window.SharyHomeConf.furnished,
                        value: 1
                    },
                    {
                        text: window.SharyHomeConf.unfurnished,
                        value: 0
                    }
                ]
                : originalOptions;

            buttons.forEach((button, index) => {
                button.textContent = options[index].text;
                button.dataset.value = options[index].value;
            });

            // Reset selection to "All" when changing tabs.
            buttons[0].click();
        });
    });
});

(function () {
    function init(root) {
        if (root.__shInit) return; root.__shInit = true;
        var imgs = [].slice.call(root.querySelectorAll('.sh-stage img'));
        if (imgs.length < 2) return;
        var interval = +root.getAttribute('data-interval') || 2500;
        var cur = 0, timer = null;
        // warm up the lazy images so the first fade never flashes
        imgs.forEach(function (im) { if (im.loading === 'lazy') im.loading = 'eager'; });
        function show(i) {
        cur = (i + imgs.length) % imgs.length;
        imgs.forEach(function (im, k) { im.classList.toggle('is-on', k === cur); });
        }
        function stop() { if (timer) clearInterval(timer); timer = null; }
        function start() { stop(); timer = setInterval(function () { show(cur + 1); }, interval); }
        document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
        show(0); start();
    }

    function boot() { [].forEach.call(document.querySelectorAll('[data-sh-hero]'), init); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
    window.SharyHero = { init: init };
})();
