import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BadgeCheck, Check, ChevronRight, Search, Star, User } from 'lucide-react'
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
      const rest = title.slice(breakAfter.length).trim() || 'The Professional Service You Need'
      return (
        <>
          <span className="block">{breakAfter}</span>
          <span className="text-gradient-light block">{rest}</span>
        </>
      )
    }

    const words = title.trim().split(/\s+/)
    if (words.length < 4) return title
    const mid = Math.ceil(words.length / 2)
    return (
      <>
        <span className="block">{words.slice(0, mid).join(' ')}</span>
        <span className="text-gradient-light block">{words.slice(mid).join(' ')}</span>
      </>
    )
  }

  const popularSearches = (content.popularServices || []).slice(0, 4)

  return (
    <div>
      <section className="bg-navy-gradient relative isolate overflow-hidden">
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div
          className="pointer-events-none absolute -left-24 top-0 size-96 rounded-full bg-primary/25 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-6xl items-stretch gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:pb-0 lg:pt-0">
          {/* Copy + search */}
          <div className="flex flex-col justify-center lg:col-span-7 lg:py-16">
            <p className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1.5 pl-2 pr-3.5 text-xs font-bold text-white backdrop-blur">
              <span className="bg-brand-gradient rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
                New
              </span>
              <BadgeCheck className="size-4 text-[#8fd0f5]" strokeWidth={2.25} />
              Verified UK professionals · Free quotes
            </p>

            <h1 className="animate-fade-up-delay mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.3rem]">
              {renderHeroTitle(heroTitle)}
            </h1>

            <p className="animate-fade-up-delay-2 mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              {content.hero?.subtitle ||
                'Tell us what you need, answer a few quick questions, and compare free quotes from trusted local professionals — all in minutes.'}
            </p>

            <form
              onSubmit={onSearch}
              className="animate-fade-up-delay-2 mt-7 w-full max-w-xl rounded-3xl bg-white p-2 shadow-[0_24px_55px_-18px_rgba(0,0,0,0.55)]"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                <label className="relative min-w-0 flex-1 rounded-2xl px-3.5 py-2 text-left transition focus-within:bg-canvas">
                  <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted">
                    What do you need?
                  </span>
                  <span className="mt-0.5 flex items-center gap-2">
                    <User className="size-4 shrink-0 text-slate-400" strokeWidth={1.8} />
                    <input
                      list="service-options"
                      value={need}
                      onChange={(e) => setNeed(e.target.value)}
                      placeholder={content.hero?.needPlaceholder || 'Tell us what you need?'}
                      className="w-full min-w-0 bg-transparent py-1 text-sm font-medium text-navy outline-none placeholder:font-normal placeholder:text-slate-400"
                      required
                    />
                  </span>
                </label>

                <div className="hidden w-px bg-line sm:block" aria-hidden />

                <label className="relative w-full rounded-2xl px-3.5 py-2 text-left transition focus-within:bg-canvas sm:max-w-[170px]">
                  <span className="block text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted">
                    Postcode
                  </span>
                  <PostcodeInput
                    value={postcode}
                    onChange={setPostcode}
                    placeholder="Postcode"
                    className="mt-0.5 flex w-full items-center gap-2 bg-transparent py-1 text-sm font-medium text-navy outline-none"
                  />
                </label>

                <button
                  type="submit"
                  className="bg-brand-gradient inline-flex shrink-0 items-center justify-center gap-2 self-center rounded-2xl px-6 py-3.5 text-sm font-extrabold tracking-wide text-white shadow-md shadow-primary-dark/30 transition hover:brightness-110"
                >
                  <Search className="size-4" strokeWidth={2.5} />
                  {(content.hero?.buttonText || 'SEARCH').toUpperCase()}
                </button>
              </div>

              <datalist id="service-options">
                {services.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </form>

            {popularSearches.length ? (
              <div className="animate-fade-up-delay-2 mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white/55">
                  Popular:
                </span>
                {popularSearches.map((item) => (
                  <Link
                    key={item.id}
                    to={item.link || '/services'}
                    className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur transition hover:border-white/45 hover:bg-white/15 hover:text-white"
                  >
                    {item.title}
                    <ChevronRight className="size-3.5" strokeWidth={2.5} />
                  </Link>
                ))}
              </div>
            ) : null}

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-5">
              <p className="flex items-center gap-2.5">
                <span className="flex -space-x-1.5" aria-hidden>
                  {['S', 'D', 'P'].map((initial, i) => (
                    <span
                      key={initial}
                      className={`flex size-7 items-center justify-center rounded-full border-2 border-navy text-[10px] font-extrabold text-white ${
                        i === 0 ? 'bg-primary' : i === 1 ? 'bg-[#0a3a7a]' : 'bg-accent-dark'
                      }`}
                    >
                      {initial}
                    </span>
                  ))}
                </span>
                <span>
                  <span className="flex items-center gap-0.5" aria-label="Rated 4.9 out of 5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="size-3.5 fill-amber-400 text-amber-400" strokeWidth={1.5} />
                    ))}
                  </span>
                  <span className="mt-0.5 block text-xs font-medium text-white/70">
                    Loved by customers UK-wide
                  </span>
                </span>
              </p>
              <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-semibold text-white/80">
                {['Free to use', 'No obligation'].map((chip) => (
                  <li key={chip} className="inline-flex items-center gap-1.5">
                    <Check className="size-3.5 text-[#8fd0f5]" strokeWidth={3} />
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Image side */}
          <div className="relative hidden lg:col-span-5 lg:block">
            <img
              src="/images/hero-city.png"
              alt="City professionals ready to quote for your job"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#0a2f5c] via-[#0a2f5c]/25 to-transparent"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#071c3a]/70 via-transparent to-[#071c3a]/20"
              aria-hidden
            />

            <div className="animate-float-slow absolute right-6 top-10 w-56 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur">
              <div className="flex items-center gap-1" aria-label="Rated 4.9 out of 5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="size-4 fill-amber-400 text-amber-400" strokeWidth={1.5} />
                ))}
                <span className="ml-1 text-xs font-extrabold text-navy">4.9/5</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate">
                “Three quotes within the hour — booked the same week.”
              </p>
              <p className="mt-2 text-[11px] font-bold text-navy">Sarah M. · Manchester</p>
            </div>

            <div className="animate-float-slow absolute bottom-10 left-2 w-60 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur [animation-delay:1.4s]">
              <p className="flex items-center justify-between text-xs font-extrabold text-navy">
                Quotes received
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                  FREE
                </span>
              </p>
              <div className="mt-3 space-y-2">
                {[
                  ['Local Pro A', '£240'],
                  ['Local Pro B', '£265'],
                ].map(([name, price]) => (
                  <p
                    key={name}
                    className="flex items-center justify-between rounded-xl bg-canvas px-3 py-2 text-xs font-semibold text-slate"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <BadgeCheck className="size-3.5 text-primary" strokeWidth={2.25} />
                      {name}
                    </span>
                    <span className="font-extrabold text-navy">{price}</span>
                  </p>
                ))}
              </div>
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
