/**
 * الإشعارات في الموقع:
 * 1) جرس الهيدر [data-notify-bell] (ديسك توب وموبايل): عدد الجديد = إشعارات العميل الشخصية الجديدة (من السيرفر)
 *    + الإشعارات العامة اللي نزلت بعد آخر مرة فتح فيها صفحة الإشعارات (localStorage: shary-notify-seen).
 *    GET {data-count-url} ← { personal, general: [unix …] }
 * 2) إشعارات المتصفح (Web Push — Firebase): الإعدادات في <meta name="shary-webpush"> (لو مش متظبطة في لوحة التحكم مفيش حاجة بتحصل).
 *    زرار «فعّل الإشعارات» في صفحة الإشعارات (حدث shary:notifications-enable) ← إذن المتصفح ← توكن ← POST {data-token-url}.
 *    والتوكن بيتجدد لوحده مرة كل يوم لو الإذن متاح.
 */
(function () {
    var meta = document.querySelector('meta[name="shary-notify"]');
    if (!meta) return;
    var countUrl = meta.getAttribute('data-count-url');
    var tokenUrl = meta.getAttribute('data-token-url');
    var lang = (document.documentElement.getAttribute('lang') || 'ar').slice(0, 2) === 'en' ? 'en' : 'ar';
    var SEEN = 'shary-notify-seen';

    function store(key, value) { try { if (value === undefined) return window.localStorage.getItem(key); window.localStorage.setItem(key, value); } catch (e) { return null; } return null; }
    function csrf() { var m = document.querySelector('meta[name="csrf-token"]'); return m ? m.getAttribute('content') : ''; }

    // ---- 1) الجرس
    var onPage = !!document.querySelector('[data-notifications]');
    if (onPage) store(SEEN, String(Math.floor(Date.now() / 1000)));
    function paint(n) {
        document.querySelectorAll('[data-notify-bell]').forEach(function (bell) {
            var badge = bell.querySelector('[data-notify-bell-count]');
            bell.setAttribute('data-active', n > 0 ? 'true' : 'false');
            if (badge) { badge.textContent = n > 99 ? '99+' : String(n); badge.classList.toggle('hidden', n <= 0); badge.classList.toggle('flex', n > 0); }
        });
    }
    function load() {
        if (!countUrl || !window.fetch || !document.querySelector('[data-notify-bell]')) return;
        fetch(countUrl, { credentials: 'same-origin', headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (d) {
                if (!d) return;
                var seen = Number(store(SEEN) || 0);
                var general = (d.general || []).filter(function (t) { return Number(t) > seen; }).length;
                paint(onPage ? Number(d.personal || 0) : Number(d.personal || 0) + general);
            }).catch(function () {});
    }
    if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 3000 }); else setTimeout(load, 1500);
    document.addEventListener('shary:notifications-read-all', function () { paint(0); });

    // ---- 2) إشعارات المتصفح
    var cfgMeta = document.querySelector('meta[name="shary-webpush"]');
    var cfg = null;
    try { cfg = cfgMeta ? JSON.parse(cfgMeta.getAttribute('content') || 'null') : null; } catch (e) { cfg = null; }
    var supported = !!(cfg && cfg.apiKey && 'serviceWorker' in navigator && 'PushManager' in window && window.Notification && window.isSecureContext);

    var loading = null;
    function sdk() {
        if (loading) return loading;
        loading = new Promise(function (resolve, reject) {
            var base = 'https://www.gstatic.com/firebasejs/10.12.2/';
            var a = document.createElement('script');
            a.src = base + 'firebase-app-compat.js';
            a.onload = function () {
                var b = document.createElement('script');
                b.src = base + 'firebase-messaging-compat.js';
                b.onload = function () { resolve(window.firebase); };
                b.onerror = reject;
                document.head.appendChild(b);
            };
            a.onerror = reject;
            document.head.appendChild(a);
        });
        return loading;
    }
    function subscribe() {
        var web = { apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, messagingSenderId: cfg.messagingSenderId, appId: cfg.appId };
        return navigator.serviceWorker.register('/firebase-messaging-sw.js?c=' + encodeURIComponent(JSON.stringify(web)), { scope: '/' })
            .then(function (registration) {
                return sdk().then(function (firebase) {
                    if (!firebase.apps.length) firebase.initializeApp(web);
                    return firebase.messaging().getToken({ vapidKey: cfg.vapidKey, serviceWorkerRegistration: registration });
                });
            })
            .then(function (token) {
                if (!token) return false;
                store('shary-webpush-at', String(Date.now()));
                return fetch(tokenUrl, {
                    method: 'POST', credentials: 'same-origin',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': csrf(), 'X-Requested-With': 'XMLHttpRequest' },
                    body: JSON.stringify({ token: token, lang: lang })
                }).then(function (r) { return r.ok; });
            });
    }
    window.SharyWebPush = { supported: supported, subscribe: supported ? subscribe : function () { return Promise.resolve(false); } };
    if (!supported) return;

    // زرار التفعيل في صفحة الإشعارات
    document.addEventListener('shary:notifications-enable', function (event) {
        event.preventDefault();
        var done = event.detail && event.detail.done;
        var fail = event.detail && event.detail.fail;
        Notification.requestPermission().then(function (result) {
            if (result !== 'granted') { if (fail) fail(result === 'denied' ? 'denied' : 'later'); return; }
            subscribe().then(function () { if (done) done(); }).catch(function () { if (done) done(); });
        });
    });

    // الإذن متاح من قبل: نجدّد التوكن مرة في اليوم (عشان لو اتغير أو العميل سجّل دخول)
    if (Notification.permission === 'granted') {
        var last = Number(store('shary-webpush-at') || 0);
        var who = meta.getAttribute('data-user') || '0';
        if (Date.now() - last > 86400000 || store('shary-webpush-u') !== who) {
            setTimeout(function () { subscribe().then(function (ok) { if (ok) store('shary-webpush-u', who); }).catch(function () {}); }, 4000);
        }
    }
})();
