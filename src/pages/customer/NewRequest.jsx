import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import Loading from '../../components/Loading'
import QuestionField from '../../components/QuestionField'
import PostcodeInput from '../../components/PostcodeInput'
import PhoneInput from '../../components/PhoneInput'
import {
  COMMON_STEPS,
  FREQUENCY_OPTIONS,
  CheckboxOptionList,
  RadioOptionList,
  WizardFooter,
  WizardShell,
} from '../../components/RequestWizardShell'
import {
  isMultiOptionSelected,
  isSingleOptionSelected,
  optionToken,
  toggleMultiOption,
} from '../../utils/questionOptions'
import { choiceControlKind, isMultiChoiceType, isSingleChoiceType } from '../../utils/questionTypes'
import {
  answersToPayload,
  getVisibleQuestions,
  validateRequired,
} from '../../utils/questionnaire'
import {
  DEFAULT_COUNTRY_CODE,
  dialForCountry,
  formatIntlPhone,
  parseIntlPhone,
} from '../../data/countryDialCodes'

function splitName(full) {
  const parts = String(full || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return { firstName: '', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

function PageBackdrop({ services, onSelect }) {
  const list = services.length ? services : [{ id: '1' }, { id: '2' }, { id: '3' }]

  return (
    <div className="relative isolate overflow-hidden bg-canvas" aria-hidden={!onSelect}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(ellipse_at_top,_rgba(30,143,213,0.16),_transparent_55%),linear-gradient(180deg,#e8f4fb_0%,#f4f8fc_60%,#f4f8fc_100%)]"
        aria-hidden
      />
      <div className="relative w-full px-4 py-8 text-left sm:px-6 sm:py-10 lg:px-8">
        <h1 className="text-lg font-bold text-navy">Services</h1>
        <p className="mt-1 text-sm text-muted">
          Choose a service to start a quote request.
        </p>

        <ul className="mt-4 divide-y divide-line/80 overflow-hidden rounded-2xl border border-line/80 bg-white/80 shadow-[0_18px_50px_-28px_rgba(10,47,92,0.35)] backdrop-blur-sm">
          {list.map((s) => {
            const content = (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    {s.category?.name || 'Service'}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-navy">
                    {s.name || '…'}
                  </h2>
                  {s.shortDesc || s.description ? (
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate">
                      {s.shortDesc || s.description}
                    </p>
                  ) : null}
                </div>
                {s.name ? (
                  <span className="shrink-0 self-center text-sm font-bold text-primary">
                    Get quotes →
                  </span>
                ) : null}
              </>
            )

            if (onSelect && s.name) {
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(s.id)}
                    className="flex w-full items-stretch gap-4 px-5 py-5 text-left transition hover:bg-[#eef7fc]/90 sm:gap-6 sm:px-7 sm:py-6"
                  >
                    {content}
                  </button>
                </li>
              )
            }

            return (
              <li key={s.id} className="flex items-stretch gap-4 px-5 py-5 sm:gap-6 sm:px-7 sm:py-6">
                {content}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function withBackdrop(services, modal, onSelect) {
  return (
    <>
      <PageBackdrop services={services} onSelect={onSelect} />
      {modal}
    </>
  )
}

export default function NewRequest() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { isCustomer, user } = useAuth()

  const [services, setServices] = useState([])
  const [serviceId, setServiceId] = useState('')
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [qIndex, setQIndex] = useState(0)
  const [commonIndex, setCommonIndex] = useState(-1)

  const [frequency, setFrequency] = useState('')
  const [postcode, setPostcode] = useState('')
  const [email, setEmail] = useState(user?.email || '')
  const [marketing, setMarketing] = useState(true)
  const [fullName, setFullName] = useState(
    [user?.customer?.firstName, user?.customer?.lastName].filter(Boolean).join(' ') || '',
  )
  const initialPhone = parseIntlPhone(user?.customer?.phone || '')
  const [phone, setPhone] = useState(initialPhone.localNumber)
  const [countryCode, setCountryCode] = useState(
    initialPhone.countryCode || DEFAULT_COUNTRY_CODE,
  )
  const [details, setDetails] = useState('')
  const [files, setFiles] = useState([null, null, null])

  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [done, setDone] = useState(null)

  const serviceParam = params.get('service') || ''

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const d = await api.getServices()
        if (!alive) return
        const list = d.services || []
        setServices(list)
        const match =
          list.find((s) => s.id === serviceParam) ||
          list.find((s) => s.slug === serviceParam) ||
          null
        if (match) {
          setQuestionsLoading(true)
          setQuestions([])
          setServiceId(match.id)
        } else setServiceId('')
      } catch (e) {
        if (alive) setError(e.message)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [serviceParam])

  useEffect(() => {
    if (!serviceId) {
      setQuestions([])
      setQuestionsLoading(false)
      return
    }
    let alive = true
    setQuestionsLoading(true)
    setQuestions([])
    ;(async () => {
      try {
        const data = await api.getQuestionnaire(serviceId)
        if (!alive) return
        setQuestions(data.questions || [])
        setAnswers({})
        setQIndex(0)
        setCommonIndex(-1)
      } catch (e) {
        if (alive) setError(e.message)
      } finally {
        if (alive) setQuestionsLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [serviceId])

  const visible = useMemo(() => getVisibleQuestions(questions, answers), [questions, answers])
  const currentQuestion = commonIndex < 0 ? visible[qIndex] : null
  const commonStep = commonIndex >= 0 ? COMMON_STEPS[commonIndex] : null
  const serviceName = services.find((s) => s.id === serviceId)?.name || 'Service'

  function close() {
    // Close the wizard and return to the service list on this page
    // (don't leave New Request / jump to dashboard).
    setServiceId('')
    setQuestions([])
    setQuestionsLoading(false)
    setAnswers({})
    setQIndex(0)
    setCommonIndex(-1)
    setError('')
    setDone(null)
    setBusy(false)
    setFrequency('')
    setDetails('')
    setFiles([null, null, null])
  }

  function goBack() {
    setError('')
    if (commonIndex > 0) {
      setCommonIndex((i) => i - 1)
      return
    }
    if (commonIndex === 0) {
      setCommonIndex(-1)
      if (visible.length) setQIndex(Math.max(0, visible.length - 1))
      return
    }
    if (qIndex > 0) setQIndex((i) => i - 1)
  }

  function goNextFromQuestion() {
    setError('')
    if (!currentQuestion) {
      setCommonIndex(0)
      return
    }
    if (currentQuestion.isRequired) {
      const missing = validateRequired([currentQuestion], answers)
      if (missing.length) {
        const isText =
          currentQuestion.type === 'TEXT' || currentQuestion.type === 'TEXTAREA'
        const isMulti = isMultiChoiceType(currentQuestion.type)
        setError(
          isText
            ? 'Please enter an answer to continue'
            : isMulti
              ? 'Please select at least one option to continue'
              : 'Please select an option to continue',
        )
        return
      }
    }
    if (qIndex < visible.length - 1) {
      setQIndex((i) => i + 1)
      return
    }
    setCommonIndex(0)
  }

  async function goNextCommon() {
    setError('')
    if (commonStep === 'frequency' && !frequency) {
      setError('Please select how frequently you need the service')
      return
    }
    if (commonStep === 'postcode') {
      if (!postcode.trim()) {
        setError('Please enter your postcode')
        return
      }
      setBusy(true)
      try {
        const check = await api.validatePostcode(postcode.trim())
        if (!check.valid) {
          setError(check.reason || 'Please enter a valid UK postcode')
          return
        }
        if (check.outcode && !/\s\d/.test(postcode)) {
          setPostcode(check.outcode)
        } else if (check.formatted) {
          setPostcode(check.formatted)
        }
      } catch {
        // Allow continue if API offline
      } finally {
        setBusy(false)
      }
    }
    if (commonStep === 'email') {
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError('Please enter a valid email')
        return
      }
    }
    if (commonStep === 'name' && !fullName.trim()) {
      setError('Please tell us your name')
      return
    }
    if (commonStep === 'phone' && !String(phone).trim()) {
      setError('Please tell us your contact number')
      return
    }
    if (commonIndex < COMMON_STEPS.length - 1) {
      setCommonIndex((i) => i + 1)
      return
    }
    handleSubmit()
  }

  async function handleSubmit() {
    setBusy(true)
    setError('')
    const { firstName, lastName } = splitName(fullName)
    const fileNames = files.filter(Boolean).map((f) => f.name)
    const description = [
      frequency ? `Frequency: ${frequency}` : null,
      details.trim() || null,
      fileNames.length ? `Attachments: ${fileNames.join(', ')}` : null,
      marketing ? 'Marketing emails: yes' : 'Marketing emails: no',
    ]
      .filter(Boolean)
      .join('\n')

    try {
      if (isCustomer) {
        const created = await api.createRequest({
          serviceId,
          postcode: postcode.trim(),
          description,
          title: `${serviceName} request`,
        })
        const id = created.request.id
        await api.saveAnswers(id, answersToPayload(answers, visible))
        const data = await api.submitRequest(id, {
          postcode: postcode.trim(),
          description,
        })
        navigate(`/app/requests/${data.request.id}`)
        return
      }

      const dial = dialForCountry(countryCode)
      const data = await api.submitGuestRequest({
        firstName,
        lastName,
        email: email.trim(),
        phone: phone ? formatIntlPhone(dial, phone) : undefined,
        serviceId,
        postcode: postcode.trim(),
        description,
        title: `${serviceName} request`,
        answers: answersToPayload(answers, visible),
      })
      setDone({
        message: data.message,
        matchCount: data.matchCount,
        email: email.trim(),
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  let modal = null

  if (loading) {
    return (
      <div>
        <PageBackdrop services={[]} onSelect={null} />
        <Loading overlay />
      </div>
    )
  }

  if (!serviceId) {
    // Full service picker (no modal) — all active services
    return (
      <div>
        {error ? <p className="relative z-10 px-4 py-2 text-sm text-danger sm:px-6">{error}</p> : null}
        <PageBackdrop
          services={services}
          onSelect={(id) => {
            setError('')
            setQuestions([])
            setQuestionsLoading(true)
            setQIndex(0)
            setCommonIndex(-1)
            setServiceId(id)
          }}
        />
        {!services.length && !error ? (
          <p className="relative z-10 px-4 pb-10 text-sm text-muted sm:px-6">No services available yet.</p>
        ) : null}
      </div>
    )
  }

  if (done) {
    modal = (
      <WizardShell
        title="Request submitted"
        onClose={close}
        footer={
          <WizardFooter hideBack continueLabel="Log in" onContinue={() => navigate('/login')} />
        }
      >
        <p className="text-center text-sm text-slate-600">
          {done.message || 'Check your email to set your password and view your matches.'}
        </p>
        <p className="mt-3 text-center text-sm text-slate-500">
          Sent to <strong>{done.email}</strong>
          {typeof done.matchCount === 'number'
            ? ` · ${done.matchCount} professional${done.matchCount === 1 ? '' : 's'} matched`
            : null}
        </p>
      </WizardShell>
    )
  } else if (questionsLoading) {
    modal = <Loading overlay />
  } else if (commonIndex < 0 && !visible.length) {
    modal = (
      <WizardShell
        title={serviceName}
        onClose={close}
        footer={
          <WizardFooter
            hideBack
            onContinue={() => {
              setError('')
              setCommonIndex(0)
            }}
            busy={busy}
          />
        }
      >
        <p className="text-sm text-slate-600">No extra questions for this service — continue to match.</p>
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      </WizardShell>
    )
  } else if (commonIndex < 0 && currentQuestion) {
    const q = currentQuestion
    const title = q.label?.trim().endsWith('?') ? q.label : `${q.label}?`
    const isSingleChoice = isSingleChoiceType(q.type)
    const isMultipleChoice = isMultiChoiceType(q.type)
    const control = choiceControlKind(q.type)
    const mappedOptions = (q.options || []).map((o) => ({
      id: o.id,
      value: o.value,
      label: o.label,
    }))
    modal = (
      <WizardShell
        title={title}
        onClose={close}
        footer={
          <WizardFooter
            hideBack={qIndex === 0}
            onBack={goBack}
            onContinue={goNextFromQuestion}
            busy={busy}
          />
        }
      >
        {isSingleChoice ? (
          <RadioOptionList
            name={`q-${q.id}`}
            options={mappedOptions}
            value={answers[q.id] || ''}
            control={control}
            isSelected={isSingleOptionSelected}
            getToken={optionToken}
            onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
          />
        ) : isMultipleChoice ? (
          <CheckboxOptionList
            name={`q-${q.id}`}
            options={mappedOptions}
            value={answers[q.id]}
            control={control}
            isSelected={isMultiOptionSelected}
            toggleOption={toggleMultiOption}
            onChange={(next) => setAnswers((a) => ({ ...a, [q.id]: next }))}
          />
        ) : (
          <QuestionField
            question={q}
            value={answers[q.id]}
            onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
            hideLabel
          />
        )}
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      </WizardShell>
    )
  } else if (commonStep === 'frequency') {
    modal = (
      <WizardShell
        title="How Frequently Do You Require The Services?"
        onClose={close}
        footer={<WizardFooter onBack={goBack} onContinue={goNextCommon} busy={busy} />}
      >
        <RadioOptionList
          name="frequency"
          options={FREQUENCY_OPTIONS}
          value={frequency}
          onChange={setFrequency}
        />
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      </WizardShell>
    )
  } else if (commonStep === 'postcode') {
    modal = (
      <WizardShell
        title="View Your Matches Now !"
        onClose={close}
        footer={<WizardFooter hideBack onContinue={goNextCommon} busy={busy} />}
      >
        <label className="mb-2 block text-sm font-bold text-slate-700">Postcode</label>
        <PostcodeInput
          value={postcode}
          onChange={setPostcode}
          placeholder="Search or add postcode…"
        />
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      </WizardShell>
    )
  } else if (commonStep === 'email') {
    modal = (
      <WizardShell
        title="View Your Matches Now !"
        onClose={close}
        footer={<WizardFooter onBack={goBack} onContinue={goNextCommon} busy={busy} />}
      >
        <label className="mb-2 block text-sm font-bold text-slate-700">Please enter Email</label>
        <input
          type="email"
          className="w-full rounded-xl border border-slate-300/80 bg-white/70 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isCustomer}
        />
        <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-primary"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
          />
          <span>I am happy to receive occational marketing emails.</span>
        </label>
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      </WizardShell>
    )
  } else if (commonStep === 'name') {
    modal = (
      <WizardShell
        title="What Is Your Name ?"
        onClose={close}
        footer={<WizardFooter hideBack onContinue={goNextCommon} busy={busy} />}
      >
        <label className="mb-2 block text-sm font-bold text-slate-700">Please tell us your name</label>
        <input
          className="w-full rounded-xl border border-slate-300/80 bg-white/70 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      </WizardShell>
    )
  } else if (commonStep === 'phone') {
    modal = (
      <WizardShell
        title="What Is Your Contact Number ?"
        onClose={close}
        footer={<WizardFooter hideBack onContinue={goNextCommon} busy={busy} />}
      >
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Please tell us your contact number
        </label>
        <PhoneInput
          dialCode={countryCode}
          onDialCodeChange={setCountryCode}
          value={phone}
          onChange={setPhone}
        />
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      </WizardShell>
    )
  } else {
    modal = (
      <WizardShell
        title="Describe Your Request In Detail"
        onClose={close}
        footer={
          <WizardFooter
            hideBack
            onContinue={goNextCommon}
            continueLabel={busy ? 'Submitting…' : 'Continue'}
            busy={busy}
          />
        }
      >
        <label className="mb-2 block text-sm font-bold text-slate-700">
          Add more details to get faster and more accurate quotes
        </label>
        <textarea
          rows={4}
          className="w-full rounded-xl border border-slate-300/80 bg-white/70 px-3 py-2.5 text-sm outline-none placeholder:italic focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="What would be helpful for the professionals to know ?"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />

        {[0, 1, 2].map((i) => (
          <div key={i} className="mt-4">
            <p className="mb-2 text-sm font-bold text-slate-700">Attach file {i + 1}</p>
            <div className="rounded-xl border border-slate-300/80 bg-white/60 px-3 py-2">
              <input
                type="file"
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-semibold"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null
                  setFiles((prev) => {
                    const next = [...prev]
                    next[i] = f
                    return next
                  })
                }}
              />
              <p className="mt-1 text-xs text-slate-400">
                {files[i] ? files[i].name : 'No file chosen'}
              </p>
            </div>
          </div>
        ))}

        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      </WizardShell>
    )
  }

  return withBackdrop(services, modal, null)
}
