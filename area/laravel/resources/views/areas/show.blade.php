{{--
    صفحة المنطقة (مثال: القاهرة الجديدة) — ديسك توب وموبايل في ملف واحد
    $area = بيانات المنطقة كلها (الشكل موضّح في resources/data/area-sample.ar.php):
        name, chip, intro, stats, index (كارت الموقع والمؤشر), offers, newProjects, subAreas,
        projectsCount, filters, projects, top, discover, about, location, guide, faqs
    الصور: image = لينك الصورة ، image_fallback = صورة بديلة بتظهر لو الصورة ما حملتش (اختياري).
    المقاسات: صورة المشروع 16:9 (800×450) ، بلاطة المشروع الجديد 16:9 (800×450) ، صورة المنطقة مربعة (400×400) ، لوجو المطور مربع (120×120).
    $pagination (أرقام الصفحات — ديسك توب) ، $breadcrumbs ، وباقي بيانات الهيدر والفوتر والفورمات المشتركة.
    نصوص الواجهة من lang/{ar,en}/areas.php
--}}
@extends('layouts.site')

@section('title', $area['meta_title'] ?? $area['name'])

{{-- المسافة تحت في الموبايل عشان شريط "اتصل الآن" الثابت ما يغطيش آخر الفوتر --}}
@section('body-class', 'bg-white pb-[70px] lg:pb-0')

