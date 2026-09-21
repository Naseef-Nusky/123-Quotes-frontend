import { useEffect, useMemo, useState } from 'react'
import { MapPin, Zap, Phone, Mail } from 'lucide-react'
import { api } from '../../api/client'

function timeAgo(date) {
  if (!date) return '—'
  const sec = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000))
  if (sec < 60) return 'Just now'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} Minute(s) ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} Hour(s) ago`
  const days = Math.floor(hr / 24)
  if (days < 30) return `${days} Day(s) ago`
  return `${Math.floor(days / 30)} Month(s) ago`
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
        .join(' / ') ||
      '—',
    postcode: lead.postcode || '—',
    interest: item.score || lead.tokenCost || 0,
    phoneMasked: unlocked ? customer.phone || '—' : '***',
    emailMasked: unlocked ? customer.email || '—' : '***@***',
    details: answers.map((a) => ({ q: a.question, a: a.value })),
    responded: lead.unlockedCount || 0,
    maxRespond: Math.max(lead.matchedCount || 5, 5),
    contactLocked: !!lead.contactLocked,
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
    <section className="mx-auto flex min-h-[70vh] max-w-6xl flex-col lg:flex-row">
      <aside className="max-h-[70vh] w-full overflow-y-auto border-b border-line lg:max-h-none lg:w-[380px] lg:border-b-0 lg:border-r">
        {loading ? <p className="p-4 text-sm text-muted">Loading leads…</p> : null}
        {error ? <p className="p-4 text-sm text-rose-600">{error}</p> : null}
        {leads.map((lead) => (
          <button
            key={lead.id}
            type="button"
            onClick={() => setSelectedId(lead.id)}
            className={`w-full border-b border-line px-4 py-4 text-left transition hover:bg-canvas ${
              selected?.id === lead.id ? 'bg-primary/5' : 'bg-white'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-navy">{lead.maskedName}</p>
              <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                {lead.ago}
              </span>
            </div>
            <p className="mt-2 font-bold text-navy">{lead.service}</p>
            <p className="mt-1 line-clamp-2 text-sm text-slate">{lead.snippet}</p>
            <div className="mt-3 flex items-center gap-4 text-sm text-slate">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-primary" strokeWidth={2} /> {lead.postcode}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="size-4 text-primary" strokeWidth={2} /> {lead.interest}
              </span>
            </div>
          </button>
        ))}
        {!loading && !leads.length ? (
          <p className="p-4 text-sm text-muted">No leads matched to your account yet.</p>
        ) : null}
      </aside>

      <div className="flex-1 px-4 py-6 sm:px-8">
        {selected ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-navy">{selected.maskedName}</h1>
                  <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    {selected.ago}
                  </span>
                </div>
                <p className="mt-2 text-xl font-bold text-navy">{selected.service}</p>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm text-slate">
              <p className="inline-flex items-center gap-2">
                <Phone className="size-4 text-primary" strokeWidth={2} /> {selected.phoneMasked}
              </p>
              <p className="inline-flex items-center gap-2">
                <Mail className="size-4 text-primary" strokeWidth={2} /> {selected.emailMasked}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn-primary !rounded-md"
                disabled={busyId === selected.id}
                onClick={unlockSelected}
              >
                {selected.contactLocked
                  ? busyId === selected.id
                    ? 'Unlocking…'
                    : `Unlock & reach out to ${selected.maskedName}`
                  : `Reach out to ${selected.maskedName}`}
              </button>
              <button
                type="button"
                className="rounded-md bg-warning px-5 py-3 text-sm font-bold text-white transition hover:brightness-95"
              >
                Decline
              </button>
            </div>

            <div className="mt-6 rounded-lg border border-line px-4 py-3">
              <div className="mb-2 flex gap-1">
                {Array.from({ length: selected.maxRespond }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-6 w-2 rounded-sm ${i < selected.responded ? 'bg-primary' : 'bg-rose-100'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-slate">
                {selected.responded}/{selected.maxRespond} Professionals have responded.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="border-b border-line pb-2 text-lg font-bold text-navy">Details Provided</h2>
              <ul className="mt-4 space-y-3">
                {selected.details.map((d) => (
                  <li key={d.q} className="text-sm">
                    <span className="text-slate">• {d.q}</span>
                    {d.a ? <span className="ml-1 font-bold text-navy">{d.a}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="text-slate">No leads available.</p>
        )}
      </div>
    </section>
  )
}
