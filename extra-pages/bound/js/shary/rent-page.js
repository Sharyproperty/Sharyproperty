/**
 * صفحة وحدة الإيجار (rent/show.blade.php):
 * - المعرض [data-rent-gallery]: الضغط على صورة [data-gallery-item] بيخليها الصورة المفتوحة (data-active="1").
 *   لو الصورة مفتوحة بالفعل بيتفتح عارض الصور عليها.
 * - عارض الصور [data-rent-lightbox]: أي زرار [data-lightbox-open="gallery | floor | master"] بيفتحه على صور المجموعة دي
 *   (الصور اللي عليها data-lightbox-item بنفس الاسم). بنفس شكل تطبيق شاري: X + عدّاد "1 / 5"، وصف صور صغيرة تحت للمعرض،
 *   ومخطط الوحدة جوه كارت أبيض. السحب / الأسهم / الكيبورد بتقلّب، و X أو الضغط بره أو Esc بيقفل.
 * - التكبير (الصور / الماستر بلان / مخطط الوحدة) باليد على الموبايل: بصباعين (pinch) — التكبير بيحصل عند مكان الصوابع والصورة بتتحرك معاها
 *   يمين / شمال / فوق / تحت في نفس الوقت ، وبعد التكبير صباع واحد بيحرّك الصورة في أي اتجاه. ضغطتين ورا بعض بيكبّروا مكان الضغطة.
 *   زراير + / − [data-lightbox-zoom] وعجلة الماوس اختياريين. التقليب بالسحب بيشتغل والصورة بحجمها الطبيعي بس. الصورة بترجع لحجمها مع كل صورة جديدة.
 */
