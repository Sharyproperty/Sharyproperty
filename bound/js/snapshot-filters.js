(function () {
    var file = location.pathname.split('/').pop() || '';
    var m = file.match(/^(for-rent|for-sale)(?:--(furnished|offer)-([a-z]+))?\.html$/);
    if (!m) return;
    var base = m[1], q = new URLSearchParams(location.search);
    var key = base === 'for-rent' ? 'furnished' : 'offer';
    var allowed = base === 'for-rent' ? ['furnished', 'unfurnished'] : ['resale', 'rent'];
    var en = document.documentElement.lang === 'en';
    var other = false;
    q.forEach(function (value, name) { if (value !== '' && name !== key && name !== 'offer' && name !== 'v' && name !== 'ver' && name !== 'sort') other = true; });
    if (q.has(key)) {
        var want = q.get(key), target = allowed.indexOf(want) !== -1 ? base + '--' + key + '-' + want + '.html' : base + '.html';
        if (target !== file && !other) { location.replace(target); return; }
    }
    if (other) {
        var bar = document.createElement('div');
        bar.setAttribute('role', 'status');
        bar.style.cssText = 'position:fixed;inset-inline:12px;bottom:84px;z-index:9999;margin:auto;max-width:560px;border-radius:14px;background:#123a5c;color:#fff;padding:12px 16px;font:600 14px/1.7 system-ui,sans-serif;text-align:center;box-shadow:0 10px 30px rgba(18,58,92,.35)';
        bar.textContent = en ? 'Preview copy (static): this filter works on the live server. The furnished / sale-type tabs work here.' : 'نسخة معاينة ثابتة: الفلتر ده بيشتغل على السيرفر. تبويبات (مفروش / غير مفروش) و(إعادة البيع / للإيجار) شغالة هنا.';
        document.body.appendChild(bar);
        setTimeout(function () { bar.remove(); }, 7000);
    }
})();
