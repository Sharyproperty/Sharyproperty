{{--
    المقال الرئيسي (الكارت الكبير)
    $article = [
        'title', 'category', 'author', 'date', 'read_minutes', 'url',
        'image'        => صورة الغلاف,
        'image_mobile' => صورة مخصوصة للموبايل (اختياري),
    ]
--}}
<a href="{{ $article['url'] }}" class="blog-featured-bg relative block h-[300px] overflow-hidden rounded lg:h-[360px]">
    <picture>
        @if (!empty($article['image_mobile']))
            <source media="(max-width: 767px)" srcset="{{ $article['image_mobile'] }}">
        @endif
        <img src="{{ $article['image'] }}" alt="" class="absolute inset-0 h-full w-full object-cover">
    </picture>

    <div class="blog-featured-tint absolute inset-0" aria-hidden="true"></div>
    <div class="blog-featured-shade absolute inset-x-0 bottom-0 h-[80%]" aria-hidden="true"></div>

    <div class="absolute inset-x-5 bottom-5 flex flex-col items-start gap-3 lg:bottom-9 lg:end-auto lg:start-9 lg:w-[620px] lg:gap-3.5">
        <span class="bg-white px-3 py-1.5 text-[13px] font-bold leading-[1.2] text-shary-navy lg:text-[14px]">{{ $article['category'] }}</span>

        <h2 class="line-clamp-3 text-[25px] font-bold leading-[1.45] text-white lg:line-clamp-2 lg:text-[40px] lg:leading-[1.4]">{{ $article['title'] }}</h2>

        <p class="flex flex-wrap items-center gap-x-2 text-[13px] font-semibold leading-normal text-shary-cloud lg:text-[14px]">
            <span>{{ $article['author'] }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ $article['date'] }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ __('blog.min_read', ['count' => $article['read_minutes']]) }}</span>
        </p>
    </div>
</a>
