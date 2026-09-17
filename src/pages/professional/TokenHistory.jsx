import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { formatDate } from '../../utils/questionnaire'

export default function TokenHistory() {
  const [txns, setTxns] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .tokenHistory()
      .then((d) => setTxns(d.transactions || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <p className="mb-6 text-slate">Purchases, unlocks and adjustments.</p>
      {loading ? <p className="text-muted">Loading…</p> : null}
      {error ? <p className="text-danger">{error}</p> : null}

      <div className="surface overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-line bg-canvas text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-4 py-3 font-bold">Date</th>
              <th className="px-4 py-3 font-bold">Type</th>
              <th className="px-4 py-3 font-bold">Amount</th>
              <th className="px-4 py-3 font-bold">Balance</th>
              <th className="px-4 py-3 font-bold">Reference</th>
            </tr>
          </thead>
          <tbody>
            {txns.map((t) => (
              <tr key={t.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-muted">{formatDate(t.createdAt)}</td>
                <td className="px-4 py-3 font-semibold text-navy">{t.type}</td>
                <td className={`px-4 py-3 font-bold ${t.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                  {t.amount >= 0 ? '+' : ''}
                  {t.amount}
                </td>
                <td className="px-4 py-3">{t.balanceAfter ?? '—'}</td>
                <td className="px-4 py-3 text-muted">{t.reference || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && !txns.length ? (
          <p className="p-6 text-center text-muted">No token transactions yet.</p>
        ) : null}
      </div>
    </div>
  )
}
