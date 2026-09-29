import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import SquareCheckoutModal from '../../components/SquareCheckoutModal'
import { formatMoney } from '../../utils/questionnaire'
import { useAuth } from '../../context/AuthContext'

export default function BuyTokens() {
  const { refreshMe } = useAuth()
  const [packages, setPackages] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [checkoutPkg, setCheckoutPkg] = useState(null)

  useEffect(() => {
    api
      .getPackages()
      .then((d) => setPackages(d.packages || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <p className="mb-2 text-slate">Checkout is handled by Square — the only payment method on 123 Quotes.</p>
      <Link to="/pro/history" className="text-sm font-bold text-primary">
        View token history →
      </Link>

      {loading ? <p className="mt-6 text-muted">Loading packages…</p> : null}
      {error ? <p className="mt-4 text-danger">{error}</p> : null}
      {message ? <p className="mt-4 text-success">{message}</p> : null}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {packages.map((pkg) => (
          <div key={pkg.id} className="surface flex flex-col p-6">
            <h2 className="font-display text-2xl font-bold text-navy">{pkg.name}</h2>
            <p className="mt-2 text-sm text-muted">{pkg.description}</p>
            <p className="mt-6 font-display text-3xl font-extrabold">
              {formatMoney(pkg.priceCents, pkg.currency)}
            </p>
            <p className="text-sm font-semibold text-primary">{pkg.tokens} tokens</p>
            <button type="button" className="btn-primary mt-6" onClick={() => setCheckoutPkg(pkg)}>
              Buy with Square
            </button>
          </div>
        ))}
      </div>

      <SquareCheckoutModal
        open={Boolean(checkoutPkg)}
        pkg={checkoutPkg}
        onClose={() => setCheckoutPkg(null)}
        onSuccess={async (data) => {
          setMessage(
            data.tokensAdded
              ? `Added ${data.tokensAdded} tokens${data.mocked ? ' (mock)' : ''} successfully.`
              : data.message || 'Purchase completed.',
          )
          await refreshMe()
        }}
      />
    </div>
  )
}
