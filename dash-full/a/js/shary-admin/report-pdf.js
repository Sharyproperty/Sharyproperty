(function () {
    'use strict';

    var WIDTH = 860;
    var SCALE = 2;
    var PAGE = [595.28, 841.89];
    var MARGIN = 24;
    var FOOT = 34;
    var made = {};
    var fonts = null;

    var LABELS = {
        idle: 'شير PDF على واتساب',
        busy: 'بيجهّز الـ PDF…',
        ready: 'الـ PDF جاهز — دوس وابعته',
        again: 'ابعت الـ PDF تاني',
        saved: 'نزّل الـ PDF تاني',
        error: 'جرّب تاني'
    };
    var NOTES = {
        busy: 'بيرسم صفحات التقرير في ملف PDF — ثواني.',
        ready: 'دوس على الزرار الأخضر — هتفتح المشاركة، اختار واتساب والشات وابعت.',
        again: 'لو مبعتش، دوس تاني واختار واتساب.',
        saved: 'الملف اتنزل على جهازك ({name}) — افتح واتساب وابعته كمستند (اسحبه جوه الشات).',
        error: 'معرفناش نعمل الـ PDF على المتصفح ده — استخدم «احفظه PDF» وبعدين ابعت الملف من واتساب.'
    };

    function wait(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
    function each(list, fn) { Array.prototype.forEach.call(list, fn); }

    function openFrame(src) {
        return new Promise(function (resolve, reject) {
            var frame = document.createElement('iframe');
            frame.setAttribute('aria-hidden', 'true');
            frame.setAttribute('tabindex', '-1');
            frame.setAttribute('scrolling', 'no');
            frame.title = 'pdf';
            frame.style.cssText = 'position:fixed;top:0;left:-30000px;width:' + WIDTH + 'px;height:1400px;border:0;opacity:0;pointer-events:none;';
            var timer = setTimeout(function () { frame.remove(); reject(new Error('timeout')); }, 45000);
            frame.onload = function () {
                clearTimeout(timer);
                var doc = frame.contentDocument;
                if (!doc || !doc.querySelector('.pr-page')) { frame.remove(); reject(new Error('page')); return; }
                doc.documentElement.style.overflow = 'hidden';
                each(doc.querySelectorAll('details'), function (box) { box.open = true; });
                var ready = doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve();
                ready.then(function () { return wait(150); }).then(function () { resolve(frame); });
            };
            frame.src = src;
            document.body.appendChild(frame);
        });
    }

    function getText(url) {
        return fetch(url, { credentials: 'same-origin' }).then(function (response) {
            if (!response.ok) { throw new Error('css ' + response.status); }
            return response.text();
        });
    }

    function getDataUrl(url) {
        return fetch(url, { credentials: 'same-origin' }).then(function (response) {
            if (!response.ok) { throw new Error('file ' + response.status); }
            return response.blob();
        }).then(function (blob) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onload = function () { resolve(reader.result); };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        });
    }

    function inlineFonts(css) {
        var blocks = css.match(/@font-face\s*{[^}]*}/g) || [];
        var files = {};
        var order = [];
        blocks.forEach(function (block) {
            var src = /url\(\s*['"]?([^'")]+)['"]?\s*\)/.exec(block);
            if (!src) { return; }
            var family = (/font-family:\s*([^;]+);/.exec(block) || [])[1] || "'Cairo'";
            var style = (/font-style:\s*([^;]+);/.exec(block) || [])[1] || 'normal';
            var weights = /font-weight:\s*(\d+)(?:\s+(\d+))?/.exec(block) || [];
            var low = parseInt(weights[1] || '400', 10);
            var high = parseInt(weights[2] || weights[1] || '400', 10);
            var range = (/unicode-range:\s*([^;]+);/.exec(block) || [])[1] || '';
            var format = (/format\(\s*['"]?([^'")]+)/.exec(block) || [])[1] ||
                ({ woff2: 'woff2', woff: 'woff', ttf: 'truetype', otf: 'opentype' })[(/\.(\w+)(?:[?#].*)?$/.exec(src[1]) || [])[1]] || 'woff2';
            var key = src[1] + '|' + family + '|' + style;
            if (!files[key]) { files[key] = { url: src[1], family: family, style: style, range: range, format: format, low: low, high: high }; order.push(key); }
            files[key].low = Math.min(files[key].low, low);
            files[key].high = Math.max(files[key].high, high);
        });
        return Promise.all(order.map(function (key) {
            var face = files[key];
            return getDataUrl(face.url).then(function (data) {
                return '@font-face{font-family:' + face.family + ';font-style:' + face.style + ';font-weight:' + face.low + (face.high > face.low ? ' ' + face.high : '') +
                    ';src:url(' + data + ') format("' + face.format + '");' + (face.range ? 'unicode-range:' + face.range + ';' : '') + '}';
            }, function () { return ''; });
        })).then(function (rules) { return rules.join('\n'); });
    }

    function scope(css) {
        return css
            .replace(/@import[^;]+;/g, '')
            .replace(/url\(\s*(?!['"]?data:)[^)]*\)/g, 'url(data:,)')
            .replace(/(^|[\s,{}>+~(])(?:html|body|:root)(?=[\s.#:\[,{>+~)])/g, '$1.pdf-root');
    }

    function printRules(css) {
        var out = [];
        var start = /@media\s+print\s*{/g;
        var found;
        while ((found = start.exec(css))) {
            var depth = 1;
            var i = start.lastIndex;
            while (i < css.length && depth) { if (css[i] === '{') { depth++; } else if (css[i] === '}') { depth--; } i++; }
            out.push(css.slice(start.lastIndex, i - 1));
            start.lastIndex = i;
        }
        return out.join('\n').replace(/@page\s*{[^}]*}/g, '');
    }

    var FIT = '.pr-page { max-width: none !important; width: auto !important; min-width: 0 !important; margin: 0 !important; padding: 0 0 6px !important; }' +
        ' .ag-scroll { overflow: visible !important; } table { max-width: 100% !important; } th, td { overflow-wrap: anywhere; }';

    function styles(doc) {
        var jobs = [];
        each(doc.querySelectorAll('link[rel="stylesheet"], style'), function (node) {
            if (node.hasAttribute('data-pdf-style')) { return; }
            if (node.tagName === 'STYLE') { jobs.push(Promise.resolve({ css: node.textContent })); return; }
            var href = node.href || '';
            if (/fonts\.googleapis\.com/.test(href)) {
                if (fonts === null) {
                    fonts = getText(href).then(inlineFonts).catch(function () { return ''; });
                }
                jobs.push(fonts.then(function (css) { return { font: css }; }));
                return;
            }
            jobs.push(getText(href).then(function (css) { return { css: css }; }, function () { return { css: '' }; }));
        });
        return Promise.all(jobs).then(function (parts) {
            var css = [];
            var face = [];
            parts.forEach(function (part) { if (part.font) { face.push(part.font); } else if (part.css) { css.push(part.css); } });
            var raw = css.join('\n');
            var printed = printRules(raw) + '\n' + FIT;
            return { fonts: face.join('\n'), printed: printed, css: scope(raw) + '\n' + scope(printed) };
        });
    }

    function pictures(root) {
        var jobs = [];
        each(root.querySelectorAll('img'), function (img) {
            var src = img.currentSrc || img.src;
            if (!src || /^data:/.test(src)) { return; }
            jobs.push(getDataUrl(src).then(function (data) { img.setAttribute('src', data); img.removeAttribute('srcset'); }, function () { img.remove(); }));
        });
        return Promise.all(jobs).then(function () { return root; });
    }

    function pageCuts(root, limit) {
        var box = root.getBoundingClientRect();
        var total = Math.ceil(box.height);
        var atoms = [];
        var ends = [];
        each(root.querySelectorAll('*'), function (node) {
            var rect = node.getBoundingClientRect();
            if (!rect.height) { return; }
            var top = rect.top - box.top;
            var bottom = rect.bottom - box.top;
            ends.push(bottom);
            if (bottom - top < limit * 0.5) { atoms.push([top, bottom]); }
            if (/^H[1-5]$/.test(node.tagName) || node.classList.contains('ag-card__head')) { atoms.push([top, bottom + 90]); }
        });
        ends.sort(function (a, b) { return a - b; });
        var through = function (y) {
            for (var k = 0; k < atoms.length; k++) { if (atoms[k][0] < y - 0.5 && atoms[k][1] > y + 0.5) { return true; } }
            return false;
        };
        var cuts = [0];
        var at = 0;
        while (total - at > limit) {
            var best = 0;
            for (var k = ends.length - 1; k >= 0; k--) {
                var end = ends[k];
                if (end > at + limit) { continue; }
                if (end < at + limit * 0.4) { break; }
                if (!through(end)) { best = end; break; }
            }
            at = best || at + limit;
            cuts.push(at);
        }
        cuts.push(total);
        return cuts;
    }

    function escapeXml(text) { return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    function svgFor(job, top, slice) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="' + (job.width * SCALE) + '" height="' + (slice * SCALE) + '" viewBox="0 ' + top + ' ' + job.width + ' ' + slice + '">' +
            '<foreignObject x="0" y="0" width="' + job.width + '" height="' + job.height + '">' +
            '<div xmlns="http://www.w3.org/1999/xhtml" class="pdf-root ag ag-print" dir="rtl" lang="ar" style="width:' + job.width + 'px;min-height:0;background:#fff">' +
            '<style>' + escapeXml(job.style) + '</style>' + job.markup + '</div></foreignObject></svg>';
    }

    function picture(svg) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () { resolve(img); };
            img.onerror = function () { reject(new Error('svg')); };
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        }).then(function (img) {
            return img.decode ? img.decode().then(function () { return img; }, function () { return img; }) : img;
        });
    }

    function jpeg(canvas) {
        return new Promise(function (resolve, reject) {
            canvas.toBlob(function (blob) {
                if (!blob) { reject(new Error('jpeg')); return; }
                if (blob.arrayBuffer) { blob.arrayBuffer().then(function (buffer) { resolve(new Uint8Array(buffer)); }, reject); return; }
                var reader = new FileReader();
                reader.onload = function () { resolve(new Uint8Array(reader.result)); };
                reader.onerror = reject;
                reader.readAsArrayBuffer(blob);
            }, 'image/jpeg', 0.86);
        });
    }

    function footer(ctx, width, slice, page, pages) {
        var y = slice * SCALE;
        ctx.fillStyle = '#E6EAF0';
        ctx.fillRect(0, y + 6 * SCALE, width, SCALE);
        ctx.fillStyle = '#5A6780';
        ctx.font = '700 ' + (12 * SCALE) + 'px Cairo, Tahoma, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        try { ctx.direction = 'rtl'; } catch (e) { }
        ctx.fillText('صفحة ' + page + ' من ' + pages + ' — شاري', width / 2, y + 21 * SCALE);
    }

    function drawPages(job) {
        var pages = [];
        var count = job.cuts.length - 1;
        var chain = picture(svgFor(job, 0, Math.min(job.cuts[1], 300))).then(function (img) {
            var warm = document.createElement('canvas');
            warm.width = 8; warm.height = 8;
            warm.getContext('2d').drawImage(img, 0, 0, 8, 8);
            return wait(200);
        }, function () { return null; });
        job.cuts.slice(0, count).forEach(function (top, index) {
            chain = chain.then(function () {
                var slice = job.cuts[index + 1] - top;
                return picture(svgFor(job, top, slice)).then(function (img) {
                    var canvas = document.createElement('canvas');
                    canvas.width = Math.round(job.width * SCALE);
                    canvas.height = Math.round((slice + FOOT) * SCALE);
                    var ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, Math.round(slice * SCALE));
                    footer(ctx, canvas.width, slice, index + 1, count);
                    return jpeg(canvas).then(function (bytes) {
                        pages.push({ bytes: bytes, width: canvas.width, height: canvas.height });
                        canvas.width = 0; canvas.height = 0;
                    });
                });
            });
        });
        return chain.then(function () { return pages; });
    }

    function hexTitle(text) {
        var hex = 'FEFF';
        for (var i = 0; i < text.length; i++) { hex += ('000' + text.charCodeAt(i).toString(16)).slice(-4); }
        return '<' + hex.toUpperCase() + '>';
    }

    function writePdf(pages, title) {
        var encoder = new TextEncoder();
        var parts = [];
        var size = 0;
        var offsets = [];
        var add = function (chunk) { if (typeof chunk === 'string') { chunk = encoder.encode(chunk); } parts.push(chunk); size += chunk.length; };
        var object = function (number, body, stream) {
            offsets[number] = size;
            add(number + ' 0 obj\n' + body);
            if (stream) { add('\nstream\n'); add(stream); add('\nendstream'); }
            add('\nendobj\n');
        };
        var n = function (value) { return (Math.round(value * 100) / 100).toString(); };
        var now = new Date();
        var two = function (value) { return (value < 10 ? '0' : '') + value; };
        var stamp = 'D:' + now.getFullYear() + two(now.getMonth() + 1) + two(now.getDate()) + two(now.getHours()) + two(now.getMinutes()) + two(now.getSeconds());

        add('%PDF-1.4\n%âãÏÓ\n');
        var kids = pages.map(function (page, index) { return (4 + index * 3) + ' 0 R'; });
        object(1, '<< /Type /Catalog /Pages 2 0 R >>');
        object(2, '<< /Type /Pages /Kids [' + kids.join(' ') + '] /Count ' + pages.length + ' >>');
        object(3, '<< /Title ' + hexTitle(title || 'Shary') + ' /Producer (Shary dashboard) /Creator (Shary) /CreationDate (' + stamp + ') >>');
        pages.forEach(function (page, index) {
            var number = 4 + index * 3;
            var width = PAGE[0] - 2 * MARGIN;
            var height = width * page.height / page.width;
            var content = encoder.encode('q\n' + n(width) + ' 0 0 ' + n(height) + ' ' + n(MARGIN) + ' ' + n(PAGE[1] - MARGIN - height) + ' cm\n/P' + index + ' Do\nQ\n');
            object(number, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + PAGE[0] + ' ' + PAGE[1] + '] /Resources << /XObject << /P' + index + ' ' + (number + 2) + ' 0 R >> /ProcSet [/PDF /ImageC] >> /Contents ' + (number + 1) + ' 0 R >>');
            object(number + 1, '<< /Length ' + content.length + ' >>', content);
            object(number + 2, '<< /Type /XObject /Subtype /Image /Width ' + page.width + ' /Height ' + page.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + page.bytes.length + ' >>', page.bytes);
        });
        var total = 4 + pages.length * 3;
        var xref = size;
        var table = 'xref\n0 ' + total + '\n0000000000 65535 f \n';
        for (var k = 1; k < total; k++) { table += ('000000000' + offsets[k]).slice(-10) + ' 00000 n \n'; }
        add(table + 'trailer\n<< /Size ' + total + ' /Root 1 0 R /Info 3 0 R >>\nstartxref\n' + xref + '\n%%EOF\n');
        return new Blob(parts, { type: 'application/pdf' });
    }

    function build(src, title) {
        var frame = null;
        return openFrame(src).then(function (opened) {
            frame = opened;
            var doc = frame.contentDocument;
            return styles(doc).then(function (got) {
                var extra = '';
                each(doc.querySelectorAll('.no-print, script, noscript, [data-pdf-box]'), function (node) { node.remove(); });
                var look = doc.createElement('style');
                look.setAttribute('data-pdf-style', '1');
                look.textContent = got.printed;
                doc.head.appendChild(look);
                if (!got.fonts) {
                    extra = '.pdf-root, .pdf-root * { font-family: Tahoma, "Segoe UI", Arial, sans-serif !important; }';
                    var fix = doc.createElement('style');
                    fix.textContent = 'body, body * { font-family: Tahoma, "Segoe UI", Arial, sans-serif !important; }';
                    doc.head.appendChild(fix);
                }
                return wait(60).then(function () {
                    var root = doc.querySelector('.pr-page');
                    var width = doc.documentElement.clientWidth || WIDTH;
                    var ratio = (PAGE[0] - 2 * MARGIN) / width;
                    var limit = (PAGE[1] - 2 * MARGIN) / ratio - FOOT;
                    var cuts = pageCuts(root, limit);
                    var clone = root.cloneNode(true);
                    return pictures(clone).then(function () {
                        return {
                            width: width,
                            height: cuts[cuts.length - 1],
                            cuts: cuts,
                            style: got.fonts + '\n' + got.css + '\n' + extra,
                            markup: new XMLSerializer().serializeToString(clone)
                        };
                    });
                });
            });
        }).then(drawPages).then(function (pages) {
            if (!pages.length) { throw new Error('empty'); }
            return writePdf(pages, title);
        }).then(function (blob) {
            if (frame) { frame.remove(); }
            return blob;
        }, function (error) {
            if (frame) { frame.remove(); }
            throw error;
        });
    }

    function canShare(file) {
        try { return !!(navigator.share && navigator.canShare && navigator.canShare({ files: [file] })); } catch (e) { return false; }
    }

    function download(file) {
        var url = URL.createObjectURL(file);
        var link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        link.rel = 'noopener';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 120000);
    }

    function setState(button, state, file) {
        button.setAttribute('data-state', state);
        button.setAttribute('aria-busy', state === 'busy' ? 'true' : 'false');
        button.classList.toggle('is-ready', state === 'ready');
        var label = button.querySelector('[data-pdf-label]') || button;
        label.textContent = LABELS[state] || LABELS.idle;
        var box = button.closest('[data-pdf-box]');
        var note = box ? box.querySelector('[data-pdf-note]') : null;
        if (!note) { return; }
        var text = NOTES[state] || '';
        note.textContent = text.replace('{name}', file ? file.name : '');
        if (state === 'saved') {
            var wa = document.createElement('a');
            wa.href = 'https://wa.me/?text=' + encodeURIComponent((button.getAttribute('data-pdf-title') || '') + ' — ملف PDF');
            wa.target = '_blank';
            wa.rel = 'noopener';
            wa.className = 'b8';
            wa.textContent = ' افتح واتساب';
            note.appendChild(wa);
        }
        note.classList.toggle('hide', !text);
    }

    function deliver(button, file) {
        if (!canShare(file)) {
            download(file);
            setState(button, 'saved', file);
            return;
        }
        navigator.share({ files: [file], title: button.getAttribute('data-pdf-title') || file.name }).then(function () {
            setState(button, 'again', file);
        }, function (error) {
            var name = error && error.name;
            if (name === 'AbortError') { setState(button, 'again', file); return; }
            if (name === 'NotAllowedError') { setState(button, 'ready', file); return; }
            download(file);
            setState(button, 'saved', file);
        });
    }

    document.addEventListener('click', function (event) {
        var button = event.target.closest ? event.target.closest('[data-pdf-share]') : null;
        if (!button) { return; }
        event.preventDefault();
        if (button.getAttribute('data-state') === 'busy') { return; }
        var src = button.getAttribute('data-pdf-src');
        if (made[src]) { deliver(button, made[src]); return; }
        if (!window.Promise || !window.fetch || !window.TextEncoder || !window.XMLSerializer) { setState(button, 'error'); return; }
        setState(button, 'busy');
        build(src, button.getAttribute('data-pdf-title') || '').then(function (blob) {
            var name = button.getAttribute('data-pdf-name') || 'shary-report.pdf';
            var file;
            try { file = new File([blob], name, { type: 'application/pdf', lastModified: Date.now() }); } catch (e) { file = blob; file.name = name; }
            made[src] = file;
            var active = navigator.userActivation ? navigator.userActivation.isActive : false;
            if (!canShare(file)) { deliver(button, file); return; }
            if (active) { deliver(button, file); return; }
            setState(button, 'ready', file);
        }, function () {
            setState(button, 'error');
        });
    });

    window.SharyReportPdf = { build: build };
})();
