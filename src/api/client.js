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
  // Auth
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  registerCustomer: (body) =>
    request('/auth/register/customer', { method: 'POST', body: JSON.stringify(body) }),
  registerProfessional: (body) =>
    request('/auth/register/professional', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
  verifyEmail: (body) => request('/auth/verify-email', { method: 'POST', body: JSON.stringify(body) }),
  forgotPassword: (body) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body) =>
    request('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),

  // Services
  getCategories: () => request('/services/categories'),
  getServices: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/services${q ? `?${q}` : ''}`)
  },
  getService: (idOrSlug) => request(`/services/${idOrSlug}`),

  // Questions
  getQuestionnaire: (serviceId) => request(`/questions/service/${serviceId}`),

  // Requests (customer)
  createRequest: (body) => request('/requests', { method: 'POST', body: JSON.stringify(body) }),
  saveAnswers: (id, answers) =>
    request(`/requests/${id}/answers`, { method: 'PUT', body: JSON.stringify({ answers }) }),
  submitRequest: (id, body = {}) =>
    request(`/requests/${id}/submit`, { method: 'POST', body: JSON.stringify(body) }),
  myRequests: () => request('/requests/mine'),
  getRequest: (id) => request(`/requests/${id}`),

  // Professionals public + self
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

  // Leads (professional)
  myLeads: () => request('/leads/mine'),
  unlockLead: (id) => request(`/leads/${id}/unlock`, { method: 'POST', body: '{}' }),
}

export default api
