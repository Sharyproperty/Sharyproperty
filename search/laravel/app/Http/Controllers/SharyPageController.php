<?php

namespace App\Http\Controllers;

/**
 * أساس مشترك لصفحات شاري (المدونة، المناطق): بيانات الهيدر والفوتر والفورمات، لينكات اللغتين، ومسار الصفحة.
 * البيانات التجريبية في resources/data — استبدلوها بالداتا الحقيقية بنفس أسماء المفاتيح.
 */
abstract class SharyPageController extends Controller
{
    /** بيانات الموقع المشتركة (الهيدر، الفوتر، الفورمات، شريط المؤشر) + تحديد رابط الهيدر المفتوح */
    protected function shared(?string $activeKey = null): array
    {
        $shared = $this->data('site-sample');

        $shared['navLinks'] = array_map(function (array $link) use ($activeKey) {
            $link['active'] = $activeKey !== null && ($link['key'] ?? null) === $activeKey;

            return $link;
        }, $shared['navLinks']);

        return $shared;
    }

    /** ملف بيانات تجريبية حسب اللغة: resources/data/{name}.{ar|en}.php */
    protected function data(string $name): array
    {
        $file = resource_path('data/' . $name . '.' . app()->getLocale() . '.php');

        return require (is_file($file) ? $file : resource_path('data/' . $name . '.ar.php'));
    }

    /** بيرجّع المسار + بيانات BreadcrumbList لمحركات البحث */
    protected function breadcrumbData(array $breadcrumbs): array
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

    /** لينك حسب اللغة الحالية: العربي من غير بادئة، والإنجليزي تحت /en */
    protected function localUrl(string $path): string
    {
        $prefix = app()->getLocale() === 'en' ? '/en' : '';

        return url(rtrim($prefix . $path, '/') ?: '/');
    }

    /** لينك نفس الصفحة باللغة التانية (زرار اللغة) */
    protected function otherLocaleUrl(string $path): string
    {
        $prefix = app()->getLocale() === 'en' ? '' : '/en';

        return url($prefix . $path);
    }
}
