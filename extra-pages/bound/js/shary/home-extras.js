// ── home-extras.js · جزء 1 من 6: لينك المتجر وفورم الميتنج والأقسام (المصدر: resources/js/shary/home-extras/01-store-meeting-sections.js — عدّل هنا وشغّل tools/minify-assets.sh)
/**
 * الرئيسية: السلايدر والأقسام والحركات وطلب الميتنج (كانوا 4 أجزاء جوه resources/views/shary/home/index.blade.php — نفس الترتيب ونفس المكان في الصفحة).
 * اللينكات من window.SharyHomeConf.
 */
        function redirectToStore() {
            const androidURL = 'https://play.google.com/store/apps/details?id=com.sharyproperties.app';
            const iosURL = 'https://apps.apple.com/us/app/shary-real-state/id6743754160';

            const ua = navigator.userAgent;

            if (/Android/i.test(ua)) {
                window.location.href = androidURL;
            } else if (/iPhone|iPad|iPod/i.test(ua)) {
                window.location.href = iosURL;
            } else {
                // Optional: default to Play Store or show message
                window.location.href = androidURL;
            }
        }
    
        const meetingForm = document.getElementById('meetingForm');
        if (meetingForm) meetingForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(this);

            try {
                const response = await fetch(window.SharyHomeConf.meetingUrl, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': window.SharyCsrf(),
                        'Accept': 'application/json',
                    },
                    body: formData,
                });

                const result = await response.json();

                if (response.ok) {
                    showToast(result.message, 'success');
                    this.reset(); // Optional: reset form
                    togglePopup('requestMeeting'); // Close popup if needed
                } else {
                    // Handle validation errors
                    let errorMessage = result.message ?? 'Validation error';
                    if (result.errors) {
                        errorMessage = Object.values(result.errors).flat().join('\n');
                    }
                    showToast(errorMessage, 'error');
                }

            } catch (error) {
                showToast('Something went wrong.', 'error');
            }
        });
    
        (function () {
            const customSlider = document.getElementById("customSlider");
            if (!customSlider || !customSlider.children.length) {
                return;
            }

            let scrollIndex = 0;
            const slideCount = customSlider.children.length;
            let isScrolling = false;
            let interval = null;
            let cachedSlideWidth = 0;

            function getSlideWidth() {
                if (!cachedSlideWidth) {
                    cachedSlideWidth = customSlider.children[0].getBoundingClientRect().width;
                }
                return cachedSlideWidth;
            }

            window.addEventListener("resize", () => { cachedSlideWidth = 0; }, { passive: true });

            function scrollToNext() {
                if (isScrolling) return;
                isScrolling = true;

                scrollIndex = (scrollIndex + 1) % slideCount;
                const scrollLeft = scrollIndex * getSlideWidth();

                customSlider.scrollTo({
                    left: scrollLeft,
                    behavior: "smooth"
                });

                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }

            customSlider.addEventListener("scroll", () => {
                if (isScrolling) return;
                const w = getSlideWidth();
                if (w > 0) scrollIndex = Math.round(customSlider.scrollLeft / w);
            }, { passive: true });

            interval = setInterval(scrollToNext, 4000);

            customSlider.addEventListener("mouseenter", () => clearInterval(interval));
            customSlider.addEventListener("mouseleave", () => {
                interval = setInterval(scrollToNext, 4000);
            });
        })();
    
        document.addEventListener("DOMContentLoaded", () => {

            const carousel = document.getElementById("newProjectsCarousel");
            const track = carousel?.querySelector(".new-projects-track");
            const cards = [...(track?.querySelectorAll(".new-project-card") || [])];
            const pagination = document.getElementById("newProjectsPagination");

            if (!carousel) return;

            document.querySelectorAll('.horizontal-scroll').forEach((slider) => {
                let isDown = false;
                let startX;
                let scrollLeft;

                slider.addEventListener('mousedown', (e) => {
                isDown = true;
                slider.classList.add('dragging');

                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
                });

                slider.addEventListener('mouseleave', () => {
                isDown = false;
                slider.classList.remove('dragging');
                });

                slider.addEventListener('mouseup', () => {
                isDown = false;
                slider.classList.remove('dragging');
                });

                slider.addEventListener('mousemove', (e) => {
                if (!isDown) return;

                e.preventDefault();

                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX) * 1.5;

                slider.scrollLeft = scrollLeft - walk;
                });
            });

            // CREATE PAGINATION DOTS
            cards.forEach((card, index) => {

            const dot = document.createElement("span");

            dot.setAttribute("role", "button");
            dot.setAttribute("aria-label", `المشروع ${index + 1}`);

            dot.addEventListener("click", () => {
                card.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
                });
            });

            pagination.appendChild(dot);
            });

            const dots = [...pagination.children];

            // ACTIVE CARD
            function setActive(index) {

            cards.forEach((card, i) => {
                card.classList.toggle("active", i === index);
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === index);
            });
            }


            // CLICK CARD
            cards.forEach((card, index) => {

            card.addEventListener("click", (event) => {
                if (!card.classList.contains("active")) {
                event.preventDefault();

                card.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center"
                });

                setActive(index);
                }
            });

            });

            const observer = new IntersectionObserver(
            (entries) => {

                let bestEntry = null;

                entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                if (
                    !bestEntry ||
                    entry.intersectionRatio > bestEntry.intersectionRatio
                ) {
                    bestEntry = entry;
                }

                });

                if (bestEntry) {
                const index = cards.indexOf(bestEntry.target);

                if (index !== -1) {
                    setActive(index);
                }
                }

            },
            {
                root: carousel,
                threshold: [0.5, 0.7, 0.9]
            }
            );

            cards.forEach(card => observer.observe(card));
            
            /* INITIAL STATE */
            setActive(0);
        });
      
        document.addEventListener("DOMContentLoaded", function () {
            const input = document.querySelector("#phone");

            if (!input || !window.intlTelInput) return;

            const iti = window.intlTelInput(input, {
            initialCountry: "eg",
            separateDialCode: true,

            countrySelectorMode: "AUTO",

            dropdownParent: document.body,

            matchDropdownWidth: true,

            countryOrder: ["eg", "sa", "ae", "kw", "qa"],
            });
        });

        document.addEventListener("DOMContentLoaded", function () {
            // SEARCH DATA
            const searchBox = document.querySelector(".property-search-box");

            if (!searchBox) return;

            // TABS
            const tabs = searchBox.querySelectorAll(".search-tab");

            tabs.forEach((tab) => {
                tab.addEventListener("click", function () {
                    if(tab.id == "rent-filter-btn"){
                        return;
                    }
                    // Remove active state
                    tabs.forEach((item) => {
                        item.classList.remove("active");
                    });

                    // Activate clicked tab
                    this.classList.add("active");

                    // Store selected search type
                    searchBox.dataset.searchType = this.textContent.trim();
                    heroSearchFilters.sale_type = this.getAttribute('data-value') || '';
                });
            });

            // SEARCH INPUT
            const searchInput = searchBox.querySelector(
            ".property-search-input input",
            );

            // FILTERS
            const filters = searchBox.querySelectorAll(".property-filter select");

            // SEARCH BUTTON
            const searchButton = searchBox.querySelector(".property-search-btn");

            searchButton.addEventListener("click", function (event) {
            event.preventDefault();
            });

            // ADVANCED SEARCH
            const advancedButton = searchBox.querySelector(".advanced-search-btn");

            advancedButton.addEventListener("click", function (event) {
                event.preventDefault();
            });

            // ENTER KEY
            searchInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();

                searchButton.click();
            }
            });

            // FILTER CHANGE
            filters.forEach((select) => {
                select.addEventListener("change", function () {
                    this.parentElement.classList.add("selected");

                });
            });

            // CLEAR SEARCH WHEN PLACEHOLDER IS SELECTED
            filters.forEach((select) => {
                select.addEventListener("change", function () {
                    if (this.selectedIndex === 0) {
                    this.parentElement.classList.remove("selected");
                    }
                });
            });

            // SEARCH BOX INTIAL VALUE
            searchBox.dataset.searchType = "جميع العقارات";
        });

