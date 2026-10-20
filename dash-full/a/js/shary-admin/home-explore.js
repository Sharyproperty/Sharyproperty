/**
 * قسم «استكشف» في الرئيسية: اختيار المشاريع والوحدات والمطورين
 * الصفحة: resources/views/shary_admin/home_explore/edit.blade.php
 * اللي جاي من السيرفر (لينكات / كلام): data-conf على وسم السكربت ← CONF
 */
(function () {
    var CONF = JSON.parse(document.currentScript.getAttribute('data-conf') || '{}');
    document.querySelectorAll('input[name="mode"]').forEach(function (radio) {
        radio.addEventListener('change', function () { document.querySelector('[data-hex-auto]').hidden = radio.value !== 'auto' || !radio.checked; });
    });
    // قوايم المناطق / المطورين: بحث بالاسم + اسكرول
    document.querySelectorAll('[data-hex-filter]').forEach(function (box) {
        var q = box.querySelector('[data-hex-filter-q]');
        q.addEventListener('input', function () {
            var t = q.value.trim().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').toLowerCase();
            box.querySelectorAll('label[data-name]').forEach(function (l) { var n = l.getAttribute('data-name').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').toLowerCase(); l.hidden = t !== '' && n.indexOf(t) === -1; });
        });
        box.addEventListener('change', function (e) { var l = e.target.closest('label'); if (l) l.classList.toggle('is-on', e.target.checked); });
    });
    // البحث الواحد: مشاريع + وحدات + مطورين
    var input = document.querySelector('[data-hex-search]'), box = document.querySelector('[data-hex-results]'), form = document.querySelector('[data-hex-add]'), timer, only = '', last = [];
    var kinds = { project: CONF.kinds.project, unit: CONF.kinds.unit, developer: CONF.kinds.developer };
    function draw() {
        box.innerHTML = '';
        last.filter(function (item) { return !only || item.kind === only; }).forEach(function (item) {
            var b = document.createElement('button'); b.type = 'button';
            b.innerHTML = (item.image ? '<img src="' + item.image + '" alt="">' : '') + '<span class="hex-kind hex-kind--' + item.kind + '"></span><span><b></b><br><small></small></span>';
            b.querySelector('.hex-kind').textContent = kinds[item.kind]; b.querySelector('b').textContent = item.name; b.querySelector('small').textContent = item.sub || '';
            b.addEventListener('click', function () { form.querySelector('[name="id"]').value = item.id; form.querySelector('[name="kind"]').value = item.kind; form.submit(); });
            box.appendChild(b);
        });
        box.classList.toggle('is-on', box.children.length > 0);
    }
    document.querySelectorAll('[data-hex-kinds] button').forEach(function (b) {
        b.addEventListener('click', function () { only = b.getAttribute('data-k'); document.querySelectorAll('[data-hex-kinds] button').forEach(function (x) { x.classList.toggle('is-on', x === b); }); draw(); });
    });
    if (!input) return;
    input.addEventListener('input', function () {
        clearTimeout(timer);
        var q = input.value.trim();
        if (q.length < 2) { last = []; draw(); return; }
        timer = setTimeout(function () {
            fetch(input.getAttribute('data-url') + '?q=' + encodeURIComponent(q), { headers: { 'Accept': 'application/json' }, credentials: 'same-origin' })
                .then(function (r) { return r.json(); }).then(function (data) { last = data.items || []; draw(); });
        }, 250);
    });
})();
