import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import StatusBadge from '../../components/StatusBadge'
import { formatDate } from '../../utils/questionnaire'

export default function RequestDetail() {
  const { id } = useParams()
  const [request, setRequest] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await api.getRequest(id)
        if (alive) setRequest(data.request)
      } catch (e) {
        if (alive) setError(e.message)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [id])

  if (loading) return <p className="text-muted">Loading…</p>
  if (error) return <p className="text-danger">{error}</p>
  if (!request) return null

  const matches = request.lead?.matches || []
  const unlocks = request.lead?.unlocks || []

  return (
    <div className="space-y-6">
      <Link to="/app" className="text-sm font-semibold text-primary">
        ← My requests
      </Link>

      <div className="surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy">{request.service?.name}</h2>
            <p className="mt-1 text-sm text-muted">
              {request.postcode}
              {request.city ? ` · ${request.city}` : ''} · {formatDate(request.submittedAt || request.createdAt)}
            </p>
          </div>
          <StatusBadge status={request.status} />
        </div>
        {request.description ? <p className="mt-4 text-slate">{request.description}</p> : null}
      </div>

      {(request.answers || []).length ? (
        <div className="surface p-6">
          <h3 className="font-display text-lg font-bold text-navy">Your answers</h3>
          <dl className="mt-4 space-y-3">
            {request.answers.map((a) => (
              <div key={a.id}>
                <dt className="text-sm font-semibold text-muted">{a.question?.label}</dt>
                <dd className="text-navy">{a.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      <div className="surface p-6">
        <h3 className="font-display text-lg font-bold text-navy">Matched professionals</h3>
        {!matches.length ? (
          <p className="mt-3 text-sm text-muted">
            {request.status === 'DRAFT'
              ? 'Submit this request to start matching.'
              : 'No matches yet — check back soon.'}
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {matches.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line px-4 py-3">
                <div>
                  <p className="font-bold text-navy">{m.professional?.companyName}</p>
                  <p className="text-sm text-muted">{m.professional?.city || 'Local pro'}</p>
                </div>
                <StatusBadge status={m.status} />
              </li>
            ))}
          </ul>
        )}

        {unlocks.length ? (
          <div className="mt-6 border-t border-line pt-4">
            <p className="text-sm font-bold text-navy">Professionals who unlocked your details</p>
            <ul className="mt-2 space-y-2 text-sm text-slate">
              {unlocks.map((u) => (
                <li key={u.id}>
                  {u.professional?.companyName} — {u.professional?.contactName}
                  {u.professional?.phone ? ` · ${u.professional.phone}` : ''}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  )
}