// ── home-extras.js · جزء 2 من 6: السلايدر الرئيسي والسحب وحركات الصفحة (المصدر: resources/js/shary/home-extras/02-hero-slider.js — عدّل هنا وشغّل tools/minify-assets.sh)
        window.sharyOnJq(function () {   // بيستنى jQuery (async) والصفحة
            // Mobile navigation
            const mobileMenu = $(`
                <div id="mobileMenu"
                    class="fixed inset-0 z-[100] hidden bg-black/40">
                    <div class="absolute top-0 right-0 h-full w-[82%] max-w-sm bg-white shadow-2xl p-6">
                    <div class="flex items-center justify-between mb-8">
                        <div class="text-2xl font-black text-[#063454]">شاري<span class="text-[#d9a021] text-sm">®</span></div>
                        <button id="closeMobileMenu"
                                class="w-10 h-10 rounded-xl bg-slate-100 text-xl">×</button>
                    </div>
                    <nav class="flex flex-col gap-5 text-slate-700 font-bold">
                        <a href="#home">الرئيسية</a>
                        <a href="#developers">المطورين</a>
                        <a href="#projects">المشاريع</a>
                        <a href="#properties">بيع</a>
                        <a href="#properties">إيجار</a>
                        <a href="#articles">مقالات</a>
                        <a href="#contact">اتصل بنا</a>
                    </nav>
                    </div>
                </div>
            `);

            $("body").append(mobileMenu);

            $("#home-original-menu-button").on("click", function () {
            $("#mobileMenu").removeClass("hidden").hide().fadeIn(180);
            });

            $(document).on("click", "#closeMobileMenu", function () {
                $("#mobileMenu").fadeOut(180, function () {
                    $(this).addClass("hidden");
                });
            });

            $(document).on("click", "#mobileMenu a", function () {
            $("#mobileMenu").fadeOut(180, function () {
                $(this).addClass("hidden");
            });
            });

            // HERO SLIDER
            const $hero = $(".hero-bg");

            // Get all slider images
            const $images = $hero.find(".hero-slide-image");

            // Get all dots
            const $dots = $hero.find(".hero-dot");

            // الجملة ثابتة (hero-brand): العنوان والسطر ما بيتغيروش مع الشريحة
            const $title = $hero.find(".hero-project-info:not(.hero-brand) h1");
            const $location = $hero.find(".hero-project-info:not(.hero-brand) .hero-location");

            // Get counter
            const $counter = $hero.find(".hero-counter");

            // Total number of slides
            const totalSlides = $images.length;

            // Current slide
            let currentSlide = 0;

            // Slider interval
            let heroSliderInterval = null;

            if (!totalSlides) {
                return;
            }

            function renderSlide(index, animate = true) {
                // Safety check
                if (index < 0 || index >= totalSlides) {
                    return;
                }

                // Get current image
                const $image = $images.eq(index);

                // Get data from image
                const title = $image.attr("data-title") || "";
                const location = $image.attr("data-location") || "";

                if (animate) {
                    $title
                        .stop(true, true)
                        .fadeOut(120, function () {

                            $(this)
                                .text(title)
                                .fadeIn(180);

                        });


                    $location
                        .stop(true, true)
                        .fadeOut(120, function () {

                            $(this)
                                .text(location)
                                .fadeIn(180);

                        });

                } else {

                    $title
                        .text(title)
                        .show();

                    $location
                        .text(location)
                        .show();

                }

                $images.removeClass("active");
                $image.addClass("active");

                $counter.text((index + 1) + " / " + totalSlides);

                $dots
                    .removeClass("active")
                    .eq(index)
                    .addClass("active");

                currentSlide = index;

            }

            $dots.on("click", function () {

                const index = Number(
                    $(this).attr("data-slide")
                );


                // Don't animate if clicking current slide
                if (index === currentSlide) {
                    return;
                }


                // Render selected slide
                renderSlide(index);


                // Restart automatic slider
                restartHeroSlider();

            });

            function nextHeroSlide() {

                let nextSlide =
                    currentSlide + 1;


                // Loop back to first slide
                if (nextSlide >= totalSlides) {
                    nextSlide = 0;
                }


                renderSlide(nextSlide);

            }

            function startHeroSlider() {
                // Clear old interval first
                clearInterval(heroSliderInterval);
                heroSliderInterval = setInterval(function () {
                    nextHeroSlide();
                }, 6000);
            }

            function restartHeroSlider() {
                clearInterval(heroSliderInterval);

                startHeroSlider();
            }

            // INITIAL SLIDE
            renderSlide(0, false);

            // START SLIDER
            startHeroSlider();

            // صورة السلايدر مش لينك: المشروع بيتفتح من زرار «اكتشف المشروع» في كارت «مشاريع مميزة» بس

            // خانة البحث بتغطي جزء من تحت السلايدر: الجملة والنقط والكارت بيتحسبوا فوقها (--hero-over = الجزء المتغطّي)
            (function () {
                const content = $hero.find(".hero-content")[0], box = $hero.find(".property-search-box")[0];
                if (!content || !box) return;
                function measure() {
                    const over = Math.max(0, Math.round(content.getBoundingClientRect().bottom - box.getBoundingClientRect().top));
                    content.style.setProperty("--hero-over", over + "px");
                }
                measure();
                window.addEventListener("resize", measure);
                window.addEventListener("load", measure);
            })();

            // كارت «مشاريع مميزة»: بيتغيّر لوحده (سكريبت مستقل تحت — شغال مع الصورة الثابتة ومن غير jQuery)

            function isInteractiveTarget(target) {
                // Don't start a swipe from the search box, buttons, inputs, dropdowns
                return $(target).closest(
                    ".property-search-box, .hero-dot, button, input, select, a"
                ).length > 0;
            }

            const heroSwipeEl = $hero.find(".hero-content")[0];

            const SWIPE_THRESHOLD = 50;   // min horizontal px to count as a swipe
            const SWIPE_MAX_VERTICAL = 60; // ignore if mostly vertical

            let touchStartX = 0;
            let touchStartY = 0;
            let touchDeltaX = 0;
            let isSwiping = false;

            function goToSlide(index) {
                if (index < 0) index = totalSlides - 1;
                if (index >= totalSlides) index = 0;
                if (index === currentSlide) return;

                renderSlide(index);
                restartHeroSlider();
            }


            function swipeStart(x, y, target) {
                if (isInteractiveTarget(target)) return;

                touchStartX = x;
                touchStartY = y;
                touchDeltaX = 0;
                isSwiping = true;

                // Pause autoplay while user is touching
                clearInterval(heroSliderInterval);
            }

            function swipeMove(x, y) {
                if (!isSwiping) return;

                touchDeltaX = x - touchStartX;
            }

            function swipeEnd(y) {
                if (!isSwiping) return;
                isSwiping = false;

                const deltaY = Math.abs(y - touchStartY);

                if (
                    Math.abs(touchDeltaX) >= SWIPE_THRESHOLD &&
                    deltaY <= SWIPE_MAX_VERTICAL
                ) {
                    // RTL support: in Arabic, swipe direction is reversed
                    const isRTL = document.documentElement.dir === "rtl";
                    const swipedLeft = touchDeltaX < 0;
                    const goNext = isRTL ? !swipedLeft : swipedLeft;

                    goToSlide(goNext ? currentSlide + 1 : currentSlide - 1);
                } else {
                    startHeroSlider(); // resume autoplay
                }
            }


            heroSwipeEl.addEventListener("touchstart", function (e) {
                const t = e.touches[0];
                swipeStart(t.clientX, t.clientY, e.target);
            }, { passive: true });

            heroSwipeEl.addEventListener("touchmove", function (e) {
                const t = e.touches[0];
                swipeMove(t.clientX, t.clientY);
            }, { passive: true });

            heroSwipeEl.addEventListener("touchend", function (e) {
                const t = e.changedTouches[0];
                swipeEnd(t.clientY);
            }, { passive: true });

            heroSwipeEl.addEventListener("touchcancel", function () {
                isSwiping = false;
                startHeroSlider();
            }, { passive: true });

            // Recommended properties hover
            $(".grid article").on("mouseenter", function () {
            $(this).addClass("scale-[1.015]");
            }).on("mouseleave", function () {
            $(this).removeClass("scale-[1.015]");
            });

            // Smooth anchor scrolling
            $('a[href^="#"]').on("click", function (e) {
                const target = $(this).attr("href");

                if (target && target !== "#" && $(target).length) {
                    e.preventDefault();

                    $("html, body").animate(
                    {
                        scrollTop: $(target).offset().top - 70,
                    },
                    500,
                    );
                }
            });

            // Header shadow while scrolling
            $(window).on("scroll", function () {
                if ($(window).scrollTop() > 10) {
                    $("header").addClass("shadow-md");
                } else {
                    $("header").removeClass("shadow-md");
                }
            });

// ── home-extras.js · جزء 3 من 6: شريط أرقام السوق (المصدر: resources/js/shary/home-extras/03-market-ticker.js — عدّل هنا وشغّل tools/minify-assets.sh)
            (function () {

                const tickerInstances = new WeakMap();

                function initMarketTicker(section) {

                    const viewport = section.querySelector('.market-ticker-viewport');
                    const track = section.querySelector('.market-ticker-track');

                    if (!viewport || !track) {
                        return;
                    }


                    /* =====================================================
                    STOP OLD ANIMATION INSTANCE
                    ===================================================== */

                    const oldInstance = tickerInstances.get(section);

                    if (oldInstance && oldInstance.rafId) {
                        cancelAnimationFrame(oldInstance.rafId);
                    }


                    /* =====================================================
                    GET FIRST GROUP
                    ===================================================== */

                    let groups = track.querySelectorAll('.market-ticker-group');

                    if (!groups.length) {
                        return;
                    }

                    const originalGroup = groups[0];


                    /* =====================================================
                    REMOVE OLD CLONED GROUPS
                    ===================================================== */

                    track.querySelectorAll('[data-ticker-clone="true"]')
                        .forEach(function (clone) {
                            clone.remove();
                        });


                    /*
                    * If Blade already outputs TWO groups,
                    * keep only the first one.
                    */
                    groups = track.querySelectorAll('.market-ticker-group');

                    groups.forEach(function (group, index) {

                        if (index > 0) {
                            group.remove();
                        }

                    });


                    /* =====================================================
                    RESET POSITION BEFORE MEASURING
                    ===================================================== */

                    track.style.animation = 'none';
                    track.style.transition = 'none';

                    track.style.transform = 'translate3d(0px, 0px, 0px)';


                    /* =====================================================
                    MEASURE GROUP
                    ===================================================== */

                    const groupWidth = originalGroup.scrollWidth;

                    const viewportWidth = viewport.clientWidth;


                    /*
                    * If element is not ready yet, retry.
                    */
                    if (!groupWidth || !viewportWidth) {

                        setTimeout(function () {
                            initMarketTicker(section);
                        }, 200);

                        return;
                    }


                    /* =====================================================
                    CREATE ENOUGH DUPLICATES
                    ===================================================== */

                    /*
                    * Example:
                    *
                    * Viewport = 1000px
                    * Group    = 600px
                    *
                    * We need enough duplicates so there is NEVER
                    * an empty space during movement.
                    */
                    const copiesNeeded = Math.max(
                        4,
                        Math.ceil(viewportWidth / groupWidth) + 3
                    );


                    for (let i = 1; i < copiesNeeded; i++) {

                        const clone = originalGroup.cloneNode(true);

                        clone.setAttribute('aria-hidden', 'true');
                        clone.setAttribute('data-ticker-clone', 'true');

                        track.appendChild(clone);
                    }


                    /* =====================================================
                    DIRECTION
                    ===================================================== */

                    const direction = section.getAttribute('dir');

                    const isRTL = direction === 'rtl';


                    /* =====================================================
                    SPEED
                    ===================================================== */

                    /*
                    * Pixels per second.
                    *
                    * Increase to make faster:
                    * 40 / 50 / 60
                    *
                    * Decrease to make slower:
                    * 20 / 25 / 30
                    */
                    const speed = 35;


                    /* =====================================================
                    START POSITION
                    ===================================================== */

                    let distance = 0;

                    let lastTime = performance.now();


                    const instance = {
                        rafId: null
                    };

                    tickerInstances.set(section, instance);


                    /* =====================================================
                    ANIMATION LOOP
                    ===================================================== */

                    function animate(currentTime) {

                        let delta = (currentTime - lastTime) / 1000;

                        lastTime = currentTime;


                        /*
                        * Prevent a huge jump when browser tab
                        * becomes active again.
                        */
                        if (delta > 0.1) {
                            delta = 0.1;
                        }


                        distance += speed * delta;


                        /* =================================================
                        SEAMLESS LOOP
                        ================================================= */

                        if (distance >= groupWidth) {
                            distance -= groupWidth;
                        }


                        let translateX;


                        /* =================================================
                        RTL
                        MOVE LEFT -> RIGHT
                        ================================================= */

                        if (!isRTL) {

                            translateX = -groupWidth + distance;

                        }

                        /* =================================================
                        LTR
                        MOVE RIGHT -> LEFT
                        ================================================= */

                        else {

                            translateX = -distance;

                        }


                        track.style.transform =
                            'translate3d(' + translateX + 'px, 0px, 0px)';


                        instance.rafId = requestAnimationFrame(animate);
                    }


                    instance.rafId = requestAnimationFrame(animate);
                }

                /*  INITIALISE ALL TICKERS */
                function initAllMarketTickers() {

                    document
                        .querySelectorAll('.market-ticker-section')
                        .forEach(function (section) {

                            initMarketTicker(section);

                        });

                }

                /* NORMAL PAGE LOAD */

                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', initAllMarketTickers);
                } else {
                    initAllMarketTickers();
                }

                /* RESIZE */
                let resizeTimer;
                window.addEventListener('resize', function () {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(function () {
                        initAllMarketTickers();
                    }, 250);
                });


                /* BROWSER BACK / FORWARD CACHE */

                window.addEventListener('pageshow', function () {
                    initAllMarketTickers();
                });


                /* =========================================================
                LIVEWIRE SUPPORT
                Safe even if Livewire is not installed.
                ========================================================= */

                document.addEventListener('livewire:navigated', function () {
                    initAllMarketTickers();
                });


                /* =========================================================
                TURBO SUPPORT
                Safe even if Turbo is not installed.
                ========================================================= */
                document.addEventListener('turbo:load', function () {
                    initAllMarketTickers();
                });

            })();

            // Small helper
            function escapeHtml(value) {
                return $("<div>").text(value).html();
            }
        });

