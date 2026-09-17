import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 20%, rgba(30,111,140,0.18), transparent), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(196,92,72,0.12), transparent), linear-gradient(160deg, #f7f3ee 0%, #e8eef4 100%)',
        }}
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div className="animate-[fadeUp_0.7s_ease-out]">
          <p className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            123 Quotes
          </p>
          <h1 className="mt-5 max-w-xl text-xl font-semibold text-slate sm:text-2xl">
            Find the right words for motivation, reflection, and sharing.
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate/90">
            Browse curated quotes and request custom collections for your team or brand.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/quotes"
              className="rounded-md bg-sea px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sea-dark"
            >
              Browse quotes
            </Link>
            <Link
              to="/contact"
              className="rounded-md border border-ink/15 bg-white/60 px-6 py-3 text-sm font-bold text-ink transition hover:border-sea hover:text-sea"
            >
              Get in touch
            </Link>
          </div>
        </div>
        <div className="relative animate-[fadeUp_0.9s_ease-out]">
          <blockquote className="rounded-2xl border border-white/60 bg-white/70 p-8 shadow-[0_20px_50px_-30px_rgba(26,35,50,0.45)] backdrop-blur">
            <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">
              &ldquo;The only way to do great work is to love what you do.&rdquo;
            </p>
            <footer className="mt-6 text-sm font-semibold uppercase tracking-wider text-sea">
              — Steve Jobs
            </footer>
          </blockquote>
        </div>
      </div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
