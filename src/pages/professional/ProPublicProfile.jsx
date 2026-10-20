import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Building2, Phone, Mail, Star } from 'lucide-react'
import { api } from '../../api/client'
import Loading from '../../components/Loading'
import { useAuth } from '../../context/AuthContext'

function Stars({ value }) {
  const n = Math.round(Number(value) || 0)
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500" aria-label={`${n} stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`size-4 ${i <= n ? 'fill-current' : 'text-slate-300'}`} />
      ))}
    </span>
  )
}

export default function ProPublicProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [pro, setPro] = useState(null)
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', rating: 5 })
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const [formOk, setFormOk] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [d, rev] = await Promise.all([api.getProfessional(id), api.getReviews(id)])
      setPro(d.professional || null)
      setReviews(rev.reviews || [])
      if (d.professional) {
        setPro({
          ...d.professional,
          averageRating: rev.averageRating ?? d.professional.averageRating,
          reviewCount: rev.reviewCount ?? d.professional.reviewCount,
        })
      }
    } catch (err) {
      setError(err.message || 'Professional not found')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  const serviceName = useMemo(
    () => pro?.services?.[0]?.service?.name || 'Service',
    [pro],
  )

  const isCustomer = user?.role === 'CUSTOMER'

  async function submitReview(e) {
    e.preventDefault()
    setBusy(true)
    setFormError('')
    setFormOk('')
    try {
      await api.submitReview(id, {
        title: form.title.trim(),
        body: form.body.trim(),
        rating: Number(form.rating),
      })
      setFormOk('Review submitted.')
      setShowForm(false)
      setForm({ title: '', body: '', rating: 5 })
      await load()
    } catch (err) {
      setFormError(err.message || 'Failed to submit review')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return <Loading overlay />
  }

  if (error || !pro) {
    return (
      <section className="w-full px-4 py-10 text-left sm:px-6">
        <p className="text-sm text-rose-600">{error || 'Professional not found'}</p>
        <Link to="/pro/available-pros" className="mt-4 inline-flex text-sm font-semibold text-primary">
          ← Back to Available Pros.
        </Link>
      </section>
    )
  }

  const reviewLabel =
    pro.reviewCount > 0
      ? `${pro.averageRating ?? '—'} · ${pro.reviewCount} review${pro.reviewCount === 1 ? '' : 's'}`
      : 'No reviews'

  return (
    <section className="w-full px-4 py-10 text-left sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="text-left">
          <div className="flex size-28 items-center justify-center rounded-xl bg-slate-100">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary text-white">
              <Building2 className="size-10" strokeWidth={1.75} />
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-navy">{pro.companyName}</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted">
            {pro.reviewCount > 0 ? <Stars value={pro.averageRating} /> : null}
            {reviewLabel}
          </p>
          <span className="mt-3 inline-flex rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary">
            {serviceName}
          </span>
          <div className="mt-5 space-y-2 text-sm text-slate">
            <p className="inline-flex items-center justify-start gap-2">
              <Phone className="size-4 text-primary" strokeWidth={2} />
              {pro.phone || '—'}
            </p>
            <p className="inline-flex items-center justify-start gap-2">
              <Mail className="size-4 text-primary" strokeWidth={2} />
              {pro.email || '—'}
            </p>
          </div>
        </aside>

        <div>
          <div>
            <div className="flex items-center justify-between border-b border-line pb-2">
              <h2 className="text-lg font-bold text-navy">Description</h2>
            </div>
            <p className="mt-4 text-sm text-slate">{pro.bio || 'No Description Available'}</p>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <h2 className="text-lg font-bold text-navy">Reviews</h2>
              {isCustomer ? (
                <button
                  type="button"
                  className="btn-secondary !rounded-md !py-2 !text-sm"
                  onClick={() => setShowForm((v) => !v)}
                >
                  Write a Review
                </button>
              ) : (
                <span className="text-xs text-muted">Sign in as a customer to review</span>
              )}
            </div>

            {showForm ? (
              <form onSubmit={submitReview} className="mt-4 space-y-3 rounded-xl border border-line p-4">
                {formError ? <p className="text-sm text-danger">{formError}</p> : null}
                <div>
                  <label className="label">Rating</label>
                  <select
                    className="input-field mt-1"
                    value={form.rating}
                    onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} star{n === 1 ? '' : 's'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Title</label>
                  <input
                    className="input-field mt-1 w-full"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="label">Review</label>
                  <textarea
                    className="input-field mt-1 w-full"
                    rows={4}
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary !rounded-md" disabled={busy}>
                  {busy ? 'Saving…' : 'Submit review'}
                </button>
              </form>
            ) : null}
            {formOk ? <p className="mt-3 text-sm text-emerald-700">{formOk}</p> : null}

            {!reviews.length ? (
              <p className="mt-4 text-sm text-slate">No Reviews Available</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-xl border border-line px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold text-navy">{r.title}</p>
                      <Stars value={r.rating} />
                    </div>
                    <p className="mt-1 text-sm text-slate">{r.body}</p>
                    <p className="mt-2 text-xs text-muted">
                      {[r.customer?.firstName, r.customer?.lastName].filter(Boolean).join(' ') ||
                        'Customer'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link to="/pro/available-pros" className="mt-8 inline-flex text-sm font-semibold text-primary">
            ← Back to Available Pros.
          </Link>
        </div>
      </div>
    </section>
  )
}
