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
    return <p className={`mb-2 text-sm text-muted ${hideLabel ? '' : ''}`}>{question.helpText}</p>
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
            <option key={opt.id || opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (question.type === 'MULTIPLE_CHOICE') {
    const selected = Array.isArray(value)
      ? value.map(String)
      : String(value || '')
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean)
    return (
      <fieldset>
        {!hideLabel ? (
          <legend className="label">
            {question.label}
            {requiredMark}
          </legend>
        ) : null}
        <Help />
        <div className="flex flex-col gap-2">
          {(question.options || []).map((opt) => {
            const checked = selected.includes(opt.value)
            return (
              <label
                key={opt.id || opt.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                  checked ? 'border-primary bg-primary/10' : 'border-line bg-white hover:border-primary/30'
                }`}
              >
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? selected.filter((v) => v !== opt.value)
                      : [...selected, opt.value]
                    onChange(next)
                  }}
                />
                <span className="text-sm font-medium text-navy">{opt.label}</span>
              </label>
            )
          })}
        </div>
      </fieldset>
    )
  }

  // SINGLE_CHOICE default
  return (
    <fieldset>
      {!hideLabel ? (
        <legend className="label">
          {question.label}
          {requiredMark}
        </legend>
      ) : null}
      <Help />
      <div className="grid gap-2 sm:grid-cols-2">
        {(question.options || []).map((opt) => {
          const checked = value === opt.value
          return (
            <label
              key={opt.id || opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                checked ? 'border-primary bg-primary/10' : 'border-line bg-white hover:border-primary/30'
              }`}
            >
              <input
                type="radio"
                name={id}
                className="size-4 accent-primary"
                checked={checked}
                onChange={() => onChange(opt.value)}
              />
              <span className="text-sm font-medium text-navy">{opt.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
