import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { api } from '../../api/client'

export default function AvailablePros() {
  const [pros, setPros] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    api
      .getDirectory()
      .then((d) => {
        if (!cancelled) setPros(d.professionals || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load professionals')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-navy">Available Pros.</h1>
      {loading ? <p className="mt-4 text-sm text-muted">Loading…</p> : null}
      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      <div className="mt-6 divide-y divide-line border-y border-line">
        {pros.map((pro) => (
          <article key={pro.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Building2 className="size-7" strokeWidth={1.75} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-bold text-navy">{pro.companyName}</h2>
                  <span className="text-xs text-muted">No reviews.</span>
                </div>
                <p className="mt-1 text-sm text-slate">{pro.bio || 'No Additional Details.'}</p>
                <Link to={`/pro/available-pros/${pro.id}`} className="mt-2 inline-flex text-sm font-semibold text-primary">
                  View Profile &gt;
                </Link>
              </div>
            </div>
            <button type="button" className="btn-primary !rounded-md !py-2.5 self-start sm:self-center">
              Request Quotation
            </button>
          </article>
        ))}
        {!loading && !pros.length ? (
          <p className="py-8 text-center text-sm text-muted">No professionals in the directory yet.</p>
        ) : null}
      </div>
    </section>
  )
}
