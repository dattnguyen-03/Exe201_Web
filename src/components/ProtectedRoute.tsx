import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Layout from './Layout'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  role: 'parent' | 'admin' | 'teacher' | 'school'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
  const { isAuthenticated, user, loading } = useAuth()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Redirect to login if role doesn't match
  if (user?.role !== role) {
    return <Navigate to="/login" replace />
  }

  return (
    <Layout role={role}>
      <Outlet />
    </Layout>
  )
}

export default ProtectedRoute
