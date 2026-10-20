/**
 * فورم الوحدة: صور الدور / المسقط ومعاينتها
 * الصفحة: resources/views/shary_admin/units/form.blade.php
 * اللي جاي من السيرفر (لينكات / كلام): data-conf على وسم السكربت ← CONF
 */
(function () {
    var CONF = JSON.parse(document.currentScript.getAttribute('data-conf') || '{}');
    var card = document.getElementById('unit-floor-plans');
    if (!card) return;
    var box = card.querySelector('[data-floor-rows]'), add = card.querySelector('[data-floor-add]'), list = card.querySelector('[data-floor-list]');
    var max = +box.getAttribute('data-floor-max') || 12;
    var noPreview = CONF.noPreview;
    // معاينة الملف قبل الحفظ: صورة مصغّرة ، أو اسم ملف الـ PDF
    function preview(input) {
        var item = input.closest('[data-floor-item], [data-floor-row]');
        var holder = item && item.querySelector('[data-floor-preview-box]');
        if (!holder) return;
        holder.innerHTML = '';
        var file = input.files && input.files[0];
        if (!file) { if (holder.classList.contains('sx-floor-thumb')) holder.textContent = noPreview; return; }
        if (/pdf$/i.test(file.type) || /\.pdf$/i.test(file.name)) {
            var tag = document.createElement('span'); tag.className = 'sx-floor-pdf'; tag.textContent = 'PDF'; holder.appendChild(tag);
            if (!holder.classList.contains('sx-floor-thumb')) holder.appendChild(document.createTextNode(' ' + file.name));
            return;
        }
        var img = document.createElement('img'); img.alt = ''; img.src = URL.createObjectURL(file);
        if (!holder.classList.contains('sx-floor-thumb')) { img.style.cssText = 'height:48px;width:auto;border-radius:6px;display:block;margin-top:4px'; }
        holder.appendChild(img);
    }
    card.addEventListener('change', function (event) { if (event.target.matches('[data-floor-preview]')) preview(event.target); });
    // الترتيب: ▲ / ▼ بيحرّكوا المخطط ، والرقم المخفي بيتعاد على حسب مكانه
    function renumber() { if (!list) return; list.querySelectorAll('[data-floor-item]').forEach(function (item, i) { var sort = item.querySelector('[data-floor-sort]'); if (sort) sort.value = i; }); }
    card.addEventListener('click', function (event) {
        var move = event.target.closest('[data-floor-move]');
        if (!move || !list) return;
        var item = move.closest('[data-floor-item]'), step = +move.getAttribute('data-floor-move');
        if (step < 0 && item.previousElementSibling) list.insertBefore(item, item.previousElementSibling);
        if (step > 0 && item.nextElementSibling) list.insertBefore(item.nextElementSibling, item);
        renumber();
        move.focus();
    });
    if (!add) return;
    add.addEventListener('click', function () {
        var rows = box.querySelectorAll('[data-floor-row]');
        if (rows.length >= max) return;
        var index = rows.length, row = rows[rows.length - 1].cloneNode(true);
        row.querySelectorAll('input, select').forEach(function (el) {
            el.name = el.name.replace(/floor_plans\[\d+\]/, 'floor_plans[' + index + ']');
            if (el.tagName === 'SELECT') el.selectedIndex = 0; else el.value = '';
        });
        row.querySelectorAll('[data-draft-files]').forEach(function (el) { el.setAttribute('data-draft-files', 'floor_plans.' + index + '.image'); el.innerHTML = ''; });
        var holder = row.querySelector('[data-floor-preview-box]'); if (holder) holder.textContent = noPreview;
        box.appendChild(row);
        add.hidden = index + 1 >= max;
        var first = row.querySelector('input[type=file]'); if (first) first.focus();
    });
})();
