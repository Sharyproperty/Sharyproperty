(function () {
    var CONF = JSON.parse(document.currentScript.getAttribute('data-conf') || '{}');
    var TEXT = {
        title: CONF.sure,
        yes: CONF.yes,
        no: CONF.no
    };

    document.addEventListener('submit', function (event) {
        var form = event.target;
        if (!form.hasAttribute || !form.hasAttribute('data-shary-confirm') || form.getAttribute('data-shary-ok') === '1') { return; }
        event.preventDefault();
        var message = form.getAttribute('data-shary-confirm');
        var go = function () { form.setAttribute('data-shary-ok', '1'); form.submit(); };
        if (window.Swal && Swal.fire) {
            Swal.fire({
                title: TEXT.title, text: message, type: 'warning', showCancelButton: true,
                confirmButtonText: TEXT.yes, cancelButtonText: TEXT.no,
                confirmButtonClass: 'btn btn-primary', cancelButtonClass: 'btn btn-danger ml-1', buttonsStyling: false
            }).then(function (result) { if (result.value) { go(); } });
        } else if (window.confirm(message)) {
            go();
        }
    }, true);

    document.addEventListener('click', function (event) {
        var button = event.target.closest ? event.target.closest('[data-shary-all]') : null;
        if (!button) { return; }
        event.preventDefault();
        var on = button.getAttribute('data-shary-all') === '1';
        var scope = button.closest('form') || document;
        scope.querySelectorAll('input[type=checkbox][data-shary-switch]').forEach(function (box) { box.checked = on; });
    });

    document.querySelectorAll('[data-shary-tabset]').forEach(function (bar) {
        var scope = bar.closest('[data-shary-tabbed]') || document;
        var memory = scope.querySelector('input[name=_tab]');
        function show(key) {
            var found = false;
            scope.querySelectorAll('[data-shary-pane]').forEach(function (pane) {
                var on = pane.getAttribute('data-shary-pane') === key;
                pane.style.display = on ? '' : 'none';
                found = found || on;
            });
            if (!found) { return; }
            bar.querySelectorAll('[data-shary-tab]').forEach(function (link) { link.classList.toggle('active', link.getAttribute('data-shary-tab') === key); });
            if (memory) { memory.value = key; }
        }
        bar.addEventListener('click', function (event) {
            var link = event.target.closest('[data-shary-tab]');
            if (!link) { return; }
            event.preventDefault();
            show(link.getAttribute('data-shary-tab'));
            if (window.history && history.replaceState) { history.replaceState(null, '', '#' + link.getAttribute('data-shary-tab')); }
        });
        var start = (location.hash || '').replace('#', '');
        var forced = bar.getAttribute('data-shary-open');
        show(forced || (start && bar.querySelector('[data-shary-tab="' + start.replace(/[^a-z0-9_\-]/gi, '') + '"]') ? start : bar.querySelector('[data-shary-tab]').getAttribute('data-shary-tab')));
    });
})();
