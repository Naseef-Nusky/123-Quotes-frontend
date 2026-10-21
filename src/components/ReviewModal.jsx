import { useEffect, useState } from 'react'
import { Star, X } from 'lucide-react'
import { api } from '../api/client'

/**
 * "Write A Review For {company}" modal — used in Available Pros,
 * professional profile pages and anywhere a pro can be reviewed.
 * `onSubmitted(result)` fires after a successful save so callers can refresh.
 */
export default function ReviewModal({ professional, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!professional) return null
  const active = hover || rating

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!rating) return setError('Please select a star rating.')
    if (!title.trim()) return setError('Please add a review title.')
    if (!body.trim()) return setError('Please write your review.')
    setBusy(true)
    try {
      const res = await api.submitReview(professional.id, {
        title: title.trim(),
        body: body.trim(),
        rating,
      })
      setDone(true)
      onSubmitted?.(res)
    } catch (err) {
      setError(err.message || 'Failed to submit review')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-3 py-6 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Write a review for ${professional.companyName}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-center border-b border-line px-5 py-4 relative">
          <h3 className="text-center text-lg font-bold text-navy sm:text-xl">
            Write A Review For {professional.companyName}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted transition hover:bg-slate-100 hover:text-navy"
          >
            <X className="size-5" />
          </button>
        </div>

        {done ? (
          <div className="px-5 py-8 text-center">
            <p className="text-base font-semibold text-emerald-700">Thank you! Your review has been submitted.</p>
            <button type="button" className="btn-primary mt-5 !rounded-md" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-5 py-5">
            <div
              className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3.5"
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} star${n === 1 ? '' : 's'}`}
                  className="p-0.5 transition-transform hover:scale-110"
                  onMouseEnter={() => setHover(n)}
                  onFocus={() => setHover(n)}
                  onClick={() => setRating(n)}
                >
                  <Star
                    className={`size-7 sm:size-8 ${
                      n <= active ? 'fill-amber-500 text-amber-500' : 'fill-white text-amber-400'
                    }`}
                  />
                </button>
              ))}
            </div>

            <label className="label mt-5" htmlFor="review-title">
              Review Title
            </label>
            <input
              id="review-title"
              className="input-field mt-1 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />

            <label className="label mt-4" htmlFor="review-text">
              Review Text
            </label>
            <textarea
              id="review-text"
              className="input-field mt-1 w-full"
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />

            {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}

            <button
              type="submit"
              className="btn-primary mt-5 w-full !rounded-md !py-3 text-base"
              disabled={busy}
            >
              {busy ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
