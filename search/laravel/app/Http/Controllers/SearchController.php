<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

/**
 * صفحة نتايج البحث — وحدات أو كمبوندات (?view=compounds).
 *
 * نسختين بنفس الصفحة:
 *   - /search                              البحث العام من الهيدر: "عقارات مصر" / "كمبوندات مصر" من غير منطقة.
 *   - /search/{types}-for-sale-in-{area}   من لينكات "وحدات للبيع" (مثال: /search/chalets-for-sale-in-north-coast)،
 *     /search/{types}-for-rent-in-{area}   ومن لينكات "للإيجار": العنوان بالنوع والمنطقة + لينكات المناطق الفرعية، والفلتر متعلّم على النوع والمنطقة.
 *
 * البيانات تجريبية في resources/data/search-sample.{ar,en}.php: الصفحة بتفلتر الوحدات / الكمبوندات التجريبية بنفس حقول الفلاتر
 * (وخانة البحث q) وبتقسّمها صفحات. استبدل results() باستعلام الداتا بيز مع الحفاظ على نفس أسماء المفاتيح اللي بتتبعت للـ view.
 *
 * التحميل وأنت نازل: الصفحة بتطلب $nextUrl (نفس اللينك + page=2 ...) وبتاخد منه الكروت اللي جوه [data-results]
 * ولينك الصفحة اللي بعدها من [data-infinite] — يعني نفس الـ view بيترجع لكل صفحة، ومش محتاج endpoint مخصوص.
 */
class SearchController extends SharyPageController
{
    /** البحث العام من الهيدر (/search): من غير منطقة ولا فلاتر — "عقارات مصر" ، ومع ?view=compounds "كمبوندات مصر" */
    public function index(): View
    {
        return $this->show('all');
    }

    public function show(string $slug): View
    {
        $data = $this->data('search-sample');
        $page = $this->page($slug, $data);

        if ($page === null) {
            abort(404);
        }

        $shared = $this->shared();
        $mode = request()->query('view') === 'compounds' ? 'compounds' : 'units';
        $general = $slug === 'all';
        $path = $general ? '/search' : '/search/' . $slug;

        // اختيارات الفلاتر من اللينك. لو اللينك من غير اختيارات: فلاتر الصفحة نفسها (مثلاً شاليه + الساحل الشمالي) بتبقى متعلّمة
        $selected = (array) request()->query();
        unset($selected['view'], $selected['page']);
        if ($this->blank($selected)) {
            $selected = $page['defaults'] + array_intersect_key($selected, ['sort' => true]);
        }

        // النتايج: فلترة + ترتيب + صفحة من النتايج
        $all = $this->results($mode === 'compounds' ? $data['compounds'] : $data['units'], $selected, $mode);
        $number = max(1, (int) request()->query('page', 1));
        $results = array_slice($all, ($number - 1) * $data['perPage'], $data['perPage']);
        $more = count($all) > $number * $data['perPage'];
        $query = array_filter((array) request()->query(), fn ($value) => $value !== null && $value !== '');

        // العنوان: البحث العام له عنوان لكل وضع (عقارات مصر / كمبوندات مصر)، وصفحات المناطق عنوانها واحد في الوضعين
        $h1 = $mode === 'compounds' && ! empty($page['h1_compounds']) ? $page['h1_compounds'] : $page['h1'];

        // مسار الصفحة: الرئيسية ‹ عقارات مصر ‹ (بحث المنطقة الأم لو دي منطقة فرعية) ‹ اسم البحث
        $breadcrumbs = [['label' => __('blog.home'), 'url' => $this->localUrl('/')]];
        if ($general) {
            $breadcrumbs[] = ['label' => $h1];
        } else {
            $breadcrumbs[] = ['label' => $data['text']['crumb'], 'url' => $this->localUrl('/search')];
            if (! empty($page['parent'])) {
                $breadcrumbs[] = $page['parent'];
            }
            $breadcrumbs[] = ['label' => $h1];
        }

        $search = $page + [
            'filters' => $data['filters'],
            'unitsUrl' => $this->localUrl($path),
            'compoundsUrl' => $this->localUrl($path . '?view=compounds'),
            'mapUrl' => $this->localUrl($path . '/map'),
            'promo' => $data['promo'],
        ];

        return view('search.show', [
            'search' => $search,
            'h1' => $h1,
            'mode' => $mode,
            'results' => $results,
            'count' => count($all),
            'nextUrl' => $more ? $this->localUrl($path . '?' . http_build_query(['page' => $number + 1] + $query)) : '',
            // الفلاتر بنفس شكل فلاتر صفحة المنطقة ($area['filters']) عشان نفس الملفات الفرعية تشتغل
            'area' => ['filters' => $data['filters']],
            'selected' => $selected,
            'langUrl' => $this->otherLocaleUrl($path),
            'favoriteId' => 'search/' . $slug,
            'canonical' => $this->localUrl($path),
            // الصفحة دي من غير شريط المؤشر اللي فوق، ومسار الصفحة بيتحط جوه الصفحة
            'showTicker' => false,
            'breadcrumbInPage' => true,
        ] + $shared + $this->breadcrumbData($breadcrumbs));
    }

