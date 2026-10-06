/**
 * الهيدر والفوتر:
 * - زرار القائمة في الموبايل بيفتح ويقفل روابط الهيدر.
 * - مجموعات الفوتر في الموبايل بتفتح وتقفل (في الديسك توب مفتوحة دايمًا من الـ CSS).
 * - رابط له قايمة فرعية في الهيدر (زي "الوكلاء" ← "الوكلاء المعتمدون"): الضغط بيفتح القايمة ويقفلها،
 *   وبتتقفل لما تضغط براها أو تدوس Esc.
 * - المفضلة (القلب على أي كارت): الضغط بيخليها حمراء (aria-pressed) وضغطة تانية بترجّعها. الحالة بتتحفظ على المتصفح
 *   بالـ data-favorite-id، وبيتبعت حدث shary:favorite ({ id, active }) عشان الباك إند يحفظها في حساب العميل.
 *   قلب الهيدر (data-favorites-indicator) بيبقى أحمر وعليه العدد طول ما فيه حاجة في المفضلة، وبيفتح صفحة المفضلة.
 * - المشاركة (data-share-url): موبايل = قايمة شاري من تحت (واتساب أول اختيار برسالة الوحدة الجاهزة + "المزيد" لقايمة الموبايل) (واتساب/تيليجرام/فيسبوك/X/البريد/نسخ).
 *   ديسك توب = قايمة صغيرة جنب الزرار (واتساب / فيسبوك / X / تيليجرام / نسخ الرابط). حدث shary:share ({ url, title }) — ممكن تغيّر detail.url أو تمنعه.
 * - واتساب: أي لينك wa.me من غير نص بيتضاف له رسالة جاهزة (اسم الوحدة / المشروع + المكان + السعر + الكود + اللينك) من data-wa-text / data-wa-page — حدث shary:whatsapp ({ text }).
 * - الاتصال على الديسك توب / التابلت: لينك tel: بيفتح قايمة صغيرة (اتصل / واتساب / نسخ الرقم) بدل ما يتجاهله المتصفح.
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

    // قايمة الموبايل: زرار القايمة بيفتحها صفحة كاملة، وبتتقفل من زرار الإغلاق [data-nav-close] أو Esc أو الضغط على أي رابط فيها
    document.querySelectorAll('[data-nav-toggle]').forEach(function (button) {
        var nav = document.getElementById(button.getAttribute('aria-controls'));
        if (!nav) return;
        function setMenu(open) {
            nav.classList.toggle('hidden', !open);
            button.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (open) { var scroll = nav.querySelector('.site-menu__scroll'); if (scroll) scroll.scrollTop = 0; }
        }
        button.addEventListener('click', function () { setMenu(nav.classList.contains('hidden')); });
        nav.addEventListener('click', function (event) {
            if (event.target.closest('[data-nav-close]') || event.target.closest('a')) setMenu(false);
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && !nav.classList.contains('hidden')) setMenu(false);
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
        var saved = readFavorites();
        var total = saved.length;   // العدد = المحفوظ فعلًا (نفس العنصر ممكن يبقى له أكتر من قلب في الصفحة)
        document.querySelectorAll('[data-favorites-indicator]').forEach(function (indicator) {
            indicator.setAttribute('data-active', total > 0 ? 'true' : 'false');
            // لينك صفحة المفضلة: المحفوظ على الجهاز بيتبعت في اللينك (?ids=units/a,projects/b) — العميل المسجل: المفضلة من حسابه على السيرفر
            var base = indicator.getAttribute('data-base') || '';
            if (base && base !== '#') indicator.setAttribute('href', base + (saved.length ? (base.indexOf('?') === -1 ? '?' : '&') + 'ids=' + saved.join(',') : ''));
            var badge = indicator.querySelector('[data-favorites-count]');
            if (badge) { badge.textContent = total; badge.classList.toggle('hidden', total === 0); }
        });
    }

    // الضغطات كلها بتتسمع من الصفحة نفسها، فالكروت اللي بتتضاف بعدين (التحميل وأنت نازل) زرايرها بتشتغل زي الباقي
    function closest(event, selector) { return event.target.closest ? event.target.closest(selector) : null; }

    // بتعلّم القلوب المحفوظة جوه جزء من الصفحة (بتتنادى للكروت الجديدة: window.SharyCards.refresh(root))
    function markFavorites(root) {
        var saved = readFavorites();
        (root || document).querySelectorAll('[data-favorite-toggle]').forEach(function (button) {
            var id = button.getAttribute('data-favorite-id');
            if (id && saved.indexOf(id) !== -1) button.setAttribute('aria-pressed', 'true');
        });
        showFavorites();
    }
    window.SharyCards = { refresh: function (root) { markFavorites(root); markCompare(root); } };

    document.addEventListener('click', function (event) {
        var button = closest(event, '[data-favorite-toggle]');
        if (!button) return;
        var id = button.getAttribute('data-favorite-id');
        var active = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
        if (id) {
            var list = readFavorites().filter(function (item) { return item !== id; });
            if (active) list.push(id);
            writeFavorites(list);
        }
        showFavorites();
        button.dispatchEvent(new CustomEvent('shary:favorite', { bubbles: true, detail: { id: id, active: active } }));
    }, true);   // capture: الزرار بيشتغل حتى لو الكارت اللي حواليه بيوقّف الضغطة (stopPropagation)
    markFavorites(document);

    // ---- المشاركة
    // موبايل: قايمة شاري بتطلع من تحت (واتساب / تيليجرام / فيسبوك / X / البريد / نسخ الرابط) وآخرها "المزيد" بيفتح قايمة الموبايل نفسه.
    // ديسك توب: قايمة صغيرة جنب زرار المشاركة (واتساب / فيسبوك / منصة إكس / تيليجرام / نسخ الرابط).
    // حدث shary:share ({ url, title }): أي كود ممكن يغيّر detail.url / detail.title، أو يستلم المشاركة مكاننا بـ preventDefault().
    var nativeShareBlocked = false;
    var shareSheet = null;

    function copyText(text, done, failed) {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, failed);
        else failed();
    }

    // ---- قايمة صغيرة جنب الزرار (ديسك توب): items = [[كلاس الأيقونة, أيقونة, الاسم, اللينك أو دالة], ...]
    var floatMenu = null;
    function closeMenu() {
        if (!floatMenu) return;
        floatMenu.parentNode.removeChild(floatMenu);
        floatMenu = null;
    }
    document.addEventListener('click', function (event) { if (floatMenu && !floatMenu.contains(event.target)) closeMenu(); }, true);
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeMenu(); });
    window.addEventListener('scroll', closeMenu, { passive: true });
    window.addEventListener('resize', closeMenu);

    function openMenu(anchor, items, en, heading) {
        closeMenu();
        var menu = document.createElement('div');
        menu.className = 'shary-menu';
        menu.setAttribute('role', 'menu');
        menu.dir = en ? 'ltr' : 'rtl';
        if (heading) {
            var head = document.createElement('p');
            head.className = 'shary-menu__head';
            head.textContent = heading;
            menu.appendChild(head);
        }
        items.forEach(function (item) {
            var action = typeof item[3] === 'function';
            var row = document.createElement(action ? 'button' : 'a');
            row.className = 'shary-menu__item';
            row.setAttribute('role', 'menuitem');
            if (action) row.type = 'button';
            else { row.href = item[3]; if (item[3].indexOf('tel:') !== 0) { row.target = '_blank'; row.rel = 'noopener'; } row.setAttribute('data-menu-link', ''); }
            row.innerHTML = '<span class="shary-share__icon ' + item[0] + '">' + item[1] + '</span><span></span>';
            row.lastChild.textContent = item[2];
            row.addEventListener('click', function () { if (action) item[3](row); else setTimeout(closeMenu, 0); });
            menu.appendChild(row);
        });
        document.body.appendChild(menu);
        // مكان القايمة: تحت الزرار (أو فوقه لو مفيش مكان) وجوه حدود الشاشة
        var box = anchor.getBoundingClientRect();
        var width = menu.offsetWidth, height = menu.offsetHeight;
        var left = Math.min(Math.max(8, box.left + box.width / 2 - width / 2), window.innerWidth - width - 8);
        var top = box.bottom + 8;
        if (top + height > window.innerHeight - 8) top = Math.max(8, box.top - height - 8);
        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
        floatMenu = menu;
    }

    var ICON_LINK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.400-6.400l-1 1"/><path d="M14 10a4.500 4.500 0 0 0-6.400 0l-3 3a4.500 4.500 0 0 0 6.400 6.400l1-1"/></svg>';
    var ICON_PHONE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.800a15.100 15.100 0 0 0 6.600 6.600l2.200-2.200a1 1 0 0 1 1-.250 11.400 11.400 0 0 0 3.600.570 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.500a1 1 0 0 1 1 1c0 1.250.200 2.450.570 3.570a1 1 0 0 1-.250 1L6.600 10.800Z"/></svg>';

    function openShareMenu(button, url, title, en) {
        var u = encodeURIComponent(url), t = encodeURIComponent(title);
        openMenu(button, [
            ['shary-share__icon--whatsapp', '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>', en ? 'WhatsApp' : 'واتساب', 'https://wa.me/?text=' + encodeURIComponent(shareMessage(button, url, title))],
            ['shary-share__icon--facebook', '<i class="fa-brands fa-facebook-f" aria-hidden="true"></i>', en ? 'Facebook' : 'فيسبوك', 'https://www.facebook.com/sharer/sharer.php?u=' + u],
            ['shary-share__icon--x', '<i class="fa-brands fa-x-twitter" aria-hidden="true"></i>', en ? 'X' : 'منصة إكس', 'https://twitter.com/intent/tweet?url=' + u + '&text=' + t],
            ['shary-share__icon--telegram', '<i class="fa-brands fa-telegram" aria-hidden="true"></i>', en ? 'Telegram' : 'تيليجرام', 'https://t.me/share/url?url=' + u + '&text=' + t],
            ['shary-share__icon--more', ICON_LINK, en ? 'Copy link' : 'نسخ الرابط', function (row) {
                copyText(url, function () { row.lastChild.textContent = en ? 'Link copied' : 'تم نسخ الرابط'; setTimeout(closeMenu, 900); }, function () { toast(url); closeMenu(); });
            }]
        ], en, en ? 'Share' : 'مشاركة');
    }

    function closeShareSheet() {
        if (!shareSheet || !shareSheet.classList.contains('is-open')) return;
        shareSheet.classList.remove('is-open');
        window.SharyBack.closed();
    }

    function openShareSheet(url, title, en, button) {
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
                    // لوجو شاري في دايرة صغيرة قدام اسم العنصر ولينكه ، وقصادهم زرار "نسخ"
                    '<div class="shary-share__link"><i class="shary-share__logo" aria-hidden="true">' +
                        '<svg width="26" height="22" viewBox="0 0 44 36"><circle cx="13" cy="23" r="11" fill="#FCB424"/><circle cx="31" cy="23" r="11" fill="#4CBFB2"/><circle cx="22" cy="12" r="11" fill="#1F4466"/></svg></i>' +
                        '<div><strong data-share-name></strong><span dir="ltr" data-share-link></span></div>' +
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
        // واتساب: رسالة المشاركة الكاملة (بيانات الوحدة / المشروع + اللينك + لينك الصورة) — من الكارت أو من صفحة العنصر نفسها
        var waText = shareMessage(button, url, title);
        var targets = [
            ['shary-share__icon--whatsapp', 'fa-brands fa-whatsapp', en ? 'WhatsApp' : 'واتساب', 'https://wa.me/?text=' + encodeURIComponent(waText)],
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
                // قايمة الموبايل: نفس الرسالة الكاملة (اللينك جواها) — ولو مفيش بيانات: العنوان + اللينك
                navigator.share(waText.indexOf(url) > -1 ? { title: title, text: waText } : { title: title, text: title, url: url }).then(closeShareSheet, function (error) {
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

    document.addEventListener('click', function (event) {
        var button = closest(event, '[data-share-url]');
        if (!button) return;
        (function () {
            var detail = {
                url: new URL(button.getAttribute('data-share-url'), location.href).href,
                title: button.getAttribute('data-share-title') || document.title
            };
            if (!button.dispatchEvent(new CustomEvent('shary:share', { bubbles: true, cancelable: true, detail: detail }))) return;
            var url = detail.url;
            var title = detail.title;
            var en = english(button);
            var phone = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

            // ديسك توب: قايمة صغيرة جنب الزرار. موبايل: قايمة شاري من تحت (واتساب أول اختيار ، تيليجرام ، فيسبوك ، X ، البريد ، نسخ الرابط)
            // وآخرها "المزيد" بيفتح قايمة المشاركة بتاعة الموبايل نفسه.
            if (!phone) { event.stopPropagation(); openShareMenu(button, url, title, en); return; }
            openShareSheet(url, title, en, button);
        })();
    }, true);

    // ---- واتساب: رسالة جاهزة فيها بيانات الوحدة / المشروع وكوده ولينكه (واتساب بيعرض اللينك بصورة الصفحة og:image)
    // النص من أقرب عنصر عليه data-wa-text (كارت) ، وإلا من data-wa-page اللي على صفحة الوحدة / المشروع (لأي زرار واتساب في الصفحة) ،
    // وإلا رسالة عامة باسم الصفحة. اللينك من data-wa-url. حدث shary:whatsapp ({ text }) — غيّروا detail.text أو امنعوه.
    function whatsappText(link, shareUrl) {
        var en = english(link);
        var holder = link.closest('[data-wa-text]');
        var scope = link.closest('main') || document;
        var page = holder ? null : (link.closest('[data-wa-page]') || scope.querySelector('[data-wa-page]'));
        var source = holder || page;
        var absolute = function (value, web) {
            try { var full = new URL(value, location.href).href; return (web ? /^https?:/ : /^(?!data:|javascript:|blob:)/).test(full) ? full : ''; } catch (error) { return ''; }
        };
        if (!source) return (en ? 'Hello Shary, I would like to ask about:' : 'مرحبًا شاري، أريد الاستفسار عن:') + '\n' + document.title + '\n' + location.href;
        // نفس ترتيب رسالة الموقع: البيانات ، سطر اللينك ، سطر فاضي ، لينك الصورة
        var text = (source.getAttribute(holder ? 'data-wa-text' : 'data-wa-page') || '').replace(/^\s+|\s+$/g, '');
        var url = shareUrl || absolute(source.getAttribute('data-wa-url') || '') || location.href;
        var photo = holder ? holder.querySelector('img.card-photo') : null;   // الكارت: صورته نفسها
        var image = absolute(source.getAttribute('data-wa-image') || (photo ? photo.currentSrc || photo.getAttribute('src') : '') || '', true);
        return text + ' ' + url + (image ? '\n\n' + image : '');
    }

    // رسالة المشاركة (زرار المشاركة على الكارت أو جوه صفحة الوحدة / المشروع) — نفس شكل رسالة الموقع:
    //   بيانات الوحدة / المشروع (الاسم ، المرجع ، المشروع / المطور ، السعر ، المنطقة) ← "رابط الوحدة: اللينك" ← سطر فاضي ← لينك الصورة.
    //   واتساب بيعرض فوقها معاينة اللينك (الصورة + العنوان + الوصف) من og:image / og:title / og:description بتوع صفحة الوحدة / المشروع.
    //   لو الزرار مش على كارت ولا في صفحة فيها بيانات: العنوان + اللينك. حدث shary:whatsapp ({ text }) بيتبعت هنا كمان.
    function shareMessage(button, url, title) {
        var page = button && button.closest ? button.closest('[data-wa-page]') : null;
        var has = button && button.closest && (button.closest('[data-wa-text]') || (page && !button.closest('[data-card], [data-unit], [data-project], article')));
        var detail = { text: has ? whatsappText(button, url) : title + '\n' + url };
        if (button && button.dispatchEvent) button.dispatchEvent(new CustomEvent('shary:whatsapp', { bubbles: true, cancelable: true, detail: detail }));
        return detail.text;
    }

    function whatsappHref(link) {
        var href = link.getAttribute('href') || '';
        if (/[?&]text=/.test(href)) return href;
        var detail = { text: whatsappText(link) };
        if (!link.dispatchEvent(new CustomEvent('shary:whatsapp', { bubbles: true, cancelable: true, detail: detail }))) return href;
        return href + (href.indexOf('?') === -1 ? '?' : '&') + 'text=' + encodeURIComponent(detail.text);
    }

    document.addEventListener('click', function (event) {
        var link = closest(event, 'a[href*="wa.me/"], a[href*="api.whatsapp.com/send"]');
        if (!link || link.hasAttribute('data-share-target') || link.hasAttribute('data-menu-link')) return;
        link.setAttribute('href', whatsappHref(link));   // قبل ما المتصفح يفتح اللينك
    }, true);

    // ---- الاتصال على الديسك توب / التابلت: قايمة صغيرة (اتصل / واتساب / نسخ الرقم) — على الموبايل لينك tel: بيفتح الاتصال عادي
    document.addEventListener('click', function (event) {
        var link = closest(event, 'a[href^="tel:"]');
        if (!link || link.hasAttribute('data-menu-link')) return;
        var touchPhone = window.matchMedia && window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 768;
        if (touchPhone) return;
        event.preventDefault();
        event.stopPropagation();
        var en = english(link);
        var number = (link.getAttribute('href') || '').slice(4);
        var scope = link.closest('main') || document;
        var near = (link.parentNode && link.parentNode.querySelector('a[href*="wa.me/"]')) || scope.querySelector('a[href*="wa.me/"]') || document.querySelector('a[href*="wa.me/"]');
        var items = [['shary-share__icon--mail', ICON_PHONE, (en ? 'Call ' : 'اتصل ') + '\u2066' + number + '\u2069', 'tel:' + number]];
        if (near) items.push(['shary-share__icon--whatsapp', '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>', en ? 'WhatsApp' : 'واتساب', whatsappHref(near)]);
        items.push(['shary-share__icon--more', ICON_LINK, en ? 'Copy number' : 'نسخ الرقم', function (row) {
            copyText(number, function () { row.lastChild.textContent = en ? 'Number copied' : 'تم نسخ الرقم'; setTimeout(closeMenu, 900); }, function () { toast(number); closeMenu(); });
        }]);
        openMenu(link, items, en, en ? 'Contact us' : 'تواصل معنا');
    });

    // ---- المقارنة: الضغط على "قارن" بيعلّم الوحدة / المشروع وبيحفظه على الجهاز (shary-compare: units/slug ، projects/slug)،
    // وبيظهر زرار المقارنة تحت بالعدد — الضغط عليه بيفتح صفحة المقارنة: ?units=a,b&projects=c,d . أقصى عدد 4 وحدات و4 مشاريع.
    // نوع العنصر: data-compare-type="unit | project" على الزرار (ولو مش مكتوب: الكارت اللي جوه [data-unit] وحدة، وغيره مشروع).
    var compareKey = 'shary-compare';
    var compareMemory = [];
    var compareMax = 4;

    function readCompare() {
        try { return JSON.parse(window.localStorage.getItem(compareKey)) || []; } catch (error) { return compareMemory; }
    }

    function writeCompare(list) {
        compareMemory = list;
        try { window.localStorage.setItem(compareKey, JSON.stringify(list)); } catch (error) { /* التخزين مش متاح: الحالة بتفضل على الصفحة بس */ }
    }

    function compareId(button) {
        var slug = button.getAttribute('data-compare-id') || '';
        if (slug.indexOf('/') !== -1) return slug;
        var type = button.getAttribute('data-compare-type') || (button.closest('[data-unit]') ? 'unit' : 'project');
        return (type === 'unit' ? 'units/' : 'projects/') + slug;
    }

    function compareQuery(list) {
        var parts = [];
        ['units', 'projects'].forEach(function (group) {
            var slugs = list.filter(function (id) { return id.indexOf(group + '/') === 0; }).map(function (id) { return id.slice(group.length + 1); });
            if (slugs.length) parts.push(group + '=' + slugs.join(','));
        });
        return parts.join('&');
    }

    function showCompare() {
        var list = readCompare();
        var query = compareQuery(list);
        document.querySelectorAll('[data-compare-bar], [data-compare-link]').forEach(function (link) {
            if (link.hasAttribute('data-compare-bar')) {
                link.classList.toggle('hidden', list.length === 0);
                link.classList.toggle('flex', list.length > 0);
            }
            var count = link.querySelector('[data-compare-count]');
            if (count) { count.textContent = list.length; if (!link.hasAttribute('data-compare-bar')) count.classList.toggle('hidden', list.length === 0); }
            var base = link.getAttribute('data-base') || '';
            if (base && base !== '#') link.setAttribute('href', base + (query ? (base.indexOf('?') === -1 ? '?' : '&') + query : ''));
        });
        return list;
    }

    // بتعلّم أزرار "قارن" المحفوظة جوه جزء من الصفحة (والكروت الجديدة: window.SharyCards.refresh(root))
    function markCompare(root) {
        var list = readCompare();
        (root || document).querySelectorAll('[data-compare-toggle]').forEach(function (button) {
            button.setAttribute('aria-pressed', list.indexOf(compareId(button)) !== -1 ? 'true' : 'false');
        });
        showCompare();
    }
    window.SharyCompare = { read: readCompare, write: function (list) { writeCompare(list); markCompare(document); } };

    document.addEventListener('click', function (event) {
        var button = closest(event, '[data-compare-toggle]');
        if (!button) return;
        var id = compareId(button);
        var active = button.getAttribute('aria-pressed') !== 'true';
        var list = readCompare().filter(function (item) { return item !== id; });
        if (active) {
            var group = id.split('/')[0];
            if (list.filter(function (item) { return item.indexOf(group + '/') === 0; }).length >= compareMax) {   // العدد كامل: رسالة ومفيش إضافة
                toast(english(button) ? 'You can compare up to ' + compareMax + ' at a time' : 'أقصى عدد للمقارنة ' + compareMax + ' في المرة');
                return;
            }
            list.push(id);
        }
        writeCompare(list);
        markCompare(document);
        button.dispatchEvent(new CustomEvent('shary:compare', { bubbles: true, detail: { id: id, active: active, ids: list } }));
    }, true);
    markCompare(document);

    // X جنب زرار المقارنة العايم [data-compare-dismiss]: بيفضّي المقارنة والزرار بيختفي. الحدث shary:compare-clear ({ ids }) عشان السيرفر يتحدّث
    document.addEventListener('click', function (event) {
        var dismiss = closest(event, '[data-compare-dismiss]');
        if (!dismiss) return;
        var ids = readCompare();
        writeCompare([]);
        markCompare(document);
        dismiss.dispatchEvent(new CustomEvent('shary:compare-clear', { bubbles: true, detail: { ids: ids } }));
    });
    // ---------- نص بيتقصّر ويتفرد [data-collapsible] ("عن المطور" ، "عن الإيجار" ، "عن الوحدة") ----------
    // النص مفتوح في الأول. الزرار [data-collapsible-toggle] اللي جنبه بيقصّره (is-collapsed) ويفرده، ونصه بيتبدّل بين data-less و data-more.
    document.querySelectorAll('[data-collapsible]').forEach(function (box) {
        var toggle = box.parentNode.querySelector('[data-collapsible-toggle]');
        if (!toggle) return;
        toggle.addEventListener('click', function () {
            var collapse = !box.classList.contains('is-collapsed');
            box.classList.toggle('is-collapsed', collapse);
            toggle.setAttribute('aria-expanded', collapse ? 'false' : 'true');
            var label = toggle.querySelector('[data-label]');
            (label || toggle).textContent = toggle.getAttribute(collapse ? 'data-more' : 'data-less');
            if (collapse) box.scrollIntoView({ block: 'nearest' });
        });
    });

    // ---- عنصر ثابت تحت الهيدر [data-stick-under-header] (فورم الاستشارة في صفحة المقال على الديسك توب):
    // الـ CSS بيثبته (lg:sticky) والسكربت بيظبط المسافة من فوق على ارتفاع الهيدر الفعلي + 16px.
    document.querySelectorAll('[data-stick-under-header]').forEach(function (box) {
        var scope = box.closest('[lang]') || document;
        var waiting = false;
        function place() {
            waiting = false;
            if (!box.offsetHeight) return;   // الصفحة مخفية دلوقتي
            var header = scope.querySelector('header');
            var base = header ? (parseFloat(window.getComputedStyle(header).top) || 0) + header.offsetHeight : 0;
            box.style.top = (base + 16) + 'px';
        }
        window.addEventListener('resize', place);
        window.addEventListener('scroll', function () { if (!waiting) { waiting = true; window.requestAnimationFrame(place); } }, { passive: true });
        place();
    });

    // ---- صف كروت بيتحرك لوحده [data-auto-rail] (المشروعات الجديدة في صفحة المنطقة وصفحة المشروع):
    // موبايل وتابلت بس: الصف بيتحرك بالراحة كارت كارت (كل 3.5 ثانية) ولما يوصل للآخر بيرجع للأول. ديسك توب: مش بيتحرك لوحده.
    // بيقف طول ما العميل ماسكه، ولو مش ظاهر على الشاشة، ولو الجهاز مطفّي الحركة.
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        var railNarrow = window.matchMedia('(max-width: 1023px)');
        document.querySelectorAll('[data-auto-rail]').forEach(function (rail) {
            // العناصر بتتقري كل مرة (الصف ممكن محتواه يتغيّر) ، والمدة من data-auto-rail="بالمللي ثانية" (الافتراضي 3500)
            var at = 0, held = false, seen = false, resume = null;
            function hold() { held = true; if (resume) { clearTimeout(resume); resume = null; } }
            function release(wait) { if (resume) clearTimeout(resume); resume = setTimeout(function () { held = false; resume = null; }, wait); }
            rail.addEventListener('touchstart', hold, { passive: true });
            rail.addEventListener('touchend', function () { release(5000); }, { passive: true });
            rail.addEventListener('focusin', hold);
            rail.addEventListener('focusout', function () { release(0); });
            if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) { seen = entries[0].isIntersecting; }, { threshold: 0.6 }).observe(rail);
            else seen = true;
            function offset(card) {   // المسافة بين أول الكارت وأول الصف (حسب اتجاه الصفحة)
                var box = rail.getBoundingClientRect(), r = card.getBoundingClientRect();
                var style = window.getComputedStyle(rail);
                var rtl = style.direction === 'rtl';
                var pad = parseFloat(rtl ? style.paddingRight : style.paddingLeft) || 0;
                return rtl ? r.right - (box.right - pad) : r.left - (box.left + pad);
            }
            window.setInterval(function () {
                if (!railNarrow.matches || held || !seen || document.hidden || !rail.offsetWidth) return;
                var cards = Array.prototype.slice.call(rail.children);
                if (cards.length < 2 || rail.scrollWidth - rail.clientWidth < 4) return;   // كله ظاهر: مفيش حاجة تتحرك
                at = (at + 1) % cards.length;
                var room = rail.scrollWidth - rail.clientWidth - Math.abs(rail.scrollLeft);
                if (at === 0 || room < 2) { at = 0; rail.scrollTo({ left: 0, behavior: 'smooth' }); return; }
                rail.scrollTo({ left: rail.scrollLeft + offset(cards[at]), behavior: 'smooth' });
            }, Number(rail.getAttribute('data-auto-rail')) || 3500);
        });
    }

    // ---- شريط الإعلانات [data-ad-strip] (partials/ad-strip.blade.php): إعلان واحد ظاهر في البوكس، بيتسحب بالجنب وبيتبدّل لوحده كل 5 ثواني ----------
    document.querySelectorAll('[data-ad-strip]').forEach(function (strip) {
        var track = strip.querySelector('[data-ad-track]');
        var slides = track ? Array.prototype.slice.call(track.children) : [];
        var dots = Array.prototype.slice.call(strip.querySelectorAll('[data-ad-dots] button'));
        if (slides.length < 2) return;
        var at = 0;
        var seen = false;
        var held = false;

        function go(index, smooth) {
            at = (index + slides.length) % slides.length;
            var left = track.scrollLeft + slides[at].getBoundingClientRect().left - track.getBoundingClientRect().left;
            track.scrollTo({ left: left, behavior: smooth === false ? 'auto' : 'smooth' });
        }
        function mark() {
            var box = track.getBoundingClientRect();
            var best = 0, gap = Infinity;
            slides.forEach(function (slide, i) {
                var d = Math.abs(slide.getBoundingClientRect().left - box.left);
                if (d < gap) { gap = d; best = i; }
            });
            at = best;
            dots.forEach(function (dot, i) { dot.setAttribute('aria-current', i === at ? 'true' : 'false'); });
        }

        track.addEventListener('scroll', function () { window.requestAnimationFrame(mark); }, { passive: true });
        dots.forEach(function (dot, i) { dot.addEventListener('click', function () { go(i); }); });
        ['mouseenter', 'touchstart', 'focusin'].forEach(function (name) { strip.addEventListener(name, function () { held = true; }, { passive: true }); });
        ['mouseleave', 'touchend', 'focusout'].forEach(function (name) { strip.addEventListener(name, function () { held = false; }, { passive: true }); });
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) { seen = entries[0].isIntersecting; }, { threshold: 0.6 }).observe(strip);
        } else {
            seen = true;
        }
        // بيتبدّل لوحده بس والشريط ظاهر على الشاشة والعميل مش واقف عليه
        window.setInterval(function () { if (seen && !held && !document.hidden) go(at + 1); }, 5000);
    });
})();

