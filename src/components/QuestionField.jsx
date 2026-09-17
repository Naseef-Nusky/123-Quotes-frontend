export default function QuestionField({ question, value, onChange }) {
  const id = `q-${question.id}`

  if (question.type === 'TEXT') {
    return (
      <div>
        <label className="label" htmlFor={id}>
          {question.label}
          {question.isRequired ? <span className="text-danger"> *</span> : null}
        </label>
        {question.helpText ? <p className="mb-2 text-sm text-muted">{question.helpText}</p> : null}
        <input
          id={id}
          className="input-field"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }

  if (question.type === 'TEXTAREA') {
    return (
      <div>
        <label className="label" htmlFor={id}>
          {question.label}
          {question.isRequired ? <span className="text-danger"> *</span> : null}
        </label>
        {question.helpText ? <p className="mb-2 text-sm text-muted">{question.helpText}</p> : null}
        <textarea
          id={id}
          rows={4}
          className="input-field resize-y"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }

  if (question.type === 'DROPDOWN') {
    return (
      <div>
        <label className="label" htmlFor={id}>
          {question.label}
          {question.isRequired ? <span className="text-danger"> *</span> : null}
        </label>
        {question.helpText ? <p className="mb-2 text-sm text-muted">{question.helpText}</p> : null}
        <select
          id={id}
          className="input-field"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select…</option>
          {(question.options || []).map((opt) => (
            <option key={opt.id} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (question.type === 'MULTIPLE_CHOICE') {
    const selected = Array.isArray(value) ? value : []
    return (
      <fieldset>
        <legend className="label">
          {question.label}
          {question.isRequired ? <span className="text-danger"> *</span> : null}
        </legend>
        {question.helpText ? <p className="mb-2 text-sm text-muted">{question.helpText}</p> : null}
        <div className="flex flex-col gap-2">
          {(question.options || []).map((opt) => {
            const checked = selected.includes(opt.value)
            return (
              <label
                key={opt.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                  checked ? 'border-primary bg-blue-50' : 'border-line bg-white hover:border-blue-200'
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
                <span className="text-sm font-medium">{opt.label}</span>
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
      <legend className="label">
        {question.label}
        {question.isRequired ? <span className="text-danger"> *</span> : null}
      </legend>
      {question.helpText ? <p className="mb-2 text-sm text-muted">{question.helpText}</p> : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {(question.options || []).map((opt) => {
          const checked = value === opt.value
          return (
            <label
              key={opt.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                checked ? 'border-primary bg-blue-50' : 'border-line bg-white hover:border-blue-200'
              }`}
            >
              <input
                type="radio"
                name={id}
                className="size-4 accent-primary"
                checked={checked}
                onChange={() => onChange(opt.value)}
              />
              <span className="text-sm font-medium">{opt.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