    /**
     * بيانات الصفحة من اللينك: العنوان، الفلاتر اللي الصفحة مفتوحة عليها، لينكات المناطق الفرعية، وعمليات البحث المشابهة.
     * all = البحث العام. غير كده اللينك شكله {types}-for-sale-in-{area} أو {types}-for-rent-in-{area}.
     */
    private function page(string $slug, array $data): ?array
    {
        if ($slug === 'all') {
            return $data['general'] + ['slug' => 'all', 'name' => $data['general']['h1'], 'parent' => null, 'defaults' => [], 'subAreas' => [],
                'searches' => $this->similar($data, null, null, 'sale')];
        }
        if (! preg_match('/^([a-z-]+)-for-(sale|rent)-in-([a-z0-9-]+)$/', $slug, $m) || ! isset($data['types'][$m[1]], $data['areas'][$m[3]])) {
            return null;
        }

        [, $typeSlug, $offer, $areaSlug] = $m;
        $type = $data['types'][$typeSlug];
        $area = $data['areas'][$areaSlug];
        $text = $data['text'][$offer];
        $link = fn (string $areaKey) => $this->localUrl('/search/' . $typeSlug . '-for-' . $offer . '-in-' . $areaKey);
        $has = fn (string $areaKey) => $this->results($data['units'], $this->defaults($type['key'], $areaKey, $offer), 'units') !== [];

        // لينكات المناطق: كل واحد بيفتح نفس صفحة البحث على المنطقة دي (العنوان والعدد والفلتر بيتغيروا).
        // جوه منطقة فرعية أول لينك بيرجّع للمنطقة الأم كلها. المناطق اللي مفيهاش نتايج للنوع ده مش بتظهر.
        $parentSlug = $area['parent'] ?: $areaSlug;
        $links = $area['parent'] ? [['label' => sprintf($data['text']['all'], $data['areas'][$parentSlug]['label']), 'url' => $link($parentSlug), 'current' => false]] : [];
        foreach ($data['areas'] as $key => $row) {
            if ($row['parent'] === $parentSlug && ($key === $areaSlug || $has($key))) {
                $links[] = ['label' => $row['label'], 'url' => $link($key), 'current' => $key === $areaSlug];
            }
        }

        return [
            'slug' => $slug,
            'name' => sprintf($text['name'], $type['label'], $area['label']),
            'h1' => sprintf($text['h1'], $type['label'], $area['label']),
            'meta_title' => sprintf($text['meta_title'], $type['label'], $area['label']),
            'meta_description' => sprintf($text['meta_description'], $type['label'], $area['label']),
            // المنطقة الأم في مسار الصفحة (لصفحات المناطق الفرعية)
            'parent' => $area['parent'] ? ['label' => sprintf($text['h1'], $type['label'], $data['areas'][$parentSlug]['label']), 'url' => $link($parentSlug)] : null,
            'defaults' => $this->defaults($type['key'], $areaSlug, $offer),
            'subAreas' => count($links) > 1 ? $links : [],
            'searches' => $this->similar($data, $typeSlug, $areaSlug, $offer),
        ];
    }

    /** الفلاتر اللي الصفحة مفتوحة عليها */
    private function defaults(?string $type, string $area, string $offer): array
    {
        return array_filter(['offer' => $offer === 'rent' ? 'rent' : null, 'type' => $type ? [$type] : null, 'area' => [$area]]);
    }

    /** عمليات بحث مشابهة: أنواع تانية في نفس المنطقة + نفس النوع في مناطق تانية (اللي ليها نتايج بس) */
    private function similar(array $data, ?string $typeSlug, ?string $areaSlug, string $offer): array
    {
        $out = [];
        $add = function (string $type, string $area) use (&$out, $data, $offer) {
            if (count($out) < 8 && $this->results($data['units'], $this->defaults($data['types'][$type]['key'], $area, $offer), 'units') !== []) {
                $out[$type . $area] = [
                    'label' => sprintf($data['text'][$offer]['name'], $data['types'][$type]['label'], $data['areas'][$area]['label']),
                    'url' => $this->localUrl('/search/' . $type . '-for-' . $offer . '-in-' . $area),
                ];
            }
        };
        $tops = array_keys(array_filter($data['areas'], fn ($row) => $row['parent'] === null));
        $parent = $areaSlug ? ($data['areas'][$areaSlug]['parent'] ?: $areaSlug) : null;

        if ($areaSlug === null) {   // البحث العام: أشهر الأنواع في كل منطقة كبيرة
            foreach (['chalets', 'villas', 'apartments', 'twin-houses'] as $type) {
                foreach ($tops as $area) {
                    $add($type, $area);
                }
            }
        } else {
            foreach (array_keys($data['types']) as $type) {   // أنواع تانية في نفس المنطقة
                if ($type !== $typeSlug && count($out) < 4) {
                    $add($type, $areaSlug);
                }
            }
            foreach ($data['areas'] as $area => $row) {   // نفس النوع في المناطق التانية
                if ($area !== $areaSlug && $area !== $parent && $row['parent'] !== $parent) {
                    $add($typeSlug, $area);
                }
            }
        }

        return array_values($out);
    }

