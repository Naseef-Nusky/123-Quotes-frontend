import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const popularServices = [
  {
    title: 'Web Development',
    slug: 'web-development',
    copy: 'Here at 123Quotes, you can find the best web developers. Start your search, receive free quotes right away!',
    icon: (
      <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6h16v12H4z" />
        <path d="M8 10l-2 2 2 2M16 10l2 2-2 2M13 9l-2 6" />
      </svg>
    ),
  },
  {
    title: 'Photographers',
    slug: 'photographers',
    copy: '123Quotes provides quotes from top photographers! Please enquire today to receive free quotes straight away!',
    icon: (
      <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 8h4l2-2h4l2 2h4v11H4z" />
        <circle cx="12" cy="13" r="3.5" />
      </svg>
    ),
  },
  {
    title: 'Private Investigators',
    slug: 'private-investigators',
    copy: 'A private investigator near you isn’t far from reach. Find local private investigators here at 123Quotes! Enquire to receive free quotes!',
    icon: (
      <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="10" cy="10" r="5" />
        <path d="M14 14l6 6M8.5 10h3M10 8.5v3" />
      </svg>
    ),
  },
  {
    title: 'Cleaning services',
    slug: 'cleaning-services',
    copy: 'On 123Quotes, you can receive free quotes from great cleaners near you! All you have to do is enquire today to get instant quotes!',
    icon: (
      <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 21V10l-3 1V8l7-3 7 3v3l-3-1v11" />
        <path d="M8 14h8" />
      </svg>
    ),
  },
]

const hireSteps = [
  {
    title: 'Start Your Service Search',
    copy: "Working on a landscaping project, building an app, or improving health and wellness? No matter your task or goals, 123Quotes has the professional services you're searching for and the tools to help you find them fast. Let us know your needs, such as budget, schedule, location, and any specific preferences or requirements, so we can find your perfect match.",
  },
  {
    title: 'Compare Service Offerings',
    copy: 'Search and find a list of Service Offerings that meet your needs. Compare and contrast reviews, prices, availability, and more in minutes. Highly rated professionals are waiting and ready to help.',
  },
  {
    title: 'Book a Service',
    copy: 'Make arrangements in an instant for your next project or service. 123Quotes makes it safe and secure to contact, hire, and book a professional.',
  },
]

const joinCards = [
  {
    title: 'Message and Manage',
    copy: 'Get in contact with customers quick and easy! Offer quotes and discuss all information required! Message customers and manage your customers! Negotiate deals & discuss terms etc.',
  },
  {
    title: 'Showcase Your Skills',
    copy: 'Make yourself searchable and build a solid online business presence with a profile that shows off your best projects and expertise.',
  },
  {
    title: 'Business Booming',
    copy: "Whether starting a new side hustle or expanding your existing client list, 123Quotes makes it simple to gain more momentum. With helpful business tools, customer support, speedy notifications, and much more, we're ready to help boost your business.",
  },
]

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, isCustomer } = useAuth()
  const [need, setNeed] = useState('')
  const [postcode, setPostcode] = useState('')

  function onSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (need.trim()) params.set('q', need.trim())
    if (postcode.trim()) params.set('postcode', postcode.trim())

    if (isAuthenticated && isCustomer) {
      navigate(`/app/requests/new${params.toString() ? `?${params}` : ''}`)
      return
    }
    navigate(`/services${params.toString() ? `?${params}` : ''}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-navy">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(37,99,235,0.45), transparent), linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            The contemporary method of locating the professional service you need
          </h1>

          <form
            onSubmit={onSearch}
            className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-xl bg-navy/70 p-3 shadow-xl ring-1 ring-white/15 backdrop-blur sm:flex-row sm:items-stretch"
          >
            <label className="flex flex-1 items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-left">
              <span className="text-primary" aria-hidden>
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5" />
                </svg>
              </span>
              <input
                value={need}
                onChange={(e) => setNeed(e.target.value)}
                placeholder="Tell us what you need?"
                className="w-full border-0 bg-transparent text-sm text-navy outline-none placeholder:text-muted"
              />
            </label>
            <label className="flex flex-1 items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-left sm:max-w-[220px]">
              <span className="text-primary" aria-hidden>
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <input
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="Postcode"
                className="w-full border-0 bg-transparent text-sm text-navy outline-none placeholder:text-muted"
              />
            </label>
            <button type="submit" className="btn-primary !rounded-lg uppercase tracking-wide">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Popular Services */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold text-navy">Popular Services</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {popularServices.map((service) => (
              <article
                key={service.slug}
                className="flex gap-4 rounded-xl border border-line bg-canvas p-5 transition hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {service.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold text-navy">{service.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate">{service.copy}</p>
                  <Link
                    to={`/services/${service.slug}`}
                    className="mt-3 inline-flex text-sm font-bold text-primary hover:text-primary-dark"
                  >
                    Find More
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Hire a Professional */}
      <section className="border-y border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-navy">Hire a Professional</h2>
            <p className="mt-2 font-display text-xl font-semibold text-primary">
              Search, compare, and book in minutes.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate sm:text-base">
              Hunting for a local or virtual service professional has never been easier. 123Quotes helps you narrow
              your results with helpful search functions, provides a lengthy list of reviewed and verified providers,
              and allows you to enquire, receive free quotes, and book a service in a few simple steps!
            </p>
          </div>

          <div className="mt-12 grid items-start gap-10 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
              <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-primary/15 via-white to-navy/10 p-8">
                <div className="w-full max-w-sm rounded-xl border border-line bg-white p-6 text-center shadow-md">
                  <p className="font-display text-2xl font-extrabold tracking-tight text-navy">123 QUOTES</p>
                  <p className="mt-2 text-sm text-muted">Find professionals. Compare quotes. Book with confidence.</p>
                  <Link to="/services" className="btn-primary mt-5 !text-sm">
                    Start your search today
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {hireSteps.map((step) => (
                <div key={step.title} className="flex gap-3">
                  <span className="mt-1 text-2xl font-bold leading-none text-primary" aria-hidden>
                    “
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate">{step.copy}</p>
                  </div>
                </div>
              ))}
              <p className="italic text-slate">
                <Link to="/services" className="font-semibold text-primary hover:text-primary-dark">
                  Start your search today.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join 123Quotes */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-navy">Join 123Quotes</h2>
            <p className="mt-2 font-display text-xl font-semibold text-primary">
              Do you want to get hired? Say hello to 123Quotes!
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate sm:text-base">
              Join thousands of professional Service providers that are growing there business and sharing their
              expertise with the world!
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {joinCards.map((card) => (
              <article key={card.title} className="rounded-xl border border-line bg-canvas p-6">
                <div className="mb-4 flex h-28 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 19V5h16v14H4z" />
                    <path d="M8 9h8M8 13h5" />
                  </svg>
                </div>
                <h3 className="font-display text-lg font-bold text-navy">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{card.copy}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/register?role=professional" className="btn-primary">
              Business Signup
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
