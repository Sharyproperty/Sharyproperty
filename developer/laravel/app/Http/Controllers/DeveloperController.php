<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

/**
 * صفحة المطور (مثال: ماونتن فيو) بالعربي والإنجليزي.
 *
 * البيانات تجريبية ومحفوظة في resources/data/developer-sample.{ar,en}.php، والبيانات المشتركة في site-sample.{ar,en}.php.
 * استبدل $this->data('developer-sample') بالداتا الحقيقية مع الحفاظ على نفس أسماء المفاتيح، والـ Blade هيشتغل زي ما هو.
 * نصوص الواجهة من lang/{ar,en}/developers.php (والفلاتر من lang/{ar,en}/areas.php).
 */
class DeveloperController extends SharyPageController
{
    public function show(string $slug): View
    {
        $developers = $this->data('developer-sample')['developers'];

        if (! isset($developers[$slug])) {
            abort(404);
        }

        $developer = $developers[$slug];
        $shared = $this->shared('developers');

        // مسار الصفحة: الرئيسية ‹ مطورين ‹ اسم المطور
        $breadcrumbs = [
            ['label' => __('blog.home'), 'url' => $this->localUrl('/')],
            ['label' => $developer['crumb_label'], 'url' => $this->localUrl('/developers')],
            ['label' => $developer['short_name']],
        ];

        return view('developers.show', [
            'developer' => $developer,
            'langUrl' => $this->otherLocaleUrl('/developers/' . $slug),
            'favoriteId' => 'developers/' . $slug,
            'canonical' => $this->localUrl('/developers/' . $slug),
            'pagination' => $developer['pagination'],
            // اختيارات الفلاتر الحالية (من اللينك) عشان تفضل متعلّمة بعد ما الصفحة ترجع
            'selected' => (array) request()->query(),
            // الفورم: مناطق المطور في قايمة المناطق
            'areas' => $developer['formAreas'],
            'faqSchema' => $this->faqSchema($developer['faqs']),
            // الصفحة دي من غير شريط المؤشر اللي فوق، ومسار الصفحة بيتحط جوه الصفحة
            'showTicker' => false,
            'breadcrumbInPage' => true,
        ] + $shared + $this->breadcrumbData($breadcrumbs));
    }

    /** الأسئلة الشائعة لمحركات البحث (JSON-LD) */
    private function faqSchema(array $faqs): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => array_map(fn (array $faq) => [
                '@type' => 'Question',
                'name' => $faq['question'],
                'acceptedAnswer' => ['@type' => 'Answer', 'text' => $faq['answer']],
            ], $faqs),
        ];
    }
}
