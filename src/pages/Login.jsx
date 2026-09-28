import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'

function roleHome(user) {
  if (user?.role === 'PROFESSIONAL') return '/pro'
  if (user?.role === 'CUSTOMER') return '/app'
  return '/'
}

/**
 * @param {{ audience?: 'customer' | 'business' }} props
 */
export default function Login({ audience = 'customer' }) {
  const isBusiness = audience === 'business'
  const { login, loginWithLink, logout } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mode, setMode] = useState('password') // password | link
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifyingLink, setVerifyingLink] = useState(Boolean(params.get('token')))

  function assertAudience(user) {
    if (isBusiness && user.role !== 'PROFESSIONAL') {
      logout()
      throw new Error('This page is for businesses. Please use Login instead.')
    }
    if (!isBusiness && user.role === 'PROFESSIONAL') {
      logout()
      throw new Error('This page is for customers. Please use Business Login instead.')
    }
  }

  useEffect(() => {
    const token = params.get('token')
    if (!token) return

    let cancelled = false
    ;(async () => {
      setVerifyingLink(true)
      setError('')
      try {
        const user = await loginWithLink(token)
        assertAudience(user)
        if (cancelled) return
        const next = params.get('next')
        navigate(next || roleHome(user), { replace: true })
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Invalid or expired login link')
          setVerifyingLink(false)
          setMode('link')
        }
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, loginWithLink, navigate, isBusiness])

  async function onPasswordSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const user = await login(email, password, isBusiness ? 'PROFESSIONAL' : 'CUSTOMER')
      assertAudience(user)
      const next = params.get('next')
      navigate(next || roleHome(user), { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function onLinkSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const data = await api.requestLoginLink({
        email,
        role: isBusiness ? 'PROFESSIONAL' : 'CUSTOMER',
      })
      setMessage(data.message || 'If that email exists, a login link was sent')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (verifyingLink) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
        <h1 className="text-center font-display text-3xl font-bold text-navy">Signing you in…</h1>
        <p className="mt-2 text-center text-sm text-muted">Please wait while we verify your login link.</p>
        {error ? <p className="mt-4 text-center text-sm text-danger">{error}</p> : null}
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-center font-display text-3xl font-bold text-navy">
        {isBusiness ? 'Business Login' : 'Login'}
      </h1>
      <p className="mt-2 text-center text-sm text-muted">
        {isBusiness
          ? 'Sign in to your business account to manage leads and tokens.'
          : 'Sign in to manage your quotes and requests.'}
      </p>

      <div className="mt-8 grid grid-cols-2 gap-1 rounded-xl bg-canvas p-1">
        <button
          type="button"
          onClick={() => {
            setMode('password')
            setError('')
            setMessage('')
          }}
          className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${
            mode === 'password' ? 'bg-white text-navy shadow-sm' : 'text-slate hover:text-navy'
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('link')
            setError('')
            setMessage('')
          }}
          className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${
            mode === 'link' ? 'bg-white text-navy shadow-sm' : 'text-slate hover:text-navy'
          }`}
        >
          Email link
        </button>
      </div>

      {mode === 'password' ? (
        <form onSubmit={onPasswordSubmit} className="surface mt-4 space-y-4 p-6">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="input-field pr-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-navy"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="size-4" strokeWidth={2} />
                ) : (
                  <Eye className="size-4" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Log in'}
          </button>
          <div className="flex justify-between text-sm">
            <Link
              to={isBusiness ? '/forgot-password?role=PROFESSIONAL' : '/forgot-password'}
              className="font-semibold text-primary"
            >
              Forgot password?
            </Link>
            {isBusiness ? (
              <Link to="/login" className="font-semibold text-navy">
                Login
              </Link>
            ) : (
              <Link to="/request" className="font-semibold text-navy">
                Get a quote
              </Link>
            )}
          </div>
        </form>
      ) : (
        <form onSubmit={onLinkSubmit} className="surface mt-4 space-y-4 p-6">
          <p className="text-sm text-slate">
            We&apos;ll email you a secure link to sign in — no password needed.
          </p>
          <div>
            <label className="label" htmlFor="link-email">
              Email
            </label>
            <input
              id="link-email"
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {message ? <p className="text-sm text-success">{message}</p> : null}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Sending…' : 'Send login link'}
          </button>
          {isBusiness ? (
            <Link to="/login" className="block text-center text-sm font-semibold text-navy">
              Login
            </Link>
          ) : (
            <Link to="/request" className="block text-center text-sm font-semibold text-navy">
              Get a quote
            </Link>
          )}
        </form>
      )}

      {isBusiness ? (
        <div className="mt-6 rounded-xl border border-line bg-canvas/60 px-5 py-4 text-center">
          <p className="text-sm text-slate">New business owner?</p>
          <Link
            to="/business/signup"
            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
          >
            Sign up
          </Link>
        </div>
      ) : (
        <p className="mt-6 text-center text-sm text-muted">
          Are you a business?{' '}
          <Link to="/business/login" className="font-semibold text-primary">
            Business Login
          </Link>
        </p>
      )}
    </div>
  )
}

