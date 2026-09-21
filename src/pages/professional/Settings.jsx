import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { DUMMY_PACKAGES } from '../../data/dummy'
import { formatMoney } from '../../utils/questionnaire'
import { Building2 } from 'lucide-react'

export default function Settings() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contactNo: '',
    description: '',
    companyName: '',
    website: '',
  })
  const [packages, setPackages] = useState(DUMMY_PACKAGES)
  const [selectedPkg, setSelectedPkg] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api
      .getMyProfile()
      .then((d) => {
        const p = d.profile
        setProfile({
          name: p.contactName || '',
          email: '',
          contactNo: p.phone || '',
          description: p.bio || '',
          companyName: p.companyName || '',
          website: p.website || '',
        })
      })
      .catch(() => {})

    api
      .getPackages()
      .then((d) => {
        const list = d.packages?.length ? d.packages : DUMMY_PACKAGES
        setPackages(list)
        setSelectedPkg(list[0]?.id || '')
      })
      .catch(() => {
        setPackages(DUMMY_PACKAGES)
        setSelectedPkg(DUMMY_PACKAGES[0]?.id || '')
      })
  }, [])

  function update(field) {
    return (e) => setProfile((p) => ({ ...p, [field]: e.target.value }))
  }

  async function saveProfile(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await api.updateMyProfile({
        contactName: profile.name,
        phone: profile.contactNo,
        bio: profile.description,
        companyName: profile.companyName,
        website: profile.website,
      })
      setMessage('Profile saved.')
    } catch {
      setMessage('Saved locally for demo (API unavailable).')
    } finally {
      setSaving(false)
    }
  }

  async function payTokens() {
    setMessage('')
    try {
      await api.buyTokens(selectedPkg)
      setMessage('Token purchase successful.')
    } catch {
      setMessage('Demo purchase recorded (API unavailable).')
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="flex size-28 items-center justify-center rounded-full bg-primary text-white">
            <Building2 className="size-12" strokeWidth={1.75} />
          </div>

          <div>
            <label className="label">Profile Image</label>
            <input type="file" accept="image/*" className="block w-full text-sm text-slate" />
          </div>

          <div className="flex items-center justify-between border-b border-line pb-2">
            <h2 className="text-lg font-bold text-navy">About</h2>
            <button type="button" className="rounded-md bg-success px-3 py-1.5 text-xs font-bold text-white">
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
            <input className="input-field" value={profile.contactNo} onChange={update('contactNo')} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input-field min-h-24" value={profile.description} onChange={update('description')} />
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
          <button type="button" onClick={payTokens} className="mt-4 rounded-md bg-success px-5 py-2.5 text-sm font-bold text-white">
            Pay
          </button>
          <p className="mt-10 text-center text-sm text-muted">No Transactions.</p>
          {message ? <p className="mt-4 text-center text-sm text-primary">{message}</p> : null}
        </div>
      </div>
    </section>
  )
}
