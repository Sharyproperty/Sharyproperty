{{-- اختيارات (أكتر من واحد) في صفحة "تصفية". $name = اسم الحقل ، $options = [['value', 'label'], ...] ، $chosen = القيم المختارة ، $box = true للأرقام (مربعات)
    الاختيار اللي عليه 'modes' بيظهر بس مع التبويبات دي (developer | resale | rent) — من غيرها بيظهر مع الكل. --}}
<div class="flex flex-wrap gap-2.5">
    @foreach ($options as $option)
        <label class="cursor-pointer" data-modes="{{ implode(' ', $option['modes'] ?? []) }}">
            <input type="checkbox" name="{{ $name }}[]" value="{{ $option['value'] }}" class="sr-only" {{ in_array((string) $option['value'], $chosen) ? 'checked' : '' }}>
            <span class="area-chip {{ !empty($box) ? 'area-chip--box' : '' }}">{{ $option['label'] }}</span>
        </label>
    @endforeach
</div>
