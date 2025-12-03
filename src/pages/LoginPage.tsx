import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { login, isAuthenticated, user, error } = useAuth()

  // Redirect if already logged in
  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}`} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage(null)

    const success = await login(email, password) // Role will be auto-detected
    
    if (success) {
      setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...')
    } else {
      // Error is already handled in AuthContext and displayed via error state
      console.error('Login failed')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding */}
          <div className="text-center lg:text-left text-white">
            <div className="mb-8">
              <span className="text-sm font-semibold tracking-widest text-blue-100 uppercase">
                CHILD MONITORING SYSTEM
              </span>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Smart Child</h1>
                <p className="text-blue-100 text-lg">Monitoring System</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
              An toàn cho con yêu của bạn
            </h2>
            <p className="text-blue-100 leading-relaxed text-lg">
              Công nghệ AI tiên tiến kết hợp camera thông minh, mang đến sự yên tâm hoàn toàn cho phụ huynh trong việc bảo vệ và chăm sóc trẻ em.
            </p>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              {/* Login Card */}
              <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">

                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Đăng nhập</h2>
                  <p className="text-gray-600 text-lg">Chào mừng trở lại!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Success Message */}
                  {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-800">{successMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-800">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                        placeholder="admin123"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Đang đăng nhập...</span>
                      </div>
                    ) : (
                      'Đăng nhập'
                    )}
                  </button>
                </form>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
