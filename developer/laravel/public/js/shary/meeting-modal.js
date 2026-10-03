/**
 * فورم "طلب اجتماع":
 * - أي عنصر عليه data-meeting-open (زرار "طلب مقابلة") بيفتح الفورم، وبتتقفل من علامة X أو الضغط براها أو Esc.
 * - زووم / اجتماع حضوري، واختيار اليوم والوقت: الاختيار بيتسجل في الحقول المخفية meeting_type و meeting_date و meeting_time.
 * - الأيام: السبع أيام الجاية (من بكرة) بتترسم من القالب <template data-meeting-day-template>، بلغة الصفحة.
 *   لو زراير الأيام مرسومة من الباك إند (عليها data-meeting-day) السكربت بيستخدمها زي ما هي.
 */
(function () {
    var modals = Array.prototype.slice.call(document.querySelectorAll('[data-meeting-modal]'));
    if (!modals.length) return;

    var lastOpener = null;

    function pad(number) {
        return (number < 10 ? '0' : '') + number;
    }

    function press(buttons, chosen) {
        buttons.forEach(function (button) { button.setAttribute('aria-pressed', button === chosen ? 'true' : 'false'); });
    }

    function fillDays(modal, dateField) {
        var holder = modal.querySelector('[data-meeting-days]');
        var template = modal.querySelector('[data-meeting-day-template]');
        if (!holder) return [];

        if (!holder.children.length && template) {
            var langNode = modal.closest('[lang]');
            var english = ((langNode && langNode.lang) || document.documentElement.lang || 'ar').indexOf('en') === 0;
            var locale = english ? 'en-GB' : 'ar-EG-u-nu-latn';
            var count = parseInt(holder.getAttribute('data-count'), 10) || 7;

            for (var i = 1; i <= count; i++) {
                var day = new Date();
                day.setDate(day.getDate() + i);
                var button = template.content.firstElementChild.cloneNode(true);
                button.setAttribute('data-meeting-day', day.getFullYear() + '-' + pad(day.getMonth() + 1) + '-' + pad(day.getDate()));
                button.querySelector('[data-meeting-day-name]').textContent = day.toLocaleDateString(locale, { weekday: english ? 'short' : 'long' });
                button.querySelector('[data-meeting-day-date]').textContent = day.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
                holder.appendChild(button);
            }
        }

        var days = Array.prototype.slice.call(holder.querySelectorAll('[data-meeting-day]'));
        days.forEach(function (button) {
            button.addEventListener('click', function () {
                press(days, button);
                dateField.value = button.getAttribute('data-meeting-day');
            });
        });
        if (days.length) {
            var chosen = holder.querySelector('[aria-pressed="true"]') || days[0];
            press(days, chosen);
            dateField.value = chosen.getAttribute('data-meeting-day');
        }
        return days;
    }

    function close(modal) {
        if (modal.classList.contains('hidden')) return;
        modal.classList.add('hidden');
        document.documentElement.style.overflow = '';
        if (lastOpener) lastOpener.focus({ preventScroll: true });
        if (window.SharyBack) window.SharyBack.closed();
    }

    function open(modal, opener) {
        lastOpener = opener;
        modal.classList.remove('hidden');
        document.documentElement.style.overflow = 'hidden';
        // زرار الرجوع بيقفل الفورم والعميل بيفضل في الصفحة
        if (window.SharyBack) window.SharyBack.opened(function () { close(modal); });
        var first = modal.querySelector('input[name="name"]');
        if (first) first.focus({ preventScroll: true });
    }

    modals.forEach(function (modal) {
        var typeField = modal.querySelector('[data-meeting-type]');
        var timeField = modal.querySelector('[data-meeting-time]');
        var types = Array.prototype.slice.call(modal.querySelectorAll('[data-meeting-type-option]'));
        var times = Array.prototype.slice.call(modal.querySelectorAll('[data-meeting-time-option]'));

        fillDays(modal, modal.querySelector('[data-meeting-date]'));

        types.forEach(function (button) {
            button.addEventListener('click', function () {
                press(types, button);
                typeField.value = button.getAttribute('data-meeting-type-option');
            });
        });

        times.forEach(function (button) {
            button.addEventListener('click', function () {
                press(times, button);
                timeField.value = button.getAttribute('data-meeting-time-option');
            });
        });

        modal.querySelectorAll('[data-meeting-close]').forEach(function (element) {
            element.addEventListener('click', function () { close(modal); });
        });
    });

    // الزرار بيفتح أقرب فورم ليه في الصفحة
    document.addEventListener('click', function (event) {
        var opener = event.target.closest ? event.target.closest('[data-meeting-open]') : null;
        if (!opener) return;
        var node = opener.parentElement;
        var modal = null;
        while (node && !modal) {
            modal = node.querySelector('[data-meeting-modal]');
            node = node.parentElement;
        }
        if (!modal) return;
        event.preventDefault();
        open(modal, opener);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;
        modals.forEach(function (modal) {
            if (!modal.classList.contains('hidden')) close(modal);
        });
    });
})();
