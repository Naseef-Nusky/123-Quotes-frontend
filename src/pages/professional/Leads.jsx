import { useEffect, useMemo, useState } from 'react'
import {
  BriefcaseBusiness,
  Clock3,
  Lock,
  LockOpen,
  Mail,
  MapPin,
  Phone,
  Users,
  Zap,
} from 'lucide-react'
import { api } from '../../api/client'

function timeAgo(date) {
  if (!date) return '—'
  const sec = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000))
  if (sec < 60) return 'Just now'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const days = Math.floor(hr / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

function mapLeadItem(item) {
  const lead = item.lead || item
  const unlocked = !lead.contactLocked
  const customer = lead.customer || {}
  const name = unlocked
    ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Lead'
    : customer.firstName || 'Lead'
  const answers = lead.answers || []
  return {
    id: lead.id,
    matchId: item.matchId,
    maskedName: name,
    ago: timeAgo(lead.createdAt),
    service: lead.service?.name || 'Service',
    snippet:
      lead.summary ||
      answers
        .map((a) => a.value)
        .filter(Boolean)
        .join(' · ') ||
      'No summary provided',
    postcode: lead.postcode || '—',
    interest: item.score || lead.tokenCost || 0,
    phoneMasked: unlocked ? customer.phone || '—' : '••• ••• ••••',
    emailMasked: unlocked ? customer.email || '—' : '••••@••••',
    details: answers.map((a) => ({ q: a.question, a: a.value })),
    responded: lead.unlockedCount || 0,
    maxRespond: Math.max(lead.matchedCount || 5, 5),
    contactLocked: !!lead.contactLocked,
    tokenCost: lead.tokenCost || 1,
  }
}

export default function ProLeads() {
  const [raw, setRaw] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const leads = useMemo(() => raw.map(mapLeadItem), [raw])
  const [selectedId, setSelectedId] = useState(null)
  const selected = leads.find((l) => l.id === selectedId) || leads[0]
  const lockedCount = leads.filter((l) => l.contactLocked).length

  useEffect(() => {
    let cancelled = false
    api
      .myLeads()
      .then((d) => {
        if (cancelled) return
        const list = d.leads || []
        setRaw(list)
        setSelectedId(list[0]?.lead?.id || list[0]?.id || null)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load leads')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function unlockSelected() {
    if (!selected?.id || !selected.contactLocked) return
    setBusyId(selected.id)
    setError('')
    try {
      await api.unlockLead(selected.id)
      const d = await api.myLeads()
      setRaw(d.leads || [])
    } catch (err) {
      setError(err.message || 'Unlock failed')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-4.5rem)] w-full flex-col text-left lg:flex-row">
      {/* Lead list */}
      <aside className="flex w-full flex-col border-b border-line bg-white lg:max-h-none lg:w-[400px] lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="border-b border-line bg-canvas/80 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-navy">Your leads</h2>
              <p className="mt-0.5 text-xs text-muted">
                {loading ? 'Loading…' : `${leads.length} matched · ${lockedCount} locked`}
              </p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BriefcaseBusiness className="size-5" strokeWidth={2} />
            </span>
          </div>
        </div>

        <div className="max-h-[42vh] flex-1 overflow-y-auto lg:max-h-none">
          {error && !selected ? <p className="px-5 py-3 text-sm text-danger">{error}</p> : null}

          {loading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-canvas" />
              ))}
            </div>
          ) : null}

          {!loading && !leads.length ? (
            <div className="px-5 py-10 text-left">
              <p className="text-sm font-semibold text-navy">No leads yet</p>
              <p className="mt-1 text-sm text-muted">
                New matched opportunities will appear here.
              </p>
            </div>
          ) : null}

          <div className="space-y-2 p-3">
            {leads.map((lead) => {
              const active = selected?.id === lead.id
              return (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => setSelectedId(lead.id)}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-left transition ${
                    active
                      ? 'border-primary/40 bg-gradient-to-br from-primary/10 to-white shadow-sm shadow-primary/10'
                      : 'border-transparent bg-canvas/60 hover:border-line hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-navy">{lead.maskedName}</p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-primary">{lead.service}</p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-navy/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                      <Clock3 className="size-3" strokeWidth={2.2} />
                      {lead.ago}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-snug text-slate">{lead.snippet}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate ring-1 ring-line">
                      <MapPin className="size-3.5 text-primary" strokeWidth={2} />
                      {lead.postcode}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate ring-1 ring-line">
                      <Zap className="size-3.5 text-primary" strokeWidth={2} />
                      {lead.interest}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${
                        lead.contactLocked
                          ? 'bg-warning/10 text-warning'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {lead.contactLocked ? (
                        <Lock className="size-3.5" strokeWidth={2} />
                      ) : (
                        <LockOpen className="size-3.5" strokeWidth={2} />
                      )}
                      {lead.contactLocked ? 'Locked' : 'Unlocked'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </aside>

      {/* Detail panel */}
      <div className="flex min-w-0 flex-1 flex-col bg-canvas/40">
        {selected ? (
          <div className="flex flex-1 flex-col">
            <div className="border-b border-line bg-white px-5 py-6 sm:px-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-navy">{selected.maskedName}</h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-1 text-[11px] font-semibold text-white">
                      <Clock3 className="size-3" strokeWidth={2.2} />
                      {selected.ago}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        selected.contactLocked
                          ? 'bg-warning/15 text-warning'
                          : 'bg-primary/15 text-primary'
                      }`}
                    >
                      {selected.contactLocked ? 'Contact locked' : 'Contact unlocked'}
                    </span>
                  </div>
                  <p className="mt-2 text-lg font-bold text-primary">{selected.service}</p>
                  <p className="mt-1 max-w-2xl text-sm text-slate">{selected.snippet}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-line bg-canvas/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Location</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-navy">
                    <MapPin className="size-4 text-primary" strokeWidth={2} />
                    {selected.postcode}
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-canvas/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Phone</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-navy">
                    <Phone className="size-4 text-primary" strokeWidth={2} />
                    {selected.phoneMasked}
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-canvas/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Email</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 truncate text-sm font-bold text-navy">
                    <Mail className="size-4 shrink-0 text-primary" strokeWidth={2} />
                    {selected.emailMasked}
                  </p>
                </div>
              </div>

              {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-5 py-3 text-sm font-bold text-white shadow-md shadow-navy/20 transition hover:brightness-105 disabled:opacity-60"
                  disabled={busyId === selected.id || !selected.contactLocked}
                  onClick={unlockSelected}
                >
                  {selected.contactLocked ? (
                    <Lock className="size-4" strokeWidth={2} />
                  ) : (
                    <LockOpen className="size-4" strokeWidth={2} />
                  )}
                  {selected.contactLocked
                    ? busyId === selected.id
                      ? 'Unlocking…'
                      : `Unlock contact · ${selected.tokenCost} token${selected.tokenCost === 1 ? '' : 's'}`
                    : 'Contact unlocked'}
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-line bg-white px-5 py-3 text-sm font-bold text-slate transition hover:border-danger/30 hover:bg-danger/5 hover:text-danger"
                >
                  Decline
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-5 px-5 py-6 sm:px-8">
              <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-primary" strokeWidth={2} />
                  <h3 className="text-sm font-bold text-navy">Professional interest</h3>
                </div>
                <div className="mt-3 flex gap-1.5">
                  {Array.from({ length: selected.maxRespond }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-2.5 flex-1 rounded-full ${
                        i < selected.responded ? 'bg-primary' : 'bg-line'
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-slate">
                  <span className="font-bold text-navy">
                    {selected.responded}/{selected.maxRespond}
                  </span>{' '}
                  professionals have unlocked this lead.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-navy">Details provided</h3>
                {selected.details.length ? (
                  <ul className="mt-4 divide-y divide-line">
                    {selected.details.map((d) => (
                      <li key={d.q} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:gap-6">
                        <span className="min-w-0 flex-1 text-sm text-slate">{d.q}</span>
                        <span className="text-sm font-bold text-navy sm:max-w-[50%] sm:text-right">
                          {d.a || '—'}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted">No questionnaire answers for this lead.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-start px-5 py-10 sm:px-8">
            <div>
              <p className="text-base font-bold text-navy">Select a lead</p>
              <p className="mt-1 text-sm text-muted">Choose a lead from the list to view details.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
