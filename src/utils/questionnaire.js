function normalizeAnswer(value) {
  if (Array.isArray(value)) return value.map(String)
  if (value == null || value === '') return null
  return String(value)
}

function matchesBranch(branch, answer) {
  if (answer == null) return false
  const values = Array.isArray(answer) ? answer : [answer]
  const expected = branch.value != null ? String(branch.value) : null
  const op = (branch.operator || 'EQUALS').toUpperCase()

  if (branch.optionId) {
    // Options store value as label in seed; optionId match is best-effort via value
    // Prefer value when provided; otherwise treat optionId as expected value string
  }

  if (op === 'EQUALS' || op === 'EQ') {
    if (expected != null) return values.includes(expected)
    return values.length > 0
  }
  if (op === 'NOT_EQUALS' || op === 'NEQ') {
    if (expected == null) return true
    return !values.includes(expected)
  }
  if (op === 'INCLUDES' || op === 'CONTAINS') {
    if (expected == null) return values.length > 0
    return values.some((v) => v.includes(expected))
  }
  return values.includes(expected)
}

/** Questions that are never a branch target are always visible. */
export function getVisibleQuestions(questions, answersByQuestionId) {
  if (!questions?.length) return []

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
    return incoming.some((branch) =>
      matchesBranch(branch, normalizeAnswer(answersByQuestionId[branch.sourceQuestionId])),
    )
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
