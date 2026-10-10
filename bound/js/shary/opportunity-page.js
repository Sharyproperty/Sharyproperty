/**
 * فرص إعادة بيع حصرية — القايمة (opportunities/index) وصفحة الفرصة (units/show + opportunities/partials/deal + market)
 *
 * 1) العدّاد [data-countdown="تاريخ الانتهاء ISO"]: النص بيتحدّث كل دقيقة من قوالب:
 *      data-countdown-days  = "متبقي :days أيام و :hours ساعات"
 *      data-countdown-hours = "متبقي :hours ساعات و :minutes دقيقة"   (آخر يوم)
 *      data-countdown-ended = "انتهت الفرصة"
 *
 * 2) فلتر القايمة [data-opps-filter] (المنطقة area[] / النوع type[] / السعر price = "من-إلى" + الفلتر المتقدم: beds[] / pay / size_min / size_max):
 *    - أي تغيير بيطلع حدث shary:opportunities-filter على الفورم: detail = { area: [], type: [], price: '', beds: [], pay: '', size_min: '', size_max: '' }.
 *      امنعوه (preventDefault) لو هتجيبوا النتايج من السيرفر (AJAX) وبدّلوا الكروت بنفسكم.
 *    - لو ما اتمنعش: الكروت اللي في الصفحة [data-opp-card] بتتفلتر في مكانها (data-areas / data-type / data-price) والعدد [data-opps-count] بيتحدّث.
 *    - "مسح" [data-opps-reset] بيرجّع كل الاختيارات.
 *
 * 3) "قدّم عرضك" (طلب شراء): أي عنصر عليه [data-offer-open] بيفتح البوب أب [data-offer-modal] (opportunities/partials/offer-modal)،
 *    وبيتقفل من X أو الضغط براه أو Esc. الاسم والموبايل (مع كود الدولة) إجباري ، وقيمة العرض اختيارية.
 *    الإرسال بيطلع حدث shary:opportunity-offer على الفورم: detail = { slug, amount (0 = من غير قيمة), name, country_code, phone, done(), fail() }.
 *    لو ما اتمنعش: POST على action الفورم (JSON) وبعد الرد بتظهر رسالة التأكيد [data-offer-done] مكان الفورم.
 */
