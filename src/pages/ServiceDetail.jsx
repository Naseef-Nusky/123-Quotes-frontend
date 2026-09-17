import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function ServiceDetail() {
  const { slug } = useParams()
  const { isAuthenticated, isCustomer } = useAuth()
  const [service, setService] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const data = await api.getService(slug)
        if (alive) setService(data.service)
      } catch (e) {
        if (alive) setError(e.message)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [slug])

  if (loading) return <p className="mx-auto max-w-3xl px-4 py-16 text-muted">Loading…</p>
  if (error) return <p className="mx-auto max-w-3xl px-4 py-16 text-danger">{error}</p>
  if (!service) return null

  const ctaTo = isCustomer
    ? `/app/requests/new?service=${service.id}`
    : isAuthenticated
      ? '/app'
      : `/login?next=/app/requests/new?service=${service.id}`

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link to="/services" className="text-sm font-semibold text-primary">
        ← All services
      </Link>
      <p className="mt-6 text-xs font-bold uppercase tracking-wider text-primary">{service.category?.name}</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-navy">{service.name}</h1>
      <p className="mt-4 text-lg text-slate">{service.description || service.shortDesc}</p>

      <div className="surface mt-8 p-6">
        <p className="font-display text-lg font-bold text-navy">What happens next</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
          <li>Answer a short questionnaire tailored to this service.</li>
          <li>Share your location so we can match nearby professionals.</li>
          <li>Matched pros can unlock your contact details and send quotes.</li>
        </ul>
        {(service.questions?.length || 0) > 0 ? (
          <p className="mt-4 text-sm text-slate">
            This request includes <strong>{service.questions.length}</strong> question
            {service.questions.length === 1 ? '' : 's'}.
          </p>
        ) : null}
        <Link to={ctaTo} className="btn-primary mt-6">
          Get quotes for {service.name}
        </Link>
      </div>
    </div>
  )
}
