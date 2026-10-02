<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

/**
 * صفحات المدونة: قايمة المقالات + صفحة المقال.
 *
 * البيانات هنا تجريبية بنفس محتوى التصميم. استبدل الدوال sample*() بالداتا الحقيقية
 * مع الحفاظ على نفس أسماء المفاتيح، والـ Blade هيشتغل زي ما هو.
 */
class BlogController extends Controller
{
    /** صفحة المدونة (من بره) */
    public function index(): View
    {
        return view('blog.index', $this->sharedData() + $this->sampleListing());
    }

    /** صفحة المقال (من جوه) */
    public function show(string $slug): View
    {
        return view('blog.show', $this->sharedData() + $this->sampleArticle($slug));
    }

    /** شريط المؤشر + بيانات فورم الاستشارة (مشتركة بين الصفحتين) */
    private function sharedData(): array
    {
        return [
            'tickerItems' => [
                ['area' => 'الشيخ زايد', 'price' => '88,100', 'change' => '+4.2%'],
                ['area' => 'العاصمة الإدارية', 'price' => '74,600', 'change' => '+3.1%'],
                ['area' => 'الساحل الشمالي', 'price' => '115,300', 'change' => '+6.8%'],
                ['area' => 'التجمع الخامس', 'price' => '92,400', 'change' => '+2.4%'],
            ],
            'indexUrl' => url('/shary-index'),
            'contact' => [
                'phone' => '+201000730208',
                'whatsapp' => '201000730208',
            ],
            'consultationAction' => url('/consultations'),
            'meetingUrl' => url('/meetings/request'),
            'areas' => ['التجمع الخامس', 'الشيخ زايد', 'العاصمة الإدارية', 'الساحل الشمالي'],
            // أكواد الدول في حقل رقم الهاتف (أول دولة هي الافتراضية) — الأعلام في public/images/shary/flags
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
        ];
    }

    private function sampleListing(): array
    {
        $samples = 'images/shary/blog-samples/';

        return [
            'allArticlesUrl' => url('/blog/all'),
            'featured' => [
                'title' => 'العقارات في مصر 2026: دليل شاري لقراءة السوق',
                'category' => 'تقرير السوق',
                'author' => 'فريق شاري',
                'date' => '4 أغسطس 2026',
                'read_minutes' => 8,
                'url' => url('/blog/egypt-real-estate-2026'),
                'image' => asset($samples . 'featured-market.jpg'),
            ],
            'articles' => [
                [
                    'title' => 'أنواع التمويل العقاري في مصر وإزاي تختار الأنسب ليك',
                    'category' => 'التمويل والتقسيط',
                    'date' => '3 أغسطس 2026',
                    'read_minutes' => 6,
                    'url' => url('/blog/mortgage-types'),
                    'image' => asset($samples . 'card-finance.jpg'),
                ],
                [
                    'title' => 'أسعار المتر في القاهرة الجديدة — الربع الثالث',
                    'category' => 'تقارير السوق',
                    'date' => '2 أغسطس 2026',
                    'read_minutes' => 5,
                    'url' => url('/blog/new-cairo-prices-q3'),
                    'image' => asset($samples . 'card-prices.jpg'),
                ],
                [
                    'title' => 'الشيخ زايد ولا أكتوبر؟ مقارنة كاملة قبل الشراء',
                    'category' => 'دليل المناطق',
                    'date' => '31 يوليو 2026',
                    'read_minutes' => 7,
                    'url' => url('/blog/zayed-vs-october'),
                    'image' => asset($samples . 'card-areas.jpg'),
                ],
                [
                    'title' => 'قبل ما تمضي: 7 بنود لازم تراجعها في عقد الحجز',
                    'category' => 'قانوني وتعاقدات',
                    'date' => '29 يوليو 2026',
                    'read_minutes' => 4,
                    'url' => url('/blog/reservation-contract-checklist'),
                    'image' => asset($samples . 'card-legal.jpg'),
                ],
                [
                    'title' => 'مشاريع 2026 في العاصمة الإدارية وأنظمة سدادها',
                    'category' => 'مشاريع جديدة',
                    'date' => '26 يوليو 2026',
                    'read_minutes' => 6,
                    'url' => url('/blog/new-capital-projects-2026'),
                    'image' => asset($samples . 'card-projects.jpg'),
                ],
                [
                    'title' => 'إمتى يكون سعر إعادة البيع أحسن من سعر المطوّر؟',
                    'category' => 'إعادة البيع',
                    'date' => '22 يوليو 2026',
                    'read_minutes' => 5,
                    'url' => url('/blog/resale-vs-developer-price'),
                    'image' => asset($samples . 'card-resale.jpg'),
                ],
            ],
        ];
    }

    private function sampleArticle(string $slug): array
    {
        $samples = 'images/shary/blog-samples/';
        $mini = fn (string $title, string $date, string $slug, string $image) => [
            'title' => $title,
            'date' => $date,
            'url' => url('/blog/' . $slug),
            'image' => asset($samples . $image),
        ];

        return [
            'article' => [
                'slug' => $slug,
                'title' => 'العاصمة الإدارية الجديدة: دليل الكمبوندات والخدمات وأسعار المتر 2026',
                'author' => 'فريق شاري',
                'updated_at' => '4 أغسطس 2026',
                'image' => asset($samples . 'article-new-capital.jpg'),
                'image_caption' => 'العاصمة الإدارية الجديدة — الحي المالي',
                // محتوى المقال HTML: في المشروع بييجي من لوحة التحكم / قاعدة البيانات
                'body_html' => view('blog.samples.new-capital-guide')->render(),
                'tags' => [
                    ['name' => 'العاصمة الإدارية', 'url' => url('/blog/tag/new-capital')],
                ],
            ],
            'mostRead' => [
                $mini('أفضل 10 جامعات خاصة في مصر 2026', '4 أغسطس 2026', 'private-universities-2026', 'thumb-universities.jpg'),
                $mini('أسعار المتر في التجمع الخامس — الربع الثالث', '3 أغسطس 2026', 'fifth-settlement-prices-q3', 'thumb-prices.jpg'),
                $mini('دليل الحضانات في القاهرة الجديدة', '3 أغسطس 2026', 'new-cairo-nurseries', 'thumb-nurseries.jpg'),
                $mini('مشاريع جديدة في مصر 2026: الدليل الكامل', '29 يوليو 2026', 'new-projects-2026', 'thumb-projects.jpg'),
            ],
            'latest' => [
                $mini('العقارات في مصر 2026: دليل قراءة السوق', '22 يوليو 2026', 'egypt-real-estate-2026', 'thumb-market.jpg'),
                $mini('أنواع التمويل العقاري وإزاي تختار الأنسب', '15 يوليو 2026', 'mortgage-types', 'thumb-finance.jpg'),
                $mini('تسجيل العقار في الشهر العقاري: الأوراق والخطوات', '30 يوليو 2026', 'property-registration', 'thumb-registry.jpg'),
                $mini('مدينة العبور: دليلك للسكن والاستثمار', '17 يوليو 2026', 'obour-city-guide', 'thumb-obour.jpg'),
            ],
        ];
    }
}
