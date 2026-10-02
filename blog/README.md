# صفحات المدونة — شاري

صفحتين من تصميم فيجما، ريسبونسف (موبايل / تابلت / ديسك توب) و RTL، **من غير الهيدر والفوتر** (موجودين في الموقع):

- **صفحة المدونة** (من بره): المقال الرئيسي + كروت المقالات + فورم الاستشارة.
- **صفحة المقال** (من جوه): محتوى المقال + الفورم + الأكثر قراءة + أحدث المقالات.

مصدر التصميم: https://www.figma.com/design/cDoBxfwane4VnsmNEubGij

## محتوى الفولدر

| المسار | الوظيفة |
|---|---|
| `html/blog.html` | صفحة المدونة — HTML + Tailwind |
| `html/article.html` | صفحة المقال — HTML + Tailwind |
| `html/css/shary-blog.css` | الـ CSS جاهز (طالع من Tailwind v3.4.17) |
| `html/images/` | الأيقونات (SVG) وصور تجريبية |
| `html/js/shary/phone-country.js` | سكربت اختيار كود الدولة في الفورم |
| `laravel/` | نفس الصفحتين Blade لمشروع Laravel + ملفات Tailwind المصدر |

افتح `html/blog.html` في المتصفح مباشرة عشان تشوف الصفحة.

## الربط بالموقع (HTML + Tailwind)

1. انسخ اللي جوه `<main>` من كل صفحة لقالب الصفحة في الموقع (جوه الهيدر والفوتر بتوعكم).
2. شريط **مؤشر شاري** هو الـ `<div class="site-container ...">` اللي قبل `<main>`. لو الموقع عنده الشريط ده بالفعل، متنسخوش.
3. الـ CSS — اختار واحدة:
   - **الموقع عليه Tailwind:** انقل ألوان `shary` والخط من `laravel/tailwind.config.js` (جوه `theme.extend`) ومحتوى `@layer components` من `laravel/resources/css/app.css` لملفات المشروع، وابنِ الـ CSS عادي.
   - **من غير build:** اربط `html/css/shary-blog.css` زي ما هو.
4. الخط: Cairo بأوزان 500 / 600 / 700 / 800، والصفحة `lang="ar" dir="rtl"`.

إعادة بناء الـ CSS بعد أي تعديل:

```
cd laravel
npx tailwindcss@3 -c tailwind.config.js -i resources/css/app.css -o ../html/css/shary-blog.css
```

## الربط في Laravel (اختياري)

`laravel/` فيها نفس الصفحتين Blade:

| الملف | الوظيفة |
|---|---|
| `resources/views/blog/index.blade.php` | صفحة المدونة |
| `resources/views/blog/show.blade.php` | صفحة المقال |
| `resources/views/blog/partials/` | المقال الرئيسي، كارت المقال، المقال الصغير |
| `resources/views/partials/consultation-form.blade.php` | فورم الاستشارة + طلب مقابلة + اتصال + واتساب |
| `resources/views/partials/index-ticker.blade.php` | شريط مؤشر شاري |
| `resources/views/layouts/site.blade.php` | layout للمعاينة بس — استبدلوه بالـ layout بتاعكم |
| `resources/views/blog/samples/` | محتوى مقال تجريبي (بيمثّل الـ HTML اللي جاي من لوحة التحكم) |
| `app/Http/Controllers/BlogController.php` | كنترولر ببيانات تجريبية بنفس محتوى التصميم |
| `routes/blog.php` | سطور الـ routes |

كل البيانات جاية من الكنترولر. استبدلوا الدوال `sample*()` بالداتا الحقيقية بنفس أسماء المفاتيح (شكل كل متغير مكتوب في تعليق أول ملف الـ Blade اللي بيستخدمه).

## محتوى المقال

محتوى المقال HTML عادي جوه `<article class="article-content">`، والتنسيق كله جاي من الـ class ده:

| العنصر | الشكل |
|---|---|
| `p` ، `h2` | فقرة وعنوان |
| `ul` ، `ol` | قايمة نقط / قايمة مرقّمة |
| `<li><strong>عنوان</strong> <span>شرح</span></li>` | عنصر بعنوان وتحته شرح |
| `figure` + `img` + `figcaption` | صورة وتحتها وصف |
| `table` (`thead` / `tbody`، وأول خانة في الصف `th`) | جدول المقارنة |
| `a.article-cta` | الشريط الأخضر (لينك لجزء في المقال أو لمقال تاني) |
| `figure.article-places` | إنفوجراف الأماكن (الدواير) |
| `aside.article-related` | كارت مقال مقترح بصورة وزرار مشاركة |

الوسوم بتتعرض من `$article['tags']` بعد المحتوى.

## الفورم

- بيتبعت `POST` على `$consultationAction` ومعاه `@csrf` (في نسخة الـ HTML الـ `action="#"`).
- الحقول: `name`, `area`, `country_code`, `phone`, `message`.
- **كود الدولة:** جنب رقم الهاتف زرار بعلم الدولة والكود. الضغط عليه بيفتح قايمة الدول، والاختيار بيغيّر العلم والكود وقيمة الحقل المخفي `country_code` (مثال: `+20`). الكود في `js/shary/phone-country.js` (في Laravel: `public/js/shary/`)، والأعلام في `images/shary/flags/`، وقايمة الدول من `$phoneCountries` في الكنترولر (أول دولة هي الافتراضية). لو الموقع عنده كومبوننت جاهز لكود الدولة (زي intl-tel-input) ممكن يتحط مكانه.
- رسايل الـ validation مش مرسومة في التصميم فمش موجودة في الكود.

## شريط مؤشر شاري

نفس شكل الهوم: شريط كحلي بحواف دائرية، على اليمين زرار أبيض صغير "مؤشر شاري" (نقطة خضرا + سهم) بيفتح `$indexUrl`، وبعده المناطق بتتحرك تلقائي (اسم المنطقة والسعر فوق، ونسبة الزيادة تحت) وبتقف لما الماوس ييجي عليها. العناصر متكررة 4 مرات في الـ HTML عشان الحركة تبقى متصلة. السرعة من `animation: index-ticker 36s` في الـ CSS.

## نقط التحويل (Breakpoints)

| العرض | المدونة | المقال |
|---|---|---|
| أقل من 768px | عمود واحد | عمود واحد |
| 768 – 1023px | عمودين | عمود واحد |
| 1024px وأكبر | 3 أعمدة، المحتوى بعرض 1040px | المقال + عمود جانبي 320px |

## ملاحظات

- الصور اللي في `images/shary/blog-samples/` صور تجريبية عامة (من Pixabay) لحد ما تتحط صور المقالات الحقيقية.
- الأعلام من مكتبة flag-icons (رخصة MIT).
- لون المقال الرئيسي (الأزرق) من `.blog-featured-bg` / `.blog-featured-tint` / `.blog-featured-shade` في الـ CSS.
- الكود على Tailwind v3. كل الـ classes المستخدمة شغالة على v4 كمان (الألوان بتتعرّف هناك بـ `@theme`).
