import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
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
          <span className="block whitespace-nowrap">{breakAfter}</span>
          <span className="block">{rest}</span>
        </>
      )
    }

    const words = title.trim().split(/\s+/)
    if (words.length < 4) return title
    const mid = Math.ceil(words.length / 2)
    return (
      <>
        <span className="block">{words.slice(0, mid).join(' ')}</span>
        <span className="block">{words.slice(mid).join(' ')}</span>
      </>
    )
  }

  return (
    <div>
      <section className="relative isolate flex min-h-[52vh] items-center justify-center px-4 py-14 sm:min-h-[58vh] sm:px-6 lg:py-16">
        <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden" aria-hidden>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/hero-city.png')" }}
          />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/15" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.2) 0, rgba(0,0,0,0.2) 10px, transparent 10px),
                linear-gradient(to bottom, rgba(0,0,0,0.2) 0, rgba(0,0,0,0.2) 10px, transparent 10px)
              `,
              backgroundSize: 'calc(100% / 3) calc(100% / 2)',
              backgroundPosition: '0 0',
              opacity: 0.1,
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl text-center animate-fade-up">
          <h1 className="mx-auto max-w-4xl text-[2.1rem] font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-[3.35rem] md:leading-[1.12]">
            {renderHeroTitle(heroTitle)}
          </h1>

          <form
            onSubmit={onSearch}
            className="mx-auto mt-8 w-full max-w-3xl animate-fade-up-delay rounded-[2rem] border border-white/15 bg-white/12 p-2.5 shadow-[0_16px_48px_rgba(0,0,0,0.28)] backdrop-blur-md sm:mt-10 sm:rounded-full sm:p-3"
          >
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-2.5">
              <label className="relative min-w-0 flex-1 text-left">
                <span className="sr-only">Tell us what you need</span>
                <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400">
                  <User className="size-4" strokeWidth={1.8} />
                </span>
                <input
                  list="service-options"
                  value={need}
                  onChange={(e) => setNeed(e.target.value)}
                  placeholder={content.hero?.needPlaceholder || 'Tell us what you need?'}
                  className="w-full rounded-full border border-white/25 bg-white py-3 pl-11 pr-4 text-sm text-navy outline-none placeholder:text-slate-400 transition focus:border-primary focus:ring-2 focus:ring-primary/25"
                  required
                />
              </label>

              <label className="relative w-full text-left sm:max-w-[210px]">
                <span className="sr-only">Postcode</span>
                <PostcodeInput
                  value={postcode}
                  onChange={setPostcode}
                  placeholder="Postcode"
                  className="flex w-full items-center gap-2 rounded-full border border-white/25 bg-white px-4 py-3 text-sm text-navy outline-none transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25"
                />
              </label>

              <button
                type="submit"
                className="shrink-0 rounded-full bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-8 py-3 text-sm font-extrabold tracking-wide text-white shadow-md shadow-[#0a3a7a]/30 transition hover:brightness-105 sm:px-9"
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
