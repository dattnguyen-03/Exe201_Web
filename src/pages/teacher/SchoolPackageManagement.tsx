import React, { useState, useEffect } from 'react'
import { Package, CreditCard, Calendar, Camera, HardDrive, Brain, CheckCircle, Clock, AlertCircle } from 'lucide-react'
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
}

interface CurrentPackage {
  has_package: boolean
  is_active: boolean
  package?: PackageData
  expiry_date?: string
  days_remaining: number
}

interface PaymentHistory {
  id: number
  amount: number
  method: string
  status: string
  transaction_id: string
  transaction_date: string
  expiry_date?: string
  package?: {
    id: number
    name: string
    duration_days: number
  }
}

const SchoolPackageManagement: React.FC = () => {
  const [packages, setPackages] = useState<PackageData[]>([])
  const [currentPackage, setCurrentPackage] = useState<CurrentPackage | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<number | null>(null)

  // Fetch available packages
  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages')
      if (response.ok) {
        const data = await response.json()
        setPackages(data)
      } else {
        showError('Không thể tải danh sách gói dịch vụ')
      }
    } catch (error) {
      showError('Lỗi kết nối')
    }
  }

  // Fetch current package
  const fetchCurrentPackage = async () => {
    try {
      const token = localStorage.getItem('smart-child-token')
      const response = await fetch('/api/packages/user/current', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentPackage(data)
      }
    } catch (error) {
      console.error('Error fetching current package:', error)
    }
  }

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    try {
      const token = localStorage.getItem('smart-child-token')
      const response = await fetch('/api/packages/user/payments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setPaymentHistory(data)
      }
    } catch (error) {
      console.error('Error fetching payment history:', error)
    }
  }

  // Purchase package
  const purchasePackage = async (packageId: number) => {
    try {
      setPurchasing(packageId)
      const token = localStorage.getItem('smart-child-token')
      const response = await fetch(`/api/packages/${packageId}/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        showSuccess('Tạo giao dịch thành công! Chuyển hướng đến thanh toán...')
        // Redirect to payment page
        window.location.href = data.redirect_url
      } else {
        const error = await response.json()
        showError(error.detail || 'Không thể tạo giao dịch thanh toán')
      }
    } catch (error) {
      showError('Lỗi kết nối')
    } finally {
      setPurchasing(null)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchPackages(),
        fetchCurrentPackage(),
        fetchPaymentHistory()
      ])
      setLoading(false)
    }
    loadData()
  }, [])

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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">📦 Quản lý Gói Dịch Vụ Trường Học</h1>
            <p className="text-green-100">Mua và quản lý gói dịch vụ cho trường học của bạn</p>
          </div>
        </div>
      </div>

      {/* Current Package Status */}
      {currentPackage && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Gói dịch vụ hiện tại</h2>
          
          {currentPackage.has_package ? (
            <div className={`p-6 rounded-xl border-2 ${
              currentPackage.is_active 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                {currentPackage.is_active ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {currentPackage.package?.name}
                  </h3>
                  <p className={`text-sm ${
                    currentPackage.is_active ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {currentPackage.is_active 
                      ? `Còn ${currentPackage.days_remaining} ngày` 
                      : 'Đã hết hạn'
                    }
                  </p>
                </div>
              </div>
              
              {currentPackage.package && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {currentPackage.package.camera_limit}
                    </div>
                    <div className="text-sm text-gray-600">Camera</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {currentPackage.package.storage_days}
                    </div>
                    <div className="text-sm text-gray-600">Ngày lưu trữ</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {parseAIFeatures(currentPackage.package.ai_features).length}
                    </div>
                    <div className="text-sm text-gray-600">Tính năng AI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {currentPackage.package.duration_days}
                    </div>
                    <div className="text-sm text-gray-600">Ngày</div>
                  </div>
                </div>
              )}
              
              {currentPackage.expiry_date && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Hết hạn: {formatDate(currentPackage.expiry_date)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có gói dịch vụ</h3>
              <p className="text-gray-600">Hãy chọn gói dịch vụ phù hợp để bắt đầu</p>
            </div>
          )}
        </div>
      )}

      {/* Available Package */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Gói dịch vụ cho trường học</h2>
        
        {packages.length > 0 ? (
          <div className="max-w-2xl mx-auto">
            {packages.map((pkg) => (
              <div key={pkg.id} className="border-2 border-green-200 rounded-2xl p-8 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {formatPrice(pkg.price)}
                  </div>
                  <div className="text-lg text-gray-600">/ {pkg.duration_days} ngày</div>
                </div>
                
                {pkg.description && (
                  <p className="text-gray-700 text-center mb-6 leading-relaxed">{pkg.description}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <Camera className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{pkg.camera_limit}</div>
                    <div className="text-sm text-gray-600">Camera</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <HardDrive className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{pkg.storage_days}</div>
                    <div className="text-sm text-gray-600">Ngày lưu trữ</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <Brain className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {parseAIFeatures(pkg.ai_features).length}
                    </div>
                    <div className="text-sm text-gray-600">Tính năng AI</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 text-center">Tính năng AI bao gồm:</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {parseAIFeatures(pkg.ai_features).map((feature: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => purchasePackage(pkg.id)}
                  disabled={purchasing === pkg.id}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {purchasing === pkg.id ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Mua gói dịch vụ</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có gói dịch vụ</h3>
            <p className="text-gray-600">Hiện tại chưa có gói dịch vụ nào khả dụng</p>
          </div>
        )}
      </div>

      {/* Payment History */}
      {paymentHistory.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Lịch sử thanh toán</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Gói dịch vụ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Số tiền</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {payment.package?.name || 'Gói không xác định'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.package?.duration_days} ngày
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {formatPrice(payment.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'Success' 
                          ? 'bg-green-100 text-green-700'
                          : payment.status === 'Failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {payment.status === 'Success' ? 'Thành công' :
                         payment.status === 'Failed' ? 'Thất bại' : 'Đang xử lý'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(payment.transaction_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default SchoolPackageManagement
