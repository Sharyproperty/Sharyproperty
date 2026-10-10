/**
 * ستوري المطور: الضغط على لوجو المطور اللي له ستوري بيفتح الستوري على الشاشة كلها (فيديو أو صورة) —
 * ولما الستوري يخلص بيفتح صفحة المطور لوحده. علامة X (أو زرار الرجوع / Esc) بتقفل الستوري والعميل يفضل في مكانه.
 *
 * أي عنصر عليه data-story (JSON):
 *   { "name": "اسم المطور", "logo": "لينك اللوجو", "url": "لينك صفحة المطور",
 *     "items": [ { "type": "video", "src": "story.mp4", "poster": "صورة" } , { "type": "image", "src": "صورة", "seconds": 5 } ],
 *     "go": "صفحة المطور", "close": "إغلاق", "sound": "الصوت" }
 * أكتر من ستوري لنفس المطور = أكتر من عنصر في items (بيتعرضوا ورا بعض). الضغط يمين / شمال = اللي بعده / اللي قبله ، والضغط المطوّل = إيقاف مؤقت.
 * حدث على العنصر: shary:story-end (قبل فتح صفحة المطور — امنعوه بـ preventDefault لو عايزين تصرف تاني).
 */
(function () {
    'use strict';
    var view = null;       // { box, data, index, timer, video, started, left, paused, trigger }

    function make(tag, className, text) {
        var el = document.createElement(tag);
        if (className) el.className = className;
        if (text != null) el.textContent = text;
        return el;
    }

    function close(silent) {
        if (!view) return;
        window.clearTimeout(view.timer);
        window.cancelAnimationFrame(view.frame);
        if (view.video) { try { view.video.pause(); } catch (error) { /* خلص */ } }
        view.box.remove();
        document.documentElement.style.overflow = view.overflow;
        var back = view.back;
        view = null;
        if (!silent && back && window.SharyBack) window.SharyBack.closed();
    }

    // الستوري خلص: صفحة المطور
    function finish() {
        if (!view) return;
        var trigger = view.trigger, url = view.data.url;
        var ok = trigger.dispatchEvent(new CustomEvent('shary:story-end', { bubbles: true, cancelable: true, detail: { url: url } }));
        close();
        if (!ok) return;
        // صفحة المطور: لينك المطور نفسه اللي في الكارت (لو موجود) — وإلا لينك الستوري
        var card = trigger.closest('.dev-icon, [data-developer-tile], [data-story-card]');
        var real = card ? card.querySelector('a[href]:not([data-story])') : null;
        if (real) real.click(); else if (url) window.location.href = url;
    }

    function bars() {
        var now = view.index;
        Array.prototype.forEach.call(view.bars.children, function (bar, at) {
            bar.firstChild.style.width = at < now ? '100%' : (at > now ? '0%' : bar.firstChild.style.width);
        });
    }

    function tick() {
        if (!view) return;
        var bar = view.bars.children[view.index];
        var ratio = 0;
        if (view.video && view.video.duration) ratio = view.video.currentTime / view.video.duration;
        else if (view.length) ratio = (view.spent + (view.paused ? 0 : Date.now() - view.started)) / view.length;
        if (bar) bar.firstChild.style.width = Math.max(0, Math.min(100, ratio * 100)) + '%';
        view.frame = window.requestAnimationFrame(tick);
    }

    function show(index) {
        if (!view) return;
        var items = view.data.items;
        if (index >= items.length) return finish();
        index = Math.max(0, index);
        window.clearTimeout(view.timer);
        if (view.video) { try { view.video.pause(); } catch (error) { /* خلص */ } }
        view.index = index; view.video = null; view.length = 0; view.spent = 0; view.paused = false;
        view.stage.textContent = '';
        Array.prototype.forEach.call(view.bars.children, function (bar, at) { bar.firstChild.style.width = at < index ? '100%' : '0%'; });
        var item = items[index];
        if (item.type === 'video') {
            var video = make('video');
            video.setAttribute('playsinline', ''); video.setAttribute('webkit-playsinline', '');
            video.preload = 'auto';
            if (item.poster) video.poster = item.poster;
            video.src = item.src;
            video.muted = view.muted;
            video.addEventListener('ended', function () { if (view && view.video === video) show(index + 1); });
            video.addEventListener('error', function () { if (view && view.video === video) show(index + 1); });   // الفيديو ما حملش: اللي بعده (أو صفحة المطور)
            view.stage.appendChild(video);
            view.video = video;
            view.sound.hidden = false;
            var playing = video.play();
            // المتصفح منع الصوت من غير ضغطة: يشتغل صامت والعميل يفتح الصوت من الزرار
            if (playing && playing.catch) playing.catch(function () { if (!view || view.video !== video) return; view.muted = true; video.muted = true; soundIcon(); var again = video.play(); if (again && again.catch) again.catch(function () { /* هيتشغّل بضغطة */ }); });
        } else {
            var image = make('img'); image.alt = view.data.name || ''; image.src = item.src;
            view.stage.appendChild(image);
            view.sound.hidden = true;
            view.length = Math.max(2, Number(item.seconds) || 5) * 1000;
            view.started = Date.now();
            view.timer = window.setTimeout(function () { show(index + 1); }, view.length);
        }
    }

    function pause(state) {
        if (!view || view.paused === state) return;
        view.paused = state;
        if (view.video) { if (state) view.video.pause(); else { var p = view.video.play(); if (p && p.catch) p.catch(function () {}); } return; }
        if (!view.length) return;
        if (state) { window.clearTimeout(view.timer); view.spent += Date.now() - view.started; }
        else { view.started = Date.now(); var index = view.index; view.timer = window.setTimeout(function () { show(index + 1); }, Math.max(0, view.length - view.spent)); }
    }

    var SOUND_ON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.500v5h3.500L12 18.500v-13L7.500 9.500H4Z" fill="currentColor"/><path d="M15.500 9a4 4 0 0 1 0 6M18 6.500a7.500 7.500 0 0 1 0 11"/></svg>';
    var SOUND_OFF = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.500v5h3.500L12 18.500v-13L7.500 9.500H4Z" fill="currentColor"/><path d="m16 9.500 5 5M21 9.500l-5 5"/></svg>';
    function soundIcon() { if (view) { view.sound.innerHTML = view.muted ? SOUND_OFF : SOUND_ON; view.sound.setAttribute('aria-pressed', view.muted ? 'false' : 'true'); } }

    function open(trigger, data) {
        close(true);
        var host = trigger.closest('[lang]');
        var english = ((host && host.lang) || document.documentElement.lang || 'ar').indexOf('en') === 0;
        var box = make('div', 'story');
        box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', data.name || '');
        box.dir = english ? 'ltr' : 'rtl'; box.lang = english ? 'en' : 'ar';
        var frame = make('div', 'story__frame');
        var stage = make('div', 'story__stage');
        var top = make('div', 'story__top');
        var barsBox = make('div', 'story__bars');
        data.items.forEach(function () { var bar = make('span'); bar.appendChild(make('i')); barsBox.appendChild(bar); });
        var head = make('div', 'story__head');
        var who = make('div', 'story__who');
        if (data.logo) { var logo = make('img'); logo.alt = ''; logo.src = data.logo; logo.addEventListener('error', function () { logo.remove(); }); who.appendChild(logo); }
        who.appendChild(make('b', '', data.name || ''));
        var sound = make('button', 'story__btn'); sound.type = 'button'; sound.setAttribute('aria-label', data.sound || (english ? 'Sound' : 'الصوت'));
        var shut = make('button', 'story__btn'); shut.type = 'button'; shut.setAttribute('aria-label', data.close || (english ? 'Close' : 'إغلاق'));
        shut.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
        head.appendChild(who); head.appendChild(sound); head.appendChild(shut);
        top.appendChild(barsBox); top.appendChild(head);
        // الضغط: نص الشاشة اللي في اتجاه القراءة = اللي بعده ، التاني = اللي قبله. الضغط المطوّل = إيقاف مؤقت
        var prev = make('button', 'story__tap story__tap--prev'); prev.type = 'button'; prev.setAttribute('aria-label', english ? 'Previous' : 'السابق');
        var next = make('button', 'story__tap story__tap--next'); next.type = 'button'; next.setAttribute('aria-label', english ? 'Next' : 'التالي');
        var go = make('a', 'story__go', data.go || (english ? 'Developer page' : 'صفحة المطور'));
        go.href = data.url || '#';
        frame.appendChild(stage); frame.appendChild(prev); frame.appendChild(next); frame.appendChild(top); frame.appendChild(go);
        box.appendChild(frame);
        document.body.appendChild(box);
        view = { box: box, data: data, index: 0, stage: stage, bars: barsBox, sound: sound, go: go, trigger: trigger, muted: false, overflow: document.documentElement.style.overflow, back: false };
        document.documentElement.style.overflow = 'hidden';
        soundIcon();
        var held = 0, long = false;
        [prev, next].forEach(function (zone) {
            zone.addEventListener('pointerdown', function () { long = false; held = window.setTimeout(function () { long = true; pause(true); }, 220); });
            ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (name) { zone.addEventListener(name, function () { window.clearTimeout(held); if (long) pause(false); }); });
            zone.addEventListener('click', function () { if (long) { long = false; return; } if (!view) return; show(view.index + (zone === next ? 1 : -1)); });
        });
        sound.addEventListener('click', function () { view.muted = !view.muted; if (view.video) view.video.muted = view.muted; soundIcon(); });
        shut.addEventListener('click', function () { close(); });
        // "صفحة المطور" دلوقتي: نفس نهاية الستوري
        go.addEventListener('click', function (event) { event.preventDefault(); finish(); });
        box.addEventListener('click', function (event) { if (event.target === box) close(); });
        if (window.SharyBack) { view.back = true; window.SharyBack.opened(function () { close(true); }); }
        show(0);
        tick();
        shut.focus({ preventScroll: true });
    }

    document.addEventListener('click', function (event) {
        var trigger = event.target.closest ? event.target.closest('[data-story]') : null;
        if (!trigger) return;
        var data = null;
        try { data = JSON.parse(trigger.getAttribute('data-story')); } catch (error) { data = null; }
        if (!data || !Array.isArray(data.items) || !data.items.length) return;   // مفيش ستوري: اللينك بيشتغل عادي
        event.preventDefault();
        event.stopPropagation();
        open(trigger, data);
    }, true);
    document.addEventListener('keydown', function (event) {
        if (!view) return;
        if (event.key === 'Escape') close();
        else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') show(view.index + ((event.key === 'ArrowLeft') === (view.box.dir === 'rtl') ? 1 : -1));
    });
    document.addEventListener('visibilitychange', function () { if (view) pause(document.hidden); });

    window.SharyStory = { open: open, close: function () { close(); } };
})();
