{{--
    فورم الاستشارة + زراير التواصل
    المتغيرات: $consultationAction (لينك استقبال الفورم) ، $areas (قايمة المناطق) ،
               $phoneCountries = [['name' => 'مصر', 'iso' => 'eg', 'code' => '+20'], ...] (أول دولة هي الافتراضية) ،
               $meetingUrl (لينك طلب مقابلة) ، $contact = ['phone' => '', 'whatsapp' => ''] ،
               $compact (اختياري: true في العمود الجانبي لصفحة المقال — العنوان أصغر سِنّة على الديسك توب)
--}}
<div class="flex flex-col gap-3.5">
    <form action="{{ $consultationAction ?? '#' }}" method="POST" class="flex flex-col items-center gap-3.5 rounded-xl bg-shary-form px-4 pb-[18px] pt-6">
        @csrf

        <div class="flex flex-col items-center gap-1 text-center">
            <img src="{{ asset('images/shary/icons/headset.svg') }}" alt="" width="34" height="34">
            <h2 class="text-[21px] font-bold leading-normal {{ !empty($compact) ? 'lg:text-[20px]' : '' }}">{{ __('blog.form_title') }}</h2>
            <p class="text-[14px] font-semibold leading-normal text-shary-muted {{ !empty($compact) ? 'lg:text-[13px]' : '' }}">{{ __('blog.form_subtitle') }}</p>
        </div>

        <input type="text" name="name" placeholder="{{ __('blog.name') }}" aria-label="{{ __('blog.name') }}" required class="h-[54px] w-full rounded-[10px] border-0 bg-white px-4 text-start text-[16px] font-bold text-shary-navy placeholder:font-semibold placeholder:text-shary-hint focus:outline-none focus:ring-2 focus:ring-shary-teal">

        <div class="relative w-full">
            <select name="area" aria-label="{{ __('blog.area') }}" class="h-[54px] w-full appearance-none rounded-[10px] border-0 bg-white px-4 text-[16px] font-bold text-shary-navy focus:outline-none focus:ring-2 focus:ring-shary-teal">
                @foreach (($areas ?? []) as $area)
                    <option value="{{ $area }}">{{ $area }}</option>
                @endforeach
            </select>
            <img src="{{ asset('images/shary/icons/chevron-down-sm.svg') }}" alt="" width="18" height="18" class="pointer-events-none absolute end-4 top-[18px]">
        </div>

        {{-- رقم الهاتف + كود الدولة (العلم على الشمال في العربي والإنجليزي). الحقل المخفي country_code بيتبعت مع الفورم --}}
        <div class="relative w-full" data-phone-field>
            <div class="flex h-[54px] w-full items-center rounded-[10px] bg-white focus-within:ring-2 focus-within:ring-shary-teal ltr:flex-row-reverse">
                <input type="tel" name="phone" dir="ltr" placeholder="{{ __('blog.phone') }}" aria-label="{{ __('blog.phone') }}" required class="h-full min-w-0 flex-1 rounded-[10px] border-0 bg-transparent px-4 text-left rtl:text-right text-[16px] font-bold text-shary-navy placeholder:font-semibold placeholder:text-shary-hint focus:outline-none">

                <button type="button" class="flex h-full shrink-0 items-center gap-1.5 rounded-[10px] pe-4 ps-2 ltr:flex-row-reverse ltr:pe-2 ltr:ps-4" data-phone-toggle aria-haspopup="listbox" aria-expanded="false" aria-label="{{ __('blog.country_code') }}">
                    <span class="text-[15px] font-bold leading-normal text-shary-navy" dir="ltr" data-phone-code>{{ $phoneCountries[0]['code'] }}</span>
                    <img src="{{ asset('images/shary/icons/chevron-down-sm.svg') }}" alt="" width="14" height="14">
                    <img src="{{ asset('images/shary/flags/' . $phoneCountries[0]['iso'] . '.svg') }}" alt="" width="26" height="20" class="h-5 w-[26px] rounded-[3px] border border-shary-line object-cover" data-phone-flag>
                </button>
            </div>

            <input type="hidden" name="country_code" value="{{ $phoneCountries[0]['code'] }}" data-phone-value>

            <ul class="shary-scroll absolute inset-x-0 top-[60px] z-20 hidden max-h-[236px] overflow-y-auto rounded-[10px] border border-shary-line bg-white py-1 shadow-lg" role="listbox" aria-label="{{ __('blog.country_code') }}" data-phone-list>
                @foreach ($phoneCountries as $index => $country)
                    <li role="option" tabindex="-1" data-code="{{ $country['code'] }}" aria-selected="{{ $index === 0 ? 'true' : 'false' }}" class="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-[15px] font-bold leading-normal text-shary-navy hover:bg-shary-form focus:bg-shary-form focus:outline-none">
                        <img src="{{ asset('images/shary/flags/' . $country['iso'] . '.svg') }}" alt="" width="26" height="20" class="h-5 w-[26px] shrink-0 rounded-[3px] border border-shary-line object-cover" loading="lazy">
                        <span class="min-w-0 flex-1">{{ $country['name'] }}</span>
                        <span class="text-shary-muted" dir="ltr">{{ $country['code'] }}</span>
                    </li>
                @endforeach
            </ul>
        </div>

        <textarea name="message" placeholder="{{ __('blog.message') }}" aria-label="{{ __('blog.message') }}" class="h-24 w-full resize-none rounded-[10px] border-0 bg-white px-4 pt-3.5 text-start text-[16px] font-bold leading-[1.3] text-shary-navy placeholder:font-semibold placeholder:text-shary-hint focus:outline-none focus:ring-2 focus:ring-shary-teal"></textarea>

        <button type="submit" class="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[10px] bg-shary-action text-[18px] font-bold leading-[1.2] text-white">
            <img src="{{ asset('images/shary/icons/send.svg') }}" alt="" width="20" height="20">
            <span>{{ __('blog.send') }}</span>
        </button>
    </form>

    <div class="flex flex-col gap-3">
        {{-- "طلب مقابلة" بيفتح فورم طلب الاجتماع (partials/meeting-modal) --}}
        <a href="{{ $meetingUrl ?? '#' }}" data-meeting-open class="flex h-[54px] items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] border-shary-navy bg-white text-[18px] font-bold leading-[1.2] text-shary-navy">
            <img src="{{ asset('images/shary/icons/calendar.svg') }}" alt="" width="20" height="20">
            <span>{{ __('blog.meeting') }}</span>
        </a>

        <div class="flex gap-3">
            <a href="tel:{{ $contact['phone'] ?? '' }}" class="flex h-[54px] min-w-0 flex-1 items-center justify-center gap-2.5 rounded-[10px] bg-shary-action text-[18px] font-bold leading-[1.2] text-white">
                <img src="{{ asset('images/shary/icons/phone.svg') }}" alt="" width="20" height="20">
                <span>{{ __('blog.call') }}</span>
            </a>
            <a href="https://wa.me/{{ $contact['whatsapp'] ?? '' }}" target="_blank" rel="noopener" class="flex h-[54px] min-w-0 flex-1 items-center justify-center gap-2.5 rounded-[10px] bg-shary-whatsapp text-[18px] font-bold leading-[1.2] text-white">
                {{-- أيقونة واتساب من مكتبة Font Awesome (نفس المكتبة بتاعة أيقونات السوشيال في الفوتر) --}}
                <i class="fa-brands fa-whatsapp text-[24px] leading-none" aria-hidden="true"></i>
                <span>{{ __('blog.whatsapp_cta') }}</span>
            </a>
        </div>
    </div>
</div>
