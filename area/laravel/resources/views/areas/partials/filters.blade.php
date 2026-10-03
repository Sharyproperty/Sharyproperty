{{--
    فلاتر مشاريع المنطقة — فورم GET على نفس الصفحة.

    الشريط: المطور | المشروع | السعر | زرار "تصفية" (كل الفلاتر) | زرار الترتيب
    - المطور / المشروع / السعر: كل زرار بيفتح لوحة بتطلع من تحت (موبايل وديسك توب: لوحة في آخر الشاشة، وعلى الديسك توب أعرض)، والاختيار بيتطبق من زرار "تطبيق".
    - "تصفية": صفحة بتطلع من تحت وبتتسكرول (موبايل: بملء الشاشة. ديسك توب: لوحة كبيرة 1180px طالعة من تحت والأقسام عمودين)، فيها كل الفلاتر + "عرض النتائج" و "مسح".
    - الترتيب: قايمة صغيرة تحت الزرار، اختيار واحد.

    الحقول اللي بتتبعت:
        developer[] ، project[] ، area[] ، price_min ، price_max ، sort
        offer (developer | resale | rent) ، furnished (furnished | unfurnished — مع الإيجار بس) ، type[] ، bedrooms[] ، bathrooms[] ، finishing[] ، delivery[] ،
        size_min ، size_max ، down_payment ، monthly_installment ، years[] ، amenities[]

    $area['filters'] = [
        'developers' => [['value', 'label', 'logo', 'short'], ...],
        'projects'   => [['value', 'label', 'image', 'image_fallback'], ...],
        'areas'      => [['value', 'label', 'image', 'image_fallback'], ...],
        'price' => ['min', 'max'] ، 'size' => ['min', 'max'],
        'furnished' => [['value', 'label'], ...] ، 'sections' => ['finishing' | 'delivery' | 'payment' | 'years' => التبويبات اللي القسم بيظهر معاها],
        'offers' ، 'types' ، 'bedrooms' ، 'bathrooms' ، 'finishing' ، 'delivery' ، 'years' ، 'amenities' ، 'sorts' => [['value', 'label'], ...],
    ]
    الاختيارات بتتغير حسب التبويب (وحدات المطور / إعادة البيع / للإيجار): أي اختيار عليه 'modes' بيظهر مع تبويباته بس،
    و price / size ممكن يبقى لهم حدود مختلفة لكل تبويب ('modes' => ['rent' => ['min', 'max']]).
    $compactFilters = true: الشكل المختصر (صفحة المطور) — زرار "تصفية" وزرار الترتيب بس، من غير المطور / المشروع / السعر.
    $selected = الاختيارات الحالية من اللينك (request()->query()) عشان تفضل متعلّمة بعد ما الصفحة ترجع.
    السكربت: js/shary/area-page.js — قبل الإرسال بيطلع حدث shary:filter (ممكن تمنعوه وتجيبوا النتايج AJAX).
--}}
<form action="{{ $canonical ?? '' }}" method="GET" class="{{ !empty($compactFilters) ? 'flex shrink-0 items-center gap-2 lg:gap-3' : 'mb-3.5 grid grid-cols-[1fr_1fr_1fr_44px_44px] gap-1.5 lg:mb-5 lg:grid-cols-[240px_240px_240px_48px_48px] lg:justify-start lg:gap-3' }}" data-area-filters>
    @if (empty($compactFilters))
    <div class="area-filter">
        <button type="button" data-sheet-open="developer" aria-haspopup="dialog" aria-expanded="false">
            <span class="truncate">{{ __('areas.developer') }}</span>
            <span class="area-filter__count absolute -end-1.5 -top-1.5" data-sheet-count="developer"></span>
        </button>
        <svg class="area-filter__chevron" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="area-filter">
        <button type="button" data-sheet-open="project" aria-haspopup="dialog" aria-expanded="false">
            <span class="truncate">{{ __('areas.project_filter') }}</span>
            <span class="area-filter__count absolute -end-1.5 -top-1.5" data-sheet-count="project"></span>
        </button>
        <svg class="area-filter__chevron" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div class="area-filter">
        <button type="button" data-sheet-open="price" aria-haspopup="dialog" aria-expanded="false">
            <span class="truncate">{{ __('areas.price') }}</span>
            <span class="area-filter__count absolute -end-1.5 -top-1.5" data-sheet-count="price"></span>
        </button>
        <svg class="area-filter__chevron" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>

    @endif

    {{-- زرار "تصفية": بيفتح صفحة كل الفلاتر. في الشكل المختصر ($compactFilters) الزرار أزرق ومكتوب عليه "تصفية" --}}
    <button type="button" class="relative flex h-11 items-center justify-center gap-2 rounded-xl text-white transition-colors lg:h-12 {{ !empty($compactFilters) ? 'bg-shary-link px-3 text-[14px] font-bold hover:bg-shary-action lg:px-5 lg:text-[15px]' : 'bg-shary-action hover:bg-shary-link' }}" data-sheet-open="all" aria-haspopup="dialog" aria-expanded="false" aria-label="{{ __('areas.all_filters') }}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg>
        @if (!empty($compactFilters))
            <span>{{ __('areas.filter_title') }}</span>
        @endif
        <span class="area-filter__count absolute -end-1 -top-1" data-sheet-count="all"></span>
    </button>

    {{-- الترتيب: قايمة تحت الزرار، اختيار واحد --}}
    <div class="relative">
        <button type="button" class="flex h-11 w-full items-center justify-center gap-1.5 rounded-xl transition-colors lg:h-12 {{ !empty($compactFilters) ? 'border border-shary-line bg-white px-2.5 text-[14px] font-bold text-shary-navy hover:border-shary-link hover:text-shary-link lg:w-12 lg:px-0' : 'bg-shary-action text-white hover:bg-shary-link' }}" data-sort-open aria-haspopup="true" aria-expanded="false" aria-label="{{ __('areas.sort') }}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 5v14M8 19l-3-3M8 19l3-3M16 19V5M16 5l-3 3M16 5l3 3"/></svg>
            @if (!empty($compactFilters))
                <span class="lg:hidden">{{ __('areas.sort') }}</span>
            @endif
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

    {{-- قيم السعر والمساحة (الشريط بيكتب فيها) --}}
    <input type="hidden" name="price_min" value="{{ $selected['price_min'] ?? '' }}" data-range-min="price">
    <input type="hidden" name="price_max" value="{{ $selected['price_max'] ?? '' }}" data-range-max="price">
    <input type="hidden" name="size_min" value="{{ $selected['size_min'] ?? '' }}" data-range-min="size">
    <input type="hidden" name="size_max" value="{{ $selected['size_max'] ?? '' }}" data-range-max="size">

    {{-- ====== صفحة "تصفية" (كل الفلاتر): بتطلع من تحت وبتتسكرول ====== --}}
    <div class="fixed inset-0 z-50 hidden" data-filter-sheet="all" role="dialog" aria-modal="true" aria-label="{{ __('areas.filter_title') }}">
        {{-- صفحة كاملة على الموبايل والديسك توب: بتطلع من تحت وبتغطي الشاشة كلها، والمحتوى في النص بعرض 1240px --}}
        <div class="area-sheet absolute inset-0 flex flex-col bg-[#fafafa] lg:bg-[#f4f7fa]">
            <div class="shrink-0 lg:border-b lg:border-shary-line lg:bg-white">
                <div class="relative flex h-16 items-center justify-center px-5 lg:mx-auto lg:h-[76px] lg:max-w-[1240px] lg:justify-between lg:px-10">
                    {{-- موبايل: سهم الرجوع --}}
                    <button type="button" class="absolute start-3 flex h-11 w-11 items-center justify-center rounded-full text-shary-navy hover:text-shary-link lg:hidden" data-sheet-close aria-label="{{ __('blog.close') }}">
                        <svg class="ltr:rotate-180" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    </button>
                    <h3 class="flex items-center gap-2.5 text-[20px] font-bold leading-normal lg:gap-3 lg:text-[24px]">
                        <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-shary-link text-white lg:h-11 lg:w-11" aria-hidden="true">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg>
                        </span>
                        {{ __('areas.filter_title') }}
                    </h3>
                    {{-- ديسك توب: زرار إغلاق --}}
                    <button type="button" class="hidden h-11 items-center gap-2 rounded-full border border-shary-line bg-white px-5 text-[15px] font-bold leading-normal text-shary-navy transition-colors hover:border-shary-link hover:text-shary-link lg:flex" data-sheet-close>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
                        {{ __('blog.close') }}
                    </button>
                </div>
            </div>

            <div class="shary-scroll min-h-0 flex-1 overflow-y-auto">
            <div class="px-5 pb-6 lg:mx-auto lg:max-w-[1240px] lg:px-10 lg:pb-10">
                {{-- وحدات المطور / إعادة البيع / للإيجار --}}
                <div class="area-tabs lg:mx-auto lg:mt-7 lg:max-w-[760px]">
                    @foreach ($area['filters']['offers'] as $offer)
                        <label class="cursor-pointer">
                            <input type="radio" name="offer" value="{{ $offer['value'] }}" class="sr-only" {{ ($selected['offer'] ?? $area['filters']['offers'][0]['value']) === $offer['value'] ? 'checked' : '' }}>
                            <span>{{ $offer['label'] }}</span>
                        </label>
                    @endforeach
                </div>

                {{-- مفروش / غير مفروش: مع "للإيجار" بس --}}
                <div class="area-toggle mt-3 lg:mx-auto lg:max-w-[760px]" data-modes="rent">
                    @foreach ($area['filters']['furnished'] as $option)
                        <label class="cursor-pointer">
                            <input type="radio" name="furnished" value="{{ $option['value'] }}" class="sr-only" data-toggle-off {{ ($selected['furnished'] ?? '') === $option['value'] ? 'checked' : '' }}>
                            <span>{{ $option['label'] }}</span>
                        </label>
                    @endforeach
                </div>

                {{-- ديسك توب: الأقسام كروت في عمودين --}}
                <div class="lg:mt-7 lg:columns-2 lg:gap-5">
                <section class="area-fsec" data-filter-section>
                    @include('areas.partials.filter-head', ['title' => __('areas.f_type'), 'icon' => '<path d="M4 21V6l8-3v18M12 9l8 2v10M4 21h16M7.5 9v.01M7.5 12.5v.01M7.5 16v.01M15.5 13.5v.01M15.5 17v.01"/>'])
                    @include('areas.partials.filter-chips', ['name' => 'type', 'options' => $area['filters']['types'], 'chosen' => array_map('strval', (array) ($selected['type'] ?? []))])
                </section>

                {{-- المنطقة والمطور: كل زرار بيفتح لوحة الاختيار --}}
                <section class="area-fsec" data-filter-section data-clears="area developer">
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
                    </div>
                </section>

                <section class="area-fsec" data-filter-section>
                    @include('areas.partials.filter-head', ['title' => __('areas.f_bedrooms'), 'icon' => '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 15h18M6 10V7.5A1.5 1.5 0 0 1 7.5 6h9A1.5 1.5 0 0 1 18 7.5V10"/>'])
                    @include('areas.partials.filter-chips', ['name' => 'bedrooms', 'options' => $area['filters']['bedrooms'], 'box' => true, 'chosen' => array_map('strval', (array) ($selected['bedrooms'] ?? []))])
                </section>

                <section class="area-fsec" data-filter-section>
                    @include('areas.partials.filter-head', ['title' => __('areas.f_bathrooms'), 'icon' => '<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM6 12V6.5A2.5 2.5 0 0 1 8.5 4c1.1 0 2 .7 2.3 1.7M7 19l-1 2M17 19l1 2"/>'])
                    @include('areas.partials.filter-chips', ['name' => 'bathrooms', 'options' => $area['filters']['bathrooms'], 'box' => true, 'chosen' => array_map('strval', (array) ($selected['bathrooms'] ?? []))])
                </section>

                <section class="area-fsec" data-filter-section data-modes="{{ implode(' ', $area['filters']['sections']['finishing'] ?? []) }}">
                    @include('areas.partials.filter-head', ['title' => __('areas.f_finishing'), 'icon' => '<path d="M14.5 4.5l5 5L9 20H4v-5L14.5 4.5ZM12 7l5 5"/>'])
                    @include('areas.partials.filter-chips', ['name' => 'finishing', 'options' => $area['filters']['finishing'], 'chosen' => array_map('strval', (array) ($selected['finishing'] ?? []))])
                </section>

                <section class="area-fsec" data-filter-section data-modes="{{ implode(' ', $area['filters']['sections']['delivery'] ?? []) }}">
                    @include('areas.partials.filter-head', ['title' => __('areas.f_delivery'), 'icon' => '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M4 10h16M9 14.5l2 2 4-4"/>'])
                    @include('areas.partials.filter-chips', ['name' => 'delivery', 'options' => $area['filters']['delivery'], 'chosen' => array_map('strval', (array) ($selected['delivery'] ?? []))])
                </section>

                <section class="area-fsec" data-filter-section>
                    @include('areas.partials.filter-head', ['title' => __('areas.f_price_range'), 'icon' => '<rect x="3" y="6" width="18" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.5"/>'])
                    @include('areas.partials.filter-range', ['name' => 'price', 'range' => $area['filters']['price'], 'unit' => __('areas.currency'), 'scale' => 'log'])
                </section>

                <section class="area-fsec" data-filter-section>
                    @include('areas.partials.filter-head', ['title' => __('areas.f_size'), 'icon' => '<path d="M4 20V5l15 15H4ZM8 20v-5.5h5.5"/>'])
                    @include('areas.partials.filter-range', ['name' => 'size', 'range' => $area['filters']['size'], 'unit' => __('areas.f_size_unit'), 'scale' => 'linear'])
                </section>

                <section class="area-fsec" data-filter-section data-modes="{{ implode(' ', $area['filters']['sections']['payment'] ?? []) }}">
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

                <section class="area-fsec" data-filter-section data-modes="{{ implode(' ', $area['filters']['sections']['years'] ?? []) }}">
                    @include('areas.partials.filter-head', ['title' => __('areas.f_years'), 'icon' => '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M4 10h16M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>'])
                    @include('areas.partials.filter-chips', ['name' => 'years', 'options' => $area['filters']['years'], 'box' => true, 'chosen' => array_map('strval', (array) ($selected['years'] ?? []))])
                </section>

                </div>

                <section class="area-fsec" data-filter-section>
                    @include('areas.partials.filter-head', ['title' => __('areas.f_amenities'), 'icon' => '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" fill="currentColor"/>'])
                    <div class="grid grid-cols-2 gap-x-4 gap-y-1 lg:grid-cols-4">
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

            {{-- موبايل: الزرارين بعرض الشاشة. ديسك توب: شريط ثابت تحت — "مسح" في الأول و"عرض النتائج" في الآخر --}}
            <div class="shrink-0 rounded-t-[26px] bg-white shadow-[0_-8px_24px_-14px_rgba(18,58,92,0.35)] lg:rounded-none lg:border-t lg:border-shary-line lg:shadow-none">
                <div class="flex gap-3 px-5 pb-5 pt-4 lg:mx-auto lg:max-w-[1240px] lg:flex-row-reverse lg:items-center lg:justify-between lg:px-10 lg:py-4">
                    <button type="button" class="flex h-14 flex-[2] items-center justify-center gap-2.5 rounded-full bg-shary-link text-[17px] font-bold leading-normal text-white transition-colors hover:bg-shary-action lg:h-[52px] lg:w-[300px] lg:flex-none lg:rounded-2xl" data-sheet-apply>
                        {{ __('areas.show_results') }}
                        <svg class="hidden ltr:rotate-180 lg:block" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
                    </button>
                    <button type="button" class="flex h-14 flex-1 items-center justify-center gap-2.5 rounded-full bg-shary-form text-[17px] font-bold leading-normal text-shary-navy transition-colors hover:bg-shary-cloud lg:h-[52px] lg:w-auto lg:flex-none lg:rounded-2xl lg:border lg:border-shary-line lg:bg-white lg:px-6 lg:text-[16px] lg:hover:border-shary-link lg:hover:bg-white lg:hover:text-shary-link" data-filter-clear-all>
                        <svg class="hidden lg:block" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>
                        {{ __('areas.clear') }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    {{-- ====== لوحات الاختيار (بتطلع من تحت) ====== --}}
    @if (!empty($area['filters']['developers']))
        @include('areas.partials.filter-list', ['sheet' => 'developer', 'title' => __('areas.developer'), 'options' => $area['filters']['developers'], 'chosen' => array_map('strval', (array) ($selected['developer'] ?? []))])
    @endif
    @if (!empty($area['filters']['projects']))
        @include('areas.partials.filter-list', ['sheet' => 'project', 'title' => __('areas.project_filter'), 'options' => $area['filters']['projects'], 'chosen' => array_map('strval', (array) ($selected['project'] ?? []))])
    @endif
    @include('areas.partials.filter-list', ['sheet' => 'area', 'title' => __('areas.f_area'), 'options' => $area['filters']['areas'], 'chosen' => array_map('strval', (array) ($selected['area'] ?? []))])

    {{-- لوحة السعر: شريط من–إلى + خانتين للكتابة --}}
    <div class="fixed inset-0 z-[60] hidden" data-filter-sheet="price" role="dialog" aria-modal="true" aria-label="{{ __('areas.price') }}">
        {{-- ديسك توب: من غير تغميق للصفحة — اللوحة بتطلع فوقها بظل بس --}}
        <div class="absolute inset-0 bg-shary-navy/60 lg:bg-transparent" data-sheet-close></div>
        <div class="area-sheet lg:border lg:border-b-0 lg:border-shary-line lg:shadow-[0_-20px_60px_-10px_rgba(18,58,92,0.38)] absolute inset-x-0 bottom-0 flex flex-col rounded-t-[28px] bg-white px-5 pb-5 pt-3 lg:mx-auto lg:w-[720px] lg:px-10 lg:pb-9 lg:pt-4">
            <span class="mx-auto mb-3 block h-1.5 w-11 shrink-0 rounded-full bg-shary-form" aria-hidden="true"></span>
            <h3 class="mb-5 text-[20px] font-semibold leading-normal lg:mb-7 lg:text-[24px]">{{ __('areas.price') }}</h3>
            @include('areas.partials.filter-range', ['name' => 'price', 'range' => $area['filters']['price'], 'unit' => __('areas.currency'), 'scale' => 'log'])
            <button type="button" class="mt-5 flex h-14 shrink-0 items-center justify-center rounded-full bg-shary-action lg:mx-auto lg:mt-8 lg:w-[360px] text-[17px] font-bold leading-normal text-white transition-colors hover:bg-shary-link" data-sheet-apply>{{ __('areas.apply') }}</button>
        </div>
    </div>
</form>
