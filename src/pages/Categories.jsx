import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import { api } from '../api/client'

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
    if (!term) return categories
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        String(c.description || '')
          .toLowerCase()
          .includes(term) ||
        String(c.slug || '')
          .toLowerCase()
          .includes(term),
    )
  }, [categories, query])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-4xl font-bold text-navy">Categories</h1>
          <p className="mt-2 max-w-2xl text-slate">
            Browse by category, then pick a service to get free quotes.
          </p>
          <p className="mt-3 text-sm">
            <Link to="/services" className="font-semibold text-primary hover:underline">
              View all services →
            </Link>
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

      {error ? <p className="mt-6 text-danger">{error}</p> : null}
      {loading ? <p className="mt-8 text-muted">Loading categories…</p> : null}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const count = c.services?.length ?? 0
          return (
            <Link
              key={c.id}
              to={`/categories/${encodeURIComponent(c.slug)}`}
              className="surface group flex h-full min-w-0 flex-col p-5 transition hover:border-primary/40 hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Category</p>
              <h2 className="mt-2 font-display text-xl font-bold text-navy group-hover:text-primary">
                {c.name}
              </h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                {c.description || `${count} service${count === 1 ? '' : 's'} available`}
              </p>
              <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                {count} service{count === 1 ? '' : 's'}
                <ArrowRight
                  className="size-4 transition group-hover:translate-x-0.5"
                  strokeWidth={2.25}
                />
              </p>
            </Link>
          )
        })}
      </div>

      {!loading && !filtered.length && !error ? (
        <p className="mt-8 text-muted">
          {query.trim() ? 'No categories match your search.' : 'No categories available yet.'}
        </p>
      ) : null}
    </div>
  )
}
