import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BriefcaseBusiness, Building2, Settings2 } from 'lucide-react'
import { api } from '../../api/client'

export default function ProDashboard() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    api
      .myLeads()
      .then((d) => setCount((d.leads || []).length))
      .catch(() => setCount(0))
  }, [])

  const cards = [
    {
      to: '/pro/leads',
      label: 'Leads',
      value: count,
      hint: 'Available opportunities nearby',
      icon: BriefcaseBusiness,
    },
    {
      to: '/pro/available-pros',
      label: 'Available Pros.',
      value: 'Browse',
      hint: 'See professionals in the directory',
      icon: Building2,
    },
    {
      to: '/pro/settings',
      label: 'Settings',
      value: 'Account',
      hint: 'Profile, tokens & payments',
      icon: Settings2,
    },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-navy sm:text-4xl">Find The Best Opportunities For Your Business.</h1>
        <p className="mt-3 text-lg text-slate">View Local Opportunities To You !</p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.to}
              to={card.to}
              className="surface p-6 transition hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">{card.label}</p>
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" strokeWidth={1.9} />
                </span>
              </div>
              <p className="mt-2 text-3xl font-bold text-navy">{card.value}</p>
              <p className="mt-1 text-sm text-muted">{card.hint}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
