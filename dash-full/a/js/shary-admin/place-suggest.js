/*
 * Place suggestions for the dashboard maps (project location, project bounds, master plan placement).
 * While the team types, a list opens under the search box: Shary's own projects and areas first, then Google (through
 * the server). A place is picked with the mouse, a tap, or the arrow keys and Enter, and the page moves the map there.
 * Enter with nothing highlighted searches everywhere (Google and OpenStreetMap, with outlines) and lists the results.
 *
 *   var box = SharyPlaceSuggest.attach(input, {
 *       suggest: url,          // GET ?q=&session= → {places: [...], google: ok | off | denied | error}
 *       place: url,            // GET ?place_id=&session= → {ok, place}
 *       search: url,           // GET ?q= → {ok, results: [...]} (the page's full search)
 *       onPick: function (place) {},
 *       fill: function (place) {}  // optional: the words left in the box after a pick (default: the place's name)
 *   });
 *   box.search();              // the same as Enter (for a Search button next to the box)
 *
 *   place = {name, address, where, lat, lng, zoom, viewport: [south, west, north, east] | null, ring: [[lng, lat], ...] | null,
 *            source: shary | google | osm}   (where: the area a Shary place is in, '' otherwise; address is for the list)
 */
(function () {
    'use strict';
    if (window.SharyPlaceSuggest) {
        return;
    }

    var STYLE = [
        '.sx-ps{position:absolute;z-index:100000;background:#fff;border:1px solid #d9e2ec;border-radius:12px;box-shadow:0 16px 34px -14px rgba(15,34,51,.4);max-height:360px;overflow-y:auto;direction:rtl;text-align:right;font-family:inherit}',
        '.sx-ps[hidden]{display:none}',
        '.sx-ps__head{padding:8px 13px 4px;font-size:11.5px;font-weight:800;color:#6b7c8f;letter-spacing:.2px}',
        '.sx-ps__item{display:flex;align-items:flex-start;gap:10px;width:100%;padding:9px 13px;border:0;border-bottom:1px solid #eef2f6;background:#fff;cursor:pointer;text-align:inherit;font-family:inherit}',
        '.sx-ps__item:last-child{border-bottom:0}',
        '.sx-ps__item.is-active,.sx-ps__item:hover{background:#eef6ff}',
        '.sx-ps__pin{flex:0 0 18px;margin-top:2px;color:#1b84ff}',
        '.sx-ps__text{flex:1 1 auto;min-width:0}',
        '.sx-ps__text b{display:block;font-size:13.5px;font-weight:800;color:#123a5c;line-height:1.5}',
        '.sx-ps__text small{display:block;font-size:12px;font-weight:600;color:#6b7c8f;line-height:1.5}',
        '.sx-ps__tag{flex:0 0 auto;align-self:center;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:800;line-height:1.6}',
        '.sx-ps__tag--shary{background:#e2f5f2;color:#12857a}',
        '.sx-ps__tag--google{background:#e8f0fe;color:#1a56c4}',
        '.sx-ps__tag--osm{background:#eef1f4;color:#4c6178}',
        '.sx-ps__note{padding:10px 13px;font-size:12.5px;font-weight:700;color:#6b7c8f;line-height:1.7}',
        '.sx-ps__note--busy{color:#1a56c4}'
    ].join('\n');
    var PIN = '<svg class="sx-ps__pin" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>';
    var TAGS = {shary: 'شاري', google: 'Google', osm: 'OpenStreetMap'};
    var styled = false;
    var count = 0;

    function addStyle() {
        if (styled) {
            return;
        }
        styled = true;
        var style = document.createElement('style');
        style.textContent = STYLE;
        document.head.appendChild(style);
    }

    function newSession() {
        if (window.crypto && window.crypto.randomUUID) {
            return window.crypto.randomUUID();
        }
        var out = '';
        for (var i = 0; i < 32; i++) {
            out += Math.floor(Math.random() * 16).toString(16);
        }
        return out;
    }

    function get(url, params) {
        var query = Object.keys(params).filter(function (key) { return params[key] !== null && params[key] !== undefined && params[key] !== ''; })
            .map(function (key) { return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]); }).join('&');
        return fetch(url + (url.indexOf('?') > -1 ? '&' : '?') + query, {credentials: 'same-origin', headers: {'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest'}})
            .then(function (response) {
                if (response.status === 429) {
                    return {ok: false, message: 'استنى ثواني وكمّل كتابة (اتبعت كتير ورا بعض).'};
                }
                return response.json().catch(function () { return {ok: false}; });
            })
            .catch(function () { return {ok: false, message: 'السيرفر ما ردّش — اتأكد من النت.'}; });
    }

    function number(value) {
        var n = Number(value);
        return isFinite(n) ? n : null;
    }

    /** A place from the server's lists, in one shape. */
    function shape(place, source) {
        var lat = number(place.lat), lng = number(place.lng);
        return {
            name: String(place.name || ''),
            address: String(place.address || ''),
            where: String(place.where || ''),
            lat: lat, lng: lng,
            zoom: number(place.zoom),
            viewport: Array.isArray(place.viewport) && place.viewport.length === 4 ? place.viewport.map(Number) : null,
            ring: Array.isArray(place.ring) && place.ring.length > 2 ? place.ring : null,
            place_id: place.place_id || null,
            source: source || place.source || 'google'
        };
    }

    function attach(input, options) {
        if (!input || input.__sxSuggest) {
            return input ? input.__sxSuggest : null;
        }
        addStyle();
        options = options || {};
        var min = options.minLength || 2;
        var list = document.createElement('div');
        list.className = 'sx-ps';
        list.hidden = true;
        list.id = 'sx-ps-' + (++count);
        list.setAttribute('role', 'listbox');
        document.body.appendChild(list);
        input.setAttribute('autocomplete', 'off');
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('aria-controls', list.id);

        var items = [], active = -1, timer = null, asked = 0, session = null, googleNote = '';

        function place() {
            var box = input.getBoundingClientRect();
            list.style.top = (box.bottom + window.pageYOffset + 4) + 'px';
            list.style.left = (box.left + window.pageXOffset) + 'px';
            list.style.width = Math.max(box.width, 300) + 'px';
        }
        function open() {
            place();
            list.hidden = false;
            input.setAttribute('aria-expanded', 'true');
        }
        function close() {
            list.hidden = true;
            input.setAttribute('aria-expanded', 'false');
            input.removeAttribute('aria-activedescendant');
            active = -1;
        }
        function note(text, busy) {
            items = [];
            active = -1;
            list.innerHTML = '';
            var row = document.createElement('div');
            row.className = 'sx-ps__note' + (busy ? ' sx-ps__note--busy' : '');
            row.textContent = text;
            list.appendChild(row);
            open();
        }
        function highlight(index) {
            active = index;
            [].forEach.call(list.querySelectorAll('.sx-ps__item'), function (row, i) {
                row.classList.toggle('is-active', i === index);
                row.setAttribute('aria-selected', i === index ? 'true' : 'false');
                if (i === index) {
                    input.setAttribute('aria-activedescendant', row.id);
                    row.scrollIntoView({block: 'nearest'});
                }
            });
        }
        function render(groups, footer) {
            items = [];
            active = -1;
            list.innerHTML = '';
            groups.forEach(function (group) {
                if (!group.places.length) {
                    return;
                }
                if (group.title) {
                    var head = document.createElement('div');
                    head.className = 'sx-ps__head';
                    head.textContent = group.title;
                    list.appendChild(head);
                }
                group.places.forEach(function (spot) {
                    var index = items.length;
                    items.push(spot);
                    var row = document.createElement('button');
                    row.type = 'button';
                    row.className = 'sx-ps__item';
                    row.id = list.id + '-' + index;
                    row.setAttribute('role', 'option');
                    row.setAttribute('aria-selected', 'false');
                    row.insertAdjacentHTML('beforeend', PIN);
                    var text = document.createElement('span');
                    text.className = 'sx-ps__text';
                    var name = document.createElement('b');
                    name.textContent = spot.name;
                    text.appendChild(name);
                    if (spot.address) {
                        var where = document.createElement('small');
                        where.textContent = spot.address;
                        text.appendChild(where);
                    }
                    row.appendChild(text);
                    var tag = document.createElement('span');
                    tag.className = 'sx-ps__tag sx-ps__tag--' + spot.source;
                    tag.textContent = TAGS[spot.source] || spot.source;
                    row.appendChild(tag);
                    row.addEventListener('mousedown', function (event) { event.preventDefault(); });
                    row.addEventListener('mouseenter', function () { highlight(index); });
                    row.addEventListener('click', function () { pick(index); });
                    list.appendChild(row);
                });
            });
            if (footer) {
                var end = document.createElement('div');
                end.className = 'sx-ps__note';
                end.textContent = footer;
                list.appendChild(end);
            }
            if (items.length || footer) {
                open();
            } else {
                close();
            }
        }

        function suggest(q) {
            var ask = ++asked;
            session = session || newSession();
            get(options.suggest, {q: q, session: session}).then(function (data) {
                if (ask !== asked || input.value.trim() !== q) {
                    return;       // the words changed meanwhile
                }
                var places = (data && data.places) || [];
                var shary = places.filter(function (p) { return p.source === 'shary'; }).map(function (p) { return shape(p, 'shary'); });
                var google = places.filter(function (p) { return p.source !== 'shary'; }).map(function (p) { return shape(p, 'google'); });
                if (data && data.google === 'denied') {
                    googleNote = 'اقتراحات جوجل مش شغالة: مفتاح جوجل ماب مش مفعّل عليه Places API (New).';
                } else if (data && data.google === 'off') {
                    googleNote = 'اقتراحات جوجل محتاجة مفتاح جوجل ماب في «الإيجنت ← المفاتيح والربط».';
                }
                var footer = shary.length || google.length ? 'مش لاقي المكان؟ دوس Enter يدوّر في كل الخرايط.' : (data && data.message) || 'مفيش اقتراحات — دوس Enter يدوّر في كل الخرايط.';
                if (googleNote && !google.length) {
                    footer += ' ' + googleNote;
                }
                render([{title: shary.length && google.length ? 'على شاري' : '', places: shary}, {title: shary.length && google.length ? 'من جوجل' : '', places: google}], footer);
            });
        }

        function search() {
            var q = input.value.trim();
            if (q.length < min) {
                note('اكتب اسم المكان أو المشروع الأول.');
                return;
            }
            if (!options.search) {
                suggest(q);
                return;
            }
            clearTimeout(timer);
            var ask = ++asked;
            note('بيدوّر على «' + q + '» في كل الخرايط…', true);
            get(options.search, {q: q}).then(function (data) {
                if (ask !== asked) {
                    return;
                }
                var found = data && data.ok && Array.isArray(data.results) ? data.results : [];
                if (!found.length) {
                    note((data && data.message) || 'ما لقيتش مكان بالاسم ده — جرّب اسم الكمبوند بالإنجليزي أو اسم المنطقة.');
                    return;
                }
                render([{title: 'نتايج البحث', places: found.map(function (p) {
                    var from = String(p.source || '').toLowerCase();
                    return shape(p, from === 'shary' ? 'shary' : (from.indexOf('openstreetmap') > -1 ? 'osm' : 'google'));
                })}], data.credit ? 'الأماكن من: ' + data.credit : '');
            });
        }

        function pick(index) {
            var spot = items[index];
            if (!spot) {
                return;
            }
            input.value = options.fill ? options.fill(spot) : spot.name;
            close();
            if (spot.lat !== null && spot.lng !== null) {
                session = null;
                options.onPick(spot);
                return;
            }
            if (!spot.place_id || !options.place) {
                return;
            }
            var ask = ++asked;
            note('بيجيب مكان «' + spot.name + '»…', true);
            get(options.place, {place_id: spot.place_id, session: session}).then(function (data) {
                session = null;      // the search session ends with the pick
                if (ask !== asked) {
                    return;
                }
                if (!data || !data.ok || !data.place) {
                    note((data && data.message) || 'ما قدرتش أجيب المكان ده — اختار مكان تاني.');
                    return;
                }
                close();
                var found = shape(data.place, 'google');
                found.name = found.name || spot.name;
                if (options.fill) {
                    input.value = options.fill(found);
                }
                options.onPick(found);
            });
        }

        input.addEventListener('input', function () {
            clearTimeout(timer);
            var q = input.value.trim();
            if (q.length < min) {
                asked++;
                close();
                return;
            }
            timer = setTimeout(function () { suggest(q); }, 250);
        });
        input.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                if (list.hidden || !items.length) {
                    return;
                }
                event.preventDefault();
                var step = event.key === 'ArrowDown' ? 1 : -1;
                highlight((active + step + items.length) % items.length);
            } else if (event.key === 'Enter') {
                event.preventDefault();        // never submits the project form
                if (!list.hidden && active > -1) {
                    pick(active);
                } else {
                    search();
                }
            } else if (event.key === 'Escape') {
                close();
            }
        });
        input.addEventListener('focus', function () {
            if (items.length) {
                open();
            }
        });
        input.addEventListener('blur', function () {
            setTimeout(close, 150);
        });
        window.addEventListener('resize', function () { if (!list.hidden) { place(); } });
        window.addEventListener('scroll', function () { if (!list.hidden) { place(); } }, true);

        var api = {search: search, close: close};
        input.__sxSuggest = api;
        return api;
    }

    window.SharyPlaceSuggest = {attach: attach};
})();
