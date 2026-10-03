{{--
    هيدر الموقع (بنفس شكل shary.eg، من غير الحساب / تسجيل الدخول).
    موبايل: زرار "افتح التطبيق" يمين، اللوجو في النص، زرار اللغة والقائمة شمال.
    ديسك توب: اللوجو يمين وجنبه الروابط، وعلى الشمال علامة المفضلة (قلب) وزرار اللغة (من غير زرار بحث ومن غير إشعارات).
    المفضلة بتظهر في الديسك توب بس: القلب بيبقى أحمر لما الصفحة تتحفظ ($favoriteId).
    الروابط: كحلي، وبتبقى أزرق اللينكات مع الماوس أو الضغط، والصفحة المفتوحة أزرق.
    رابط له 'children' (زي "الوكلاء") بيبقى زرار بسهم بيفتح قايمة صغيرة فيها الروابط الفرعية ("الوكلاء المعتمدون").
    المتغيرات: $navLinks = [['label', 'url', 'active' => bool, 'children' => [['label', 'url'], ...]], ...] ، $appUrl ،
               $langUrl (لينك نفس الصفحة باللغة التانية). النصوص من lang/{ar,en}/blog.php
    لو الموقع عنده هيدر جاهز: استخدموه واستغنوا عن الملف ده.
--}}
<header class="sticky top-0 z-30 rounded-b-[28px] bg-white shadow-[0_6px_18px_rgba(18,58,92,0.10)] lg:rounded-none lg:shadow-[0_2px_10px_rgba(18,58,92,0.06)]">
    <div class="site-container flex items-center justify-between py-3.5 lg:justify-start lg:py-4">
        <a href="{{ $appUrl ?? '#' }}" class="flex h-11 shrink-0 items-center rounded-full bg-shary-action px-3 text-[13px] font-bold leading-normal text-white shadow-[0_4px_10px_rgba(18,58,92,0.28)] min-[380px]:px-4 min-[380px]:text-[14px] lg:hidden">{{ __('blog.open_app') }}</a>

        <a href="{{ url('/') }}" class="shrink-0" aria-label="{{ __('blog.home_aria') }}">
            <img src="{{ asset('images/shary/shary-logo.svg') }}" alt="Shary" width="125" height="30" class="h-[22px] w-auto min-[360px]:h-[26px] min-[380px]:h-[30px] lg:h-9">
        </a>

        <nav class="hidden items-center gap-6 lg:me-auto lg:ms-10 lg:flex" aria-label="{{ __('blog.main_nav') }}">
            @foreach (($navLinks ?? []) as $link)
                @if (!empty($link['children']))
                    <div class="relative" data-nav-dropdown>
                        <button type="button" class="flex items-center gap-1 text-[16px] font-semibold leading-normal text-shary-navy transition-colors hover:text-shary-link active:text-shary-link aria-expanded:text-shary-link" aria-haspopup="true" aria-expanded="false" data-nav-dropdown-toggle>
                            <span>{{ $link['label'] }}</span>
                            <svg class="transition-transform duration-200" data-nav-dropdown-arrow width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <div class="absolute end-0 top-full z-40 mt-4 hidden min-w-[190px] rounded-[12px] border border-shary-line bg-white p-2 shadow-[0_10px_24px_rgba(18,58,92,0.14)]" data-nav-dropdown-menu>
                            @foreach ($link['children'] as $child)
                                <a href="{{ $child['url'] }}" class="block whitespace-nowrap rounded-[8px] px-3 py-2.5 text-[15px] font-semibold leading-normal text-shary-navy transition-colors hover:bg-shary-form hover:text-shary-link active:text-shary-link">{{ $child['label'] }}</a>
                            @endforeach
                        </div>
                    </div>
                @else
                    <a href="{{ $link['url'] }}" class="text-[16px] font-semibold leading-normal transition-colors {{ !empty($link['active']) ? 'text-shary-link' : 'text-shary-navy hover:text-shary-link active:text-shary-link' }}">{{ $link['label'] }}</a>
                @endif
            @endforeach
        </nav>

        <div class="flex shrink-0 items-center gap-1 min-[380px]:gap-3">
            {{-- المفضلة: ديسك توب بس. القلب بيبقى أحمر وعليه العدد طول ما فيه حاجة في المفضلة، والضغط بيفتح صفحة المفضلة ($favoritesUrl) --}}
            <a href="{{ $favoritesUrl ?? '#' }}" class="group relative hidden h-11 w-11 items-center justify-center rounded-full text-shary-navy transition-colors hover:bg-shary-form hover:text-shary-link data-[active=true]:text-red-600 data-[active=true]:hover:text-red-600 lg:flex" data-favorites-indicator data-active="false" aria-label="{{ __('blog.favorites') }}">
                <svg class="transition-colors group-data-[active=true]:fill-current" width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 20.3s-7.5-4.6-7.5-10.1A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.6c0 5.5-7.5 10.1-7.5 10.1Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
                <span class="absolute -end-0.5 -top-0.5 hidden h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white px-1 text-center text-[11px] font-bold leading-[18px] text-red-600 shadow-[0_1px_4px_rgba(18,58,92,0.3)]" data-favorites-count></span>
            </a>

            {{-- زرار اللغة: أزرق دايمًا في اللغتين، بيعرض اللغة الحالية (ع / العربية — EN / English) وبيفتح نفس الصفحة باللغة التانية. بيغمق شوية مع الماوس والضغط --}}
            <a href="{{ $langUrl ?? '#' }}" data-lang-toggle class="flex h-10 w-10 items-center justify-center rounded-full bg-shary-link text-[13px] font-bold leading-none text-white transition-colors duration-300 hover:bg-shary-action active:bg-shary-action lg:w-auto lg:min-w-[84px] lg:px-4 lg:text-[14px]" aria-label="{{ __('blog.change_language') }}">
                <span class="lg:hidden">{{ __('blog.lang_short') }}</span>
                <span class="hidden lg:inline">{{ __('blog.lang_current') }}</span>
            </a>

            <button type="button" class="flex h-10 w-10 items-center justify-center lg:hidden" data-nav-toggle aria-controls="mobile-nav" aria-expanded="false" aria-label="{{ __('blog.menu') }}">
                <img src="{{ asset('images/shary/icons/menu.svg') }}" alt="" width="28" height="28">
            </button>
        </div>
    </div>

    <nav id="mobile-nav" class="hidden border-t border-shary-line lg:hidden" aria-label="{{ __('blog.main_nav') }}">
        <div class="site-container flex flex-col py-2">
            @foreach (($navLinks ?? []) as $link)
                @if (!empty($link['children']))
                    <div data-nav-dropdown>
                        <button type="button" class="flex w-full items-center justify-between py-3 text-[16px] font-bold leading-normal text-shary-navy active:text-shary-link aria-expanded:text-shary-link" aria-expanded="false" data-nav-dropdown-toggle>
                            <span>{{ $link['label'] }}</span>
                            <svg class="transition-transform duration-200" data-nav-dropdown-arrow width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <div class="hidden flex-col pb-2 ps-4" data-nav-dropdown-menu>
                            @foreach ($link['children'] as $child)
                                <a href="{{ $child['url'] }}" class="py-2.5 text-[15px] font-semibold leading-normal text-shary-navy active:text-shary-link">{{ $child['label'] }}</a>
                            @endforeach
                        </div>
                    </div>
                @else
                    <a href="{{ $link['url'] }}" class="py-3 text-[16px] font-bold leading-normal {{ !empty($link['active']) ? 'text-shary-link' : 'text-shary-navy active:text-shary-link' }}">{{ $link['label'] }}</a>
                @endif
            @endforeach
        </div>
    </nav>
</header>
