import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Star } from 'lucide-react'
import { api } from '../api/client'
import Loading from '../components/Loading'
import { useAuth } from '../context/AuthContext'

function Stars({ value }) {
  const n = Math.round(Number(value) || 0)
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`size-4 ${i <= n ? 'fill-current' : 'text-slate-300'}`} />
      ))}
    </span>
  )
}

export default function ProfessionalProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [pro, setPro] = useState(null)
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showReview, setShowReview] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', rating: 5 })
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const [data, rev] = await Promise.all([api.getProfessional(id), api.getReviews(id)])
      setPro({
        ...data.professional,
        averageRating: rev.averageRating ?? data.professional?.averageRating,
        reviewCount: rev.reviewCount ?? data.professional?.reviewCount,
      })
      setReviews(rev.reviews || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id])

  async function submitReview(e) {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    if (user.role !== 'CUSTOMER') {
      setFormError('Only customers can write reviews.')
      return
    }
    setBusy(true)
    setFormError('')
    try {
      await api.submitReview(id, {
        title: form.title.trim(),
        body: form.body.trim(),
        rating: Number(form.rating),
      })
      setShowReview(false)
      setForm({ title: '', body: '', rating: 5 })
      await load()
    } catch (err) {
      setFormError(err.message || 'Failed to submit')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <Loading overlay />
  if (error) return <p className="mx-auto max-w-3xl px-4 py-16 text-danger">{error}</p>
  if (!pro) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link to="/professionals" className="text-sm font-semibold text-primary">
        ← Directory
      </Link>
      <h1 className="mt-6 font-display text-4xl font-bold text-navy">{pro.companyName}</h1>
      <p className="mt-2 text-slate">
        {pro.contactName}
        {pro.city ? ` · ${pro.city}` : ''}
      </p>
      <p className="mt-2 flex items-center gap-2 text-sm text-muted">
        {pro.reviewCount > 0 ? <Stars value={pro.averageRating} /> : null}
        {pro.reviewCount > 0
          ? `${pro.averageRating} · ${pro.reviewCount} review${pro.reviewCount === 1 ? '' : 's'}`
          : 'No reviews yet'}
      </p>
      {pro.website ? (
        <a
          href={pro.website}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm font-semibold text-primary"
        >
          {pro.website}
        </a>
      ) : null}
      <p className="mt-6 text-slate">{pro.bio || 'No bio provided yet.'}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/services" className="btn-primary">
          Request a quote
        </Link>
        {user?.role === 'CUSTOMER' ? (
          <Link to={`/app/messages?professionalId=${pro.id}`} className="btn-secondary">
            Message professional
          </Link>
        ) : (
          <Link to="/login" className="btn-secondary">
            Log in to message
          </Link>
        )}
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl font-bold text-navy">Services</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(pro.services || []).map((ps) => (
            <span
              key={ps.service?.id || ps.id}
              className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-primary"
            >
              {ps.service?.name}
            </span>
          ))}
        </div>
      </div>

      {(pro.serviceAreas || []).length ? (
        <div className="mt-8">
          <h2 className="font-display text-xl font-bold text-navy">Areas covered</h2>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {pro.serviceAreas.map((a) => (
              <li key={a.id}>
                {[a.label, a.city, a.postcode].filter(Boolean).join(' · ') || 'Area'}
                {a.radiusMiles ? ` (${a.radiusMiles} mi)` : ''}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-navy">Reviews</h2>
          <button
            type="button"
            className="btn-secondary !rounded-md !py-2 !text-sm"
            onClick={() => {
              if (!user) navigate('/login')
              else if (user.role !== 'CUSTOMER') setFormError('Only customers can write reviews.')
              else setShowReview((v) => !v)
            }}
          >
            Write a Review
          </button>
        </div>
        {formError ? <p className="mt-2 text-sm text-danger">{formError}</p> : null}
        {showReview ? (
          <form onSubmit={submitReview} className="mt-4 space-y-3 rounded-2xl border border-line p-4">
            <select
              className="input-field"
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} stars
                </option>
              ))}
            </select>
            <input
              className="input-field w-full"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
            <textarea
              className="input-field w-full"
              rows={4}
              placeholder="Your review"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              required
            />
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? 'Saving…' : 'Submit review'}
            </button>
          </form>
        ) : null}
        {!reviews.length ? (
          <p className="mt-4 text-sm text-muted">No reviews yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-xl border border-line px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-navy">{r.title}</p>
                  <Stars value={r.rating} />
                </div>
                <p className="mt-1 text-sm text-slate">{r.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
