/**
 * صفحة المفضلة وصفحة المقارنة (resources/views/saved/*.blade.php)
 * - التبويب [data-saved-tab="units | projects"] بيبدّل بين اللوحتين [data-saved-panel] من غير تحميل.
 * - المفضلة: القلب على أي كارت بيشيله من المفضلة — الكارت [data-saved-item] بيختفي والعدد بيتحدّث، ولو التبويب فضي بتظهر رسالة [data-saved-empty].
 *   زرار "قارن بين المحفوظ" [data-saved-compare]: بيحط أول 4 عناصر من التبويب المفتوح في المقارنة ويفتح صفحة المقارنة.
 * - المقارنة: زرار X [data-compare-remove="units/slug"] بيشيل العمود (كل الخلايا اللي عليها data-col بنفس القيمة) ومن المحفوظ على الجهاز.
 *   "مسح الكل" [data-compare-clear] بيفضي التبويب ، "الفروق فقط" [data-compare-diff] بيخفي الصفوف اللي قيمها متساوية ،
 *   وشارة الأفضل بتتحط على أقل / أكبر data-value في الصف اللي عليه data-compare-best="min | max" (النص من data-best-label).
 * - window.SharySaved.refresh(panel): بتحدّث العدد والرسالة والشارات بعد ما تضيفوا / تشيلوا عناصر بنفسكم (AJAX).
 */
