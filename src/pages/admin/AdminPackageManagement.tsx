import React, { useState, useEffect } from 'react'
import { Package, Plus, Edit, Trash2, Search, Filter, X, Check, XCircle, Clock, AlertTriangle, Users, TrendingUp } from 'lucide-react'
import { showSuccess, showError, showWarning, showConfirm } from '../../utils/swal'
import { adminApiService, PackageData, PackageCreateData, PackageUpdateData } from '../../services/adminApiService'

// Interface cho đếm ngược
interface ExpiringPackage {
  user_id: number
  user_name: string
  user_email: string
  user_role: string
  package_id: number
  package_name: string
  package_price: number
  expiry_date: string
  days_remaining: number
  hours_remaining: number
  status: 'expired' | 'expiring_soon' | 'expiring_7_days' | 'active'
  urgency: 'critical' | 'high' | 'medium' | 'low'
  is_expired: boolean
}

interface PackageStats {
  active: number
  expiring_7_days: number
  expiring_3_days: number
  expired: number
}

const AdminPackageManagement: React.FC = () => {
  const [packages, setPackages] = useState<PackageData[]>([])
  const [expiringPackages, setExpiringPackages] = useState<ExpiringPackage[]>([])
  const [packageStats, setPackageStats] = useState<PackageStats>({
    active: 0,
    expiring_7_days: 0,
    expiring_3_days: 0,
    expired: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCountdownModal, setShowCountdownModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<ExpiringPackage | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration_days: '',
    camera_limit: '',
    ai_features: '',
    storage_days: '',
    description: ''
  })

  // Fetch packages
  const fetchPackages = async () => {
    try {
      console.log('Fetching packages...')
      const data = await adminApiService.getAllPackages()
        setPackages(data)
      console.log('Packages loaded:', data.length)
    } catch (error) {
      console.error('Fetch error:', error)
      if (error instanceof Error) {
        showError(error.message)
      } else {
      showError('Lỗi kết nối')
      }
    } finally {
      setLoading(false)
    }
  }

  // Fetch expiring packages
  const fetchExpiringPackages = async () => {
    try {
      const response = await fetch('/api/admin/expiring-packages', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setExpiringPackages(data.packages || [])
        setPackageStats({
          active: data.active_count || 0,
          expiring_7_days: data.expiring_7_days_count || 0,
          expiring_3_days: data.expiring_soon_count || 0,
          expired: data.expired_count || 0
        })
      }
    } catch (error) {
      console.error('Error fetching expiring packages:', error)
    }
  }

  useEffect(() => {
    fetchPackages()
    fetchExpiringPackages()
    
    // Auto refresh expiring packages every 30 seconds
    const interval = setInterval(fetchExpiringPackages, 30000)
    return () => clearInterval(interval)
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      console.log('Submitting form...')
      
      // Validate ai_features JSON
      let aiFeaturesString = formData.ai_features
      
      try {
        // Try to parse as JSON to validate
        const parsed = JSON.parse(formData.ai_features)
        
        if (!Array.isArray(parsed)) {
          throw new Error('ai_features must be a JSON array')
        }
        // Re-stringify to ensure proper format
        aiFeaturesString = JSON.stringify(parsed)
      } catch (e) {
        showError('Tính năng AI phải là một JSON array hợp lệ. Ví dụ: ["face_recognition", "behavior_analysis"]')
        return
      }
      
      // Prepare data
      const packageData: PackageCreateData | PackageUpdateData = {
        name: formData.name,
        price: parseFloat(formData.price),
        duration_days: parseInt(formData.duration_days),
        camera_limit: parseInt(formData.camera_limit),
        ai_features: aiFeaturesString,
        storage_days: parseInt(formData.storage_days),
        description: formData.description || undefined
      }

      let result: PackageData
      
      if (selectedPackage) {
        // Update existing package
        console.log('Updating package:', selectedPackage.id)
        result = await adminApiService.updatePackage(selectedPackage.id, packageData)
        showSuccess('Cập nhật gói dịch vụ thành công!')
      } else {
        // Create new package
        console.log('Creating new package')
        result = await adminApiService.createPackage(packageData as PackageCreateData)
        showSuccess('Tạo gói dịch vụ thành công!')
      }
      
      console.log('Package saved:', result)
      
      // Reset form and close modals
        setShowAddModal(false)
        setShowEditModal(false)
        setSelectedPackage(null)
        resetForm()
        fetchPackages()
      
    } catch (error) {
      console.error('Submit error:', error)
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('Lỗi kết nối')
      }
    }
  }

  // Handle delete
  const handleDelete = async (packageId: number) => {
    try {
      const result = await showConfirm(
        'Bạn có chắc chắn muốn xóa gói dịch vụ này? Hành động này không thể hoàn tác.',
        'Xác nhận xóa gói dịch vụ'
      )
      
      if (!result.isConfirmed) {
        return // User cancelled
      }

      console.log('Deleting package:', packageId)
      await adminApiService.deletePackage(packageId)
        showSuccess('Xóa gói dịch vụ thành công!')
        fetchPackages()
    } catch (error) {
      console.error('Delete error:', error)
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('Lỗi kết nối')
      }
    }
  }

  // Handle edit
  const handleEdit = (pkg: PackageData) => {
    setSelectedPackage(pkg)
    setFormData({
      name: pkg.name,
      price: pkg.price.toString(),
      duration_days: pkg.duration_days.toString(),
      camera_limit: pkg.camera_limit.toString(),
      ai_features: pkg.ai_features,
      storage_days: pkg.storage_days.toString(),
      description: pkg.description || ''
    })
    setShowEditModal(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      duration_days: '',
      camera_limit: '',
      ai_features: '',
      storage_days: '',
      description: ''
    })
  }

  // Filter packages
  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  // Parse AI features
  const parseAIFeatures = (features: string) => {
    try {
      return JSON.parse(features)
    } catch {
      return []
    }
  }

  // Get urgency color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'expired': return 'Đã hết hạn'
      case 'expiring_soon': return 'Sắp hết hạn'
      case 'expiring_7_days': return 'Hết hạn trong 7 ngày'
      case 'active': return 'Đang hoạt động'
      default: return 'Không xác định'
    }
  }

  // Handle countdown modal
  const handleShowCountdown = (user: ExpiringPackage) => {
    setSelectedUser(user)
    setShowCountdownModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">📦 Quản lý gói dịch vụ</h1>
            <p className="text-blue-100">Tạo và quản lý các gói dịch vụ cho trường học và phụ huynh</p>
          </div>
          <button 
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            <span>Tạo gói mới</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-25 to-blue-50 border-blue-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{packages.length}</div>
            <div className="text-sm text-blue-600">Tổng số gói</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-25 to-green-50 border-green-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">{packageStats.active}</div>
            <div className="text-sm text-green-600">Đang hoạt động</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-orange-25 to-orange-50 border-orange-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-700">{packageStats.expiring_7_days}</div>
            <div className="text-sm text-orange-600">Còn hạn 7 ngày</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-red-25 to-red-50 border-red-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-700">{packageStats.expired}</div>
            <div className="text-sm text-red-600">Đã hết hạn</div>
          </div>
        </div>
      </div>

      {/* Expiring Packages Alert */}
      {(packageStats.expired > 0 || packageStats.expiring_3_days > 0) && (
        <div className="card bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-lg font-bold text-red-800">Cảnh báo gói sắp hết hạn</h3>
                <p className="text-sm text-red-600">
                  {packageStats.expired > 0 && `${packageStats.expired} gói đã hết hạn`}
                  {packageStats.expired > 0 && packageStats.expiring_3_days > 0 && ', '}
                  {packageStats.expiring_3_days > 0 && `${packageStats.expiring_3_days} gói sắp hết hạn`}
                </p>
              </div>
            </div>
            <button
              onClick={() => fetchExpiringPackages()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">🔍 Tìm kiếm gói dịch vụ</h3>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mô tả gói dịch vụ..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Expiring Packages List */}
      {expiringPackages.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">⏰ Gói sắp hết hạn</h3>
            <span className="text-sm text-gray-500">{expiringPackages.length} gói</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expiringPackages.slice(0, 6).map((user) => (
              <div key={user.user_id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{user.user_name}</h4>
                    <p className="text-sm text-gray-600">{user.user_email}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getUrgencyColor(user.urgency)}`}>
                      {getStatusText(user.status)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleShowCountdown(user)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Xem đếm ngược"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="text-lg font-bold text-blue-600">
                    {user.package_name}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Còn lại:</span>
                    <span className={`font-bold ${user.days_remaining < 0 ? 'text-red-600' : user.days_remaining <= 3 ? 'text-orange-600' : 'text-green-600'}`}>
                      {user.days_remaining < 0 ? 'Đã hết hạn' : `${user.days_remaining} ngày`}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Hết hạn: {new Date(user.expiry_date).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {expiringPackages.length > 6 && (
            <div className="text-center mt-4">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Xem tất cả {expiringPackages.length} gói
              </button>
            </div>
          )}
        </div>
      )}

      {/* Packages List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">📋 Danh sách gói dịch vụ</h3>
          <span className="text-sm text-gray-500">{filteredPackages.length} gói</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{pkg.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pkg.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {pkg.is_active ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(pkg.price)}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Thời hạn:</span>
                    <div>{pkg.duration_days} ngày</div>
                  </div>
                  <div>
                    <span className="font-medium">Camera:</span>
                    <div>{pkg.camera_limit} camera</div>
                  </div>
                  <div>
                    <span className="font-medium">Lưu trữ:</span>
                    <div>{pkg.storage_days} ngày</div>
                  </div>
                  <div>
                    <span className="font-medium">Tính năng AI:</span>
                    <div>{parseAIFeatures(pkg.ai_features).length} tính năng</div>
                  </div>
                </div>

                {pkg.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>
                )}

                <div className="pt-2">
                  <div className="text-xs text-gray-500">
                    Tạo lúc: {new Date(pkg.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Package Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tạo gói dịch vụ mới</h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="p-2 text-gray-600 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Tên gói dịch vụ *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Gói Cơ Bản"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Giá (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full px-5 py-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="500000"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Thời hạn (ngày) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-5 py-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Giới hạn camera *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-5 py-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={formData.camera_limit}
                    onChange={(e) => setFormData({ ...formData, camera_limit: e.target.value })}
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Lưu trữ (ngày) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-5 py-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={formData.storage_days}
                    onChange={(e) => setFormData({ ...formData, storage_days: e.target.value })}
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Tính năng AI (JSON) *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={formData.ai_features}
                    onChange={(e) => setFormData({ ...formData, ai_features: e.target.value })}
                    placeholder='["face_recognition", "behavior_analysis", "danger_detection"]'
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-800 mb-3">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  className="w-full px-5 py-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết về gói dịch vụ..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Tạo gói</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
      {showEditModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa gói dịch vụ</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedPackage(null)
                  resetForm()
                }}
                className="p-2 text-gray-600 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Same form fields as Add Modal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Tên gói dịch vụ *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Giá (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full px-5 py-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Thời hạn (ngày) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-5 py-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Giới hạn camera *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-5 py-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={formData.camera_limit}
                    onChange={(e) => setFormData({ ...formData, camera_limit: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Lưu trữ (ngày) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-5 py-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={formData.storage_days}
                    onChange={(e) => setFormData({ ...formData, storage_days: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Tính năng AI (JSON) *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={formData.ai_features}
                    onChange={(e) => setFormData({ ...formData, ai_features: e.target.value })}
                    placeholder='["face_recognition", "behavior_analysis", "danger_detection"]'
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-800 mb-3">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  className="w-full px-5 py-4 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedPackage(null)
                    resetForm()
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Cập nhật</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Countdown Modal */}
      {showCountdownModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md shadow-2xl border border-blue-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">⏰ Đếm ngược gói dịch vụ</h2>
              <button
                onClick={() => setShowCountdownModal(false)}
                className="p-2 text-gray-600 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedUser.user_name}</h3>
                <p className="text-gray-600">{selectedUser.user_email}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getUrgencyColor(selectedUser.urgency)}`}>
                  {getStatusText(selectedUser.status)}
                </span>
              </div>

              {/* Package Info */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-bold text-blue-900 mb-2">{selectedUser.package_name}</h4>
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(selectedUser.package_price)}
                </div>
              </div>

              {/* Countdown */}
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {selectedUser.days_remaining < 0 ? '00' : selectedUser.days_remaining.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-600 mb-4">ngày</div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-700">
                      {Math.floor(selectedUser.hours_remaining % 24).toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-600">giờ</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-700">
                      {Math.floor((selectedUser.hours_remaining * 60) % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-600">phút</div>
                  </div>
                </div>
              </div>

              {/* Expiry Date */}
              <div className="text-center">
                <div className="text-sm text-gray-600">Hết hạn vào:</div>
                <div className="font-bold text-gray-900">
                  {new Date(selectedUser.expiry_date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Thời gian còn lại</span>
                  <span>{Math.max(0, Math.round((selectedUser.hours_remaining / (30 * 24)) * 100))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      selectedUser.days_remaining < 0 ? 'bg-red-500' :
                      selectedUser.days_remaining <= 3 ? 'bg-orange-500' :
                      selectedUser.days_remaining <= 7 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.max(0, Math.min(100, Math.round((selectedUser.hours_remaining / (30 * 24)) * 100)))}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCountdownModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement extend package functionality
                    showWarning('Tính năng gia hạn sẽ được phát triển')
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Gia hạn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPackageManagement
