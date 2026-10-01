import {
  isMultiOptionSelected,
  isSingleOptionSelected,
  optionToken,
  toggleMultiOption,
} from '../utils/questionOptions'
import { choiceControlKind, isMultiChoiceType } from '../utils/questionTypes'

function ChoiceMark({ selected, control }) {
  if (control === 'checkbox') {
    return (
      <span
        className={`flex size-4 shrink-0 items-center justify-center rounded border ${
          selected ? 'border-primary bg-primary text-white' : 'border-[#9db8cf] bg-white'
        }`}
        aria-hidden
      >
        {selected ? (
          <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2.5 6.5l2.5 2.5 4.5-5" />
          </svg>
        ) : null}
      </span>
    )
  }

  return (
    <span
      className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
        selected ? 'border-primary' : 'border-[#9db8cf] bg-white'
      }`}
      aria-hidden
    >
      {selected ? <span className="size-2 rounded-full bg-primary" /> : null}
    </span>
  )
}

export default function QuestionField({ question, value, onChange, hideLabel = false }) {
  const id = `q-${question.id}`
  const requiredMark = question.isRequired ? <span className="text-danger"> *</span> : null

  function Label() {
    if (hideLabel) return null
    return (
      <label className="label" htmlFor={id}>
        {question.label}
        {requiredMark}
      </label>
    )
  }

  function Help() {
    if (!question.helpText) return null
    return <p className="mb-2 text-sm text-muted">{question.helpText}</p>
  }

  if (question.type === 'TEXT') {
    return (
      <div>
        <Label />
        <Help />
        <input
          id={id}
          className="input-field"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hideLabel ? 'Type your answer…' : undefined}
        />
      </div>
    )
  }

  if (question.type === 'TEXTAREA') {
    return (
      <div>
        <Label />
        <Help />
        <textarea
          id={id}
          rows={4}
          className="input-field resize-y"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={hideLabel ? 'Type your answer…' : undefined}
        />
      </div>
    )
  }

  if (question.type === 'DROPDOWN') {
    return (
      <div>
        <Label />
        <Help />
        <select
          id={id}
          className="input-field"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select…</option>
          {(question.options || []).map((opt) => (
            <option key={opt.id || optionToken(opt)} value={optionToken(opt)}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (isMultiChoiceType(question.type)) {
    const control = choiceControlKind(question.type)
    return (
      <fieldset>
        {!hideLabel ? (
          <legend className="label">
            {question.label}
            {requiredMark}
          </legend>
        ) : null}
        <Help />
        {!hideLabel ? (
          <p className="mb-2 text-xs font-medium text-muted">Select all that apply</p>
        ) : null}
        <div className="flex flex-col gap-2" role="group">
          {(question.options || []).map((opt, idx) => {
            const checked = isMultiOptionSelected(opt, value)
            return (
              <button
                key={opt.id || `${idx}-${optionToken(opt)}`}
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => onChange(toggleMultiOption(opt, value))}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                  checked
                    ? 'border-primary bg-primary/10'
                    : 'border-line bg-white hover:border-primary/30'
                }`}
              >
                <ChoiceMark selected={checked} control={control} />
                <span className="text-sm font-medium text-navy">{opt.label}</span>
              </button>
            )
          })}
        </div>
      </fieldset>
    )
  }

  // SINGLE_CHOICE / SINGLE_CHECKBOX
  const control = choiceControlKind(question.type)
  return (
    <fieldset>
      {!hideLabel ? (
        <legend className="label">
          {question.label}
          {requiredMark}
        </legend>
      ) : null}
      <Help />
      <div className="grid gap-2 sm:grid-cols-2" role="radiogroup">
        {(question.options || []).map((opt, idx) => {
          const checked = isSingleOptionSelected(opt, value)
          return (
            <button
              key={opt.id || `${idx}-${optionToken(opt)}`}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => onChange(optionToken(opt))}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                checked
                  ? 'border-primary bg-primary/10'
                  : 'border-line bg-white hover:border-primary/30'
              }`}
            >
              <ChoiceMark selected={checked} control={control} />
              <span className="text-sm font-medium text-navy">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
