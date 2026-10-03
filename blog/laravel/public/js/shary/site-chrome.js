/**
 * الهيدر والفوتر:
 * - زرار القائمة في الموبايل بيفتح ويقفل روابط الهيدر.
 * - مجموعات الفوتر في الموبايل بتفتح وتقفل (في الديسك توب مفتوحة دايمًا من الـ CSS).
 * - رابط له قايمة فرعية في الهيدر (زي "الوكلاء" ← "الوكلاء المعتمدون"): الضغط بيفتح القايمة ويقفلها،
 *   وبتتقفل لما تضغط براها أو تدوس Esc.
 * - المفضلة (القلب على أي كارت): الضغط بيخليها حمراء (aria-pressed) وضغطة تانية بترجّعها. الحالة بتتحفظ على المتصفح
 *   بالـ data-favorite-id، وبيتبعت حدث shary:favorite ({ id, active }) عشان الباك إند يحفظها في حساب العميل.
 *   قلب الهيدر (data-favorites-indicator) بيبقى أحمر وعليه العدد طول ما فيه حاجة في المفضلة، وبيفتح صفحة المفضلة.
 * - المشاركة (data-share-url): موبايل = قايمة المشاركة بتاعة الموبايل، ولو مش متاحة بتطلع قايمة شاري من تحت (واتساب/تيليجرام/فيسبوك/X/البريد/نسخ).
 *   ديسك توب = نسخ اللينك + "تم نسخ الرابط". حدث shary:share ({ url, title }) — ممكن تغيّر detail.url أو تمنعه.
 * - زرار الرجوع (window.SharyBack): أي حاجة بتتفتح فوق الصفحة (تصفية، لوحات الفلاتر، طلب الاجتماع، Shary AI، قايمة المشاركة)
 *   بتتسجل في تاريخ المتصفح، فزرار الرجوع (أو سحبة الرجوع في الموبايل) بيقفلها والعميل بيفضل في نفس الصفحة ونفس المكان بدل ما يخرج منها.
 * - المقارنة (data-compare-toggle + data-compare-id): بتظهر زرار المقارنة تحت (data-compare-bar) بعدد المختار، وبيفتح صفحة المقارنة. حدث shary:compare.
 */
