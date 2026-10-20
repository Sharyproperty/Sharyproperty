/**
 * محتوى الصفحات: رفع صورة الهيدر
 * الصفحة: resources/views/shary_admin/content/edit.blade.php
 * اللي جاي من السيرفر (لينكات / كلام): data-conf على وسم السكربت ← CONF
 */
(function () {
    var CONF = JSON.parse(document.currentScript.getAttribute('data-conf') || '{}');
    var filter = document.querySelector('[data-sc-filter]');
    var onlyChanged = document.querySelector('[data-sc-changed]');
    function apply() {
        var text = (filter.value || '').trim().toLowerCase();
        document.querySelectorAll('[data-sc-row]').forEach(function (row) {
            var haystack = row.textContent.toLowerCase() + ' ' + Array.prototype.map.call(row.querySelectorAll('input[type=text], textarea'), function (el) { return el.value.toLowerCase(); }).join(' ');
            row.style.display = (!text || haystack.indexOf(text) > -1) && (!onlyChanged.checked || row.getAttribute('data-changed') === '1') ? '' : 'none';
        });
        document.querySelectorAll('[data-sc-section]').forEach(function (section) {
            section.style.display = Array.prototype.some.call(section.querySelectorAll('[data-sc-row]'), function (row) { return row.style.display !== 'none'; }) ? '' : 'none';
        });
    }
    filter.addEventListener('input', apply);
    onlyChanged.addEventListener('change', apply);
    document.querySelectorAll('[data-sc-upload]').forEach(function (input) {
        input.addEventListener('change', function () {
            if (!input.files || !input.files[0]) { return; }
            var box = input.closest('.col-lg-6');
            var data = new FormData();
            data.append('_token', CONF.token);
            data.append('image', input.files[0]);
            fetch(CONF.uploadUrl, { method: 'POST', body: data, credentials: 'same-origin', headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
                .then(function (response) { return response.json(); })
                .then(function (json) {
                    if (!json.url) { window.alert(json.message || CONF.failed); return; }
                    box.querySelector('[data-sc-url]').value = json.url;
                    var preview = box.querySelector('[data-sc-preview]');
                    preview.src = json.preview || json.url;
                    preview.hidden = false;      // مكان صورة كان فاضي (زي صورة «عن شاري»)
                })
                .catch(function () { window.alert(CONF.failed); });
        });
    });
})();
