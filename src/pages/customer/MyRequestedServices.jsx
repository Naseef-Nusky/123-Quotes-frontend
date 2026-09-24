import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {loading ? <p className="text-sm text-muted">Loading…</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <div className="divide-y divide-line">
        {requests.map((r) => (
          <Link
            key={r.id}
            to={`/app/requests/${r.id}`}
            className="block py-5 transition hover:bg-slate-50/80"
          >
            <div className="flex flex-wrap items-start gap-3">
              <h2 className="text-lg font-bold text-navy">{r.service?.name || r.title || 'Service request'}</h2>
              <span className="rounded bg-slate-700 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                {timeAgo(r.submittedAt || r.createdAt)}
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate">{answerSnippet(r)}</p>
          </Link>
        ))}
      </div>

      {!loading && !requests.length && !error ? (
        <p className="py-8 text-sm text-muted">No requested services yet.</p>
      ) : null}
    </div>
  )
}
