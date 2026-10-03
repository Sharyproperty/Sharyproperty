{{--
    مقال صغير في القوايم الجانبية (الأكثر قراءة / أحدث المقالات)
    $item = ['title', 'date', 'url', 'image']
--}}
<a href="{{ $item['url'] }}" class="group flex items-center gap-3">
    <img src="{{ $item['image'] }}" alt="" class="h-[80px] w-[96px] shrink-0 rounded bg-shary-image object-cover lg:h-[70px] lg:w-[84px]" loading="lazy">

    <span class="flex min-w-0 flex-1 flex-col gap-0.5">
        <span class="line-clamp-2 text-[15px] font-bold leading-normal group-hover:text-shary-link lg:text-[14px]">{{ $item['title'] }}</span>
        <time class="text-[12px] font-semibold leading-normal text-shary-muted">{{ $item['date'] }}</time>
    </span>
</a>
