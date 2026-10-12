/*
 * الصور في الكروت والسلايدر: من غير تزويم ومن غير قص — أوتوماتيك على كل الصور (القديمة والجديدة) من غير ما حد يعمل حاجة.
 * الفكرة: لكل صورة بتملا بوكس (object-fit: cover / fill أو background-size: cover) بنقارن مقاس الصورة بمقاس البوكس:
 *   - لو قريبين (الفرق ≤ 20% — والسلايدر ≤ 30%): الصورة تفضل مالية البوكس زي ما هي (القص مش بيبان).
 *   - لو بعاد: الصورة بتظهر كاملة (contain) — والفراغ اللي حواليها بيتملي بنفس الصورة مغبّشة ، فالبوكس يفضل مليان وشكله احترافي.
 * مستثنى: اللوجوهات والأيقونات (أصغر من 110 بكسل / مدورة / svg) ، وأي عنصر عليه data-fit="off".
 * بيشتغل لما الصورة تحمّل (حتى الصور اللي بتحمّل وانت نازل) ، ولما الشاشة يتغير مقاسها ، وعلى الكروت اللي بتتضاف بعدين (سلايدر / فلاتر).
 */
(function () {
  'use strict';
  if (window.__sharyImgFit) return;
  window.__sharyImgFit = true;

  var LIMIT = 0.20;        // أقصى قص مقبول قبل ما نعرض الصورة كاملة (صورة 16:9 في بوكس 3:2 بتفضل مالية البوكس طبيعي)
  var LIMIT_HERO = 0.30;   // السلايدر (عريض) بيستحمل قص أكتر قبل ما يتحول
  var MIN_SIZE = 110;

  // الاستثناءات الرخيصة الأول (من غير getComputedStyle) — الحساب التقيل بيحصل بس للصور اللي لسه محتاجة
  var SKIP_SEL = '[data-fit="off"], .dev-logo-link, .dev-icon__logo, [data-logo-fit], [data-developer-logo], header, footer, .article-content';
  function skip(el, w) {
    if (!el || el.closest(SKIP_SEL)) return true;
    if (w < 220) {
      var r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      if (r >= w / 2 - 1) return true; // دايرة (لوجو / صورة شخص)
    }
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

  // الخلفية المغبّشة = نسخة صغيرة جدًا من نفس الصورة (64 بكسل) متكبّرة — شكلها مغبّش لوحده ومن غير فلتر blur التقيل على الموبايل
  function tiny(url) {
    var m = /\/responsive-image\/\d+\/(.+?)(\?.*)?$/.exec(url);
    if (m) return url.replace(/\/responsive-image\/\d+\//, '/responsive-image/64/');
    try {
      var u = new URL(url, location.href);
      if (u.origin === location.origin && /\.(jpe?g|png|webp)$/i.test(u.pathname) && /^\/(images|uploads|storage|assets)\//.test(u.pathname)) {
        return location.origin + '/responsive-image/64' + u.pathname + '?v=9';
      }
    } catch (e) {}
    return url;
  }

  function backdrop(parent, url, before, isStatic) {
    var bg = parent.querySelector(':scope > .sx-fit-bg');
    if (!bg) {
      bg = document.createElement('span');
      bg.className = 'sx-fit-bg';
      bg.setAttribute('aria-hidden', 'true');
      parent.insertBefore(bg, before || parent.firstChild);
    }
    var small = tiny(url);
    var paint = function (src, full) {
      bg.classList.toggle('sx-fit-bg--full', full); // مفيش نسخة صغيرة: نفس الصورة بتغبيش خفيف
      bg.style.backgroundImage = 'url("' + src.replace(/"/g, '%22') + '")';
    };
    if (small === url) {
      paint(url, true);
    } else if (bg.getAttribute('data-src') !== small) {
      bg.setAttribute('data-src', small);
      paint(small, false);
      var probe = new Image();
      probe.onerror = function () { paint(url, true); }; // النسخة الصغيرة مش موجودة (زي المعاينة الثابتة): الصورة نفسها
      probe.src = small;
    }
    if (isStatic === undefined ? getComputedStyle(parent).position === 'static' : isStatic) parent.style.position = 'relative';
    parent.classList.add('sx-fit-host');
    return bg;
  }

  function clearBackdrop(parent) {
    var bg = parent && parent.querySelector(':scope > .sx-fit-bg');
    if (bg) bg.remove();
    if (parent) parent.classList.remove('sx-fit-host');
  }

  /* <img> بـ object-fit: cover — قراية بس (من غير أي تعديل) عشان الصفحة ما تتحسبش من الأول مع كل صورة */
  function measureImg(img) {
    if (!img.complete || !img.naturalWidth) return null;
    var src = img.currentSrc || img.src || '';
    if (!src || /\.svg(\?|$)/i.test(src)) return null;
    var w = img.clientWidth, h = img.clientHeight;
    if (w < MIN_SIZE || h < MIN_SIZE) return null; // مخفية أو صغيرة (لوجو / أيقونة)
    var key = src + '|' + w + 'x' + h;
    if (img.__sxKey === key) return null; // نفس الصورة ونفس المقاس: اتظبطت قبل كده
    if (skip(img, w)) { img.__sxKey = key; return null; }
    var fit = img.dataset.sxFit ? 'cover' : getComputedStyle(img).objectFit;
    // cover = بيقص (يبان متزوّم) ، fill = بيمطّ الصورة (تبان مش طبيعية) — الاتنين بيتظبطوا
    if (fit !== 'cover' && fit !== 'fill') { img.__sxKey = key; return null; }
    var c = crop(w, h, img.naturalWidth, img.naturalHeight);
    img.__sxKey = key;
    if (fit === 'fill' && c <= 0.04) return null; // المط صغير مش باين
    var parent = img.parentElement;
    if (parent && parent.tagName === 'PICTURE') parent = parent.parentElement;
    var on = c > (fit === 'fill' ? 0.04 : (isHero(img) ? LIMIT_HERO : LIMIT));
    if (!on && !img.dataset.sxFit) return null;
    return {
      img: img, src: src, parent: parent, on: on,
      imgStatic: on && getComputedStyle(img).position === 'static',
      parentStatic: on && parent && getComputedStyle(parent).position === 'static'
    };
  }

  function applyImg(m) {
    var img = m.img;
    if (m.on) {
      img.dataset.sxFit = '1';
      img.classList.add('sx-fit-contain');
      if (m.imgStatic) img.style.position = 'relative';
      var anchor = img.parentElement.tagName === 'PICTURE' ? img.parentElement : img;
      backdrop(m.parent, m.src, anchor, m.parentStatic);
    } else {
      img.classList.remove('sx-fit-contain');
      delete img.dataset.sxFit;
      clearBackdrop(m.parent);
    }
  }


  /* كروت بخلفية صورة (background-size: cover) زي كروت المشاريع في الرئيسية */
  var bgCache = {};
  function fitBg(el) {
    if (el.dataset.sxBgDone) return;
    var bw = el.clientWidth;
    if (bw < MIN_SIZE || el.clientHeight < MIN_SIZE || skip(el, bw)) return;
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
    // كل القراية الأول وبعدين كل التعديلات مرة واحدة
    var todo = [];
    (root || document).querySelectorAll('img').forEach(function (img) {
      if (img.classList.contains('sx-fit-pic') || !img.complete) return;
      var m = measureImg(img);
      if (m) todo.push(m);
    });
    todo.forEach(applyImg);
    (root || document).querySelectorAll('[style*="background-image"]').forEach(fitBg);
  }

  // الصور اللي بتحمّل ورا بعض بتتجمع وتتظبط مرة واحدة في الفريم الجاي (بدل حساب الصفحة مع كل صورة)
  var pending = [], raf = 0;
  function flush() {
    raf = 0;
    var list = pending; pending = [];
    var todo = [];
    list.forEach(function (img) { var m = measureImg(img); if (m) todo.push(m); });
    todo.forEach(applyImg);
  }
  function queue(img) {
    pending.push(img);
    if (!raf) raf = (window.requestAnimationFrame || setTimeout)(flush);
  }

  document.addEventListener('load', function (e) {
    if (e.target && e.target.tagName === 'IMG' && !e.target.classList.contains('sx-fit-pic')) queue(e.target);
  }, true);

  var timer;
  function later(root) { clearTimeout(timer); timer = setTimeout(function () { run(root); }, 120); }
  window.addEventListener('resize', function () { later(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { run(); });
  else run();
  window.addEventListener('load', function () { run(); });
  if ('MutationObserver' in window) {
    new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < list[i].addedNodes.length; j++) {
          var n = list[i].addedNodes[j];
          if (n.nodeType !== 1 || (n.classList && (n.classList.contains('sx-fit-bg') || n.classList.contains('sx-fit-pic')))) continue;
          if (n.tagName === 'IMG' || (n.querySelector && n.querySelector('img,[style*="background-image"]'))) { later(); return; }
        }
      }
    }).observe(document.body || document.documentElement, { childList: true, subtree: true });
  }
})();
