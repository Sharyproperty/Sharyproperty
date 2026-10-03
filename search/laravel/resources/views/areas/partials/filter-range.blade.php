{{--
    شريط من–إلى بطرفين + خانتين للكتابة. نفس الشريط ممكن يتكرر في أكتر من مكان (لوحة السعر وصفحة "تصفية") وبيتحركوا مع بعض.
    $name = اسم المدى (price | size) ، $range = ['min', 'max'] ، $unit = النص جوه الخانة ، $scale = log للسعر / linear للمساحة
    $range['modes'] = حدود مختلفة لتبويب معيّن، مثلاً ['rent' => ['min' => 500, 'max' => 25000]] (اختياري).
    القيم بتتبعت من الحقلين المخفيين {name}_min و {name}_max (مكتوبين مرة واحدة في filters.blade.php).
--}}
<div data-range="{{ $name }}" data-min="{{ $range['min'] }}" data-max="{{ $range['max'] }}" data-scale="{{ $scale ?? 'linear' }}" data-bounds="{{ json_encode($range['modes'] ?? []) }}">
    <div class="area-range">
        <span class="area-range__rail" aria-hidden="true"><i class="area-range__fill" data-range-fill></i></span>
        <input type="range" min="0" max="1000" step="1" value="0" aria-label="{{ __('areas.range_from') }}" data-range-low>
        <input type="range" min="0" max="1000" step="1" value="1000" aria-label="{{ __('areas.range_to') }}" data-range-high>
    </div>
    <div class="mt-4 grid grid-cols-2 gap-3">
        <label class="area-field">
            <span class="sr-only">{{ __('areas.range_from') }}</span>
            <span class="shrink-0">{{ $unit }}</span>
            <input type="text" inputmode="numeric" autocomplete="off" data-range-low-text>
        </label>
        <label class="area-field">
            <span class="sr-only">{{ __('areas.range_to') }}</span>
            <span class="shrink-0">{{ $unit }}</span>
            <input type="text" inputmode="numeric" autocomplete="off" data-range-high-text>
        </label>
    </div>
</div>
