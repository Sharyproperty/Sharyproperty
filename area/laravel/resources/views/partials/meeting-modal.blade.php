{{--
    فورم "طلب اجتماع" — بيفتح لما العميل يضغط "طلب مقابلة" (أي عنصر عليه data-meeting-open).
    موبايل: بيطلع من تحت (Bottom sheet). ديسك توب: نفس الفورم بحجمه في نص الشاشة فوق الصفحة، من غير تغميق — الصفحة بتفضل ظاهرة وراه.
    الحقول اللي بتتبعت: meeting_type (zoom | in_person) ، name ، country_code ، phone ، meeting_date (YYYY-MM-DD) ، meeting_time (HH:MM)
    المتغيرات: $meetingUrl (لينك استقبال الطلب) ، $phoneCountries ، $meetingTimes = [['value' => '10:00', 'label' => '10:00 ص'], ...]
    الأيام: السبع أيام الجاية بيرسمها js/shary/meeting-modal.js من القالب اللي تحت. لو المواعيد المتاحة جاية من الباك إند،
    ارسموا الزراير هنا مباشرة بنفس الـ classes وعليها data-meeting-day="YYYY-MM-DD" والسكربت هيشتغل عليها زي ما هي.
--}}
<!-- meeting-modal -->
<div class="fixed inset-0 z-50 hidden" data-meeting-modal role="dialog" aria-modal="true" aria-labelledby="meeting-title">
    {{-- موبايل: تغميق ورا اللوحة. ديسك توب: من غير تغميق — الصفحة بتفضل ظاهرة ورا الفورم (الضغط براه بيقفله) --}}
    <div class="absolute inset-0 bg-shary-navy/60 lg:bg-transparent" data-meeting-close></div>

    <div class="meeting-panel shary-scroll absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[28px] bg-white px-5 pb-6 pt-3 lg:inset-0 lg:m-auto lg:h-fit lg:max-h-[calc(100vh-48px)] lg:w-[560px] lg:rounded-[24px] lg:px-7 lg:pb-7 lg:pt-6 lg:shadow-[0_40px_110px_-24px_rgba(15,47,75,0.6),0_0_0_1px_rgba(18,58,92,0.1)]">
        <span class="mx-auto mb-3 block h-1.5 w-11 rounded-full bg-shary-line lg:hidden" aria-hidden="true"></span>

        <div class="flex items-center justify-between">
            <h2 id="meeting-title" class="text-[22px] font-semibold leading-normal">{{ __('blog.meeting_title') }}</h2>
            <button type="button" class="flex h-10 w-10 items-center justify-center rounded-full text-shary-action transition-colors hover:text-shary-link" data-meeting-close aria-label="{{ __('blog.close') }}">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true"><circle cx="15" cy="15" r="13" stroke="currentColor" stroke-width="2"/><path d="M10.5 10.5L19.5 19.5M19.5 10.5L10.5 19.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
        </div>

        <form action="{{ $meetingUrl ?? '#' }}" method="POST" class="mt-4 flex flex-col gap-4" data-meeting-form>
            @csrf
            <input type="hidden" name="meeting_type" value="zoom" data-meeting-type>
            <input type="hidden" name="meeting_date" value="" data-meeting-date>
            <input type="hidden" name="meeting_time" value="{{ $meetingTimes[0]['value'] ?? '' }}" data-meeting-time>

            {{-- نوع الاجتماع --}}
            <div class="grid grid-cols-2 gap-1 rounded-[16px] bg-shary-form p-1.5" role="group" aria-label="{{ __('blog.meeting_title') }}">
                <button type="button" class="h-11 rounded-[12px] text-[15px] font-bold leading-normal text-shary-navy transition-colors aria-pressed:bg-shary-action aria-pressed:text-white" data-meeting-type-option="zoom" aria-pressed="true">{{ __('blog.meeting_zoom') }}</button>
                <button type="button" class="h-11 rounded-[12px] text-[15px] font-bold leading-normal text-shary-navy transition-colors aria-pressed:bg-shary-action aria-pressed:text-white" data-meeting-type-option="in_person" aria-pressed="false">{{ __('blog.meeting_in_person') }}</button>
            </div>

            <label class="flex flex-col gap-2">
                <span class="text-[15px] font-bold leading-normal">{{ __('blog.name') }} <span class="text-red-600" aria-hidden="true">*</span></span>
                <input type="text" name="name" required autocomplete="name" class="h-[52px] w-full rounded-full border border-shary-cloud bg-shary-form px-5 text-start text-[16px] font-semibold text-shary-navy focus:outline-none focus:ring-2 focus:ring-shary-link">
            </label>

            <div class="flex flex-col gap-2">
                <span class="text-[15px] font-bold leading-normal">{{ __('blog.phone_label') }} <span class="text-red-600" aria-hidden="true">*</span></span>

                <div class="relative flex gap-2.5" data-phone-field>
                    <button type="button" class="flex h-[52px] shrink-0 items-center gap-2 rounded-full border border-shary-cloud bg-shary-form px-4" data-phone-toggle aria-haspopup="listbox" aria-expanded="false" aria-label="{{ __('blog.country_code') }}">
                        <img src="{{ asset('images/shary/flags/' . $phoneCountries[0]['iso'] . '.svg') }}" alt="" width="26" height="20" class="h-5 w-[26px] rounded-[3px] border border-shary-line object-cover" data-phone-flag>
                        <span class="text-[15px] font-bold leading-normal text-shary-navy" dir="ltr" data-phone-code>{{ $phoneCountries[0]['code'] }}</span>
                        <img src="{{ asset('images/shary/icons/chevron-down-sm.svg') }}" alt="" width="14" height="14">
                    </button>

                    <input type="tel" name="phone" dir="ltr" required autocomplete="tel-national" aria-label="{{ __('blog.phone') }}" class="h-[52px] min-w-0 flex-1 rounded-full border border-shary-cloud bg-shary-form px-5 text-left text-[16px] font-semibold text-shary-navy focus:outline-none focus:ring-2 focus:ring-shary-link rtl:text-right">

                    <input type="hidden" name="country_code" value="{{ $phoneCountries[0]['code'] }}" data-phone-value>

                    <ul class="shary-scroll absolute inset-x-0 top-[58px] z-10 hidden max-h-[200px] overflow-y-auto rounded-[14px] border border-shary-line bg-white py-1 shadow-lg" role="listbox" aria-label="{{ __('blog.country_code') }}" data-phone-list>
                        @foreach ($phoneCountries as $index => $country)
                            <li role="option" tabindex="-1" data-code="{{ $country['code'] }}" aria-selected="{{ $index === 0 ? 'true' : 'false' }}" class="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-[15px] font-bold leading-normal text-shary-navy hover:bg-shary-form focus:bg-shary-form focus:outline-none">
                                <img src="{{ asset('images/shary/flags/' . $country['iso'] . '.svg') }}" alt="" width="26" height="20" class="h-5 w-[26px] shrink-0 rounded-[3px] border border-shary-line object-cover" loading="lazy">
                                <span class="min-w-0 flex-1">{{ $country['name'] }}</span>
                                <span class="text-shary-muted" dir="ltr">{{ $country['code'] }}</span>
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>

            {{-- الأيام المتاحة --}}
            <div class="flex flex-col gap-2">
                <span class="text-[15px] font-bold leading-normal">{{ __('blog.meeting_pick_date') }}</span>
                <div class="shary-scroll flex gap-2 overflow-x-auto pb-2.5 lg:grid lg:grid-cols-7 lg:gap-1.5 lg:overflow-visible lg:pb-0" data-meeting-days data-count="7"></div>
                <template data-meeting-day-template>
                    <button type="button" class="flex h-[64px] min-w-[76px] shrink-0 lg:min-w-0 flex-col items-center justify-center gap-0.5 rounded-[16px] border border-shary-line bg-white px-2 text-shary-navy transition-colors aria-pressed:border-shary-action aria-pressed:bg-shary-action aria-pressed:text-white" aria-pressed="false">
                        <span class="text-[14px] font-bold leading-normal" data-meeting-day-name></span>
                        <span class="text-[12px] font-semibold leading-normal opacity-70" data-meeting-day-date></span>
                    </button>
                </template>
            </div>

            {{-- الأوقات المتاحة --}}
            <div class="flex flex-col gap-2">
                <span class="text-[15px] font-bold leading-normal">{{ __('blog.meeting_pick_time') }}</span>
                <div class="shary-scroll flex gap-2 overflow-x-auto pb-2.5 lg:grid lg:grid-cols-4 lg:gap-2 lg:overflow-visible lg:pb-0">
                    @foreach (($meetingTimes ?? []) as $index => $time)
                        <button type="button" class="h-11 shrink-0 whitespace-nowrap rounded-full border border-shary-line bg-white px-4 lg:px-0 text-[14px] font-semibold leading-normal text-shary-navy transition-colors aria-pressed:border-shary-action aria-pressed:bg-shary-action aria-pressed:text-white" data-meeting-time-option="{{ $time['value'] }}" aria-pressed="{{ $index === 0 ? 'true' : 'false' }}">{{ $time['label'] }}</button>
                    @endforeach
                </div>
            </div>

            <button type="submit" class="mt-1 flex h-[54px] w-full items-center justify-center rounded-full bg-shary-action text-[18px] font-bold leading-[1.2] text-white transition-colors hover:bg-shary-link ">
                <span>{{ __('blog.send') }}</span>
            </button>
        </form>
    </div>
</div>
<!-- /meeting-modal -->
