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
        if (window.Notification && Notification.permission === 'granted') enabled();
        if (button) button.addEventListener('click', function () {
            var go = button.dispatchEvent(new CustomEvent('shary:notifications-enable', { bubbles: true, cancelable: true, detail: { done: enabled } }));
            if (!go) return;
            if (window.Notification && Notification.requestPermission) {
                try { Notification.requestPermission().then(function (result) { if (result === 'granted') enabled(); }); } catch (error) { enabled(); }
            } else {
                enabled();
            }
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
