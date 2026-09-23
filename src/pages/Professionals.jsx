import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'

export default function Professionals() {
  const [pros, setPros] = useState([])
  const [services, setServices] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [params, setParams] = useSearchParams()
  const service = params.get('service') || ''
  const city = params.get('city') || ''
  const postcode = params.get('postcode') || ''
  const q = params.get('q') || ''
  const [cityInput, setCityInput] = useState(city)
  const [postcodeInput, setPostcodeInput] = useState(postcode)

  useEffect(() => {
    api.getServices().then((d) => setServices(d.services || [])).catch(() => {})
  }, [])

  useEffect(() => {
    setCityInput(city)
    setPostcodeInput(postcode)
  }, [city, postcode])

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const query = {}
        if (service) query.service = service
        if (city) query.city = city
        if (postcode) query.postcode = postcode
        const data = await api.getDirectory(query)
        let list = data.professionals || []
        if (q.trim()) {
          const term = q.trim().toLowerCase()
          list = list.filter(
            (p) =>
              p.companyName?.toLowerCase().includes(term) ||
              p.bio?.toLowerCase().includes(term) ||
              (p.services || []).some((ps) => ps.service?.name?.toLowerCase().includes(term)),
          )
        }
        if (alive) setPros(list)
      } catch (e) {
        if (alive) setError(e.message)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [service, city, postcode, q])

  function applyFilters(e) {
    e.preventDefault()
    const next = {}
    if (service) next.service = service
    if (cityInput.trim()) next.city = cityInput.trim()
    if (postcodeInput.trim()) next.postcode = postcodeInput.trim()
    if (q) next.q = q
    setParams(next)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-navy">Professional directory</h1>
      <p className="mt-2 max-w-2xl text-slate">Browse available professionals by service, city and postcode.</p>

      <form onSubmit={applyFilters} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <select
          className="input-field sm:max-w-xs"
          value={service}
          onChange={(e) => {
            const next = {}
            if (e.target.value) next.service = e.target.value
            if (city) next.city = city
            if (postcode) next.postcode = postcode
            if (q) next.q = q
            setParams(next)
          }}
        >
          <option value="">All services</option>
          {services.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          className="input-field sm:max-w-xs"
          placeholder="City"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
        />
        <input
          className="input-field sm:max-w-[160px]"
          placeholder="Postcode"
          value={postcodeInput}
          onChange={(e) => setPostcodeInput(e.target.value)}
        />
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      {q ? (
        <p className="mt-4 text-sm text-muted">
          Showing results related to <span className="font-semibold text-navy">“{q}”</span>
        </p>
      ) : null}

      {loading ? <p className="mt-8 text-muted">Loading directory…</p> : null}
      {error ? <p className="mt-8 text-danger">{error}</p> : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {pros.map((p) => (
          <Link key={p.id} to={`/professionals/${p.id}`} className="surface p-5 transition hover:border-primary/40">
            <h2 className="font-display text-xl font-bold text-navy">{p.companyName}</h2>
            <p className="mt-1 text-sm text-muted">
              {p.city || 'UK'}
              {p.postcode ? ` · ${p.postcode}` : ''}
            </p>
            <p className="mt-3 line-clamp-2 text-sm text-slate">{p.bio || 'Professional on 123 Quotes.'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(p.services || []).slice(0, 4).map((ps) => (
                <span key={ps.service?.id || ps.id} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-primary">
                  {ps.service?.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {!loading && !pros.length && !error ? (
        <p className="mt-8 text-muted">No professionals match these filters yet.</p>
      ) : null}
    </div>
  )
}
