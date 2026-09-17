import { useState } from 'react'
import { api } from '../api/client.js'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setStatus({ type: '', message: '' })
    try {
      await api.submitLead(form)
      setStatus({ type: 'success', message: 'Thanks! We will get back to you soon.' })
      setForm({ name: '', email: '', phone: '', company: '', message: '' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong.' })
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass =
    'mt-1 w-full rounded-md border border-mist bg-white px-3 py-2.5 text-sm outline-none ring-sea/30 focus:ring-2'

  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-4xl font-bold text-ink">Contact</h1>
      <p className="mt-2 text-slate">Request a custom quote pack or ask about partnerships.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-mist bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-ink">
            Name *
            <input className={fieldClass} name="name" value={form.name} onChange={onChange} required />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Email *
            <input
              className={fieldClass}
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-ink">
            Phone
            <input className={fieldClass} name="phone" value={form.phone} onChange={onChange} />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Company
            <input className={fieldClass} name="company" value={form.company} onChange={onChange} />
          </label>
        </div>
        <label className="block text-sm font-semibold text-ink">
          Message *
          <textarea
            className={`${fieldClass} min-h-28`}
            name="message"
            value={form.message}
            onChange={onChange}
            required
          />
        </label>

        {status.message && (
          <p
            className={`rounded-md px-3 py-2 text-sm ${
              status.type === 'success' ? 'bg-sea/10 text-sea' : 'bg-coral/10 text-coral'
            }`}
          >
            {status.message}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-sea px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sea-dark disabled:opacity-60"
        >
          {submitting ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </section>
  )
}
