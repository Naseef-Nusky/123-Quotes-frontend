import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted">
        Loading…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles?.length && !roles.includes(user.role)) {
    const fallback = user.role === 'PROFESSIONAL' ? '/pro' : user.role === 'CUSTOMER' ? '/app' : '/'
    return <Navigate to={fallback} replace />
  }

  return children
}
