/**
 * الرئيسية — الجزء اللي فوق: شرايح العروض على الموبايل ، اختيارات الفلتر السريع ، وسلايدر صور الهيدر.
 * الكلام واللينكات من window.SharyHomeConf (resources/views/shary/home/index.blade.php).
 */

// ---- شرايح العروض (موبايل)
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.mobile-promo-carousel');
    if (!carousel) return;

    const slides = [...carousel.querySelectorAll('.mobile-promo-slide')];
    if (slides.length < 2) return;

    const isRtl = window.SharyHomeConf.isRtl;
    carousel.dir = isRtl ? 'rtl' : 'ltr';

    // Build the track using the slides already in your HTML.
    const track = document.createElement('div');
    track.className = 'mobile-promo-track';

    slides.forEach(slide => track.appendChild(slide));
    track.appendChild(slides[0].cloneNode(true));
    carousel.appendChild(track);

    const count = slides.length;
    let index = 0;
    let timer;
    let animating = false;
    let startX = 0;
    let startY = 0;

    function move(animate = true) {
        track.style.transition = animate
            ? 'transform 400ms ease'
            : 'none';

        const direction = isRtl ? 1 : -1;
        track.style.transform =
            `translate3d(${direction * index * 100}%, 0, 0)`;
    }

    function next() {
        if (animating) return;

        animating = true;
        index++;
        move();
    }

    function previous() {
        if (animating) return;

        if (index === 0) {
            index = count;
            move(false);
            track.offsetHeight;
        }

        animating = true;
        index--;
        move();
    }

    function startAutoplay() {
        clearInterval(timer);

        timer = setInterval(() => {
            if (window.innerWidth < 768 && !document.hidden) {
                next();
            }
        }, 3500);
    }

    track.addEventListener('transitionend', event => {
        if (event.target !== track || event.propertyName !== 'transform') {
            return;
        }

        if (index === count) {
            index = 0;
            move(false);
        }

        animating = false;
    });

    carousel.addEventListener('touchstart', event => {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
        clearInterval(timer);
    }, { passive: true });

    carousel.addEventListener('touchend', event => {
        const deltaX = event.changedTouches[0].clientX - startX;
        const deltaY = event.changedTouches[0].clientY - startY;

        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            const swipedNext = isRtl ? deltaX > 0 : deltaX < 0;
            swipedNext ? next() : previous();
        }

        startAutoplay();
    }, { passive: true });

    carousel.addEventListener('touchcancel', startAutoplay, {
        passive: true
    });

    move(false);
    startAutoplay();
});

