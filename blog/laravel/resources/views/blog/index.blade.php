{{--
    صفحة المقالات (المدونة) — ديسك توب وموبايل في ملف واحد
    المتغيرات: $featured (المقال الرئيسي) ، $articles (باقي المقالات) ، $pagination (أرقام الصفحات — ديسك توب)
    شكل كل مقال موضّح في: blog/partials/article-card.blade.php
--}}
@extends('layouts.site')

@section('title', __('blog.blog_meta_title'))

@section('head')
    <meta name="description" content="{{ __('blog.blog_meta_description') }}">
@endsection

@section('scripts')
    <script src="{{ asset('js/shary/blog-load-more.js') }}"></script>
@endsection

@section('content')
    <div class="site-container flex flex-col gap-7 pb-8 pt-6 lg:gap-8 lg:pb-14 lg:pt-8">
        {{-- عنوان الصفحة H1 لمحركات البحث (مش ظاهر في التصميم) --}}
        <h1 class="sr-only">{{ __('blog.blog_h1') }}</h1>

        @include('blog.partials.featured-article', ['article' => $featured])

        <h2 class="text-[24px] font-bold leading-normal lg:text-[28px]">{{ __('blog.latest_articles') }}</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-8 lg:grid-cols-3" data-articles-grid>
            @foreach ($articles as $index => $article)
                <div class="md:h-full {{ $index > 0 ? 'mt-7 border-t border-shary-line pt-7 md:mt-0 md:border-t-0 md:pt-0' : '' }}">
                    @include('blog.partials.article-card', ['article' => $article])
                </div>
            @endforeach
        </div>

        @include('blog.partials.pagination')

        <div class="flex justify-center pt-2 lg:pt-4">
            <div class="w-full lg:w-[480px]">
                @include('partials.consultation-form')
            </div>
        </div>
    </div>
@endsection
