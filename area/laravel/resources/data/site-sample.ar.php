<?php

/*
 | بيانات الموقع المشتركة بين كل الصفحات (الهيدر، الفوتر، الفورمات، شريط المؤشر) — العربية.
 | في المشروع: الداتا دي بتيجي من إعدادات الموقع / قاعدة البيانات بنفس أسماء المفاتيح.
 | 'key' على رابط الهيدر بيحدد الصفحة المفتوحة (الكنترولر بيلوّنه أزرق).
 */

return [
    'navLinks' => [
        ['label' => 'الرئيسية', 'url' => url('/')],
        ['label' => 'المطورين', 'url' => url('/developers'), 'key' => 'developers'],
        ['label' => 'المشاريع', 'url' => url('/projects')],
        ['label' => 'بيع', 'url' => url('/sell')],
        ['label' => 'المدونة', 'url' => url('/blog'), 'key' => 'blog'],
        ['label' => 'من نحن', 'url' => url('/about')],
        ['label' => 'اتصل بنا', 'url' => url('/contact')],
        ['label' => 'الوكلاء', 'url' => url('/agents'), 'children' => [
            ['label' => 'الوكلاء المعتمدون', 'url' => url('/verified-agents')],
        ]],
    ],
    'appUrl' => url('/app'),
    'indexUrl' => url('/shary-index'),
    'tickerItems' => [
        ['area' => 'الشيخ زايد', 'price' => '88,100', 'change' => '+4.2%'],
        ['area' => 'العاصمة الإدارية', 'price' => '74,600', 'change' => '+3.1%'],
        ['area' => 'الساحل الشمالي', 'price' => '115,300', 'change' => '+6.8%'],
        ['area' => 'التجمع الخامس', 'price' => '92,400', 'change' => '+2.4%'],
    ],
    // صفحة Shary AI: اختيارات البداية. aiUser = ['name', 'avatar'] للعميل المسجل (null = ضيف). aiEndpoint = لينك استقبال الرسائل
    'aiSuggestions' => ['المستقبل سيتي', 'العاصمة الإدارية الجديدة', 'التجمع الخامس', 'الساحل الشمالي', 'أخرى'],
    'aiUser' => null,
    'aiEndpoint' => '',
    'contact' => ['phone' => '+201000730208', 'phone_display' => '+201000730208', 'whatsapp' => '201000730208', 'email' => 'info@shary.eg'],
    'consultationAction' => url('/consultations'),
    'meetingUrl' => url('/meetings/request'),
    // أوقات الاجتماع المتاحة في فورم «طلب اجتماع»
    'meetingTimes' => [
        ['value' => '10:00', 'label' => '10:00 ص'],
        ['value' => '11:00', 'label' => '11:00 ص'],
        ['value' => '12:00', 'label' => '12:00 م'],
        ['value' => '13:00', 'label' => '01:00 م'],
        ['value' => '14:00', 'label' => '02:00 م'],
        ['value' => '15:00', 'label' => '03:00 م'],
        ['value' => '16:00', 'label' => '04:00 م'],
        ['value' => '17:00', 'label' => '05:00 م'],
    ],
    'areas' => ['التجمع الخامس', 'الشيخ زايد', 'العاصمة الإدارية', 'الساحل الشمالي'],
    'phoneCountries' => [
        ['name' => 'مصر', 'iso' => 'eg', 'code' => '+20'],
        ['name' => 'السعودية', 'iso' => 'sa', 'code' => '+966'],
        ['name' => 'الإمارات', 'iso' => 'ae', 'code' => '+971'],
        ['name' => 'الكويت', 'iso' => 'kw', 'code' => '+965'],
        ['name' => 'قطر', 'iso' => 'qa', 'code' => '+974'],
        ['name' => 'البحرين', 'iso' => 'bh', 'code' => '+973'],
        ['name' => 'عُمان', 'iso' => 'om', 'code' => '+968'],
        ['name' => 'الأردن', 'iso' => 'jo', 'code' => '+962'],
        ['name' => 'لبنان', 'iso' => 'lb', 'code' => '+961'],
        ['name' => 'العراق', 'iso' => 'iq', 'code' => '+964'],
        ['name' => 'ليبيا', 'iso' => 'ly', 'code' => '+218'],
        ['name' => 'السودان', 'iso' => 'sd', 'code' => '+249'],
        ['name' => 'المغرب', 'iso' => 'ma', 'code' => '+212'],
        ['name' => 'الجزائر', 'iso' => 'dz', 'code' => '+213'],
        ['name' => 'تونس', 'iso' => 'tn', 'code' => '+216'],
        ['name' => 'فلسطين', 'iso' => 'ps', 'code' => '+970'],
        ['name' => 'اليمن', 'iso' => 'ye', 'code' => '+967'],
        ['name' => 'سوريا', 'iso' => 'sy', 'code' => '+963'],
        ['name' => 'تركيا', 'iso' => 'tr', 'code' => '+90'],
        ['name' => 'بريطانيا', 'iso' => 'gb', 'code' => '+44'],
        ['name' => 'أمريكا', 'iso' => 'us', 'code' => '+1'],
        ['name' => 'كندا', 'iso' => 'ca', 'code' => '+1'],
        ['name' => 'ألمانيا', 'iso' => 'de', 'code' => '+49'],
        ['name' => 'فرنسا', 'iso' => 'fr', 'code' => '+33'],
        ['name' => 'إيطاليا', 'iso' => 'it', 'code' => '+39'],
        ['name' => 'هولندا', 'iso' => 'nl', 'code' => '+31'],
        ['name' => 'أستراليا', 'iso' => 'au', 'code' => '+61'],
        ['name' => 'سويسرا', 'iso' => 'ch', 'code' => '+41'],
        ['name' => 'السويد', 'iso' => 'se', 'code' => '+46'],
    ],
    'footerGroups' => [
        [
            'title' => 'المناطق',
            'links' => [
                ['label' => '6 أكتوبر', 'url' => url('/areas/1')],
                ['label' => 'العين السخنة', 'url' => url('/areas/2')],
                ['label' => 'الرحاب', 'url' => url('/areas/3')],
                ['label' => 'الإسكندرية', 'url' => url('/areas/4')],
                ['label' => 'مدينة بدر', 'url' => url('/areas/5')],
                ['label' => 'القاهرة', 'url' => url('/areas/6')],
                ['label' => 'الجونة', 'url' => url('/areas/7')],
                ['label' => 'الشيخ زايد', 'url' => url('/areas/8')],
                ['label' => 'الشروق', 'url' => url('/areas/9')],
            ],
        ],
        [
            'title' => 'كمبوند',
            'links' => [
                ['label' => 'ذا سباين TMG القاهرة الجديدة', 'url' => url('/compounds/1')],
                ['label' => 'كريك فيو القاهرة الجديدة', 'url' => url('/compounds/2')],
            ],
        ],
        [
            'title' => 'المطورين',
            'links' => [
                ['label' => 'طلعت مصطفى (TMG)', 'url' => url('/developers/1')],
                ['label' => 'ماونتن ڤيو', 'url' => url('/developers/2')],
                ['label' => 'لافيستا', 'url' => url('/developers/3')],
            ],
        ],
        [
            'title' => 'للبيع',
            'links' => [
                ['label' => 'شقق للبيع في العلمين الجديدة', 'url' => url('/for-sale/1')],
                ['label' => 'شقق للبيع في التجمع الخامس', 'url' => url('/for-sale/2')],
            ],
        ],
        [
            'title' => 'للإيجار',
            'links' => [
                ['label' => 'شقق للإيجار في التجمع الخامس', 'url' => url('/for-rent/1')],
            ],
        ],
    ],
    'footerLinks' => [
        ['label' => 'الرئيسية', 'url' => url('/')],
        ['label' => 'المطورين', 'url' => url('/developers')],
        ['label' => 'المشاريع', 'url' => url('/projects')],
        ['label' => 'بيع', 'url' => url('/sell')],
        ['label' => 'المدونة', 'url' => url('/blog')],
        ['label' => 'من نحن', 'url' => url('/about')],
        ['label' => 'اتصل بنا', 'url' => url('/contact')],
        ['label' => 'الشروط والأحكام', 'url' => url('/terms')],
        ['label' => 'سياسة الخصوصية', 'url' => url('/privacy')],
        ['label' => 'الوكلاء', 'url' => url('/agents')],
    ],
    'socialLinks' => [
        ['label' => 'فيسبوك', 'url' => '#', 'icon' => 'fa-facebook-f'],
        ['label' => 'إنستجرام', 'url' => '#', 'icon' => 'fa-instagram'],
        ['label' => 'إكس', 'url' => '#', 'icon' => 'fa-x-twitter'],
        ['label' => 'يوتيوب', 'url' => '#', 'icon' => 'fa-youtube'],
        ['label' => 'لينكدإن', 'url' => '#', 'icon' => 'fa-linkedin-in'],
        ['label' => 'سناب شات', 'url' => '#', 'icon' => 'fa-snapchat'],
        ['label' => 'تيك توك', 'url' => '#', 'icon' => 'fa-tiktok'],
    ],
    'appLinks' => ['google_play' => '#', 'app_store' => '#'],
];
