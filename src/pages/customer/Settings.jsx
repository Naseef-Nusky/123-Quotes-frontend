import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { api } from '../../api/client'
import PhoneInput from '../../components/PhoneInput'
import { useAuth } from '../../context/AuthContext'
import {
  DEFAULT_COUNTRY_CODE,
  dialForCountry,
  formatIntlPhone,
  parseIntlPhone,
} from '../../data/countryDialCodes'

export default function CustomerSettings() {
  const navigate = useNavigate()
  const { user, logout, refreshMe } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const initialPhone = parseIntlPhone(user?.customer?.phone || '')
  const [phone, setPhone] = useState(initialPhone.localNumber)
  const [countryCode, setCountryCode] = useState(
    initialPhone.countryCode || DEFAULT_COUNTRY_CODE,
  )

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [profileMsg, setProfileMsg] = useState('')
  const [profileErr, setProfileErr] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [sendingLink, setSendingLink] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteErr, setDeleteErr] = useState('')

  useEffect(() => {
    setFirstName(user?.customer?.firstName || '')
    setLastName(user?.customer?.lastName || '')
    const parsed = parseIntlPhone(user?.customer?.phone || '')
    setPhone(parsed.localNumber)
    setCountryCode(parsed.countryCode || DEFAULT_COUNTRY_CODE)
  }, [user?.customer?.firstName, user?.customer?.lastName, user?.customer?.phone])

  async function saveProfile(e) {
    e.preventDefault()
    setProfileMsg('')
    setProfileErr('')
    if (!firstName.trim() || !lastName.trim()) {
      setProfileErr('First name and last name are required.')
      return
    }
    setSavingProfile(true)
    try {
      await api.updateCustomerProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim()
          ? formatIntlPhone(dialForCountry(countryCode), phone.trim())
          : '',
      })
      await refreshMe?.()
      setProfileMsg('Profile saved.')
    } catch (err) {
      setProfileErr(err.message || 'Save failed')
    } finally {
      setSavingProfile(false)
    }
  }

  async function changePassword(e) {
    e.preventDefault()
    setPwMsg('')
    setPwErr('')
    if (newPassword.length < 8) {
      setPwErr('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwErr('New password and confirm password do not match.')
      return
    }
    setSavingPw(true)
    try {
      await api.changePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPwMsg('Password changed successfully.')
    } catch (err) {
      setPwErr(err.message || 'Password change failed')
    } finally {
      setSavingPw(false)
    }
  }

  async function emailResetLink() {
    setPwMsg('')
    setPwErr('')
    if (!user?.email) return
    setSendingLink(true)
    try {
      await api.forgotPassword({ email: user.email, role: 'CUSTOMER' })
      setPwMsg('Password reset link sent. Please check your email.')
    } catch (err) {
      setPwErr(err.message || 'Could not send reset link')
    } finally {
      setSendingLink(false)
    }
  }

  async function deleteAccount() {
    if (
      !window.confirm(
        'Are you sure you want to delete your account? Your profile and personal details will be permanently deleted. This cannot be undone.',
      )
    ) {
      return
    }
    setDeleting(true)
    setDeleteErr('')
    try {
      await api.deleteCustomerAccount()
      logout()
      navigate('/', { replace: true })
    } catch (err) {
      setDeleteErr(err.message || 'Failed to delete account')
      setDeleting(false)
    }
  }

  return (
    <section className="w-full px-4 py-6 text-left sm:px-6 sm:py-8">
      <div className="mx-auto max-w-2xl space-y-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">Settings</h1>
          <p className="mt-1 text-sm text-muted">
            Manage your profile, password and account.
          </p>
        </div>

        <form onSubmit={saveProfile} className="surface space-y-4 p-6">
          <h2 className="text-lg font-bold text-navy">Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="cs-first">First name</label>
              <input
                id="cs-first"
                className="input-field"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="cs-last">Last name</label>
              <input
                id="cs-last"
                className="input-field"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input-field" type="email" value={user?.email || ''} disabled />
            <p className="mt-1 text-xs text-muted">Email cannot be changed.</p>
          </div>
          <div>
            <label className="label">Contact number</label>
            <PhoneInput
              dialCode={countryCode}
              onDialCodeChange={setCountryCode}
              value={phone}
              onChange={setPhone}
            />
          </div>
          {profileMsg ? <p className="text-sm text-success">{profileMsg}</p> : null}
          {profileErr ? <p className="text-sm text-danger">{profileErr}</p> : null}
          <button type="submit" className="btn-primary" disabled={savingProfile}>
            {savingProfile ? 'Saving…' : 'Save profile'}
          </button>
        </form>

        <form onSubmit={changePassword} className="surface space-y-4 p-6">
          <h2 className="text-lg font-bold text-navy">Change password</h2>
          <div>
            <label className="label" htmlFor="cs-current">Current password</label>
            <div className="relative">
              <input
                id="cs-current"
                className="input-field pr-11"
                type={showCurrent ? 'text' : 'password'}
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-navy"
                aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
              >
                {showCurrent ? <EyeOff className="size-4" strokeWidth={2} /> : <Eye className="size-4" strokeWidth={2} />}
              </button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="cs-new">New password</label>
              <div className="relative">
                <input
                  id="cs-new"
                  className="input-field pr-11"
                  type={showNew ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-navy"
                  aria-label={showNew ? 'Hide new password' : 'Show new password'}
                >
                  {showNew ? <EyeOff className="size-4" strokeWidth={2} /> : <Eye className="size-4" strokeWidth={2} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="cs-confirm">Confirm new password</label>
              <div className="relative">
                <input
                  id="cs-confirm"
                  className="input-field pr-11"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-navy"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? <EyeOff className="size-4" strokeWidth={2} /> : <Eye className="size-4" strokeWidth={2} />}
                </button>
              </div>
            </div>
          </div>
          {pwMsg ? <p className="text-sm text-success">{pwMsg}</p> : null}
          {pwErr ? <p className="text-sm text-danger">{pwErr}</p> : null}
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="btn-primary" disabled={savingPw}>
              {savingPw ? 'Saving…' : 'Change password'}
            </button>
            <button
              type="button"
              onClick={emailResetLink}
              disabled={sendingLink}
              className="text-sm font-semibold text-primary hover:underline disabled:opacity-60"
            >
              {sendingLink ? 'Sending…' : 'Forgot current password? Email me a reset link'}
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-danger/25 bg-danger/5 p-6">
          <h2 className="text-lg font-bold text-danger">Delete account</h2>
          <p className="mt-2 text-sm text-slate">
            Permanently delete your account and personal details. Your quote requests will be
            kept without your name attached. This cannot be undone.
          </p>
          {deleteErr ? <p className="mt-3 text-sm text-danger">{deleteErr}</p> : null}
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
    </section>
  )
}
