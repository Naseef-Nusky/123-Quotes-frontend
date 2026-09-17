import { Link } from 'react-router-dom'

export default function Logo({ className = '', to = '/', size = 'md' }) {
  const heights = { sm: 'h-10', md: 'h-12', lg: 'h-16', xl: 'h-24' }
  const img = (
    <img
      src="/logo.png"
      alt="123 Quotes"
      className={`${heights[size] || heights.md} w-auto object-contain ${className}`}
    />
  )
  if (to === false) return img
  return (
    <Link to={to} className="inline-flex items-center" aria-label="123 Quotes home">
      {img}
    </Link>
  )
}
