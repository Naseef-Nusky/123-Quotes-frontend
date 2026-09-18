import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const STEPS = ['details', 'location', 'done']

export default function BusinessSignup() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const service = params.get('service') || 'Web Development'
  const step = params.get('step') || 'details'

  const [form, setForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    website: '',
    locationType: 'radius',
    radius: '50',
    postcode: '',
  })

  const stepIndex = STEPS.indexOf(step)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function go(nextStep) {
    const q = new URLSearchParams({ service, step: nextStep })
    navigate(`/business/signup?${q}`)
  }

  function submitDetails(e) {
    e.preventDefault()
    sessionStorage.setItem('businessSignup', JSON.stringify({ ...form, service }))
    go('location')
  }

  function submitLocation(e) {
    e.preventDefault()
    const saved = JSON.parse(sessionStorage.getItem('businessSignup') || '{}')
    sessionStorage.setItem('businessSignup', JSON.stringify({ ...saved, ...form, service }))
    go('done')
  }

  const serviceLabel = useMemo(() => service, [service])

  if (step === 'done') {
    return (
      <section className="flex min-h-[65vh] items-center justify-center px-4 py-16">
        <p className="max-w-2xl text-center text-xl font-medium text-navy sm:text-2xl">
          Thank You For Submitting Your Details, Your Application Is Currently Under Review.
        </p>
      </section>
    )
  }

  if (step === 'location') {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-12 sm:px-6">
        <form onSubmit={submitLocation} className="wizard-card w-full p-8 sm:p-10">
          <h1 className="text-center text-2xl font-bold text-navy sm:text-3xl">
            What Location Would You Like To See Leads From?
          </h1>
          <p className="mt-2 text-center text-slate">Tell Us The Locations You Cover For Business?</p>

          <div className="mt-10 space-y-5">
            <label className="flex flex-wrap items-center gap-3 text-sm font-semibold text-navy">
              <input
                type="radio"
                name="locationType"
                value="radius"
                checked={form.locationType === 'radius'}
                onChange={update('locationType')}
                className="size-4 accent-primary"
              />
              <span>I want clients within</span>
              <select
                className="input-field !w-auto !py-2"
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
              <span>from</span>
              <input
                className="input-field !max-w-[160px] !py-2"
                placeholder="Postcode"
                value={form.postcode}
                onChange={update('postcode')}
                disabled={form.locationType !== 'radius'}
                required={form.locationType === 'radius'}
              />
            </label>

            <label className="flex items-center gap-3 text-sm font-semibold text-navy">
              <input
                type="radio"
                name="locationType"
                value="nationwide"
                checked={form.locationType === 'nationwide'}
                onChange={update('locationType')}
                className="size-4 accent-primary"
              />
              I want client nationwide
            </label>
          </div>

          <div className="mt-10 flex justify-end">
            <button type="submit" className="btn-primary !rounded-md">
              Next
            </button>
          </div>
        </form>
      </section>
    )
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-12 sm:px-6">
      <form onSubmit={submitDetails} className="wizard-card w-full p-8 sm:p-10">
        <h1 className="text-center text-2xl font-bold text-navy sm:text-3xl">Finally, Just A Few Details</h1>
        <p className="mt-2 text-center text-slate">
          Give Us Your Details, You Are Steps Away From Seeing {serviceLabel} Leads
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="label">Your name</label>
            <input className="input-field" required value={form.name} onChange={update('name')} />
          </div>
          <div>
            <label className="label">Company name</label>
            <input className="input-field" value={form.companyName} onChange={update('companyName')} />
            <p className="mt-1 text-xs text-muted">
              If you aren&apos;t a business or don&apos;t have this information, you can leave this blank
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
            <input className="input-field" required value={form.phone} onChange={update('phone')} />
          </div>
          <div>
            <label className="label">Website (optional)</label>
            <input className="input-field" value={form.website} onChange={update('website')} />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            Step {Math.max(stepIndex + 1, 1)} of 2 · Already registered?{' '}
            <Link to="/login" className="font-semibold text-primary">
              Login
            </Link>
          </p>
          <button type="submit" className="btn-primary !rounded-md !bg-success hover:!brightness-95">
            See new leads
          </button>
        </div>
      </form>
    </section>
  )
}
