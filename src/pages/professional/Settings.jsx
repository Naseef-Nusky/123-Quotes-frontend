import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import SquareCheckoutModal from '../../components/SquareCheckoutModal'
import ServicesAreasForm from '../../components/ServicesAreasForm'
import { formatMoney } from '../../utils/questionnaire'
import { Coins } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Settings() {
  const navigate = useNavigate()
  const { user, logout, refreshMe } = useAuth()
  const tokenBalance = user?.professional?.tokenBalance ?? 0
  const [packages, setPackages] = useState([])
  const [selectedPkg, setSelectedPkg] = useState('')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    refreshMe?.()
    api
      .getPackages()
      .then((d) => {
        const list = d.packages || []
        setPackages(list)
        setSelectedPkg(list[0]?.id || '')
      })
      .catch((err) => setError(err.message || 'Failed to load packages'))
  }, [])

  function payTokens() {
    setMessage('')
    setError('')
    if (!selectedPkg) {
      setError('Select a package first.')
      return
    }
    setCheckoutOpen(true)
  }

  async function deleteAccount() {
    if (
      !window.confirm(
        'Are you sure you want to delete your account? This permanently removes your business profile and cannot be undone.',
      )
    ) {
      return
    }

    setDeleting(true)
    setError('')
    setMessage('')
    try {
      await api.deleteMyAccount()
      logout()
      navigate('/business/login', { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to delete account')
      setDeleting(false)
    }
  }

  const activePkg = packages.find((p) => p.id === selectedPkg) || null

  return (
    <section className="w-full px-4 py-6 text-left sm:px-6 sm:py-8 lg:px-8">
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2 lg:gap-6">
        {/* Services + service areas (moved here from Profile) */}
        <ServicesAreasForm />

        <div className="min-w-0 space-y-5 lg:space-y-6">
          <div className="surface p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold text-navy">Tokens</h2>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-canvas px-4 py-3 ring-1 ring-line">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate">
                <Coins className="size-4.5 text-primary" strokeWidth={2} />
                Available tokens
              </span>
              <span className="text-xl font-bold text-navy">{tokenBalance}</span>
            </div>
            <select
              className="input-field mt-4"
              value={selectedPkg}
              onChange={(e) => setSelectedPkg(e.target.value)}
            >
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  Token - {pkg.tokens} ({formatMoney(pkg.priceCents, pkg.currency || 'GBP')})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={payTokens}
              className="mt-4 rounded-md bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-5 py-2.5 text-sm font-bold text-white"
            >
              Pay with Square
            </button>
            <p className="mt-2 text-xs text-muted">Payments are processed securely via Square only.</p>
            {!packages.length ? <p className="mt-4 text-sm text-muted">No packages available.</p> : null}
            {message ? <p className="mt-3 text-sm text-success">{message}</p> : null}
            {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
          </div>

          <div className="rounded-2xl border border-danger/25 bg-danger/5 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-danger">Delete account</h2>
            <p className="mt-2 text-sm text-slate">
              Permanently delete your business profile. This cannot be undone.
            </p>
            <button
              type="button"
              className="mt-4 rounded-md bg-danger px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
              disabled={deleting}
              onClick={deleteAccount}
            >
              {deleting ? 'Deleting…' : 'Delete account'}
            </button>
          </div>
        </div>
      </div>

      <SquareCheckoutModal
        open={checkoutOpen}
        pkg={activePkg}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={async (data) => {
          setMessage(
            data.tokensAdded
              ? `Added ${data.tokensAdded} tokens${data.mocked ? ' (mock)' : ''}.`
              : 'Token purchase successful.',
          )
          await refreshMe?.()
        }}
      />
    </section>
  )
}
