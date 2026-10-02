import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function SetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { refreshMe } = useAuth()
  const [token, setToken] = useState(params.get('token') || '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (params.get('token')) setToken(params.get('token'))
  }, [params])

  function goLogin() {
    const audience = params.get('audience')
    navigate(audience === 'business' ? '/business/login' : '/login', { replace: true })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!token) {
      setError('This set-password link is invalid or missing.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const data = await api.resetPassword({ token, password })
      if (data.token && data.user) {
        localStorage.setItem('token', data.token)
        await refreshMe()
        if (data.user.role === 'CUSTOMER') {
          navigate('/app', { replace: true })
          return
        }
        if (data.user.role === 'PROFESSIONAL') {
          navigate('/pro', { replace: true })
          return
        }
      }
      navigate(params.get('audience') === 'business' ? '/business/login' : '/login', {
        replace: true,
      })
    } catch (err) {
      setError(err.message || 'Could not set password')
    } finally {
      setLoading(false)
    }
  }

  const loginPath = params.get('audience') === 'business' ? '/business/login' : '/login'

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-center font-display text-3xl font-bold text-navy">Set password</h1>
      <p className="mt-2 text-center text-sm text-muted">
        {params.get('audience') === 'business'
          ? 'Create a password for your business account, then you can log in.'
          : 'Create a password to access your account.'}
      </p>

      <form onSubmit={onSubmit} className="surface mt-8 space-y-4 p-6">
        {!token ? (
          <p className="text-sm text-amber-600">
            Open this page from the link in your email to set your password.
          </p>
        ) : null}

        <div>
          <label className="label" htmlFor="set-password">
            New password
          </label>
          <div className="relative">
            <input
              id="set-password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
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
          <label className="label" htmlFor="set-confirm">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="set-confirm"
              type={showConfirm ? 'text' : 'password'}
              required
              minLength={8}
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

        <button type="submit" className="btn-primary w-full" disabled={loading || !token}>
          {loading ? 'Saving…' : 'Set password & continue'}
        </button>

        <div className="flex items-center justify-between gap-3 text-sm">
          <button type="button" onClick={goLogin} className="font-semibold text-slate hover:text-navy">
            Skip for now
          </button>
          <Link to={loginPath} className="font-semibold text-primary">
            {params.get('audience') === 'business' ? 'Business login' : 'Back to login'}
          </Link>
        </div>
      </form>
    </div>
  )
}
