import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Star } from 'lucide-react'
import { api } from '../../api/client'
import Loading from '../../components/Loading'
import ReviewModal from '../../components/ReviewModal'
import RequestQuoteButton from '../../components/RequestQuoteButton'
import { useAuth } from '../../context/AuthContext'

export default function AvailablePros() {
  const { user } = useAuth()
  const [pros, setPros] = useState([])
  const [myServices, setMyServices] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [reviewFor, setReviewFor] = useState(null)

  const load = useCallback(async () => {
    const [dir, mine] = await Promise.all([
      api.getDirectory(),
      api.getMyProfile().catch(() => null),
    ])
    setPros(dir.professionals || [])
    const svc = (mine?.profile?.services || [])
      .map((s) => ({ id: s.serviceId || s.service?.id, name: s.service?.name }))
      .filter((s) => s.id && s.name)
    setMyServices(svc)
  }, [])

  useEffect(() => {
    let cancelled = false
    load()
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load professionals')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [load])

  const myProfileId = user?.professional?.id
  const myServiceIds = new Set(myServices.map((s) => s.id))
  const hasServices = myServices.length > 0
  // Default view: only pros offering the same service(s) as my business.
  const visiblePros =
    hasServices && !showAll
      ? pros.filter((p) => (p.services || []).some((s) => myServiceIds.has(s.serviceId || s.service?.id)))
      : pros

  return (
    <section className="w-full px-4 py-10 text-left sm:px-6">
      <h1 className="text-2xl font-bold text-navy">Available Pros.</h1>

      {!loading && hasServices ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate">
            {showAll ? 'Showing all professionals.' : 'Matching your business:'}
          </span>
          {!showAll
            ? myServices.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                >
                  {s.name}
                </span>
              ))
            : null}
          <button
            type="button"
            className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? 'Show matching only' : 'Show all professionals'}
          </button>
        </div>
      ) : null}
      {!loading && !hasServices ? (
        <p className="mt-3 text-sm text-slate">
          Showing all professionals.{' '}
          <Link to="/pro/profile" className="font-semibold text-primary">
            Add your services in Profile
          </Link>{' '}
          to see pros matching your business here.
        </p>
      ) : null}

      {loading ? <Loading className="mt-4 py-6" /> : null}
      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
      <div className="mt-6 divide-y divide-line border-y border-line">
        {visiblePros.map((pro) => (
          <article
            key={pro.id}
            className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <Building2 className="size-7" strokeWidth={1.75} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-bold text-navy">{pro.companyName}</h2>
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    {pro.reviewCount > 0 ? (
                      <>
                        <Star className="size-3.5 fill-amber-500 text-amber-500" />
                        {pro.averageRating} ({pro.reviewCount})
                      </>
                    ) : (
                      'No reviews.'
                    )}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate">{pro.bio || 'No Additional Details.'}</p>
                {(pro.services || []).length ? (
                  <p className="mt-1 text-xs text-muted">
                    {(pro.services || [])
                      .map((s) => s.service?.name)
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                ) : null}
                <Link
                  to={`/pro/available-pros/${pro.id}`}
                  className="mt-2 inline-flex text-sm font-semibold text-primary"
                >
                  View Profile &gt;
                </Link>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 self-start sm:self-center">
              {myProfileId === pro.id ? (
                <>
                  <Link
                    to={`/pro/available-pros/${pro.id}`}
                    className="btn-primary !rounded-md !py-2.5 text-center"
                  >
                    View & reviews
                  </Link>
                  <span className="text-center text-xs text-muted">Your business</span>
                </>
              ) : (
                <>
                  <RequestQuoteButton professional={pro} />
                  <Link
                    to={`/pro/available-pros/${pro.id}`}
                    className="btn-secondary !rounded-md !py-2.5 text-center"
                  >
                    View & reviews
                  </Link>
                  <button
                    type="button"
                    className="btn-secondary !rounded-md !py-2.5"
                    onClick={() => setReviewFor(pro)}
                  >
                    Write a Review
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
        {!loading && !visiblePros.length ? (
          <p className="py-8 text-left text-sm text-muted">
            {hasServices && !showAll
              ? `No other ${myServices.map((s) => s.name).join(' / ')} professionals yet.`
              : 'No professionals in the directory yet.'}
          </p>
        ) : null}
      </div>

      {reviewFor ? (
        <ReviewModal
          professional={reviewFor}
          onClose={() => setReviewFor(null)}
          onSubmitted={() => load().catch(() => {})}
        />
      ) : null}
    </section>
  )
}
