export const defaultHomeContent = {
  hero: {
    title: 'The Contemporary Method Of Locating The Professional Service You Need',
    subtitle: '',
    needPlaceholder: 'Tell us what you need?',
    postcodePlaceholder: 'Postcode',
    buttonText: 'SEARCH',
    searchPlaceholder: 'Web Development',
  },
  popularTitle: 'Popular Services',
  popularServices: [
    {
      id: 'ps-1',
      title: 'Web Development',
      description:
        'Here at 123Quotes, you can find the best web developers. Start your search, receive free quotes right away!',
      link: '/web-developer',
      buttonText: 'Find More',
      image:
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 'ps-2',
      title: 'Photographers',
      description:
        '123Quotes provides quotes from top photographers! Please enquire today to receive free quotes straight away!',
      link: '/wedding-photographers',
      buttonText: 'Find More',
      image:
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 'ps-3',
      title: 'Private Investigators',
      description:
        'A private investigator near you isn’t far from reach. Find local private investigators here at 123Quotes! Enquire to receive free quotes!',
      link: '/private-investigators',
      buttonText: 'Find More',
      image:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 'ps-4',
      title: 'Cleaning services',
      description:
        'On 123Quotes, you can receive free quotes from great cleaners near you! All you have to do is enquire today to get instant quotes!',
      link: '/house-cleaning',
      buttonText: 'Find More',
      image:
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
    },
  ],
  hire: {
    title: 'Hire A Professional',
    subtitle: 'Search, Compare, And Book In Minutes.',
    body: 'Hunting for a local or virtual service professional has never been easier. 123Quotes helps you narrow your results with helpful search functions, provides a lengthy list of reviewed and verified providers, and allows you to enquire, receive free quotes, and book a service in a few simple steps!',
    image: '/images/hire-professional.png',
    cta: 'Start your search today.',
    steps: [
      {
        id: 'hs-1',
        title: 'Start Your Service Search',
        description:
          "Working on a landscaping project, building an app, or improving health and wellness? No matter your task or goals, 123Quotes has the professional services you're searching for and the tools to help you find them fast. Let us know your needs, such as budget, schedule, location, and any specific preferences or requirements, so we can find your perfect match.",
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
        title: 'Message And Manage',
        description:
          'Get in contact with customers quick and easy! Offer quotes and discuss all information required! Message customers and manage your customers! Negotiate deals & discuss terms etc.',
        image: '/images/join-message.png',
      },
      {
        id: 'jc-2',
        title: 'Showcase Your Skills',
        description:
          'Make yourself searchable and build a solid online business presence with a profile that shows off your best projects and expertise.',
        image: '/images/join-showcase.png',
      },
      {
        id: 'jc-3',
        title: 'Business Booming',
        description:
          "Whether starting a new side hustle or expanding your existing client list, 123Quotes makes it simple to gain more momentum. With helpful business tools, customer support, speedy notifications, and much more, we're ready to help boost your business.",
        image: '/images/join-booming.png',
      },
    ],
  },
}

export async function fetchHomeContent() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/content/home`)
    if (!res.ok) throw new Error('Failed to load home content')
    const data = await res.json()
    if (data?.content && typeof data.content === 'object') {
      const popularFromApi = data.content.popularServices?.length
        ? data.content.popularServices
        : null
      return {
        ...defaultHomeContent,
        ...data.content,
        hero: { ...defaultHomeContent.hero, ...(data.content.hero || {}) },
        hire: {
          ...defaultHomeContent.hire,
          ...(data.content.hire || {}),
          steps: data.content.hire?.steps?.length
            ? data.content.hire.steps
            : defaultHomeContent.hire.steps,
        },
        join: {
          ...defaultHomeContent.join,
          ...(data.content.join || {}),
          cards: data.content.join?.cards?.length
            ? data.content.join.cards
            : defaultHomeContent.join.cards,
        },
        // Prefer local popular landing pages so Find More always works
        popularServices: defaultHomeContent.popularServices.map((local, i) => {
          const apiItem = popularFromApi?.[i]
          if (!apiItem) return local
          return {
            ...local,
            ...apiItem,
            link: local.link,
            image: local.image,
            title: apiItem.title || local.title,
            description: apiItem.description || local.description,
            buttonText: apiItem.buttonText || local.buttonText,
          }
        }),
      }
    }
  } catch (err) {
    console.warn('[home content]', err.message)
  }
  return defaultHomeContent
}
