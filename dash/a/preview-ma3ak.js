/*
 * «شاري معاك» in the preview copy of the dashboard (static files — there is no server behind this link).
 *   - a decision asks «متأكد؟» first, exactly like on the server; after "yes", a/preview.js says that saving happens on the server
 *     (and the buttons stay usable, so every decision can be tried again);
 *   - "find the customer" (add a customer's unit / record a deal) lists the demo customers that match what is typed.
 * Loaded after js/shary-admin/ma3ak.js and before a/preview.js (the order of the submit listeners matters).
 */
(function () {
    'use strict';
    var D = window.SharyPreviewData || {};
    var EN = D.lang === 'en';
    var doc = document;
    var here = (window.location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    var base = here.split('_')[0];
    var SEARCH = { 'admin-shary-ma3ak-owned-units-create': true, 'admin-shary-ma3ak-investments-create': true };

    function fold(text) {
        return String(text == null ? '' : text).toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
            .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 1632); }).replace(/\s+/g, ' ').trim();
    }

    doc.addEventListener('submit', function (event) {
        var form = event.target;
        if (!form || form.tagName !== 'FORM') { return; }
        // ma3ak.js is asking «متأكد؟» (or the form is already on its way): the preview note waits for the answer
        if (event.defaultPrevented) { event.stopImmediatePropagation(); return; }
        var method = (form.getAttribute('method') || 'get').toLowerCase();
        var find = form.querySelector('input[name="q"]');
        if (method === 'get' && SEARCH[base] && find) {
            event.preventDefault();
            event.stopImmediatePropagation();
            window.location.href = base + '_q-demo.html?q=' + encodeURIComponent(find.value || '');
            return;
        }
        // the decision was confirmed: a/preview.js shows its note — the buttons come back for the next try
        setTimeout(function () {
            form.__ma3akSending = false;
            Array.prototype.forEach.call(form.querySelectorAll('button[type=submit], input[type=submit]'), function (button) { button.disabled = false; });
        }, 80);
    }, true);

    // countries and cities: ?parent=&open= opens a city's panel and picks that city in "several names at once" (as the server does)
    if (base === 'admin-shary-ma3ak-locations') {
        var params = new URLSearchParams(window.location.search);
        var open = (params.get('open') || '').replace(/\D/g, '');
        var parent = (params.get('parent') || '').replace(/\D/g, '');
        var panel = open ? doc.getElementById('ma3ak-loc-' + open) : null;
        if (panel) { panel.open = true; }
        var pick = parent ? doc.getElementById('ma3ak-loc-bulk-parent') : null;
        if (pick && pick.querySelector('option[value="' + parent + '"]')) { pick.value = parent; }
        if (window.location.hash && (panel || pick)) {
            var target = doc.getElementById(window.location.hash.slice(1));
            if (target) { window.addEventListener('load', function () { target.scrollIntoView(); }); }
        }
    }

    // the saved search of the demo customers: only the ones matching what was typed
    if (/_q-demo$/.test(here)) {
        var term = new URLSearchParams(window.location.search).get('q');
        var input = doc.querySelector('.page-wrapper input[name="q"]');
        if (input) { input.value = term === null ? '' : term; }
        if (term !== null) {
            var needle = fold(term), shown = 0, table = null;
            Array.prototype.forEach.call(doc.querySelectorAll('.page-wrapper table.sx-no-search tbody tr'), function (row) {
                table = table || row.closest('table');
                var hit = !needle || fold(row.textContent).indexOf(needle) >= 0;
                row.style.display = hit ? '' : 'none';
                if (hit) { shown++; }
            });
            if (table && !shown) {
                var note = doc.createElement('p');
                note.className = 'text-muted mb-0';
                note.textContent = EN ? 'No customer matches these words — try a name, a phone number or an e-mail.' : 'مفيش عميل بالكلام ده — جرّب اسم أو رقم موبايل أو إيميل.';
                var box = table.closest('.table-responsive') || table;
                box.style.display = 'none';
                box.parentNode.insertBefore(note, box.nextSibling);
            }
        }
    }
})();
