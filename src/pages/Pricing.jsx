import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { formatMoney } from '../utils/questionnaire'
import { useAuth } from '../context/AuthContext'

export default function Pricing() {
  const [packages, setPackages] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { isProfessional } = useAuth()

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await api.getPackages()
        if (alive) setPackages(data.packages || [])
      } catch (e) {
        if (alive) setError(e.message)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-navy">Token packages</h1>
      <p className="mt-2 max-w-2xl text-slate">
        Professionals unlock customer leads with tokens. Buy a pack that matches your pipeline.
      </p>

      {loading ? <p className="mt-8 text-muted">Loading packages…</p> : null}
      {error ? <p className="mt-8 text-danger">{error}</p> : null}

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {packages.map((pkg, idx) => (
          <div
            key={pkg.id}
            className={`surface relative flex flex-col p-6 ${
              idx === 1 ? 'border-primary shadow-lg shadow-primary/10' : ''
            }`}
          >
            {idx === 1 ? (
              <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                Popular
              </span>
            ) : null}
            <h2 className="font-display text-2xl font-bold text-navy">{pkg.name}</h2>
            <p className="mt-2 text-sm text-muted">{pkg.description}</p>
            <p className="mt-6 font-display text-4xl font-extrabold text-navy">
              {formatMoney(pkg.priceCents, pkg.currency || 'GBP')}
            </p>
            <p className="mt-1 text-sm font-semibold text-primary">{pkg.tokens} tokens</p>
            <Link
              to={isProfessional ? '/pro/tokens' : '/business/signup'}
              className="btn-primary mt-8"
            >
              {isProfessional ? 'Buy in portal' : 'Join to purchase'}
            </Link>
          </div>
        ))}
      </div>

      {!loading && !packages.length && !error ? (
        <p className="mt-8 text-muted">No packages available yet.</p>
      ) : null}
    </div>
  )
}
