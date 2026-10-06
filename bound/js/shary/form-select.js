/**
 * قايمة الاختيار اللي بالصور [data-select] — فورم بيع / تأجير العقار وفورم الوظائف (resources/views/requests/partials/field.blade.php) وفلتر العروض الحصرية (offers/index.blade.php)
 * - القايمة الأصلية <select> هي اللي بتتبعت مع الفورم. السكربت بيخفيها ويظهر مكانها زرار [data-select-toggle] وقايمة [data-select-list]
 *   فيها جنب كل اختيار صورته (أيقونة المنطقة / لوجو المشروع / أيقونة نوع العقار).
 * - القايمة بتفتح تحت الخانة دايمًا (مش لفوق)، ولو آخرها مش باين الصفحة بتنزل لها.
 * - اختيار واحد: الضغط بيختار ويقفل. اختيار متعدد (select multiple — مميزات الوحدة): الضغط بيعلّم / يشيل والقايمة بتفضل مفتوحة.
 * - أي تغيير بيطلع حدث change على الـ <select> — ولو كود تاني غيّر قيمته يطلّع change والزرار بيتحدّث لوحده.
 * - بحث: خانة بحث ثابتة فوق القايمة (بتتضاف هنا لوحدها) في كل قوايم الفلاتر ، وفي قوايم الفورمات اللي فيها أكتر من 6 اختيارات (أو عليها data-select-search) — العميل يكتب أول حروف فالاختيارات تتفلتر. الكتابة بتتجاهل الهمزات والتشكيل والمسافات.
 *   Enter بيختار أول نتيجة ، والسهم لتحت بينزل للاختيارات. القايمة اللي عليها data-select-nosearch من غير بحث.
 * - الاختيارات ممكن تتبدّل بعد التحميل (قايمة معتمدة على قايمة تانية): بعد ما تغيّروا الـ <option> والـ <li> ابعتوا حدث shary:select-refresh على [data-select].
 * من غير السكربت: القايمة الأصلية بتشتغل عادي.
 */
