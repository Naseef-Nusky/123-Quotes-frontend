/** Demo / placeholder data used when the API is offline or empty. */

export const DUMMY_CATEGORIES = [
  {
    id: 'cat-digital',
    name: 'Digital & Creative',
    slug: 'digital-creative',
    description: 'Web, design and creative professionals',
  },
  {
    id: 'cat-home',
    name: 'Home & Property',
    slug: 'home-property',
    description: 'Cleaning, investigations and property services',
  },
  {
    id: 'cat-events',
    name: 'Events & Media',
    slug: 'events-media',
    description: 'Photography and event coverage',
  },
]

export const DUMMY_SERVICES = [
  {
    id: 'svc-web',
    categoryId: 'cat-digital',
    name: 'Web Development',
    slug: 'web-development',
    shortDesc: 'Find the best web developers near you',
    description:
      'Here at 123Quotes, you can find the best web developers. Start your search, receive free quotes right away!',
    tokenCost: 2,
    isActive: true,
    category: DUMMY_CATEGORIES[0],
  },
  {
    id: 'svc-photo',
    categoryId: 'cat-events',
    name: 'Photographers',
    slug: 'photographers',
    shortDesc: 'Quotes from top photographers',
    description:
      '123Quotes provides quotes from top photographers! Please enquire today to receive free quotes straight away!',
    tokenCost: 2,
    isActive: true,
    category: DUMMY_CATEGORIES[2],
  },
  {
    id: 'svc-pi',
    categoryId: 'cat-home',
    name: 'Private Investigators',
    slug: 'private-investigators',
    shortDesc: 'Local private investigators',
    description:
      'A private investigator near you isn’t far from reach. Find local private investigators here at 123Quotes! Enquire to receive free quotes!',
    tokenCost: 3,
    isActive: true,
    category: DUMMY_CATEGORIES[1],
  },
  {
    id: 'svc-clean',
    categoryId: 'cat-home',
    name: 'Cleaning services',
    slug: 'cleaning-services',
    shortDesc: 'Great cleaners near you',
    description:
      'On 123Quotes, you can receive free quotes from great cleaners near you! All you have to do is enquire today to get instant quotes!',
    tokenCost: 1,
    isActive: true,
    category: DUMMY_CATEGORIES[1],
  },
  {
    id: 'svc-boiler',
    categoryId: 'cat-home',
    name: 'Boiler Installation',
    slug: 'boiler-installation',
    shortDesc: 'Gas Safe boiler installers',
    description: 'Get free quotes from Gas Safe registered engineers for boiler installation and replacement.',
    tokenCost: 2,
    isActive: true,
    category: DUMMY_CATEGORIES[1],
  },
  {
    id: 'svc-kitchen',
    categoryId: 'cat-home',
    name: 'Kitchen Fitting',
    slug: 'kitchen-fitting',
    shortDesc: 'Kitchen design and fitting',
    description: 'Compare kitchen fitters for full installs, units and worktops.',
    tokenCost: 3,
    isActive: true,
    category: DUMMY_CATEGORIES[1],
  },
]

const baseQuestions = (serviceId) => [
  {
    id: `${serviceId}-q1`,
    serviceId,
    label: 'When do you need this service?',
    type: 'SINGLE_CHOICE',
    isRequired: true,
    sortOrder: 0,
    options: [
      { id: `${serviceId}-o1`, label: 'As soon as possible', value: 'asap', sortOrder: 0 },
      { id: `${serviceId}-o2`, label: 'Within 2 weeks', value: '2weeks', sortOrder: 1 },
      { id: `${serviceId}-o3`, label: 'Flexible / not sure', value: 'flexible', sortOrder: 2 },
    ],
    branchesFrom: [],
  },
  {
    id: `${serviceId}-q2`,
    serviceId,
    label: 'Approximate budget',
    type: 'DROPDOWN',
    isRequired: true,
    sortOrder: 1,
    options: [
      { id: `${serviceId}-o4`, label: 'Under £500', value: 'under500', sortOrder: 0 },
      { id: `${serviceId}-o5`, label: '£500 – £2,000', value: '500-2000', sortOrder: 1 },
      { id: `${serviceId}-o6`, label: '£2,000 – £5,000', value: '2000-5000', sortOrder: 2 },
      { id: `${serviceId}-o7`, label: '£5,000+', value: '5000plus', sortOrder: 3 },
    ],
    branchesFrom: [],
  },
  {
    id: `${serviceId}-q3`,
    serviceId,
    label: 'Tell us more about what you need',
    type: 'TEXTAREA',
    isRequired: false,
    sortOrder: 2,
    options: [],
    branchesFrom: [],
  },
]

