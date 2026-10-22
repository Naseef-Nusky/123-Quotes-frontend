import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Coins, Eye, Unlock, ArrowRight } from 'lucide-react'
import { api } from '../api/client'
import Loading from '../components/Loading'
import PageHero from '../components/PageHero'
import { BANNERS } from '../data/banners'
import Reveal from '../components/Reveal'
import Faq from '../components/Faq'
import { formatMoney } from '../utils/questionnaire'
import { useAuth } from '../context/AuthContext'

const tokenSteps = [
  {
    icon: Coins,
    title: 'Buy a token pack',
    copy: 'Choose a pack that matches your pipeline. Tokens never expire while your account is active.',
  },
  {
    icon: Eye,
    title: 'Browse matched leads free',
    copy: 'See the job summary, answers and postcode before you spend anything.',
  },
  {
    icon: Unlock,
    title: 'Unlock & contact',
    copy: 'Spend tokens only on leads you want, reveal phone and email, and quote the customer directly.',
  },
]

const included = [
  'Unlock real customer leads',
  'Phone & email revealed instantly',
  'Instant lead notifications',
  'Customer messaging in your portal',
  'No commission on work you win',
]

const pricingFaqs = [
  {
    q: 'How much does a lead cost?',
    a: 'Each lead shows its token cost before you unlock it. Bigger packs give you a lower price per token, so the cost per lead drops as you scale.',
  },
  {
    q: 'Do tokens expire?',
    a: 'No. Tokens stay on your account while it is active, so you can buy a pack and use it whenever the right jobs come in.',
  },
  {
    q: 'Is there a subscription or commission?',
    a: 'None. You only pay for the token packs you choose, and you keep 100% of what you charge the customer.',
  },
]

export default function Pricing() {
  const [packages, setPackages] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { isProfessional } = useAuth()

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await api.getPackages()
        if (alive) setPackages(data.packages || [])
      } catch (e) {
        if (alive) setError(e.message)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const sorted = [...packages].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  const popularIndex = sorted.length >= 3 ? 1 : sorted.length - 1

  return (
    <div>
      <PageHero
        image={BANNERS.pricing}
        eyebrow="Pricing for professionals"
        title="Pay only for the leads"
        highlight="you want"
        subtitle="Professionals unlock customer leads with tokens. No subscriptions, no commission, just flexible packs that match your pipeline."
        cta={{ to: isProfessional ? '/pro/tokens' : '/business/signup', label: isProfessional ? 'Buy tokens' : 'Join free to get started' }}
        secondaryCta={{ to: '/how-it-works', label: 'How tokens work' }}
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {loading ? <Loading className="mt-4" /> : null}
        {error ? <p className="mt-4 text-danger">{error}</p> : null}

        <div className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {sorted.map((pkg, idx) => {
            const popular = idx === popularIndex && sorted.length > 1
            const perToken = pkg.tokens ? pkg.priceCents / pkg.tokens : 0
            return (
              <Reveal key={pkg.id} delay={idx * 0.08} className="h-full">
                <div
                  className={`relative flex h-full flex-col rounded-3xl border bg-white p-5 ${
                    popular
                      ? 'border-primary shadow-[0_28px_60px_-24px_rgba(30,143,213,0.55)] ring-1 ring-primary/40 md:-translate-y-2'
                      : 'card-hover border-line shadow-[0_12px_34px_-20px_rgba(10,47,92,0.3)]'
                  }`}
                >
                  {popular ? (
                    <span className="bg-brand-gradient absolute -top-3.5 left-7 rounded-full px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide text-white shadow-md">
                      Most popular
                    </span>
                  ) : null}
                  <h2 className="font-display text-xl font-bold text-navy">{pkg.name}</h2>
                  <p className="mt-1.5 min-h-10 text-sm text-muted">{pkg.description}</p>
                  <p className="mt-4 font-display text-4xl font-extrabold tracking-tight text-navy">
                    {formatMoney(pkg.priceCents, pkg.currency || 'GBP')}
                  </p>
                  <p className="mt-2 text-sm font-bold text-primary">
                    {pkg.tokens} tokens
                    {perToken ? (
                      <span className="font-medium text-muted">
                        {' '}
                        · {formatMoney(Math.round(perToken), pkg.currency || 'GBP')} per token
                      </span>
                    ) : null}
                  </p>

                  <ul className="mt-6 flex-1 space-y-2.5 border-t border-line pt-6">
                    {included.map((line) => (
                      <li key={line} className="flex items-start gap-2.5 text-sm text-slate">
                        <span className="bg-brand-gradient mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                          <Check className="size-3 text-white" strokeWidth={3.5} />
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={isProfessional ? '/pro/tokens' : '/business/signup'}
                    className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition ${
                      popular
                        ? 'bg-brand-gradient text-white shadow-md shadow-primary-dark/25 hover:brightness-105'
                        : 'border border-primary/40 text-primary-dark hover:border-primary hover:bg-panel'
                    }`}
                  >
                    {isProfessional ? 'Buy in portal' : 'Join to purchase'}
                    <ArrowRight className="size-4" strokeWidth={2.25} />
                  </Link>
                </div>
              </Reveal>
            )
          })}
        </div>

        {!loading && !sorted.length && !error ? (
          <p className="mt-8 text-center text-muted">No packages available yet.</p>
        ) : null}

        <div className="mt-20">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-bold tracking-tight text-navy">
              How tokens work
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {tokenSteps.map((s, i) => {
              const Icon = s.icon
              return (
                <Reveal key={s.title} delay={i * 0.07}>
                  <article className="card-hover h-full rounded-3xl border border-line bg-canvas/60 p-6 text-center">
                    <span className="bg-navy-gradient mx-auto flex size-12 items-center justify-center rounded-2xl text-white">
                      <Icon className="size-6" strokeWidth={1.9} />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold text-navy">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate">{s.copy}</p>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>

      <section className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Faq items={pricingFaqs} title="Pricing questions" />
        </div>
      </section>
    </div>
  )
}
