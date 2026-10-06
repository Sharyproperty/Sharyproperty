/**
 * صفحة Shary AI (partials/ai-panel.blade.php) — بنفس ستراكشر نسخة شاري AI المعتمدة.
 * - أي عنصر عليه data-ask-ai بيفتح الصفحة. القفل من سهم الرجوع أو الضغط براها أو Esc.
 * - أسئلة الاختيار [data-ai-onb]: بتترسم من data-ai-config ← flow (المنطقة ← الحي ← الاستخدام ← نوع الوحدة ← الميزانية ← الهدف) ،
 *   كل سؤال بيظهر بعد اللي قبله. السؤال اللي عليه multiple: true العميل يختار فيه أكتر من اختيار (سكن + استثمار ، شقة + دوبلكس ، أكتر من منطقة) ،
 *   و"ابدأ البحث" بيبعت رسالة جاهزة + الاختيارات. "أو اكتب سؤالك مباشرة" بيفتح الشات على طول.
 *   answers المبعوتة: { area: ['new-cairo', 'sheikh-zayed'], sub: ['madinaty'], use: 'residential', type: ['apartment', 'duplex'], budget: '5000000-10000000', purpose: ['living', 'investment'] }
 *   (السؤال المتعدد = array ، السؤال العادي = قيمة واحدة).
 * - الإرسال: الرسالة بتتضاف (صورة + اسم + رسالة) وبيطلع حدث shary:ai-send على الصفحة:
 *       panel.addEventListener('shary:ai-send', function (event) {
 *           event.preventDefault();
 *           event.detail.reply('نص الرد', { cards: [...], chips: [...], meeting: true });   // detail.text ، detail.answers
 *       });
 *   لو الحدث ما اتمنعش وفيه data-endpoint: بيتبعت POST JSON { message, answers, session } والرد المتوقع JSON { reply, cards, chips, meeting, book, session }.
 * - كروت الرد (cards):
 *       { type: 'unit',    title, location, developer, developer_short, image, price, currency, beds, baths, area, plan, badge, url }
 *       { type: 'project', name,  location, developer, developer_short, image, price (يبدأ من), currency, types: [...], plan, index (مؤشر شاري), badge, url }
 *   وتحت كل كارت: اتصال + واتساب + احجز ميتنج + التفاصيل (url). meeting: true = كارت "تحب تتكلم مع مستشار شاري؟".
 * - حجز الميتنج جوه الشات (من غير ما العميل يسيب المحادثة):
 *     بيبدأ من: زرار "احجز ميتنج" تحت أي كارت (الحجز بيتربط بالوحدة/المشروع ده) ، كارت "تحب تتكلم مع مستشار شاري؟" ،
 *     أو لو العميل كتب/ضغط "عايز أحجز ميتنج" (كلمات lang/ai.php ← book.words) ، أو لو السيرفر رجّع book: true.
 *     الخطوات: بخصوص إيه (لو فيه كروت معروضة ومش محدد) ← النوع (زوم / مكتب شاري / زيارة الموقع — الزيارة بس لو فيه وحدة أو مشروع)
 *              ← اليوم (7 أيام من النهارده) ← الساعة (كل المواعيد مفتوحة) ← الاسم والموبايل بكود الدولة (بيتراجعوا قبل الإرسال) ← تأكيد ← كارت التأكيد.
 *     الإرسال: حدث shary:ai-meeting (detail.data + detail.done(ok, message)) — لو ما اتمنعش: POST JSON على contact.meeting ($meetingUrl):
 *       { meeting_type: 'zoom' | 'in_person' | 'site_visit', meeting_date: 'Y-m-d', meeting_time: 'H:i', name, phone, country_code,
 *         subject, subject_type: 'unit' | 'project' | 'general', subject_url, source: 'shary-ai', answers, session }
 *     المواعيد الفاضية فعلًا (اختياري): contact.slots ($meetingSlotsUrl) ← GET ?date=Y-m-d&type=zoom والرد { slots: [{ value, label, available }] }.
 * - ديسك توب (1024px وأكبر): النافذة ثابتة على يمين الشاشة من غير تغميق — الصفحة وراها شغالة عادي والعميل يكمّل تصفح.
 *   بتفضل مفتوحة بنفس المحادثة وهو بيتنقل بين الصفحات (الحالة محفوظة في sessionStorage: shary-ai-state) لحد ما يقفلها بنفسه.
 *   موبايل: بملء الشاشة زي ما هي (والضغط على لينك كارت بيقفلها).
 * - "من الأول": محادثة جديدة ورجوع لأسئلة الاختيار. المايك بيظهر بس لو المتصفح بيدعم الإملاء الصوتي.
 *
 * ===== الإيجنت (تحديث) — كل ده جاهز في الفرونت ومستني الباك إند بس =====
 * - الرد بيبدأ من فوق: بعد أي رد الشات بيقف على أول الرد (النص وأول كارت) والعميل ينزل براحته — مش على آخر كارت.
 * - الطلب (POST JSON على data-endpoint ، ونفسه في event.detail):
 *       { message, answers, context, session, lang: 'ar' | 'en', via: 'steps' | 'text', page: '/projects/scenes' }
 *     answers = اختيارات العميل الحالية دايمًا (حتى مع الأسئلة المكتوبة) ، context = الصفحة اللي هو فاتحها ($aiContext): { type: 'project' | 'unit' | 'area' | 'developer', id, name, url }.
 * - الرد JSON (كل المفاتيح اختيارية):
 *       reply      نص الرد (**بولد** وسطور)
 *       id         رقم الرسالة (بيرجع مع التقييم)
 *       criteria   ['شقة', 'القاهرة الجديدة', 'حتى 10 مليون'] — اللي الإيجنت فهمه من كلام العميل: بيظهر في شريط "طلبك" فوق الشات
 *       options    ['2 غرف', '3 غرف', '4+'] — سؤال توضيحي: زراير تحت الرد ، الضغط بيبعت النص كرسالة
 *       stats      [{ label, value, unit, note, trend: 'up' | 'down' }] أو { title, items: [...] } — أرقام السوق (سعر المتر / العائد / مؤشر شاري)
 *       results    { total, search_url, title, visible } — عدد النتايج + لينك "اعرض الكل في البحث" (visible = عدد الكروت الظاهرة قبل "اعرض كمان" ، الافتراضي 3)
 *       cards      [{ ...الكارت زي فوق + slug (للمفضلة والمقارنة) , match: 92 (نسبة المطابقة) , reasons: ['في حدود ميزانيتك', ...] (ليه رشحناها) }]
 *       compare    { title, columns: ['سينز', 'آي سيتي'], rows: [{ label, values: [...], best: 0 }], note } — جدول مقارنة
 *       sources    [{ label, url }] — مصدر الأرقام
 *       actions    [{ label, url } | { label, say: 'نص يتبعت' } | { label, type: 'meeting' }] — زراير تحت الرد
 *       meeting    true = كارت "تحب تتكلم مع مستشار شاري؟" ، book = ابدأ حجز الميتنج ، lead: true | { title, text } = فورم "خلّي مستشار يكلمك" (اسم + موبايل)
 *       chips      اختصارات المتابعة فوق خانة الكتابة ، session رقم الجلسة ، feedback: false = من غير زراير التقييم ، error: true = رسالة خطأ + "حاول تاني"
 * - الرد على مراحل (اختياري — Streaming): لو الرد Content-Type: application/x-ndjson أو text/event-stream ، كل سطر JSON:
 *       { "status": "بدوّر في وحدات القاهرة الجديدة…" }   ← بيتكتب جنب نقط الكتابة
 *       { "delta": "جزء من النص" }                        ← النص بيتكتب قدام العميل
 *       { "reply": "...", "cards": [...], ... }           ← السطر الأخير: الرد الكامل بنفس المفاتيح اللي فوق
 *   ومن غير endpoint (حدث shary:ai-send): event.detail.status('...') ، event.detail.stream('...') ، event.detail.reply(text, more) ، event.detail.fail() ، event.detail.signal (AbortSignal — العميل ضغط "إيقاف").
 * - التقييم 👍 / 👎 / نسخ تحت كل رد: حدث shary:ai-feedback ({ id, value: 'up' | 'down', reason, text, session }) + POST JSON على contact.feedback ($aiFeedbackUrl) لو موجود.
 * - "خلّي مستشار يكلمك" (lead): حدث shary:ai-lead ({ data, done(ok, message) }) + POST JSON على contact.lead ($aiLeadUrl):
 *       { name, phone, country_code, message (آخر سؤال للعميل), source: 'shary-ai', answers, context, session }
 * - شريط "طلبك" [data-ai-criteria]: اختيارات العميل (أو criteria من الرد) + "تعديل" بيرجّعه للأسئلة باختياراته ويبعت البحث من جديد.
 * - المفضلة والمقارنة على الكارت بنفس زراير الموقع (data-favorite-toggle / data-compare-toggle) — بتشتغل مع site-chrome.js من غير أي كود زيادة.
 * - أي زرار data-ask-ai يقدر يفتح الإيجنت على حاجة معينة: data-ai-context='{"type":"project","id":"scenes","name":"سينز","url":"..."}' (سياق الزرار ده)
 *   و data-ai-ask="أسعار وخطط السداد في سينز" (السؤال بيتبعت على طول). من الكود: panel.sharyContext({...}) ، panel.sharyAsk('...') ، panel.sharyOpen() ، panel.sharyClose().
 * - وقت الانتظار: حالات بتتغير ("بفهم طلبك…" ← "بدوّر في بيانات شاري…" ← "برتّب أنسب النتايج…") من lang/ai.php ← ui.steps ، وزرار الإرسال بيبقى "إيقاف".
 */