/**
 * زرار التطبيق في الهيدر [data-app-button]:
 * - الافتراضي "حمل التطبيق" (data-state="get") واللينك بيبقى المتجر المناسب للجهاز: data-ios-url على آيفون/آيباد ، data-android-url على الباقي.
 * - لو التطبيق متسطّب بيتحوّل لـ "افتح التطبيق" (data-state="open") واللينك بيبقى data-open-url. بنعرف إنه متسطّب من:
 *   1) أندرويد (كروم): navigator.getInstalledRelatedApps() — محتاج related_applications في manifest الموقع + assetlinks.json في التطبيق.
 *   2) الصفحة مفتوحة من جوه التطبيق نفسه (User-Agent فيه SharyApp) أو اللينك جاي من التطبيق (?from=app) — وبيتحفظ على الجهاز.
 *   آيفون (سفاري): المتصفح مش بيسمح للموقع يعرف التطبيقات المتسطّبة — عشان كده data-open-url لازم يبقى Universal Link (بيفتح التطبيق لو موجود).
 * - حدث shary:app-state ({ installed }) على الزرار بعد ما الحالة تتحدد.
 */
(function () {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-app-button]'));
    if (!buttons.length) return;
    var ua = navigator.userAgent || '';
    var ios = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    var KEY = 'shary-app-installed';

    function remembered() { try { return window.localStorage.getItem(KEY) === '1'; } catch (error) { return false; } }
    function remember() { try { window.localStorage.setItem(KEY, '1'); } catch (error) { /* التخزين مقفول */ } }

    function apply(installed) {
        buttons.forEach(function (button) {
            var label = button.querySelector('[data-app-label]');
            var store = button.getAttribute(ios ? 'data-ios-url' : 'data-android-url');
            var open = button.getAttribute('data-open-url');
            button.setAttribute('data-state', installed ? 'open' : 'get');
            if (label) label.textContent = button.getAttribute(installed ? 'data-label-open' : 'data-label-get') || label.textContent;
            if (installed && open && open !== '#') { button.setAttribute('href', open); button.removeAttribute('target'); }
            else if (!installed && store) { button.setAttribute('href', store); button.setAttribute('target', '_blank'); button.setAttribute('rel', 'noopener'); }
            button.dispatchEvent(new CustomEvent('shary:app-state', { bubbles: true, detail: { installed: installed } }));
        });
    }

    var fromApp = /SharyApp/i.test(ua) || /[?&]from=app(&|$)/.test(window.location.search);
    if (fromApp) remember();
    apply(fromApp || remembered());

    if (navigator.getInstalledRelatedApps) {
        navigator.getInstalledRelatedApps().then(function (apps) {
            var id = buttons[0].getAttribute('data-android-package');
            var found = (apps || []).some(function (app) { return !id || app.id === id; });
            if (found) { remember(); apply(true); }
        }).catch(function () { /* المتصفح مش بيدعمها */ });
    }
})();

