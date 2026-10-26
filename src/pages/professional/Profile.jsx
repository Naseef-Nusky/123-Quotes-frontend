import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Camera, Coins } from 'lucide-react'
import { api } from '../../api/client'
import Loading from '../../components/Loading'
import PhoneInput from '../../components/PhoneInput'
import PostcodeInput from '../../components/PostcodeInput'
import {
  DEFAULT_COUNTRY_CODE,
  dialForCountry,
  formatIntlPhone,
  parseIntlPhone,
} from '../../data/countryDialCodes'
import { useAuth } from '../../context/AuthContext'

export default function ProProfile() {
  const { refreshMe } = useAuth()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ countryCode: DEFAULT_COUNTRY_CODE })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoUrl, setLogoUrl] = useState('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const logoInputRef = useRef(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const prof = await api.getMyProfile()
        if (!alive) return
        setProfile(prof.profile)
        setLogoUrl(prof.profile.logoUrl || '')
        const parsed = parseIntlPhone(prof.profile.phone || '')
        setForm({
          companyName: prof.profile.companyName || '',
          contactName: prof.profile.contactName || '',
          email: prof.profile.email || '',
          phone: parsed.localNumber,
          countryCode: parsed.countryCode || DEFAULT_COUNTRY_CODE,
          website: prof.profile.website || '',
          bio: prof.profile.bio || '',
          postcode: prof.profile.postcode || '',
          address: prof.profile.address || '',
          city: prof.profile.city || '',
          isAvailable: prof.profile.isAvailable !== false,
        })
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

  async function onLogoChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image is too large — maximum 5 MB')
      return
    }
    setUploadingLogo(true)
    setError('')
    setMessage('')
    try {
      const d = await api.uploadMyLogo(file)
      setLogoUrl(d.logoUrl || '')
      setMessage('Profile image updated')
    } catch (err) {
      setError(err.message || 'Image upload failed')
    } finally {
      setUploadingLogo(false)
    }
  }

  async function onSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const { countryCode: _countryCode, email: _email, ...profileFields } = form
      await api.updateMyProfile({
        ...profileFields,
        phone: form.phone
          ? formatIntlPhone(dialForCountry(form.countryCode), form.phone)
          : '',
      })
      await refreshMe()
      setMessage('Profile saved')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading overlay />

  return (
    <form onSubmit={onSave} className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2 lg:gap-6">
        {/* Left column: company details */}
        <div className="surface min-w-0 space-y-4 p-5 sm:p-6">
          <h2 className="font-display text-xl font-bold text-navy">Company details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              ['companyName', 'Company name'],
              ['contactName', 'Contact name'],
              ['website', 'Website'],
              ['city', 'City'],
            ].map(([key, label]) => (
              <div key={key} className="min-w-0">
                <label className="label">{label}</label>
                <input
                  className="input-field"
                  value={form[key] || ''}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
            <div className="min-w-0 sm:col-span-2">
              <label className="label">Email</label>
              <input
                className="input-field bg-canvas text-slate"
                type="email"
                value={form.email || ''}
                readOnly
                disabled
                title="Login email cannot be changed here"
              />
              <p className="mt-1 text-xs text-muted">This is your business login email.</p>
            </div>
            <div className="min-w-0 sm:col-span-2">
              <label className="label">Address</label>
              <input
                className="input-field"
                value={form.address || ''}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="min-w-0">
              <label className="label">Postcode</label>
              <PostcodeInput
                value={form.postcode || ''}
                onChange={(v) => setForm({ ...form, postcode: v })}
                placeholder="Search or add postcode…"
              />
            </div>
            <div className="min-w-0">
              <label className="label">Phone</label>
              <PhoneInput
                dialCode={form.countryCode || DEFAULT_COUNTRY_CODE}
                onDialCodeChange={(code) => setForm({ ...form, countryCode: code })}
                value={form.phone || ''}
                onChange={(v) => setForm({ ...form, phone: v })}
              />
            </div>
          </div>
        </div>

        {/* Right column: profile image + about / availability */}
        <div className="min-w-0 space-y-5 lg:space-y-6">
          <div className="surface min-w-0 space-y-4 p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold text-navy">Profile image</h2>
            <div className="flex items-center gap-4">
              <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-white ring-1 ring-line">
                {logoUrl ? (
                  <img src={logoUrl} alt="Profile" className="size-full object-cover" />
                ) : (
                  <Building2 className="size-9" strokeWidth={1.75} />
                )}
              </div>
              <div className="min-w-0">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onLogoChange}
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 text-sm disabled:opacity-60"
                >
                  <Camera className="size-4" strokeWidth={2.2} />
                  {uploadingLogo ? 'Uploading…' : logoUrl ? 'Change image' : 'Upload image'}
                </button>
                <p className="mt-2 text-xs text-muted">JPG, PNG, GIF or WebP, up to 5 MB.</p>
              </div>
            </div>
          </div>

          <div className="surface min-w-0 space-y-4 p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold text-navy">About</h2>
          <div>
            <label className="label">Bio</label>
            <textarea
              className="input-field"
              rows={5}
              value={form.bio || ''}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell customers about your business…"
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              className="accent-primary"
              checked={Boolean(form.isAvailable)}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
            />
            Available for new leads
          </label>
          {profile ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted">
                Token balance:{' '}
                <span className="font-bold text-navy">{profile.tokenBalance}</span>
              </p>
              <Link
                to="/pro/settings"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-4 py-2 text-sm font-bold text-white shadow-md shadow-navy/20 transition hover:brightness-105"
              >
                <Coins className="size-4" strokeWidth={2.2} />
                Buy tokens
              </Link>
            </div>
          ) : null}
          <p className="rounded-xl bg-canvas px-3.5 py-3 text-sm text-muted">
            Your services and service areas are managed in{' '}
            <span className="font-semibold text-navy">Settings</span>.
          </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save profile'}
        </button>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {message ? <p className="text-sm text-success">{message}</p> : null}
      </div>
    </form>
  )
}
