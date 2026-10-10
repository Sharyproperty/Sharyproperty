/**
 * صفحة نتايج البحث — التحميل وأنت نازل (من غير "عرض المزيد"):
 * - العنصر [data-infinite] تحت القايمة [data-results]. أول ما يقرب من الشاشة بيتطلب data-next-url ويتضاف اللي جوه [data-results] في الصفحة الجاية،
 *   وبيتاخد منها لينك الصفحة اللي بعدها. لينك فاضي = دي كل النتايج.
 * - الحالة على العنصر: data-state="idle | loading | done | error" (الـ CSS بيظهر "جاري التحميل" أو "دي كل النتايج").
 * - حدث shary:load-more ({ url, append(nodes, nextUrl) }): امنعوه (preventDefault) لو هتجيبوا النتايج بطريقتكم ونادوا append.
 * - لو بدّلتوا النتايج من غير تحميل الصفحة (فلترة AJAX): ابعتوا على [data-infinite] حدث shary:infinite-reset ({ nextUrl }) عشان التحميل يبدأ من الأول.
 *
 * خانة البحث (input name="q" جوه فورم الفلاتر): بتبحث باسم الكمبوند أو المطور أو المنطقة.
 * - Enter (أو زرار "بحث" في كيبورد الموبايل) أو مسح الخانة بالـ ×: الفورم بيتبعت بنفس طريقة الفلاتر (حدث shary:filter وبعده GET فيه q).
 * - وهو بيكتب: قايمة اقتراحات تحت الخانة من قوايم الفلتر نفسها (المنطقة / المطور / المشروع بالصورة أو اللوجو). الضغط على اقتراح بيعلّم الاختيار ده في الفلتر ويبعت الفورم
 *   (يعني area[] / developer[] / project[] — من غير أي endpoint جديد). الأسهم + Enter بيشتغلوا، و Esc بيقفل القايمة.
 * - وهو بيكتب كمان: حدث shary:search ({ q }) على الفورم بعد ما يقف كتابة — اسمعوه لو عايزين نتايج لايف من غير Enter.
 */
