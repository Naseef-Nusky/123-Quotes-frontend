const API_BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  requestLoginLink: (body) =>
    request('/auth/login-link', { method: 'POST', body: JSON.stringify(body) }),
  loginWithLink: (body) =>
    request('/auth/login-link/verify', { method: 'POST', body: JSON.stringify(body) }),
  registerProfessional: (body) =>
    request('/auth/register/professional', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  verifyEmail: (body) => request('/auth/verify-email', { method: 'POST', body: JSON.stringify(body) }),
  forgotPassword: (body) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body) =>
    request('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),

  getCategories: () => request('/services/categories'),
  getServices: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/services${q ? `?${q}` : ''}`)
  },
  getService: (idOrSlug) => request(`/services/${idOrSlug}`),
  getQuestionnaire: (serviceId) => request(`/questions/service/${serviceId}`),

  suggestPostcodes: (q, limit = 40) =>
    request(`/postcodes/suggest?q=${encodeURIComponent(q)}&limit=${limit}`),
  listPostcodes: () => request('/postcodes/list'),
  validatePostcode: (postcode) =>
    request(`/postcodes/validate?postcode=${encodeURIComponent(postcode)}`),

  createRequest: (body) => request('/requests', { method: 'POST', body: JSON.stringify(body) }),
  submitGuestRequest: (body) =>
    request('/requests/guest', { method: 'POST', body: JSON.stringify(body) }),
  saveAnswers: (id, answers) =>
    request(`/requests/${id}/answers`, { method: 'PUT', body: JSON.stringify({ answers }) }),
  submitRequest: (id, body = {}) =>
    request(`/requests/${id}/submit`, { method: 'POST', body: JSON.stringify(body) }),
  myRequests: () => request('/requests/mine'),
  getRequest: (id) => request(`/requests/${id}`),

  getPackages: () => request('/professionals/packages'),
  getDirectory: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/professionals/directory${q ? `?${q}` : ''}`)
  },
  getProfessional: (id) => request(`/professionals/directory/${id}`),

  getMyProfile: () => request('/professionals/me'),
  updateMyProfile: (body) =>
    request('/professionals/me', { method: 'PUT', body: JSON.stringify(body) }),
  setMyServices: (serviceIds) =>
    request('/professionals/me/services', { method: 'PUT', body: JSON.stringify({ serviceIds }) }),
  setMyAreas: (areas) =>
    request('/professionals/me/areas', { method: 'PUT', body: JSON.stringify({ areas }) }),
  buyTokens: (packageId) =>
    request('/professionals/me/tokens/purchase', {
      method: 'POST',
      body: JSON.stringify({ packageId }),
    }),
  tokenHistory: () => request('/professionals/me/tokens'),

  myLeads: () => request('/leads/mine'),
  unlockLead: (id) => request(`/leads/${id}/unlock`, { method: 'POST', body: '{}' }),

  getHomeContent: () => request('/content/home'),
  getContact: () => request('/content/contact'),
  submitContact: (body) => request('/content/contact', { method: 'POST', body: JSON.stringify(body) }),
}

export default api
