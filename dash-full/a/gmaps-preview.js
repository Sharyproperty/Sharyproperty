/*
 * خرايط جوجل في لينك المعاينة (GitHub Pages) — نفس الـ API اللي صفحات الداشبورد بتستخدمه (google.maps.*) ،
 * بس مرسوم بـ MapLibre على صور القمر الصناعي بتاعة Esri (من غير مفتاح) ، والبحث وانت بتكتب من OpenStreetMap (Photon / Nominatim).
 * على السيرفر الحقيقي الصفحات بتحمّل خرايط جوجل نفسها بمفتاح الداشبورد — الملف ده للمعاينة بس.
 *
 * <script async defer src="a/gmaps-preview.js?libraries=places&callback=initMap"></script>
 * فيه: Map · LatLng · LatLngBounds · Point · Size · MVCArray · Marker (سحب / كليك / كليك يمين) · Polygon · Polyline · Circle · Rectangle ·
 *      GroundOverlay · OverlayView (getPanes / getProjection) · InfoWindow · Geocoder · event.* · places.Autocomplete ·
 *      places.AutocompleteService · places.PlacesService · places.SearchBox
 */
(function () {
    'use strict';
    if (window.google && window.google.maps && window.google.maps.__preview) { return; }
    var scripts = document.getElementsByTagName('script');
    var me = document.currentScript;
    if (!me) { for (var i = scripts.length - 1; i >= 0; i--) { if (/gmaps-preview\.js/.test(scripts[i].src)) { me = scripts[i]; break; } } }
    var src = me ? me.src : '';
    var BASE = src.replace(/gmaps-preview\.js.*$/, '');
    var PARAMS = {};
    (src.split('?')[1] || '').split('&').forEach(function (kv) { var p = kv.split('='); if (p[0]) { PARAMS[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); } });
    var LANG = (document.documentElement.getAttribute('lang') || 'ar').slice(0, 2).toLowerCase() === 'en' ? 'en' : 'ar';
    var T = LANG === 'en'
        ? { map: 'Map', sat: 'Satellite', zin: 'Zoom in', zout: 'Zoom out', none: 'No results — try another name', powered: 'Search: OpenStreetMap' }
        : { map: 'خريطة', sat: 'قمر صناعي', zin: 'تكبير', zout: 'تصغير', none: 'مفيش نتايج — جرّب اسم تاني', powered: 'البحث: OpenStreetMap' };
    var ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/';

    function loadLib(done) {
        if (window.maplibregl) { done(); return; }
        var css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = BASE + 'vendor/maplibre/maplibre-gl.css';
        document.head.appendChild(css);
        var s = document.createElement('script');
        s.src = BASE + 'vendor/maplibre/maplibre-gl.js';
        s.onload = done;
        s.onerror = function () { if (window.console) { console.warn('gmaps-preview: maplibre did not load'); } };
        document.head.appendChild(s);
    }

    function num(v) { v = typeof v === 'function' ? v() : v; return Number(v); }

    function define() {
        var g = window.google = window.google || {};
        var maps = g.maps = {};
        maps.__preview = true;
        maps.version = '3.preview';
        var uid = 0;

        // ---------------------------------------------------------------- الأحداث
        function bag(obj) {
            if (!Object.prototype.hasOwnProperty.call(obj, '__gmEvents')) { Object.defineProperty(obj, '__gmEvents', { value: {}, enumerable: false, configurable: true }); }
            return obj.__gmEvents;
        }
        var event = maps.event = {
            addListener: function (obj, name, fn) {
                var all = bag(obj), list = all[name] = all[name] || [];
                var handle = { remove: function () { var at = list.indexOf(handle); if (at > -1) { list.splice(at, 1); } } };
                handle.fn = fn;
                list.push(handle);
                return handle;
            },
            addListenerOnce: function (obj, name, fn) {
                var handle = event.addListener(obj, name, function () { handle.remove(); return fn.apply(this, arguments); });
                return handle;
            },
            addDomListener: function (el, name, fn, capture) { el.addEventListener(name, fn, !!capture); return { remove: function () { el.removeEventListener(name, fn, !!capture); } }; },
            addDomListenerOnce: function (el, name, fn, capture) { var h = event.addDomListener(el, name, function (e) { h.remove(); fn.call(this, e); }, capture); return h; },
            removeListener: function (handle) { if (handle && handle.remove) { handle.remove(); } },
            clearListeners: function (obj, name) { if (obj && obj.__gmEvents) { delete obj.__gmEvents[name]; } },
            clearInstanceListeners: function (obj) { if (obj && obj.__gmEvents) { Object.keys(obj.__gmEvents).forEach(function (k) { delete obj.__gmEvents[k]; }); } },
            hasListeners: function (obj, name) { return !!(obj && obj.__gmEvents && obj.__gmEvents[name] && obj.__gmEvents[name].length); },
            trigger: function (obj, name) {
                var args = Array.prototype.slice.call(arguments, 2);
                if (obj && typeof obj.__onTrigger === 'function') { obj.__onTrigger(name, args); }
                var list = obj && obj.__gmEvents && obj.__gmEvents[name];
                if (!list) { return; }
                list.slice().forEach(function (h) { try { h.fn.apply(obj, args); } catch (error) { setTimeout(function () { throw error; }); } });
            }
        };
        var fire = event.trigger;

        function MVCObject() {}
        MVCObject.prototype.addListener = function (name, fn) { return event.addListener(this, name, fn); };
        MVCObject.prototype.set = function (key, value) {
            if (!Object.prototype.hasOwnProperty.call(this, '__values')) { this.__values = {}; }
            this.__values[key] = value;
            fire(this, key + '_changed');
        };
        MVCObject.prototype.get = function (key) { return this.__values ? this.__values[key] : undefined; };
        MVCObject.prototype.setValues = function (values) { var self = this; Object.keys(values || {}).forEach(function (k) { self.set(k, values[k]); }); };
        MVCObject.prototype.notify = function (key) { fire(this, key + '_changed'); };
        MVCObject.prototype.bindTo = function () {};
        MVCObject.prototype.unbind = function () {};
        MVCObject.prototype.unbindAll = function () {};
        MVCObject.prototype.changed = function () {};
        maps.MVCObject = MVCObject;
        function inherit(Child) { Child.prototype = Object.create(MVCObject.prototype); Child.prototype.constructor = Child; }

        // ---------------------------------------------------------------- الأنواع الأساسية
        function LatLng(a, b) {
            if (a && typeof a === 'object') { this.__lat = num(a.lat); this.__lng = num(a.lng); }
            else { this.__lat = num(a); this.__lng = num(b); }
        }
        LatLng.prototype.lat = function () { return this.__lat; };
        LatLng.prototype.lng = function () { return this.__lng; };
        LatLng.prototype.toJSON = function () { return { lat: this.__lat, lng: this.__lng }; };
        LatLng.prototype.toString = function () { return '(' + this.__lat + ', ' + this.__lng + ')'; };
        LatLng.prototype.toUrlValue = function (p) { p = p == null ? 6 : p; return Number(this.__lat.toFixed(p)) + ',' + Number(this.__lng.toFixed(p)); };
        LatLng.prototype.equals = function (o) { o = toLL(o); return !!o && Math.abs(o.lat() - this.__lat) < 1e-9 && Math.abs(o.lng() - this.__lng) < 1e-9; };
        maps.LatLng = LatLng;
        function toLL(v) {
            if (!v) { return null; }
            if (v instanceof LatLng) { return v; }
            if (Array.isArray(v)) { return new LatLng(v[0], v[1]); }
            if (typeof v.lat === 'function' || typeof v.lat === 'number' || typeof v.lat === 'string') { return new LatLng(v); }
            return null;
        }
        maps.LatLngAltitude = LatLng;

        function LatLngBounds(sw, ne) {
            this.__s = Infinity; this.__n = -Infinity; this.__w = Infinity; this.__e = -Infinity;
            if (sw && typeof sw === 'object' && 'north' in sw) { this.extend({ lat: sw.south, lng: sw.west }); this.extend({ lat: sw.north, lng: sw.east }); return; }
            if (sw) { this.extend(sw); }
            if (ne) { this.extend(ne); }
        }
        LatLngBounds.prototype.extend = function (p) {
            if (p instanceof LatLngBounds) { return this.union(p); }
            p = toLL(p);
            if (!p || !isFinite(p.lat()) || !isFinite(p.lng())) { return this; }
            this.__s = Math.min(this.__s, p.lat()); this.__n = Math.max(this.__n, p.lat());
            this.__w = Math.min(this.__w, p.lng()); this.__e = Math.max(this.__e, p.lng());
            return this;
        };
        LatLngBounds.prototype.union = function (b) { if (b && !b.isEmpty()) { this.extend(b.getSouthWest()); this.extend(b.getNorthEast()); } return this; };
        LatLngBounds.prototype.isEmpty = function () { return !(this.__s <= this.__n && this.__w <= this.__e); };
        LatLngBounds.prototype.getNorthEast = function () { return new LatLng(this.__n, this.__e); };
        LatLngBounds.prototype.getSouthWest = function () { return new LatLng(this.__s, this.__w); };
        LatLngBounds.prototype.getCenter = function () { return new LatLng((this.__s + this.__n) / 2, (this.__w + this.__e) / 2); };
        LatLngBounds.prototype.contains = function (p) { p = toLL(p); return !!p && p.lat() >= this.__s && p.lat() <= this.__n && p.lng() >= this.__w && p.lng() <= this.__e; };
        LatLngBounds.prototype.intersects = function (b) { return !(b.__w > this.__e || b.__e < this.__w || b.__s > this.__n || b.__n < this.__s); };
        LatLngBounds.prototype.equals = function (b) { return !!b && b.__s === this.__s && b.__n === this.__n && b.__w === this.__w && b.__e === this.__e; };
        LatLngBounds.prototype.toJSON = function () { return { north: this.__n, south: this.__s, east: this.__e, west: this.__w }; };
        LatLngBounds.prototype.toSpan = function () { return new LatLng(this.__n - this.__s, this.__e - this.__w); };
        LatLngBounds.prototype.toString = function () { return '(' + this.getSouthWest() + ', ' + this.getNorthEast() + ')'; };
        LatLngBounds.prototype.toUrlValue = function (p) { return this.getSouthWest().toUrlValue(p) + ',' + this.getNorthEast().toUrlValue(p); };
        maps.LatLngBounds = LatLngBounds;
        function toBounds(b) { if (!b) { return null; } if (b instanceof LatLngBounds) { return b; } if ('north' in b) { return new LatLngBounds(b); } return null; }

        function Point(x, y) { this.x = Number(x); this.y = Number(y); }
        Point.prototype.equals = function (o) { return !!o && o.x === this.x && o.y === this.y; };
        Point.prototype.toString = function () { return '(' + this.x + ', ' + this.y + ')'; };
        maps.Point = Point;
        function Size(w, h) { this.width = Number(w); this.height = Number(h); }
        Size.prototype.equals = function (o) { return !!o && o.width === this.width && o.height === this.height; };
        maps.Size = Size;

        function MVCArray(items) { this.__items = (items || []).slice(); }
        inherit(MVCArray);
        MVCArray.prototype.getArray = function () { return this.__items; };
        MVCArray.prototype.getAt = function (i) { return this.__items[i]; };
        MVCArray.prototype.getLength = function () { return this.__items.length; };
        MVCArray.prototype.setAt = function (i, v) { var old = this.__items[i]; this.__items[i] = v; fire(this, 'set_at', i, old); };
        MVCArray.prototype.insertAt = function (i, v) { this.__items.splice(i, 0, v); fire(this, 'insert_at', i); };
        MVCArray.prototype.removeAt = function (i) { var v = this.__items.splice(i, 1)[0]; fire(this, 'remove_at', i, v); return v; };
        MVCArray.prototype.push = function (v) { this.insertAt(this.__items.length, v); return this.__items.length; };
        MVCArray.prototype.pop = function () { return this.__items.length ? this.removeAt(this.__items.length - 1) : undefined; };
        MVCArray.prototype.forEach = function (fn) { this.__items.slice().forEach(function (v, i) { fn(v, i); }); };
        MVCArray.prototype.clear = function () { while (this.__items.length) { this.pop(); } };
        maps.MVCArray = MVCArray;

        maps.MapTypeId = { ROADMAP: 'roadmap', SATELLITE: 'satellite', HYBRID: 'hybrid', TERRAIN: 'terrain' };
        maps.ControlPosition = { TOP_LEFT: 1, TOP_CENTER: 2, TOP: 2, TOP_RIGHT: 3, LEFT_CENTER: 4, LEFT_TOP: 5, LEFT: 5, LEFT_BOTTOM: 6, RIGHT_TOP: 7, RIGHT: 7, RIGHT_CENTER: 8, RIGHT_BOTTOM: 9, BOTTOM_LEFT: 10, BOTTOM_CENTER: 11, BOTTOM: 11, BOTTOM_RIGHT: 12, CENTER: 13, BLOCK_START_INLINE_START: 14, BLOCK_START_INLINE_CENTER: 15, BLOCK_START_INLINE_END: 16, INLINE_START_BLOCK_CENTER: 17, INLINE_START_BLOCK_START: 18, INLINE_START_BLOCK_END: 19, INLINE_END_BLOCK_START: 20, INLINE_END_BLOCK_CENTER: 21, INLINE_END_BLOCK_END: 22, BLOCK_END_INLINE_START: 23, BLOCK_END_INLINE_CENTER: 24, BLOCK_END_INLINE_END: 25 };
        maps.MapTypeControlStyle = { DEFAULT: 0, HORIZONTAL_BAR: 1, DROPDOWN_MENU: 2 };
        maps.SymbolPath = { CIRCLE: 0, FORWARD_CLOSED_ARROW: 1, FORWARD_OPEN_ARROW: 2, BACKWARD_CLOSED_ARROW: 3, BACKWARD_OPEN_ARROW: 4 };
        maps.Animation = { BOUNCE: 1, DROP: 2 };
        maps.StrokePosition = { CENTER: 0, INSIDE: 1, OUTSIDE: 2 };
        maps.GeocoderStatus = { OK: 'OK', ZERO_RESULTS: 'ZERO_RESULTS', ERROR: 'ERROR', INVALID_REQUEST: 'INVALID_REQUEST', OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT', REQUEST_DENIED: 'REQUEST_DENIED', UNKNOWN_ERROR: 'UNKNOWN_ERROR' };

        // ---------------------------------------------------------------- شكل الخريطة (Esri)
        function style(type) {
            var sources = {}, layers = [{ id: 'gm-ground', type: 'background', paint: { 'background-color': type === 'roadmap' || type === 'terrain' ? '#e9edf0' : '#9d8f74' } }];
            var raster = function (id, url, maxzoom) {
                sources[id] = { type: 'raster', tiles: [ESRI + url + '/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: maxzoom || 19, attribution: 'Esri' };
                layers.push({ id: 'gm-' + id, type: 'raster', source: id, paint: { 'raster-fade-duration': 0 } });
            };
            if (type === 'roadmap') { raster('street', 'World_Street_Map'); }
            else if (type === 'terrain') { raster('topo', 'World_Topo_Map'); }
            else {
                raster('imagery', 'World_Imagery');
                if (type === 'hybrid') { raster('roads', 'Reference/World_Transportation'); raster('labels', 'Reference/World_Boundaries_and_Places'); }
            }
            return { version: 8, sources: sources, layers: layers };
        }

        // ---------------------------------------------------------------- الخريطة
        var PANES = ['mapPane', 'overlayLayer', 'overlayShadow', 'markerLayer', 'overlayMouseTarget', 'floatShadow', 'floatPane'];
        function GMap(div, opts) {
            opts = opts || {};
            var self = this;
            this.__div = div;
            this.__overlays = [];
            this.__layered = [];
            this.__ready = false;
            this.__queue = [];
            this.__opts = {};
            this.controls = {};
            Object.keys(maps.ControlPosition).forEach(function (k) { if (!self.controls[maps.ControlPosition[k]]) { self.controls[maps.ControlPosition[k]] = new MVCArray(); } });
            this.__type = opts.mapTypeId || 'roadmap';
            var center = toLL(opts.center) || new LatLng(30.0444, 31.2357);
            var zoom = opts.zoom != null ? Number(opts.zoom) : 10;
            if (window.getComputedStyle(div).position === 'static') { div.style.position = 'relative'; }
            div.innerHTML = '';
            div.style.overflow = 'hidden';
            var host = this.__host = document.createElement('div');
            host.className = 'gm-preview';
            host.style.cssText = 'position:absolute;inset:0;direction:ltr';
            div.appendChild(host);
            var gl = this.__gl = new window.maplibregl.Map({
                container: host, style: style(this.__type), center: [center.lng(), center.lat()], zoom: Math.max(0, zoom - 1),
                attributionControl: false, dragRotate: false, pitchWithRotate: false, touchPitch: false, maxZoom: 21, minZoom: 0, fadeDuration: 0,
                renderWorldCopies: true
            });
            try { gl.touchZoomRotate.disableRotation(); } catch (error) { /* */ }
            gl.addControl(new window.maplibregl.AttributionControl({ compact: true, customAttribution: 'Esri, Maxar, Earthstar Geographics' }), 'bottom-right');
            // الطبقات فوق الخريطة (OverlayView): جوه حاوية الخريطة — والعلامات بتتحط بعدها (فوقها)
            var paneBox = this.__paneBox = document.createElement('div');
            paneBox.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:hidden';
            gl.getCanvasContainer().appendChild(paneBox);
            this.__panes = {};
            PANES.forEach(function (name, i) {
                var pane = document.createElement('div');
                pane.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;z-index:' + (100 + i);
                paneBox.appendChild(pane);
                self.__panes[name] = pane;
            });
            this.__projection = {
                fromLatLngToDivPixel: function (ll) { ll = toLL(ll); var p = gl.project([ll.lng(), ll.lat()]); return new Point(p.x, p.y); },
                fromDivPixelToLatLng: function (pt) { var l = gl.unproject([pt.x, pt.y]); return new LatLng(l.lat, l.lng); },
                fromLatLngToContainerPixel: function (ll) { ll = toLL(ll); var p = gl.project([ll.lng(), ll.lat()]); return new Point(p.x, p.y); },
                fromContainerPixelToLatLng: function (pt) { var l = gl.unproject([pt.x, pt.y]); return new LatLng(l.lat, l.lng); },
                getWorldWidth: function () { return 512 * Math.pow(2, gl.getZoom()); },
                getVisibleRegion: function () { var b = self.getBounds(); return { latLngBounds: b, nearLeft: b.getSouthWest(), farRight: b.getNorthEast() }; }
            };
            this.__ui(opts);
            this.setOptions(opts);
            var dragging = false, lastZoom = Math.round(gl.getZoom()), firstIdle = true;
            var redraw = function () { self.__overlays.forEach(function (o) { if (o.__added && typeof o.draw === 'function') { try { o.draw(); } catch (error) { setTimeout(function () { throw error; }); } } }); };
            this.__redraw = redraw;
            var mouse = function (e) { var ll = new LatLng(e.lngLat.lat, e.lngLat.lng); return { latLng: ll, domEvent: e.originalEvent, pixel: new Point(e.point.x, e.point.y), stop: function () { if (e.originalEvent) { e.originalEvent.stopPropagation(); } } }; };
            var onMarker = function (e) { var t = e.originalEvent && e.originalEvent.target; return !!(t && t.closest && t.closest('.maplibregl-marker, .gm-control, [data-gm-stop]')); };
            // زي جوجل: الكليك على شكل (مضلع / خط) بيروح للشكل نفسه مش للخريطة
            var onShape = function (e) {
                var ids = self.__layered.filter(function (item) { return item.__clickable !== false && item.__key; }).reduce(function (all, item) { return all.concat([item.__key + '-fill', item.__key + '-line', item.__key]); }, []).filter(function (id) { return gl.getLayer(id); });
                try { return ids.length && gl.queryRenderedFeatures(e.point, { layers: ids }).length > 0; } catch (error) { return false; }
            };
            gl.on('click', function (e) { if (!onMarker(e) && !onShape(e)) { fire(self, 'click', mouse(e)); } });
            gl.on('dblclick', function (e) { if (!onMarker(e)) { fire(self, 'dblclick', mouse(e)); } });
            gl.on('contextmenu', function (e) { if (!onMarker(e)) { fire(self, 'rightclick', mouse(e)); fire(self, 'contextmenu', mouse(e)); } });
            gl.on('mousemove', function (e) { fire(self, 'mousemove', mouse(e)); });
            gl.on('mouseout', function (e) { fire(self, 'mouseout', mouse(e)); });
            gl.on('dragstart', function () { dragging = true; fire(self, 'dragstart'); });
            gl.on('drag', function () { fire(self, 'drag'); });
            gl.on('dragend', function () { dragging = false; fire(self, 'dragend'); });
            gl.on('move', function () { redraw(); fire(self, 'center_changed'); fire(self, 'bounds_changed'); });
            gl.on('zoom', function () { var z = Math.round(gl.getZoom()); if (z !== lastZoom) { lastZoom = z; fire(self, 'zoom_changed'); } });
            gl.on('resize', redraw);
            gl.on('idle', function () { fire(self, 'idle'); if (firstIdle) { firstIdle = false; fire(self, 'tilesloaded'); } });
            var onStyle = function () {
                self.__ready = true;
                self.__layered.forEach(function (item) { item.__attach(true); });
                var q = self.__queue; self.__queue = [];
                q.forEach(function (fn) { fn(); });
                redraw();
            };
            gl.on('style.load', onStyle);
            gl.on('load', function () { if (!self.__ready) { onStyle(); } });
            // المقاس بيتغير (تبويب اتفتح / شاشة اتصغرت): الخريطة بتتظبط لوحدها زي خرايط جوجل
            if (window.ResizeObserver) { new ResizeObserver(function () { try { gl.resize(); } catch (error) { /* */ } }).observe(div); }
            setTimeout(function () { fire(self, 'projection_changed'); }, 0);
        }
        inherit(GMap);
        GMap.prototype.__whenReady = function (fn) { if (this.__ready) { fn(); } else { this.__queue.push(fn); } };
        GMap.prototype.__onTrigger = function (name) { if (name === 'resize') { try { this.__gl.resize(); } catch (error) { /* */ } } };
        GMap.prototype.__ui = function (opts) {
            var self = this, gl = this.__gl, host = this.__host;
            var none = opts.disableDefaultUI === true;
            var box = document.createElement('div');
            box.className = 'gm-control';
            box.style.cssText = 'position:absolute;z-index:5;display:flex;flex-direction:column;gap:8px;bottom:26px;right:10px';
            if (!(none && opts.zoomControl !== true) && opts.zoomControl !== false) {
                var zoom = document.createElement('div');
                zoom.style.cssText = 'display:flex;flex-direction:column;background:#fff;border-radius:2px;box-shadow:rgba(0,0,0,.3) 0 1px 4px -1px;overflow:hidden';
                [['+', T.zin, 1], ['−', T.zout, -1]].forEach(function (b, i) {
                    var btn = document.createElement('button');
                    btn.type = 'button'; btn.textContent = b[0]; btn.title = b[1]; btn.setAttribute('aria-label', b[1]);
                    btn.style.cssText = 'width:40px;height:40px;border:0;background:#fff;color:#666;font:400 24px/1 Arial,sans-serif;cursor:pointer' + (i ? ';border-top:1px solid #e6e6e6' : '');
                    btn.addEventListener('click', function (e) { e.preventDefault(); gl.easeTo({ zoom: gl.getZoom() + b[2], duration: 250 }); });
                    zoom.appendChild(btn);
                });
                box.appendChild(zoom);
            }
            host.appendChild(box);
            if (!(none && opts.mapTypeControl !== true) && opts.mapTypeControl !== false) {
                var types = document.createElement('div');
                types.className = 'gm-control';
                types.style.cssText = 'position:absolute;z-index:5;top:10px;left:10px;display:flex;background:#fff;border-radius:2px;box-shadow:rgba(0,0,0,.3) 0 1px 4px -1px;overflow:hidden';
                [['roadmap', T.map], ['hybrid', T.sat]].forEach(function (b) {
                    var btn = document.createElement('button');
                    btn.type = 'button'; btn.textContent = b[1]; btn.setAttribute('data-type', b[0]);
                    btn.style.cssText = 'height:40px;padding:0 17px;border:0;background:#fff;color:#565656;font:500 15px/1 Roboto,Arial,sans-serif;cursor:pointer';
                    btn.addEventListener('click', function (e) { e.preventDefault(); self.setMapTypeId(b[0] === 'hybrid' && self.__type === 'satellite' ? 'satellite' : b[0]); });
                    types.appendChild(btn);
                });
                host.appendChild(types);
                this.__typeBox = types;
            }
            this.__paintTypes();
        };
        GMap.prototype.__paintTypes = function () {
            var type = this.__type;
            if (!this.__typeBox) { return; }
            Array.prototype.forEach.call(this.__typeBox.children, function (btn) {
                var on = btn.getAttribute('data-type') === 'roadmap' ? (type === 'roadmap' || type === 'terrain') : (type === 'hybrid' || type === 'satellite');
                btn.style.color = on ? '#000' : '#565656';
                btn.style.fontWeight = on ? '600' : '500';
            });
        };
        GMap.prototype.getDiv = function () { return this.__div; };
        GMap.prototype.getCenter = function () { var c = this.__gl.getCenter(); return new LatLng(c.lat, c.lng); };
        GMap.prototype.setCenter = function (ll) { ll = toLL(ll); if (ll && isFinite(ll.lat()) && isFinite(ll.lng())) { this.__gl.jumpTo({ center: [ll.lng(), ll.lat()] }); } };
        GMap.prototype.panTo = function (ll) { ll = toLL(ll); if (ll && isFinite(ll.lat()) && isFinite(ll.lng())) { this.__gl.easeTo({ center: [ll.lng(), ll.lat()], duration: 450 }); } };
        GMap.prototype.panBy = function (x, y) { this.__gl.panBy([x, y], { duration: 250 }); };
        GMap.prototype.getZoom = function () { return Math.round((this.__gl.getZoom() + 1) * 100) / 100; };
        GMap.prototype.setZoom = function (z) { if (isFinite(z)) { this.__gl.jumpTo({ zoom: Math.max(0, Number(z) - 1) }); } };
        function bbox(b) { var sw = b.getSouthWest(), ne = b.getNorthEast(); return [[sw.lng(), sw.lat()], [ne.lng(), ne.lat()]]; }
        function padding(p) {
            if (p == null) { return 30; }
            if (typeof p === 'number') { return p; }
            return { top: p.top || 0, bottom: p.bottom || 0, left: p.left || 0, right: p.right || 0 };
        }
        GMap.prototype.fitBounds = function (b, pad) {
            b = toBounds(b);
            if (!b || b.isEmpty()) { return; }
            var sw = b.getSouthWest(), ne = b.getNorthEast();
            if (sw.equals(ne)) { this.__gl.jumpTo({ center: [sw.lng(), sw.lat()], zoom: Math.max(this.__gl.getZoom(), 16) }); return; }
            try { this.__gl.fitBounds(bbox(b), { padding: padding(pad), animate: false, maxZoom: 20 }); } catch (error) { /* الخريطة لسه مالهاش مقاس */ }
        };
        GMap.prototype.panToBounds = function (b, pad) { b = toBounds(b); if (b && !b.isEmpty()) { try { this.__gl.fitBounds(bbox(b), { padding: padding(pad), duration: 450, maxZoom: 20 }); } catch (error) { /* */ } } };
        GMap.prototype.getBounds = function () { var b = this.__gl.getBounds(); return new LatLngBounds(new LatLng(b.getSouth(), b.getWest()), new LatLng(b.getNorth(), b.getEast())); };
        GMap.prototype.getMapTypeId = function () { return this.__type; };
        GMap.prototype.setMapTypeId = function (type) {
            if (!type || type === this.__type) { return; }
            this.__type = type;
            this.__ready = false;
            this.__gl.setStyle(style(type));
            this.__paintTypes();
            fire(this, 'maptypeid_changed');
        };
        GMap.prototype.getProjection = function () {
            // إحداثيات العالم بتاعة جوجل (0 – 256)
            return {
                fromLatLngToPoint: function (ll) { ll = toLL(ll); var s = Math.min(Math.max(Math.sin(ll.lat() * Math.PI / 180), -0.9999), 0.9999); return new Point(256 * (0.5 + ll.lng() / 360), 256 * (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI))); },
                fromPointToLatLng: function (p) { var lng = (p.x / 256 - 0.5) * 360, n = Math.PI - 2 * Math.PI * p.y / 256; return new LatLng(180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))), lng); }
            };
        };
        GMap.prototype.setOptions = function (o) {
            o = o || {};
            var gl = this.__gl;
            if (o.center) { this.setCenter(o.center); }
            if (o.zoom != null) { this.setZoom(o.zoom); }
            if (o.mapTypeId) { this.setMapTypeId(o.mapTypeId); }
            if (o.minZoom != null) { gl.setMinZoom(Math.max(0, o.minZoom - 1)); }
            if (o.maxZoom != null) { gl.setMaxZoom(Math.max(0, o.maxZoom - 1)); }
            var gestures = o.gestureHandling;
            if (o.draggable === false || gestures === 'none') { gl.dragPan.disable(); } else if (o.draggable === true || gestures) { gl.dragPan.enable(); }
            if (o.scrollwheel === false || gestures === 'none' || gestures === 'cooperative') { gl.scrollZoom.disable(); } else if (o.scrollwheel === true || gestures === 'greedy' || gestures === 'auto') { gl.scrollZoom.enable(); }
            if (o.disableDoubleClickZoom === true) { gl.doubleClickZoom.disable(); } else if (o.disableDoubleClickZoom === false) { gl.doubleClickZoom.enable(); }
            if (o.keyboardShortcuts === false) { gl.keyboard.disable(); }
            Object.keys(o).forEach(function (k) { this.__opts[k] = o[k]; }, this);
        };
        GMap.prototype.getTilt = function () { return 0; };
        GMap.prototype.setTilt = function () {};
        GMap.prototype.getHeading = function () { return 0; };
        GMap.prototype.setHeading = function () {};
        GMap.prototype.getStreetView = function () { return { setVisible: function () {}, getVisible: function () { return false; }, setPosition: function () {}, addListener: function () { return { remove: function () {} }; } }; };
        GMap.prototype.getClickableIcons = function () { return false; };
        GMap.prototype.setClickableIcons = function () {};
        maps.Map = GMap;

        // ---------------------------------------------------------------- العلامات
        function pinSvg(color) {
            return '<svg xmlns="http://www.w3.org/2000/svg" width="27" height="43" viewBox="0 0 27 43"><path d="M13.5 0C6 0 0 6 0 13.4c0 10 13.5 29.6 13.5 29.6S27 23.4 27 13.4C27 6 21 0 13.5 0Z" fill="' + (color || '#EA4335') + '" stroke="#C5221F" stroke-width="1"/><circle cx="13.5" cy="13.5" r="4.6" fill="#B31412"/></svg>';
        }
        function Marker(opts) {
            opts = opts || {};
            this.__id = ++uid;
            this.__pos = toLL(opts.position);
            this.__drag = !!opts.draggable;
            this.__icon = opts.icon;
            this.__title = opts.title || '';
            this.__label = opts.label;
            this.__visible = opts.visible !== false;
            this.__z = opts.zIndex;
            this.__opacity = opts.opacity;
            this.__cursor = opts.cursor;
            this.__map = null;
            if (opts.map) { this.setMap(opts.map); }
        }
        inherit(Marker);
        Marker.MAX_ZINDEX = 1000000;
        Marker.prototype.__element = function () {
            var self = this, icon = this.__icon, el = document.createElement('div'), anchor = 'bottom', offset = [0, 0];
            el.setAttribute('data-gm-marker', '');
            if (icon && typeof icon === 'object' && icon.path !== undefined && icon.path !== null && typeof icon.path === 'number') {
                // رمز (دايرة) زي SymbolPath.CIRCLE
                var scale = Number(icon.scale || 10), stroke = icon.strokeWeight != null ? Number(icon.strokeWeight) : 1;
                el.style.cssText = 'width:' + scale * 2 + 'px;height:' + scale * 2 + 'px;border-radius:50%;box-sizing:content-box;background:' + (icon.fillColor || '#000') + ';opacity:' + (icon.fillOpacity != null ? icon.fillOpacity : 1) + ';border:' + stroke + 'px solid ' + (icon.strokeColor || '#000');
                anchor = 'center';
            } else if (icon && (typeof icon === 'string' || icon.url)) {
                var img = document.createElement('img');
                img.src = typeof icon === 'string' ? icon : icon.url;
                img.alt = '';
                img.draggable = false;
                if (icon.scaledSize) { img.style.width = icon.scaledSize.width + 'px'; img.style.height = icon.scaledSize.height + 'px'; }
                el.appendChild(img);
                if (icon.anchor && icon.scaledSize) { anchor = 'top-left'; offset = [-icon.anchor.x, -icon.anchor.y]; }
            } else {
                el.innerHTML = pinSvg();
                el.style.width = '27px'; el.style.height = '43px';
            }
            if (this.__label) {
                var text = typeof this.__label === 'string' ? this.__label : this.__label.text;
                var label = document.createElement('span');
                label.textContent = text || '';
                label.style.cssText = 'position:absolute;left:0;right:0;top:' + (anchor === 'center' ? '50%' : '9px') + ';transform:translateY(' + (anchor === 'center' ? '-50%' : '0') + ');text-align:center;font:700 ' + ((this.__label && this.__label.fontSize) || '12px') + ' Arial,sans-serif;color:' + ((this.__label && this.__label.color) || '#fff');
                el.style.position = 'relative';
                el.appendChild(label);
            }
            el.title = this.__title;
            el.style.cursor = this.__cursor || (this.__drag ? 'grab' : 'pointer');
            if (this.__z != null) { el.style.zIndex = this.__z; }
            if (this.__opacity != null) { el.style.opacity = this.__opacity; }
            if (!this.__visible) { el.style.display = 'none'; }
            var at = function () { return { latLng: self.getPosition() }; };
            el.addEventListener('click', function (e) { e.stopPropagation(); fire(self, 'click', at()); });
            el.addEventListener('dblclick', function (e) { e.stopPropagation(); e.preventDefault(); fire(self, 'dblclick', at()); });
            el.addEventListener('contextmenu', function (e) { e.stopPropagation(); e.preventDefault(); fire(self, 'rightclick', at()); });
            el.addEventListener('mouseover', function () { fire(self, 'mouseover', at()); });
            el.addEventListener('mouseout', function () { fire(self, 'mouseout', at()); });
            el.addEventListener('mousedown', function () { fire(self, 'mousedown', at()); });
            el.addEventListener('mouseup', function () { fire(self, 'mouseup', at()); });
            return { el: el, anchor: anchor, offset: offset };
        };
        Marker.prototype.__build = function () {
            var self = this;
            if (this.__gm) { this.__gm.remove(); this.__gm = null; }
            if (!this.__map || !this.__pos) { return; }
            var made = this.__element();
            var gm = this.__gm = new window.maplibregl.Marker({ element: made.el, anchor: made.anchor, offset: made.offset, draggable: this.__drag }).setLngLat([this.__pos.lng(), this.__pos.lat()]).addTo(this.__map.__gl);
            var sync = function () { var l = gm.getLngLat(); self.__pos = new LatLng(l.lat, l.lng); };
            gm.on('dragstart', function () { sync(); made.el.style.cursor = 'grabbing'; fire(self, 'dragstart', { latLng: self.__pos }); });
            gm.on('drag', function () { sync(); fire(self, 'drag', { latLng: self.__pos }); fire(self, 'position_changed'); });
            gm.on('dragend', function () { sync(); made.el.style.cursor = 'grab'; fire(self, 'dragend', { latLng: self.__pos }); });
        };
        Marker.prototype.setMap = function (map) {
            if (map && !(map instanceof GMap)) { map = null; }
            this.__map = map || null;
            this.__build();
            fire(this, 'map_changed');
        };
        Marker.prototype.getMap = function () { return this.__map; };
        Marker.prototype.getPosition = function () { return this.__pos; };
        Marker.prototype.setPosition = function (p) {
            this.__pos = toLL(p);
            if (this.__gm && this.__pos) { this.__gm.setLngLat([this.__pos.lng(), this.__pos.lat()]); } else { this.__build(); }
            fire(this, 'position_changed');
        };
        Marker.prototype.getDraggable = function () { return this.__drag; };
        Marker.prototype.setDraggable = function (d) { this.__drag = !!d; if (this.__gm) { this.__gm.setDraggable(this.__drag); } };
        Marker.prototype.getIcon = function () { return this.__icon; };
        Marker.prototype.setIcon = function (icon) { this.__icon = icon; this.__build(); };
        Marker.prototype.getVisible = function () { return this.__visible; };
        Marker.prototype.setVisible = function (v) { this.__visible = !!v; if (this.__gm) { this.__gm.getElement().style.display = v ? '' : 'none'; } };
        Marker.prototype.getTitle = function () { return this.__title; };
        Marker.prototype.setTitle = function (t) { this.__title = t || ''; if (this.__gm) { this.__gm.getElement().title = this.__title; } };
        Marker.prototype.setLabel = function (l) { this.__label = l; this.__build(); };
        Marker.prototype.getLabel = function () { return this.__label; };
        Marker.prototype.setZIndex = function (z) { this.__z = z; if (this.__gm) { this.__gm.getElement().style.zIndex = z; } };
        Marker.prototype.getZIndex = function () { return this.__z; };
        Marker.prototype.setOpacity = function (o) { this.__opacity = o; if (this.__gm) { this.__gm.getElement().style.opacity = o; } };
        Marker.prototype.setAnimation = function () {};
        Marker.prototype.getAnimation = function () { return null; };
        Marker.prototype.setCursor = function (c) { this.__cursor = c; if (this.__gm) { this.__gm.getElement().style.cursor = c; } };
        Marker.prototype.setClickable = function () {};
        Marker.prototype.setOptions = function (o) {
            o = o || {};
            if ('icon' in o) { this.__icon = o.icon; }
            if ('label' in o) { this.__label = o.label; }
            if ('title' in o) { this.__title = o.title; }
            if ('draggable' in o) { this.__drag = !!o.draggable; }
            if ('visible' in o) { this.__visible = o.visible !== false; }
            if ('zIndex' in o) { this.__z = o.zIndex; }
            if ('position' in o) { this.__pos = toLL(o.position); }
            if ('map' in o) { this.__map = o.map instanceof GMap ? o.map : null; }
            this.__build();
        };
        maps.Marker = Marker;

        // ---------------------------------------------------------------- الطبقات اللي بتترسم على الخريطة (مضلع / خط / دايرة / صورة)
        function Layered() {}
        inherit(Layered);
        Layered.prototype.setMap = function (map) {
            if (map && !(map instanceof GMap)) { map = null; }
            if (this.__map === map) { return; }
            this.__detach();
            if (this.__map) { var list = this.__map.__layered, at = list.indexOf(this); if (at > -1) { list.splice(at, 1); } }
            this.__map = map || null;
            if (map) { map.__layered.push(this); this.__attach(false); }
            fire(this, 'map_changed');
        };
        Layered.prototype.getMap = function () { return this.__map || null; };
        Layered.prototype.__lid = function () { if (!this.__key) { this.__key = 'gm-shape-' + (++uid); } return this.__key; };
        Layered.prototype.__detach = function () {
            var map = this.__map, key = this.__key;
            if (!map || !key) { return; }
            var gl = map.__gl;
            try {
                [key + '-fill', key + '-line', key].forEach(function (id) { if (gl.getLayer(id)) { gl.removeLayer(id); } });
                if (gl.getSource(key)) { gl.removeSource(key); }
            } catch (error) { /* الستايل بيتغير */ }
        };
        Layered.prototype.__attach = function (again) {
            var self = this, map = this.__map;
            if (!map) { return; }
            if (!map.__ready) { return; }      // بيتضاف لما الستايل يجهز (style.load)
            if (again) { this.__detach(); }
            try { this.__draw(map.__gl, this.__lid()); } catch (error) { setTimeout(function () { throw error; }); }
            if (!this.__clicks) {
                this.__clicks = true;
                var gl = map.__gl;
                ['-fill', '-line', ''].forEach(function (suffix) {
                    gl.on('click', self.__lid() + suffix, function (e) { if (self.__map === map && self.__clickable !== false) { e.preventDefault && e.preventDefault(); fire(self, 'click', { latLng: new LatLng(e.lngLat.lat, e.lngLat.lng) }); } });
                    gl.on('contextmenu', self.__lid() + suffix, function (e) { if (self.__map === map) { fire(self, 'rightclick', { latLng: new LatLng(e.lngLat.lat, e.lngLat.lng) }); } });
                });
            }
        };
        Layered.prototype.__refresh = function () {
            var map = this.__map;
            if (!map || !map.__ready || !this.__key) { if (map && map.__ready) { this.__attach(false); } return; }
            var source = map.__gl.getSource(this.__key);
            if (source && source.setData && this.__data) { source.setData(this.__data()); } else { this.__attach(true); }
        };

        function toPath(v) {
            if (v instanceof MVCArray) { return v; }
            return new MVCArray((v || []).map(toLL).filter(Boolean));
        }
        function Poly(opts, closed) {
            this.__closed = closed;
            this.__style = { strokeColor: '#000000', strokeOpacity: 1, strokeWeight: 3, fillColor: '#000000', fillOpacity: 0.3, visible: true };
            this.__paths = new MVCArray([new MVCArray()]);
            this.setOptions(opts || {});
            if (opts && opts.map) { this.setMap(opts.map); }
        }
        Poly.prototype = Object.create(Layered.prototype);
        Poly.prototype.__watch = function (path) {
            var self = this;
            ['insert_at', 'remove_at', 'set_at'].forEach(function (name) { event.addListener(path, name, function () { self.__refresh(); }); });
        };
        Poly.prototype.setPaths = function (paths) {
            var self = this;
            if (paths instanceof MVCArray && paths.getLength() && paths.getAt(0) instanceof MVCArray) { this.__paths = paths; }
            else if (Array.isArray(paths) && paths.length && (Array.isArray(paths[0]) || paths[0] instanceof MVCArray) && !(typeof paths[0][0] === 'number')) { this.__paths = new MVCArray(paths.map(toPath)); }
            else { this.__paths = new MVCArray([toPath(paths)]); }
            this.__paths.forEach(function (p) { self.__watch(p); });
            this.__refresh();
        };
        Poly.prototype.getPaths = function () { return this.__paths; };
        Poly.prototype.setPath = function (path) { this.setPaths(path); };
        Poly.prototype.getPath = function () { return this.__paths.getAt(0); };
        Poly.prototype.setOptions = function (o) {
            var s = this.__style;
            ['strokeColor', 'strokeOpacity', 'strokeWeight', 'fillColor', 'fillOpacity', 'zIndex', 'visible'].forEach(function (k) { if (k in o) { s[k] = o[k]; } });
            if ('clickable' in o) { this.__clickable = o.clickable; }
            if ('editable' in o) { this.__editable = !!o.editable; }
            if (o.paths) { this.setPaths(o.paths); } else if (o.path) { this.setPaths(o.path); } else { this.__refresh(); }
            if (o.map !== undefined && o.map !== this.__map) { this.setMap(o.map); }
        };
        Poly.prototype.setVisible = function (v) { this.__style.visible = !!v; this.__attach(true); };
        Poly.prototype.getVisible = function () { return this.__style.visible !== false; };
        Poly.prototype.setEditable = function (v) { this.__editable = !!v; };
        Poly.prototype.getEditable = function () { return !!this.__editable; };
        Poly.prototype.setDraggable = function () {};
        Poly.prototype.getDraggable = function () { return false; };
        Poly.prototype.__data = function () {
            var closed = this.__closed;
            var rings = this.__paths.getArray().map(function (path) {
                var ring = path.getArray().map(function (ll) { return [ll.lng(), ll.lat()]; });
                if (closed && ring.length > 2) { ring.push(ring[0]); }
                return ring;
            }).filter(function (ring) { return ring.length > 1; });
            if (!rings.length) { return { type: 'FeatureCollection', features: [] }; }
            var geometry = closed && rings[0].length > 3 ? { type: 'Polygon', coordinates: rings } : { type: 'MultiLineString', coordinates: rings };
            return { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: geometry }] };
        };
        Poly.prototype.__draw = function (gl, key) {
            var s = this.__style, show = s.visible !== false ? 'visible' : 'none';
            gl.addSource(key, { type: 'geojson', data: this.__data() });
            if (this.__closed) { gl.addLayer({ id: key + '-fill', type: 'fill', source: key, layout: { visibility: show }, paint: { 'fill-color': s.fillColor, 'fill-opacity': Number(s.fillOpacity) } }); }
            gl.addLayer({ id: key + '-line', type: 'line', source: key, layout: { visibility: show, 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': s.strokeColor, 'line-opacity': Number(s.strokeOpacity), 'line-width': Number(s.strokeWeight) } });
        };
        function Polygon(opts) { Poly.call(this, opts, true); }
        Polygon.prototype = Object.create(Poly.prototype);
        maps.Polygon = Polygon;
        function Polyline(opts) { Poly.call(this, opts, false); }
        Polyline.prototype = Object.create(Poly.prototype);
        maps.Polyline = Polyline;

        function Circle(opts) {
            opts = opts || {};
            this.__center = toLL(opts.center);
            this.__radius = Number(opts.radius || 0);
            Poly.call(this, opts, true);
            this.__refreshCircle();
        }
        Circle.prototype = Object.create(Poly.prototype);
        Circle.prototype.__refreshCircle = function () {
            if (!this.__center) { return; }
            var pts = [], c = this.__center, r = this.__radius;
            for (var i = 0; i < 64; i++) {
                var a = i / 64 * 2 * Math.PI;
                pts.push(new LatLng(c.lat() + r / 111320 * Math.sin(a), c.lng() + r / (111320 * Math.cos(c.lat() * Math.PI / 180)) * Math.cos(a)));
            }
            this.__paths = new MVCArray([new MVCArray(pts)]);
            this.__refresh();
        };
        Circle.prototype.getCenter = function () { return this.__center; };
        Circle.prototype.setCenter = function (c) { this.__center = toLL(c); this.__refreshCircle(); fire(this, 'center_changed'); };
        Circle.prototype.getRadius = function () { return this.__radius; };
        Circle.prototype.setRadius = function (r) { this.__radius = Number(r); this.__refreshCircle(); fire(this, 'radius_changed'); };
        Circle.prototype.getBounds = function () { var b = new LatLngBounds(); this.__paths.getAt(0).forEach(function (p) { b.extend(p); }); return b; };
        maps.Circle = Circle;
        function Rectangle(opts) {
            opts = opts || {};
            Poly.call(this, opts, true);
            if (opts.bounds) { this.setBounds(opts.bounds); }
        }
        Rectangle.prototype = Object.create(Poly.prototype);
        Rectangle.prototype.setBounds = function (b) {
            b = toBounds(b);
            this.__bounds = b;
            if (!b) { return; }
            var sw = b.getSouthWest(), ne = b.getNorthEast();
            this.__paths = new MVCArray([new MVCArray([new LatLng(ne.lat(), sw.lng()), ne, new LatLng(sw.lat(), ne.lng()), sw])]);
            this.__refresh();
            fire(this, 'bounds_changed');
        };
        Rectangle.prototype.getBounds = function () { return this.__bounds; };
        maps.Rectangle = Rectangle;

        function GroundOverlay(url, bounds, opts) {
            opts = opts || {};
            this.__url = url;
            this.__bounds = toBounds(bounds);
            this.__opacity = opts.opacity != null ? Number(opts.opacity) : 1;
            this.__clickable = opts.clickable !== false;
            if (opts.map) { this.setMap(opts.map); }
        }
        GroundOverlay.prototype = Object.create(Layered.prototype);
        GroundOverlay.prototype.__draw = function (gl, key) {
            var b = this.__bounds;
            if (!b || !this.__url) { return; }
            var sw = b.getSouthWest(), ne = b.getNorthEast();
            gl.addSource(key, { type: 'image', url: new URL(this.__url, window.location.href).href, coordinates: [[sw.lng(), ne.lat()], [ne.lng(), ne.lat()], [ne.lng(), sw.lat()], [sw.lng(), sw.lat()]] });
            gl.addLayer({ id: key, type: 'raster', source: key, paint: { 'raster-opacity': this.__opacity, 'raster-fade-duration': 0 } });
        };
        GroundOverlay.prototype.getBounds = function () { return this.__bounds; };
        GroundOverlay.prototype.getUrl = function () { return this.__url; };
        GroundOverlay.prototype.getOpacity = function () { return this.__opacity; };
        GroundOverlay.prototype.setOpacity = function (o) {
            this.__opacity = Number(o);
            var map = this.__map;
            try { if (map && map.__ready && this.__key && map.__gl.getLayer(this.__key)) { map.__gl.setPaintProperty(this.__key, 'raster-opacity', this.__opacity); } } catch (error) { /* */ }
        };
        maps.GroundOverlay = GroundOverlay;

        // ---------------------------------------------------------------- OverlayView
        function OverlayView() {}
        inherit(OverlayView);
        OverlayView.prototype.setMap = function (map) {
            if (map && !(map instanceof GMap)) { map = null; }
            var old = this.__map || null;
            if (old === map) { return; }
            if (old) {
                var list = old.__overlays, at = list.indexOf(this);
                if (at > -1) { list.splice(at, 1); }
                if (this.__added && typeof this.onRemove === 'function') { try { this.onRemove(); } catch (error) { setTimeout(function () { throw error; }); } }
                this.__added = false;
            }
            this.__map = map || null;
            if (map) {
                var self = this;
                map.__overlays.push(this);
                // زي جوجل: onAdd بعد ما الخريطة تجهز ، وبعده draw
                setTimeout(function () {
                    if (self.__map !== map || self.__added) { return; }
                    self.__added = true;
                    if (typeof self.onAdd === 'function') { self.onAdd(); }
                    if (typeof self.draw === 'function') { self.draw(); }
                }, 0);
            }
        };
        OverlayView.prototype.getMap = function () { return this.__map || null; };
        OverlayView.prototype.getPanes = function () { return this.__map ? this.__map.__panes : null; };
        OverlayView.prototype.getProjection = function () { return this.__map ? this.__map.__projection : null; };
        OverlayView.preventMapHitsAndGesturesFrom = function (el) { ['click', 'dblclick', 'contextmenu', 'wheel', 'mousedown', 'touchstart', 'pointerdown'].forEach(function (name) { el.addEventListener(name, function (e) { e.stopPropagation(); }); }); };
        OverlayView.preventMapHitsFrom = function (el) { ['click', 'dblclick', 'contextmenu'].forEach(function (name) { el.addEventListener(name, function (e) { e.stopPropagation(); }); }); };
        maps.OverlayView = OverlayView;

        // ---------------------------------------------------------------- InfoWindow
        function InfoWindow(opts) { opts = opts || {}; this.__content = opts.content || ''; this.__pos = toLL(opts.position); this.__popup = null; }
        inherit(InfoWindow);
        InfoWindow.prototype.setContent = function (c) { this.__content = c; if (this.__popup) { this.__fill(); } };
        InfoWindow.prototype.getContent = function () { return this.__content; };
        InfoWindow.prototype.setPosition = function (p) { this.__pos = toLL(p); if (this.__popup && this.__pos) { this.__popup.setLngLat([this.__pos.lng(), this.__pos.lat()]); } };
        InfoWindow.prototype.getPosition = function () { return this.__pos; };
        InfoWindow.prototype.__fill = function () { if (typeof this.__content === 'string') { this.__popup.setHTML(this.__content); } else if (this.__content) { this.__popup.setDOMContent(this.__content); } };
        InfoWindow.prototype.open = function (a, b) {
            var map = a instanceof GMap ? a : (a && a.map) || (b && b.getMap ? b.getMap() : null) || (b instanceof GMap ? b : null);
            var anchor = a && a.anchor ? a.anchor : (b instanceof Marker ? b : null);
            if (!map && anchor) { map = anchor.getMap(); }
            if (!map) { return; }
            var pos = anchor ? anchor.getPosition() : this.__pos;
            if (!pos) { return; }
            var self = this;
            this.close();
            this.__popup = new window.maplibregl.Popup({ offset: anchor ? [0, -38] : 0, maxWidth: '320px' }).setLngLat([pos.lng(), pos.lat()]);
            this.__fill();
            this.__popup.addTo(map.__gl);
            this.__popup.on('close', function () { fire(self, 'closeclick'); });
            fire(this, 'domready');
        };
        InfoWindow.prototype.close = function () { if (this.__popup) { this.__popup.remove(); this.__popup = null; } };
        InfoWindow.prototype.setOptions = function (o) { if (o && 'content' in o) { this.setContent(o.content); } if (o && o.position) { this.setPosition(o.position); } };
        maps.InfoWindow = InfoWindow;

        // ---------------------------------------------------------------- البحث (OpenStreetMap)
        var CACHE = {};
        var SAMPLE = [
            ['القاهرة الجديدة', 'New Cairo', 30.0074, 31.4913], ['التجمع الخامس', 'Fifth Settlement', 30.0084, 31.4428], ['مدينتي', 'Madinaty', 30.1072, 31.6384],
            ['الشيخ زايد', 'Sheikh Zayed', 30.0444, 30.9813], ['6 أكتوبر', '6th of October', 29.9725, 30.9431], ['العاصمة الإدارية الجديدة', 'New Administrative Capital', 30.0196, 31.7614],
            ['العين السخنة', 'Ain Sokhna', 29.6007, 32.3155], ['العلمين الجديدة', 'New Alamein', 30.8152, 28.9548], ['رأس الحكمة', 'Ras El Hekma', 31.2205, 27.8516],
            ['الساحل الشمالي', 'North Coast', 30.9616, 28.8227], ['مستقبل سيتي', 'Mostakbal City', 30.1449, 31.6779], ['الرحاب', 'Al Rehab', 30.0592, 31.4955],
            ['الشروق', 'El Shorouk', 30.1281, 31.6087], ['الجونة', 'El Gouna', 27.3946, 33.6782], ['دبي كريك هاربر', 'Dubai Creek Harbour', 25.2006, 55.3500]
        ];
        function addressOf(p, name) {
            return [p.district, p.city, p.county, p.state, p.country].filter(function (x, i, a) { return x && x !== name && a.indexOf(x) === i; }).join(LANG === 'en' ? ', ' : '، ');
        }
        function remember(place) { CACHE[place.place_id] = place; return place; }
        function fromPhoton(f) {
            var p = f.properties || {}, c = (f.geometry || {}).coordinates || [0, 0];
            var name = p.name || [p.street, p.housenumber].filter(Boolean).join(' ') || p.city || '';
            var address = addressOf(p, name), e = p.extent;
            return remember({
                place_id: 'osm:' + (p.osm_type || '') + (p.osm_id || ++uid), name: name, __address: address,
                formatted_address: [name, address].filter(Boolean).join(LANG === 'en' ? ', ' : '، '),
                geometry: { location: new LatLng(c[1], c[0]), viewport: e && e.length === 4 ? new LatLngBounds(new LatLng(e[3], e[0]), new LatLng(e[1], e[2])) : null },
                types: [p.osm_value || p.type || 'place'], __osm: { type: p.osm_type, id: p.osm_id }
            });
        }
        function fromNominatim(item) {
            var b = item.boundingbox, name = item.name || String(item.display_name || '').split(',')[0];
            return remember({
                place_id: 'osm:' + (item.osm_type || '').charAt(0).toUpperCase() + item.osm_id, name: name,
                __address: String(item.display_name || '').split(',').slice(1, 4).join('،').trim(), formatted_address: item.display_name || name,
                geometry: { location: new LatLng(Number(item.lat), Number(item.lon)), viewport: b ? new LatLngBounds(new LatLng(Number(b[0]), Number(b[2])), new LatLng(Number(b[1]), Number(b[3]))) : null },
                types: [item.type || 'place'], __osm: { type: item.osm_type, id: item.osm_id }, __ring: item.geojson || null
            });
        }
        function fromSample(row) {
            var name = LANG === 'en' ? row[1] : row[0];
            return remember({ place_id: 'sample:' + row[1], name: name, __address: LANG === 'en' ? 'Egypt' : 'مصر', formatted_address: name + (LANG === 'en' ? ', Egypt' : '، مصر'),
                geometry: { location: new LatLng(row[2], row[3]), viewport: new LatLngBounds(new LatLng(row[2] - 0.03, row[3] - 0.03), new LatLng(row[2] + 0.03, row[3] + 0.03)) }, types: ['locality'] });
        }
        function fold(t) { return String(t || '').toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim(); }
        function timeout(promise, ms) { return Promise.race([promise, new Promise(function (_, reject) { setTimeout(function () { reject(new Error('timeout')); }, ms); })]); }
        function search(q, near, done) {
            q = String(q || '').trim();
            if (q.length < 2) { done([]); return; }
            var c = near || { lat: 30.0444, lng: 31.2357 };
            var photon = 'https://photon.komoot.io/api/?limit=7&q=' + encodeURIComponent(q) + '&lat=' + c.lat + '&lon=' + c.lng + (LANG === 'en' ? '&lang=en' : '');
            timeout(fetch(photon).then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.json(); }), 6000)
                .then(function (data) { var list = (data.features || []).map(fromPhoton).filter(function (p) { return p.name; }); if (!list.length) { throw new Error('empty'); } return list; })
                .catch(function () {
                    var nominatim = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=7&accept-language=' + LANG + '&q=' + encodeURIComponent(q);
                    return timeout(fetch(nominatim).then(function (r) { if (!r.ok) { throw new Error(r.status); } return r.json(); }), 7000).then(function (items) { return (items || []).map(fromNominatim); });
                })
                .catch(function () {
                    var want = fold(q);
                    return SAMPLE.filter(function (row) { return fold(row[0]).indexOf(want) > -1 || fold(row[1]).indexOf(want) > -1; }).map(fromSample);
                })
                .then(function (list) { done(list || []); });
        }
        maps.__search = search;
        maps.__places = CACHE;
        function biasOf(req) {
            var b = req && (req.locationBias || req.location || req.bounds);
            if (!b) { return null; }
            if (b instanceof LatLng) { return { lat: b.lat(), lng: b.lng() }; }
            if (b instanceof LatLngBounds) { var c = b.getCenter(); return { lat: c.lat(), lng: c.lng() }; }
            if (b.center) { var ll = toLL(b.center); return ll ? { lat: ll.lat(), lng: ll.lng() } : null; }
            return null;
        }

        var places = maps.places = {};
        places.PlacesServiceStatus = { OK: 'OK', ZERO_RESULTS: 'ZERO_RESULTS', INVALID_REQUEST: 'INVALID_REQUEST', OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT', REQUEST_DENIED: 'REQUEST_DENIED', UNKNOWN_ERROR: 'UNKNOWN_ERROR', NOT_FOUND: 'NOT_FOUND' };
        places.AutocompleteSessionToken = function () { this.id = ++uid; };
        function clone(place) { return place ? Object.assign({}, place) : place; }
        function prediction(p) { return { description: p.formatted_address, place_id: p.place_id, structured_formatting: { main_text: p.name, secondary_text: p.__address || '' }, terms: [{ value: p.name, offset: 0 }], types: p.types, matched_substrings: [] }; }
        function AutocompleteService() {}
        AutocompleteService.prototype.getPlacePredictions = function (req, cb) {
            var promise = new Promise(function (resolve) {
                search(req && req.input, biasOf(req), function (list) {
                    var predictions = list.map(prediction);
                    if (typeof cb === 'function') { cb(predictions.length ? predictions : null, predictions.length ? places.PlacesServiceStatus.OK : places.PlacesServiceStatus.ZERO_RESULTS); }
                    resolve({ predictions: predictions });
                });
            });
            return promise;
        };
        AutocompleteService.prototype.getQueryPredictions = AutocompleteService.prototype.getPlacePredictions;
        places.AutocompleteService = AutocompleteService;
        function PlacesService() {}
        PlacesService.prototype.getDetails = function (req, cb) {
            var place = CACHE[req && req.placeId];
            setTimeout(function () { cb(place ? clone(place) : null, place ? places.PlacesServiceStatus.OK : places.PlacesServiceStatus.NOT_FOUND); }, 0);
        };
        PlacesService.prototype.textSearch = function (req, cb) { search(req && (req.query || req.keyword), biasOf(req), function (list) { cb(list.map(clone), list.length ? 'OK' : 'ZERO_RESULTS', { hasNextPage: false }); }); };
        PlacesService.prototype.findPlaceFromQuery = function (req, cb) { search(req && req.query, biasOf(req), function (list) { list = list.slice(0, 1); cb(list.map(clone), list.length ? 'OK' : 'ZERO_RESULTS'); }); };
        PlacesService.prototype.nearbySearch = function (req, cb) { setTimeout(function () { cb([], 'ZERO_RESULTS', { hasNextPage: false }); }, 0); };
        places.PlacesService = PlacesService;

        // قايمة الاقتراحات تحت خانة البحث (زي .pac-container بتاعة جوجل)
        var cssDone = false;
        function pacCss() {
            if (cssDone) { return; }
            cssDone = true;
            var st = document.createElement('style');
            st.textContent = '.pac-container{position:absolute;z-index:100000;background:#fff;border-radius:0 0 6px 6px;box-shadow:0 4px 12px rgba(0,0,0,.18);border-top:1px solid #d9d9d9;font:14px/1.5 Cairo,Roboto,Arial,sans-serif;overflow:hidden;box-sizing:border-box}'
                + '.pac-item{display:flex;gap:8px;align-items:flex-start;padding:7px 10px;cursor:pointer;border-top:1px solid #f0f0f0;color:#515151}'
                + '.pac-item:first-child{border-top:0}.pac-item:hover,.pac-item-selected{background:#ebf2fe}'
                + '.pac-item b{color:#000;font-weight:700}.pac-item small{display:block;color:#7a7a7a;font-size:12.5px}'
                + '.pac-icon{flex:none;width:15px;height:20px;margin-top:2px;background:no-repeat center/15px url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27><path fill=%27%23999%27 d=%27M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z%27/></svg>")}'
                + '.pac-logo{padding:4px 10px;text-align:end;color:#9aa0a6;font-size:11px;border-top:1px solid #f0f0f0}'
                + '.pac-empty{padding:9px 12px;color:#7a7a7a}';
            document.head.appendChild(st);
        }
        function Autocomplete(input, opts) {
            var self = this;
            this.__input = input;
            this.__opts = opts || {};
            this.__place = null;
            this.__list = [];
            this.__active = -1;
            if (!input) { return; }
            pacCss();
            input.setAttribute('autocomplete', 'off');
            var box = this.__box = document.createElement('div');
            box.className = 'pac-container';
            box.style.display = 'none';
            box.setAttribute('data-gm-stop', '');
            document.body.appendChild(box);
            var timer = null, asked = '';
            var place = function () {
                var r = input.getBoundingClientRect();
                box.style.left = (r.left + window.scrollX) + 'px';
                box.style.top = (r.bottom + window.scrollY) + 'px';
                box.style.width = Math.max(220, r.width) + 'px';
                box.dir = window.getComputedStyle(input).direction || 'rtl';
            };
            var close = function () { box.style.display = 'none'; self.__active = -1; };
            var paint = function () {
                box.innerHTML = '';
                if (!self.__list.length) {
                    var none = document.createElement('div'); none.className = 'pac-empty'; none.textContent = T.none; box.appendChild(none);
                } else {
                    self.__list.forEach(function (p, i) {
                        var row = document.createElement('div');
                        row.className = 'pac-item' + (i === self.__active ? ' pac-item-selected' : '');
                        row.innerHTML = '<span class="pac-icon"></span><span><b></b><small></small></span>';
                        row.querySelector('b').textContent = p.name;
                        row.querySelector('small').textContent = p.__address || '';
                        row.addEventListener('mousedown', function (e) { e.preventDefault(); choose(i); });
                        box.appendChild(row);
                    });
                }
                var logo = document.createElement('div'); logo.className = 'pac-logo'; logo.textContent = T.powered; box.appendChild(logo);
                place();
                box.style.display = 'block';
            };
            var choose = function (i) {
                var p = self.__list[i];
                if (!p) { return; }
                self.__place = clone(p);
                input.value = p.formatted_address || p.name;
                close();
                fire(self, 'place_changed');
            };
            input.addEventListener('input', function () {
                clearTimeout(timer);
                var q = input.value.trim();
                if (q.length < 2) { close(); return; }
                timer = setTimeout(function () {
                    asked = q;
                    var bounds = self.__bounds ? self.__bounds.getCenter() : null;
                    search(q, bounds ? { lat: bounds.lat(), lng: bounds.lng() } : null, function (list) {
                        if (asked !== q || input.value.trim() !== q) { return; }
                        self.__list = list.slice(0, 6);
                        self.__active = -1;
                        if (document.activeElement === input) { paint(); }
                    });
                }, 250);
            });
            input.addEventListener('keydown', function (e) {
                if (box.style.display === 'none') {
                    if (e.key === 'Enter') {
                        // زي جوجل: Enter من غير اختيار = place_changed بالاسم بس (الصفحة بتقرر)
                        self.__place = { name: input.value };
                        fire(self, 'place_changed');
                    }
                    return;
                }
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    var n = self.__list.length;
                    if (!n) { return; }
                    self.__active = (self.__active + (e.key === 'ArrowDown' ? 1 : -1) + n) % n;
                    paint();
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    choose(self.__active > -1 ? self.__active : 0);
                } else if (e.key === 'Escape') { close(); }
            });
            input.addEventListener('blur', function () { setTimeout(close, 150); });
            window.addEventListener('resize', function () { if (box.style.display !== 'none') { place(); } });
            window.addEventListener('scroll', function () { if (box.style.display !== 'none') { place(); } }, true);
        }
        inherit(Autocomplete);
        Autocomplete.prototype.getPlace = function () { return this.__place || { name: this.__input ? this.__input.value : '' }; };
        Autocomplete.prototype.setBounds = function (b) { this.__bounds = toBounds(b); };
        Autocomplete.prototype.getBounds = function () { return this.__bounds; };
        Autocomplete.prototype.setComponentRestrictions = function () {};
        Autocomplete.prototype.setFields = function () {};
        Autocomplete.prototype.setTypes = function () {};
        Autocomplete.prototype.setOptions = function () {};
        Autocomplete.prototype.bindTo = function (key, map) { if (key === 'bounds' && map && map.getBounds) { var self = this; event.addListener(map, 'idle', function () { self.__bounds = map.getBounds(); }); } };
        places.Autocomplete = Autocomplete;
        function SearchBox(input, opts) { Autocomplete.call(this, input, opts); var self = this; event.addListener(this, 'place_changed', function () { fire(self, 'places_changed'); }); }
        SearchBox.prototype = Object.create(Autocomplete.prototype);
        SearchBox.prototype.getPlaces = function () { return this.__place && this.__place.geometry ? [this.__place] : []; };
        places.SearchBox = SearchBox;

        function Geocoder() {}
        Geocoder.prototype.geocode = function (req, cb) {
            req = req || {};
            var done = function (list, status) { if (typeof cb === 'function') { cb(list, status); } };
            if (req.location) {
                var ll = toLL(req.location);
                var url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=' + LANG + '&lat=' + ll.lat() + '&lon=' + ll.lng();
                return timeout(fetch(url).then(function (r) { return r.json(); }), 7000).then(function (item) {
                    var p = item && item.lat ? fromNominatim(item) : null;
                    var list = p ? [p] : [];
                    done(list, list.length ? 'OK' : 'ZERO_RESULTS');
                    return { results: list };
                }, function () { done([], 'ZERO_RESULTS'); return { results: [] }; });
            }
            return new Promise(function (resolve) { search(req.address, biasOf(req), function (list) { done(list, list.length ? 'OK' : 'ZERO_RESULTS'); resolve({ results: list }); }); });
        };
        maps.Geocoder = Geocoder;

        maps.importLibrary = function (name) { return Promise.resolve(name === 'places' ? places : maps); };
    }

    loadLib(function () {
        define();
        var cb = PARAMS.callback && window[PARAMS.callback];
        if (typeof cb === 'function') {
            try { cb(); } catch (error) { setTimeout(function () { throw error; }); }
        }
        try { window.dispatchEvent(new Event('gmaps-preview-ready')); } catch (error) { /* */ }
    });
})();
