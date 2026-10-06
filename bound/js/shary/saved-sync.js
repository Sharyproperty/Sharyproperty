/**
 * المفضلة والمقارنة على السيرفر (SavedController ← جداول favorites / compares — للعميل المسجل أو الزائر بالكوكي).
 * الواجهة زي ما هي: site-chrome.js بيحدّث القلب / "قارن" فورًا من localStorage (shary-favorites / shary-compare) وبيطلّع الأحداث ،
 * والملف ده بيوصّلها بالسيرفر:
 * - shary:favorite / shary:compare ({ id, active })  ← POST data-saved-toggle { kind, id, active }
 * - shary:compare-clear ("إلغاء" في شريط المقارنة / X في صفحة المقارنة) ← POST { kind: 'compare', clear: true }
 * - عند فتح أي صفحة: GET data-saved-state ← { known, favorites: [ids], compare: [ids] } والمحفوظ على الجهاز بيتظبط على السيرفر
 *   (أول مرة / زائر لسه مالوش كوكي / بعد تسجيل الدخول: المحفوظ على الجهاز بيتبعت للسيرفر الأول — دمج — وبعدها السيرفر هو المرجع).
 * - شكل الـ id: units/{slug} للوحدات و projects/{slug} للمشاريع (الـ slug بأي لغة — السيرفر بيرجّعه بلغة الصفحة). أي id تاني بيفضل على الجهاز بس.
 * العناوين من <body data-saved-toggle data-saved-state data-visitor> (layouts/site). من غير السكربت: الموقع شغال بالمحفوظ على الجهاز زي الأول.
 * window.SharySavedSync = { sync(force), send(kind, id, active) }
 */
