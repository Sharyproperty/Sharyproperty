{{--
    شريط مؤشر شاري (نفس شكل الهوم): زرار "مؤشر شاري" صغير ثابت على اليمين، وبعده المناطق بتتحرك
    (كل منطقة: الاسم وسعر المتر فوق، ونسبة الزيادة تحت).
    المتغيرات: $tickerItems = [['area' => 'التجمع الخامس', 'price' => '92,400', 'change' => '+2.4%'], ...]
               $indexUrl (لينك صفحة مؤشر شاري)
    العناصر متكررة 4 مرات عشان الحركة تبقى متصلة من غير فراغ (النسخ الزيادة مخفية عن قارئ الشاشة).
--}}
<div class="site-container pt-3 lg:pt-4">
    <div class="flex h-[52px] items-center overflow-hidden rounded-full bg-shary-deep p-1.5 text-[12px] font-bold leading-[1.4] text-white">
        <a href="{{ $indexUrl ?? '#' }}" class="flex h-10 shrink-0 items-center gap-[5px] whitespace-nowrap rounded-full bg-white pe-1.5 ps-2.5 text-[12px] text-shary-navy">
            <span class="h-1.5 w-1.5 rounded-full bg-shary-teal ring-[3px] ring-shary-teal/20" aria-hidden="true"></span>
            <span>{{ __('blog.index_title') }}</span>
            <img src="{{ asset('images/shary/icons/chevron-left.svg') }}" alt="" width="11" height="11" class="ltr:rotate-180">
        </a>

        <div class="index-ticker ms-2 min-w-0 flex-1 border-s border-white/30">
            <div class="index-ticker__track flex w-max items-center whitespace-nowrap">
                @foreach ([1, 2, 3, 4] as $copy)
                    <div class="flex shrink-0 items-center" @if ($copy > 1) aria-hidden="true" @endif>
                        @foreach (($tickerItems ?? []) as $item)
                            <span class="flex flex-col border-e border-white/30 px-3.5">
                                <span class="flex items-center gap-2">
                                    <span class="font-semibold text-shary-mist">{{ $item['area'] }}</span>
                                    <span>{{ $item['price'] }} {{ __('blog.currency') }}</span>
                                </span>
                                <span class="flex text-shary-mint"><bdi dir="ltr">{{ $item['change'] }}</bdi></span>
                            </span>
                        @endforeach
                    </div>
                @endforeach
            </div>
        </div>
    </div>
</div>
