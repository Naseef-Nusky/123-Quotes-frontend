import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import { api } from '../api/client'
import Loading from '../components/Loading'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories…"
              className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>

        {error ? <p className="mt-8 text-danger">{error}</p> : null}
        {loading ? <Loading className="mt-8" /> : null}

        {!loading && filtered.length ? (
          <div className="mt-10 border-t border-line/80">
            <ul className="divide-y divide-line/70">
              {filtered.map((c) => {
                const count = c.services?.length ?? 0
                return (
                  <li key={c.id}>
                    <Link
                      to={`/categories/${encodeURIComponent(c.slug)}`}
                      className="group flex items-center gap-3 py-3.5 transition hover:bg-white/60 sm:gap-4 sm:px-1"
                    >
                      <div className="min-w-0 flex-1">
                        <h2 className="truncate font-display text-base font-bold text-navy transition group-hover:text-primary sm:text-lg">
                          {c.name}
                        </h2>
                        {c.description ? (
                          <p className="mt-0.5 line-clamp-1 text-sm text-muted">{c.description}</p>
                        ) : null}
                      </div>
                      <span className="hidden shrink-0 text-xs font-semibold text-muted sm:inline">
                        {count} service{count === 1 ? '' : 's'}
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-primary opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                        strokeWidth={2.25}
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}

        {!loading && !filtered.length && !error ? (
          <p className="mt-8 text-muted">
            {query.trim() ? 'No categories match your search.' : 'No categories available yet.'}
          </p>
        ) : null}
      </div>
    </div>
  )
}
