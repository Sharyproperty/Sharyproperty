{{--
    فلاتر صفحة نتايج البحث — فورم GET على نفس الصفحة (id="search-filters").

    موبايل:
      - صف ثابت تحت الهيدر: خانة البحث (q) + زرار الفلتر (بيفتح صفحة "تصفية" الكاملة وعليه عدد الاختيارات).
      - الفلاتر السريعة: نوع العقار ، الغرف والحمامات ، السعر ، التشطيب ، التسليم + الترتيب. كل واحد بيفتح لوحة من تحت فيها نفس القسم بتاع صفحة "تصفية".
    ديسك توب:
      - صفحة "تصفية" نفسها بتبقى عمود ثابت على جنب النتايج (كل الفلاتر المتقدمة مفتوحة)، وأي تغيير بيتبعت لوحده (data-filter-sidebar).
      - العمود بسيط: عنوان القسم وجنبه "مسح"، ونوع العقار / التشطيب / التسليم / المرافق قوايم بمربعات اختيار (الشكل من الـ CSS، نفس الحقول).
      - المنطقة والمطور: أول 3 اختيارات في العمود، و"عرض المزيد" بيفتح نافذة فيها خانة بحث والقايمة كلها وزرار "إضافة" (على الموبايل زرار "إضافة" بيفتح لوحة الاختيار من تحت).
      - آخر العمود: زرار "مسح كل الفلاتر" ثابت.
      - فوق بعرض الصفحة كلها: خانة البحث ، الترتيب ، عرض الخريطة ، زرار التحويل بين الوحدات والكمبوندات — وتحتهم العنوان والعدد، وبعدين عمود الفلاتر والنتايج جنب بعض.

    الحقول اللي بتتبعت: q + نفس حقول فلاتر صفحة المنطقة (areas/partials/filters.blade.php):
        offer ، furnished ، type[] ، area[] ، developer[] ، project[] ، bedrooms[] ، bathrooms[] ، finishing[] ، delivery[] ، price_min ، price_max ،
        size_min ، size_max ، down_payment ، monthly_installment ، years[] ، amenities[] ، sort
    المتغيرات: $search ، $mode (units | compounds) ، $count ، $area['filters'] (نفس شكل فلاتر المنطقة) ، $selected (الاختيارات الحالية).
    السكربت: js/shary/area-page.js — قبل الإرسال بيطلع حدث shary:filter (ممكن تمنعوه وتجيبوا النتايج AJAX).
--}}
<form action="{{ $canonical ?? '' }}" method="GET" id="search-filters" data-area-filters data-filter-sidebar>
    @if ($mode === 'compounds')
        <input type="hidden" name="view" value="compounds">
    @endif

    <div class="search-head">
        {{-- خانة البحث + زرار الفلتر (موبايل: ثابتين تحت الهيدر) --}}
        <div class="search-bar">
            <label class="search-input">
                <svg class="shrink-0 text-shary-hint" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>
                <span class="sr-only">{{ __('search.search') }}</span>
                <input type="search" name="q" value="{{ $selected['q'] ?? '' }}" placeholder="{{ __('search.search_placeholder') }}" autocomplete="off" enterkeyhint="search"
                    data-kind-area="{{ __('search.kind_area') }}" data-kind-developer="{{ __('search.kind_developer') }}" data-kind-project="{{ __('search.kind_project') }}" data-suggest-label="{{ __('search.suggestions') }}">
            </label>
            <button type="button" class="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-shary-line bg-white text-shary-navy transition-colors hover:border-shary-link hover:text-shary-link lg:hidden" data-sheet-open="all" aria-haspopup="dialog" aria-expanded="false" aria-label="{{ __('areas.filter_title') }}">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg>
                <span class="area-filter__count absolute -end-1 -top-1" data-sheet-count="all"></span>
            </button>
        </div>

        <div class="search-quick">
            {{-- موبايل: الفلاتر السريعة (بتتسحب بالجنب) --}}
            <div class="shary-scroll -ms-5 flex min-w-0 flex-1 gap-2 overflow-x-auto ps-5 lg:hidden">
                @foreach ([['type', __('search.type')], ['bedrooms bathrooms', __('search.beds_baths')], ['price', __('search.price')], ['finishing', __('search.finishing')], ['delivery', __('search.delivery')]] as $chip)
                    <button type="button" class="search-chip" aria-haspopup="dialog" aria-expanded="false"
                        @if ($chip[0] === 'price') data-sheet-open="price" @else data-sheet-open="section" data-sections="{{ $chip[0] }}" @endif>
                        <span>{{ $chip[1] }}</span>
                        <span class="area-filter__count" data-sheet-count="{{ $chip[0] === 'price' ? 'price' : 'sec:' . $chip[0] }}"></span>
                    </button>
                @endforeach
            </div>

            {{-- ديسك توب: عرض الخريطة + زرار التحويل بين الوحدات والكمبوندات (في الصفحة نفسها فوق، جنب خانة البحث والترتيب) --}}
            <div class="search-tools hidden items-center gap-2.5 lg:flex">
                <a href="{{ $search['mapUrl'] }}" class="search-tool">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4ZM9 4v14M15 6v14"/></svg>
                    <span>{{ __('search.map_view') }}</span>
                </a>
                <a href="{{ $mode === 'compounds' ? $search['unitsUrl'] : $search['compoundsUrl'] }}" class="search-tool" data-mode-switch>
                    <span>{{ $mode === 'compounds' ? __('search.to_units') : __('search.to_compounds') }}</span>
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8.5h15M15.5 5l3.5 3.5-3.5 3.5M20 15.5H5M8.5 12 5 15.5 8.5 19"/></svg>
                </a>
            </div>

            {{-- الترتيب: قايمة تحت الزرار، اختيار واحد --}}
            <div class="search-sort relative shrink-0 border-s border-shary-line ps-2 lg:border-s-0 lg:ps-0">
                <button type="button" class="flex h-10 items-center gap-1.5 rounded-xl px-2 text-[14px] font-bold leading-normal text-shary-navy transition-colors hover:text-shary-link lg:h-12 lg:border lg:border-shary-line lg:bg-white lg:px-4 lg:hover:border-shary-link" data-sort-open aria-haspopup="true" aria-expanded="false">
                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 5v14M8 19l-3-3M8 19l3-3M16 19V5M16 5l-3 3M16 5l3 3"/></svg>
                    <span>{{ __('search.sort') }}</span>
                </button>
                <div class="absolute end-0 top-full z-30 mt-2 hidden w-[230px] rounded-2xl border border-shary-line bg-white px-4 py-1.5 shadow-[0_14px_34px_-14px_rgba(18,58,92,0.45)]" data-sort-menu>
                    @foreach ($area['filters']['sorts'] as $sort)
                        <label class="flex min-h-[46px] cursor-pointer items-center gap-3 text-[15px] font-semibold leading-normal text-shary-navy hover:text-shary-link">
                            <input type="radio" name="sort" value="{{ $sort['value'] }}" class="h-[18px] w-[18px] shrink-0 cursor-pointer accent-shary-link" {{ ($selected['sort'] ?? '') === $sort['value'] ? 'checked' : '' }}>
                            <span>{{ $sort['label'] }}</span>
                        </label>
                    @endforeach
                </div>
            </div>
        </div>

        <div class="search-title">
            <h1 class="text-[21px] font-bold leading-[1.35] lg:text-[26px]">{{ $h1 ?? $search['h1'] }}</h1>
            <p class="text-[13px] font-medium leading-normal text-shary-muted lg:text-[14px]"><bdi data-results-count>{{ number_format($count) }}</bdi> {{ $mode === 'compounds' ? __('search.compounds') : __('search.units') }}</p>
        </div>

        {{-- المناطق الفرعية: كل لينك بيفتح نفس صفحة البحث على المنطقة دي (العنوان والعدد والفلتر بيتغيروا). المنطقة المفتوحة: 'current' => true --}}
        @if (!empty($search['subAreas']))
            <div class="search-subs shary-scroll -mx-5 flex gap-4 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:gap-x-5 lg:gap-y-1.5 lg:overflow-visible lg:px-0">
                @foreach ($search['subAreas'] as $sub)
                    @if (!empty($sub['current']))
                        <span class="shrink-0 whitespace-nowrap rounded-full bg-shary-link px-3 py-0.5 text-[14px] font-bold leading-normal text-white lg:text-[15px]" aria-current="page">{{ $sub['label'] }}</span>
                    @else
                        <a href="{{ $sub['url'] }}" class="shrink-0 whitespace-nowrap text-[14px] font-semibold leading-normal text-shary-link underline underline-offset-4 hover:text-shary-action lg:text-[15px]">{{ $sub['label'] }}</a>
                    @endif
                @endforeach
            </div>
        @endif

        {{-- بيظهر لما يكون فيه فلاتر مختارة بس (السكربت بيظهره ويخفيه مع الاختيارات) --}}
        <div class="search-notice {{ empty($selected) ? 'hidden' : '' }} flex items-center justify-between gap-3 rounded-xl bg-[#eaf2fd] px-3.5 py-2.5 text-[13px] font-medium leading-normal text-shary-navy lg:px-4 lg:text-[14px]" data-filter-notice>
            <span>{{ __('search.notice') }}</span>
            <button type="button" class="shrink-0 font-bold text-shary-link underline underline-offset-4 hover:text-shary-action" data-filter-clear-all>{{ __('search.clear_filter') }}</button>
        </div>
    </div>

    {{-- قيم السعر والمساحة (الشريط بيكتب فيها) --}}
    <input type="hidden" name="price_min" value="{{ $selected['price_min'] ?? '' }}" data-range-min="price">
    <input type="hidden" name="price_max" value="{{ $selected['price_max'] ?? '' }}" data-range-max="price">
    <input type="hidden" name="size_min" value="{{ $selected['size_min'] ?? '' }}" data-range-min="size">
    <input type="hidden" name="size_max" value="{{ $selected['size_max'] ?? '' }}" data-range-max="size">

    {{-- ====== كل الفلاتر: موبايل صفحة بتطلع من تحت — ديسك توب عمود ثابت جنب النتايج ====== --}}
    <div class="search-side fixed inset-0 z-50 hidden" data-filter-sheet="all" aria-label="{{ __('areas.filter_title') }}">
        <div class="area-sheet absolute inset-0 flex flex-col bg-[#fafafa]">
            {{-- موبايل: سهم الرجوع + العنوان --}}
            <div class="relative flex h-16 shrink-0 items-center justify-center px-5 lg:hidden">
                <button type="button" class="absolute start-3 flex h-11 w-11 items-center justify-center rounded-full text-shary-navy hover:text-shary-link" data-sheet-close aria-label="{{ __('blog.close') }}">
                    <svg class="ltr:rotate-180" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </button>
                <h3 class="flex items-center gap-2.5 text-[20px] font-bold leading-normal">
                    <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-shary-link text-white" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg>
                    </span>
                    {{ __('areas.filter_title') }}
                </h3>
            </div>
            <div class="search-side__scroll shary-scroll min-h-0 flex-1 overflow-y-auto">
            <div class="search-side__list px-5 pb-6 lg:p-0">
                {{-- وحدات المطور / إعادة البيع / للإيجار --}}
                <div class="area-tabs">
                    @foreach ($area['filters']['offers'] as $offer)
                        <label class="cursor-pointer">
                            <input type="radio" name="offer" value="{{ $offer['value'] }}" class="sr-only" {{ ($selected['offer'] ?? $area['filters']['offers'][0]['value']) === $offer['value'] ? 'checked' : '' }}>
                            <span>{{ $offer['label'] }}</span>
                        </label>
                    @endforeach
                </div>

                {{-- مفروش / غير مفروش: مع "للإيجار" بس --}}
                <div class="area-toggle mt-3" data-modes="rent">
                    @foreach ($area['filters']['furnished'] as $option)
                        <label class="cursor-pointer">
                            <input type="radio" name="furnished" value="{{ $option['value'] }}" class="sr-only" data-toggle-off {{ ($selected['furnished'] ?? '') === $option['value'] ? 'checked' : '' }}>
                            <span>{{ $option['label'] }}</span>
                        </label>
                    @endforeach
                </div>

                {{-- ديسك توب: الترتيب في العمود بيتظبط من الـ CSS (المنطقة، المطور، نوع البيع، الغرف، الحمامات، نوع العقار، التشطيب، السعر، خطة الدفع، سنوات التقسيط، التسليم، المساحة، المرافق) --}}
                <div class="lg:contents">
                {{-- ديسك توب: المنطقة والمطور والمشروع كل واحد قسم لوحده — أول 3 اختيارات، والعنوان أو "عرض المزيد" بيفتح النافذة (القايمة بتتنقل هنا من لوحة الاختيار) --}}
                <section class="area-fsec hidden lg:block" data-filter-section data-key="area-list">
                    <div class="mb-4 flex items-start justify-between gap-3">
                        {{-- الضغط على العنوان بيفتح النافذة: اللوجو / الصورة + الاسم + مربع الاختيار --}}
                        <button type="button" class="search-list__title" data-sheet-open="area" aria-haspopup="dialog" aria-expanded="false">
                            <h4>{{ __('areas.f_area') }}</h4>
                            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <button type="button" class="text-[14px] font-medium leading-normal text-shary-link hover:underline" data-filter-clear>{{ __('areas.clear') }}</button>
                    </div>
                    <div class="search-list" data-inline-list="area"></div>
                    <button type="button" class="search-list__more" data-list-more data-sheet-open="area" aria-haspopup="dialog" aria-expanded="false">{{ __('search.see_more') }}</button>
                </section>
                <section class="area-fsec hidden lg:block" data-filter-section data-key="developer-list">
                    <div class="mb-4 flex items-start justify-between gap-3">
                        {{-- الضغط على العنوان بيفتح النافذة: اللوجو / الصورة + الاسم + مربع الاختيار --}}
                        <button type="button" class="search-list__title" data-sheet-open="developer" aria-haspopup="dialog" aria-expanded="false">
                            <h4>{{ __('areas.developer') }}</h4>
                            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <button type="button" class="text-[14px] font-medium leading-normal text-shary-link hover:underline" data-filter-clear>{{ __('areas.clear') }}</button>
                    </div>
                    <div class="search-list" data-inline-list="developer"></div>
                    <button type="button" class="search-list__more" data-list-more data-sheet-open="developer" aria-haspopup="dialog" aria-expanded="false">{{ __('search.see_more') }}</button>
                </section>
                <section class="area-fsec hidden lg:block" data-filter-section data-key="project-list">
                    <div class="mb-4 flex items-start justify-between gap-3">
                        {{-- الضغط على العنوان بيفتح النافذة: اللوجو / الصورة + الاسم + مربع الاختيار --}}
                        <button type="button" class="search-list__title" data-sheet-open="project" aria-haspopup="dialog" aria-expanded="false">
                            <h4>{{ __('areas.project_filter') }}</h4>
                            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <button type="button" class="text-[14px] font-medium leading-normal text-shary-link hover:underline" data-filter-clear>{{ __('areas.clear') }}</button>
                    </div>
                    <div class="search-list" data-inline-list="project"></div>
                    <button type="button" class="search-list__more" data-list-more data-sheet-open="project" aria-haspopup="dialog" aria-expanded="false">{{ __('search.see_more') }}</button>
                </section>
                <section class="area-fsec" data-filter-section data-key="type">
                    @include('areas.partials.filter-head', ['title' => __('areas.f_type'), 'icon' => '<path d="M4 21V6l8-3v18M12 9l8 2v10M4 21h16M7.5 9v.01M7.5 12.5v.01M7.5 16v.01M15.5 13.5v.01M15.5 17v.01"/>'])
                    @include('areas.partials.filter-chips', ['name' => 'type', 'options' => $area['filters']['types'], 'chosen' => array_map('strval', (array) ($selected['type'] ?? []))])
                </section>

