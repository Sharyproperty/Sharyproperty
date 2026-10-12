(function () {
    var en = (document.documentElement.lang || '').indexOf('en') === 0;
    var NOTE = en ? 'Preview copy: nothing is sent from here. On the live website this form is sent for real (email / WhatsApp / the team).'
                  : 'دي نسخة معاينة: مفيش حاجة بتتبعت من هنا. على الموقع الحقيقي الفورم ده بيتبعت فعلًا (إيميل / واتساب / الفريق).';
    function sameSite(url) { try { var u = new URL(url, location.href); return u.origin === location.origin; } catch (e) { return true; } }
    function toast() {
        var old = document.querySelector('[data-snapshot-post]'); if (old) old.remove();
        var bar = document.createElement('div'); bar.setAttribute('role', 'status'); bar.setAttribute('data-snapshot-post', '');
        bar.style.cssText = 'position:fixed;inset-inline:12px;bottom:84px;z-index:2147483647;margin:auto;max-width:560px;border-radius:14px;background:#123a5c;color:#fff;padding:12px 16px;font:700 14px/1.7 system-ui,sans-serif;text-align:center;box-shadow:0 10px 30px rgba(18,58,92,.35)';
        bar.textContent = NOTE; (document.body || document.documentElement).appendChild(bar);
        setTimeout(function () { bar.remove(); }, 5000);
    }
    var body = JSON.stringify({ ok: true, success: true, status: true, message: NOTE, data: {} });
    if (window.fetch) {
        var real = window.fetch;
        window.fetch = function (input, init) {
            var url = typeof input === 'string' ? input : (input && input.url) || '';
            var method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
            if (method !== 'GET' && method !== 'HEAD' && sameSite(url)) {
                setTimeout(toast, 50);
                return Promise.resolve(new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } }));
            }
            return real.apply(this, arguments);
        };
    }
    var open = XMLHttpRequest.prototype.open, send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) { this.__snap = String(method || 'GET').toUpperCase() !== 'GET' && sameSite(url); return open.apply(this, arguments); };
    XMLHttpRequest.prototype.send = function () {
        if (!this.__snap) return send.apply(this, arguments);
        var xhr = this;
        setTimeout(function () {
            ['readyState', 'status', 'responseText', 'response'].forEach(function (k) { try { Object.defineProperty(xhr, k, { configurable: true, value: k === 'readyState' ? 4 : (k === 'status' ? 200 : body) }); } catch (e) {} });
            if (typeof xhr.onreadystatechange === 'function') xhr.onreadystatechange();
            if (typeof xhr.onload === 'function') xhr.onload();
            try { xhr.dispatchEvent(new Event('load')); xhr.dispatchEvent(new Event('loadend')); } catch (e) {}
            toast();
        }, 60);
    };
    document.addEventListener('submit', function (event) {
        var form = event.target;
        if (!form || form.tagName !== 'FORM' || event.defaultPrevented) return;
        if (String(form.getAttribute('method') || 'get').toLowerCase() === 'get') return;
        if (!sameSite(form.getAttribute('action') || location.href)) return;
        event.preventDefault(); toast();
    }, false);
})();
