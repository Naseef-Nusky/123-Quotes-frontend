import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function SetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { refreshMe } = useAuth()
  const [token, setToken] = useState(params.get('token') || '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (params.get('token')) setToken(params.get('token'))
  }, [params])

  function goLogin() {
    navigate('/login', { replace: true })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!token) {
      setError('This set-password link is invalid or missing.')
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
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.message || 'Could not set password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-b from-[#0a3a7a] to-[#0a2f5c] px-4 py-10">
      <div className="w-full max-w-lg overflow-hidden rounded-md bg-white shadow-2xl">
        <div className="relative border-b border-slate-200 px-6 py-4 text-center">
          <h1 className="text-lg font-semibold text-slate-700">Set Password</h1>
          <button
            type="button"
            onClick={goLogin}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            aria-label="Close"
          >
            <X className="size-5" strokeWidth={2} />
          </button>
        </div>

        <form id="set-password-form" onSubmit={onSubmit} className="px-6 py-6">
          <label className="mb-5 block text-left text-sm font-bold text-slate-700">
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded border border-slate-300 px-3 py-2.5 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="block text-left text-sm font-bold text-slate-700">
            Re-type Password
            <input
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-2 w-full rounded border border-slate-300 px-3 py-2.5 text-sm font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
          {!token ? (
            <p className="mt-3 text-sm text-amber-600">
              Open this page from the link in your email to set your password.
            </p>
          ) : null}
        </form>

        <div className="grid grid-cols-2 gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={goLogin}
            className="rounded-md bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-4 py-3 text-sm font-bold text-white transition hover:brightness-105"
          >
            Skip for Now
          </button>
          <button
            type="submit"
            form="set-password-form"
            disabled={loading}
            className="rounded-md bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-4 py-3 text-sm font-bold text-white transition hover:brightness-105 disabled:opacity-60"
          >
            {loading ? 'Saving…' : 'Set Password'}
          </button>
        </div>
      </div>
    </div>
  )
}
