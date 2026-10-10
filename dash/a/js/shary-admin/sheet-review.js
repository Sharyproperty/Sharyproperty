/*
 | Shary dashboard — the review of a units sheet before saving (resources/views/shary_admin/units/sheet-review.blade.php):
 |
 |   change a cell        kept as it is typed (the sheet is a draft): «جارٍ الحفظ / تم الحفظ / فشل الحفظ» in the bar below
 |   the errors           under each cell — checked at once in the page (numbers, the lists, the payment sums, repeats inside the sheet),
 |                        then by the server with the unit form's own rules (and the units already on the website)
 |   the counts           are the filters: all · ready · errors · repeats · saved · taken out — and a search box
 |   many rows at once    tick rows → one column gets the same value in all of them, or they are taken out of the review / back
 |   «احفظ الوحدات الجاهزة»  each ready row becomes a unit (the unit form's own save); the rows with errors stay here for later
 */
(function () {
    'use strict';
    var table = document.querySelector('[data-rv-table]');
    if (!table || table.__sxReview) { return; }
    table.__sxReview = true;

    function json(text, fallback) { try { return JSON.parse(text || '') || fallback; } catch (e) { return fallback; } }
    var L = json(table.getAttribute('data-labels'), {});
    var OPT = json(table.getAttribute('data-options'), {});
    var FREQ = json(table.getAttribute('data-freq'), {});
    var KIND = table.getAttribute('data-kind') || 'developer';
    var rowsUrl = table.getAttribute('data-rows-url');
    var saveUrl = table.getAttribute('data-save-url');
    var saveForm = document.querySelector('[data-rv-save-form]');
    var saveButton = document.querySelector('[data-rv-save]');
    var tokenInput = saveForm ? saveForm.querySelector('input[name=_token]') : null;
    var meta = document.querySelector('meta[name="csrf-token"]');
    var token = tokenInput ? tokenInput.value : (meta ? meta.getAttribute('content') : '');
    var statusBox = document.querySelector('[data-rv-status]');
    var statusText = statusBox ? statusBox.querySelector('[data-rv-status-text]') : null;
    var retry = document.querySelector('[data-rv-retry]');
    var message = document.querySelector('[data-rv-message]');
    var body = table.tBodies[0];
    var columns = Array.prototype.map.call(table.tHead.querySelectorAll('th[data-col]'), function (th) { return th.getAttribute('data-col'); });

    function say(template, values) {
        return String(template || '').replace(/:(\w+)/g, function (all, key) { return values && values[key] !== undefined ? values[key] : all; });
    }
    function fold(text) {
        return String(text == null ? '' : text).toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
            .replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').replace(/\s+/g, ' ').trim();
    }
    function num(text) {
        var value = String(text == null ? '' : text).trim().replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 1632); })
            .replace(/[,،٬\s]/g, '').replace('٫', '.');
        return value !== '' && isFinite(Number(value)) ? Number(value) : null;
    }
    function money(value) {
        return Math.abs(value - Math.round(value)) < 0.005 ? Math.round(value).toLocaleString('en-US') : value.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }
    function percent(share) {
        var value = Math.round(share * 1000) / 10;
        return (Math.abs(value - Math.round(value)) < 0.05 ? String(Math.round(value)) : String(value)) + '%';
    }
    function rows() { return Array.prototype.slice.call(body.querySelectorAll('tr.sx-rv-row')); }
    function rowById(id) { return body.querySelector('tr.sx-rv-row[data-row="' + id + '"]'); }
    function issuesOf(tr) { return body.querySelector('[data-issues-for="' + tr.getAttribute('data-row') + '"]'); }
    function cellsOf(tr) {
        var out = {};
        Array.prototype.forEach.call(tr.querySelectorAll('[data-cell]'), function (input) { out[input.getAttribute('data-cell')] = input.value.trim(); });
        return out;
    }
    function has(key) { return columns.indexOf(key) >= 0; }

    // ------------------------------------------------------------------ what the server said last about each row (kept on the row)
    rows().forEach(function (tr) {
        tr.__server = {
            dup: json(tr.getAttribute('data-dup-info'), null), dupOk: tr.getAttribute('data-dup-ok') === '1', twins: json(tr.getAttribute('data-twins'), []),
            rowErrors: Array.prototype.map.call((issuesOf(tr) || tr).querySelectorAll('.sx-issue--error'), function (node) { return node.textContent.trim(); }),
            notes: Array.prototype.map.call((issuesOf(tr) || tr).querySelectorAll('.sx-issue--note'), function (node) { return node.textContent.trim(); })
        };
    });

    // ------------------------------------------------------------------ the checks made in the page (the server checks again)
    var LISTS = {};
    Object.keys(OPT).forEach(function (name) { LISTS[name] = (OPT[name] || []).map(fold); });
    var READY_WORDS = ['جاهز للتسليم', 'جاهز', 'استلام فوري', 'فوري', 'تسليم فوري', 'ready', 'ready to move', 'immediate', '1'].map(fold);
    var CURRENCY = ['جنيه', 'دولار', 'egp', 'usd', '$', 'le', 'جنيه مصري', 'دولار امريكي', 'بالدولار', 'بالجنيه'].map(fold);
    function inList(list, value) {
        var word = fold(value);
        if (list === 'delivery') { return READY_WORDS.indexOf(word) >= 0 || (/^\d{4}$/.test(String(num(value))) && num(value) >= 2000 && num(value) <= 2100); }
        if (list === 'currency') { return CURRENCY.indexOf(word) >= 0; }
        if (list === 'deposit') { return LISTS.deposit.indexOf(word) >= 0 || (num(value) !== null && num(value) >= 0 && num(value) <= 6); }
        if (list === 'frequency' || list === 'plan_frequency') {
            return (LISTS[list] || []).indexOf(word) >= 0 || ['monthly', 'quarterly', 'semi_annual', 'semi-annual', 'annual', 'yearly', 'cash', 'كل 3 شهور', 'كل 6 شهور'].indexOf(word) >= 0;
        }
        if (list === 'period') { return (LISTS.period || []).indexOf(word) >= 0 || ['daily', 'weekly', 'monthly', 'annual', 'yearly', 'يوم', 'شهر', 'سنه', 'اسبوعي'].indexOf(word) >= 0; }
        if (list === 'yesno' || list === 'furnished') { return (LISTS[list] || []).indexOf(word) >= 0 || ['yes', 'no', 'ايوه', 'اه', 'مفروشه', 'مش مفروشه', 'نصف فرش', '1', '0'].indexOf(word) >= 0; }
        var known = LISTS[list] || [];
        return known.indexOf(word) >= 0 || /^\d+$/.test(word);
    }
    function priceColumn() { return KIND === 'rent' ? (has('rent_value') ? 'rent_value' : 'price') : 'price'; }
    function pick(cells, keys) {
        for (var i = 0; i < keys.length; i++) { if (cells[keys[i]]) { return keys[i]; } }
        return keys[0];
    }
    function local(tr) {
        var cells = cellsOf(tr);
        var errors = {};
        var suggest = null;
        ['name_ar', 'property_id', priceColumn()].forEach(function (key) { if (has(key) && !cells[key]) { errors[key] = L.need; } });
        Array.prototype.forEach.call(tr.querySelectorAll('[data-cell]'), function (input) {
            var key = input.getAttribute('data-cell');
            var value = input.value.trim();
            if (!value || errors[key]) { return; }
            var kind = input.getAttribute('data-num');
            if (kind && num(value) === null) { errors[key] = say(L.number, { value: value }); return; }
            if (kind === 'int' && Math.floor(num(value)) !== num(value)) { errors[key] = say(L.whole, { value: value }); return; }
            var list = input.getAttribute('data-list');
            if (list && !inList(list, value)) { errors[key] = say(L.list, { value: value }); }
        });
        // the payment sums
        var plan = '';
        var price = num(cells[priceColumn()]);
        if (KIND !== 'rent' && price && price > 0) {
            var downKey = pick(cells, KIND === 'resale' ? ['cash_now', 'down_payment'] : ['down_payment']);
            var amountKey = pick(cells, KIND === 'resale' ? ['installment_amount', 'monthly_amount'] : ['monthly_amount']);
            var frequencyKey = pick(cells, KIND === 'resale' ? ['installment_frequency', 'payment_frequency'] : ['payment_frequency']);
            var cashOnly = KIND === 'resale' && /كاش كله|^كاش$|^cash$/.test(fold(cells.payment_type || ''));
            var down = num(cells[downKey]);
            var amount = num(cells[amountKey]);
            var years = num(cells.installment_years);
            var perYear = FREQ[fold(cells[frequencyKey] || '')] || FREQ[cells[frequencyKey]] || 4;
            var count = years && years > 0 ? Math.round(years * perYear) : 0;
            if (!cashOnly) {
                if (down !== null && down > price && !errors[downKey]) { errors[downKey] = say(L.down_over, { down: money(down), price: money(price) }); }
                if (amount && amount > 0 && !count && !errors.installment_years) { errors[has('installment_years') ? 'installment_years' : amountKey] = L.years_missing; }
                if (count && !(amount > 0) && !errors[amountKey]) {
                    suggest = Math.max(0, (price - (down || 0)) / count);
                    errors[amountKey] = L.amount_missing;
                }
                var parts = [];
                if (down && down > 0) { parts.push(say(L.plan_down, { percent: percent(down / price), amount: money(down) })); }
                if (count && amount > 0) {
                    parts.push(say(L.plan_inst, { count: count, amount: money(amount) }));
                    var total = (down || 0) + count * amount;
                    if (total > price * 1.10) { parts.push(say(L.plan_over, { total: money(total), price: money(price), percent: percent((total - price) / price) })); }
                    else if (price - total > price * 0.005) { parts.push(say(L.plan_rest, { amount: money(price - total), percent: percent((price - total) / price) })); }
                    else { parts.push(L.plan_ok); }
                }
                plan = parts.join(' · ');
            }
        }
        return { errors: errors, plan: plan, suggest: suggest, suggestKey: KIND === 'resale' ? pick(cells, ['installment_amount', 'monthly_amount']) : 'monthly_amount' };
    }
    // repeats inside the sheet: the first row of a group is the unit, the next ones say which row they repeat
    function signature(tr) {
        var cells = cellsOf(tr);
        var out = [];
        if (cells.reference_no) { out.push('ref|' + fold(cells.reference_no)); }
        if (cells.name_ar) {
            out.push([fold(cells.name_ar), num(cells.apartment_area), num(cells[priceColumn()]), cells.Bedrooms || '', fold(cells.property_id || ''), cells.floor_number || '', num(cells.max_apartment_area)].join('|'));
        }
        return out;
    }
    function twins() {
        var first = {};
        var result = {};
        rows().forEach(function (tr) {
            if (tr.getAttribute('data-state') !== 'open') { return; }
            var id = tr.getAttribute('data-row');
            result[id] = { of: null, twins: [] };
            var sigs = signature(tr);
            for (var i = 0; i < sigs.length; i++) {
                if (first[sigs[i]] && first[sigs[i]] !== tr) {
                    result[id].of = Number(first[sigs[i]].getAttribute('data-no'));
                    result[first[sigs[i]].getAttribute('data-row')].twins.push(Number(tr.getAttribute('data-no')));
                    break;
                }
            }
            sigs.forEach(function (sig) { if (!first[sig]) { first[sig] = tr; } });
        });
        return result;
    }

    // ------------------------------------------------------------------ painting a row
    function chip(kind, text) { var span = document.createElement('span'); span.className = 'sx-st sx-st--' + kind; span.textContent = text; return span; }
    function issue(kind, text) { var span = document.createElement('span'); span.className = 'sx-issue sx-issue--' + kind; span.textContent = text; return span; }
    function paint(tr, result) {
        var state = tr.getAttribute('data-state');
        var open = state === 'open';
        var errors = result.errors || {};
        var rowErrors = (result.row_errors || []).slice();
        var shownErrors = 0;
        Object.keys(errors).forEach(function (key) { if (!tr.querySelector('td[data-col="' + key + '"]')) { rowErrors.push(errors[key]); } });
        Array.prototype.forEach.call(tr.querySelectorAll('td[data-col]'), function (td) {
            var key = td.getAttribute('data-col');
            var text = open ? (errors[key] || '') : '';
            var holder = td.querySelector('[data-err]');
            var input = td.querySelector('[data-cell]');
            td.classList.toggle('has-error', !!text);
            if (text) { shownErrors++; }
            if (holder) {
                holder.hidden = !text;
                holder.textContent = text;
                if (text && result.suggest && key === result.suggestKey) {
                    var use = document.createElement('button');
                    use.type = 'button';
                    use.className = 'sx-rv-use';
                    use.setAttribute('data-rv-use', String(Math.round(result.suggest)));
                    use.textContent = say(L.suggest, { amount: money(result.suggest) });
                    holder.appendChild(document.createTextNode(' '));
                    holder.appendChild(use);
                }
            }
            if (input) { if (text) { input.setAttribute('aria-invalid', 'true'); } else { input.removeAttribute('aria-invalid'); } }
        });
        var dup = result.dup || null;
        var dupOk = !!result.dup_ok;
        var blocking = shownErrors + rowErrors.length + (dup && !dupOk ? 1 : 0);
        var ready = open && blocking === 0;
        tr.setAttribute('data-ready', ready ? '1' : '0');
        tr.setAttribute('data-errors', open ? String(shownErrors + rowErrors.length) : '0');
        tr.setAttribute('data-dup', open && dup && !dupOk ? '1' : '0');
        tr.setAttribute('data-dup-ok', dupOk ? '1' : '0');
        tr.classList.toggle('is-ready', ready);
        tr.classList.toggle('is-bad', open && !ready);
        var plan = tr.querySelector('[data-rv-plan]');
        if (plan && result.plan !== undefined) { plan.textContent = result.plan || ''; }

        var stateCell = tr.querySelector('[data-rv-state]');
        if (stateCell && open) {
            stateCell.innerHTML = '';
            if (ready) { stateCell.appendChild(chip('ready', '✓ ' + L.ready)); }
            if (shownErrors + rowErrors.length) { stateCell.appendChild(chip('errors', say(L.errors, { count: shownErrors + rowErrors.length }))); }
            if (dup && !dupOk) { stateCell.appendChild(chip('dup', L.dup)); }
        }

        var holder = issuesOf(tr);
        if (!holder) { return; }
        var box = holder.querySelector('[data-rv-issues]');
        box.innerHTML = '';
        if (open) {
            rowErrors.forEach(function (text) { box.appendChild(issue('error', text)); });
            if (dup) {
                var line = issue('dup', dup.row ? say(L.dup_row, { row: dup.row }) : say(L.dup_unit, { id: dup.unit.id, name: dup.unit.name }));
                if (dup.unit && dup.unit.url) {
                    var link = document.createElement('a');
                    link.href = dup.unit.url;
                    link.target = '_blank';
                    link.rel = 'noopener';
                    link.textContent = ' ' + L.open;
                    line.appendChild(link);
                }
                var label = document.createElement('label');
                label.className = 'sx-issue__ok';
                var box2 = document.createElement('input');
                box2.type = 'checkbox';
                box2.setAttribute('data-rv-dup-ok', '');
                box2.checked = dupOk;
                label.appendChild(box2);
                label.appendChild(document.createTextNode(' ' + L.dup_ok));
                line.appendChild(label);
                box.appendChild(line);
            }
            if (result.dup_twins && result.dup_twins.length) { box.appendChild(issue('info', say(L.twins, { rows: result.dup_twins.join('، ') }))); }
            (result.notes || []).forEach(function (text) { box.appendChild(issue('note', text)); });
        }
        holder.hidden = !open || !box.childNodes.length;
    }
    // the page's own check of rows (the server's row errors, notes and website repeats stay until the server answers)
    function recheck(only) {
        var groups = twins();
        rows().forEach(function (tr) {
            if (tr.getAttribute('data-state') !== 'open') { paintClosed(tr); return; }
            var id = tr.getAttribute('data-row');
            var mine = !only || only.indexOf(id) >= 0;
            var server = tr.__server || {};
            var group = groups[id] || { of: null, twins: [] };
            var dup = group.of ? { row: group.of } : (server.dup && server.dup.unit ? server.dup : null);
            var check = mine ? local(tr) : (tr.__local || local(tr));
            tr.__local = check;
            paint(tr, { errors: check.errors, plan: check.plan, suggest: check.suggest, suggestKey: check.suggestKey, row_errors: server.rowErrors || [],
                notes: server.notes || [], dup: dup, dup_ok: server.dupOk, dup_twins: group.twins });
        });
        counts();
    }
    function paintClosed(tr) {
        var state = tr.getAttribute('data-state');
        var stateCell = tr.querySelector('[data-rv-state]');
        tr.classList.remove('is-ready', 'is-bad', 'is-open', 'is-saved', 'is-removed');
        tr.classList.add('is-' + state);
        Array.prototype.forEach.call(tr.querySelectorAll('[data-cell]'), function (input) { input.disabled = state !== 'open'; });
        var pickBox = tr.querySelector('[data-rv-pick]');
        if (pickBox) { pickBox.disabled = state === 'saved'; if (state === 'saved') { pickBox.checked = false; } }
        if (stateCell && state !== 'open') {
            stateCell.innerHTML = '';
            if (state === 'saved') {
                stateCell.appendChild(chip('saved', '✓ ' + L.saved));
                if (tr.__unit) {
                    var link = document.createElement('a');
                    link.className = 'sx-st__link';
                    link.href = tr.__unit.url;
                    link.textContent = '#' + tr.__unit.id;
                    stateCell.appendChild(link);
                }
            } else {
                stateCell.appendChild(chip('removed', L.removed));
                var back = document.createElement('button');
                back.type = 'button';
                back.className = 'sx-st__link';
                back.setAttribute('data-rv-restore', '');
                back.textContent = L.restore;
                stateCell.appendChild(back);
            }
            tr.setAttribute('data-ready', '0');
            tr.setAttribute('data-errors', '0');
            tr.setAttribute('data-dup', '0');
            Array.prototype.forEach.call(tr.querySelectorAll('td[data-col]'), function (td) { td.classList.remove('has-error'); var err = td.querySelector('[data-err]'); if (err) { err.hidden = true; } });
            var holder = issuesOf(tr);
            if (holder) { holder.hidden = true; }
        }
    }
    function setState(tr, state, unit) {
        tr.setAttribute('data-state', state);
        if (unit) { tr.__unit = unit; }
        paintClosed(tr);
    }

    // ------------------------------------------------------------------ the counts = the filters
    function counts() {
        var out = { total: 0, ready: 0, errors: 0, dups: 0, saved: 0, removed: 0 };
        rows().forEach(function (tr) {
            out.total++;
            var state = tr.getAttribute('data-state');
            if (state === 'saved') { out.saved++; return; }
            if (state === 'removed') { out.removed++; return; }
            if (tr.getAttribute('data-ready') === '1') { out.ready++; }
            if (Number(tr.getAttribute('data-errors')) > 0) { out.errors++; }
            if (tr.getAttribute('data-dup') === '1') { out.dups++; }
        });
        Array.prototype.forEach.call(document.querySelectorAll('[data-rv-count]'), function (node) { node.textContent = String(out[node.getAttribute('data-rv-count')] || 0); });
        if (saveButton) { saveButton.disabled = out.ready === 0; }
        filter();
        errorList();
        return out;
    }

    // the table scrolls inside its own box: bring a cell to the middle of the box, then the box into the screen (the page never moves sideways)
    var scrollBox = document.querySelector('[data-rv-scroll]');
    function reveal(element) {
        if (!element) { return; }
        if (scrollBox) {
            var box = scrollBox.getBoundingClientRect();
            var rect = element.getBoundingClientRect();
            scrollBox.scrollLeft += (rect.left + rect.width / 2) - (box.left + box.width / 2);
            scrollBox.scrollTop += (rect.top + rect.height / 2) - (box.top + box.height / 2);
            box = scrollBox.getBoundingClientRect();
            var top = document.querySelector('.sx-top');
            var offset = top ? top.getBoundingClientRect().bottom : 0;
            if (box.top < offset || box.bottom > window.innerHeight) {
                window.scrollTo({ top: window.pageYOffset + box.top - offset - 12, behavior: 'smooth' });
            }
        }
    }

    // ------------------------------------------------------------------ every error in one list: the row, the column, why — a click goes to the cell
    var errList = document.querySelector('[data-rv-errlist]');
    var listOpen = false;
    function columnName(key) {
        var th = table.tHead.querySelector('th[data-col="' + key + '"]');
        if (!th) { return key; }
        var copy = th.cloneNode(true);
        Array.prototype.forEach.call(copy.querySelectorAll('small'), function (small) { small.parentNode.removeChild(small); });
        return copy.textContent.trim();
    }
    function errorList() {
        if (!errList) { return; }
        var items = [];
        rows().forEach(function (tr) {
            if (tr.getAttribute('data-state') !== 'open') { return; }
            var no = tr.getAttribute('data-no');
            Array.prototype.forEach.call(tr.querySelectorAll('td.has-error'), function (td) {
                var err = td.querySelector('[data-err]');
                var text = err ? (err.firstChild && err.firstChild.nodeType === 3 ? err.firstChild.nodeValue : err.textContent).trim() : '';
                items.push({ row: tr.getAttribute('data-row'), col: td.getAttribute('data-col'), text: say(L.errlist_row, { row: no }) + ' · ' + columnName(td.getAttribute('data-col')) + ' — ' + text });
            });
            var holder = issuesOf(tr);
            if (holder && !holder.hidden) {
                Array.prototype.forEach.call(holder.querySelectorAll('.sx-issue--error, .sx-issue--dup'), function (node) {
                    if (node.classList.contains('sx-issue--dup') && tr.getAttribute('data-dup') !== '1') { return; }
                    var text = node.firstChild ? node.firstChild.textContent || node.textContent : node.textContent;
                    items.push({ row: tr.getAttribute('data-row'), col: '', text: say(L.errlist_row, { row: no }) + ' — ' + String(text).trim() });
                });
            }
        });
        errList.hidden = items.length === 0;
        errList.innerHTML = '';
        if (!items.length) { return; }
        var details = document.createElement('details');
        details.open = listOpen;
        details.addEventListener('toggle', function () { listOpen = details.open; });
        var summary = document.createElement('summary');
        summary.innerHTML = '';
        var strong = document.createElement('b');
        strong.textContent = say(L.errlist, { count: items.length });
        summary.appendChild(strong);
        var hint = document.createElement('small');
        hint.textContent = ' ' + (L.errlist_hint || '');
        summary.appendChild(hint);
        details.appendChild(summary);
        var ol = document.createElement('ol');
        items.slice(0, 200).forEach(function (item) {
            var li = document.createElement('li');
            var button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('data-rv-jump', item.row + '|' + item.col);
            button.textContent = item.text;
            li.appendChild(button);
            ol.appendChild(li);
        });
        details.appendChild(ol);
        if (items.length > 200) {
            var more = document.createElement('p');
            more.textContent = say(L.errlist_more, { count: items.length - 200 });
            details.appendChild(more);
        }
        errList.appendChild(details);
    }
    if (errList) {
        errList.addEventListener('click', function (event) {
            var jump = event.target.closest && event.target.closest('[data-rv-jump]');
            if (!jump) { return; }
            var parts = jump.getAttribute('data-rv-jump').split('|');
            var tr = rowById(parts[0]);
            if (!tr) { return; }
            if (tr.hidden) {
                currentFilter = 'all';
                Array.prototype.forEach.call(document.querySelectorAll('[data-rv-filter]'), function (other) { other.classList.toggle('is-on', other.getAttribute('data-rv-filter') === 'all'); });
                if (findBox) { findBox.value = ''; }
                filter();
            }
            var input = parts[1] ? tr.querySelector('[data-cell="' + parts[1] + '"]') : tr.querySelector('[data-cell]');
            tr.classList.add('is-flash');
            window.setTimeout(function () { tr.classList.remove('is-flash'); }, 1600);
            reveal(input || tr);
            if (input) { window.setTimeout(function () { input.focus({ preventScroll: true }); }, 350); }
        });
    }
    var currentFilter = 'all';
    var findBox = document.querySelector('[data-rv-find]');
    function filter() {
        var term = fold(findBox ? findBox.value : '');
        rows().forEach(function (tr) {
            var state = tr.getAttribute('data-state');
            var show = true;
            if (currentFilter === 'ready') { show = state === 'open' && tr.getAttribute('data-ready') === '1'; }
            if (currentFilter === 'errors') { show = state === 'open' && Number(tr.getAttribute('data-errors')) > 0; }
            if (currentFilter === 'dups') { show = state === 'open' && tr.getAttribute('data-dup') === '1'; }
            if (currentFilter === 'saved') { show = state === 'saved'; }
            if (currentFilter === 'removed') { show = state === 'removed'; }
            if (show && term) {
                var text = tr.getAttribute('data-no') + ' ' + Object.values(cellsOf(tr)).join(' ');
                show = fold(text).indexOf(term) >= 0;
            }
            tr.hidden = !show;
            var holder = issuesOf(tr);
            if (holder) { holder.classList.toggle('sx-rv-off', !show); }
        });
    }
    Array.prototype.forEach.call(document.querySelectorAll('[data-rv-filter]'), function (button) {
        button.addEventListener('click', function () {
            currentFilter = button.getAttribute('data-rv-filter');
            Array.prototype.forEach.call(document.querySelectorAll('[data-rv-filter]'), function (other) {
                other.classList.toggle('is-on', other === button);
                other.setAttribute('aria-pressed', other === button ? 'true' : 'false');
            });
            filter();
        });
    });
    if (findBox) { findBox.addEventListener('input', filter); }

    // ------------------------------------------------------------------ saving what changes (the draft)
    var pending = {};
    var extra = { remove: [], restore: [], dup_ok: {}, publish: null };
    var timer = null;
    var inflight = null;
    var again = false;
    var failures = 0;
    function status(state, text) {
        if (!statusBox) { return; }
        statusBox.setAttribute('data-state', state);
        if (statusText) { statusText.textContent = text; }
        if (retry) { retry.hidden = state !== 'failed' && state !== 'offline'; }
    }
    function empty() {
        return !Object.keys(pending).length && !extra.remove.length && !extra.restore.length && !Object.keys(extra.dup_ok).length && extra.publish === null;
    }
    function schedule(wait) {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () { send(); }, typeof wait === 'number' ? wait : 1200);
    }
    function headers() {
        return { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': token };
    }
    function applyServer(data) {
        Object.keys(data.states || {}).forEach(function (id) {
            var tr = rowById(id);
            var one = data.states[id];
            if (tr && one) { setState(tr, one.state, one.unit); }
        });
        Object.keys(data.rows || {}).forEach(function (id) {
            var tr = rowById(id);
            var result = data.rows[id];
            if (!tr || !result || tr.getAttribute('data-state') !== 'open') { return; }
            // edits typed while the server was answering are newer: the page's own check of them stays
            if (pending[id]) { return; }
            tr.__server = { dup: result.dup && result.dup.unit ? result.dup : null, dupOk: !!result.dup_ok, twins: result.dup_twins || [], rowErrors: result.row_errors || [], notes: result.notes || [] };
            tr.__local = { errors: result.errors || {}, plan: result.plan || '' };
            paint(tr, result);
        });
        counts();
    }
    function send(now) {
        if (inflight) { again = true; return inflight; }
        if (empty()) { return Promise.resolve(); }
        window.clearTimeout(timer);
        var sent = { edits: pending, remove: extra.remove, restore: extra.restore, dup_ok: extra.dup_ok };
        if (extra.publish !== null) { sent.publish = extra.publish; }
        pending = {};
        extra = { remove: [], restore: [], dup_ok: {}, publish: null };
        status('saving', L.saving);
        inflight = window.fetch(rowsUrl, { method: 'POST', headers: headers(), body: JSON.stringify(sent), credentials: 'same-origin' })
            .then(function (response) { return response.json().catch(function () { return {}; }).then(function (data) { return { ok: response.ok, data: data || {} }; }); })
            .then(function (result) {
                if (!result.ok || !result.data.ok) { throw new Error('failed'); }
                failures = 0;
                applyServer(result.data);
                status('saved', say(now ? L.draft_saved : L.saved_at, { time: result.data.saved_at || '' }));
            })
            .catch(function () {
                // nothing is lost: what was not saved goes back in the queue (newer edits of the same cells win)
                Object.keys(sent.edits).forEach(function (id) {
                    pending[id] = Object.assign({}, sent.edits[id], pending[id] || {});
                });
                extra.remove = sent.remove.concat(extra.remove);
                extra.restore = sent.restore.concat(extra.restore);
                extra.dup_ok = Object.assign({}, sent.dup_ok, extra.dup_ok);
                if (sent.publish !== undefined && extra.publish === null) { extra.publish = sent.publish; }
                failures++;
                var offline = window.navigator && window.navigator.onLine === false;
                status(offline ? 'offline' : 'failed', offline ? L.offline : L.failed);
                schedule(Math.min(60000, 3000 * Math.pow(2, Math.min(failures, 4))));
            })
            .then(function () {
                inflight = null;
                if (again) { again = false; if (!empty()) { schedule(400); } }
            });
        return inflight;
    }
    if (retry) { retry.addEventListener('click', function () { send(true); }); }

    // a cell is changed
    var checkTimers = {};
    function edited(input, wait) {
        var tr = input.closest('tr.sx-rv-row');
        if (!tr || tr.getAttribute('data-state') !== 'open') { return; }
        var id = tr.getAttribute('data-row');
        (pending[id] = pending[id] || {})[input.getAttribute('data-cell')] = input.value.trim();
        window.clearTimeout(checkTimers[id]);
        checkTimers[id] = window.setTimeout(function () { recheck([id]); }, 250);
        status('pending', L.checking);
        schedule(wait);
    }
    body.addEventListener('input', function (event) { if (event.target.hasAttribute && event.target.hasAttribute('data-cell')) { edited(event.target, 1500); } });
    body.addEventListener('change', function (event) {
        var target = event.target;
        if (target.hasAttribute && target.hasAttribute('data-cell')) { edited(target, 500); return; }
        if (target.hasAttribute && target.hasAttribute('data-rv-dup-ok')) {
            var tr = body.querySelector('tr.sx-rv-row[data-row="' + target.closest('[data-issues-for]').getAttribute('data-issues-for') + '"]');
            if (!tr) { return; }
            extra.dup_ok[tr.getAttribute('data-row')] = target.checked ? 1 : 0;
            tr.__server = tr.__server || {};
            tr.__server.dupOk = target.checked;
            recheck([tr.getAttribute('data-row')]);
            schedule(300);
        }
    });
    body.addEventListener('click', function (event) {
        var use = event.target.closest && event.target.closest('[data-rv-use]');
        if (use) {
            var td = use.closest('td[data-col]');
            var input = td ? td.querySelector('[data-cell]') : null;
            if (input) { input.value = use.getAttribute('data-rv-use'); edited(input, 400); }
            return;
        }
        var restore = event.target.closest && event.target.closest('[data-rv-restore]');
        if (restore) {
            var tr = restore.closest('tr.sx-rv-row');
            extra.restore.push(Number(tr.getAttribute('data-row')));
            setState(tr, 'open');
            recheck();
            schedule(300);
        }
    });
    var publish = document.querySelector('[data-rv-publish]');
    if (publish) { publish.addEventListener('change', function () { extra.publish = Number(publish.value); schedule(200); }); }
    var draftButton = document.querySelector('[data-rv-draft]');
    if (draftButton) {
        draftButton.addEventListener('click', function () {
            if (empty() && !inflight) { status('saved', say(L.draft_saved, { time: new Date().toTimeString().slice(0, 5) })); return; }
            send(true);
        });
    }

    // ------------------------------------------------------------------ many rows at once
    var bulk = document.querySelector('[data-rv-bulk]');
    var all = table.querySelector('[data-rv-all]');
    function picked() { return rows().filter(function (tr) { var box = tr.querySelector('[data-rv-pick]'); return box && box.checked && !tr.hidden; }); }
    function bulkBar() {
        var chosen = picked();
        if (bulk) {
            bulk.hidden = chosen.length === 0;
            var number = bulk.querySelector('[data-rv-picked]');
            if (number) { number.textContent = String(chosen.length); }
        }
    }
    body.addEventListener('change', function (event) { if (event.target.hasAttribute && event.target.hasAttribute('data-rv-pick')) { bulkBar(); } });
    if (all) {
        all.addEventListener('change', function () {
            rows().forEach(function (tr) { var box = tr.querySelector('[data-rv-pick]'); if (box && !box.disabled && !tr.hidden) { box.checked = all.checked; } });
            bulkBar();
        });
    }
    if (bulk) {
        var column = bulk.querySelector('[data-rv-bulk-col]');
        var value = bulk.querySelector('[data-rv-bulk-value]');
        var listFor = function () {
            var option = column.options[column.selectedIndex];
            var list = option ? option.getAttribute('data-list') : '';
            if (list) { value.setAttribute('list', 'sx-rv-list-' + list); } else { value.removeAttribute('list'); }
        };
        column.addEventListener('change', listFor);
        listFor();
        bulk.addEventListener('click', function (event) {
            var button = event.target.closest && event.target.closest('button');
            if (!button) { return; }
            var chosen = picked();
            if (button.hasAttribute('data-rv-bulk-clear')) {
                rows().forEach(function (tr) { var box = tr.querySelector('[data-rv-pick]'); if (box) { box.checked = false; } });
                if (all) { all.checked = false; }
                bulkBar();
                return;
            }
            if (!chosen.length) { return; }
            if (button.hasAttribute('data-rv-bulk-apply')) {
                var key = column.value;
                var changed = 0;
                chosen.forEach(function (tr) {
                    if (tr.getAttribute('data-state') !== 'open') { return; }
                    var input = tr.querySelector('[data-cell="' + key + '"]');
                    if (!input) { return; }
                    input.value = value.value.trim();
                    (pending[tr.getAttribute('data-row')] = pending[tr.getAttribute('data-row')] || {})[key] = input.value;
                    changed++;
                });
                recheck();
                schedule(300);
                showMessage(say(L.bulk_done, { count: changed }), 'ok');
            } else if (button.hasAttribute('data-rv-bulk-remove')) {
                if (!window.confirm(say(L.confirm_remove, { count: chosen.length }))) { return; }
                chosen.forEach(function (tr) {
                    if (tr.getAttribute('data-state') !== 'open') { return; }
                    extra.remove.push(Number(tr.getAttribute('data-row')));
                    setState(tr, 'removed');
                });
                recheck();
                schedule(300);
            } else if (button.hasAttribute('data-rv-bulk-restore')) {
                chosen.forEach(function (tr) {
                    if (tr.getAttribute('data-state') !== 'removed') { return; }
                    extra.restore.push(Number(tr.getAttribute('data-row')));
                    setState(tr, 'open');
                });
                recheck();
                schedule(300);
            }
        });
    }

    // ------------------------------------------------------------------ «احفظ الوحدات الجاهزة»
    function showMessage(text, kind) {
        if (!message) { return; }
        message.textContent = text;
        message.className = 'sx-rv-done is-' + (kind || 'ok');
        message.hidden = false;
        window.clearTimeout(message.__timer);
        message.__timer = window.setTimeout(function () { message.hidden = true; }, 9000);
    }
    // the button does the save itself (a click — the form is only the way without a script)
    if (saveForm && saveButton) {
        saveButton.addEventListener('click', function (event) {
            event.preventDefault();
            var ready = rows().filter(function (tr) { return tr.getAttribute('data-state') === 'open' && tr.getAttribute('data-ready') === '1'; }).length;
            if (!ready) { showMessage(L.none_ready, 'warn'); return; }
            var label = saveButton.innerHTML;
            saveButton.disabled = true;
            saveButton.textContent = L.saving_rows;
            send(true).then(function () {
                return window.fetch(saveUrl, { method: 'POST', headers: headers(), body: '{}', credentials: 'same-origin' })
                    .then(function (response) { return response.json().catch(function () { return {}; }).then(function (data) { return { ok: response.ok, data: data || {} }; }); });
            }).then(function (result) {
                if (!result.ok || !result.data.ok) { throw new Error('failed'); }
                var data = result.data;
                Object.keys(data.saved || {}).forEach(function (id) {
                    var tr = rowById(id);
                    if (tr) { setState(tr, 'saved', data.saved[id]); }
                });
                applyServer(data);
                showMessage(data.message || '', Object.keys(data.saved || {}).length ? 'ok' : 'warn');
            }).catch(function () {
                showMessage(L.failed, 'bad');
            }).then(function () {
                saveButton.innerHTML = label;
                counts();
            });
        });
    }

    // leaving with changes the server has not got yet
    window.addEventListener('beforeunload', function (event) {
        if (empty() && !inflight) { return; }
        event.preventDefault();
        event.returnValue = L.leave || '';
        return L.leave || '';
    });
    window.addEventListener('online', function () { if (!empty()) { schedule(300); } });

    counts();
})();
