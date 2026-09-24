import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { api } from '../../api/client'

export default function CustomerDashboard() {
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
    <div className="bg-[#f5f5f5]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {loading ? <p className="text-sm text-muted">Loading…</p> : null}
        {error ? <p className="text-sm text-danger">{error}</p> : null}

        <div className="space-y-4">
          {pros.map((pro) => {
            const serviceSlug = pro.services?.[0]?.service?.slug
            return (
              <article
                key={pro.id}
                className="flex flex-col gap-4 border border-line bg-white px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Building2 className="size-7" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-navy">{pro.companyName}</h2>
                    <p className="mt-1 text-sm text-slate">{pro.bio || 'No Additional Details'}</p>
                    <Link
                      to={`/professionals/${pro.id}`}
                      className="mt-2 inline-flex text-sm font-semibold text-primary"
                    >
                      View Profile &gt;
                    </Link>
                  </div>
                </div>

                <p className="shrink-0 text-sm text-slate sm:px-4">No reviews</p>

                <Link
                  to={
                    serviceSlug
                      ? `/request?service=${encodeURIComponent(serviceSlug)}`
                      : '/request'
                  }
                  className="inline-flex shrink-0 items-center justify-center rounded-md bg-gradient-to-b from-[#3baee8] via-[#1e8fd5] to-[#0a3a7a] px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-[#0a3a7a]/25 transition hover:brightness-105"
                >
                  Request Quotation
                </Link>
              </article>
            )
          })}
        </div>

        {!loading && !pros.length && !error ? (
          <p className="py-10 text-center text-sm text-muted">No professionals available yet.</p>
        ) : null}
      </div>
    </div>
  )
}
