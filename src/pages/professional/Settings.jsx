import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import PhoneInput from '../../components/PhoneInput'
import SquareCheckoutModal from '../../components/SquareCheckoutModal'
import {
  DEFAULT_COUNTRY_CODE,
  dialForCountry,
  formatIntlPhone,
  parseIntlPhone,
} from '../../data/countryDialCodes'
import { formatMoney } from '../../utils/questionnaire'
import { Building2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Settings() {
  const navigate = useNavigate()
  const { logout, refreshMe } = useAuth()
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contactNo: '',
    countryCode: DEFAULT_COUNTRY_CODE,
    description: '',
    companyName: '',
    website: '',
  })
  const [packages, setPackages] = useState([])
  const [selectedPkg, setSelectedPkg] = useState('')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    api
      .getMyProfile()
      .then((d) => {
        const p = d.profile
        const parsed = parseIntlPhone(p.phone || '')
        setProfile({
          name: p.contactName || '',
          email: '',
          contactNo: parsed.localNumber,
          countryCode: parsed.countryCode || DEFAULT_COUNTRY_CODE,
          description: p.bio || '',
          companyName: p.companyName || '',
          website: p.website || '',
        })
      })
      .catch((err) => setError(err.message || 'Failed to load profile'))

    api
      .getPackages()
      .then((d) => {
        const list = d.packages || []
        setPackages(list)
        setSelectedPkg(list[0]?.id || '')
      })
      .catch((err) => setError(err.message || 'Failed to load packages'))
  }, [])

  function update(field) {
    return (e) => setProfile((p) => ({ ...p, [field]: e.target.value }))
  }

  async function saveProfile(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await api.updateMyProfile({
        contactName: profile.name,
        phone: profile.contactNo
          ? formatIntlPhone(dialForCountry(profile.countryCode), profile.contactNo)
          : '',
        bio: profile.description,
        companyName: profile.companyName,
        website: profile.website,
      })
      setMessage('Profile saved.')
    } catch (err) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

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
    <section className="w-full px-4 py-10 text-left sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <form onSubmit={saveProfile} className="space-y-4 text-left">
          <div className="flex size-28 items-center justify-center rounded-full bg-primary text-white">
            <Building2 className="size-12" strokeWidth={1.75} />
          </div>

          <div>
            <label className="label">Profile Image</label>
            <input type="file" accept="image/*" className="block w-full text-sm text-slate" />
          </div>

          <div className="flex items-center justify-between border-b border-line pb-2">
            <h2 className="text-lg font-bold text-navy">About</h2>
            <button type="button" className="rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-white">
              Upload Image
            </button>
          </div>

          <div>
            <label className="label">Name</label>
            <input className="input-field" value={profile.name} onChange={update('name')} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input-field" type="email" value={profile.email} onChange={update('email')} />
          </div>
          <div>
            <label className="label">Contact No</label>
            <PhoneInput
              dialCode={profile.countryCode || DEFAULT_COUNTRY_CODE}
              onDialCodeChange={(code) => setProfile((p) => ({ ...p, countryCode: code }))}
              value={profile.contactNo}
              onChange={(v) => setProfile((p) => ({ ...p, contactNo: v }))}
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input-field min-h-24"
              value={profile.description}
              onChange={update('description')}
            />
          </div>
          <div>
            <label className="label">Company Name</label>
            <input className="input-field" value={profile.companyName} onChange={update('companyName')} />
          </div>
          <div>
            <label className="label">Website</label>
            <input className="input-field" value={profile.website} onChange={update('website')} />
          </div>

          <button type="submit" className="btn-primary !rounded-md" disabled={saving}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </form>

        <div className="space-y-6">
          <div className="surface p-6">
            <h2 className="text-lg font-bold text-navy">Tokens</h2>
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

          <div className="rounded-2xl border border-danger/25 bg-danger/5 p-6">
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
