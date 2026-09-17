import {
  DUMMY_CATEGORIES,
  DUMMY_PACKAGES,
  DUMMY_QUESTIONS,
  filterDummyProfessionals,
  filterDummyServices,
  findDummyService,
  DUMMY_PROFESSIONALS,
} from '../data/dummy'

const API_BASE = import.meta.env.VITE_API_URL || '/api'
const USE_DUMMY = import.meta.env.VITE_USE_DUMMY !== 'false'

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

async function withDummy(liveFn, dummyFn) {
  try {
    const data = await liveFn()
    if (!USE_DUMMY) return data
    // If API returns empty collections, still show dummy for demos
    return dummyFn(data) ?? data
  } catch (err) {
    if (!USE_DUMMY) throw err
    console.warn('[dummy fallback]', err.message)
    return dummyFn(null)
  }
}

export const api = {
  // Auth (real only — no dummy login)
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
  getCategories: () =>
    withDummy(
      () => request('/services/categories'),
      (live) => {
        if (live?.categories?.length) return live
        return { categories: DUMMY_CATEGORIES, _dummy: true }
      },
    ),

  getServices: (params = {}) =>
    withDummy(
      () => {
        const q = new URLSearchParams(params).toString()
        return request(`/services${q ? `?${q}` : ''}`)
      },
      (live) => {
        if (live?.services?.length) return live
        return { services: filterDummyServices(params.category), _dummy: true }
      },
    ),

  getService: (idOrSlug) =>
    withDummy(
      () => request(`/services/${idOrSlug}`),
      (live) => {
        if (live?.service) return live
        const service = findDummyService(idOrSlug)
        if (!service) throw new Error('Service not found')
        return {
          service: {
            ...service,
            questions: DUMMY_QUESTIONS[service.id] || [],
          },
          _dummy: true,
        }
      },
    ),

  getQuestionnaire: (serviceId) =>
    withDummy(
      () => request(`/questions/service/${serviceId}`),
      (live) => {
        if (live?.questions?.length) return live
        return { questions: DUMMY_QUESTIONS[serviceId] || [], _dummy: true }
      },
    ),

  // Requests (customer) — live only
  createRequest: (body) => request('/requests', { method: 'POST', body: JSON.stringify(body) }),
  saveAnswers: (id, answers) =>
    request(`/requests/${id}/answers`, { method: 'PUT', body: JSON.stringify({ answers }) }),
  submitRequest: (id, body = {}) =>
    request(`/requests/${id}/submit`, { method: 'POST', body: JSON.stringify(body) }),
  myRequests: () => request('/requests/mine'),
  getRequest: (id) => request(`/requests/${id}`),

  // Professionals public + self
  getPackages: () =>
    withDummy(
      () => request('/professionals/packages'),
      (live) => {
        if (live?.packages?.length) return live
        return { packages: DUMMY_PACKAGES, _dummy: true }
      },
    ),

  getDirectory: (params = {}) =>
    withDummy(
      () => {
        const q = new URLSearchParams(params).toString()
        return request(`/professionals/directory${q ? `?${q}` : ''}`)
      },
      (live) => {
        if (live?.professionals?.length) return live
        return { professionals: filterDummyProfessionals(params), _dummy: true }
      },
    ),

  getProfessional: (id) =>
    withDummy(
      () => request(`/professionals/directory/${id}`),
      (live) => {
        if (live?.professional) return live
        const professional = DUMMY_PROFESSIONALS.find((p) => p.id === id)
        if (!professional) throw new Error('Professional not found')
        return { professional, _dummy: true }
      },
    ),

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
