{{--
    صفحة المطور (مثال: ماونتن فيو) — ديسك توب وموبايل في ملف واحد، من تصميم فيجما "صفحة المطور".
    $developer = بيانات المطور كلها (الشكل موضّح في resources/data/developer-sample.ar.php):
        name, short_name, logo, logo_text, stats, badge, index (score, sales, rank, delivered, breakdown, note),
        counts, areas, projectsCount, filters, projects, about, faqs
    $pagination (أرقام الصفحات — ديسك توب) ، $breadcrumbs ، وباقي بيانات الهيدر والفوتر والفورمات المشتركة.
    نصوص الواجهة من lang/{ar,en}/developers.php. الفلاتر والترتيب من areas/partials/filters.blade.php (الشكل المختصر).
    المقاسات: لوجو المطور مربع (300×300) ، صورة المشروع 16:9 (800×450) ، صورة المنطقة مربعة (200×200).
--}}
@extends('layouts.site')

@section('title', $developer['meta_title'] ?? $developer['name'])

{{-- المسافة تحت في الموبايل عشان شريط التواصل الثابت ما يغطيش آخر الفوتر --}}
@section('body-class', 'bg-white pb-[70px] lg:pb-0')

@section('head')
    <meta name="description" content="{{ $developer['meta_description'] ?? '' }}">
    <link rel="canonical" href="{{ $canonical ?? '' }}">
    <meta property="og:title" content="{{ $developer['meta_title'] ?? $developer['name'] }}">
    <meta property="og:description" content="{{ $developer['meta_description'] ?? '' }}">
    <script type="application/ld+json">{!! json_encode($faqSchema ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}</script>
@endsection

@section('scripts')
    <script src="{{ asset('js/shary/area-page.js') }}"></script>
    <script src="{{ asset('js/shary/developer-page.js') }}"></script>
    <script src="{{ asset('js/shary/ai-panel.js') }}"></script>
@endsection

@section('content')
    {{-- مسار الصفحة: الرئيسية ‹ مطورين ‹ اسم المطور --}}
    @include('partials.breadcrumb')

    <div class="site-container flex flex-col gap-8 pb-10 pt-4 lg:gap-12 lg:pb-16 lg:pt-5">
        {{-- رأس الصفحة: اللوجو + اسم المطور + الأرقام + الشارة --}}
        <header class="area-card px-4 py-5 lg:flex lg:items-center lg:gap-9 lg:px-10 lg:py-10">
            <div class="flex items-center gap-3.5 lg:contents">
                <div class="flex h-[64px] w-[64px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-shary-line bg-white shadow-[0_8px_22px_-12px_rgba(18,58,92,0.45)] lg:h-[124px] lg:w-[124px]">
                    @if (!empty($developer['logo']))
                        <img src="{{ $developer['logo'] }}" alt="{{ $developer['name'] }}" class="h-full w-full object-contain p-1.5 lg:p-3" onerror="this.onerror=null;this.classList.add('hidden');this.nextElementSibling.classList.remove('hidden')">
                    @endif
                    <span class="{{ !empty($developer['logo']) ? 'hidden' : '' }} max-w-[52px] text-center text-[9px] font-extrabold uppercase leading-[1.3] text-shary-navy lg:max-w-[92px] lg:text-[14px]" dir="ltr">{{ $developer['logo_text'] ?? '' }}</span>
                </div>
                <div class="min-w-0 lg:hidden">
                    <p class="text-[20px] font-extrabold leading-[1.4]" aria-hidden="true">{{ $developer['name'] }}</p>
                    @if (!empty($developer['badge']))
                        <span class="dev-badge mt-1.5 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-bold leading-normal text-shary-teal">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5"/></svg>
                            <span>{{ $developer['badge']['text'] }} · {{ $developer['badge']['year'] }}</span>
                        </span>
                    @endif
                </div>
            </div>

            <div class="min-w-0 flex-1">
                <h1 class="sr-only text-[40px] font-extrabold leading-[1.3] lg:not-sr-only">{{ $developer['name'] }}</h1>
                <div class="mt-4 flex items-center border-t border-shary-line pt-4 lg:mt-5 lg:border-t-0 lg:pt-0">
                    <dl class="grid flex-1 grid-cols-3 text-center lg:flex lg:flex-none lg:text-start">
                        @foreach ($developer['stats'] as $index => $stat)
                            <div class="flex flex-col-reverse {{ $index > 0 ? 'border-s border-shary-line' : '' }} lg:px-8 lg:first:ps-0">
                                <dt class="text-[12px] font-medium leading-normal text-shary-muted lg:text-[14px]">{{ $stat['label'] }}</dt>
                                <dd class="text-[22px] font-extrabold leading-[1.3] lg:text-[32px]" dir="ltr">{{ $stat['value'] }}</dd>
                            </div>
                        @endforeach
                    </dl>
                    @if (!empty($developer['badge']))
                        <div class="dev-badge ms-8 hidden items-center gap-3 rounded-2xl px-4 py-3 lg:flex">
                            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-shary-teal" aria-hidden="true">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5"/></svg>
                            </span>
                            <span>
                                <b class="block text-[17px] font-bold leading-[1.4] text-shary-teal">{{ $developer['badge']['text'] }}</b>
                                <small class="block text-[13px] font-semibold leading-normal text-shary-muted">{{ $developer['badge']['year'] }}</small>
                            </span>
                        </div>
                    @endif
                </div>
            </div>
        </header>

        {{-- مؤشر شاري للمطور --}}
        <section>
            <div class="mb-3.5 flex items-baseline justify-between gap-3 lg:mb-5">
                <h2 class="text-[20px] font-bold leading-[1.35] lg:text-[28px]">{{ $developer['index']['label'] }}</h2>
                <small class="whitespace-nowrap text-[12px] font-medium text-shary-muted lg:text-[13px]">{{ __('developers.updated', ['date' => $developer['index']['updated']]) }}</small>
            </div>

            <div class="area-card grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 px-4 py-5 lg:flex lg:gap-0 lg:px-10 lg:py-9">
                <div class="flex flex-col items-center lg:w-[280px] lg:border-e lg:border-shary-line lg:pe-10">
                    <div class="relative h-[112px] w-[112px] lg:h-[176px] lg:w-[176px]">
                        {{-- القوس: 270 درجة، الجزء الملوّن = الدرجة من 100 --}}
                        <svg class="h-full w-full" viewBox="0 0 120 120" aria-hidden="true">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#e6ecf1" stroke-width="10" stroke-linecap="round" stroke-dasharray="235.6 314.2" transform="rotate(135 60 60)"/>
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#3aaa9b" stroke-width="10" stroke-linecap="round" stroke-dasharray="{{ round(235.6 * $developer['index']['score'] / 100, 1) }} 314.2" transform="rotate(135 60 60)"/>
                        </svg>
                        <div class="absolute inset-0 flex flex-col items-center justify-center">
                            <b class="text-[34px] font-extrabold leading-none lg:text-[56px]">{{ $developer['index']['score'] }}</b>
                            <small class="mt-1 text-[10px] font-medium leading-none text-shary-muted lg:mt-2 lg:text-[12px]">{{ __('developers.of_100') }}</small>
                        </div>
                    </div>
                    <p class="mt-2 text-center text-[14px] font-bold leading-normal lg:mt-3 lg:text-[20px]"><span class="lg:hidden">{{ $developer['index']['short_label'] }}</span><span class="hidden lg:inline">{{ $developer['index']['label'] }}</span></p>
                </div>

                <div class="grid min-w-0 gap-3 lg:flex-1 lg:grid-cols-2 lg:gap-10 lg:ps-10">
                    <div>
                        <p class="flex items-baseline gap-2 leading-[1.3]">
                            <b class="text-[24px] font-extrabold lg:text-[34px]">{{ $developer['index']['sales']['value'] }}</b>
                            <span class="text-[13px] font-bold text-shary-muted lg:text-[17px]">{{ $developer['index']['sales']['unit'] }}</span>
                        </p>
                        <small class="block text-[12px] font-medium leading-normal text-shary-muted lg:text-[14px]">{{ $developer['index']['sales']['label'] }}</small>
                        <span class="dev-badge mt-2.5 inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-bold leading-normal text-shary-teal lg:mt-3.5 lg:px-5 lg:py-3 lg:text-[16px]">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5"/></svg>
                            {{ $developer['index']['rank'] }}
                        </span>
                    </div>
                    <div class="border-t border-shary-line pt-3 lg:border-t-0 lg:pt-0">
                        <p class="flex items-baseline gap-2 leading-[1.3]">
                            <b class="text-[24px] font-extrabold lg:text-[34px]">{{ $developer['index']['delivered']['done'] }}</b>
                            <span class="text-[13px] font-bold text-shary-muted lg:text-[17px]">{{ $developer['index']['delivered']['of'] }}</span>
                            <b class="text-[24px] font-extrabold lg:text-[34px]">{{ $developer['index']['delivered']['total'] }}</b>
                        </p>
                        <small class="block text-[12px] font-medium leading-normal text-shary-muted lg:text-[14px]">{{ $developer['index']['delivered']['label'] }}</small>
                    </div>
                </div>
            </div>

            {{-- إزاي اتحسب؟ — بيتقفل ويتفتح --}}
            <details class="area-card group mt-4 px-4 py-4 lg:mt-5 lg:px-8 lg:py-7" open>
                <summary class="flex cursor-pointer list-none items-center justify-between gap-3">
                    <h3 class="text-[16px] font-bold leading-normal lg:text-[20px]">{{ __('developers.how') }}</h3>
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e7f5f1] text-shary-teal lg:h-10 lg:w-10" aria-hidden="true">
                        <svg class="transition-transform group-open:rotate-180" width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                </summary>
                <div class="mt-3 lg:mt-4">
                    @foreach ($developer['index']['breakdown'] as $item)
                        <div class="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_30px] items-center gap-3 py-2 lg:grid-cols-[320px_minmax(0,1fr)_48px] lg:gap-8 lg:py-2.5">
                            <div class="min-w-0">
                                <p class="text-[13px] font-bold leading-[1.5] lg:text-[16px]">{{ $item['label'] }}</p>
                                <small class="block text-[11px] font-medium leading-[1.5] text-shary-muted lg:text-[13px]">{{ $item['detail'] }}</small>
                            </div>
                            <span class="h-[7px] overflow-hidden rounded-full bg-[#e9eef3] lg:h-[11px]" role="img" aria-label="{{ $item['score'] }} / 100"><i class="dev-bar block h-full rounded-full" style="width: {{ $item['score'] }}%"></i></span>
                            <b class="text-end text-[14px] font-extrabold leading-none text-shary-teal lg:text-[18px]">{{ $item['score'] }}</b>
                        </div>
                    @endforeach
                    <p class="mt-3 border-t border-shary-line pt-3 text-[11.5px] font-medium leading-[1.8] text-shary-muted lg:mt-4 lg:pt-4 lg:text-[13px]">{{ $developer['index']['note'] }}</p>
                </div>
            </details>

            {{-- عدد المشاريع — ديسك توب: 4 كروت. موبايل: قايمة بتتقفل وتتفتح --}}
            <div class="mt-5 hidden grid-cols-4 gap-4 lg:grid">
                @foreach ($developer['counts'] as $count)
                    <div class="area-card flex items-center gap-3.5 px-5 py-5">
                        <span class="dev-count dev-count--{{ $count['key'] }} flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" aria-hidden="true">
                            @if ($count['key'] === 'delivered')
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16.5 9.5"/></svg>
                            @elseif ($count['key'] === 'building')
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V8l7-4 7 4v13M3 21h18M9.5 21v-5h5v5M9.5 11h.01M14.5 11h.01"/></svg>
                            @elseif ($count['key'] === 'new')
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3Z"/></svg>
                            @else
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M8 3v4M16 3v4M4 10h16M9 14.5l2 2 4-4"/></svg>
                            @endif
                        </span>
                        <div class="min-w-0">
                            <b class="block font-extrabold leading-[1.4] {{ $count['key'] === 'last' ? 'text-[16px]' : 'text-[22px]' }}">{{ $count['value'] }}</b>
                            <small class="block text-[13px] font-medium leading-normal text-shary-muted">{{ $count['label'] }}</small>
                        </div>
                    </div>
                @endforeach
            </div>
            <details class="area-card group mt-4 px-4 py-4 lg:hidden" open>
                <summary class="flex cursor-pointer list-none items-center justify-between gap-3">
                    <h3 class="text-[16px] font-bold leading-normal">{{ __('developers.projects_count') }}</h3>
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e7f5f1] text-shary-teal" aria-hidden="true">
                        <svg class="transition-transform group-open:rotate-180" width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                </summary>
                <dl class="mt-2">
                    @foreach ($developer['counts'] as $count)
                        <div class="flex items-center justify-between gap-3 border-b border-shary-line py-3 last:border-b-0 last:pb-0">
                            <dt class="text-[13px] font-medium leading-normal text-shary-muted">{{ $count['label'] }}</dt>
                            <dd class="text-end font-extrabold leading-normal {{ $count['key'] === 'last' ? 'text-[14px]' : 'text-[18px]' }}">{{ $count['value'] }}</dd>
                        </div>
                    @endforeach
                </dl>
            </details>
        </section>

        {{-- مناطق المطور: كل منطقة لينك لصفحة المنطقة (/areas/{slug}). موبايل سحب أفقي و"عرض الكل" بيفردهم. ديسك توب: 5 في الصف --}}
        @if (!empty($developer['areas']))
        <section data-dev-areas>
            <div class="mb-3.5 flex items-baseline justify-between gap-3 lg:mb-5">
                <h2 class="text-[20px] font-bold leading-[1.35] lg:text-[28px]">{{ __('developers.areas_title') }}</h2>
                <button type="button" class="flex items-center gap-1.5 whitespace-nowrap text-[13px] font-semibold text-shary-teal hover:underline lg:text-[14px] {{ count($developer['areas']) <= 5 ? 'lg:hidden' : '' }}" data-dev-areas-toggle aria-expanded="false" data-more="{{ __('developers.show_all') }}" data-less="{{ __('developers.show_less') }}">
                    <span data-label>{{ __('developers.show_all') }}</span>
                    <svg class="transition-transform" width="12" height="12" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
            <div class="dev-areas shary-scroll -mx-5 flex gap-3 overflow-x-auto px-5 pb-2 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0" data-dev-areas-list>
                @foreach ($developer['areas'] as $index => $item)
                    <a href="{{ $item['url'] }}" class="area-card flex min-w-[178px] shrink-0 items-center gap-3 px-3.5 py-3.5 transition-shadow hover:shadow-[0_10px_26px_-14px_rgba(18,58,92,0.45)] lg:min-w-0 lg:gap-2.5 lg:px-3 lg:py-4 {{ $index > 4 ? 'dev-areas__extra' : '' }}">
                        <img src="{{ $item['image'] }}" alt="" class="h-[46px] w-[46px] shrink-0 rounded-full bg-shary-image object-cover" loading="lazy" data-fallback="{{ $item['image_fallback'] ?? '' }}" onerror="this.onerror=null;this.src=this.dataset.fallback">
                        <span class="min-w-0">
                            <b class="block truncate text-[15px] font-bold leading-[1.5] lg:whitespace-normal lg:text-[15px]">{{ $item['name'] }}</b>
                            <small class="block text-[12.5px] font-medium leading-normal text-shary-muted lg:text-[13px]">{{ $item['count'] }}</small>
                        </span>
                    </a>
                @endforeach
            </div>
        </section>
        @endif

        {{-- مشاريع المطور: تصفية + ترتيب + الكروت + أرقام الصفحات --}}
        <section id="projects">
            <div class="mb-3.5 flex items-end justify-between gap-3 lg:mb-5">
                <div class="min-w-0">
                    <h2 class="text-[18px] font-bold leading-[1.35] lg:text-[28px]">{{ __('developers.projects_of', ['name' => $developer['short_name']]) }}</h2>
                    <p class="text-[12px] font-medium text-shary-muted lg:text-[13px]"><span data-projects-count>{{ $developer['projectsCount'] }}</span> {{ __('developers.results') }}</p>
                </div>
                @include('areas.partials.filters', ['area' => ['filters' => $developer['filters'], 'allProjectsUrl' => $developer['allProjectsUrl']], 'compactFilters' => true])
            </div>

            {{-- موبايل: أول 3 مشاريع + "عرض المزيد". ديسك توب: 9 (3×3) + أرقام الصفحات --}}
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6" data-projects-grid>
                @foreach ($developer['projects'] as $index => $project)
                    <div class="{{ $index > 2 ? 'hidden lg:block' : '' }}" data-project data-slug="{{ $project['slug'] }}" data-developer="{{ $project['developer'] }}" data-price="{{ $project['price_value'] }}">
                        @include('developers.partials.project-card', ['project' => $project])
                    </div>
                @endforeach
            </div>
            <p class="hidden rounded-2xl bg-shary-soft px-4 py-8 text-center text-[14px] font-semibold text-shary-muted" data-projects-empty>{{ __('developers.no_results') }}</p>

            @if (count($developer['projects']) > 3)
                <button type="button" class="area-card mt-4 flex h-12 w-full items-center justify-center gap-2 text-[14px] font-bold text-shary-navy lg:hidden" data-more-projects data-step="3">
                    <span>{{ __('developers.more') }}</span>
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            @endif

            <div class="lg:pt-4">
                @include('blog.partials.pagination')
            </div>
        </section>

        {{-- عن المطور + الأسئلة الشائعة | فورم الاستشارة (ثابت على الجنب في الديسك توب) --}}
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-7">
            <div class="flex min-w-0 flex-col gap-8">
                <section>
                    <h2 class="mb-3.5 text-[20px] font-bold leading-[1.35] lg:hidden">{{ __('developers.about', ['name' => $developer['short_name']]) }}</h2>
                    <div class="area-card px-4 py-5 lg:px-9 lg:py-8">
                        <h2 class="mb-3 hidden text-[28px] font-bold leading-[1.35] lg:block">{{ __('developers.about', ['name' => $developer['short_name']]) }}</h2>
                        {{-- النص مفتوح كله، وزرار "عرض أقل" بيقصّره لو العميل عايز --}}
                        <div class="dev-about" data-collapsible>
                            <p>{!! $developer['about']['intro_html'] !!}</p>
                            @foreach ($developer['about']['sections'] as $section)
                                <h3>{{ $section['heading'] }}</h3>
                                <ul>
                                    @foreach ($section['items'] as $item)
                                        @if (!empty($item['link']))
                                            <li><a href="{{ $item['url'] }}">{{ $item['link'] }}</a> — {{ $item['text'] }}</li>
                                        @else
                                            <li>{!! $item['html'] !!}</li>
                                        @endif
                                    @endforeach
                                </ul>
                            @endforeach
                            <p>{{ $developer['about']['outro'] }}</p>
                        </div>
                        <button type="button" class="mt-2 text-[14px] font-bold text-[#c8921f] hover:underline lg:text-[15px]" data-collapsible-toggle aria-expanded="true" data-more="{{ __('developers.more') }}" data-less="{{ __('developers.less') }}">{{ __('developers.less') }}</button>
                    </div>
                </section>

                <section>
                    <h2 class="mb-3.5 text-[20px] font-bold leading-[1.35] lg:mb-5 lg:text-[28px]">{{ __('developers.faq') }}</h2>
                    <div class="flex flex-col gap-2.5">
                        @foreach ($developer['faqs'] as $faq)
                            <details class="area-card area-faq group px-4 lg:px-6">
                                <summary class="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 py-2 text-[14px] font-bold leading-normal lg:min-h-[62px] lg:text-[16px]">
                                    <span>{{ $faq['question'] }}</span>
                                    <svg class="shrink-0 text-shary-teal" width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path class="group-open:hidden" d="M7 2v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                </summary>
                                <p class="pb-4 text-[14px] font-medium leading-[1.8] text-shary-muted lg:text-[15px]">{{ $faq['answer'] }}</p>
                            </details>
                        @endforeach
                    </div>
                </section>
            </div>

            <aside class="lg:sticky lg:top-24">
                @include('partials.consultation-form')
            </aside>
        </div>
    </div>

    @include('areas.partials.quick-contact')
@endsection
