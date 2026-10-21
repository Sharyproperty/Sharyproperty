(function () {
  'use strict';
  var root = document.querySelector('[data-pf]');
  if (!root) return;
  var ALL = {};
  try { ALL = JSON.parse(root.querySelector('[data-pf-json]').textContent || '{}'); } catch (e) { return; }
  var NS = 'http://www.w3.org/2000/svg';
  var COLORS = ['var(--pf-c1)', 'var(--pf-c2)', 'var(--pf-c3)', 'var(--pf-c4)', 'var(--pf-c5)', 'var(--pf-c6)'];
  var MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  function fmt(n) { return n === null || n === undefined ? '—' : Number(n).toLocaleString('en-US'); }
  function get(obj, path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj); }
  function el(tag, attrs, parent) {
    var node = document.createElementNS(NS, tag);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }
  function html(node, text) { node.textContent = ''; if (text) node.insertAdjacentHTML('beforeend', text); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function short(d) { var p = d.split('-'); return +p[2] + '/' + +p[1]; }
  function day(d) { var p = d.split('-'); return +p[2] + ' ' + MONTHS[+p[1] - 1]; }
  function values(obj) { return Object.keys(obj || {}).map(function (k) { return obj[k]; }); }

  function delta(node, pair, isDay) {
    node.className = 'pf-delta';
    if (isDay && pair) { node.textContent = 'امبارح ' + fmt(pair.before); return; }
    if (!pair || pair.change === null || pair.change === undefined) { node.textContent = pair && pair.before === 0 && pair.now > 0 ? 'جديد' : 'زي اللي قبلها'; if (pair && pair.before === 0 && pair.now === 0) node.textContent = '—'; return; }
    var up = pair.change > 0, flat = pair.change === 0;
    node.classList.add(flat ? 'pf-delta' : (up ? 'pf-delta--up' : 'pf-delta--down'));
    node.textContent = (flat ? '' : (up ? '▲ ' : '▼ ')) + Math.abs(pair.change) + '% ' + 'عن اللي قبلها';
  }

  function spark(svg, series) {
    svg.textContent = '';
    var v = values(series); if (v.length < 2) return;
    var max = Math.max.apply(null, v.concat([1])), w = 120, h = 30, step = w / (v.length - 1);
    var pts = v.map(function (n, i) { return [i * step, h - (n / max) * (h - 4) - 2]; });
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    el('path', { d: d + ' L' + w + ' ' + h + ' L0 ' + h + ' Z', fill: 'var(--pf-c1)', opacity: '.08' }, svg);
    el('path', { d: d, fill: 'none', stroke: 'var(--pf-c1)', 'stroke-width': '2', 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke' }, svg);
  }

  function line(box, days, now, before, label) {
    box.textContent = '';
    var W = box.clientWidth || 600, H = box.clientHeight || 220, L = 34, R = 8, T = 10, B = 26;
    var max = Math.max.apply(null, now.concat(before || [], [4]));
    var raw = max / 4, mag = Math.pow(10, Math.floor(Math.log10(raw))), step = [1, 2, 2.5, 5, 10].map(function (m) { return m * mag; }).filter(function (v) { return v >= raw; })[0];
    if (step < 1) step = 1;
    max = step * 4;
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': label, direction: 'ltr' }, box);
    var x = function (i) { return L + (now.length < 2 ? 0 : i * (W - L - R) / (now.length - 1)); };
    var y = function (n) { return T + (H - T - B) * (1 - n / max); };
    for (var g = 0; g <= 4; g++) {
      var gy = T + (H - T - B) * g / 4;
      el('line', { x1: L, x2: W - R, y1: gy, y2: gy, stroke: 'var(--pf-grid)', 'stroke-width': 1 }, svg);
      el('text', { x: L - 6, y: gy + 4, 'text-anchor': 'end', class: 'pf-axis' }, svg).textContent = fmt(Math.round(max * (1 - g / 4)));
    }
    var every = Math.max(1, Math.ceil(days.length / (W < 420 ? 4 : 7)));
    days.forEach(function (d, i) {
      var lastOne = i === days.length - 1;
      if (!(i % every === 0 || lastOne) || (!lastOne && days.length - 1 - i < every * 0.75)) return;
      el('text', { x: x(i), y: H - 6, 'text-anchor': lastOne ? 'end' : (i === 0 ? 'start' : 'middle'), class: 'pf-axis' }, svg).textContent = short(d);
    });
    var path = function (arr) { return arr.map(function (n, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(n).toFixed(1); }).join(' '); };
    if (before && before.length === now.length) el('path', { d: path(before), fill: 'none', stroke: 'var(--pf-c6)', 'stroke-width': 2, 'stroke-dasharray': '5 5' }, svg);
    el('path', { d: path(now) + ' L' + x(now.length - 1) + ' ' + y(0) + ' L' + x(0) + ' ' + y(0) + ' Z', fill: 'var(--pf-c1)', opacity: '.08' }, svg);
    el('path', { d: path(now), fill: 'none', stroke: 'var(--pf-c1)', 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
    var last = now.length - 1;
    el('circle', { cx: x(last), cy: y(now[last]), r: 4.5, fill: 'var(--pf-c1)', stroke: '#fff', 'stroke-width': 2 }, svg);
    var cross = el('line', { y1: T, y2: H - B, stroke: 'var(--pf-ink2)', 'stroke-width': 1, opacity: 0 }, svg);
    var dot = el('circle', { r: 5, fill: 'var(--pf-c1)', stroke: '#fff', 'stroke-width': 2, opacity: 0 }, svg);
    var tip = document.createElement('div'); tip.className = 'pf-tip'; tip.hidden = true; box.appendChild(tip);
    var hit = el('rect', { x: L, y: 0, width: W - L - R, height: H, fill: 'transparent' }, svg);
    var move = function (ev) {
      var r = svg.getBoundingClientRect(), px = ((ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left) * W / r.width;
      var i = Math.max(0, Math.min(last, Math.round((px - L) / ((W - L - R) / Math.max(1, last)))));
      cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.setAttribute('opacity', '.25');
      dot.setAttribute('cx', x(i)); dot.setAttribute('cy', y(now[i])); dot.setAttribute('opacity', 1);
      tip.hidden = false;
      tip.innerHTML = esc(day(days[i])) + '<br><b>' + fmt(now[i]) + '</b> ' + esc(label) + (before && before.length === now.length ? '<br><span style="opacity:.75">الفترة اللي قبلها: ' + fmt(before[i]) + '</span>' : '');
      tip.style.left = (x(i) * r.width / W) + 'px'; tip.style.top = (y(now[i]) * r.height / H) + 'px';
    };
    var out = function () { tip.hidden = true; cross.setAttribute('opacity', 0); dot.setAttribute('opacity', 0); };
    hit.addEventListener('mousemove', move); hit.addEventListener('touchstart', move, { passive: true }); hit.addEventListener('touchmove', move, { passive: true });
    hit.addEventListener('mouseleave', out); hit.addEventListener('touchend', function () { setTimeout(out, 1600); });
  }

  function donut(box, data, center) {
    box.textContent = '';
    var keys = Object.keys(data || {}), total = keys.reduce(function (s, k) { return s + (+data[k] || 0); }, 0);
    if (!total) { html(box, '<p class="pf-empty">لسه مفيش أرقام في الفترة دي</p>'); return; }
    var svg = el('svg', { viewBox: '0 0 120 120', role: 'img', 'aria-label': center }, box);
    var R = 50, r = 34, a0 = -Math.PI / 2, gap = keys.length > 1 ? 0.025 : 0;
    keys.forEach(function (k, i) {
      var part = (+data[k] || 0) / total; if (!part) return;
      var a1 = a0 + part * Math.PI * 2;
      var s = a0 + gap, e = Math.max(s + 0.001, a1 - gap), big = e - s > Math.PI ? 1 : 0;
      var p = function (rad, ang) { return (60 + rad * Math.cos(ang)).toFixed(2) + ' ' + (60 + rad * Math.sin(ang)).toFixed(2); };
      var d = part >= 0.9999
        ? 'M60 10 A50 50 0 1 1 59.99 10 L59.99 26 A34 34 0 1 0 60 26 Z'
        : 'M' + p(R, s) + ' A' + R + ' ' + R + ' 0 ' + big + ' 1 ' + p(R, e) + ' L' + p(r, e) + ' A' + r + ' ' + r + ' 0 ' + big + ' 0 ' + p(r, s) + ' Z';
      var path = el('path', { d: d, fill: COLORS[k === 'تاني' ? 5 : Math.min(i, 4)] }, svg);
      el('title', {}, path).textContent = k + ': ' + fmt(data[k]) + ' (' + Math.round(part * 100) + '%)';
      a0 = a1;
    });
    el('text', { x: 60, y: 62, 'text-anchor': 'middle', class: 'pf-donut__total' }, svg).textContent = fmt(total);
    el('text', { x: 60, y: 78, 'text-anchor': 'middle', class: 'pf-donut__sub' }, svg).textContent = center;
    var ul = document.createElement('ul'); ul.className = 'pf-keys';
    keys.forEach(function (k, i) {
      ul.insertAdjacentHTML('beforeend', '<li><span class="sw" style="background:' + COLORS[k === 'تاني' ? 5 : Math.min(i, 4)] + '"></span><span class="nm">' + esc(k) + '</span><span class="vl">' + fmt(data[k]) + '</span><span class="pc">' + Math.round((+data[k] || 0) / total * 100) + '%</span></li>');
    });
    box.appendChild(ul);
  }

  function ring(box, percent, title, sub, color) {
    var svg = el('svg', { viewBox: '0 0 120 120', role: 'img', 'aria-label': title }, box);
    el('circle', { cx: 60, cy: 60, r: 48, fill: 'none', stroke: 'var(--pf-grid)', 'stroke-width': 12 }, svg);
    if (percent !== null && percent !== undefined) {
      var c = 2 * Math.PI * 48;
      el('circle', { cx: 60, cy: 60, r: 48, fill: 'none', stroke: color, 'stroke-width': 12, 'stroke-linecap': 'round', 'stroke-dasharray': (c * Math.max(0.005, percent / 100)).toFixed(1) + ' ' + c.toFixed(1), transform: 'rotate(-90 60 60)' }, svg);
    }
    el('text', { x: 60, y: 66, 'text-anchor': 'middle', class: 'pf-gauge__num', fill: percent === null ? 'var(--pf-muted)' : color }, svg).textContent = percent === null || percent === undefined ? '—' : percent + (sub || '');
    return svg;
  }

  function bars(box, data) {
    box.textContent = '';
    var keys = Object.keys(data || {}), max = Math.max.apply(null, values(data).concat([1]));
    if (!keys.length || !values(data).some(Boolean)) { html(box, '<p class="pf-empty">لسه مفيش أرقام في الفترة دي</p>'); return; }
    keys.forEach(function (k, i) {
      box.insertAdjacentHTML('beforeend', '<div class="pf-bar"><span class="nm">' + esc(k) + '</span><span class="tr"><span class="fl" style="width:' + Math.max(1, data[k] / max * 100).toFixed(1) + '%;background:' + (k === 'تاني' ? COLORS[5] : COLORS[0]) + '"></span></span><span class="vl">' + fmt(data[k]) + '</span></div>');
    });
  }

  function stats(box, list) {
    box.innerHTML = list.map(function (s) {
      var d = root.getAttribute('data-period') !== 'day' && s.pair && s.pair.change !== null && s.pair.change !== undefined ? '<small style="color:' + (s.pair.change > 0 ? 'var(--pf-good)' : (s.pair.change < 0 ? 'var(--pf-bad)' : 'var(--pf-muted)')) + '">' + (s.pair.change > 0 ? '▲' : (s.pair.change < 0 ? '▼' : '')) + Math.abs(s.pair.change) + '%</small>' : '';
      return '<div class="pf-stat"><span>' + esc(s.label) + '</span><strong>' + (s.text !== undefined ? esc(s.text) : fmt(s.value)) + '</strong>' + d + '</div>';
    }).join('');
  }

  function speedLabel(score) { return score >= 90 ? ['ممتاز', 'var(--pf-good)', 'var(--pf-good-bg)'] : (score >= 50 ? ['محتاج تحسين', 'var(--pf-warn)', '#fff3df'] : ['بطيء', 'var(--pf-bad)', 'var(--pf-bad-bg)']); }

  function render(period) {
    var D = ALL[period]; if (!D) return;
    root.setAttribute('data-period', period);
    root.querySelectorAll('[data-pf-tab]').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-pf-tab') === period ? 'true' : 'false'); });
    root.querySelector('[data-pf-range]').textContent = (D.from === D.to ? 'النهارده ' + day(D.to) + ' لحد دلوقتي' : day(D.from) + ' — ' + day(D.to)) + ' · مقارنة بـ ' + (D.prev_from === D.prev_to ? day(D.prev_to) : day(D.prev_from) + ' — ' + day(D.prev_to));
    var note = root.querySelector('[data-pf-note]');
    note.hidden = !!D.site.tracking;
    note.textContent = D.site.tracking ? '' : 'عدّاد زيارات الموقع لسه بادئ — أرقام الزوار والمصادر والأجهزة هتبدأ تظهر من أول زيارة. باقي الأرقام (الطلبات ، Shary AI ، الإيجنت) شغالة.';

    var sparks = { 'site.visitors': D.site.series, 'site.views': D.site.series_views, 'leads.total': D.leads.series, 'leads.meetings': D.leads.series, 'ai.conversations': D.ai.series, 'agent.prepared': D.agent.series };
    root.querySelectorAll('[data-kpi]').forEach(function (k) {
      var path = k.getAttribute('data-kpi'), pair = get(D, path);
      k.querySelector('[data-num]').textContent = fmt(pair ? pair.now : null);
      delta(k.querySelector('[data-delta]'), pair, period === 'day');
      spark(k.querySelector('[data-spark]'), path === 'leads.meetings' ? null : sparks[path]);
    });

    var days = D.chart_days || Object.keys(D.site.series || {});
    line(root.querySelector('[data-chart="visits"]'), days, values(D.site.series), D.site.series_before, 'زائر');
    html(root.querySelector('[data-legend="visits"]'), '<span><i></i>الفترة دي</span><span><i class="is-prev"></i>الفترة اللي قبلها</span>');
    line(root.querySelector('[data-chart="leads"]'), Object.keys(D.leads.series || {}), values(D.leads.series), null, 'طلب');

    root.querySelectorAll('[data-donut]').forEach(function (b) { donut(b, get(D, b.getAttribute('data-donut')), b.getAttribute('data-center')); });
    root.querySelectorAll('[data-bars]').forEach(function (b) { bars(b, get(D, b.getAttribute('data-bars'))); });

    var sp = root.querySelector('[data-speed]'); sp.textContent = '';
    var S = D.speed;
    root.querySelector('[data-speed-at]').textContent = S ? 'آخر قياس ' + S.at : '';
    if (!S) { html(sp, '<p class="pf-empty" style="grid-column:1/-1">لسه ما اتقاستش — بتتقاس لوحدها كل يوم الصبح (أو من زرار «قيس السرعة دلوقتي» في لوحة التحكم).</p>'); }
    else ['mobile', 'desktop'].forEach(function (k) {
      var m = S[k] || {}, lab = speedLabel(m.score || 0), g = document.createElement('div'); g.className = 'pf-gauge';
      ring(g, m.score, k === 'mobile' ? 'موبايل' : 'كمبيوتر', '', lab[1]);
      g.insertAdjacentHTML('beforeend', '<div class="pf-gauge__name">' + (k === 'mobile' ? 'موبايل' : 'كمبيوتر') + '</div><span class="pf-gauge__tag" style="color:' + lab[1] + ';background:' + lab[2] + '">' + lab[0] + '</span><div class="pf-gauge__meta">أول ظهور ' + m.fcp + 'ث · المحتوى الأساسي ' + m.lcp + 'ث<br>التهنيج ' + fmt(m.tbt) + 'ms · الثبات ' + m.cls + '</div>');
      sp.appendChild(g);
    });

    var G = D.google, gb = root.querySelector('[data-google]');
    if (!G) html(gb, '<p class="pf-empty">اربط «سيرش كونسول» من الإيجنت ← المفاتيح والربط ، وهتظهر هنا الضغطات والظهور وترتيبك في جوجل.</p>');
    else if (G.error) html(gb, '<p class="pf-empty">' + esc(G.error) + '</p>');
    else {
      html(gb, '<div class="pf-stats" style="grid-template-columns:repeat(2,minmax(0,1fr))"></div><div class="pf-bars"></div>');
      stats(gb.querySelector('.pf-stats'), [{ label: 'ضغطات من جوجل', value: G.clicks }, { label: 'مرات الظهور', value: G.impressions }, { label: 'نسبة الضغط', text: G.ctr + '%' }, { label: 'متوسط الترتيب', text: G.position === null ? '—' : String(G.position) }]);
      var top = {}; (G.top || []).forEach(function (r) { top[r.key] = r.clicks; }); bars(gb.querySelector('.pf-bars'), top);
    }

    var steps = [['الزوار', D.site.visitors.now], ['طلبات', D.leads.total.now], ['ميتنجات', D.leads.meetings.now]];
    var top1 = Math.max.apply(null, steps.map(function (s) { return s[1]; }).concat([1]));
    root.querySelector('[data-funnel]').innerHTML = steps.map(function (s, i) {
      return '<div class="pf-step"><span class="nm">' + s[0] + '</span><span class="fl" style="width:' + Math.max(12, s[1] / top1 * 100).toFixed(1) + '%;background:' + COLORS[i] + '">' + fmt(s[1]) + '</span></div>';
    }).join('');
    root.querySelector('[data-conversion]').textContent = D.leads.conversion === null ? '' : 'معدل التحويل ' + D.leads.conversion + '%';

    stats(root.querySelector('[data-stats="ai"]'), [
      { label: 'محادثات', value: D.ai.conversations.now, pair: D.ai.conversations },
      { label: 'رسايل', value: D.ai.messages.now, pair: D.ai.messages },
      { label: 'بقوا عملاء (طلب)', value: D.ai.leads.now, pair: D.ai.leads },
      { label: 'عملاء سخنين', value: D.ai.hot }
    ]);
    root.querySelector('[data-ai-speed]').textContent = D.ai.answer_ms ? 'متوسط وقت الرد ' + (D.ai.answer_ms / 1000).toFixed(1) + ' ثانية' : '';

    var rb = root.querySelector('[data-agent-ring]'); rb.textContent = '';
    ring(rb, D.agent.success, 'نجاح المهام', '%', 'var(--pf-c2)');
    rb.insertAdjacentHTML('beforeend', '<ul class="pf-keys"><li><span class="sw" style="background:var(--pf-c2)"></span><span class="nm">خلصت</span><span class="vl">' + fmt(D.agent.done) + '</span><span></span></li><li><span class="sw" style="background:var(--pf-c5)"></span><span class="nm">ما كملتش</span><span class="vl">' + fmt(D.agent.failed) + '</span><span></span></li><li><span class="sw" style="background:var(--pf-c6)"></span><span class="nm">مهام شغالة لوحدها</span><span class="vl">' + fmt(D.agent.tasks_on) + '</span><span></span></li></ul>');
    stats(root.querySelector('[data-stats="agent"]'), [
      { label: 'اقتراحات جهّزها', value: D.agent.prepared.now, pair: D.agent.prepared },
      { label: 'اتنشر', value: D.agent.published },
      { label: 'مستنية قرارك', value: D.agent.waiting },
      { label: 'مقالات وصفحات', value: D.agent.articles },
      { label: 'تعديلات على الموقع', value: D.agent.changes },
      { label: 'باك لينكس', value: D.agent.backlinks },
      { label: 'خطوات سيو خلصت', value: D.agent.seo_done },
      { label: 'تكلفة الذكاء الاصطناعي', text: '$' + D.agent.cost }
    ]);
    var plan = D.agent.seo_plan, doneAll = D.agent.seo_all_done, pct = plan ? Math.round(doneAll / plan * 100) : 0;
    root.querySelector('[data-seo-progress]').innerHTML = '<div class="pf-progress__head"><span>خطة السيو</span><span>' + fmt(doneAll) + ' من ' + fmt(plan) + ' خطوة (' + pct + '%)</span></div><div class="pf-progress__track"><div class="pf-progress__fill" style="width:' + Math.max(pct, plan ? 1 : 0) + '%"></div></div>';

    var pages = D.site.pages || {}, pl = root.querySelector('[data-pages]');
    pl.innerHTML = Object.keys(pages).length ? Object.keys(pages).map(function (p) { return '<li><span class="nm" title="' + esc(p) + '">' + esc(decodeURI(p)) + '</span><span class="vl">' + fmt(pages[p]) + '</span></li>'; }).join('') : '<p class="pf-empty">لسه مفيش أرقام في الفترة دي</p>';

    root.querySelector('[data-pf-built]').textContent = 'الأرقام اتحدّثت ' + D.built_at + ' (بتوقيت القاهرة) — بتتحدّث كل 10 دقايق';
  }

  var current = root.getAttribute('data-period') || 'week';
  root.querySelectorAll('[data-pf-tab]').forEach(function (b) {
    b.addEventListener('click', function () {
      current = b.getAttribute('data-pf-tab'); render(current);
      try { history.replaceState(null, '', location.pathname + location.search.replace(/([?&])period=[a-z]+&?/, '$1').replace(/[?&]$/, '') + '#' + current); } catch (e) {}
    });
  });
  var fromHash = (location.hash || '').slice(1);
  if (ALL[fromHash]) current = fromHash;
  render(current);
  var w = window.innerWidth;
  window.addEventListener('resize', function () { if (Math.abs(window.innerWidth - w) > 40) { w = window.innerWidth; render(current); } });
})();
