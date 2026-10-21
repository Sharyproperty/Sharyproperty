(function () {
    var form = document.getElementById('sx-sheet');
    var find = document.getElementById('sx-sheet-find');
    var rows = Array.prototype.slice.call(document.querySelectorAll('#sx-sheet-list .sx-pick__row'));
    var none = document.querySelector('#sx-sheet-list .sx-pick__none');
    var message = document.getElementById('sx-sheet-msg');
    var go = document.getElementById('sx-sheet-go');
    var open = document.getElementById('sx-sheet-open');
    var dl = document.getElementById('sx-sheet-dl');
    var addedBox = document.querySelector('.sx-cols');
    var syncKind = function () {
        var kind = (form.querySelector('input[name=sheet_kind]:checked') || {}).value || 'developer';
        if (dl) dl.href = dl.getAttribute('data-base') + '?kind=' + kind;
        if (addedBox) addedBox.hidden = kind === 'rent';
    };
    form.addEventListener('change', function (event) { if (event.target.name === 'sheet_kind') syncKind(); });
    syncKind();
    var fold = function (text) { return String(text).toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim(); };
    find.addEventListener('input', function () {
        var term = fold(find.value), shown = 0;
        rows.forEach(function (row) { var hit = !term || fold(row.getAttribute('data-name')).indexOf(term) >= 0; row.hidden = !hit; if (hit) { shown++; } });
        none.hidden = shown > 0;
    });
    var say = function (text, kind) { message.textContent = text; message.className = 'alert alert-' + kind; message.hidden = false; };
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        open.hidden = true;
        if (!form.querySelector('input[name=compound_id]:checked')) { say(form.getAttribute('data-need-project'), 'warning'); return; }
        if (!form.unit_file.files.length) { say(form.getAttribute('data-need-file'), 'warning'); return; }
        var label = go.textContent;
        go.disabled = true; go.textContent = form.getAttribute('data-wait');
        fetch(form.getAttribute('action'), { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'same-origin' })
            .then(function (response) { return response.json().catch(function () { return {}; }).then(function (data) { return { ok: response.ok, data: data }; }); })
            .then(function (result) {
                var data = result.data || {};
                if (result.ok && (data.status === 1 || data.status === true)) {
                    say(data.message || form.getAttribute('data-done'), 'success');
                    if (data.route) { open.href = data.route; open.hidden = false; }
                    form.unit_file.value = '';
                } else {
                    var errors = data.errors ? Object.keys(data.errors).map(function (key) { return [].concat(data.errors[key])[0]; }).join(' — ') : (data.message || '');
                    say(errors || form.getAttribute('data-fail'), 'danger');
                }
            })
            .catch(function () { say(form.getAttribute('data-fail'), 'danger'); })
            .then(function () { go.disabled = false; go.textContent = label; });
    });
})();
