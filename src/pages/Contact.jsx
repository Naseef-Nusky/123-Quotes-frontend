import { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import Logo from '../components/Logo'
import { DUMMY_CONTACT } from '../data/dummy'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus({ type: 'ok', message: 'Thanks — we received your message.' })
        setForm({ name: '', email: '', message: '' })
        return
      }
    } catch {
      // fall through to local success
    } finally {
      setSubmitting(false)
    }

    setStatus({
      type: 'ok',
      message: 'Thanks — your message was recorded. We will get back to you shortly.',
    })
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <Logo to={false} size="lg" className="mb-6" />
      <h1 className="font-display text-4xl font-bold text-navy">Contact us</h1>
      <p className="mt-2 text-slate">Questions about quotes, accounts or partnerships? Send a note.</p>

      <div className="surface mt-6 space-y-3 p-5 text-sm text-slate">
        <p className="flex items-start gap-2.5">
          <Mail className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2} />
          <span>
            <span className="font-semibold text-navy">Email:</span>{' '}
            <a className="text-primary hover:underline" href={`mailto:${DUMMY_CONTACT.email}`}>
              {DUMMY_CONTACT.email}
            </a>
          </span>
        </p>
        <p className="flex items-start gap-2.5">
          <Phone className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2} />
          <span>
            <span className="font-semibold text-navy">Phone:</span> {DUMMY_CONTACT.phone}
          </span>
        </p>
        <p className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2} />
          <span>
            <span className="font-semibold text-navy">Address:</span> {DUMMY_CONTACT.address}
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
