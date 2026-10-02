import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  ClipboardList,
  FilePlus2,
  Layers,
} from 'lucide-react'
import { api } from '../../api/client'
import Loading from '../../components/Loading'
import { useAuth } from '../../context/AuthContext'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [pros, setPros] = useState([])
  const [requestCount, setRequestCount] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const name =
    [user?.customer?.firstName, user?.customer?.lastName].filter(Boolean).join(' ') ||
    user?.email?.split('@')[0] ||
    'there'

  useEffect(() => {
    let cancelled = false
    Promise.all([
      api.getDirectory().catch(() => ({ professionals: [] })),
      api.myRequests().catch(() => ({ requests: [] })),
    ])
      .then(([dir, reqs]) => {
        if (cancelled) return
        setPros(dir.professionals || [])
        setRequestCount((reqs.requests || []).length)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load dashboard')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const actions = [
    {
      to: '/app/requests/new',
      title: 'New request',
      desc: 'Start a quote request for the service you need.',
      icon: FilePlus2,
    },
    {
      to: '/app/requests',
      title: 'My requests',
      desc: 'Track status and matched professionals.',
      icon: ClipboardList,
    },
    {
      to: '/app/requested-services',
      title: 'Requested services',
      desc: 'See services you have already requested.',
      icon: Layers,
    },
  ]

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pt-6 text-left sm:px-6 sm:pt-8">
      {/* Fixed sections above Available professionals */}
      <div className="shrink-0 space-y-4 bg-canvas pb-3">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a3a7a] via-[#0a2f5c] to-[#071f3d] px-5 py-5 text-left text-white shadow-lg shadow-navy/20 sm:px-7 sm:py-6">
          <div
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[#3baee8]/20 blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Welcome back, {name}
              </h1>
              <p className="mt-1 text-sm text-white/75">
                Manage your quote requests and find the right professionals.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/app/requests/new"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-navy transition hover:bg-sky-50"
              >
                New request
                <ArrowRight className="size-4" strokeWidth={2.2} />
              </Link>
              <Link
                to="/app/requests"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
              >
                View requests
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            to="/app/requests"
            className="group rounded-2xl border border-line bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3baee8] to-[#0a3a7a] text-white">
                <ClipboardList className="size-5" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">My requests</p>
                <p className="mt-0.5 text-2xl font-bold tracking-tight text-navy">
                  {loading ? '—' : requestCount}
                </p>
                <p className="mt-0.5 text-xs text-slate">Open and past quote requests</p>
              </div>
            </div>
          </Link>
          <Link
            to="/services"
            className="group rounded-2xl border border-line bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#0369a1] text-white">
                <Layers className="size-5" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Services</p>
                <p className="mt-0.5 text-2xl font-bold tracking-tight text-navy">Browse</p>
                <p className="mt-0.5 text-xs text-slate">Find a service to request</p>
              </div>
            </div>
          </Link>
          <Link
            to="/app"
            className="group rounded-2xl border border-line bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#60a5fa] to-[#1e3a8a] text-white">
                <Building2 className="size-5" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Professionals</p>
                <p className="mt-0.5 text-2xl font-bold tracking-tight text-navy">
                  {loading ? '—' : pros.length}
                </p>
                <p className="mt-0.5 text-xs text-slate">Available in the directory</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-bold text-navy">Quick actions</span>
            {actions.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold text-navy transition hover:border-primary/40 hover:bg-[#eef7fc]"
                >
                  <Icon className="size-4 text-primary" strokeWidth={2} />
                  {item.title}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Scrollable Available professionals */}
      <div className="mt-4 flex min-h-0 flex-1 flex-col text-left">
        <div className="shrink-0">
          <h2 className="text-base font-bold text-navy sm:text-lg">Available professionals</h2>
          <p className="mt-0.5 text-xs text-muted sm:text-sm">
            Request a quotation from matched providers.
          </p>
          {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
          {loading ? <Loading className="mt-2 py-6" /> : null}
        </div>

        <div className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pb-6 pr-1">
          {pros.slice(0, 6).map((pro) => {
            const serviceSlug = pro.services?.[0]?.service?.slug
            return (
              <article
                key={pro.id}
                className="flex flex-col gap-3 rounded-2xl border border-line bg-white px-4 py-4 text-left shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3.5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Building2 className="size-6" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-navy">{pro.companyName}</h3>
                    <p className="mt-0.5 line-clamp-2 text-sm text-slate">
                      {pro.bio || 'No additional details'}
                    </p>
                    <Link
                      to={`/professionals/${pro.id}`}
                      className="mt-1.5 inline-flex text-sm font-semibold text-primary"
                    >
                      View profile
                    </Link>
                  </div>
                </div>
                <Link
                  to={
                    serviceSlug
                      ? `/request?service=${encodeURIComponent(serviceSlug)}`
                      : '/app/requests/new'
                  }
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#0a3a7a]/25 transition hover:brightness-105"
                >
                  Request quotation
                </Link>
              </article>
            )
          })}

          {!loading && !pros.length && !error ? (
            <p className="text-sm text-muted">No professionals available yet.</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
