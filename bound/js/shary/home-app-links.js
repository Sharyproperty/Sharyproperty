/**
 * الرئيسية: كروت «ما يميزنا» المربوطة بالتطبيق (تفتح التطبيق لو متحمل ، أو المتجر) + «قريبًا».
 * الكلام واللينكات من window.SharyHomeConf (resources/views/shary/home/index.blade.php).
 */
function showInvestmentComingSoon() {
    window.toastr && toastr.info(window.SharyHomeConf.featureSoon);
}

/*
 * كروت "ما يميزنا" المربوطة بالتطبيق:
 *   - لينك الكارت لينك تطبيق (shary://...) : التطبيق متحمل ← بيفتح على الشاشة دي ، مش متحمل ← المتجر.
 *   - لينك الكارت لينك تحميل (المتجر) : التطبيق متحمل ← بيفتح التطبيق (data-app-link = shary://<slug الكارت>) ، مش متحمل ← المتجر.
 *   - أي لينك تاني (صفحة في الموقع) بيفتح عادي.
 */
function handleInvestmentLink(event, link) {
    const href = link.getAttribute('href') || '';
    const isDeep = /^shary:\/\//i.test(href);
    const isStore = /play\.google\.com\/store\/apps|apps\.apple\.com|itunes\.apple\.com/i.test(href);

    // Normal website links follow their href.
    if (!isDeep && !isStore) {
        return;
    }

    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const stores = window.SharyHomeConf.appStores || {};

    if (!isAndroid && !isIOS) {
        // كمبيوتر: مفيش تطبيق يتفتح — لينك المتجر زي ما هو ، ولينك التطبيق ← صفحة التطبيق على المتجر
        if (isStore) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        window.location.href = stores.android;
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    const storeUrl = isAndroid ? stores.android : stores.ios;
    const deepLink = isDeep ? href : (link.getAttribute('data-app-link') || 'shary://home');

    // أندرويد: التطبيق متحمّل ← بيفتح على طول (على الشاشة دي لو لينكها shary://…) ، مش متحمّل ← جوجل بلاي (site-chrome/06-app-button.js)
    if (isAndroid) {
        if (window.SharyApp && window.SharyApp.open) window.SharyApp.open(deepLink, storeUrl);
        else if (storeUrl) window.location.href = storeUrl;
        return;
    }

    // Cancel a previous attempt if another card was clicked.
    if (window.cancelInvestmentAppRedirect) {
        window.cancelInvestmentAppRedirect();
    }

    let timer;

    function cleanup() {
        clearTimeout(timer);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('pagehide', opened);
        window.removeEventListener('blur', opened);

        if (window.cancelInvestmentAppRedirect === cleanup) {
            window.cancelInvestmentAppRedirect = null;
        }
    }

    // التطبيق اتفتح ← ما نروحش للمتجر ، وزرار الهيدر يبقى "افتح التطبيق" من هنا ورايح
    function opened() {
        cleanup();
        if (window.SharyApp) {
            window.SharyApp.remember();
        }
    }

    function onVisibilityChange() {
        if (document.hidden) {
            opened();
        }
    }

    window.cancelInvestmentAppRedirect = cleanup;

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', opened);
    if (isAndroid) {
        // (على آيفون رسالة سفاري بتاعة اللي مش منزّل التطبيق ما تتحسبش فتح)
        window.addEventListener('blur', opened);
    }

    timer = setTimeout(() => {
        const shouldRedirect = !document.hidden;
        cleanup();

        if (shouldRedirect) {
            // التطبيق مش متسطّب: زرار الهيدر يفضل / يرجع "حمل التطبيق"
            if (window.SharyApp && window.SharyApp.installed()) {
                window.SharyApp.forget();
            }
            window.location.href = storeUrl;
        }
    }, 2500);

    window.location.href = deepLink;
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
