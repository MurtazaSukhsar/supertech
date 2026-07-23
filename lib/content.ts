import { categories, contactInfo } from '@/lib/products'

export type Faq = {
  question: string
  answer: string
}

export type BlogPost = {
  slug: string
  title: string
  description: string
  category: string
  publishedAt: string
  readTime: string
  image: string
  body: string[]
}

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://supertechkuwait.com'

export const faqs: Faq[] = [
  {
    question: 'Do you supply air-conditioning materials in bulk across Kuwait?',
    answer:
      'Yes. Super Tech supplies copper pipes, insulation, refrigerants, condensers, HVAC accessories, and related materials for contractors, maintenance teams, and business buyers across Kuwait.',
  },
  {
    question: 'Can I request a quote for multiple products at once?',
    answer:
      'Yes. Send your product list, required quantities, delivery location, and preferred timeline through the contact page or WhatsApp. Our team will respond with pricing and availability.',
  },
  {
    question: 'Do you deliver to job sites and workshops?',
    answer:
      'Yes. We arrange delivery across Kuwait for project sites, workshops, stores, and facilities, including bulk orders and mixed product requirements.',
  },
  {
    question: 'Which product categories do you supply?',
    answer: `We supply ${categories.map((category) => category.name.toLowerCase()).join(', ')} for commercial, industrial, and construction projects.`,
  },
  {
    question: 'Do you help contractors choose the right materials?',
    answer:
      'Yes. Our team can help match product sizes, specifications, and quantities to the needs of HVAC, construction, maintenance, and industrial work.',
  },
  {
    question: 'How fast can I get a response?',
    answer:
      'Most quote requests are reviewed quickly during working hours. For urgent orders, WhatsApp or phone is usually the fastest way to reach the team.',
  },
]

export const blogPosts: BlogPost[] = [
  {
    slug: 'hvac-materials-kuwait-contractor-checklist',
    title: 'HVAC Materials Checklist for Contractors in Kuwait',
    description:
      'A practical checklist of copper pipes, insulation, refrigerants, condensers, and accessories for air-conditioning installation and maintenance projects.',
    category: 'Air-Conditioning Materials',
    publishedAt: '2026-07-18',
    readTime: '4 min read',
    image: '/images/products/ac-condenser.png',
    body: [
      'Successful HVAC work starts with the right material plan. In Kuwait, contractors often need to prepare for high ambient temperatures, tight delivery windows, and site conditions that can change quickly.',
      'Core materials usually include soft copper pipe coils, rubber foam insulation tubes, refrigerant gas, mounting hardware, drain accessories, outdoor condenser units, and consumables for testing and commissioning.',
      'For bulk buying, list every pipe diameter, insulation wall thickness, refrigerant type, and quantity before requesting a quote. This helps reduce delays and makes it easier to compare availability across the full project package.',
      `Super Tech supports contractors with air-conditioning materials, hardware, tools, and delivery coordination from ${contactInfo.address}.`,
    ],
  },
  {
    slug: 'how-to-buy-construction-materials-in-bulk',
    title: 'How to Buy Construction Materials in Bulk Without Project Delays',
    description:
      'Learn how to plan quantities, confirm specs, and coordinate delivery for cement, steel, hardware, and site consumables.',
    category: 'Construction Materials',
    publishedAt: '2026-07-18',
    readTime: '5 min read',
    image: '/images/products/cement-bags.png',
    body: [
      'Bulk material orders work best when the supplier receives clear specifications. Product type, grade, size, packaging, certification requirements, and delivery location all affect pricing and lead time.',
      'For construction materials such as cement and steel rebar, confirm standards and project approvals before placing the order. For hardware and fixing items, check both size and finish so the materials match the installation environment.',
      'A good purchasing workflow separates immediate site needs from planned phase deliveries. This keeps storage manageable while still protecting the project from last-minute shortages.',
      'Super Tech helps Kuwait contractors source construction materials, hardware supplies, tools, and industrial equipment from one supply partner.',
    ],
  },
  {
    slug: 'choosing-power-tools-for-kuwait-jobsites',
    title: 'Choosing Power Tools for Daily Jobsite Use',
    description:
      'What contractors should consider when selecting drills, grinders, wrench sets, compressors, and welding equipment for demanding work.',
    category: 'Tools & Industrial Equipment',
    publishedAt: '2026-07-18',
    readTime: '4 min read',
    image: '/images/products/cordless-drill.png',
    body: [
      'Tools used every day need more than a good price. Contractors should look at motor type, duty cycle, serviceability, accessory availability, and whether the tool can handle repeated site conditions.',
      'For cordless drills, battery capacity and torque matter. For grinders, check disc size, wattage, guard adjustment, and safety features. For welders and compressors, match output capacity to the actual workload.',
      'Buying tools with compatible accessories and consumables simplifies maintenance and lowers downtime. It also helps teams standardize equipment across multiple projects.',
      'Super Tech supplies hand tools, power tools, compressors, welding machines, and related jobsite equipment for professional buyers in Kuwait.',
    ],
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}
