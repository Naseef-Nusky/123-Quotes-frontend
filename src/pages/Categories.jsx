import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { api } from '../api/client'
import Loading from '../components/Loading'

const PAGE_SIZE = 12

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const gridTopRef = useRef(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await api.getCategories()
        if (!alive) return
        setCategories(data.categories || [])
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
    const list = term
      ? categories.filter(
          (c) =>
            c.name.toLowerCase().includes(term) ||
            String(c.description || '')
              .toLowerCase()
              .includes(term) ||
            String(c.slug || '')
              .toLowerCase()
              .includes(term),
        )
      : categories
    return [...list].sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))
  }, [categories, query])

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
        className="pointer-events-none absolute inset-x-0 top-0 h-[280px] overflow-hidden"
        aria-hidden
      >
        <img
          src="/banner-categories.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4f8fc]/95 via-[#f4f8fc]/75 to-[#f4f8fc]/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8f4fb]/40 via-transparent to-[#f4f8fc]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 animate-fade-up">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Directory</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
              Categories
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-slate">
              Browse by category, then pick a service to get free quotes.
            </p>
            <p className="mt-3 text-sm">
              <Link to="/services" className="font-semibold text-primary hover:underline">
                View all services →
              </Link>
              {!loading ? (
                <span className="ml-3 text-muted">
                  {filtered.length} categor{filtered.length === 1 ? 'y' : 'ies'}
                  {query.trim() ? ' matched' : ''}
                </span>
              ) : null}
            </p>
          </div>

          <label className="relative block w-full max-w-sm shrink-0">
            <span className="sr-only">Search categories</span>
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
              placeholder="Search categories…"
              className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>

        {error ? <p className="mt-8 text-danger">{error}</p> : null}
        {loading ? <Loading className="mt-8" /> : null}

        {!loading && filtered.length ? (
          <ul ref={gridTopRef} className="mt-10 grid scroll-mt-24 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paged.map((c, index) => {
              const count = c.services?.length ?? 0
              return (
                <li key={c.id} className="h-full">
                  <Link
                    to={`/categories/${encodeURIComponent(c.slug)}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_14px_36px_-22px_rgba(10,47,92,0.4)] transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_45px_-22px_rgba(10,47,92,0.45)]"
                    style={{
                      animation: 'fade-up 0.5s ease-out both',
                      animationDelay: `${Math.min(index, 8) * 0.05}s`,
                    }}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-panel">
                      {c.imageUrl ? (
                        <img
                          src={c.imageUrl}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-panel to-navy/10" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h2 className="font-display text-base font-bold leading-snug text-navy transition group-hover:text-primary">
                        {c.name}
                      </h2>
                      <span className="mt-auto flex items-center justify-between gap-2 pt-3">
                        <span className="text-xs font-semibold text-muted">
                          {count} service{count === 1 ? '' : 's'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold text-primary transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#3baee8] group-hover:via-[#1e8fd5] group-hover:to-[#0a3a7a] group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/25">
                          Explore
                          <ArrowRight
                            className="animate-arrow-nudge size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                            strokeWidth={2.5}
                          />
                        </span>
                      </span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : null}

        {!loading && !filtered.length && !error ? (
          <p className="mt-8 text-muted">
            {query.trim() ? 'No categories match your search.' : 'No categories available yet.'}
          </p>
        ) : null}

        {!loading && pageCount > 1 ? (
          <>
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Categories pages">
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
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} categories
            </p>
          </>
        ) : null}
      </div>
    </div>
  )
}
