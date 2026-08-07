/**
 * Chatbot copy and intent matching, per locale.
 *
 * The bot is a keyword matcher, not a model, so each locale needs its own
 * keyword list. The Arabic lists deliberately also include the English trade
 * words (copper, duct, quote…), because technicians in Kuwait routinely type
 * those in English even mid-Arabic-sentence.
 */
import { contactInfo } from '@/lib/products'
import type { Locale } from '@/lib/i18n/config'

export type ChatAction = { label: string; href: string; external?: boolean }

export type QuickReply = {
  id: string
  label: string
  question: string
  answer: string
  actions?: ChatAction[]
}

export type ChatbotContent = {
  fabLabel: string
  headerTitle: string
  headerStatus: string
  closeLabel: string
  inputPlaceholder: string
  sendLabel: string
  welcome: string
  welcomeWhatsApp: string
  menuPrompt: string
  showMenu: string
  mainMenu: string
  fallback: string
  fallbackWhatsApp: string
  fallbackEmail: string
  quickReplies: QuickReply[]
  /** Ordered intent → keyword list. First match wins. */
  intents: { replyIndex: number; keywords: string[] }[]
  menuKeywords: string[]
}

const wa = (text: string) => `${contactInfo.whatsappHref}?text=${encodeURIComponent(text)}`

/* ------------------------------------------------------------------ */
/* English                                                             */
/* ------------------------------------------------------------------ */

const enQuickReplies: QuickReply[] = [
  {
    id: 'quote',
    label: '📋 Request a Quote',
    question: 'How can I request a quote for products?',
    answer:
      'You can request a quote in two easy ways:\n\n1. Browse our website, add products to your quote list, and submit the request directly.\n2. Click the links below to send your requirements or Bill of Quantities (BOQ) directly to our team via WhatsApp or Email.',
    actions: [
      {
        label: '💬 WhatsApp Quote',
        href: wa(
          'Hello Super Tech, I would like to request a bulk material quote. Here are our project requirements: ',
        ),
        external: true,
      },
      {
        label: '✉️ Email Quote',
        href: `https://mail.google.com/mail/?view=cm&fs=1&to=${contactInfo.email}&su=Quote%20Request`,
        external: true,
      },
      { label: '🔍 Browse Products', href: '/products' },
    ],
  },
  {
    id: 'delivery',
    label: '🚚 Delivery Info',
    question: 'Do you deliver to job sites and workshops?',
    answer:
      'Yes! We deliver bulk orders, HVAC accessories, power tools, and construction materials directly to workshops, stores, and project sites across Kuwait.',
    actions: [
      {
        label: '💬 Contact Delivery Desk',
        href: wa('Hello Super Tech, I have a question about material delivery to our job site in Kuwait.'),
        external: true,
      },
    ],
  },
  {
    id: 'categories',
    label: '🛠️ Product Categories',
    question: 'What types of materials and equipment do you supply?',
    answer:
      'We supply a comprehensive range of materials:\n\n• **Clamps & Supports:** Pipe clamps, unistrut brackets.\n• **Air-Conditioning Materials:** Copper pipes, refrigerants.\n• **Hardware Supplies:** Fasteners, fittings, anchors.\n• **Hand & Power Tools:** Drills, grinders, wrenches.\n• **Construction Materials:** Slotted channels, tapes.\n• **Plumbing Supplies:** UPVC fittings, valves, cements.\n• **Electrical Supplies:** Conduit couplings, industrial sockets.\n• **Duct Accessories:** Flexible ducts, sealants, adhesives.',
    actions: [
      { label: '🗜️ Clamps', href: '/categories/clamps' },
      { label: '❄️ A/C Materials', href: '/categories/air-conditioning' },
      { label: '🚰 Plumbing', href: '/categories/plumbing' },
      { label: '⚡ Electrical', href: '/categories/electric' },
    ],
  },
  {
    id: 'location',
    label: '📍 Location & Hours',
    question: 'Where is your shop and what are the working hours?',
    answer:
      'Our main office & shop is located in **Shuwaikh Industrial Area, Kuwait City**.\n\n🕒 **Working Hours:**\n• Saturday to Thursday: 8:00 AM - 5:00 PM\n• Friday: Closed',
    actions: [
      { label: '🗺️ Google Maps Location', href: contactInfo.googleMapsUrl, external: true },
      { label: '📞 Call shop', href: contactInfo.phoneHref, external: true },
    ],
  },
  {
    id: 'contact',
    label: '📞 Contact Support',
    question: 'How can I reach customer support or sales?',
    answer: `You can reach the Super Tech support and sales team directly:\n\n• **Phone:** ${contactInfo.phone}\n• **Email:** ${contactInfo.email}\n• **shop:** Shuwaikh Industrial Area, Kuwait`,
    actions: [
      {
        label: '💬 WhatsApp Chat',
        href: wa('Hello Super Tech Customer Support, I need assistance with a product or order inquiry.'),
        external: true,
      },
      { label: '📞 Call Now', href: contactInfo.phoneHref, external: true },
    ],
  },
]

const enContent: ChatbotContent = {
  fabLabel: 'Open support chat',
  headerTitle: 'SuperTechIntl Chatbot',
  headerStatus: 'Online • Auto-Answers',
  closeLabel: 'Close chat',
  inputPlaceholder: 'Type your question...',
  sendLabel: 'Send message',
  welcome:
    'Hi there! Welcome to Super Tech. I can quickly answer your questions about quotes, delivery, products, shop location, or contact details. Click a pretyped option below or type your question!',
  welcomeWhatsApp: '💬 Chat on WhatsApp',
  menuPrompt: 'Here are the quick topics you can choose from:',
  showMenu: '↩️ Show Main Menu',
  mainMenu: '↩️ Main Menu',
  fallback:
    "I couldn't quite match that with our standard FAQs. I am the Super Tech auto-assistant, but you can select one of the common topics below, or chat directly with our team on WhatsApp!",
  fallbackWhatsApp: '💬 Chat on WhatsApp',
  fallbackEmail: '✉️ Send an Email',
  quickReplies: enQuickReplies,
  menuKeywords: ['menu', 'help', 'categories', 'start', 'show main menu'],
  intents: [
    {
      replyIndex: 0,
      keywords: ['quote', 'price', 'cost', 'pricing', 'bulk', 'inquire', 'bill of', 'boq', 'buy'],
    },
    {
      replyIndex: 1,
      keywords: ['deliver', 'ship', 'send', 'transport', 'cargo', 'coverage', 'areas', 'workshops'],
    },
    {
      replyIndex: 4,
      keywords: [
        'contact', 'phone', 'email', 'call', 'support', 'number', 'whatsapp',
        'talk', 'reach', 'help', 'agent', 'human',
      ],
    },
    {
      replyIndex: 3,
      keywords: [
        'location', 'map', 'shop', 'address', 'where', 'place', 'office', 'site',
        'hour', 'time', 'open', 'close', 'saturday', 'thursday', 'friday', 'work day',
      ],
    },
    {
      replyIndex: 2,
      keywords: [
        'product', 'category', 'categories', 'sell', 'supply', 'catalog', 'items',
        'copper', 'pipe', 'tool', 'cement', 'a/c', 'compressor', 'welding',
        'hardware', 'clamp', 'duct', 'plumb', 'electric',
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/* Arabic                                                              */
/* ------------------------------------------------------------------ */

const arQuickReplies: QuickReply[] = [
  {
    id: 'quote',
    label: '📋 اطلب عرض سعر',
    question: 'كيف أطلب عرض سعر للمنتجات؟',
    answer:
      'يمكنك طلب عرض سعر بطريقتين:\n\n1. تصفّح الموقع، وأضف المنتجات إلى سلة عروض الأسعار، ثم أرسل الطلب مباشرةً.\n2. اضغط على الروابط أدناه لإرسال متطلباتك أو جدول الكميات إلى فريقنا عبر واتساب أو البريد الإلكتروني.',
    actions: [
      {
        label: '💬 عرض سعر عبر واتساب',
        href: wa('مرحباً سوبر تك، أود طلب عرض سعر لمواد بكميات كبيرة. متطلبات مشروعنا هي: '),
        external: true,
      },
      {
        label: '✉️ عرض سعر بالبريد',
        href: `https://mail.google.com/mail/?view=cm&fs=1&to=${contactInfo.email}&su=%D8%B7%D9%84%D8%A8%20%D8%B9%D8%B1%D8%B6%20%D8%B3%D8%B9%D8%B1`,
        external: true,
      },
      { label: '🔍 تصفح المنتجات', href: '/products' },
    ],
  },
  {
    id: 'delivery',
    label: '🚚 معلومات التوصيل',
    question: 'هل توصّلون إلى مواقع العمل والورش؟',
    answer:
      'نعم! نوصّل الطلبات الكبيرة وملحقات التكييف والعدد الكهربائية ومواد البناء مباشرةً إلى الورش والمحلات ومواقع المشاريع في جميع أنحاء الكويت.',
    actions: [
      {
        label: '💬 تواصل مع قسم التوصيل',
        href: wa('مرحباً سوبر تك، لدي استفسار حول توصيل المواد إلى موقع العمل في الكويت.'),
        external: true,
      },
    ],
  },
  {
    id: 'categories',
    label: '🛠️ فئات المنتجات',
    question: 'ما أنواع المواد والمعدات التي توردونها؟',
    answer:
      'نوفّر تشكيلة شاملة من المواد:\n\n• **المشابك والدعامات:** مشابك أنابيب، كتائف يونسترت.\n• **مواد التكييف:** أنابيب نحاس، غازات تبريد.\n• **مستلزمات الخردوات:** مثبتات، وصلات، مسامير خرسانة.\n• **العدد اليدوية والكهربائية:** مثاقب، جلاخات، مفاتيح ربط.\n• **مواد البناء:** قنوات مشقوقة، أشرطة.\n• **مستلزمات السباكة:** وصلات UPVC، صمامات، مواد لصق.\n• **المستلزمات الكهربائية:** وصلات مواسير، مقابس صناعية.\n• **ملحقات مجاري الهواء:** مجاري مرنة، مواد إحكام، لواصق.',
    actions: [
      { label: '🗜️ المشابك', href: '/categories/clamps' },
      { label: '❄️ مواد التكييف', href: '/categories/air-conditioning' },
      { label: '🚰 السباكة', href: '/categories/plumbing' },
      { label: '⚡ الكهربائية', href: '/categories/electric' },
    ],
  },
  {
    id: 'location',
    label: '📍 الموقع وساعات العمل',
    question: 'أين يقع معرضكم وما هي ساعات العمل؟',
    answer:
      'مكتبنا الرئيسي وصالة العرض في **منطقة الشويخ الصناعية، مدينة الكويت**.\n\n🕒 **ساعات العمل:**\n• من السبت إلى الخميس: 8:00 صباحاً - 5:00 مساءً\n• الجمعة: مغلق',
    actions: [
      { label: '🗺️ الموقع على خرائط جوجل', href: contactInfo.googleMapsUrl, external: true },
      { label: '📞 اتصل بالمعرض', href: contactInfo.phoneHref, external: true },
    ],
  },
  {
    id: 'contact',
    label: '📞 تواصل مع الدعم',
    question: 'كيف أتواصل مع خدمة العملاء أو المبيعات؟',
    answer: `يمكنك التواصل مع فريق الدعم والمبيعات في سوبر تك مباشرةً:\n\n• **الهاتف:** ${contactInfo.phone}\n• **البريد الإلكتروني:** ${contactInfo.email}\n• **صالة العرض:** منطقة الشويخ الصناعية، الكويت`,
    actions: [
      {
        label: '💬 محادثة واتساب',
        href: wa('مرحباً خدمة عملاء سوبر تك، أحتاج مساعدة بخصوص منتج أو طلب.'),
        external: true,
      },
      { label: '📞 اتصل الآن', href: contactInfo.phoneHref, external: true },
    ],
  },
]

const arContent: ChatbotContent = {
  fabLabel: 'فتح محادثة الدعم',
  headerTitle: 'روبوت دردشة SuperTechIntl',
  headerStatus: 'متصل • ردود آلية',
  closeLabel: 'إغلاق المحادثة',
  inputPlaceholder: 'اكتب سؤالك...',
  sendLabel: 'إرسال الرسالة',
  welcome:
    'أهلاً بك في سوبر تك! يمكنني الإجابة بسرعة على أسئلتك حول عروض الأسعار والتوصيل والمنتجات وموقع المعرض وبيانات التواصل. اختر أحد المواضيع أدناه أو اكتب سؤالك.',
  welcomeWhatsApp: '💬 تواصل عبر واتساب',
  menuPrompt: 'هذه هي المواضيع السريعة التي يمكنك الاختيار منها:',
  showMenu: '↩️ عرض القائمة الرئيسية',
  mainMenu: '↩️ القائمة الرئيسية',
  fallback:
    'لم أتمكن من مطابقة سؤالك مع الأسئلة الشائعة لدينا. أنا المساعد الآلي لسوبر تك — يمكنك اختيار أحد المواضيع أدناه، أو التحدث مباشرةً مع فريقنا عبر واتساب.',
  fallbackWhatsApp: '💬 تواصل عبر واتساب',
  fallbackEmail: '✉️ إرسال بريد إلكتروني',
  quickReplies: arQuickReplies,
  menuKeywords: ['قائمة', 'مساعدة', 'القائمة', 'ابدأ', 'الرئيسية', 'menu', 'help', 'start'],
  intents: [
    {
      replyIndex: 0,
      keywords: [
        'عرض سعر', 'سعر', 'اسعار', 'أسعار', 'تسعير', 'كمية', 'كميات', 'جملة',
        'شراء', 'اشتري', 'تكلفة', 'جدول كميات',
        'quote', 'price', 'cost', 'bulk', 'boq',
      ],
    },
    {
      replyIndex: 1,
      keywords: [
        'توصيل', 'شحن', 'ارسال', 'إرسال', 'نقل', 'تسليم', 'موقع العمل', 'ورشة', 'ورش',
        'deliver', 'ship', 'transport',
      ],
    },
    {
      replyIndex: 4,
      keywords: [
        'تواصل', 'اتصال', 'هاتف', 'جوال', 'رقم', 'بريد', 'ايميل', 'إيميل', 'واتساب',
        'دعم', 'خدمة العملاء', 'موظف',
        'contact', 'phone', 'email', 'call', 'support', 'whatsapp',
      ],
    },
    {
      replyIndex: 3,
      keywords: [
        'موقع', 'خريطة', 'معرض', 'عنوان', 'وين', 'اين', 'أين', 'مكتب', 'الشويخ',
        'ساعات', 'دوام', 'وقت', 'مفتوح', 'مغلق', 'السبت', 'الخميس', 'الجمعة',
        'location', 'map', 'address', 'shop', 'hours',
      ],
    },
    {
      replyIndex: 2,
      keywords: [
        'منتج', 'منتجات', 'فئة', 'فئات', 'كتالوج', 'تشكيلة', 'اصناف', 'أصناف',
        'نحاس', 'انبوب', 'أنبوب', 'ماسورة', 'عدة', 'عدد', 'اسمنت', 'أسمنت',
        'تكييف', 'ضاغط', 'لحام', 'خردوات', 'مشبك', 'دكت', 'مجاري', 'سباكة', 'كهرباء',
        'product', 'category', 'catalog', 'copper', 'pipe', 'tool', 'duct',
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */

const content: Record<Locale, ChatbotContent> = { en: enContent, ar: arContent }

export function getChatbotContent(locale: Locale): ChatbotContent {
  return content[locale] ?? content.en
}

export type AutoResponse = {
  answer: string
  actions?: ChatAction[]
  showQuickReplies?: boolean
}

export function getAutoResponse(userInput: string, c: ChatbotContent): AutoResponse {
  const query = userInput.toLowerCase().trim()

  if (c.menuKeywords.some((k) => query === k.toLowerCase())) {
    return { answer: c.menuPrompt, showQuickReplies: true }
  }

  for (const intent of c.intents) {
    if (intent.keywords.some((k) => query.includes(k.toLowerCase()))) {
      const reply = c.quickReplies[intent.replyIndex]
      return {
        answer: reply.answer,
        actions: [...(reply.actions ?? []), { label: c.mainMenu, href: 'action:menu' }],
        showQuickReplies: false,
      }
    }
  }

  return {
    answer: c.fallback,
    actions: [
      {
        label: c.fallbackWhatsApp,
        href: wa(
          'Hello Super Tech, I need support with product specifications and material orders.',
        ),
        external: true,
      },
      { label: c.fallbackEmail, href: `mailto:${contactInfo.email}`, external: true },
    ],
    showQuickReplies: true,
  }
}
