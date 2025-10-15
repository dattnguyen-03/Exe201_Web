import React, { useState, useEffect } from 'react'
import { CreditCard, Search, Filter, Check, X, Eye, Clock, CheckCircle, XCircle } from 'lucide-react'
import { showSuccess, showError, showWarning } from '../../utils/swal'

interface PaymentData {
  id: number
  user_name: string
  user_email: string
  user_role: string
  package_name: string
  amount: number
  method: string
  status: string
  transaction_date: string
  expiry_date?: string
  transaction_id?: string
}

const AdminPaymentManagement: React.FC = () => {
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null)

  // Fetch payments
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('smart-child-token')
      const response = await fetch('/api/payments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      } else {
        showError('Không thể tải danh sách thanh toán')
      }
    } catch (error) {
      showError('Lỗi kết nối')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  // Update payment status
  const updatePaymentStatus = async (paymentId: number, status: string) => {
    try {
      const token = localStorage.getItem('smart-child-token')
      const formData = new FormData()
      formData.append('status', status)

      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        showSuccess('Cập nhật trạng thái thanh toán thành công!')
        fetchPayments()
      } else {
        const error = await response.json()
        showError(error.detail || 'Không thể cập nhật trạng thái')
      }
    } catch (error) {
      showError('Lỗi kết nối')
    }
  }

  // Handle status update
  const handleStatusUpdate = async (payment: PaymentData, newStatus: string) => {
    const statusText = newStatus === 'Success' ? 'thành công' : 'thất bại'
    const confirmed = await showWarning(`Bạn có chắc chắn muốn đánh dấu thanh toán này là ${statusText}?`)
    if (!confirmed) return

    await updatePaymentStatus(payment.id, newStatus)
  }

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter
    
    return matchesSearch && matchesStatus && matchesMethod
  })

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'bg-green-100 text-green-700'
      case 'Failed':
        return 'bg-red-100 text-red-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'Success':
        return 'Thành công'
      case 'Failed':
        return 'Thất bại'
      case 'Pending':
        return 'Chờ xử lý'
      default:
        return status
    }
  }

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'school':
        return 'bg-blue-100 text-blue-700'
      case 'parent':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Get role text
  const getRoleText = (role: string) => {
    switch (role) {
      case 'school':
        return 'Trường học'
      case 'parent':
        return 'Phụ huynh'
      default:
        return role
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
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">💳 Quản lý thanh toán</h1>
            <p className="text-green-100">Theo dõi và quản lý tất cả giao dịch thanh toán</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{payments.length}</div>
            <div className="text-green-200 text-sm">Tổng giao dịch</div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-green-25 to-green-50 border-green-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">
              {payments.filter(p => p.status === 'Success').length}
            </div>
            <div className="text-sm text-green-600">Thành công</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-yellow-25 to-yellow-50 border-yellow-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-700">
              {payments.filter(p => p.status === 'Pending').length}
            </div>
            <div className="text-sm text-yellow-600">Chờ xử lý</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-red-25 to-red-50 border-red-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-700">
              {payments.filter(p => p.status === 'Failed').length}
            </div>
            <div className="text-sm text-red-600">Thất bại</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-blue-25 to-blue-50 border-blue-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">
              {formatPrice(payments.reduce((sum, p) => sum + p.amount, 0))}
            </div>
            <div className="text-sm text-blue-600">Tổng doanh thu</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">🔍 Tìm kiếm và bộ lọc</h3>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm theo tên, email, gói dịch vụ..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="Success">Thành công</option>
              <option value="Pending">Chờ xử lý</option>
              <option value="Failed">Thất bại</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức</label>
            <select
              className="input-field"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="PayPOS">PayPOS</option>
              <option value="Manual">Thủ công</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">📋 Danh sách thanh toán</h3>
          <span className="text-sm text-gray-500">{filteredPayments.length} giao dịch</span>
        </div>

        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <div key={payment.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{payment.user_name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(payment.user_role)}`}>
                        {getRoleText(payment.user_role)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Gói dịch vụ:</span>
                        <div>{payment.package_name}</div>
                      </div>
                      <div>
                        <span className="font-medium">Số tiền:</span>
                        <div className="font-bold text-green-600">{formatPrice(payment.amount)}</div>
                      </div>
                      <div>
                        <span className="font-medium">Phương thức:</span>
                        <div>{payment.method}</div>
                      </div>
                      <div>
                        <span className="font-medium">Ngày giao dịch:</span>
                        <div>{new Date(payment.transaction_date).toLocaleDateString('vi-VN')}</div>
                      </div>
                    </div>

                    {payment.transaction_id && (
                      <div className="mt-2">
                        <span className="text-sm text-blue-600 font-medium">
                          Mã giao dịch: {payment.transaction_id}
                        </span>
                      </div>
                    )}

                    {payment.expiry_date && (
                      <div className="mt-2">
                        <span className="text-sm text-purple-600 font-medium">
                          Hết hạn: {new Date(payment.expiry_date).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPayment(payment)
                      setShowDetailModal(true)
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {payment.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(payment, 'Success')}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Đánh dấu thành công"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(payment, 'Failed')}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Đánh dấu thất bại"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Detail Modal */}
      {showDetailModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-green-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết giao dịch</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedPayment(null)
                }}
                className="p-2 text-gray-600 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Giao dịch</label>
                  <div className="text-lg font-bold text-gray-900">#{selectedPayment.id}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPayment.status)}`}>
                    {getStatusText(selectedPayment.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Người dùng</label>
                  <div className="text-lg font-medium text-gray-900">{selectedPayment.user_name}</div>
                  <div className="text-sm text-gray-600">{selectedPayment.user_email}</div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getRoleColor(selectedPayment.user_role)}`}>
                    {getRoleText(selectedPayment.user_role)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gói dịch vụ</label>
                  <div className="text-lg font-medium text-gray-900">{selectedPayment.package_name}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số tiền</label>
                  <div className="text-2xl font-bold text-green-600">{formatPrice(selectedPayment.amount)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức</label>
                  <div className="text-lg font-medium text-gray-900">{selectedPayment.method}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày giao dịch</label>
                  <div className="text-lg font-medium text-gray-900">
                    {new Date(selectedPayment.transaction_date).toLocaleString('vi-VN')}
                  </div>
                </div>
                {selectedPayment.expiry_date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hết hạn</label>
                    <div className="text-lg font-medium text-gray-900">
                      {new Date(selectedPayment.expiry_date).toLocaleString('vi-VN')}
                    </div>
                  </div>
                )}
              </div>

              {selectedPayment.transaction_id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mã giao dịch</label>
                  <div className="text-lg font-mono text-gray-900 bg-gray-100 p-2 rounded">
                    {selectedPayment.transaction_id}
                  </div>
                </div>
              )}

              {selectedPayment.status === 'Pending' && (
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedPayment, 'Success')
                      setShowDetailModal(false)
                    }}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Đánh dấu thành công</span>
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedPayment, 'Failed')
                      setShowDetailModal(false)
                    }}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Đánh dấu thất bại</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPaymentManagement
