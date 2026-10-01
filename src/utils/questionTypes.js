/** Shared helpers for choice question behavior + control appearance. */

export function isMultiChoiceType(type) {
  return type === 'MULTIPLE_CHOICE' || type === 'MULTIPLE_RADIO'
}

export function isSingleChoiceType(type) {
  return type === 'SINGLE_CHOICE' || type === 'SINGLE_CHECKBOX'
}

/** Visual control: radio circle vs checkbox square */
export function choiceControlKind(type) {
  if (type === 'SINGLE_CHECKBOX' || type === 'MULTIPLE_CHOICE') return 'checkbox'
  if (type === 'MULTIPLE_RADIO' || type === 'SINGLE_CHOICE') return 'radio'
  return 'radio'
}
