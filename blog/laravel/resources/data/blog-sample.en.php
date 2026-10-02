<?php

/*
 | Sample data for the blog pages — English.
 | In the project this data comes from the database / dashboard with the same keys.
 */

$faqs = [
    [
        'question' => 'How far is the New Administrative Capital from Cairo?',
        'answer' => 'It is about 45 km from central Cairo, and minutes from New Cairo via the Mohamed Bin Zayed axis.',
    ],
    [
        'question' => 'Which residential district is best in the New Capital?',
        'answer' => 'R7 and R8 are the most in demand among developers’ projects, while R3 suits buyers who want ready units in an inhabited area.',
    ],
    [
        'question' => 'Can you reach the New Capital by public transport?',
        'answer' => 'Yes: by the Light Rail Transit from Adly Mansour station, the East Nile monorail from Nasr City, and bus lines.',
    ],
    [
        'question' => 'Is the New Capital a good real estate investment?',
        'answer' => 'It suits long-term investors who choose a reliable developer and a location close to services and main roads, after checking build progress and average prices.',
    ],
    [
        'question' => 'How do I find the current average price per meter in the New Capital?',
        'answer' => 'From the Shary Index, which shows the updated average price per meter for each area and unit type, and the rate of change.',
    ],
];

return [
    'shared' => [
        'navLinks' => [
            ['label' => 'Home', 'url' => url('/en')],
            ['label' => 'Developers', 'url' => url('/en/developers')],
            ['label' => 'Projects', 'url' => url('/en/projects')],
            ['label' => 'Sell', 'url' => url('/en/sell')],
            ['label' => 'Blogs', 'url' => url('/en/blog'), 'active' => true],
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
        'contact' => ['phone' => '+201000730208', 'phone_display' => '+201000730208', 'whatsapp' => '201000730208', 'email' => 'info@shary.eg'],
        'consultationAction' => url('/en/consultations'),
        'meetingUrl' => url('/en/meetings/request'),
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
                    ['label' => 'Ain Sokhna', 'url' => url('/en/areas/2')],
                    ['label' => 'Al Rehab', 'url' => url('/en/areas/3')],
                    ['label' => 'Alexandria', 'url' => url('/en/areas/4')],
                    ['label' => 'Badr City', 'url' => url('/en/areas/5')],
                    ['label' => 'Cairo', 'url' => url('/en/areas/6')],
                    ['label' => 'El Gouna', 'url' => url('/en/areas/7')],
                    ['label' => 'El Sheikh Zayed City', 'url' => url('/en/areas/8')],
                    ['label' => 'El Shorouk City', 'url' => url('/en/areas/9')],
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
                    ['label' => 'TMG Developments', 'url' => url('/en/developers/1')],
                    ['label' => 'Mountain View Developments', 'url' => url('/en/developers/2')],
                    ['label' => 'Lavista Developments', 'url' => url('/en/developers/3')],
                ],
            ],
            [
                'title' => 'For Sale',
                'links' => [
                    ['label' => 'Apartments for sale in New Alamein', 'url' => url('/en/for-sale/1')],
                    ['label' => 'Apartments for sale in Fifth Settlement', 'url' => url('/en/for-sale/2')],
                ],
            ],
            [
                'title' => 'For Rent',
                'links' => [
                    ['label' => 'Apartments for rent in Fifth Settlement', 'url' => url('/en/for-rent/1')],
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
    ],

    'listing' => [
        'langUrl' => url('/blog'),
        // أرقام الصفحات (ديسك توب). في الموقع بتتبني من الـ paginator
        'pagination' => [
            'prev' => null,
            'next' => url('/en/blog?page=2'),
            'pages' => [
                ['label' => 1, 'url' => url('/en/blog'), 'active' => true],
                ['label' => 2, 'url' => url('/en/blog?page=2')],
                ['label' => 3, 'url' => url('/en/blog?page=3')],
                ['gap' => true],
                ['label' => 8, 'url' => url('/en/blog?page=8')],
            ],
        ],
        'featured' => [
            'title' => 'Egypt real estate market 2026: the Shary guide to reading the market before you buy',
            'category' => 'Market reports',
            'author' => 'Shary Team',
            'date' => '4 August 2026',
            'read_minutes' => 8,
            'url' => url('/en/blog/egypt-real-estate-2026'),
            'image' => asset('images/shary/blog-samples/featured-market.jpg'),
        ],
        'articles' => [
            [
                'title' => 'Types of mortgage finance in Egypt and how to choose the right one',
                'category' => 'Finance and installments',
                'date' => '3 August 2026',
                'read_minutes' => 6,
                'url' => url('/en/blog/mortgage-types'),
                'image' => asset('images/shary/blog-samples/card-finance.jpg'),
            ],
            [
                'title' => 'Price per meter in New Cairo: Q3 2026 report',
                'category' => 'Market reports',
                'date' => '2 August 2026',
                'read_minutes' => 5,
                'url' => url('/en/blog/new-cairo-prices-q3'),
                'image' => asset('images/shary/blog-samples/card-prices.jpg'),
            ],
            [
                'title' => 'Sheikh Zayed or 6 October? A full comparison before you buy',
                'category' => 'Area guides',
                'date' => '31 July 2026',
                'read_minutes' => 7,
                'url' => url('/en/blog/zayed-vs-october'),
                'image' => asset('images/shary/blog-samples/card-areas.jpg'),
            ],
            [
                'title' => '7 clauses to review in a unit reservation contract before signing',
                'category' => 'Legal and contracts',
                'date' => '29 July 2026',
                'read_minutes' => 4,
                'url' => url('/en/blog/reservation-contract-checklist'),
                'image' => asset('images/shary/blog-samples/card-legal.jpg'),
            ],
            [
                'title' => 'New Administrative Capital projects in 2026 and their payment plans',
                'category' => 'New projects',
                'date' => '26 July 2026',
                'read_minutes' => 6,
                'url' => url('/en/blog/new-capital-projects-2026'),
                'image' => asset('images/shary/blog-samples/card-projects.jpg'),
            ],
            [
                'title' => 'Resale or buying from the developer: when is resale the better deal?',
                'category' => 'Resale',
                'date' => '22 July 2026',
                'read_minutes' => 5,
                'url' => url('/en/blog/resale-vs-developer-price'),
                'image' => asset('images/shary/blog-samples/card-resale.jpg'),
            ],
        ],
    ],

    'article' => [
        'langUrl' => url('/blog/new-capital-guide'),
        'article' => [
            'title' => 'New Administrative Capital: a guide to compounds, services and price per meter in 2026',
            'author' => 'Shary Team',
            'updated_at' => '4 August 2026',
            'image' => asset('images/shary/blog-samples/article-new-capital.jpg'),
            'image_alt' => 'New Administrative Capital — Central Business District',
            'image_caption' => 'New Administrative Capital — Central Business District',
            'meta_title' => 'New Administrative Capital 2026: Compounds and Prices | Shary',
            'meta_description' => 'A complete guide to Egypt’s New Administrative Capital: location and access, residential districts, best compounds, services, average price per meter and payment plans in 2026.',
            'focus_keyword' => 'the New Administrative Capital',
            'keywords' => [
                'New Capital compounds',
                'price per meter in the New Capital',
                'apartments for sale in the New Capital',
                'R7 New Capital',
                'investing in the New Capital',
                'New Capital monorail',
            ],
            'canonical' => url('/en/blog/new-capital-guide'),
            'body_html' => view('blog.samples.new-capital-guide-en')->render(),
            'faqs' => $faqs,
            'tags' => [
                ['name' => 'New Capital', 'url' => url('/en/blog/tag/new-capital')],
                ['name' => 'Compounds', 'url' => url('/en/blog/tag/compounds')],
                ['name' => 'Area guides', 'url' => url('/en/blog/tag/area-guides')],
            ],
            'schema' => [
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'Article',
                        'headline' => 'New Administrative Capital: a guide to compounds, services and price per meter in 2026',
                        'description' => 'A complete guide to Egypt’s New Administrative Capital: location and access, residential districts, best compounds, services, average price per meter and payment plans in 2026.',
                        'inLanguage' => 'en',
                        'author' => ['@type' => 'Organization', 'name' => 'Shary'],
                        'publisher' => ['@type' => 'Organization', 'name' => 'Shary'],
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
                'title' => 'Top 10 private universities in Egypt in 2026',
                'date' => '4 August 2026',
                'url' => url('/en/blog/private-universities-2026'),
                'image' => asset('images/shary/blog-samples/thumb-universities.jpg'),
            ],
            [
                'title' => 'Price per meter in Fifth Settlement: Q3 2026',
                'date' => '3 August 2026',
                'url' => url('/en/blog/fifth-settlement-prices-q3'),
                'image' => asset('images/shary/blog-samples/thumb-prices.jpg'),
            ],
            [
                'title' => 'Guide to nurseries in New Cairo',
                'date' => '3 August 2026',
                'url' => url('/en/blog/new-cairo-nurseries'),
                'image' => asset('images/shary/blog-samples/thumb-nurseries.jpg'),
            ],
            [
                'title' => 'New projects in Egypt in 2026: the complete guide',
                'date' => '29 July 2026',
                'url' => url('/en/blog/new-projects-2026'),
                'image' => asset('images/shary/blog-samples/thumb-projects.jpg'),
            ],
        ],
        'latest' => [
            [
                'title' => 'Egypt real estate market 2026: how to read the market',
                'date' => '22 July 2026',
                'url' => url('/en/blog/egypt-real-estate-2026'),
                'image' => asset('images/shary/blog-samples/thumb-market.jpg'),
            ],
            [
                'title' => 'Types of mortgage finance and how to choose',
                'date' => '15 July 2026',
                'url' => url('/en/blog/mortgage-types'),
                'image' => asset('images/shary/blog-samples/thumb-finance.jpg'),
            ],
            [
                'title' => 'Registering property at the Real Estate Registry: papers and steps',
                'date' => '30 July 2026',
                'url' => url('/en/blog/property-registration'),
                'image' => asset('images/shary/blog-samples/thumb-registry.jpg'),
            ],
            [
                'title' => 'Obour City: your guide to living and investing',
                'date' => '17 July 2026',
                'url' => url('/en/blog/obour-city-guide'),
                'image' => asset('images/shary/blog-samples/thumb-obour.jpg'),
            ],
        ],
    ],
];
