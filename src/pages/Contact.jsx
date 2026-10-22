import { useEffect, useState } from 'react'
import { Mail, MapPin, Send } from 'lucide-react'
import Loading from '../components/Loading'
import PageHero from '../components/PageHero'
import { BANNERS } from '../data/banners'
import Reveal from '../components/Reveal'
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
      setStatus({ type: 'ok', message: data.message || 'Thanks, we received your message.' })
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus({ type: 'err', message: err.message || 'Failed to send message' })
    } finally {
      setSubmitting(false)
    }
  }

  const infoCards = [
    {
      icon: Mail,
      label: 'Email us',
      value: contact.email ? (
        <a className="text-primary hover:underline" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
      ) : (
        '—'
      ),
      copy: 'We usually reply within one working day.',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: contact.address || '—',
      copy: 'Our London office. Appointments by email.',
    },
  ]

  return (
    <div>
      <PageHero
        image={BANNERS.contact}
        eyebrow="Contact"
        title="We would love to"
        highlight="hear from you"
        subtitle="Questions about quotes, accounts or partnerships? Send a note and our UK team will get back to you."
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-navy">Get in touch</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                Whether you are chasing a quote, growing your business, or reporting an issue,
                here is how to reach us.
              </p>
            </Reveal>
            {loading ? <Loading className="mt-6 py-6" /> : null}
            <div className="mt-6 space-y-5">
              {infoCards.map((card, i) => {
                const Icon = card.icon
                return (
                  <Reveal key={card.label} delay={i * 0.06}>
                    <div className="flex items-start gap-3.5">
                      <span className="bg-brand-gradient flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md shadow-primary-dark/20">
                        <Icon className="size-5" strokeWidth={2} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted">
                          {card.label}
                        </p>
                        <p className="mt-0.5 break-words text-sm font-bold text-navy">{card.value}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted">{card.copy}</p>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>

          <Reveal delay={0.1}>
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-line bg-white p-6 shadow-[0_24px_55px_-24px_rgba(10,47,92,0.35)] sm:p-8"
            >
              <h2 className="font-display text-2xl font-bold text-navy">Send a message</h2>
              <p className="mt-1.5 text-sm text-muted">
                Fill this in and we will reply to your email address.
              </p>
              <div className="mt-6 space-y-4">
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
                  <p
                    className={`rounded-xl px-4 py-3 text-sm font-medium ${
                      status.type === 'ok'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-danger'
                    }`}
                  >
                    {status.message}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="bg-brand-gradient inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white shadow-md shadow-primary-dark/25 transition hover:brightness-105 disabled:opacity-60"
                  disabled={submitting}
                >
                  <Send className="size-4" strokeWidth={2.25} />
                  {submitting ? 'Sending…' : 'Send message'}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
