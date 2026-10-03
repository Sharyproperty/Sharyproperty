{{--
    كارت عرض: نسبة المقدم + سنوات التقسيط + ملاحظة + اسم المشروع + "احجز العرض" + واتساب.
    $offer = ['percent', 'years', 'note', 'project', 'url']
    "احجز العرض" بيفتح فورم طلب الاجتماع (data-meeting-open). واتساب بنفس شكل زرار واتساب في باقي الموقع.
--}}
<article class="area-card w-[72%] shrink-0 snap-start px-4 py-5 text-center lg:w-auto lg:px-6 lg:py-7">
    <p class="text-[34px] font-bold leading-[1.1] text-shary-gold lg:text-[42px]" dir="ltr">{{ $offer['percent'] }}</p>
    <p class="text-[12px] font-medium leading-normal text-shary-muted lg:text-[13px]">{{ __('areas.down_payment') }}</p>
    <p class="mt-1 text-[18px] font-bold leading-normal lg:text-[20px]">{{ __('areas.years_installments', ['years' => $offer['years']]) }}</p>
    <p class="text-[12px] font-medium leading-normal text-shary-muted lg:text-[13px]">{{ $offer['note'] }}</p>
    <h3 class="mt-1 text-[15px] font-semibold leading-normal lg:text-[16px]"><a href="{{ $offer['url'] }}" class="hover:text-shary-link">{{ $offer['project'] }}</a></h3>

    <a href="{{ $meetingUrl ?? '#' }}" data-meeting-open class="mt-2.5 flex h-11 items-center justify-center rounded-xl bg-shary-gold text-[14px] font-bold leading-normal text-shary-navy transition-[filter] hover:brightness-95 lg:h-12 lg:text-[15px]">{{ __('areas.book_offer') }}</a>
    <a href="https://wa.me/{{ $contact['whatsapp'] ?? '' }}" target="_blank" rel="noopener" class="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-shary-whatsapp text-[14px] font-bold leading-normal text-white transition-[filter] hover:brightness-95 lg:h-12 lg:text-[15px]">
        <i class="fa-brands fa-whatsapp text-[20px] leading-none" aria-hidden="true"></i>
        <span>{{ __('areas.ask_whatsapp') }}</span>
    </a>
</article>
