{{--
    مسار الصفحة (Breadcrumb) — تحت الهيدر مباشرة وفوق شريط مؤشر شاري، موبايل وديسك توب.
    صفحة المدونة:  الرئيسية ‹ المدونة
    صفحة المقال:   الرئيسية ‹ المدونة ‹ عنوان المقال
    $breadcrumbs = [['label' => 'الرئيسية', 'url' => '...'], ['label' => 'المدونة', 'url' => '...'], ['label' => 'عنوان المقال']]
    العنصر اللي له 'url' بيبقى لينك أزرق، وآخر عنصر (الصفحة الحالية) نص عادي وبيتقص بنقط لو طويل.
    $breadcrumbSchema = بيانات BreadcrumbList لمحركات البحث (JSON-LD) — بتتبني في الكنترولر.
--}}
@if (!empty($breadcrumbs))
    <div class="site-container pt-3 lg:pt-4" data-breadcrumb>
        <nav aria-label="{{ __('blog.breadcrumb') }}">
            <ol class="flex min-w-0 items-center gap-1.5 text-[13px] font-semibold leading-normal lg:text-[14px]">
                @foreach ($breadcrumbs as $index => $crumb)
                    @if ($index > 0)
                        <li class="shrink-0 text-shary-hint" aria-hidden="true">
                            <svg class="ltr:rotate-180" width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M11.25 4.5L6.75 9L11.25 13.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </li>
                    @endif
                    @if (!empty($crumb['url']))
                        <li class="shrink-0"><a href="{{ $crumb['url'] }}" class="text-shary-link hover:underline">{{ $crumb['label'] }}</a></li>
                    @else
                        <li class="min-w-0 truncate text-shary-muted" aria-current="page">{{ $crumb['label'] }}</li>
                    @endif
                @endforeach
            </ol>
        </nav>
    </div>
    @if (!empty($breadcrumbSchema))
        <script type="application/ld+json">{!! json_encode($breadcrumbSchema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}</script>
    @endif
@endif
