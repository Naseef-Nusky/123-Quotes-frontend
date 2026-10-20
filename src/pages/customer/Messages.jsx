import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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

export default function CustomerMessages() {
  const [searchParams] = useSearchParams()
  const prefillPro = searchParams.get('professionalId') || ''

  const [messages, setMessages] = useState([])
  const [pros, setPros] = useState([])
  const [professionalId, setProfessionalId] = useState(prefillPro)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [msgData, dir] = await Promise.all([api.myMessages(), api.getDirectory()])
      setMessages(msgData.messages || [])
      setPros(dir.professionals || [])
    } catch (e) {
      setError(e.message || 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (prefillPro) setProfessionalId(prefillPro)
  }, [prefillPro])

  const grouped = useMemo(() => {
    const map = new Map()
    for (const m of messages) {
      const key = m.professionalId
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(m)
    }
    for (const list of map.values()) {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    }
    return [...map.entries()]
  }, [messages])

  async function send(e) {
    e.preventDefault()
    if (!professionalId || !text.trim()) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await api.sendMessage({ professionalId, message: text.trim() })
      setText('')
      setNotice('Message sent.')
      await load()
    } catch (err) {
      setError(err.message || 'Failed to send')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <Loading overlay />

  return (
    <section className="w-full space-y-6 px-4 py-8 text-left sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Messages</h1>
        <p className="mt-1 text-sm text-muted">Contact professionals about your job.</p>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {notice ? <p className="text-sm text-emerald-700">{notice}</p> : null}

      <form onSubmit={send} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
        <label className="label">Professional</label>
        <select
          className="input-field mt-1 w-full"
          value={professionalId}
          onChange={(e) => setProfessionalId(e.target.value)}
          required
        >
          <option value="">Select a professional…</option>
          {pros.map((p) => (
            <option key={p.id} value={p.id}>
              {p.companyName}
              {p.city ? ` · ${p.city}` : ''}
            </option>
          ))}
        </select>
        <label className="label mt-4">Message</label>
        <textarea
          className="input-field mt-1 w-full"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your message…"
          required
        />
        <button type="submit" className="btn-primary mt-4" disabled={busy}>
          {busy ? 'Sending…' : 'Send message'}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-navy">Your conversations</h2>
        {!grouped.length ? (
          <p className="text-sm text-muted">No messages yet.</p>
        ) : (
          grouped.map(([proId, thread]) => {
            const company = thread[0]?.professional?.companyName || 'Professional'
            return (
              <div key={proId} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-navy">{company}</h3>
                  <Link
                    to={`/professionals/${proId}`}
                    className="text-sm font-semibold text-primary"
                  >
                    View profile
                  </Link>
                </div>
                <ul className="mt-3 space-y-2">
                  {thread.map((m) => (
                    <li
                      key={m.id}
                      className={`rounded-xl px-3 py-2 text-sm ${
                        m.senderRole === 'CUSTOMER'
                          ? 'ml-4 bg-primary/10'
                          : 'mr-4 bg-canvas'
                      }`}
                    >
                      <p className="text-[11px] text-muted">
                        {m.senderRole === 'CUSTOMER' ? 'You' : company} · {formatWhen(m.createdAt)}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-slate">{m.message}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
