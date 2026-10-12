(function () {
  // the ready answers (~1.3MB) load only when the customer first writes to Shary AI — not on every page (phones froze parsing them)
  var DATA = null, FOLLOW = null, NOTE = {"ar": "دي نسخة معاينة من غير سيرفر، فـ Shary AI بيرد هنا على الأسئلة الجاهزة دي بس — ردود حقيقية من المساعد على البيانات التجريبية. بعد التركيب على السيرفر بيرد على أي سؤال.", "en": "This is a preview without a server, so Shary AI answers only these ready questions here — real answers of the assistant on the demo data. On the server it answers any question."}, BASE = "/Sharyproperty/bound/", loading = null;
  var TYPES = ['apartment','villa','townhouse','twin-house','duplex','penthouse','studio','chalet'];
  var BUDGETS = ['0-5000000','5000000-10000000','10000000-20000000','20000000-'];
  function norm(t) { return String(t || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[؟?!.،,]/g, ' ').replace(/\s+/g, ' ').trim(); }
  var index = {};
  function load() {
    if (!loading) loading = fetch(BASE + 'js/ai-demo-data.json').then(function (r) { return r.json(); }).then(function (pack) {
      DATA = pack.data || {}; FOLLOW = pack.follow || {};
      Object.keys(DATA).forEach(function (lang) { index[lang] = {}; Object.keys(DATA[lang]).forEach(function (q) { index[lang][norm(q)] = { answer: DATA[lang][q], follow: (FOLLOW[lang] || {})[q] || {} }; }); });
    }).catch(function () { DATA = { ar: {}, en: {} }; FOLLOW = {}; index = { ar: {}, en: {} }; });
    return loading;
  }
  var current = {}, earlier = {};          // ردود الترشيحات تحت آخر رد (وتحت الرد اللي قبله)
  function mapOf(follow) { var out = {}; Object.keys(follow || {}).forEach(function (k) { out[norm(k)] = follow[k]; }); return out; }
  function first(v) { return Array.isArray(v) ? (v[0] && (v[0].value || v[0])) : (v && (v.value || v)); }
  document.addEventListener('shary:ai-send', function (event) {
    var d = event.detail || {};
    if (typeof d.reply !== 'function') return;
    event.preventDefault();
    load().then(function () { answer(d); });
  });
  function answer(d) {
    var lang = d.lang === 'en' ? 'en' : 'ar', key = norm(d.text), a = d.answers || {};
    if (d.via === 'steps' && (a.area || a.type || a.budget)) {
      var area = first(a.area) || 'any', type = first(a.type) || 'any', budget = first(a.budget) || 'any';
      if (TYPES.indexOf(type) < 0) type = 'any';
      if (BUDGETS.indexOf(budget) < 0) budget = 'any';
      fetch(BASE + 'js/ai/' + lang + '_' + area + '_' + type + '_' + budget + '.json').then(function (r) { if (!r.ok) throw r; return r.json(); }).then(function (pack) {
        earlier = {}; current = mapOf(pack.follow);
        d.reply(pack.answer.reply, pack.answer);
      }).catch(function () { d.reply(NOTE[lang], { feedback: false, options: Object.keys(DATA[lang] || {}).slice(0, 8) }); });
      return;
    }
    window.setTimeout(function () {
      var hit = current[key] || earlier[key];
      if (hit) { d.reply(hit.reply, hit); return; }
      var ready = index[lang][key];
      if (ready) { earlier = current; current = mapOf(ready.follow); d.reply(ready.answer.reply, ready.answer); return; }
      d.reply(NOTE[lang], { feedback: false, options: Object.keys(DATA[lang] || {}).slice(0, 8) });
    }, 700);
  }
})();
