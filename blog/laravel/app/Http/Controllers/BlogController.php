<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

/**
 * صفحات المدونة: قايمة المقالات + صفحة المقال، بالعربي والإنجليزي.
 *
 * البيانات تجريبية بنفس محتوى التصميم ومحفوظة في resources/data/blog-sample.{ar,en}.php.
 * استبدل sample() بالداتا الحقيقية مع الحفاظ على نفس أسماء المفاتيح، والـ Blade هيشتغل زي ما هو.
 * اللغة من app()->getLocale() ، ونصوص الواجهة من lang/{ar,en}/blog.php.
 */
class BlogController extends Controller
{
    /** صفحة المدونة (من بره) */
    public function index(): View
    {
        $data = $this->sample();

        // مسار الصفحة: الرئيسية ‹ المدونة
        $breadcrumbs = [
            ['label' => __('blog.home'), 'url' => $this->localUrl('/')],
            ['label' => __('blog.blog')],
        ];

        return view('blog.index', $data['shared'] + $data['listing'] + $this->breadcrumbData($breadcrumbs));
    }

    /** صفحة المقال (من جوه) */
    public function show(string $slug): View
    {
        $data = $this->sample();

        // مسار الصفحة: الرئيسية ‹ المدونة ‹ عنوان المقال
        $breadcrumbs = [
            ['label' => __('blog.home'), 'url' => $this->localUrl('/')],
            ['label' => __('blog.blog'), 'url' => $this->localUrl('/blog')],
            ['label' => $data['article']['article']['title']],
        ];

        return view('blog.show', $data['shared'] + $data['article'] + $this->breadcrumbData($breadcrumbs));
    }

    /** بيرجّع المسار + بيانات BreadcrumbList لمحركات البحث */
    private function breadcrumbData(array $breadcrumbs): array
    {
        $items = [];
        foreach ($breadcrumbs as $index => $crumb) {
            $item = ['@type' => 'ListItem', 'position' => $index + 1, 'name' => $crumb['label']];
            if (! empty($crumb['url'])) {
                $item['item'] = $crumb['url'];
            }
            $items[] = $item;
        }

        return [
            'breadcrumbs' => $breadcrumbs,
            'breadcrumbSchema' => ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => $items],
        ];
    }

    /** لينك حسب اللغة: العربي من غير بادئة، والإنجليزي تحت /en */
    private function localUrl(string $path): string
    {
        $prefix = app()->getLocale() === 'en' ? '/en' : '';

        return url(rtrim($prefix . $path, '/') ?: '/');
    }

    private function sample(): array
    {
        $file = resource_path('data/blog-sample.' . app()->getLocale() . '.php');

        return require (is_file($file) ? $file : resource_path('data/blog-sample.ar.php'));
    }
}
