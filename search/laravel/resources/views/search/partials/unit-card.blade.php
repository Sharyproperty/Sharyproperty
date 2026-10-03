{{--
    كارت وحدة (صفحة نتايج البحث) — مبني على كارت المشروع بنفس الشكل والزراير.
    $unit = ['slug', 'title' (النوع، الكمبوند), 'description', 'location', 'developer', 'developer_name', 'developer_short', 'developer_logo',
             'area' (م²), 'beds' (0 = من غير غرف: مكتب / محل / عيادة), 'baths', 'installment' (نص القسط أو "إيجار شهري"), 'price', 'price_value', 'resale' => bool, 'rent' => bool, 'image', 'image_fallback', 'url']
    الصورة 16:9 (ارفعها 800×450). لو الصورة ما حملتش بتظهر image_fallback، ولو اللوجو ما حملش بتظهر الحروف المختصرة.
    زراير الصورة: قارن ، المفضلة (القلب بيبقى أحمر) ، شارك.
--}}
<article class="area-card flex h-full flex-col overflow-hidden">
    <div class="relative aspect-video bg-shary-image">
        <a href="{{ $unit['url'] }}" tabindex="-1" aria-hidden="true">
            <img src="{{ $unit['image'] }}" alt="{{ $unit['title'] }}" class="absolute inset-0 h-full w-full object-cover" loading="lazy" data-fallback="{{ $unit['image_fallback'] ?? '' }}" onerror="this.onerror=null;this.src=this.dataset.fallback">
        </a>

        @if (!empty($unit['rent']))
            <span class="absolute start-2.5 top-2.5 rounded-full bg-shary-link px-3 py-[5px] text-[12px] font-semibold leading-normal text-white lg:text-[12.5px]">{{ __('search.for_rent') }}</span>
        @elseif (!empty($unit['resale']))
            <span class="absolute start-2.5 top-2.5 rounded-full bg-shary-teal px-3 py-[5px] text-[12px] font-semibold leading-normal text-white lg:text-[12.5px]">{{ __('search.resale') }}</span>
        @endif

        <div class="absolute end-2.5 top-2.5 flex gap-1.5">
            <button type="button" class="area-action" data-compare-toggle data-compare-id="{{ $unit['slug'] }}" aria-pressed="false" aria-label="{{ __('areas.compare_btn') }}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5v19"/><path d="M9 5H6.5A2.5 2.5 0 0 0 4 7.5v9A2.5 2.5 0 0 0 6.5 19H9"/><path d="M15 5h2.5A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5H15V5Z" fill="currentColor"/></svg>
            </button>
            <button type="button" class="area-action group" data-favorite-toggle data-favorite-id="units/{{ $unit['slug'] }}" aria-pressed="false" aria-label="{{ __('areas.add_favorite') }}">
                <svg class="group-aria-pressed:fill-current" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20.3s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.6c0 5.5-7.5 10.1-7.5 10.1Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>
            </button>
            <button type="button" class="area-action" data-share-url="{{ $unit['url'] }}" data-share-title="{{ $unit['title'] }}" aria-label="{{ __('areas.share') }}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1"/></svg>
            </button>
        </div>

        {{-- المكان على الصورة --}}
        <span class="absolute bottom-2.5 start-2.5 flex max-w-[calc(100%-20px)] items-center gap-1.5 rounded-full bg-shary-navy/75 px-2.5 py-1 text-[12px] font-semibold leading-normal text-white backdrop-blur-sm">
            <svg class="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>
            <span class="truncate">{{ $unit['location'] }}</span>
        </span>
    </div>

    <div class="flex flex-1 flex-col p-4 lg:p-5">
        <div class="flex items-start gap-3">
            <div class="min-w-0 flex-1">
                <h3 class="truncate text-[17px] font-bold leading-[1.35] lg:text-[18px]"><a href="{{ $unit['url'] }}" class="hover:text-shary-link">{{ $unit['title'] }}</a></h3>
                <p class="mt-0.5 line-clamp-2 text-[12.5px] font-medium leading-[1.6] text-shary-muted lg:text-[13px]">{{ $unit['description'] }}</p>
            </div>
            {{-- لوجو المطور: دايرة 44px / 48px. لو مفيش لوجو أو ما حملش بتظهر الحروف المختصرة --}}
            @if (!empty($unit['developer_logo']))
                <img src="{{ $unit['developer_logo'] }}" alt="{{ $unit['developer_name'] }}" class="h-11 w-11 shrink-0 rounded-full border border-shary-line bg-white object-contain lg:h-12 lg:w-12" loading="lazy" onerror="this.onerror=null;this.classList.add('hidden');this.nextElementSibling.classList.remove('hidden')">
            @endif
            <span class="{{ !empty($unit['developer_logo']) ? 'hidden' : '' }} flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-shary-navy text-[11px] font-bold leading-none text-white lg:h-12 lg:w-12" dir="ltr">{{ $unit['developer_short'] }}</span>
        </div>

        {{-- المساحة | الغرف | الحمامات --}}
        <ul class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium leading-normal text-shary-muted lg:text-[14px]">
            <li class="flex items-center gap-1.5">
                <svg class="text-shary-hint" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M8 8h3M8 8v3M16 16h-3M16 16v-3"/></svg>
                <b class="text-[15px] font-bold text-shary-navy lg:text-[16px]">{{ $unit['area'] }}</b> {{ __('search.m2') }}
            </li>
            @if (!empty($unit['beds']))
            <li class="flex items-center gap-1.5 border-s border-shary-line ps-3">
                <svg class="text-shary-hint" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 15h18M6 10V7.5A1.5 1.5 0 0 1 7.5 6h9A1.5 1.5 0 0 1 18 7.5V10"/></svg>
                <b class="text-[15px] font-bold text-shary-navy lg:text-[16px]">{{ $unit['beds'] }}</b> {{ __('search.beds') }}
            </li>
            @endif
            <li class="flex items-center gap-1.5 border-s border-shary-line ps-3">
                <svg class="text-shary-hint" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM6 12V6.5A2.5 2.5 0 0 1 8.5 4c1.1 0 2 .7 2.3 1.7M7 19l-1 2M17 19l1 2"/></svg>
                <b class="text-[15px] font-bold text-shary-navy lg:text-[16px]">{{ $unit['baths'] }}</b> {{ __('search.baths') }}
            </li>
        </ul>

        <div class="mt-3 border-t border-shary-line pt-3">
            <small class="block text-[12px] font-medium leading-normal text-shary-muted lg:text-[13px]">{{ $unit['installment'] }}</small>
            <p class="flex flex-wrap items-baseline gap-x-1.5 text-[21px] font-bold leading-[1.4] lg:text-[24px]">
                <span>{{ $unit['price'] }}</span>
                <span class="text-[13px] font-semibold text-shary-muted lg:text-[14px]">{{ __('areas.currency') }}</span>
                <span class="text-[12px] font-medium text-shary-muted lg:text-[13px]">· {{ !empty($unit['rent']) ? __('search.per_month') : __('search.start_price') }}</span>
            </p>
        </div>

        <div class="mt-auto grid grid-cols-2 gap-2.5 pt-3.5">
            <a href="tel:{{ $contact['phone'] ?? '' }}" class="flex h-11 items-center justify-center gap-2 rounded-xl border-[1.5px] border-shary-navy bg-white text-[14px] font-bold leading-normal text-shary-navy transition-colors hover:border-shary-link hover:text-shary-link lg:h-[46px] lg:text-[15px]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z"/></svg>
                <span>{{ __('areas.call') }}</span>
            </a>
            <a href="https://wa.me/{{ $contact['whatsapp'] ?? '' }}" target="_blank" rel="noopener" class="flex h-11 items-center justify-center gap-2 rounded-xl bg-shary-whatsapp text-[14px] font-bold leading-normal text-white transition-[filter] hover:brightness-95 lg:h-[46px] lg:text-[15px]">
                <i class="fa-brands fa-whatsapp text-[20px] leading-none" aria-hidden="true"></i>
                <span>{{ __('areas.whatsapp') }}</span>
            </a>
        </div>
    </div>
</article>