/**
 * بوب أب تحميل التطبيق [data-app-popup] (موبايل بس): بيظهر بعد data-delay من فتح الصفحة وبيدخل من الشمال.
 * - بيظهر أول ما العميل يفتح الموقع (مرة في الزيارة الواحدة — sessionStorage) ، ومش بيظهر لو التطبيق متسطّب (زرار التطبيق data-state="open").
 *   عايزينه أقل؟ غيّروا DAYS لعدد الأيام (بيتحفظ في localStorage بدل الزيارة).
 * - القفل: × أو الضغط براه أو Esc أو الضغط على زرار التحميل. window.SharyAppPopup.open() / .close() للتحكم من أي كود.
 * - حدث shary:app-popup ({ open }) على العنصر.
 */
(function () {
    var pop = document.querySelector('[data-app-popup]');
    if (!pop) return;
    var KEY = 'shary-app-popup';
    var DAYS = 0;   // 0 = مرة في كل زيارة (sessionStorage) ، أو عدد الأيام بين كل ظهور (localStorage)

    function store() { return DAYS > 0 ? window.localStorage : window.sessionStorage; }
    function seen() { try { var at = Number(store().getItem(KEY)); return !!at && (DAYS === 0 || Date.now() - at < DAYS * 86400000); } catch (error) { return false; } }
    function mark() { try { store().setItem(KEY, String(Date.now())); } catch (error) { /* التخزين مقفول */ } }

    function close() {
        if (pop.hidden) return;
        pop.classList.remove('is-open');
        pop.setAttribute('aria-hidden', 'true');
        window.setTimeout(function () { pop.hidden = true; }, 380);
        mark();
        pop.dispatchEvent(new CustomEvent('shary:app-popup', { bubbles: true, detail: { open: false } }));
    }

    function open() {
        pop.hidden = false;
        pop.setAttribute('aria-hidden', 'false');
        window.requestAnimationFrame(function () { window.requestAnimationFrame(function () { pop.classList.add('is-open'); }); });
        pop.dispatchEvent(new CustomEvent('shary:app-popup', { bubbles: true, detail: { open: true } }));
    }

    pop.addEventListener('click', function (event) {
        if (event.target.closest('[data-app-popup-close]') || event.target.closest('[data-app-button]')) close();
    });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') close(); });
    window.SharyAppPopup = { open: open, close: close };

    // الكارت كله كليكابل: الضغط على أي مكان فيه (غير زرار القفل) = الضغط على زرار التحميل
    var card = pop.querySelector('.app-pop__card');
    if (card) card.addEventListener('click', function (event) {
        if (event.target.closest('[data-app-popup-close], [data-app-button]')) return;
        var cta = card.querySelector('[data-app-button]');
        if (cta) cta.click();
    });

    var mobile = window.matchMedia && window.matchMedia('(max-width: 1023px)').matches;
    if (!mobile || seen() || navigator.webdriver) return;   // navigator.webdriver: اختبارات آلية
    // العميل فاتح Shary AI: البوب أب ما يقطعش المحادثة — بيستنى لحد ما يقفلها
    function show() {
        var button = pop.querySelector('[data-app-button]');
        if (button && button.getAttribute('data-state') === 'open') return;   // التطبيق متسطّب
        var ai = document.querySelector('[data-ai-panel]');
        if (ai && Array.prototype.some.call(document.querySelectorAll('[data-ai-panel]'), function (panel) { return !panel.classList.contains('hidden'); })) { window.setTimeout(show, 4000); return; }
        if (seen()) return;
        open();
    }
    window.setTimeout(show, Number(pop.getAttribute('data-delay')) || 1800);
})();

