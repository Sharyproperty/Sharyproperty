{{--
    زرار المقارنة العائم: بيظهر تحت لما العميل يضغط "قارن" على أي مشروع، وعليه عدد المشاريع المختارة.
    الضغط عليه بيفتح صفحة المقارنة: $compareUrl?projects=slug1,slug2 (السكربت بيكتب المشاريع في اللينك).
    موبايل: فوق شريط التواصل. ديسك توب: تحت على الشمال.
--}}
<a href="{{ $compareUrl ?? '#' }}" data-base="{{ $compareUrl ?? '#' }}" class="fixed bottom-[84px] left-3 z-30 hidden h-12 items-center gap-2 rounded-full bg-shary-action pe-2 ps-4 text-[14px] font-bold leading-normal text-white shadow-[0_10px_24px_-8px_rgba(18,58,92,0.6)] transition-colors hover:bg-shary-link lg:bottom-7 lg:left-7 lg:h-[52px] lg:text-[15px]" data-compare-bar>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5v19"/><path d="M9 5H6.5A2.5 2.5 0 0 0 4 7.5v9A2.5 2.5 0 0 0 6.5 19H9"/><path d="M15 5h2.5A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5H15V5Z" fill="currentColor"/></svg>
    <span>{{ __('blog.compare_page') }}</span>
    <span class="flex h-8 min-w-[32px] items-center justify-center rounded-full bg-white px-2 text-[14px] font-extrabold text-shary-navy" data-compare-count>0</span>
</a>
