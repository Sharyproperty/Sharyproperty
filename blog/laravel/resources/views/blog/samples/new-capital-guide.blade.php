{{--
    محتوى مقال تجريبي (نفس محتوى التصميم) — بيمثّل الـ HTML اللي جاي من لوحة التحكم.
    العناصر المدعومة جوه .article-content:
    p ، h2 ، ul ، ol ، table ، figure/figcaption ،
    والبلوكات المخصوصة: a.article-cta ، figure.article-places ، aside.article-related (كارت مقال مقترح)
--}}
<p>العاصمة الإدارية الجديدة بقت من أهم مناطق الاستثمار العقاري في مصر. المنطقة فيها كمبوندات سكنية متنوعة، ومراكز أعمال، وخدمات تعليمية وطبية، وده اللي خلى الطلب عليها يزيد بشكل ملحوظ خلال آخر سنتين.</p>

<h2>موقع العاصمة الإدارية</h2>
<p>العاصمة بتقع شرق القاهرة الجديدة، وبتتوصل بيها من:</p>
<ul>
    <li>محور محمد بن زايد</li>
    <li>طريق السويس الصحراوي</li>
    <li>الطريق الدائري الإقليمي</li>
</ul>

<a href="#places" class="article-cta">10+ أماكن لازم تزورها في العاصمة الإدارية</a>

<h2>أفضل الكمبوندات في العاصمة</h2>
<p>اخترنا الكمبوندات اللي عندها أعلى نسبة تسليم فعلي وأنظمة سداد مرنة:</p>
<ol>
    <li>ذا سيتي أوف أودكس</li>
    <li>أرمونيا نيو كابيتال</li>
    <li>بلوم فيلدز</li>
    <li>كاسل لاندمارك</li>
    <li>لافيستا سيتي</li>
    <li>سكاي كابيتال</li>
</ol>

<figure class="article-places" id="places">
    <div class="article-places__box">
        <div class="article-places__title">أين تذهب في العاصمة الإدارية؟</div>
        <div class="article-places__list">
            <span>العلمين بارك</span>
            <span>الداون تاون</span>
            <span>برج أيقونة</span>
            <span>النهر الأخضر</span>
            <span>الحي المالي</span>
            <span>مسجد مصر</span>
        </div>
    </div>
    <figcaption>أين تذهب في العاصمة الإدارية الجديدة</figcaption>
</figure>

<h2>أشهر المطاعم والكافيهات</h2>
<p>الحي المالي والداون تاون فيهم تشكيلة واسعة من المطاعم:</p>
<ol>
    <li><strong>زيتونة</strong> <span>مطبخ مصري بقايمة مشويات متنوعة</span></li>
    <li><strong>كارما</strong> <span>كافيه وقهوة مختصة بإطلالة على النهر الأخضر</span></li>
    <li><strong>لوكال</strong> <span>برجر وبيتزا بأسعار مناسبة للعائلات</span></li>
    <li><strong>سي سايد</strong> <span>مأكولات بحرية طازة في الداون تاون</span></li>
</ol>

<h2>الملاعب وأماكن الترفيه</h2>
<figure>
    <img src="{{ asset('images/shary/blog-samples/article-leisure.jpg') }}" alt="ملاعب بادل ومناطق ترفيهية في العاصمة" width="680" height="380" loading="lazy">
    <figcaption>ملاعب بادل ومناطق ترفيهية في العاصمة</figcaption>
</figure>
<p>لو بتدور على مكان تقضي فيه وقت مع العيلة أو الأصحاب، العاصمة فيها ملاعب بادل ومراكز ترفيه متنوعة:</p>
<ol>
    <li>بادل بارك — الحي السكني الثالث</li>
    <li>أرينا كورتس — الداون تاون</li>
    <li>غرف الهروب في مول العاصمة</li>
</ol>

<a href="{{ url('/blog/new-capital-restaurants') }}" class="article-cta">15 مطعم في العاصمة الإدارية: من المصري للآسيوي</a>

