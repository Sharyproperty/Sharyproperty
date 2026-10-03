{{--
    كارت مشروع
    $project = ['slug', 'name', 'developer' (كود المطور — نفس قيمة الفلتر), 'developer_name', 'developer_short' (حروف مختصرة), 'developer_logo' (لينك اللوجو), 'location',
                'types' => [...], 'more_types' => عدد الأنواع الزيادة, 'plan', 'price', 'badge', 'image', 'image_fallback', 'url']
    الصورة 16:9 (ارفعها 800×450). لو الصورة ما حملتش بتظهر image_fallback، ولو اللوجو ما حملش بتظهر الحروف المختصرة.
    زراير الصورة: قارن ، المفضلة (القلب بيبقى أحمر) ، شارك.
--}}
<article class="area-card flex h-full flex-col overflow-hidden">
    <div class="relative aspect-video bg-shary-image">
        <a href="{{ $project['url'] }}" tabindex="-1" aria-hidden="true">
            <img src="{{ $project['image'] }}" alt="{{ $project['name'] }}" class="absolute inset-0 h-full w-full object-cover" loading="lazy" data-fallback="{{ $project['image_fallback'] ?? '' }}" onerror="this.onerror=null;this.src=this.dataset.fallback">
        </a>

        @if (!empty($project['badge']))
            <span class="absolute start-2.5 top-2.5 rounded-full bg-shary-emerald px-3 py-[5px] text-[12px] font-semibold leading-normal text-white lg:text-[12.5px]">{{ $project['badge'] }}</span>
        @endif

        <div class="absolute end-2.5 top-2.5 flex gap-1.5">
            <button type="button" class="area-action" data-compare-toggle data-compare-id="{{ $project['slug'] }}" aria-pressed="false" aria-label="{{ __('areas.compare_btn') }}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5v19"/><path d="M9 5H6.5A2.5 2.5 0 0 0 4 7.5v9A2.5 2.5 0 0 0 6.5 19H9"/><path d="M15 5h2.5A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5H15V5Z" fill="currentColor"/></svg>
            </button>
            <button type="button" class="area-action group" data-favorite-toggle data-favorite-id="projects/{{ $project['slug'] }}" aria-pressed="false" aria-label="{{ __('areas.add_favorite') }}">
                <svg class="group-aria-pressed:fill-current" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20.3s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.6c0 5.5-7.5 10.1-7.5 10.1Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>
            </button>
            <button type="button" class="area-action" data-share-url="{{ $project['url'] }}" data-share-title="{{ $project['name'] }}" aria-label="{{ __('areas.share') }}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1"/></svg>
            </button>
        </div>
    </div>

    <div class="flex flex-1 flex-col p-4 lg:p-5">
        <div class="flex items-center gap-2.5">
            {{-- لوجو المطور: دايرة 44px / 48px. لو مفيش لوجو أو ما حملش بتظهر الحروف المختصرة --}}
            @if (!empty($project['developer_logo']))
                <img src="{{ $project['developer_logo'] }}" alt="{{ $project['developer_name'] ?? $project['developer'] }}" class="h-11 w-11 shrink-0 rounded-full border border-shary-line bg-white object-contain lg:h-12 lg:w-12" loading="lazy" onerror="this.onerror=null;this.classList.add('hidden');this.nextElementSibling.classList.remove('hidden')">
            @endif
            <span class="{{ !empty($project['developer_logo']) ? 'hidden' : '' }} flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-shary-navy text-[11px] font-bold leading-none text-white lg:h-12 lg:w-12" dir="ltr">{{ $project['developer_short'] ?? $project['developer'] }}</span>
            <div class="min-w-0">
                <small class="block truncate text-[12px] font-medium leading-normal text-shary-muted lg:text-[13px]">{{ $project['location'] }}</small>
                <h3 class="truncate text-[17px] font-bold leading-[1.35] lg:text-[18px]"><a href="{{ $project['url'] }}" class="hover:text-shary-link">{{ $project['name'] }}</a></h3>
            </div>
        </div>

        <p class="mt-2.5 flex flex-wrap gap-x-2.5 gap-y-1 text-[12.5px] font-medium leading-normal text-shary-muted lg:text-[13px]">
            @foreach ($project['types'] as $index => $type)
                <span class="{{ $index > 0 ? 'border-s border-shary-line ps-2.5' : '' }}">{{ $type }}</span>
            @endforeach
            @if (!empty($project['more_types']))
                <span class="border-s border-shary-line ps-2.5"><bdi dir="ltr">+{{ $project['more_types'] }}</bdi></span>
            @endif
        </p>

        <div class="mt-3 border-t border-shary-line pt-3">
            <small class="block text-[12px] font-medium leading-normal text-shary-muted lg:text-[13px]">{{ $project['plan'] }}</small>
            <p class="flex items-baseline gap-1.5 text-[21px] font-bold leading-[1.4] lg:text-[24px]">
                <span>{{ $project['price'] }}</span>
                <span class="text-[13px] font-semibold text-shary-muted lg:text-[14px]">{{ __('areas.currency') }}</span>
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