(function () {
    // ---- زرار الرجوع بيقفل اللي مفتوح بدل ما يخرج من الصفحة
    // opened(close): بتتنادى لما لوحة تتفتح. closed(after): لما تتقفل من X / Esc / الضغط براها (after بتتنفذ بعد ما التاريخ يرجع خطوة).
    window.SharyBack = (function () {
        var open = [];        // دوال القفل للّوحات المفتوحة (الأحدث في الآخر)
        var skip = 0;         // رجوع إحنا اللي طلبناه (مش العميل)
        var busy = false;     // القفل جاي من زرار الرجوع
        var waiting = null;
        var timer = null;

        function done() {
            clearTimeout(timer);
            var after = waiting;
            waiting = null;
            if (after) after();
        }

        window.addEventListener('popstate', function () {
            if (skip) { skip--; done(); return; }
            var close = open.pop();
            if (!close) return;
            busy = true;
            try { close(); } finally { busy = false; }
        });

        return {
            opened: function (close) {
                open.push(close);
                try { history.pushState({ sharyOverlay: open.length }, ''); } catch (error) { /* التاريخ مش متاح: اللوحة بتشتغل عادي من غيره */ }
            },
            closed: function (after) {
                if (busy || !open.length) { if (after) after(); return; }
                open.pop();
                var state = null;
                try { state = history.state; } catch (error) { /* مش متاح */ }
                if (!state || !state.sharyOverlay) { if (after) after(); return; }
                skip++;
                waiting = after || null;
                timer = setTimeout(function () { skip = 0; done(); }, 500);
                history.back();
            }
        };
    })();

    document.querySelectorAll('[data-nav-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
            var nav = document.getElementById(button.getAttribute('aria-controls'));
            if (!nav) return;
            var isOpen = !nav.classList.toggle('hidden');
            button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    });

    document.querySelectorAll('[data-footer-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
            var list = button.nextElementSibling;
            if (!list) return;
            var isOpen = !list.classList.toggle('hidden');
            list.classList.toggle('flex', isOpen);
            button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    });
    var dropdowns = Array.prototype.slice.call(document.querySelectorAll('[data-nav-dropdown]'));

    function setDropdown(dropdown, open) {
        var toggle = dropdown.querySelector('[data-nav-dropdown-toggle]');
        var menu = dropdown.querySelector('[data-nav-dropdown-menu]');
        if (!toggle || !menu) return;
        menu.classList.toggle('hidden', !open);
        menu.classList.toggle('flex', open && menu.classList.contains('flex-col'));
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        var arrow = toggle.querySelector('[data-nav-dropdown-arrow]');
        if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
    }

    dropdowns.forEach(function (dropdown) {
        var toggle = dropdown.querySelector('[data-nav-dropdown-toggle]');
        if (!toggle) return;
        toggle.addEventListener('click', function () {
            var open = toggle.getAttribute('aria-expanded') !== 'true';
            dropdowns.forEach(function (other) { setDropdown(other, other === dropdown && open); });
        });
        dropdown.querySelectorAll('[data-nav-dropdown-menu] a').forEach(function (link) {
            link.addEventListener('click', function () { setDropdown(dropdown, false); });
        });
    });

    document.addEventListener('click', function (event) {
        dropdowns.forEach(function (dropdown) {
            if (!dropdown.contains(event.target)) setDropdown(dropdown, false);
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') dropdowns.forEach(function (dropdown) { setDropdown(dropdown, false); });
    });
    // ---- رسالة صغيرة تحت الشاشة (مثلاً: "تم نسخ الرابط")
    var toastNode = null;
    var toastTimer = null;
    function toast(text) {
        if (!toastNode) {
            toastNode = document.createElement('div');
            toastNode.setAttribute('role', 'status');
            toastNode.className = 'shary-toast';
            document.body.appendChild(toastNode);
        }
        toastNode.textContent = text;
        toastNode.classList.add('is-shown');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastNode.classList.remove('is-shown'); }, 2600);
    }
    function english(node) {
        var holder = node.closest('[lang]');
        return ((holder && holder.lang) || document.documentElement.lang || 'ar').indexOf('en') === 0;
    }

    // ---- المفضلة: القلب على الكارت بيبقى أحمر، وقلب الهيدر بيبقى أحمر وعليه العدد طول ما فيه حاجة في المفضلة
    var favoriteKey = 'shary-favorites';
    var memory = [];

    function readFavorites() {
        try { return JSON.parse(window.localStorage.getItem(favoriteKey)) || []; } catch (error) { return memory; }
    }

    function writeFavorites(list) {
        memory = list;
        try { window.localStorage.setItem(favoriteKey, JSON.stringify(list)); } catch (error) { /* التخزين مش متاح: الحالة بتفضل على الصفحة بس */ }
    }

    function showFavorites() {
        var pressed = document.querySelectorAll('[data-favorite-toggle][aria-pressed="true"]').length;
        var total = Math.max(readFavorites().length, pressed);
        document.querySelectorAll('[data-favorites-indicator]').forEach(function (indicator) {
            indicator.setAttribute('data-active', total > 0 ? 'true' : 'false');
            var badge = indicator.querySelector('[data-favorites-count]');
            if (badge) { badge.textContent = total; badge.classList.toggle('hidden', total === 0); }
        });
    }

    document.querySelectorAll('[data-favorite-toggle]').forEach(function (button) {
        var id = button.getAttribute('data-favorite-id');
        if (id && readFavorites().indexOf(id) !== -1) button.setAttribute('aria-pressed', 'true');

        button.addEventListener('click', function () {
            var active = button.getAttribute('aria-pressed') !== 'true';
            button.setAttribute('aria-pressed', active ? 'true' : 'false');
            if (id) {
                var list = readFavorites().filter(function (item) { return item !== id; });
                if (active) list.push(id);
                writeFavorites(list);
            }
            showFavorites();
            button.dispatchEvent(new CustomEvent('shary:favorite', { bubbles: true, detail: { id: id, active: active } }));
        });
    });
    showFavorites();

    // ---- المشاركة
    // موبايل: قايمة المشاركة بتاعة الموبايل نفسه (واتساب، ماسنجر، ...). لو المتصفح مش بيدعمها أو منعها، بتطلع قايمة شاري من تحت
    //         (واتساب / تيليجرام / فيسبوك / X / البريد / نسخ الرابط) — يعني زرار المشاركة عمره ما بيبقى "نسخ بس" على الموبايل.
    // ديسك توب: نسخ اللينك + "تم نسخ الرابط".
    // حدث shary:share ({ url, title }): أي كود ممكن يغيّر detail.url / detail.title، أو يستلم المشاركة مكاننا بـ preventDefault().
    var nativeShareBlocked = false;
    var shareSheet = null;

    function copyText(text, done, failed) {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, failed);
        else failed();
    }

    function closeShareSheet() {
        if (!shareSheet || !shareSheet.classList.contains('is-open')) return;
        shareSheet.classList.remove('is-open');
        window.SharyBack.closed();
    }

    function openShareSheet(url, title, en) {
        if (!shareSheet) {
            shareSheet = document.createElement('div');
            shareSheet.className = 'shary-share';
            shareSheet.setAttribute('role', 'dialog');
            shareSheet.setAttribute('aria-modal', 'true');
            shareSheet.innerHTML =
                '<div class="shary-share__dim" data-share-close></div>' +
                '<div class="shary-share__panel">' +
                    '<span class="shary-share__grip" aria-hidden="true"></span>' +
                    '<div class="shary-share__head"><h3 data-share-heading></h3>' +
                        '<button type="button" class="shary-share__close" data-share-close><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
                    '<div class="shary-share__link"><div><strong data-share-name></strong><span dir="ltr" data-share-link></span></div>' +
                        '<button type="button" data-share-copy></button></div>' +
                    '<div class="shary-share__grid" data-share-targets></div>' +
                '</div>';
            document.body.appendChild(shareSheet);
            shareSheet.addEventListener('click', function (event) {
                if (event.target.closest('[data-share-close]') || event.target.closest('a[data-share-target]')) closeShareSheet();
            });
            document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeShareSheet(); });
        }

        var u = encodeURIComponent(url);
        var t = encodeURIComponent(title);
        var targets = [
            ['shary-share__icon--whatsapp', 'fa-brands fa-whatsapp', en ? 'WhatsApp' : 'واتساب', 'https://wa.me/?text=' + encodeURIComponent(title + '\n' + url)],
            ['shary-share__icon--telegram', 'fa-brands fa-telegram', en ? 'Telegram' : 'تيليجرام', 'https://t.me/share/url?url=' + u + '&text=' + t],
            ['shary-share__icon--facebook', 'fa-brands fa-facebook-f', en ? 'Facebook' : 'فيسبوك', 'https://www.facebook.com/sharer/sharer.php?u=' + u],
            ['shary-share__icon--x', 'fa-brands fa-x-twitter', 'X', 'https://twitter.com/intent/tweet?url=' + u + '&text=' + t],
            ['shary-share__icon--mail', '', en ? 'Email' : 'البريد', 'mailto:?subject=' + t + '&body=' + u]
        ];

        shareSheet.dir = en ? 'ltr' : 'rtl';
        shareSheet.lang = en ? 'en' : 'ar';
        shareSheet.setAttribute('aria-label', en ? 'Share' : 'مشاركة');
        shareSheet.querySelector('[data-share-heading]').textContent = en ? 'Share' : 'مشاركة';
        shareSheet.querySelectorAll('[data-share-close]')[1].setAttribute('aria-label', en ? 'Close' : 'إغلاق');
        shareSheet.querySelector('[data-share-name]').textContent = title;
        var shown = url;
        try { shown = decodeURI(url); } catch (error) { /* لينك فيه ترميز غير سليم: بيتعرض زي ما هو */ }
        shareSheet.querySelector('[data-share-link]').textContent = shown.replace(/^https?:\/\//, '');

        var copyButton = shareSheet.querySelector('[data-share-copy]');
        copyButton.textContent = en ? 'Copy' : 'نسخ';
        copyButton.classList.remove('is-done');
        copyButton.onclick = function () {
            copyText(url, function () {
                copyButton.textContent = en ? 'Copied' : 'تم النسخ';
                copyButton.classList.add('is-done');
            }, function () { toast(url); });
        };

        var grid = shareSheet.querySelector('[data-share-targets]');
        grid.innerHTML = '';
        targets.forEach(function (target) {
            var link = document.createElement('a');
            link.href = target[3];
            link.target = '_blank';
            link.rel = 'noopener';
            link.setAttribute('data-share-target', target[2]);
            var icon = target[1] ? '<i class="' + target[1] + '" aria-hidden="true"></i>' : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7.5 8 6 8-6"/></svg>';
            link.innerHTML = '<span class="shary-share__icon ' + target[0] + '">' + icon + '</span><span></span>';
            link.lastChild.textContent = target[2];
            grid.appendChild(link);
        });
        // "المزيد": قايمة الموبايل نفسه، لو متاحة
        if (navigator.share && !nativeShareBlocked) {
            var more = document.createElement('button');
            more.type = 'button';
            more.innerHTML = '<span class="shary-share__icon shary-share__icon--more"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg></span><span></span>';
            more.lastChild.textContent = en ? 'More' : 'المزيد';
            more.addEventListener('click', function () {
                navigator.share({ title: title, text: title, url: url }).then(closeShareSheet, function (error) {
                    if (!error || error.name !== 'AbortError') { nativeShareBlocked = true; more.remove(); }
                });
            });
            grid.appendChild(more);
        }

        if (!shareSheet.classList.contains('is-open')) {
            shareSheet.classList.add('is-open');
            window.SharyBack.opened(function () { shareSheet.classList.remove('is-open'); });
        }
    }

    document.querySelectorAll('[data-share-url]').forEach(function (button) {
        button.addEventListener('click', function () {
            var detail = {
                url: new URL(button.getAttribute('data-share-url'), location.href).href,
                title: button.getAttribute('data-share-title') || document.title
            };
            if (!button.dispatchEvent(new CustomEvent('shary:share', { bubbles: true, cancelable: true, detail: detail }))) return;
            var url = detail.url;
            var title = detail.title;
            var en = english(button);
            var phone = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

            if (!phone) {
                copyText(url, function () { toast(en ? 'Link copied' : 'تم نسخ الرابط'); }, function () { toast(url); });
                return;
            }
            if (!navigator.share || nativeShareBlocked) { openShareSheet(url, title, en); return; }
            try {
                navigator.share({ title: title, text: title, url: url }).catch(function (error) {
                    if (error && error.name === 'AbortError') return;   // العميل قفل القايمة
                    nativeShareBlocked = true;
                    openShareSheet(url, title, en);
                });
            } catch (error) {
                nativeShareBlocked = true;
                openShareSheet(url, title, en);
            }
        });
    });

    // ---- المقارنة: الضغط على "قارن" بيعلّم المشروع، وبيظهر زرار المقارنة تحت بعدد المشاريع المختارة — الضغط عليه بيفتح صفحة المقارنة
    function showCompare(scope) {
        var bar = scope.querySelector('[data-compare-bar]') || document.querySelector('[data-compare-bar]');
        if (!bar) return [];
        var ids = Array.prototype.map.call(scope.querySelectorAll('[data-compare-toggle][aria-pressed="true"]'), function (item) { return item.getAttribute('data-compare-id') || ''; });
        bar.classList.toggle('hidden', ids.length === 0);
        bar.classList.toggle('flex', ids.length > 0);
        var count = bar.querySelector('[data-compare-count]');
        if (count) count.textContent = ids.length;
        var base = bar.getAttribute('data-base') || '';
        if (base && base !== '#') bar.setAttribute('href', base + (base.indexOf('?') === -1 ? '?' : '&') + 'projects=' + ids.filter(Boolean).join(','));
        return ids;
    }
    document.querySelectorAll('[data-compare-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
            var active = button.getAttribute('aria-pressed') !== 'true';
            button.setAttribute('aria-pressed', active ? 'true' : 'false');
            var ids = showCompare(button.closest('main') || document);
            button.dispatchEvent(new CustomEvent('shary:compare', { bubbles: true, detail: { id: button.getAttribute('data-compare-id'), active: active, ids: ids } }));
        });
    });
})();