<h2>أفضل الكافيهات</h2>
<ol>
    <li>كافيه النهر الأخضر</li>
    <li>بين آند بيري</li>
    <li>سيمفاني كوفي هاوس</li>
    <li>دوزر كوفي</li>
    <li>ليكي بيكري</li>
</ol>

<ul>
    <li><strong>الشقة التقليدية</strong> <span>تتواجد على مستوى واحد مع ارتفاع سقف متوسط وتوزيع غرف مغلق.</span></li>
    <li><strong>أما الدوبلكس</strong> <span>فيعتمد على التصميم المفتوح، ويتميز بسقف مرتفع وفراغ داخلي مزدوج الارتفاع، مع دور علوي جزئي يطل على الدور السفلي.</span></li>
</ul>

<h2>مقارنة سريعة: شقة ولا دوبلكس؟</h2>
<table>
    <thead>
        <tr><th>وجه المقارنة</th><th>الشقة</th><th>الدوبلكس</th></tr>
    </thead>
    <tbody>
        <tr><th>التصميم</th><td>تقليدي</td><td>مفتوح وعصري</td></tr>
        <tr><th>عدد الأدوار</th><td>دور واحد</td><td>دور واحد مع مستوى علوي جزئي</td></tr>
        <tr><th>ارتفاع السقف</th><td>متوسط</td><td>مرتفع جدًا</td></tr>
        <tr><th>الخصوصية</th><td>مرتفعة</td><td>أقل بسبب التصميم المفتوح</td></tr>
        <tr><th>الإضاءة الطبيعية</th><td>جيدة</td><td>ممتازة بسبب النوافذ الكبيرة</td></tr>
    </tbody>
</table>
<p>للتعرف على كل نوع بشكل أكتر تفصيلًا ومزايا وعيوب كل منهما، اقرأ السطور التالية.</p>

<h2>مميزات الدوبلكس</h2>
<ul>
    <li>تصميم داخلي عصري ومختلف عن الوحدات التقليدية.</li>
    <li>سقف مرتفع بيدّي إحساس أكبر بالمساحة.</li>
    <li>إضاءة طبيعية ممتازة بسبب النوافذ الكبيرة.</li>
</ul>

<aside class="article-related">
    <a href="{{ url('/blog/finishing-types') }}" class="article-related__image" tabindex="-1" aria-hidden="true">
        <img src="{{ asset('images/shary/blog-samples/related-finishing.jpg') }}" alt="" loading="lazy">
    </a>
    <div class="article-related__body">
        <h3><a href="{{ url('/blog/finishing-types') }}">دليلك للتعرف على الفرق بين أنواع التشطيبات السبعة</a></h3>
        <p>عندما تقرر شراء وحدة سكنية سواء للسكن أو الاستثمار، قد تكون من أهم الأسئلة التي تهتم بها: ما هو نوع التشطيب؟ لأنه أمر مهم يتوقف عليه عوامل عديدة، ويحدد طبيعة الوحدة من الداخل، والميزانية المطلوبة.</p>
        <a href="{{ url('/blog/finishing-types') }}" class="article-related__more">... تابع قراءة</a>
        <div class="article-related__footer">
            <span class="article-related__brand">
                <img src="{{ asset('images/shary/logo-mark.svg') }}" alt="" width="20" height="19">
                شاري
            </span>
            <button type="button" class="article-related__share" data-share-url="{{ url('/blog/finishing-types') }}" data-share-title="دليلك للتعرف على الفرق بين أنواع التشطيبات السبعة" aria-label="مشاركة المقال">
                <img src="{{ asset('images/shary/icons/share.svg') }}" alt="" width="20" height="20">
            </button>
        </div>
    </div>
</aside>

<h2>ما هو المقصود بالبنتهاوس؟</h2>
<ul>
    <li><strong>البنتهاوس</strong> <span>وحدة تقع في آخر دور بالمبنى، وتضم غرفة أو مستوى إضافيًا متصلًا بسلم داخلي، بالإضافة إلى روف خاص.</span></li>
    <li><strong>يجذب هذا النوع</strong> <span>الأزواج والمبدعين والشباب المهنيين الباحثين عن نمط حياة عصري وفريد.</span></li>
</ul>
