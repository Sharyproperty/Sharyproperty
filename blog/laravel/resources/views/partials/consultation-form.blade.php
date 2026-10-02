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
            <h2 class="text-[21px] font-bold leading-normal {{ !empty($compact) ? 'lg:text-[20px]' : '' }}">هل تحتاج استشارة عقارية؟</h2>
            <p class="text-[14px] font-semibold leading-normal text-shary-muted {{ !empty($compact) ? 'lg:text-[13px]' : '' }}">املأ بياناتك وسيتواصل معك مستشار عقاري</p>
        </div>

        <input type="text" name="name" placeholder="الاسم" aria-label="الاسم" required class="h-[54px] w-full rounded-[10px] border-0 bg-white px-4 text-right text-[16px] font-bold text-shary-navy placeholder:font-semibold placeholder:text-shary-hint focus:outline-none focus:ring-2 focus:ring-shary-teal">

        <div class="relative w-full">
            <select name="area" aria-label="المنطقة" class="h-[54px] w-full appearance-none rounded-[10px] border-0 bg-white px-4 text-[16px] font-bold text-shary-navy focus:outline-none focus:ring-2 focus:ring-shary-teal">
                @foreach (($areas ?? []) as $area)
                    <option value="{{ $area }}">{{ $area }}</option>
                @endforeach
            </select>
            <img src="{{ asset('images/shary/icons/chevron-down-sm.svg') }}" alt="" width="18" height="18" class="pointer-events-none absolute left-4 top-[18px]">
        </div>

        {{-- رقم الهاتف + كود الدولة (العلم على الشمال). الحقل المخفي country_code بيتبعت مع الفورم --}}
        <div class="relative w-full" data-phone-field>
            <div class="flex h-[54px] w-full items-center rounded-[10px] bg-white focus-within:ring-2 focus-within:ring-shary-teal">
                <input type="tel" name="phone" dir="ltr" placeholder="رقم الهاتف" aria-label="رقم الهاتف" required class="h-full min-w-0 flex-1 rounded-[10px] border-0 bg-transparent px-4 text-right text-[16px] font-bold text-shary-navy placeholder:font-semibold placeholder:text-shary-hint focus:outline-none">

                <button type="button" class="flex h-full shrink-0 items-center gap-1.5 rounded-[10px] pl-4 pr-2" data-phone-toggle aria-haspopup="listbox" aria-expanded="false" aria-label="كود الدولة">
                    <span class="text-[15px] font-bold leading-normal text-shary-navy" dir="ltr" data-phone-code>{{ $phoneCountries[0]['code'] }}</span>
                    <img src="{{ asset('images/shary/icons/chevron-down-sm.svg') }}" alt="" width="14" height="14">
                    <img src="{{ asset('images/shary/flags/' . $phoneCountries[0]['iso'] . '.svg') }}" alt="" width="26" height="20" class="h-5 w-[26px] rounded-[3px] border border-shary-line object-cover" data-phone-flag>
                </button>
            </div>

            <input type="hidden" name="country_code" value="{{ $phoneCountries[0]['code'] }}" data-phone-value>

            <ul class="absolute inset-x-0 top-[60px] z-20 hidden max-h-[236px] overflow-y-auto rounded-[10px] border border-shary-line bg-white py-1 shadow-lg" role="listbox" aria-label="كود الدولة" data-phone-list>
                @foreach ($phoneCountries as $index => $country)
                    <li role="option" tabindex="-1" data-code="{{ $country['code'] }}" aria-selected="{{ $index === 0 ? 'true' : 'false' }}" class="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-[15px] font-bold leading-normal text-shary-navy hover:bg-shary-form focus:bg-shary-form focus:outline-none">
                        <img src="{{ asset('images/shary/flags/' . $country['iso'] . '.svg') }}" alt="" width="26" height="20" class="h-5 w-[26px] shrink-0 rounded-[3px] border border-shary-line object-cover" loading="lazy">
                        <span class="min-w-0 flex-1">{{ $country['name'] }}</span>
                        <span class="text-shary-muted" dir="ltr">{{ $country['code'] }}</span>
                    </li>
                @endforeach
            </ul>
        </div>

        <textarea name="message" placeholder="رسالتك" aria-label="رسالتك" class="h-24 w-full resize-none rounded-[10px] border-0 bg-white px-4 pt-3.5 text-right text-[16px] font-bold leading-[1.3] text-shary-navy placeholder:font-semibold placeholder:text-shary-hint focus:outline-none focus:ring-2 focus:ring-shary-teal"></textarea>

        <button type="submit" class="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[10px] bg-shary-action text-[18px] font-bold leading-[1.2] text-white">
            <img src="{{ asset('images/shary/icons/send.svg') }}" alt="" width="20" height="20">
            <span>إرسال</span>
        </button>
    </form>

    <div class="flex flex-col gap-3">
        <a href="{{ $meetingUrl ?? '#' }}" class="flex h-[54px] items-center justify-center gap-2.5 rounded-[10px] border-[1.5px] border-shary-navy bg-white text-[18px] font-bold leading-[1.2] text-shary-navy">
            <img src="{{ asset('images/shary/icons/calendar.svg') }}" alt="" width="20" height="20">
            <span>طلب مقابلة</span>
        </a>

        <div class="flex gap-3">
            <a href="tel:{{ $contact['phone'] ?? '' }}" class="flex h-[54px] min-w-0 flex-1 items-center justify-center gap-2.5 rounded-[10px] bg-shary-action text-[18px] font-bold leading-[1.2] text-white">
                <img src="{{ asset('images/shary/icons/phone.svg') }}" alt="" width="20" height="20">
                <span>اتصال</span>
            </a>
            <a href="https://wa.me/{{ $contact['whatsapp'] ?? '' }}" target="_blank" rel="noopener" class="flex h-[54px] min-w-0 flex-1 items-center justify-center gap-2.5 rounded-[10px] bg-shary-whatsapp text-[18px] font-bold leading-[1.2] text-white">
                <img src="{{ asset('images/shary/icons/whatsapp.svg') }}" alt="" width="20" height="20">
                <span>اتصل بنا</span>
            </a>
        </div>
    </div>
</div>
