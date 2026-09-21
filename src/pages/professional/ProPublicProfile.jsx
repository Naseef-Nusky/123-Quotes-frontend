import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Building2, Phone, Mail } from 'lucide-react'
import { api } from '../../api/client'

export default function ProPublicProfile() {
  const { id } = useParams()
  const [pro, setPro] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .getProfessional(id)
      .then((d) => {
        if (!cancelled) setPro(d.professional || null)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Professional not found')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const serviceName = useMemo(
    () => pro?.services?.[0]?.service?.name || 'Service',
    [pro],
  )

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-sm text-muted">Loading profile…</p>
      </section>
    )
  }

  if (error || !pro) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-sm text-rose-600">{error || 'Professional not found'}</p>
        <Link to="/pro/available-pros" className="mt-4 inline-flex text-sm font-semibold text-primary">
          ← Back to Available Pros.
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="text-center lg:text-left">
          <div className="mx-auto flex size-28 items-center justify-center rounded-xl bg-slate-100 lg:mx-0">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary text-white">
              <Building2 className="size-10" strokeWidth={1.75} />
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-navy">{pro.companyName}</h1>
          <p className="mt-1 text-sm text-muted">No reviews</p>
          <span className="mt-3 inline-flex rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary">
            {serviceName}
          </span>
          <div className="mt-5 space-y-2 text-sm text-slate">
            <p className="inline-flex items-center justify-center gap-2 lg:justify-start">
              <Phone className="size-4 text-primary" strokeWidth={2} />
              {pro.phone || '—'}
            </p>
            <p className="inline-flex items-center justify-center gap-2 lg:justify-start">
              <Mail className="size-4 text-primary" strokeWidth={2} />
              {pro.email || '—'}
            </p>
          </div>
        </aside>

        <div>
          <div>
            <div className="flex items-center justify-between border-b border-line pb-2">
              <h2 className="text-lg font-bold text-navy">Description</h2>
            </div>
            <p className="mt-4 text-sm text-slate">{pro.bio || 'No Description Available'}</p>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <h2 className="text-lg font-bold text-navy">Reviews</h2>
              <button type="button" className="btn-secondary !rounded-md !py-2 !text-sm">
                Write a Review
              </button>
            </div>
            <p className="mt-4 text-sm text-slate">No Reviews Available</p>
          </div>

          <Link to="/pro/available-pros" className="mt-8 inline-flex text-sm font-semibold text-primary">
            ← Back to Available Pros.
          </Link>
        </div>
      </div>
    </section>
  )
}