// ── home-extras.js · جزء 4 من 6: بوب أب الفلاتر وأسهم الكروت (المصدر: resources/js/shary/home-extras/04-filters-carousels.js — عدّل هنا وشغّل tools/minify-assets.sh)
        window.sharyOnJq(function () {
        const $overlay = $("#heroAdvancedSearch");

        // Open filter popup
        $("#openFilters").on("click", function () {
            if (document.querySelector('[data-home-filter]')) return;   // نافذة الفلتر الجديدة (partials/filter-window) هي اللي بتفتح — مش القديمة
            $overlay.addClass("active");
            $("body").addClass("filter-menu-open");
        });

        // Close filter popup
        $("#closeFilters").on("click", function () {
            closeFilterMenu();
        });

        // Apply filters
        $("#applyFilters").on("click", function () {
            closeFilterMenu();
        });

        // Click outside modal
        $overlay.on("click", function (e) {
            if ($(e.target).is("#filterOverlay")) {
                closeFilterMenu();
            }
        });

        // ESC
        $(document).on("keydown", function (e) {
            if (e.key === "Escape") {
                closeFilterMenu();
            }
        });

        function closeFilterMenu() {
            $overlay.removeClass("active");
            $("body").removeClass("filter-menu-open");
        }
        });

        /* Carousel arrows - RTL + LTR support */
        document.addEventListener("DOMContentLoaded", () => {
            document.querySelectorAll(
            ".horizontal-scroll.new-projects-carousel, " +
            ".horizontal-scroll.best-projects-carousel"
            ).forEach((slider) => {

                if (!slider) return;

                const wrapper = document.createElement("div");
                wrapper.className = "horizontal-carousel-wrapper";

                slider.parentNode.insertBefore(wrapper, slider);
                wrapper.appendChild(slider);

                /* PREV */
                const prevBtn = document.createElement("button");

                prevBtn.type = "button";
                prevBtn.className = "horizontal-carousel-btn prev";
                prevBtn.setAttribute("aria-label", "السابق");

                prevBtn.innerHTML = `
                    <svg viewBox="0 0 24 24">
                    <path d="M9 18l6-6-6-6"></path>
                    </svg>
                `;

                /* NEXT */
                const nextBtn = document.createElement("button");

                nextBtn.type = "button";
                nextBtn.className = "horizontal-carousel-btn next";
                nextBtn.setAttribute("aria-label", "التالي");

                nextBtn.innerHTML = `
                    <svg viewBox="0 0 24 24">
                    <path d="M15 18l-6-6 6-6"></path>
                    </svg>
                `;

                wrapper.appendChild(prevBtn);
                wrapper.appendChild(nextBtn);

                /* Check direction — بيتقري أول مرة بس لما يحتاجه (من غير ما يجبر المتصفح يرسم الصفحة كلها وهي بتفتح) */
                let rtlKnown = null;
                const rtl = () => rtlKnown ?? (rtlKnown =
                    getComputedStyle(slider).direction === "rtl" ||
                    getComputedStyle(slider.firstElementChild || slider).direction === "rtl");

                function getScrollAmount() {

                    const firstCard = slider.firstElementChild?.firstElementChild ||
                                    slider.firstElementChild;

                    if (!firstCard) {
                    return slider.clientWidth * 0.8;
                    }

                    const parent = firstCard.parentElement;

                    const gap = parseFloat(getComputedStyle(parent).gap) || 0;

                    return firstCard.getBoundingClientRect().width + gap;
                }

                function getMaxScroll() {
                    return Math.max(
                    0,
                    slider.scrollWidth - slider.clientWidth
                    );
                }

                /*
                * Normalize scroll position.
                *
                * LTR:
                * 0 -------------------- max
                *
                * RTL:
                * 0 -------------------- -max
                *
                * We convert both into:
                * 0 -------------------- max
                */
                function getNormalizedScroll() {

                    const max = getMaxScroll();

                    if (!rtl()) {
                    return Math.max(
                        0,
                        Math.min(max, slider.scrollLeft)
                    );
                    }

                    return Math.max(
                    0,
                    Math.min(max, Math.abs(slider.scrollLeft))
                    );
                }

                function updateButtons() {

                    const max = getMaxScroll();

                    /* No overflow = no buttons */
                    if (max <= 2) {

                    prevBtn.style.display = "none";
                    nextBtn.style.display = "none";

                    return;
                    }

                    prevBtn.style.display = "flex";
                    nextBtn.style.display = "flex";

                    const current = getNormalizedScroll();

                    if (current <= 2) {
                    prevBtn.style.display = "none";
                    } else {
                    prevBtn.style.display = "flex";
                    }

                    if (current >= max - 2) {
                    nextBtn.style.display = "none";
                    } else {
                    nextBtn.style.display = "flex";
                    }
                }

                /* PREVIOUS */
                prevBtn.addEventListener("click", (e) => {

                    e.preventDefault();
                    e.stopPropagation();

                    const amount = getScrollAmount();

                    slider.scrollBy({
                    left: rtl() ? amount : -amount,
                    behavior: "smooth"
                    });
                });

                /* NEXT */
                nextBtn.addEventListener("click", (e) => {

                    e.preventDefault();
                    e.stopPropagation();

                    const amount = getScrollAmount();

                    slider.scrollBy({
                    left: rtl() ? -amount : amount,
                    behavior: "smooth"
                    });
                });

                slider.addEventListener(
                    "scroll",
                    updateButtons,
                    { passive: true }
                );

                window.addEventListener(
                    "resize",
                    updateButtons
                );

                /* Initial check */
                setTimeout(updateButtons, 100);
                setTimeout(updateButtons, 500);
            });

            const promoCarousel = document.querySelector(".promo-banners-carousel");
            if (promoCarousel) {
                const track = promoCarousel.querySelector(".promo-banners-track");

                if (track) {

                    const originalCards = [
                        ...track.querySelectorAll(".shary-promo-banner")
                    ];

                    if (originalCards.length > 1) {

                        const isRTL = (document.documentElement.getAttribute("dir") || "").toLowerCase() === "rtl";

                        let autoScroll = null;
                        let isUserInteracting = false;

                        /*
                        * Add several copies initially.
                        *
                        * We NEVER reset scrollLeft.
                        */
                        function addMoreAds() {

                            originalCards.forEach(card => {
                                track.appendChild(card.cloneNode(true));
                            });
                        }

                        /*
                        * Add enough copies initially.
                        */
                        addMoreAds();
                        addMoreAds();
                        addMoreAds();
                        addMoreAds();

                        function getCardWidth() {

                            const card =
                                track.querySelector(".shary-promo-banner");

                            if (!card) return 0;

                            const gap =
                                parseFloat(getComputedStyle(track).gap) || 0;

                            return card.getBoundingClientRect().width + gap;
                        }

                        function getNormalizedScroll() {

                            const scroll = promoCarousel.scrollLeft;

                            return isRTL
                                ? Math.abs(scroll)
                                : scroll;
                        }

                        function getMaxScroll() {

                            return Math.max(
                                0,
                                promoCarousel.scrollWidth -
                                promoCarousel.clientWidth
                            );
                        }

                        /*
                        * Move ONE ad in the body's direction.
                        */
                        function moveToNextAd() {

                            if (isUserInteracting) return;

                            const amount = getCardWidth();

                            if (!amount) return;

                            /*
                            * Always move forward.
                            *
                            * LTR  = +
                            * RTL  = -
                            */
                            promoCarousel.scrollBy({
                                left: isRTL ? -amount : amount,
                                behavior: "smooth"
                            });

                            /*
                            * If we're getting close to the end,
                            * add another complete set of ads.
                            *
                            * IMPORTANT:
                            * We don't reset scroll position.
                            */
                            setTimeout(() => {

                                const current =
                                    getNormalizedScroll();

                                const max =
                                    getMaxScroll();

                                if (max - current < amount * 5) {
                                    addMoreAds();
                                }

                            }, 700);
                        }

                        function startAutoScroll() {

                            if (autoScroll) return;

                            /*
                            * 3 seconds between ads.
                            */
                            autoScroll = setInterval(() => {
                                moveToNextAd();
                            }, 3000);
                        }

                        function stopAutoScroll() {

                            if (autoScroll) {

                                clearInterval(autoScroll);

                                autoScroll = null;
                            }
                        }

                        /*
                        * Touch START
                        */
                        promoCarousel.addEventListener(
                            "touchstart",
                            () => {

                                isUserInteracting = true;

                                stopAutoScroll();

                            },
                            { passive: true }
                        );

                        /*
                        * Touch END
                        */
                        promoCarousel.addEventListener(
                            "touchend",
                            () => {

                                /*
                                * Don't change the user's position.
                                *
                                * Just resume from exactly where
                                * the user stopped.
                                */
                                setTimeout(() => {

                                    isUserInteracting = false;

                                    startAutoScroll();

                                }, 1500);

                            },
                            { passive: true }
                        );

                        /*
                        * Mouse hover
                        */
                        promoCarousel.addEventListener(
                            "mouseenter",
                            () => {

                                isUserInteracting = true;

                                stopAutoScroll();

                            }
                        );

                        promoCarousel.addEventListener(
                            "mouseleave",
                            () => {

                                isUserInteracting = false;

                                startAutoScroll();

                            }
                        );

                        /*
                        * Start automatic scrolling.
                        */
                        setTimeout(() => {
                            startAutoScroll();
                        }, 2000);
                    }
                }
            }

// ── home-extras.js · جزء 5 من 6: كروت الاستثمار المتحركة ونقطها (المصدر: resources/js/shary/home-extras/05-investment-carousel.js — عدّل هنا وشغّل tools/minify-assets.sh)
            /* Dynamic Investment Carousel - Mobile */
            const investmentCarousel = document.querySelector(
            ".investment-shortcuts"
            );

            if (investmentCarousel) {
            const cards = [...investmentCarousel.children];

            // الحركة التلقائية شغالة على الموبايل والديسك توب — بشرط إن الكروت أعرض من الصف (فيه حاجة تتحرك)
            function startInvestmentAutoCarousel() {
                if (investmentCarousel.scrollWidth <= investmentCarousel.clientWidth + 4) return;

                // Prevent multiple intervals
                if (investmentCarousel._autoCarousel) return;

                let index = 0;

                investmentCarousel._autoCarousel = setInterval(() => {

                const card = cards[index];

                if (!card) return;

                // وصل لآخر الصف (على الديسك توب بيحصل بعد كارت أو اتنين): يرجع لأول الصف ويبدأ من جديد
                if (Math.abs(investmentCarousel.scrollLeft) + investmentCarousel.clientWidth >= investmentCarousel.scrollWidth - 4) {
                    index = 0;
                    investmentCarousel.scrollTo({ left: 0, behavior: "smooth" });
                    return;
                }

                const cardWidth =
                    card.getBoundingClientRect().width;

                const gap =
                    parseFloat(
                    getComputedStyle(investmentCarousel).gap
                    ) || 0;

                investmentCarousel.scrollBy({
                    // الاتجاه حسب لغة الصفحة: العربي بيتحرك شمال (قيمة سالبة) والإنجليزي يمين — عشان الحركة تشتغل في اللغتين
                    left: (getComputedStyle(investmentCarousel).direction === 'rtl' ? -1 : 1) * (cardWidth + gap),
                    behavior: "smooth"
                });

                index++;

                // Start again when reaching the last card
                if (index >= cards.length) {
                    index = 0;

                    setTimeout(() => {
                    investmentCarousel.scrollTo({
                        left: 0,
                        behavior: "smooth"
                    });
                    }, 700);
                }

                }, 2500);
            }

            function stopInvestmentAutoCarousel() {
                if (investmentCarousel._autoCarousel) {
                clearInterval(investmentCarousel._autoCarousel);
                investmentCarousel._autoCarousel = null;
                }
            }

            function handleInvestmentCarousel() {

                stopInvestmentAutoCarousel();
                startInvestmentAutoCarousel();
            }

            // أول قياس بعد ما الصفحة تخلص تحميل (القياس وهي بتفتح كان بيجبر المتصفح يرسم الصفحة كلها) — الحركة نفسها كل 2.5 ثانية زي ما هي
            window.addEventListener("load", () => setTimeout(handleInvestmentCarousel, 1200), { once: true });

            window.addEventListener(
                "resize",
                handleInvestmentCarousel
            );

            // Pause while user interacts
            investmentCarousel.addEventListener("touchstart", () => {
                stopInvestmentAutoCarousel();
            }, { passive: true });

            investmentCarousel.addEventListener("touchend", () => {
                setTimeout(() => {
                startInvestmentAutoCarousel();
                }, 1500);
            }, { passive: true });

            // ديسك توب: الحركة بتقف والماوس فوق الكروت (عشان العميل يعرف يضغط) وترجع لما يبعد
            investmentCarousel.addEventListener("mouseenter", stopInvestmentAutoCarousel);
            investmentCarousel.addEventListener("mouseleave", () => {
                setTimeout(startInvestmentAutoCarousel, 800);
            });
            }

            const carousel = document.querySelector(".investment-promo-carousel");

            if (!carousel) return;

            const grid = carousel.querySelector(".investment-promo-grid");
            const cards = [...carousel.querySelectorAll(".investment-promo-card")];

            if (!grid || !cards.length) return;

            /* Create dots */
            const dotsContainer = document.createElement("div");
            dotsContainer.className = "investment-promo-dots";

            cards.forEach((card, index) => {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = "investment-promo-dot";

            dot.setAttribute(
                "aria-label",
                `الانتقال إلى العرض ${index + 1}`
            );

            dot.addEventListener("click", () => {
                /*
                * Move to the related card
                */
                carousel.scrollTo({
                left: card.offsetLeft - carousel.offsetLeft,
                behavior: "smooth"
                });

                updateActiveDot(index);
            });

            dotsContainer.appendChild(dot);
            });

            carousel.parentNode.appendChild(dotsContainer);

            const dots = [...dotsContainer.children];

            function updateActiveDot(index) {
            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === index);
            });
            }


            function updateFromScroll() {
            if (window.innerWidth > 767) return;

            const carouselCenter =
                carousel.getBoundingClientRect().left +
                carousel.clientWidth / 2;

            let closestIndex = 0;
            let closestDistance = Infinity;

            cards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();

                const cardCenter =
                rect.left + rect.width / 2;

                const distance = Math.abs(
                cardCenter - carouselCenter
                );

                if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
                }
            });

            updateActiveDot(closestIndex);
            }

            carousel.addEventListener(
            "scroll",
            updateFromScroll,
            { passive: true }
            );

            window.addEventListener("resize", updateFromScroll);

            updateActiveDot(0);       
        });

