import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
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

function answerSnippet(request) {
  const answers = request.answers || []
  if (!answers.length) return request.description || request.title || 'No details provided'
  return answers
    .map((a) => a.value)
    .filter(Boolean)
    .join('/')
}

export default function MyRequestedServices() {
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let cancelled = false
    api
      .myRequests()
      .then((d) => {
        if (cancelled) return
        const list = (d.requests || []).filter((r) => r.status !== 'DRAFT')
        setRequests(list)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load requests')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function onDelete(id) {
    if (!window.confirm('Delete this request? This cannot be undone.')) return
    setDeletingId(id)
    setError('')
    try {
      await api.deleteRequest(id)
      setRequests((list) => list.filter((r) => r.id !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete request')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="w-full px-4 py-8 text-left sm:px-6 sm:py-10">
      <h2 className="text-lg font-bold text-navy">Requested services</h2>
      <p className="mt-1 text-sm text-muted">Services you have already requested quotes for.</p>

      {loading ? <p className="mt-4 text-sm text-muted">Loading…</p> : null}
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {requests.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5"
          >
            <Link to={`/app/requests/${r.id}`} className="min-w-0 flex-1 text-left transition hover:opacity-90">
              <div className="flex flex-wrap items-start gap-3">
                <h3 className="text-lg font-bold text-navy">{r.service?.name || r.title || 'Service request'}</h3>
                <span className="rounded-full bg-navy px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  {timeAgo(r.submittedAt || r.createdAt)}
                </span>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate">{answerSnippet(r)}</p>
            </Link>
            <button
              type="button"
              onClick={() => onDelete(r.id)}
              disabled={deletingId === r.id}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm font-semibold text-danger transition hover:border-danger/30 hover:bg-danger/5 disabled:opacity-60"
            >
              <Trash2 className="size-4" strokeWidth={2} />
              {deletingId === r.id ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        ))}
      </div>

      {!loading && !requests.length && !error ? (
        <p className="mt-4 text-sm text-muted">No requested services yet.</p>
      ) : null}
    </section>
  )
}
