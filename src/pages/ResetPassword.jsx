import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Logo from '../components/Logo'
import { api } from '../api/client'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const [token, setToken] = useState(params.get('token') || '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (params.get('token')) setToken(params.get('token'))
  }, [params])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!token) {
      setError('This reset link is invalid or missing. Please request a new one.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const data = await api.resetPassword({ token, password })
      setMessage(data.message || 'Password updated')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
      <Logo to="/" size="lg" className="mb-6 self-center" />
      <h1 className="text-center font-display text-3xl font-bold text-navy">Reset password</h1>
      <p className="mt-2 text-center text-sm text-muted">Choose a new password for your account.</p>

      <form onSubmit={onSubmit} className="surface mt-8 space-y-4 p-6">
        {!token ? (
          <p className="text-sm text-amber-600">
            Open this page from the link in your email, or{' '}
            <Link to="/forgot-password" className="font-semibold text-primary">
              request a new reset link
            </Link>
            .
          </p>
        ) : null}

        <div>
          <label className="label" htmlFor="new-password">
            New password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              className="input-field pr-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-navy"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" strokeWidth={2} /> : <Eye className="size-4" strokeWidth={2} />}
            </button>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="confirm-password">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              required
              minLength={6}
              className="input-field pr-11"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-navy"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="size-4" strokeWidth={2} /> : <Eye className="size-4" strokeWidth={2} />}
            </button>
          </div>
        </div>

        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {message ? (
          <p className="text-sm text-success">
            {message}.{' '}
            <Link to="/login" className="font-bold underline">
              Log in
            </Link>
          </p>
        ) : null}

        <button type="submit" className="btn-primary w-full" disabled={loading || !token}>
          {loading ? 'Updating…' : 'Update password'}
        </button>
        <Link to="/login" className="block text-center text-sm font-semibold text-primary">
          Back to login
        </Link>
      </form>
    </div>
  )
}
