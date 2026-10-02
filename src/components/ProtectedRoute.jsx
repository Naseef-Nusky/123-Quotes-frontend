import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loading from './Loading'

export default function ProtectedRoute({ children, roles }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading overlay />
  }

  if (!isAuthenticated) {
    const loginTo = roles?.includes('PROFESSIONAL') ? '/business/login' : '/login'
    return <Navigate to={loginTo} replace state={{ from: location.pathname }} />
  }

  if (roles?.length && !roles.includes(user.role)) {
    const fallback = user.role === 'PROFESSIONAL' ? '/pro' : user.role === 'CUSTOMER' ? '/app' : '/'
    return <Navigate to={fallback} replace />
  }

  return children
}
