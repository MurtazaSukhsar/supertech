/**
 * Area landing pages for Kuwait.
 *
 * These exist because a searcher in Salmiya typing "hardware shop near me"
 * gets a *different* result set than one in Jahra — proximity is a top-three
 * local ranking factor and the shop only has one address. Area pages cannot
 * change proximity, but they win the organic (non-map) results for
 * "hardware shop in <area>" queries, which is where the remaining traffic is.
 *
 * Each entry carries genuinely distinct copy. Spinning near-identical pages
 * across a location list is the classic "doorway page" pattern that Google
 * demotes, so every area below states real, specific facts: where it sits
 * relative to Shuwaikh, what the local trade actually buys, and how delivery
 * works to that area.
 */

import type { Locale } from '@/lib/i18n/config'

export type AreaContent = {
  /** H1 and page title fragment, e.g. "Salmiya". */
  name: string
  /** One-line meta description hook. */
  metaDescription: string
  /** Lead paragraph — must be unique per area. */
  intro: string
  /** What this area's customers typically buy. */
  demand: string
  /** Delivery / travel specifics for this area. */
  delivery: string
  /** How to place an order / account terms for this area's typical buyer. */
  ordering: string
  /** Bullet list of area-specific highlights. */
  highlights: string[]
}

export type Area = {
  slug: string
  /** Straight-line distance from the Shuwaikh shop, in km. */
  distanceKm: number
  /** Governorate the area belongs to, used in schema. */
  governorate: { en: string; ar: string }
  content: Record<Locale, AreaContent>
}

