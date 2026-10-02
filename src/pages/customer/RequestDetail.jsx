import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { api } from '../../api/client'
import Loading from '../../components/Loading'
import StatusBadge from '../../components/StatusBadge'
import { formatDate } from '../../utils/questionnaire'

export default function RequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

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

  async function onDelete() {
    if (!window.confirm('Delete this request? This cannot be undone.')) return
    setDeleting(true)
    setError('')
    try {
      await api.deleteRequest(id)
      navigate('/app/requests', { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to delete request')
      setDeleting(false)
    }
  }

  if (loading) {
    return <Loading overlay />
  }
  if (error && !request) {
    return <p className="px-4 py-8 text-sm text-danger sm:px-6">{error}</p>
  }
  if (!request) return null

  const matches = request.lead?.matches || []
  const unlocks = request.lead?.unlocks || []

  return (
    <section className="w-full space-y-6 px-4 py-8 text-left sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/app/requests" className="text-sm font-semibold text-primary">
          ← My requests
        </Link>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm font-semibold text-danger transition hover:border-danger/30 hover:bg-danger/5 disabled:opacity-60"
        >
          <Trash2 className="size-4" strokeWidth={2} />
          {deleting ? 'Deleting…' : 'Delete request'}
        </button>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
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
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
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

      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
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
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line px-4 py-3"
              >
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
    </section>
  )
}