(function () {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-ai-panel]'));
    if (!panels.length) return;

    function make(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text != null) node.textContent = text;
        return node;
    }
    var ICONS = {
        bed: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 15h18M6 10V7.500A1.500 1.500 0 0 1 7.500 6h9A1.500 1.500 0 0 1 18 7.500V10"/></svg>',
        bath: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2ZM6 12V6.500A2.500 2.500 0 0 1 8.500 4c1.200 0 2 .700 2.300 1.700M7 19l-1 2M17 19l1 2"/></svg>',
        size: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20 20 4M4 20V9M4 20h11M9 15l2 2M13 11l2 2"/></svg>',
        phone: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.600 10.800a15.100 15.100 0 0 0 6.600 6.600l2.200-2.200a1 1 0 0 1 1-.250 11.400 11.400 0 0 0 3.600.570 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.500a1 1 0 0 1 1 1c0 1.250.200 2.450.570 3.570a1 1 0 0 1-.250 1L6.600 10.800Z"/></svg>',
        calendar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.500" y="5" width="17" height="15" rx="2.500"/><path d="M8 3v4M16 3v4M3.500 10h17"/></svg>',
        check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.500 4.500 4.500L19 7.500"/></svg>',
        pin: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.200 7 13 7 13s7-7.800 7-13a7 7 0 0 0-7-7Zm0 9.500A2.500 2.500 0 1 1 12 6.500a2.500 2.500 0 0 1 0 5Z"/></svg>',
        // نفس أيقونات كروت الموقع بالظبط (search/partials/unit-card): قارن / المفضلة / شارك
        heart: '<svg class="group-aria-pressed:fill-current" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20.3s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.6c0 5.5-7.5 10.1-7.5 10.1Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>',
        compare: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5v19"/><path d="M9 5H6.5A2.5 2.5 0 0 0 4 7.5v9A2.5 2.5 0 0 0 6.5 19H9"/><path d="M15 5h2.5A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5H15V5Z" fill="currentColor"/></svg>',
        shareCard: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1"/></svg>',
        up: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 11v9H4v-9h3ZM7 11l4-7a2 2 0 0 1 2 2v4h5.500a1.500 1.500 0 0 1 1.500 1.800l-1.300 6A1.500 1.500 0 0 1 17.200 19H7"/></svg>',
        down: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 13V4h3v9h-3ZM17 13l-4 7a2 2 0 0 1-2-2v-4H5.500A1.500 1.500 0 0 1 4 12.200l1.300-6A1.500 1.500 0 0 1 6.800 5H17"/></svg>',
        copy: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8.500" y="8.500" width="11" height="11" rx="2.500"/><path d="M15.500 5.500v-1a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h1"/></svg>',
        tick: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.500 4.500 4.500L19 7.500"/></svg>',
        search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="6.500"/><path d="m20 20-4.200-4.200"/></svg>'
    };

    panels.forEach(function (panel) {
        var config = {};
        try { config = JSON.parse(panel.getAttribute('data-ai-config') || '{}'); } catch (error) { config = {}; }
        var T = config.text || {};
        var flow = Array.isArray(config.flow) ? config.flow : [];
        var contact = config.contact || {};
        var user = config.user || {};

        var onb = panel.querySelector('[data-ai-onb]');
        var stepsBox = panel.querySelector('[data-ai-steps]');
        var startButton = panel.querySelector('[data-ai-start]');
        var skipButton = panel.querySelector('[data-ai-skip]');
        var scroll = panel.querySelector('[data-ai-scroll]');
        var list = panel.querySelector('[data-ai-messages]');
        var chipsBox = panel.querySelector('[data-ai-chips]');
        var form = panel.querySelector('[data-ai-form]');
        var input = form.querySelector('[name="message"]');
        var opener = null;
        var answers = {};          // اختيارات الأسئلة: { area: [{ value, label }, ...], ... } — دايمًا قايمة (السؤال العادي فيها عنصر واحد)
        var session = '';          // رقم الجلسة اللي بيرجعه السيرفر (اختياري)
        var busy = false;
        var stepsShown = 0;        // عدد الأسئلة الظاهرة (الحركة للسؤال الجديد بس)
        var B = T.book || {};      // نصوص حجز الميتنج
        var times = Array.isArray(contact.times) ? contact.times : [];
        var countries = Array.isArray(contact.countries) ? contact.countries : [];
        var wide = window.matchMedia('(min-width: 1024px)');   // ديسك توب: نافذة ثابتة على الجنب
        var STORE = 'shary-ai-state';
        var book = null;           // حجز الميتنج الشغال: { box, intro, state }
        var saved = { name: user.name || '', phone: user.phone || '', code: countries.length ? countries[0].code : '+20' };
        var langNode = panel.closest ? panel.closest('[lang]') : null;
        var english = ((langNode && langNode.lang) || document.documentElement.lang || 'ar').indexOf('en') === 0;
        var U = T.ui || {};        // نصوص الإيجنت (lang/ai.php ← ui)
        var context = config.context && config.context.name ? config.context : null;   // الصفحة اللي العميل فاتحها ($aiContext)
        var critBox = panel.querySelector('[data-ai-criteria]');
        var critList = critBox ? critBox.querySelector('[data-ai-criteria-list]') : null;
        var contextBox = panel.querySelector('[data-ai-context]');
        var sendButton = form.querySelector('.sai__send');
        var understood = [];       // اللي الإيجنت فهمه من كلام العميل (criteria في الرد) — بيظهر في شريط "طلبك"
        var lastText = '';         // آخر سؤال للعميل (بيتبعت مع "خلّي مستشار يكلمك")
        var stopNow = null;        // إيقاف الرد الشغال
        var sendLabel = sendButton ? (sendButton.getAttribute('aria-label') || '') : '';
        var startText = startButton ? startButton.textContent : '';
        var skipText = skipButton ? skipButton.textContent : '';

        // كود الدولة: علم + الكود بس (من غير اسم الدولة) — select عادي شفاف فوقهم عشان قايمة الموبايل الأصلية تفتح
        function flagEmoji(iso) {
            iso = String(iso || '').toUpperCase();
            if (!/^[A-Z]{2}$/.test(iso) || !String.fromCodePoint) return '';
            return String.fromCodePoint(127397 + iso.charCodeAt(0), 127397 + iso.charCodeAt(1));
        }
        function codeField(onChange) {
            var wrap = make('div', 'sai__code-box');
            var button = make('button', 'sai__code'); button.type = 'button'; button.setAttribute('aria-haspopup', 'listbox'); button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-label', B.code || '');
            var flag = make('img'); flag.alt = ''; flag.width = 24; flag.height = 18; flag.setAttribute('aria-hidden', 'true');
            var text = make('b', '');
            var arrow = make('i', 'sai__code-arrow'); arrow.setAttribute('aria-hidden', 'true');
            // القيمة المختارة (بتتقري زي أي خانة: .value)
            var select = make('input'); select.type = 'hidden'; select.value = saved.code || (countries[0] ? countries[0].code : '');
            var menu = make('div', 'sai__code-menu'); menu.hidden = true;
            // بحث فوق القايمة: باسم الدولة أو الكود
            var find = make('input'); find.type = 'search'; find.autocomplete = 'off'; find.placeholder = B.code_search || ''; find.setAttribute('aria-label', B.code_search || '');
            var rows = make('ul'); rows.setAttribute('role', 'listbox'); rows.setAttribute('aria-label', B.code || '');
            var flagUrl = function (iso) { return iso && contact.flags ? String(contact.flags).replace(/\/$/, '') + '/' + iso + '.svg' : ''; };
            function show() {
                var picked = countries.filter(function (country) { return country.code === select.value; })[0] || countries[0] || {};
                text.textContent = select.value;
                var src = flagUrl(picked.iso);
                if (src) { flag.src = src; flag.hidden = false; } else flag.hidden = true;
            }
            function open(state) {
                menu.hidden = !state;
                button.setAttribute('aria-expanded', state ? 'true' : 'false');
                if (state) { find.value = ''; filterRows(); find.focus(); }
            }
            function pickCode(code) { select.value = code; show(); open(false); if (onChange) onChange(code); button.focus(); }
            function simple(value) { return String(value || '').toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ').trim(); }
            function filterRows() {
                var q = simple(find.value).replace(/^\+|^00/, '');
                Array.prototype.forEach.call(rows.children, function (row) { row.hidden = !!q && row.__hay.indexOf(q) === -1; });
            }
            countries.forEach(function (country) {
                var row = make('li'); row.setAttribute('role', 'option'); row.tabIndex = -1;
                row.__hay = simple([country.name, country.name_en, country.iso, String(country.code).replace(/\D+/g, '')].join(' '));
                var src = flagUrl(country.iso);
                if (src) { var image = make('img'); image.alt = ''; image.width = 24; image.height = 18; image.loading = 'lazy'; image.src = src; row.appendChild(image); }
                row.appendChild(make('span', '', country.name || ''));
                var codeText = make('b', '', country.code); codeText.dir = 'ltr';
                row.appendChild(codeText);
                row.addEventListener('click', function () { pickCode(country.code); });
                row.addEventListener('keydown', function (event) { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); pickCode(country.code); } });
                rows.appendChild(row);
            });
            button.addEventListener('click', function () { open(menu.hidden); });
            find.addEventListener('input', filterRows);
            find.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') { open(false); button.focus(); return; }
                if (event.key !== 'Enter') return;
                event.preventDefault();
                var first = Array.prototype.filter.call(rows.children, function (row) { return !row.hidden; })[0];
                if (first) first.click();
            });
            document.addEventListener('click', function (event) { if (!menu.hidden && !wrap.contains(event.target)) open(false); });
            flag.addEventListener('error', function () { flag.hidden = true; });
            button.appendChild(flag); button.appendChild(text); button.appendChild(arrow);
            menu.appendChild(find); menu.appendChild(rows);
            wrap.appendChild(button); wrap.appendChild(menu); wrap.appendChild(select);
            show();
            return { wrap: wrap, select: select };
        }
        // اللي العميل مهتم بيه (للواتساب والميل): اللي فاتحه + اختياراته + آخر سؤال
        function interestText() {
            var parts = [];
            if (context && context.name) parts.push(context.name);
            var picked = criteriaLabels().join(U.sep || '، ');
            if (picked) parts.push(picked);
            return parts.join(' — ');
        }
        function pageInfo() { return { page_url: location.href, page_title: document.title }; }

        // ---------- أسئلة الاختيار ----------
        function chosenOf(key) { return answers[key] || []; }
        function optionsOf(step) {
            var out = [];
            if (!step.depends) out = Array.isArray(step.options) ? step.options.slice() : [];
            else {
                // اختيارات معتمدة على سؤال قبله: لو العميل اختار أكتر من قيمة هناك، الاختيارات بتتجمع من غير تكرار
                var map = step.options || {};
                var seen = {};
                chosenOf(step.depends).forEach(function (parent) {
                    (Array.isArray(map[parent.value]) ? map[parent.value] : []).forEach(function (option) {
                        if (seen[option.value]) return;
                        seen[option.value] = true;
                        out.push(option);
                    });
                });
            }
            if (step.all && out.length) out.push({ value: '', label: step.all, exclusive: true });
            return out;
        }
        // سؤال 'auto' له اختيار واحد بس (مثال: الساحل ← مصيفي): بيتحدد لوحده ومش بيتسأل
        function autoOption(step) {
            if (!step.auto) return null;
            var options = optionsOf(step).filter(function (option) { return option.value !== ''; });
            return options.length === 1 ? options[0] : null;
        }
        // الخطوات اللي ليها اختيارات دلوقتي (الحي بيظهر بس لو المنطقة ليها أحياء)
        function activeSteps() {
            return flow.filter(function (step) { return (!step.depends || optionsOf(step).length) && !autoOption(step); });
        }
        function isOn(key, value) { return chosenOf(key).some(function (item) { return item.value === value; }); }
        function renderSteps(quiet) {
            if (!stepsBox) return;
            stepsBox.textContent = '';
            var steps = activeSteps();
            var open = true;
            var count = 0;
            steps.forEach(function (step) {
                if (!open) return;
                count += 1;
                var block = make('div', 'sai__step' + (count > stepsShown ? ' sai__step--new' : ''));
                var head = make('p', 'sai__q');
                head.appendChild(make('b', '', step.question));
                var hint = step.hint || (step.multiple ? T.multi : '');
                if (hint) head.appendChild(make('span', '', hint));
                block.appendChild(head);
                var opts = make('div', 'sai__opts' + (step.multiple ? ' sai__opts--multi' : ''));
                optionsOf(step).forEach(function (option) {
                    var button = make('button', '', option.label);
                    button.type = 'button';
                    var on = isOn(step.key, option.value);
                    if (on) button.className = 'is-on';
                    button.setAttribute('aria-pressed', on ? 'true' : 'false');
                    button.addEventListener('click', function () { pick(step, option); });
                    opts.appendChild(button);
                });
                block.appendChild(opts);
                stepsBox.appendChild(block);
                if (!chosenOf(step.key).length) open = false;   // السؤال اللي بعده بيظهر بعد أول اختيار
            });
            var grew = count > stepsShown;
            stepsShown = count;
            var done = steps.length > 0 && steps.every(function (step) { return chosenOf(step.key).length > 0; });
            if (startButton) startButton.disabled = !done;
            var target = done ? startButton : (grew ? stepsBox.lastElementChild : null);
            if (!quiet && target && target.scrollIntoView) target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
        function pick(step, option) {
            var item = { value: option.value, label: option.label, exclusive: !!option.exclusive };
            var current = chosenOf(step.key).slice();
            if (!step.multiple) current = [item];
            else if (isOn(step.key, option.value)) current = current.filter(function (one) { return one.value !== option.value; });   // ضغطة تانية بتشيل الاختيار
            else if (item.exclusive) current = [item];                                                                              // "أي منطقة" / "كل الأحياء" بتلغي الباقي
            else { current = current.filter(function (one) { return !one.exclusive; }); current.push(item); }
            if (current.length) answers[step.key] = current; else delete answers[step.key];
            // الأسئلة المعتمدة على السؤال ده: بنشيل منها الاختيارات اللي ما بقتش متاحة
            flow.forEach(function (next) {
                if (!next.depends) return;
                if (answers[next.key]) {
                    var allowed = optionsOf(next).map(function (one) { return one.value; });
                    var kept = answers[next.key].filter(function (one) { return allowed.indexOf(one.value) > -1; });
                    if (kept.length) answers[next.key] = kept; else delete answers[next.key];
                }
                var only = autoOption(next);
                if (only) answers[next.key] = [{ value: only.value, label: only.label, exclusive: false }];
            });
            renderSteps();
        }
        // أسماء الاختيارات — ولو العميل اختار "الكل" بس بيتكتب "الكل"
        function labels(key, joiner) {
            var picked = chosenOf(key);
            var named = picked.filter(function (item) { return item.value !== ''; });
            return (named.length ? named : picked).map(function (item) { return item.label; }).join(joiner);
        }
        function queryText() {
            var or = T.or || ' / ';
            var text = String(T.query || '');
            // المكان: أحياء كل منطقة لو العميل اختار منها — وإلا اسم المنطقة نفسها
            var subStep = flow.filter(function (step) { return step.key === 'sub'; })[0];
            var subMap = (subStep && subStep.options) || {};
            var places = [];
            chosenOf('area').forEach(function (area) {
                var mine = chosenOf('sub').filter(function (sub) { return sub.value !== '' && (Array.isArray(subMap[area.value]) ? subMap[area.value] : []).some(function (option) { return option.value === sub.value; }); });
                if (mine.length) mine.forEach(function (sub) { places.push(sub.label); }); else places.push(area.label);
            });
            var map = { type: labels('type', or), use: labels('use', or), place: places.join(or), budget: labels('budget', or), purpose: labels('purpose', T.and || ' + ') };
            Object.keys(map).forEach(function (key) { text = text.replace(':' + key, map[key]); });
            return text.replace(/\s+/g, ' ').trim();
        }
        // السؤال المتعدد = array من القيم ، السؤال العادي = قيمة واحدة
        function plainAnswers() {
            var out = {};
            flow.forEach(function (step) {
                if (!chosenOf(step.key).length) return;
                var values = chosenOf(step.key).map(function (item) { return item.value; }).filter(function (value) { return value !== ''; });
                // "الكل": بتتبعت كل قيم السؤال
                if (!values.length && step.multiple) values = optionsOf(step).map(function (option) { return option.value; }).filter(function (value) { return value !== ''; });
                out[step.key] = step.multiple ? values : (values[0] || '');
            });
            return out;
        }

        // ---------- شريط "طلبك": اختيارات العميل (أو اللي الإيجنت فهمه من كلامه) + "تعديل" ----------
        function criteriaLabels() {
            if (understood.length) return understood.slice();
            var out = [];
            flow.forEach(function (step) { var text = labels(step.key, U.sep || '، '); if (text) out.push(text); });
            return out;
        }
        function renderCriteria() {
            if (!critBox || !critList) return;
            critList.textContent = '';
            criteriaLabels().forEach(function (text) { critList.appendChild(make('span', '', text)); });
            critBox.classList.toggle('hidden', !critList.children.length || scroll.classList.contains('hidden'));
        }
        function onbLabels() {
            var started = list.children.length > 1;
            if (startButton) startButton.textContent = started && U.update ? U.update : startText;
            if (skipButton) skipButton.textContent = started && U.back_chat ? U.back_chat : skipText;
        }
        // "تعديل": رجوع للأسئلة بنفس الاختيارات — المحادثة بتفضل زي ما هي
        function editCriteria() {
            if (busy || !onb) return;
            dropBook();
            understood = [];
            scroll.classList.add('hidden');
            if (chipsBox) chipsBox.classList.add('hidden');
            if (critBox) critBox.classList.add('hidden');
            onb.classList.remove('hidden');
            stepsShown = flow.length;
            renderSteps(true);
            onbLabels();
            onb.scrollTop = 0;
        }
        // الصفحة اللي العميل فاتحها: سطر "بتتفرج على …" + أسئلة جاهزة عنها
        function renderContext() {
            if (!contextBox) return;
            contextBox.textContent = '';
            contextBox.classList.toggle('hidden', !context);
            if (!context) return;
            var head = make('p', 'sai__ctx-head');
            head.appendChild(make('span', '', U.context || ''));
            head.appendChild(make('b', '', context.name));
            contextBox.appendChild(head);
            var asks = make('div', 'sai__asks');
            ((U.context_chips || {})[context.type] || []).forEach(function (text) {
                var button = make('button', '', String(text).replace(':name', context.name));
                button.type = 'button';
                button.setAttribute('data-ai-say', button.textContent);
                asks.appendChild(button);
            });
            if (asks.children.length) contextBox.appendChild(asks);
        }

        // ---------- الشات ----------
        function showChat() {
            if (onb) onb.classList.add('hidden');
            scroll.classList.remove('hidden');
            if (chipsBox && chipsBox.children.length) chipsBox.classList.remove('hidden');
            if (!list.children.length && T.welcome) bubble(T.welcome, false);
            renderCriteria();
        }
        function toBottom() { scroll.scrollTop = scroll.scrollHeight; }
        // الرد بيبدأ من فوق: الشات بيقف على أول الرد (مش آخره) والعميل ينزل براحته
        function toNode(node) {
            if (!node || !node.getBoundingClientRect) { toBottom(); return; }
            var top = Math.max(0, node.getBoundingClientRect().top - scroll.getBoundingClientRect().top + scroll.scrollTop - 10);
            scroll.scrollTop = top;
        }
        function avatar(mine) {
            var node = make('span', 'sai__avatar ' + (mine ? 'sai__avatar--me' : 'sai__avatar--bot'));
            node.setAttribute('aria-hidden', 'true');
            if (mine && user.avatar) { node.style.backgroundImage = 'url("' + String(user.avatar).replace(/"/g, '%22') + '")'; node.classList.add('sai__avatar--img'); }
            else node.textContent = mine ? String(user.name || T.me || '').trim().slice(0, 1) : 'AI';
            return node;
        }
        function row(mine) {
            var line = make('div', 'sai__row ' + (mine ? 'sai__row--me' : 'sai__row--bot'));
            var col = make('div', 'sai__col');
            col.appendChild(make('span', 'sai__who', mine ? (user.name || T.me || '') : (T.bot || 'Shary AI')));
            line.appendChild(avatar(mine));
            line.appendChild(col);
            list.appendChild(line);
            return col;
        }
        // النص: **كلمة** = بولد ، وكل سطر في فقرة (من غير HTML من السيرفر)
        function fill(node, text) {
            String(text).split(/\n+/).forEach(function (lineText) {
                var p = make('p');
                lineText.split(/(\*\*[^*]+\*\*)/).forEach(function (part) {
                    if (/^\*\*[^*]+\*\*$/.test(part)) p.appendChild(make('b', '', part.slice(2, -2)));
                    else if (part) p.appendChild(document.createTextNode(part));
                });
                node.appendChild(p);
            });
        }
        function bubble(text, mine, stay) {
            var col = row(mine);
            var node = make('div', 'sai__msg ' + (mine ? 'sai__msg--me' : 'sai__msg--bot'));
            fill(node, text);
            col.appendChild(node);
            if (!stay) toBottom();
            return node;
        }
        function waLink(text) {
            var number = String(contact.whatsapp || '').replace(/\D+/g, '');
            return 'https://wa.me/' + number + (text ? '?text=' + encodeURIComponent(text) : '');
        }
        function action(className, label, icon, href) {
            var node = make(href ? 'a' : 'button', 'sai__way ' + className);
            if (href) { node.href = href; if (/^https?:/.test(href)) { node.target = '_blank'; node.rel = 'noopener'; } } else node.type = 'button';
            if (icon) node.insertAdjacentHTML('beforeend', icon);
            node.appendChild(make('span', '', label));
            return node;
        }
        // "احجز ميتنج": الحجز بيتم جوه الشات (item = الوحدة/المشروع اللي الزرار تحته — من غيره بنسأل "بخصوص إيه؟")
        function meetButton(label, className, item) {
            var node = action(className || 'sai__way--meet', label || T.meet, ICONS.calendar, '');
            var subject = subjectOf(item);
            node.setAttribute('data-ai-meet', subject ? JSON.stringify(subject) : '');
            return node;
        }
        function card(item) {
            var isUnit = item.type !== 'project';
            var name = isUnit ? item.title : item.name;
            var box = make('article', 'sai__card');
            box.setAttribute('data-subject', JSON.stringify(subjectOf(item) || {}));
            // قارن + المفضلة + شارك: نفس زراير وأيقونات صفحة المشروع بالظبط (.area-action.prop-action — site-chrome.js) — محتاجة slug الوحدة / المشروع
            if (item.slug && item.image) {
                var tools = make('div', 'sai__card-tools');
                var fav = make('button', 'area-action prop-action group'); fav.type = 'button';
                fav.setAttribute('data-favorite-toggle', '');
                fav.setAttribute('data-favorite-id', item.favorite_id || ((isUnit ? 'units/' : 'projects/') + item.slug));
                fav.setAttribute('aria-pressed', 'false'); fav.setAttribute('aria-label', U.fav || ''); fav.title = U.fav || '';
                fav.innerHTML = ICONS.heart;
                var cmp = make('button', 'area-action prop-action'); cmp.type = 'button';
                cmp.setAttribute('data-compare-toggle', '');
                cmp.setAttribute('data-compare-type', isUnit ? 'unit' : 'project');
                cmp.setAttribute('data-compare-id', item.slug);
                cmp.setAttribute('aria-pressed', 'false'); cmp.setAttribute('aria-label', U.compare || ''); cmp.title = U.compare || '';
                cmp.innerHTML = ICONS.compare;
                // شارك: نفس زرار المشاركة بتاع الموقع (رسالة ببيانات الوحدة / المشروع + اللينك + الصورة)
                var share = make('button', 'area-action prop-action'); share.type = 'button';
                share.setAttribute('data-share-url', item.url || ''); share.setAttribute('data-share-title', item.title || item.name || '');
                share.setAttribute('aria-label', U.share || ''); share.title = U.share || '';
                share.innerHTML = ICONS.shareCard;
                // رسالة المشاركة بنفس شكل كروت الموقع: البيانات + اللينك + صورة الكارت (data-wa-text / data-wa-url / data-wa-image)
                var shareLines = [
                    (isUnit ? (english ? 'Unit' : 'اسم الوحدة') : (english ? 'Project' : 'اسم المشروع')) + ': ' + (item.title || item.name || ''),
                    item.ref ? (english ? 'Reference' : 'المرجع') + ': ' + item.ref : '',
                    item.price ? (english ? 'Price' : 'السعر') + ': ' + item.price : '',
                    item.location ? (english ? 'Location' : 'المنطقة') + ': ' + item.location : '',
                    isUnit ? (english ? 'Unit link:' : 'رابط الوحدة:') : (english ? 'Project link:' : 'رابط المشروع:')
                ].filter(Boolean).join('\n');
                share.setAttribute('data-wa-text', shareLines); share.setAttribute('data-wa-url', item.url || ''); share.setAttribute('data-wa-image', item.image || '');
                tools.appendChild(cmp); tools.appendChild(fav);
                if (item.url) tools.appendChild(share);
                box.appendChild(tools);
            }
            if (item.image) {
                var photo = make(item.url ? 'a' : 'span', 'sai__card-photo');
                if (item.url) photo.href = item.url;
                var img = make('img');
                img.src = item.image; img.alt = name || ''; img.loading = 'lazy';
                if (item.image_fallback) img.onerror = function () { img.onerror = null; img.src = item.image_fallback; };
                photo.appendChild(img);
                if (item.badge) photo.appendChild(make('span', 'sai__card-badge', item.badge));
                box.appendChild(photo);
            }
            var body = make('div', 'sai__card-body');
            // شريط المطور: الحروف المختصرة + الاسم (+ مؤشر شاري للمشروع)
            var dev = make('div', 'sai__card-dev');
            dev.appendChild(make('span', 'sai__card-logo', item.developer_short || String(item.developer || '').slice(0, 2)));
            dev.appendChild(make('span', 'sai__card-devname', item.developer || ''));
            if (!isUnit && item.index) {
                var score = make('span', 'sai__card-index');
                score.appendChild(make('b', '', String(item.index)));
                score.appendChild(make('small', '', T.index || ''));
                dev.appendChild(score);
            }
            body.appendChild(dev);
            var title = make('h3', 'sai__card-title');
            if (item.url) { var link = make('a', '', name || ''); link.href = item.url; title.appendChild(link); } else title.textContent = name || '';
            body.appendChild(title);
            if (item.location) {
                var place = make('p', 'sai__card-place');
                place.insertAdjacentHTML('beforeend', ICONS.pin);
                place.appendChild(make('span', '', item.location));
                body.appendChild(place);
            }
            // السعر: رقم كبير ذهبي
            if (item.price) {
                var price = make('p', 'sai__card-price');
                if (!isUnit) price.appendChild(make('small', '', T.from || ''));
                var amount = make('b', '', String(item.price)); amount.dir = 'ltr';
                price.appendChild(amount);
                price.appendChild(make('span', '', item.currency || T.currency || ''));
                body.appendChild(price);
            }
            if (item.plan) body.appendChild(make('p', 'sai__card-plan', item.plan));
            // نسبة المطابقة لطلب العميل (match: 0 – 100)
            var match = Math.max(0, Math.min(100, parseInt(item.match, 10) || 0));
            if (match) {
                var fit = make('div', 'sai__card-fit');
                var fitText = make('p');
                fitText.appendChild(make('b', '', match + '%'));
                fitText.appendChild(make('span', '', U.match || ''));
                var bar = make('i'); var barFill = make('i'); barFill.style.width = match + '%'; bar.appendChild(barFill);
                fit.appendChild(fitText); fit.appendChild(bar);
                body.appendChild(fit);
            }
            // خانات الوحدة (غرف / حمامات / مساحة) أو أنواع وحدات المشروع
            if (isUnit) {
                var cells = make('ul', 'sai__card-cells');
                [[item.beds, T.beds, ICONS.bed], [item.baths, T.baths, ICONS.bath], [item.area, T.area, ICONS.size]].forEach(function (cell) {
                    if (cell[0] == null || cell[0] === '') return;
                    var li = make('li');
                    li.insertAdjacentHTML('beforeend', cell[2]);
                    li.appendChild(make('b', '', String(cell[0])));
                    li.appendChild(make('span', '', cell[1] || ''));
                    cells.appendChild(li);
                });
                if (cells.children.length) body.appendChild(cells);
            } else if (Array.isArray(item.types) && item.types.length) {
                var types = make('p', 'sai__card-types');
                item.types.slice(0, 4).forEach(function (type) { types.appendChild(make('span', '', type)); });
                body.appendChild(types);
            }
            // ليه رشحناها (reasons)
            if (Array.isArray(item.reasons) && item.reasons.length) {
                var why = make('div', 'sai__card-why');
                why.appendChild(make('b', '', U.why || ''));
                var whyList = make('ul');
                item.reasons.slice(0, 4).forEach(function (reason) {
                    var li = make('li');
                    li.insertAdjacentHTML('beforeend', ICONS.tick);
                    li.appendChild(make('span', '', String(reason)));
                    whyList.appendChild(li);
                });
                why.appendChild(whyList);
                body.appendChild(why);
            }
            // التواصل: اتصال + واتساب + احجز ميتنج (+ التفاصيل)
            var ways = make('div', 'sai__ways');
            ways.appendChild(action('sai__way--call', T.call, ICONS.phone, 'tel:' + (contact.phone || '')));
            var wa = action('sai__way--wa', T.whatsapp, '', waLink(name ? name + (item.url ? '\n' + item.url : '') : ''));
            wa.insertAdjacentHTML('afterbegin', '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>');
            ways.appendChild(wa);
            ways.appendChild(meetButton(null, null, item));
            body.appendChild(ways);
            if (item.url) { var more = make('a', 'sai__card-more', T.details || ''); more.href = item.url; body.appendChild(more); }
            box.appendChild(body);
            return box;
        }
        // كروت النتايج: عنوان بالعدد + "اعرض الكل في البحث" ← أول 3 كروت ← "اعرض كمان" ← لينك كل النتايج
        function cards(items, info) {
            if (!Array.isArray(items) || !items.length) return;
            info = info && typeof info === 'object' ? info : {};
            items = items.filter(function (item) { return item && typeof item === 'object'; });
            var total = parseInt(info.total, 10) || items.length;
            var wrap = make('div', 'sai__cards');
            var head = make('div', 'sai__res');
            head.appendChild(make('b', '', info.title || String(U.results || '').replace(':count', total)));
            if (info.search_url) {
                var all = make('a', '', U.see_all || ''); all.href = info.search_url;
                all.insertAdjacentHTML('afterbegin', ICONS.search);
                head.appendChild(all);
            }
            wrap.appendChild(head);
            var show = parseInt(info.visible, 10) || 3;
            items.forEach(function (item, index) {
                var box = card(item);
                if (index >= show) box.hidden = true;
                wrap.appendChild(box);
            });
            if (items.length > show) {
                var more = make('button', 'sai__more', String(U.more_cards || '').replace(':count', items.length - show)); more.type = 'button';
                more.setAttribute('data-ai-more', '');
                wrap.appendChild(more);
            }
            if (info.search_url && total > items.length) {
                var link = make('a', 'sai__more sai__more--all', String(U.all_results || '').replace(':count', total)); link.href = info.search_url;
                wrap.appendChild(link);
            }
            list.appendChild(wrap);
            if (window.SharyCards) window.SharyCards.refresh(wrap);
        }
        // أرقام السوق: [{ label, value, unit, note, trend }] أو { title, items }
        function statsBlock(data) {
            var items = Array.isArray(data) ? data : (data && Array.isArray(data.items) ? data.items : []);
            if (!items.length) return;
            var box = make('div', 'sai__blk sai__stats');
            if (data.title) box.appendChild(make('b', 'sai__blk-title', data.title));
            var grid = make('div', 'sai__stats-grid');
            items.slice(0, 6).forEach(function (item) {
                var cell = make('div', 'sai__stat');
                cell.appendChild(make('span', '', item.label || ''));
                var value = make('p');
                value.appendChild(make('b', '', String(item.value == null ? '' : item.value)));
                if (item.unit) value.appendChild(make('small', '', item.unit));
                cell.appendChild(value);
                if (item.note) cell.appendChild(make('em', item.trend === 'up' ? 'is-up' : (item.trend === 'down' ? 'is-down' : ''), (item.trend === 'up' ? '▲ ' : (item.trend === 'down' ? '▼ ' : '')) + item.note));
                grid.appendChild(cell);
            });
            box.appendChild(grid);
            list.appendChild(box);
        }
        // جدول المقارنة: { title, columns: [...], rows: [{ label, values: [...], best }], note }
        function compareBlock(data) {
            if (!data || !Array.isArray(data.columns) || !Array.isArray(data.rows) || !data.columns.length) return;
            var box = make('div', 'sai__blk sai__cmp');
            if (data.title) box.appendChild(make('b', 'sai__blk-title', data.title));
            var scroller = make('div', 'sai__cmp-scroll');
            var table = make('table');
            var top = make('tr');
            top.appendChild(make('th', '', ''));
            data.columns.forEach(function (column) { top.appendChild(make('th', '', typeof column === 'object' && column ? (column.name || '') : String(column))); });
            var thead = make('thead'); thead.appendChild(top); table.appendChild(thead);
            var tbody = make('tbody');
            data.rows.forEach(function (line) {
                if (!line) return;
                var tr = make('tr');
                tr.appendChild(make('th', '', line.label || ''));
                (Array.isArray(line.values) ? line.values : []).forEach(function (value, index) {
                    var td = make('td', line.best === index ? 'is-best' : '', String(value == null ? '—' : value));
                    if (line.best === index && U.best) td.title = U.best;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
            scroller.appendChild(table);
            box.appendChild(scroller);
            if (data.note) box.appendChild(make('p', 'sai__blk-note', data.note));
            list.appendChild(box);
        }
        function sourcesBlock(items) {
            if (!Array.isArray(items) || !items.length) return;
            var box = make('p', 'sai__src');
            box.appendChild(make('span', '', U.sources || ''));
            items.slice(0, 4).forEach(function (item) {
                if (!item) return;
                var node = make(item.url ? 'a' : 'b', '', item.label || item.url || '');
                if (item.url) node.href = item.url;
                box.appendChild(node);
            });
            list.appendChild(box);
        }
        // سؤال توضيحي (options) / زراير تحت الرد (actions)
        function optionsBlock(items) {
            if (!Array.isArray(items) || !items.length) return;
            var box = make('div', 'sai__asks sai__asks--chat');
            items.slice(0, 8).forEach(function (item) {
                var label = typeof item === 'object' && item ? (item.label || '') : String(item);
                if (!label) return;
                var button = make('button', '', label); button.type = 'button';
                button.setAttribute('data-ai-say', (typeof item === 'object' && item && item.say) || label);
                box.appendChild(button);
            });
            list.appendChild(box);
        }
        function actionsBlock(items) {
            if (!Array.isArray(items) || !items.length) return;
            var box = make('div', 'sai__acts');
            items.slice(0, 4).forEach(function (item) {
                if (!item || !item.label) return;
                if (item.type === 'meeting') { box.appendChild(meetButton(item.label, 'sai__act', null)); return; }
                var node = make(item.url ? 'a' : 'button', 'sai__act', item.label);
                if (item.url) node.href = item.url; else { node.type = 'button'; node.setAttribute('data-ai-say', item.say || item.label); }
                box.appendChild(node);
            });
            if (box.children.length) list.appendChild(box);
        }
        // التقييم تحت الرد: 👍 / 👎 / نسخ
        function feedbackBar(id) {
            var bar = make('div', 'sai__fb');
            bar.setAttribute('data-ai-fb', id == null ? '' : String(id));
            [['up', U.fb_up, ICONS.up], ['down', U.fb_down, ICONS.down], ['copy', U.copy, ICONS.copy]].forEach(function (one) {
                var button = make('button', 'sai__fb-btn'); button.type = 'button';
                button.setAttribute('data-fb', one[0]);
                button.setAttribute('aria-label', one[1] || ''); button.title = one[1] || '';
                button.innerHTML = one[2];
                bar.appendChild(button);
            });
            list.appendChild(bar);
        }
        // نص الرد اللي فوق شريط التقييم
        function answerOf(bar) {
            var node = bar.previousElementSibling;
            while (node && !(node.classList.contains('sai__row--bot'))) {
                if (node.classList.contains('sai__row--me')) return '';
                node = node.previousElementSibling;
            }
            var msg = node ? node.querySelector('.sai__msg') : null;
            return msg ? Array.prototype.map.call(msg.querySelectorAll('p'), function (p) { return p.textContent; }).join('\n') : '';
        }
        function post(url, data) {
            url = String(url || '');
            if (!url || url.charAt(0) === '#') return Promise.resolve({});
            var token = document.querySelector('meta[name="csrf-token"]');
            return fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': token ? token.getAttribute('content') : '', 'X-Requested-With': 'XMLHttpRequest' },
                body: JSON.stringify(data)
            }).then(function (response) {
                if (!response.ok) throw new Error('failed');
                return response.json().catch(function () { return {}; });
            });
        }
        function sendFeedback(bar, value, reason) {
            var data = { id: bar.getAttribute('data-ai-fb') || '', value: value, reason: reason || '', text: answerOf(bar), session: session };
            if (!panel.dispatchEvent(new CustomEvent('shary:ai-feedback', { bubbles: true, cancelable: true, detail: data }))) return;
            post(contact.feedback, data).catch(function () { /* التقييم مش بيوقف العميل */ });
        }
        // الموبايل: أرقام بس من غير الصفر الأول — مصر: 10 أرقام بتبدأ بـ 10 / 11 / 12 / 15 ، باقي الدول: 6 إلى 12 رقم. بيرجّع '' لو الرقم غلط
        function cleanPhone(code, raw) {
            var digits = String(raw || '').replace(/[٠-٩]/g, function (digit) { return '٠١٢٣٤٥٦٧٨٩'.indexOf(digit); }).replace(/\D+/g, '');
            var prefix = String(code).replace(/\D+/g, '');
            if (prefix && digits.indexOf('00' + prefix) === 0) digits = digits.slice(prefix.length + 2);
            digits = digits.replace(/^0+/, '');
            if (code === '+20' && digits.length === 12 && digits.indexOf('20') === 0) digits = digits.slice(2);
            return (code === '+20' ? /^1[0125]\d{8}$/.test(digits) : /^\d{6,12}$/.test(digits)) ? digits : '';
        }
        // "خلّي مستشار يكلمك": اسم + موبايل جوه الشات (lead)
        function leadBlock(info) {
            info = info && typeof info === 'object' ? info : {};
            var L = U.lead || {};
            var box = make('div', 'sai__blk sai__lead');
            var head = make('div', 'sai__lead-head');
            var icon = make('span', 'sai__book-icon'); icon.innerHTML = ICONS.phone;
            var title = make('span', 'min-w-0');
            title.appendChild(make('b', '', info.title || L.title || ''));
            title.appendChild(make('small', '', info.text || L.text || ''));
            head.appendChild(icon); head.appendChild(title);
            box.appendChild(head);
            var fields = make('div', 'sai__fields');
            var name = make('input'); name.type = 'text'; name.autocomplete = 'name'; name.placeholder = B.name || ''; name.setAttribute('aria-label', B.name || ''); name.setAttribute('data-lead-name', '');
            name.setAttribute('value', saved.name);
            var phoneRow = make('div', 'sai__phone'); phoneRow.dir = 'ltr';
            var codeBox = codeField(); var code = codeBox.wrap; codeBox.select.setAttribute('data-lead-code', '');
            name.required = true; name.setAttribute('aria-required', 'true');
            var phone = make('input'); phone.type = 'tel'; phone.dir = 'ltr'; phone.autocomplete = 'tel-national'; phone.inputMode = 'tel'; phone.placeholder = B.phone || ''; phone.setAttribute('aria-label', B.phone || ''); phone.setAttribute('data-lead-phone', ''); phone.required = true; phone.setAttribute('aria-required', 'true');
            phone.setAttribute('value', saved.phone);
            if (countries.length) phoneRow.appendChild(code);
            phoneRow.appendChild(phone);
            var error = make('p', 'sai__book-error hidden');
            var go = make('button', 'sai__book-go', L.go || ''); go.type = 'button'; go.setAttribute('data-ai-lead-go', '');
            fields.appendChild(name); fields.appendChild(phoneRow); fields.appendChild(error); fields.appendChild(go);
            box.appendChild(fields);
            list.appendChild(box);
        }
        function submitLead(go) {
            var box = go.closest('.sai__lead');
            if (!box || go.disabled) return;
            var L = U.lead || {};
            var nameField = box.querySelector('[data-lead-name]');
            var phoneField = box.querySelector('[data-lead-phone]');
            var codeField = box.querySelector('[data-lead-code]');
            var error = box.querySelector('.sai__book-error');
            function fail(text, field) { error.textContent = text || ''; error.classList.remove('hidden'); if (field) field.focus(); }
            saved.name = nameField.value; saved.phone = phoneField.value; if (codeField) saved.code = codeField.value;
            var name = saved.name.replace(/\s+/g, ' ').trim();
            if (name.length < 2) return fail(B.err_name, nameField);
            var digits = cleanPhone(saved.code, saved.phone);
            if (!digits) return fail(B.err_phone, phoneField);
            error.classList.add('hidden');
            go.disabled = true; go.textContent = L.sending || B.sending || '';
            var data = { name: name, phone: digits, country_code: saved.code, message: lastText, interest: interestText(), source: 'shary-ai', form: 'ai-lead', answers: plainAnswers(), context: context, session: session };
            var where = pageInfo(); data.page_url = where.page_url; data.page_title = where.page_title;
            var finished = false;
            function done(ok, message) {
                if (finished) return;
                finished = true;
                if (ok === false) { go.disabled = false; go.textContent = L.go || ''; return fail(message || B.err_send); }
                var okBox = make('div', 'sai__booked');
                var okHead = make('div', 'sai__booked-head');
                var mark = make('span'); mark.innerHTML = ICONS.check;
                okHead.appendChild(mark); okHead.appendChild(make('b', '', L.done_title || ''));
                okBox.appendChild(okHead);
                okBox.appendChild(make('p', 'sai__booked-note', message || String(L.done || '').replace(':name', name)));
                if (box.parentNode) box.parentNode.replaceChild(okBox, box);
                save();
            }
            if (!panel.dispatchEvent(new CustomEvent('shary:ai-lead', { bubbles: true, cancelable: true, detail: { data: data, done: done } }))) return;
            var url = String(contact.lead || '');
            if (!url || url.charAt(0) === '#') { window.setTimeout(function () { done(true); }, 500); return; }   // معاينة من غير سيرفر
            post(url, data).then(function (result) { done(true, result && result.message); }).catch(function () { done(false); });
        }
        // ---------- حجز الميتنج جوه الشات ----------
        // آخر كروت اتعرضت في المحادثة (عشان "الميتنج بخصوص إيه؟") — من الصفحة نفسها عشان تفضل شغالة بعد استرجاع المحادثة
        function lastSubjects() {
            var wraps = list.querySelectorAll('.sai__cards');
            if (!wraps.length) return [];
            return Array.prototype.map.call(wraps[wraps.length - 1].querySelectorAll('[data-subject]'), function (node) {
                try { var one = JSON.parse(node.getAttribute('data-subject')); return one && one.name ? one : null; } catch (error) { return null; }
            }).filter(Boolean);
        }
        function two(number) { return (number < 10 ? '0' : '') + number; }
        function subjectOf(item) {
            if (!item) return null;
            var name = item.title || item.name || '';
            return name ? { name: name, type: item.type === 'project' ? 'project' : 'unit', url: item.url || '' } : null;
        }
        // مواعيد اليوم: كل المواعيد مفتوحة (من غير قفل أي ميعاد) — القفل بس لو السيرفر رجّع available: false من contact.slots
        function slotsOf() {
            return times.map(function (slot) { return { value: slot.value, label: slot.label, off: false }; });
        }
        function dayList() {
            var locale = english ? 'en-GB' : 'ar-EG-u-nu-latn';
            var now = new Date();
            var out = [];
            for (var index = 0; index < 7; index += 1) {
                var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + index);
                var value = day.getFullYear() + '-' + two(day.getMonth() + 1) + '-' + two(day.getDate());
                var weekday = day.toLocaleDateString(locale, { weekday: 'long' });
                out.push({ value: value, name: index === 0 ? (B.today || weekday) : (index === 1 ? (B.tomorrow || weekday) : weekday), weekday: weekday, date: day.toLocaleDateString(locale, { day: 'numeric', month: 'short' }) });
            }
            return out;
        }
        function wantsMeeting(text) {
            var lower = String(text).toLowerCase();
            return (Array.isArray(B.words) ? B.words : []).some(function (word) { return word && lower.indexOf(String(word).toLowerCase()) > -1; });
        }
        function dropBook() {
            if (!book) return;
            [book.box, book.intro].forEach(function (node) { if (node && node.parentNode) node.parentNode.removeChild(node); });
            book = null;
        }
        function startMeeting(item, keep) {
            showChat();
            dropBook();   // حجز واحد شغال في المرة
            var subject = subjectOf(item);
            var state = keep || { subject: subject, asked: !subject && lastSubjects().length > 0, type: '', day: null, time: null, slots: null };
            var text = state.subject ? String(B.intro_about || '').replace(':name', state.subject.name) : (B.intro || '');
            var introRow = null;
            if (text) { bubble(text, false); introRow = list.lastElementChild; }
            book = { box: make('div', 'sai__book'), intro: introRow, state: state };
            list.appendChild(book.box);
            renderBook();
            toBottom();
        }
        function bookStep(question, hint) {
            var head = make('p', 'sai__q');
            head.appendChild(make('b', '', question || ''));
            if (hint) head.appendChild(make('span', '', hint));
            book.box.appendChild(head);
        }
        function bookOptions(items, isOnItem, onPick, className) {
            var wrap = make('div', className || 'sai__opts');
            items.forEach(function (item) {
                var button = make('button', isOnItem(item) ? 'is-on' : '');
                button.type = 'button';
                if (item.sub) { button.appendChild(make('span', '', item.label)); button.appendChild(make('small', '', item.sub)); } else button.textContent = item.label;
                if (item.off) button.disabled = true;
                button.addEventListener('click', function () { onPick(item); renderBook(); toBottom(); });
                wrap.appendChild(button);
            });
            book.box.appendChild(wrap);
            return wrap;
        }
        function loadSlots(state) {
            state.slots = null;
            if (!contact.slots || !state.day) { state.slots = state.day ? slotsOf(state.day.value) : null; return; }
            var day = state.day;
            fetch(contact.slots + (contact.slots.indexOf('?') > -1 ? '&' : '?') + 'date=' + encodeURIComponent(day.value) + '&type=' + encodeURIComponent(state.type), { headers: { 'Accept': 'application/json' } })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    var rows = data && Array.isArray(data.slots) ? data.slots : null;
                    return rows ? rows.map(function (slot) { return { value: slot.value, label: slot.label || slot.value, off: slot.available === false }; }) : slotsOf(day.value);
                })
                .catch(function () { return slotsOf(day.value); })
                .then(function (rows) {
                    if (!book || book.state !== state || state.day !== day) return;
                    state.slots = rows;
                    renderBook(); toBottom();
                });
        }
        function renderBook() {
            if (!book) return;
            var state = book.state;
            var box = book.box;
            box.textContent = '';
            var head = make('div', 'sai__book-head');
            var icon = make('span', 'sai__book-icon'); icon.innerHTML = ICONS.calendar;
            var title = make('span', 'min-w-0');
            title.appendChild(make('b', '', B.title || T.meet || ''));
            if (state.subject || !state.asked) title.appendChild(make('small', '', state.subject ? state.subject.name : (B.general || '')));
            head.appendChild(icon); head.appendChild(title);
            box.appendChild(head);

            // 1) بخصوص إيه؟ (لو فيه كروت معروضة والعميل ما حددش)
            if (state.asked) {
                bookStep(B.subject);
                var subjects = lastSubjects().map(function (one) { return { label: one.name, subject: one }; }).slice(0, 4);
                subjects.push({ label: B.general || '', subject: null, general: true });
                bookOptions(subjects, function (item) { return state.picked && (item.general ? !state.subject : (state.subject && state.subject.name === item.label)); }, function (item) {
                    state.subject = item.subject; state.picked = true;
                    if (!state.subject && state.type === 'site_visit') state.type = '';
                });
                if (!state.picked) return;
            }
            // 2) نوع الميتنج (زيارة الموقع بس لو فيه وحدة أو مشروع)
            bookStep(B.type);
            var names = B.types || {};
            var kinds = ['zoom', 'in_person', 'site_visit'].filter(function (key) { return names[key] && (key !== 'site_visit' || state.subject); }).map(function (key) { return { value: key, label: names[key] }; });
            bookOptions(kinds, function (item) { return state.type === item.value; }, function (item) { state.type = item.value; if (contact.slots && state.day) loadSlots(state); });
            if (!state.type) return;
            // 3) اليوم
            bookStep(B.day);
            bookOptions(dayList().map(function (day) { return { value: day.value, label: day.name, sub: day.date, day: day }; }), function (item) { return state.day && state.day.value === item.value; }, function (item) {
                state.day = item.day; state.time = null; loadSlots(state);
            }, 'sai__days');
            if (!state.day) return;
            // 4) الساعة
            bookStep(B.time);
            if (!state.slots) { box.appendChild(make('p', 'sai__booked-note', B.loading || '')); return; }
            if (!state.slots.some(function (slot) { return !slot.off; })) { box.appendChild(make('p', 'sai__book-error', B.no_slots || '')); return; }
            bookOptions(state.slots, function (item) { return state.time && state.time.value === item.value; }, function (item) { state.time = item; });
            if (!state.time) return;
            // 5) الاسم والموبايل
            bookStep(B.contact);
            var fields = make('div', 'sai__fields');
            var name = make('input'); name.type = 'text'; name.autocomplete = 'name'; name.placeholder = B.name || ''; name.setAttribute('aria-label', B.name || ''); name.value = saved.name;
            name.addEventListener('input', function () { saved.name = name.value; });
            var phoneRow = make('div', 'sai__phone'); phoneRow.dir = 'ltr';
            var code = codeField(function (value) { saved.code = value; }).wrap;
            name.required = true; name.setAttribute('aria-required', 'true');
            var phone = make('input'); phone.type = 'tel'; phone.dir = 'ltr'; phone.autocomplete = 'tel-national'; phone.inputMode = 'tel'; phone.placeholder = B.phone || ''; phone.setAttribute('aria-label', B.phone || ''); phone.value = saved.phone;
            phone.addEventListener('input', function () { saved.phone = phone.value; });
            if (countries.length) phoneRow.appendChild(code);
            phoneRow.appendChild(phone);
            var error = make('p', 'sai__book-error hidden');
            var go = make('button', 'sai__book-go', B.confirm || ''); go.type = 'button';
            go.addEventListener('click', function () { submitBook(go, error, name, phone); });
            [name, phone].forEach(function (field) { field.addEventListener('keydown', function (event) { if (event.key === 'Enter') { event.preventDefault(); submitBook(go, error, name, phone); } }); });
            fields.appendChild(name); fields.appendChild(phoneRow); fields.appendChild(error); fields.appendChild(go);
            box.appendChild(fields);
        }
        function submitBook(go, error, nameField, phoneField) {
            if (!book || go.disabled) return;
            var state = book.state;
            function fail(text, field) { error.textContent = text || ''; error.classList.remove('hidden'); if (field) field.focus(); toBottom(); }
            var name = saved.name.replace(/\s+/g, ' ').trim();
            if (name.length < 2) return fail(B.err_name, nameField);
            var digits = cleanPhone(saved.code, saved.phone);
            if (!digits) return fail(B.err_phone, phoneField);
            error.classList.add('hidden');
            go.disabled = true; go.textContent = B.sending || '';
            var data = {
                meeting_type: state.type, meeting_date: state.day.value, meeting_time: state.time.value, name: name, phone: digits, country_code: saved.code,
                subject: state.subject ? state.subject.name : '', subject_type: state.subject ? state.subject.type : 'general', subject_url: state.subject ? state.subject.url : '',
                interest: interestText(), message: lastText, source: 'shary-ai', form: 'ai-meeting', answers: plainAnswers(), context: context, session: session
            };
            var where = pageInfo(); data.page_url = where.page_url; data.page_title = where.page_title;
            var finished = false;
            function done(ok, message) {
                if (finished) return;
                finished = true;
                if (!book || book.state !== state) return;
                if (ok === false) { go.disabled = false; go.textContent = B.confirm || ''; return fail(message || B.err_send); }
                booked(data, state, message);
            }
            var proceed = panel.dispatchEvent(new CustomEvent('shary:ai-meeting', { bubbles: true, cancelable: true, detail: { data: data, done: done } }));
            if (!proceed) return;
            var url = String(contact.meeting || '');
            if (!url || url.charAt(0) === '#') { window.setTimeout(function () { done(true); }, 500); return; }   // معاينة من غير سيرفر
            var token = document.querySelector('meta[name="csrf-token"]');
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': token ? token.getAttribute('content') : '', 'X-Requested-With': 'XMLHttpRequest' },
                body: JSON.stringify(data)
            }).then(function (response) {
                if (!response.ok) throw new Error('failed');
                return response.json().catch(function () { return {}; });
            }).then(function (result) { done(true, result && result.message); })
              .catch(function () { done(false); });
        }
        // رسالة الواتساب بعد الحجز: الاسم + الموبايل + نوع الاجتماع + الميعاد + اللي العميل مهتم بيه (مش الميعاد بس)
        function bookingText(data, kind, when) {
            function line(label, value) { return value ? (label ? label + ': ' : '') + value : ''; }
            return [
                B.wa_text,
                line(B.row_name || B.name, data.name),
                line(B.row_phone || B.phone, data.phone ? String(data.country_code || '') + data.phone : ''),
                line(B.row_type, kind),
                line(B.row_when, when),
                line(B.row_about, data.subject || B.general),
                data.subject_url,
                line(B.row_interest, data.interest && data.interest !== data.subject ? data.interest : ''),
                line(B.row_asked, data.message)
            ].filter(Boolean).join('\n');
        }
        // كارت التأكيد مكان كارت الحجز + رسالة تأكيد
        function booked(data, state, message) {
            var kind = (B.types || {})[data.meeting_type] || '';
            var when = state.day.weekday + ' ' + state.day.date;
            var box = make('div', 'sai__booked');
            var head = make('div', 'sai__booked-head');
            var mark = make('span'); mark.innerHTML = ICONS.check;
            head.appendChild(mark); head.appendChild(make('b', '', B.done_title || ''));
            box.appendChild(head);
            var rows = make('dl');
            [[B.row_type, kind], [B.row_when, when + ' — ' + state.time.label], [B.row_about, data.subject || B.general], [B.row_who, data.name]].forEach(function (pair) {
                var line = make('div');
                line.appendChild(make('dt', '', pair[0] || ''));
                line.appendChild(make('dd', '', pair[1] || ''));
                rows.appendChild(line);
            });
            box.appendChild(rows);
            var note = (B.notes || {})[data.meeting_type];
            if (note) box.appendChild(make('p', 'sai__booked-note', note));
            var ways = make('div', 'sai__ways');
            var wa = action('sai__way--wa', B.whatsapp || T.whatsapp, '', waLink(bookingText(data, kind, when + ' — ' + state.time.label)));
            wa.insertAdjacentHTML('afterbegin', '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>');
            ways.appendChild(wa);
            var edit = action('sai__way--edit', B.edit || '', ICONS.calendar, '');
            edit.setAttribute('data-ai-rebook', JSON.stringify({ subject: state.subject, type: state.type }));
            ways.appendChild(edit);
            box.appendChild(ways);
            if (book.box.parentNode) book.box.parentNode.replaceChild(box, book.box);
            book = null;
            bubble(message || String(B.done || '').replace(':name', data.name).replace(':type', kind).replace(':day', when).replace(':time', state.time.label), false);
            toBottom();
            save();
        }

        function meeting() {
            var box = make('div', 'sai__meet');
            var text = make('div', 'sai__meet-text');
            text.appendChild(make('b', '', T.meet_title || ''));
            text.appendChild(make('span', '', T.meet_text || ''));
            box.appendChild(text);
            box.appendChild(meetButton(T.meet, 'sai__meet-btn', null));
            list.appendChild(box);
        }
        function chips(items) {
            if (!chipsBox) return;
            chipsBox.textContent = '';
            (Array.isArray(items) ? items : []).forEach(function (text) {
                var button = make('button', '', text);
                button.type = 'button';
                button.addEventListener('click', function () { send(text); });
                chipsBox.appendChild(button);
            });
            chipsBox.classList.toggle('hidden', !chipsBox.children.length || scroll.classList.contains('hidden'));
        }
        function grow() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 96) + 'px'; }

        // رد المعاينة (من غير سيرفر): لو الرسالة فيها كلمة من sample.intents[].words بيرجع الرد ده — وإلا الرد الأساسي
        function sampleFor(text) {
            var sample = config.sample;
            if (!sample) return null;
            var lower = String(text).toLowerCase();
            var hit = (Array.isArray(sample.intents) ? sample.intents : []).filter(function (one) {
                return one && (one.words || []).some(function (word) { return word && lower.indexOf(String(word).toLowerCase()) > -1; });
            })[0];
            return hit || sample;
        }
        // الرد على مراحل (ndjson / event-stream): كل سطر JSON — status / delta / وباقي المفاتيح بتتجمع في الرد الأخير
        function readStream(reader, onStatus, onDelta) {
            var decoder = new TextDecoder();
            var buffer = '';
            var last = {};
            function line(raw) {
                raw = String(raw).replace(/^data:\s*/, '').trim();
                if (!raw || raw === '[DONE]' || raw.charAt(0) === ':' || /^(event|id|retry):/.test(raw)) return;
                var item = null;
                try { item = JSON.parse(raw); } catch (error) { item = null; }
                if (!item || typeof item !== 'object') return;
                if (item.status) onStatus(item.status);
                if (item.delta) onDelta(item.delta);
                Object.keys(item).forEach(function (key) { if (key !== 'status' && key !== 'delta') last[key] = item[key]; });
            }
            function pump() {
                return reader.read().then(function (chunk) {
                    if (chunk.done) { if (buffer) line(buffer); return last; }
                    buffer += decoder.decode(chunk.value, { stream: true });
                    var parts = buffer.split(/\r?\n/);
                    buffer = parts.pop();
                    parts.forEach(line);
                    return pump();
                });
            }
            return pump();
        }

        // again = إعادة المحاولة بعد خطأ (من غير ما رسالة العميل تتكرر)
        function send(text, extra, again) {
            text = String(text || '').trim();
            if (!text || busy) return;
            showChat();
            if (!again) bubble(text, true);
            input.value = ''; grow();
            // العميل طالب ميتنج: الحجز بيبدأ على طول جوه الشات
            if (!extra && !again && wantsMeeting(text)) { startMeeting(null); return; }
            lastText = text;
            busy = true;
            form.classList.add('is-busy');
            if (sendButton) sendButton.setAttribute('aria-label', U.stop || '');
            var anchor = list.lastElementChild;   // رسالة العميل — الرد بيبدأ بعدها

            var typingCol = row(false);
            var typing = make('div', 'sai__msg sai__msg--bot sai__typing');
            typing.setAttribute('aria-label', T.typing || '');
            typing.innerHTML = '<i></i><i></i><i></i>';
            var statusNode = make('span', 'sai__status', '');
            typing.appendChild(statusNode);
            typingCol.appendChild(typing);
            toBottom();

            // حالات الانتظار: بتتغير لوحدها لحد ما السيرفر يبعت status بنفسه
            var steps = Array.isArray(U.steps) ? U.steps : [];
            var stepIndex = 0;
            var manual = false;
            function nextStep() { if (manual || !steps.length) return; statusNode.textContent = steps[Math.min(stepIndex, steps.length - 1)]; stepIndex += 1; }
            var first = window.setTimeout(nextStep, 350);
            var timer = window.setInterval(nextStep, 1300);

            var done = false;
            var live = null;       // رسالة بتتكتب قدام العميل (stream)
            var liveText = '';
            var controller = window.AbortController ? new AbortController() : null;

            function dropTyping() {
                var line = typingCol.parentNode;
                if (line && line.parentNode) line.parentNode.removeChild(line);
            }
            function status(value) {
                if (done || !value) return;
                manual = true;
                statusNode.textContent = String(value);
            }
            function stream(delta) {
                if (done || !delta) return;
                if (!live) { dropTyping(); live = bubble('', false, true); live.classList.add('sai__msg--live'); }
                var follow = scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 90;
                liveText += String(delta);
                live.textContent = '';
                fill(live, liveText);
                if (follow) toBottom();
            }
            function reply(answer, more) {
                if (done) return;
                done = true; busy = false; stopNow = null;
                window.clearTimeout(first); window.clearInterval(timer);
                form.classList.remove('is-busy');
                if (sendButton) sendButton.setAttribute('aria-label', sendLabel);
                dropTyping();
                more = more || {};
                var textOut = answer || liveText;
                var node = live;
                if (live) { live.classList.remove('sai__msg--live'); live.textContent = ''; fill(live, textOut); }
                else if (textOut) node = bubble(textOut, false, true);
                if (node && more.id != null) node.closest('.sai__row').setAttribute('data-id', String(more.id));
                if (more.error) {
                    // خطأ في الاتصال: رسالة + "حاول تاني" (بتبعت نفس السؤال من غير تكرار)
                    var err = make('div', 'sai__err');
                    err.appendChild(make('span', '', T.error || ''));
                    var retry = make('button', '', U.retry || ''); retry.type = 'button';
                    retry.setAttribute('data-ai-retry', text);
                    if (extra) retry.setAttribute('data-steps', '1');
                    err.appendChild(retry);
                    list.appendChild(err);
                } else {
                    if (Array.isArray(more.criteria)) { understood = more.criteria.filter(Boolean).map(String); renderCriteria(); }
                    statsBlock(more.stats);
                    cards(more.cards, more.results);
                    compareBlock(more.compare);
                    sourcesBlock(more.sources);
                    optionsBlock(more.options);
                    actionsBlock(more.actions);
                    if (more.meeting) meeting();
                    if (more.lead) leadBlock(more.lead);
                    if (more.feedback !== false && (textOut || (Array.isArray(more.cards) && more.cards.length))) feedbackBar(more.id);
                    if (Array.isArray(more.chips)) chips(more.chips);
                    if (more.session) session = more.session;
                }
                // الرد بيبدأ من فوق: أول حاجة في الرد (النص وأول كارت) — مش آخر كارت
                var top = anchor && anchor.parentNode === list ? anchor.nextElementSibling : list.firstElementChild;
                if (more.book) startMeeting(typeof more.book === 'object' ? more.book : null);
                else toNode(top);
                save();
            }
            function fail() { reply('', { error: true }); }
            // "إيقاف": اللي اتكتب بيفضل ، والطلب بيتلغي
            stopNow = function () {
                if (controller) { try { controller.abort(); } catch (error) { /* اتلغى */ } }
                reply(liveText ? '' : (U.stopped || ''), { feedback: false });
            };

            var answersNow = (extra && extra.answers) || plainAnswers();
            var detail = {
                text: text, answers: answersNow, context: context, session: session, lang: english ? 'en' : 'ar', via: extra ? 'steps' : 'text',
                reply: reply, status: status, stream: stream, fail: fail, signal: controller ? controller.signal : null, sample: sampleFor(text)
            };
            var go = panel.dispatchEvent(new CustomEvent('shary:ai-send', { bubbles: true, cancelable: true, detail: detail }));
            if (!go) return;

            var endpoint = panel.getAttribute('data-endpoint');
            if (!endpoint) {
                // من غير سيرفر (معاينة): الرد التجريبي لو موجود
                window.setTimeout(function () { reply(detail.sample && detail.sample.reply ? detail.sample.reply : '', detail.sample || {}); }, 1500);
                return;
            }
            var token = document.querySelector('meta[name="csrf-token"]');
            fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, application/x-ndjson, text/event-stream', 'X-CSRF-TOKEN': token ? token.getAttribute('content') : '', 'X-Requested-With': 'XMLHttpRequest' },
                body: JSON.stringify({ message: text, answers: answersNow, context: context, session: session, lang: detail.lang, via: detail.via, page: window.location.pathname }),
                signal: controller ? controller.signal : undefined
            }).then(function (response) {
                if (!response.ok) throw new Error('failed');
                var kind = response.headers.get('Content-Type') || '';
                if (/ndjson|event-stream/.test(kind) && response.body && response.body.getReader && window.TextDecoder) return readStream(response.body.getReader(), status, stream);
                return response.json();
            }).then(function (data) { data = data || {}; reply(data.reply || '', data); })
              .catch(fail);
        }

        function restart() {
            if (stopNow) stopNow();
            answers = {}; session = ''; busy = false; stepsShown = 0; book = null; understood = []; lastText = '';
            form.classList.remove('is-busy');
            list.textContent = '';
            input.value = ''; grow();
            scroll.classList.add('hidden');
            if (chipsBox) chipsBox.classList.add('hidden');
            if (critBox) critBox.classList.add('hidden');
            if (onb) { onb.classList.remove('hidden'); onb.scrollTop = 0; }
            chips(config.chips);
            renderSteps();
            onbLabels();
            save();
        }

        // ---------- حفظ المحادثة (ديسك توب): النافذة بتفضل مفتوحة بنفس الكلام والعميل بيتنقل بين الصفحات ----------
        function save() {
            try {
                var copy = list.cloneNode(true);
                Array.prototype.forEach.call(copy.querySelectorAll('.sai__book, .sai__typing'), function (node) {
                    var row = node.classList.contains('sai__typing') ? node.closest('.sai__row') : node;
                    if (row && row.parentNode) row.parentNode.removeChild(row);
                });
                window.sessionStorage.setItem(STORE, JSON.stringify({
                    open: !panel.classList.contains('hidden'), chat: !scroll.classList.contains('hidden'), html: copy.innerHTML,
                    chips: chipsBox ? Array.prototype.map.call(chipsBox.children, function (button) { return button.textContent; }) : [],
                    answers: answers, session: session, lang: english ? 'en' : 'ar', top: scroll.scrollTop, understood: understood, last: lastText
                }));
            } catch (error) { /* التخزين مقفول */ }
        }
        function restore() {
            var state = null;
            try { state = JSON.parse(window.sessionStorage.getItem(STORE) || 'null'); } catch (error) { state = null; }
            if (!state || state.lang !== (english ? 'en' : 'ar')) return;
            answers = state.answers || {};
            session = state.session || '';
            understood = Array.isArray(state.understood) ? state.understood : [];
            lastText = state.last || '';
            if (state.chat) {
                list.innerHTML = state.html || '';
                showChat();
                if (Array.isArray(state.chips) && state.chips.length) chips(state.chips);
                if (window.SharyCards) window.SharyCards.refresh(list);
                scroll.scrollTop = state.top || 0;
            } else renderSteps();
            // ديسك توب بس: النافذة بترجع مفتوحة لوحدها في الصفحة الجديدة — على نفس المكان اللي العميل كان واقف عنده
            if (state.open && wide.matches && !panel.closest('[hidden]')) { open(null); if (state.chat) scroll.scrollTop = state.top || 0; }
        }

        function open(from) {
            if (!panel.classList.contains('hidden')) return;
            opener = from || null;
            panel.classList.remove('hidden');
            if (!wide.matches) {
                document.documentElement.style.overflow = 'hidden';
                // موبايل: زرار الرجوع بيقفل الصفحة دي والعميل بيفضل في صفحته
                if (window.SharyBack) { window.SharyBack.opened(close); panel.__back = true; }
            }
            save();
        }
        function close() {
            if (panel.classList.contains('hidden')) return;
            panel.classList.add('hidden');
            document.documentElement.style.overflow = '';
            if (opener) { try { opener.focus({ preventScroll: true }); } catch (error) { /* العنصر اتشال */ } }
            if (panel.__back && window.SharyBack) window.SharyBack.closed();
            panel.__back = false;
            save();
        }
        panel.sharyOpen = open;
        panel.sharyClose = close;
        // تغيير سياق الصفحة من بره (زرار عليه data-ai-context) — من غير قيمة بيرجع لسياق الصفحة الأصلي ($aiContext)
        panel.sharyContext = function (value) {
            context = value && value.name ? value : (config.context && config.context.name ? config.context : null);
            renderContext();
        };
        // سؤال جاهز من بره (زرار عليه data-ai-ask="السؤال")
        panel.sharyAsk = function (text) { send(text); };

        panel.querySelectorAll('[data-ai-close]').forEach(function (node) { node.addEventListener('click', close); });
        // لينك كارت (صفحة الوحدة / المشروع): صفحة Shary AI بتتقفل والعميل بيروح للصفحة
        list.addEventListener('click', function (event) {
            if (!event.target.closest) return;
            // "اعرض كمان": باقي الكروت بتظهر مكانها
            var moreCards = event.target.closest('[data-ai-more]');
            if (moreCards) {
                var holder = moreCards.closest('.sai__cards');
                Array.prototype.forEach.call(holder ? holder.querySelectorAll('.sai__card[hidden]') : [], function (node) { node.hidden = false; });
                if (moreCards.parentNode) moreCards.parentNode.removeChild(moreCards);
                save();
                return;
            }
            // "حاول تاني" بعد خطأ الاتصال
            var retry = event.target.closest('[data-ai-retry]');
            if (retry) {
                var again = retry.getAttribute('data-ai-retry');
                var fromSteps = retry.hasAttribute('data-steps');
                var errBox = retry.closest('.sai__err');
                if (errBox && errBox.parentNode) errBox.parentNode.removeChild(errBox);
                send(again, fromSteps ? { answers: plainAnswers() } : null, true);
                return;
            }
            // التقييم: 👍 / 👎 (+ السبب) / نسخ
            var fb = event.target.closest('[data-fb]');
            if (fb) {
                var bar = fb.closest('.sai__fb');
                var kind = fb.getAttribute('data-fb');
                if (kind === 'copy') {
                    var copied = answerOf(bar);
                    var okCopy = function () { fb.classList.add('is-on'); window.setTimeout(function () { fb.classList.remove('is-on'); }, 1400); };
                    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(copied).then(okCopy, function () { /* النسخ مقفول */ });
                    return;
                }
                var note = bar.querySelector('.sai__fb-why');
                if (note) bar.removeChild(note);
                if (kind === 'reason') {
                    sendFeedback(bar, 'down', fb.textContent);
                    bar.appendChild(make('p', 'sai__fb-why', U.fb_thanks || ''));
                } else {
                    Array.prototype.forEach.call(bar.querySelectorAll('[data-fb="up"], [data-fb="down"]'), function (button) { button.classList.toggle('is-on', button === fb); });
                    sendFeedback(bar, kind, '');
                    var reasons = Array.isArray(U.fb_reasons) ? U.fb_reasons : [];
                    var box = make('p', 'sai__fb-why', kind === 'down' && reasons.length ? (U.fb_ask || '') : (U.fb_thanks || ''));
                    if (kind === 'down') reasons.forEach(function (reason) { var one = make('button', '', reason); one.type = 'button'; one.setAttribute('data-fb', 'reason'); box.appendChild(one); });
                    bar.appendChild(box);
                }
                save();
                return;
            }
            var leadGo = event.target.closest('[data-ai-lead-go]');
            if (leadGo) { submitLead(leadGo); return; }
            // "احجز ميتنج" (تحت كارت أو في كارت المستشار) و "تعديل الميعاد": بالتفويض عشان يشتغلوا بعد استرجاع المحادثة
            var meet = event.target.closest('[data-ai-meet]');
            if (meet) {
                var subject = null;
                try { subject = JSON.parse(meet.getAttribute('data-ai-meet') || 'null'); } catch (error) { subject = null; }
                startMeeting(subject);
                return;
            }
            var again = event.target.closest('[data-ai-rebook]');
            if (again) {
                var keep = {};
                try { keep = JSON.parse(again.getAttribute('data-ai-rebook') || '{}'); } catch (error) { keep = {}; }
                var done = again.closest('.sai__booked');
                if (done && done.parentNode) done.parentNode.removeChild(done);
                startMeeting(null, { subject: keep.subject || null, asked: false, type: keep.type || '', day: null, time: null, slots: null });
                return;
            }
            // لينك كارت (صفحة الوحدة / المشروع): على الموبايل صفحة Shary AI بتتقفل والعميل بيروح للصفحة — على الديسك توب النافذة بتفضل مفتوحة معاه
            var link = event.target.closest('a[href]');
            if (link && !link.target && !/^(tel:|mailto:|#)/.test(link.getAttribute('href'))) { if (wide.matches) save(); else close(); }
        });
        document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !wide.matches) close(); });
        // زرار جاهز جوه الصفحة (أسئلة الصفحة / السؤال التوضيحي / زراير الرد): الضغط بيبعت النص كرسالة
        panel.addEventListener('click', function (event) {
            var say = event.target.closest ? event.target.closest('[data-ai-say]') : null;
            if (say) { send(say.getAttribute('data-ai-say') || say.textContent); return; }
            if (event.target.closest && event.target.closest('[data-ai-edit]')) editCriteria();
        });
        form.addEventListener('submit', function (event) { event.preventDefault(); send(input.value); });
        // زرار الإرسال وقت الرد = "إيقاف"
        if (sendButton) sendButton.addEventListener('click', function (event) { if (busy && stopNow) { event.preventDefault(); stopNow(); } });
        window.addEventListener('pagehide', function () { if (list.children.length) save(); });
        input.addEventListener('input', grow);
        input.addEventListener('keydown', function (event) { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(input.value); } });
        if (startButton) startButton.addEventListener('click', function () { if (!startButton.disabled) send(queryText(), { answers: plainAnswers() }); });
        if (skipButton) skipButton.addEventListener('click', function () { showChat(); if (!wide.matches || list.children.length < 2) input.focus(); });

        var reset = panel.querySelector('[data-ai-reset]');
        if (reset) {
            reset.addEventListener('click', function () {
                if (list.children.length > 1 && T.reset_confirm && !window.confirm(T.reset_confirm)) return;
                restart();
            });
        }

        // ---------- المايك: العميل يسجّل صوته والكلام بيتكتب في خانة الكتابة (زي الشات) ----------
        // 1) لو فيه لينك التحويل (contact.voice ← $aiVoiceUrl) أو كود بيسمع shary:ai-voice: تسجيل حقيقي (MediaRecorder) ← بيترفع للباك ← بيرجع النص.
        //    POST multipart: audio (webm / mp4 / ogg) + lang + seconds  ←  JSON { text: "..." }
        //    حدث shary:ai-voice على البانل: detail = { blob, lang, seconds, done(text), fail(message) } — امنعوه (preventDefault) لو هتحوّلوا الصوت بطريقتكم.
        // 2) من غير لينك: إملاء المتصفح نفسه (SpeechRecognition) والكلام بيتكتب وهو بيتكلم.
        // الزرار بيظهر طول ما واحدة من الطريقتين متاحة. ضغطة = ابدأ ، ضغطة تانية = خلّص — والكلام بيتبعت في الشات على طول.
        var mic = panel.querySelector('[data-ai-mic]');
        var Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
        var canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
        var V = U.voice || {};
        if (mic && (Speech || canRecord)) {
            mic.classList.remove('hidden');
            var micLabel = mic.getAttribute('aria-label') || '';
            var basePlaceholder = input.getAttribute('placeholder') || '';
            var voice = null;          // الشغال دلوقتي: { stop, cancel }
            var voiceTimer = 0;
            var micState = function (state, text) {   // '' | rec | busy
                mic.setAttribute('aria-pressed', state === 'rec' ? 'true' : 'false');
                mic.classList.toggle('is-busy', state === 'busy');
                mic.disabled = state === 'busy';
                mic.setAttribute('aria-label', state === 'rec' ? (V.stop || micLabel) : micLabel);
                form.classList.toggle('is-recording', state === 'rec');
                input.setAttribute('placeholder', text || basePlaceholder);
            };
            // ملاحظة المايك: بتظهر سطر واضح فوق خانة الكتابة (وفي الـ placeholder) وبتختفي لوحدها
            var noteBox = null, noteTimer = 0;
            var micNote = function (text) {
                micState('');
                if (!text) return;
                input.setAttribute('placeholder', text);
                if (!noteBox) {
                    noteBox = document.createElement('p');
                    noteBox.className = 'sai__voice-note';
                    noteBox.setAttribute('role', 'status');
                    form.parentNode.insertBefore(noteBox, form);
                }
                noteBox.textContent = text;
                noteBox.hidden = false;
                window.clearTimeout(noteTimer);
                noteTimer = window.setTimeout(function () { if (noteBox) noteBox.hidden = true; if (!voice) input.setAttribute('placeholder', basePlaceholder); }, 6000);
            };
            // النص اللي اتحوّل من الصوت بيتبعت في الشات على طول (مع أي كلام كان مكتوب في الخانة)
            var putText = function (text) {
                text = String(text || '').replace(/\s+/g, ' ').trim();
                micState('');
                if (!text) return micNote(V.empty);
                input.value = (input.value ? input.value.replace(/\s+$/, '') + ' ' : '') + text;
                grow();
                sendVoice();
            };
            var sendVoice = function () {
                if (!input.value.replace(/\s+/g, '')) return;
                if (form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            };
            var clock = function (seconds) { return Math.floor(seconds / 60) + ':' + ('0' + (seconds % 60)).slice(-2); };

            // --- إملاء المتصفح: الكلام بيتكتب وهو بيتكلم ، ولما يسكت (أو يضغط المايك تاني) بيتبعت على طول
            var mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
            var dictate = function (fallback) {
                var recognition;
                try { recognition = new Speech(); } catch (error) { return fallback ? fallback() : micNote(V.unsupported); }
                var before = input.value ? input.value.replace(/\s+$/, '') + ' ' : '';
                var finalText = '', heard = false, failed = '', dropped = false, code = '';
                recognition.lang = english ? 'en-US' : 'ar-EG';
                recognition.interimResults = true;
                // على الموبايل: جملة واحدة وبتخلص لوحدها (الوضع المستمر على أندرويد بيكرر الكلام) — على الكمبيوتر: مستمر لحد ما يضغط المايك
                recognition.continuous = !mobile;
                recognition.maxAlternatives = 1;
                recognition.onresult = function (event) {
                    var interim = '';
                    for (var i = event.resultIndex; i < event.results.length; i++) {
                        var result = event.results[i];
                        if (result.isFinal) finalText += result[0].transcript + ' '; else interim += result[0].transcript;
                    }
                    var text = (finalText + interim).replace(/\s+/g, ' ').trim();
                    heard = heard || !!text;
                    input.value = before + text; grow();
                };
                recognition.onerror = function (event) {
                    code = (event && event.error) || 'failed';
                    failed = code === 'not-allowed' || code === 'service-not-allowed' ? (V.denied || '') : (code === 'no-speech' ? (V.empty || '') : (code === 'audio-capture' ? (V.no_mic || '') : (V.failed || '')));
                };
                recognition.onend = function () {
                    voice = null;
                    if (heard && !dropped) { micState(''); return sendVoice(); }
                    if (dropped) return micState('');
                    // الإملاء مش متاح على الجهاز ده (خدمة الصوت مقفولة / مش موجودة): لو فيه تحويل من السيرفر نسجّل ونبعته له
                    if (fallback && code && code !== 'no-speech' && code !== 'aborted' && code !== 'not-allowed') { micState(''); return fallback(); }
                    micNote(failed || V.empty);
                };
                voice = { stop: function () { try { recognition.stop(); } catch (error) { voice = null; micState(''); } }, cancel: function () { dropped = true; try { recognition.abort(); } catch (error) { /* خلص */ } } };
                micState('rec', V.listening);
                try { recognition.start(); } catch (error) { voice = null; if (fallback) fallback(); else micNote(V.failed); }
            };

            // --- تسجيل حقيقي ← الباك بيحوّله لنص
            var record = function () {
                micState('busy', V.asking);
                navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
                    var types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
                    var type = types.filter(function (one) { return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(one); })[0] || '';
                    var recorder = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
                    var chunks = [], started = Date.now(), cancelled = false;
                    recorder.ondataavailable = function (event) { if (event.data && event.data.size) chunks.push(event.data); };
                    recorder.onstop = function () {
                        window.clearInterval(voiceTimer);
                        stream.getTracks().forEach(function (track) { track.stop(); });
                        voice = null;
                        var seconds = Math.round((Date.now() - started) / 1000);
                        if (cancelled || !chunks.length) return micState('');
                        if (seconds < 1) return micNote(V.short);
                        var blob = new Blob(chunks, { type: recorder.mimeType || type || 'audio/webm' });
                        micState('busy', V.converting);
                        var finished = false;
                        var done = function (text) { if (finished) return; finished = true; putText(text); };
                        var fail = function (message) { if (finished) return; finished = true; micNote(message || V.failed); };
                        var detail = { blob: blob, lang: english ? 'en' : 'ar', seconds: seconds, done: done, fail: fail };
                        if (!panel.dispatchEvent(new CustomEvent('shary:ai-voice', { bubbles: true, cancelable: true, detail: detail }))) return;
                        var url = String(contact.voice || '');
                        if (!url || url.charAt(0) === '#') return fail(V.no_backend);
                        var data = new FormData();
                        data.append('audio', blob, 'voice.' + ((blob.type.split('/')[1] || 'webm').split(';')[0]));
                        data.append('lang', detail.lang); data.append('seconds', seconds);
                        var token = document.querySelector('meta[name="csrf-token"]');
                        fetch(url, { method: 'POST', headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': token ? token.getAttribute('content') : '', 'X-Requested-With': 'XMLHttpRequest' }, body: data })
                            .then(function (response) { if (!response.ok) throw new Error('failed'); return response.json(); })
                            .then(function (result) { done(result && (result.text || result.transcript)); })
                            .catch(function () { fail(); });
                    };
                    voice = { stop: function () { if (recorder.state !== 'inactive') recorder.stop(); }, cancel: function () { cancelled = true; if (recorder.state !== 'inactive') recorder.stop(); } };
                    recorder.start();
                    micState('rec', String(V.recording || '').replace(':time', clock(0)));
                    voiceTimer = window.setInterval(function () {
                        var seconds = Math.round((Date.now() - started) / 1000);
                        input.setAttribute('placeholder', String(V.recording || '').replace(':time', clock(seconds)));
                        if (seconds >= 120) voice.stop();   // حد أقصى دقيقتين
                    }, 500);
                }).catch(function (error) {
                    voice = null;
                    // مفيش إذن مايك أو مفيش مايك: لو المتصفح فيه إملاء نجرّبه ، وإلا رسالة واضحة
                    micNote(error && (error.name === 'NotAllowedError' || error.name === 'SecurityError') ? V.denied : V.no_mic);
                });
            };

            mic.addEventListener('click', function () {
                if (voice) { voice.stop(); return; }
                var hasBackend = !!String(contact.voice || '').replace(/^#.*/, '') || panel.hasAttribute('data-ai-voice');
                if (canRecord && hasBackend) record();                                   // الموقع: تسجيل ← السيرفر بيحوّله لنص
                else if (Speech) dictate(canRecord && hasBackend ? record : null);       // من غير سيرفر: إملاء المتصفح
                else micNote(canRecord ? V.no_backend : V.unsupported);                  // لا سيرفر ولا إملاء: رسالة واضحة
            });
            // قفل البانل أو إرسال الرسالة: التسجيل بيقف
            form.addEventListener('submit', function () { if (voice) voice.cancel(); });
        }

        chips(config.chips);
        renderSteps();
        renderContext();
        // بعد ما الصفحة تجهز: رجّع المحادثة المحفوظة (ولو النافذة كانت مفتوحة على الديسك توب بتفتح لوحدها)
        window.setTimeout(restore, 300);
    });

    // أي زرار Shary AI بيفتح الصفحة الأقرب له
    document.addEventListener('click', function (event) {
        var opener = event.target.closest ? event.target.closest('[data-ask-ai]') : null;
        if (!opener) return;
        var scope = opener.closest('main');
        var panel = (scope && scope.querySelector('[data-ai-panel]')) || (opener.closest('[lang]') || document).querySelector('[data-ai-panel]');
        if (!panel || !panel.sharyOpen) return;
        event.preventDefault();
        // ديسك توب: الضغط على زرار Shary AI العايم والنافذة مفتوحة بيقفلها
        if (!panel.classList.contains('hidden') && opener.classList.contains('area-fab') && window.matchMedia('(min-width: 1024px)').matches) { panel.sharyClose(); return; }
        // السياق: من الزرار نفسه (data-ai-context='{"type":"project","id":"scenes","name":"سينز","url":"..."}' — مثلًا "اسأل Shary AI عن المشروع ده" على كارت)
        // أو من علامة الصفحة [data-ai-page-context] — وإلا سياق الصفحة الأصلي ($aiContext)
        var holder = opener.hasAttribute('data-ai-context') ? opener : (scope ? scope.querySelector('[data-ai-page-context]') : null);
        var value = null;
        if (holder) { try { value = JSON.parse(holder.getAttribute(holder === opener ? 'data-ai-context' : 'data-ai-page-context') || 'null'); } catch (error) { value = null; } }
        if (panel.sharyContext) panel.sharyContext(value);
        panel.sharyOpen(opener);
        // data-ai-ask="السؤال": الصفحة بتفتح والسؤال بيتبعت على طول
        var ask = opener.getAttribute('data-ai-ask');
        if (ask && panel.sharyAsk) panel.sharyAsk(ask);
    });
})();
