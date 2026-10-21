import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, User } from 'lucide-react'
import { api } from '../api/client'
import { defaultHomeContent, fetchHomeContent } from '../data/homeContent'
import PostcodeInput from '../components/PostcodeInput'

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

  const defaultHeroTitle = 'The Contemporary Method Of Locating The Professional Service You Need'
  const heroTitle = content.hero?.title || defaultHeroTitle

  function renderHeroTitle(title) {
    const breakAfter = 'The Contemporary Method Of Locating'
    if (title === defaultHeroTitle || title.startsWith(breakAfter)) {
      return (
        <>
          {/* Mobile / tablet: 4 lines */}
          <span className="block lg:hidden">
            <span className="block whitespace-nowrap">The Contemporary</span>
            <span className="block whitespace-nowrap">Method Of Locating</span>
            <span className="block whitespace-nowrap">The Professional</span>
            <span className="text-gradient-light block whitespace-nowrap">Service You Need</span>
          </span>
          {/* Desktop: 3 lines */}
          <span className="hidden lg:block">
            <span className="block whitespace-nowrap">The Contemporary Method</span>
            <span className="block whitespace-nowrap">Of Locating The Professional</span>
            <span className="text-gradient-light block whitespace-nowrap">Service You Need</span>
          </span>
        </>
      )
    }

    // Split any other (CMS) title into three lines balanced by length
    const words = title.trim().split(/\s+/)
    if (words.length < 3) return title
    const target = title.trim().length / 3
    const lines = []
    let current = ''
    for (const word of words) {
      const next = current ? `${current} ${word}` : word
      if (current && next.length > target && lines.length < 2) {
        lines.push(current)
        current = word
      } else {
        current = next
      }
    }
    if (current) lines.push(current)
    return (
      <>
        {lines.map((line, i) => (
          <span
            key={i}
            className={`block lg:whitespace-nowrap ${i === lines.length - 1 ? 'text-gradient-light' : ''}`}
          >
            {line}
          </span>
        ))}
      </>
    )
  }

  return (
    <div>
      <section className="bg-navy-gradient relative isolate overflow-hidden max-lg:flex max-lg:min-h-dvh max-lg:items-center">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <img
            src="/images/hero-city.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071c3a]/70 via-[#0a2f5c]/45 to-[#0a3a7a]/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#071c3a]/10 via-transparent to-[#071c3a]/30" />
          <div className="bg-dot-grid absolute inset-0 opacity-20" />
        </div>

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:py-24">
          <div className="lg:col-span-8">
            <h1 className="animate-fade-up-delay mx-auto max-w-3xl text-center font-display text-[clamp(1.75rem,9vw,2.8rem)] font-bold leading-[1.15] tracking-tight text-white lg:mx-0 lg:text-left lg:text-[2.35rem] xl:text-[3rem]">
              {renderHeroTitle(heroTitle)}
            </h1>

            <form
              onSubmit={onSearch}
              className="animate-fade-up-delay-2 relative z-10 mx-auto mt-10 max-w-xl overflow-hidden rounded-[1.75rem] bg-white/10 shadow-[0_32px_70px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/40 backdrop-blur-md sm:rounded-full lg:mx-0"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
                <label className="relative min-w-0 flex-1 text-left">
                  <span className="sr-only">Tell us what you need</span>
                  <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/60">
                    <User className="size-4" strokeWidth={1.8} />
                  </span>
                  <input
                    list="service-options"
                    value={need}
                    onChange={(e) => setNeed(e.target.value)}
                    placeholder={content.hero?.needPlaceholder || 'Tell us what you need?'}
                    className="w-full rounded-full border-0 bg-transparent py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/60"
                    required
                  />
                </label>

                <span className="mx-1 hidden h-8 w-px shrink-0 bg-white/25 sm:block" aria-hidden />

                <label className="relative w-full text-left sm:max-w-[190px]">
                  <span className="sr-only">Postcode</span>
                  <PostcodeInput
                    value={postcode}
                    onChange={setPostcode}
                    placeholder="Postcode"
                    className="flex w-full items-center gap-2 rounded-full bg-transparent px-4 py-3 text-sm text-white outline-none transition focus-within:ring-2 focus-within:ring-white/40 [&_input::placeholder]:text-white/60 [&_svg]:text-white/70"
                  />
                </label>

                <button
                  type="submit"
                  className="bg-brand-gradient inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-extrabold tracking-wide text-white shadow-md shadow-primary-dark/30 transition hover:brightness-105 sm:px-6"
                >
                  <Search className="size-4" strokeWidth={2.6} />
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

          <div className="relative hidden lg:col-span-4 lg:block" aria-hidden>
            <div className="absolute -inset-0 translate-x-4 translate-y-4 rounded-[1.75rem] border border-white/20" />
            <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_40px_90px_-24px_rgba(0,0,0,0.7)] ring-1 ring-white/30">
              <img
                src="/images/hire-professional.png"
                alt=""
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071c3a]/35 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-navy">{content.popularTitle || 'Popular Services'}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {(content.popularServices || []).map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-line/80 bg-white shadow-[0_8px_28px_rgba(10,47,92,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(10,47,92,0.14)]"
              >
                {item.image ? (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent" />
                  </div>
                ) : null}
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-bold text-navy sm:text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{item.description}</p>
                  <Link
                    to={item.link || '/services'}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition group-hover:gap-2.5"
                  >
                    {item.buttonText || 'Find More'}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-line bg-[#f7fafc]">
        <div
          className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-navy/5 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                How it works
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
                {content.hire.title}
              </h2>
              <p className="mt-4 max-w-xl text-lg font-medium text-navy/80 sm:text-xl">
                {content.hire.subtitle}
              </p>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate sm:text-base">
                {content.hire.body}
              </p>

              <div className="relative mt-10 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_50px_rgba(10,47,92,0.1)]">
                <img
                  src={content.hire.image || '/images/hire-professional.png'}
                  alt="123 Quotes meeting space"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent px-5 pb-5 pt-16">
                  <p className="text-sm font-semibold text-white">
                    Verified professionals. Free quotes. Fast booking.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:pt-6">
              <ol className="space-y-0">
                {(content.hire.steps || []).map((step, index, arr) => (
                  <li key={step.id} className="grid grid-cols-[2.5rem_1fr] gap-4 sm:grid-cols-[2.75rem_1fr] sm:gap-5">
                    <div className="relative flex flex-col items-center">
                      <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white shadow-md sm:size-11">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {index < arr.length - 1 ? (
                        <span className="mt-1 w-0.5 flex-1 min-h-[1.5rem] bg-line" aria-hidden />
                      ) : null}
                    </div>
                    <div
                      className={`rounded-2xl border border-line bg-white p-5 shadow-[0_8px_24px_rgba(10,47,92,0.06)] transition duration-200 hover:border-primary/30 sm:p-6 ${
                        index < arr.length - 1 ? 'mb-6' : ''
                      }`}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                        Step {index + 1}
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-navy sm:text-xl">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-2 flex flex-wrap items-center gap-4 sm:pl-[3.5rem]">
                <Link
                  to="/services"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-6 text-sm font-bold text-white shadow-md shadow-[#0a3a7a]/25 transition hover:brightness-105"
                >
                  {content.hire.cta}
                </Link>
                <Link
                  to="/professionals"
                  className="text-sm font-semibold text-navy/70 transition hover:text-primary"
                >
                  Browse directory →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-line bg-gradient-to-b from-[#eef6fc] via-white to-[#f4f8fc]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,_rgba(30,143,213,0.14),_transparent_65%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">For professionals</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl">{content.join.title}</h2>
            <p className="mt-3 text-lg font-semibold text-navy/90 sm:text-xl">{content.join.subtitle}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate sm:text-base">{content.join.body}</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(content.join.cards || []).map((card) => (
              <article
                key={card.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/80 bg-white shadow-[0_8px_28px_rgba(10,47,92,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(10,47,92,0.14)]"
              >
                {card.image ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="text-lg font-bold text-navy">{card.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate">{card.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/business/signup"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-8 py-3.5 text-sm font-extrabold tracking-wide text-white shadow-md shadow-[#0a3a7a]/28 transition hover:brightness-105"
            >
              {content.join.buttonText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
