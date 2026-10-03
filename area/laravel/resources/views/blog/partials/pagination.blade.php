{{--
    ترقيم صفحات المقالات — بيظهر في الديسك توب بس (تحت صف المقالات).
    على الموبايل والتابلت الأرقام مخفية، والمقالات التالية بتتحمّل لوحدها مع السكرول (js/shary/blog-load-more.js).
    $pagination = [
        'prev' => لينك الصفحة السابقة أو null ، 'next' => لينك الصفحة التالية أو null ،
        'pages' => [['label' => 1, 'url' => '...', 'active' => true], ['label' => 2, 'url' => '...'], ['gap' => true], ...]
    ]
--}}
@if (!empty($pagination['pages']) && count($pagination['pages']) > 1)
    <nav class="hidden items-center justify-center gap-2 pt-2 text-[15px] font-bold leading-none lg:flex" aria-label="{{ __('blog.pagination') }}" data-pagination data-next-url="{{ $pagination['next'] ?? '' }}">
        @if (!empty($pagination['prev']))
            <a href="{{ $pagination['prev'] }}" rel="prev" class="flex h-10 w-10 items-center justify-center rounded-[10px] border border-shary-line text-shary-navy transition-colors hover:border-shary-link hover:text-shary-link active:border-shary-link active:text-shary-link" aria-label="{{ __('blog.prev_page') }}">
                <svg class="rtl:rotate-180" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M11.25 4.5L6.75 9L11.25 13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
        @else
            <span class="flex h-10 w-10 items-center justify-center rounded-[10px] border border-shary-line text-shary-mist" aria-hidden="true">
                <svg class="rtl:rotate-180" width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M11.25 4.5L6.75 9L11.25 13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
        @endif

        @foreach ($pagination['pages'] as $page)
            @if (!empty($page['gap']))
                <span class="flex h-10 w-6 items-center justify-center text-shary-hint" aria-hidden="true">…</span>
            @elseif (!empty($page['active']))
                <span class="flex h-10 min-w-[40px] items-center justify-center rounded-[10px] bg-shary-form px-3 text-shary-navy" aria-current="page">{{ $page['label'] }}</span>
            @else
                <a href="{{ $page['url'] }}" class="flex h-10 min-w-[40px] items-center justify-center rounded-[10px] border border-shary-line px-3 text-shary-navy transition-colors hover:border-shary-link hover:text-shary-link active:border-shary-link active:text-shary-link" aria-label="{{ __('blog.page_number', ['number' => $page['label']]) }}">{{ $page['label'] }}</a>
            @endif
        @endforeach

        @if (!empty($pagination['next']))
            <a href="{{ $pagination['next'] }}" rel="next" class="flex h-10 w-10 items-center justify-center rounded-[10px] border border-shary-line text-shary-navy transition-colors hover:border-shary-link hover:text-shary-link active:border-shary-link active:text-shary-link" aria-label="{{ __('blog.next_page') }}">
                <svg class="ltr:rotate-180" width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M11.25 4.5L6.75 9L11.25 13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
        @else
            <span class="flex h-10 w-10 items-center justify-center rounded-[10px] border border-shary-line text-shary-mist" aria-hidden="true">
                <svg class="ltr:rotate-180" width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M11.25 4.5L6.75 9L11.25 13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
        @endif
    </nav>
@endif
