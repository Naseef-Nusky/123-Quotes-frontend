import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import StatusBadge from '../../components/StatusBadge'
import { formatDate } from '../../utils/questionnaire'

export default function CustomerDashboard() {
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await api.myRequests()
        if (alive) setRequests(data.requests || [])
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

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-slate">Track quote requests and matched professionals.</p>
        <Link to="/app/requests/new" className="btn-primary !py-2.5 !text-sm">
          New request
        </Link>
      </div>

      {loading ? <p className="text-muted">Loading requests…</p> : null}
      {error ? <p className="text-danger">{error}</p> : null}

      <div className="space-y-3">
        {requests.map((r) => (
          <Link
            key={r.id}
            to={`/app/requests/${r.id}`}
            className="surface flex flex-col gap-2 p-5 transition hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-display text-lg font-bold text-navy">{r.service?.name || r.title || 'Request'}</p>
              <p className="text-sm text-muted">
                {r.postcode}
                {r.city ? ` · ${r.city}` : ''} · {formatDate(r.createdAt)}
              </p>
              {r.lead?.matches?.length ? (
                <p className="mt-1 text-sm font-semibold text-primary">
                  {r.lead.matches.length} matched pro{r.lead.matches.length === 1 ? '' : 's'}
                </p>
              ) : null}
            </div>
            <StatusBadge status={r.status} />
          </Link>
        ))}
      </div>

      {!loading && !requests.length && !error ? (
        <div className="surface p-8 text-center">
          <p className="font-display text-xl font-bold text-navy">No requests yet</p>
          <p className="mt-2 text-sm text-muted">Start with a service and we will match professionals nearby.</p>
          <Link to="/app/requests/new" className="btn-primary mt-6 inline-flex">
            Create your first request
          </Link>
        </div>
      ) : null}
    </div>
  )
}
