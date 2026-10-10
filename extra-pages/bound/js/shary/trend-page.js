/**
 * صفحة "الأكثر رواجًا" — الفيديوهات (resources/views/trends/index.blade.php)
 * كارت الفيديو [data-video-open] عليه data-video = لينك التضمين (يوتيوب embed / فيميو) أو لينك ملف mp4، و data-video-title = العنوان.
 * الضغط بيفتح نافذة الفيديو [data-video-modal] والفيديو بيشتغل، والقفل (X / الضغط بره / Esc / زرار الرجوع) بيوقفه.
 * لو data-video فاضي بتظهر رسالة [data-empty] مكان الفيديو.
 */
(function () {
    if (!document.querySelector('[data-video-modal]')) return;
    var modal = null, frame = null, heading = null;
    var opened = false;

    // النافذة الأقرب للكارت (لو الصفحة فيها أكتر من نافذة) وإلا أول نافذة في الصفحة
    function pick(button) {
        var scope = button.closest('main') || document;
        modal = scope.querySelector('[data-video-modal]') || document.querySelector('[data-video-modal]');
        frame = modal.querySelector('[data-video-frame]');
        heading = modal.querySelector('[data-video-heading]');
    }

    function close(fromBack) {
        if (!opened) return;
        opened = false;
        modal.classList.add('hidden');
        frame.textContent = '';   // بيوقف الفيديو
        document.documentElement.classList.remove('overflow-hidden');
        if (!fromBack && window.SharyBack && window.SharyBack.closed) window.SharyBack.closed();
    }

    function open(button) {
        if (opened) close(false);
        pick(button);
        var url = button.getAttribute('data-video') || '';
        heading.textContent = button.getAttribute('data-video-title') || '';
        frame.textContent = '';
        if (!url) {
            var note = document.createElement('p');
            note.textContent = frame.getAttribute('data-empty') || '';
            frame.appendChild(note);
        } else if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
            var video = document.createElement('video');
            video.src = url; video.controls = true; video.autoplay = true; video.setAttribute('playsinline', '');
            frame.appendChild(video);
        } else {
            var iframe = document.createElement('iframe');
            iframe.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1';
            iframe.title = heading.textContent;
            iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen');
            iframe.setAttribute('allowfullscreen', '');
            frame.appendChild(iframe);
        }
        modal.classList.remove('hidden');
        document.documentElement.classList.add('overflow-hidden');
        opened = true;
        if (window.SharyBack && window.SharyBack.opened) window.SharyBack.opened(function () { close(true); });
    }

    document.addEventListener('click', function (event) {
        if (!event.target.closest) return;
        var button = event.target.closest('[data-video-open]');
        if (button) { event.preventDefault(); open(button); return; }
        if (event.target.closest('[data-video-close]')) close(false);
    });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') close(false); });
})();
