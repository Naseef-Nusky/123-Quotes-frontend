import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DUMMY_SERVICES } from '../data/dummy'
import { defaultHomeContent, fetchHomeContent } from '../data/homeContent'

export default function Home() {
  const navigate = useNavigate()
  const [content, setContent] = useState(defaultHomeContent)
  const [service, setService] = useState(defaultHomeContent.hero.searchPlaceholder)

  useEffect(() => {
    fetchHomeContent().then((data) => {
      setContent(data)
      setService(data.hero?.searchPlaceholder || 'Web Development')
    })
  }, [])

  function onStart(e) {
    e.preventDefault()
    navigate(`/business/signup?service=${encodeURIComponent(service)}`)
  }

  return (
    <div>
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-3xl text-center animate-fade-up">
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-5xl">
            {content.hero.title}
          </h1>
          <p className="mt-4 text-lg text-slate sm:text-xl">{content.hero.subtitle}</p>

          <form
            onSubmit={onStart}
            className="mx-auto mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-stretch"
          >
            <input
              list="service-options"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder={content.hero.searchPlaceholder}
              className="input-field flex-1 !rounded-md text-left"
              required
            />
            <datalist id="service-options">
              {DUMMY_SERVICES.map((s) => (
                <option key={s.id} value={s.name} />
              ))}
            </datalist>
            <button type="submit" className="btn-primary !rounded-md whitespace-nowrap">
              {content.hero.buttonText}
            </button>
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
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-navy">{content.hire.title}</h2>
            <p className="mt-2 text-xl font-semibold text-primary">{content.hire.subtitle}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate sm:text-base">{content.hire.body}</p>
          </div>
          <div className="mt-10 space-y-6">
            {(content.hire.steps || []).map((step) => (
              <div key={step.id} className="flex gap-3">
                <span className="text-2xl font-bold text-primary" aria-hidden>
                  “
                </span>
                <div>
                  <h3 className="text-lg font-bold text-navy">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center italic text-slate">
            <Link to="/services" className="font-semibold text-primary">
              {content.hire.cta}
            </Link>
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-navy">{content.join.title}</h2>
            <p className="mt-2 text-xl font-semibold text-primary">{content.join.subtitle}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate sm:text-base">{content.join.body}</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {(content.join.cards || []).map((card) => (
              <article key={card.id} className="rounded-xl border border-line bg-white p-6">
                <h3 className="text-lg font-bold text-navy">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{card.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/business/signup" className="btn-primary !rounded-md">
              {content.join.buttonText}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
