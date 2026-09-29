import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Coins,
  Inbox,
  Send,
  Settings2,
} from 'lucide-react'
import { api } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

export default function ProDashboard() {
  const { user } = useAuth()
  const [leadCount, setLeadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const company =
    user?.professional?.companyName ||
    user?.professional?.contactName ||
    user?.email?.split('@')[0] ||
    'there'
  const tokens = user?.professional?.tokenBalance ?? 0

  useEffect(() => {
    let cancelled = false
    api
      .myLeads()
      .then((d) => {
        if (!cancelled) setLeadCount((d.leads || []).length)
      })
      .catch(() => {
        if (!cancelled) setLeadCount(0)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const stats = [
    {
      label: 'Open leads',
      value: loading ? '—' : leadCount,
      hint: 'Matched opportunities',
      icon: BriefcaseBusiness,
      to: '/pro/leads',
      accent: 'from-[#3baee8] to-[#0a3a7a]',
    },
    {
      label: 'Token balance',
      value: tokens,
      hint: 'Unlock lead contacts',
      icon: Coins,
      to: '/pro/tokens',
      accent: 'from-[#38bdf8] to-[#0369a1]',
    },
    {
      label: 'Directory',
      value: 'Browse',
      hint: 'Available professionals',
      icon: Building2,
      to: '/pro/available-pros',
      accent: 'from-[#60a5fa] to-[#1e3a8a]',
    },
  ]

  const actions = [
    {
      to: '/pro/leads',
      title: 'View leads',
      desc: 'See local opportunities matched to your services.',
      icon: BriefcaseBusiness,
    },
    {
      to: '/pro/available-pros',
      title: 'Available Pros',
      desc: 'Explore the professional directory.',
      icon: Building2,
    },
    {
      to: '/pro/request-sent',
      title: 'Request Sent',
      desc: 'Track requests you have already sent.',
      icon: Send,
    },
    {
      to: '/pro/my-request',
      title: 'My Request',
      desc: 'Manage your own service requests.',
      icon: ClipboardList,
    },
    {
      to: '/pro/client-requests',
      title: 'Client Requests',
      desc: 'Review inbound client opportunities.',
      icon: Inbox,
    },
    {
      to: '/pro/settings',
      title: 'Settings',
      desc: 'Update profile, tokens and account details.',
      icon: Settings2,
    },
  ]

  return (
    <section className="w-full px-4 py-8 text-left sm:px-6 sm:py-10">
      {/* Welcome band */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a3a7a] via-[#0a2f5c] to-[#071f3d] px-6 py-8 text-left text-white shadow-lg shadow-navy/20 sm:px-8 sm:py-10">
        <div
          className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[#3baee8]/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 left-1/3 size-48 rounded-full bg-primary/25 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col items-start gap-5">
          <div className="w-full">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-[2.1rem] md:leading-tight">
              Welcome back, {company}
            </h1>
            <p className="mt-2 text-sm text-white/75 sm:text-base">
              Find the best local opportunities for your business and grow with matched leads.
            </p>
          </div>
          <div className="flex flex-wrap items-start justify-start gap-3">
            <Link
              to="/pro/leads"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-sky-50"
            >
              View leads
              <ArrowRight className="size-4" strokeWidth={2.2} />
            </Link>
            <Link
              to="/pro/tokens"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
            >
              Buy tokens
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              to={stat.to}
              className="group relative overflow-hidden rounded-2xl border border-line bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.accent} text-white shadow-sm`}
                >
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <div className="min-w-0 text-left">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-navy">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate">{stat.hint}</p>
                </div>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary opacity-0 transition group-hover:opacity-100">
                Open <ArrowRight className="size-3.5" strokeWidth={2.2} />
              </span>
            </Link>
          )
        })}
      </div>

      {/* Quick actions */}
      <div className="mt-8 text-left">
        <div>
          <h2 className="text-lg font-bold text-navy sm:text-xl">Quick actions</h2>
          <p className="mt-1 text-sm text-muted">Jump into the tools you use most.</p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {actions.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-start gap-4 rounded-2xl border border-line bg-white p-4 text-left transition hover:border-primary/40 hover:bg-gradient-to-br hover:from-white hover:to-[#eef7fc] hover:shadow-sm"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-navy">{item.title}</p>
                    <ArrowRight
                      className="size-4 shrink-0 text-slate/40 transition group-hover:translate-x-0.5 group-hover:text-primary"
                      strokeWidth={2}
                    />
                  </div>
                  <p className="mt-1 text-sm leading-snug text-muted">{item.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
