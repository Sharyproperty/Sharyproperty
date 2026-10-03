{{--
    كارت مشروع في صفحة المطور
    $project = ['slug', 'name', 'location', 'developer' (كود المطور), 'developer_name', 'developer_short', 'developer_logo',
                'types' => [...], 'price', 'price_value', 'plan', 'image', 'image_fallback', 'url']
    الصورة 16:9 (ارفعها 800×450). زراير الصورة بنفس شكل الموقع (مربعات بيضا بحواف دايرة): قارن ، المفضلة (القلب بيبقى أحمر) ، شارك.
    موبايل: السعر على جنب وزرارين دايرة (واتساب + اتصال). ديسك توب: زرار "تواصل معنا" عريض + زرار الاتصال.
--}}
<article class="area-card flex h-full flex-col overflow-hidden">
    <div class="relative aspect-video bg-shary-image">
        <a href="{{ $project['url'] }}" tabindex="-1" aria-hidden="true">
            <img src="{{ $project['image'] }}" alt="{{ $project['name'] }}" class="absolute inset-0 h-full w-full object-cover" loading="lazy" data-fallback="{{ $project['image_fallback'] ?? '' }}" onerror="this.onerror=null;this.src=this.dataset.fallback">
        </a>
        <div class="absolute end-2.5 top-2.5 flex gap-1.5">
            <button type="button" class="area-action" data-compare-toggle data-compare-id="{{ $project['slug'] }}" aria-pressed="false" aria-label="{{ __('developers.compare') }}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5v19"/><path d="M9 5H6.5A2.5 2.5 0 0 0 4 7.5v9A2.5 2.5 0 0 0 6.5 19H9"/><path d="M15 5h2.5A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5H15V5Z" fill="currentColor"/></svg>
            </button>
            <button type="button" class="area-action group" data-favorite-toggle data-favorite-id="projects/{{ $project['slug'] }}" aria-pressed="false" aria-label="{{ __('developers.add_favorite') }}">
                <svg class="group-aria-pressed:fill-current" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20.3s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.6c0 5.5-7.5 10.1-7.5 10.1Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>
            </button>
            <button type="button" class="area-action" data-share-url="{{ $project['url'] }}" data-share-title="{{ $project['name'] }}" aria-label="{{ __('developers.share') }}">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4.1M8.2 13.2l7.6 4.1"/></svg>
            </button>
        </div>
    </div>

    <div class="flex flex-1 flex-col p-4 lg:p-[18px]">
        <div class="mb-3.5 flex items-start gap-3">
            @if (!empty($project['developer_logo']))
                <img src="{{ $project['developer_logo'] }}" alt="{{ $project['developer_name'] ?? '' }}" class="h-11 w-11 shrink-0 rounded-full border border-shary-line bg-white object-contain" loading="lazy" onerror="this.onerror=null;this.classList.add('hidden');this.nextElementSibling.classList.remove('hidden')">
            @endif
            <span class="{{ !empty($project['developer_logo']) ? 'hidden' : '' }} flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-shary-line bg-white text-[10px] font-extrabold leading-none text-shary-navy" dir="ltr">{{ $project['developer_short'] ?? '' }}</span>
            <div class="min-w-0 flex-1">
                <h3 class="text-[16px] font-bold leading-[1.55] lg:text-[17px]">
                    <a href="{{ $project['url'] }}" class="hover:text-shary-link">{{ $project['name'] }}</a>
                    <span class="font-medium text-shary-muted">- {{ $project['location'] }}</span>
                </h3>
                <p class="mt-2 flex flex-wrap gap-2">
                    @foreach ($project['types'] as $type)
                        <span class="rounded-md bg-[#e7f5f1] px-2.5 py-[3px] text-[13px] font-semibold leading-normal text-shary-teal">{{ $type }}</span>
                    @endforeach
                </p>
            </div>
        </div>

        <div class="mt-auto flex items-center justify-between gap-3 border-t border-shary-line pt-3 lg:block">
            <div class="mt-0 min-w-0">
                <p class="flex items-baseline gap-1.5 text-[20px] font-bold leading-[1.4] lg:text-[22px]">
                    <span>{{ $project['price'] }}</span>
                    <span class="text-[15px] font-bold lg:text-[16px]">{{ __('developers.currency') }}</span>
                </p>
                <small class="block text-[12.5px] font-medium leading-normal text-shary-muted lg:text-[13px]">{{ $project['plan'] }}</small>
            </div>
            <div class="flex shrink-0 gap-2.5 lg:mt-3.5">
                <a href="https://wa.me/{{ $contact['whatsapp'] ?? '' }}" target="_blank" rel="noopener" class="flex h-12 w-12 items-center justify-center gap-2 rounded-full bg-shary-whatsapp text-[16px] font-bold leading-normal text-white transition-[filter] hover:brightness-95 lg:h-[54px] lg:w-auto lg:flex-1 lg:rounded-xl" aria-label="{{ __('developers.whatsapp') }}">
                    <i class="fa-brands fa-whatsapp text-[24px] leading-none" aria-hidden="true"></i>
                    <span class="hidden lg:inline">{{ __('developers.contact_us') }}</span>
                </a>
                <a href="tel:{{ $contact['phone'] ?? '' }}" class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-shary-action text-white transition-colors hover:bg-shary-link lg:h-[54px] lg:w-[54px] lg:rounded-xl" aria-label="{{ __('developers.call') }}">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z"/></svg>
                </a>
            </div>
        </div>
    </div>
</article>
