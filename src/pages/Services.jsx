import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'

export default function Services() {
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || ''

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const [catRes, svcRes] = await Promise.all([
          api.getCategories(),
          api.getServices(category ? { category } : {}),
        ])
        if (!alive) return
        setCategories(catRes.categories || [])
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
  }, [category])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-navy">Services</h1>
      <p className="mt-2 max-w-2xl text-slate">Choose a service to start a quote request.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setParams({})}
          className={`rounded-full px-4 py-2 text-sm font-bold ${
            !category ? 'bg-primary text-white' : 'border border-line bg-white text-slate'
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setParams({ category: c.slug })}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              category === c.slug ? 'bg-primary text-white' : 'border border-line bg-white text-slate'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {error ? <p className="mt-6 text-danger">{error}</p> : null}
      {loading ? <p className="mt-8 text-muted">Loading services…</p> : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.id}
            to={`/services/${s.slug}`}
            className="surface p-5 transition hover:border-primary/40 hover:shadow-md"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-primary">{s.category?.name}</p>
            <h2 className="mt-2 font-display text-xl font-bold text-navy">{s.name}</h2>
            <p className="mt-2 text-sm text-muted">{s.shortDesc || s.description}</p>
            <p className="mt-4 text-sm font-bold text-primary">View details →</p>
          </Link>
        ))}
      </div>

      {!loading && !services.length && !error ? (
        <p className="mt-8 text-muted">No services found for this filter.</p>
      ) : null}
    </div>
  )
}
