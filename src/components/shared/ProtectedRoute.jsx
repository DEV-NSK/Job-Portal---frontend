import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { user, loading, saveRedirectPath } = useAuth()
  const location = useLocation()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#060912]">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user) {
    // Save the full path (including search params) so we can redirect back after login
    saveRedirectPath(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />
  }

  if (role && user.role !== role) return <Navigate to="/" replace />

  return children
}
