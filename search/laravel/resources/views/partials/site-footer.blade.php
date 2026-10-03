{{--
    فوتر الموقع (بنفس شكل shary.eg).
    موبايل: المجموعات تحت بعض وكل واحدة بتفتح وتقفل، وتحتها اللوجو وبيانات التواصل والسوشيال والتطبيق في النص (من غير سطر حقوق النشر).
    ديسك توب: المجموعات جنب بعض في 5 أعمدة، تحتها اللوجو وبيانات التواصل يمين والتطبيق شمال، وآخر سطر حقوق النشر والروابط.
    المتغيرات: $footerGroups = [['title' => 'المناطق', 'links' => [['label', 'url'], ...]], ...]
               $footerLinks = [['label', 'url'], ...] (السطر الأخير) ، $contact = ['phone', 'phone_display', 'email']
               $socialLinks = [['label', 'url', 'icon' => اسم أيقونة Font Awesome زي 'fa-facebook-f'], ...] ، $appLinks = ['google_play' => '', 'app_store' => '']
    لو الموقع عنده فوتر جاهز: استخدموه واستغنوا عن الملف ده.
--}}
<footer class="bg-white mt-6 border-t border-shary-line">
    <div class="site-container pb-8 lg:pb-14 lg:pt-12">
        <div class="lg:grid lg:grid-cols-5 lg:gap-8">
            @foreach (($footerGroups ?? []) as $group)
                <div class="border-b border-shary-line lg:border-b-0">
                    <button type="button" class="flex w-full items-center justify-between py-3.5 text-start text-[17px] font-bold leading-normal lg:pointer-events-none lg:py-0 lg:text-[16px]" data-footer-toggle aria-expanded="false">
                        <span>{{ $group['title'] }}</span>
                        <img src="{{ asset('images/shary/icons/chevron-down-sm.svg') }}" alt="" width="18" height="18" class="lg:hidden">
                    </button>

                    <ul class="hidden flex-col gap-2.5 pb-4 text-[14px] font-semibold leading-normal text-shary-muted lg:flex lg:gap-3 lg:pb-0 lg:pt-4">
                        @foreach ($group['links'] as $link)
                            <li><a href="{{ $link['url'] }}" class="hover:text-shary-link active:text-shary-link">{{ $link['label'] }}</a></li>
                        @endforeach
                    </ul>
                </div>
            @endforeach
        </div>

        <div class="flex flex-col items-center gap-5 pt-7 text-center lg:flex-row lg:items-end lg:justify-between lg:gap-6 lg:pt-12 lg:text-start">
            <div class="flex flex-col items-center gap-3 lg:items-start lg:gap-2.5">
                <a href="{{ url('/') }}" aria-label="{{ __('blog.home_aria') }}">
                    <img src="{{ asset('images/shary/shary-logo.svg') }}" alt="Shary" width="158" height="38" class="h-[38px] w-auto lg:h-[52px]">
                </a>
                <p class="text-[15px] font-medium leading-normal lg:text-[14px]">{{ __('blog.company_type') }}</p>
                <p class="text-[15px] font-medium leading-normal lg:text-[14px]">{{ __('blog.contact_us') }} <a href="tel:{{ $contact['phone'] ?? '' }}" class="hover:text-shary-link active:text-shary-link" dir="ltr">{{ $contact['phone_display'] ?? ($contact['phone'] ?? '') }}</a></p>
                <p class="text-[15px] font-medium leading-normal lg:text-[14px]">{{ __('blog.email_label') }} <a href="mailto:{{ $contact['email'] ?? '' }}" class="hover:text-shary-link active:text-shary-link" dir="ltr">{{ $contact['email'] ?? '' }}</a></p>

                {{-- أيقونات السوشيال من مكتبة Font Awesome (السكربت في الـ layout). لو المكتبة ما اتحملتش بيظهر الاسم مكتوب --}}
                <ul class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-2 min-[380px]:gap-x-5 lg:justify-start lg:gap-x-4 lg:pt-1">
                    @foreach (($socialLinks ?? []) as $social)
                        <li>
                            <a href="{{ $social['url'] }}" class="social-link flex h-9 items-center text-[26px] leading-none transition-colors duration-200 hover:text-shary-link active:text-shary-link lg:text-[22px]" target="_blank" rel="noopener" aria-label="{{ $social['label'] }}">
                                <i class="fa-brands {{ $social['icon'] }}" aria-hidden="true"></i>
                                <span class="social-label text-[13px] font-bold leading-normal">{{ $social['label'] }}</span>
                            </a>
                        </li>
                    @endforeach
                </ul>
            </div>

            <div class="flex flex-col items-center gap-3 lg:items-end">
                <p class="text-[16px] font-medium leading-normal lg:text-[15px] lg:font-bold">{{ __('blog.download_app') }}</p>
                {{-- زراير المتاجر: App Store شمال و Google Play يمين --}}
                <div class="flex gap-3" dir="ltr">
                    <a href="{{ $appLinks['app_store'] ?? '#' }}" class="flex h-[46px] items-center gap-2 rounded-lg border-[1.5px] border-shary-navy bg-white px-3 transition-colors duration-200 hover:bg-shary-form" aria-label="Download on the App Store">
                        <i class="fa-brands fa-apple text-[26px] leading-none" aria-hidden="true"></i>
                        <span class="flex flex-col text-left">
                            <span class="text-[8px] font-semibold uppercase leading-[1.3] tracking-wide">Download on the</span>
                            <span class="text-[15px] font-bold leading-[1.2]">App Store</span>
                        </span>
                    </a>
                    <a href="{{ $appLinks['google_play'] ?? '#' }}" class="flex h-[46px] items-center gap-2 rounded-lg border-[1.5px] border-shary-navy bg-white px-3 transition-colors duration-200 hover:bg-shary-form" aria-label="Get it on Google Play">
                        <i class="fa-brands fa-google-play text-[21px] leading-none" aria-hidden="true"></i>
                        <span class="flex flex-col text-left">
                            <span class="text-[8px] font-semibold uppercase leading-[1.3] tracking-wide">Get it on</span>
                            <span class="text-[15px] font-bold leading-[1.2]">Google Play</span>
                        </span>
                    </a>
                </div>
            </div>
        </div>

        {{-- سطر حقوق النشر والروابط: في الديسك توب بس (زي الموقع) --}}
        <div class="mt-8 hidden flex-wrap items-center gap-x-8 gap-y-2 border-t border-shary-line pt-6 text-[14px] font-semibold leading-normal lg:flex">
            <p>{{ __('blog.copyright', ['year' => date('Y')]) }}</p>
            @foreach (($footerLinks ?? []) as $link)
                <a href="{{ $link['url'] }}" class="hover:text-shary-link active:text-shary-link">{{ $link['label'] }}</a>
            @endforeach
        </div>
    </div>
</footer>
