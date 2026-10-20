import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

/**
 * Shared hero band for public pages (How it works, Pricing, Contact…).
 * Keeps every public page visually consistent with the redesigned home.
 */
export default function PageHero({
  eyebrow,
  title,
  highlight,
  subtitle,
  children,
  cta,
  secondaryCta,
  image,
}) {
  return (
    <section className="relative overflow-hidden bg-navy-gradient">
      {image ? (
        <>
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-navy/78" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-b from-navy/60 via-transparent to-navy/70"
            aria-hidden
          />
        </>
      ) : null}
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-primary/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 size-80 rounded-full bg-[#3baee8]/20 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:py-20">
        {eyebrow ? (
          <p className="animate-fade-up text-xs font-bold uppercase tracking-[0.22em] text-[#8fd0f5]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="animate-fade-up-delay mx-auto mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {title}{' '}
          {highlight ? <span className="text-gradient-light">{highlight}</span> : null}
        </h1>
        {subtitle ? (
          <p className="animate-fade-up-delay-2 mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {subtitle}
          </p>
        ) : null}
        {cta || secondaryCta ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {cta ? (
              <Link
                to={cta.to}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary-dark shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                {cta.label}
                <ArrowRight className="size-4" strokeWidth={2.25} />
              </Link>
            ) : null}
            {secondaryCta ? (
              <Link
                to={secondaryCta.to}
                className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  )
}
