{{--
    كارت المقال
    $article = ['title', 'category', 'date', 'read_minutes', 'url', 'image' => صورة الغلاف]
--}}
<article class="flex flex-col gap-3 md:h-full">
    <a href="{{ $article['url'] }}" class="block overflow-hidden rounded bg-shary-image" tabindex="-1" aria-hidden="true">
        <img src="{{ $article['image'] }}" alt="" class="h-[196px] w-full object-cover lg:h-[200px]" loading="lazy">
    </a>

    <div class="flex items-center justify-between text-[13px] font-bold leading-normal">
        <span class="min-w-0 truncate text-shary-teal">{{ $article['category'] }}</span>
        <time class="shrink-0 ps-3 text-shary-muted">{{ $article['date'] }}</time>
    </div>

    <h3 class="line-clamp-3 text-[19px] font-bold leading-[1.55]">
        <a href="{{ $article['url'] }}" class="hover:text-shary-link">{{ $article['title'] }}</a>
    </h3>

    <div class="mt-auto flex items-center justify-between text-[13px] font-bold leading-normal">
        <span class="text-shary-muted">{{ __('blog.min_read', ['count' => $article['read_minutes']]) }}</span>
        <a href="{{ $article['url'] }}" class="text-shary-link hover:underline" aria-label="{{ __('blog.read_article_aria', ['title' => $article['title']]) }}">{{ __('blog.read_article') }}</a>
    </div>
</article>
