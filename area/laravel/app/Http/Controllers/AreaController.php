<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

/**
 * صفحة المنطقة (مثال: القاهرة الجديدة) بالعربي والإنجليزي.
 * نفس الصفحة للمنطقة الكبيرة (جواها مناطق: subAreas) وللمنطقة الفرعية (subAreas فاضية ومعاها parent).
 *
 * البيانات تجريبية ومحفوظة في resources/data/area-sample.{ar,en}.php، والبيانات المشتركة في site-sample.{ar,en}.php.
 * استبدل $this->data('area-sample') بالداتا الحقيقية مع الحفاظ على نفس أسماء المفاتيح، والـ Blade هيشتغل زي ما هو.
 * نصوص الواجهة من lang/{ar,en}/areas.php.
 */
class AreaController extends SharyPageController
{
    public function show(string $slug): View
    {
        $areas = $this->data('area-sample')['areas'];

        if (! isset($areas[$slug])) {
            abort(404);
        }

        $area = $areas[$slug];
        $shared = $this->shared();

        // مسار الصفحة: الرئيسية ‹ المناطق ‹ (المنطقة الأم لو دي منطقة فرعية) ‹ اسم المنطقة
        $breadcrumbs = [
            ['label' => __('blog.home'), 'url' => $this->localUrl('/')],
            ['label' => $area['parent_label'], 'url' => $this->localUrl('/areas')],
        ];
        if (! empty($area['parent'])) {
            $breadcrumbs[] = ['label' => $area['parent']['name'], 'url' => $area['parent']['url']];
        }
        $breadcrumbs[] = ['label' => $area['name']];

        return view('areas.show', [
            'area' => $area,
            'langUrl' => $this->otherLocaleUrl('/areas/' . $slug),
            'favoriteId' => 'areas/' . $slug,
            'canonical' => $this->localUrl('/areas/' . $slug),
            'pagination' => $area['pagination'],
            // اختيارات الفلاتر الحالية (من اللينك) عشان تفضل متعلّمة بعد ما الصفحة ترجع
            'selected' => (array) request()->query(),
            // الفورم: المنطقة المفتوحة أول اختيار في قايمة المناطق
            'areas' => $area['formAreas'],
            'faqSchema' => $this->faqSchema($area['faqs']),
            // الصفحة دي من غير شريط المؤشر، ومسار الصفحة بيظهر تحت الهيدر الأزرق
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