// ---- الفلتر السريع في الهيدر
(function () {
    const selectedHomeFilters = {};

    function setFilter(filter, value, label, trigger) {
        if (!filter || value === undefined || value === null) {
            return;
        }

        if (value === '') {
            delete selectedHomeFilters[filter];
        } else {
            selectedHomeFilters[filter] = value;
        }

        if (trigger?.classList.contains('home-search-tab')) {
            if(trigger.id == "rent-filter-btn"){
                return;
            }
            document.querySelectorAll(`.home-search-tab[data-filter="${filter}"]`).forEach((tab) => {
                const isActive = tab === trigger;
                tab.classList.toggle('is-active', isActive);
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
        }

        const dropdown = trigger?.closest('.dropdown-list');
        const dropdownId = dropdown?.id;
        const button = dropdownId ? document.querySelector(`[aria-controls="${dropdownId}"], [onclick*="${dropdownId}"].dropdown-btn`) : null;
        const textTarget = button?.querySelector('span:first-child, p:first-child');

        if (textTarget && label) {
            textTarget.textContent = label.trim();
        }

        if (dropdown) {
            dropdown.classList.add('opacity-0', 'invisible');
        }
    }

    document.querySelectorAll('.home-filter-option').forEach((option) => {
        option.addEventListener('click', function () {
            setFilter(this.dataset.filter, this.dataset.value, this.textContent, this);
        });
    });

    document.querySelectorAll('[data-dropdown-filter]').forEach((input) => {
        input.addEventListener('click', function (event) {
            event.stopPropagation();
        });

        input.addEventListener('input', function () {
            const dropdown = document.getElementById(this.dataset.dropdownFilter);
            const searchValue = this.value.trim().toLowerCase();

            if (!dropdown) {
                return;
            }

            dropdown.querySelectorAll('.home-filter-option').forEach((option) => {
                option.style.display = option.textContent.toLowerCase().includes(searchValue) ? '' : 'none';
            });
        });
    });

    function addRangeParams(params, prefix, lowId, highId) {
        const low = document.getElementById(lowId);
        const high = document.getElementById(highId);
        if (!low || !high) {
            return;
        }

        params.set(prefix === 'price' ? 'min_price' : 'min_area', low.value);
        params.set(prefix === 'price' ? 'max_price' : 'max_area', high.value);
    }

    function collectChecked(params, selector, key) {
        const checked = document.querySelectorAll(selector);
        if (!checked.length) return;
        const values = Array.from(checked).map(el => el.value).filter(Boolean);
        if (values.length === 1) {
            params.set(key, values[0]);
        } else if (values.length > 1) {
            values.forEach(v => params.append(key + '[]', v));
        }
    }

    function collectInput(params, id, key) {
        const input = document.getElementById(id);
        const value = (input?.value || '').trim();
        if (value) {
            params.set(key, value);
        }
    }

    window.submitHomeSearchMobile = function () {
        const params = new URLSearchParams();
        const searchValue = (
            document.getElementById('heroSearchInput')?.value ||
            document.getElementById('navSearchInput')?.value ||
            document.getElementById('mobileSearchInput')?.value ||
            ''
        ).trim();

        Object.entries(selectedHomeFilters).forEach(([key, value]) => {
            params.set(key, value);
        });
        if (searchValue) {
            params.set('q', searchValue);
        }

        collectChecked(params, '#search_advanced input[name="advanced_year[]"]:checked', 'installment_years');
        collectInput(params, 'down_payment', 'down_payment');
        collectInput(params, 'monthly_amount', 'monthly_amount');
        addRangeParams(params, 'price', 'range_searchPrice_low', 'range_searchPrice_high');
        addRangeParams(params, 'area', 'range_searchArea_low', 'range_searchArea_high');

        // أزرار الحالة جنب خانة البحث (ديسك توب): "الكل / من المطور / إعادة بيع" — وفي تبويب الإيجار "الكل / مفروش / غير مفروش".
        // الاختيار بيتبعت لصفحة البحث عشان الفلتر هناك يتعلّم عليه: sale_type = developer_sale | resale ، أو furnished = furnished | unfurnished مع الإيجار
        const statusButton = document.querySelector('.property-status-filter .property-status.active');
        const statusValue = statusButton ? (statusButton.dataset.value || '') : '';
        const activeTab = document.querySelector('.home-search-tab.is-active, .home-search-tab.active');
        const rentTab = (params.get('sale_type') || (activeTab && activeTab.dataset.value) || '') === 'rent';
        if (statusValue !== '') {
            if (rentTab) {
                params.set('furnished', String(statusValue) === '1' ? 'furnished' : 'unfurnished');
            } else if (statusValue === 'resale' || statusValue === 'developer_sale') {
                params.set('sale_type', statusValue);
            }
        }

        window.location.href = sharyHomeSearchUrl(params);

    };

    ['heroSearchInput', 'navSearchInput', 'mobileSearchInput'].forEach((id) => {
        const input = document.getElementById(id);
        if (!input) {
            return;
        }

        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                window.submitHomeSearchMobile();
            }
        });
    });
})();

// ---- سلايدر صور الهيدر
(function () {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide-item');
    const hero = document.querySelector('.hero-container');
    const slider = document.querySelector('.home-hero-slider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let autoplayTimer = null;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('hidden', i !== index);
        });

        if (hero && slides[index]?.dataset.bg) {
            hero.style.backgroundImage = `url("${slides[index].dataset.bg}")`;
            hero.dataset.url = slides[index].dataset.url || window.SharyHomeConf.projectsUrl;
        }

        const disabled = slides.length <= 1;
        if (prevBtn) prevBtn.disabled = disabled;
        if (nextBtn) nextBtn.disabled = disabled;
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function startAutoplay() {
        stopAutoplay();
        if (slides.length <= 1) return;
        autoplayTimer = setInterval(() => {
            window.changeSlide('next');
        }, 4500);
    }

    window.changeSlide = function (direction, targetIndex) {
        if (!slides.length) return;

        if (direction === 'goto' && targetIndex !== undefined) {
            currentSlide = targetIndex;
        } else if (direction === 'next') {
            currentSlide = (currentSlide + 1) % slides.length;
        } else {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        }

        showSlide(currentSlide);
        // Reset autoplay timer on manual interaction
        if (direction !== 'goto') startAutoplay();
    };

    // الشرائح نفسها مش لينك (المشروع بيتفتح من زرار «اكتشف المشروع» بس)

    const interactiveEls = [slider, prevBtn, nextBtn].filter(Boolean);
    interactiveEls.forEach((el) => {
        el.addEventListener('mouseenter', stopAutoplay);
        el.addEventListener('mouseleave', startAutoplay);
        el.addEventListener('focusin', stopAutoplay);
        el.addEventListener('focusout', startAutoplay);
    });

    showSlide(currentSlide);
    startAutoplay();
})();
