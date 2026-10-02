{{--
    Layout بسيط للمعاينة بس (من غير هيدر ولا فوتر، لأنهم موجودين في الموقع).
    في المشروع: خلّي صفحات المدونة تعمل @extends للـ layout بتاعكم واستغنى عن الملف ده.
    المطلوب من الـ layout: lang="ar" dir="rtl" ، خط Cairo ، وملف الـ CSS.
--}}
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'شاري')</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;600;700;800&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css'])
</head>
<body class="bg-white font-cairo text-shary-navy antialiased">
    @include('partials.index-ticker')

    <main>
        @yield('content')
    </main>

    <script src="{{ asset('js/shary/phone-country.js') }}"></script>
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
