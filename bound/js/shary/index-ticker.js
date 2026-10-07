/**
 * حركة شريط مؤشر شاري (partials/index-ticker) — نفس سكربت شريط الرئيسية بالظبط (home/index.blade.php):
 * المجموعة بتتكرر لحد ما تملى العرض ، السرعة 35px في الثانية ، والاتجاه حسب لغة الصفحة (dir على ‎.market-ticker-section).
 */
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
