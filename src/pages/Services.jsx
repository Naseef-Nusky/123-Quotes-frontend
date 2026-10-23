import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { api } from '../api/client'
import Loading from '../components/Loading'
import NewRequest from './customer/NewRequest'

const PAGE_SIZE = 16

export default function Services() {
  const [services, setServices] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const gridTopRef = useRef(null)
  const [searchParams] = useSearchParams()
  // Clicking a service opens the question wizard directly (no /request page).
  // `?open=<slug>` is honoured so old /request?service= links still land here.
  const [wizardSlug, setWizardSlug] = useState(() => searchParams.get('open') || '')

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

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function goToPage(next) {
    const target = Math.min(Math.max(1, next), pageCount)
    setPage(target)
    requestAnimationFrame(() => {
      gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div className="relative isolate overflow-hidden bg-canvas">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px] overflow-hidden"
        aria-hidden
      >
        <img
          src="/banner-services.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4f8fc]/95 via-[#f4f8fc]/75 to-[#f4f8fc]/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8f4fb]/40 via-transparent to-[#f4f8fc]" />
      </div>

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
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search services…"
              className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>

        {error ? <p className="mt-8 text-danger">{error}</p> : null}
        {loading ? <Loading className="mt-8" /> : null}

        {!loading && filtered.length ? (
          <ul ref={gridTopRef} className="mt-10 grid scroll-mt-24 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paged.map((s, index) => {
              // Cards show the service name only — no category eyebrow.
              // Hide description when it just repeats the service name.
              const nameKey = (s.name || '').trim().toLowerCase()
              const desc = (s.shortDesc || s.description || '').trim()
              const showDesc = desc && desc.toLowerCase() !== nameKey
              return (
              <li key={s.id} className="h-full">
                <button
                  type="button"
                  onClick={() => setWizardSlug(s.slug || s.id)}
                  className="group flex h-full w-full flex-col rounded-2xl border border-line bg-white p-4 text-left shadow-[0_14px_36px_-22px_rgba(10,47,92,0.4)] transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_45px_-22px_rgba(10,47,92,0.45)]"
                  style={{
                    animation: 'fade-up 0.5s ease-out both',
                    animationDelay: `${Math.min(index, 8) * 0.05}s`,
                  }}
                >
                  <h2 className="font-display text-base font-bold leading-snug text-navy transition group-hover:text-primary">
                    {s.name}
                  </h2>
                  {showDesc ? (
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate">{desc}</p>
                  ) : null}
                  <span className="mt-auto block pt-3 text-right">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold text-primary transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#3baee8] group-hover:via-[#1e8fd5] group-hover:to-[#0a3a7a] group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/25">
                      Get quotes
                      <ArrowRight
                        className="animate-arrow-nudge size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                        strokeWidth={2.5}
                      />
                    </span>
                  </span>
                </button>
              </li>
              )
            })}
          </ul>
        ) : null}

        {!loading && !filtered.length && !error ? (
          <p className="mt-10 text-muted">
            {query.trim() ? 'No services match your search.' : 'No services available yet.'}
          </p>
        ) : null}

        {!loading && pageCount > 1 ? (
          <>
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Services pages">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-3.5 py-2 text-sm font-semibold text-navy shadow-sm transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" strokeWidth={2.25} />
                Prev
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => goToPage(n)}
                  aria-current={n === currentPage ? 'page' : undefined}
                  className={`min-w-10 rounded-full px-3 py-2 text-sm font-semibold shadow-sm transition ${
                    n === currentPage
                      ? 'bg-brand-gradient text-white'
                      : 'border border-line bg-white text-navy hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === pageCount}
                className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-3.5 py-2 text-sm font-semibold text-navy shadow-sm transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="size-4" strokeWidth={2.25} />
              </button>
            </nav>
            <p className="mt-3 text-center text-xs text-muted">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} services
            </p>
          </>
        ) : null}
      </div>

      {wizardSlug ? (
        <NewRequest embeddedService={wizardSlug} onEmbeddedClose={() => setWizardSlug('')} />
      ) : null}
    </div>
  )
}
