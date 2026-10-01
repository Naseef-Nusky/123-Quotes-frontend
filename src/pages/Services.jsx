import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
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
    <div className="relative isolate overflow-hidden bg-canvas">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(ellipse_at_top,_rgba(30,143,213,0.16),_transparent_55%),linear-gradient(180deg,#e8f4fb_0%,#f4f8fc_60%,#f4f8fc_100%)]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 animate-fade-up">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Marketplace</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              Services
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate">
              Choose a service to start a quote request.
            </p>
            <p className="mt-3 text-sm">
              <Link to="/categories" className="font-semibold text-primary hover:underline">
                Browse by category →
              </Link>
            </p>
          </div>

          <label className="relative block w-full max-w-sm shrink-0">
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

        {error ? <p className="mt-8 text-danger">{error}</p> : null}
        {loading ? <p className="mt-8 text-muted">Loading services…</p> : null}

        {!loading && filtered.length ? (
          <ul className="mt-10 divide-y divide-line/80 overflow-hidden rounded-2xl border border-line/80 bg-white/80 shadow-[0_18px_50px_-28px_rgba(10,47,92,0.35)] backdrop-blur-sm">
            {filtered.map((s, index) => (
              <li key={s.id}>
                <Link
                  to={`/request?service=${encodeURIComponent(s.slug)}`}
                  className="group flex items-stretch gap-4 px-5 py-5 transition hover:bg-[#eef7fc]/90 sm:gap-6 sm:px-7 sm:py-6"
                  style={{
                    animation: 'fade-up 0.5s ease-out both',
                    animationDelay: `${Math.min(index, 8) * 0.05}s`,
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                      {s.category?.name}
                    </p>
                    <h2 className="mt-1 font-display text-xl font-bold text-navy transition group-hover:text-primary">
                      {s.name}
                    </h2>
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate">
                      {s.shortDesc || s.description}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center self-center text-sm font-bold text-primary">
                    Get quotes
                    <ArrowRight
                      className="ml-2 size-5 transition group-hover:translate-x-1"
                      strokeWidth={2.25}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {!loading && !filtered.length && !error ? (
          <p className="mt-10 text-muted">
            {query.trim() ? 'No services match your search.' : 'No services available yet.'}
          </p>
        ) : null}
      </div>
    </div>
  )
}
