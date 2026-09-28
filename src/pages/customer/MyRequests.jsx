import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { api } from '../../api/client'
import StatusBadge from '../../components/StatusBadge'

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

export default function MyRequests() {
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const d = await api.myRequests()
      setRequests(d.requests || [])
    } catch (err) {
      setError(err.message || 'Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-navy">My requests</h2>
          <p className="mt-1 text-sm text-muted">Track and manage your quote requests.</p>
        </div>
        <Link
          to="/app/requests/new"
          className="inline-flex rounded-xl bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-105"
        >
          New request
        </Link>
      </div>

      {loading ? <p className="mt-4 text-sm text-muted">Loading…</p> : null}
      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      <div className="mt-4 space-y-3">
        {requests.map((r) => (
          <article
            key={r.id}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5"
          >
            <Link to={`/app/requests/${r.id}`} className="min-w-0 flex-1 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-navy">{r.service?.name || r.title || 'Service request'}</h3>
                <StatusBadge status={r.status} />
                <span className="rounded-full bg-navy/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {timeAgo(r.submittedAt || r.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate">
                {r.postcode || '—'}
                {r.city ? ` · ${r.city}` : ''}
              </p>
            </Link>
            <button
              type="button"
              onClick={() => onDelete(r.id)}
              disabled={deletingId === r.id}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm font-semibold text-danger transition hover:border-danger/30 hover:bg-danger/5 disabled:opacity-60"
            >
              <Trash2 className="size-4" strokeWidth={2} />
              {deletingId === r.id ? 'Deleting…' : 'Delete'}
            </button>
          </article>
        ))}
      </div>

      {!loading && !requests.length && !error ? (
        <p className="mt-4 text-sm text-muted">No requests yet.</p>
      ) : null}
    </section>
  )
}
