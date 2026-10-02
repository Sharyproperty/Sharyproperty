<?php

/*
 | بيانات تجريبية لصفحات المدونة — العربية (نفس محتوى التصميم).
 | في المشروع: الداتا دي بتيجي من قاعدة البيانات / لوحة التحكم بنفس أسماء المفاتيح.
 */

$faqs = [
    [
        'question' => 'كم تبعد العاصمة الإدارية الجديدة عن القاهرة؟',
        'answer' => 'تبعد العاصمة الإدارية نحو 45 كيلومترًا عن وسط القاهرة، ويمكن الوصول إليها من القاهرة الجديدة في دقائق عبر محور محمد بن زايد.',
    ],
    [
        'question' => 'ما أفضل حي سكني في العاصمة الإدارية؟',
        'answer' => 'الحي السكني السابع R7 والحي الثامن R8 الأكثر طلبًا بين مشروعات المطورين، بينما يناسب الحي الثالث R3 من يبحث عن وحدات جاهزة في منطقة مأهولة.',
    ],
    [
        'question' => 'هل يمكن الوصول إلى العاصمة الإدارية بالمواصلات العامة؟',
        'answer' => 'نعم، عبر القطار الكهربائي الخفيف من محطة عدلي منصور، ومونوريل شرق النيل من مدينة نصر، بالإضافة إلى خطوط الأتوبيسات.',
    ],
    [
        'question' => 'هل العاصمة الإدارية مناسبة للاستثمار العقاري؟',
        'answer' => 'تناسب المستثمر طويل الأجل الذي يختار مطورًا موثوقًا وموقعًا قريبًا من الخدمات ومحاور الحركة، مع مراجعة نسبة التنفيذ ومتوسط الأسعار قبل الشراء.',
    ],
    [
        'question' => 'كيف أعرف متوسط سعر المتر الحالي في العاصمة الإدارية؟',
        'answer' => 'من مؤشر شاري، الذي يعرض متوسط سعر المتر المحدَّث لكل منطقة ونوع وحدة ونسبة التغير.',
    ],
];

