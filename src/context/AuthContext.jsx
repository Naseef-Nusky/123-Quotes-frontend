import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const persist = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem('token', nextToken)
      setToken(nextToken)
    }
    setUser(nextUser || null)
  }, [])

  const clear = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

  const refreshMe = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      setUser(null)
      setLoading(false)
      return null
    }
    try {
      const data = await api.me()
      setUser(data.user)
      return data.user
    } catch {
      clear()
      return null
    } finally {
      setLoading(false)
    }
  }, [clear])

  useEffect(() => {
    refreshMe()
  }, [refreshMe])

  const login = useCallback(
    async (email, password) => {
      const data = await api.login({ email, password })
      persist(data.token, data.user)
      return data.user
    },
    [persist],
  )

  const logout = useCallback(() => {
    clear()
  }, [clear])

  const registerCustomer = useCallback(async (body) => {
    return api.registerCustomer(body)
  }, [])

  const registerProfessional = useCallback(async (body) => {
    return api.registerProfessional(body)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      isCustomer: user?.role === 'CUSTOMER',
      isProfessional: user?.role === 'PROFESSIONAL',
      login,
      logout,
      registerCustomer,
      registerProfessional,
      refreshMe,
    }),
    [
      user,
      token,
      loading,
      login,
      logout,
      registerCustomer,
      registerProfessional,
      refreshMe,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
