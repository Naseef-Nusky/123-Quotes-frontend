import { useEffect, useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import Logo from '../components/Logo'
import { api } from '../api/client'

export default function Contact() {
  const [contact, setContact] = useState({
    email: '',
    phone: '',
    address: '',
  })
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .getContact()
      .then((d) => setContact(d.contact || {}))
      .catch(() => setStatus({ type: 'err', message: 'Could not load contact details from the server.' }))
      .finally(() => setLoading(false))
  }, [])

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setStatus({ type: '', message: '' })
    try {
      const data = await api.submitContact(form)
      setStatus({ type: 'ok', message: data.message || 'Thanks — we received your message.' })
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus({ type: 'err', message: err.message || 'Failed to send message' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <Logo to={false} size="lg" className="mb-6" />
      <h1 className="font-display text-4xl font-bold text-navy">Contact us</h1>
      <p className="mt-2 text-slate">Questions about quotes, accounts or partnerships? Send a note.</p>

      <div className="surface mt-6 space-y-3 p-5 text-sm text-slate">
        {loading ? <p className="text-muted">Loading contact details…</p> : null}
        <p className="flex items-start gap-2.5">
          <Mail className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2} />
          <span>
            <span className="font-semibold text-navy">Email:</span>{' '}
            {contact.email ? (
              <a className="text-primary hover:underline" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            ) : (
              '—'
            )}
          </span>
        </p>
        <p className="flex items-start gap-2.5">
          <Phone className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2} />
          <span>
            <span className="font-semibold text-navy">Phone:</span> {contact.phone || '—'}
          </span>
        </p>
        <p className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2} />
          <span>
            <span className="font-semibold text-navy">Address:</span> {contact.address || '—'}
          </span>
        </p>
      </div>

      <form onSubmit={onSubmit} className="surface mt-8 space-y-4 p-6">
        <div>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input id="name" required className="input-field" value={form.name} onChange={update('name')} />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="input-field"
            value={form.email}
            onChange={update('email')}
          />
        </div>
        <div>
          <label className="label" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            required
            rows={5}
            className="input-field"
            value={form.message}
            onChange={update('message')}
          />
        </div>
        {status.message ? (
          <p className={status.type === 'ok' ? 'text-success' : 'text-danger'}>{status.message}</p>
        ) : null}
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  )
}
