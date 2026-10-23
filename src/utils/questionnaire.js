function normalizeAnswer(value) {
  if (Array.isArray(value)) return value.map(String)
  if (value == null || value === '') return null
  return String(value)
}

/** Expand a stored answer token to all equivalent option identifiers. */
function answerAliases(token, sourceOptions = []) {
  const t = String(token ?? '').trim()
  if (!t) return []
  const aliases = new Set([t])
  for (const opt of sourceOptions) {
    const id = opt?.id != null ? String(opt.id) : ''
    const value = String(opt?.value ?? '').trim()
    const label = String(opt?.label ?? '').trim()
    if (t === id || (value && t === value) || (label && t === label)) {
      if (id) aliases.add(id)
      if (value) aliases.add(value)
      if (label) aliases.add(label)
    }
  }
  return [...aliases]
}

function answerHitsExpected(answerValues, expected, sourceOptions = []) {
  if (expected == null || expected === '') return false
  const want = String(expected)
  for (const raw of answerValues) {
    if (answerAliases(raw, sourceOptions).includes(want)) return true
  }
  return false
}

function matchesBranch(branch, answer, sourceOptions = []) {
  if (answer == null) return false
  const values = Array.isArray(answer) ? answer : [answer]
  const expectedValue = branch.value != null ? String(branch.value) : null
  const expectedOptionId = branch.optionId != null ? String(branch.optionId) : null
  const op = (branch.operator || 'EQUALS').toUpperCase()

  const hits =
    answerHitsExpected(values, expectedOptionId, sourceOptions) ||
    answerHitsExpected(values, expectedValue, sourceOptions)

  if (op === 'EQUALS' || op === 'EQ') {
    if (expectedOptionId != null || expectedValue != null) return hits
    return values.length > 0
  }
  if (op === 'NOT_EQUALS' || op === 'NEQ') {
    if (expectedOptionId == null && expectedValue == null) return true
    return !hits
  }
  if (op === 'INCLUDES' || op === 'CONTAINS') {
    if (expectedOptionId == null && expectedValue == null) return values.length > 0
    if (hits) return true
    const needle = expectedValue || expectedOptionId
    return values.some((v) => String(v).includes(needle))
  }
  return hits
}

/** Questions that are never a branch target are always visible. */
export function getVisibleQuestions(questions, answersByQuestionId) {
  if (!questions?.length) return []

  const byId = new Map(questions.map((q) => [q.id, q]))
  const incomingByTarget = new Map()
  for (const q of questions) {
    for (const branch of q.branchesFrom || []) {
      const list = incomingByTarget.get(branch.targetQuestionId) || []
      list.push({ ...branch, sourceQuestionId: q.id })
      incomingByTarget.set(branch.targetQuestionId, list)
    }
  }

  return questions.filter((q) => {
    const incoming = incomingByTarget.get(q.id)
    if (!incoming?.length) return true
    return incoming.some((branch) => {
      const source = byId.get(branch.sourceQuestionId)
      return matchesBranch(
        branch,
        normalizeAnswer(answersByQuestionId[branch.sourceQuestionId]),
        source?.options || [],
      )
    })
  })
}

export function answersToPayload(answersByQuestionId, visibleQuestions) {
  return visibleQuestions
    .filter((q) => {
      const v = answersByQuestionId[q.id]
      if (Array.isArray(v)) return v.length > 0
      return v != null && String(v).trim() !== ''
    })
    .map((q) => ({
      questionId: q.id,
      value: answersByQuestionId[q.id],
    }))
}

export function validateRequired(visibleQuestions, answersByQuestionId) {
  const missing = []
  for (const q of visibleQuestions) {
    if (!q.isRequired) continue
    const v = answersByQuestionId[q.id]
    const empty = Array.isArray(v) ? v.length === 0 : v == null || String(v).trim() === ''
    if (empty) missing.push(q.label)
  }
  return missing
}

export function formatMoney(cents, currency = 'GBP') {
  try {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
    }).format((cents || 0) / 100)
  } catch {
    return `£${((cents || 0) / 100).toFixed(2)}`
  }
}

export function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Resolve stored option id/value tokens to human-readable labels. */
export function formatAnswerDisplay(raw, options = []) {
  if (raw == null) return ''
  const list = options || []

  function resolve(token) {
    const t = String(token ?? '').trim()
    if (!t) return ''
    const opt = list.find(
      (o) =>
        String(o.id) === t ||
        String(o.value ?? '').trim() === t ||
        String(o.label ?? '').trim() === t,
    )
    if (!opt) return t
    return String(opt.label || opt.value || t).trim()
  }

  if (Array.isArray(raw)) {
    return raw.map(resolve).filter(Boolean).join(', ')
  }

  const s = String(raw).trim()
  if (!s) return ''
  if (s.includes(',')) {
    return s
      .split(',')
      .map((part) => resolve(part.trim()))
      .filter(Boolean)
      .join(', ')
  }
  return resolve(s)
}
