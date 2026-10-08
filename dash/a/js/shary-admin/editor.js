/*
 | Shary dashboard — writing tools for EVERY rich-text box (CKEditor 4) of the dashboard: articles, projects, units, areas, developers …
 |
 | Adds to the editor toolbar:
 |   زرار تواصل   inserts a call-to-action block in the middle of the text ([shary-cta], form, channels, project / area card)
 |   لينك داخلي   search projects / areas / developers / articles / search pages and link the selected words to one of them
 |   معاينة       shows the text exactly as the website prints it (desktop / mobile)
 | a row of the blocks the website's articles are made of (the same markup as the approved article design):
 |   كروت        a project card / an area card / "units of an area" links / "اقرأ كمان" (another article) — [shary-project] [shary-area] [shary-units] [shary-article]
 |   زرار لينك   a wide link button to any page of the site or any address (a.article-cta)
 |   لينك خارجي  the selected words link to another website (opens in a new tab)
 |   ملاحظة      the paragraph becomes a note box (p.article-note)
 |   أماكن       a "where to go" list: a title, the places (each with its link if any) and a line under it (figure.article-places)
 | and a row of plain-named writing buttons for a beginner (no icons to guess):
 |   عنوان رئيسي (h2) · عنوان فرعي (h3) · نص عادي · نقط · أرقام · نقط بسهم (ul.shary-arrows) · خط فاصل (hr) · مسافة (p.shary-space)
 |   and quick symbols: ،  ؟  —  •  ←
 | The editor library itself is served from the site (public/vendor/shary-editor — CKEditor 4.22.1 standard, open source) when
 | SharyEditorConfig.localEditor is set, so no screen depends on an outside CDN; the CDN line of the old screens then does nothing.
 | and gives the writer free hands: headings (H2 / H3 / H4), text size, tables, images (upload), alignment.
 |
 | Loaded on every dashboard page by resources/views/shary_admin/partials/editor-loader.blade.php (window.SharyEditorConfig = urls + labels).
 | It hooks CKEditor the moment the library is loaded, so the existing forms get the tools without being edited.
 */
