import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Logo from '../components/Logo'
import { api } from '../api/client'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const [token, setToken] = useState(params.get('token') || '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (params.get('token')) setToken(params.get('token'))
  }, [params])

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const data = await api.verifyEmail({ token })
      setMessage(data.message || 'Email verified')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
      <Logo to="/" size="lg" className="mb-6 self-center" />
      <h1 className="text-center font-display text-3xl font-bold text-navy">Verify email</h1>
      <form onSubmit={onSubmit} className="surface mt-8 space-y-4 p-6">
        <div>
          <label className="label">Verification token</label>
          <input required className="input-field font-mono text-sm" value={token} onChange={(e) => setToken(e.target.value)} />
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {message ? <p className="text-sm text-success">{message}</p> : null}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Verifying…' : 'Verify'}
        </button>
        <Link to="/login" className="block text-center text-sm font-semibold text-primary">
          Continue to login
        </Link>
      </form>
    </div>
  )
}
