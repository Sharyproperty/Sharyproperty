(function () {
    // Static preview copy: there is no server to filter the lists.
    //  - rent page tabs (furnished / unfurnished) and search page tabs (resale / rent): a saved copy of each tab opens directly (one step, the tab stays selected)
    //  - any other filter: a short note says it works on the server (on Laravel the list is filtered in place, without reloading the page)
    var file = location.pathname.split('/').pop() || '';
    var en = document.documentElement.lang === 'en';
    var m = file.match(/^(for-rent|for-sale)(?:--(furnished|offer)-([a-z]+))?\.html$/);
    var base = m ? m[1] : '', key = base === 'for-rent' ? 'furnished' : 'offer';
    var allowed = base === 'for-rent' ? ['furnished', 'unfurnished'] : ['resale', 'rent'];
    var IGNORE = ['furnished', 'offer', 'sale_type', 'status', 'v', 'ver', 'sort', 'snap', 'view'];
    function note() {
        if (document.querySelector('[data-snapshot-note]')) return;
        var bar = document.createElement('div');
        bar.setAttribute('role', 'status'); bar.setAttribute('data-snapshot-note', '');
        bar.style.cssText = 'position:fixed;inset-inline:12px;bottom:84px;z-index:9999;margin:auto;max-width:560px;border-radius:14px;background:#123a5c;color:#fff;padding:12px 16px;font:600 14px/1.7 system-ui,sans-serif;text-align:center;box-shadow:0 10px 30px rgba(18,58,92,.35)';
        bar.textContent = en ? 'Preview copy (static): this filter works on the live server. The furnished / sale-type tabs work here.' : 'نسخة معاينة ثابتة: الفلتر ده بيشتغل على السيرفر. تبويبات (مفروش / غير مفروش) و(إعادة البيع / للإيجار) شغالة هنا.';
        document.body.appendChild(bar);
        setTimeout(function () { bar.remove(); }, 7000);
    }
    function target(want) { return allowed.indexOf(want) !== -1 ? base + '--' + key + '-' + want + '.html' : base + '.html'; }

    // a filter form was used: handled here (before the in-place filtering script, which needs a server)
    document.addEventListener('shary:filter', function (event) {
        var form = event.target;
        if (!form || form.tagName !== 'FORM') return;
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!base) { note(); return; }
        var want = '', other = false;
        new FormData(form).forEach(function (value, name) {
            if (typeof value !== 'string' || value === '') return;
            var plain = name.replace(/\[\]$/, '');
            if (plain === key) want = value;
            else if (IGNORE.indexOf(plain) === -1) other = true;
        });
        var next = target(want);
        if (next !== file) { location.href = next + (other ? '?snap=1' : ''); return; }
        if (other) note();
    }, true);

    if (!base) return;
    // opened with a query (home page search / links): the saved copy of the asked tab
    var q = new URLSearchParams(location.search);
    var want = q.has(key) ? q.get(key) : null;
    if (want === null && base === 'for-sale') {
        var legacy = q.get('sale_type') || q.get('status') || '';
        if (legacy === 'resale' || legacy === 'rent') want = legacy;
    }
    var other = q.get('snap') === '1';
    q.forEach(function (value, name) { if (value !== '' && IGNORE.indexOf(name.replace(/\[\]$/, '')) === -1) other = true; });
    if (want !== null && target(want) !== file) { location.replace(target(want) + (other ? '?snap=1' : '')); return; }
    if (other) note();
})();