/**
 * تنبيه سياسة الخصوصية [data-privacy-note] (partials/privacy-notice.blade.php): بيظهر في كل زيارة لحد ما العميل يضغط "موافق" [data-privacy-accept].
 * الموافقة بتتحفظ لحد قفل المتصفح (sessionStorage: shary-privacy) — EVERY_VISIT = false يخليها مرة واحدة على الجهاز. حدث shary:privacy-accept على العنصر — اسمعوه لو عايزين تسجلوها على السيرفر.
 */
(function () {
    var note = document.querySelector('[data-privacy-note]');
    if (!note) return;
    var KEY = 'shary-privacy';
    // بيظهر في كل زيارة لحد ما العميل يضغط "موافق" (محفوظ لحد قفل المتصفح — sessionStorage).
    // عايزينه مرة واحدة بس على الجهاز؟ خلّوا EVERY_VISIT = false (localStorage).
    var EVERY_VISIT = true;
    var store = null;
    try { store = EVERY_VISIT ? window.sessionStorage : window.localStorage; } catch (error) { /* التخزين مقفول: التنبيه بيظهر */ }
    var accepted = false;
    try { accepted = !!store && store.getItem(KEY) === '1'; } catch (error) { /* التخزين مقفول: التنبيه بيظهر */ }
    if (accepted || navigator.webdriver) return;   // navigator.webdriver: اختبارات آلية
    note.classList.remove('hidden');
    note.addEventListener('click', function (event) {
        if (!event.target.closest('[data-privacy-accept]')) return;
        try { if (store) store.setItem(KEY, '1'); } catch (error) { /* التخزين مقفول */ }
        note.classList.add('hidden');
        note.dispatchEvent(new CustomEvent('shary:privacy-accept', { bubbles: true }));
    });
})();

