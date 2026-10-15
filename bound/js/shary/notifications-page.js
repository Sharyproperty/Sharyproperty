/**
 * صفحة الإشعارات (resources/views/notifications/index.blade.php)
 * - التبويب [data-notify-tab="all | unread"] بيفلتر القايمة من غير تحميل.
 * - الضغط على إشعار غير مقروء بيعلّمه مقروء وبيطلع حدث shary:notification-read ({ id }) — اسمعوه عشان تحدّثوا السيرفر. اللينك بيفتح عادي.
 * - "تعليم الكل كمقروء" [data-notify-all]: حدث shary:notifications-read-all.
 * - زرار التفعيل [data-notify-button]: حدث shary:notifications-enable ({ done() }) — اربطوه بتفعيل إشعارات المتصفح / التطبيق ونادوا done().
 *   لو الحدث ما اتمنعش السكربت بيطلب إذن إشعارات المتصفح (Notification.requestPermission) لو متاح.
 */
(function () {
    document.querySelectorAll('[data-notifications]').forEach(function (box) {
        var list = box.querySelector('[data-notify-list]');
        var empty = box.querySelector('[data-notify-empty]');
        var all = box.querySelector('[data-notify-all]');
        var mode = 'all';

        function items() { return Array.prototype.slice.call(list.querySelectorAll('[data-notify-item]')); }

        function refresh() {
            var unread = items().filter(function (item) { return item.getAttribute('data-read') !== '1'; });
            var shown = 0;
            items().forEach(function (item) {
                var show = mode === 'all' || item.getAttribute('data-read') !== '1';
                item.classList.toggle('hidden', !show);
                if (show) shown++;
            });
            box.querySelectorAll('[data-notify-count="all"]').forEach(function (n) { n.textContent = items().length; });
            box.querySelectorAll('[data-notify-count="unread"]').forEach(function (n) { n.textContent = unread.length; });
            if (empty) empty.classList.toggle('hidden', shown > 0);
            if (all) all.classList.toggle('hidden', unread.length === 0);
        }

        box.querySelectorAll('[data-notify-tab]').forEach(function (tab) {
            tab.addEventListener('click', function () {
                mode = tab.getAttribute('data-notify-tab');
                box.querySelectorAll('[data-notify-tab]').forEach(function (other) { other.setAttribute('aria-selected', other === tab ? 'true' : 'false'); });
                refresh();
            });
        });

        list.addEventListener('click', function (event) {
            var item = event.target.closest ? event.target.closest('[data-notify-item]') : null;
            if (!item || item.getAttribute('data-read') === '1') return;
            item.setAttribute('data-read', '1');
            item.dispatchEvent(new CustomEvent('shary:notification-read', { bubbles: true, detail: { id: item.getAttribute('data-notify-item') } }));
            refresh();
        });

        if (all) all.addEventListener('click', function () {
            items().forEach(function (item) { item.setAttribute('data-read', '1'); });
            all.dispatchEvent(new CustomEvent('shary:notifications-read-all', { bubbles: true }));
            refresh();
        });

        var button = box.querySelector('[data-notify-button]');
        var title = box.querySelector('[data-notify-title]');
        function enabled() {
            if (title) title.textContent = title.getAttribute('data-on') || title.textContent;
            if (button) button.classList.add('hidden');
        }
        // الزرار لازم يرد على الضغطة دايماً: لو المتصفح قافل الإشعارات (اترفضت قبل كده) أو مش بيدعمها — رسالة بتقول يعمل إيه
        var en = (document.documentElement.getAttribute('lang') || 'ar').slice(0, 2) === 'en';
        var HINTS = {
            denied: en ? 'Notifications are blocked in your browser. Tap the lock icon next to the site address ← Notifications / Permissions ← Allow, then press the button again.'
                       : 'الإشعارات مقفولة من المتصفح. دوس على علامة القفل جنب عنوان الموقع ← الإشعارات (Notifications / الأذونات) ← سماح ، وبعدها دوس الزرار تاني.',
            unsupported: en ? 'This browser does not support notifications. On iPhone: add Shary to the Home Screen (Share ← Add to Home Screen) and open it from there — or download the Shary app.'
                            : 'المتصفح ده مش بيدعم الإشعارات. على الآيفون: ضيف شاري للشاشة الرئيسية (مشاركة ← إضافة إلى الشاشة الرئيسية) وافتحه منها — أو نزّل تطبيق شاري.',
            later: en ? 'Notifications were not allowed. Press the button again and choose «Allow».' : 'الإشعارات ما اتفعّلتش. دوس الزرار تاني واختار «سماح».'
        };
        function hint(kind) {
            var text = HINTS[kind] || HINTS.later;
            var note = box.querySelector('[data-notify-hint]');
            if (!note) {
                note = document.createElement('p');
                note.setAttribute('data-notify-hint', '');
                note.setAttribute('role', 'status');
                note.style.cssText = 'margin:0;padding:12px 16px;border-radius:12px;background:#fff;border:1px solid #F2C94C;color:#1E4266;font-size:14px;font-weight:800;line-height:1.8';
                var card = box.querySelector('[data-notify-enable]');
                if (card && card.parentNode) card.parentNode.insertBefore(note, card.nextSibling); else box.insertBefore(note, box.firstChild);
            }
            note.textContent = text;
        }
        document.addEventListener('shary:notifications-hint', function (event) { hint(event.detail && event.detail.kind); });
        if (window.Notification && Notification.permission === 'granted') enabled();
        if (button) button.addEventListener('click', function () {
            if (!('Notification' in window) || !Notification.requestPermission) { hint('unsupported'); return; }
            if (Notification.permission === 'denied') { hint('denied'); return; }
            var go = button.dispatchEvent(new CustomEvent('shary:notifications-enable', { bubbles: true, cancelable: true, detail: { done: enabled, fail: hint } }));
            if (!go) return;
            try {
                Notification.requestPermission().then(function (result) { if (result === 'granted') enabled(); else hint(result === 'denied' ? 'denied' : 'later'); });
            } catch (error) { hint('unsupported'); }
        });

        refresh();
    });
})();

// حفظ "مقروء" على السيرفر للعميل المسجل: الصفحة بتحط data-read-url (POST /{locale}/shary/notifications/read) — الزائر: الحالة في الصفحة بس
(function () {
    var box = document.querySelector('[data-notifications][data-read-url]');
    var url = box ? box.getAttribute('data-read-url') : '';
    if (!url || !window.fetch) return;
    function send(body) {
        var meta = document.querySelector('meta[name="csrf-token"]');
        try {
            fetch(url, {
                method: 'POST', credentials: 'same-origin', keepalive: true,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': meta ? meta.getAttribute('content') : '', 'X-Requested-With': 'XMLHttpRequest' },
                body: JSON.stringify(body)
            }).catch(function () { /* الحالة في الصفحة اتغيرت — السيرفر هيتحدّث مع المحاولة الجاية */ });
        } catch (error) { /* متصفح قديم */ }
    }
    document.addEventListener('shary:notification-read', function (event) { send({ id: event.detail && event.detail.id }); });
    document.addEventListener('shary:notifications-read-all', function () { send({}); });
})();
