import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { api } from '../api/client'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const data = await api.forgotPassword({ email })
      setMessage(data.message || 'If that email exists, a reset link was sent')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
      <Logo to="/" size="lg" className="mb-6 self-center" />
      <h1 className="text-center font-display text-3xl font-bold text-navy">Forgot password</h1>
      <form onSubmit={onSubmit} className="surface mt-8 space-y-4 p-6">
        <div>
          <label className="label">Email</label>
          <input type="email" required className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {message ? <p className="text-sm text-success">{message}</p> : null}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
        <Link to="/login" className="block text-center text-sm font-semibold text-primary">
          Back to login
        </Link>
      </form>
    </div>
  )
}