(function () {
    'use strict';
    var body = document.body;
    var toggleUrl = body ? body.getAttribute('data-saved-toggle') : '';
    var stateUrl = body ? body.getAttribute('data-saved-state') : '';
    if (!toggleUrl || !stateUrl || !window.fetch) return;

    var visitor = body.getAttribute('data-visitor') || 'g';
    var lang = (document.documentElement.lang || 'ar').slice(0, 2);
    var KEYS = { favorite: 'shary-favorites', compare: 'shary-compare' };
    var META = 'shary-saved-sync';
    var FRESH = 60000;   // أقل وقت بين مرتين تحميل من السيرفر في نفس المتصفح (غير صفحتي المفضلة والمقارنة)

    function read(key) { try { return JSON.parse(window.localStorage.getItem(key)) || []; } catch (error) { return []; } }
    function write(key, list) { try { window.localStorage.setItem(key, JSON.stringify(list)); } catch (error) { /* التخزين مقفول */ } }
    function meta() { try { return JSON.parse(window.localStorage.getItem(META)) || {}; } catch (error) { return {}; } }
    function onServer(id) { return /^(units|projects)\/.+/.test(String(id || '')); }
    function token() { var node = document.querySelector('meta[name="csrf-token"]'); return node ? node.getAttribute('content') : ''; }

    function post(data) {
        return fetch(toggleUrl, {
            method: 'POST', credentials: 'same-origin', keepalive: true,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': token(), 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify(data)
        }).then(function (response) { return response.json().catch(function () { return {}; }).then(function (json) { json.__ok = response.ok; return json; }); });
    }

    function send(kind, id, active) {
        if (!onServer(id)) return Promise.resolve(null);
        return post({ kind: kind, id: id, active: !!active }).catch(function () { return null; });
    }

    // ---- الواجهة على حسب القايمة (القلوب اللي اتشالت من جهاز تاني بترجع فاضية)
    function paint(favorites, compare) {
        var localFavorites = read(KEYS.favorite).filter(function (id) { return !onServer(id); }).concat(favorites);
        write(KEYS.favorite, localFavorites);
        Array.prototype.forEach.call(document.querySelectorAll('[data-favorite-toggle]'), function (button) {
            var id = button.getAttribute('data-favorite-id');
            if (id) button.setAttribute('aria-pressed', localFavorites.indexOf(id) !== -1 ? 'true' : 'false');
        });
        if (window.SharyCards) window.SharyCards.refresh(document);
        var localCompare = read(KEYS.compare).filter(function (id) { return !onServer(id); }).concat(compare);
        // SharyCompare.write بيحدّث أزرار "قارن" وشريط المقارنة (من غير أحداث — فمش بيتبعت للسيرفر تاني)
        if (window.SharyCompare) window.SharyCompare.write(localCompare); else write(KEYS.compare, localCompare);
    }

    function sync(force) {
        var last = meta();
        var same = last.visitor === visitor && last.lang === lang;
        var savedPage = !!document.querySelector('[data-saved-page]');
        if (!force && !savedPage && same && Date.now() - (last.at || 0) < FRESH) return Promise.resolve(null);

        return fetch(stateUrl, { credentials: 'same-origin', headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' } })
            .then(function (response) { if (!response.ok) throw new Error('state'); return response.json(); })
            .then(function (state) {
                var favorites = state.favorites || [], compare = state.compare || [];
                // دمج المحفوظ على الجهاز: أول تشغيل ، زائر مالوش هوية على السيرفر ، أو عميل لسه مسجّل دخوله
                var merge = !last.visitor || !state.known || (last.visitor !== visitor && visitor !== 'g');
                var jobs = [];
                if (merge) {
                    var addFavorites = read(KEYS.favorite).filter(function (id) { return onServer(id) && favorites.indexOf(id) === -1; });
                    var addCompare = read(KEYS.compare).filter(function (id) { return onServer(id) && compare.indexOf(id) === -1; });
                    // نفس اللغة بس: الـ slug بلغة تانية ممكن يبقى موجود على السيرفر بالفعل — السيرفر بيتجاهل التكرار
                    if (addFavorites.length) jobs.push(post({ kind: 'favorite', ids: addFavorites, active: true }));
                    if (addCompare.length) jobs.push(post({ kind: 'compare', ids: addCompare, active: true }));
                }
                return Promise.all(jobs).then(function (results) {
                    results.forEach(function (result) {
                        if (result && Array.isArray(result.favorites)) favorites = result.favorites;
                        if (result && Array.isArray(result.compare)) compare = result.compare;
                    });
                    paint(favorites, compare);
                    write(META, { visitor: visitor, lang: lang, at: Date.now() });
                    document.dispatchEvent(new CustomEvent('shary:saved-synced', { detail: { favorites: favorites, compare: compare } }));
                    return { favorites: favorites, compare: compare };
                });
            })
            .catch(function () { return null; });
    }

    // ---- تغييرات العميل ← السيرفر
    document.addEventListener('shary:favorite', function (event) {
        var detail = event.detail || {};
        if (detail.id) send('favorite', detail.id, detail.active);
    });
    document.addEventListener('shary:compare', function (event) {
        var detail = event.detail || {};
        if (detail.id) send('compare', detail.id, detail.active);
    });
    document.addEventListener('shary:compare-clear', function () {
        post({ kind: 'compare', clear: true }).catch(function () { /* هيتظبط في المزامنة الجاية */ });
    });

    // "قارن بين المحفوظ" في صفحة المفضلة: saved-pages.js بيكتب المقارنة على الجهاز وبيفتح صفحة المقارنة —
    // بنبعت الاختيار للسيرفر الأول (مكان مقارنة نفس النوع) وبعدين نفتح الصفحة
    document.addEventListener('click', function (event) {
        var link = event.target.closest ? event.target.closest('[data-saved-compare]') : null;
        if (!link || event.defaultPrevented || !window.SharyCompare) return;
        var open = document.querySelector('[data-saved-page] [data-saved-panel]:not(.hidden)');
        var group = open ? open.getAttribute('data-saved-panel') : '';
        if (group !== 'units' && group !== 'projects') return;
        event.preventDefault();
        var picked = window.SharyCompare.read().filter(function (id) { return id.indexOf(group + '/') === 0; });
        var done = false;
        function go() { if (done) return; done = true; window.location.href = link.getAttribute('href'); }
        post({ kind: 'compare', clear: true, group: group })
            .then(function () { return picked.length ? post({ kind: 'compare', ids: picked, active: true }) : null; })
            .then(go, go);
        window.setTimeout(go, 2500);
    });

    window.SharySavedSync = { sync: sync, send: send };

    if (document.readyState === 'complete') sync(false);
    else window.addEventListener('load', function () { sync(false); });
})();