@section('head')
    <meta name="description" content="{{ $area['meta_description'] ?? '' }}">
    <link rel="canonical" href="{{ $canonical ?? '' }}">
    <meta property="og:title" content="{{ $area['meta_title'] ?? $area['name'] }}">
    <meta property="og:description" content="{{ $area['meta_description'] ?? '' }}">
    <script type="application/ld+json">{!! json_encode($faqSchema ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}</script>
@endsection

@section('scripts')
    <script src="{{ asset('js/shary/area-page.js') }}"></script>
    <script src="{{ asset('js/shary/ai-panel.js') }}"></script>
@endsection

@section('content')
    @include('areas.partials.hero')

    {{-- مسار الصفحة تحت الهيدر الأزرق --}}
    @include('partials.breadcrumb')

    <div class="site-container flex flex-col gap-8 pb-10 pt-4 lg:gap-14 lg:pb-16 lg:pt-5">
        {{-- كارت الموقع والمؤشر --}}
        @include('areas.partials.index-card', ['index' => $area['index']])

        {{-- العروض: موبايل سحب أفقي، ديسك توب 3 في الصف --}}
        @if (!empty($area['offers']))
        <section>
            <div class="mb-3.5 flex items-baseline justify-between gap-2.5 lg:mb-5">
                <h2 class="text-[20px] font-bold leading-[1.35] lg:text-[28px]">{{ __('areas.offers') }}</h2>
                <a href="{{ $area['offersUrl'] ?? '#' }}" class="whitespace-nowrap text-[13px] font-semibold text-shary-link hover:underline lg:text-[14px]">{{ __('areas.all_offers') }}</a>
            </div>
            <div class="shary-scroll -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
                @foreach ($area['offers'] as $offer)
                    @include('areas.partials.offer-card', ['offer' => $offer])
                @endforeach
            </div>
        </section>
        @endif

        {{-- المشاريع الجديدة --}}
        @if (count($area['newProjects'] ?? []) > 1)
        <section>
            <div class="mb-3.5 flex items-baseline justify-between gap-2.5 lg:mb-5">
                <h2 class="text-[20px] font-bold leading-[1.35] lg:text-[28px]">{{ __('areas.new_projects') }}</h2>
                <a href="{{ $area['allProjectsUrl'] ?? '#' }}" class="whitespace-nowrap text-[13px] font-semibold text-shary-link hover:underline lg:text-[14px]">{{ __('areas.view_all') }}</a>
            </div>
            {{-- سحب أفقي. موبايل: بلاطة واحدة بعرض الشاشة تقريبًا وطرف اللي بعدها باين. ديسك توب: 3 على الشاشة والباقي بالسحب --}}
            <div class="shary-scroll -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 lg:mx-0 lg:scroll-px-0 lg:gap-6 lg:px-0">
                @foreach ($area['newProjects'] as $index => $tile)
                    <a href="{{ $tile['url'] }}" class="area-tile area-tone-{{ $tile['tone'] }} relative block h-[190px] w-[84%] shrink-0 snap-start overflow-hidden rounded-2xl lg:h-[220px] lg:w-[calc((100%-48px)/3)]">
                        <img src="{{ $tile['image'] }}" alt="" class="absolute inset-0 h-full w-full object-cover" loading="lazy" data-fallback="{{ $tile['image_fallback'] ?? '' }}" onerror="this.onerror=null;this.src=this.dataset.fallback">
                        <span class="area-tile__tint absolute inset-0" aria-hidden="true"></span>
                        {{-- اسم المشروع + المطور، وتحتهم اللوكيشن بخط أصغر — تحت على الصورة عشان الصورة تفضل باينة --}}
                        <span class="absolute inset-x-0 bottom-0 px-4 pb-3.5 text-start text-white lg:px-5 lg:pb-4">
                            <span class="flex flex-wrap items-baseline gap-x-2 leading-[1.35]">
                                <b class="text-[18px] font-bold lg:text-[20px]">{{ $tile['name'] }}</b>
                                <span class="text-[13.5px] font-semibold text-white/90 lg:text-[15px]">{{ $tile['developer'] ?? '' }}</span>
                            </span>
                            <span class="mt-0.5 flex items-center gap-1 text-[12px] font-medium leading-normal text-white/85 lg:text-[13px]">
                                <svg class="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.500a2.5 2.5 0 0 1 0 5Z"/></svg>
                                <span class="truncate">{{ $tile['location'] ?? '' }}</span>
                            </span>
                        </span>
                    </a>
                @endforeach
            </div>
        </section>
        @endif

        {{-- المناطق جوه المنطقة: بتظهر بس في المناطق الكبيرة اللي جواها مناطق (القاهرة الجديدة، الساحل، البحر الأحمر). المنطقة الفرعية من غير القسم ده --}}
        @if (!empty($area['subAreas']))
        <section>
            <div class="mb-3.5 flex items-baseline justify-between gap-2.5 lg:mb-5">
                <h2 class="text-[20px] font-bold leading-[1.35] lg:text-[28px]">{{ __('areas.areas_in', ['area' => $area['name']]) }}</h2>
                <a href="{{ $area['allAreasUrl'] ?? '#' }}" class="whitespace-nowrap text-[13px] font-semibold text-shary-link hover:underline lg:text-[14px]">{{ __('areas.all_areas') }}</a>
            </div>
            <div class="grid grid-cols-2 gap-2.5 lg:grid-cols-3 lg:gap-6">
                @foreach ($area['subAreas'] as $sub)
                    <a href="{{ $sub['url'] }}" class="area-card block px-3 pb-3.5 pt-4 text-center transition-shadow hover:shadow-[0_10px_26px_-14px_rgba(18,58,92,0.45)] lg:px-6 lg:pb-[22px] lg:pt-7">
                        {{-- صورة المنطقة: دايرة 84px موبايل / 156px ديسك توب (ارفع الصورة مربعة 400×400) --}}
                        <span class="area-tone-{{ $sub['tone'] }} relative mx-auto flex h-[84px] w-[84px] items-center justify-center overflow-hidden rounded-full lg:h-[156px] lg:w-[156px]">
                            <svg class="w-[34px] lg:w-[66px]" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M3 11 12 4l9 7v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" opacity=".95"/></svg>
                            @if (!empty($sub['image']))
                                <img src="{{ $sub['image'] }}" alt="{{ $sub['name'] }}" class="absolute inset-0 h-full w-full object-cover" loading="lazy" data-fallback="{{ $sub['image_fallback'] ?? '' }}" onerror="this.onerror=null;this.src=this.dataset.fallback">
                            @endif
                        </span>
                        <h3 class="mb-2 mt-2.5 text-[16px] font-bold leading-normal lg:mb-3 lg:mt-3.5 lg:text-[20px]">{{ $sub['name'] }}</h3>
                        <span class="grid grid-cols-2 border-t border-shary-line pt-2 lg:pt-3">
                            <span>
                                <b class="block text-[19px] font-bold leading-[1.3] text-shary-teal lg:text-[26px]">{{ $sub['units'] }}</b>
                                <small class="text-[12px] font-medium text-shary-muted lg:text-[13px]">{{ __('areas.unit') }}</small>
                            </span>
                            <span class="border-s border-shary-line">
                                <b class="block text-[19px] font-bold leading-[1.3] text-shary-teal lg:text-[26px]">{{ $sub['projects'] }}</b>
                                <small class="text-[12px] font-medium text-shary-muted lg:text-[13px]">{{ __('areas.project') }}</small>
                            </span>
                        </span>
                    </a>
                @endforeach
            </div>
        </section>
        @endif

        {{-- مشاريع المنطقة: فلاتر + كروت + أرقام الصفحات --}}
        <section id="projects">
            <div class="mb-3.5 lg:mb-5">
                <h2 class="text-[20px] font-bold leading-[1.35] lg:text-[28px]">{{ __('areas.projects_in', ['area' => $area['name']]) }}</h2>
                <p class="text-[12px] font-medium text-shary-muted lg:text-[13px]"><span data-projects-count>{{ $area['projectsCount'] }}</span> {{ __('areas.results') }}</p>
            </div>

            {{-- الفلاتر: المطور / المشروع / السعر (لوحة بتطلع من تحت) + كل الفلاتر + الترتيب --}}
            @include('areas.partials.filters')

            {{-- موبايل: أول 3 مشاريع + زرار "شوف الكل". ديسك توب: 9 (3×3) + أرقام الصفحات --}}
            <div class="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6" data-projects-grid>
                @foreach ($area['projects'] as $index => $project)
                    <div class="{{ $index > 2 ? 'hidden lg:block' : '' }}" data-project data-slug="{{ $project['slug'] }}" data-developer="{{ $project['developer'] }}" data-kind="{{ $project['kind'] }}" data-price="{{ $project['price_value'] }}">
                        @include('areas.partials.project-card', ['project' => $project])
                    </div>
                @endforeach
            </div>
            <p class="hidden rounded-2xl bg-shary-soft px-4 py-8 text-center text-[14px] font-semibold text-shary-muted" data-projects-empty>{{ __('areas.no_results') }}</p>

            @if ($area['projectsCount'] > 3)
                <a href="{{ $area['allProjectsUrl'] ?? '#' }}" class="mt-3.5 flex h-12 items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-shary-navy bg-white text-[14px] font-semibold text-shary-navy lg:hidden" data-all-projects>
                    {{ __('areas.see_all_before') }} <b>{{ $area['projectsCount'] }}</b> {{ __('areas.see_all_after') }}
                </a>
            @endif

            <div class="lg:pt-4">
                @include('blog.partials.pagination')
            </div>
        </section>

        {{-- أهم المشاريع + فورم الاستشارة (تحت المشاريع مباشرة) --}}
        {{-- الكارت بياخد نفس طول الفورم على الديسك توب (lg:items-stretch + flex-1) --}}
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-stretch lg:gap-6">
            <section class="flex flex-col">
                <h2 class="mb-3.5 text-[20px] font-bold leading-[1.35] lg:mb-5 lg:text-[28px]">{{ __('areas.top_projects', ['area' => $area['name']]) }}</h2>
                <div class="area-card area-text flex flex-1 flex-col px-4 py-[18px] lg:p-7">
                    <h3>{{ $area['top']['heading'] }}</h3>
                    @foreach ($area['top']['paragraphs'] as $paragraph)
                        <p>{{ $paragraph }}</p>
                    @endforeach

                    {{-- ترتيب أهم المشاريع: الاسم + المطور + السعر --}}
                    @if (!empty($area['top']['projects']))
                        <h3 class="mt-2 lg:mt-3">{{ $area['top']['ranked_label'] }}</h3>
                        <ol class="mb-3 lg:mb-4">
                            @foreach ($area['top']['projects'] as $index => $item)
                                <li class="flex items-center gap-3 border-b border-shary-line py-2.5 last:border-b-0 lg:py-3">
                                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-shary-form text-[14px] font-bold leading-none text-shary-navy">{{ $index + 1 }}</span>
                                    <span class="min-w-0 flex-1">
                                        <a href="{{ $item['url'] }}" class="block truncate text-[14px] font-bold leading-normal text-shary-navy hover:text-shary-link lg:text-[15px]">{{ $item['name'] }}</a>
                                        <small class="block truncate text-[12px] font-medium leading-normal text-shary-muted lg:text-[13px]">{{ $item['developer'] }}</small>
                                    </span>
                                    <span class="shrink-0 text-end">
                                        <small class="block text-[11.5px] font-medium leading-normal text-shary-muted lg:text-[12px]">{{ $area['top']['from_label'] }}</small>
                                        <b class="block text-[14px] font-bold leading-normal text-shary-navy lg:text-[15px]">{{ $item['price'] }} <span class="text-[11.5px] font-semibold text-shary-muted">{{ __('areas.currency') }}</span></b>
                                    </span>
                                </li>
                            @endforeach
                        </ol>
                    @endif

                    <ul class="area-dots mt-auto">
                        @foreach ($area['top']['points'] as $point)
                            <li>{{ $point }}</li>
                        @endforeach
                    </ul>
                </div>
            </section>
            <div class="lg:pt-[59px]">
                @include('partials.consultation-form')
            </div>
        </div>

        {{-- عن المنطقة + الموقع والمسافات --}}
        {{-- الكارتين بنفس الطول على الديسك توب --}}
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6">
            <section class="flex flex-col">
                <h2 class="mb-3.5 text-[20px] font-bold leading-[1.35] lg:mb-5 lg:text-[28px]">{{ __('areas.about', ['area' => $area['name']]) }}</h2>
                <div class="area-card area-text flex flex-1 flex-col px-4 py-[18px] lg:p-7">
                    <h3>{{ $area['about']['heading'] }}</h3>
                    @foreach ($area['about']['paragraphs'] as $paragraph)
                        <p>{{ $paragraph }}</p>
                    @endforeach
                    @if (!empty($area['about']['points']))
                        <ul class="area-dots mt-auto pt-2">
                            @foreach ($area['about']['points'] as $point)
                                <li>{{ $point }}</li>
                            @endforeach
                        </ul>
                    @endif
                </div>
            </section>
            <section class="flex flex-col">
                <h2 class="mb-3.5 text-[20px] font-bold leading-[1.35] lg:mb-5 lg:text-[28px]">{{ __('areas.location_title') }}</h2>
                <div class="area-card area-text flex flex-1 flex-col px-4 py-[18px] lg:p-7">
                    <div class="mb-3 grid grid-cols-4 text-center">
                        @foreach ($area['location']['distances'] as $index => $distance)
                            <div class="{{ $index > 0 ? 'border-s border-shary-line' : '' }}">
                                <b class="block text-[22px] font-bold leading-[1.3] text-shary-teal lg:text-[28px]">{{ $distance['value'] }}</b>
                                <small class="text-[11.5px] font-medium text-shary-muted lg:text-[13px]">{{ $distance['label'] }}</small>
                            </div>
                        @endforeach
                    </div>
                    @foreach ($area['location']['paragraphs'] as $paragraph)
                        <p>{{ $paragraph }}</p>
                    @endforeach
                    <ul class="area-dots mt-auto pt-2">
                        @foreach ($area['location']['points'] as $point)
                            <li>{{ $point }}</li>
                        @endforeach
                    </ul>
                </div>
            </section>
        </div>

        {{-- دليل المنطقة: المحتويات + المواضيع --}}
        <section>
            <div class="mb-3.5 lg:mb-5">
                <h2 class="text-[20px] font-bold leading-[1.35] lg:text-[28px]">{{ __('areas.guide', ['area' => $area['name']]) }}</h2>
                <p class="text-[12px] font-medium text-shary-muted lg:text-[13px]">{{ count($area['guide']) }} {{ __('areas.topics') }}</p>
            </div>
            <div class="grid grid-cols-1 gap-3.5 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-6">
                <nav class="rounded-[14px] border border-shary-line bg-shary-soft px-4 py-3.5 lg:sticky lg:top-24 lg:p-[22px]" aria-label="{{ __('areas.contents') }}">
                    <h3 class="mb-1.5 text-[14px] font-bold leading-normal lg:text-[16px]">{{ __('areas.contents') }}</h3>
                    <ol>
                        @foreach ($area['guide'] as $index => $topic)
                            <li class="flex gap-2.5 py-[5px] text-[14px] font-semibold leading-normal lg:text-[14.5px]">
                                <span class="text-shary-gold">{{ $index + 1 }}</span>
                                <a href="#{{ $topic['id'] }}" class="text-shary-link hover:underline">{{ $topic['title'] }}</a>
                            </li>
                        @endforeach
                    </ol>
                </nav>
                <div class="area-card px-4 py-1.5 lg:columns-2 lg:gap-[34px] lg:px-7 lg:py-3.5">
                    @foreach ($area['guide'] as $index => $topic)
                        <div id="{{ $topic['id'] }}" class="break-inside-avoid border-b border-shary-line py-3 last:border-b-0 lg:py-4 scroll-mt-24">
                            <h3 class="text-[16px] font-bold leading-normal lg:text-[18px]"><span class="me-2 text-shary-gold">{{ $index + 1 }}.</span>{{ $topic['title'] }}</h3>
                            <p class="mt-1 text-[14px] font-medium leading-[1.8] text-shary-muted lg:text-[15px]">{{ $topic['text'] }}</p>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>

        {{-- الأسئلة الشائعة + اكتشف وحدات أكتر --}}
        <section class="grid grid-cols-1 lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:items-start lg:gap-x-6">
                <h2 class="mb-3.5 text-[20px] font-bold leading-[1.35] lg:mb-5 lg:text-[28px]">{{ __('areas.faq', ['area' => $area['name']]) }}</h2>
                <div class="area-card px-3.5 py-1.5 lg:px-6 lg:py-2">
                    @foreach ($area['faqs'] as $index => $faq)
                        <details class="area-faq group border-b border-shary-line last:border-b-0" {{ $index === 0 ? 'open' : '' }}>
                            <summary class="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-2.5 py-2 text-[14px] font-bold leading-normal text-shary-navy lg:min-h-[60px] lg:text-[16px]">
                                <span>{{ $faq['question'] }}</span>
                                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-shary-navy shadow-[0_1px_4px_rgba(18,58,92,0.18)] transition-colors group-open:bg-shary-action group-open:text-white" aria-hidden="true">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path class="group-open:hidden" d="M7 2v10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                                </span>
                            </summary>
                            <p class="pb-3 text-[14px] font-medium leading-[1.8] text-shary-muted lg:text-[15px]">{{ $faq['answer'] }}</p>
                        </details>
                    @endforeach
                </div>
                <h2 class="mb-3.5 mt-8 text-[20px] font-bold leading-[1.35] lg:mb-5 lg:mt-0 lg:text-[28px]">{{ __('areas.discover', ['area' => $area['name']]) }}</h2>
                <ul class="area-card px-4 py-1 lg:px-6">
                    @foreach ($area['discover'] as $link)
                        <li class="border-b border-shary-line last:border-b-0">
                            <a href="{{ $link['url'] }}" class="flex min-h-[48px] items-center justify-between gap-3 text-[14px] font-semibold leading-normal text-shary-navy transition-colors hover:text-shary-link lg:min-h-[52px] lg:text-[15px]">
                                <span>{{ $link['label'] }}</span>
                                <svg class="shrink-0 text-shary-hint ltr:rotate-180" width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M11.25 4.5L6.75 9L11.25 13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </a>
                        </li>
                    @endforeach
                </ul>
        </section>
    </div>

    @include('areas.partials.quick-contact')
@endsection
