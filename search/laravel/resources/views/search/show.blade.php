{{--
    صفحة نتايج البحث (مثال: شاليهات للبيع في الساحل الشمالي) — ديسك توب وموبايل في ملف واحد
    $search = بيانات الصفحة (الشكل موضّح في resources/data/search-sample.ar.php):
        name, h1, meta_title, meta_description, unitsCount, compoundsCount, subAreas, filters, units, compounds,
        unitsUrl, compoundsUrl, mapUrl, unitsNextUrl, compoundsNextUrl, promo, searches, parent (صفحة بحث المنطقة الأم — لصفحات المناطق الفرعية)
    $mode = units | compounds (من اللينك: ?view=compounds) ، $results = كروت الوضع الحالي ، $count ، $nextUrl
    - الوحدات: search/partials/unit-card.blade.php — الكمبوندات: نفس كارت المشروع (areas/partials/project-card.blade.php).
    - التحميل وأنت نازل: مفيش "عرض المزيد" ولا أرقام صفحات — العنصر [data-infinite] بيطلب $nextUrl ويضيف الكروت (js/shary/search-page.js).
    - التحويل وحدات ⇄ كمبوندات + عرض الخريطة: موبايل زرار عايم تحت بشكل التطبيق — ديسك توب في الصفحة نفسها فوق النتايج.
    نصوص الواجهة من lang/{ar,en}/search.php (والفلاتر من lang/{ar,en}/areas.php)
--}}
@extends('layouts.site')

@section('title', $search['meta_title'] ?? ($h1 ?? $search['name']))

{{-- المسافة تحت في الموبايل: شريط التواصل الثابت (70px) + مكان أبيض فاضي لزرار التحويل العايم (8 + 48 + 8) عشان ما يغطيش آخر الفوتر (تحميل التطبيق) --}}
@section('body-class', 'bg-white pb-[134px] lg:pb-0')

@section('head')
    <meta name="description" content="{{ $search['meta_description'] ?? '' }}">
    <link rel="canonical" href="{{ $canonical ?? '' }}">
    <meta property="og:title" content="{{ $search['meta_title'] ?? $search['name'] }}">
    <meta property="og:description" content="{{ $search['meta_description'] ?? '' }}">
@endsection

@section('scripts')
    <script src="{{ asset('js/shary/area-page.js') }}"></script>
    <script src="{{ asset('js/shary/search-page.js') }}"></script>
    <script src="{{ asset('js/shary/ai-panel.js') }}"></script>
@endsection

