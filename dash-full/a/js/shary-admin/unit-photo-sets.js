/**
 * صور الوحدات حسب المشروع: اختيار المشروع / النوع / الوحدات والمعاينة
 * الصفحة: resources/views/shary_admin/unit_photo_sets/form.blade.php
 * اللي جاي من السيرفر (لينكات / كلام): data-conf على وسم السكربت ← CONF
 */
(function () {
    var CONF = JSON.parse(document.currentScript.getAttribute('data-conf') || '{}');
    var form = document.querySelector('[data-ps-form]');
    if (!form) return;
    var T = CONF.texts;
    var project = form.querySelector('[data-ps-project]'), unitsBox = form.querySelector('[data-ps-units]');
    var chosen = JSON.parse(unitsBox.getAttribute('data-chosen') || '[]');
    function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function params() {
        var data = new FormData(form), q = new URLSearchParams();
        ['compound_id', 'property_id', 'model', 'sale_type', 'mode'].forEach(function (k) { q.append(k, data.get(k) || ''); });
        form.querySelectorAll('[name="unit_ids[]"]:checked').forEach(function (c) { q.append('unit_ids[]', c.value); });
        return q;
    }
    // البحث في المشاريع
    form.querySelector('[data-ps-find]').addEventListener('input', function () {
        var q = this.value.trim().toLowerCase();
        Array.prototype.forEach.call(project.options, function (o) { o.hidden = q !== '' && o.text.toLowerCase().indexOf(q) === -1; });
    });
    // تسويقية: لوحدات إعادة البيع / الإيجار بس
    function marketing() { var sale = (form.querySelector('[name=sale_type]:checked') || {}).value; form.querySelector('[data-ps-marketing]').hidden = sale === 'developer_sale'; }
    // وحدات المشروع (للاختيار)
    function loadUnits() {
        if (!project.value) return;
        fetch(form.getAttribute('data-units') + '?compound_id=' + project.value, { credentials: 'same-origin', headers: { Accept: 'application/json' } }).then(function (r) { return r.json(); }).then(function (data) {
            unitsBox.innerHTML = (data.units || []).map(function (u) {
                return '<label><input type="checkbox" name="unit_ids[]" value="' + u.id + '"' + (chosen.indexOf(u.id) > -1 ? ' checked' : '') + '> ' + esc(u.name) + ' <small>' + esc(u.reference || '') + ' · ' + esc(T.sale[u.sale_type] || '') + '</small></label>';
            }).join('') || '<span class="text-muted">—</span>';
            preview();
        });
    }
    // صور المشروع: بتتحمّل لما المشروع يتختار — مجمّعة: الصور العامة ، وبعدين صور كل نوع
    var proj = form.querySelector('[data-ps-proj]'), projList = proj.querySelector('[data-ps-proj-list]'), projCount = proj.querySelector('[data-ps-proj-count]');
    var projPicked = CONF.picked;
    function projCounter() { var n = projList.querySelectorAll('input:checked').length; projCount.textContent = n ? T.projPicked.replace(':n', n) : ''; }
    function loadProjectPhotos() {
        if (!project.value) return;
        fetch(proj.getAttribute('data-url') + '?compound_id=' + project.value, { credentials: 'same-origin', headers: { Accept: 'application/json' } }).then(function (r) { return r.json(); }).then(function (data) {
            var groups = {}, order = [];
            (data.photos || []).forEach(function (p) { var key = p.type || ''; if (!groups[key]) { groups[key] = []; order.push(key); } groups[key].push(p); });
            projList.innerHTML = order.length ? order.map(function (key) {
                return '<div class="ps-proj__group"><b>' + esc(key ? T.projType.replace(':type', key) : T.projGeneral) + ' (' + groups[key].length + ')</b><div class="ps-proj__grid">' + groups[key].map(function (p) {
                    return '<label class="ps-proj__item"><input type="checkbox" name="from_project[]" value="' + p.id + '"' + (projPicked.indexOf(p.id) > -1 ? ' checked' : '') + '><img src="' + esc(p.url) + '" alt="" loading="lazy"></label>';
                }).join('') + '</div></div>';
            }).join('') : '<span class="text-muted">' + esc(T.projNone) + '</span>';
            projCounter();
        });
    }
    proj.addEventListener('change', projCounter);
    proj.querySelector('[data-ps-proj-all]').addEventListener('click', function () { projList.querySelectorAll('input').forEach(function (c) { c.checked = true; }); projCounter(); });
    proj.querySelector('[data-ps-proj-none]').addEventListener('click', function () { projList.querySelectorAll('input').forEach(function (c) { c.checked = false; }); projCounter(); });
    // المعاينة: الوحدات اللي هتاخد الصور
    var timer;
    function preview() {
        clearTimeout(timer);
        timer = setTimeout(function () {
            var rows = form.querySelector('[data-ps-rows]'), summary = form.querySelector('[data-ps-summary]');
            if (!project.value) { rows.innerHTML = ''; summary.textContent = ''; return; }
            fetch(form.getAttribute('data-preview') + '?' + params().toString(), { credentials: 'same-origin', headers: { Accept: 'application/json' } }).then(function (r) { return r.json(); }).then(function (data) {
                var list = data.units || [], uses = list.filter(function (u) { return u.uses; }).length;
                summary.textContent = list.length ? T.summary.replace(':uses', uses).replace(':matched', list.length) : T.none;
                rows.innerHTML = list.map(function (u) {
                    var state = u.uses ? '<span class="is-uses">' + T.uses + '</span>' : (u.optout ? '<span class="is-off">' + T.off + '</span>' : '<span class="is-own">' + T.own + '</span>');
                    return '<tr><td>' + esc(u.name) + '</td><td>' + esc(u.reference || '') + '</td><td>' + esc(T.sale[u.sale_type] || '') + '</td><td>' + state + '</td></tr>';
                }).join('');
            });
        }, 250);
    }
    form.addEventListener('change', function (event) {
        if (event.target === project) { chosen = []; projPicked = []; loadUnits(); loadProjectPhotos(); }
        if (event.target.name === 'mode') form.querySelector('[data-ps-pick-units]').hidden = event.target.value !== 'units';
        if (event.target.name === 'sale_type') marketing();
        if (event.target.matches('[data-ps-watch], [name="unit_ids[]"]')) preview();
    });
    form.querySelector('[name=model]').addEventListener('input', preview);
    // ترتيب الصور (الأولى = الرئيسية)
    form.addEventListener('click', function (event) {
        var move = event.target.closest('[data-ps-move]');
        if (!move) return;
        var item = move.closest('[data-ps-photo]'), list = item.parentNode, step = +move.getAttribute('data-ps-move');
        if (step < 0 && item.previousElementSibling) list.insertBefore(item, item.previousElementSibling);
        if (step > 0 && item.nextElementSibling) list.insertBefore(item.nextElementSibling, item);
    });
    // معاينة الصور الجديدة قبل الحفظ
    form.querySelector('[data-ps-new]').addEventListener('change', function () {
        var box = form.querySelector('[data-ps-new-thumbs]'); box.innerHTML = '';
        Array.prototype.forEach.call(this.files || [], function (f) { var img = document.createElement('img'); img.src = URL.createObjectURL(f); img.alt = ''; box.appendChild(img); });
    });
    marketing();
    if (project.value) { if (project.selectedOptions[0]) project.selectedOptions[0].scrollIntoView({ block: 'nearest' }); loadUnits(); loadProjectPhotos(); }
})();
