{{--
    Layout للمعاينة: هيدر وفوتر بنفس شكل shary.eg + مسار الصفحة + شريط المؤشر + فورم طلب الاجتماع.
    في المشروع: خلّي الصفحات تعمل @extends للـ layout بتاعكم واستغنى عن الملف ده.
    المطلوب من الـ layout: lang و dir حسب اللغة (ar = rtl ، en = ltr) ، خط Cairo ، وملف الـ CSS.
--}}
<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'شاري')</title>
    @yield('head')

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;600;700;800&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css'])

    {{-- أيقونات السوشيال والمتاجر: Font Awesome Free (النسخة اللي بترسم SVG) --}}
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/js/brands.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/js/fontawesome.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</head>
<body class="@yield('body-class', 'bg-white') font-cairo text-shary-navy antialiased">
    @include('partials.site-header')
    {{-- $breadcrumbInPage = true: الصفحة بتحط مسار الصفحة في مكانها (صفحة المنطقة: تحت الهيدر الأزرق) --}}
    @if (empty($breadcrumbInPage))
        @include('partials.breadcrumb')
    @endif
    {{-- $showTicker = false: صفحة من غير شريط مؤشر شاري --}}
    @if ($showTicker ?? true)
        @include('partials.index-ticker')
    @endif

    <main>
        @yield('content')
    </main>

    @include('partials.site-footer')
    @include('partials.meeting-modal')

    <script src="{{ asset('js/shary/site-chrome.js') }}"></script>
    <script src="{{ asset('js/shary/phone-country.js') }}"></script>
    <script src="{{ asset('js/shary/meeting-modal.js') }}"></script>
    @yield('scripts')
</body>
</html>
