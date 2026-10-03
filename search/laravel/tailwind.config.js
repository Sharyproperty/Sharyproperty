/**
 * إعدادات Tailwind (v3) لصفحات شاري.
 * لو المشروع عنده tailwind.config.js بالفعل: انقل اللي جوه theme.extend بس.
 * لو المشروع على Tailwind v4: عرّف نفس الألوان والخط في ملف الـ CSS بـ @theme.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./resources/views/**/*.blade.php', './public/js/shary/*.js', '../html/*.html'],
    theme: {
        extend: {
            colors: {
                shary: {
                    navy: '#123A5C', // النص الأساسي
                    deep: '#14385A', // خلفية شريط المؤشر
                    action: '#1E4166', // زراير إرسال واتصال
                    teal: '#1F7F72', // الروابط والتصنيفات
                    link: '#1F63C6', // لينك أزرق (عرض الكل، زرار اللغة)
                    yellow: '#FCB424', // أصفر اللوجو (زرار اللغة)
                    mint: '#5FD3C4', // نسبة التغيّر في المؤشر
                    muted: '#5B6B7C', // نص ثانوي
                    hint: '#8A99A8', // placeholder
                    line: '#E4E9EF', // الخطوط الفاصلة
                    mist: '#B9C9D8', // اسم المنطقة في المؤشر
                    cloud: '#D6E2EC', // بيانات المقال الرئيسي
                    form: '#E3EAF3', // خلفية الفورم
                    image: '#E8EEF5', // خلفية الصور لحد ما تحمّل
                    whatsapp: '#4DC35A',
                    soft: '#F2F5F8', // خلفية صفحة المنطقة
                    gold: '#E9A23B', // نسبة المقدم وزرار "احجز العرض"
                    emerald: '#0B5E45', // شارة "موقع مميز"
                },
            },
            fontFamily: {
                cairo: ['Cairo', 'Tahoma', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
