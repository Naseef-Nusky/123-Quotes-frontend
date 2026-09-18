import { Link } from 'react-router-dom'
import { DUMMY_PROFESSIONALS } from '../../data/dummy'
import { useParams } from 'react-router-dom'

export default function ProPublicProfile() {
  const { id } = useParams()
  const pro = DUMMY_PROFESSIONALS.find((p) => p.id === id) || DUMMY_PROFESSIONALS[5]

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="text-center lg:text-left">
          <div className="mx-auto flex size-28 items-center justify-center rounded-xl bg-slate-100 lg:mx-0">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary text-white">
              <svg viewBox="0 0 24 24" className="size-10" fill="currentColor">
                <path d="M4 20V9l4-2v13H4zm6 0V6l4-2v16h-4zm6 0V8l4 2v10h-4z" />
              </svg>
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-navy">{pro.companyName}</h1>
          <p className="mt-1 text-sm text-muted">No reviews</p>
          <span className="mt-3 inline-flex rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary">
            {pro.services?.[0]?.service?.name || 'Service'}
          </span>
          <div className="mt-5 space-y-1 text-sm text-slate">
            <p>{pro.phone || '07700000000'}</p>
            <p>{pro.email || 'contact@example.com'}</p>
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
              <button type="button" className="btn-secondary !rounded-md !py-2 !text-sm">
                Write a Review
              </button>
            </div>
            <p className="mt-4 text-sm text-slate">No Reviews Available</p>
          </div>

          <Link to="/pro/available-pros" className="mt-8 inline-flex text-sm font-semibold text-primary">
            ← Back to Available Pros.
          </Link>
        </div>
      </div>
    </section>
  )
}
