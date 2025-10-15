import React, { useState, useEffect } from 'react'
import { Package, Plus, Edit, Trash2, Search, Filter, X, Check, XCircle } from 'lucide-react'
import { showSuccess, showError, showWarning } from '../../utils/swal'

interface PackageData {
  id: number
  name: string
  price: number
  duration_days: number
  camera_limit: number
  ai_features: string
  storage_days: number
  description?: string
  is_active: boolean
  created_at: string
}

const AdminPackageManagement: React.FC = () => {
  const [packages, setPackages] = useState<PackageData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null)
  const [loading, setLoading] = useState(true)

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
      const token = localStorage.getItem('smart-child-token')
      const response = await fetch('/api/packages/admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPackages(data)
      } else {
        showError('Không thể tải danh sách gói dịch vụ')
      }
    } catch (error) {
      showError('Lỗi kết nối')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('smart-child-token')
      const formDataToSend = new FormData()
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value)
      })

      const url = selectedPackage ? `/api/packages/${selectedPackage.id}` : '/api/packages'
      const method = selectedPackage ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      if (response.ok) {
        showSuccess(selectedPackage ? 'Cập nhật gói dịch vụ thành công!' : 'Tạo gói dịch vụ thành công!')
        setShowAddModal(false)
        setShowEditModal(false)
        setSelectedPackage(null)
        resetForm()
        fetchPackages()
      } else {
        const error = await response.json()
        showError(error.detail || 'Có lỗi xảy ra')
      }
    } catch (error) {
      showError('Lỗi kết nối')
    }
  }

  // Handle delete
  const handleDelete = async (packageId: number) => {
    const confirmed = await showWarning('Bạn có chắc chắn muốn xóa gói dịch vụ này?')
    if (!confirmed) return

    try {
      const token = localStorage.getItem('smart-child-token')
      const response = await fetch(`/api/packages/${packageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        showSuccess('Xóa gói dịch vụ thành công!')
        fetchPackages()
      } else {
        const error = await response.json()
        showError(error.detail || 'Không thể xóa gói dịch vụ')
      }
    } catch (error) {
      showError('Lỗi kết nối')
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
            <div className="text-2xl font-bold text-green-700">{packages.filter(p => p.is_active).length}</div>
            <div className="text-sm text-green-600">Đang hoạt động</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-orange-25 to-orange-50 border-orange-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-700">{packages.filter(p => !p.is_active).length}</div>
            <div className="text-sm text-orange-600">Tạm dừng</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-purple-25 to-purple-50 border-purple-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-700">
              {formatPrice(packages.reduce((sum, p) => sum + p.price, 0))}
            </div>
            <div className="text-sm text-purple-600">Tổng giá trị</div>
          </div>
        </div>
      </div>

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
                    placeholder='["face_recognition", "behavior_analysis"]'
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
    </div>
  )
}

export default AdminPackageManagement
