/**
 * شاشة Shary AI: سؤال تجريبي
 * الصفحة: resources/views/shary_admin/ai/index.blade.php
 */
(function () {
    var go = document.getElementById('saiGo'), input = document.getElementById('saiQuestion');
    if (!go || !input) return;
    var out = document.getElementById('saiOut'), reply = document.getElementById('saiReply'), tags = document.getElementById('saiTags'), cards = document.getElementById('saiCards'), meta = document.getElementById('saiMeta');
    var label = go.textContent;
    function ask() {
        var text = input.value.trim();
        if (!text || go.disabled) return;
        go.disabled = true; go.textContent = go.getAttribute('data-busy');
        var token = document.querySelector('input[name="_token"]');
        fetch(go.getAttribute('data-url'), {
            method: 'POST', credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': token ? token.value : '', 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({ message: text, lang: document.getElementById('saiLang').value })
        }).then(function (response) { return response.json().then(function (data) { if (!response.ok) throw new Error(data.message || ''); return data; }); })
          .then(function (data) {
            out.classList.add('is-on');
            reply.textContent = data.reply || '';
            tags.textContent = ''; cards.textContent = '';
            (data.criteria || []).forEach(function (item) { var tag = document.createElement('span'); tag.textContent = item; tags.appendChild(tag); });
            (data.cards || []).forEach(function (card) {
                var li = document.createElement('li'), a = document.createElement('a');
                a.href = card.url || '#'; a.target = '_blank'; a.rel = 'noopener'; a.textContent = card.title;
                li.appendChild(a); li.appendChild(document.createTextNode(' — ' + [card.price, card.location].filter(Boolean).join(' · ')));
                cards.appendChild(li);
            });
            meta.textContent = go.getAttribute('data-total') + ': ' + (data.total || 0) + '  ·  ' + go.getAttribute('data-engine') + ': ' + (data.engine === 'rules' || !data.engine ? go.getAttribute('data-rules') : data.engine);
            if (data.search_url) { var all = document.createElement('a'); all.href = data.search_url; all.target = '_blank'; all.rel = 'noopener'; all.textContent = go.getAttribute('data-all'); meta.appendChild(document.createTextNode('  ·  ')); meta.appendChild(all); }
        }).catch(function (error) {
            out.classList.add('is-on'); tags.textContent = ''; cards.textContent = ''; meta.textContent = '';
            reply.textContent = (error && error.message) || go.getAttribute('data-failed');
        }).then(function () { go.disabled = false; go.textContent = label; });
    }
    go.addEventListener('click', ask);
    input.addEventListener('keydown', function (event) { if (event.key === 'Enter') { event.preventDefault(); ask(); } });
})();
