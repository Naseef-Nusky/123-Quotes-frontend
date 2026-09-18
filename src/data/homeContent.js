export const defaultHomeContent = {
  hero: {
    title: 'Find The Best Opportunities For Your Business.',
    subtitle: 'View Local Opportunities To You !',
    searchPlaceholder: 'Web Development',
    buttonText: 'Get started',
  },
  popularTitle: 'Popular Services',
  popularServices: [
    {
      id: 'ps-1',
      title: 'Web Development',
      description:
        'Here at 123Quotes, you can find the best web developers. Start your search, receive free quotes right away!',
      link: '/services/web-development',
      buttonText: 'Find More',
    },
    {
      id: 'ps-2',
      title: 'Photographers',
      description:
        '123Quotes provides quotes from top photographers! Please enquire today to receive free quotes straight away!',
      link: '/services/photographers',
      buttonText: 'Find More',
    },
    {
      id: 'ps-3',
      title: 'Private Investigators',
      description:
        'A private investigator near you isn’t far from reach. Find local private investigators here at 123Quotes! Enquire to receive free quotes!',
      link: '/services/private-investigators',
      buttonText: 'Find More',
    },
    {
      id: 'ps-4',
      title: 'Cleaning services',
      description:
        'On 123Quotes, you can receive free quotes from great cleaners near you! All you have to do is enquire today to get instant quotes!',
      link: '/services/cleaning-services',
      buttonText: 'Find More',
    },
  ],
  hire: {
    title: 'Hire a Professional',
    subtitle: 'Search, compare, and book in minutes.',
    body: 'Hunting for a local or virtual service professional has never been easier. 123Quotes helps you narrow your results with helpful search functions, provides a lengthy list of reviewed and verified providers, and allows you to enquire, receive free quotes, and book a service in a few simple steps!',
    cta: 'Start your search today.',
    steps: [
      {
        id: 'hs-1',
        title: 'Start Your Service Search',
        description:
          "Working on a landscaping project, building an app, or improving health and wellness? No matter your task or goals, 123Quotes has the professional services you're searching for and the tools to help you find them fast.",
      },
      {
        id: 'hs-2',
        title: 'Compare Service Offerings',
        description:
          'Search and find a list of Service Offerings that meet your needs. Compare and contrast reviews, prices, availability, and more in minutes. Highly rated professionals are waiting and ready to help.',
      },
      {
        id: 'hs-3',
        title: 'Book a Service',
        description:
          'Make arrangements in an instant for your next project or service. 123Quotes makes it safe and secure to contact, hire, and book a professional.',
      },
    ],
  },
  join: {
    title: 'Join 123Quotes',
    subtitle: 'Do you want to get hired? Say hello to 123Quotes!',
    body: 'Join thousands of professional Service providers that are growing there business and sharing their expertise with the world!',
    buttonText: 'Business Signup',
    cards: [
      {
        id: 'jc-1',
        title: 'Message and Manage',
        description:
          'Get in contact with customers quick and easy! Offer quotes and discuss all information required! Message customers and manage your customers! Negotiate deals & discuss terms etc.',
      },
      {
        id: 'jc-2',
        title: 'Showcase Your Skills',
        description:
          'Make yourself searchable and build a solid online business presence with a profile that shows off your best projects and expertise.',
      },
      {
        id: 'jc-3',
        title: 'Business Booming',
        description:
          "Whether starting a new side hustle or expanding your existing client list, 123Quotes makes it simple to gain more momentum. With helpful business tools, customer support, speedy notifications, and much more, we're ready to help boost your business.",
      },
    ],
  },
}

export async function fetchHomeContent() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/content/home`)
    if (!res.ok) return defaultHomeContent
    const data = await res.json()
    if (data?.content && typeof data.content === 'object') {
      return {
        ...defaultHomeContent,
        ...data.content,
        hero: { ...defaultHomeContent.hero, ...(data.content.hero || {}) },
        hire: { ...defaultHomeContent.hire, ...(data.content.hire || {}) },
        join: { ...defaultHomeContent.join, ...(data.content.join || {}) },
        popularServices: data.content.popularServices?.length
          ? data.content.popularServices
          : defaultHomeContent.popularServices,
      }
    }
  } catch {
    // use defaults
  }
  return defaultHomeContent
}
