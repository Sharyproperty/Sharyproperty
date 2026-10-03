<?php

/*
 | بيانات الموقع المشتركة بين كل الصفحات (الهيدر، الفوتر، الفورمات، شريط المؤشر) — English.
 | في المشروع: الداتا دي بتيجي من إعدادات الموقع / قاعدة البيانات بنفس أسماء المفاتيح.
 | 'key' على رابط الهيدر بيحدد الصفحة المفتوحة (الكنترولر بيلوّنه أزرق).
 */

return [
    'navLinks' => [
        ['label' => 'Home', 'url' => url('/en')],
        ['label' => 'Developers', 'url' => url('/en/developers'), 'key' => 'developers'],
        ['label' => 'Projects', 'url' => url('/en/projects')],
        ['label' => 'Sell', 'url' => url('/en/sell')],
        ['label' => 'Blogs', 'url' => url('/en/blog'), 'key' => 'blog'],
        ['label' => 'About Us', 'url' => url('/en/about')],
        ['label' => 'Contact Us', 'url' => url('/en/contact')],
        ['label' => 'Agents', 'url' => url('/en/agents'), 'children' => [
            ['label' => 'Verified Agents', 'url' => url('/en/verified-agents')],
        ]],
    ],
    'appUrl' => url('/en/app'),
    'indexUrl' => url('/en/shary-index'),
    'tickerItems' => [
        ['area' => 'Sheikh Zayed', 'price' => '88,100', 'change' => '+4.2%'],
        ['area' => 'New Capital', 'price' => '74,600', 'change' => '+3.1%'],
        ['area' => 'North Coast', 'price' => '115,300', 'change' => '+6.8%'],
        ['area' => 'Fifth Settlement', 'price' => '92,400', 'change' => '+2.4%'],
    ],
    // صفحة Shary AI: اختيارات البداية. aiUser = ['name', 'avatar'] للعميل المسجل (null = ضيف). aiEndpoint = لينك استقبال الرسائل
    'aiSuggestions' => ['Mostakbal City', 'New Administrative Capital', 'Fifth Settlement', 'North Coast', 'Other'],
    'aiUser' => null,
    'aiEndpoint' => '',
    'contact' => ['phone' => '+201000730208', 'phone_display' => '+201000730208', 'whatsapp' => '201000730208', 'email' => 'info@shary.eg'],
    'consultationAction' => url('/en/consultations'),
    'meetingUrl' => url('/en/meetings/request'),
    // أوقات الاجتماع المتاحة في فورم «طلب اجتماع»
    'meetingTimes' => [
        ['value' => '10:00', 'label' => '10:00 AM'],
        ['value' => '11:00', 'label' => '11:00 AM'],
        ['value' => '12:00', 'label' => '12:00 PM'],
        ['value' => '13:00', 'label' => '01:00 PM'],
        ['value' => '14:00', 'label' => '02:00 PM'],
        ['value' => '15:00', 'label' => '03:00 PM'],
        ['value' => '16:00', 'label' => '04:00 PM'],
        ['value' => '17:00', 'label' => '05:00 PM'],
    ],
    'areas' => ['Fifth Settlement', 'Sheikh Zayed', 'New Capital', 'North Coast'],
    'phoneCountries' => [
        ['name' => 'Egypt', 'iso' => 'eg', 'code' => '+20'],
        ['name' => 'Saudi Arabia', 'iso' => 'sa', 'code' => '+966'],
        ['name' => 'UAE', 'iso' => 'ae', 'code' => '+971'],
        ['name' => 'Kuwait', 'iso' => 'kw', 'code' => '+965'],
        ['name' => 'Qatar', 'iso' => 'qa', 'code' => '+974'],
        ['name' => 'Bahrain', 'iso' => 'bh', 'code' => '+973'],
        ['name' => 'Oman', 'iso' => 'om', 'code' => '+968'],
        ['name' => 'Jordan', 'iso' => 'jo', 'code' => '+962'],
        ['name' => 'Lebanon', 'iso' => 'lb', 'code' => '+961'],
        ['name' => 'Iraq', 'iso' => 'iq', 'code' => '+964'],
        ['name' => 'Libya', 'iso' => 'ly', 'code' => '+218'],
        ['name' => 'Sudan', 'iso' => 'sd', 'code' => '+249'],
        ['name' => 'Morocco', 'iso' => 'ma', 'code' => '+212'],
        ['name' => 'Algeria', 'iso' => 'dz', 'code' => '+213'],
        ['name' => 'Tunisia', 'iso' => 'tn', 'code' => '+216'],
        ['name' => 'Palestine', 'iso' => 'ps', 'code' => '+970'],
        ['name' => 'Yemen', 'iso' => 'ye', 'code' => '+967'],
        ['name' => 'Syria', 'iso' => 'sy', 'code' => '+963'],
        ['name' => 'Turkey', 'iso' => 'tr', 'code' => '+90'],
        ['name' => 'United Kingdom', 'iso' => 'gb', 'code' => '+44'],
        ['name' => 'United States', 'iso' => 'us', 'code' => '+1'],
        ['name' => 'Canada', 'iso' => 'ca', 'code' => '+1'],
        ['name' => 'Germany', 'iso' => 'de', 'code' => '+49'],
        ['name' => 'France', 'iso' => 'fr', 'code' => '+33'],
        ['name' => 'Italy', 'iso' => 'it', 'code' => '+39'],
        ['name' => 'Netherlands', 'iso' => 'nl', 'code' => '+31'],
        ['name' => 'Australia', 'iso' => 'au', 'code' => '+61'],
        ['name' => 'Switzerland', 'iso' => 'ch', 'code' => '+41'],
        ['name' => 'Sweden', 'iso' => 'se', 'code' => '+46'],
    ],
    'footerGroups' => [
        [
            'title' => 'Areas',
            'links' => [
                ['label' => '6 October City', 'url' => url('/en/areas/1')],
                ['label' => 'Ain Sokhna', 'url' => url('/en/areas/ain-sokhna')],
                ['label' => 'Al Rehab', 'url' => url('/en/areas/al-rehab')],
                ['label' => 'Alexandria', 'url' => url('/en/areas/4')],
                ['label' => 'Badr City', 'url' => url('/en/areas/5')],
                ['label' => 'Cairo', 'url' => url('/en/areas/6')],
                ['label' => 'El Gouna', 'url' => url('/en/areas/7')],
                ['label' => 'El Sheikh Zayed City', 'url' => url('/en/areas/sheikh-zayed')],
                ['label' => 'El Shorouk City', 'url' => url('/en/areas/el-shorouk')],
            ],
        ],
        [
            'title' => 'Compounds',
            'links' => [
                ['label' => 'The Spine TMG New Cairo', 'url' => url('/en/compounds/1')],
                ['label' => 'Creekview New Cairo', 'url' => url('/en/compounds/2')],
            ],
        ],
        [
            'title' => 'Developers',
            'links' => [
                ['label' => 'TMG Developments', 'url' => url('/en/developers/tmg')],
                ['label' => 'Mountain View Developments', 'url' => url('/en/developers/mountain-view')],
                ['label' => 'Lavista Developments', 'url' => url('/en/developers/lavista')],
            ],
        ],
        [
            'title' => 'For Sale',
            'links' => [
                ['label' => 'Apartments for sale in Fifth Settlement', 'url' => url('/en/search/apartments-for-sale-in-fifth-settlement')],
                ['label' => 'Chalets for sale in North Coast', 'url' => url('/en/search/chalets-for-sale-in-north-coast')],
                ['label' => 'Villas for sale in Mostakbal City', 'url' => url('/en/search/villas-for-sale-in-mostakbal-city')],
            ],
        ],
        [
            'title' => 'For Rent',
            'links' => [
                ['label' => 'Apartments for rent in Fifth Settlement', 'url' => url('/en/search/apartments-for-rent-in-fifth-settlement')],
            ],
        ],
    ],
    'footerLinks' => [
        ['label' => 'Home', 'url' => url('/en')],
        ['label' => 'Developers', 'url' => url('/en/developers')],
        ['label' => 'Projects', 'url' => url('/en/projects')],
        ['label' => 'Sell', 'url' => url('/en/sell')],
        ['label' => 'Blogs', 'url' => url('/en/blog')],
        ['label' => 'About Us', 'url' => url('/en/about')],
        ['label' => 'Contact Us', 'url' => url('/en/contact')],
        ['label' => 'Terms & Conditions', 'url' => url('/en/terms')],
        ['label' => 'Privacy Policy', 'url' => url('/en/privacy')],
        ['label' => 'Agents', 'url' => url('/en/agents')],
    ],
    'socialLinks' => [
        ['label' => 'Facebook', 'url' => '#', 'icon' => 'fa-facebook-f'],
        ['label' => 'Instagram', 'url' => '#', 'icon' => 'fa-instagram'],
        ['label' => 'X', 'url' => '#', 'icon' => 'fa-x-twitter'],
        ['label' => 'YouTube', 'url' => '#', 'icon' => 'fa-youtube'],
        ['label' => 'LinkedIn', 'url' => '#', 'icon' => 'fa-linkedin-in'],
        ['label' => 'Snapchat', 'url' => '#', 'icon' => 'fa-snapchat'],
        ['label' => 'TikTok', 'url' => '#', 'icon' => 'fa-tiktok'],
    ],
    'appLinks' => ['google_play' => '#', 'app_store' => '#'],
];