@section('content')
    {{-- مسار الصفحة: الرئيسية ‹ عقارات مصر ‹ اسم البحث --}}
    @include('partials.breadcrumb')

    <div class="site-container pb-10 pt-2 lg:pb-16 lg:pt-5">
        <div class="search-layout">
            {{-- خانة البحث + الفلاتر السريعة + العنوان (فوق النتايج) وعمود الفلاتر (ديسك توب) --}}
            @include('search.partials.filters')

            <div class="search-results">
                {{-- ديسك توب: كارت واحد في الصف بالعرض (الصورة على جنب والتفاصيل جنبها) --}}
                <div class="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-1 lg:gap-5" data-results>
                    @foreach ($results as $index => $item)
                        @if ($mode === 'compounds')
                            <div data-project data-slug="{{ $item['slug'] }}" data-developer="{{ $item['developer'] }}" data-kind="{{ $item['kind'] }}" data-price="{{ $item['price_value'] }}" data-types="{{ implode(' ', $item['type_keys'] ?? []) }}" data-areas="{{ implode(' ', $item['areas'] ?? []) }}">
                                @include('areas.partials.project-card', ['project' => $item])
                            </div>
                        @else
                            <div data-unit data-slug="{{ $item['slug'] }}" data-project-slug="{{ $item['project'] ?? '' }}" data-offer="{{ $item['offer'] ?? 'sale' }}" data-installment="{{ $item['installment_value'] ?? 0 }}" data-developer="{{ $item['developer'] }}" data-price="{{ $item['price_value'] }}" data-beds="{{ $item['beds'] }}" data-baths="{{ $item['baths'] }}" data-size="{{ $item['area'] }}" data-resale="{{ !empty($item['resale']) ? '1' : '0' }}" data-types="{{ $item['type'] ?? '' }}" data-areas="{{ implode(' ', $item['areas'] ?? []) }}" data-finishing="{{ $item['finishing'] ?? '' }}" data-delivery="{{ $item['delivery'] ?? '' }}" data-years="{{ $item['years'] ?? '' }}">
                                @include('search.partials.unit-card', ['unit' => $item])
                            </div>
                        @endif

                        {{-- بعد تاني كارت: بانر Shary AI (بيفتح صفحة Shary AI) --}}
                        @if ($index === 1 && !empty($search['promo']))
                            <a href="{{ $aiUrl ?? '#' }}" class="search-promo md:col-span-2 lg:col-span-1" data-ask-ai data-promo>
                                <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_8px_18px_-10px_rgba(18,58,92,0.5)]">
                                    <img src="{{ asset('images/shary/logo-mark.svg') }}" alt="" width="32" height="26">
                                </span>
                                <span class="min-w-0 flex-1">
                                    <b class="block text-[16px] font-bold leading-[1.45] text-shary-navy lg:text-[18px]">{{ $search['promo']['title'] }}</b>
                                    <span class="block text-[13px] font-medium leading-[1.6] text-shary-muted lg:text-[14px]">{{ $search['promo']['text'] }}</span>
                                </span>
                                <svg class="shrink-0 text-shary-navy ltr:rotate-180" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
                            </a>
                        @endif
                    @endforeach
                </div>
                <p class="hidden rounded-2xl bg-shary-soft px-4 py-8 text-center text-[14px] font-semibold text-shary-muted" data-results-empty>{{ __('search.no_results') }}</p>

                {{-- التحميل وأنت نازل: بيطلب data-next-url ويضيف الكروت. لينك فاضي = دي كل النتايج --}}
                <div class="search-more" data-infinite data-next-url="{{ $nextUrl ?? '' }}" data-state="idle" aria-live="polite">
                    <span class="search-more__loading"><i class="search-more__spin" aria-hidden="true"></i>{{ __('search.loading') }}</span>
                    <span class="search-more__done">{{ __('search.end') }}</span>
                    <button type="button" class="search-more__error" data-infinite-retry>{{ __('search.retry') }}</button>
                </div>

                {{-- عمليات بحث مشابهة --}}
                @if (!empty($search['searches']))
                    <section class="mt-8 lg:mt-10">
                        <h2 class="mb-3 text-[18px] font-bold leading-[1.35] lg:text-[22px]">{{ __('search.more_searches') }}</h2>
                        <div class="flex flex-wrap gap-2">
                            @foreach ($search['searches'] as $link)
                                <a href="{{ $link['url'] }}" class="flex h-10 items-center rounded-full border border-shary-line bg-white px-4 text-[13.5px] font-semibold leading-normal text-shary-navy transition-colors hover:border-shary-link hover:text-shary-link lg:text-[14px]">{{ $link['label'] }}</a>
                            @endforeach
                        </div>
                    </section>
                @endif
            </div>
        </div>
    </div>

    {{-- موبايل: زرار التحويل العايم بشكل التطبيق — عرض الخريطة ⇄ (لوجو شاري) ⇄ عرض الكمبوندات / الوحدات --}}
    <nav class="search-switch lg:hidden" aria-label="{{ __('search.switch') }}">
        <a href="{{ $search['mapUrl'] }}" class="search-switch__side">
            <span class="search-switch__icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4ZM9 4v14M15 6v14"/><circle cx="12.2" cy="10.2" r="1.6"/></svg>
            </span>
            <span>{{ __('search.map_view') }}</span>
        </a>
        <span class="search-switch__link" aria-hidden="true"></span>
        <img src="{{ asset('images/shary/logo-mark.svg') }}" alt="" width="34" height="28" class="search-switch__logo">
        <span class="search-switch__link" aria-hidden="true"></span>
        <a href="{{ $mode === 'compounds' ? $search['unitsUrl'] : $search['compoundsUrl'] }}" class="search-switch__side" data-mode-switch>
            <span>{{ $mode === 'compounds' ? __('search.to_units') : __('search.to_compounds') }}</span>
            <span class="search-switch__icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8.5h15M15.5 5l3.5 3.5-3.5 3.5M20 15.5H5M8.5 12 5 15.5 8.5 19"/></svg>
            </span>
        </a>
    </nav>

    @include('areas.partials.quick-contact', ['compareRaised' => true])
@endsection
