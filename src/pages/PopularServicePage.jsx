import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import PostcodeInput from '../components/PostcodeInput'
import {
  getPopularServicePage,
  HOW_IT_WORKS_STEPS,
} from '../data/popularServicePages'

function QuoteButton({ to, className = '' }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-8 py-3.5 text-sm font-extrabold tracking-wide text-white shadow-md shadow-[#0a3a7a]/25 transition hover:brightness-105 ${className}`}
    >
      REQUEST A FREE QUOTE
    </Link>
  )
}

export default function PopularServicePage({ slug }) {
  const navigate = useNavigate()
  const page = getPopularServicePage(slug)
  const [postcode, setPostcode] = useState('')

  if (!page) return <Navigate to="/" replace />

  const quoteTo = `/request?service=${encodeURIComponent(page.requestSlug)}`

  function onSearch(e) {
    e.preventDefault()
    const q = new URLSearchParams()
    q.set('service', page.requestSlug)
    if (postcode.trim()) q.set('postcode', postcode.trim())
    navigate(`/professionals?${q}`)
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative isolate flex min-h-[380px] items-center justify-center overflow-hidden px-4 py-16 sm:min-h-[440px] sm:px-6 sm:py-20">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url('${page.heroImage}')` }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/50 to-black/65" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-[3.25rem] md:leading-tight">
            {page.heroTitle}
          </h1>
          <form
            onSubmit={onSearch}
            className="mx-auto mt-8 flex max-w-xl flex-col gap-2.5 rounded-2xl border border-white/20 bg-white/95 p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:flex-row sm:items-center sm:gap-2 sm:p-2"
          >
            <div className="min-w-0 flex-1">
              <PostcodeInput
                value={postcode}
                onChange={setPostcode}
                placeholder="Enter postcode or town"
                className="flex w-full items-center gap-2 rounded-xl border border-[#d6e4f0] bg-[#f7fbfe] px-3.5 py-2.5 text-sm text-navy shadow-none outline-none transition focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-7 py-2.5 text-sm font-extrabold tracking-wide text-white shadow-md shadow-[#0a3a7a]/25 transition hover:brightness-105"
            >
              SEARCH
            </button>
          </form>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <div
          className={`grid gap-10 ${
            page.intro.image ? 'lg:grid-cols-2 lg:items-center' : ''
          }`}
        >
          <div>
            <h2 className="text-2xl font-bold leading-snug text-navy sm:text-3xl">
              {page.intro.title}{' '}
              {page.intro.brand ? (
                <span className="font-semibold text-primary">{page.intro.brand}</span>
              ) : null}
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate sm:text-base">
              {page.intro.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
          {page.intro.image ? (
            <div className="overflow-hidden">
              <img
                src={page.intro.image}
                alt=""
                className="h-full max-h-[340px] w-full object-cover"
              />
            </div>
          ) : null}
        </div>
        <div className="mt-10 flex justify-center">
          <QuoteButton to={quoteTo} />
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#f5f5f5] px-4 py-14 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">How Does It Work</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <article key={step.title} className="text-center">
                <img
                  src={step.image}
                  alt=""
                  className="mx-auto aspect-[4/3] w-full max-w-[280px] object-cover"
                />
                <h3 className="mt-4 text-base font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{step.text}</p>
              </article>
            ))}
          </div>
          {page.howItWorksNote ? (
            <p className="mt-8 text-center text-sm italic text-slate">{page.howItWorksNote}</p>
          ) : null}
        </div>
      </section>

      {/* Advantages / services */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
          {page.advantages.title}
        </h2>
        {page.advantages.intro ? (
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-slate sm:text-base">
            {page.advantages.intro}
          </p>
        ) : null}

        {page.advantages.layout === 'bullets-image' ? (
          <>
            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center">
              <ul className="space-y-3 text-sm text-navy sm:text-base">
                {(page.advantages.bullets || []).map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {page.advantages.image ? (
                <img
                  src={page.advantages.image}
                  alt=""
                  className="w-full object-cover"
                />
              ) : null}
            </div>
            {page.advantages.cards?.length ? (
              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                {page.advantages.cards.map((card) => (
                  <article key={card.title}>
                    <h3 className="text-lg font-bold text-navy">{card.title}</h3>
                    <img
                      src={card.image}
                      alt=""
                      className="mt-3 aspect-[16/10] w-full object-cover"
                    />
                    <p className="mt-3 text-sm leading-relaxed text-slate">{card.text}</p>
                  </article>
                ))}
              </div>
            ) : null}
          </>
        ) : page.advantages.layout === 'service-grid' ? (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {(page.advantages.items || []).map((item) => (
              <article key={item.title} className="flex h-full flex-col">
                <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="mt-3 aspect-[16/10] w-full object-cover"
                  />
                ) : null}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate">{item.text}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            {(page.advantages.items || []).map((item) => (
              <article key={item.title}>
                <h3 className="text-lg font-bold text-navy">{item.title}</h3>
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="mt-3 aspect-[16/10] w-full object-cover"
                  />
                ) : null}
                <p className="mt-3 text-sm leading-relaxed text-slate">{item.text}</p>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <QuoteButton to={quoteTo} />
        </div>
      </section>
    </div>
  )
}