(function () {
    // قيمة الخلية من غير شارة الأفضل
    function cellText(cell) {
        var copy = cell.cloneNode(true);
        Array.prototype.forEach.call(copy.querySelectorAll('.compare-best'), function (badge) { badge.parentNode.removeChild(badge); });
        return copy.textContent.replace(/\s+/g, ' ').trim();
    }

    // شارة الأفضل + تعليم الصفوف المتساوية (لـ "الفروق فقط")
    function mark(panel, table) {
        var different = 0;
        Array.prototype.forEach.call(table.querySelectorAll('.compare-row[data-compare-row]'), function (row) {
            var cells = Array.prototype.slice.call(row.querySelectorAll('.compare-cell'));
            cells.forEach(function (cell) {
                cell.classList.remove('is-best');
                Array.prototype.forEach.call(cell.querySelectorAll('.compare-best'), function (badge) { cell.removeChild(badge); });
            });
            var texts = cells.map(cellText);
            var same = cells.length < 2 || texts.every(function (value) { return value === texts[0]; });
            row.classList.toggle('is-same', same);
            if (!same) different++;

            var mode = row.getAttribute('data-compare-best');
            if (!mode || cells.length < 2) return;
            var values = cells.map(function (cell) { return parseFloat(cell.getAttribute('data-value')); });
            if (values.some(function (value) { return !(value > 0); })) return;   // قيمة ناقصة: مفيش شارة
            var best = mode === 'max' ? Math.max.apply(null, values) : Math.min.apply(null, values);
            if (values.every(function (value) { return value === best; })) return;
            cells.forEach(function (cell, index) {
                if (values[index] !== best) return;
                cell.classList.add('is-best');
                var badge = document.createElement('span');
                badge.className = 'compare-best';
                badge.textContent = row.getAttribute('data-best-label') || '';
                cell.appendChild(badge);
            });
        });
        var notice = panel.querySelector('[data-compare-same]');
        if (notice) notice.classList.toggle('hidden', !(table.hasAttribute('data-diff-only') && different === 0 && table.querySelectorAll('.compare-row--head .compare-cell').length > 1));
    }

    function refresh(panel) {
        var page = panel.closest('[data-saved-page]');
        var name = panel.getAttribute('data-saved-panel');
        var table = panel.querySelector('[data-compare-table]');
        var total = table ? table.querySelectorAll('.compare-row--head .compare-cell').length : panel.querySelectorAll('[data-saved-item]').length;
        page.querySelectorAll('[data-saved-count="' + name + '"]').forEach(function (badge) { badge.textContent = total; });
        var content = panel.querySelector('[data-saved-content]');
        var empty = panel.querySelector('[data-saved-empty]');
        if (content) content.classList.toggle('hidden', total === 0);
        if (empty) empty.classList.toggle('hidden', total > 0);
        if (table) table.style.setProperty('--cols', Math.max(total, 1));
        var hint = panel.querySelector('[data-compare-hint]');
        if (hint) hint.classList.toggle('hidden', total !== 1);

        // شريط الأدوات: العدد + إظهار / إخفاء الأزرار حسب العدد
        var actions = panel.querySelector('[data-saved-actions]');
        if (actions) actions.classList.toggle('hidden', total === 0);
        var count = panel.querySelector('[data-compare-total]');
        if (count) count.textContent = total;
        var diff = panel.querySelector('[data-compare-diff]');
        if (diff) {
            diff.classList.toggle('hidden', total < 2);
            if (total < 2 && table) { table.removeAttribute('data-diff-only'); diff.setAttribute('aria-pressed', 'false'); }
        }
        var add = panel.querySelector('[data-compare-add]');
        if (add) add.classList.toggle('hidden', total >= 4);
        if (table) mark(panel, table);
        syncCompareButton(page);
    }

    // "قارن بين المحفوظ" في المفضلة: بيظهر لو التبويب المفتوح فيه 2 أو أكتر
    function syncCompareButton(page) {
        var button = page.querySelector('[data-saved-compare]');
        if (!button) return;
        var open = page.querySelector('[data-saved-panel]:not(.hidden)');
        button.classList.toggle('hidden', !open || open.querySelectorAll('[data-saved-item]').length < 2);
    }
    window.SharySaved = { refresh: refresh };

    document.querySelectorAll('[data-saved-page]').forEach(function (page) {
        var tabs = Array.prototype.slice.call(page.querySelectorAll('[data-saved-tab]'));
        function open(name) {
            tabs.forEach(function (tab) { tab.setAttribute('aria-selected', tab.getAttribute('data-saved-tab') === name ? 'true' : 'false'); });
            page.querySelectorAll('[data-saved-panel]').forEach(function (panel) { panel.classList.toggle('hidden', panel.getAttribute('data-saved-panel') !== name); });
            syncCompareButton(page);
        }
        tabs.forEach(function (tab) { tab.addEventListener('click', function () { open(tab.getAttribute('data-saved-tab')); }); });
        page.querySelectorAll('[data-saved-panel]').forEach(function (panel) { if (panel.querySelector('[data-compare-table]')) mark(panel, panel.querySelector('[data-compare-table]')); });

        // المفضلة: أي عنصر محفوظ على الجهاز واتبعت في اللينك (?ids=) والصفحة ما عرضتهوش (اتمسح / اتباع) بيتشال من المحفوظ ،
        // عشان عدد القلب في الهيدر يبقى زي اللي ظاهر في الصفحة — والصفحة الفاضية يبقى قلبها فاضي
        if (page.getAttribute('data-saved-page') === 'favorites') {
            try {
                var asked = (/[?&]ids=([^&#]*)/.exec(window.location.search) || ['', ''])[1];
                asked = asked ? decodeURIComponent(asked).split(',').filter(Boolean) : [];
                var rendered = Array.prototype.map.call(page.querySelectorAll('[data-saved-item]'), function (item) { return item.getAttribute('data-saved-item'); });
                var gone = asked.filter(function (id) { return rendered.indexOf(id) === -1; });
                if (gone.length) {
                    var kept = (JSON.parse(window.localStorage.getItem('shary-favorites')) || []).filter(function (id) { return gone.indexOf(id) === -1; });
                    window.localStorage.setItem('shary-favorites', JSON.stringify(kept));
                    if (window.SharyCards) window.SharyCards.refresh(document);
                }
            } catch (error) { /* التخزين مقفول */ }
        }

        // المفضلة: الكارت اللي اتشال قلبه بيختفي
        page.addEventListener('shary:favorite', function (event) {
            if (page.getAttribute('data-saved-page') !== 'favorites' || event.detail.active) return;
            var item = event.target.closest('[data-saved-item]');
            if (!item) return;
            var panel = item.closest('[data-saved-panel]');
            item.parentNode.removeChild(item);
            refresh(panel);
        });

        page.addEventListener('click', function (event) {
            if (!event.target.closest) return;

            // المفضلة: "قارن بين المحفوظ" — أول 4 من التبويب المفتوح بيتحطوا مكان المقارنة الحالية لنفس النوع، واللينك بياخدهم
            var send = event.target.closest('[data-saved-compare]');
            if (send && window.SharyCompare) {
                var open = page.querySelector('[data-saved-panel]:not(.hidden)');
                var group = open.getAttribute('data-saved-panel');
                var picked = Array.prototype.map.call(open.querySelectorAll('[data-saved-item]'), function (item) { return item.getAttribute('data-saved-item'); }).slice(0, 4);
                var list = window.SharyCompare.read().filter(function (id) { return id.indexOf(group + '/') !== 0; }).concat(picked);
                window.SharyCompare.write(list);
                var parts = [];
                ['units', 'projects'].forEach(function (name) {
                    var slugs = list.filter(function (id) { return id.indexOf(name + '/') === 0; }).map(function (id) { return id.slice(name.length + 1); });
                    if (slugs.length) parts.push(name + '=' + slugs.join(','));
                });
                parts.push('tab=' + group);
                var base = send.getAttribute('data-base') || send.getAttribute('href') || '';
                if (base && base !== '#') send.setAttribute('href', base + (base.indexOf('?') === -1 ? '?' : '&') + parts.join('&'));
                return;   // اللينك بيكمّل لصفحة المقارنة
            }

            // المقارنة: "الفروق فقط"
            var diff = event.target.closest('[data-compare-diff]');
            if (diff) {
                var diffPanel = diff.closest('[data-saved-panel]');
                var diffTable = diffPanel.querySelector('[data-compare-table]');
                var on = diff.getAttribute('aria-pressed') !== 'true';
                diff.setAttribute('aria-pressed', on ? 'true' : 'false');
                if (on) diffTable.setAttribute('data-diff-only', ''); else diffTable.removeAttribute('data-diff-only');
                mark(diffPanel, diffTable);
                return;
            }

            // المقارنة: X بيشيل عمود ، "مسح الكل" بيشيل كل أعمدة التبويب
            var button = event.target.closest('[data-compare-remove], [data-compare-clear]');
            if (!button) return;
            event.preventDefault();
            var panel = button.closest('[data-saved-panel]');
            var one = button.getAttribute('data-compare-remove');
            var removed = [];
            Array.prototype.forEach.call(panel.querySelectorAll('[data-col]'), function (cell) {
                var id = cell.getAttribute('data-col');
                if (one && id !== one) return;
                if (removed.indexOf(id) === -1) removed.push(id);
                cell.parentNode.removeChild(cell);
            });
            if (window.SharyCompare) window.SharyCompare.write(window.SharyCompare.read().filter(function (item) { return removed.indexOf(item) === -1; }));
            refresh(panel);
            removed.forEach(function (id) {
                panel.dispatchEvent(new CustomEvent('shary:compare', { bubbles: true, detail: { id: id, active: false } }));
            });
        });
    });
    // X اللي في هيدر صفحة المقارنة [data-compare-close] (بره لوحة المقارنة): بيقفل المقارنة كلها (وحدات ومشاريع) — الزرار العايم بيختفي من كل الصفحات —
    // وبيرجّع العميل للصفحة اللي كان فيها (أو data-back لو فتح المقارنة مباشرة). الحدث shary:compare-clear ({ ids }) عشان السيرفر يتحدّث.
    document.addEventListener('click', function (event) {
        var closeAll = event.target.closest ? event.target.closest('[data-compare-close]') : null;
        if (!closeAll) return;
        var ids = window.SharyCompare ? window.SharyCompare.read() : [];
        if (window.SharyCompare) window.SharyCompare.write([]);
        var go = closeAll.dispatchEvent(new CustomEvent('shary:compare-clear', { bubbles: true, cancelable: true, detail: { ids: ids } }));
        if (!go) return;   // اللي سمع الحدث هو اللي هينقل العميل
        if (window.history.length > 1 && document.referrer) window.history.back(); else window.location.href = closeAll.getAttribute('data-back') || '/';
    });
})();