(function () {
    // ---- 1) العدّاد
    var timers = Array.prototype.slice.call(document.querySelectorAll('[data-countdown]'));
    function tick() {
        var now = Date.now();
        timers.forEach(function (node) {
            var end = Date.parse(node.getAttribute('data-countdown'));
            if (isNaN(end)) return;
            var left = Math.max(0, Math.floor((end - now) / 1000));
            if (!left) { node.textContent = node.getAttribute('data-countdown-ended') || ''; return; }
            var days = Math.floor(left / 86400), hours = Math.floor(left % 86400 / 3600), minutes = Math.floor(left % 3600 / 60);
            var template = node.getAttribute(days > 0 ? 'data-countdown-days' : 'data-countdown-hours') || '';
            if (!template) return;
            node.textContent = template.replace(':days', days).replace(':hours', hours).replace(':minutes', minutes);
        });
    }
    if (timers.length) { tick(); window.setInterval(tick, 60000); }

    // ---- السعر والتوفير الثابتين [data-opp-sticky] (موبايل): بيظهروا تحت الهيدر لما قسم السعر (.opp-deal) يطلع بره الشاشة
    document.querySelectorAll('[data-opp-sticky]').forEach(function (sticky) {
        var holder = sticky.closest('[data-opportunity-page]') || sticky.parentNode;
        var deal = holder.querySelector('.opp-deal') || document.querySelector('.opp-deal');
        if (!deal) return;
        var stickyHeader = sticky.closest('[lang]') ? sticky.closest('[lang]').querySelector('header') : document.querySelector('header');
        var placeSticky = function () {
            var box = deal.getBoundingClientRect();
            // الجزء الثابت لازق تحت الهيدر على طول
            var top = stickyHeader ? Math.max(0, stickyHeader.getBoundingClientRect().bottom) : 0;
            // style بيتحسب قبل تكبير الديسك توب — والقياس بعده
            sticky.style.top = (top / (window.SharyZoom ? window.SharyZoom() : 1)) + 'px';
            // ظاهر بس لما قسم السعر يعدّي فوق (والصفحة نفسها ظاهرة)
            sticky.classList.toggle('is-on', box.height > 0 && box.bottom < top + 10);
        };
        window.addEventListener('scroll', placeSticky, { passive: true });
        window.addEventListener('resize', placeSticky);
        placeSticky();
    });

    // ---- 2) فلتر القايمة
    document.querySelectorAll('[data-opps-filter]').forEach(function (form) {
        var page = form.closest('[data-opps-page]') || document;
        var apply = form.querySelector('[data-opps-apply]');
        var reset = form.querySelector('[data-opps-reset]');
        var selects = Array.prototype.slice.call(form.querySelectorAll('select'));
        // الفلتر المتقدم [data-opps-advanced]: beds[] (1..5 — 5 = خمسة أو أكتر) ، pay (cash | installments) ، size_min / size_max
        var advanced = form.querySelector('[data-opps-advanced]');
        var advToggle = form.querySelector('[data-opps-adv-toggle]');
        var advCount = form.querySelector('[data-opps-adv-count]');
        var silent = false;
        if (apply) apply.classList.add('hidden');
        form.classList.add('is-live');

        function values() {
            var detail = {};
            selects.forEach(function (select) {
                var name = select.name.replace(/\[\]$/, '');
                detail[name] = select.multiple ? Array.prototype.filter.call(select.options, function (o) { return o.selected && o.value; }).map(function (o) { return o.value; }) : select.value;
            });
            detail.beds = Array.prototype.map.call(form.querySelectorAll('input[name="beds[]"]:checked'), function (input) { return input.value; });
            var pay = form.querySelector('input[name="pay"]:checked');
            detail.pay = pay ? pay.value : '';
            ['size_min', 'size_max'].forEach(function (name) {
                var input = form.querySelector('input[name="' + name + '"]');
                detail[name] = input && Number(input.value) > 0 ? String(Math.floor(Number(input.value))) : '';
            });
            return detail;
        }

        function filter(detail) {
            var cards = Array.prototype.slice.call(page.querySelectorAll('[data-opp-card]'));
            var range = String(detail.price || '').split('-');
            var low = range[0] ? Number(range[0]) : null, high = range[1] ? Number(range[1]) : null;
            var sizeMin = detail.size_min ? Number(detail.size_min) : null, sizeMax = detail.size_max ? Number(detail.size_max) : null;
            var shown = 0;
            cards.forEach(function (card) {
                var areas = (card.getAttribute('data-areas') || '').split(' ');
                var price = Number(card.getAttribute('data-price')) || 0;
                var beds = String(Math.min(5, Number(card.getAttribute('data-beds')) || 0));
                var size = Number(card.getAttribute('data-size')) || 0;
                var pay = card.getAttribute('data-pay-type') === 'full' ? 'cash' : 'installments';
                var ok = (!(detail.area || []).length || detail.area.some(function (slug) { return areas.indexOf(slug) !== -1; })) &&
                    (!(detail.type || []).length || detail.type.indexOf(card.getAttribute('data-type')) !== -1) &&
                    (low === null || price >= low) && (high === null || price <= high) &&
                    (!(detail.beds || []).length || detail.beds.indexOf(beds) !== -1) &&
                    (!detail.pay || detail.pay === pay) &&
                    (sizeMin === null || size >= sizeMin) && (sizeMax === null || size <= sizeMax);
                // الكارت جوه [data-opp-item]: مع الفلتر كل الفرص بتتعرض (من غير انتظار النزول) واللي مش مطابق بيختفي
                var item = card.closest('[data-opp-item]') || card;
                item.classList.remove('hidden', 'lg:block');
                item.classList.toggle('opp-out', !ok);
                if (ok) shown++;
            });
            var count = page.querySelector('[data-opps-count]');
            if (count) count.textContent = shown;
            var empty = page.querySelector('[data-opps-empty]');
            if (empty) empty.classList.toggle('hidden', shown > 0);
        }

        function send() {
            if (silent) return;
            var detail = values();
            var active = Object.keys(detail).some(function (key) { return detail[key] && detail[key].length; });
            if (reset) reset.classList.toggle('is-active', active);
            // عدد الاختيارات المتقدمة على زرار "فلتر متقدم"
            var extra = (detail.beds.length ? 1 : 0) + (detail.pay ? 1 : 0) + (detail.size_min || detail.size_max ? 1 : 0);
            if (advCount) { advCount.textContent = extra || ''; advCount.classList.toggle('hidden', !extra); }
            if (advToggle) advToggle.classList.toggle('is-active', extra > 0);
            if (!form.dispatchEvent(new CustomEvent('shary:opportunities-filter', { bubbles: true, cancelable: true, detail: detail }))) return;
            filter(detail);
        }

        if (advToggle && advanced) advToggle.addEventListener('click', function () {
            var open = advanced.classList.toggle('hidden') === false;
            advToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        form.addEventListener('change', send);
        form.addEventListener('input', function (event) { if (event.target && /^size_/.test(event.target.name || '')) send(); });
        form.addEventListener('submit', function (event) { event.preventDefault(); send(); });
        if (reset) reset.addEventListener('click', function (event) {
            event.preventDefault();
            silent = true;
            selects.forEach(function (select) {
                if (select.multiple) Array.prototype.forEach.call(select.options, function (o) { o.selected = false; }); else select.value = '';
                select.dispatchEvent(new Event('change', { bubbles: true }));   // زرار القايمة بيتحدّث
            });
            Array.prototype.forEach.call(form.querySelectorAll('input[name="beds[]"]'), function (input) { input.checked = false; });
            Array.prototype.forEach.call(form.querySelectorAll('input[name="pay"]'), function (input) { input.checked = input.value === ''; });
            Array.prototype.forEach.call(form.querySelectorAll('input[name="size_min"], input[name="size_max"]'), function (input) { input.value = ''; });
            silent = false;
            send();
        });
    });

    // ---- 3) قدّم عرضك (بوب أب)
    document.querySelectorAll('[data-offer-modal]').forEach(function (modal) {
        var form = modal.querySelector('[data-offer-form]');
        if (!form) return;
        var scope = modal.closest('[lang]') || document;
        var error = form.querySelector('[data-offer-error]');
        var done = modal.querySelector('[data-offer-done]');
        var amount = form.querySelector('[name="amount"]');
        var nameField = form.querySelector('[name="name"]');
        var lastOpener = null;

        function open(opener) {
            lastOpener = opener || null;
            // كل مرة يتفتح: الفورم ظاهر ورسالة التأكيد مخفية
            form.classList.remove('hidden');
            if (done) { done.classList.add('hidden'); done.classList.remove('flex'); }
            if (error) error.classList.add('hidden');
            modal.classList.remove('hidden');
            document.documentElement.classList.add('overflow-hidden');
            if (nameField && window.matchMedia('(min-width: 1024px)').matches) nameField.focus({ preventScroll: true });
        }

        function close() {
            if (modal.classList.contains('hidden')) return;
            modal.classList.add('hidden');
            document.documentElement.classList.remove('overflow-hidden');
            if (lastOpener && lastOpener.focus) lastOpener.focus({ preventScroll: true });
        }

        scope.addEventListener('click', function (event) {
            var opener = event.target.closest('[data-offer-open]');
            if (opener) { event.preventDefault(); open(opener); return; }
            if (event.target.closest('[data-offer-close]') && modal.contains(event.target)) close();
        });
        document.addEventListener('keydown', function (event) { if (event.key === 'Escape') close(); });

        // قيمة العرض: أرقام بس وبفواصل الآلاف
        if (amount) amount.addEventListener('input', function () {
            var digits = amount.value.replace(/[^\d]/g, '').replace(/^0+/, '');
            amount.value = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var code = form.querySelector('[name="country_code"]');
            var data = {
                slug: form.getAttribute('data-slug') || '',
                amount: Number((amount ? amount.value : '').replace(/[^\d]/g, '')) || 0,   // 0 = من غير قيمة (اختياري)
                name: (nameField.value || '').trim(),
                country_code: code ? code.value : '',
                phone: (form.querySelector('[name="phone"]').value || '').trim()
            };
            // الاسم والموبايل إجباري — قيمة العرض اختيارية
            var valid = data.name.length > 1 && data.phone.replace(/[^\d]/g, '').length >= 8;
            if (error) error.classList.toggle('hidden', valid);
            if (!valid) return;

            var button = form.querySelector('[type="submit"]');
            if (button) button.disabled = true;
            function finish() {
                if (button) button.disabled = false;
                form.reset();
                form.classList.add('hidden');
                if (done) { done.classList.remove('hidden'); done.classList.add('flex'); }
            }
            function fail() {
                if (button) button.disabled = false;
                if (error) error.classList.remove('hidden');
            }
            data.done = finish;
            data.fail = fail;
            if (!form.dispatchEvent(new CustomEvent('shary:opportunity-offer', { bubbles: true, cancelable: true, detail: data }))) return;

            var token = form.querySelector('[name="_token"]');
            fetch(form.getAttribute('action'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': token ? token.value : '' },
                body: JSON.stringify({ amount: data.amount || null, name: data.name, country_code: data.country_code, phone: data.phone })
            }).then(function (response) { if (!response.ok) throw new Error(response.status); finish(); }).catch(fail);
        });
    });
})();
