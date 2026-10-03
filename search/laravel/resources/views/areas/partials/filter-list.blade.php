{{--
    لوحة اختيار بتطلع من تحت: صورة دايرة (لوجو المطور / صورة المشروع / صورة المنطقة) + الاسم + مربع الاختيار في الطرف.
    $sheet = اسم اللوحة والحقل (developer | project | area) ، $title ، $options = [['value', 'label', 'image' أو 'logo', 'image_fallback', 'short'], ...] ، $chosen
    اختياري (صفحة البحث): $searchable = خانة بحث فوق القايمة ، $dialog = true: على الديسك توب نافذة في نص الشاشة (من غير تغميق) بدل اللوحة اللي تحت ،
                           $applyLabel = نص زرار التطبيق (مثلاً "إضافة").
    صفحة البحث على الديسك توب: القايمة نفسها [data-list-body] بتتعرض في عمود الفلاتر ([data-inline-list] — أول 3 اختيارات)، و"عرض المزيد" بيفتح النافذة دي بالقايمة كلها — نفس الحقول من غير تكرار.
--}}
<div class="fixed inset-0 z-[60] hidden" data-filter-sheet="{{ $sheet }}" role="dialog" aria-modal="true" aria-label="{{ $title }}">
    {{-- ديسك توب: من غير تغميق للصفحة — اللوحة بتطلع فوقها بظل بس --}}
        <div class="absolute inset-0 bg-shary-navy/60 lg:bg-transparent" data-sheet-close></div>
    <div class="{{ !empty($dialog) ? 'meeting-panel lg:inset-0 lg:m-auto lg:h-fit lg:w-[540px] lg:rounded-[24px] lg:border lg:border-shary-line lg:px-7 lg:pb-7 lg:pt-6 lg:shadow-[0_40px_110px_-24px_rgba(15,47,75,0.6)]' : 'area-sheet lg:mx-auto lg:w-[900px] lg:border lg:border-b-0 lg:border-shary-line lg:px-10 lg:pb-9 lg:pt-4 lg:shadow-[0_-20px_60px_-10px_rgba(18,58,92,0.38)]' }} absolute inset-x-0 bottom-0 flex max-h-[82vh] flex-col rounded-t-[28px] bg-white px-5 pb-5 pt-3 lg:max-h-[80vh]">
        <span class="mx-auto mb-3 block h-1.5 w-11 shrink-0 rounded-full bg-shary-form {{ !empty($dialog) ? 'lg:hidden' : '' }}" aria-hidden="true"></span>
        @if (!empty($dialog))
            <button type="button" class="absolute end-4 top-4 hidden h-10 w-10 items-center justify-center rounded-full bg-shary-soft text-shary-navy transition-colors hover:bg-shary-form hover:text-shary-link lg:flex" data-sheet-close aria-label="{{ __('blog.close') }}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
            </button>
        @endif
        <h3 class="shrink-0 text-[20px] font-semibold leading-normal lg:mb-2 {{ !empty($dialog) ? 'lg:text-[20px] lg:font-bold' : 'lg:text-[24px]' }}">{{ $title }}</h3>
        @if (!empty($searchable))
            <label class="mb-1 mt-2 flex h-12 shrink-0 items-center gap-2.5 rounded-xl border border-shary-line bg-[#f7f9fb] px-3.5 focus-within:border-shary-link">
                <svg class="shrink-0 text-shary-hint" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>
                <span class="sr-only">{{ $searchable }}</span>
                <input type="search" placeholder="{{ $searchable }}" autocomplete="off" class="min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-shary-navy outline-none placeholder:font-medium placeholder:text-shary-hint" data-list-search>
            </label>
        @endif
        <div class="contents" data-list-home>
        <div class="shary-scroll mt-1 min-h-0 flex-1 overflow-y-auto pe-1 {{ empty($dialog) ? 'lg:grid lg:grid-cols-2 lg:content-start lg:gap-x-10' : '' }}" data-list-body="{{ $sheet }}">
            @foreach ($options as $option)
                <label class="flex min-h-[60px] cursor-pointer items-center gap-3 border-b border-shary-line py-2 last:border-b-0 lg:min-h-[68px]">
                    @if (!empty($option['logo']))
                        <img src="{{ $option['logo'] }}" alt="" class="h-11 w-11 shrink-0 rounded-full border border-shary-line bg-white object-contain" loading="lazy" onerror="this.onerror=null;this.classList.add('hidden');this.nextElementSibling.classList.remove('hidden')">
                        <span class="hidden flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-shary-navy text-[11px] font-bold leading-none text-white" dir="ltr">{{ $option['short'] ?? '' }}</span>
                    @elseif (empty($option['image']) && !empty($option['short']))
                        {{-- مطور من غير لوجو: الحروف المختصرة --}}
                        <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-shary-navy text-[11px] font-bold leading-none text-white" dir="ltr">{{ $option['short'] }}</span>
                    @else
                        <img src="{{ $option['image'] ?? '' }}" alt="" class="h-11 w-11 shrink-0 rounded-full bg-shary-image object-cover" loading="lazy" data-fallback="{{ $option['image_fallback'] ?? '' }}" onerror="this.onerror=null;this.src=this.dataset.fallback">
                    @endif
                    <span class="min-w-0 flex-1 truncate text-[15px] font-semibold leading-normal lg:text-[16px]" data-list-name>{{ $option['label'] }}</span>
                    <input type="checkbox" name="{{ $sheet }}[]" value="{{ $option['value'] }}" class="h-[22px] w-[22px] shrink-0 cursor-pointer accent-shary-link" {{ in_array((string) $option['value'], $chosen) ? 'checked' : '' }}>
                </label>
            @endforeach
        </div>
        </div>
        <button type="button" class="mt-4 flex h-14 shrink-0 items-center justify-center rounded-full bg-shary-action {{ !empty($dialog) ? 'lg:h-12 lg:rounded-2xl lg:bg-shary-link lg:hover:bg-shary-action' : 'lg:mx-auto lg:mt-6 lg:w-[360px]' }} text-[17px] font-bold leading-normal text-white transition-colors hover:bg-shary-link" data-sheet-apply>{{ $applyLabel ?? __('areas.apply') }}</button>
    </div>
</div>