/**
 * سيستم اللوجوهات — مفيش لوجو يبان "مربع" جوه الدايرة:
 * اللوجو بيتعرض كامل (object-contain) جوه دايرة ، ولو صورة اللوجو خلفيتها لون ثابت (مش شفافة) الدايرة بتاخد نفس لون الخلفية فالمربع بيختفي.
 * بيشتغل لوحده على لوجوهات المطورين في كل الكروت والصفحات (والصور اللي بتتحمل بعدين). لأي صورة تانية: حطوا عليها data-logo-fit.
 * ملاحظة: قراءة لون الخلفية بتشتغل لما الصورة من نفس الدومين (أو عليها CORS) — غير كده اللوجو بيفضل على خلفية بيضا.
 * الأفضل من لوحة التحكم: رفع اللوجو PNG شفاف أو مربع 400×400 — راجعوا README.
 */
(function () {
    var SELECTOR = 'img[data-logo-fit], img.rounded-full.object-contain, .dev-logo-link img, .prop-shot__logo img, .dev-icon__logo img, .prop-bar__logo img, .developer-logo img, .req-menu__logo';

    function fit(img) {
        if (!img.naturalWidth || img.__logoFit === img.currentSrc) return;
        img.__logoFit = img.currentSrc;
        try {
            var canvas = document.createElement('canvas');
            var size = canvas.width = canvas.height = 24;
            var context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, size, size);
            // 8 عينات على أطراف الصورة (الأركان + نص كل ضلع): لون الخلفية = اللون اللي أغلب العينات عليه
            var mid = Math.floor(size / 2);
            var samples = [[1, 1], [size - 2, 1], [1, size - 2], [size - 2, size - 2], [mid, 1], [mid, size - 2], [1, mid], [size - 2, mid]].map(function (point) { return context.getImageData(point[0], point[1], 1, 1).data; });
            var clear = samples.filter(function (pixel) { return pixel[3] < 200; }).length;
            if (clear >= 4) return;   // لوجو شفاف: بيفضل كامل على الأبيض
            var best = null, bestCount = 0;
            samples.forEach(function (base) {
                var count = samples.filter(function (pixel) { return pixel[3] >= 200 && Math.abs(pixel[0] - base[0]) + Math.abs(pixel[1] - base[1]) + Math.abs(pixel[2] - base[2]) < 60; }).length;
                if (count > bestCount) { bestCount = count; best = base; }
            });
            if (!best || bestCount < 5) {
                // خلفية اللوجو مش لون واحد (صورة): اللوجو بيملى الدايرة عشان ما يبانش مربع
                img.style.objectFit = 'cover';
                img.style.padding = '0';
                return;
            }
            var color = 'rgb(' + best[0] + ',' + best[1] + ',' + best[2] + ')';
            img.style.backgroundColor = color;
            // اللوجو كامل جوه الدايرة بهامش بسيط (من غير تكبير): الكلام اللي على أطرافه ما يتقصش بحواف الدايرة
            if (parseFloat(window.getComputedStyle(img).paddingLeft) < 1) img.style.padding = '7%';
            var box = img.parentElement;
            if (box && box.clientWidth && box.clientWidth <= img.clientWidth * 1.7 && window.getComputedStyle(box).borderTopLeftRadius !== '0px') box.style.backgroundColor = color;
        } catch (error) { /* صورة من دومين تاني من غير CORS */ }
    }

    function scan(scope) { (scope || document).querySelectorAll(SELECTOR).forEach(function (img) { if (img.complete) fit(img); }); }

    document.addEventListener('load', function (event) {
        var img = event.target;
        if (img && img.tagName === 'IMG' && img.matches(SELECTOR)) fit(img);
    }, true);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { scan(); }); else scan();
    window.SharyLogoFit = { scan: scan };
})();

