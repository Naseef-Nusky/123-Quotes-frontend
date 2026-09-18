import { useMemo, useState } from 'react'
import { DUMMY_LEADS } from '../../data/dummy'

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 text-primary" fill="currentColor">
      <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 text-primary" fill="currentColor">
      <path d="M13 2L3 14h7l-1 8 11-14h-7l1-6z" />
    </svg>
  )
}

export default function ProLeads() {
  const leads = useMemo(() => DUMMY_LEADS, [])
  const [selectedId, setSelectedId] = useState(leads[0]?.id)
  const selected = leads.find((l) => l.id === selectedId) || leads[0]

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-6xl flex-col lg:flex-row">
      {/* Left list */}
      <aside className="max-h-[70vh] w-full overflow-y-auto border-b border-line lg:max-h-none lg:w-[380px] lg:border-b-0 lg:border-r">
        {leads.map((lead) => (
          <button
            key={lead.id}
            type="button"
            onClick={() => setSelectedId(lead.id)}
            className={`w-full border-b border-line px-4 py-4 text-left transition hover:bg-canvas ${
              selected?.id === lead.id ? 'bg-primary/5' : 'bg-white'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-navy">{lead.maskedName}</p>
              <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                {lead.ago}
              </span>
            </div>
            <p className="mt-2 font-bold text-navy">{lead.service}</p>
            <p className="mt-1 line-clamp-2 text-sm text-slate">{lead.snippet}</p>
            <div className="mt-3 flex items-center gap-4 text-sm text-slate">
              <span className="inline-flex items-center gap-1">
                <PinIcon /> {lead.postcode}
              </span>
              <span className="inline-flex items-center gap-1">
                <BoltIcon /> {lead.interest}
              </span>
            </div>
          </button>
        ))}
      </aside>

      {/* Right detail */}
      <div className="flex-1 px-4 py-6 sm:px-8">
        {selected ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold text-navy">{selected.maskedName}</h1>
                  <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    {selected.ago}
                  </span>
                </div>
                <p className="mt-2 text-xl font-bold text-navy">{selected.service}</p>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm text-slate">
              <p className="inline-flex items-center gap-2">
                <span aria-hidden>📞</span> {selected.phoneMasked}
              </p>
              <p className="inline-flex items-center gap-2">
                <span aria-hidden>✉️</span> {selected.emailMasked}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="btn-primary !rounded-md">
                Reach out to {selected.maskedName}
              </button>
              <button
                type="button"
                className="rounded-md bg-warning px-5 py-3 text-sm font-bold text-white transition hover:brightness-95"
              >
                Decline
              </button>
            </div>

            <div className="mt-6 rounded-lg border border-line px-4 py-3">
              <div className="mb-2 flex gap-1">
                {Array.from({ length: selected.maxRespond }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-6 w-2 rounded-sm ${i < selected.responded ? 'bg-primary' : 'bg-rose-100'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-slate">
                {selected.responded}/{selected.maxRespond} Professionals have responded.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="border-b border-line pb-2 text-lg font-bold text-navy">Details Provided</h2>
              <ul className="mt-4 space-y-3">
                {selected.details.map((d) => (
                  <li key={d.q} className="text-sm">
                    <span className="text-slate">• {d.q}</span>
                    {d.a ? <span className="ml-1 font-bold text-navy">{d.a}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="text-slate">No leads available.</p>
        )}
      </div>
    </section>
  )
}
