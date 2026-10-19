/**
 * صفحة المشروع: علامات المشروع (مميز / جديد …)
 * الصفحة: resources/views/shary_admin/hub/_flags.blade.php
 * اللي جاي من السيرفر (لينكات / كلام): data-conf على وسم السكربت ← CONF
 */
(function () {
    var CONF = JSON.parse(document.currentScript.getAttribute('data-conf') || '{}');
    var token = (document.querySelector('meta[name=csrf-token]') || {}).content || CONF.token;
    function toast(text, bad) {
        var el = document.createElement('div');
        el.className = 'shub-toast' + (bad ? ' is-bad' : ''); el.setAttribute('role', 'status'); el.textContent = text;
        document.body.appendChild(el); setTimeout(function () { el.remove(); }, 2200);
    }
    function paint(box, flags) {
        flags.forEach(function (f) {
            var b = box.querySelector('[data-flag="' + f.key + '"]'); if (!b) return;
            b.classList.toggle('is-on', !!f.on); b.setAttribute('aria-pressed', f.on ? 'true' : 'false');
        });
    }
    document.addEventListener('click', function (e) {
        var b = e.target.closest('[data-flags] [data-flag]'); if (!b) return;
        var box = b.closest('[data-flags]');
        var on = !b.classList.contains('is-on');
        if (b.getAttribute('data-flag') === 'site' && !on && !confirm('هيختفي من الموقع والتطبيق. متأكد؟')) return;
        b.disabled = true;
        var body = new FormData(); body.append('flag', b.getAttribute('data-flag')); body.append('on', on ? '1' : '0');
        fetch(box.getAttribute('data-url'), { method: 'POST', body: body, credentials: 'same-origin', headers: { 'X-CSRF-TOKEN': token, 'Accept': 'application/json' } })
            .then(function (r) { if (!r.ok) throw r; return r.json(); })
            .then(function (d) {
                paint(box, d.flags || []); toast((on ? '✓ اتضاف: ' : 'اتشال: ') + b.querySelector('span').textContent);
                // صفحة "كل البيانات": الشاشة المفتوحة جوه تتحدث بنفس الحالة
                document.querySelectorAll('[data-sec] iframe[src]').forEach(function (frame) {
                    try { if (frame.contentDocument.querySelector('[data-home-box]')) frame.contentWindow.location.reload(); } catch (err) {}
                });
            })
            .catch(function () { toast('ماتحفظش — جرّب تاني', true); })
            .then(function () { b.disabled = false; });
    });
})();
