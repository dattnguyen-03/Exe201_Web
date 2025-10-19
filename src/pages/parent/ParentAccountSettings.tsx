import React, { useState, useEffect } from 'react'
import { User, Shield, Eye, EyeOff, Save, Loader2, CheckCircle } from 'lucide-react'
import { parentApiService, ParentProfile, ParentProfileUpdate, PasswordChange } from '../../services/parentApiService'

const ParentAccountSettings: React.FC = () => {
  // State management
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Profile data
  const [profile, setProfile] = useState<ParentProfile | null>(null)
  const [profileForm, setProfileForm] = useState<ParentProfileUpdate>({})
  
  // Password change
  const [showPassword, setShowPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState<PasswordChange>({
    current_password: '',
    new_password: ''
  })
  

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Load profile data
        const profileData = await parentApiService.getProfile()
        
        setProfile(profileData)
        setProfileForm({
          full_name: profileData.full_name,
          phone: profileData.phone || '',
          address: profileData.address || '',
          emergency_contact: profileData.emergency_contact || '',
          relationship: profileData.relationship || ''
        })
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu')
        console.error('Error loading settings:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Save all changes
  const handleSaveAll = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      // Save profile changes
      if (profileForm.full_name || profileForm.phone || profileForm.address || 
          profileForm.emergency_contact || profileForm.relationship) {
        await parentApiService.updateProfile(profileForm)
      }
      
      // Save password if provided
      if (passwordForm.current_password && passwordForm.new_password) {
        await parentApiService.changePassword(passwordForm)
        setPasswordForm({ current_password: '', new_password: '' })
      }
      
      setSuccess('Đã lưu tất cả thay đổi thành công!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu dữ liệu')
      console.error('Error saving settings:', err)
    } finally {
      setSaving(false)
    }
  }

  // Handle profile form changes
  const handleProfileChange = (field: keyof ParentProfileUpdate, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }))
  }

  // Handle password form changes
  const handlePasswordChange = (field: keyof PasswordChange, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-600">Đang tải cài đặt...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">⚙️ Cài đặt tài khoản</h1>
        <p className="text-amber-100">Quản lý tùy chọn tài khoản và cài đặt thông báo</p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Profile Settings */}
        <section className="space-y-6">
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3">Họ và tên</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900 text-base" 
                  value={profileForm.full_name || ''}
                  onChange={(e) => handleProfileChange('full_name', e.target.value)}
                  title="Nhập họ và tên đầy đủ" 
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3">Địa chỉ Email</label>
                <input 
                  type="email" 
                  className="w-full px-5 py-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900 text-base bg-gray-100" 
                  value={profile?.email || ''}
                  disabled
                  title="Email không thể thay đổi" 
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3">Số điện thoại</label>
                <input 
                  type="tel" 
                  className="input-field" 
                  value={profileForm.phone || ''}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  title="Nhập số điện thoại" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Liên hệ khẩn cấp</label>
                <input 
                  type="tel" 
                  className="input-field" 
                  value={profileForm.emergency_contact || ''}
                  onChange={(e) => handleProfileChange('emergency_contact', e.target.value)}
                  title="Nhập số điện thoại khẩn cấp" 
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Cài đặt bảo mật</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pr-10"
                    placeholder="Nhập mật khẩu hiện tại"
                    value={passwordForm.current_password}
                    onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                    title="Nhập mật khẩu hiện tại của bạn"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    placeholder="Nhập mật khẩu mới" 
                    value={passwordForm.new_password}
                    onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                    title="Nhập mật khẩu mới" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    placeholder="Xác nhận mật khẩu mới" 
                    title="Xác nhận mật khẩu mới" 
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input type="checkbox" id="twoFactor" className="rounded border-gray-300" />
                <label htmlFor="twoFactor" className="text-sm text-gray-700">
                  Bật xác thực hai yếu tố
                </label>
              </div>
            </div>
          </div>

        </section>

      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSaveAll}
          disabled={saving}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}</span>
        </button>
      </div>
    </div>
  )
}

export default ParentAccountSettings
