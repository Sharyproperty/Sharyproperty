/**
 * إرسال فورمات الموقع من غير تحميل الصفحة (كلها على POST /{locale}/shary/lead/{form} — SharyLeadController):
 * - فورم الاستشارة (partials/consultation-form ← form.cform) وفورم طلب الاجتماع ([data-meeting-form]) وأي فورم عليه data-lead-form (استشارة الهوم): بيتبعتوا fetch والرد بيظهر رسالة تحت الشاشة ،
 *   الخانات بتفضى ، وفورم الاجتماع بيتقفل. لو السيرفر رفض خانة (422) الرسالة بتظهر والمؤشر بيروح للخانة.
 * - بيع / تأجير عقار (حدث shary:property-request) ، الوظائف (shary:career-apply) ، شاري كارد (shary:card-request): لو لينك الفورم على shary/lead
 *   بنستلم الحدث ونبعت الفورم (بالملفات) وننادي done() / fail(message) / show(card) / pending() بتوع الصفحة.
 * - من غير السكربت: الفورمات بتتبعت عادي والسيرفر بيرجّع لنفس الصفحة ، والرسالة [data-shary-flash] (layouts/site) بتظهر هنا.
 * - كل طلب معاه X-CSRF-TOKEN من <meta name="csrf-token">. فورم عليه data-no-lead بيتساب زي ما هو (تسجيل الخروج).
 * - فورم بيع / تأجير عقار: قايمة المشروع بتتحمّل حسب المنطقة المختارة (data-projects-url على [data-request-page]).
 * window.SharyLead = { toast(text, type), post(url, FormData | object) }
 */