// ── home-extras.js · جزء 6 من 6: فورم الاستشارة (المنطقة مطلوبة) (المصدر: resources/js/shary/home-extras/06-contact-form.js — عدّل هنا وشغّل tools/minify-assets.sh)
        // فورم الاستشارة: المنطقة مطلوبة — لو ما اتختارتش الفورم ما يتبعتش: القائمة بتفتح وإطارها بيتلوّن عشان العميل يختار
        document.addEventListener('DOMContentLoaded', function () {
            var form = document.getElementById('homeContactForm');
            if (!form) return;
            form.addEventListener('submit', function (event) {
                var area = document.getElementById('selected_area_id');
                var button = document.getElementById('contact_location_btn');
                var list = document.getElementById('location');
                if (!area || area.value || !button || !list) return;
                event.preventDefault();
                event.stopImmediatePropagation();
                button.style.borderColor = '#D92D20';
                button.scrollIntoView({ block: 'center', behavior: 'smooth' });
                if (list.classList.contains('invisible') && typeof openDropdownMenu === 'function') openDropdownMenu('location');
            }, true);
        });

        function selectHomeAreaContact(id, name, element) {
            const label = document.getElementById('contact_location_label');
            const hiddenInput = document.getElementById('selected_area_id');
            const dropdown = document.getElementById('location');
            const button = document.getElementById('contact_location_btn');

            if (label) {
                label.textContent = name;
                label.classList.remove('text-[#4A5560]');
                label.classList.add('text-[#161E2D]');
            }

            if (hiddenInput) {
                hiddenInput.value = id;
            }

            if (button) {
                button.style.borderColor = '';
            }

            // Mark selected option
            dropdown?.querySelectorAll('.hero-dropdown-option').forEach(option => {
                option.classList.remove('text-[#1563DF]', 'bg-[#F5F9FD]');
                option.setAttribute('aria-selected', 'false');
            });

            if (element) {
                element.classList.add('text-[#1563DF]', 'bg-[#F5F9FD]');
                element.setAttribute('aria-selected', 'true');
            }

            // CLOSE DROPDOWN
            if (dropdown) {
                dropdown.classList.remove('opacity-100', 'visible');
                dropdown.classList.add('opacity-0', 'invisible');
            }

            // Update accessibility
            if (button) {
                button.setAttribute('aria-expanded', 'false');
            }
        }
    
