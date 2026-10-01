/** Prefer unique option id so duplicate labels/values still select independently. */
export function optionToken(opt) {
  if (opt?.id) return String(opt.id)
  const value = String(opt?.value ?? '').trim()
  if (value) return value
  return String(opt?.label ?? '').trim()
}

export function normalizeMultiValue(value) {
  if (Array.isArray(value)) return value.map(String)
  return String(value ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}

export function isSingleOptionSelected(opt, storedValue) {
  if (storedValue == null || storedValue === '') return false
  const stored = String(storedValue)
  const token = optionToken(opt)
  if (stored === token) return true
  if (opt.id && stored === String(opt.id)) return true
  const value = String(opt?.value ?? '').trim()
  if (value && stored === value) return true
  const label = String(opt?.label ?? '').trim()
  if (label && stored === label) return true
  return false
}

export function isMultiOptionSelected(opt, storedValue) {
  const selected = normalizeMultiValue(storedValue)
  if (!selected.length) return false
  const token = optionToken(opt)
  if (selected.includes(token)) return true
  if (opt.id && selected.includes(String(opt.id))) return true
  const value = String(opt?.value ?? '').trim()
  if (value && selected.includes(value)) return true
  const label = String(opt?.label ?? '').trim()
  if (label && selected.includes(label)) return true
  return false
}

export function toggleMultiOption(opt, storedValue) {
  const selected = normalizeMultiValue(storedValue)
  const token = optionToken(opt)
  const on = isMultiOptionSelected(opt, storedValue)
  if (on) {
    const value = String(opt?.value ?? '').trim()
    const label = String(opt?.label ?? '').trim()
    return selected.filter(
      (v) =>
        v !== token &&
        v !== String(opt.id ?? '') &&
        v !== value &&
        v !== label,
    )
  }
  return [...selected, token]
}
