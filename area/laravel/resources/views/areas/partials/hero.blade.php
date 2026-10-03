{{--
    الهيدر الأزرق لصفحة المنطقة: شارة "منطقة" + اسم المنطقة (H1) + وصف + 3 أرقام.
    $area = ['chip', 'name', 'intro', 'stats' => [['value', 'label'], ...]]
--}}
<header class="area-hero relative overflow-hidden text-white">
    <div class="site-container relative pb-5 pt-[22px] lg:pb-9 lg:pt-14">
        <span class="inline-block rounded-full border border-white/50 px-3 py-[3px] text-[12px] font-semibold leading-normal">{{ $area['chip'] }}</span>
        <h1 class="mt-2.5 text-[30px] font-extrabold leading-[1.25] lg:text-[48px] lg:leading-[1.2]">{{ $area['name'] }}</h1>
        <p class="mt-1.5 max-w-[620px] text-[14px] font-medium leading-[1.7] text-white/90 lg:text-[17px]">{{ $area['intro'] }}</p>
    </div>

    <div class="relative lg:mx-auto lg:max-w-[1080px] lg:px-5 lg:pb-9">
        <dl class="area-hero__stats grid grid-cols-3 border-t border-white/20 lg:rounded-2xl lg:border">
            @foreach ($area['stats'] as $index => $stat)
                <div class="flex flex-col-reverse px-1.5 py-3 text-center lg:p-[18px] {{ $index > 0 ? 'border-s border-white/20' : '' }}">
                    <dt class="text-[12px] font-medium leading-normal text-white/80 lg:text-[14px]">{{ $stat['label'] }}</dt>
                    <dd class="text-[22px] font-bold leading-[1.3] text-shary-yellow lg:text-[32px]" dir="ltr">{{ $stat['value'] }}</dd>
                </div>
            @endforeach
        </dl>
    </div>
</header>
