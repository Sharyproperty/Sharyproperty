/**
 * صفحة Shary AI (partials/ai-panel.blade.php)
 * - أي عنصر عليه data-ask-ai بيفتح الصفحة (بتطلع من تحت). القفل من السهم أو الضغط براها أو Esc.
 * - الإرسال (الكتابة أو اختيار منطقة): الرسالة بتتضاف، وبيطلع حدث shary:ai-send على الصفحة:
 *       panel.addEventListener('shary:ai-send', function (event) { event.preventDefault(); event.detail.reply('نص الرد'); });
 *   لو الحدث ما اتمنعش وفيه data-endpoint: الرسالة بتتبعت POST JSON {message} والرد المتوقع JSON {reply}.
 * - النقط التلاتة: محادثة جديدة. المايك بيظهر بس لو المتصفح بيدعم الإملاء الصوتي.
 */
(function () {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-ai-panel]'));
    if (!panels.length) return;

    panels.forEach(function (panel) {
        var list = panel.querySelector('[data-ai-messages]');
        var scroll = panel.querySelector('[data-ai-scroll]');
        var suggestions = panel.querySelector('[data-ai-suggestions]');
        var form = panel.querySelector('[data-ai-form]');
        var input = form.querySelector('input[name="message"]');
        var opener = null;

        function bubble(text, mine) {
            var node = document.createElement('div');
            node.className = mine ? 'area-ai-msg area-ai-msg--mine' : 'area-ai-msg';
            node.setAttribute('data-ai-added', '');
            var p = document.createElement('p');
            p.textContent = text;
            node.appendChild(p);
            list.appendChild(node);
            scroll.scrollTop = scroll.scrollHeight;
            return node;
        }

        function send(text) {
            text = String(text || '').trim();
            if (!text) return;
            bubble(text, true);
            input.value = '';
            if (suggestions) suggestions.classList.add('hidden');

            var typing = bubble('…', false);
            typing.classList.add('area-ai-msg--typing');
            var done = false;
            function reply(answer) {
                if (done) return;
                done = true;
                typing.remove();
                if (answer) bubble(answer, false);
            }

            var go = panel.dispatchEvent(new CustomEvent('shary:ai-send', { bubbles: true, cancelable: true, detail: { text: text, reply: reply } }));
            if (!go) return;

            var endpoint = panel.getAttribute('data-endpoint');
            if (!endpoint) { reply(''); return; }
            var token = document.querySelector('meta[name="csrf-token"]');
            fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': token ? token.getAttribute('content') : '' },
                body: JSON.stringify({ message: text })
            }).then(function (response) { return response.json(); }).then(function (data) { reply(data && data.reply); }).catch(function () { reply(''); });
        }

        function open(from) {
            if (!panel.classList.contains('hidden')) return;
            opener = from || null;
            panel.classList.remove('hidden');
            document.documentElement.style.overflow = 'hidden';
            // زرار الرجوع بيقفل الصفحة دي والعميل بيفضل في صفحته
            if (window.SharyBack) window.SharyBack.opened(close);
        }
        function close() {
            if (panel.classList.contains('hidden')) return;
            panel.classList.add('hidden');
            document.documentElement.style.overflow = '';
            if (opener) opener.focus({ preventScroll: true });
            if (window.SharyBack) window.SharyBack.closed();
        }
        panel.sharyOpen = open;

        panel.querySelectorAll('[data-ai-close]').forEach(function (node) { node.addEventListener('click', close); });
        document.addEventListener('keydown', function (event) { if (event.key === 'Escape') close(); });
        form.addEventListener('submit', function (event) { event.preventDefault(); send(input.value); });
        panel.querySelectorAll('[data-ai-suggest]').forEach(function (button) {
            button.addEventListener('click', function () { send(button.textContent); });
        });

        var reset = panel.querySelector('[data-ai-reset]');
        if (reset) {
            reset.addEventListener('click', function () {
                list.querySelectorAll('[data-ai-added]').forEach(function (node) { node.remove(); });
                if (suggestions) suggestions.classList.remove('hidden');
                input.value = '';
                scroll.scrollTop = 0;
            });
        }

        // الإملاء الصوتي (لو المتصفح بيدعمه)
        var mic = panel.querySelector('[data-ai-mic]');
        var Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (mic && Speech) {
            mic.classList.remove('hidden');
            mic.classList.add('flex');
            var listening = null;
            mic.addEventListener('click', function () {
                if (listening) { listening.stop(); return; }
                var langNode = panel.closest('[lang]');
                var recognition = new Speech();
                recognition.lang = ((langNode && langNode.lang) || document.documentElement.lang || 'ar').indexOf('en') === 0 ? 'en-US' : 'ar-EG';
                recognition.onresult = function (event) { input.value = event.results[0][0].transcript; input.focus(); };
                recognition.onend = recognition.onerror = function () { listening = null; mic.setAttribute('aria-pressed', 'false'); };
                listening = recognition;
                mic.setAttribute('aria-pressed', 'true');
                try { recognition.start(); } catch (error) { listening = null; mic.setAttribute('aria-pressed', 'false'); }
            });
        }
    });

    // أي زرار Shary AI بيفتح الصفحة الأقرب له
    document.addEventListener('click', function (event) {
        var opener = event.target.closest ? event.target.closest('[data-ask-ai]') : null;
        if (!opener) return;
        var scope = opener.closest('main');
        var panel = (scope && scope.querySelector('[data-ai-panel]')) || document.querySelector('[data-ai-panel]');
        if (!panel || !panel.sharyOpen) return;
        event.preventDefault();
        panel.sharyOpen(opener);
    });
})();
