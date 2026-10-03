/**
 * اختيار كود الدولة جنب رقم الهاتف (فورم الاستشارة).
 * بيشتغل على أي عنصر عليه data-phone-field: الزرار بيفتح القايمة، والاختيار بيغيّر العلم والكود
 * وقيمة الحقل المخفي country_code اللي بتتبعت مع الفورم.
 */
(function () {
    document.querySelectorAll('[data-phone-field]').forEach(function (field) {
        var toggle = field.querySelector('[data-phone-toggle]');
        var list = field.querySelector('[data-phone-list]');
        var flag = field.querySelector('[data-phone-flag]');
        var code = field.querySelector('[data-phone-code]');
        var value = field.querySelector('[data-phone-value]');
        var input = field.querySelector('input[type="tel"]');
        var options = Array.prototype.slice.call(list.querySelectorAll('[role="option"]'));

        function isOpen() {
            return !list.classList.contains('hidden');
        }

        function open(state) {
            list.classList.toggle('hidden', !state);
            toggle.setAttribute('aria-expanded', state ? 'true' : 'false');
            if (state) {
                var current = list.querySelector('[aria-selected="true"]') || options[0];
                current.focus();
            }
        }

        function select(option) {
            options.forEach(function (o) { o.setAttribute('aria-selected', o === option ? 'true' : 'false'); });
            flag.src = option.querySelector('img').src;
            code.textContent = option.getAttribute('data-code');
            value.value = option.getAttribute('data-code');
            open(false);
            input.focus();
        }

        toggle.addEventListener('click', function () { open(!isOpen()); });

        options.forEach(function (option, index) {
            option.addEventListener('click', function () { select(option); });
            option.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    select(option);
                } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    var next = options[index + (e.key === 'ArrowDown' ? 1 : -1)];
                    if (next) next.focus();
                } else if (e.key === 'Escape') {
                    open(false);
                    toggle.focus();
                }
            });
        });

        document.addEventListener('click', function (e) {
            if (isOpen() && !field.contains(e.target)) open(false);
        });
    });
})();
