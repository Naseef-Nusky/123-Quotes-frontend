import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Logo from '../components/Logo'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { registerCustomer, registerProfessional } = useAuth()
  const [params, setParams] = useSearchParams()
  const role = params.get('role') === 'professional' ? 'professional' : 'customer'
  const [services, setServices] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    postcode: '',
  })
  const [pro, setPro] = useState({
    companyName: '',
    contactName: '',
    email: '',
    password: '',
    phone: '',
    postcode: '',
    serviceIds: [],
  })

  useEffect(() => {
    if (role === 'professional') {
      api.getServices().then((d) => setServices(d.services || [])).catch(() => {})
    }
  }, [role])

  function setRole(next) {
    setParams(next === 'professional' ? { role: 'professional' } : {})
    setMessage('')
    setError('')
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      if (role === 'customer') {
        const data = await registerCustomer(customer)
        setMessage(data.message || 'Registered. Please verify your email.')
      } else {
        const data = await registerProfessional(pro)
        setMessage(data.message || 'Registered. Please verify your email.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Logo to="/" size="lg" className="mb-6 mx-auto" />
      <h1 className="text-center font-display text-3xl font-bold text-navy">Create your account</h1>

      <div className="mt-6 flex rounded-xl border border-line bg-white p-1">
        <button
          type="button"
          className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${role === 'customer' ? 'bg-primary text-white' : 'text-slate'}`}
          onClick={() => setRole('customer')}
        >
          Customer
        </button>
        <button
          type="button"
          className={`flex-1 rounded-lg py-2.5 text-sm font-bold ${role === 'professional' ? 'bg-primary text-white' : 'text-slate'}`}
          onClick={() => setRole('professional')}
        >
          Professional
        </button>
      </div>

      <form onSubmit={onSubmit} className="surface mt-6 space-y-4 p-6">
        {role === 'customer' ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">First name</label>
                <input required className="input-field" value={customer.firstName} onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })} />
              </div>
              <div>
                <label className="label">Last name</label>
                <input required className="input-field" value={customer.lastName} onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" required className="input-field" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" required minLength={6} className="input-field" value={customer.password} onChange={(e) => setCustomer({ ...customer, password: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Phone</label>
                <input className="input-field" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
              </div>
              <div>
                <label className="label">Postcode</label>
                <input className="input-field" value={customer.postcode} onChange={(e) => setCustomer({ ...customer, postcode: e.target.value })} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="label">Company name</label>
              <input required className="input-field" value={pro.companyName} onChange={(e) => setPro({ ...pro, companyName: e.target.value })} />
            </div>
            <div>
              <label className="label">Contact name</label>
              <input required className="input-field" value={pro.contactName} onChange={(e) => setPro({ ...pro, contactName: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" required className="input-field" value={pro.email} onChange={(e) => setPro({ ...pro, email: e.target.value })} />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" required minLength={6} className="input-field" value={pro.password} onChange={(e) => setPro({ ...pro, password: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Phone</label>
                <input className="input-field" value={pro.phone} onChange={(e) => setPro({ ...pro, phone: e.target.value })} />
              </div>
              <div>
                <label className="label">Postcode</label>
                <input className="input-field" value={pro.postcode} onChange={(e) => setPro({ ...pro, postcode: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Services you offer</label>
              <div className="mt-2 max-h-40 space-y-2 overflow-y-auto rounded-xl border border-line p-3">
                {services.map((s) => {
                  const checked = pro.serviceIds.includes(s.id)
                  return (
                    <label key={s.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="accent-primary"
                        checked={checked}
                        onChange={() =>
                          setPro({
                            ...pro,
                            serviceIds: checked
                              ? pro.serviceIds.filter((id) => id !== s.id)
                              : [...pro.serviceIds, s.id],
                          })
                        }
                      />
                      {s.name}
                    </label>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {message ? (
          <p className="text-sm text-success">
            {message}{' '}
            <Link to="/verify-email" className="font-bold underline">
              Verify email
            </Link>
          </p>
        ) : null}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
