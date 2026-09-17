const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || 'Request failed')
  }
  return data
}

export const api = {
  getQuotes: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/quotes/public${query ? `?${query}` : ''}`)
  },
  getQuote: (id) => request(`/quotes/public/${id}`),
  submitLead: (body) =>
    request('/leads', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}