(function () {
    'use strict';
    if (window.__sharyEditorTools) { return; }
    window.__sharyEditorTools = true;

    var CFG = window.SharyEditorConfig || {};
    var L = CFG.labels || {};
    var FONT_SIZES = '14/14px;16/16px;18/18px;20/20px;24/24px;28/28px;32/32px';
    // [button, command, label key, fallback label]
    var WRITE = [['SharyH2', 'sharyH2', 'w_h2', 'Heading'], ['SharyH3', 'sharyH3', 'w_h3', 'Sub-heading'], ['SharyP', 'sharyP', 'w_p', 'Text'], ['SharyBullets', 'sharyBullets', 'w_bullets', 'Bullets'],
        ['SharyNumbers', 'sharyNumbers', 'w_numbers', 'Numbers'], ['SharyArrows', 'sharyArrows', 'w_arrows', 'Arrows'], ['SharyLine', 'sharyLine', 'w_line', 'Line'], ['SharySpace', 'sharySpace', 'w_space', 'Space']];
    var SYMBOLS = ['،', '؟', '—', '•', '←'];
    // the blocks of the website's articles: [button, command, label key, fallback label]
    var BLOCKS = [['SharyCards', 'sharyCards', 'b_cards', 'Cards'], ['SharyButton', 'sharyButton', 'b_button', 'Link button'], ['SharyExternal', 'sharyExternal', 'b_external', 'External link'],
        ['SharyNote', 'sharyNote', 'b_note', 'Note'], ['SharyPlaces', 'sharyPlaces', 'b_places', 'Places']];

    // ------------------------------------------------------------------ hook CKEditor
    function setup(CK) {
        if (!CK || CK.__sharyTools || !CK.plugins || !CK.plugins.add || !CK.on) { return false; }
        CK.__sharyTools = true;

        // Older list screens start an editor on every "description" box of every pop-up, all with the same name (desc_ar, desc_en …).
        // The editor names its parts after the box, so boxes sharing a name fight over the same parts and the later ones break.
        // Each such box gets its own id first — the name the form sends is not touched.
        try {
            var plainReplace = CK.replace, boxCount = 0;
            CK.replace = function (target, config) {
                try {
                    // a box that already has its editor (the screen asked twice): hand back the same editor instead of breaking
                    if (target && typeof target !== 'string' && target.tagName === 'TEXTAREA') {
                        for (var key in CK.instances) {
                            if (CK.instances[key] && CK.instances[key].element && CK.instances[key].element.$ === target) { return CK.instances[key]; }
                        }
                    }
                    // a box inside the edit pop-up of a table row (old list screens): the table moves the rows of its other pages out of the page,
                    // and an editor started there breaks (its pop-up then can't be written in). Such an editor starts when its pop-up opens.
                    if (target && typeof target !== 'string' && target.tagName === 'TEXTAREA' && !target.__sxLazy && target.closest) {
                        var rowModal = target.closest('.modal');
                        if (rowModal && rowModal.closest('table') && !rowModal.classList.contains('show')) {
                            target.__sxLazy = true;
                            var start = function () {
                                for (var key in CK.instances) {
                                    if (CK.instances[key] && CK.instances[key].element && CK.instances[key].element.$ === target) { return; }
                                }
                                CK.replace(target, config);
                            };
                            rowModal.addEventListener('show.bs.modal', start);
                            if (window.jQuery) { window.jQuery(rowModal).on('show.bs.modal', start); }
                            return null;
                        }
                    }
                    if (target && typeof target !== 'string' && target.tagName === 'TEXTAREA' && !target.id && target.name) {
                        var twins = document.getElementsByName(target.name);
                        if (twins.length > 1 || CK.instances[target.name]) {
                            target.id = 'shary_box_' + (++boxCount) + '_' + String(target.name).replace(/[^A-Za-z0-9_]+/g, '_');
                        }
                    }
                } catch (error) {}
                return plainReplace.call(CK, target, config);
            };
        } catch (error) {}

        // text size: the "font" plugin is not part of the standard build — load it from the same CDN version
        var hasFont = false;
        try {
            // which copy of the editor is really running? (an older screen may have loaded its own copy before this file)
            var base = String(CK.basePath || '');
            var localBase = String(CFG.localBase || '');
            if (localBase) { try { var probe = document.createElement('a'); probe.href = localBase; localBase = probe.href; } catch (error) {} }   // a full address, whatever form the page gave
            if (CFG.localEditor && localBase && base.indexOf(localBase) === 0) {
                hasFont = true;      // the local build carries "font" and "justify" in its own plugins folder
            } else if (localBase && CK.plugins.addExternal) {
                // another copy is running (a CDN "standard" build has no font / justify): take the two plugins from the site's own folder
                CK.plugins.addExternal('font', localBase + 'plugins/font/', 'plugin.js');
                CK.plugins.addExternal('justify', localBase + 'plugins/justify/', 'plugin.js');
                hasFont = true;
            } else if (CK.plugins.addExternal && CK.version) {
                CK.plugins.addExternal('font', 'https://cdn.ckeditor.com/' + CK.version + '/full-all/plugins/font/', 'plugin.js');
                CK.plugins.addExternal('justify', 'https://cdn.ckeditor.com/' + CK.version + '/full-all/plugins/justify/', 'plugin.js');
                hasFont = true;
            }
        } catch (error) { hasFont = false; }

        CK.plugins.add('sharytools', {
            init: function (editor) {
                editor.addCommand('sharyCta', { exec: function (target) { openCta(target); } });
                editor.addCommand('sharyLink', { exec: function (target) { openLink(target); } });
                editor.addCommand('sharyVideo', { exec: function (target) { openVideo(target); } });
                editor.addCommand('sharyPreview', { modes: { wysiwyg: 1, source: 1 }, readOnly: 1, exec: function (target) { openPreview(target); } });
                editor.addCommand('sharyCards', { exec: function (target) { openCards(target); } });
                editor.addCommand('sharyButton', { exec: function (target) { openButton(target); } });
                editor.addCommand('sharyExternal', { exec: function (target) { openExternal(target); } });
                editor.addCommand('sharyPlaces', { exec: function (target) { openPlaces(target); } });
                // plain-named writing buttons
                var snap = function (target, run) { target.focus(); target.fire('saveSnapshot'); run(); setTimeout(function () { target.fire('saveSnapshot'); }, 0); };
                var block = function (tag) {
                    return { exec: function (target) {
                        snap(target, function () {
                            var style = new CK.style({ element: tag });
                            var on = tag !== 'p' && style.checkActive(target.elementPath(), target);
                            target.applyStyle(on ? new CK.style({ element: 'p' }) : style);
                        });
                    } };
                };
                editor.addCommand('sharyH2', block('h2'));
                editor.addCommand('sharyH3', block('h3'));
                editor.addCommand('sharyP', block('p'));
                editor.addCommand('sharyBullets', { exec: function (target) { target.focus(); target.execCommand('bulletedlist'); } });
                editor.addCommand('sharyNumbers', { exec: function (target) { target.focus(); target.execCommand('numberedlist'); } });
                editor.addCommand('sharyArrows', { exec: function (target) {
                    snap(target, function () {
                        var path = target.elementPath();
                        var list = path && path.contains('ul');
                        if (list) { if (list.hasClass('shary-arrows')) { list.removeClass('shary-arrows'); } else { list.addClass('shary-arrows'); } return; }
                        target.execCommand('bulletedlist');
                        path = target.elementPath();
                        list = path && path.contains('ul');
                        if (list) { list.addClass('shary-arrows'); }
                    });
                } });
                // ملاحظة: the paragraph under the cursor becomes a note box (again = back to a plain paragraph)
                editor.addCommand('sharyNote', { exec: function (target) {
                    snap(target, function () {
                        var path = target.elementPath();
                        var current = path && path.block;
                        if (current && current.is && current.is('p') && !current.hasClass('shary-shortcode')) {
                            if (current.hasClass('article-note')) { current.removeClass('article-note'); } else { current.addClass('article-note'); }
                        } else {
                            target.insertHtml('<p class="article-note">' + escapeHtml(L.note_ph || '…') + '</p>');
                        }
                    });
                } });
                editor.addCommand('sharyLine', { exec: function (target) { target.focus(); if (target.getCommand('horizontalrule')) { target.execCommand('horizontalrule'); } else { target.insertHtml('<hr>'); } } });
                editor.addCommand('sharySpace', { exec: function (target) { target.focus(); target.insertHtml('<p class="shary-space">&nbsp;</p>'); } });
                SYMBOLS.forEach(function (symbol, index) {
                    editor.addCommand('sharySym' + index, { exec: function (target) { target.focus(); target.insertText(symbol); } });
                });
                if (editor.ui && editor.ui.addButton) {
                    WRITE.forEach(function (item, index) {
                        editor.ui.addButton(item[0], { label: L[item[2]] || item[3], command: item[1], toolbar: 'sharywrite,' + (index + 1) * 10 });
                    });
                    SYMBOLS.forEach(function (symbol, index) {
                        editor.ui.addButton('SharySym' + index, { label: symbol, title: (L.symbol || 'Insert') + ' ' + symbol, command: 'sharySym' + index, toolbar: 'sharysym,' + (index + 1) * 10 });
                    });
                    editor.ui.addButton('SharyCta', { label: L.cta || 'CTA', command: 'sharyCta', toolbar: 'shary,10' });
                    editor.ui.addButton('SharyVideo', { label: L.video || 'Video', command: 'sharyVideo', toolbar: 'shary,15' });
                    editor.ui.addButton('SharyLink', { label: L.link || 'Link', command: 'sharyLink', toolbar: 'shary,20' });
                    editor.ui.addButton('SharyPreview', { label: L.preview || 'Preview', command: 'sharyPreview', toolbar: 'shary,30' });
                    BLOCKS.forEach(function (item, index) {
                        editor.ui.addButton(item[0], { label: L[item[2]] || item[3], command: item[1], toolbar: 'sharyblocks,' + (index + 1) * 10 });
                    });
                }
            }
        });

        CK.on('instanceCreated', function (event) {
            var editor = event.editor;
            editor.on('configLoaded', function () {
                var config = editor.config;
                var add = function (key, value, separator) { config[key] = config[key] ? config[key] + separator + value : value; };
                add('extraPlugins', 'sharytools' + (hasFont ? ',font,justify' : ''), ',');
                // free writing: headings the page can style (the page title is the only H1), sizes, classes of the inserted blocks
                config.format_tags = 'p;h2;h3;h4';
                config.fontSize_sizes = FONT_SIZES;
                add('extraAllowedContent', 'ul(shary-arrows);p(shary-space);hr;p(shary-shortcode);span{font-size,color};p h2 h3 h4{text-align};a[!href,target,rel,title];img[!src,alt,width,height]{width,height,float};table tr td th thead tbody[*]{*}', ';');
                // the blocks of the article design: note box, wide link button, places list, live index values in tables
                add('extraAllowedContent', 'p(article-note);a(article-cta)[!href,target,rel];figure(article-places)[id];div(article-places__box,article-places__title,article-places__list);figcaption;span(article-index,article-change)[data-index,dir]', ';');
                add('removeButtons', 'Font', ',');
                var group = { name: 'shary', items: ['SharyCta', 'SharyVideo', 'SharyLink', 'SharyPreview'] };
                var blocks = { name: 'sharyblocks', items: BLOCKS.map(function (item) { return item[0]; }) };
                var write = { name: 'sharywrite', items: WRITE.map(function (item) { return item[0]; }) };
                var symbols = { name: 'sharysym', items: SYMBOLS.map(function (symbol, index) { return 'SharySym' + index; }) };
                if (Object.prototype.toString.call(config.toolbar) === '[object Array]') {
                    config.toolbar = [write, symbols, group, blocks, '/'].concat(config.toolbar, [hasFont ? { name: 'sharysize', items: ['FontSize', 'JustifyRight', 'JustifyCenter', 'JustifyLeft'] } : null].filter(Boolean));
                } else if (Object.prototype.toString.call(config.toolbarGroups) === '[object Array]') {
                    config.toolbarGroups = [{ name: 'sharywrite' }, { name: 'sharysym' }, { name: 'shary' }, { name: 'sharyblocks' }, '/'].concat(config.toolbarGroups);
                } else {
                    config.toolbarGroups = [
                        { name: 'sharywrite' }, { name: 'sharysym' }, { name: 'shary' }, { name: 'sharyblocks' }, '/',
                        { name: 'clipboard', groups: ['clipboard', 'undo'] }, { name: 'links' }, { name: 'insert' }, { name: 'tools' }, { name: 'document', groups: ['mode'] }, '/',
                        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] }, { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align'] }, { name: 'styles' }
                    ];
                }
                if (CFG.uploadUrl) {
                    config.filebrowserUploadUrl = CFG.uploadUrl;
                    config.filebrowserUploadMethod = 'form';
                }
                if (CFG.contentCss) {
                    config.contentsCss = [].concat(config.contentsCss || [CK.getUrl('contents.css')], [CFG.contentCss]);
                }
                if (!config.height || parseInt(config.height, 10) < 320) {
                    var area = editor.element && editor.element.$;
                    // long texts (articles, descriptions) get a tall box; small repeater boxes keep their size
                    if (area && !/shary-editor-lazy/.test(area.className || '') && !(area.getAttribute('data-height'))) { config.height = 420; }
                }
            });
        });

        return true;
    }

    // CKEditor is loaded by each page after this file: set up the moment window.CKEDITOR is assigned (before any CKEDITOR.replace runs)
    if (!setup(window.CKEDITOR)) {
        var current = window.CKEDITOR;
        try {
            Object.defineProperty(window, 'CKEDITOR', {
                configurable: true,
                enumerable: true,
                get: function () { return current; },
                set: function (value) {
                    current = value;
                    if (!setup(value)) { Promise.resolve().then(function () { setup(current); }); }   // runs right after ckeditor.js, before the next <script>
                }
            });
        } catch (error) {
            var timer = setInterval(function () { if (setup(window.CKEDITOR)) { clearInterval(timer); } }, 30);
            setTimeout(function () { clearInterval(timer); }, 30000);
        }
    }

    // ------------------------------------------------------------------ helpers
    function escapeHtml(value) {
        return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function attr(value) { return String(value == null ? '' : value).replace(/["\[\]]/g, "'").replace(/\s+/g, ' ').trim(); }

    /** ar | en — from the box itself (data-shary-lang, name ending _ar / _en / [ar]) or the dashboard language */
    function langOf(editor) {
        var area = editor.element && editor.element.$;
        var name = area ? (area.getAttribute('data-shary-lang') || area.name || area.id || '') : '';
        if (/(^|[_\[\-])ar(\]|$)/i.test(name) || name === 'ar') { return 'ar'; }
        if (/(^|[_\[\-])en(\]|$)/i.test(name) || name === 'en') { return 'en'; }
        return CFG.lang === 'en' ? 'en' : 'ar';
    }
    function kindOf(editor) {
        var area = editor.element && editor.element.$;
        return (area && area.getAttribute('data-shary-content')) || CFG.kind || 'article';
    }

    var modal = null;
    function open(title, bodyHtml, wide) {
        close();
        modal = document.createElement('div');
        modal.className = 'shary-ed' + (wide ? ' shary-ed--wide' : '');
        modal.innerHTML = '<div class="shary-ed__box" role="dialog" aria-modal="true"><div class="shary-ed__head"><strong></strong><button type="button" class="shary-ed__x" aria-label="close">&times;</button></div><div class="shary-ed__body"></div></div>';
        modal.querySelector('strong').textContent = title;
        modal.querySelector('.shary-ed__body').innerHTML = bodyHtml;
        modal.addEventListener('mousedown', function (event) { if (event.target === modal) { close(); } });
        modal.querySelector('.shary-ed__x').addEventListener('click', close);
        document.body.appendChild(modal);
        return modal;
    }
    function close() { if (modal && modal.parentNode) { modal.parentNode.removeChild(modal); } modal = null; }
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && modal) { close(); } });

    function request(url, options) {
        options = options || {};
        options.credentials = 'same-origin';
        options.headers = Object.assign({ 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': CFG.token || '' }, options.headers || {});
        return fetch(url, options);
    }

    /** live search list: input[data-q] → results in [data-results]; onPick(item) */
    function search(box, lang, types, onPick) {
        var input = box.querySelector('[data-q]');
        var list = box.querySelector('[data-results]');
        var typeSelect = box.querySelector('[data-type]');
        var timer = null, counter = 0;
        function run() {
            var mine = ++counter;
            var type = typeSelect ? typeSelect.value : (typeof types === 'function' ? types() : (types || ''));
            list.innerHTML = '<div class="shary-ed__hint">' + escapeHtml(L.searching || '…') + '</div>';
            request(CFG.linksUrl + '?lang=' + lang + '&type=' + encodeURIComponent(type) + '&q=' + encodeURIComponent(input.value.trim()))
                .then(function (response) { return response.json(); })
                .then(function (json) {
                    if (mine !== counter) { return; }
                    var items = (json && json.items) || [];
                    if (!items.length) { list.innerHTML = '<div class="shary-ed__hint">' + escapeHtml(L.nothing || '—') + '</div>'; return; }
                    list.innerHTML = '';
                    items.forEach(function (item) {
                        var row = document.createElement('button');
                        row.type = 'button';
                        row.className = 'shary-ed__row';
                        row.innerHTML = '<span class="shary-ed__tag">' + escapeHtml(item.type_label) + '</span><span class="shary-ed__name">' + escapeHtml(item.label) + '</span><small dir="ltr">' + escapeHtml(item.path) + '</small>';
                        row.addEventListener('click', function () { onPick(item); });
                        list.appendChild(row);
                    });
                })
                .catch(function () { if (mine === counter) { list.innerHTML = '<div class="shary-ed__hint">' + escapeHtml(L.failed || 'Error') + '</div>'; } });
        }
        input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(run, 220); });
        if (typeSelect) { typeSelect.addEventListener('change', run); }
        run();
        setTimeout(function () { input.focus(); }, 30);
        return run;
    }

    function typeOptions(only) {
        var types = CFG.types || {};
        return Object.keys(types).filter(function (key) { return !only || only.indexOf(key) > -1; })
            .map(function (key) { return '<option value="' + key + '">' + escapeHtml(types[key]) + '</option>'; }).join('');
    }

    // ------------------------------------------------------------------ 1) call-to-action block
    function openCta(editor) {
        var lang = langOf(editor);
        var box = open(L.cta_title || 'CTA',
            '<div class="shary-ed__kinds">' +
            ['cta', 'form', 'channels'].map(function (kind, index) {
                return '<label><input type="radio" name="shary_ed_kind" value="' + kind + '"' + (index === 0 ? ' checked' : '') + '> ' + escapeHtml(L['kind_' + kind] || kind) + '</label>';
            }).join('') + '</div>' +
            '<div data-pane="cta"><label class="shary-ed__label">' + escapeHtml(L.cta_buttons || '') + '</label><div class="shary-ed__checks">' +
            ['meeting', 'call', 'whatsapp'].map(function (key) { return '<label><input type="checkbox" value="' + key + '" checked> ' + escapeHtml(L['btn_' + key] || key) + '</label>'; }).join('') +
            '</div><label class="shary-ed__label">' + escapeHtml(L.cta_heading || '') + '</label><input type="text" class="form-control" data-title maxlength="140" dir="' + (lang === 'ar' ? 'rtl' : 'ltr') + '" placeholder="' + escapeHtml(lang === 'ar' ? (L.cta_ph_ar || '') : (L.cta_ph_en || '')) + '"></div>' +
            '<div data-pane="form" hidden><p class="shary-ed__hint">' + escapeHtml(L.form_hint || '') + '</p></div>' +
            '<div data-pane="channels" hidden><p class="shary-ed__hint">' + escapeHtml(L.channels_hint || '') + '</p></div>' +
            '<div data-pane="pick" hidden><input type="text" class="form-control" data-q placeholder="' + escapeHtml(L.search_ph || '') + '"><div class="shary-ed__results" data-results></div></div>' +
            '<div class="shary-ed__foot"><button type="button" class="btn btn-submit" data-insert>' + escapeHtml(L.insert || 'Insert') + '</button> <small class="text-muted">' + escapeHtml(L.cta_note || '') + '</small></div>');

        var picked = null;
        function kind() { return box.querySelector('input[name="shary_ed_kind"]:checked').value; }
        function show() {
            var value = kind();
            var pick = value === 'project' || value === 'area';
            box.querySelector('[data-pane="cta"]').hidden = value !== 'cta';
            box.querySelector('[data-pane="form"]').hidden = value !== 'form';
            box.querySelector('[data-pane="channels"]').hidden = value !== 'channels';
            box.querySelector('[data-pane="pick"]').hidden = !pick;
            box.querySelector('[data-insert]').hidden = pick;
            if (pick) {
                picked = null;
                search(box.querySelector('[data-pane="pick"]'), lang, value, function (item) { insert('[shary-' + value + ' slug="' + attr(item.slug) + '"]'); });
            }
        }
        function insert(code) {
            editor.focus();
            editor.insertHtml('<p class="shary-shortcode">' + escapeHtml(code) + '</p><p>&nbsp;</p>');
            close();
        }
        box.querySelectorAll('input[name="shary_ed_kind"]').forEach(function (radio) { radio.addEventListener('change', show); });
        box.querySelector('[data-insert]').addEventListener('click', function () {
            var value = kind();
            if (value === 'form') { insert('[shary-form]'); return; }
            if (value === 'channels') { insert('[shary-channels]'); return; }
            var buttons = Array.prototype.map.call(box.querySelectorAll('.shary-ed__checks input:checked'), function (input) { return input.value; });
            if (!buttons.length) { buttons = ['whatsapp', 'call', 'meeting']; }
            var title = attr(box.querySelector('[data-title]').value);
            var code = '[shary-cta' + (buttons.length < 3 ? ' buttons="' + buttons.join(',') + '"' : '') + (title ? ' title="' + title + '"' : '') + ']';
            insert(code);
        });
        show();
    }

    // ------------------------------------------------------------------ 1-b) a video by its link (YouTube / TikTok / Facebook / Instagram …): a card that opens the video where it is
    function openVideo(editor) {
        var lang = langOf(editor);
        var box = open(L.video_title || 'Video',
            '<p class="shary-ed__hint">' + escapeHtml(L.video_hint || '') + '</p>' +
            '<label class="shary-ed__label">' + escapeHtml(L.video_url || 'Link') + '</label><input type="url" class="form-control" data-url dir="ltr" placeholder="https://www.youtube.com/watch?v=…" maxlength="500">' +
            '<label class="shary-ed__label" style="margin-top:10px">' + escapeHtml(L.video_caption || 'Title') + '</label><input type="text" class="form-control" data-title maxlength="140" dir="' + (lang === 'ar' ? 'rtl' : 'ltr') + '">' +
            '<p class="shary-ed__hint" data-error hidden style="color:#b42318"></p>' +
            '<div class="shary-ed__foot"><button type="button" class="btn btn-submit" data-insert>' + escapeHtml(L.insert || 'Insert') + '</button></div>');
        var input = box.querySelector('[data-url]');
        setTimeout(function () { input.focus(); }, 30);
        box.querySelector('[data-insert]').addEventListener('click', function () {
            var url = input.value.trim();
            var error = box.querySelector('[data-error]');
            if (!/^https?:\/\/[^\s"\[\]]+$/i.test(url)) { error.textContent = L.video_bad || 'Write the full link (https://…)'; error.hidden = false; input.focus(); return; }
            var title = attr(box.querySelector('[data-title]').value);
            editor.focus();
            editor.insertHtml('<p class="shary-shortcode">' + escapeHtml('[shary-video url="' + attr(url) + '"' + (title ? ' title="' + title + '"' : '') + ']') + '</p><p>&nbsp;</p>');
            close();
        });
    }

    // ------------------------------------------------------------------ 2) internal link
    function openLink(editor) {
        var lang = langOf(editor);
        var selection = editor.getSelection();
        var selected = selection ? (selection.getSelectedText() || '') : '';
        var box = open(L.link_title || 'Link',
            '<p class="shary-ed__hint">' + escapeHtml(selected ? (L.link_selected || '') + ' «' + selected.slice(0, 80) + '»' : (L.link_none || '')) + '</p>' +
            '<div class="shary-ed__bar"><select class="form-control" data-type data-sx-pick="off"><option value="">' + escapeHtml(L.all_types || 'All') + '</option>' + typeOptions() + '</select>' +
            '<input type="text" class="form-control" data-q placeholder="' + escapeHtml(L.search_ph || '') + '"></div><div class="shary-ed__results" data-results></div>');
        search(box, lang, '', function (item) {
            editor.focus();
            editor.insertHtml('<a href="' + escapeHtml(item.url) + '">' + escapeHtml(selected || item.label) + '</a>');
            close();
        });
    }

    // ------------------------------------------------------------------ 2-b) the blocks of the website's articles
    function dirOf(lang) { return lang === 'ar' ? 'rtl' : 'ltr'; }
    function selectedText(editor) { var selection = editor.getSelection(); return selection ? (selection.getSelectedText() || '') : ''; }
    function insertBlock(editor, html) { editor.focus(); editor.fire('saveSnapshot'); editor.insertHtml(html); editor.fire('saveSnapshot'); close(); }
    function goodUrl(url) { return /^(https?:\/\/[^\s"<>]+|\/[^\s"<>]*)$/i.test(url); }
    function external(url) {
        if (!/^https?:\/\//i.test(url)) { return false; }
        try { var host = new URL(url).hostname.replace(/^www\./, ''); return host !== location.hostname.replace(/^www\./, '') && host !== 'shary.eg'; } catch (error) { return true; }
    }

    // كروت: a project card · an area card · "units of an area" links · "اقرأ كمان" (another article) — the website draws them from the live data
    function openCards(editor) {
        var lang = langOf(editor);
        var kinds = ['project', 'area', 'units', 'article'];
        var box = open(L.cards_title || 'Cards',
            '<p class="shary-ed__hint">' + escapeHtml(L.cards_hint || '') + '</p>' +
            '<div class="shary-ed__kinds">' + kinds.map(function (kind, index) {
                return '<label><input type="radio" name="shary_ed_card" value="' + kind + '"' + (index === 0 ? ' checked' : '') + '> ' + escapeHtml(L['kind_' + kind] || kind) + '</label>';
            }).join('') + '</div>' +
            '<input type="text" class="form-control" data-q placeholder="' + escapeHtml(L.search_ph || '') + '"><div class="shary-ed__results" data-results></div>');
        function kind() { return box.querySelector('input[name="shary_ed_card"]:checked').value; }
        var source = { project: 'project', area: 'area', units: 'area', article: 'blog' };
        var run = search(box, lang, function () { return source[kind()]; }, function (item) {
            var value = kind();
            var code = value === 'units' ? '[shary-units area="' + attr(item.slug) + '"]' : '[shary-' + value + ' slug="' + attr(item.slug) + '"]';
            insertBlock(editor, '<p class="shary-shortcode">' + escapeHtml(code) + '</p><p>&nbsp;</p>');
        });
        box.querySelectorAll('input[name="shary_ed_card"]').forEach(function (radio) { radio.addEventListener('change', function () { run(); }); });
    }

    // زرار لينك: a wide button to a page of the site (searched) or to any address
    function openButton(editor) {
        var lang = langOf(editor);
        var box = open(L.button_title || 'Link button',
            '<p class="shary-ed__hint">' + escapeHtml(L.button_hint || '') + '</p>' +
            '<label class="shary-ed__label">' + escapeHtml(L.button_text || '') + '</label><input type="text" class="form-control" data-text maxlength="160" dir="' + dirOf(lang) + '" value="' + escapeHtml(selectedText(editor)) + '">' +
            '<div class="shary-ed__bar" style="margin-top:12px"><select class="form-control" data-type data-sx-pick="off"><option value="">' + escapeHtml(L.all_types || 'All') + '</option>' + typeOptions() + '</select>' +
            '<input type="text" class="form-control" data-q placeholder="' + escapeHtml(L.search_ph || '') + '"></div><div class="shary-ed__results" data-results></div>' +
            '<label class="shary-ed__label" style="margin-top:12px">' + escapeHtml(L.button_url || '') + '</label><div class="shary-ed__bar"><input type="text" class="form-control" data-url dir="ltr" placeholder="https://… / /ar/…">' +
            '<button type="button" class="btn btn-submit" data-insert>' + escapeHtml(L.insert || 'Insert') + '</button></div><p class="shary-ed__hint" data-error hidden style="color:#b42318"></p>');
        function insert(url, label) {
            var text = box.querySelector('[data-text]').value.trim() || label || url;
            insertBlock(editor, '<p><a href="' + escapeHtml(url) + '" class="article-cta"' + (external(url) ? ' target="_blank" rel="noopener"' : '') + '>' + escapeHtml(text) + '</a></p><p>&nbsp;</p>');
        }
        search(box, lang, '', function (item) { insert(item.url, item.label); });
        // the first thing to write is the button's words (the search box takes the focus otherwise)
        var words = box.querySelector('[data-text]');
        if (!words.value) { setTimeout(function () { words.focus(); }, 60); }
        box.querySelector('[data-insert]').addEventListener('click', function () {
            var url = box.querySelector('[data-url]').value.trim();
            var error = box.querySelector('[data-error]');
            if (!goodUrl(url)) { error.textContent = L.bad_url || 'Write a full link'; error.hidden = false; return; }
            insert(url, '');
        });
    }

    // لينك خارجي: the selected words link to another website (a new tab)
    function openExternal(editor) {
        var lang = langOf(editor);
        var selected = selectedText(editor);
        var box = open(L.ext_title || 'External link',
            '<p class="shary-ed__hint">' + escapeHtml(L.ext_hint || '') + '</p>' +
            '<label class="shary-ed__label">' + escapeHtml(L.ext_url || 'Link') + '</label><input type="url" class="form-control" data-url dir="ltr" placeholder="https://" maxlength="500">' +
            '<label class="shary-ed__label" style="margin-top:10px">' + escapeHtml(L.ext_text || '') + '</label><input type="text" class="form-control" data-text maxlength="200" dir="' + dirOf(lang) + '" value="' + escapeHtml(selected) + '">' +
            '<p class="shary-ed__hint" data-error hidden style="color:#b42318"></p>' +
            '<div class="shary-ed__foot"><button type="button" class="btn btn-submit" data-insert>' + escapeHtml(L.insert || 'Insert') + '</button></div>');
        var input = box.querySelector('[data-url]');
        setTimeout(function () { input.focus(); }, 30);
        box.querySelector('[data-insert]').addEventListener('click', function () {
            var url = input.value.trim();
            var error = box.querySelector('[data-error]');
            if (!/^https?:\/\/[^\s"<>]+$/i.test(url)) { error.textContent = L.bad_url || 'Write the full link (https://…)'; error.hidden = false; input.focus(); return; }
            var text = box.querySelector('[data-text]').value.trim() || url;
            insertBlock(editor, '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener">' + escapeHtml(text) + '</a>');
        });
    }

    // أماكن: "where to go in …" — a title, the places (each with its link if any), a line under the list
    function openPlaces(editor) {
        var lang = langOf(editor);
        var box = open(L.places_title || 'Places',
            '<p class="shary-ed__hint">' + escapeHtml(L.places_hint || '') + '</p>' +
            '<label class="shary-ed__label">' + escapeHtml(L.places_heading || '') + '</label><input type="text" class="form-control" data-title maxlength="160" dir="' + dirOf(lang) + '">' +
            '<label class="shary-ed__label" style="margin-top:10px">' + escapeHtml(L.places_lines || '') + '</label><textarea class="form-control" data-lines rows="7" dir="' + dirOf(lang) + '"></textarea>' +
            '<label class="shary-ed__label" style="margin-top:10px">' + escapeHtml(L.places_caption || '') + '</label><input type="text" class="form-control" data-caption maxlength="200" dir="' + dirOf(lang) + '">' +
            '<p class="shary-ed__hint" data-error hidden style="color:#b42318"></p>' +
            '<div class="shary-ed__foot"><button type="button" class="btn btn-submit" data-insert>' + escapeHtml(L.insert || 'Insert') + '</button></div>');
        setTimeout(function () { box.querySelector('[data-title]').focus(); }, 30);
        box.querySelector('[data-insert]').addEventListener('click', function () {
            var lines = box.querySelector('[data-lines]').value.split(/\n/).map(function (line) { return line.trim(); }).filter(Boolean);
            var error = box.querySelector('[data-error]');
            if (!lines.length) { error.textContent = L.places_none || ''; error.hidden = false; return; }
            var items = lines.map(function (line) {
                var parts = line.split('|');
                var name = parts[0].trim();
                var url = (parts.slice(1).join('|') || '').trim();
                return url && goodUrl(url) ? '<a href="' + escapeHtml(url) + '"' + (external(url) ? ' target="_blank" rel="noopener"' : '') + '>' + escapeHtml(name) + '</a>' : '<span>' + escapeHtml(name) + '</span>';
            }).join('');
            var title = box.querySelector('[data-title]').value.trim();
            var caption = box.querySelector('[data-caption]').value.trim();
            insertBlock(editor, '<figure class="article-places"><div class="article-places__box">' + (title ? '<div class="article-places__title">' + escapeHtml(title) + '</div>' : '') +
                '<div class="article-places__list">' + items + '</div></div>' + (caption ? '<figcaption>' + escapeHtml(caption) + '</figcaption>' : '') + '</figure><p>&nbsp;</p>');
        });
    }

    // ------------------------------------------------------------------ 3) preview as the website shows it
    function openPreview(editor) {
        var box = open(L.preview_title || 'Preview',
            '<div class="shary-ed__bar"><button type="button" class="btn btn-sm btn-primary" data-width="100%">' + escapeHtml(L.desktop || 'Desktop') + '</button>' +
            '<button type="button" class="btn btn-sm btn-light" data-width="390px">' + escapeHtml(L.mobile || 'Mobile') + '</button><small class="text-muted">' + escapeHtml(L.preview_note || '') + '</small></div>' +
            '<div class="shary-ed__frame"><iframe title="preview"></iframe></div>', true);
        var frame = box.querySelector('iframe');
        box.querySelectorAll('[data-width]').forEach(function (button) {
            button.addEventListener('click', function () {
                frame.style.width = button.getAttribute('data-width');
                box.querySelectorAll('[data-width]').forEach(function (other) { other.className = 'btn btn-sm ' + (other === button ? 'btn-primary' : 'btn-light'); });
            });
        });
        var data = new FormData();
        data.append('_token', CFG.token || '');
        data.append('html', editor.getData());
        data.append('lang', langOf(editor));
        data.append('kind', kindOf(editor));
        request(CFG.previewUrl, { method: 'POST', body: data, headers: { 'Accept': 'text/html' } })
            .then(function (response) { return response.text(); })
            .then(function (html) { frame.srcdoc = html; })
            .catch(function () { frame.srcdoc = '<p style="font-family:sans-serif;padding:24px">' + escapeHtml(L.failed || 'Error') + '</p>'; });
    }
})();
