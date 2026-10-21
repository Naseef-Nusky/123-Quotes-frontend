import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import Loading from '../../components/Loading'

function formatWhen(date) {
  if (!date) return ''
  return new Date(date).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function RequestSent() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    api
      .messageSent()
      .then((d) => {
        if (alive) setMessages(d.messages || [])
      })
      .catch((e) => {
        if (alive) setError(e.message || 'Failed to load sent messages')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  if (loading) return <Loading overlay />

  return (
    <section className="w-full px-4 py-8 text-left sm:px-6">
      <h1 className="text-2xl font-bold text-navy">Request Sent</h1>
      <p className="mt-1 text-sm text-muted">Messages and quotation requests you have sent.</p>
      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

      {!messages.length ? (
        <p className="mt-8 text-base text-navy">You have not sent any messages yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
          {messages.map((m) => {
            // Pro → pro quotation requests have no customer; show the business sent to.
            const name =
              [m.customer?.firstName, m.customer?.lastName].filter(Boolean).join(' ') ||
              (m.senderProfessionalId ? m.professional?.companyName : '') ||
              'Customer'
            const email = m.customer?.email || (m.senderProfessionalId ? m.professional?.email : '') || ''
            return (
              <li key={m.id} className="px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-bold text-navy">{name}</p>
                  <p className="text-xs text-muted">{formatWhen(m.createdAt)}</p>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate">{m.message}</p>
                <p className="mt-1 text-xs text-muted">{email}</p>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
