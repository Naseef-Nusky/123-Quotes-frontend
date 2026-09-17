export default function StatusBadge({ status }) {
  const map = {
    DRAFT: 'bg-slate-100 text-slate-700',
    SUBMITTED: 'bg-blue-100 text-blue-800',
    MATCHED: 'bg-indigo-100 text-indigo-800',
    IN_PROGRESS: 'bg-amber-100 text-amber-800',
    COMPLETED: 'bg-emerald-100 text-emerald-800',
    CANCELLED: 'bg-rose-100 text-rose-800',
    OPEN: 'bg-blue-100 text-blue-800',
    AVAILABLE: 'bg-emerald-100 text-emerald-800',
    UNLOCKED: 'bg-primary/10 text-primary-dark',
    VIEWED: 'bg-slate-100 text-slate-700',
    ACTIVE: 'bg-emerald-100 text-emerald-800',
    PENDING: 'bg-amber-100 text-amber-800',
  }
  const cls = map[status] || 'bg-slate-100 text-slate-700'
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide ${cls}`}>
      {(status || '—').replaceAll('_', ' ')}
    </span>
  )
}