(function () {
    document.querySelectorAll('[data-infinite]').forEach(function (sentinel) {
        var list = sentinel.parentNode.querySelector('[data-results]');
        if (!list) return;
        var busy = false;
        var observer = null;
        var run = 0;   // بيزيد مع كل shary:infinite-reset عشان أي تحميل قديم لسه راجع يتجاهل

        function state(name) { sentinel.setAttribute('data-state', name); }

        function finish() {
            state('done');
            if (observer) { observer.disconnect(); observer = null; }
        }

        function append(nodes, nextUrl) {
            Array.prototype.slice.call(nodes || []).forEach(function (node) { list.appendChild(node); });
            if (window.SharyCards) window.SharyCards.refresh(list);
            sentinel.setAttribute('data-next-url', nextUrl || '');
            busy = false;
            if (!nextUrl || nextUrl === '#') { finish(); return; }
            state('idle');
            // لو العنصر لسه قريب من الشاشة بعد الإضافة (العميل واقف في آخر الصفحة) نكمّل تحميل
            setTimeout(function () { if (near()) load(); }, 60);
        }

        function near() {
            var box = sentinel.getBoundingClientRect();
            return box.height + box.width > 0 && box.top < window.innerHeight + 500 && box.bottom > -500;
        }

        function load() {
            if (busy || sentinel.getAttribute('data-state') === 'done') return;
            var url = sentinel.getAttribute('data-next-url');
            if (!url || url === '#') { finish(); return; }
            busy = true;
            state('loading');
            var mine = run;
            var detail = { url: url, append: function (nodes, nextUrl) { if (mine === run) append(nodes, nextUrl); } };
            if (!sentinel.dispatchEvent(new CustomEvent('shary:load-more', { bubbles: true, cancelable: true, detail: detail }))) return;
            fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                .then(function (response) { if (!response.ok) throw new Error(response.status); return response.text(); })
                .then(function (html) {
                    var page = new DOMParser().parseFromString(html, 'text/html');
                    var incoming = page.querySelector('[data-results]');
                    var next = page.querySelector('[data-infinite]');
                    detail.append(incoming ? incoming.children : [], next ? next.getAttribute('data-next-url') : '');
                })
                .catch(function () { if (mine !== run) return; busy = false; state('error'); });
        }

        function watch() {
            if (observer) return;
            if ('IntersectionObserver' in window) {
                observer = new IntersectionObserver(function (entries) { if (entries[0].isIntersecting) load(); }, { rootMargin: '500px 0px' });
                observer.observe(sentinel);
            } else if (!sentinel.getAttribute('data-scroll-bound')) {
                sentinel.setAttribute('data-scroll-bound', '1');
                window.addEventListener('scroll', function () { if (near()) load(); });
            }
        }

        function start() {
            busy = false;
            if (!sentinel.getAttribute('data-next-url') || sentinel.getAttribute('data-next-url') === '#') { finish(); return; }
            state('idle');
            watch();
            setTimeout(function () { if (near()) load(); }, 60);
        }

        var retry = sentinel.querySelector('[data-infinite-retry]');
        if (retry) retry.addEventListener('click', load);

        // النتايج اتبدّلت من غير تحميل الصفحة (فلترة AJAX): ابعتوا الحدث ده بلينك الصفحة اللي بعدها عشان التحميل يبدأ من الأول
        sentinel.addEventListener('shary:infinite-reset', function (event) {
            run++;
            sentinel.setAttribute('data-next-url', (event.detail && event.detail.nextUrl) || '');
            start();
        });

        start();
    });

    // ---- خانة البحث
    // توحيد النص: حروف صغيرة، من غير تشكيل، وتوحيد الألف والياء والتاء المربوطة — عشان "راس الحكمه" تلاقي "رأس الحكمة"
    function plain(text) {
        return String(text || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
            .replace(/[-_،,]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    document.querySelectorAll('form[data-area-filters] input[name="q"]').forEach(function (input) {
        var form = input.form;
        var bar = input.closest('.search-bar') || input.parentNode;
        var timer = null;
        var hideTimer = null;
        var sent = input.value;
        var panel = null;
        var shown = [];     // الاقتراحات الظاهرة
        var active = -1;    // الاقتراح المتعلّم بالأسهم

        function send() {
            clearTimeout(timer);
            hide();
            sent = input.value;
            // نفس طريق الفلاتر: area-page.js بيسمع submit ويطلع shary:filter. لو مفيش حد سمع، الفورم بيتبعت عادي
            var go = form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            if (go) form.submit();
        }

        // الاقتراحات من قوايم الفلتر نفسها (المنطقة / المطور / المشروع) — اختيار اقتراح = تعليم الاختيار ده في الفلتر وإرسال الفورم
        function options() {
            var out = [];
            ['area', 'developer', 'project'].forEach(function (kind) {
                Array.prototype.forEach.call(form.querySelectorAll('input[name="' + kind + '[]"]'), function (box) {
                    var row = box.closest('label');
                    if (!row || box.checked || box.disabled) return;
                    var nameNode = row.querySelector('[data-list-name]');
                    var name = (nameNode ? nameNode.textContent : row.textContent).trim();
                    // الصورة / اللوجو (ومعاه دايرة الحروف المختصرة اللي بتظهر لو اللوجو ما حملش)
                    var thumb = Array.prototype.filter.call(row.children, function (node) { return node !== nameNode && node !== box; });
                    out.push({ kind: kind, box: box, name: name, text: plain(name + ' ' + box.value), thumb: thumb });
                });
            });
            return out;
        }

        function hide() {
            clearTimeout(hideTimer);
            if (panel) panel.hidden = true;
            shown = [];
            active = -1;
            input.setAttribute('aria-expanded', 'false');
        }

        function mark(index) {
            active = index;
            shown.forEach(function (item, i) { item.node.classList.toggle('is-active', i === index); });
        }

        function choose(item) {
            item.box.checked = true;
            item.box.dispatchEvent(new Event('change', { bubbles: true }));
            input.value = '';
            input.blur();
            send();
        }

        function suggest() {
            var words = plain(input.value).split(' ').filter(Boolean);
            if (!words.length) { hide(); return; }
            var smart = window.SharyText, found;
            if (smart) {
                // البحث الذكي (js/shary/smart-text.js): الهمزات ، العامية ، "شركة" ، من أول حرفين ، غلطة حرف — بالأقرب
                found = options().map(function (item) { item.score = smart.score(input.value, item.name + ' | ' + item.box.value); return item; })
                    .filter(function (item) { return item.score > 0; })
                    .sort(function (a, b) { return b.score - a.score; });
            } else {
                found = options().filter(function (item) { return words.every(function (word) { return item.text.indexOf(word) > -1; }); });
            }
            // لحد 4 من كل نوع، و8 في المجموع
            var count = {};
            found = found.filter(function (item) { count[item.kind] = (count[item.kind] || 0) + 1; return count[item.kind] <= 4; }).slice(0, 8);
            if (!found.length) { hide(); return; }
            if (!panel) {
                panel = document.createElement('div');
                panel.className = 'search-suggest';
                panel.setAttribute('role', 'listbox');
                panel.setAttribute('aria-label', input.getAttribute('data-suggest-label') || '');
                bar.appendChild(panel);
            }
            panel.textContent = '';
            shown = found.map(function (item, index) {
                var node = document.createElement('button');
                node.type = 'button';
                node.className = 'search-suggest__row';
                node.setAttribute('role', 'option');
                var thumb = document.createElement('span');
                thumb.className = 'search-suggest__thumb';
                item.thumb.forEach(function (part) { thumb.appendChild(part.cloneNode(true)); });
                var name = document.createElement('span');
                name.className = 'search-suggest__name';
                name.textContent = item.name;
                var kind = document.createElement('span');
                kind.className = 'search-suggest__kind';
                kind.textContent = input.getAttribute('data-kind-' + item.kind) || '';
                node.appendChild(thumb); node.appendChild(name); node.appendChild(kind);
                node.addEventListener('mousedown', function (event) { event.preventDefault(); });   // الخانة تفضل متعلّمة لحد الضغطة
                node.addEventListener('click', function () { choose(item); });
                panel.appendChild(node);
                return { node: node, box: item.box };
            });
            active = -1;
            panel.hidden = false;
            input.setAttribute('aria-expanded', 'true');
        }

        input.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                if (!shown.length) return;
                event.preventDefault();
                mark((active + (event.key === 'ArrowDown' ? 1 : shown.length - 1) + (active < 0 && event.key === 'ArrowUp' ? 1 : 0)) % shown.length);
            } else if (event.key === 'Escape' && shown.length) {
                event.stopPropagation();
                hide();
            } else if (event.key === 'Enter') {
                event.preventDefault();
                if (active > -1 && shown[active]) { choose(shown[active]); return; }
                input.blur();   // بيقفل كيبورد الموبايل
                send();
            }
        });
        // مسح الخانة بالـ × اللي جواها
        input.addEventListener('search', function () { if (input.value === '' && sent !== '') send(); });
        input.addEventListener('input', function () {
            suggest();
            clearTimeout(timer);
            timer = setTimeout(function () {
                form.dispatchEvent(new CustomEvent('shary:search', { bubbles: true, detail: { q: input.value.trim() } }));
            }, 350);
        });
        input.addEventListener('focus', suggest);
        input.addEventListener('blur', function () { clearTimeout(hideTimer); hideTimer = setTimeout(hide, 180); });
    });
})();
