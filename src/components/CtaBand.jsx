import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal'

/** Navy gradient call-to-action band used at the bottom of public pages. */
export default function CtaBand({
  title = 'Ready to get it done?',
  copy = 'Post your job in minutes and compare free quotes from verified local professionals.',
  primary = { to: '/services', label: 'Get free quotes' },
  secondary = { to: '/business/signup', label: 'Join as a professional' },
}) {
  return (
    <section className="bg-navy-gradient relative overflow-hidden">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <Reveal className="relative mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">{copy}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={primary.to}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary-dark shadow-lg transition hover:-translate-y-0.5"
          >
            {primary.label}
            <ArrowRight className="size-4" strokeWidth={2.25} />
          </Link>
          <Link
            to={secondary.to}
            className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            {secondary.label}
          </Link>
        </div>
      </Reveal>
    </section>
  )
}
