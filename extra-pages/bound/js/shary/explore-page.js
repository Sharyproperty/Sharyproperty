/**
 * صفحات «استكشف» (/explore/{كارت}) — resources/views/shary/explore/show.blade.php
 * الفلتر والبحث على السيرفر (ExploreController@show): مفيش مشاريع ولا وحدات ولا داتا محطوطة في الصفحة.
 *  - أيقونة الفلتر المتقدم (جوه خانة البحث) بتفتح / تقفل الاختيارات.
 *  - تبويب «المشاريع / الوحدات» من غير فلاتر: لينك الصفحة على طول (بيشتغل كمان في نسخة المعاينة).
 *  - أي اختيار تاني (المشروع / المطور / المنطقة / النوع / الترتيب / البحث): الفورم بيتبعت للسيرفر.
 *  - الكروت بتزيد وانت نازل (الصفحة اللي بعدها بتتجاب وتتضاف) — من غير أرقام صفحات.
 */
(function () {
    var form = document.querySelector('[data-xfilter]'); if (!form) return;
    var adv = form.querySelector('[data-xadv]'), advBox = form.querySelector('[data-xadv-box]');
    if (adv && advBox) adv.addEventListener('click', function () { advBox.hidden = !advBox.hidden; adv.setAttribute('aria-expanded', advBox.hidden ? 'false' : 'true'); });
    form.addEventListener('change', function (e) {
        if (e.target.name === 'view') {
            var busy = [].some.call(form.querySelectorAll('select'), function (s) { return s.name !== 'sort' && s.value; }) || ((form.querySelector('[data-xq]') || {}).value || '').trim();
            var link = form.querySelector('[data-xview-link="' + e.target.value + '"]');
            if (!busy && link) { location.href = link.href; return; }
            form.querySelectorAll('select[name=sort]').forEach(function (s) { s.disabled = true; });
        }
        form.querySelectorAll('select').forEach(function (s) { if (!s.value) s.disabled = true; });
        form.submit();
    });
    var next = document.querySelector('[data-xnext]'), grid = document.querySelector('[data-xgrid]'), busy = false;
    if (!next || !grid || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting || busy) return;
        var url = next.getAttribute('data-xnext'); if (!url) return;
        busy = true;
        fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (html) {
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var more = doc.querySelector('[data-xgrid]'), nn = doc.querySelector('[data-xnext]');
            if (more) [].slice.call(more.children).forEach(function (el) { grid.appendChild(document.importNode(el, true)); });
            var u = nn ? nn.getAttribute('data-xnext') || '' : '';
            next.setAttribute('data-xnext', u);
            if (!u) io.disconnect();
        }).catch(function () {}).then(function () { busy = false; });
    }, { rootMargin: '600px 0px' });
    io.observe(next);
})();
