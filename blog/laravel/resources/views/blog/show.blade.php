{{--
    صفحة المقال (جوه)
    $article = [
        'title' (H1), 'author', 'updated_at' (نص جاهز للعرض), 'image', 'image_alt', 'image_caption' (اختياري),
        'meta_title', 'meta_description', 'canonical', 'focus_keyword', 'schema' (JSON-LD),
        'faqs' => [['question', 'answer'], ...] (اختياري),
        'body_html' => محتوى المقال HTML من لوحة التحكم (بيتنسّق بـ class="article-content"),
        'tags' => [['name', 'url'], ...] (اختياري),
    ]
    $mostRead ، $latest = [['title', 'date', 'url', 'image'], ...]
--}}
@extends('layouts.site')

@section('title', $article['meta_title'] ?? ($article['title'] . ' — شاري'))

@section('head')
    <meta name="description" content="{{ $article['meta_description'] ?? '' }}">
    <link rel="canonical" href="{{ $article['canonical'] ?? '' }}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="{{ $article['title'] }}">
    <meta property="og:description" content="{{ $article['meta_description'] ?? '' }}">
    <meta property="og:image" content="{{ $article['image'] }}">
    <script type="application/ld+json">{!! json_encode($article['schema'] ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}</script>
@endsection

@section('content')
    <div class="site-container grid grid-cols-1 gap-y-[18px] pb-8 pt-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-x-10 lg:pb-16 lg:pt-10">
        <header class="flex flex-col gap-[18px] lg:col-start-1 lg:row-start-1">
            <h1 class="text-[26px] font-bold leading-[1.45] lg:text-[34px]">{{ $article['title'] }}</h1>

            <p class="flex flex-wrap items-center gap-x-2.5 text-[13px] leading-normal">
                <span class="font-bold text-shary-teal">{{ $article['author'] }}</span>
                <span class="font-bold text-shary-muted" aria-hidden="true">·</span>
                <span class="font-semibold text-shary-muted">{{ __('blog.last_updated', ['date' => $article['updated_at']]) }}</span>
            </p>
        </header>

        <article class="article-content min-w-0 lg:col-start-1 lg:row-start-2">
            <figure>
                <img src="{{ $article['image'] }}" alt="{{ $article['image_alt'] ?? ($article['image_caption'] ?? '') }}" class="h-[220px] w-full rounded bg-shary-image object-cover lg:h-[380px]">
                @if (!empty($article['image_caption']))
                    <figcaption>{{ $article['image_caption'] }}</figcaption>
                @endif
            </figure>

            {!! $article['body_html'] !!}

            @if (!empty($article['faqs']))
                <h2 id="faq">{{ __('blog.faq_about', ['topic' => $article['focus_keyword'] ?? '']) }}</h2>
                <div class="article-faq">
                    @foreach ($article['faqs'] as $faq)
                        <details>
                            <summary>{{ $faq['question'] }}</summary>
                            <p>{{ $faq['answer'] }}</p>
                        </details>
                    @endforeach
                </div>
            @endif

            @if (!empty($article['tags']))
                <div class="flex flex-wrap items-center gap-2">
                    <span class="bg-shary-navy px-3 py-1.5 text-[13px] font-bold leading-normal text-white">{{ __('blog.tags') }}</span>
                    @foreach ($article['tags'] as $tag)
                        <a href="{{ $tag['url'] }}" class="border border-shary-line px-3 py-1.5 text-[13px] font-bold leading-normal text-shary-navy hover:border-shary-teal hover:text-shary-teal">{{ $tag['name'] }}</a>
                    @endforeach
                </div>
            @endif
        </article>

        <aside class="mt-3.5 flex flex-col gap-8 lg:col-start-2 lg:row-start-2 lg:mt-0">
            @include('partials.consultation-form', ['compact' => true])

            <section class="flex flex-col gap-3.5">
                <h2 class="text-[21px] font-bold leading-normal lg:text-[20px]">{{ __('blog.most_read') }}</h2>
                @foreach ($mostRead as $item)
                    @include('blog.partials.mini-article', ['item' => $item])
                @endforeach
            </section>

            <section class="flex flex-col gap-3.5">
                <h2 class="text-[21px] font-bold leading-normal lg:text-[20px]">{{ __('blog.latest_articles') }}</h2>
                @foreach ($latest as $item)
                    @include('blog.partials.mini-article', ['item' => $item])
                @endforeach
            </section>
        </aside>
    </div>
@endsection
