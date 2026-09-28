import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { api } from '../api/client'
import PostcodeInput from '../components/PostcodeInput'
import PhoneInput from '../components/PhoneInput'
import {
  DEFAULT_COUNTRY_CODE,
  COUNTRY_DIAL_CODES,
  formatIntlPhone,
} from '../data/countryDialCodes'

const STORAGE_KEY = 'business_signup_draft'

function loadDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveDraft(data) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function clearDraft() {
  sessionStorage.removeItem(STORAGE_KEY)
}

function randomPassword() {
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#'
  let out = ''
  for (let i = 0; i < 14; i += 1) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

function WizardShell({ children }) {
  return (
    <section className="relative isolate min-h-[70vh] overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(30,143,213,0.16),_transparent_55%),linear-gradient(180deg,#f4f8fc_0%,#ffffff_45%,#eef6fc_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-24 -z-10 size-72 rounded-full bg-[#3baee8]/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-10 -z-10 size-80 rounded-full bg-[#0a3a7a]/10 blur-3xl"
        aria-hidden
      />

      <div className="mx-auto w-full max-w-3xl animate-fade-up">{children}</div>
    </section>
  )
}

function WizardCard({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-[#cfe0ef] bg-white/90 p-6 shadow-[0_20px_50px_rgba(10,47,92,0.1)] backdrop-blur-sm sm:p-9 ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * Business signup flow:
 * 1. Service search → Get started
 * 2. Location → Next
 * 3. Details → See new leads
 * 4. Under review
 */
export default function BusinessSignup() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const step = params.get('step') || 'start'
  const serviceParam = params.get('service') || ''

  const draft = loadDraft()
  const [serviceQuery, setServiceQuery] = useState(serviceParam || draft.serviceQuery || '')
  const [serviceName, setServiceName] = useState(serviceParam || draft.serviceName || '')
  const [services, setServices] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [form, setForm] = useState({
    name: draft.name || '',
    companyName: draft.companyName || '',
    email: draft.email || '',
    phone: draft.phone || '',
    countryCode: draft.countryCode || DEFAULT_COUNTRY_CODE,
    website: draft.website || '',
    locationType: draft.locationType || 'radius',
    radius: draft.radius || '50',
    postcode: draft.postcode || '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [doneState, setDoneState] = useState(null) // { existing, active, message }

  useEffect(() => {
    api
      .getServices()
      .then((d) => setServices(d.services || []))
      .catch(() => setServices([]))
  }, [])

  useEffect(() => {
    saveDraft({
      ...form,
      serviceQuery,
      serviceName: serviceName || serviceQuery,
    })
  }, [form, serviceQuery, serviceName])

  const suggestions = useMemo(() => {
    const q = serviceQuery.trim().toLowerCase()
    if (!q) return services.slice(0, 8)
    return services
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category?.name?.toLowerCase().includes(q) ||
          s.slug?.toLowerCase().includes(q),
      )
      .slice(0, 8)
  }, [services, serviceQuery])

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function go(nextStep, nextService) {
    const q = new URLSearchParams()
    const svc = nextService || serviceName || serviceQuery || serviceParam
    if (svc) q.set('service', svc)
    q.set('step', nextStep)
    navigate(`/business/signup?${q}`)
  }

  function startSignup(e) {
    e.preventDefault()
    setError('')
    const chosen = (serviceName || serviceQuery).trim()
    if (!chosen) {
      setError('Please enter the type of business or service you provide.')
      return
    }
    setServiceName(chosen)
    go('location', chosen)
  }

  function submitLocation(e) {
    e.preventDefault()
    setError('')
    if (form.locationType === 'radius' && !form.postcode.trim()) {
      setError('Please enter a postcode for your coverage area.')
      return
    }
    go('details')
  }

  async function submitDetails(e) {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Name, email and phone are required.')
      return
    }

    setSubmitting(true)
    try {
      const svc = (serviceName || serviceQuery || serviceParam || 'General').trim()
      const dial =
        COUNTRY_DIAL_CODES.find((c) => c.code === form.countryCode)?.dial || '44'
      const data = await api.registerProfessional({
        email: form.email.trim(),
        password: randomPassword(),
        contactName: form.name.trim(),
        companyName: (form.companyName || form.name).trim(),
        phone: formatIntlPhone(dial, form.phone),
        website: form.website.trim() || undefined,
        postcode: form.locationType === 'nationwide' ? 'UK' : form.postcode.trim(),
        serviceName: svc,
        radiusMiles: form.locationType === 'radius' ? Number(form.radius) : null,
        nationwide: form.locationType === 'nationwide',
      })

      if (data.token) {
        localStorage.setItem('token', data.token)
      }

      clearDraft()
      setDoneState({
        existing: Boolean(data.existing),
        updated: Boolean(data.updated),
        active: Boolean(data.token) || data.user?.status === 'ACTIVE',
        message: data.message || '',
        service: svc,
      })
      go('done', svc)
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  const serviceLabel = serviceName || serviceQuery || serviceParam || 'your'

  if (step === 'done') {
    const existing = doneState?.existing
    const updated = doneState?.updated
    const active = doneState?.active && updated
    return (
      <WizardShell>
        <WizardCard className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
            Thank You For Submitting Your Details
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-slate sm:text-lg">
            {doneState?.message ||
              (existing
                ? 'Your additional business application is under review. An admin will approve it before it goes live.'
                : "Your application is currently under review. We'll email you once it's approved so you can start viewing leads.")}
          </p>
          {active ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="btn-primary !rounded-xl px-8"
                onClick={() => {
                  window.location.href = '/pro/leads'
                }}
              >
                See new leads
              </button>
            </div>
          ) : null}
        </WizardCard>
      </WizardShell>
    )
  }

  if (step === 'location') {
    return (
      <WizardShell>
        <form onSubmit={submitLocation}>
          <WizardCard>
            <h1 className="text-center text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              What Location Would You Like To See Leads From?
            </h1>
            <p className="mt-2 text-center text-slate">
              Tell us the locations you cover for business
            </p>

            <div className="mt-8 space-y-4">
              <label
                className={`flex cursor-pointer flex-col gap-3 rounded-xl border p-4 transition ${
                  form.locationType === 'radius'
                    ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                    : 'border-line bg-canvas/60 hover:border-primary/40'
                }`}
              >
                <span className="flex items-center gap-3 text-sm font-bold text-navy">
                  <input
                    type="radio"
                    name="locationType"
                    value="radius"
                    checked={form.locationType === 'radius'}
                    onChange={update('locationType')}
                    className="size-4 accent-primary"
                  />
                  I want clients within
                </span>
                <div className="flex flex-wrap items-center gap-3 pl-7">
                  <select
                    className="input-field !w-auto !py-2.5"
                    value={form.radius}
                    onChange={update('radius')}
                    disabled={form.locationType !== 'radius'}
                  >
                    {['10', '25', '50', '100'].map((m) => (
                      <option key={m} value={m}>
                        {m} miles
                      </option>
                    ))}
                  </select>
                  <span className="text-sm font-semibold text-navy">from</span>
                  <div className="min-w-[160px] flex-1">
                    <PostcodeInput
                      value={form.postcode}
                      onChange={(v) => setForm((f) => ({ ...f, postcode: v }))}
                      placeholder="Postcode"
                      disabled={form.locationType !== 'radius'}
                      className="input-field !py-2.5 uppercase"
                    />
                  </div>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                  form.locationType === 'nationwide'
                    ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                    : 'border-line bg-canvas/60 hover:border-primary/40'
                }`}
              >
                <input
                  type="radio"
                  name="locationType"
                  value="nationwide"
                  checked={form.locationType === 'nationwide'}
                  onChange={update('locationType')}
                  className="size-4 accent-primary"
                />
                <span className="text-sm font-bold text-navy">I want clients nationwide</span>
              </label>
            </div>

            {error ? <p className="mt-4 text-sm font-medium text-danger">{error}</p> : null}

            <div className="mt-8 flex justify-end">
              <button type="submit" className="btn-primary !rounded-xl px-8">
                Next
              </button>
            </div>
          </WizardCard>
        </form>
      </WizardShell>
    )
  }

  if (step === 'details') {
    return (
      <WizardShell>
        <form onSubmit={submitDetails}>
          <WizardCard>
            <h1 className="text-center text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Finally, Just A Few Details
            </h1>
            <p className="mt-2 text-center text-slate">
              Give us your details — you&apos;re steps away from seeing{' '}
              <span className="font-semibold text-primary">{serviceLabel}</span> leads
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <label className="label">Your name</label>
                <input
                  className="input-field"
                  required
                  value={form.name}
                  onChange={update('name')}
                />
              </div>
              <div>
                <label className="label">Company name</label>
                <input
                  className="input-field"
                  value={form.companyName}
                  onChange={update('companyName')}
                />
                <p className="mt-1.5 text-xs text-muted">
                  If you aren&apos;t a business or don&apos;t have this information, you can leave
                  this blank
                </p>
              </div>
              <div>
                <label className="label">Email address</label>
                <input
                  type="email"
                  className="input-field"
                  required
                  value={form.email}
                  onChange={update('email')}
                />
              </div>
              <div>
                <label className="label">Phone number</label>
                <PhoneInput
                  dialCode={form.countryCode}
                  onDialCodeChange={(code) => setForm((f) => ({ ...f, countryCode: code }))}
                  value={form.phone}
                  onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                />
              </div>
              <div>
                <label className="label">Website (optional)</label>
                <input
                  className="input-field"
                  value={form.website}
                  onChange={update('website')}
                  placeholder="https://"
                />
              </div>
            </div>

            {error ? <p className="mt-4 text-sm font-medium text-danger">{error}</p> : null}

            <div className="mt-8 flex justify-end">
              <button type="submit" className="btn-primary !rounded-xl px-8" disabled={submitting}>
                {submitting ? 'Submitting…' : 'See new leads'}
              </button>
            </div>
          </WizardCard>
        </form>
      </WizardShell>
    )
  }

  return (
    <WizardShell>
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
          Grow your business
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.75rem]">
          Find The Best Opportunities For Your Business.
        </h1>
        <p className="mt-3 text-lg text-slate">View local opportunities near you</p>
      </div>

      <form onSubmit={startSignup} className="relative mx-auto mt-10 max-w-2xl">
        <WizardCard className="!p-3 sm:!p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-primary" />
              <input
                className="input-field !rounded-xl !border-line !py-3.5 !pl-10"
                placeholder="What type of business or service do you provide?"
                value={serviceQuery}
                onChange={(e) => {
                  setServiceQuery(e.target.value)
                  setServiceName('')
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                autoComplete="off"
              />
              {showSuggestions && suggestions.length ? (
                <ul className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-line bg-white py-1 shadow-xl shadow-navy/10">
                  {suggestions.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        className="flex w-full flex-col px-3.5 py-2.5 text-left text-sm transition hover:bg-primary/10"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setServiceQuery(s.name)
                          setServiceName(s.name)
                          setShowSuggestions(false)
                        }}
                      >
                        <span className="font-semibold text-navy">{s.name}</span>
                        {s.category?.name ? (
                          <span className="text-xs text-muted">{s.category.name}</span>
                        ) : null}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <button type="submit" className="btn-primary shrink-0 !rounded-xl px-7 !py-3.5">
              Get started
            </button>
          </div>
        </WizardCard>
        {error ? <p className="mt-4 text-center text-sm font-medium text-danger">{error}</p> : null}
      </form>
    </WizardShell>
  )
}
