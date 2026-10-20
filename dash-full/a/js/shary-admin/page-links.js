/**
 * لينكات الصفحات: البحث عن صفحة وترتيب اللينكات
 * الصفحة: resources/views/shary_admin/page_links/edit.blade.php
 * اللي جاي من السيرفر (لينكات / كلام): data-conf على وسم السكربت ← CONF
 */
(function () {
    var CONF = JSON.parse(document.currentScript.getAttribute('data-conf') || '{}');
    var url = CONF.searchUrl;
    var L = CONF.texts;
    function escapeHtml(value) { return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    // search → pick → added to "chosen by hand"
    document.querySelectorAll('[data-pl-search]').forEach(function (box) {
        var input = box.querySelector('[data-pl-q]');
        var results = box.querySelector('[data-pl-results]');
        var pins = box.parentNode.querySelector('[data-pl-pins]');
        var timer = null, counter = 0;
        input.addEventListener('input', function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                var mine = ++counter;
                if (input.value.trim().length < 1) { results.innerHTML = ''; return; }
                fetch(url + '?type=' + encodeURIComponent(box.getAttribute('data-pl-search')) + '&lang=' + CONF.lang + '&q=' + encodeURIComponent(input.value.trim()), { headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'same-origin' })
                    .then(function (response) { return response.json(); })
                    .then(function (json) {
                        if (mine !== counter) { return; }
                        var items = (json && json.items) || [];
                        results.innerHTML = items.length ? '' : '<div class="p-2 text-muted">' + escapeHtml(L.none) + '</div>';
                        items.forEach(function (item) {
                            if (!item.id) { return; }
                            var row = document.createElement('button');
                            row.type = 'button';
                            row.textContent = item.label;
                            row.addEventListener('click', function () {
                                if (pins.querySelector('input[value="' + item.id + '"]')) { results.innerHTML = ''; input.value = ''; return; }
                                var li = document.createElement('li');
                                li.setAttribute('data-pl-pin', '');
                                li.innerHTML = '<input type="hidden" name="' + box.getAttribute('data-pl-field') + '[pinned][]" value="' + Number(item.id) + '"><span>' + escapeHtml(item.label) + '</span>' +
                                    '<button type="button" class="btn btn-sm btn-light" data-pl-up aria-label="' + escapeHtml(L.up) + '">↑</button><button type="button" class="btn btn-sm btn-light" data-pl-down aria-label="' + escapeHtml(L.down) + '">↓</button>' +
                                    '<button type="button" class="btn btn-sm btn-outline-danger" data-pl-remove>' + escapeHtml(L.remove) + '</button>';
                                pins.appendChild(li);
                                results.innerHTML = '';
                                input.value = '';
                            });
                            results.appendChild(row);
                        });
                    })
                    .catch(function () { results.innerHTML = ''; });
            }, 220);
        });
    });
    document.addEventListener('click', function (event) {
        var pin = event.target.closest('[data-pl-pin]');
        if (pin && event.target.closest('[data-pl-remove]')) { pin.parentNode.removeChild(pin); return; }
        if (pin && event.target.closest('[data-pl-up]') && pin.previousElementSibling) { pin.parentNode.insertBefore(pin, pin.previousElementSibling); return; }
        if (pin && event.target.closest('[data-pl-down]') && pin.nextElementSibling) { pin.parentNode.insertBefore(pin.nextElementSibling, pin); return; }
        var add = event.target.closest('[data-pl-add-link]');
        if (add) {
            var card = add.closest('[data-pl-block]');
            card.querySelector('[data-pl-links]').insertAdjacentHTML('beforeend', card.querySelector('[data-pl-link-template]').innerHTML.replace(/__i__/g, String(Date.now())));
            return;
        }
        var drop = event.target.closest('[data-pl-drop-link]');
        if (drop) { var row = drop.closest('[data-pl-link]'); if (row) { row.parentNode.removeChild(row); } }
    });
})();
