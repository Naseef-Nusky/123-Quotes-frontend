import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'

export default function ProfessionalProfile() {
  const { id } = useParams()
  const [pro, setPro] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await api.getProfessional(id)
        if (alive) setPro(data.professional)
      } catch (e) {
        if (alive) setError(e.message)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [id])

  if (loading) return <p className="mx-auto max-w-3xl px-4 py-16 text-muted">Loading…</p>
  if (error) return <p className="mx-auto max-w-3xl px-4 py-16 text-danger">{error}</p>
  if (!pro) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link to="/professionals" className="text-sm font-semibold text-primary">
        ← Directory
      </Link>
      <h1 className="mt-6 font-display text-4xl font-bold text-navy">{pro.companyName}</h1>
      <p className="mt-2 text-slate">
        {pro.contactName}
        {pro.city ? ` · ${pro.city}` : ''}
      </p>
      {pro.website ? (
        <a href={pro.website} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-primary">
          {pro.website}
        </a>
      ) : null}
      <p className="mt-6 text-slate">{pro.bio || 'No bio provided yet.'}</p>

      <div className="mt-8">
        <h2 className="font-display text-xl font-bold text-navy">Services</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(pro.services || []).map((ps) => (
            <span key={ps.service?.id || ps.id} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-primary">
              {ps.service?.name}
            </span>
          ))}
        </div>
      </div>

      {(pro.serviceAreas || []).length ? (
        <div className="mt-8">
          <h2 className="font-display text-xl font-bold text-navy">Areas covered</h2>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {pro.serviceAreas.map((a) => (
              <li key={a.id}>
                {[a.label, a.city, a.postcode].filter(Boolean).join(' · ') || 'Area'}
                {a.radiusMiles ? ` (${a.radiusMiles} mi)` : ''}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Link to="/services" className="btn-primary mt-10">
        Request a quote
      </Link>
    </div>
  )
}