export const areas: Area[] = [
  {
    slug: 'shuwaikh',
    distanceKm: 0,
    governorate: { en: 'Al Asimah', ar: 'العاصمة' },
    content: {
      en: {
        name: 'Shuwaikh Industrial',
        metaDescription:
          'Hardware shop inside Shuwaikh Industrial Area, Kuwait. Walk in for AC materials, copper pipe, tools, plumbing and electrical supplies — no delivery wait.',
        intro:
          'Our shop is located in Shuwaikh Industrial Area, the hardware and building-materials district of Kuwait. If you are already working in Shuwaikh, you can collect what you need over the counter the same hour rather than waiting on a delivery slot.',
        demand:
          'Shuwaikh is where most of Kuwait’s workshops, fabricators and MEP subcontractors are based, so the fastest-moving stock here is copper pipe coils, refrigerant gas, duct tape and sealant, unistrut channel, drop-in anchors and replacement power-tool consumables — the items a crew runs out of mid-job.',
        delivery:
          'Collection is immediate during opening hours. For Shuwaikh addresses we also run short-notice drops to workshops and yards, usually within the same working day.',
        ordering:
          'Regular customers in Shuwaikh Industrial Area can set up a trade account for faster counter service — call ahead with your item list and we will have it picked and ready when you arrive, or place a standing order for recurring consumables like duct tape, sealant, and fasteners so you never run short mid-job. Cash, card and company account terms are all accepted, and we can issue delivery notes and invoices matching your project’s paperwork requirements.',
        highlights: [
          'Counter collection — no delivery wait',
          'Walk-in stock for mid-job replacements',
          'Trade quantities available on the spot',
          'Parking access for pickups and vans',
        ],
      },
      ar: {
        name: 'الشويخ الصناعية',
        metaDescription:
          'محل خردوات داخل منطقة الشويخ الصناعية بالكويت. مواد تكييف ومواسير نحاس وعدد وأدوات صحية وكهربائية — استلام فوري بدون انتظار توصيل.',
        intro:
          'محلنا يقع في منطقة الشويخ الصناعية، سوق الخردوات ومواد البناء في الكويت. إذا كنت تعمل في الشويخ، يمكنك استلام احتياجاتك من المحل مباشرة خلال نفس الساعة بدلاً من انتظار موعد التوصيل.',
        demand:
          'الشويخ هي مقر معظم الورش والمصانع ومقاولي الأعمال الكهروميكانيكية في الكويت، لذلك أسرع الأصناف حركة هنا هي لفائف مواسير النحاس وغاز التبريد وشرائط وسيلانت الدكت وقنوات اليونسترت والمثبتات ومستهلكات العدد الكهربائية — الأصناف التي تنفد من الفريق أثناء العمل.',
        delivery:
          'الاستلام فوري خلال أوقات الدوام. كما نوفّر توصيلاً سريعاً لعناوين الشويخ إلى الورش والساحات، عادة خلال نفس يوم العمل.',
        ordering:
          'يمكن لعملائنا الدائمين في الشويخ الصناعية فتح حساب تجاري لخدمة أسرع عند الاستلام من المحل — اتصل مسبقاً بقائمة الأصناف وسنجهزها لتكون جاهزة عند وصولك، أو رتّب طلباً دورياً للمستهلكات المتكررة مثل شريط الدكت والسيلانت ومواد التثبيت حتى لا ينفد مخزونك أثناء العمل. نقبل الدفع نقداً أو بالبطاقة أو بشروط حساب الشركة، ويمكننا إصدار إشعارات التسليم والفواتير المطابقة لمستندات مشروعك.',
        highlights: [
          'استلام مباشر من المحل بدون انتظار',
          'مخزون جاهز للاستبدال أثناء العمل',
          'كميات الجملة متوفرة فوراً',
          'مواقف مناسبة للبيك أب والفانات',
        ],
      },
    },
  },
  {
    slug: 'kuwait-city',
    distanceKm: 6,
    governorate: { en: 'Al Asimah', ar: 'العاصمة' },
    content: {
      en: {
        name: 'Kuwait City',
        metaDescription:
          'Hardware shop serving Kuwait City — AC materials, tools, plumbing and electrical supplies delivered from Shuwaikh, about 10 minutes away.',
        intro:
          'Kuwait City sits roughly six kilometres east of our Shuwaikh shop — around ten minutes outside peak traffic. Most of our City customers are facilities teams and maintenance contractors working in office towers, banks and government buildings along Ahmed Al Jaber and Fahd Al Salem streets.',
        demand:
          'Tower and office work drives demand for split-unit AC spares, access valves, condensate materials, acoustic duct insulation and vibration hangers — work that has to be done quietly and after hours. Fastener and conduit stock for fit-out contractors also moves heavily here.',
        delivery:
          'We deliver into Kuwait City daily. Because loading access in the City is restricted to certain hours in many buildings, tell us your access window when you order and we will schedule the drop around it.',
        ordering:
          'For office towers and government buildings, book your access window as early as possible and confirm your material list by WhatsApp — this lets our dispatch team plan around loading-bay restrictions rather than scrambling on the day. Facilities contractors with recurring maintenance schedules can set up a standing monthly order for spares like access valves and condensate materials, billed on account terms rather than per delivery.',
        highlights: [
          'About 10 minutes from our Shuwaikh counter',
          'Daily delivery into the City',
          'Timed drops for restricted loading bays',
          'Strong stock for tower and fit-out maintenance',
        ],
      },
      ar: {
        name: 'مدينة الكويت',
        metaDescription:
          'محل خردوات يخدم مدينة الكويت — مواد تكييف وعدد وأدوات صحية وكهربائية مع التوصيل من الشويخ خلال حوالي ١٠ دقائق.',
        intro:
          'تبعد مدينة الكويت حوالي ستة كيلومترات شرق محلنا في الشويخ — نحو عشر دقائق خارج أوقات الذروة. معظم عملائنا في المدينة هم فرق الصيانة ومقاولو المرافق العاملون في الأبراج والبنوك والمباني الحكومية على شارعي أحمد الجابر وفهد السالم.',
        demand:
          'أعمال الأبراج والمكاتب ترفع الطلب على قطع غيار المكيفات المنفصلة وصمامات الخدمة ومواد تصريف المياه وعزل الدكت الصوتي وحوامل امتصاص الاهتزاز — أعمال تُنفّذ بهدوء وخارج أوقات الدوام. كما تتحرك مواد التثبيت والمواسير الكهربائية بكثافة لمقاولي التشطيبات.',
        delivery:
          'نوصّل إلى مدينة الكويت يومياً. ولأن مداخل التحميل في كثير من المباني مقيّدة بأوقات محددة، أخبرنا بالوقت المتاح عند الطلب وسنرتب التوصيل حسبه.',
        ordering:
          'لمباني الأبراج والمباني الحكومية، احجز نافذة الدخول مبكراً وأكّد قائمة المواد عبر واتساب — هذا يتيح لفريق التوصيل التخطيط حول قيود مداخل التحميل بدل الاستعجال في اليوم نفسه. يمكن لمقاولي الصيانة ذوي الجداول المتكررة فتح طلب شهري ثابت لقطع مثل صمامات الخدمة ومواد التصريف، تُفوتر بشروط الحساب بدلاً من كل توصيل على حدة.',
        highlights: [
          'حوالي ١٠ دقائق من محلنا في الشويخ',
          'توصيل يومي إلى المدينة',
          'مواعيد توصيل تناسب مداخل التحميل المقيّدة',
          'مخزون قوي لصيانة الأبراج والتشطيبات',
        ],
      },
    },
  },
  {
    slug: 'hawalli',
    distanceKm: 11,
    governorate: { en: 'Hawalli', ar: 'حولي' },
    content: {
      en: {
        name: 'Hawalli',
        metaDescription:
          'Hardware and AC materials for Hawalli, Kuwait. Copper pipe, refrigerant, tools and plumbing supplies delivered from our Shuwaikh shop.',
        intro:
          'Hawalli is about eleven kilometres from Shuwaikh. It is one of the densest residential areas in Kuwait, and the work there is dominated by apartment-block maintenance rather than new construction.',
        demand:
          'Residential density means constant demand for split AC servicing parts, copper pipe in shorter coils, rubber insulation tube, drain fittings, UPVC pressure and drainage fittings, and hand tools. Buyers here typically order smaller mixed quantities more often, rather than pallet loads.',
        delivery:
          'Regular delivery runs cover Hawalli. Mixed small-quantity orders are welcome — you do not need to hit a bulk minimum to get a delivery.',
        ordering:
          'Because most Hawalli orders are small and mixed rather than bulk, the fastest way to order is a short WhatsApp message with item names and quantities — no minimum order value applies. Building maintenance companies managing several properties in the area can register a trade account so each site’s purchases are tracked and invoiced together at month end instead of per delivery.',
        highlights: [
          'No bulk minimum for delivery',
          'Short copper coils and mixed quantities',
          'Strong split-AC service parts stock',
          'Suited to apartment maintenance work',
        ],
      },
      ar: {
        name: 'حولي',
        metaDescription:
          'خردوات ومواد تكييف لمنطقة حولي بالكويت. مواسير نحاس وغاز تبريد وعدد وأدوات صحية مع التوصيل من محلنا في الشويخ.',
        intro:
          'تبعد حولي حوالي أحد عشر كيلومتراً عن الشويخ، وهي من أكثر المناطق السكنية كثافة في الكويت، وتغلب عليها أعمال صيانة العمارات أكثر من الإنشاءات الجديدة.',
        demand:
          'الكثافة السكنية تعني طلباً مستمراً على قطع صيانة المكيفات المنفصلة ومواسير النحاس بلفائف قصيرة وأنابيب العزل المطاطي ووصلات التصريف ووصلات UPVC للضغط والصرف والعدد اليدوية. عادة ما يطلب العملاء هنا كميات صغيرة متنوعة بشكل متكرر بدل الطلبات الكبيرة.',
        delivery:
          'لدينا رحلات توصيل منتظمة تغطي حولي. الطلبات الصغيرة المتنوعة مرحّب بها — لا يشترط حد أدنى للجملة للحصول على التوصيل.',
        ordering:
          'بما أن معظم طلبات حولي صغيرة ومتنوعة وليست بالجملة، أسرع طريقة للطلب هي رسالة واتساب قصيرة بأسماء الأصناف والكميات — دون حد أدنى للطلب. يمكن لشركات إدارة الصيانة التي تدير عدة عقارات في المنطقة تسجيل حساب تجاري لتتبع مشتريات كل موقع وفوترتها معاً في نهاية الشهر بدلاً من كل توصيل على حدة.',
        highlights: [
          'لا يوجد حد أدنى للطلب للتوصيل',
          'لفائف نحاس قصيرة وكميات متنوعة',
          'مخزون قوي لقطع صيانة المكيفات',
          'مناسب لأعمال صيانة الشقق',
        ],
      },
    },
  },
  {
    slug: 'salmiya',
    distanceKm: 14,
    governorate: { en: 'Hawalli', ar: 'حولي' },
    content: {
      en: {
        name: 'Salmiya',
        metaDescription:
          'Hardware shop supplying Salmiya, Kuwait — AC spares, plumbing, electrical and tools delivered from Shuwaikh Industrial Area.',
        intro:
          'Salmiya is roughly fourteen kilometres from our Shuwaikh counter, along the coast in Hawalli Governorate. Between the retail strips on Salem Al Mubarak Street and the surrounding residential towers, the demand pattern here is retail fit-out plus heavy AC load.',
        demand:
          'Shop and restaurant fit-outs drive orders for flexible duct, volume control dampers, duct sealant, industrial sockets and conduit clips. The coastal humidity also pushes steady demand for corrosion-resistant galvanised fasteners and properly rated insulation.',
        delivery:
          'We deliver to Salmiya on our regular Hawalli Governorate runs. For retail units with restricted daytime access, we can schedule early-morning drops.',
        ordering:
          'Retail and restaurant fit-out contractors ordering for Salmiya units should send drawings or a material list ahead of the fit-out start date so we can hold stock of duct, sockets and sealant against your schedule. We also support recurring restaurant maintenance contracts with monthly consumable top-ups — ask about setting one up on account terms.',
        highlights: [
          'Retail and restaurant fit-out materials',
          'Galvanised fasteners rated for coastal humidity',
          'Early-morning drops available',
          'Duct, damper and sealant stock held locally',
        ],
      },
      ar: {
        name: 'السالمية',
        metaDescription:
          'محل خردوات يخدم السالمية بالكويت — قطع غيار مكيفات وأدوات صحية ومواد كهربائية وعدد مع التوصيل من الشويخ الصناعية.',
        intro:
          'تبعد السالمية حوالي أربعة عشر كيلومتراً عن محلنا في الشويخ، على الساحل في محافظة حولي. بين المحلات التجارية في شارع سالم المبارك والأبراج السكنية المحيطة، يغلب على الطلب هنا تجهيزات المحلات مع أحمال تكييف عالية.',
        demand:
          'تجهيزات المحلات والمطاعم ترفع الطلب على الدكت المرن ومنظمات تدفق الهواء وسيلانت الدكت والأفياش الصناعية ومشابك المواسير. كما تدفع الرطوبة الساحلية إلى طلب مستمر على مواد التثبيت المجلفنة المقاومة للتآكل والعزل بالمواصفة المناسبة.',
        delivery:
          'نوصّل إلى السالمية ضمن رحلاتنا المنتظمة لمحافظة حولي. وللمحلات ذات الدخول المقيّد نهاراً، يمكننا ترتيب التوصيل في الصباح الباكر.',
        ordering:
          'على مقاولي تجهيز المحلات والمطاعم في السالمية إرسال المخططات أو قائمة المواد قبل بدء التجهيز حتى نحجز مخزون الدكت والأفياش والسيلانت وفق جدولكم. كما ندعم عقود صيانة المطاعم الدورية بتزويد شهري للمستهلكات — اسأل عن فتح حساب بشروط الحساب لذلك.',
        highlights: [
          'مواد تجهيز المحلات والمطاعم',
          'مواد تثبيت مجلفنة تقاوم الرطوبة الساحلية',
          'إمكانية التوصيل في الصباح الباكر',
          'دكت ومنظمات هواء وسيلانت متوفرة',
        ],
      },
    },
  },
  {
    slug: 'farwaniya',
    distanceKm: 15,
    governorate: { en: 'Al Farwaniyah', ar: 'الفروانية' },
    content: {
      en: {
        name: 'Farwaniya',
        metaDescription:
          'Hardware and construction materials for Farwaniya, Kuwait. Bulk copper pipe, insulation, tools and fasteners delivered from Shuwaikh.',
        intro:
          'Farwaniya lies about fifteen kilometres south-west of Shuwaikh, near the airport corridor. It is a high-volume area for contracting firms and one where orders tend to be larger and more repeatable than in the residential governorates.',
        demand:
          'Contractors here order in project quantities: full copper pipe pancake coils, insulation rolls, refrigerant cylinders, unistrut channel by the length, and fasteners by the box. Power tools and consumables are usually bought alongside rather than separately.',
        delivery:
          'Bulk deliveries to Farwaniya are scheduled runs. Send a full material list with quantities and we will confirm availability and a delivery slot together, so you are not tracking part-shipments.',
        ordering:
          'Contracting firms working project quantities in Farwaniya get the most value from a phased order: confirm the full material list and quantities up front, and we will release coils, rolls and cylinders against agreed delivery dates rather than holding one large shipment. Company account terms and project-based invoicing are available for repeat contractors in the airport-corridor cluster.',
        highlights: [
          'Project-quantity pricing',
          'Full coils, rolls and cylinders in stock',
          'One confirmed slot per material list',
          'Serves the airport-corridor contracting cluster',
        ],
      },
      ar: {
        name: 'الفروانية',
        metaDescription:
          'خردوات ومواد بناء لمنطقة الفروانية بالكويت. مواسير نحاس وعوازل وعدد ومواد تثبيت بالجملة مع التوصيل من الشويخ.',
        intro:
          'تقع الفروانية على بعد حوالي خمسة عشر كيلومتراً جنوب غرب الشويخ، قرب محور المطار. وهي منطقة ذات حجم طلب عالٍ لشركات المقاولات، وتكون الطلبات فيها عادة أكبر وأكثر تكراراً من المحافظات السكنية.',
        demand:
          'يطلب المقاولون هنا بكميات المشاريع: لفائف مواسير النحاس الكاملة ولفات العزل وأسطوانات غاز التبريد وقنوات اليونسترت بالطول ومواد التثبيت بالكرتون. وعادة ما تُطلب العدد الكهربائية والمستهلكات مع الطلب نفسه.',
        delivery:
          'التوصيل بالجملة إلى الفروانية ضمن رحلات مجدولة. أرسل قائمة المواد كاملة مع الكميات وسنؤكد التوفر وموعد التوصيل معاً، حتى لا تتابع شحنات جزئية.',
        ordering:
          'تحصل شركات المقاولات التي تطلب بكميات المشاريع في الفروانية على أفضل قيمة عبر طلب مرحلي: أكّد قائمة المواد والكميات كاملة مسبقاً، وسنُفرج عن اللفائف واللفات والأسطوانات وفق مواعيد تسليم متفق عليها بدلاً من شحنة واحدة كبيرة. تتوفر شروط حساب الشركة والفوترة حسب المشروع للمقاولين المتكررين في تجمع محور المطار.',
        highlights: [
          'أسعار بكميات المشاريع',
          'لفائف ولفات وأسطوانات كاملة متوفرة',
          'موعد توصيل واحد مؤكد لكل قائمة مواد',
          'يخدم تجمع المقاولات في محور المطار',
        ],
      },
    },
  },
  {
    slug: 'ahmadi',
    distanceKm: 35,
    governorate: { en: 'Al Ahmadi', ar: 'الأحمدي' },
    content: {
      en: {
        name: 'Ahmadi',
        metaDescription:
          'Hardware and industrial supplies for Ahmadi, Kuwait. Copper pipe, valves, fasteners and tools delivered to oil-sector and industrial sites.',
        intro:
          'Ahmadi is around thirty-five kilometres south of Shuwaikh and is Kuwait’s oil and industrial heartland. Specification matters more here than anywhere else we deliver — material that is not to spec will not pass site inspection.',
        demand:
          'Industrial and oil-sector work calls for brass fittings and valves, gauge cock valves, test plugs, thread sealants, heavy-duty structural supports and certified fasteners. Buyers routinely ask for brand and specification confirmation before ordering, and we confirm it in writing.',
        delivery:
          'Scheduled deliveries run to Ahmadi and the surrounding industrial areas. Given the distance, we consolidate orders into a single confirmed drop rather than splitting shipments.',
        ordering:
          'Given the specification requirements on oil-sector and industrial sites, Ahmadi orders should include the exact standard or brand you need — we will confirm it in writing before dispatch so it clears site inspection on arrival. Approved contractors and procurement teams can set up account terms with consolidated monthly invoicing across multiple site deliveries.',
        highlights: [
          'Written specification confirmation before dispatch',
          'Brass fittings, valves and certified fasteners',
          'Consolidated single-drop delivery',
          'Suited to oil-sector and industrial site standards',
        ],
      },
      ar: {
        name: 'الأحمدي',
        metaDescription:
          'خردوات ومستلزمات صناعية لمنطقة الأحمدي بالكويت. مواسير نحاس وصمامات ومواد تثبيت وعدد مع التوصيل لمواقع القطاع النفطي والصناعي.',
        intro:
          'تقع الأحمدي على بعد نحو خمسة وثلاثين كيلومتراً جنوب الشويخ، وهي قلب القطاع النفطي والصناعي في الكويت. المواصفة هنا أهم من أي منطقة أخرى نوصّل إليها — فالمادة غير المطابقة لن تجتاز فحص الموقع.',
        demand:
          'الأعمال الصناعية والنفطية تتطلب وصلات وصمامات نحاس أصفر وصمامات قياس وسدادات اختبار ومواد إحكام للأسنان وحوامل إنشائية ثقيلة ومواد تثبيت معتمدة. ويطلب المشترون عادة تأكيد العلامة التجارية والمواصفة قبل الطلب، ونؤكدها كتابياً.',
        delivery:
          'رحلات توصيل مجدولة إلى الأحمدي والمناطق الصناعية المحيطة. ونظراً للمسافة، نجمع الطلب في شحنة واحدة مؤكدة بدلاً من تقسيمه.',
        ordering:
          'نظراً لمتطلبات المواصفات في المواقع النفطية والصناعية، يجب أن تتضمن طلبات الأحمدي المعيار أو العلامة التجارية المطلوبة بالضبط — وسنؤكدها كتابياً قبل الشحن لتجتاز فحص الموقع عند الوصول. يمكن للمقاولين المعتمدين وفرق المشتريات فتح شروط حساب بفوترة شهرية مجمّعة عبر عدة تسليمات مواقع.',
        highlights: [
          'تأكيد المواصفة كتابياً قبل الشحن',
          'وصلات وصمامات نحاس ومواد تثبيت معتمدة',
          'توصيل مجمّع في شحنة واحدة',
          'مطابق لمعايير المواقع النفطية والصناعية',
        ],
      },
    },
  },
  {
    slug: 'jahra',
    distanceKm: 32,
    governorate: { en: 'Al Jahra', ar: 'الجهراء' },
    content: {
      en: {
        name: 'Jahra',
        metaDescription:
          'Hardware shop delivering to Jahra, Kuwait. Construction materials, AC supplies, tools and fasteners from our Shuwaikh Industrial base.',
        intro:
          'Jahra is roughly thirty-two kilometres west of Shuwaikh. It has fewer hardware suppliers per capita than the central governorates, so buyers there often make a long trip for materials that could simply be delivered.',
        demand:
          'Work in Jahra skews towards new-build residential, farm and warehouse structures: anchors, structural framing channel, UPVC pipe fittings, wrapping tapes, paint and surface-prep materials, and general-purpose power tools.',
        delivery:
          'We schedule delivery runs to Jahra rather than leaving you to collect. Send the list, confirm the quantities by phone or WhatsApp, and it goes on the next run — no trip to Shuwaikh needed.',
        ordering:
          'Because most Jahra buyers are ordering to avoid the round trip into the city, the simplest process is a phone call or WhatsApp list confirmed the day before your preferred delivery run — we hold the order and dispatch it on the next scheduled trip west. New-build contractors with ongoing material needs can also register for account terms rather than paying per delivery.',
        highlights: [
          'Delivery instead of a 32 km round trip',
          'New-build and warehouse material range',
          'Order by phone or WhatsApp',
          'Scheduled runs west of the city',
        ],
      },
      ar: {
        name: 'الجهراء',
        metaDescription:
          'محل خردوات يوصّل إلى الجهراء بالكويت. مواد بناء ومستلزمات تكييف وعدد ومواد تثبيت من مقرنا في الشويخ الصناعية.',
        intro:
          'تبعد الجهراء حوالي اثنين وثلاثين كيلومتراً غرب الشويخ. وعدد موردي الخردوات فيها أقل مقارنة بالمحافظات الوسطى، لذلك يقطع المشترون مسافة طويلة لشراء مواد يمكن ببساطة توصيلها.',
        demand:
          'تميل الأعمال في الجهراء إلى البناء السكني الجديد والمزارع والمخازن: المثبتات وقنوات الهياكل الإنشائية ووصلات مواسير UPVC وشرائط التغليف ومواد الدهان وتجهيز الأسطح والعدد الكهربائية متعددة الاستخدام.',
        delivery:
          'نجدول رحلات توصيل إلى الجهراء بدلاً من أن تأتي بنفسك. أرسل القائمة، وأكّد الكميات عبر الهاتف أو واتساب، وستُشحن في الرحلة التالية — دون الحاجة للسفر إلى الشويخ.',
        ordering:
          'بما أن معظم مشتري الجهراء يطلبون لتجنب الرحلة الطويلة إلى المدينة، فإن أبسط طريقة هي اتصال هاتفي أو قائمة واتساب تُؤكَّد قبل يوم من موعد التوصيل المفضل — نحتفظ بالطلب ونشحنه في الرحلة المجدولة التالية غرباً. يمكن لمقاولي البناء الجديد ذوي الاحتياجات المستمرة أيضاً التسجيل بشروط حساب بدلاً من الدفع عند كل توصيل.',
        highlights: [
          'توصيل بدلاً من رحلة ٣٢ كم ذهاباً وإياباً',
          'تشكيلة مواد للبناء الجديد والمخازن',
          'الطلب عبر الهاتف أو واتساب',
          'رحلات مجدولة غرب المدينة',
        ],
      },
    },
  },
  {
    slug: 'fahaheel',
    distanceKm: 40,
    governorate: { en: 'Al Ahmadi', ar: 'الأحمدي' },
    content: {
      en: {
        name: 'Fahaheel',
        metaDescription:
          'Hardware and AC materials delivered to Fahaheel, Kuwait. Copper pipe, refrigerant, plumbing and electrical supplies from Shuwaikh.',
        intro:
          'Fahaheel sits about forty kilometres south of our Shuwaikh shop, on the coast in Ahmadi Governorate. It combines dense residential blocks with commercial and marine-adjacent activity, which gives it a mixed material profile.',
        demand:
          'The mix here runs from apartment AC servicing — copper pipe, insulation tube, access valves, refrigerant — to commercial plumbing and drainage work using UPVC pressure fittings, jute hemp and thread sealants. Salt-air exposure makes galvanised and corrosion-resistant hardware the default choice.',
        delivery:
          'Fahaheel is covered on our southern delivery route alongside Ahmadi. Confirm your list early in the day to make the same route rather than waiting for the next one.',
        ordering:
          'To make the same southern delivery route as Ahmadi, confirm your Fahaheel order early in the day — later confirmations move to the next scheduled run. Property managers handling multiple apartment blocks in the area can set up a trade account so AC servicing and plumbing materials across several sites are billed together each month.',
        highlights: [
          'Covered on the southern delivery route',
          'Corrosion-resistant hardware for coastal exposure',
          'Residential AC and commercial plumbing range',
          'Same-route dispatch on early confirmations',
        ],
      },
      ar: {
        name: 'الفحيحيل',
        metaDescription:
          'خردوات ومواد تكييف مع التوصيل إلى الفحيحيل بالكويت. مواسير نحاس وغاز تبريد وأدوات صحية ومواد كهربائية من الشويخ.',
        intro:
          'تقع الفحيحيل على بعد حوالي أربعين كيلومتراً جنوب محلنا في الشويخ، على الساحل في محافظة الأحمدي. وتجمع بين العمارات السكنية الكثيفة والنشاط التجاري القريب من البحر، ما يمنحها احتياجات متنوعة.',
        demand:
          'يتنوع الطلب هنا بين صيانة مكيفات الشقق — مواسير نحاس وأنابيب عزل وصمامات خدمة وغاز تبريد — وأعمال السباكة والصرف التجارية باستخدام وصلات UPVC للضغط وخيط الجوت ومواد إحكام الأسنان. ويجعل التعرض للهواء المالح المواد المجلفنة والمقاومة للتآكل الخيار الافتراضي.',
        delivery:
          'الفحيحيل مشمولة ضمن مسار التوصيل الجنوبي مع الأحمدي. أكّد قائمتك في وقت مبكر من اليوم للحاق بنفس المسار بدل انتظار الرحلة التالية.',
        ordering:
          'للحاق بمسار التوصيل الجنوبي نفسه مع الأحمدي، أكّد طلب الفحيحيل مبكراً في اليوم — التأكيدات المتأخرة تنتقل إلى الرحلة المجدولة التالية. يمكن لمديري العقارات الذين يديرون عدة عمارات في المنطقة فتح حساب تجاري لفوترة مواد صيانة التكييف والسباكة عبر عدة مواقع معاً كل شهر.',
        highlights: [
          'مشمولة في مسار التوصيل الجنوبي',
          'مواد مقاومة للتآكل تناسب الأجواء الساحلية',
          'تشكيلة لتكييف المنازل وسباكة المحلات',
          'شحن في نفس المسار عند التأكيد المبكر',
        ],
      },
    },
  },
]

export const areaSlugs = areas.map((area) => area.slug)

export function getArea(slug: string): Area | undefined {
  return areas.find((area) => area.slug === slug)
}
