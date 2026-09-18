import { Link } from 'react-router-dom'
import { DUMMY_PROFESSIONALS } from '../../data/dummy'

function BuildingIcon() {
  return (
    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-white">
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor">
        <path d="M4 20V9l4-2v13H4zm6 0V6l4-2v16h-4zm6 0V8l4 2v10h-4z" />
      </svg>
    </div>
  )
}

export default function AvailablePros() {
  const pros = DUMMY_PROFESSIONALS.filter((p) =>
    ['Virtualtours', 'Creations Arena', 'Other', 'Pixel Forge Studios'].includes(p.companyName),
  )

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-navy">Available Pros.</h1>
      <div className="mt-6 divide-y divide-line border-y border-line">
        {pros.map((pro) => (
          <article key={pro.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <BuildingIcon />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-bold text-navy">{pro.companyName}</h2>
                  <span className="text-xs text-muted">No reviews.</span>
                </div>
                <p className="mt-1 text-sm text-slate">{pro.bio || 'No Additional Details.'}</p>
                <Link to={`/pro/available-pros/${pro.id}`} className="mt-2 inline-flex text-sm font-semibold text-primary">
                  View Profile &gt;
                </Link>
              </div>
            </div>
            <button type="button" className="btn-primary !rounded-md !py-2.5 self-start sm:self-center">
              Request Quotation
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
