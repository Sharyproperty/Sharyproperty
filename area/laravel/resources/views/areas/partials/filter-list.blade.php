{{--
    لوحة اختيار بتطلع من تحت: صورة دايرة (لوجو المطور / صورة المشروع / صورة المنطقة) + الاسم + مربع الاختيار في الطرف.
    $sheet = اسم اللوحة والحقل (developer | project | area) ، $title ، $options = [['value', 'label', 'image' أو 'logo', 'image_fallback', 'short'], ...] ، $chosen
--}}
<div class="fixed inset-0 z-[60] hidden" data-filter-sheet="{{ $sheet }}" role="dialog" aria-modal="true" aria-label="{{ $title }}">
    {{-- ديسك توب: من غير تغميق للصفحة — اللوحة بتطلع فوقها بظل بس --}}
        <div class="absolute inset-0 bg-shary-navy/60 lg:bg-transparent" data-sheet-close></div>
    <div class="area-sheet lg:border lg:border-b-0 lg:border-shary-line lg:shadow-[0_-20px_60px_-10px_rgba(18,58,92,0.38)] absolute inset-x-0 bottom-0 flex max-h-[82vh] flex-col rounded-t-[28px] bg-white px-5 pb-5 pt-3 lg:mx-auto lg:max-h-[80vh] lg:w-[900px] lg:px-10 lg:pb-9 lg:pt-4">
        <span class="mx-auto mb-3 block h-1.5 w-11 shrink-0 rounded-full bg-shary-form" aria-hidden="true"></span>
        <h3 class="shrink-0 text-[20px] font-semibold leading-normal lg:mb-2 lg:text-[24px]">{{ $title }}</h3>
        <div class="shary-scroll mt-1 min-h-0 flex-1 overflow-y-auto pe-1 lg:grid lg:grid-cols-2 lg:content-start lg:gap-x-10">
            @foreach ($options as $option)
                <label class="flex min-h-[60px] cursor-pointer items-center gap-3 border-b border-shary-line py-2 last:border-b-0 lg:min-h-[68px]">
                    @if (!empty($option['logo']))
                        <img src="{{ $option['logo'] }}" alt="" class="h-11 w-11 shrink-0 rounded-full border border-shary-line bg-white object-contain" loading="lazy" onerror="this.onerror=null;this.classList.add('hidden');this.nextElementSibling.classList.remove('hidden')">
                        <span class="hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-shary-navy text-[11px] font-bold leading-none text-white" dir="ltr">{{ $option['short'] ?? '' }}</span>
                    @else
                        <img src="{{ $option['image'] ?? '' }}" alt="" class="h-11 w-11 shrink-0 rounded-full bg-shary-image object-cover" loading="lazy" data-fallback="{{ $option['image_fallback'] ?? '' }}" onerror="this.onerror=null;this.src=this.dataset.fallback">
                    @endif
                    <span class="min-w-0 flex-1 truncate text-[15px] font-semibold leading-normal lg:text-[16px]">{{ $option['label'] }}</span>
                    <input type="checkbox" name="{{ $sheet }}[]" value="{{ $option['value'] }}" class="h-[22px] w-[22px] shrink-0 cursor-pointer accent-shary-link" {{ in_array((string) $option['value'], $chosen) ? 'checked' : '' }}>
                </label>
            @endforeach
        </div>
        <button type="button" class="mt-4 flex h-14 shrink-0 items-center justify-center rounded-full bg-shary-action lg:mx-auto lg:mt-6 lg:w-[360px] text-[17px] font-bold leading-normal text-white transition-colors hover:bg-shary-link" data-sheet-apply>{{ __('areas.apply') }}</button>
    </div>
</div>