(function () {
    'use strict';

    function english() { return (document.documentElement.lang || 'ar').indexOf('en') === 0; }
    function token() { var meta = document.querySelector('meta[name="csrf-token"]'); return meta ? meta.getAttribute('content') : ''; }

    // ---- رسالة تحت الشاشة (نفس شكل رسايل site-chrome: .shary-toast)
    var toastNode = null, toastTimer = null;
    function toast(text, type) {
        if (!text) return;
        if (!toastNode) {
            toastNode = document.createElement('div');
            toastNode.setAttribute('role', 'status');
            toastNode.className = 'shary-toast';
            toastNode.style.zIndex = '90';
            document.body.appendChild(toastNode);
        }
        toastNode.textContent = text;
        toastNode.setAttribute('data-type', type || 'success');
        toastNode.classList.add('is-shown');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastNode.classList.remove('is-shown'); }, type === 'error' ? 5200 : 4200);
    }

    function failText() { return english() ? 'Something went wrong while sending your request. Please try again.' : 'حصلت مشكلة أثناء إرسال الطلب. حاول مرة تانية.'; }

    // POST (FormData أو JSON) ← { ok, status, data }
    function post(url, body) {
        var headers = { 'Accept': 'application/json', 'X-CSRF-TOKEN': token(), 'X-Requested-With': 'XMLHttpRequest' };
        if (!(window.FormData && body instanceof FormData)) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(body || {}); }
        return fetch(url, { method: 'POST', headers: headers, body: body, credentials: 'same-origin' }).then(function (response) {
            return response.json().catch(function () { return {}; }).then(function (data) {
                return { ok: response.ok && data.ok !== false, status: response.status, data: data || {} };
            });
        });
    }
    window.SharyLead = { toast: toast, post: post };

    function isLead(form) {
        return !!form && !form.hasAttribute('data-no-lead') && /\/shary\/lead\//.test(form.getAttribute('action') || '');
    }
    function firstError(data) {
        var errors = (data && data.errors) || {};
        var field = Object.keys(errors)[0];
        return { field: field || '', message: (data && data.message) || (field && errors[field] && errors[field][0]) || failText() };
    }
    function focusField(form, name) {
        var aliases = { meeting_date: null, meeting_time: null, photos: 'photos[]' };
        var target = name ? form.querySelector('[name="' + (aliases[name] || name) + '"]') : null;
        if (target && target.type !== 'hidden' && target.focus) { try { target.focus({ preventScroll: false }); } catch (error) { /* الخانة مخفية */ } }
    }

    // ---- رسالة الرجوع من فورم اتبعت من غير سكربت
    var flash = document.querySelector('[data-shary-flash]');
    if (flash && flash.textContent.trim()) toast(flash.textContent.trim(), flash.getAttribute('data-type') === 'error' ? 'error' : 'success');

    // ---- فورم الاستشارة + فورم طلب الاجتماع
    document.addEventListener('submit', function (event) {
        var form = event.target;
        if (!form || !form.matches || !form.matches('form.cform, form[data-meeting-form], form[data-lead-form]') || !isLead(form) || !window.fetch || !window.FormData) return;
        event.preventDefault();
        if (form.__sending) return;
        form.__sending = true;
        var button = form.querySelector('button[type="submit"]');
        if (button) button.disabled = true;
        post(form.getAttribute('action'), new FormData(form)).then(function (result) {
            if (!result.ok) {
                var error = firstError(result.data);
                toast(error.message, 'error');
                focusField(form, error.field);
                return;
            }
            toast(result.data.message || '', 'success');
            Array.prototype.forEach.call(form.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], textarea'), function (field) { field.value = ''; });
            var modal = form.closest('[data-meeting-modal]');
            var close = modal ? modal.querySelector('[data-meeting-close]') : null;
            if (close) close.click();
            form.dispatchEvent(new CustomEvent('shary:lead-sent', { bubbles: true, detail: result.data }));
        }).catch(function () {
            toast(failText(), 'error');
        }).then(function () {
            form.__sending = false;
            if (button) button.disabled = false;
        });
    });

    // ---- بيع / تأجير عقار + الوظائف: الصفحة بتطلّع الحدث ومعاه FormData و done() / fail()
    ['shary:property-request', 'shary:career-apply'].forEach(function (name) {
        document.addEventListener(name, function (event) {
            var form = event.target;
            var detail = event.detail || {};
            if (event.defaultPrevented || !isLead(form) || !detail.data || !window.fetch) return;
            event.preventDefault();
            if (form.__sending) return;
            form.__sending = true;
            var button = form.querySelector('button[type="submit"]:not(.hidden)') || form.querySelector('button[type="submit"]');
            var label = button ? button.textContent : '';
            if (button) { button.disabled = true; button.textContent = english() ? 'Sending…' : 'جاري الإرسال…'; }
            post(form.getAttribute('action'), detail.data).then(function (result) {
                if (result.ok) { if (detail.done) detail.done(); return; }
                var error = firstError(result.data);
                if (detail.fail) detail.fail(error.message);
                toast(error.message, 'error');
            }).catch(function () {
                if (detail.fail) detail.fail(failText());
            }).then(function () {
                form.__sending = false;
                if (button) { button.disabled = false; button.textContent = label; }
            });
        });
    });

    // ---- شاري كارد: الرد فيه card { name, code } (العميل المسجل — الكارت بيظهر) أو pending (الطلب اتسجل)
    document.addEventListener('shary:card-request', function (event) {
        var form = event.target;
        var detail = event.detail || {};
        if (event.defaultPrevented || !isLead(form) || !window.fetch || !window.FormData) return;
        event.preventDefault();
        if (form.__sending) return;
        form.__sending = true;
        post(form.getAttribute('action'), new FormData(form)).then(function (result) {
            if (!result.ok) { if (detail.fail) detail.fail(firstError(result.data).message); return; }
            if (result.data.card && result.data.card.code && detail.show) detail.show(result.data.card);
            else if (detail.pending) detail.pending();
        }).catch(function () {
            if (detail.fail) detail.fail(failText());
        }).then(function () { form.__sending = false; });
    });

    // ---- فورم بيع / تأجير عقار: مشاريع المنطقة المختارة (GET data-projects-url?area=ID ← { items: [{ value, label, logo, short }] })
    Array.prototype.forEach.call(document.querySelectorAll('[data-request-page][data-projects-url]'), function (page) {
        var url = page.getAttribute('data-projects-url');
        var area = page.querySelector('select[name="location"]');
        var project = page.querySelector('select[name="project"]');
        if (!url || !area || !project || !window.fetch) return;
        var box = project.closest('[data-select]');
        var list = box ? box.querySelector('[data-select-list]') : null;
        var other = list ? list.querySelector('[role="option"][data-value="other"]') : null;
        var cache = {};
        var asked = 0;

        function render(items) {
            // القايمة الأصلية: أول اختيار (العنوان) + المشاريع + "مشروع آخر"
            var keep = project.value;
            Array.prototype.slice.call(project.options).forEach(function (option) { if (option.value !== '' && option.value !== 'other') project.removeChild(option); });
            var otherOption = project.querySelector('option[value="other"]');
            items.forEach(function (item) {
                var option = document.createElement('option');
                option.value = String(item.value);
                option.textContent = item.label;
                project.insertBefore(option, otherOption);
            });
            project.value = items.some(function (item) { return String(item.value) === keep; }) || keep === 'other' ? keep : '';
            // القايمة اللي بالصور: نفس شكل اختيار "مشروع آخر" بلوجو المطور
            if (list && other) {
                Array.prototype.slice.call(list.querySelectorAll('[role="option"]')).forEach(function (node) { if (node !== other) list.removeChild(node); });
                items.forEach(function (item) {
                    var row = other.cloneNode(true);
                    row.setAttribute('data-value', String(item.value));
                    row.setAttribute('aria-selected', 'false');
                    row.hidden = false;
                    var icon = row.firstElementChild;
                    var short = document.createElement('span');
                    short.className = 'req-menu__icon req-menu__icon--short' + (item.logo ? ' hidden' : '');
                    short.dir = 'ltr';
                    short.textContent = item.short || '';
                    if (item.logo) {
                        var logo = document.createElement('img');
                        logo.className = 'req-menu__logo';
                        logo.alt = '';
                        logo.loading = 'lazy';
                        logo.src = item.logo;
                        logo.onerror = function () { logo.onerror = null; logo.classList.add('hidden'); short.classList.remove('hidden'); };
                        row.insertBefore(logo, icon);
                    }
                    row.insertBefore(short, icon);
                    row.removeChild(icon);
                    var name = row.querySelector('[data-select-name]');
                    if (name) name.textContent = item.label;
                    list.insertBefore(row, other);
                });
                box.dispatchEvent(new CustomEvent('shary:select-refresh'));
            }
            project.dispatchEvent(new Event('change', { bubbles: true }));
        }

        function load() {
            var value = area.value;
            var key = value === '' || value === 'other' ? '' : value;
            if (key === '') { render([]); return; }
            if (cache[key]) { render(cache[key]); return; }
            var turn = ++asked;
            fetch(url + (url.indexOf('?') === -1 ? '?' : '&') + 'area=' + encodeURIComponent(key), { headers: { 'Accept': 'application/json' }, credentials: 'same-origin' })
                .then(function (response) { return response.ok ? response.json() : { items: [] }; })
                .then(function (data) { cache[key] = (data && data.items) || []; if (turn === asked) render(cache[key]); })
                .catch(function () { if (turn === asked) render([]); });
        }
        area.addEventListener('change', load);
        if (area.form) area.form.addEventListener('reset', function () { setTimeout(load, 0); });
    });
})();
