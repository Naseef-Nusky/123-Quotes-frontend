import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { api } from '../api/client'

export default function Services() {
  const [services, setServices] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const svcRes = await api.getServices()
        if (!alive) return
        setServices(svcRes.services || [])
      } catch (e) {
        if (alive) setError(e.message)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return services
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        String(s.shortDesc || '')
          .toLowerCase()
          .includes(term) ||
        String(s.description || '')
          .toLowerCase()
          .includes(term) ||
        String(s.category?.name || '')
          .toLowerCase()
          .includes(term) ||
        String(s.slug || '')
          .toLowerCase()
          .includes(term),
    )
  }, [services, query])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-navy">Services</h1>
          <p className="mt-2 max-w-2xl text-slate">Choose a service to start a quote request.</p>
          <p className="mt-3 text-sm">
            <Link to="/categories" className="font-semibold text-primary hover:underline">
              Browse by category →
            </Link>
          </p>
        </div>

        <label className="relative block w-full max-w-sm">
          <span className="sr-only">Search services</span>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
            strokeWidth={2}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services…"
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>

      {error ? <p className="mt-6 text-danger">{error}</p> : null}
      {loading ? <p className="mt-8 text-muted">Loading services…</p> : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <Link
            key={s.id}
            to={`/request?service=${encodeURIComponent(s.slug)}`}
            className="surface p-5 transition hover:border-primary/40 hover:shadow-md"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-primary">{s.category?.name}</p>
            <h2 className="mt-2 font-display text-xl font-bold text-navy">{s.name}</h2>
            <p className="mt-2 text-sm text-muted">{s.shortDesc || s.description}</p>
            <p className="mt-4 text-sm font-bold text-primary">Get quotes →</p>
          </Link>
        ))}
      </div>

      {!loading && !filtered.length && !error ? (
        <p className="mt-8 text-muted">
          {query.trim() ? 'No services match your search.' : 'No services available yet.'}
        </p>
      ) : null}
    </div>
  )
}
