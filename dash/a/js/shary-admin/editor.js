/*
 | Shary dashboard — writing tools for EVERY rich-text box (CKEditor 4) of the dashboard: articles, projects, units, areas, developers …
 |
 | Adds to the editor toolbar:
 |   زرار تواصل   inserts a call-to-action block in the middle of the text ([shary-cta], form, channels, project / area card)
 |   لينك داخلي   search projects / areas / developers / articles / search pages and link the selected words to one of them
 |   معاينة       shows the text exactly as the website prints it (desktop / mobile)
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

    // ------------------------------------------------------------------ hook CKEditor
    function setup(CK) {
        if (!CK || CK.__sharyTools || !CK.plugins || !CK.plugins.add || !CK.on) { return false; }
        CK.__sharyTools = true;

        // text size: the "font" plugin is not part of the standard build — load it from the same CDN version
        var hasFont = false;
        try {
            if (CK.plugins.addExternal && CK.version) {
                CK.plugins.addExternal('font', 'https://cdn.ckeditor.com/' + CK.version + '/full-all/plugins/font/', 'plugin.js');
                CK.plugins.addExternal('justify', 'https://cdn.ckeditor.com/' + CK.version + '/full-all/plugins/justify/', 'plugin.js');
                hasFont = true;
            }
        } catch (error) { hasFont = false; }

        CK.plugins.add('sharytools', {
            init: function (editor) {
                editor.addCommand('sharyCta', { exec: function (target) { openCta(target); } });
                editor.addCommand('sharyLink', { exec: function (target) { openLink(target); } });
                editor.addCommand('sharyPreview', { modes: { wysiwyg: 1, source: 1 }, readOnly: 1, exec: function (target) { openPreview(target); } });
                if (editor.ui && editor.ui.addButton) {
                    editor.ui.addButton('SharyCta', { label: L.cta || 'CTA', command: 'sharyCta', toolbar: 'shary,10' });
                    editor.ui.addButton('SharyLink', { label: L.link || 'Link', command: 'sharyLink', toolbar: 'shary,20' });
                    editor.ui.addButton('SharyPreview', { label: L.preview || 'Preview', command: 'sharyPreview', toolbar: 'shary,30' });
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
                add('extraAllowedContent', 'p(shary-shortcode);span{font-size,color};p h2 h3 h4{text-align};a[!href,target,rel,title];img[!src,alt,width,height]{width,height,float};table tr td th thead tbody[*]{*}', ';');
                add('removeButtons', 'Font', ',');
                var group = { name: 'shary', items: ['SharyCta', 'SharyLink', 'SharyPreview'] };
                if (Object.prototype.toString.call(config.toolbar) === '[object Array]') {
                    config.toolbar = config.toolbar.concat([hasFont ? { name: 'sharysize', items: ['FontSize', 'JustifyRight', 'JustifyCenter', 'JustifyLeft'] } : null, group].filter(Boolean));
                } else if (Object.prototype.toString.call(config.toolbarGroups) === '[object Array]') {
                    config.toolbarGroups = config.toolbarGroups.concat([{ name: 'shary' }]);
                } else {
                    config.toolbarGroups = [
                        { name: 'clipboard', groups: ['clipboard', 'undo'] }, { name: 'links' }, { name: 'insert' }, { name: 'tools' }, { name: 'document', groups: ['mode'] }, '/',
                        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] }, { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align'] }, { name: 'styles' }, { name: 'shary' }
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
            var type = typeSelect ? typeSelect.value : (types || '');
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
            ['cta', 'form', 'channels', 'project', 'area'].map(function (kind, index) {
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

    // ------------------------------------------------------------------ 2) internal link
    function openLink(editor) {
        var lang = langOf(editor);
        var selection = editor.getSelection();
        var selected = selection ? (selection.getSelectedText() || '') : '';
        var box = open(L.link_title || 'Link',
            '<p class="shary-ed__hint">' + escapeHtml(selected ? (L.link_selected || '') + ' «' + selected.slice(0, 80) + '»' : (L.link_none || '')) + '</p>' +
            '<div class="shary-ed__bar"><select class="form-control" data-type><option value="">' + escapeHtml(L.all_types || 'All') + '</option>' + typeOptions() + '</select>' +
            '<input type="text" class="form-control" data-q placeholder="' + escapeHtml(L.search_ph || '') + '"></div><div class="shary-ed__results" data-results></div>');
        search(box, lang, '', function (item) {
            editor.focus();
            editor.insertHtml('<a href="' + escapeHtml(item.url) + '">' + escapeHtml(selected || item.label) + '</a>');
            close();
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
