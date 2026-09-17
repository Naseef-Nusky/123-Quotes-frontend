import { useCallback, useEffect, useState } from 'react'
import { api } from '../../api/client'
import StatusBadge from '../../components/StatusBadge'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/questionnaire'

export default function ProLeads() {
  const { refreshMe } = useAuth()
  const [leads, setLeads] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [unlocking, setUnlocking] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.myLeads()
      setLeads(data.leads || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function unlock(leadId) {
    setUnlocking(leadId)
    setMessage('')
    setError('')
    try {
      const data = await api.unlockLead(leadId)
      setMessage(data.message || 'Lead unlocked')
      await refreshMe()
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setUnlocking(null)
    }
  }

  return (
    <div>
      <p className="mb-6 text-slate">Review matched jobs. Contact details unlock when you spend tokens.</p>
      {loading ? <p className="text-muted">Loading leads…</p> : null}
      {error ? <p className="mb-4 text-danger">{error}</p> : null}
      {message ? <p className="mb-4 text-success">{message}</p> : null}

      <div className="space-y-4">
        {leads.map((item) => {
          const lead = item.lead
          return (
            <article key={item.matchId} className="surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-navy">{lead.service?.name}</h2>
                  <p className="text-sm text-muted">
                    {lead.postcode}
                    {lead.city ? ` · ${lead.city}` : ''} · {formatDate(lead.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={item.matchStatus} />
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-primary">
                    {lead.tokenCost} tokens
                  </span>
                </div>
              </div>

              {lead.summary ? <p className="mt-3 text-sm text-slate">{lead.summary}</p> : null}

              {(lead.answers || []).length ? (
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {lead.answers.slice(0, 4).map((a, i) => (
                    <li key={i}>
                      <span className="font-semibold text-navy">{a.question}:</span> {a.value}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-4 rounded-xl bg-canvas p-4">
                {lead.contactLocked ? (
                  <>
                    <p className="text-sm font-semibold text-navy">Contact locked</p>
                    <p className="mt-1 text-sm text-muted">
                      Customer: {lead.customer?.firstName || '—'} · {lead.customer?.postcode || lead.postcode}
                    </p>
                    <button
                      type="button"
                      className="btn-primary mt-3 !py-2 !text-sm"
                      disabled={unlocking === lead.id}
                      onClick={() => unlock(lead.id)}
                    >
                      {unlocking === lead.id ? 'Unlocking…' : `Unlock for ${lead.tokenCost} tokens`}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-success">Contact unlocked</p>
                    <p className="mt-1 text-sm text-navy">
                      {lead.customer?.firstName} {lead.customer?.lastName}
                    </p>
                    <p className="text-sm text-slate">{lead.customer?.email}</p>
                    <p className="text-sm text-slate">{lead.customer?.phone}</p>
                    <p className="text-sm text-muted">
                      {[lead.customer?.address, lead.customer?.city, lead.customer?.postcode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {!loading && !leads.length ? (
        <div className="surface p-8 text-center text-muted">No leads matched to you yet.</div>
      ) : null}
    </div>
  )
}
