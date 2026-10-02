{{--
    كارت المقال
    $article = ['title', 'category', 'date', 'read_minutes', 'url', 'image' => صورة الغلاف]
--}}
<article class="flex flex-col gap-3">
    <a href="{{ $article['url'] }}" class="block overflow-hidden rounded bg-shary-image" tabindex="-1" aria-hidden="true">
        <img src="{{ $article['image'] }}" alt="" class="h-[196px] w-full object-cover lg:h-[200px]" loading="lazy">
    </a>

    <div class="flex items-center justify-between text-[13px] font-bold leading-normal">
        <span class="text-shary-teal">{{ $article['category'] }}</span>
        <time class="text-shary-muted">{{ $article['date'] }}</time>
    </div>

    <h3 class="text-[19px] font-bold leading-[1.55]">
        <a href="{{ $article['url'] }}" class="hover:text-shary-teal">{{ $article['title'] }}</a>
    </h3>

    <div class="flex items-center justify-between text-[13px] font-bold leading-normal">
        <span class="text-shary-muted">{{ $article['read_minutes'] }} دقائق قراءة</span>
        <a href="{{ $article['url'] }}" class="text-shary-gold hover:underline" aria-label="اقرأ المقال: {{ $article['title'] }}">اقرأ المقال ←</a>
    </div>
</article>
