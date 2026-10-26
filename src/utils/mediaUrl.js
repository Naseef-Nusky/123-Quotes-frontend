const API_BASE = import.meta.env.VITE_API_URL || '/api'

/**
 * Resolve service/category image paths for production.
 * DB stores relative `/api/marketplace-images/...` which only works when the
 * page origin proxies `/api`. When VITE_API_URL is an absolute API host,
 * rewrite those paths onto that host.
 */
export function mediaUrl(url) {
  if (!url) return ''
  const raw = String(url).trim()
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw) || raw.startsWith('data:') || raw.startsWith('blob:')) {
    return raw
  }

  // Absolute API base, e.g. https://app.123quotes.co.uk/api
  if (/^https?:\/\//i.test(API_BASE)) {
    try {
      const api = new URL(API_BASE)
      const origin = api.origin
      if (raw.startsWith('/api/')) return `${origin}${raw}`
      if (raw.startsWith('/')) return `${origin}${raw}`
      return `${API_BASE.replace(/\/$/, '')}/${raw.replace(/^\//, '')}`
    } catch {
      return raw
    }
  }

  // Relative API base (`/api`) — keep site-relative paths as-is
  if (raw.startsWith('/')) return raw
  return `${API_BASE.replace(/\/$/, '')}/${raw.replace(/^\//, '')}`
}
