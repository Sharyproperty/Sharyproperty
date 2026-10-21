(function () {
    'use strict';
    var cfg = window.SharyShell || {};
    var T = cfg.t || {};
    var doc = document;
    var $ = function (selector, root) { return (root || doc).querySelector(selector); };
    var $$ = function (selector, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(selector)); };
    var store = {
        get: function (key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } },
        set: function (key, value) { try { window.localStorage.setItem(key, value); } catch (e) { } }
    };

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
        if (!table.offsetParent && !table.getClientRects().length) { return false; }
        var rows = bodyRows(table);
        var paged = !!dataTable(table) || !!serverPager(table);
        if (rows.length < 1 && !paged && !(cfg.serverList && cfg.q)) { return false; }
        if (rows[0] && $$('input:not([type=hidden]):not([type=checkbox]):not([type=radio]), select, textarea', rows[0]).some(function (field) { return !field.closest('.modal'); })) { return false; }
        var scope = table.closest('.card, .ag-card, .tab-pane, .content') || page;
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

    (function hint() {
        var template = $('template[data-sx-hint]');
        var header = page && ($('.page-header', page) || $('.ag-head', page));
        var crumb = $('template[data-sx-crumb]');
        if (crumb && header && crumb.content) { header.parentNode.insertBefore(crumb.content.cloneNode(true), header); }
        if (!template || !header || !template.content) { return; }
        header.parentNode.insertBefore(template.content.cloneNode(true), header.nextSibling);
    })();


    var RECORD = /area|city|country|developer|compound|project|unit_id|units|property_id|categor|blog|article|user|admin|owner|parent/i;
    var picks = [];
    var openPick = null;
    function select2On() { return !!(window.jQuery && window.jQuery.fn && window.jQuery.fn.select2); }
    function searchInSelect2(node) {
        try {
            var instance = window.jQuery(node).data('select2');
            if (instance && instance.dropdown && 'minimumResultsForSearch' in instance.dropdown) { instance.dropdown.minimumResultsForSearch = 0; }
            if (instance && instance.options && instance.options.options) {
                var options = instance.options.options;
                options.minimumResultsForSearch = 0;
                if (!options.ajax && !options.__sxMatcher) {
                    options.__sxMatcher = true;
                    options.matcher = function (params, data) {
                        var term = fold(params && params.term);
                        if (!term) { return data; }
                        if (data.children && data.children.length) {
                            var kept = data.children.filter(function (child) { return fold(child.text).indexOf(term) > -1; });
                            if (!kept.length) { return null; }
                            var copy = {}; Object.keys(data).forEach(function (key) { copy[key] = data[key]; }); copy.children = kept;
                            return copy;
                        }
                        return fold(data.text).indexOf(term) > -1 ? data : null;
                    };
                }
                var dict = options.translations && options.translations.dict;
                if (dict && T.pick_none) { dict.noResults = function () { return T.pick_none; }; }
            }
        } catch (e) { }
    }
    function hookSelect2() {
        if (!select2On() || window.jQuery.fn.select2.__sx) { return; }
        var jq = window.jQuery;
        var original = jq.fn.select2;
        var wrapped = function (options) {
            var result = original.apply(this, arguments);
            if (options === undefined || typeof options === 'object') { this.each(function () { dropPick(this); searchInSelect2(this); }); }
            return result;
        };
        Object.keys(original).forEach(function (key) { wrapped[key] = original[key]; });
        wrapped.__sx = true;
        jq.fn.select2 = wrapped;
        jq(doc).on('select2:open', function () {
            setTimeout(function () { $$('.select2-container--open .select2-search__field').forEach(function (field) { if (!field.placeholder) { field.placeholder = T.pick_search || ''; } }); }, 0);
        });
        $$('select.select2-hidden-accessible').forEach(searchInSelect2);
    }
    function wantsPick(select) {
        var mode = select.getAttribute('data-sx-pick');
        if (mode === 'off' || select.multiple || select.size > 1 || select.__sxPick) { return false; }
        if (select.classList.contains('select2-hidden-accessible') || select.closest('.dataTables_length, .cke, .note-editor, .sx-choice, .flatpickr-calendar, .ui-datepicker')) { return false; }
        if (select2On() && /(^|\s)(select|select2|js-example-basic-single)(\s|$)/.test(select.className)) { return false; }
        if (mode === 'always') { return true; }
        var count = 0;
        Array.prototype.forEach.call(select.options, function (option) { if (option.value !== '' && !option.disabled) { count++; } });
        return count >= 4 || (count >= 2 && RECORD.test((select.name || '') + ' ' + (select.id || '')));
    }
    function dropPick(select) {
        var pick = select.__sxPick;
        if (!pick) { return; }
        if (openPick === pick) { closePick(); }
        if (pick.observer) { pick.observer.disconnect(); }
        if (pick.wrap.parentNode) { pick.wrap.parentNode.insertBefore(select, pick.wrap); pick.wrap.parentNode.removeChild(pick.wrap); }
        select.classList.remove('sx-choice__native');
        select.__sxPick = null;
        picks = picks.filter(function (one) { return one !== pick; });
    }
    function closePick() {
        if (!openPick) { return; }
        openPick.panel.hidden = true;
        openPick.button.setAttribute('aria-expanded', 'false');
        openPick.wrap.classList.remove('is-open');
        openPick = null;
    }
    function placePick(pick) {
        var box = pick.button.getBoundingClientRect();
        var below = window.innerHeight - box.bottom;
        var height = Math.min(340, Math.max(180, (below > 220 ? below : box.top) - 12));
        pick.panel.style.width = Math.max(box.width, 220) + 'px';
        pick.panel.style.left = Math.max(8, Math.min(box.left, window.innerWidth - Math.max(box.width, 220) - 8)) + 'px';
        pick.panel.style.maxHeight = height + 'px';
        if (below > 220 || below >= box.top) { pick.panel.style.top = (box.bottom + 4) + 'px'; pick.panel.style.bottom = 'auto'; } else { pick.panel.style.bottom = (window.innerHeight - box.top + 4) + 'px'; pick.panel.style.top = 'auto'; }
    }
    function fillPick(pick, term) {
        var needle = fold(term || '');
        pick.list.textContent = '';
        var shown = 0;
        var add = function (option, group) {
            if (needle && fold(option.textContent).indexOf(needle) < 0) { return; }
            if (group && group.__sxDone !== pick.round) { group.__sxDone = pick.round; pick.list.appendChild(el('div', 'sx-choice__group', group.label)); }
            var item = el('button', 'sx-choice__item' + (option.selected ? ' is-on' : '') + (option.value === '' ? ' is-empty' : ''), option.textContent.trim() || '—');
            item.type = 'button';
            item.setAttribute('role', 'option');
            item.setAttribute('aria-selected', option.selected ? 'true' : 'false');
            if (option.disabled) { item.disabled = true; }
            item.__sxOption = option;
            pick.list.appendChild(item);
            shown++;
        };
        pick.round = (pick.round || 0) + 1;
        Array.prototype.forEach.call(pick.select.children, function (child) {
            if (child.tagName === 'OPTGROUP') { Array.prototype.forEach.call(child.children, function (option) { add(option, child); }); } else if (child.tagName === 'OPTION') { add(child, null); }
        });
        if (!shown) { pick.list.appendChild(el('div', 'sx-choice__none', T.pick_none || '')); }
        pick.active = -1;
    }
    function labelPick(pick) {
        var option = pick.select.options[pick.select.selectedIndex];
        var text = option ? option.textContent.trim() : '';
        pick.text.textContent = text || '—';
        pick.text.classList.toggle('is-empty', !option || option.value === '');
        pick.button.disabled = pick.select.disabled;
        pick.value = pick.select.value;
        pick.count = pick.select.options.length;
    }
    function choosePick(pick, option) {
        if (!option || option.disabled) { return; }
        var changed = pick.select.value !== option.value || !option.selected;
        pick.select.value = option.value;
        option.selected = true;
        labelPick(pick);
        closePick();
        pick.button.focus();
        if (changed) {
            pick.select.dispatchEvent(new Event('input', { bubbles: true }));
            pick.select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
    function movePick(pick, step) {
        var items = $$('.sx-choice__item:not([disabled])', pick.list);
        if (!items.length) { return; }
        pick.active = (pick.active + step + items.length) % items.length;
        items.forEach(function (item, index) { item.classList.toggle('is-active', index === pick.active); });
        items[pick.active].scrollIntoView({ block: 'nearest' });
    }
    function showPick(pick) {
        if (pick.select.disabled) { return; }
        closePick();
        openPick = pick;
        pick.search.value = '';
        fillPick(pick, '');
        pick.panel.hidden = false;
        pick.wrap.classList.add('is-open');
        pick.button.setAttribute('aria-expanded', 'true');
        placePick(pick);
        var on = $('.sx-choice__item.is-on', pick.list);
        if (on) { on.scrollIntoView({ block: 'nearest' }); }
        if (pick.select.options.length > 7 || window.innerWidth > 700) { pick.search.focus(); }
    }
    function makePick(select) {
        if (!wantsPick(select)) { return; }
        var pick = { select: select };
        var wrap = pick.wrap = el('div', 'sx-choice');
        var button = pick.button = el('button', 'sx-choice__button');
        button.type = 'button';
        button.setAttribute('aria-haspopup', 'listbox');
        button.setAttribute('aria-expanded', 'false');
        var label = select.id ? $('label[for="' + select.id.replace(/"/g, '') + '"]') : null;
        var group = select.closest('.form-group, .ag-field, .mb-3');
        label = label || (group ? $('label', group) : null);
        button.setAttribute('aria-label', ((label ? label.textContent.trim() + ' — ' : '') + (T.pick_search || '')).slice(0, 120));
        pick.text = el('span', 'sx-choice__text');
        button.appendChild(pick.text);
        button.insertAdjacentHTML('beforeend', icon('<path d="m6 9 6 6 6-6"/>', 16));
        var panel = pick.panel = el('div', 'sx-choice__panel');
        panel.hidden = true;
        var searchBox = el('div', 'sx-choice__search');
        searchBox.innerHTML = icon(ICON_SEARCH, 16);
        var search = pick.search = el('input');
        search.type = 'search';
        search.autocomplete = 'off';
        search.placeholder = T.pick_search || '';
        search.setAttribute('aria-label', T.pick_search || '');
        searchBox.appendChild(search);
        pick.list = el('div', 'sx-choice__list');
        pick.list.setAttribute('role', 'listbox');
        panel.appendChild(searchBox);
        panel.appendChild(pick.list);
        if (select.style.maxWidth) { wrap.style.maxWidth = select.style.maxWidth; }
        if (select.style.width) { wrap.style.width = select.style.width; }
        if (select.style.flex) { wrap.style.flex = select.style.flex; }
        select.parentNode.insertBefore(wrap, select);
        wrap.appendChild(select);
        wrap.appendChild(button);
        wrap.appendChild(panel);
        select.classList.add('sx-choice__native');
        select.__sxPick = pick;
        picks.push(pick);
        labelPick(pick);

        button.addEventListener('click', function () { if (openPick === pick) { closePick(); } else { showPick(pick); } });
        button.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') { event.preventDefault(); showPick(pick); }
        });
        select.addEventListener('focus', function () { button.focus(); });
        select.addEventListener('change', function () { labelPick(pick); });
        search.addEventListener('input', function () { fillPick(pick, search.value); });
        panel.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowDown') { event.preventDefault(); movePick(pick, 1); }
            else if (event.key === 'ArrowUp') { event.preventDefault(); movePick(pick, -1); }
            else if (event.key === 'Enter') {
                event.preventDefault();
                var items = $$('.sx-choice__item:not([disabled])', pick.list);
                var item = items[pick.active] || (items.length === 1 ? items[0] : null) || (search.value ? items[0] : null);
                if (item) { choosePick(pick, item.__sxOption); }
            } else if (event.key === 'Escape') { event.stopPropagation(); closePick(); button.focus(); }
            else if (event.key === 'Tab') { closePick(); }
        });
        pick.list.addEventListener('click', function (event) {
            var item = event.target.closest('.sx-choice__item');
            if (item) { choosePick(pick, item.__sxOption); }
        });
        if (window.MutationObserver) {
            pick.observer = new MutationObserver(function () { labelPick(pick); if (openPick === pick) { fillPick(pick, search.value); } });
            pick.observer.observe(select, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'selected', 'label'] });
        }
        var form = select.form;
        if (form) { form.addEventListener('reset', function () { setTimeout(function () { labelPick(pick); }, 0); }); }
    }
    function choiceLists() {
        hookSelect2();
        if (T.list_search) { $$('.search-set input, input#search', page || doc.body).forEach(function (field) { if (/^search\.{0,3}$/i.test((field.placeholder || '').trim())) { field.placeholder = T.list_search; } }); }
        if (select2On()) { $$('select.select2-hidden-accessible').forEach(searchInSelect2); }
        $$('select', page || doc.body).forEach(function (select) { if (!select.__sxPick) { makePick(select); } });
        $$('.modal select').forEach(function (select) { if (!select.__sxPick && !(page && page.contains(select))) { makePick(select); } });
    }
    doc.addEventListener('mousedown', function (event) { if (openPick && !openPick.wrap.contains(event.target)) { closePick(); } });
    doc.addEventListener('touchstart', function (event) { if (openPick && !openPick.wrap.contains(event.target)) { closePick(); } }, { passive: true });
    window.addEventListener('resize', function () { if (openPick) { placePick(openPick); } });
    window.addEventListener('scroll', function (event) { if (openPick && !(event.target && openPick.panel.contains(event.target))) { placePick(openPick); } }, true);
    setInterval(function () {
        if (doc.hidden) { return; }
        picks.forEach(function (pick) {
            if (!doc.body.contains(pick.select)) { return; }
            if (pick.select.classList.contains('select2-hidden-accessible')) { dropPick(pick.select); return; }
            if (pick.value !== pick.select.value || pick.count !== pick.select.options.length || pick.button.disabled !== pick.select.disabled) { labelPick(pick); }
        });
        picks = picks.filter(function (pick) { return doc.body.contains(pick.select); });
    }, 600);
    doc.addEventListener('shown.bs.modal', function () { setTimeout(choiceLists, 30); setTimeout(markRequired, 30); });

    function modalsLetGo() { $$('.modal').forEach(function (modal) { if (!modal.hasAttribute('data-bs-focus')) { modal.setAttribute('data-bs-focus', 'false'); } }); }
    modalsLetGo();
    doc.addEventListener('show.bs.modal', function (event) {
        modalsLetGo();
        try {
            var B = window.bootstrap;
            var instance = B && B.Modal && B.Modal.getInstance ? B.Modal.getInstance(event.target) : null;
            if (instance && instance._config) { instance._config.focus = false; }
        } catch (e) { }
    }, true);

    var SKIP = 'input[type=hidden], input[type=submit], input[type=button], input[type=reset], input[type=image]';
    function fieldBox(control) {
        return control.closest('.form-group, .input-blocks, .sx-field, .mb-3, .mb-2, .mb-4, [class*="col-"], td') || control.parentElement;
    }
    function titleOf(control) {
        var label = null;
        var group = control.type === 'radio' || control.type === 'checkbox';
        if (control.id && !group) {
            try { label = doc.querySelector('label[for="' + (window.CSS && CSS.escape ? CSS.escape(control.id) : control.id) + '"]'); } catch (e) { label = null; }
        }
        if (!label && !group) { label = control.closest('label'); }
        if (!label) {
            var box = fieldBox(control);
            if (box) { label = $$('label, .form-label, h6, strong', box).filter(function (node) { return !node.contains(control) && !node.querySelector('input, select, textarea'); })[0] || null; }
        }
        return label;
    }
    function markRequired(root) {
        $$('input[required], select[required], textarea[required]', root && root.nodeType ? root : doc).forEach(function (control) {
            if (control.matches(SKIP) || control.__sxReq) { return; }
            control.__sxReq = true;
            var label = titleOf(control);
            if (!label || label.querySelector('.sx-req, .manitory, .text-danger')) { return; }
            var walker = doc.createTreeWalker(label, NodeFilter.SHOW_TEXT, null, false);
            var node;
            while ((node = walker.nextNode())) {
                var at = node.nodeValue.lastIndexOf('*');
                if (at > -1) {
                    var rest = node.splitText(at);
                    rest.nodeValue = rest.nodeValue.slice(1);
                    var star = el('span', 'sx-req', '*');
                    star.setAttribute('aria-hidden', 'true');
                    rest.parentNode.insertBefore(star, rest);
                    return;
                }
            }
            var mark = el('span', 'sx-req', '*');
            mark.setAttribute('aria-hidden', 'true');
            label.appendChild(doc.createTextNode(' '));
            label.appendChild(mark);
        });
    }
    function shownPart(control) {
        var next = control.nextElementSibling;
        if (next && next.classList && next.classList.contains('select2')) { return next; }
        if (control.__sxPick && control.__sxPick.wrap) { return control.__sxPick.wrap; }
        return control;
    }
    function flagField(control) {
        control.classList.add('sx-invalid');
        shownPart(control).classList.add('sx-invalid');
        var box = fieldBox(control);
        if (!box) { return; }
        var message = control.validity && control.validity.valueMissing ? (T.required_field || 'This field is required') : (control.validationMessage || T.required_field || '');
        var note = null;
        Array.prototype.forEach.call(box.children, function (child) { if (child.classList && child.classList.contains('sx-req-msg') && child.__sxFor === control) { note = child; } });
        if (!note) { note = el('div', 'sx-req-msg'); note.__sxFor = control; note.setAttribute('role', 'alert'); box.appendChild(note); }
        note.textContent = message;
    }
    function unflagField(control) {
        if (!control || !control.classList || !control.classList.contains('sx-invalid')) { return; }
        if (control.checkValidity && !control.checkValidity()) { return; }
        control.classList.remove('sx-invalid');
        shownPart(control).classList.remove('sx-invalid');
        var box = fieldBox(control);
        if (box) { Array.prototype.slice.call(box.children).forEach(function (child) { if (child.__sxFor === control) { child.parentNode.removeChild(child); } }); }
    }
    var toastTimer = null;
    function shellToast(text) {
        var box = $('#sx-shell-toast');
        if (!box) {
            box = el('div');
            box.id = 'sx-shell-toast';
            box.setAttribute('role', 'alert');
            doc.body.appendChild(box);
        }
        box.textContent = text;
        box.style.display = 'block';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { box.style.display = 'none'; }, 5000);
    }
    function revealField(control) {
        var pane = control.closest('.tab-pane');
        if (pane && !pane.classList.contains('active') && pane.id) {
            var trigger = $('[data-bs-toggle="tab"][href="#' + pane.id + '"], [data-bs-toggle="tab"][data-bs-target="#' + pane.id + '"], [data-bs-toggle="pill"][href="#' + pane.id + '"], [data-bs-toggle="pill"][data-bs-target="#' + pane.id + '"]');
            if (trigger) { trigger.click(); }
        }
        var closed = control.closest('.collapse:not(.show)');
        if (closed && window.bootstrap && window.bootstrap.Collapse) { try { window.bootstrap.Collapse.getOrCreateInstance(closed).show(); } catch (e) { closed.classList.add('show'); } }
        setTimeout(function () {
            var target = shownPart(control);
            var seen = !!(target.offsetParent || target.getClientRects().length);
            if (seen) {
                target.scrollIntoView({ block: 'center', behavior: 'smooth' });
                if (target === control && control.focus) { try { control.focus({ preventScroll: true }); } catch (e) { } }
            }
            var label = titleOf(control);
            var name = label ? label.textContent.replace(/\*/g, '').replace(/\s+/g, ' ').trim() : '';
            shellToast((T.required_save || 'Fill the required fields marked in red, then save.') + (name && !seen ? ' — ' + name : ''));
        }, 120);
    }
    var firstBad = null;
    doc.addEventListener('invalid', function (event) {
        var control = event.target;
        if (!control || !control.closest || control.matches(SKIP)) { return; }
        flagField(control);
        if (!firstBad) {
            firstBad = control;
            setTimeout(function () { var first = firstBad; firstBad = null; if (first) { revealField(first); } }, 0);
        }
    }, true);
    doc.addEventListener('input', function (event) { unflagField(event.target); }, true);
    doc.addEventListener('change', function (event) { unflagField(event.target); }, true);
    if (window.jQuery) { window.jQuery(doc).on('change select2:select', 'select', function () { unflagField(this); }); }

    function ready() {
        tidyTables();
        stackTables();
        listSearch();
        pictures();
        choiceLists();
        modalsLetGo();
        markRequired();
    }
    if (doc.readyState === 'complete') { setTimeout(ready, 0); } else { window.addEventListener('load', function () { setTimeout(ready, 0); }); }
    doc.addEventListener('shown.bs.tab', function () { setTimeout(ready, 30); });
    cfg.refresh = ready;
    window.SharyShell = cfg;
})();
(function () {
    'use strict';
    var doc = document;
    var BUSY = 'sx-busy';
    var CONTROL = 'button, .btn, .ag-btn, [role="button"], input[type="submit"], input[type="button"]';
    var LEAVE_WAIT = 10000;
    var REQUEST_WAIT = 60000;

    doc.addEventListener('touchstart', function () {}, { passive: true });

    var bar = null;
    var barTimer = 0;
    var barSince = 0;
    function loading(on) {
        if (!bar) {
            if (!on || !doc.body) { return; }
            bar = doc.createElement('div');
            bar.className = 'sx-loadbar';
            bar.setAttribute('aria-hidden', 'true');
            doc.body.appendChild(bar);
        }
        clearTimeout(barTimer);
        bar.classList.toggle('is-on', on);
        if (on) {
            barSince = Date.now();
            barTimer = setTimeout(function () { loading(false); }, LEAVE_WAIT);
        }
    }

    function ownBusy(control) {
        return control.disabled || control.getAttribute('aria-busy') === 'true' || control.matches('[data-state="busy"], .is-busy, .is-loading');
    }
    function busy(control, on) {
        var count = Math.max(0, (control.__sxBusy || 0) + (on ? 1 : -1));
        control.__sxBusy = count;
        if (count && !control.classList.contains(BUSY)) {
            if (window.getComputedStyle(control).position === 'static') {
                control.__sxPosition = control.style.position;
                control.style.position = 'relative';
            }
            control.classList.add(BUSY);
            control.setAttribute('aria-busy', 'true');
        } else if (!count && control.classList.contains(BUSY)) {
            control.classList.remove(BUSY);
            control.removeAttribute('aria-busy');
            if (control.__sxPosition !== undefined) {
                control.style.position = control.__sxPosition;
                delete control.__sxPosition;
            }
        }
    }
    function leaving(control) {
        if (!control || ownBusy(control)) { return; }
        busy(control, true);
        setTimeout(function () { busy(control, false); }, LEAVE_WAIT);
    }

    var pressed = null;
    var pressedAt = 0;
    var sameTask = false;
    doc.addEventListener('click', function (event) {
        var control = event.target && event.target.closest ? event.target.closest(CONTROL) : null;
        if (!control || control.disabled) { return; }
        pressed = control;
        pressedAt = Date.now();
        sameTask = true;
        setTimeout(function () { sameTask = false; }, 0);
    }, true);
    function pressedNow() {
        if (!pressed || !pressed.isConnected) { return null; }
        return sameTask || Date.now() - pressedAt < 350 ? pressed : null;
    }
    function follow(control, finished) {
        var shown = false;
        var since = 0;
        var over = false;
        var start = setTimeout(function () {
            if (over || ownBusy(control)) { return; }
            shown = true;
            since = Date.now();
            busy(control, true);
        }, 0);
        function end() {
            if (over) { return; }
            over = true;
            clearTimeout(start);
            if (shown) { setTimeout(function () { busy(control, false); }, Math.max(0, 300 - (Date.now() - since))); }
        }
        finished.then(end, end);
        setTimeout(end, REQUEST_WAIT);
    }
    if (typeof window.fetch === 'function') {
        var fetchFirst = window.fetch;
        window.fetch = function () {
            var request = fetchFirst.apply(window, arguments);
            var control = pressedNow();
            if (control) { follow(control, request); }
            return request;
        };
    }
    if (window.XMLHttpRequest && XMLHttpRequest.prototype.send) {
        var sendFirst = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            var control = pressedNow();
            if (control) {
                var xhr = this;
                follow(control, new Promise(function (resolve) { xhr.addEventListener('loadend', resolve); }));
            }
            return sendFirst.apply(this, arguments);
        };
    }

    window.addEventListener('submit', function (event) {
        if (event.defaultPrevented) { return; }
        var form = event.target;
        var control = event.submitter || (form.querySelector ? form.querySelector('[type="submit"]') : null);
        var target = (control && control.getAttribute('formtarget')) || form.getAttribute('target') || '';
        if (target && target.toLowerCase() !== '_self') { return; }
        loading(true);
        leaving(control);
    });
    window.addEventListener('click', function (event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) { return; }
        var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
        if (!link || link.hasAttribute('download') || (link.target && link.target.toLowerCase() !== '_self')) { return; }
        var href = link.getAttribute('href') || '';
        if (href.charAt(0) === '#' || /^\s*javascript:/i.test(href) || link.origin !== window.location.origin || !/^https?:$/.test(link.protocol)) { return; }
        if (link.pathname === window.location.pathname && link.search === window.location.search && link.hash) { return; }
        if (/(export|download|\.(pdf|xlsx?|csv|zip|docx?))$/i.test(link.pathname)) { return; }
        loading(true);
        if (link.matches('.btn, .ag-btn')) { leaving(link); }
    });
    ['pointerdown', 'keydown'].forEach(function (type) {
        doc.addEventListener(type, function () { if (bar && bar.classList.contains('is-on') && Date.now() - barSince > 1000) { loading(false); } }, true);
    });
    window.addEventListener('pageshow', function (event) {
        if (!event.persisted) { return; }
        loading(false);
        Array.prototype.forEach.call(doc.querySelectorAll('.' + BUSY), function (control) {
            control.__sxBusy = 1;
            busy(control, false);
        });
    });
})();
