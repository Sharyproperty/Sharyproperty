<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

/**
 * صفحات المدونة: قايمة المقالات + صفحة المقال، بالعربي والإنجليزي.
 *
 * البيانات تجريبية ومحفوظة في resources/data/blog-sample.{ar,en}.php (8 مقالات كاملة)، والبيانات المشتركة في site-sample.{ar,en}.php.
 * استبدل $this->data('blog-sample') بالداتا الحقيقية مع الحفاظ على نفس أسماء المفاتيح، والـ Blade هيشتغل زي ما هو.
 * اللغة من app()->getLocale() ، ونصوص الواجهة من lang/{ar,en}/blog.php.
 */
class BlogController extends SharyPageController
{
    /** صفحة المدونة (من بره) */
    public function index(): View
    {
        $data = $this->data('blog-sample');
        $articles = $data['articles'];

        // مسار الصفحة: الرئيسية ‹ المدونة
        $breadcrumbs = [
            ['label' => __('blog.home'), 'url' => $this->localUrl('/')],
            ['label' => __('blog.blog')],
        ];

        return view('blog.index', $this->shared('blog') + [
            'langUrl' => $this->otherLocaleUrl('/blog'),
            'favoriteId' => 'blog',
            'pagination' => $data['pagination'],
            'featured' => $this->card($articles[$data['featured']]),
            'articles' => array_map(fn (string $slug) => $this->card($articles[$slug]), $data['listing']),
        ] + $this->breadcrumbData($breadcrumbs));
    }

    /** صفحة المقال (من جوه) — كل مقال بيفتح بالـ slug بتاعه */
    public function show(string $slug): View
    {
        $data = $this->data('blog-sample');
        $articles = $data['articles'];

        if (! isset($articles[$slug])) {
            abort(404);
        }

        $article = $articles[$slug];
        $article['updated_at'] = $article['date'];
        $article['canonical'] = $this->localUrl('/blog/' . $slug);
        // في الموقع: محتوى المقال HTML جاي من لوحة التحكم. هنا من ملف تجريبي في resources/views/blog/samples
        $article['body_html'] = view($article['body_view'])->render();
        $article['tags'] = array_map(fn (array $tag) => ['name' => $tag['name'], 'url' => $this->localUrl('/blog/tag/' . $tag['slug'])], $article['tags']);
        $article['schema'] = $this->articleSchema($article);

        // القوايم الجانبية: من غير المقال المفتوح
        $others = array_filter($articles, fn (array $item) => $item['slug'] !== $slug);
        $mostRead = array_values(array_filter(array_map(fn (string $key) => $others[$key] ?? null, $data['mostRead'])));
        $latest = array_values($others);
        usort($latest, fn (array $a, array $b) => strcmp($b['date_iso'], $a['date_iso']));

        // مسار الصفحة: الرئيسية ‹ المدونة ‹ عنوان المقال
        $breadcrumbs = [
            ['label' => __('blog.home'), 'url' => $this->localUrl('/')],
            ['label' => __('blog.blog'), 'url' => $this->localUrl('/blog')],
            ['label' => $article['title']],
        ];

        return view('blog.show', $this->shared('blog') + [
            'langUrl' => $this->otherLocaleUrl('/blog/' . $slug),
            'favoriteId' => 'blog/' . $slug,
            'article' => $article,
            'mostRead' => array_map(fn (array $item) => $this->mini($item), array_slice($mostRead, 0, 4)),
            'latest' => array_map(fn (array $item) => $this->mini($item), array_slice($latest, 0, 4)),
        ] + $this->breadcrumbData($breadcrumbs));
    }

    /** بيانات كارت المقال في صفحة المدونة (والمقال الرئيسي) */
    private function card(array $article): array
    {
        return [
            'title' => $article['title'],
            'category' => $article['category'],
            'author' => $article['author'],
            'date' => $article['date'],
            'read_minutes' => $article['read_minutes'],
            'url' => $this->localUrl('/blog/' . $article['slug']),
            'image' => $article['featured_image'] ?? $article['card_image'],
        ];
    }

    /** بيانات المقال الصغير في القوايم الجانبية */
    private function mini(array $article): array
    {
        return [
            'title' => $article['short_title'] ?? $article['title'],
            'date' => $article['date'],
            'url' => $this->localUrl('/blog/' . $article['slug']),
            'image' => $article['card_image'],
        ];
    }

    /** بيانات المقال والأسئلة الشائعة لمحركات البحث (JSON-LD) */
    private function articleSchema(array $article): array
    {
        $graph = [[
            '@type' => 'Article',
            'headline' => $article['title'],
            'description' => $article['meta_description'],
            'inLanguage' => app()->getLocale(),
            'author' => ['@type' => 'Organization', 'name' => __('blog.brand')],
            'publisher' => ['@type' => 'Organization', 'name' => __('blog.brand')],
            'dateModified' => $article['date_iso'],
        ]];

        if (! empty($article['faqs'])) {
            $graph[] = [
                '@type' => 'FAQPage',
                'mainEntity' => array_map(fn (array $faq) => [
                    '@type' => 'Question',
                    'name' => $faq['question'],
                    'acceptedAnswer' => ['@type' => 'Answer', 'text' => $faq['answer']],
                ], $article['faqs']),
            ];
        }

        return ['@context' => 'https://schema.org', '@graph' => $graph];
    }
}
