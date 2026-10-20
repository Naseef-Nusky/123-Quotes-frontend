import { useEffect, useMemo, useState } from 'react'
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

export default function ClientRequests() {
  const [messages, setMessages] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await api.messageInbox()
      setMessages(data.messages || [])
    } catch (e) {
      setError(e.message || 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const selected = useMemo(
    () => messages.find((m) => m.id === selectedId) || null,
    [messages, selectedId],
  )

  const thread = useMemo(() => {
    if (!selected) return []
    return messages
      .filter(
        (m) =>
          m.customerId === selected.customerId && m.professionalId === selected.professionalId,
      )
      .slice()
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }, [messages, selected])

  async function sendReply(e) {
    e.preventDefault()
    if (!selected?.customerId || !reply.trim()) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await api.sendMessage({ customerId: selected.customerId, message: reply.trim() })
      setReply('')
      setNotice('Reply sent.')
      await load()
    } catch (err) {
      setError(err.message || 'Failed to send reply')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <Loading overlay />

  return (
    <section className="w-full px-4 py-8 text-left sm:px-6">
      <h1 className="text-2xl font-bold text-navy">Client Requests</h1>
      <p className="mt-1 text-sm text-muted">Messages from customers (inbox).</p>
      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      {notice ? <p className="mt-3 text-sm text-emerald-700">{notice}</p> : null}

      {!messages.length ? (
        <p className="mt-8 text-base text-navy">Keep an eye out for new requests coming through!</p>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr]">
          <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
            {messages.map((m) => {
              const name = [m.customer?.firstName, m.customer?.lastName].filter(Boolean).join(' ')
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(m.id)}
                    className={`w-full px-4 py-3 text-left transition hover:bg-canvas ${
                      selectedId === m.id ? 'bg-canvas' : ''
                    }`}
                  >
                    <p className="text-sm font-bold text-navy">{name || 'Customer'}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted">{m.message}</p>
                    <p className="mt-1 text-[11px] text-muted">{formatWhen(m.createdAt)}</p>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="rounded-2xl border border-line bg-white p-5">
            {!selected ? (
              <p className="text-sm text-muted">Select a message to view the thread and reply.</p>
            ) : (
              <>
                <h2 className="text-lg font-bold text-navy">
                  {[selected.customer?.firstName, selected.customer?.lastName]
                    .filter(Boolean)
                    .join(' ') || 'Customer'}
                </h2>
                <p className="text-sm text-muted">{selected.customer?.email || ''}</p>
                <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto">
                  {thread.map((m) => (
                    <li
                      key={m.id}
                      className={`rounded-xl px-3 py-2 text-sm ${
                        m.senderRole === 'PROFESSIONAL'
                          ? 'ml-6 bg-primary/10 text-navy'
                          : 'mr-6 bg-canvas text-slate'
                      }`}
                    >
                      <p className="text-[11px] font-semibold text-muted">
                        {m.senderRole === 'PROFESSIONAL' ? 'You' : 'Customer'} ·{' '}
                        {formatWhen(m.createdAt)}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap">{m.message}</p>
                    </li>
                  ))}
                </ul>
                <form onSubmit={sendReply} className="mt-4 space-y-3">
                  <textarea
                    rows={3}
                    className="input-field w-full"
                    placeholder="Write a reply…"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-primary !rounded-md" disabled={busy}>
                    {busy ? 'Sending…' : 'Send reply'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
