/*
 * الصور في الكروت والسلايدر: من غير تزويم ومن غير قص — أوتوماتيك على كل الصور (القديمة والجديدة) من غير ما حد يعمل حاجة.
 * الفكرة: لكل صورة بتملا بوكس (object-fit: cover أو background-size: cover) بنقارن مقاس الصورة بمقاس البوكس:
 *   - لو قريبين (الفرق ≤ 14% — والسلايدر ≤ 30%): الصورة تفضل مالية البوكس زي ما هي (القص مش بيبان).
 *   - لو بعاد: الصورة بتظهر كاملة (contain) — والفراغ اللي حواليها بيتملي بنفس الصورة مغبّشة ، فالبوكس يفضل مليان وشكله احترافي.
 * مستثنى: اللوجوهات والأيقونات (أصغر من 110 بكسل / مدورة / svg) ، وأي عنصر عليه data-fit="off".
 * بيشتغل لما الصورة تحمّل (حتى الصور اللي بتحمّل وانت نازل) ، ولما الشاشة يتغير مقاسها ، وعلى الكروت اللي بتتضاف بعدين (سلايدر / فلاتر).
 */
(function () {
  'use strict';
  if (window.__sharyImgFit) return;
  window.__sharyImgFit = true;

  var LIMIT = 0.14;        // أقصى قص مقبول قبل ما نعرض الصورة كاملة
  var LIMIT_HERO = 0.30;   // السلايدر (عريض) بيستحمل قص أكتر قبل ما يتحول
  var MIN_SIZE = 110;

  function skip(el) {
    if (!el || el.closest('[data-fit="off"]')) return true;
    if (el.closest('.dev-logo-link, .dev-icon__logo, [data-logo-fit], [data-developer-logo], header, footer, .article-content')) return true;
    var cs = getComputedStyle(el);
    if (parseFloat(cs.borderTopLeftRadius) >= el.clientWidth / 2 - 1 && el.clientWidth < 220) return true; // دايرة (لوجو / صورة شخص)
    return false;
  }

  function isHero(el) {
    return !!el.closest('.hero-bg, .hero-section, [data-hero], .afp-hero, .swiper-slide.hero, .hero-slide');
  }

  function crop(boxW, boxH, imgW, imgH) {
    if (!boxW || !boxH || !imgW || !imgH) return 0;
    var a = boxW / boxH, b = imgW / imgH;
    return 1 - Math.min(a, b) / Math.max(a, b);
  }

  function backdrop(parent, url, before) {
    var bg = parent.querySelector(':scope > .sx-fit-bg');
    if (!bg) {
      bg = document.createElement('span');
      bg.className = 'sx-fit-bg';
      bg.setAttribute('aria-hidden', 'true');
      parent.insertBefore(bg, before || parent.firstChild);
    }
    bg.style.backgroundImage = 'url("' + url.replace(/"/g, '%22') + '")';
    if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
    parent.classList.add('sx-fit-host');
    return bg;
  }

  function clearBackdrop(parent) {
    var bg = parent && parent.querySelector(':scope > .sx-fit-bg');
    if (bg) bg.remove();
    if (parent) parent.classList.remove('sx-fit-host');
  }

  /* <img> بـ object-fit: cover */
  function fitImg(img) {
    if (!img.complete || !img.naturalWidth || skip(img)) return;
    var src = img.currentSrc || img.src || '';
    if (!src || /\.svg(\?|$)/i.test(src)) return;
    var w = img.clientWidth, h = img.clientHeight;
    if (w < MIN_SIZE || h < MIN_SIZE) return;
    var fit = img.dataset.sxFit ? 'cover' : getComputedStyle(img).objectFit;
    if (fit !== 'cover') return;
    var c = crop(w, h, img.naturalWidth, img.naturalHeight);
    var parent = img.parentElement;
    if (parent && parent.tagName === 'PICTURE') parent = parent.parentElement;
    if (c > (isHero(img) ? LIMIT_HERO : LIMIT)) {
      img.dataset.sxFit = '1';
      img.classList.add('sx-fit-contain');
      if (getComputedStyle(img).position === 'static') img.style.position = 'relative';
      var anchor = img.parentElement.tagName === 'PICTURE' ? img.parentElement : img;
      backdrop(parent, src, anchor);
    } else if (img.dataset.sxFit) {
      img.classList.remove('sx-fit-contain');
      delete img.dataset.sxFit;
      clearBackdrop(parent);
    }
  }

  /* كروت بخلفية صورة (background-size: cover) زي كروت المشاريع في الرئيسية */
  var bgCache = {};
  function fitBg(el) {
    if (el.dataset.sxBgDone || skip(el)) return;
    var cs = getComputedStyle(el);
    if (cs.backgroundSize !== 'cover') return;
    var m = /url\(["']?([^"')]+)["']?\)/.exec(cs.backgroundImage || '');
    if (!m || /\.svg(\?|$)/i.test(m[1]) || /gradient/.test(cs.backgroundImage.split('url(')[0])) return;
    var w = el.clientWidth, h = el.clientHeight;
    if (w < MIN_SIZE || h < MIN_SIZE) return;
    var url = m[1];
    var done = function (iw, ih) {
      if (crop(w, h, iw, ih) <= (isHero(el) ? LIMIT_HERO : LIMIT)) return;
      el.dataset.sxBgDone = '1';
      var pic = document.createElement('img');
      pic.className = 'sx-fit-pic';
      pic.alt = '';
      pic.src = url;
      pic.setAttribute('aria-hidden', 'true');
      el.style.backgroundImage = 'none';
      var bg = backdrop(el, url, el.firstChild);
      bg.after(pic);
    };
    if (bgCache[url]) return done(bgCache[url][0], bgCache[url][1]);
    var probe = new Image();
    probe.onload = function () { bgCache[url] = [probe.naturalWidth, probe.naturalHeight]; done(probe.naturalWidth, probe.naturalHeight); };
    probe.src = url;
  }

  function run(root) {
    (root || document).querySelectorAll('img').forEach(function (img) {
      if (img.classList.contains('sx-fit-pic')) return;
      if (img.complete) fitImg(img);
    });
    (root || document).querySelectorAll('[style*="background-image"]').forEach(fitBg);
  }

  document.addEventListener('load', function (e) {
    if (e.target && e.target.tagName === 'IMG' && !e.target.classList.contains('sx-fit-pic')) fitImg(e.target);
  }, true);

  var timer;
  function later(root) { clearTimeout(timer); timer = setTimeout(function () { run(root); }, 120); }
  window.addEventListener('resize', function () { later(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { run(); });
  else run();
  window.addEventListener('load', function () { run(); });
  if ('MutationObserver' in window) {
    new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) { if (list[i].addedNodes.length) { later(); return; } }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();
