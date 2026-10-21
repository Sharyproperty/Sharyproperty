(function () {
    var CONF = JSON.parse(document.currentScript.getAttribute('data-conf') || '{}');
    var LANG = CONF.lang;
    var counter = 0;

    function editor(el, focus) {
        if (!window.CKEDITOR || el.getAttribute('data-shary-on') === '1') { return; }
        if (!el.id) { el.id = 'shary_editor_' + (++counter); }
        el.setAttribute('data-shary-on', '1');
        var instance = CKEDITOR.replace(el.id, { height: parseInt(el.getAttribute('data-height') || '220', 10), language: LANG });
        if (focus) { instance.on('instanceReady', function () { instance.focus(); }); }
    }

    function dropEditor(el) {
        var on = el.getAttribute('data-shary-on') === '1';
        if (on && window.CKEDITOR && CKEDITOR.instances[el.id]) {
            CKEDITOR.instances[el.id].updateElement();
            CKEDITOR.instances[el.id].destroy();
        }
        el.removeAttribute('data-shary-on');
        return on;
    }

    function wire(scope) {
        scope.querySelectorAll('textarea.shary-editor').forEach(function (el) { editor(el, false); });
        scope.querySelectorAll('textarea.shary-editor-lazy').forEach(function (el) {
            if (el.getAttribute('data-shary-lazy') === '1') { return; }
            el.setAttribute('data-shary-lazy', '1');
            if (el.value.replace(/\s+/g, '') !== '') { editor(el, false); }
            el.addEventListener('focus', function () { editor(el, true); });
        });
    }

    document.querySelectorAll('[data-shary-repeater]').forEach(function (box) {
        var list = box.querySelector('[data-shary-rows]');
        var template = box.querySelector('template[data-shary-template]');
        var next = parseInt(box.getAttribute('data-next'), 10) || 0;
        var max = parseInt(box.getAttribute('data-max'), 10) || 50;

        function refresh() {
            var add = box.querySelector('[data-shary-add]');
            if (add) { add.disabled = list.children.length >= max; }
            Array.prototype.forEach.call(list.children, function (row, position) {
                var number = row.querySelector('[data-shary-number]');
                if (number) { number.textContent = String(position + 1); }
            });
        }

        box.addEventListener('click', function (event) {
            var button = event.target.closest('[data-shary-add],[data-shary-remove],[data-shary-up],[data-shary-down]');
            if (!button || button.closest('[data-shary-repeater]') !== box) { return; }
            event.preventDefault();

            if (button.hasAttribute('data-shary-add')) {
                if (list.children.length >= max) { return; }
                var holder = document.createElement('div');
                holder.innerHTML = template.innerHTML.replace(/__i__/g, String(next++));
                var added = holder.firstElementChild;
                list.appendChild(added);
                wire(added);
                var first = added.querySelector('input[type=text],input[type=number]');
                if (first) { first.focus(); }
            } else {
                var row = button.closest('[data-shary-row]');
                if (button.hasAttribute('data-shary-remove')) {
                    row.querySelectorAll('textarea').forEach(dropEditor);
                    row.parentNode.removeChild(row);
                } else {
                    var up = button.hasAttribute('data-shary-up');
                    var other = up ? row.previousElementSibling : row.nextElementSibling;
                    if (!other) { return; }
                    var reopen = [];
                    row.querySelectorAll('textarea').forEach(function (el) { if (dropEditor(el)) { reopen.push(el); } });
                    list.insertBefore(row, up ? other : other.nextElementSibling);
                    reopen.forEach(function (el) { editor(el, false); });
                }
            }
            refresh();
        });

        refresh();
    });

    wire(document);
})();
