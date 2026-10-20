import { useEffect, useRef } from 'react'

/**
 * Fades content up the first time it scrolls into view.
 * Wrap sections/cards: <Reveal delay={0.1}>…</Reveal>
 */
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return undefined
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    // Safety net: never leave content hidden if the observer does not fire
    // (e.g. in-app webviews or print/screenshot rendering).
    const fallback = setTimeout(() => el.classList.add('is-visible'), 1600)
    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { '--reveal-delay': `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  )
}
