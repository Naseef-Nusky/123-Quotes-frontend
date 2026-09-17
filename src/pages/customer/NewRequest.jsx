import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../api/client'
import QuestionField from '../../components/QuestionField'
import {
  answersToPayload,
  getVisibleQuestions,
  validateRequired,
} from '../../utils/questionnaire'

const STEPS = ['Service', 'Questions', 'Location', 'Submit']

export default function NewRequest() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [services, setServices] = useState([])
  const [serviceId, setServiceId] = useState(params.get('service') || '')
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [location, setLocation] = useState({
    postcode: '',
    city: '',
    address: '',
    description: '',
    title: '',
  })
  const [requestId, setRequestId] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api.getServices().then((d) => setServices(d.services || [])).catch((e) => setError(e.message))
  }, [])

  useEffect(() => {
    if (!serviceId) {
      setQuestions([])
      return
    }
    let alive = true
    ;(async () => {
      try {
        const data = await api.getQuestionnaire(serviceId)
        if (alive) {
          setQuestions(data.questions || [])
          setAnswers({})
        }
      } catch (e) {
        if (alive) setError(e.message)
      }
    })()
    return () => {
      alive = false
    }
  }, [serviceId])

  const visible = useMemo(() => getVisibleQuestions(questions, answers), [questions, answers])

  async function goNext() {
    setError('')
    if (step === 0) {
      if (!serviceId) return setError('Select a service')
      setStep(1)
      return
    }
    if (step === 1) {
      const missing = validateRequired(visible, answers)
      if (missing.length) return setError(`Please answer: ${missing.join(', ')}`)
      setStep(2)
      return
    }
    if (step === 2) {
      if (!location.postcode.trim()) return setError('Postcode is required')
      setStep(3)
    }
  }

  async function handleSubmit() {
    setBusy(true)
    setError('')
    try {
      let id = requestId
      if (!id) {
        const created = await api.createRequest({
          serviceId,
          postcode: location.postcode,
          city: location.city,
          address: location.address,
          description: location.description,
          title: location.title,
        })
        id = created.request.id
        setRequestId(id)
      }
      await api.saveAnswers(id, answersToPayload(answers, visible))
      const data = await api.submitRequest(id, {
        postcode: location.postcode,
        city: location.city,
        address: location.address,
        description: location.description,
      })
      navigate(`/app/requests/${data.request.id}`)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <span
            key={label}
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              i === step
                ? 'bg-primary text-white'
                : i < step
                  ? 'bg-blue-100 text-primary'
                  : 'border border-line bg-white text-muted'
            }`}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      <div className="surface p-6">
        {step === 0 ? (
          <div className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-navy">Select a service</h2>
            {services.map((s) => (
              <label
                key={s.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                  serviceId === s.id ? 'border-primary bg-blue-50' : 'border-line'
                }`}
              >
                <input
                  type="radio"
                  name="service"
                  className="mt-1 accent-primary"
                  checked={serviceId === s.id}
                  onChange={() => setServiceId(s.id)}
                />
                <span>
                  <span className="block font-bold text-navy">{s.name}</span>
                  <span className="text-sm text-muted">{s.shortDesc}</span>
                </span>
              </label>
            ))}
          </div>
        ) : null}

        {step === 1 ? (
          <div className="space-y-5">
            <h2 className="font-display text-2xl font-bold text-navy">Tell us about the job</h2>
            {visible.map((q) => (
              <QuestionField
                key={q.id}
                question={q}
                value={answers[q.id]}
                onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
              />
            ))}
            {!visible.length ? <p className="text-muted">No questions for this service.</p> : null}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-navy">Where is the job?</h2>
            <div>
              <label className="label">Postcode *</label>
              <input
                className="input-field"
                value={location.postcode}
                onChange={(e) => setLocation({ ...location, postcode: e.target.value })}
              />
            </div>
            <div>
              <label className="label">City</label>
              <input
                className="input-field"
                value={location.city}
                onChange={(e) => setLocation({ ...location, city: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Address</label>
              <input
                className="input-field"
                value={location.address}
                onChange={(e) => setLocation({ ...location, address: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Additional notes</label>
              <textarea
                className="input-field"
                rows={3}
                value={location.description}
                onChange={(e) => setLocation({ ...location, description: e.target.value })}
              />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-navy">Review & submit</h2>
            <p className="text-sm text-slate">
              Service: <strong>{services.find((s) => s.id === serviceId)?.name}</strong>
            </p>
            <p className="text-sm text-slate">
              Location: <strong>{location.postcode}</strong>
              {location.city ? `, ${location.city}` : ''}
            </p>
            <p className="text-sm text-muted">{visible.length} questionnaire answer(s) ready.</p>
            <p className="text-sm text-muted">
              Submitting will match nearby professionals. Contact details stay private until a pro unlocks the lead.
            </p>
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

        <div className="mt-8 flex flex-wrap gap-3">
          {step > 0 ? (
            <button type="button" className="btn-secondary" onClick={() => setStep((s) => s - 1)} disabled={busy}>
              Back
            </button>
          ) : (
            <Link to="/app" className="btn-secondary">
              Cancel
            </Link>
          )}
          {step < 3 ? (
            <button type="button" className="btn-primary" onClick={goNext} disabled={busy}>
              Continue
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={handleSubmit} disabled={busy}>
              {busy ? 'Submitting…' : 'Submit request'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