    /** اللينك من غير أي اختيار فعلي (كل الحقول فاضية) */
    private function blank(array $selected): bool
    {
        foreach ($selected as $key => $value) {
            if ($key !== 'sort' && $value !== '' && $value !== [] && $value !== null && ! ($key === 'offer' && $value === 'developer')) {
                return false;
            }
        }

        return true;
    }

    /**
     * فلترة وترتيب البيانات التجريبية بنفس حقول الفورم — ده اللي بيتبدّل باستعلام الداتا بيز:
     * q ، offer ، type[] ، area[] ، developer[] ، project[] ، bedrooms[] ، bathrooms[] ، finishing[] ، delivery[] ، years[] ،
     * price_min ، price_max ، size_min ، size_max ، sort (price_asc | price_desc | installment_asc | installment_desc | delivery | newest)
     */
    private function results(array $items, array $selected, string $mode): array
    {
        $list = fn (string $key) => array_values(array_map('strval', array_filter((array) ($selected[$key] ?? []), fn ($value) => $value !== '' && $value !== null)));
        $number = fn (string $key) => isset($selected[$key]) && $selected[$key] !== '' ? (float) str_replace(',', '', (string) $selected[$key]) : null;
        $any = fn (array $chosen, array $have) => $chosen === [] || array_intersect($chosen, array_map('strval', $have)) !== [];
        $words = array_values(array_filter(explode(' ', $this->plain((string) ($selected['q'] ?? '')))));
        $offer = $selected['offer'] ?? 'developer';
        $units = $mode === 'units';

        $items = array_values(array_filter($items, function (array $item) use ($list, $number, $any, $words, $offer, $units) {
            if (! $any($list('type'), $units ? [$item['type']] : $item['type_keys'])
                || ! $any($list('area'), $item['areas'])
                || ! $any($list('developer'), [$item['developer']])
                || ! $any($list('project'), [$units ? $item['project'] : $item['slug']])) {
                return false;
            }
            if (($number('price_min') !== null && $item['price_value'] < $number('price_min')) || ($number('price_max') !== null && $item['price_value'] > $number('price_max'))) {
                return false;
            }
            if ($words !== []) {
                $text = $this->plain(implode(' ', [$item['title'] ?? $item['name'], $item['compound'] ?? '', $item['developer_name'], $item['developer'], $item['location'], $item['slug'], implode(' ', $item['areas'])]));
                foreach ($words as $word) {
                    if (! str_contains($text, $word)) {
                        return false;
                    }
                }
            }
            if (! $units) {
                return true;
            }

            $rent = $item['offer'] === 'rent';
            if ($offer === 'rent' ? ! $rent : ($rent || ($offer === 'resale' && empty($item['resale'])))) {
                return false;
            }
            if (($number('size_min') !== null && $item['area'] < $number('size_min')) || ($number('size_max') !== null && $item['area'] > $number('size_max'))) {
                return false;
            }
            $years = $list('years');

            return $any($list('bedrooms'), [$item['beds']]) && $any($list('bathrooms'), [$item['baths']])
                && $any($list('finishing'), [$item['finishing']]) && $any($list('delivery'), [$item['delivery']])
                && ($years === [] || in_array((string) $item['years'], $years, true) || (in_array('9+', $years, true) && $item['years'] >= 9));
        }));

        $sort = $selected['sort'] ?? '';
        $by = ['price_asc' => ['price_value', 1], 'price_desc' => ['price_value', -1], 'installment_asc' => ['installment_value', 1], 'installment_desc' => ['installment_value', -1]][$sort] ?? null;
        if ($by && ($units || $by[0] === 'price_value')) {
            usort($items, fn ($a, $b) => ($a[$by[0]] <=> $b[$by[0]]) * $by[1]);
        } elseif ($sort === 'delivery' && $units) {
            usort($items, fn ($a, $b) => ($a['delivery'] === 'ready' ? 0 : (int) $a['delivery']) <=> ($b['delivery'] === 'ready' ? 0 : (int) $b['delivery']));
        }

        return $items;
    }

    /** توحيد النص للبحث: حروف صغيرة، من غير تشكيل، وتوحيد الألف والياء والتاء المربوطة */
    private function plain(string $text): string
    {
        $text = preg_replace('/[\x{064B}-\x{0652}\x{0640}]/u', '', mb_strtolower($text));
        $text = str_replace(['أ', 'إ', 'آ', 'ى', 'ة', '-', '_', '،', ','], ['ا', 'ا', 'ا', 'ي', 'ه', ' ', ' ', ' ', ' '], $text);

        return trim(preg_replace('/\s+/u', ' ', $text));
    }
}
