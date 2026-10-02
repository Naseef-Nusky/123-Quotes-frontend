import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import Loading from '../../components/Loading'
import PhoneInput from '../../components/PhoneInput'
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
  const [services, setServices] = useState([])
  const [selectedServices, setSelectedServices] = useState([])
  const [areasText, setAreasText] = useState('')
  const [form, setForm] = useState({ countryCode: DEFAULT_COUNTRY_CODE })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [prof, svc] = await Promise.all([api.getMyProfile(), api.getServices()])
        if (!alive) return
        setProfile(prof.profile)
        setServices(svc.services || [])
        setSelectedServices((prof.profile.services || []).map((s) => s.serviceId || s.service?.id))
        const parsed = parseIntlPhone(prof.profile.phone || '')
        setForm({
          companyName: prof.profile.companyName || '',
          contactName: prof.profile.contactName || '',
          phone: parsed.localNumber,
          countryCode: parsed.countryCode || DEFAULT_COUNTRY_CODE,
          website: prof.profile.website || '',
          bio: prof.profile.bio || '',
          postcode: prof.profile.postcode || '',
          address: prof.profile.address || '',
          city: prof.profile.city || '',
          isAvailable: prof.profile.isAvailable !== false,
        })
        setAreasText(
          (prof.profile.serviceAreas || [])
            .map((a) => [a.postcode, a.city, a.radiusMiles].filter(Boolean).join('|'))
            .join('\n'),
        )
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

  async function onSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const { countryCode: _countryCode, ...profileFields } = form
      await api.updateMyProfile({
        ...profileFields,
        phone: form.phone
          ? formatIntlPhone(dialForCountry(form.countryCode), form.phone)
          : '',
      })
      await api.setMyServices(selectedServices)
      const areas = areasText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [postcode, city, radius] = line.split('|').map((s) => s.trim())
          return {
            postcode: postcode || null,
            city: city || null,
            radiusMiles: radius ? Number(radius) : null,
          }
        })
      await api.setMyAreas(areas)
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
    <form onSubmit={onSave} className="w-full space-y-6">
      <div className="surface space-y-4 p-6">
        <h2 className="font-display text-xl font-bold text-navy">Company details</h2>
        {[
          ['companyName', 'Company name'],
          ['contactName', 'Contact name'],
          ['website', 'Website'],
          ['postcode', 'Postcode'],
          ['city', 'City'],
          ['address', 'Address'],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="label">{label}</label>
            <input
              className="input-field"
              value={form[key] || ''}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
        <div>
          <label className="label">Phone</label>
          <PhoneInput
            dialCode={form.countryCode || DEFAULT_COUNTRY_CODE}
            onDialCodeChange={(code) => setForm({ ...form, countryCode: code })}
            value={form.phone || ''}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
        </div>
        <div>
          <label className="label">Bio</label>
          <textarea
            className="input-field"
            rows={4}
            value={form.bio || ''}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
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
          <p className="text-sm text-muted">Token balance: {profile.tokenBalance}</p>
        ) : null}
      </div>

      <div className="surface space-y-3 p-6">
        <h2 className="font-display text-xl font-bold text-navy">Services</h2>
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {services.map((s) => {
            const checked = selectedServices.includes(s.id)
            return (
              <label key={s.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-primary"
                  checked={checked}
                  onChange={() =>
                    setSelectedServices(
                      checked ? selectedServices.filter((id) => id !== s.id) : [...selectedServices, s.id],
                    )
                  }
                />
                {s.name}
              </label>
            )
          })}
        </div>
      </div>

      <div className="surface space-y-3 p-6">
        <h2 className="font-display text-xl font-bold text-navy">Service areas</h2>
        <p className="text-sm text-muted">One per line: postcode|city|radiusMiles</p>
        <textarea
          className="input-field font-mono text-sm"
          rows={5}
          value={areasText}
          onChange={(e) => setAreasText(e.target.value)}
          placeholder="SW1A|London|15"
        />
      </div>

      {error ? <p className="text-danger">{error}</p> : null}
      {message ? <p className="text-success">{message}</p> : null}

      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  )
}