return [
    'shared' => [
        'navLinks' => [
            ['label' => 'الرئيسية', 'url' => url('/')],
            ['label' => 'المطورين', 'url' => url('/developers')],
            ['label' => 'المشاريع', 'url' => url('/projects')],
            ['label' => 'بيع', 'url' => url('/sell')],
            ['label' => 'المدونة', 'url' => url('/blog'), 'active' => true],
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
        'contact' => ['phone' => '+201000730208', 'phone_display' => '+201000730208', 'whatsapp' => '201000730208', 'email' => 'info@shary.eg'],
        'consultationAction' => url('/consultations'),
        'meetingUrl' => url('/meetings/request'),
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
    ],

    'listing' => [
        'langUrl' => url('/en/blog'),
        // أرقام الصفحات (ديسك توب). في الموقع بتتبني من الـ paginator
        'pagination' => [
            'prev' => null,
            'next' => url('/blog?page=2'),
            'pages' => [
                ['label' => 1, 'url' => url('/blog'), 'active' => true],
                ['label' => 2, 'url' => url('/blog?page=2')],
                ['label' => 3, 'url' => url('/blog?page=3')],
                ['gap' => true],
                ['label' => 8, 'url' => url('/blog?page=8')],
            ],
        ],
        'featured' => [
            'title' => 'سوق العقارات في مصر 2026: دليل شاري لقراءة السوق قبل الشراء',
            'category' => 'تقارير السوق',
            'author' => 'فريق شاري',
            'date' => '4 أغسطس 2026',
            'read_minutes' => 8,
            'url' => url('/blog/egypt-real-estate-2026'),
            'image' => asset('images/shary/blog-samples/featured-market.jpg'),
        ],
        'articles' => [
            [
                'title' => 'أنواع التمويل العقاري في مصر وكيف تختار الأنسب لك',
                'category' => 'التمويل والتقسيط',
                'date' => '3 أغسطس 2026',
                'read_minutes' => 6,
                'url' => url('/blog/mortgage-types'),
                'image' => asset('images/shary/blog-samples/card-finance.jpg'),
            ],
            [
                'title' => 'أسعار المتر في القاهرة الجديدة: تقرير الربع الثالث 2026',
                'category' => 'تقارير السوق',
                'date' => '2 أغسطس 2026',
                'read_minutes' => 5,
                'url' => url('/blog/new-cairo-prices-q3'),
                'image' => asset('images/shary/blog-samples/card-prices.jpg'),
            ],
            [
                'title' => 'الشيخ زايد أم 6 أكتوبر؟ مقارنة شاملة قبل الشراء',
                'category' => 'دليل المناطق',
                'date' => '31 يوليو 2026',
                'read_minutes' => 7,
                'url' => url('/blog/zayed-vs-october'),
                'image' => asset('images/shary/blog-samples/card-areas.jpg'),
            ],
            [
                'title' => '7 بنود يجب مراجعتها في عقد حجز الوحدة قبل التوقيع',
                'category' => 'قانوني وتعاقدات',
                'date' => '29 يوليو 2026',
                'read_minutes' => 4,
                'url' => url('/blog/reservation-contract-checklist'),
                'image' => asset('images/shary/blog-samples/card-legal.jpg'),
            ],
            [
                'title' => 'مشاريع العاصمة الإدارية الجديدة 2026 وأنظمة السداد',
                'category' => 'مشاريع جديدة',
                'date' => '26 يوليو 2026',
                'read_minutes' => 6,
                'url' => url('/blog/new-capital-projects-2026'),
                'image' => asset('images/shary/blog-samples/card-projects.jpg'),
            ],
            [
                'title' => 'إعادة البيع أم الشراء من المطور: متى يكون الريسيل أفضل؟',
                'category' => 'إعادة البيع',
                'date' => '22 يوليو 2026',
                'read_minutes' => 5,
                'url' => url('/blog/resale-vs-developer-price'),
                'image' => asset('images/shary/blog-samples/card-resale.jpg'),
            ],
        ],
    ],

    'article' => [
        'langUrl' => url('/en/blog/new-capital-guide'),
        'article' => [
            'title' => 'العاصمة الإدارية الجديدة: دليل الكمبوندات والخدمات وأسعار المتر 2026',
            'author' => 'فريق شاري',
            'updated_at' => '4 أغسطس 2026',
            'image' => asset('images/shary/blog-samples/article-new-capital.jpg'),
            'image_alt' => 'العاصمة الإدارية الجديدة — حي المال والأعمال',
            'image_caption' => 'العاصمة الإدارية الجديدة — حي المال والأعمال',
            'meta_title' => 'العاصمة الإدارية الجديدة 2026: الكمبوندات والأسعار | شاري',
            'meta_description' => 'دليل شامل عن العاصمة الإدارية الجديدة: الموقع وطرق الوصول، الأحياء السكنية، أفضل الكمبوندات، الخدمات، ومتوسط سعر المتر وأنظمة السداد في 2026.',
            'focus_keyword' => 'العاصمة الإدارية الجديدة',
            'keywords' => [
                'كمبوندات العاصمة الإدارية',
                'أسعار المتر في العاصمة الإدارية',
                'شقق للبيع في العاصمة الإدارية',
                'الحي السكني السابع R7',
                'الاستثمار في العاصمة الإدارية',
                'مونوريل العاصمة الإدارية',
            ],
            'canonical' => url('/blog/new-capital-guide'),
            'body_html' => view('blog.samples.new-capital-guide')->render(),
            'faqs' => $faqs,
            'tags' => [
                ['name' => 'العاصمة الإدارية', 'url' => url('/blog/tag/new-capital')],
                ['name' => 'كمبوندات', 'url' => url('/blog/tag/compounds')],
                ['name' => 'دليل المناطق', 'url' => url('/blog/tag/area-guides')],
            ],
            'schema' => [
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'Article',
                        'headline' => 'العاصمة الإدارية الجديدة: دليل الكمبوندات والخدمات وأسعار المتر 2026',
                        'description' => 'دليل شامل عن العاصمة الإدارية الجديدة: الموقع وطرق الوصول، الأحياء السكنية، أفضل الكمبوندات، الخدمات، ومتوسط سعر المتر وأنظمة السداد في 2026.',
                        'inLanguage' => 'ar',
                        'author' => ['@type' => 'Organization', 'name' => 'شاري'],
                        'publisher' => ['@type' => 'Organization', 'name' => 'شاري'],
                        'dateModified' => '2026-08-04',
                    ],
                    [
                        '@type' => 'FAQPage',
                        'mainEntity' => array_map(fn (array $faq) => ['@type' => 'Question', 'name' => $faq['question'], 'acceptedAnswer' => ['@type' => 'Answer', 'text' => $faq['answer']]], $faqs),
                    ],
                ],
            ],
        ],
        'mostRead' => [
            [
                'title' => 'أفضل 10 جامعات خاصة في مصر 2026',
                'date' => '4 أغسطس 2026',
                'url' => url('/blog/private-universities-2026'),
                'image' => asset('images/shary/blog-samples/thumb-universities.jpg'),
            ],
            [
                'title' => 'أسعار المتر في التجمع الخامس: الربع الثالث 2026',
                'date' => '3 أغسطس 2026',
                'url' => url('/blog/fifth-settlement-prices-q3'),
                'image' => asset('images/shary/blog-samples/thumb-prices.jpg'),
            ],
            [
                'title' => 'دليل الحضانات في القاهرة الجديدة',
                'date' => '3 أغسطس 2026',
                'url' => url('/blog/new-cairo-nurseries'),
                'image' => asset('images/shary/blog-samples/thumb-nurseries.jpg'),
            ],
            [
                'title' => 'مشاريع جديدة في مصر 2026: الدليل الكامل',
                'date' => '29 يوليو 2026',
                'url' => url('/blog/new-projects-2026'),
                'image' => asset('images/shary/blog-samples/thumb-projects.jpg'),
            ],
        ],
        'latest' => [
            [
                'title' => 'سوق العقارات في مصر 2026: دليل قراءة السوق',
                'date' => '22 يوليو 2026',
                'url' => url('/blog/egypt-real-estate-2026'),
                'image' => asset('images/shary/blog-samples/thumb-market.jpg'),
            ],
            [
                'title' => 'أنواع التمويل العقاري وكيف تختار الأنسب',
                'date' => '15 يوليو 2026',
                'url' => url('/blog/mortgage-types'),
                'image' => asset('images/shary/blog-samples/thumb-finance.jpg'),
            ],
            [
                'title' => 'تسجيل العقار في الشهر العقاري: الأوراق والخطوات',
                'date' => '30 يوليو 2026',
                'url' => url('/blog/property-registration'),
                'image' => asset('images/shary/blog-samples/thumb-registry.jpg'),
            ],
            [
                'title' => 'مدينة العبور: دليلك للسكن والاستثمار',
                'date' => '17 يوليو 2026',
                'url' => url('/blog/obour-city-guide'),
                'image' => asset('images/shary/blog-samples/thumb-obour.jpg'),
            ],
        ],
    ],
];
