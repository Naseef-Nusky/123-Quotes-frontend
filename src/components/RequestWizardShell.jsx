import { X } from 'lucide-react'

const LOGO_BTN =
  'bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] hover:brightness-105 shadow-md shadow-[#0a3a7a]/30'

export function WizardShell({ title, onClose, children, footer }) {
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-title"
    >
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-[#0a2f5c]/25 backdrop-blur-[3px] transition"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-[min(560px,85vh)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-[0_20px_60px_-15px_rgba(10,47,92,0.4)] backdrop-blur-xl animate-[wizardIn_0.22s_ease-out]">
        <div className="relative shrink-0 border-b border-[#d6e4f0] px-6 py-4 text-center">
          <h1
            id="wizard-title"
            className="pr-8 text-lg font-semibold tracking-tight text-navy sm:text-xl"
          >
            {title}
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-[#e8f4fb] hover:text-navy"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={2} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer ? (
          <div className="shrink-0 border-t border-[#d6e4f0] bg-[#e8f4fb]/50 px-6 py-4 backdrop-blur-sm">
            {footer}
          </div>
        ) : null}
      </div>

      <style>{`
        @keyframes wizardIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

export function WizardFooter({ onBack, onContinue, continueLabel = 'Continue', busy, hideBack }) {
  return (
    <div className={`flex items-center gap-3 ${hideBack ? '' : 'justify-between'}`}>
      {!hideBack ? (
        <button
          type="button"
          onClick={onBack}
          disabled={busy}
          className="rounded-xl border border-[#b6d8ef] bg-white px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-[#eef7fc] disabled:opacity-60"
        >
          Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onContinue}
        disabled={busy}
        className={`ml-auto rounded-xl ${LOGO_BTN} px-6 py-2.5 text-sm font-bold text-white transition disabled:opacity-60 ${
          hideBack ? 'w-full py-3' : ''
        }`}
      >
        {continueLabel}
      </button>
    </div>
  )
}

export function RadioOptionList({ name, options, value, onChange }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#d6e4f0] bg-white/60">
      {options.map((opt, i) => {
        const selected = value === opt.value
        return (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-center gap-3 px-4 py-3.5 transition ${
              i > 0 ? 'border-t border-[#d6e4f0]' : ''
            } ${selected ? 'bg-primary/10' : 'hover:bg-[#eef7fc]/80'}`}
          >
            <input
              type="radio"
              name={name}
              className="size-4 accent-primary"
              checked={selected}
              onChange={() => onChange(opt.value)}
            />
            <span className="text-sm font-medium text-navy">{opt.label}</span>
          </label>
        )
      })}
    </div>
  )
}

export const FREQUENCY_OPTIONS = [
  { value: 'Daily', label: 'Daily' },
  { value: 'Once a week', label: 'Once a week' },
  { value: 'Once a month', label: 'Once a month' },
  { value: 'One time clean', label: 'One time clean' },
]

/** Shared closing steps shown for every service after service-specific questions. */
export const COMMON_STEPS = ['frequency', 'postcode', 'email', 'name', 'phone', 'details']
