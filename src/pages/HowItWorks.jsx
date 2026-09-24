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
} from 'lucide-react'

const stepsCustomer = [
  {
    title: 'Pick a service',
    copy: 'Browse categories like home improvements or cleaning and open the job you need.',
    icon: Search,
  },
  {
    title: 'Answer the questionnaire',
    copy: 'Dynamic questions (with branching) help professionals understand the scope.',
    icon: ListChecks,
  },
  {
    title: 'Submit & get matched',
    copy: 'We create a lead and notify relevant professionals in your area.',
    icon: Users,
  },
  {
    title: 'Receive contact',
    copy: 'Pros unlock your details with tokens and reach out with quotes.',
    icon: MessageSquare,
  },
]

const stepsPro = [
  {
    title: 'Create a professional account',
    copy: 'Add your company, services and postcode areas you cover.',
    icon: UserPlus,
  },
  {
    title: 'Buy token packages',
    copy: 'Flexible packs let you unlock only the leads you want.',
    icon: Coins,
  },
  {
    title: 'Review matched leads',
    copy: 'See job summaries first — contact details stay locked until you unlock.',
    icon: Eye,
  },
  {
    title: 'Unlock & win work',
    copy: 'Spend tokens to reveal phone and email, then quote the customer directly.',
    icon: Unlock,
  },
]

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-navy">How it works</h1>
      <p className="mt-2 max-w-2xl text-slate">
        A simple marketplace flow for customers requesting quotes and professionals buying leads.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl font-bold text-navy">For customers</h2>
          <ol className="mt-6 space-y-5">
            {stepsCustomer.map((s) => {
              const Icon = s.icon
              return (
                <li key={s.title} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Icon className="size-4" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="font-bold text-navy">{s.title}</p>
                    <p className="text-sm text-muted">{s.copy}</p>
                  </div>
                </li>
              )
            })}
          </ol>
          <Link to="/request" className="btn-primary mt-8">
            Get Quotes
          </Link>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-navy">For professionals</h2>
          <ol className="mt-6 space-y-5">
            {stepsPro.map((s) => {
              const Icon = s.icon
              return (
                <li key={s.title} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Icon className="size-4" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="font-bold text-navy">{s.title}</p>
                    <p className="text-sm text-muted">{s.copy}</p>
                  </div>
                </li>
              )
            })}
          </ol>
          <Link to="/business/signup" className="btn-secondary mt-8">
            Join as a professional
          </Link>
        </section>
      </div>
    </div>
  )
}
