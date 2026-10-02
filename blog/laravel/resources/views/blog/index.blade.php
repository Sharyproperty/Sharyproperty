{{--
    صفحة المقالات (المدونة) — ديسك توب وموبايل في ملف واحد
    المتغيرات: $featured (المقال الرئيسي) ، $articles (باقي المقالات) ، $allArticlesUrl
    شكل كل مقال موضّح في: blog/partials/article-card.blade.php
--}}
@extends('layouts.site')

@section('title', 'المدونة — شاري')

@section('content')
    <div class="site-container flex flex-col gap-7 pb-8 pt-6 lg:gap-8 lg:pb-14 lg:pt-8">
        @include('blog.partials.featured-article', ['article' => $featured])

        <div class="flex items-center justify-between font-bold leading-normal">
            <h2 class="text-[24px] lg:text-[28px]">أحدث المقالات</h2>
            <a href="{{ $allArticlesUrl ?? '#' }}" class="text-[14px] text-shary-teal hover:underline lg:text-[15px]">عرض الكل</a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            @foreach ($articles as $index => $article)
                <div class="{{ $index > 0 ? 'mt-7 border-t border-shary-line pt-7 md:mt-0 md:border-t-0 md:pt-0' : '' }}">
                    @include('blog.partials.article-card', ['article' => $article])
                </div>
            @endforeach
        </div>

        <div class="flex justify-center pt-2 lg:pt-4">
            <div class="w-full lg:w-[480px]">
                @include('partials.consultation-form')
            </div>
        </div>
    </div>
@endsection
