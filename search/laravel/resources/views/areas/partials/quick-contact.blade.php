{{--
    التواصل السريع:
    - موبايل: شريط ثابت تحت الشاشة فيه 3 زراير بنفس العرض: اتصال ، واتساب ، Shary AI (زي تصميم "كول أكشن" على فيجما).
    - ديسك توب: زرارين دايرة ثابتين على يمين الشاشة (Shary AI ، واتساب) من غير زرار اتصال، واسم كل زرار بيظهر مع الماوس.
    - زرار Shary AI (data-ask-ai) بيفتح صفحة Shary AI من تحت (partials/ai-panel.blade.php). لو السكربت مش محمّل بيفتح $aiUrl.
    المتغيرات: $contact = ['phone', 'whatsapp'] ، $aiUrl (لينك Shary AI)
--}}
<div class="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 gap-2 border-t border-shary-line bg-white px-2.5 pb-[calc(10px+env(safe-area-inset-bottom,0px))] pt-[11px] shadow-[0_-8px_22px_-16px_rgba(18,58,92,0.4)] lg:hidden" data-quick-bar aria-label="{{ __('areas.quick_contact') }}">
    <a href="tel:{{ $contact['phone'] ?? '' }}" class="flex h-12 items-center justify-center gap-2 rounded-xl bg-shary-action text-[15px] font-bold leading-normal text-white">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z"/></svg>
        <span>{{ __('areas.call') }}</span>
    </a>
    <a href="https://wa.me/{{ $contact['whatsapp'] ?? '' }}" target="_blank" rel="noopener" class="flex h-12 items-center justify-center gap-2 rounded-xl bg-shary-whatsapp text-[15px] font-bold leading-normal text-white">
        <i class="fa-brands fa-whatsapp text-[21px] leading-none" aria-hidden="true"></i>
        <span>{{ __('areas.whatsapp') }}</span>
    </a>
    <a href="{{ $aiUrl ?? '#' }}" class="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#1F5FC4] to-[#5AA9EE] text-[14px] font-bold leading-normal text-white" data-ask-ai>
        <span class="flex h-[26px] w-7 shrink-0 items-center justify-center rounded-lg bg-white" aria-hidden="true">
            <img src="{{ asset('images/shary/logo-mark.svg') }}" alt="" width="20" height="17">
        </span>
        <span dir="ltr">Shary AI</span>
    </a>
</div>

<div class="fixed bottom-28 right-7 z-30 hidden flex-col gap-3.5 lg:flex" aria-label="{{ __('areas.quick_contact') }}">
    <a href="{{ $aiUrl ?? '#' }}" class="area-fab area-ai" aria-label="{{ __('areas.ask_ai') }}" data-ask-ai>
        <img src="{{ asset('images/shary/logo-mark.svg') }}" alt="" width="38" height="31">
        <span class="area-fab__label">{{ __('areas.ask_ai') }}</span>
    </a>
    <a href="https://wa.me/{{ $contact['whatsapp'] ?? '' }}" target="_blank" rel="noopener" class="area-fab bg-shary-whatsapp text-white" aria-label="{{ __('areas.whatsapp') }}">
        <i class="fa-brands fa-whatsapp text-[32px] leading-none" aria-hidden="true"></i>
        <span class="area-fab__label">{{ __('areas.whatsapp') }}</span>
    </a>
</div>

@include('partials.compare-bar')
@include('partials.ai-panel')
