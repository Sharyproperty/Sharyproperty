/*
 * «التصميمات» — draws a design of the agent (its «spec»: App\Shary\Agent\Designs::build) on a canvas, in the browser:
 * the photo, the shapes, the stack of words (Cairo, bold, right to left) and the logo. The same drawing is made in Figma by «بلجن شاري».
 *
 *   <canvas data-sh-design="{spec, assets: {photo, logo}}">   drawn when the page opens (a small canvas = a thumbnail, same drawing scaled)
 *   ShDesign.draw(canvas, spec, assets, width)                   → Promise
 *   ShDesign.blob(spec, assets)                                  → Promise<Blob> the full-size PNG («ارفعه على الموقع», «نزّله»)
 *   <form data-sh-upload="url">                                  «ارفعه»: the full-size picture is drawn and sent with the form
 *   <div data-sh-store="url">                                    the page sends the picture of a version drawn for the first time
 */
(function () {
    'use strict';

    var images = {};
    var load = function (url) {
        if (!url) { return Promise.resolve(null); }
        if (!images[url]) {
            images[url] = new Promise(function (resolve) {
                var image = new Image();
                image.decoding = 'async';
                image.onload = function () { resolve(image); };
                image.onerror = function () { resolve(null); };
                image.src = url;
            });
        }
        return images[url];
    };
    var fonts = function () {
        if (!document.fonts || !document.fonts.load) { return Promise.resolve(); }
        return Promise.all(['800 40px Cairo', '700 40px Cairo'].map(function (font) { return document.fonts.load(font, 'شاري Shary').catch(function () {}); }));
    };

    var rgba = function (hex, alpha) {
        var value = String(hex || '#000000').replace('#', '');
        if (value.length === 3) { value = value.replace(/(.)/g, '$1$1'); }
        var n = parseInt(value, 16);
        return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + (alpha === undefined ? 1 : alpha) + ')';
    };
    var rounded = function (ctx, x, y, w, h, r) {
        r = Math.max(0, Math.min(r || 0, w / 2, h / 2));
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    };
    var fillOf = function (ctx, fill, layer) {
        if (!fill || typeof fill === 'string') { return rgba(fill || '#000000', 1); }
        // linear: angle as in CSS (0 = towards the top, 90 = towards the right …), stops [colour, alpha, position]
        var angle = (fill.angle || 0) * Math.PI / 180;
        var cx = layer.x + layer.w / 2, cy = layer.y + layer.h / 2;
        var dx = Math.sin(angle), dy = -Math.cos(angle);
        var half = Math.abs(layer.w / 2 * dx) + Math.abs(layer.h / 2 * dy);
        var gradient = ctx.createLinearGradient(cx - dx * half, cy - dy * half, cx + dx * half, cy + dy * half);
        (fill.stops || []).forEach(function (stop) { gradient.addColorStop(Math.max(0, Math.min(1, stop[2])), rgba(stop[0], stop[1])); });
        return gradient;
    };

    /* the lines of a text in a width (by words), the size made smaller until it fits its lines */
    var wrap = function (ctx, text, size, weight, width, maxLines) {
        var words = String(text || '').split(/\s+/).filter(Boolean);
        var tries = 0;
        var lines;
        do {
            ctx.font = weight + ' ' + size + 'px Cairo, "Segoe UI", Tahoma, sans-serif';
            lines = [];
            var line = '';
            words.forEach(function (word) {
                var next = line ? line + ' ' + word : word;
                if (line && ctx.measureText(next).width > width) { lines.push(line); line = word; } else { line = next; }
            });
            if (line) { lines.push(line); }
            var widest = Math.max.apply(null, lines.map(function (one) { return ctx.measureText(one).width; }).concat([0]));
            if (lines.length <= (maxLines || 3) && widest <= width) { break; }
            size = Math.round(size * 0.92);
            tries++;
        } while (tries < 10 && size > 12);
        return { lines: lines, size: size };
    };

    var drawStack = function (ctx, layer, spec) {
        var rtl = spec.dir === 'rtl';
        var measure = function (k) {
            return (layer.items || []).filter(function (item) { return String(item.text || '').trim() !== ''; }).map(function (item) {
                var size = Math.max(12, Math.round(item.size * k));
                if (item.type === 'pill') {
                    ctx.font = (item.weight || 800) + ' ' + size + 'px Cairo, "Segoe UI", Tahoma, sans-serif';
                    var pad = size * (item.pad || 0.9);
                    var w = Math.min(layer.w, ctx.measureText(item.text).width + pad * 2);
                    return { item: item, w: w, h: size * 2, size: size };
                }
                var fit = wrap(ctx, item.text, size, item.weight || 800, layer.w, item.max_lines);
                return { item: item, lines: fit.lines, size: fit.size, h: fit.lines.length * fit.size * (item.lh || 1.3) };
            });
        };
        // everything smaller together until the words fit their box (the same rule as «بلجن شاري» in Figma)
        var k = 1, gap, total, parts;
        for (var round = 0; round < 8; round++) {
            parts = measure(k);
            gap = (layer.gap || 16) * k;
            total = parts.reduce(function (sum, part) { return sum + part.h; }, 0) + gap * Math.max(0, parts.length - 1);
            if (total <= layer.h) { break; }
            k *= 0.9;
        }
        var y = layer.valign === 'middle' ? layer.y + (layer.h - total) / 2 : (layer.valign === 'bottom' ? layer.y + layer.h - total : layer.y);
        parts.forEach(function (part) {
            var item = part.item;
            var x = layer.align === 'center' ? layer.x + layer.w / 2 : (layer.align === 'left' ? layer.x : layer.x + layer.w);
            ctx.save();
            ctx.globalAlpha = item.opacity === undefined ? 1 : item.opacity;
            ctx.direction = rtl ? 'rtl' : 'ltr';
            ctx.textBaseline = 'middle';
            if (item.type === 'pill') {
                var left = layer.align === 'center' ? x - part.w / 2 : (layer.align === 'left' ? x : x - part.w);
                ctx.fillStyle = rgba(item.fill || '#E8A838', 1);
                rounded(ctx, left, y, part.w, part.h, part.h / 2);
                ctx.fill();
                ctx.fillStyle = rgba(item.color || '#10263F', 1);
                ctx.font = (item.weight || 800) + ' ' + part.size + 'px Cairo, "Segoe UI", Tahoma, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(item.text, left + part.w / 2, y + part.h / 2 + part.size * 0.06);
            } else {
                ctx.fillStyle = rgba(item.color || '#FFFFFF', 1);
                ctx.font = (item.weight || 800) + ' ' + part.size + 'px Cairo, "Segoe UI", Tahoma, sans-serif';
                ctx.textAlign = layer.align === 'center' ? 'center' : (layer.align === 'left' ? 'left' : 'right');
                var lineHeight = part.size * (item.lh || 1.3);
                part.lines.forEach(function (line, index) { ctx.fillText(line, x, y + lineHeight * index + lineHeight / 2); });
            }
            ctx.restore();
            y += part.h + gap;
        });
    };

    var drawBrand = function (ctx, layer, spec, logo) {
        if (logo) {
            var k = Math.min(layer.w / logo.naturalWidth, layer.h / logo.naturalHeight);
            var w = logo.naturalWidth * k, h = logo.naturalHeight * k;
            ctx.drawImage(logo, layer.align === 'left' ? layer.x : layer.x + layer.w - w, layer.y + (layer.h - h) / 2, w, h);
            return;
        }
        // Shary's mark (as in the dashboard) and its name
        var r = layer.h / 2;
        var name = layer.lang === 'en' ? 'Shary' : 'شاري';
        ctx.save();
        ctx.font = '800 ' + Math.round(layer.h * 0.62) + 'px Cairo, "Segoe UI", Tahoma, sans-serif';
        var textW = ctx.measureText(name).width;
        var total = r * 2 + layer.h * 0.25 + textW;
        var start = layer.align === 'left' ? layer.x : layer.x + layer.w - total;
        var markX = layer.lang === 'en' ? start : start + total - r * 2;
        var textX = layer.lang === 'en' ? start + r * 2 + layer.h * 0.25 : start;
        ctx.fillStyle = '#123A5C';
        ctx.beginPath(); ctx.arc(markX + r, layer.y + r, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#E8A838';
        ctx.beginPath(); ctx.arc(markX + r * 0.6, layer.y + r * 0.6, r * 0.34, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2A9D8F';
        ctx.beginPath(); ctx.arc(markX + r * 1.4, layer.y + r * 1.24, r * 0.38, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = rgba(layer.color || '#FFFFFF', 1);
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillText(name, textX, layer.y + r + layer.h * 0.04);
        ctx.restore();
    };

    var draw = function (canvas, spec, assets, width) {
        assets = assets || {};
        return Promise.all([fonts(), load(assets.photo), load(assets.logo)]).then(function (loaded) {
            var photo = loaded[1], logo = loaded[2];
            var scale = (width || spec.w) / spec.w;
            canvas.width = Math.round(spec.w * scale);
            canvas.height = Math.round(spec.h * scale);
            var ctx = canvas.getContext('2d');
            ctx.setTransform(scale, 0, 0, scale, 0, 0);
            ctx.fillStyle = rgba(spec.bg || '#0F2D4A', 1);
            ctx.fillRect(0, 0, spec.w, spec.h);
            (spec.layers || []).forEach(function (layer) {
                ctx.save();
                ctx.globalAlpha = layer.opacity === undefined ? 1 : layer.opacity;
                if (layer.type === 'rect') {
                    ctx.fillStyle = fillOf(ctx, layer.fill, layer);
                    rounded(ctx, layer.x, layer.y, layer.w, layer.h, layer.radius || 0);
                    ctx.fill();
                } else if (layer.type === 'image') {
                    var picture = layer.src === 'logo' ? logo : photo;
                    rounded(ctx, layer.x, layer.y, layer.w, layer.h, layer.radius || 0);
                    ctx.clip();
                    if (picture) {
                        var k = (layer.fit === 'contain' ? Math.min : Math.max)(layer.w / picture.naturalWidth, layer.h / picture.naturalHeight);
                        var w = picture.naturalWidth * k, h = picture.naturalHeight * k;
                        ctx.drawImage(picture, layer.x + (layer.w - w) / 2, layer.y + (layer.h - h) * 0.45, w, h);
                    } else {
                        ctx.fillStyle = '#C9D2DE';
                        ctx.fillRect(layer.x, layer.y, layer.w, layer.h);
                    }
                } else if (layer.type === 'stack') {
                    drawStack(ctx, layer, spec);
                } else if (layer.type === 'brand') {
                    drawBrand(ctx, layer, spec, logo);
                }
                ctx.restore();
            });
            return canvas;
        });
    };

    // the full-size picture: JPEG 92% to send (small enough for any upload limit, made WebP by the server), PNG to download
    var blob = function (spec, assets, type, quality) {
        var canvas = document.createElement('canvas');
        return draw(canvas, spec, assets, spec.w).then(function () {
            return new Promise(function (resolve) { canvas.toBlob(function (result) { resolve(result); }, type || 'image/jpeg', quality || 0.92); });
        });
    };

    window.ShDesign = { draw: draw, blob: blob };

    var token = (document.querySelector('meta[name=csrf-token]') || {}).content || '';
    var data = function (node, name) { try { return JSON.parse(node.getAttribute(name) || '{}'); } catch (error) { return {}; } };

    // every design on the page
    Array.prototype.forEach.call(document.querySelectorAll('canvas[data-sh-design]'), function (canvas) {
        var design = data(canvas, 'data-sh-design');
        if (!design.spec) { return; }
        var width = parseInt(canvas.getAttribute('data-sh-width') || '0', 10) || Math.min(design.spec.w, 1400);
        draw(canvas, design.spec, design.assets, width).then(function () { canvas.classList.add('is-drawn'); });
    });

    // a version drawn for the first time: its picture goes to the server (the list, Figma-less «ارفعه», the WhatsApp line)
    var store = document.querySelector('[data-sh-store]');
    if (store) {
        var first = data(store, 'data-sh-design');
        if (first.spec) {
            blob(first.spec, first.assets).then(function (picture) {
                if (!picture) { return; }
                var form = new FormData();
                form.append('image', picture, 'design.jpg');
                return fetch(store.getAttribute('data-sh-store'), { method: 'POST', headers: { 'X-CSRF-TOKEN': token, 'Accept': 'application/json' }, body: form });
            }).catch(function () {});
        }
    }

    // «ارفعه على الموقع»: the full-size picture is drawn now and sent with the choice of place
    Array.prototype.forEach.call(document.querySelectorAll('form[data-sh-upload]'), function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var design = data(form, 'data-sh-design');
            var button = form.querySelector('button[type=submit], button:not([type])');
            if (button) { button.disabled = true; button.textContent = 'بيجهّز الصورة…'; }
            blob(design.spec, design.assets).then(function (picture) {
                var body = new FormData(form);
                if (picture) { body.append('image', picture, 'design.jpg'); }
                return fetch(form.getAttribute('data-sh-upload'), { method: 'POST', headers: { 'X-CSRF-TOKEN': token, 'Accept': 'application/json' }, body: body });
            }).then(function (response) {
                return response.json().then(function (answer) { return { ok: response.ok, answer: answer }; });
            }).then(function (result) {
                if (result.ok && result.answer.redirect) { window.location.href = result.answer.redirect; return; }
                throw new Error(result.answer.message || 'error');
            }).catch(function (error) {
                window.alert('ما اترفعش: ' + error.message);
                if (button) { button.disabled = false; button.textContent = 'ارفعه على الموقع'; }
            });
        });
    });

    // a ready order of «اطلب تصميم»: its words and its kind into the form
    document.addEventListener('click', function (event) {
        var chip = event.target.closest('[data-sh-brief]');
        if (!chip || !chip.form && !chip.closest('form')) { return; }
        var form = chip.closest('form');
        if (form.elements.brief) { form.elements.brief.value = chip.getAttribute('data-sh-brief'); form.elements.brief.focus(); }
        if (form.elements.kind && chip.getAttribute('data-sh-kind')) { form.elements.kind.value = chip.getAttribute('data-sh-kind'); }
    });

    // «نزّله»: the full-size PNG
    document.addEventListener('click', function (event) {
        var link = event.target.closest('[data-sh-download]');
        if (!link) { return; }
        event.preventDefault();
        var design = data(link, 'data-sh-download');
        blob(design.spec, design.assets, 'image/png').then(function (picture) {
            if (!picture) { return; }
            var a = document.createElement('a');
            a.href = URL.createObjectURL(picture);
            a.download = (link.getAttribute('data-sh-name') || 'shary-design') + '.png';
            document.body.appendChild(a);
            a.click();
            setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
        });
    });
})();