(function () {
    document.querySelectorAll('[data-rent-lightbox]').forEach(function (box) {
        var scope = box.closest('main') || document;
        var view = box.querySelector('[data-lightbox-image]');
        var counter = box.querySelector('[data-lightbox-count]');
        var thumbs = box.querySelector('[data-lightbox-thumbs]');
        var arrows = box.querySelectorAll('[data-lightbox-prev], [data-lightbox-next]');
        var items = [];
        var at = 0;
        var opener = null;
        var frame = box.querySelector('[data-lightbox-frame]') || view;
        var zoom = { scale: 1, x: 0, y: 0 };   // تكبير الصورة المفتوحة ومكانها

        function applyZoom(smooth) {
            // الصورة ما تخرجش بره الشاشة: أقصى حركة = نص الزيادة في المقاس
            var maxX = Math.max(0, (zoom.scale - 1) * frame.offsetWidth / 2), maxY = Math.max(0, (zoom.scale - 1) * frame.offsetHeight / 2);
            zoom.x = Math.max(-maxX, Math.min(maxX, zoom.x));
            zoom.y = Math.max(-maxY, Math.min(maxY, zoom.y));
            frame.style.transition = smooth ? 'transform 0.22s ease' : 'none';
            frame.style.transform = zoom.scale === 1 ? '' : 'translate(' + zoom.x + 'px, ' + zoom.y + 'px) scale(' + zoom.scale + ')';
            box.classList.toggle('is-zoomed', zoom.scale > 1);
        }

        function setZoom(scale, smooth) {
            zoom.scale = Math.max(1, Math.min(4, scale));
            if (zoom.scale === 1) { zoom.x = 0; zoom.y = 0; }
            applyZoom(smooth);
        }

        function show(index) {
            if (!items.length) return;
            at = (index + items.length) % items.length;
            setZoom(1, false);
            var source = items[at];
            view.src = source.currentSrc || source.getAttribute('src');
            view.alt = source.getAttribute('alt') || '';
            counter.textContent = (at + 1) + ' / ' + items.length;
            Array.prototype.forEach.call(thumbs.children, function (thumb, i) { thumb.setAttribute('aria-current', i === at ? 'true' : 'false'); });
            var current = thumbs.children[at];
            if (current && current.scrollIntoView) current.scrollIntoView({ block: 'nearest', inline: 'center' });
        }

        // group: gallery = صور الوحدة (صف صور صغيرة تحت) ، floor = مخطط الوحدة (جوه كارت أبيض) ، master = المخطط العام
        function open(group, index, from) {
            items = Array.prototype.slice.call(scope.querySelectorAll('[data-lightbox-item="' + group + '"]'));
            if (!items.length) return;
            opener = from || null;
            box.setAttribute('data-group', group);
            thumbs.textContent = '';
            if (group === 'gallery' && items.length > 1) {
                items.forEach(function (source, i) {
                    var thumb = document.createElement('button');
                    thumb.type = 'button';
                    var image = document.createElement('img');
                    image.src = source.currentSrc || source.getAttribute('src');
                    image.alt = '';
                    thumb.appendChild(image);
                    thumb.addEventListener('click', function () { show(i); });
                    thumbs.appendChild(thumb);
                });
            }
            thumbs.classList.toggle('hidden', !thumbs.children.length);
            counter.classList.toggle('hidden', group === 'floor');
            arrows.forEach(function (button) { button.classList.toggle('lg:flex', items.length > 1); });
            show(index || 0);
            box.classList.remove('hidden');
            document.documentElement.style.overflow = 'hidden';
        }

        function close() {
            setZoom(1, false);
            box.classList.add('hidden');
            document.documentElement.style.overflow = '';
            if (opener) opener.focus();
        }

        scope.querySelectorAll('[data-lightbox-open]').forEach(function (button) {
            button.addEventListener('click', function () { open(button.getAttribute('data-lightbox-open'), 0, button); });
        });
        box.querySelectorAll('[data-lightbox-close]').forEach(function (button) { button.addEventListener('click', close); });
        box.querySelector('[data-lightbox-prev]').addEventListener('click', function () { show(at - 1); });
        box.querySelector('[data-lightbox-next]').addEventListener('click', function () { show(at + 1); });
        // اللمس: صباع واحد = تقليب (أو تحريك الصورة لو مكبّرة) ، صباعين = تكبير / تصغير ، ضغطتين ورا بعض = تكبير / رجوع
        var startX = null, pinch = null, drag = null, lastTap = 0, moving = false;
        function spread(touches) { return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY); }
        function middle(touches) { return { x: (touches[0].clientX + touches[1].clientX) / 2, y: (touches[0].clientY + touches[1].clientY) / 2 }; }
        // مركز الصورة على الشاشة من غير الحركة (علشان التكبير يحصل عند مكان الصوابع)
        function home() { var rect = frame.getBoundingClientRect(); return { x: rect.left + rect.width / 2 - zoom.x, y: rect.top + rect.height / 2 - zoom.y }; }
        // تكبير عند نقطة على الشاشة: النقطة دي بتفضل تحت الصباع
        function zoomAt(scale, point, smooth) {
            var base = home(), before = zoom.scale;
            scale = Math.max(1, Math.min(4, scale));
            zoom.x = (point.x - base.x) - ((point.x - base.x) - zoom.x) * (scale / before);
            zoom.y = (point.y - base.y) - ((point.y - base.y) - zoom.y) * (scale / before);
            setZoom(scale, smooth);
        }
        function startDrag(touch) { drag = { x: touch.clientX - zoom.x, y: touch.clientY - zoom.y }; startX = null; }
        box.addEventListener('touchstart', function (event) {
            if (event.touches.length === 2) {
                var mid = middle(event.touches), base = home();
                pinch = { distance: spread(event.touches) || 1, scale: zoom.scale, x: mid.x - base.x - zoom.x, y: mid.y - base.y - zoom.y, base: base };
                startX = null; drag = null; moving = true;
                return;
            }
            var touch = event.touches[0];
            moving = false;
            if (zoom.scale > 1) startDrag(touch);
            else startX = touch.clientX;
        }, { passive: true });
        box.addEventListener('touchmove', function (event) {
            if (pinch && event.touches.length === 2) {
                // صباعين: تكبير / تصغير عند مكان الصوابع + الصورة بتتحرك مع الصوابع في أي اتجاه
                event.preventDefault();
                var mid = middle(event.touches);
                var scale = Math.max(1, Math.min(4, pinch.scale * spread(event.touches) / pinch.distance));
                zoom.x = (mid.x - pinch.base.x) - pinch.x * (scale / pinch.scale);
                zoom.y = (mid.y - pinch.base.y) - pinch.y * (scale / pinch.scale);
                setZoom(scale, false);
                return;
            }
            if (drag && event.touches.length === 1) {
                // صباع واحد والصورة مكبّرة: الصورة بتمشي مع الصباع يمين / شمال / فوق / تحت
                event.preventDefault(); moving = true;
                zoom.x = event.touches[0].clientX - drag.x; zoom.y = event.touches[0].clientY - drag.y; applyZoom(false);
            }
        }, { passive: false });
        box.addEventListener('touchend', function (event) {
            if (pinch) {
                if (event.touches.length < 2) {
                    pinch = null;
                    if (zoom.scale < 1.08) setZoom(1, true);
                    // صباع لسه على الشاشة بعد التكبير: يكمل تحريك الصورة على طول
                    else if (event.touches.length === 1) startDrag(event.touches[0]);
                }
                return;
            }
            if (event.target.closest && event.target.closest('button, a')) { startX = null; drag = null; return; }
            // ضغطتين ورا بعض على الصورة: تكبير عند مكان الضغطة / رجوع
            var now = Date.now();
            var moved = startX === null ? 0 : event.changedTouches[0].clientX - startX;
            if (!moving && Math.abs(moved) < 12 && event.target.closest && event.target.closest('[data-lightbox-frame]')) {
                if (now - lastTap < 320) {
                    lastTap = 0;
                    if (zoom.scale > 1) setZoom(1, true);
                    else zoomAt(2.5, { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }, true);
                    startX = null; drag = null; return;
                }
                lastTap = now;
            }
            drag = null;
            if (startX === null) return;
            startX = null;
            if (Math.abs(moved) < 45 || items.length < 2 || zoom.scale > 1) return;
            var rtl = !!box.closest('[dir="rtl"]');
            show(at + ((moved < 0) === rtl ? -1 : 1));
        });
        // التكبير للصورة بس: المتصفح ما يكبّرش الصفحة / الخلفية / صف الصور الصغيرة (iOS: gesturestart)
        ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (name) { box.addEventListener(name, function (event) { event.preventDefault(); }, { passive: false }); });
        // ديسك توب: عجلة الماوس بتكبّر ، ضغطتين بيكبّروا / يرجّعوا ، والسحب بيحرّك الصورة المكبّرة
        box.addEventListener('wheel', function (event) {
            if (!event.target.closest || !event.target.closest('[data-lightbox-stage], [data-lightbox-frame]')) return;
            event.preventDefault();
            setZoom(zoom.scale * (event.deltaY < 0 ? 1.15 : 0.87), false);
        }, { passive: false });
        frame.addEventListener('dblclick', function () { setZoom(zoom.scale > 1 ? 1 : 2.5, true); });
        var mouse = null;
        frame.addEventListener('mousedown', function (event) { if (zoom.scale > 1) { mouse = { x: event.clientX - zoom.x, y: event.clientY - zoom.y }; event.preventDefault(); } });
        document.addEventListener('mousemove', function (event) { if (!mouse) return; zoom.x = event.clientX - mouse.x; zoom.y = event.clientY - mouse.y; applyZoom(false); });
        document.addEventListener('mouseup', function () { mouse = null; });
        box.querySelectorAll('[data-lightbox-zoom]').forEach(function (button) {
            button.addEventListener('click', function () { setZoom(zoom.scale + Number(button.getAttribute('data-lightbox-zoom')) * 0.75, true); });
        });
        document.addEventListener('keydown', function (event) {
            if (box.classList.contains('hidden')) return;
            var rtl = !!box.closest('[dir="rtl"]');
            if (event.key === 'Escape') close();
            else if (event.key === 'ArrowLeft') show(at + (rtl ? 1 : -1));
            else if (event.key === 'ArrowRight') show(at + (rtl ? -1 : 1));
        });

        // المعرض: الصورة المضغوطة بتبقى المفتوحة، ولو مفتوحة بالفعل بيتفتح العارض عليها
        scope.querySelectorAll('[data-rent-gallery]').forEach(function (root) {
            var tiles = Array.prototype.slice.call(root.querySelectorAll('[data-gallery-item]'));
            tiles.forEach(function (tile, index) {
                tile.addEventListener('click', function () {
                    if (tile.getAttribute('data-active') === '1') { open('gallery', index, tile); return; }
                    tiles.forEach(function (other) { other.setAttribute('data-active', other === tile ? '1' : '0'); });
                });
            });
        });
    });
})();
