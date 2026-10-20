import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { api } from '../api/client'
import Loading from '../components/Loading'
import { BANNERS } from '../data/banners'

export default function CategoryDetail() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [services, setServices] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const [catRes, svcRes] = await Promise.all([
          api.getCategories(),
          api.getServices(slug ? { category: slug } : {}),
        ])
        if (!alive) return
        const match = (catRes.categories || []).find((c) => c.slug === slug) || null
        setCategory(match)
        setServices(svcRes.services || [])
        if (!match) setError('Category not found')
      } catch (e) {
        if (alive) setError(e.message)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [slug])

  return (
    <div className="relative isolate overflow-hidden bg-canvas">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] overflow-hidden" aria-hidden>
        <img src={BANNERS.categoryDetail} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f4f8fc]/95 via-[#f4f8fc]/75 to-[#f4f8fc]/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8f4fb]/40 via-transparent to-[#f4f8fc]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
        >
          <ArrowLeft className="size-4" strokeWidth={2.25} />
          All categories
        </Link>

        <header className="animate-fade-up mt-6 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Category</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            {category?.name || (loading ? '…' : 'Category')}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate">
            {category?.description || 'Choose a service to start a quote request.'}
          </p>
        </header>

        {error ? <p className="mt-8 text-danger">{error}</p> : null}
        {loading ? <Loading className="mt-8" /> : null}

        {!loading && services.length ? (
          <ul className="mt-10 divide-y divide-line/80 overflow-hidden rounded-2xl border border-line/80 bg-white/80 shadow-[0_18px_50px_-28px_rgba(10,47,92,0.35)] backdrop-blur-sm">
            {services.map((s, index) => (
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
                      {s.category?.name || category?.name}
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

        {!loading && category && !services.length && !error ? (
          <p className="mt-10 text-muted">No services in this category yet.</p>
        ) : null}
      </div>
    </div>
  )
}