{{-- المنطقة والمطور: كل زرار بيفتح لوحة الاختيار --}}
                <section class="area-fsec lg:hidden" data-filter-section data-key="areadev" data-clears="area developer project">
                    @include('areas.partials.filter-head', ['title' => __('areas.f_area_developer'), 'icon' => '<path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>'])
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <p class="mb-2 text-[15px] font-medium leading-normal text-shary-navy">{{ __('areas.f_area') }}</p>
                            <button type="button" class="area-add" data-sheet-open="area" aria-haspopup="dialog" aria-expanded="false">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2Z"/></svg>
                                <span>{{ __('areas.add') }}</span>
                                <span class="area-filter__count" data-sheet-count="area"></span>
                            </button>
                        </div>
                        @if (!empty($area['filters']['developers']))
                        <div>
                            <p class="mb-2 text-[15px] font-medium leading-normal text-shary-navy">{{ __('areas.developer') }}</p>
                            <button type="button" class="area-add" data-sheet-open="developer" aria-haspopup="dialog" aria-expanded="false">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2Z"/></svg>
                                <span>{{ __('areas.add') }}</span>
                                <span class="area-filter__count" data-sheet-count="developer"></span>
                            </button>
                        </div>
                        @endif
                        @if (!empty($area['filters']['projects']))
                        <div>
                            <p class="mb-2 text-[15px] font-medium leading-normal text-shary-navy">{{ __('areas.project_filter') }}</p>
                            <button type="button" class="area-add" data-sheet-open="project" aria-haspopup="dialog" aria-expanded="false">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2Z"/></svg>
                                <span>{{ __('areas.add') }}</span>
                                <span class="area-filter__count" data-sheet-count="project"></span>
                            </button>
                        </div>
                        @endif
                    </div>
                </section>

                <section class="area-fsec" data-filter-section data-key="bedrooms">
                    @include('areas.partials.filter-head', ['title' => __('areas.f_bedrooms'), 'icon' => '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 15h18M6 10V7.5A1.5 1.5 0 0 1 7.5 6h9A1.5 1.5 0 0 1 18 7.5V10"/>'])
                    @include('areas.partials.filter-chips', ['name' => 'bedrooms', 'options' => $area['filters']['bedrooms'], 'box' => true, 'chosen' => array_map('strval', (array) ($selected['bedrooms'] ?? []))])
                </section>

                <section class="area-fsec" data-filter-section data-key="bathrooms">
                    @include('areas.partials.filter-head', ['title' => __('areas.f_bathrooms'), 'icon' => '<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM6 12V6.5A2.5 2.5 0 0 1 8.5 4c1.1 0 2 .7 2.3 1.7M7 19l-1 2M17 19l1 2"/>'])
                    @include('areas.partials.filter-chips', ['name' => 'bathrooms', 'options' => $area['filters']['bathrooms'], 'box' => true, 'chosen' => array_map('strval', (array) ($selected['bathrooms'] ?? []))])
                </section>

                <section class="area-fsec" data-filter-section data-key="finishing" data-modes="{{ implode(' ', $area['filters']['sections']['finishing'] ?? []) }}">
                    @include('areas.partials.filter-head', ['title' => __('areas.f_finishing'), 'icon' => '<path d="M14.5 4.5l5 5L9 20H4v-5L14.5 4.5ZM12 7l5 5"/>'])
                    @include('areas.partials.filter-chips', ['name' => 'finishing', 'options' => $area['filters']['finishing'], 'chosen' => array_map('strval', (array) ($selected['finishing'] ?? []))])
                </section>

                <section class="area-fsec" data-filter-section data-key="delivery" data-modes="{{ implode(' ', $area['filters']['sections']['delivery'] ?? []) }}">
                    @include('areas.partials.filter-head', ['title' => __('areas.f_delivery'), 'icon' => '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M4 10h16M9 14.5l2 2 4-4"/>'])
                    @include('areas.partials.filter-chips', ['name' => 'delivery', 'options' => $area['filters']['delivery'], 'chosen' => array_map('strval', (array) ($selected['delivery'] ?? []))])
                </section>

                <section class="area-fsec" data-filter-section data-key="price">
                    @include('areas.partials.filter-head', ['title' => __('areas.f_price_range'), 'icon' => '<rect x="3" y="6" width="18" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.5"/>'])
                    @include('areas.partials.filter-range', ['name' => 'price', 'range' => $area['filters']['price'], 'unit' => __('areas.currency'), 'scale' => 'log'])
                </section>

                <section class="area-fsec" data-filter-section data-key="size">
                    @include('areas.partials.filter-head', ['title' => __('areas.f_size'), 'icon' => '<path d="M4 20V5l15 15H4ZM8 20v-5.5h5.5"/>'])
                    @include('areas.partials.filter-range', ['name' => 'size', 'range' => $area['filters']['size'], 'unit' => __('areas.f_size_unit'), 'scale' => 'linear'])
                </section>

                <section class="area-fsec" data-filter-section data-key="payment" data-modes="{{ implode(' ', $area['filters']['sections']['payment'] ?? []) }}">
                    @include('areas.partials.filter-head', ['title' => __('areas.f_payment'), 'icon' => '<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v4M4 7.5V17a2 2 0 0 0 2 2h14V9H6.5A2.5 2.5 0 0 1 4 7.5ZM16 14h.01"/>'])
                    <div class="grid grid-cols-2 gap-3">
                        <label class="area-field">
                            <span class="sr-only">{{ __('areas.f_down_payment') }}</span>
                            <input type="text" inputmode="numeric" autocomplete="off" name="down_payment" value="{{ $selected['down_payment'] ?? '' }}" placeholder="{{ __('areas.f_down_payment') }}" data-number>
                        </label>
                        <label class="area-field">
                            <span class="sr-only">{{ __('areas.f_monthly') }}</span>
                            <input type="text" inputmode="numeric" autocomplete="off" name="monthly_installment" value="{{ $selected['monthly_installment'] ?? '' }}" placeholder="{{ __('areas.f_monthly') }}" data-number>
                        </label>
                    </div>
                </section>

                <section class="area-fsec" data-filter-section data-key="years" data-modes="{{ implode(' ', $area['filters']['sections']['years'] ?? []) }}">
                    @include('areas.partials.filter-head', ['title' => __('areas.f_years'), 'icon' => '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M4 10h16M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>'])
                    @include('areas.partials.filter-chips', ['name' => 'years', 'options' => $area['filters']['years'], 'box' => true, 'chosen' => array_map('strval', (array) ($selected['years'] ?? []))])
                </section>

                </div>

                <section class="area-fsec" data-filter-section data-key="amenities">
                    @include('areas.partials.filter-head', ['title' => __('areas.f_amenities'), 'icon' => '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" fill="currentColor"/>'])
                    <div class="grid grid-cols-2 gap-x-4 gap-y-1 lg:grid-cols-1">
                        @foreach ($area['filters']['amenities'] as $amenity)
                            <label class="flex min-h-[44px] cursor-pointer items-center gap-3 text-[14.5px] font-medium leading-normal text-shary-navy lg:text-[15px]">
                                <input type="checkbox" name="amenities[]" value="{{ $amenity['value'] }}" class="h-5 w-5 shrink-0 cursor-pointer accent-shary-link" {{ in_array((string) $amenity['value'], array_map('strval', (array) ($selected['amenities'] ?? []))) ? 'checked' : '' }}>
                                <span>{{ $amenity['label'] }}</span>
                            </label>
                        @endforeach
                    </div>
                </section>
            </div>
            </div>

            {{-- ديسك توب: زرار "مسح كل الفلاتر" ثابت في آخر العمود --}}
            <div class="search-side__reset hidden lg:flex">
                <button type="button" data-filter-clear-all>{{ __('search.reset_all') }}</button>
            </div>

            {{-- موبايل: "عرض النتائج" و "مسح" --}}
            <div class="flex shrink-0 gap-3 rounded-t-[26px] bg-white px-5 pb-5 pt-4 shadow-[0_-8px_24px_-14px_rgba(18,58,92,0.35)] lg:hidden">
                <button type="button" class="flex h-14 flex-[2] items-center justify-center rounded-full bg-shary-link text-[17px] font-bold leading-normal text-white transition-colors hover:bg-shary-action" data-sheet-apply>{{ __('areas.show_results') }}</button>
                <button type="button" class="flex h-14 flex-1 items-center justify-center rounded-full bg-shary-form text-[17px] font-bold leading-normal text-shary-navy transition-colors hover:bg-shary-cloud" data-filter-clear-all>{{ __('areas.clear') }}</button>
            </div>
        </div>
    </div>

    {{-- ====== لوحة الفلتر السريع (موبايل): القسم المطلوب بيتنقل هنا وبيرجع مكانه بعد القفل ====== --}}
    <div class="fixed inset-0 z-[60] hidden" data-filter-sheet="section" role="dialog" aria-modal="true" aria-label="{{ __('areas.filter_title') }}">
        <div class="absolute inset-0 bg-shary-navy/60" data-sheet-close></div>
        <div class="area-sheet absolute inset-x-0 bottom-0 flex max-h-[86vh] flex-col rounded-t-[28px] bg-white px-5 pb-5 pt-3">
            <span class="mx-auto mb-1 block h-1.5 w-11 shrink-0 rounded-full bg-shary-form" aria-hidden="true"></span>
            <div class="search-section shary-scroll min-h-0 flex-1 overflow-y-auto pb-1" data-section-body></div>
            <button type="button" class="mt-5 flex h-14 shrink-0 items-center justify-center rounded-full bg-shary-action text-[17px] font-bold leading-normal text-white transition-colors hover:bg-shary-link" data-sheet-apply>{{ __('areas.apply') }}</button>
        </div>
    </div>

    {{-- ====== لوحات الاختيار (المنطقة / المطور) ولوحة السعر — بتطلع من تحت ====== --}}
    {{-- موبايل: لوحة من تحت. ديسك توب: نافذة في نص الشاشة بتفتح من "عرض المزيد" — خانة بحث + القايمة كلها + زرار "إضافة" --}}
    @include('areas.partials.filter-list', ['sheet' => 'developer', 'title' => __('search.add_developers'), 'options' => $area['filters']['developers'], 'chosen' => array_map('strval', (array) ($selected['developer'] ?? [])), 'dialog' => true, 'searchable' => __('search.developer_search'), 'applyLabel' => __('search.add_developers_btn')])
    @include('areas.partials.filter-list', ['sheet' => 'project', 'title' => __('search.add_projects'), 'options' => $area['filters']['projects'] ?? [], 'chosen' => array_map('strval', (array) ($selected['project'] ?? [])), 'dialog' => true, 'searchable' => __('search.project_search'), 'applyLabel' => __('search.add_projects_btn')])
    @include('areas.partials.filter-list', ['sheet' => 'area', 'title' => __('search.add_areas'), 'options' => $area['filters']['areas'], 'chosen' => array_map('strval', (array) ($selected['area'] ?? [])), 'dialog' => true, 'searchable' => __('search.area_search'), 'applyLabel' => __('search.add_areas_btn')])

    <div class="fixed inset-0 z-[60] hidden" data-filter-sheet="price" role="dialog" aria-modal="true" aria-label="{{ __('areas.price') }}">
        <div class="absolute inset-0 bg-shary-navy/60 lg:bg-transparent" data-sheet-close></div>
        <div class="area-sheet absolute inset-x-0 bottom-0 flex flex-col rounded-t-[28px] bg-white px-5 pb-5 pt-3 lg:mx-auto lg:w-[720px] lg:border lg:border-b-0 lg:border-shary-line lg:px-10 lg:pb-9 lg:pt-4 lg:shadow-[0_-20px_60px_-10px_rgba(18,58,92,0.38)]">
            <span class="mx-auto mb-3 block h-1.5 w-11 shrink-0 rounded-full bg-shary-form" aria-hidden="true"></span>
            <h3 class="mb-5 text-[20px] font-semibold leading-normal lg:mb-7 lg:text-[24px]">{{ __('areas.price') }}</h3>
            @include('areas.partials.filter-range', ['name' => 'price', 'range' => $area['filters']['price'], 'unit' => __('areas.currency'), 'scale' => 'log'])
            <button type="button" class="mt-5 flex h-14 shrink-0 items-center justify-center rounded-full bg-shary-action text-[17px] font-bold leading-normal text-white transition-colors hover:bg-shary-link lg:mx-auto lg:mt-8 lg:w-[360px]" data-sheet-apply>{{ __('areas.apply') }}</button>
        </div>
    </div>
</form>
