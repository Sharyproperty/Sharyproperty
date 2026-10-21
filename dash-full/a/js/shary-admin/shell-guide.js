(function () {
    var CONF = JSON.parse(document.currentScript.getAttribute('data-conf') || '{}');
    var input = document.getElementById('sx-guide-q');
    var count = document.getElementById('sx-guide-count');
    var none = document.getElementById('sx-guide-none');
    var fold = function (text) { return String(text).toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ').trim(); };
    var run = function () {
        var term = fold(input.value), total = 0;
        Array.prototype.forEach.call(document.querySelectorAll('[data-guide-group]'), function (group) {
            var shown = 0;
            Array.prototype.forEach.call(group.querySelectorAll('[data-guide-row]'), function (row) {
                var hit = !term || fold(row.getAttribute('data-guide-row')).indexOf(term) >= 0;
                row.classList.toggle('sx-hide', !hit);
                if (hit) { shown++; }
            });
            group.hidden = shown === 0;
            total += shown;
        });
        count.textContent = term ? total + ' ' + CONF.listCount : '';
        none.hidden = total > 0;
    };
    input.addEventListener('input', run);
    var asked = new URLSearchParams(window.location.search).get('q');
    if (asked) { input.value = asked; run(); }
})();
