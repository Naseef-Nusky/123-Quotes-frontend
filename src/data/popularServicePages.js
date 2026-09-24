/**
 * Landing page content for popular services (matches 123quotes.co.uk layouts).
 * requestSlug = service slug used by /request?service=
 */

export const POPULAR_SERVICE_PAGES = {
  'wedding-photographers': {
    slug: 'wedding-photographers',
    requestSlug: 'photographers',
    heroTitle: 'Find Wedding Photographers Near You.',
    heroImage:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
    intro: {
      title: 'Do You Need Assistance Locating A Qualified Photographer In Your Neighborhood Or Elsewhere?',
      brand: '(123Quotes)',
      paragraphs: [
        '123Quotes is the place to go for free quotes from wedding photographers near you. Whether you need a photographer for a wedding, engagement shoot, or other special event, we connect you with trusted local professionals.',
        'Compare portfolios, reviews and prices in minutes — then choose the photographer that fits your day and budget.',
      ],
      image:
        'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80',
    },
    howItWorksNote: 'Begin your search for an event and entertainment professional today.',
    advantages: {
      title: 'Advantages Of Hiring A Professional Wedding Photographer',
      intro:
        'A professional wedding photographer captures the moments that matter with experience, the right equipment, and an eye for storytelling.',
      items: [
        {
          title: 'Professional Experience',
          image:
            'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=800&q=80',
          text: 'Experienced wedding photographers know how to handle lighting, timing and guest flow so every key moment is covered without stress.',
        },
        {
          title: 'Quality Of Photos',
          image:
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
          text: 'From ceremony to reception, expect sharp, well-composed images you will treasure for years — not rushed phone snapshots.',
        },
      ],
    },
  },

  'house-cleaning': {
    slug: 'house-cleaning',
    requestSlug: 'cleaning-services',
    heroTitle: 'Find House Cleaners Near You.',
    heroImage:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
    intro: {
      title: 'Do You Require Assistance In Locating A Residential Or Commercial Cleaner?',
      brand: '',
      paragraphs: [
        'On 123Quotes you can receive free quotes from great cleaners near you. Domestic, commercial or end-of-tenancy — enquire today and get instant quotes from vetted local teams.',
      ],
      image: null,
    },
    howItWorksNote: 'Begin your search for a cleaning professional today.',
    advantages: {
      title: 'Why Hire A Professional Cleaner?',
      intro: 'Specialist cleaners save you time and deliver a deeper, longer-lasting result.',
      layout: 'bullets-image',
      bullets: [
        'Save time for the things that matter most',
        'Improve the look and feel of your home or workplace',
        'Expert results with the right products and methods',
        'A fresher, allergen-conscious atmosphere',
        'Thorough sanitisation where you need it most',
      ],
      image:
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
      cards: [
        {
          title: 'A Wide Range Of Services',
          image:
            'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80',
          text: 'From regular domestic cleans to deep cleans and specialist treatments, match with cleaners who cover what you need.',
        },
        {
          title: 'Appropriate Equipment',
          image:
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
          text: 'Professionals bring commercial-grade tools and products for carpets, kitchens, bathrooms and more.',
        },
      ],
    },
  },

  'private-investigators': {
    slug: 'private-investigators',
    requestSlug: 'private-investigators',
    heroTitle: 'Find Private Investigators Near You.',
    heroImage:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
    intro: {
      title: 'Do You Need Assistance Locating A Local Private Investigator?',
      brand: '',
      paragraphs: [
        'A private investigator near you isn’t far from reach. Find local private investigators here at 123Quotes and enquire to receive free quotes.',
        'Whether you need surveillance, background checks or help locating someone, we connect you with licensed professionals who can advise on next steps.',
      ],
      image:
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    },
    howItWorksNote: 'Begin your search for an investigation professional today.',
    advantages: {
      title: 'What Are The Services Offered By Private Investigators!',
      intro:
        'Private investigators offer a range of discreet services. Compare quotes and choose the specialist that fits your case.',
      layout: 'service-grid',
      items: [
        {
          title: 'Surveillance',
          image:
            'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=700&q=80',
          text: 'Discreet observation and documentation when you need clear, factual reporting.',
        },
        {
          title: 'Finding An Individual',
          image:
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=700&q=80',
          text: 'Support locating people when standard searches are not enough.',
        },
        {
          title: 'Online Investigation',
          image:
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=700&q=80',
          text: 'Digital research and online footprint checks carried out carefully and lawfully.',
        },
        {
          title: 'Background Checks',
          image:
            'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=700&q=80',
          text: 'Verify information for personal or business decisions with professional diligence.',
        },
        {
          title: 'Corporate Investigations',
          image:
            'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=700&q=80',
          text: 'Workplace and commercial investigations handled with confidentiality.',
        },
        {
          title: 'Evidence Compilation',
          image:
            'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=700&q=80',
          text: 'Organised reporting so findings are clear and usable when you need them.',
        },
      ],
    },
  },

  'web-developer': {
    slug: 'web-developer',
    requestSlug: 'web-development',
    heroTitle: 'Find Web Developers Near You.',
    heroImage:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80',
    intro: {
      title: 'Choose The Ideal Web Developer For Your Venture Or Company (123Quotes)',
      brand: '',
      paragraphs: [
        'Here at 123Quotes, you can find the best web developers. Start your search and receive free quotes right away.',
        'Whether you need a new site, an app, or improvements to an existing product, compare local and remote developers who match your brief and budget.',
        'A strong web presence starts with the right partner — enquire today and let professionals come to you.',
      ],
      image: null,
    },
    howItWorksNote: 'Begin your search for a digital professional today.',
    advantages: {
      title: 'Few Reasons How A Web Development Professional Can Help Your Business',
      intro: 'The right developer builds sites that look great, rank well and work for your users.',
      layout: 'service-grid',
      items: [
        {
          title: 'Appealing Design',
          image:
            'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=700&q=80',
          text: 'Clean, on-brand interfaces that make a strong first impression.',
        },
        {
          title: 'SEO In Mind',
          image:
            'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=700&q=80',
          text: 'Structure and performance that support discoverability in search.',
        },
        {
          title: 'Functionality',
          image:
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=700&q=80',
          text: 'Features that work reliably — forms, bookings, payments and more.',
        },
        {
          title: 'User Experience (UX)',
          image:
            'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=700&q=80',
          text: 'Journeys designed so visitors find what they need quickly.',
        },
        {
          title: 'Saves Time',
          image:
            'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=700&q=80',
          text: 'Hand the build to a specialist so you can focus on your business.',
        },
        {
          title: 'Responsive',
          image:
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80',
          text: 'Sites that look and work well on phones, tablets and desktops.',
        },
      ],
    },
  },
}

export const HOW_IT_WORKS_STEPS = [
  {
    title: 'Tell Us Your Requirement',
    text: 'Answer a short set of questions about what you need so we can match the right professionals.',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Compare Your Quotes',
    text: 'Receive free quotes from local companies and compare prices, reviews and availability.',
    image:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Choose The Best Quote For You',
    text: 'Ask professionals questions, then choose the quote that fits your needs and budget.',
    image:
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80',
  },
]

export function getPopularServicePage(slug) {
  return POPULAR_SERVICE_PAGES[slug] || null
}
