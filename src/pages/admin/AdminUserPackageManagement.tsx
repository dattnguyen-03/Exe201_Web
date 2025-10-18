import React, { useState, useEffect } from 'react'
import { Users, Package, Clock, DollarSign, Search, Filter, Eye, Edit, Pause, Play, Calendar, User } from 'lucide-react'
import { showSuccess, showError, showConfirm } from '../../utils/swal'
import { adminApiService, UserPackageData, UserPackageDetail, ExtendPackageData } from '../../services/adminApiService'
import { PackageData } from '../../services/adminApiService'

const AdminUserPackageManagement: React.FC = () => {
  const [userPackages, setUserPackages] = useState<UserPackageData[]>([])
  const [packages, setPackages] = useState<PackageData[]>([])
  const [selectedUser, setSelectedUser] = useState<UserPackageDetail | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showExtendModal, setShowExtendModal] = useState(false)
  const [extendData, setExtendData] = useState<ExtendPackageData>({
    package_id: 0,
    duration_days: 30
  })

  // Fetch data
  const fetchUserPackages = async () => {
    try {
      console.log('Fetching user packages...')
      const data = await adminApiService.getUserPackages()
      setUserPackages(data)
      console.log('User packages loaded:', data.length)
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

  const fetchPackages = async () => {
    try {
      const data = await adminApiService.getAllPackages()
      setPackages(data)
    } catch (error) {
      console.error('Fetch packages error:', error)
    }
  }

  useEffect(() => {
    fetchUserPackages()
    fetchPackages()
  }, [])

  // Handle view detail
  const handleViewDetail = async (userId: number) => {
    try {
      const detail = await adminApiService.getUserPackageDetail(userId)
      setSelectedUser(detail)
      setShowDetailModal(true)
    } catch (error) {
      console.error('View detail error:', error)
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('Lỗi kết nối')
      }
    }
  }

  // Handle extend package
  const handleExtendPackage = async (userId: number) => {
    try {
      const detail = await adminApiService.getUserPackageDetail(userId)
      setSelectedUser(detail)
      setExtendData({
        package_id: detail.current_package.id,
        duration_days: 30
      })
      setShowExtendModal(true)
    } catch (error) {
      console.error('Extend package error:', error)
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('Lỗi kết nối')
      }
    }
  }

  // Handle extend submit
  const handleExtendSubmit = async () => {
    if (!selectedUser) return

    try {
      const result = await adminApiService.extendUserPackage(selectedUser.user.id, extendData)
      showSuccess(`Gia hạn thành công! Gói hết hạn vào: ${new Date(result.new_expiry_date).toLocaleDateString('vi-VN')}`)
      setShowExtendModal(false)
      setSelectedUser(null)
      fetchUserPackages()
    } catch (error) {
      console.error('Extend submit error:', error)
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('Lỗi kết nối')
      }
    }
  }

  // Handle deactivate
  const handleDeactivate = async (userId: number) => {
    try {
      const result = await showConfirm(
        'Bạn có chắc chắn muốn tạm dừng gói dịch vụ của user này?',
        'Xác nhận tạm dừng'
      )
      
      if (!result.isConfirmed) return

      await adminApiService.deactivateUserPackage(userId)
      showSuccess('Tạm dừng gói dịch vụ thành công!')
      fetchUserPackages()
    } catch (error) {
      console.error('Deactivate error:', error)
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('Lỗi kết nối')
      }
    }
  }

  // Handle activate
  const handleActivate = async (userId: number) => {
    try {
      const result = await showConfirm(
        'Bạn có chắc chắn muốn kích hoạt lại gói dịch vụ của user này?',
        'Xác nhận kích hoạt'
      )
      
      if (!result.isConfirmed) return

      await adminApiService.activateUserPackage(userId)
      showSuccess('Kích hoạt gói dịch vụ thành công!')
      fetchUserPackages()
    } catch (error) {
      console.error('Activate error:', error)
      if (error instanceof Error) {
        showError(error.message)
      } else {
        showError('Lỗi kết nối')
      }
    }
  }

  // Filter data
  const filteredUserPackages = userPackages.filter(up => {
    const matchesSearch = up.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         up.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         up.package_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = filterRole === 'all' || up.user_role === filterRole
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && up.is_active_package) ||
                         (filterStatus === 'inactive' && !up.is_active_package) ||
                         (filterStatus === 'expired' && up.days_remaining < 0)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">👥 Quản lý gói dịch vụ người dùng</h1>
            <p className="text-purple-100">Theo dõi và quản lý gói dịch vụ của parent/school</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold">{userPackages.length}</div>
              <div className="text-purple-100 text-sm">Tổng user có gói</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-25 to-blue-50 border-blue-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{userPackages.filter(up => up.is_active_package).length}</div>
            <div className="text-sm text-blue-600">Đang hoạt động</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-25 to-green-50 border-green-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">{userPackages.filter(up => up.days_remaining > 7).length}</div>
            <div className="text-sm text-green-600">Còn hạn  7 ngày</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-orange-25 to-orange-50 border-orange-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-700">{userPackages.filter(up => up.days_remaining >= 0 && up.days_remaining <= 7).length}</div>
            <div className="text-sm text-orange-600">Sắp hết hạn</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-red-25 to-red-50 border-red-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-700">{userPackages.filter(up => up.days_remaining < 0).length}</div>
            <div className="text-sm text-red-600">Đã hết hạn</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">🔍 Tìm kiếm và lọc</h3>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm theo tên, email hoặc gói..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="input-field"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="parent">Parent</option>
            <option value="school">School</option>
          </select>
          
          <select
            className="input-field"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Tạm dừng</option>
            <option value="expired">Đã hết hạn</option>
          </select>
          
          <button
            onClick={fetchUserPackages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Tìm kiếm</span>
          </button>
        </div>
      </div>

      {/* User Packages List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">📋 Danh sách user packages</h3>
          <span className="text-sm text-gray-500">{filteredUserPackages.length} user</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Gói dịch vụ</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Trạng thái</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Thời hạn</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUserPackages.map((up) => (
                <tr key={up.user_id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {up.user_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{up.user_name}</div>
                        <div className="text-sm text-gray-500">{up.user_email}</div>
                        <div className="text-xs text-gray-400 capitalize">{up.user_role}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{up.package_name}</div>
                      <div className="text-sm text-gray-500">{formatPrice(up.package_price)}</div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      up.is_active_package 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {up.is_active_package ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {up.days_remaining > 0 ? `${up.days_remaining} ngày` : 'Đã hết hạn'}
                      </div>
                      <div className="text-gray-500">
                        {formatDate(up.package_expiry_date)}
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetail(up.user_id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleExtendPackage(up.user_id)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Gia hạn"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                      
                      {up.is_active_package ? (
                        <button
                          onClick={() => handleDeactivate(up.user_id)}
                          className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                          title="Tạm dừng"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(up.user_id)}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Kích hoạt"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết gói dịch vụ</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedUser(null)
                }}
                className="p-2 text-gray-600 hover:text-gray-700 transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Thông tin user</h3>
                <div className="space-y-2">
                  <div><span className="font-medium">Tên:</span> {selectedUser.user.full_name}</div>
                  <div><span className="font-medium">Email:</span> {selectedUser.user.email}</div>
                  <div><span className="font-medium">Vai trò:</span> {selectedUser.user.role}</div>
                  {selectedUser.user.phone && <div><span className="font-medium">SĐT:</span> {selectedUser.user.phone}</div>}
                </div>
              </div>

              {/* Package Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Thông tin gói</h3>
                <div className="space-y-2">
                  <div><span className="font-medium">Tên gói:</span> {selectedUser.current_package.name}</div>
                  <div><span className="font-medium">Giá:</span> {formatPrice(selectedUser.current_package.price)}</div>
                  <div><span className="font-medium">Thời hạn:</span> {selectedUser.current_package.duration_days} ngày</div>
                  <div><span className="font-medium">Camera:</span> {selectedUser.current_package.camera_limit}</div>
                  <div><span className="font-medium">Lưu trữ:</span> {selectedUser.current_package.storage_days} ngày</div>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Lịch sử thanh toán</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Ngày</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Số tiền</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Phương thức</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUser.payment_history.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-100">
                        <td className="py-2 px-3 text-sm">{formatDate(payment.transaction_date)}</td>
                        <td className="py-2 px-3 text-sm">{formatPrice(payment.amount)}</td>
                        <td className="py-2 px-3 text-sm">{payment.method}</td>
                        <td className="py-2 px-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            payment.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extend Modal */}
      {showExtendModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-purple-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gia hạn gói dịch vụ</h2>
              <button
                onClick={() => {
                  setShowExtendModal(false)
                  setSelectedUser(null)
                }}
                className="p-2 text-gray-600 hover:text-gray-700 transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-800 mb-3">
                  Chọn gói dịch vụ
                </label>
                <select
                  className="w-full px-5 py-4 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-200"
                  value={extendData.package_id}
                  onChange={(e) => setExtendData({ ...extendData, package_id: parseInt(e.target.value) })}
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - {formatPrice(pkg.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-base font-medium text-gray-800 mb-3">
                  Số ngày gia hạn
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-5 py-4 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-200"
                  value={extendData.duration_days}
                  onChange={(e) => setExtendData({ ...extendData, duration_days: parseInt(e.target.value) })}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowExtendModal(false)
                    setSelectedUser(null)
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleExtendSubmit}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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

export default AdminUserPackageManagement