/**
 * سيستم "الصورة الطبيعية" (photo-fit) — مع ستايل .rent-gallery في app.css:
 * معرض الصور (المشروع / الوحدة / الإيجار) بياخد نسبة أول صورة فيه: السكربت بيحط --photo-ratio (العرض ÷ الارتفاع ، بين 5:4 و 16:9) على المعرض أول ما الصورة تحمل ،
 * فالصورة الكبيرة على الموبايل بتتعرض كاملة بنسبتها الطبيعية (من غير تكبير ولا قص ولا صورة وراها). من أي كود بعد تغيير الصور: window.SharyPhotoFit.scan().
 */
(function () {
    function fit(gallery) {
        var img = gallery.querySelector('[data-gallery-item] img');
        if (!img || !img.naturalWidth || !img.naturalHeight) return;
        var ratio = Math.max(1.25, Math.min(1.78, img.naturalWidth / img.naturalHeight));
        gallery.style.setProperty('--photo-ratio', ratio.toFixed(3));
        if (gallery.parentNode && gallery.parentNode.style) gallery.parentNode.style.setProperty('--photo-ratio', ratio.toFixed(3));
    }
    function scan(scope) { (scope || document).querySelectorAll('[data-rent-gallery]').forEach(fit); }
    document.addEventListener('load', function (event) {
        var img = event.target;
        var gallery = img && img.tagName === 'IMG' && img.closest ? img.closest('[data-rent-gallery]') : null;
        if (gallery && gallery.querySelector('[data-gallery-item] img') === img) fit(gallery);
    }, true);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { scan(); }); else scan();
    window.SharyPhotoFit = { scan: scan };
})();

/**
 * كل فورم POST (طلب اجتماع / استشارة / بيع عقارك / شاري كارد / وظائف / عرض ...) بيتبعت معاه الصفحة اللي العميل بعت منها:
 * page_url + page_title — عشان الميل ولوحة التحكم يبان فيهم الطلب جاي منين (SharyLeadController). الخانات مخفية وبتتضاف وقت الإرسال.
 */
(function () {
    function put(form, name, value) {
        var field = form.querySelector('input[type="hidden"][name="' + name + '"]');
        if (!field) { field = document.createElement('input'); field.type = 'hidden'; field.name = name; form.appendChild(field); }
        field.value = value;
    }
    document.addEventListener('submit', function (event) {
        var form = event.target;
        if (!form || !form.getAttribute || String(form.getAttribute('method') || '').toLowerCase() !== 'post') return;
        put(form, 'page_url', location.href);
        put(form, 'page_title', document.title);
    }, true);
})();
