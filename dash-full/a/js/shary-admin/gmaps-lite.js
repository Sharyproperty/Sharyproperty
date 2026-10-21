(function () {
    'use strict';
    if (window.SharyMapsLite) {
        return;
    }
    var ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/';
    var GZ = 1;
    var css = false;

    function addCss() {
        if (css) {
            return;
        }
        css = true;
        var s = document.createElement('style');
        s.textContent = [
            '.sxgl-pin{position:relative;width:27px;height:41px;cursor:pointer;filter:drop-shadow(0 2px 2px rgba(0,0,0,.35))}',
            '.sxgl-pin svg{display:block;width:27px;height:41px}',
            '.sxgl-pin b{position:absolute;left:0;right:0;top:6px;text-align:center;font:800 12px/14px Cairo,Arial,sans-serif;color:#fff;direction:ltr}',
            '.sxgl-dot{border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.45);cursor:pointer;box-sizing:border-box}',
            '.sxgl-drag,.sxgl-drag .sxgl-pin,.sxgl-drag .sxgl-dot{cursor:grab}.sxgl-drag:active,.sxgl-drag:active .sxgl-pin,.sxgl-drag:active .sxgl-dot{cursor:grabbing}',
            '.sxgl-pac{position:absolute;z-index:100000;background:#fff;border:1px solid #d9e2ec;border-radius:12px;box-shadow:0 14px 30px -12px rgba(15,34,51,.38);max-height:330px;overflow-y:auto;direction:rtl;text-align:right;font-family:inherit}',
            '.sxgl-pac[hidden]{display:none}',
            '.sxgl-pac__item{display:block;width:100%;padding:9px 13px;border:0;border-bottom:1px solid #eef2f6;background:#fff;cursor:pointer;text-align:inherit;font-family:inherit}',
            '.sxgl-pac__item:last-child{border-bottom:0}',
            '.sxgl-pac__item b{display:block;font-size:13.5px;font-weight:800;color:#123a5c;line-height:1.5}',
            '.sxgl-pac__item small{display:block;font-size:12px;font-weight:600;color:#6b7c8f;line-height:1.5}',
            '.sxgl-pac__item.is-active,.sxgl-pac__item:hover{background:#eef6ff}',
            '.sxgl-pac__note{padding:9px 13px;font-size:12.5px;font-weight:700;color:#6b7c8f}',
            '.sxgl-overlay img{max-width:none!important}'
        ].join('\n');
        document.head.appendChild(s);
    }

    function create(gl, options) {
        options = options || {};
        var token = String(options.mapbox || '').trim();
        addCss();

        function LatLng(lat, lng) {
            if (lat && typeof lat === 'object') {
                lng = typeof lat.lng === 'function' ? lat.lng() : lat.lng;
                lat = typeof lat.lat === 'function' ? lat.lat() : lat.lat;
            }
            this._lat = Number(lat);
            this._lng = Number(lng);
        }
        LatLng.prototype.lat = function () { return this._lat; };
        LatLng.prototype.lng = function () { return this._lng; };
        LatLng.prototype.toJSON = function () { return {lat: this._lat, lng: this._lng}; };
        LatLng.prototype.toString = function () { return '(' + this._lat + ', ' + this._lng + ')'; };
        LatLng.prototype.equals = function (o) { return !!o && Math.abs(ll(o).lat() - this._lat) < 1e-10 && Math.abs(ll(o).lng() - this._lng) < 1e-10; };
        function ll(v) {
            return v instanceof LatLng ? v : new LatLng(v);
        }
        function ok(p) {
            return p && isFinite(p.lat()) && isFinite(p.lng()) && Math.abs(p.lat()) <= 90;
        }

        function LatLngBounds(sw, ne) {
            this._s = this._w = this._n = this._e = null;
            if (sw) {
                this.extend(sw);
            }
            if (ne) {
                this.extend(ne);
            }
        }
        LatLngBounds.prototype.extend = function (p) {
            p = ll(p);
            if (!ok(p)) {
                return this;
            }
            if (this._s === null) {
                this._s = this._n = p.lat();
                this._w = this._e = p.lng();
            } else {
                this._s = Math.min(this._s, p.lat());
                this._n = Math.max(this._n, p.lat());
                this._w = Math.min(this._w, p.lng());
                this._e = Math.max(this._e, p.lng());
            }
            return this;
        };
        LatLngBounds.prototype.isEmpty = function () { return this._s === null; };
        LatLngBounds.prototype.getSouthWest = function () { return this.isEmpty() ? null : new LatLng(this._s, this._w); };
        LatLngBounds.prototype.getNorthEast = function () { return this.isEmpty() ? null : new LatLng(this._n, this._e); };
        LatLngBounds.prototype.getCenter = function () { return this.isEmpty() ? null : new LatLng((this._s + this._n) / 2, (this._w + this._e) / 2); };
        LatLngBounds.prototype.contains = function (p) {
            p = ll(p);
            return !this.isEmpty() && p.lat() >= this._s && p.lat() <= this._n && p.lng() >= this._w && p.lng() <= this._e;
        };
        LatLngBounds.prototype.union = function (b) {
            if (b && !b.isEmpty()) {
                this.extend(b.getSouthWest());
                this.extend(b.getNorthEast());
            }
            return this;
        };
        LatLngBounds.prototype.toJSON = function () { return {south: this._s, west: this._w, north: this._n, east: this._e}; };
        function bounds(v) {
            if (v instanceof LatLngBounds) {
                return v;
            }
            if (v && v.south !== undefined) {
                return new LatLngBounds({lat: v.south, lng: v.west}, {lat: v.north, lng: v.east});
            }
            return new LatLngBounds();
        }

        function Point(x, y) { this.x = x; this.y = y; }
        Point.prototype.equals = function (o) { return !!o && o.x === this.x && o.y === this.y; };
        function Size(w, h) { this.width = w; this.height = h; }

        function Evented() {}
        Evented.prototype.addListener = function (name, fn) {
            var self = this;
            this._ev = this._ev || {};
            (this._ev[name] = this._ev[name] || []).push(fn);
            return {remove: function () { self._ev[name] = (self._ev[name] || []).filter(function (f) { return f !== fn; }); }};
        };
        Evented.prototype._fire = function (name, arg) {
            var list = (this._ev && this._ev[name]) || [];
            list.slice().forEach(function (fn) {
                try {
                    fn.call(this, arg);
                } catch (error) {
                    if (window.console) {
                        console.error(error);
                    }
                }
            }, this);
        };
        Evented.prototype.get = function (key) { return this['_kv_' + key]; };
        Evented.prototype.set = function (key, value) { this['_kv_' + key] = value; };
        Evented.prototype.bindTo = function () {};
        Evented.prototype.notify = function () {};

        var event = {
            addListener: function (obj, name, fn) { return obj && obj.addListener ? obj.addListener(name, fn) : {remove: function () {}}; },
            addListenerOnce: function (obj, name, fn) {
                var handle = event.addListener(obj, name, function (arg) { handle.remove(); fn.call(this, arg); });
                return handle;
            },
            addDomListener: function (el, name, fn, capture) {
                if (el && el.addEventListener) {
                    el.addEventListener(name, fn, !!capture);
                }
                return {remove: function () { if (el && el.removeEventListener) { el.removeEventListener(name, fn, !!capture); } }};
            },
            removeListener: function (handle) { if (handle && handle.remove) { handle.remove(); } },
            clearListeners: function (obj, name) { if (obj && obj._ev) { obj._ev[name] = []; } },
            clearInstanceListeners: function (obj) { if (obj) { obj._ev = {}; } },
            trigger: function (obj, name, arg) { if (obj && obj._fire) { obj._fire(name, arg); } }
        };

        function style() {
            var sources = {
                esri: {type: 'raster', tiles: [ESRI + 'World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 17, attribution: 'Imagery &copy; Esri'},
                esriLabels: {type: 'raster', tiles: [ESRI + 'Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 17},
                esriRoads: {type: 'raster', tiles: [ESRI + 'Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 17}
            };
            var layers = [{id: 'ground', type: 'background', paint: {'background-color': '#a99c82'}}];
            if (token) {
                sources.mb = {type: 'raster', tiles: ['https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/512/{z}/{x}/{y}?access_token=' + encodeURIComponent(token)],
                    tileSize: 512, maxzoom: 19, attribution: '&copy; Mapbox &copy; OpenStreetMap'};
                layers.push({id: 'mb', type: 'raster', source: 'mb', paint: {'raster-fade-duration': 0}});
            }
            ['esri', 'esriRoads', 'esriLabels'].forEach(function (id) {
                layers.push({id: id, type: 'raster', source: id, layout: {visibility: token ? 'none' : 'visible'}, paint: {'raster-fade-duration': 0}});
            });
            return {version: 8, sources: sources, layers: layers};
        }

        function Map(el, o) {
            if (!el) {
                throw new Error('Map: مكان الخريطة مش موجود في الصفحة');
            }
            o = o || {};
            var self = this;
            var center = o.center ? ll(o.center) : new LatLng(30.0444, 31.2357);
            if (!ok(center)) {
                center = new LatLng(30.0444, 31.2357);
            }
            el.innerHTML = '';
            el.style.removeProperty('background-color');
            this._el = el;
            this._loaded = false;
            this._queue = [];
            this._overlays = [];
            this._polys = [];
            this._gl = new gl.Map({
                container: el,
                style: style(),
                center: [center.lng(), center.lat()],
                zoom: Math.max(0, (o.zoom || 10) - GZ),
                maxZoom: 20,
                dragRotate: false,
                pitchWithRotate: false,
                touchPitch: false,
                maxPitch: 0,
                renderWorldCopies: false,
                fadeDuration: 0,
                attributionControl: {compact: true},
                cooperativeGestures: true,
                locale: {
                    'CooperativeGesturesHandler.WindowsHelpText': 'استخدم Ctrl + عجلة الماوس عشان تكبّر وتصغّر الخريطة',
                    'CooperativeGesturesHandler.MacHelpText': 'استخدم ⌘ + عجلة الماوس عشان تكبّر وتصغّر الخريطة',
                    'CooperativeGesturesHandler.MobileHelpText': 'حرّك الخريطة بصباعين',
                    'NavigationControl.ZoomIn': 'تكبير',
                    'NavigationControl.ZoomOut': 'تصغير',
                    'FullscreenControl.Enter': 'ملء الشاشة',
                    'FullscreenControl.Exit': 'خروج من ملء الشاشة'
                }
            });
            if (this._gl.touchZoomRotate && this._gl.touchZoomRotate.disableRotation) {
                this._gl.touchZoomRotate.disableRotation();
            }
            this._gl.addControl(new gl.NavigationControl({showCompass: false}), 'bottom-right');
            if (gl.FullscreenControl && o.fullscreenControl !== false) {
                this._gl.addControl(new gl.FullscreenControl(), 'top-right');
            }
            var switched = false;
            this._gl.on('error', function (e) {
                if (!switched && token && e && e.sourceId === 'mb') {
                    switched = true;
                    try {
                        self._gl.setLayoutProperty('mb', 'visibility', 'none');
                        ['esri', 'esriRoads', 'esriLabels'].forEach(function (id) { self._gl.setLayoutProperty(id, 'visibility', 'visible'); });
                    } catch (error) {
                    }
                }
            });
            var markReady = function () {
                if (self._loaded) {
                    return;
                }
                self._loaded = true;
                self._queue.splice(0).forEach(function (fn) {
                    try {
                        fn();
                    } catch (error) {
                        if (window.console) {
                            console.error(error);
                        }
                    }
                });
                self._redraw();
            };
            this._gl.on('style.load', markReady);
            this._gl.on('load', markReady);
            if (this._gl.style && this._gl.style._loaded) {
                markReady();
            }
            this._gl.on('click', function (e) {
                self._fire('click', {latLng: new LatLng(e.lngLat.lat, e.lngLat.lng), domEvent: e.originalEvent, stop: function () {}});
            });
            this._gl.on('dblclick', function (e) {
                self._fire('dblclick', {latLng: new LatLng(e.lngLat.lat, e.lngLat.lng)});
            });
            this._gl.on('contextmenu', function (e) {
                self._fire('rightclick', {latLng: new LatLng(e.lngLat.lat, e.lngLat.lng)});
            });
            this._gl.on('move', function () { self._redraw(); self._fire('center_changed'); });
            this._gl.on('resize', function () { self._redraw(); });
            this._gl.on('zoomend', function () { self._fire('zoom_changed'); });
            this._gl.on('moveend', function () { self._fire('bounds_changed'); self._fire('idle'); });
            this._gl.on('dragstart', function () { self._fire('dragstart'); });
            this._gl.on('dragend', function () { self._fire('dragend'); });
            if ('ResizeObserver' in window) {
                new ResizeObserver(function () { self._gl.resize(); }).observe(el);
            }
        }
        Map.prototype = Object.create(Evented.prototype);
        Map.prototype.constructor = Map;
        Map.prototype._ready = function (fn) {
            if (this._loaded) {
                fn();
            } else {
                this._queue.push(fn);
            }
        };
        Map.prototype._redraw = function () {
            this._overlays.forEach(function (overlay) {
                if (overlay.draw) {
                    try {
                        overlay.draw();
                    } catch (error) {
                    }
                }
            });
        };
        Map.prototype.setCenter = function (c) {
            c = ll(c);
            if (ok(c)) {
                this._gl.jumpTo({center: [c.lng(), c.lat()]});
            }
        };
        Map.prototype.getCenter = function () {
            var c = this._gl.getCenter();
            return new LatLng(c.lat, c.lng);
        };
        Map.prototype.panTo = function (c) {
            c = ll(c);
            if (ok(c)) {
                this._gl.easeTo({center: [c.lng(), c.lat()], duration: 350});
            }
        };
        Map.prototype.panBy = function (x, y) { this._gl.panBy([x, y], {duration: 0}); };
        Map.prototype.setZoom = function (z) {
            if (isFinite(z)) {
                this._gl.jumpTo({zoom: Math.max(0, Number(z) - GZ)});
            }
        };
        Map.prototype.getZoom = function () { return Math.round(this._gl.getZoom() + GZ); };
        Map.prototype.fitBounds = function (b, padding) {
            b = bounds(b);
            if (b.isEmpty()) {
                return;
            }
            var sw = b.getSouthWest(), ne = b.getNorthEast();
            if (sw.lat() === ne.lat() && sw.lng() === ne.lng()) {
                this._gl.jumpTo({center: [sw.lng(), sw.lat()], zoom: 16});
                return;
            }
            var self = this;
            var go = function () {
                self._gl.fitBounds([[sw.lng(), sw.lat()], [ne.lng(), ne.lat()]], {padding: typeof padding === 'number' ? padding : 40, maxZoom: 18, duration: 0});
            };
            go();
            if (!this._loaded) {
                this._ready(go);
            }
        };
        Map.prototype.getBounds = function () {
            var b = this._gl.getBounds();
            return new LatLngBounds({lat: b.getSouth(), lng: b.getWest()}, {lat: b.getNorth(), lng: b.getEast()});
        };
        Map.prototype.getDiv = function () { return this._el; };
        Map.prototype.setOptions = function (o) {
            if (o && o.center) {
                this.setCenter(o.center);
            }
            if (o && o.zoom !== undefined) {
                this.setZoom(o.zoom);
            }
        };
        Map.prototype.setMapTypeId = function () {};
        Map.prototype.getMapTypeId = function () { return 'hybrid'; };
        Map.prototype.setTilt = function () {};
        Map.prototype.setHeading = function () {};
        Map.prototype.getHeading = function () { return 0; };
        Map.prototype.getProjection = function () { return this._projection(); };
        Map.prototype._panes = function () {
            if (!this._panesObj) {
                var container = this._gl.getCanvasContainer();
                var layer = document.createElement('div');
                layer.className = 'sxgl-overlay';
                layer.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;pointer-events:none';
                var canvas = this._gl.getCanvas();
                container.insertBefore(layer, canvas.nextSibling);
                this._panesObj = {mapPane: layer, overlayLayer: layer, overlayShadow: layer, markerLayer: layer, overlayMouseTarget: layer, floatShadow: layer, floatPane: layer};
            }
            return this._panesObj;
        };
        Map.prototype._projection = function () {
            var m = this._gl;
            return {
                fromLatLngToDivPixel: function (p) { p = ll(p); var pt = m.project([p.lng(), p.lat()]); return new Point(pt.x, pt.y); },
                fromDivPixelToLatLng: function (pt) { var q = m.unproject([pt.x, pt.y]); return new LatLng(q.lat, q.lng); },
                fromLatLngToContainerPixel: function (p) { p = ll(p); var pt = m.project([p.lng(), p.lat()]); return new Point(pt.x, pt.y); },
                fromContainerPixelToLatLng: function (pt) { var q = m.unproject([pt.x, pt.y]); return new LatLng(q.lat, q.lng); },
                getWorldWidth: function () { return 512 * Math.pow(2, m.getZoom()); }
            };
        };

        var PIN = '<svg viewBox="0 0 27 41" aria-hidden="true"><path d="M13.5 0C6 0 0 6 0 13.4c0 9.6 11.6 25 12.1 25.7a1.8 1.8 0 0 0 2.8 0C15.4 38.4 27 23 27 13.4 27 6 21 0 13.5 0Z" fill="#ea4335" stroke="#b1271b" stroke-width="1"/><circle cx="13.5" cy="13.4" r="5" fill="#7a1a12" opacity=".55"/></svg>';
        function Marker(o) {
            o = o || {};
            this._pos = o.position ? ll(o.position) : null;
            this._map = null;
            this._added = false;
            this._draggable = !!o.draggable;
            this._visible = o.visible !== false;
            this._label = o.label === undefined || o.label === null ? '' : String(typeof o.label === 'object' ? (o.label.text || '') : o.label);
            this._icon = o.icon || null;
            this._title = o.title || '';
            this._zIndex = o.zIndex;
            this._build();
            if (o.map) {
                this.setMap(o.map);
            }
        }
        Marker.prototype = Object.create(Evented.prototype);
        Marker.prototype.constructor = Marker;
        Marker.prototype._isDot = function () {
            return !!(this._icon && typeof this._icon === 'object' && this._icon.path === 0);
        };
        Marker.prototype._paint = function () {
            var el = this._face, icon = this._icon;
            el.innerHTML = '';
            el.className = '';
            el.removeAttribute('style');
            if (this._isDot()) {
                var r = Number(icon.scale || 6), stroke = Number(icon.strokeWeight === undefined ? 1 : icon.strokeWeight);
                el.className = 'sxgl-dot';
                el.style.width = el.style.height = (r * 2 + stroke * 2) + 'px';
                el.style.background = icon.fillColor || '#ea4335';
                el.style.opacity = icon.fillOpacity === undefined ? 1 : Math.max(0.15, Number(icon.fillOpacity));
                el.style.border = stroke + 'px solid ' + (icon.strokeColor || '#fff');
            } else if (icon && (typeof icon === 'string' || icon.url)) {
                var img = document.createElement('img');
                img.src = typeof icon === 'string' ? icon : icon.url;
                img.alt = '';
                img.draggable = false;
                var size = icon.scaledSize || icon.size;
                if (size) {
                    img.style.width = size.width + 'px';
                    img.style.height = size.height + 'px';
                }
                el.appendChild(img);
            } else {
                el.className = 'sxgl-pin';
                el.innerHTML = PIN;
                if (this._label) {
                    var b = document.createElement('b');
                    b.textContent = this._label;
                    el.appendChild(b);
                }
            }
            this._el.classList.toggle('sxgl-drag', this._draggable);
            this._el.title = this._title;
            if (this._zIndex !== undefined) {
                this._el.style.zIndex = this._zIndex;
            }
        };
        Marker.prototype._build = function () {
            var self = this;
            var el = this._el = document.createElement('div');
            this._face = document.createElement('div');
            el.appendChild(this._face);
            this._paint();
            el.addEventListener('click', function (e) { e.stopPropagation(); self._fire('click', {latLng: self._pos}); });
            el.addEventListener('dblclick', function (e) { e.stopPropagation(); e.preventDefault(); self._fire('dblclick', {latLng: self._pos}); });
            el.addEventListener('contextmenu', function (e) { e.stopPropagation(); e.preventDefault(); self._fire('rightclick', {latLng: self._pos}); });
            el.addEventListener('mouseover', function () { self._fire('mouseover'); });
            el.addEventListener('mouseout', function () { self._fire('mouseout'); });
            this._mk = new gl.Marker({element: el, draggable: this._draggable, anchor: this._isDot() ? 'center' : 'bottom'});
            var moved = function () {
                var p = self._mk.getLngLat();
                self._pos = new LatLng(p.lat, p.lng);
            };
            this._mk.on('dragstart', function () { moved(); self._fire('dragstart', {latLng: self._pos}); });
            this._mk.on('drag', function () { moved(); self._fire('drag', {latLng: self._pos}); });
            this._mk.on('dragend', function () { moved(); self._fire('dragend', {latLng: self._pos}); });
        };
        Marker.prototype._add = function () {
            if (this._added || !this._map || !ok(this._pos) || !this._visible) {
                return;
            }
            this._mk.setLngLat([this._pos.lng(), this._pos.lat()]).addTo(this._map._gl);
            this._added = true;
        };
        Marker.prototype._drop = function () {
            if (this._added) {
                this._mk.remove();
                this._added = false;
            }
        };
        Marker.prototype.setPosition = function (p) {
            this._pos = p ? ll(p) : null;
            if (!ok(this._pos)) {
                return;
            }
            if (this._added) {
                this._mk.setLngLat([this._pos.lng(), this._pos.lat()]);
            } else {
                this._add();
            }
            this._fire('position_changed');
        };
        Marker.prototype.getPosition = function () { return this._pos; };
        Marker.prototype.setMap = function (map) {
            map = map || null;
            if (this._map === map && (this._added || !map)) {
                return;
            }
            this._drop();
            this._map = map;
            this._add();
        };
        Marker.prototype.getMap = function () { return this._map; };
        Marker.prototype.setDraggable = function (on) {
            this._draggable = !!on;
            this._mk.setDraggable(this._draggable);
            this._el.classList.toggle('sxgl-drag', this._draggable);
        };
        Marker.prototype.getDraggable = function () { return this._draggable; };
        Marker.prototype.setLabel = function (label) {
            this._label = label === undefined || label === null ? '' : String(typeof label === 'object' ? (label.text || '') : label);
            this._paint();
        };
        Marker.prototype.getLabel = function () { return this._label; };
        Marker.prototype.setIcon = function (icon) {
            var dot = this._isDot();
            this._icon = icon || null;
            this._paint();
            if (dot !== this._isDot() && this._mk.setOffset) {
                this._mk.setOffset([0, 0]);
            }
        };
        Marker.prototype.getIcon = function () { return this._icon; };
        Marker.prototype.setTitle = function (t) { this._title = t || ''; this._el.title = this._title; };
        Marker.prototype.getTitle = function () { return this._title; };
        Marker.prototype.setVisible = function (on) {
            this._visible = on !== false;
            if (this._visible) {
                this._add();
            } else {
                this._drop();
            }
        };
        Marker.prototype.getVisible = function () { return this._visible; };
        Marker.prototype.setZIndex = function (z) { this._zIndex = z; this._el.style.zIndex = z; };
        Marker.prototype.setCursor = function () {};
        Marker.prototype.setAnimation = function () {};
        Marker.prototype.setOptions = function (o) {
            o = o || {};
            if ('icon' in o) {
                this.setIcon(o.icon);
            }
            if ('label' in o) {
                this.setLabel(o.label);
            }
            if ('title' in o) {
                this.setTitle(o.title);
            }
            if ('draggable' in o) {
                this.setDraggable(o.draggable);
            }
            if ('position' in o) {
                this.setPosition(o.position);
            }
            if ('visible' in o) {
                this.setVisible(o.visible);
            }
            if ('map' in o) {
                this.setMap(o.map);
            }
        };

        function MVCArray(items, onChange) {
            this._a = (items || []).slice();
            this._change = onChange || function () {};
        }
        MVCArray.prototype = Object.create(Evented.prototype);
        MVCArray.prototype.getArray = function () { return this._a; };
        MVCArray.prototype.getLength = function () { return this._a.length; };
        MVCArray.prototype.getAt = function (i) { return this._a[i]; };
        MVCArray.prototype.forEach = function (fn) { this._a.forEach(fn); };
        MVCArray.prototype.push = function (v) { this._a.push(ll(v)); this._change(); return this._a.length; };
        MVCArray.prototype.pop = function () { var v = this._a.pop(); this._change(); return v; };
        MVCArray.prototype.setAt = function (i, v) { this._a[i] = ll(v); this._change(); };
        MVCArray.prototype.insertAt = function (i, v) { this._a.splice(i, 0, ll(v)); this._change(); };
        MVCArray.prototype.removeAt = function (i) { var v = this._a.splice(i, 1)[0]; this._change(); return v; };
        MVCArray.prototype.clear = function () { this._a = []; this._change(); };

        var seq = 0;
        function ring(paths) {
            var list = paths && paths.getArray ? paths.getArray() : (paths || []);
            if (list.length && (Array.isArray(list[0]) || (list[0] && list[0].getArray))) {
                list = list[0].getArray ? list[0].getArray() : list[0];
            }
            return list.map(ll).filter(ok);
        }
        function Polygon(o) {
            o = o || {};
            var self = this;
            this._id = 'sxgl-poly-' + (++seq);
            this._o = {strokeColor: o.strokeColor || '#1b84ff', strokeOpacity: o.strokeOpacity === undefined ? 1 : o.strokeOpacity, strokeWeight: o.strokeWeight === undefined ? 2 : o.strokeWeight,
                fillColor: o.fillColor || '#1b84ff', fillOpacity: o.fillOpacity === undefined ? 0.3 : o.fillOpacity};
            this._visible = o.visible !== false;
            this._path = new MVCArray(ring(o.paths || o.path), function () { self._refresh(); });
            this._map = null;
            if (o.map) {
                this.setMap(o.map);
            }
        }
        Polygon.prototype = Object.create(Evented.prototype);
        Polygon.prototype.constructor = Polygon;
        Polygon.prototype._data = function () {
            var coords = this._path.getArray().map(function (p) { return [p.lng(), p.lat()]; });
            if (coords.length > 2) {
                coords.push(coords[0]);
            }
            return {type: 'Feature', properties: {}, geometry: coords.length > 3 ? {type: 'Polygon', coordinates: [coords]} : {type: 'LineString', coordinates: coords}};
        };
        Polygon.prototype._show = function () {
            var m = this._map && this._map._gl;
            if (!m) {
                return;
            }
            var source = m.getSource(this._id);
            if (source) {
                source.setData(this._data());
                return;
            }
            m.addSource(this._id, {type: 'geojson', data: this._data()});
            var vis = this._visible ? 'visible' : 'none';
            m.addLayer({id: this._id + '-fill', type: 'fill', source: this._id, filter: ['==', ['geometry-type'], 'Polygon'], layout: {visibility: vis},
                paint: {'fill-color': this._o.fillColor, 'fill-opacity': Number(this._o.fillOpacity)}});
            m.addLayer({id: this._id + '-line', type: 'line', source: this._id, layout: {visibility: vis, 'line-join': 'round'},
                paint: {'line-color': this._o.strokeColor, 'line-opacity': Number(this._o.strokeOpacity), 'line-width': Number(this._o.strokeWeight)}});
        };
        Polygon.prototype._hide = function () {
            var m = this._map && this._map._gl;
            if (!m) {
                return;
            }
            try {
                [this._id + '-line', this._id + '-fill'].forEach(function (id) { if (m.getLayer(id)) { m.removeLayer(id); } });
                if (m.getSource(this._id)) {
                    m.removeSource(this._id);
                }
            } catch (error) {
            }
        };
        Polygon.prototype._refresh = function () {
            var self = this;
            if (this._map) {
                this._map._ready(function () { self._show(); });
            }
        };
        Polygon.prototype.setMap = function (map) {
            map = map || null;
            if (this._map === map) {
                return;
            }
            if (this._map && this._map._loaded) {
                this._hide();
            }
            this._map = map;
            this._refresh();
        };
        Polygon.prototype.getMap = function () { return this._map; };
        Polygon.prototype.getPath = function () { return this._path; };
        Polygon.prototype.getPaths = function () { return new MVCArray([this._path]); };
        Polygon.prototype.setPath = function (p) {
            var self = this;
            this._path = new MVCArray(ring(p), function () { self._refresh(); });
            this._refresh();
        };
        Polygon.prototype.setPaths = Polygon.prototype.setPath;
        Polygon.prototype.setOptions = function (o) {
            o = o || {};
            ['strokeColor', 'strokeOpacity', 'strokeWeight', 'fillColor', 'fillOpacity'].forEach(function (key) {
                if (key in o) {
                    this._o[key] = o[key];
                }
            }, this);
            if (o.paths || o.path) {
                this.setPath(o.paths || o.path);
            }
            if (this._map && this._map._loaded) {
                this._hide();
                this._show();
            }
        };
        Polygon.prototype.setVisible = function (on) {
            this._visible = on !== false;
            var m = this._map && this._map._gl, vis = this._visible ? 'visible' : 'none', id = this._id;
            if (m && m.getLayer(id + '-fill')) {
                m.setLayoutProperty(id + '-fill', 'visibility', vis);
                m.setLayoutProperty(id + '-line', 'visibility', vis);
            }
        };
        Polygon.prototype.setEditable = function () {};
        Polygon.prototype.setDraggable = function () {};

        function OverlayView() {}
        OverlayView.prototype = Object.create(Evented.prototype);
        OverlayView.prototype.setMap = function (map) {
            map = map || null;
            if (this._ovMap === map) {
                return;
            }
            if (this._ovMap) {
                var old = this._ovMap;
                old._overlays = old._overlays.filter(function (o) { return o !== this; }, this);
                if (this.onRemove) {
                    this.onRemove();
                }
            }
            this._ovMap = map;
            if (map) {
                map._overlays.push(this);
                if (this.onAdd) {
                    this.onAdd();
                }
                if (this.draw) {
                    this.draw();
                }
            }
        };
        OverlayView.prototype.getMap = function () { return this._ovMap || null; };
        OverlayView.prototype.getPanes = function () { return this._ovMap ? this._ovMap._panes() : null; };
        OverlayView.prototype.getProjection = function () { return this._ovMap ? this._ovMap._projection() : null; };
        OverlayView.preventMapHitsFrom = function () {};
        OverlayView.preventMapHitsAndGesturesFrom = function () {};

        function GroundOverlay(url, b, o) {
            this._url = url;
            this._b = bounds(b);
            this._opacity = o && o.opacity !== undefined ? o.opacity : 1;
            this._id = 'sxgl-img-' + (++seq);
            this._map = null;
            if (o && o.map) {
                this.setMap(o.map);
            }
        }
        GroundOverlay.prototype = Object.create(Evented.prototype);
        GroundOverlay.prototype.setMap = function (map) {
            var self = this;
            if (this._map && this._map._loaded) {
                var m = this._map._gl;
                try {
                    if (m.getLayer(this._id)) {
                        m.removeLayer(this._id);
                    }
                    if (m.getSource(this._id)) {
                        m.removeSource(this._id);
                    }
                } catch (error) {
                }
            }
            this._map = map || null;
            if (this._map && !this._b.isEmpty()) {
                this._map._ready(function () {
                    var m = self._map._gl, b = self._b;
                    m.addSource(self._id, {type: 'image', url: self._url, coordinates: [[b._w, b._n], [b._e, b._n], [b._e, b._s], [b._w, b._s]]});
                    m.addLayer({id: self._id, type: 'raster', source: self._id, paint: {'raster-opacity': self._opacity, 'raster-fade-duration': 0}});
                });
            }
        };
        GroundOverlay.prototype.getMap = function () { return this._map; };
        GroundOverlay.prototype.setOpacity = function (v) {
            this._opacity = v;
            if (this._map && this._map._loaded && this._map._gl.getLayer(this._id)) {
                this._map._gl.setPaintProperty(this._id, 'raster-opacity', v);
            }
        };
        GroundOverlay.prototype.getBounds = function () { return this._b; };

        function boxOf(s, w, n, e) {
            return [s, w, n, e].every(function (v) { return isFinite(v); }) ? [Number(s), Number(w), Number(n), Number(e)] : null;
        }
        function fromMapbox(q) {
            if (!token) {
                return Promise.resolve([]);
            }
            var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(q) + '.json?autocomplete=true&language=ar,en&limit=6&proximity=31.2357,30.0444&access_token=' + encodeURIComponent(token);
            return fetch(url).then(function (r) { return r.ok ? r.json() : {features: []}; }).then(function (data) {
                return (data.features || []).map(function (f) {
                    var b = f.bbox;
                    return {name: f.text || f.place_name, address: f.place_name || '', lat: f.center[1], lng: f.center[0], box: b ? boxOf(b[1], b[0], b[3], b[2]) : null};
                });
            }).catch(function () { return []; });
        }
        function fromServer(q) {
            var url = options.searchUrl;
            if (!url) {
                return Promise.resolve([]);
            }
            return fetch(url + (url.indexOf('?') > -1 ? '&' : '?') + 'q=' + encodeURIComponent(q), {credentials: 'same-origin', headers: {'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest'}})
                .then(function (r) { return r.ok ? r.json() : {}; }).then(function (data) {
                    return ((data && data.results) || []).map(function (p) {
                        var v = p.viewport;
                        return {name: p.name || q, address: [p.address, p.source].filter(Boolean).join(' · '), lat: Number(p.lat), lng: Number(p.lng), box: Array.isArray(v) ? boxOf(v[0], v[1], v[2], v[3]) : null};
                    });
                }).catch(function () { return []; });
        }
        function fromOsm(q) {
            var url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&accept-language=ar&q=' + encodeURIComponent(q);
            return fetch(url, {headers: {'Accept': 'application/json'}}).then(function (r) { return r.ok ? r.json() : []; }).then(function (list) {
                return (list || []).map(function (p) {
                    var b = p.boundingbox || [];
                    return {name: p.name || String(p.display_name || '').split(',')[0], address: p.display_name || '', lat: Number(p.lat), lng: Number(p.lon), box: b.length === 4 ? boxOf(b[0], b[2], b[1], b[3]) : null};
                });
            }).catch(function () { return []; });
        }
        function lookup(q) {
            return Promise.all([fromServer(q), fromMapbox(q)]).then(function (both) {
                var list = both[0].concat(both[1]);
                return list.length ? list : fromOsm(q);
            }).then(function (list) {
                var seen = {};
                return list.filter(function (p) {
                    if (!isFinite(p.lat) || !isFinite(p.lng)) {
                        return false;
                    }
                    var key = p.lat.toFixed(4) + ',' + p.lng.toFixed(4);
                    if (seen[key]) {
                        return false;
                    }
                    seen[key] = true;
                    return true;
                }).slice(0, 7);
            });
        }

        function Autocomplete(input) {
            var self = this;
            this._place = {};
            this._input = input;
            if (!input || !input.addEventListener) {
                return;
            }
            input.setAttribute('autocomplete', 'off');
            var box = this._box = document.createElement('div');
            box.className = 'sxgl-pac';
            box.hidden = true;
            document.body.appendChild(box);
            var timer = null, ask = 0, items = [], active = -1;
            function place() {
                var r = input.getBoundingClientRect();
                box.style.top = (r.bottom + window.scrollY + 4) + 'px';
                box.style.left = (r.left + window.scrollX) + 'px';
                box.style.width = Math.max(260, r.width) + 'px';
            }
            function note(text) {
                box.innerHTML = '';
                var n = document.createElement('div');
                n.className = 'sxgl-pac__note';
                n.textContent = text;
                box.appendChild(n);
                place();
                box.hidden = false;
            }
            function mark(i) {
                active = i;
                [].forEach.call(box.querySelectorAll('.sxgl-pac__item'), function (row, j) { row.classList.toggle('is-active', j === i); });
            }
            function show(list) {
                items = list;
                active = -1;
                if (!list.length) {
                    note('ما لقيتش مكان بالاسم ده — جرّب اسم المنطقة أو اسم الكمبوند بالإنجليزي');
                    return;
                }
                box.innerHTML = '';
                list.forEach(function (p, i) {
                    var row = document.createElement('button');
                    row.type = 'button';
                    row.className = 'sxgl-pac__item';
                    var b = document.createElement('b');
                    b.textContent = p.name;
                    var s = document.createElement('small');
                    s.textContent = p.address && p.address !== p.name ? p.address : '';
                    row.appendChild(b);
                    row.appendChild(s);
                    row.addEventListener('mousedown', function (e) { e.preventDefault(); });
                    row.addEventListener('click', function () { choose(i); });
                    row.addEventListener('mouseenter', function () { mark(i); });
                    box.appendChild(row);
                });
                place();
                box.hidden = false;
            }
            function choose(i) {
                var p = items[i];
                if (!p) {
                    return;
                }
                input.value = p.address && p.address.length < 90 ? p.address : p.name;
                box.hidden = true;
                self._place = {
                    name: p.name, formatted_address: p.address || p.name,
                    geometry: {location: new LatLng(p.lat, p.lng), viewport: p.box ? new LatLngBounds({lat: p.box[0], lng: p.box[1]}, {lat: p.box[2], lng: p.box[3]}) : undefined}
                };
                self._fire('place_changed');
            }
            function search() {
                var q = input.value.trim();
                if (q.length < 2) {
                    box.hidden = true;
                    return;
                }
                var mine = ++ask;
                note('بيدوّر…');
                lookup(q).then(function (list) {
                    if (mine === ask && document.activeElement === input) {
                        show(list);
                    }
                });
            }
            input.addEventListener('input', function () {
                clearTimeout(timer);
                timer = setTimeout(search, 380);
            });
            input.addEventListener('focus', function () {
                if (items.length && input.value.trim().length >= 2) {
                    show(items);
                }
            });
            input.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    if (!box.hidden && items.length) {
                        e.preventDefault();
                        mark((active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length);
                    }
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!box.hidden && items.length) {
                        choose(active >= 0 ? active : 0);
                    } else {
                        clearTimeout(timer);
                        search();
                    }
                } else if (e.key === 'Escape') {
                    box.hidden = true;
                }
            });
            input.addEventListener('blur', function () { setTimeout(function () { box.hidden = true; }, 150); });
            window.addEventListener('resize', function () { if (!box.hidden) { place(); } });
            window.addEventListener('scroll', function () { if (!box.hidden) { place(); } }, true);
        }
        Autocomplete.prototype = Object.create(Evented.prototype);
        Autocomplete.prototype.getPlace = function () { return this._place; };
        Autocomplete.prototype.setBounds = function () {};
        Autocomplete.prototype.setComponentRestrictions = function () {};
        Autocomplete.prototype.setFields = function () {};
        Autocomplete.prototype.setOptions = function () {};
        Autocomplete.prototype.setTypes = function () {};

        return {
            Map: Map, Marker: Marker, Polygon: Polygon, OverlayView: OverlayView, GroundOverlay: GroundOverlay,
            LatLng: LatLng, LatLngBounds: LatLngBounds, Point: Point, Size: Size, MVCArray: MVCArray, event: event,
            SymbolPath: {CIRCLE: 0, FORWARD_CLOSED_ARROW: 1, FORWARD_OPEN_ARROW: 2, BACKWARD_CLOSED_ARROW: 3, BACKWARD_OPEN_ARROW: 4},
            MapTypeId: {HYBRID: 'hybrid', ROADMAP: 'roadmap', SATELLITE: 'satellite', TERRAIN: 'terrain'},
            ControlPosition: {TOP_LEFT: 1, TOP_CENTER: 2, TOP_RIGHT: 3, LEFT_CENTER: 4, RIGHT_CENTER: 8, BOTTOM_LEFT: 10, BOTTOM_CENTER: 11, BOTTOM_RIGHT: 12},
            Animation: {BOUNCE: 1, DROP: 2},
            places: {Autocomplete: Autocomplete, PlacesServiceStatus: {OK: 'OK', ZERO_RESULTS: 'ZERO_RESULTS', REQUEST_DENIED: 'REQUEST_DENIED'}},
            sharyLite: true
        };
    }

    window.SharyMapsLite = {create: create};
})();
