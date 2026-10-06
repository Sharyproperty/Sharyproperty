/**
 * اختيار كود الدولة جنب رقم الهاتف (فورم الاستشارة / طلب الاجتماع / بيع وتأجير عقار / العروض / التحقق من الوسيط).
 * فوق القايمة خانة بحث (بتتضاف من هنا): العميل يكتب اسم الدولة أو الكود.
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

        // بحث فوق القايمة: العميل يكتب اسم الدولة أو الكود (966 / +966 / السعودية / sa) والقايمة بتتفلتر
        var langHost = field.closest('[lang]');
        var english = ((langHost && langHost.lang) || document.documentElement.lang || 'ar').indexOf('en') === 0;
        var searchRow = document.createElement('li');
        searchRow.className = 'phone-search';
        searchRow.setAttribute('role', 'presentation');
        var search = document.createElement('input');
        search.type = 'search';
        search.autocomplete = 'off';
        search.placeholder = english ? 'Search country or code' : 'ابحث باسم الدولة أو الكود';
        search.setAttribute('aria-label', search.placeholder);
        searchRow.appendChild(search);
        list.insertBefore(searchRow, list.firstChild);

        function simple(text) {
            return String(text || '').toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ').trim();
        }
        function visible() { return options.filter(function (option) { return option.style.display !== 'none'; }); }
        function filter() {
            var q = simple(search.value).replace(/^\+|^00/, '');
            options.forEach(function (option) {
                if (!option.__hay) {
                    var image = option.querySelector('img');
                    var iso = image ? (/([a-z]{2})\.svg/i.exec(image.getAttribute('src') || '') || [])[1] : '';
                    option.__hay = simple(option.textContent + ' ' + (iso || '') + ' ' + String(option.getAttribute('data-code')).replace(/\D+/g, ''));
                }
                option.style.display = !q || option.__hay.indexOf(q) > -1 ? '' : 'none';
            });
        }
        search.addEventListener('input', filter);
        search.addEventListener('click', function (e) { e.stopPropagation(); });
        search.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { open(false); toggle.focus(); return; }
            var first = visible()[0];
            if (e.key === 'ArrowDown' && first) { e.preventDefault(); first.focus(); }
            if (e.key === 'Enter') { e.preventDefault(); if (first) select(first); }
        });

        function isOpen() {
            return !list.classList.contains('hidden');
        }

        function open(state) {
            list.classList.toggle('hidden', !state);
            toggle.setAttribute('aria-expanded', state ? 'true' : 'false');
            if (state) {
                search.value = '';
                filter();
                list.scrollTop = 0;
                search.focus();
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
                    var shown = visible();
                    var next = shown[shown.indexOf(option) + (e.key === 'ArrowDown' ? 1 : -1)];
                    if (next) next.focus(); else if (e.key === 'ArrowUp') search.focus();
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
