/**
 * الرئيسية: البحث في الهيرو (اقتراحات ، الفلاتر السريعة ، النتايج) — كان جوه resources/views/shary/home/index.blade.php.
 * الكلام واللينكات من window.SharyHomeConf (بيتحط في <head> الصفحة).
 */
        function openRequestMeetingForm() {
            window.togglePopup('zoomMeeting_1_');
        }

        const heroSearchFilters = {
            sale_type: '',
            status: '',
            property_type: [],
            bedrooms: [],
            bathrooms: [],
            delivery_in: '',
            min_price: '',
            max_price: '',
            min_area: '',
            max_area: '',
            down_payment: '',
            monthly_amount: '',
            amenities: [],
            search: ''
        };


        document.querySelectorAll('.property-status').forEach(button => {
            button.addEventListener('click', function () {
                document.querySelectorAll('.property-status').forEach(item => {
                    item.classList.remove('active');
                });

                this.classList.add('active');

                heroSearchFilters.status = this.dataset.value || '';
            });
        });

        function toggleHeroDropdown(id) {

            const dropdown = document.getElementById(id);

            if (!dropdown) {
                return;
            }


            // Close all other dropdowns
            document.querySelectorAll('.hero-dropdown').forEach(item => {

                if (item !== dropdown) {
                    item.classList.remove('show');
                }

            });


            // Close advanced search if open
            document.querySelectorAll('.hero-advanced-search').forEach(item => {

                item.classList.remove('is-open');
                item.classList.remove('show');

            });


            dropdown.classList.toggle('show');
        }

        /* =========================================================
        CLICK OUTSIDE
        ========================================================= */

        document.addEventListener('click', function (event) {

            if (!event.target.closest('.custom-dropdown')) {

                document
                    .querySelectorAll('.hero-dropdown')
                    .forEach(dropdown => {

                        dropdown.classList.remove('show');

                    });

            }

        });

        /* =========================================================
        PROPERTY TYPES
        ========================================================= */

        function updateHeroPropertyTypes() {

            const checked = Array.from(
                document.querySelectorAll(
                    'input[name="hero_property_type[]"]:checked'
                )
            );


            // Store IDs
            heroSearchFilters.property_type = checked.map(
                input => input.value
            );


            // Names for button
            const names = checked.map(
                input => input.dataset.name
            );


            const textElement =
                document.getElementById('heroPropertyTypeText');


            if (!textElement) {
                return;
            }


            if (names.length === 0) {

                textElement.textContent =
                    window.SharyHomeConf.typeLabel;

                return;
            }


            if (names.length === 1) {

                textElement.textContent = names[0];

                return;
            }


            // Example:
            // Apartment, Villa +2
            if (names.length <= 2) {

                textElement.textContent =
                    names.join(', ');

            } else {

                textElement.textContent =
                    `${names[0]}, ${names[1]} +${names.length - 2}`;

            }
        }

        /* =========================================================
        BEDROOMS
        ========================================================= */

        function selectHeroBedroom(value) {

            heroSearchFilters.bedrooms = value;

            // Remove selected state
            document
                .querySelectorAll('#heroBedrooms .hero-beds-section:first-child .hero-number-option')
                .forEach(button => {

                    button.classList.remove('is-selected');

                });


            // Add selected state
            const selectedButton =
                document.querySelector(
                    `#heroBedrooms .hero-beds-section:first-child .hero-number-option[data-value="${value}"]`
                );


            if (selectedButton) {
                selectedButton.classList.add('is-selected');
            }


            updateHeroBedsText();
        }

        function toggleHeroBedroom(value, button) {

            value = String(value);


            const index =
                heroSearchFilters.bedrooms.indexOf(value);


            if (index === -1) {

                // Add
                heroSearchFilters.bedrooms.push(value);

                button.classList.add('is-selected');

            } else {

                // Remove
                heroSearchFilters.bedrooms.splice(index, 1);

                button.classList.remove('is-selected');

            }


            // Keep values ordered
            heroSearchFilters.bedrooms.sort(
                (a, b) => Number(a) - Number(b)
            );


            updateHeroBedsText();
        }

        function toggleHeroBathroom(value, button) {

            value = String(value);


            const index =
                heroSearchFilters.bathrooms.indexOf(value);


            if (index === -1) {

                // Add
                heroSearchFilters.bathrooms.push(value);

                button.classList.add('is-selected');

            } else {

                // Remove
                heroSearchFilters.bathrooms.splice(index, 1);

                button.classList.remove('is-selected');

            }


            // Keep values ordered
            heroSearchFilters.bathrooms.sort(
                (a, b) => Number(a) - Number(b)
            );


            updateHeroBedsText();
        }

        /* =========================================================
        BEDS + BATHS BUTTON TEXT
        ========================================================= */

        function updateHeroBedsText() {

            const textElement =
                document.getElementById('heroBedroomsText');


            if (!textElement) {
                return;
            }


            const bedrooms =
                heroSearchFilters.bedrooms;

            const bathrooms =
                heroSearchFilters.bathrooms;


            /*
            * Nothing selected
            */
            if (
                bedrooms.length === 0 &&
                bathrooms.length === 0
            ) {

                textElement.textContent =
                    window.SharyHomeConf.bedsLabel;

                return;
            }


            /*
            * Format 5 as 5+
            */
            const formatValues = function(values) {

                return values.map(value => {

                    return Number(value) === 5
                        ? '5+'
                        : value;

                }).join(', ');

            };


            const bedroomText =
                bedrooms.length
                    ? `${formatValues(bedrooms)} Bedrooms`
                    : '';


            const bathroomText =
                bathrooms.length
                    ? `${formatValues(bathrooms)} Bathrooms`
                    : '';


            /*
            * Both
            */
            if (
                bedroomText &&
                bathroomText
            ) {

                textElement.textContent =
                    `${bedroomText} - ${bathroomText}`;

                return;
            }


            /*
            * Bedrooms only
            */
            if (bedroomText) {

                textElement.textContent =
                    bedroomText;

                return;
            }


            /*
            * Bathrooms only
            */
            textElement.textContent =
                bathroomText;
        }

        /* =========================================================
        SYNC PRICE INPUTS WITH SLIDER
        ========================================================= */

        function syncHeroPriceInputs() {

            const low = document.getElementById('range_heroPrice_low');
            const high = document.getElementById('range_heroPrice_high');

            const minInput = document.getElementById('heroPriceMinInput');
            const maxInput = document.getElementById('heroPriceMaxInput');

            if (!low || !high) {
                return;
            }

            const lowValue = Number(low.value);
            const highValue = Number(high.value);

            if (minInput) {
                minInput.value = lowValue.toLocaleString('en-US');
            }

            if (maxInput) {
                maxInput.value = highValue.toLocaleString('en-US');
            }
        }


        /* =========================================================
        PRICE RANGE SLIDER
        ========================================================= */

        function updateHeroRange(type) {

            if (type !== 'price') {
                return;
            }

            const low = document.getElementById('range_heroPrice_low');
            const high = document.getElementById('range_heroPrice_high');

            if (!low || !high) {
                return;
            }

            let lowValue = Number(low.value);
            let highValue = Number(high.value);

            /*
            * Prevent minimum from going above maximum
            */
            if (lowValue > highValue) {

                if (document.activeElement === low) {
                    lowValue = highValue;
                    low.value = highValue;
                } else {
                    highValue = lowValue;
                    high.value = lowValue;
                }
            }

            /*
            * Update the text inputs
            */
            syncHeroPriceInputs();

            /*
            * Update filter object if it exists
            */
            if (typeof heroSearchFilters !== 'undefined') {
                heroSearchFilters.min_price = Number(low.value);
                heroSearchFilters.max_price = Number(high.value);
            }

            /*
            * Update slider progress
            */
            updateHeroPriceSlider();
        }

        /* =========================================================
        PRICE SLIDER PROGRESS
        ========================================================= */

        function updateHeroPriceSlider() {

            const low = document.getElementById('range_heroPrice_low');
            const high = document.getElementById('range_heroPrice_high');
            const progress = document.getElementById('heroRangeProgress');

            if (!low || !high || !progress) {
                return;
            }

            const min = Number(low.min);
            const max = Number(low.max);

            const lowValue = Number(low.value);
            const highValue = Number(high.value);

            const range = max - min;

            if (range <= 0) {
                return;
            }

            const left = ((lowValue - min) / range) * 100;
            const right = 100 - ((highValue - min) / range) * 100;

            progress.style.left = `${left}%`;
            progress.style.width = `${100 - left - right}%`;
        }


        /* =========================================================
        PRICE TEXT INPUT
        ========================================================= */

        function updateHeroPriceFromInput(type) {

            const input =
                type === 'min'
                    ? document.getElementById('heroPriceMinInput')
                    : document.getElementById('heroPriceMaxInput');

            const low = document.getElementById('range_heroPrice_low');
            const high = document.getElementById('range_heroPrice_high');

            if (!input || !low || !high) {
                return;
            }

            /*
            * Remove commas and anything except numbers
            */
            let value = input.value.replace(/[^0-9]/g, '');

            if (value === '') {
                return;
            }

            value = Number(value);

            if (type === 'min') {

                value = Math.max(
                    Number(low.min),
                    Math.min(value, Number(high.value))
                );

                low.value = value;

            } else {

                value = Math.min(
                    Number(high.max),
                    Math.max(value, Number(low.value))
                );

                high.value = value;
            }

            /*
            * Synchronize BOTH inputs
            */
            syncHeroPriceInputs();

            /*
            * Update filters
            */
            if (typeof heroSearchFilters !== 'undefined') {
                heroSearchFilters.min_price = Number(low.value);
                heroSearchFilters.max_price = Number(high.value);
            }

            /*
            * Update slider progress
            */
            updateHeroPriceSlider();
        }


        /* =========================================================
        APPLY PRICE
        ========================================================= */

        function applyHeroPrice() {

            const low = document.getElementById('range_heroPrice_low');
            const high = document.getElementById('range_heroPrice_high');

            if (!low || !high) {
                return;
            }

            /*
            * Make sure text inputs are updated
            * BEFORE closing the dropdown.
            */
            syncHeroPriceInputs();

            if (typeof heroSearchFilters !== 'undefined') {
                heroSearchFilters.min_price = Number(low.value);
                heroSearchFilters.max_price = Number(high.value);
            }

            /*
            * Update button text
            */
            const textElement = document.getElementById('heroPriceText');

            if (textElement) {
                textElement.textContent =
                    `${Number(low.value).toLocaleString('en-US')} - ${Number(high.value).toLocaleString('en-US')}`;
            }

            /*
            * Close dropdown
            */
            const dropdown = document.getElementById('heroPrice');

            if (dropdown) {
                dropdown.classList.remove('show');
            }
        }

        /* =========================================================
        INITIALIZE
        ========================================================= */

        document.addEventListener('DOMContentLoaded', function () {

            const low = document.getElementById('range_heroPrice_low');
            const high = document.getElementById('range_heroPrice_high');

            if (low) {
                low.addEventListener('input', function () {
                    updateHeroRange('price');
                });

                low.addEventListener('change', function () {
                    updateHeroRange('price');
                });
            }

            if (high) {
                high.addEventListener('input', function () {
                    updateHeroRange('price');
                });

                high.addEventListener('change', function () {
                    updateHeroRange('price');
                });
            }

            syncHeroPriceInputs();
            updateHeroPriceSlider();
        });

        function selectHeroFilter(filter, value, text, dropdownId, textId) {
            heroSearchFilters[filter] = value;

            const textElement =
                document.getElementById(textId);

            if (textElement) {

                textElement.textContent = text;

            }


            const dropdown =
                document.getElementById(dropdownId);

            if (dropdown) {

                dropdown.classList.remove('show');

            }

        }

        document.addEventListener('click', function (event) {

            if (
                !event.target.closest('.custom-dropdown')
            ) {

                document
                    .querySelectorAll('.hero-dropdown')
                    .forEach(dropdown => {

                        dropdown.classList.remove('show');

                    });

            }

        });

        function toggleHeroAdvancedSearch() {

            const isMobile = window.matchMedia('(max-width: 767px)').matches;

            const desktopPanel = document.getElementById('heroAdvancedSearch');
            const mobilePanel = document.getElementById('filterBar');

            if (isMobile) {

                // Mobile → use filterBar
                if (!mobilePanel) {
                    return;
                }

                mobilePanel.classList.toggle('is-open');

                // Make sure desktop panel is closed
                if (desktopPanel) {
                    desktopPanel.classList.remove('show');
                    desktopPanel.classList.remove('is-open');
                }

            } else {

                // Desktop → use heroAdvancedSearch
                if (!desktopPanel) {
                    return;
                }

                desktopPanel.classList.toggle('show');
                desktopPanel.classList.toggle('is-open');

                // Make sure mobile panel is closed
                if (mobilePanel) {
                    mobilePanel.classList.remove('is-open');
                }
            }
        }

        function toggleSearchDeveloperBar(type) {
            const searchBar = document.getElementById("searchDeveloperBar");
            const searchBarClose = document.getElementById("searchDeveloperBar_close");
            if (type === "open") {
                searchBar.style.height = "100dvh";
                searchBar.style.maxHeight = "100dvh";
                searchBarClose.classList.replace("z-[-1]", "z-[1]");
                document.querySelector("body").style.overflow = "hidden";
            } else {
                searchBar.style.maxHeight = "0px";
                searchBarClose.classList.replace("z-[1]", "z-[-1]");
                document.querySelector("body").style.overflow = "auto";
            }
        }

        /* COLLECT ADVANCED FILTERS */
        function collectHeroAdvancedFilters() {
            const downPayment = document.getElementById('heroDownPayment');

            if (downPayment) {
                heroSearchFilters.down_payment = downPayment.value;
            }

            const monthlyAmount = document.getElementById('heroMonthlyAmount');

            if (monthlyAmount) {
                heroSearchFilters.monthly_amount = monthlyAmount.value;
            }

            const bedrooms = document.getElementById('heroAdvancedBedrooms');

            if (bedrooms) {
                heroSearchFilters.bedrooms = bedrooms.value;
            }

            const bathrooms = document.getElementById('heroAdvancedBathrooms');

            if (bathrooms) {
                heroSearchFilters.bathrooms = bathrooms.value;
            }

            const delivery = document.getElementById('heroAdvancedDelivery');

            if (delivery) {
                heroSearchFilters.delivery_in = delivery.value;
            }

            heroSearchFilters.amenities = Array.from(
                document.querySelectorAll('input[name="hero_amenities[]"]:checked')
            ).map(input => input.value);
        }

        function submitHomeSearch() {
            const searchInput = document.getElementById('heroSearchInput');

            heroSearchFilters.search = searchInput ? searchInput.value.trim() : '';

            const params = new URLSearchParams();

            Object.entries(heroSearchFilters).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(item => {
                        if (item !== '') {
                            params.append(
                                `${key}[]`,
                                item
                            );
                        }
                    });
                    return;
                }

                if (value !== '' && value !== null && value !== undefined) {
                    params.set(key, value);
                }
            });

            window.location.href = sharyHomeSearchUrl(params);
        }

        function resetMobileFilterControls(container) {
            if (!container) return;

            container.querySelectorAll('input, select, textarea').forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else if (input.type === 'radio') {
                    input.checked = input.defaultChecked;
                } else if (input.type === 'range') {
                    input.value = input.id.endsWith('_high')
                        ? input.max
                        : input.min;
                } else if (input.tagName === 'SELECT') {
                    input.value = '';
                } else if (!['button', 'submit'].includes(input.type)) {
                    input.value = '';
                }
            });

            // Refresh slider labels and track styling.
            container.querySelectorAll('.range-slider[id]').forEach(slider => {
                const match = slider.id.match(/^range_(.+)_slider$/);

                if (match && typeof updateRangeSlider === 'function') {
                    updateRangeSlider(match[1]);
                }
            });
        }

        function resetMobileFilterSection(section) {
            if (!section) return;

            resetMobileFilterControls(section);

            const keys = (section.dataset.filterSection || '')
                .split(',')
                .filter(Boolean);

            // Clear state after updating sliders, because their update function
            // might write the default range back into the filters.
            keys.forEach(key => {
                heroSearchFilters[key] =
                    Array.isArray(heroSearchFilters[key]) ? [] : '';
            });

            if (keys.includes('location') || keys.includes('developer')) {
                resetMobileAreaAndDeveloper();
            }
        }
        
        function resetMobileAreaAndDeveloper() {
            const addLabel = window.SharyHomeConf.addLabel;

            // Reuse the same selection functions used by your area/developer lists.
            if (typeof selectHomeArea === 'function') {
                selectHomeArea('', addLabel);
            }

            if (typeof selectHomeDeveloper === 'function') {
                selectHomeDeveloper('', addLabel);
            }

            heroSearchFilters.location = '';
            heroSearchFilters.developer = '';

            const panel = document.getElementById('filterBar');

            if (panel) {
                panel.querySelectorAll(
                    '[onclick="toggleSearchBar(\'open\')"],' +
                    '[onclick="toggleSearchDeveloperBar(\'open\')"]'
                ).forEach(button => {
                    button.textContent = addLabel;
                });
            }
        }

        function resetMobileFilters() {
            const panel = document.getElementById('filterBar');

            if (!panel) return;

            resetMobileFilterControls(panel);
            resetMobileAreaAndDeveloper();

            Object.keys(heroSearchFilters).forEach(key => {
                heroSearchFilters[key] =
                    Array.isArray(heroSearchFilters[key]) ? [] : '';
            });

            // Restore the default selected radio in your HTML.
            const developerUnits = panel.querySelector('#developerUnits');

            if (developerUnits) {
                developerUnits.checked = true;
                developerUnits.dispatchEvent(
                    new Event('change', { bubbles: true })
                );
            }
        }

        function normalizeMobileSearch(value) {
            return String(value || '')
                .normalize('NFKC')
                .toLowerCase()
                .replace(/[أإآٱ]/g, 'ا')
                .replace(/ى/g, 'ي')
                .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        }

        /* MOBILE FILTER BUTTON */
        const openFiltersButton = document.getElementById('openFilters');

        if (openFiltersButton) {
            openFiltersButton.addEventListener('click', function () {
                if (document.querySelector('[data-home-filter]')) return;   // بيفتحها js/shary/filter-window.js
                toggleHeroAdvancedSearch();
            });
        }

        window.initSharySwiper(".home-mobile-swiper", {
            loop: true,
            pagination: {
                el: ".home-mobile-swiper .swiper-pagination",
                clickable: true,
                renderBullet: function (index, className) {
                    return '<span class="' + className + ' home-mobile-dot" aria-label="Go to slide ' + (index + 1) + '"></span>';
                },
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
        });

        function selectDeveloperItem(element) {
            // Remove selected state from all developers
            document.querySelectorAll('.developer-item').forEach(item => {
                item.classList.remove('selected');
            });

            // Add selected state to clicked developer
            element.classList.add('selected');
        }

        function selectArea(element) {
            document.querySelectorAll('.area-item').forEach(item => {
                item.classList.remove('selected');
            });

            element.classList.add('selected');
        }

        // Close the share menu if clicking outside
        document.addEventListener("click", () => {
            document.querySelectorAll(".share-menu").forEach((menu) => {
                menu.classList.add("invisible", "opacity-0");
            });
        });

        /* ELEMENTS */
        let heroSearchTimer = null;
        let heroSearchRequest = null;
        let heroSearchResultsData = [];
        let heroSearchPage = 1;
        let heroSearchHasMore = false;
        let heroSearchLoading = false;
        let heroSearchCurrentQuery = '';

        const heroSearchInput = document.getElementById('heroSearchInput');
        const heroSearchResults = document.getElementById('heroSearchResults');

        if (heroSearchInput) {
            heroSearchInput.addEventListener('input', function () {

                const search = this.value.trim();

                // Cancel previous debounce timer
                clearTimeout(heroSearchTimer);

                // Cancel previous request
                if (heroSearchRequest) {
                    heroSearchRequest.abort();
                    heroSearchRequest = null;
                }

                // Clear results if input is empty
                if (search.length === 0) {
                    hideHeroSearchResults();
                    return;
                }

                // Don't search for only one character
                if (search.length < 2) {
                    hideHeroSearchResults();
                    return;
                }

                heroSearchTimer = setTimeout(function () {

                    heroSearchPage = 1;
                    heroSearchHasMore = false;
                    heroSearchCurrentQuery = search;
                    heroSearchResultsData = [];

                    searchHeroProjects(search, 1, true);

                }, 300);

            });

            heroSearchInput.addEventListener('focus', function () {

                if (
                    heroSearchResultsData.length > 0 &&
                    this.value.trim().length >= 2
                ) {

                    heroSearchResults.classList.add('show');

                }

            });

            heroSearchInput.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') {

                    hideHeroSearchResults();

                }
            });

        }

        async function searchHeroProjects(search, page = 1, reset = false) {

            if (!heroSearchResults) {
                return;
            }

            // Don't send another request while one is loading
            if (heroSearchLoading) {
                return;
            }

            heroSearchLoading = true;

            if (reset) {

                heroSearchResults.innerHTML = `
                    <div class="hero-search-loading">
                        جاري البحث...
                    </div>
                `;

                heroSearchResults.classList.add('show');

            } else {

                // Loading indicator at bottom
                removeHeroSearchLoading();

                heroSearchResults.insertAdjacentHTML(
                    'beforeend',
                    `
                        <div class="hero-search-loading hero-search-loading-more">
                            جاري تحميل المزيد...
                        </div>
                    `
                );
            }

            // Create request controller
            heroSearchRequest = new AbortController();

            try {

                const url = `${window.SharyHomeConf.suggestUrl}?q=${encodeURIComponent(search)}&page=${page}`;


                const response = await fetch(url, {
                    method: 'GET',
                    signal: heroSearchRequest.signal,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Search request failed: ${response.status}`);
                }

                const data = await response.json();
                const results = Array.isArray(data.data) ? data.data : [];

                const pagination = data.pagination || {};

                heroSearchHasMore = pagination.has_more === true;
                heroSearchPage = pagination.current_page || page;

                if (reset) {
                    heroSearchResultsData = results;
                } else {
                    heroSearchResultsData = heroSearchResultsData.concat(results);
                }

                renderHeroSearchResults(heroSearchResultsData, reset);
            } catch (error) {
                // Ignore cancelled requests
                if (error.name === 'AbortError') {
                    return;
                }
                console.error('Hero search error:', error);

                if (reset) {
                    heroSearchResults.innerHTML = `
                        <div class="hero-search-empty">
                            حدث خطأ أثناء البحث
                        </div>
                    `;

                    heroSearchResults.classList.add('show');
                }
            } finally {
                removeHeroSearchLoading();
                heroSearchRequest = null;
                heroSearchLoading = false;
            }
        }

        function renderHeroSearchResults(results, reset = true) {

            if (!heroSearchResults) {
                return;
            }


            /* -----------------------------------------------------
            * NO RESULTS
            * ----------------------------------------------------- */

            if (!results.length) {

                heroSearchResults.innerHTML = `
                    <div class="hero-search-empty">
                        ${window.SharyHomeConf.noResults}
                    </div>
                `;

                heroSearchResults.classList.add('show');

                return;
            }


            /* -----------------------------------------------------
            * RESULTS HTML
            * ----------------------------------------------------- */

            let html = '';

            results.forEach(function (item) {
                let base = window.SharyHomeConf.base;
                let route = '';

                if (item.type === 'area') {

                    route = `${base}/area/${item.id}`;

                } else if (item.type === 'developer') {

                    route = `${base}/developer-details/${item.id}`;

                } else if (item.type === 'project') {

                    route = `${base}/project/${item.area_id}/${item.id}`;
                }
                
                html += `
                    <button
                        type="button"
                        class="hero-search-result"
                        data-result-id="${item.id}"
                        data-result-type="${item.type}"
                        onclick="window.location.href='${item.url || route}'"
                    >
                        <div class="hero-search-result-icon">
                            <img
                                src="${item.image}"
                                alt=""
                                class="w-[38px] h-[38px] rounded-full"
                            >
                        </div>


                        <div class="hero-search-result-content">
                            <div class="hero-search-result-title">
                                ${escapeHeroSearchHtml(item.name)}
                            </div>

                            <div class="hero-search-result-location">
                                ${escapeHeroSearchHtml(item.location ?? '')}
                            </div>

                        </div>

                    </button>
                `;
            });

            heroSearchResults.innerHTML = html;
            heroSearchResults.classList.add('show');


            /* -----------------------------------------------------
            * CLICK EVENTS
            * ----------------------------------------------------- */

            const resultButtons = heroSearchResults.querySelectorAll('.hero-search-result');

            resultButtons.forEach(function (button) {
                button.addEventListener('click', function () {
                    const id = this.dataset.resultId;
                    selectHeroSearchResult(id);
                });
            });
        }

        function selectHeroSearchResult(id) {

            const item =
                heroSearchResultsData.find(function (result) {

                    return String(result.id) === String(id);

                });


            if (!item) {
                return;
            }


            /* Put selected name inside input */

            heroSearchInput.value = item.name;


            /* Hide list */

            hideHeroSearchResults();


        }

        heroSearchResults.addEventListener('scroll', function () {
            // Already loading
            if (heroSearchLoading) {
                return;
            }

            // No more pages
            if (!heroSearchHasMore) {
                return;
            }

            const scrollPosition = this.scrollTop + this.clientHeight;

            const scrollHeight = this.scrollHeight;

            // Start loading when 100px from bottom
            if (scrollPosition >= scrollHeight - 100) {

                const nextPage = heroSearchPage + 1;

                searchHeroProjects(heroSearchCurrentQuery, nextPage, false);
            }
        });

        function hideHeroSearchResults() {

            if (!heroSearchResults) {
                return;
            }

            heroSearchResults.classList.remove('show');

        }

        function removeHeroSearchLoading() {

            const loading =
                heroSearchResults.querySelector(
                    '.hero-search-loading-more'
                );

            if (loading) {
                loading.remove();
            }

        }

        document.addEventListener('click', function (event) {

            const wrapper =
                event.target.closest(
                    '.search-autocomplete-wrapper'
                );


            if (!wrapper) {

                hideHeroSearchResults();

            }

        });

        function escapeHeroSearchHtml(value) {

            return String(value ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');

        }

        const searchInput = document.getElementById("searchInput");
        const items = document.querySelectorAll(".search-item");

    
