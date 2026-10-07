/* Static preview of the Shary agent screens: menus, tabs and text helpers work; buttons that change data explain that this is a preview. */
(function () {
    'use strict';
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var toast;
    function say(text) {
        if (!toast) {
            toast = document.createElement('div');
            toast.setAttribute('role', 'status');
            toast.style.cssText = 'position:fixed;inset-inline:16px;bottom:18px;z-index:99;margin:auto;max-width:520px;padding:14px 18px;border-radius:12px;background:#10263F;color:#fff;font:700 14.5px/1.7 Cairo,Tahoma,sans-serif;box-shadow:0 10px 30px rgba(16,38,63,.3);text-align:center';
            document.body.appendChild(toast);
        }
        toast.textContent = text; toast.style.display = 'block';
        clearTimeout(say.timer); say.timer = setTimeout(function () { toast.style.display = 'none'; }, 3800);
    }
    var burger = $('[data-ag-menu]');
    if (burger) { burger.addEventListener('click', function () { var open = $('[data-ag-nav]').classList.toggle('is-open'); burger.setAttribute('aria-expanded', open ? 'true' : 'false'); }); }
    document.addEventListener('click', function (event) {
        var toggle = event.target.closest('[data-ag-toggle]');
        if (toggle) { var block = document.getElementById(toggle.getAttribute('data-ag-toggle')); if (block) { block.classList.toggle('hide'); } return; }
        var sayBtn = event.target.closest('[data-ag-say]');
        if (sayBtn) { var box = document.getElementById(sayBtn.getAttribute('data-ag-into') || 'ag-command'); if (box) { box.value = sayBtn.getAttribute('data-ag-say'); box.focus(); } return; }
        var copy = event.target.closest('[data-ag-copy]');
        if (copy) { if (navigator.clipboard) { navigator.clipboard.writeText(copy.getAttribute('data-ag-copy')); } say('اتنسخ'); return; }
        var off = event.target.closest('[data-demo-off]');
        if (off) { event.preventDefault(); say('اللينك ده بيفتح شاشة تانية في لوحة التحكم الحقيقية — دي نسخة معاينة لشاشات الإيجنت بس.'); return; }
        if (event.target.closest('[onclick*="print"]')) { return; }
    });
    document.addEventListener('submit', function (event) {
        event.preventDefault();
        var button = event.target.querySelector('button[type=submit], button:not([type])');
        var label = button ? button.textContent.trim().replace(/\s+/g, ' ') : '';
        say('دي نسخة معاينة ببيانات تجريبية — زرار "' + label + '" بيشتغل في لوحة التحكم الحقيقية.');
    }, true);
    document.addEventListener('change', function (event) {
        if (event.target.matches('[data-ag-autosubmit]')) { say('دي نسخة معاينة — المفتاح بيتحفظ في لوحة التحكم الحقيقية.'); }
        if (event.target.matches('[data-ag-filelist]')) {
            var list = document.getElementById(event.target.getAttribute('data-ag-filelist'));
            if (list) { list.innerHTML = ''; Array.prototype.forEach.call(event.target.files, function (file) { var tag = document.createElement('span'); tag.textContent = file.name; list.appendChild(tag); }); }
        }
    });
    var thread = $('[data-ag-thread]'); if (thread) { thread.scrollTop = thread.scrollHeight; }
})();
