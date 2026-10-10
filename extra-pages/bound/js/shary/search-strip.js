/**
 * خانة البحث اللي فوق صفحات المشروع / الوحدة / عرض الكل (property/partials/search-strip): بحث جوه الصفحة نفسها.
 * - وهو بيكتب بتطلع اقتراحات من عناصر الصفحة (data-strip-items — أو من data-strip-suggest-url?q= لو موجود) بنفس شكل اقتراحات صفحة البحث.
 * - الضغط على اقتراح (أو Enter على أول اقتراح) بيفتح العنصر نفسه — مش صفحة البحث.
 * - من غير عناصر: الفورم بيتبعت عادي لصفحة البحث (GET ?q=).
 * حدث على الفورم: shary:strip-pick ({ item }) قبل الفتح — امنعوه لو هتتصرفوا بطريقة تانية.
 */
(function () {
    function plain(text) {
        return String(text || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\s+/g, ' ').trim();
    }
    document.querySelectorAll('[data-search-strip]').forEach(function (form) {
        var items = [];
        try { items = JSON.parse(form.getAttribute('data-strip-items') || '[]') || []; } catch (error) { items = []; }
        var remote = form.getAttribute('data-strip-suggest-url') || '';
        if (!items.length && !remote) return;   // مفيش بحث جوه الصفحة: الفورم بيفتح صفحة البحث عادي
        var input = form.querySelector('input[type="search"]');
        var bar = form.querySelector('.search-bar');
        if (!input || !bar) return;
        var panel = null, shown = [], active = -1, hideTimer = 0, asked = 0;
        items.forEach(function (item) { item.__hay = plain([item.title, item.sub, item.kind, item.keys].join(' ')); });

        function hide() { clearTimeout(hideTimer); if (panel) panel.hidden = true; shown = []; active = -1; input.setAttribute('aria-expanded', 'false'); }
        function open(item) {
            if (!form.dispatchEvent(new CustomEvent('shary:strip-pick', { bubbles: true, cancelable: true, detail: { item: item } }))) return;
            hide(); input.blur();
            // لينك حقيقي (عشان أي كود بيتابع اللينكات يشتغل زي الضغط العادي)
            var link = document.createElement('a');
            link.href = item.url; link.hidden = true;
            form.appendChild(link); link.click(); form.removeChild(link);
        }
        function draw(found) {
            if (!panel) {
                panel = document.createElement('div');
                panel.className = 'search-suggest';
                panel.setAttribute('role', 'listbox');
                panel.setAttribute('aria-label', input.getAttribute('data-suggest-label') || '');
                bar.appendChild(panel);
            }
            panel.textContent = '';
            if (!found.length) {
                var none = document.createElement('p');
                none.className = 'search-suggest__none';
                none.textContent = form.getAttribute('data-none') || '';
                panel.appendChild(none);
            }
            shown = found.map(function (item) {
                var node = document.createElement('button');
                node.type = 'button';
                node.className = 'search-suggest__row';
                node.setAttribute('role', 'option');
                if (item.image) {
                    var thumb = document.createElement('span'); thumb.className = 'search-suggest__thumb';
                    var image = document.createElement('img'); image.alt = ''; image.loading = 'lazy'; image.src = item.image;
                    image.style.borderRadius = '10px'; image.style.objectFit = 'cover';
                    image.addEventListener('error', function () { thumb.remove(); });
                    thumb.appendChild(image); node.appendChild(thumb);
                }
                var name = document.createElement('span'); name.className = 'search-suggest__name';
                name.textContent = item.title || '';
                if (item.sub) { var sub = document.createElement('small'); sub.className = 'search-suggest__sub'; sub.textContent = item.sub; name.appendChild(sub); }
                node.appendChild(name);
                if (item.kind) { var kind = document.createElement('span'); kind.className = 'search-suggest__kind'; kind.textContent = item.kind; node.appendChild(kind); }
                node.addEventListener('mousedown', function (event) { event.preventDefault(); });
                node.addEventListener('click', function () { open(item); });
                panel.appendChild(node);
                return { node: node, item: item };
            });
            active = -1;
            panel.hidden = false;
            input.setAttribute('aria-expanded', 'true');
        }
        function suggest() {
            var q = input.value.trim();
            var words = plain(q).split(' ').filter(Boolean);
            if (!words.length) { hide(); return; }
            if (remote) {
                var ticket = ++asked;
                fetch(remote + (remote.indexOf('?') > -1 ? '&' : '?') + 'q=' + encodeURIComponent(q), { headers: { 'Accept': 'application/json' } })
                    .then(function (response) { return response.ok ? response.json() : []; })
                    .then(function (list) { if (ticket === asked) draw((Array.isArray(list) ? list : (list.items || [])).slice(0, 8)); })
                    .catch(function () { if (ticket === asked) draw([]); });
                return;
            }
            var smart = window.SharyText, found;
            if (smart) {
                // البحث الذكي (js/shary/smart-text.js): بالأقرب
                found = items.map(function (item) { return { item: item, score: smart.score(q, [item.title, item.sub, item.keys].join(' | ')) }; })
                    .filter(function (row) { return row.score > 0; })
                    .sort(function (a, b) { return b.score - a.score; })
                    .map(function (row) { return row.item; });
            } else {
                found = items.filter(function (item) { return words.every(function (word) { return item.__hay.indexOf(word) > -1; }); });
                // اللي اسمه بيبدأ بالكلمة الأول
                found.sort(function (a, b) { return (plain(b.title).indexOf(words[0]) === 0) - (plain(a.title).indexOf(words[0]) === 0); });
            }
            draw(found.slice(0, 8));
        }
        function mark(index) { active = index; shown.forEach(function (row, i) { row.node.classList.toggle('is-active', i === index); }); }

        input.setAttribute('role', 'combobox'); input.setAttribute('aria-autocomplete', 'list'); input.setAttribute('aria-expanded', 'false');
        input.addEventListener('input', suggest);
        input.addEventListener('focus', suggest);
        input.addEventListener('blur', function () { clearTimeout(hideTimer); hideTimer = setTimeout(hide, 180); });
        input.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                if (!shown.length) return;
                event.preventDefault();
                mark((active + (event.key === 'ArrowDown' ? 1 : shown.length - 1) + (active < 0 && event.key === 'ArrowUp' ? 1 : 0)) % shown.length);
            } else if (event.key === 'Escape') { hide(); }
        });
        // Enter / زرار البحث: أول اقتراح (أو المتعلّم) — مفيش تحويل لصفحة البحث
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            if (!shown.length) { suggest(); return; }
            open((shown[active > -1 ? active : 0] || shown[0]).item);
        });
    });
})();
