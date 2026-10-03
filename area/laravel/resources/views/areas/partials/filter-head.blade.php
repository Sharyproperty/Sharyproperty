{{-- عنوان قسم جوه صفحة "تصفية": أيقونة + العنوان + خط أزرق + "مسح" بيفضّي القسم. $title ، $icon = مسارات الـ SVG --}}
<div class="mb-4 flex items-start justify-between gap-3">
    <div class="flex items-center gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-shary-form text-shary-link" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{!! $icon !!}</svg>
        </span>
        <h4 class="relative pb-2 text-[18px] font-bold leading-normal text-shary-navy after:absolute after:bottom-0 after:start-0 after:h-[3px] after:w-11 after:rounded-full after:bg-[#a9c4ec]">{{ $title }}</h4>
    </div>
    <button type="button" class="mt-1.5 text-[14px] font-medium leading-normal text-shary-link hover:underline" data-filter-clear>{{ __('areas.clear') }}</button>
</div>