export const DUMMY_QUESTIONS = Object.fromEntries(
  DUMMY_SERVICES.map((s) => [s.id, baseQuestions(s.id)]),
)

export const DUMMY_PACKAGES = [
  {
    id: 'pkg-starter',
    name: 'Starter',
    description: '10 tokens to unlock your first leads',
    tokens: 10,
    priceCents: 2500,
    currency: 'GBP',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'pkg-growth',
    name: 'Growth',
    description: '30 tokens – best for active professionals',
    tokens: 30,
    priceCents: 6500,
    currency: 'GBP',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: 'pkg-pro',
    name: 'Pro',
    description: '75 tokens with the best value per lead',
    tokens: 75,
    priceCents: 14000,
    currency: 'GBP',
    isActive: true,
    sortOrder: 3,
  },
]

export const DUMMY_PROFESSIONALS = [
  {
    id: 'pro-1',
    companyName: 'Pixel Forge Studios',
    contactName: 'Jamie Cole',
    bio: 'Full-stack web developers building modern business websites and apps across London.',
    city: 'London',
    postcode: 'SW1A',
    website: 'https://example.com',
    services: [{ service: { id: 'svc-web', name: 'Web Development', slug: 'web-development' } }],
    serviceAreas: [{ city: 'London', postcode: 'SW1A', radiusMiles: 25 }],
  },
  {
    id: 'pro-2',
    companyName: 'Lens & Light Photography',
    contactName: 'Sam Rivera',
    bio: 'Wedding, event and commercial photography with same-week turnaround options.',
    city: 'Manchester',
    postcode: 'M1',
    website: '',
    services: [{ service: { id: 'svc-photo', name: 'Photographers', slug: 'photographers' } }],
    serviceAreas: [{ city: 'Manchester', postcode: 'M1', radiusMiles: 30 }],
  },
  {
    id: 'pro-3',
    companyName: 'ClearView Investigations',
    contactName: 'Alex Morgan',
    bio: 'Licensed private investigators for personal and corporate enquiries.',
    city: 'Birmingham',
    postcode: 'B1',
    website: '',
    services: [{ service: { id: 'svc-pi', name: 'Private Investigators', slug: 'private-investigators' } }],
    serviceAreas: [{ city: 'Birmingham', postcode: 'B1', radiusMiles: 40 }],
  },
  {
    id: 'pro-4',
    companyName: 'Sparkle Home Cleaners',
    contactName: 'Taylor Brooks',
    bio: 'Domestic and end-of-tenancy cleaning with vetted, insured teams.',
    city: 'London',
    postcode: 'E1',
    website: '',
    services: [{ service: { id: 'svc-clean', name: 'Cleaning services', slug: 'cleaning-services' } }],
    serviceAreas: [{ city: 'London', postcode: 'E1', radiusMiles: 20 }],
  },
  {
    id: 'pro-5',
    companyName: 'Prime Heat Engineers',
    contactName: 'Chris Patel',
    bio: 'Gas Safe registered boiler installation and servicing.',
    city: 'London',
    postcode: 'W8',
    website: '',
    services: [{ service: { id: 'svc-boiler', name: 'Boiler Installation', slug: 'boiler-installation' } }],
    serviceAreas: [{ city: 'London', postcode: 'W8', radiusMiles: 15 }],
  },
]

export const DUMMY_CONTACT = {
  email: 'info@123quotes.co.uk',
  phone: '+44 20 1234 5678',
  address: '1st Floor, 239 Kensington High St, London W8 6SN',
}

export function findDummyService(idOrSlug) {
  return DUMMY_SERVICES.find((s) => s.id === idOrSlug || s.slug === idOrSlug) || null
}

export function filterDummyServices(categorySlug) {
  if (!categorySlug) return DUMMY_SERVICES
  return DUMMY_SERVICES.filter((s) => s.category?.slug === categorySlug)
}

export function filterDummyProfessionals({ service, city } = {}) {
  return DUMMY_PROFESSIONALS.filter((p) => {
    const serviceOk =
      !service || p.services.some((x) => x.service.slug === service || x.service.id === service)
    const cityOk = !city || (p.city || '').toLowerCase().includes(city.toLowerCase())
    return serviceOk && cityOk
  })
}
