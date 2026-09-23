import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, User, Zap } from 'lucide-react'
import { api } from '../api/client'
import { defaultHomeContent, fetchHomeContent } from '../data/homeContent'

export default function Home() {
  const navigate = useNavigate()
  const [content, setContent] = useState(defaultHomeContent)
  const [need, setNeed] = useState('')
  const [postcode, setPostcode] = useState('')
  const [services, setServices] = useState([])

  useEffect(() => {
    fetchHomeContent().then((data) => {
      setContent(data)
    })
    api.getServices().then((d) => setServices(d.services || [])).catch(() => setServices([]))
  }, [])

  function onSearch(e) {
    e.preventDefault()
    const q = new URLSearchParams()
    const matched = services.find(
      (s) =>
        s.name.toLowerCase() === need.trim().toLowerCase() ||
        s.slug.toLowerCase() === need.trim().toLowerCase() ||
        s.name.toLowerCase().includes(need.trim().toLowerCase()),
    )
    if (matched) q.set('service', matched.slug)
    else if (need.trim()) q.set('q', need.trim())
    if (postcode.trim()) q.set('postcode', postcode.trim())
    navigate(`/professionals${q.toString() ? `?${q}` : ''}`)
  }

  const heroTitle =
    content.hero?.title || 'The Contemporary Method Of Locating The Professional Service You Need'

  return (
    <div>
      <section className="relative isolate flex min-h-[78vh] items-center justify-center overflow-hidden px-4 py-20 sm:min-h-[85vh] sm:px-6 lg:py-28">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-city.png')" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-black/55" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.75) 0, rgba(0,0,0,0.75) 10px, transparent 10px),
              linear-gradient(to bottom, rgba(0,0,0,0.75) 0, rgba(0,0,0,0.75) 10px, transparent 10px)
            `,
            backgroundSize: 'calc(100% / 3) calc(100% / 2)',
            backgroundPosition: '0 0',
            opacity: 0.35,
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-5xl text-center animate-fade-up">
          <h1 className="mx-auto max-w-4xl text-[1.65rem] font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-[2.65rem] md:leading-[1.2]">
            {heroTitle}
          </h1>

          <form
            onSubmit={onSearch}
            className="mx-auto mt-10 w-full max-w-4xl animate-fade-up-delay bg-black/45 px-4 py-5 backdrop-blur-[2px] sm:mt-14 sm:px-6 sm:py-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-5">
              <label className="relative min-w-0 flex-1 text-left">
                <span className="sr-only">Tell us what you need</span>
                <input
                  list="service-options"
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  placeholder={content.hero?.needPlaceholder || 'Tell us what you need?'}
                  className="w-full border-0 border-b border-white/70 bg-transparent py-2.5 pr-10 text-sm text-white outline-none placeholder:text-white/70 focus:border-white"
                  required
                />
                <User
                  className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-white/90"
                  strokeWidth={1.8}
                />
              </label>

              <label className="relative w-full text-left lg:max-w-[220px]">
                <span className="sr-only">Postcode</span>
                <input
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder={content.hero?.postcodePlaceholder || 'Postcode'}
                  className="w-full border-0 border-b border-white/70 bg-transparent py-2.5 pr-10 text-sm text-white outline-none placeholder:text-white/70 focus:border-white"
                />
                <MapPin
                  className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-white/90"
                  strokeWidth={1.8}
                />
              </label>

              <button
                type="submit"
                className="shrink-0 bg-[#2fd3d0] px-8 py-3 text-sm font-extrabold tracking-wide text-black transition hover:brightness-95 sm:px-10"
              >
                {(content.hero?.buttonText || 'SEARCH').toUpperCase()}
              </button>
            </div>

            <datalist id="service-options">
              {services.map((s) => (
                <option key={s.id} value={s.name} />
              ))}
            </datalist>
          </form>
        </div>
      </section>

      <section className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-navy">{content.popularTitle || 'Popular Services'}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {(content.popularServices || []).map((item) => (
              <article key={item.id} className="rounded-xl border border-line bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{item.description}</p>
                <Link to={item.link || '/services'} className="mt-3 inline-flex text-sm font-bold text-primary">
                  {item.buttonText || 'Find More'}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              {content.hire.title}
            </h2>
            <p className="mt-3 text-lg font-semibold text-navy sm:text-xl">{content.hire.subtitle}</p>
            <p className="mt-5 text-sm leading-relaxed text-slate sm:text-base">{content.hire.body}</p>
          </div>

          <div className="mt-12 grid items-start gap-10 lg:mt-14 lg:grid-cols-2 lg:gap-12">
            <div className="overflow-hidden rounded-sm">
              <img
                src={content.hire.image || '/images/hire-professional.png'}
                alt="123 Quotes meeting space"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-8">
              {(content.hire.steps || []).map((step) => (
                <div key={step.id} className="flex gap-3 sm:gap-4">
                  <Zap className="mt-1 size-5 shrink-0 text-[#3b82f6]" fill="currentColor" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-base font-bold text-navy sm:text-lg">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate">{step.description}</p>
                  </div>
                </div>
              ))}
              <p className="pl-8 italic text-slate sm:pl-9">
                <Link to="/services" className="font-medium text-slate hover:text-primary">
                  {content.hire.cta}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-[#f7f7f7]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">{content.join.title}</h2>
            <p className="mt-3 text-lg font-semibold text-navy sm:text-xl">{content.join.subtitle}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate sm:text-base">{content.join.body}</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
            {(content.join.cards || []).map((card) => (
              <article key={card.id} className="text-left">
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="mb-5 aspect-[16/10] w-full object-cover"
                  />
                ) : null}
                <h3 className="text-lg font-bold text-navy">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate">{card.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/business/signup" className="btn-primary !rounded-md">
              {content.join.buttonText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
