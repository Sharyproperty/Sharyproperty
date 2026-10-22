(function () {
    var CONF = JSON.parse(document.currentScript.getAttribute('data-conf') || '{}');
    var R = 6378137, ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/';
    var input = document.querySelector('[data-ap-corners]'), status = document.querySelector('[data-ap-status]');
    function toMerc(p) { return [R * p[0] * Math.PI / 180, R * Math.log(Math.tan(Math.PI / 4 + p[1] * Math.PI / 360))]; }
    function fromMerc(p) { return [p[0] / R * 180 / Math.PI, (2 * Math.atan(Math.exp(p[1] / R)) - Math.PI / 2) * 180 / Math.PI]; }

    var ratio = Number(CONF.ratio) > 0 ? Number(CONF.ratio) : 1;
    var st = null;
    if (Array.isArray(CONF.corners) && CONF.corners.length === 4) {
        var m = CONF.corners.map(function (p) { return toMerc([Number(p[0]), Number(p[1])]); });
        st = {
            c: [(m[0][0] + m[1][0] + m[2][0] + m[3][0]) / 4, (m[0][1] + m[1][1] + m[2][1] + m[3][1]) / 4],
            w: Math.hypot(m[1][0] - m[0][0], m[1][1] - m[0][1]), h: Math.hypot(m[3][0] - m[0][0], m[3][1] - m[0][1]),
            a: Math.atan2(m[1][1] - m[0][1], m[1][0] - m[0][0])
        };
    } else {
        var pts = [];
        ((CONF.outlines || {}).features || []).forEach(function (f) {
            var g = f.geometry || {};
            if (g.type === 'Point') pts.push(g.coordinates);
            if (g.type === 'Polygon') (g.coordinates[0] || []).forEach(function (q) { pts.push(q); });
        });
        var mm = pts.map(function (p) { return toMerc([Number(p[0]), Number(p[1])]); });
        var c = mm.length ? [(Math.min.apply(null, mm.map(function (p) { return p[0]; })) + Math.max.apply(null, mm.map(function (p) { return p[0]; }))) / 2,
            (Math.min.apply(null, mm.map(function (p) { return p[1]; })) + Math.max.apply(null, mm.map(function (p) { return p[1]; }))) / 2] : toMerc([31.2, 30.05]);
        st = { c: c, w: 3000, h: 3000 * ratio, a: 0 };
    }
    function corners() {
        var cos = Math.cos(st.a), sin = Math.sin(st.a);
        function at(x, y) { return fromMerc([st.c[0] + x * cos - y * sin, st.c[1] + x * sin + y * cos]); }
        return [at(-st.w / 2, st.h / 2), at(st.w / 2, st.h / 2), at(st.w / 2, -st.h / 2), at(-st.w / 2, -st.h / 2)];
    }
    var LOCAL = [[-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]];

    var map = new maplibregl.Map({
        container: 'ap-map', center: fromMerc(st.c), zoom: 13, attributionControl: false,
        style: { version: 8, sources: { base: { type: 'raster', tiles: [ESRI + 'World_Imagery/MapServer/tile/{z}/{y}/{x}'], tileSize: 256, maxzoom: 19 } }, layers: [{ id: 'base', type: 'raster', source: 'base' }] }
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    var handles = [], mover = null, look = false, opacity = 0.8;
    function changed() {
        var q = corners();
        if (input) input.value = JSON.stringify(q.map(function (p) { return [Math.round(p[0] * 1e7) / 1e7, Math.round(p[1] * 1e7) / 1e7]; }));
        if (status) status.textContent = 'فيه تعديل لسه ما اتحفظش — دوس «حفظ».';
    }
    function draw() {
        var q = corners(), source = map.getSource('plan');
        if (source) source.setCoordinates(q);
        handles.forEach(function (marker, i) { marker.setLngLat(q[i]); });
        if (mover) mover.setLngLat(fromMerc(st.c));
    }
    function handle(className, text) {
        var el = document.createElement('div');
        el.className = 'ap-handle' + (className ? ' ' + className : '');
        if (text) el.textContent = text;
        return el;
    }

    map.on('load', function () {
        map.addSource('projects', { type: 'geojson', data: CONF.outlines || { type: 'FeatureCollection', features: [] } });
        map.addSource('plan', { type: 'image', url: CONF.sharp, coordinates: corners() });
        map.addLayer({ id: 'plan', type: 'raster', source: 'plan', paint: { 'raster-opacity': opacity, 'raster-fade-duration': 0 } });
        map.addLayer({ id: 'project-lines', type: 'line', source: 'projects', filter: ['==', ['geometry-type'], 'Polygon'], paint: { 'line-color': '#ffffff', 'line-width': 2 } });
        map.addLayer({ id: 'project-pins', type: 'circle', source: 'projects', filter: ['==', ['geometry-type'], 'Point'], paint: { 'circle-radius': 5, 'circle-color': '#ffffff', 'circle-stroke-color': '#1e4166', 'circle-stroke-width': 2 } });
        ((CONF.outlines || {}).features || []).slice(0, 120).forEach(function (f) {
            var g = f.geometry || {}, at = null;
            if (g.type === 'Point') at = g.coordinates;
            if (g.type === 'Polygon' && g.coordinates[0] && g.coordinates[0].length) {
                var ring = g.coordinates[0], x = 0, y = 0;
                ring.forEach(function (q) { x += Number(q[0]); y += Number(q[1]); });
                at = [x / ring.length, y / ring.length];
            }
            if (!at || !f.properties || !f.properties.name) return;
            var el = document.createElement('div'); el.className = 'ap-name'; el.textContent = f.properties.name;
            new maplibregl.Marker({ element: el, anchor: 'top', offset: [0, 6] }).setLngLat(at).addTo(map);
        });
        corners().forEach(function (point, i) {
            var marker = new maplibregl.Marker({ element: handle(), draggable: true }).setLngLat(point).addTo(map);
            marker.on('drag', function () {
                var p = marker.getLngLat(), v = toMerc([p.lng, p.lat]), dx = v[0] - st.c[0], dy = v[1] - st.c[1];
                var ux = LOCAL[i][0] * st.w, uy = LOCAL[i][1] * st.h, k = Math.hypot(dx, dy) / Math.hypot(ux, uy);
                if (!(k > 0.02)) return;
                st.w *= k; st.h *= k;
                st.a = Math.atan2(dy, dx) - Math.atan2(uy, ux);
                draw();
            });
            marker.on('dragend', changed);
            handles.push(marker);
        });
        mover = new maplibregl.Marker({ element: handle('ap-handle--move', '✥'), draggable: true }).setLngLat(fromMerc(st.c)).addTo(map);
        mover.on('drag', function () { var p = mover.getLngLat(); st.c = toMerc([p.lng, p.lat]); draw(); });
        mover.on('dragend', changed);
        var q = corners(), xs = q.map(function (p) { return p[0]; }), ys = q.map(function (p) { return p[1]; });
        map.fitBounds([[Math.min.apply(null, xs), Math.min.apply(null, ys)], [Math.max.apply(null, xs), Math.max.apply(null, ys)]], { padding: 60, duration: 0 });
        if (!CONF.corners) changed();
    });

    document.querySelectorAll('[data-ap-turn]').forEach(function (button) {
        button.addEventListener('click', function () { st.a -= Number(button.getAttribute('data-ap-turn')) * Math.PI / 180; draw(); changed(); });
    });
    document.querySelectorAll('[data-ap-size]').forEach(function (button) {
        button.addEventListener('click', function () { var k = Number(button.getAttribute('data-ap-size')); st.w *= k; st.h *= k; draw(); changed(); });
    });
    var slider = document.querySelector('[data-ap-opacity]');
    if (slider) slider.addEventListener('input', function () { opacity = Number(slider.value) / 100; if (map.getLayer('plan')) map.setPaintProperty('plan', 'raster-opacity', opacity); });
    var lookBox = document.querySelector('[data-ap-look]');
    if (lookBox) lookBox.addEventListener('change', function () {
        look = lookBox.checked;
        var source = map.getSource('plan');
        if (source && source.updateImage) source.updateImage({ url: look && CONF.shade ? CONF.shade : CONF.sharp, coordinates: corners() });
        if (map.getLayer('plan')) map.setPaintProperty('plan', 'raster-opacity', look ? 1 : opacity);
    });
})();
