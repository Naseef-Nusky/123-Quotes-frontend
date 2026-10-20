/**
 * Full-width banner image header for public pages that keep their own
 * content layout below (directory, detail and legal pages).
 */
export default function BannerHeader({ image, eyebrow, title, subtitle, children }) {
  return (
    <section className="relative overflow-hidden bg-navy">
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-primary-dark/55" aria-hidden />
      <div className="bg-dot-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        {eyebrow ? (
          <p className="animate-fade-up text-xs font-bold uppercase tracking-[0.22em] text-[#8fd0f5]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="animate-fade-up-delay mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="animate-fade-up-delay-2 mt-3 max-w-2xl text-base leading-relaxed text-white/75">
            {subtitle}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  )
}
