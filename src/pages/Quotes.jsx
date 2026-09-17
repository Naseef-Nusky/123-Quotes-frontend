import { useEffect, useState } from 'react'
import { api } from '../api/client.js'

export default function Quotes() {
  const [quotes, setQuotes] = useState([])
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')

    api
      .getQuotes(category ? { category } : {})
      .then((data) => {
        if (!cancelled) setQuotes(data.quotes || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load quotes')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [category])

  const categories = ['', 'motivation', 'success', 'life', 'leadership', 'wisdom']

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-bold text-ink">Quotes</h1>
        <p className="mt-2 text-slate">Explore published quotes from the 123 Quotes library.</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat || 'all'}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              category === cat
                ? 'bg-sea text-white'
                : 'bg-white text-slate ring-1 ring-mist hover:text-ink'
            }`}
          >
            {cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {loading && <p className="text-slate">Loading quotes…</p>}
      {error && (
        <p className="rounded-md bg-coral/10 px-4 py-3 text-sm text-coral">
          {error} — start the backend API on port 5000 to load live data.
        </p>
      )}

      {!loading && !error && quotes.length === 0 && (
        <p className="text-slate">No quotes found. Add some from the Admin CRM.</p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.map((quote) => (
          <article
            key={quote._id}
            className="flex flex-col rounded-xl border border-mist bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="font-display text-lg leading-relaxed text-ink">&ldquo;{quote.text}&rdquo;</p>
            <div className="mt-auto pt-5">
              <p className="text-sm font-semibold text-sea">— {quote.author}</p>
              {quote.category && (
                <span className="mt-2 inline-block text-xs font-semibold uppercase tracking-wide text-slate">
                  {quote.category}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
