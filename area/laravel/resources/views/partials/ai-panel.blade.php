{{--
    صفحة Shary AI — بتفتح من تحت لما العميل يضغط أي زرار عليه data-ask-ai (زرار Shary AI في شريط التواصل وعلى جنب الشاشة).
    موبايل: بملء الشاشة. ديسك توب: لوحة كبيرة طالعة من تحت.
    المتغيرات:
        $aiUser        = ['name' => اسم العميل, 'avatar' => صورته] لو مسجل دخول (اختياري — من غيره بيظهر "ضيف شاري")
        $aiSuggestions = اختيارات البداية (المناطق) — نصوص
        $aiEndpoint    = لينك استقبال الرسالة (POST JSON {message} والرد JSON {reply}). لو فاضي: اسمعوا حدث shary:ai-send وردّوا بـ event.detail.reply('...')
    السكربت: js/shary/ai-panel.js
--}}
<div class="fixed inset-0 z-[70] hidden" data-ai-panel role="dialog" aria-modal="true" aria-label="Shary AI" data-endpoint="{{ $aiEndpoint ?? '' }}">
    <div class="absolute inset-0 bg-shary-navy/60" data-ai-close></div>

    <div class="area-sheet area-ai-panel absolute inset-0 flex flex-col lg:inset-x-0 lg:bottom-0 lg:top-auto lg:mx-auto lg:h-[88vh] lg:w-[min(980px,94vw)] lg:overflow-hidden lg:rounded-t-[28px]">
        <div class="relative flex h-[92px] shrink-0 items-center justify-center rounded-b-[30px] bg-white shadow-[0_8px_20px_-12px_rgba(18,58,92,0.4)]">
            <button type="button" class="absolute start-3 flex h-11 w-11 items-center justify-center rounded-full text-shary-navy hover:text-shary-link" data-ai-close aria-label="{{ __('blog.close') }}">
                <svg class="ltr:rotate-180" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
            <div class="flex flex-col items-center gap-0.5">
                <img src="{{ asset('images/shary/logo-mark.svg') }}" alt="" width="46" height="38">
                <span class="text-[17px] font-extrabold leading-none text-[#0f5e6a]" dir="ltr">Shary<sup class="ms-0.5 text-[11px] font-bold text-[#9bc53d]">Ai</sup></span>
            </div>
            <button type="button" class="absolute end-3 flex h-11 w-11 items-center justify-center rounded-full text-shary-navy hover:text-shary-link" data-ai-reset aria-label="{{ __('areas.ai_new') }}" title="{{ __('areas.ai_new') }}">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
            </button>
        </div>

        <div class="shary-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-5 lg:px-8" data-ai-scroll>
            {{-- الترحيب باسم العميل --}}
            <div class="area-ai-hello flex items-center gap-3 rounded-full px-2.5 py-2.5 text-white">
                @if (!empty($aiUser['avatar']))
                    <img src="{{ $aiUser['avatar'] }}" alt="" class="h-12 w-12 shrink-0 rounded-full object-cover">
                @else
                    <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20" aria-hidden="true">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.9 3.6-6 8-6s8 2.1 8 6v1H4v-1Z"/></svg>
                    </span>
                @endif
                <span class="min-w-0">
                    <b class="block truncate text-[16px] font-semibold leading-[1.4]">{{ $aiUser['name'] ?? __('areas.ai_guest') }}</b>
                    <small class="block text-[13px] font-medium leading-[1.4] text-white/85">{{ __('areas.ai_hello') }}</small>
                </span>
            </div>

            <div class="mt-4 flex flex-col gap-3" data-ai-messages aria-live="polite">
                <div class="area-ai-msg">
                    <p>{{ __('areas.ai_welcome_1') }}</p>
                    <p>{{ __('areas.ai_welcome_2') }}</p>
                    <p>{{ __('areas.ai_welcome_3') }}</p>
                </div>
            </div>

            <div class="mt-5" data-ai-suggestions>
                <p class="mb-3 text-[15px] font-bold leading-normal text-shary-navy">{{ __('areas.ai_pick') }}</p>
                <div class="flex flex-wrap gap-2.5">
                    @foreach (($aiSuggestions ?? []) as $suggestion)
                        <button type="button" class="area-ai-chip" data-ai-suggest>{{ $suggestion }}</button>
                    @endforeach
                </div>
            </div>
        </div>

        <form class="flex shrink-0 items-center gap-3 px-4 pb-[calc(16px+env(safe-area-inset-bottom,0px))] pt-2 lg:px-8 lg:pb-6" data-ai-form>
            <label class="area-ai-input flex h-14 min-w-0 flex-1 items-center gap-2 rounded-full ps-5 pe-2">
                <span class="sr-only">{{ __('areas.ai_placeholder') }}</span>
                <input type="text" name="message" autocomplete="off" placeholder="{{ __('areas.ai_placeholder') }}" class="min-w-0 flex-1 bg-transparent text-[15px] font-medium leading-normal text-shary-navy outline-none placeholder:text-shary-muted">
                <button type="submit" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#2a8d8a] transition-colors hover:bg-shary-form" aria-label="{{ __('areas.ai_send') }}">
                    <svg class="rtl:-scale-x-100" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 12L4 4.5l3.5 7.5L4 19.5 20.5 12ZM7.5 12h5"/></svg>
                </button>
            </label>
            <button type="button" class="area-ai-mic hidden h-12 w-12 shrink-0 items-center justify-center rounded-full text-[#2a8d8a]" data-ai-mic aria-label="{{ __('areas.ai_mic') }}" aria-pressed="false">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6"/></svg>
            </button>
        </form>
    </div>
</div>
