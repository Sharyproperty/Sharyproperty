/**
 * البحث الذكي في المتصفح — نفس قواعد App\Shary\SmartSearch (السيرفر) بالظبط:
 *   - توحيد الحروف: أ إ آ ٱ ← ا ، ة ← ه ، ى ← ي ، ؤ ← و ، ئ ← ي ، من غير تشكيل ولا تطويل ، الأرقام العربي ← 0-9
 *   - كلمات زيادة بتتشال (شركة ، كمبوند ، قرية ، Compound ...) ، و"للتطوير / العقاري / Developments" في نسخة تانية من البحث
 *   - "ال" في أول الكلمة اختيارية ، أسماء شعبية (التجمع ، زايد ، أكتوبر ، العاصمة ، الساحل ...) ، من أول حرفين ، وغلطة حرف
 * window.SharyText.fold(text) ، .words(text) ، .score(query, text) → 0 = مش مطابق ، أعلى = أقرب
 * بيستخدمه: map-page.js ، search-strip.js ، search-page.js (لو مش موجود كل سكربت بيرجع لطريقته القديمة).
 */
(function () {
    'use strict';

    var STOP = ['شركه', 'مجموعه', 'كمبوند', 'كومباوند', 'كمباوند', 'قريه', 'مشروع', 'منتجع',
        'company', 'co', 'group', 'compound', 'village', 'project', 'في', 'the', 'in', 'of'];
    var SOFT = ['للتطوير', 'التطوير', 'تطوير', 'العقاري', 'العقاريه', 'عقاري', 'عقاريه', 'للاستثمار', 'الاستثمار', 'العقارات', 'للعقارات',
        'والتعمير', 'للتعمير', 'للاسكان', 'ريزورت', 'من', 'developments', 'development', 'developers', 'developer', 'real', 'estate',
        'properties', 'property', 'holding', 'investment', 'investments', 'resort'];
    var ALIASES = {
        'التجمع': ['القاهره الجديده', 'التجمع الخامس', 'new cairo', 'fifth settlement'],
        'التجمع الخامس': ['القاهره الجديده', 'new cairo', 'fifth settlement'],
        'الخامس': ['التجمع الخامس', 'fifth settlement'],
        'زايد': ['الشيخ زايد', 'sheikh zayed', 'el sheikh zayed'],
        'اكتوبر': ['6 اكتوبر', 'السادس من اكتوبر', '6th of october', 'october'],
        'العاصمه': ['العاصمه الاداريه', 'العاصمه الاداريه الجديده', 'new capital', 'administrative capital'],
        'الساحل': ['الساحل الشمالي', 'north coast', 'sahel'],
        'السخنه': ['العين السخنه', 'ain sokhna', 'sokhna'],
        'المستقبل': ['مدينه المستقبل', 'mostakbal city', 'future city'],
        'الشروق': ['مدينه الشروق', 'shorouk'],
        'العلمين': ['العلمين الجديده', 'new alamein', 'alamein'],
        'الجونه': ['el gouna', 'gouna'],
        'راس الحكمه': ['ras el hekma', 'ras al hekma'],
        'التجمع الاول': ['first settlement'],
        'new cairo': ['القاهره الجديده', 'التجمع'],
        'zayed': ['الشيخ زايد', 'sheikh zayed'],
        'october': ['6 اكتوبر', 'اكتوبر'],
        'sahel': ['الساحل الشمالي', 'north coast']
    };
    var MAP = { 'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ة': 'ه', 'ى': 'ي', 'ؤ': 'و', 'ئ': 'ي', 'ء': '',
        '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
        'é': 'e', 'è': 'e', 'á': 'a', 'à': 'a', 'ö': 'o', 'ü': 'u' };

    function fold(text) {
        return String(text == null ? '' : text).toLowerCase()
            .replace(/[ً-ٰٟـ]/g, '')
            .replace(/[أإآٱةىؤئء٠-٩éèáàöü]/g, function (c) { return MAP[c] !== undefined ? MAP[c] : c; })
            .replace(/[^\p{L}\p{N}]+/gu, ' ')
            .replace(/\s+/g, ' ').trim();
    }

    function bare(word) {
        var prefixes = ['وال', 'بال', 'فال', 'كال', 'لل', 'ال'];
        for (var i = 0; i < prefixes.length; i++) {
            if (word.indexOf(prefixes[i]) === 0 && word.length - prefixes[i].length >= 2) return word.slice(prefixes[i].length);
        }
        return word;
    }

    function split(text) { return fold(text).split(' ').filter(Boolean); }

    function words(text) {
        var all = split(text);
        var useful = all.filter(function (w) { return STOP.indexOf(w) === -1; });
        return (useful.length ? useful : all).slice(0, 8);
    }

    function distance(a, b) {
        if (a === b) return 0;
        a = Array.from(a); b = Array.from(b);
        if (Math.abs(a.length - b.length) > 2) return 3;
        var row = [], i, j;
        for (j = 0; j <= b.length; j++) row[j] = j;
        for (i = 1; i <= a.length; i++) {
            var prev = row[0];
            row[0] = i;
            for (j = 1; j <= b.length; j++) {
                var temp = row[j];
                row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
                prev = temp;
            }
        }
        return row[b.length];
    }

    function escape(text) { return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

    function variants(query) {
        var base = words(query);
        if (!base.length) return [];
        var out = [base];
        var soft = base.filter(function (w) { return SOFT.indexOf(w) === -1; });
        if (soft.length && soft.length !== base.length) out.push(soft);
        var joined = base.join(' ');
        Object.keys(ALIASES).forEach(function (key) {
            var short = fold(key);
            var re = new RegExp('(^| )' + escape(short) + '( |$)');
            if (joined === short || joined === bare(short) || re.test(joined)) {
                ALIASES[key].forEach(function (long) {
                    var replaced = joined === bare(short) ? fold(long) : joined.replace(re, ' ' + fold(long) + ' ').trim();
                    out.push(words(replaced));
                });
            }
        });
        return out;
    }

    function scoreWords(list, name) {
        var hay = fold(name);
        if (!hay || !list.length) return 0;
        var parts = hay.split(' ').filter(Boolean);
        var bareParts = parts.map(bare);
        var total = 0;
        for (var n = 0; n < list.length; n++) {
            var word = list[n], w = bare(word), len = Array.from(w).length, best = 0;
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i], p = bareParts[i];
                if (p === w || part === word) best = Math.max(best, 1);
                else if (len >= 2 && (p.indexOf(w) === 0 || part.indexOf(word) === 0)) best = Math.max(best, 0.85);
                else if (len >= 3 && p.indexOf(w) > -1) best = Math.max(best, 0.55);
                else if (len === 3 && p.charAt(0) === w.charAt(0) && Array.from(p).length <= 5 && distance(w, p) <= 1) best = Math.max(best, 0.5);
                else if (len >= 4) {
                    var allowed = len >= 7 ? 2 : 1;
                    if (distance(w, p) <= allowed || distance(w, Array.from(p).slice(0, len).join('')) <= allowed) best = Math.max(best, 0.6);
                }
            }
            if (!best && /^\d+$/.test(w) && hay.indexOf(w) > -1) best = 0.7;
            if (!best) return 0;
            total += best;
        }
        var score = total / list.length;
        var phrase = list.map(bare).join(' '), bareHay = bareParts.join(' ');
        if (bareHay === phrase) score += 0.6;
        else if (bareHay.indexOf(phrase) === 0) score += 0.3;
        else if (bareHay.indexOf(phrase) > -1) score += 0.15;
        return score;
    }

    var cache = { q: null, v: [] };
    function score(query, text) {
        if (fold(query).length < 2) return 0;
        if (cache.q !== query) cache = { q: query, v: variants(query) };
        var best = 0;
        String(text == null ? '' : text).split(' | ').forEach(function (name) {
            cache.v.forEach(function (list) { best = Math.max(best, scoreWords(list, name)); });
        });
        return best;
    }

    window.SharyText = { fold: fold, words: words, bare: bare, score: score, distance: distance };
})();
