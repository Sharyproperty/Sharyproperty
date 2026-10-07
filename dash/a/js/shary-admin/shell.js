/*
 * Shary dashboard shell — the behaviour of the one menu, the header search and the search box above every list.
 * No library is needed; when the old template's DataTables is on a table, the list search drives it.
 *
 *   1 menu (groups, phone drawer)      3 tables: sideways scroll, action buttons
 *   2 header search                    4 list search (rows in the browser · DataTables · the server with ?q=)
 */
(function () {
    'use strict';
    var cfg = window.SharyShell || {};
    var T = cfg.t || {};
    var doc = document;
    var $ = function (selector, root) { return (root || doc).querySelector(selector); };
    var $$ = function (selector, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(selector)); };
    var store = {
        get: function (key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } },
        set: function (key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* private mode */ } }
    };

    /** Letters that are typed in more than one way are folded, so "اسكان" finds "إسكان" and "١٢" finds "12" */
    function fold(text) {
        return String(text == null ? '' : text).toLowerCase()
            .replace(/[ً-ْـ]/g, '')
            .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
            .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 1632); })
            .replace(/\s+/g, ' ').trim();
    }
    function el(tag, className, text) {
        var node = doc.createElement(tag);
        if (className) { node.className = className; }
        if (text != null) { node.textContent = text; }
        return node;
    }
    function icon(paths, size) {
        return '<svg width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + paths + '</svg>';
    }
    var ICON_SEARCH = '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>';
    var ICON_X = '<path d="M6 6l12 12M18 6 6 18"/>';

    // ------------------------------------------------------------------ 1 menu
    var side = $('[data-sx-side]');
    var shade = $('[data-sx-shade]');
    var burger = $('[data-sx-menu]');
    var phone = window.matchMedia('(max-width: 991.98px)');

    $$('.sx-grp').forEach(function (group) {
        var button = $('button', group);
        if (!button) { return; }
        var key = 'sx-grp-' + group.getAttribute('data-sx-grp');
        if (!group.classList.contains('is-on') && store.get(key) === '1') {
            group.classList.add('is-open');
            button.setAttribute('aria-expanded', 'true');
        }
        button.addEventListener('click', function () {
            var open = !group.classList.contains('is-open');
            group.classList.toggle('is-open', open);
            button.setAttribute('aria-expanded', open ? 'true' : 'false');
            store.set(key, open ? '1' : '0');
        });
    });
    (function showCurrent() {
        var current = side && $('.sx-nav [aria-current="page"]', side);
        var nav = side && $('.sx-nav', side);
        if (current && nav) {
            var top = current.getBoundingClientRect().top - nav.getBoundingClientRect().top;
            if (top > nav.clientHeight - 80) { nav.scrollTop += top - nav.clientHeight / 2; }
        }
    })();

    function drawer(open) {
        if (!side) { return; }
        side.classList.toggle('is-open', open);
        if (shade) { shade.hidden = !open; }
        doc.documentElement.classList.toggle('sx-lock', open);
        if (burger) {
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
            burger.setAttribute('aria-label', open ? (T.menu_close || '') : (T.menu_open || ''));
        }
        if (open) {
            var first = $('[data-sx-menu-close]', side);
            if (first) { first.focus(); }
        } else if (burger && phone.matches) {
            burger.focus();
        }
    }
    if (burger) { burger.addEventListener('click', function () { drawer(!side.classList.contains('is-open')); }); }
    $$('[data-sx-menu-close]').forEach(function (button) { button.addEventListener('click', function () { drawer(false); }); });
    if (shade) { shade.addEventListener('click', function () { drawer(false); }); }
    var onPhoneChange = function () { if (!phone.matches) { drawer(false); } };
    if (phone.addEventListener) { phone.addEventListener('change', onPhoneChange); } else if (phone.addListener) { phone.addListener(onPhoneChange); }

    var user = $('[data-sx-user]');
    doc.addEventListener('click', function (event) {
        if (user && user.open && !user.contains(event.target)) { user.open = false; }
    });

    // ------------------------------------------------------------------ 2 header search
    var top = $('[data-sx-top]');
    var find = $('[data-sx-find]');
    if (find && cfg.search) {
        var input = $('input', find);
        var out = $('.sx-find__out', find);
        var timer = null;
        var asked = 0;
        var links = [];
        var cursor = -1;

        var close = function () { out.hidden = true; input.setAttribute('aria-expanded', 'false'); cursor = -1; };
        var show = function () { out.hidden = false; input.setAttribute('aria-expanded', 'true'); };
        var mark = function (index) {
            links.forEach(function (link, i) { link.classList.toggle('is-cur', i === index); });
            cursor = index;
            if (links[index]) { links[index].scrollIntoView({ block: 'nearest' }); }
        };
        var render = function (groups) {
            out.textContent = '';
            links = [];
            if (!groups.length) {
                out.appendChild(el('div', 'sx-find__empty', T.search_empty || ''));
                show();
                return;
            }
            groups.forEach(function (group) {
                out.appendChild(el('div', 'sx-find__label', group.label));
                (group.items || []).forEach(function (item) {
                    var row = el('div', 'sx-find__row');
                    var link = el('a');
                    link.href = item.url;
                    link.setAttribute('role', 'option');
                    link.appendChild(el('span', null, item.title));
                    if (item.sub) { link.appendChild(el('small', null, item.sub)); }
                    row.appendChild(link);
                    links.push(link);
                    (item.more || []).forEach(function (more) {
                        var extra = el('a', 'sx-find__more', more.label);
                        extra.href = more.url;
                        row.appendChild(extra);
                    });
                    out.appendChild(row);
                });
            });
            show();
        };
        var ask = function () {
            var term = input.value.trim();
            find.classList.toggle('has-text', term !== '');
            if (term.length < 2) {
                out.textContent = '';
                if (term.length) { out.appendChild(el('div', 'sx-find__empty', T.search_hint || '')); show(); } else { close(); }
                return;
            }
            var mine = ++asked;
            fetch(cfg.search + (cfg.search.indexOf('?') < 0 ? '?' : '&') + 'q=' + encodeURIComponent(term), { headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'same-origin' })
                .then(function (response) { return response.ok ? response.json() : { groups: [] }; })
                .then(function (data) { if (mine === asked) { render((data && data.groups) || []); } })
                .catch(function () { if (mine === asked) { render([]); } });
        };
        input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(ask, 220); });
        input.addEventListener('focus', function () { if (input.value.trim().length >= 2 && out.childNodes.length) { show(); } });
        input.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowDown' && links.length) { event.preventDefault(); mark((cursor + 1) % links.length); }
            else if (event.key === 'ArrowUp' && links.length) { event.preventDefault(); mark((cursor - 1 + links.length) % links.length); }
            else if (event.key === 'Enter') {
                var target = links[cursor < 0 ? 0 : cursor];
                if (target) { event.preventDefault(); window.location.href = target.href; }
            } else if (event.key === 'Escape') {
                if (!out.hidden) { close(); } else if (top) { top.classList.remove('is-finding'); }
            }
        });
        doc.addEventListener('click', function (event) { if (!find.contains(event.target) && !event.target.closest('[data-sx-find-open]')) { close(); } });
        var opener = $('[data-sx-find-open]');
        if (opener && top) {
            opener.addEventListener('click', function () { top.classList.add('is-finding'); input.focus(); });
        }
        var closer = $('[data-sx-find-close]', find);
        if (closer) {
            closer.addEventListener('click', function () {
                input.value = '';
                find.classList.remove('has-text');
                close();
                if (top && top.classList.contains('is-finding')) { top.classList.remove('is-finding'); if (opener) { opener.focus(); } } else { input.focus(); }
            });
        }
        doc.addEventListener('keydown', function (event) {
            if (event.key === '/' && !/^(input|textarea|select)$/i.test((event.target.tagName || '')) && !event.target.isContentEditable) {
                event.preventDefault();
                if (top && phone.matches) { top.classList.add('is-finding'); }
                input.focus();
            }
        });
    }
    doc.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && side && side.classList.contains('is-open')) { drawer(false); }
    });

    // ------------------------------------------------------------------ 3 tables
    var page = $('.page-wrapper') || $('.sx-page');
    var ACTIONS = [[/edit/i, T.actions_edit], [/delete|trash|close-circle/i, T.actions_delete], [/eye|view/i, T.actions_view], [/plus/i, T.actions_add]];

    function dataTable(table) {
        var jq = window.jQuery;
        try {
            return jq && jq.fn && jq.fn.dataTable && jq.fn.dataTable.isDataTable(table) ? jq(table).DataTable() : null;
        } catch (e) { return null; }
    }
    function tidyTables() {
        if (!page) { return; }
        $$('table', page).forEach(function (table) {
            if (table.closest('.sx-scroll, .table-responsive, .ag-scroll, .note-editor, .cke, .dataTables_scroll, .datepicker, .bootstrap-datetimepicker-widget, .tox')) { return; }
            if (table.getAttribute('role') === 'presentation' || table.closest('[contenteditable]')) { return; }
            var wrap = el('div', 'sx-scroll');
            table.parentNode.insertBefore(wrap, table);
            wrap.appendChild(table);
        });
        $$('td a, td button', page).forEach(function (link) {
            if (link.classList.contains('sx-act') || link.children.length !== 1 || link.textContent.trim() !== '') { return; }
            var image = link.children[0];
            if (image.tagName !== 'IMG' || !/\/icons\//.test(image.getAttribute('src') || '')) { return; }
            link.classList.add('sx-act');
            for (var i = 0; i < ACTIONS.length; i++) {
                if (ACTIONS[i][0].test(image.getAttribute('src')) && ACTIONS[i][1]) {
                    if (!link.getAttribute('aria-label')) { link.setAttribute('aria-label', ACTIONS[i][1]); }
                    if (!link.getAttribute('title')) { link.setAttribute('title', ACTIONS[i][1]); }
                    image.setAttribute('alt', '');
                    break;
                }
            }
        });
    }

    // On a phone a wide table is hard to read sideways: every row becomes a small card, each value under the name of its column.
    // The table itself is untouched (same rows, same buttons) — only labels are added and the stylesheet does the rest below 700px.
    function label(table, row) {
        var heads = table.__sxHeads;
        if (!heads || row.classList.contains('sx-list__none')) { return; }
        Array.prototype.forEach.call(row.cells, function (cell, index) {
            if (!cell.hasAttribute('data-l') && cell.colSpan === 1) { cell.setAttribute('data-l', heads[index] || ''); }
        });
    }
    function stackTables() {
        if (!page) { return; }
        $$('table', page).forEach(function (table) {
            if (table.__sxHeads || table.classList.contains('sx-no-stack') || table.closest('.note-editor, .cke, .dataTables_scrollHead, .datepicker, .bootstrap-datetimepicker-widget, .ag-stack, .tox')) { return; }
            if (table.classList.contains('ag-stack') || !table.tHead || table.tHead.rows.length !== 1 || !table.tBodies.length) { return; }
            var headCells = Array.prototype.slice.call(table.tHead.rows[0].cells);
            if (headCells.length < 3 || headCells.some(function (cell) { return cell.colSpan > 1 || cell.rowSpan > 1; })) { return; }
            var first = bodyRows(table)[0];
            if (first && (first.cells.length !== headCells.length || Array.prototype.some.call(first.cells, function (cell) { return cell.rowSpan > 1; }))) { return; }
            table.__sxHeads = headCells.map(function (cell) { return cell.textContent.replace(/\s+/g, ' ').trim(); });
            table.classList.add('sx-stack');
            var api = dataTable(table);
            var rows = api ? Array.prototype.slice.call(api.rows().nodes()) : bodyRows(table);
            rows.forEach(function (row) { label(table, row); });
            if (window.MutationObserver) {
                new MutationObserver(function () { bodyRows(table).forEach(function (row) { label(table, row); }); }).observe(table, { childList: true, subtree: true });
            }
        });
    }

    // ------------------------------------------------------------------ 4 list search
    function bodyRows(table) {
        var rows = [];
        Array.prototype.forEach.call(table.tBodies, function (body) {
            Array.prototype.forEach.call(body.rows, function (row) { if (!row.classList.contains('sx-list__none')) { rows.push(row); } });
        });
        return rows;
    }
    function wantsSearch(table) {
        if (table.closest('.modal, form .sx-no-search, .sx-no-search, .note-editor, .cke, .ag-detail') || table.classList.contains('sx-no-search') || table.classList.contains('ag-stack') || table.hasAttribute('data-sx-searched')) { return false; }
        if (!table.tHead && !$('th', table)) { return false; }
        if (!table.offsetParent && !table.getClientRects().length) { return false; }   // inside a closed tab: it gets its box when the tab opens
        var rows = bodyRows(table);
        var paged = !!dataTable(table) || !!serverPager(table);
        if (rows.length < 6 && !paged && !(cfg.serverList && cfg.q)) { return false; }
        // a grid that is filled in (inputs in its rows) is a form, not a list
        if (rows[0] && $$('input:not([type=hidden]):not([type=checkbox]):not([type=radio]), select, textarea', rows[0]).some(function (field) { return !field.closest('.modal'); })) { return false; }
        var scope = table.closest('.card, .ag-card, .tab-pane, .content') || page;
        // the screen already has its own search (a ?q= form, or the old screens' own search field): leave it alone
        var own = scope ? $$('input[name="q"], input[name="query"], input[name="search"], .search-set input, input[type="search"]', scope) : [];
        if (own.some(function (field) { return !field.closest('.dataTables_filter, .modal, .sx-list') && field.id !== 'sx-q'; })) { return false; }
        return true;
    }
    function serverPager(table) {
        var scope = table.closest('.card, .ag-card, .tab-pane, .content') || page;
        var link = scope && $('.pagination a[href*="page="]', scope);
        return link && !link.closest('.dataTables_wrapper') ? link : null;
    }
    function addSearch(table) {
        table.setAttribute('data-sx-searched', '1');
        var server = !!cfg.serverList && (!!serverPager(table) || !!cfg.q);
        var bar = el(server ? 'form' : 'div', 'sx-list');
        var box = el('div', 'sx-list__box');
        box.innerHTML = icon(ICON_SEARCH);
        var field = el('input', 'sx-list__input');
        field.type = 'search';
        field.autocomplete = 'off';
        field.setAttribute('enterkeyhint', 'search');
        field.placeholder = server ? (T.list_search_all || '') : (T.list_search || '');
        field.setAttribute('aria-label', field.placeholder);
        box.appendChild(field);
        var clear = el('button', 'sx-list__x');
        clear.type = 'button';
        clear.setAttribute('aria-label', T.list_clear || '');
        clear.innerHTML = icon(ICON_X, 16);
        box.appendChild(clear);
        bar.appendChild(box);
        var count = el('span', 'sx-list__count');
        count.setAttribute('aria-live', 'polite');

        if (server) {
            // the list is split into pages by the server: the box asks the server (?q=), keeping the other filters of the address
            bar.method = 'get';
            bar.action = window.location.pathname;
            field.name = 'q';
            field.value = cfg.q || '';
            new URLSearchParams(window.location.search).forEach(function (value, key) {
                if (key === 'q' || key === 'page') { return; }
                var hidden = el('input');
                hidden.type = 'hidden';
                hidden.name = key;
                hidden.value = value;
                bar.appendChild(hidden);
            });
            var go = el('button', 'btn btn-primary sx-list__go', T.list_go || '');
            go.type = 'submit';
            bar.appendChild(go);
            bar.classList.toggle('has-text', field.value !== '');
            field.addEventListener('input', function () { bar.classList.toggle('has-text', field.value !== ''); });
            clear.addEventListener('click', function () { field.value = ''; if (cfg.q) { bar.submit(); } else { bar.classList.remove('has-text'); field.focus(); } });
        } else {
            bar.appendChild(count);
            var none = null;
            var run = function () {
                var term = fold(field.value);
                bar.classList.toggle('has-text', term !== '');
                var api = dataTable(table);
                if (api) {
                    api.search(field.value).draw();
                    count.textContent = term ? api.rows({ search: 'applied' }).count() + ' ' + (T.list_count || '') : '';
                    return;
                }
                var shown = 0;
                var rows = bodyRows(table);
                rows.forEach(function (row) {
                    var hit = term === '' || fold(row.textContent).indexOf(term) >= 0;
                    row.classList.toggle('sx-hide', !hit);
                    if (hit) { shown++; }
                });
                count.textContent = term ? shown + ' ' + (T.list_count || '') : '';
                if (term && !shown) {
                    if (!none) {
                        none = el('tr', 'sx-list__none');
                        var cell = el('td', null, T.list_none || '');
                        cell.colSpan = Math.max(1, (table.rows[0] && table.rows[0].cells.length) || 1);
                        none.appendChild(cell);
                    }
                    (table.tBodies[0] || table).appendChild(none);
                } else if (none && none.parentNode) {
                    none.parentNode.removeChild(none);
                }
            };
            var wait = null;
            field.addEventListener('input', function () { clearTimeout(wait); wait = setTimeout(run, 120); });
            field.addEventListener('keydown', function (event) { if (event.key === 'Enter') { event.preventDefault(); run(); } });
            clear.addEventListener('click', function () { field.value = ''; run(); field.focus(); });
            // a link from the header search ("…?q=name") opens the list already filtered
            var asked = new URLSearchParams(window.location.search).get('q');
            if (asked && !table.closest('.tab-pane:not(.active)')) { field.value = asked; setTimeout(run, 0); }
        }

        var scope = table.closest('.card, .ag-card, .tab-pane, .content') || page;
        if (scope) { scope.classList.add('has-sx-search'); }
        var anchor = table.closest('.dataTables_wrapper') || table.closest('.sx-scroll, .table-responsive, .ag-scroll') || table;
        var tools = scope && $('.table-top', scope);
        if (tools && !tools.contains(anchor) && !$('.sx-list', tools)) { tools.insertBefore(bar, tools.firstChild); } else { anchor.parentNode.insertBefore(bar, anchor); }
    }
    function listSearch() {
        if (!page) { return; }
        $$('table', page).forEach(function (table) { if (wantsSearch(table)) { addSearch(table); } });
    }

    // a picture whose file is missing shows a quiet placeholder instead of a broken-image mark
    var BLANK = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 56"><rect width="72" height="56" rx="8" fill="#e8f0fb"/><path d="M22 38l9-10 7 7 5-5 8 8z" fill="#b9cbe2"/><circle cx="27" cy="21" r="4" fill="#b9cbe2"/></svg>');
    function blank(image) {
        if (image.getAttribute('data-sx-blank') || /^data:/.test(image.getAttribute('src') || '')) { return; }
        image.setAttribute('data-sx-blank', '1');
        image.classList.add('sx-noimg');
        image.removeAttribute('srcset');
        image.removeAttribute('sizes');
        image.src = BLANK;
    }
    function pictures() {
        if (!page) { return; }
        $$('img', page).forEach(function (image) {
            if (image.complete && image.naturalWidth === 0 && image.getAttribute('src')) { blank(image); }
        });
    }
    doc.addEventListener('error', function (event) {
        var target = event.target;
        if (target && target.tagName === 'IMG' && page && page.contains(target)) { blank(target); }
    }, true);

    // the hint "this screen controls …" goes right under the screen's own title
    (function hint() {
        var template = $('template[data-sx-hint]');
        var header = page && ($('.page-header', page) || $('.ag-head', page));
        var crumb = $('template[data-sx-crumb]');
        if (crumb && header && crumb.content) { header.parentNode.insertBefore(crumb.content.cloneNode(true), header); }
        if (!template || !header || !template.content) { return; }
        header.parentNode.insertBefore(template.content.cloneNode(true), header.nextSibling);
    })();

    function ready() {
        tidyTables();
        stackTables();
        listSearch();
        pictures();
    }
    // after the template's own scripts (DataTables is created on document ready)
    if (doc.readyState === 'complete') { setTimeout(ready, 0); } else { window.addEventListener('load', function () { setTimeout(ready, 0); }); }
    // screens that load a tab or a list later (modals, AJAX) get the same treatment
    doc.addEventListener('shown.bs.tab', function () { setTimeout(ready, 30); });
    cfg.refresh = ready;
    window.SharyShell = cfg;
})();
