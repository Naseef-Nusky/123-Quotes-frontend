import { Link } from 'react-router-dom'
import {
  Search,
  ListChecks,
  Users,
  MessageSquare,
  UserPlus,
  Coins,
  Eye,
  Unlock,
  BadgeCheck,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react'
import PageHero from '../components/PageHero'
import { BANNERS } from '../data/banners'
import Reveal from '../components/Reveal'
import Faq from '../components/Faq'

const stepsCustomer = [
  {
    title: 'Pick a service',
    copy: 'Browse categories like home improvements or cleaning and open the job you need.',
    icon: Search,
  },
  {
    title: 'Answer the questionnaire',
    copy: 'Dynamic questions (with branching) help professionals understand the scope. Attach up to 3 photos or documents so quotes are accurate.',
    icon: ListChecks,
  },
  {
    title: 'Submit & get matched',
    copy: 'We create a lead and notify relevant professionals in your area — usually within minutes.',
    icon: Users,
  },
  {
    title: 'Receive contact & compare',
    copy: 'Pros unlock your details with tokens and reach out with quotes. Compare, ask questions, and hire whoever you like.',
    icon: MessageSquare,
  },
]

const stepsPro = [
  {
    title: 'Create a professional account',
    copy: 'Add your company, services and postcode areas you cover. Joining is free.',
    icon: UserPlus,
  },
  {
    title: 'Buy token packages',
    copy: 'Flexible packs let you unlock only the leads you want — no subscriptions, no commission.',
    icon: Coins,
  },
  {
    title: 'Review matched leads',
    copy: 'See job summaries, answers and location first — contact details stay locked until you unlock.',
    icon: Eye,
  },
  {
    title: 'Unlock & win work',
    copy: 'Spend tokens to reveal phone and email, then quote the customer directly and grow your business.',
    icon: Unlock,
  },
]

const assurances = [
  {
    icon: BadgeCheck,
    title: 'Verified profiles',
    copy: 'Professionals register with real business details before they can unlock any lead.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy first',
    copy: 'Customer contact details are never public — they are only revealed to a pro who unlocks the lead.',
  },
  {
    icon: Zap,
    title: 'Fast matching',
    copy: 'Requests are matched to local pros by service and postcode the moment they are submitted.',
  },
]

function StepList({ steps }) {
  return (
    <ol className="space-y-4">
      {steps.map((s, i) => {
        const Icon = s.icon
        return (
          <Reveal key={s.title} delay={i * 0.06}>
            <li className="card-hover flex gap-4 rounded-3xl border border-line bg-white p-5 shadow-[0_10px_28px_-18px_rgba(10,47,92,0.3)]">
              <span className="bg-brand-gradient flex size-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-md shadow-primary-dark/20">
                <Icon className="size-5" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                  Step {i + 1}
                </p>
                <p className="mt-0.5 font-display text-base font-bold text-navy">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate">{s.copy}</p>
              </div>
            </li>
          </Reveal>
        )
      })}
    </ol>
  )
}

export default function HowItWorks() {
  return (
    <div>
      <PageHero
        image={BANNERS.howItWorks}
        eyebrow="How it works"
        title="Quotes without the"
        highlight="phone tag"
        subtitle="A simple marketplace flow: customers request quotes for free, professionals unlock only the leads they want."
        cta={{ to: '/services', label: 'Get free quotes' }}
        secondaryCta={{ to: '/business/signup', label: 'Join as a professional' }}
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
          <section>
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">For customers</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                Free forever. Post a job once and let matched professionals come to you.
              </p>
            </Reveal>
            <div className="mt-6">
              <StepList steps={stepsCustomer} />
            </div>
            <Link
              to="/request"
              className="bg-brand-gradient mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-md shadow-primary-dark/25 transition hover:brightness-105"
            >
              Get Quotes
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </Link>
          </section>

          <section>
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">For professionals</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                Pay only for the leads you pursue — keep 100% of what you earn.
              </p>
            </Reveal>
            <div className="mt-6">
              <StepList steps={stepsPro} />
            </div>
            <Link
              to="/business/signup"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-primary/40 px-6 py-3 text-sm font-bold text-primary-dark transition hover:border-primary hover:bg-panel"
            >
              Join as a professional
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </Link>
          </section>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {assurances.map((a, i) => {
            const Icon = a.icon
            return (
              <Reveal key={a.title} delay={i * 0.07}>
                <article className="card-hover h-full rounded-3xl border border-line bg-canvas/60 p-6">
                  <span className="bg-navy-gradient flex size-11 items-center justify-center rounded-2xl text-white">
                    <Icon className="size-5" strokeWidth={2} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-navy">{a.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate">{a.copy}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>

      <section className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Faq />
        </div>
      </section>
    </div>
  )
}
