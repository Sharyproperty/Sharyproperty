/**
 * التحويلات لأكواد التتبع (shary/partials/tracking-head — لوحة التحكم ← أكواد التتبع والإعلانات).
 * كل حدث بيتبعت لكل منصة متوصلة: dataLayer (GTM) ، gtag (GA4 / Google Ads) ، fbq (Meta) ، ttq (TikTok) ، snaptr (Snapchat).
 *  - lead       فورم اتبعت بنجاح (shary:lead-sent من lead-forms.js) — ولو الفورم ميتنج: schedule
 *  - contact    ضغطة على لينك اتصال (tel:) أو واتساب (wa.me / api.whatsapp.com / whatsapp://)
 *  - ai_lead    طلب اتصال أو ميتنج من Shary AI (shary:ai-lead / shary:ai-meeting)
 * من غير أكواد (المعاينة أو التتبع متقفل) الملف ما بيعملش حاجة.
 */
(function () {
    var T = window.SharyTags;
    if (!T) return;
    var last = {};
    function send(kind, extra) {
        var now = Date.now();
        if (last[kind] && now - last[kind] < 1500) return;      // ضغطتين ورا بعض = تحويل واحد
        last[kind] = now;
        var data = Object.assign({ page_path: location.pathname }, extra || {});
        var lead = kind === 'lead' || kind === 'ai_lead', meeting = kind === 'schedule';
        try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: 'shary_' + kind }, data)); } catch (e) { /* ignore */ }
        if (window.gtag) {
            try {
                gtag('event', lead || meeting ? 'generate_lead' : 'contact', data);
                if (T.gads && T.gads_lead && (lead || meeting)) gtag('event', 'conversion', { send_to: T.gads + '/' + T.gads_lead });
            } catch (e) { /* ignore */ }
        }
        try { if (window.fbq) fbq('track', meeting ? 'Schedule' : (lead ? 'Lead' : 'Contact'), data); } catch (e) { /* ignore */ }
        try { if (window.ttq) ttq.track(lead || meeting ? 'SubmitForm' : 'Contact', data); } catch (e) { /* ignore */ }
        try { if (window.snaptr) snaptr('track', lead || meeting ? 'SIGN_UP' : 'CUSTOM_EVENT_1'); } catch (e) { /* ignore */ }
    }
    document.addEventListener('shary:lead-sent', function (event) {
        var form = event.target && event.target.getAttribute ? (event.target.getAttribute('action') || '') : '';
        var name = (form.match(/\/shary\/lead\/([a-z\-]+)/) || [])[1] || 'form';
        send(name === 'meeting' ? 'schedule' : 'lead', { form_name: name });
    });
    document.addEventListener('shary:ai-lead', function () { send('ai_lead', { form_name: 'shary_ai' }); });
    document.addEventListener('shary:ai-meeting', function () { send('schedule', { form_name: 'shary_ai_meeting' }); });
    document.addEventListener('click', function (event) {
        var link = event.target.closest && event.target.closest('a[href]');
        if (!link) return;
        var href = link.getAttribute('href') || '';
        if (/^tel:/i.test(href)) send('contact', { method: 'call' });
        else if (/wa\.me|whatsapp\.com|^whatsapp:/i.test(href)) send('contact', { method: 'whatsapp' });
    }, true);
})();
