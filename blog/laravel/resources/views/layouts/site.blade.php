{{--
    Layout للمعاينة: هيدر وفوتر بنفس شكل shary.eg + شريط المؤشر.
    في المشروع: خلّي صفحات المدونة تعمل @extends للـ layout بتاعكم واستغنى عن الملف ده.
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
<body class="bg-white font-cairo text-shary-navy antialiased">
    @include('partials.site-header')
    @include('partials.breadcrumb')
    @include('partials.index-ticker')

    <main>
        @yield('content')
    </main>

    @include('partials.site-footer')

    <script src="{{ asset('js/shary/site-chrome.js') }}"></script>
    <script src="{{ asset('js/shary/phone-country.js') }}"></script>
    @yield('scripts')
    <script>
        // زرار المشاركة في كارت "مقال مقترح": مشاركة الموبايل لو متاحة، وإلا نسخ اللينك
        document.querySelectorAll('[data-share-url]').forEach(function (button) {
            button.addEventListener('click', function () {
                var url = new URL(button.getAttribute('data-share-url'), location.href).href;
                if (navigator.share) {
                    navigator.share({ title: button.getAttribute('data-share-title') || document.title, url: url }).catch(function () {});
                } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(url).then(function () { button.setAttribute('data-copied', ''); }, function () {});
                }
            });
        });
    </script>
</body>
</html>