(function () {
    var opened = null;   // القايمة المفتوحة دلوقتي (واحدة بس)

    function closeOpened() {
        if (!opened) return;
        opened.list.classList.add('hidden');
        opened.toggle.setAttribute('aria-expanded', 'false');
        opened.box.classList.remove('is-open');
        var box = opened.box;
        opened = null;
        box.dispatchEvent(new CustomEvent('shary:select-close', { bubbles: true }));   // القايمة اتقفلت (فلتر العروض بيستناه)
    }

    document.querySelectorAll('[data-select]').forEach(function (box) {
        var select = box.querySelector('select');
        var native = box.querySelector('[data-select-native]');
        var toggle = box.querySelector('[data-select-toggle]');
        var list = box.querySelector('[data-select-list]');
        var label = box.querySelector('[data-select-label]');
        if (!select || !toggle || !list || !label) return;
        var items = Array.prototype.slice.call(list.querySelectorAll('[role="option"]'));
        var multi = select.multiple;
        var self = { box: box, list: list, toggle: toggle };

        // ---- خانة البحث فوق القايمة
        var english = (document.documentElement.getAttribute('lang') || '').toLowerCase().indexOf('en') === 0;
        var plain = function (text) {
            return String(text || '').toLowerCase().replace(/[\u064B-\u0652\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\s+/g, ' ').trim();
        };
        var search = null, empty = null;
        var visible = function () { return items.filter(function (item) { return !item.hidden; }); };
        var filter = function () {
            var query = plain(search ? search.value : ''), shown = 0;
            items.forEach(function (item) {
                var name = item.querySelector('[data-select-name]');
                var hit = !query || plain((name || item).textContent + ' ' + (item.getAttribute('data-value') || '').replace(/-/g, ' ')).indexOf(query) > -1;
                item.hidden = !hit;
                if (hit) shown++;
            });
            if (empty) empty.hidden = shown > 0;
        };
        // البحث في كل قوايم الفلاتر (فورم GET) — وفي قوايم الفورمات لما الاختيارات تبقى أكتر من 6 (قايمة من 3 اختيارات مش محتاجة بحث)
        var inFilter = !!(select.form && String(select.form.getAttribute('method') || 'get').toLowerCase() === 'get');
        if (items.length && !box.hasAttribute('data-select-nosearch') && (inFilter || items.length > 6 || box.hasAttribute('data-select-search'))) {
            var row = document.createElement('li');
            row.className = 'req-menu__search';
            row.setAttribute('role', 'presentation');
            search = document.createElement('input');
            search.type = 'search';
            search.autocomplete = 'off';
            search.setAttribute('enterkeyhint', 'search');
            search.placeholder = list.getAttribute('data-search-placeholder') || (english ? 'Search…' : 'ابحث…');
            search.setAttribute('aria-label', search.placeholder);
            row.appendChild(search);
            list.insertBefore(row, list.firstChild);
            empty = document.createElement('li');
            empty.className = 'req-menu__empty';
            empty.setAttribute('role', 'presentation');
            empty.hidden = true;
            empty.textContent = list.getAttribute('data-search-empty') || (english ? 'No matches' : 'مفيش نتيجة بالاسم ده');
            list.appendChild(empty);
            search.addEventListener('input', filter);
            search.addEventListener('click', function (event) { event.stopPropagation(); });
            search.addEventListener('keydown', function (event) {
                var shown = visible();
                if (event.key === 'ArrowDown') { event.preventDefault(); event.stopPropagation(); if (shown[0]) shown[0].focus(); }
                else if (event.key === 'Enter') { event.preventDefault(); event.stopPropagation(); if (search.value && shown[0]) choose(shown[0]); }
                else if (event.key !== 'Escape') event.stopPropagation();   // المسافة والحروف للكتابة مش لاختيار عنصر
            });
        }

        native.classList.add('hidden');
        toggle.classList.remove('hidden');

        function option(value) {
            for (var i = 0; i < select.options.length; i++) if (select.options[i].value === value) return select.options[i];
            return null;
        }

        // الزرار والعلامات على حسب قيمة الـ select
        function sync() {
            var names = [];
            items.forEach(function (item) {
                var opt = option(item.getAttribute('data-value'));
                var on = !!opt && opt.selected && opt.value !== '';
                item.setAttribute('aria-selected', on ? 'true' : 'false');
                if (on) names.push(item.querySelector('[data-select-name]').textContent.trim());
            });
            var text = label.getAttribute('data-label');
            // اختيار واحد: اسمه. أكتر من واحد (مميزات الوحدة): أول اسم + عدد الباقي
            if (names.length) text = names[0] + (names.length > 1 ? ' +' + (names.length - 1) : '');
            label.textContent = text;
            label.classList.toggle('is-empty', names.length === 0);
            if (names.length) toggle.classList.remove('is-invalid');
        }

        function open() {
            closeOpened();
            list.classList.remove('hidden');
            toggle.setAttribute('aria-expanded', 'true');
            box.classList.add('is-open');
            opened = self;
            // كل فتحة: البحث فاضي وكل الاختيارات ظاهرة — وعلى الكمبيوتر المؤشر بيبقى في خانة البحث (على الموبايل الكيبورد ما يطلعش غير لما يضغط عليها)
            if (search) {
                search.value = '';
                filter();
                if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) window.setTimeout(function () { search.focus(); }, 0);
            }
            var current = list.querySelector('[aria-selected="true"]');
            if (current && !multi) list.scrollTop = Math.max(0, current.offsetTop - 60);
            // القايمة تحت الخانة: لو آخرها تحت الشاشة الصفحة بتنزل لها
            var rect = list.getBoundingClientRect();
            var space = (window.innerHeight || document.documentElement.clientHeight) - 96;
            if (rect.bottom > space) window.scrollBy({ top: Math.min(rect.bottom - space, toggle.getBoundingClientRect().top - 96), behavior: 'smooth' });
        }

        function choose(item) {
            var opt = option(item.getAttribute('data-value'));
            if (!opt) return;
            if (multi) opt.selected = !opt.selected;
            else select.value = opt.selected ? '' : opt.value;
            select.classList.toggle('has-value', !!select.value);
            select.dispatchEvent(new Event('change', { bubbles: true }));
            if (!multi) { closeOpened(); toggle.focus(); }
        }

        toggle.addEventListener('click', function () { if (opened === self) closeOpened(); else open(); });
        toggle.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowDown') { event.preventDefault(); if (opened !== self) open(); if (items[0]) items[0].focus(); }
        });
        list.addEventListener('click', function (event) {
            var item = event.target.closest ? event.target.closest('[role="option"]') : null;
            if (item) choose(item);
        });
        list.addEventListener('keydown', function (event) {
            // التنقل بالأسهم بين الاختيارات الظاهرة بس (بعد البحث) — والسهم لفوق من أول اختيار بيرجع لخانة البحث
            var shown = visible();
            var index = shown.indexOf(document.activeElement);
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                if (event.key === 'ArrowUp' && index === 0 && search) { search.focus(); return; }
                var next = shown[Math.max(0, Math.min(shown.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)))];
                if (next) next.focus();
            } else if ((event.key === 'Enter' || event.key === ' ') && index > -1) {
                event.preventDefault();
                choose(shown[index]);
            }
        });
        select.addEventListener('change', sync);
        if (select.form) select.form.addEventListener('reset', function () { setTimeout(sync, 0); });
        // الاختيارات اتبدّلت من بره (مشاريع المنطقة المختارة في فورم بيع / تأجير عقار — lead-forms.js): box.dispatchEvent(new CustomEvent('shary:select-refresh'))
        box.addEventListener('shary:select-refresh', function () {
            items = Array.prototype.slice.call(list.querySelectorAll('[role="option"]'));
            if (search) search.value = '';
            filter();
            sync();
        });
        sync();
    });

    document.addEventListener('click', function (event) {
        if (opened && !opened.box.contains(event.target)) closeOpened();
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && opened) { var toggle = opened.toggle; closeOpened(); toggle.focus(); }
    });
})();
