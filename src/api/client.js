const API_BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, options = {}) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
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

async function uploadForm(path, formData, method = 'POST') {
  return request(path, { method, body: formData })
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
  submitGuestRequest: (body, files = []) => {
    const selected = (files || []).filter(Boolean)
    if (!selected.length) {
      return request('/requests/guest', { method: 'POST', body: JSON.stringify(body) })
    }
    const form = new FormData()
    Object.entries(body || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      if (key === 'answers') form.append('answers', JSON.stringify(value))
      else form.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
    })
    selected.forEach((file) => form.append('files', file))
    return uploadForm('/requests/guest', form)
  },
  saveAnswers: (id, answers) =>
    request(`/requests/${id}/answers`, { method: 'PUT', body: JSON.stringify({ answers }) }),
  submitRequest: (id, body = {}) =>
    request(`/requests/${id}/submit`, { method: 'POST', body: JSON.stringify(body) }),
  uploadRequestAttachments: (id, files = []) => {
    const form = new FormData()
    ;(files || []).filter(Boolean).forEach((file) => form.append('files', file))
    return uploadForm(`/requests/${id}/attachments`, form)
  },
  attachmentDownloadUrl: (requestId, attachmentId) =>
    `${API_BASE}/requests/${requestId}/attachments/${attachmentId}/download`,
  downloadAttachment: async (requestId, attachmentId, filename = 'attachment') => {
    const headers = {}
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(
      `${API_BASE}/requests/${requestId}/attachments/${attachmentId}/download`,
      { headers },
    )
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || 'Download failed')
    }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  },
  myRequests: () => request('/requests/mine'),
  getRequest: (id) => request(`/requests/${id}`),
  updateRequest: (id, body) =>
    request(`/requests/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteRequest: (id) => request(`/requests/${id}`, { method: 'DELETE' }),

  getPackages: () => request('/professionals/packages'),
  getPaymentConfig: () => request('/professionals/payments/config'),
  getDirectory: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/professionals/directory${q ? `?${q}` : ''}`)
  },
  getProfessional: (id) => request(`/professionals/directory/${id}`),

  getMyProfile: () => request('/professionals/me'),
  updateMyProfile: (body) =>
    request('/professionals/me', { method: 'PUT', body: JSON.stringify(body) }),
  deleteMyAccount: () => request('/professionals/me', { method: 'DELETE' }),

  // Own account (customer portal settings; works for any logged-in user)
  updateCustomerProfile: (body) =>
    request('/auth/me', { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body) =>
    request('/auth/change-password', { method: 'POST', body: JSON.stringify(body) }),
  deleteCustomerAccount: () => request('/auth/me', { method: 'DELETE' }),
  uploadMyLogo: (file) => {
    const form = new FormData()
    form.append('image', file)
    return uploadForm('/professionals/me/logo', form)
  },
  setMyServices: (serviceIds, { skipRematch = false } = {}) =>
    request('/professionals/me/services', {
      method: 'PUT',
      body: JSON.stringify({ serviceIds, ...(skipRematch ? { skipRematch: true } : {}) }),
    }),
  setMyAreas: (areas) =>
    request('/professionals/me/areas', { method: 'PUT', body: JSON.stringify({ areas }) }),
  buyTokens: (packageId, sourceId) =>
    request('/professionals/me/tokens/purchase', {
      method: 'POST',
      body: JSON.stringify({ packageId, ...(sourceId ? { sourceId } : {}) }),
    }),
  tokenHistory: () => request('/professionals/me/tokens'),

  myLeads: (params = {}) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== '')),
    ).toString()
    return request(`/leads/mine${q ? `?${q}` : ''}`)
  },
  unlockLead: (id) => request(`/leads/${id}/unlock`, { method: 'POST', body: '{}' }),
  declineLead: (id) => request(`/leads/${id}/decline`, { method: 'POST', body: '{}' }),

  // Client ↔ pro messages (legacy client_requ)
  sendMessage: (body) => request('/messages', { method: 'POST', body: JSON.stringify(body) }),
  messageInbox: () => request('/messages/inbox'),
  messageSent: () => request('/messages/sent'),
  myMessages: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return request(`/messages/mine${q ? `?${q}` : ''}`)
  },
  updateMessageStatus: (id, status) =>
    request(`/messages/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // In-app notifications (bell)
  getNotifications: () => request('/notifications?limit=30'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH', body: '{}' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PATCH', body: '{}' }),

  // Reviews
  getReviews: (professionalId) => request(`/reviews/professional/${professionalId}`),
  submitReview: (professionalId, body) =>
    request(`/reviews/professional/${professionalId}`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getHomeContent: () => request('/content/home'),
  getContact: () => request('/content/contact'),
  submitContact: (body) => request('/content/contact', { method: 'POST', body: JSON.stringify(body) }),
}

export default api
