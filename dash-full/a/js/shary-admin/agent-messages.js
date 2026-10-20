/**
 * الإيجنت: رسايل العملاء ومعاينتها
 * الصفحة: resources/views/shary_admin/agent/messages.blade.php
 * اللي جاي من السيرفر (لينكات / كلام): data-conf على وسم السكربت ← CONF
 */
// «رسايل العملاء»: the audience's fields, the live count, the preview while typing, the SMS length, the confirm of «ابعت دلوقتي»
(function () {
    var CONF = JSON.parse(document.currentScript.getAttribute('data-conf') || '{}');
    var form = document.getElementById('mx-form');
    if (!form) { return; }
    var abouts = CONF.abouts;
    var names = CONF.names;
    var $ = function (selector) { return form.querySelector(selector); };
    var all = function (selector) { return Array.prototype.slice.call(form.querySelectorAll(selector)); };
    var reach = $('[data-mx-reach]');
    var timer = null;

    function segment() { return $('[name=segment]').value; }
    function channels() { return all('[data-mx-channel]').filter(function (box) { return box.checked; }).map(function (box) { return box.value; }); }

    function showAudience() {
        all('[data-mx-when]').forEach(function (box) { box.hidden = box.getAttribute('data-mx-when') !== segment(); });
        var about = form.querySelector('[data-mx-about]'); if (about) { about.textContent = abouts[segment()] || ''; }
    }
    function count() {
        clearTimeout(timer);
        timer = setTimeout(function () {
            var params = new URLSearchParams();
            ['segment', 'days', 'form', 'project_id', 'list_id', 'customer'].forEach(function (name) { var field = form.querySelector('[name=' + name + ']'); if (field && !field.closest('[hidden]')) { params.set(name, field.value); } });
            ['verified', 'invested'].forEach(function (name) { var box = form.querySelector('[name=' + name + ']'); if (box && box.checked && !box.closest('[hidden]')) { params.set(name, '1'); } });
            reach.textContent = 'بيحسب هتوصل لكام عميل…';
            fetch(form.getAttribute('data-count-url') + '?' + params.toString(), { headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'same-origin' })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                    if (!data.ok) { reach.textContent = data.error || ''; return; }
                    var parts = channels().map(function (key) { return names[key] + ' ' + Number(data[key] || 0).toLocaleString('en-US'); });
                    reach.innerHTML = '';
                    var strong = document.createElement('b');
                    strong.textContent = 'هتوصل لـ ' + Number(data.people || 0).toLocaleString('en-US') + ' عميل';
                    reach.appendChild(strong);
                    reach.appendChild(document.createTextNode(parts.length ? ' — ' + parts.join(' · ') : ' — اختار القنوات'));
                })
                .catch(function () { reach.textContent = 'ما قدرناش نحسب دلوقتي — هيتحسب في صندوق المراجعة.'; });
        }, 350);
    }
    function smsParts(text) {
        var unicode = /[^\u0000-\u007F]/.test(text);
        var length = Array.from(text).length;
        return [length, length <= (unicode ? 70 : 160) ? 1 : Math.ceil(length / (unicode ? 67 : 153))];
    }
    function say(text) { return (text || '').replace(/\{name\}/g, 'محمد').replace(/\{link\}/g, CONF.sampleLink).replace(/\{stop\}/g, CONF.smsStop).replace(/[ \t]{2,}/g, ' ').trim(); }
    function preview() {
        // an empty form shows an example (lighter) — the real words replace it while typing
        var example = !$('[data-mx-text=title]').value.trim() && !$('[data-mx-text=text]').value.trim();
        var value = function (key) { var field = $('[data-mx-text=' + key + ']'); return field.value.trim() || !example ? field.value : (field.getAttribute('data-mx-example') || ''); };
        var title = value('title'), text = value('text'), sms = value('sms'),
            subject = $('[data-mx-text=subject]').value, email = $('[data-mx-text=email]').value;
        document.querySelectorAll('[data-pv-root]').forEach(function (root) { root.classList.toggle('is-example', example); });
        if (!sms.trim()) { sms = text.replace(/\{link\}/g, '').replace(/\s+/g, ' ').trim().slice(0, 280); if (sms && $('[name=link_kind]').value !== 'none') { sms += ' {link}'; } }
        // a list of «قوايمي»: every SMS ends with how to stop (the server adds it too)
        if (sms.trim() && segment() === 'list' && sms.indexOf('{stop}') === -1) { sms += ' {stop}'; }
        var set = function (key, value) { document.querySelectorAll('[data-pv-root] [data-pv=' + key + ']').forEach(function (node) { node.textContent = value; }); };
        set('title', say(title || text.slice(0, 60)));
        set('text', say(text.replace(/\{link\}/g, '')));
        set('sms', say(sms));
        set('subject', say(subject || title));
        set('email', say((email || text).replace(/\{link\}/g, '')));
        var parts = smsParts(say(sms)); set('sms-chars', parts[0]); set('sms-parts', parts[1]);
        var chosen = channels();
        document.querySelectorAll('[data-pv-root] [data-pv-for]').forEach(function (node) { node.hidden = chosen.indexOf(node.getAttribute('data-pv-for')) === -1; });
        all('[data-mx-when-channel]').forEach(function (node) { node.hidden = chosen.indexOf(node.getAttribute('data-mx-when-channel')) === -1; });
    }
    function showLink() {
        var kind = $('[name=link_kind]').value;
        all('[data-mx-link-when]').forEach(function (box) { box.hidden = box.getAttribute('data-mx-link-when').split(' ').indexOf(kind) === -1; });
        preview();
    }

    all('[data-mx-audience]').forEach(function (field) { field.addEventListener('change', function () { showAudience(); count(); }); field.addEventListener('input', count); });
    all('[data-mx-channel]').forEach(function (box) { box.addEventListener('change', function () { preview(); count(); }); });
    all('[data-mx-text]').forEach(function (field) { field.addEventListener('input', preview); });
    $('[name=link_kind]').addEventListener('change', showLink);
    all('[data-mx-confirm]').forEach(function (button) {
        button.addEventListener('click', function (event) { if (!window.confirm(button.getAttribute('data-mx-confirm'))) { event.preventDefault(); } });
    });
    showAudience(); showLink(); count();
})();
