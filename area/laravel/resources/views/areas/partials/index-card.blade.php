{{--
    كارت "موقع المدينة" + مؤشر شاري للمنطقة.
    يمين (في العربي): الخريطة الحرارية + مفتاح الألوان + رسم سعر المتر لآخر 12 شهر.
    شمال: نوع الوحدة (سكني / تجاري / إداري / طبي / فندقي) + الأرقام + تفاصيل المؤشر + المقارنة + نطاق السعر.
    $index = [
        'title', 'updated', 'roads' => [اسم طريق فوق, اسم طريق تحت], 'compare_area', 'months' => [12 شهر],
        'bars' => [['label', 'weight'], ...4],
        'types' => ['res' => ['label', 'price', 'change', 'demand', 'growth' (معدل النمو), 'index', 'bars' => [4 أرقام],
                              'compare_price', 'compare_diff', 'compare_label' (أعلى / أقل), 'range', 'units', 'projects', 'series' => [12 رقم]], ...],
    ]
    اختيار نوع الوحدة بيغيّر كل الأرقام والرسم من غير تحميل الصفحة (js/shary/area-page.js) — الداتا في الـ JSON اللي تحت.
--}}
@php($first = array_key_first($index['types']))
<section class="area-card p-4 lg:p-7" data-area-index>
    <script type="application/json" data-area-index-data>{!! json_encode(['types' => $index['types'], 'months' => $index['months'], 'perMeter' => __('areas.per_meter'), 'yearly' => __('areas.yearly'), 'caption' => __('areas.trend_caption')], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}</script>

    <div class="flex flex-wrap items-center justify-between gap-2.5">
        <h2 class="text-[20px] font-bold leading-[1.35] lg:text-[28px]">{{ $index['title'] }}</h2>
        <span class="whitespace-nowrap rounded-full border border-shary-line bg-shary-soft px-2.5 py-1 text-[11px] font-medium leading-normal text-shary-muted">{{ __('areas.updated', ['date' => $index['updated']]) }}</span>
    </div>

    <div class="mt-3 grid grid-cols-1 gap-3.5 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-[26px]">
        <div class="min-w-0">
            {{-- الخريطة الحرارية --}}
            <div class="area-map relative h-[210px] overflow-hidden rounded-[14px] lg:h-[340px]">
                <svg class="absolute inset-0 h-full w-full" viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden="true"><path d="M-10 58 L410 30" stroke="#CBD5DE" stroke-width="12" fill="none"/><path d="M-10 175 L410 140" stroke="#CBD5DE" stroke-width="12" fill="none"/><path d="M150 -10 L185 230" stroke="#D3DCE4" stroke-width="9" fill="none"/><path d="M-10 110 Q120 95 230 120 T410 100" stroke="#DCE3EA" stroke-width="5" fill="none"/></svg>
                <div class="area-map__rings" role="img" aria-label="{{ __('areas.map_alt', ['area' => $area['name']]) }}" data-map-rings></div>
                <span class="area-map__label end-4 top-3.5">{{ $index['roads'][0] ?? '' }}</span>
                <span class="area-map__label bottom-[22px] start-4">{{ $index['roads'][1] ?? '' }}</span>
                <div class="absolute start-3 top-3 flex flex-col gap-2">
                    <button type="button" class="area-map__zoom" data-map-zoom="1" aria-label="{{ __('areas.zoom_in') }}">+</button>
                    <button type="button" class="area-map__zoom" data-map-zoom="-1" aria-label="{{ __('areas.zoom_out') }}">−</button>
                </div>
            </div>
            <div class="area-map__legend-bar mt-3"></div>
            <div class="mt-1.5 flex justify-between gap-2 text-[11.5px] font-semibold leading-normal">
                <span class="inline-flex items-center gap-1.5"><i class="h-[9px] w-4 rounded-[3px] bg-[#D9604F]"></i>{{ __('areas.legend_high') }}</span>
                <span class="inline-flex items-center gap-1.5"><i class="h-[9px] w-4 rounded-[3px] bg-[#3FB386]"></i>{{ __('areas.legend_yield') }}</span>
                <span class="inline-flex items-center gap-1.5"><i class="h-[9px] w-4 rounded-[3px] bg-[#6BAEE6]"></i>{{ __('areas.legend_chance') }}</span>
            </div>

            {{-- سعر المتر — آخر 12 شهر --}}
            <div class="mt-3.5 rounded-[14px] border border-shary-line bg-white px-3.5 pb-2.5 pt-3" data-area-trend>
                <div class="flex items-center justify-between gap-2">
                    <b class="text-[13px] font-bold leading-normal">{{ __('areas.trend_title') }}</b>
                    <span class="area-up"><span dir="ltr" data-k="change">{{ $index['types'][$first]['change'] }}</span> {{ __('areas.yearly') }}</span>
                </div>
                <div class="area-plot" dir="ltr" data-plot>
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                        <defs><linearGradient id="area-trend-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FB39F" stop-opacity=".28"/><stop offset="1" stop-color="#3FB39F" stop-opacity="0"/></linearGradient></defs>
                        <line x1="0" x2="100" y1="25" y2="25" class="area-plot__grid"/><line x1="0" x2="100" y1="55" y2="55" class="area-plot__grid"/><line x1="0" x2="100" y1="85" y2="85" class="area-plot__grid"/>
                        <path fill="url(#area-trend-fill)" data-plot-area/><path class="area-plot__line" data-plot-line/><line class="area-plot__cursor" y1="0" y2="100" data-plot-cursor/>
                    </svg>
                    <span class="area-plot__dot" data-plot-end></span><span class="area-plot__dot area-plot__dot--hover" data-plot-dot></span>
                    <span class="area-plot__tip area-plot__tip--end" data-plot-end-tip></span><span class="area-plot__tip area-plot__tip--hover" data-plot-tip></span>
                </div>
                <div class="flex justify-between text-[10.5px] font-medium leading-normal text-shary-muted" dir="ltr">
                    <span>{{ $index['months'][0] }}</span><span>{{ $index['months'][5] }}</span><span>{{ $index['months'][11] }}</span>
                </div>
                <table class="sr-only" data-plot-table></table>
            </div>
        </div>

        <div class="grid min-w-0 gap-3.5">
            {{-- نوع الوحدة --}}
            <div class="rounded-[14px] border border-shary-line bg-shary-soft p-2.5">
                <p class="mb-2 text-[11.5px] font-medium leading-normal text-shary-muted">{{ __('areas.type_hint') }}</p>
                <div class="flex flex-wrap gap-1.5">
                    @foreach ($index['types'] as $key => $type)
                        <button type="button" class="h-11 min-w-0 flex-auto whitespace-nowrap rounded-[10px] border border-shary-line bg-white px-1.5 text-[12.5px] font-bold leading-normal text-shary-navy transition-colors aria-pressed:border-shary-action aria-pressed:bg-shary-action aria-pressed:text-white lg:h-[46px] lg:text-[14px]" data-unit-type="{{ $key }}" aria-pressed="{{ $key === $first ? 'true' : 'false' }}">{{ $type['label'] }}</button>
                    @endforeach
                </div>
            </div>

            {{-- الأرقام --}}
            <div class="grid grid-cols-4 border-t border-shary-line pt-3 text-center">
                <div>
                    <b class="block text-[22px] font-bold leading-[1.2] text-shary-teal lg:text-[28px]" dir="ltr" data-k="price">{{ $index['types'][$first]['price'] }}</b>
                    <span class="area-up my-[3px]" dir="ltr">▲ <span data-k="change">{{ $index['types'][$first]['change'] }}</span></span>
                    <small class="block text-[11px] font-medium leading-normal text-shary-muted lg:text-[12.5px]">{{ __('areas.median') }} · <span data-k="label">{{ $index['types'][$first]['label'] }}</span></small>
                </div>
                <div class="border-s border-shary-line">
                    <b class="block text-[22px] font-bold leading-[1.2] text-shary-teal lg:text-[28px]" data-k="demand">{{ $index['types'][$first]['demand'] }}</b>
                    <small class="block text-[11px] font-medium leading-normal text-shary-muted lg:text-[12.5px]">{{ __('areas.demand') }}</small>
                </div>
                <div class="border-s border-shary-line px-1">
                    <b class="block text-[22px] font-bold leading-[1.2] text-shary-teal lg:text-[28px]" dir="ltr" data-k="growth">{{ $index['types'][$first]['growth'] }}</b>
                    <small class="block text-[11px] font-medium leading-normal text-shary-muted lg:text-[12.5px]">{{ __('areas.growth_period') }}</small>
                    <small class="block text-[11px] font-medium leading-normal text-shary-muted lg:text-[12.5px]">{{ __('areas.growth') }}</small>
                </div>
                <div class="border-s border-shary-line">
                    <div class="relative mx-auto h-[62px] w-[62px]">
                        <svg class="h-full w-full rotate-[135deg]" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" fill="none" stroke="#E3E9EF" stroke-width="3.2" stroke-dasharray="70.7 94.2" stroke-linecap="round"/><circle cx="18" cy="18" r="15" fill="none" stroke="#1F7F72" stroke-width="3.2" stroke-dasharray="{{ round($index['types'][$first]['index'] / 100 * 70.7, 1) }} 94.2" stroke-linecap="round" data-k-arc/></svg>
                        <b class="absolute inset-0 flex items-center justify-center text-[20px] font-bold leading-none" data-k="index">{{ $index['types'][$first]['index'] }}</b>
                    </div>
                    <small class="block text-[11px] font-medium leading-normal text-shary-muted lg:text-[12.5px]">{{ __('areas.index') }}</small>
                    <button type="button" class="mt-1 inline-flex max-w-full items-center gap-0.5 rounded-full bg-[#E4F5F0] px-1.5 py-0.5 text-start text-[10px] font-semibold leading-normal text-shary-teal lg:gap-1 lg:px-2 lg:text-[10.5px]" data-index-how aria-expanded="true" aria-controls="area-index-bars">
                        <span>{{ __('areas.how') }}</span>
                        <svg class="transition-transform" width="10" height="10" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 11.25L9 6.75L13.5 11.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
            </div>

            {{-- إزاي المؤشر اتحسب --}}
            <div id="area-index-bars" class="rounded-[14px] border border-shary-line p-3" data-index-bars>
                @foreach ($index['bars'] as $i => $bar)
                    <div class="grid grid-cols-[minmax(0,112px)_34px_minmax(0,1fr)_26px] items-center gap-2.5 py-1 text-[13px] leading-normal lg:grid-cols-[minmax(0,150px)_34px_minmax(0,1fr)_26px] lg:text-[14px]">
                        <span class="font-bold">{{ $bar['label'] }}</span>
                        <em class="text-[11px] font-medium not-italic text-shary-muted" dir="ltr">{{ $bar['weight'] }}</em>
                        <span class="h-2 overflow-hidden rounded-full bg-shary-soft"><i class="area-bar block h-full rounded-full" style="width: {{ $index['types'][$first]['bars'][$i] }}%" data-bar="{{ $i }}"></i></span>
                        <b class="text-[12.5px] font-bold" data-bar-value="{{ $i }}">{{ $index['types'][$first]['bars'][$i] }}</b>
                    </div>
                @endforeach
                <small class="mt-1.5 block text-[10.5px] font-medium leading-normal text-shary-muted lg:text-[11.5px]">{{ __('areas.index_note') }}</small>
            </div>

            <div class="flex items-center justify-between gap-2.5 rounded-xl border border-[#F6E2B8] bg-[#FFF8EA] px-3.5 py-2.5 text-[12.5px] font-medium leading-normal text-[#7A5A12] lg:text-[13.5px]">
                <span>{{ __('areas.compare', ['area' => $index['compare_area']]) }} (<b dir="ltr" data-k="compare_price">{{ $index['types'][$first]['compare_price'] }}</b> {{ __('areas.per_meter') }})</span>
                <b class="whitespace-nowrap rounded-full bg-shary-yellow px-3 py-[3px] text-[12px] font-bold text-shary-navy"><span dir="ltr" data-k="compare_diff">{{ $index['types'][$first]['compare_diff'] }}</span> <span data-k="compare_label">{{ $index['types'][$first]['compare_label'] }}</span></b>
            </div>

            <p class="rounded-xl border border-shary-line bg-shary-soft p-2.5 text-center text-[12.5px] font-medium leading-[1.7] text-shary-muted lg:text-[13.5px]">
                {{ __('areas.range') }} <b class="text-shary-navy" dir="ltr" data-k="range">{{ $index['types'][$first]['range'] }}</b> {{ __('areas.per_meter') }}<br>
                {{ __('areas.from') }} <b class="text-shary-navy" data-k="units">{{ $index['types'][$first]['units'] }}</b> {{ __('areas.units_in') }} <b class="text-shary-navy" data-k="projects">{{ $index['types'][$first]['projects'] }}</b> {{ __('areas.projects_word') }}
            </p>

            <p class="text-center text-[11px] font-medium leading-normal text-shary-muted lg:text-[12px]">{{ __('areas.shown_for') }} <b class="text-shary-navy">{{ $area['name'] }}</b></p>
        </div>
    </div>
</section>
