import React, { useState, useEffect } from 'react'
import { Package, CreditCard, Camera, HardDrive, Brain, XCircle } from 'lucide-react'
import { showSuccess, showError, showWarning } from '../../utils/swal'

// --- Interfaces (đã xóa CurrentPackage) ---
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

interface PendingPayment {
  id: number
  amount: number
  status: string
  method: string
  transaction_id: string
  transaction_date: string
  package: {
    id: number
    name: string
    price: number
    duration_days: number
  }
}

const ParentPackageManagement: React.FC = () => {
  const [packages, setPackages] = useState<PackageData[]>([])
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([])
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<number | null>(null)
  const [cancelling, setCancelling] = useState(false)

  // --- Functions (đã xóa fetchCurrentPackage) ---

  const fetchPackages = async () => {
    try {
      const response = await fetch('https://safenestai.onrender.com/api/packages')
      if (response.ok) setPackages(await response.json())
      else showError('Không thể tải danh sách gói dịch vụ')
    } catch (error) {
      showError('Lỗi kết nối')
    }
  }

  const fetchPaymentHistory = async () => {
    try {
      const token = localStorage.getItem('smart-child-token')
      const user = JSON.parse(localStorage.getItem('smart-child-user') || '{}')
      const response = await fetch(`https://safenestai.onrender.com/api/payments/user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) setPaymentHistory(await response.json())
    } catch (error) {
      console.error('Error fetching payment history:', error)
    }
  }

  const fetchPendingPayment = async () => {
    try {
      const token = localStorage.getItem('smart-child-token')
      const response = await fetch('https://safenestai.onrender.com/api/package-service/user/pending-payment', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.has_pending) {
          setPendingPayment(data.payment)
        } else {
          setPendingPayment(null)
        }
      }
    } catch (error) {
      console.error('Error fetching pending payment:', error)
    }
  }

  const purchasePackage = async (packageId: number) => {
    // Prevent double-click
    if (purchasing === packageId) {
      console.log('Purchase already in progress for package:', packageId)
      return
    }
    
    setPurchasing(packageId)
    console.log('Starting purchase for package:', packageId)
    
    try {
      const token = localStorage.getItem('smart-child-token')
      if (!token) {
        showError('Vui lòng đăng nhập để mua gói dịch vụ')
        return
      }
      
      console.log('Making purchase request to:', `http://127.0.0.1:8000/api/package-service/${packageId}/purchase`)
      const response = await fetch(`http://127.0.0.1:8000/api/package-service/${packageId}/purchase`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Purchase response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Purchase response:', data)
        
        // Check if we have direct PayPOS URL
        if (data.payment_url && data.status === "redirect_to_paypos") {
          if (data.demo) {
            // Demo mode - redirect to payment page instead of auto-redirect
            showSuccess('Tạo giao dịch thành công! Chuyển hướng đến trang thanh toán...')
            const paymentData = {
              payment_id: data.payment_id,
              amount: data.amount,
              package_name: data.package_name,
              order_id: data.transaction_id || data.order_id,
              status: 'Pending',
              payment_url: data.payment_url,
              demo: data.demo
            }
            sessionStorage.setItem('current-payment', JSON.stringify(paymentData))
            setTimeout(() => {
              window.location.href = `/payment/package/${packageId}`
            }, 1000)
          } else {
            // Real PayPOS - redirect directly
            showSuccess('Tạo giao dịch thành công! Chuyển hướng đến PayPOS...')
            setTimeout(() => {
              console.log('Redirecting to PayPOS:', data.payment_url)
              window.location.href = data.payment_url
            }, 1000)
          }
        } else if (data.redirect_url && data.status === "redirect_to_payment_page") {
          showSuccess('Tạo giao dịch thành công! Chuyển hướng đến thanh toán...')
          // Pass payment data to avoid creating duplicate payment
          const paymentData = {
            payment_id: data.payment_id,
            amount: data.amount,
            package_name: data.package_name,
            order_id: data.transaction_id || `PKG_${data.payment_id}_${Date.now()}`,
            status: 'Pending'
          }
          // Store payment data in sessionStorage to pass to PaymentPage
          sessionStorage.setItem('current-payment', JSON.stringify(paymentData))
          setTimeout(() => {
            console.log('Redirecting to payment page:', data.redirect_url)
            window.location.href = data.redirect_url
          }, 1000)
        } else {
          // Fallback case - should not happen with new logic
          console.warn('Unexpected response format:', data)
          showError('Lỗi không xác định trong quá trình tạo giao dịch')
        }
      } else {
        console.error('Purchase failed with status:', response.status)
        let errorMessage = 'Không thể tạo giao dịch thanh toán'
        
        try {
          const error = await response.json()
          console.error('Purchase error response:', error)
          
          // Check if it's a duplicate payment error
          if (error.detail && error.detail.includes('already being processed')) {
            showWarning('Đã có giao dịch đang chờ xử lý cho gói này. Bạn có thể:')
            
            // Show options to user
            setTimeout(() => {
              if (confirm('Bạn có muốn chuyển đến trang thanh toán để hoàn tất giao dịch hiện tại không?')) {
                // Redirect to payment page for this package
                window.location.href = `/payment/package/${packageId}`
              }
            }, 1000)
            return
          } else {
            errorMessage = error.detail || error.message || errorMessage
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError)
          errorMessage = `Lỗi server (${response.status}): ${response.statusText}`
        }
        
        showError(errorMessage)
      }
    } catch (error) {
      showError('Lỗi kết nối')
    } finally {
      // Reset purchasing state after a delay
      setTimeout(() => {
        setPurchasing(null)
      }, 2000)
    }
  }

  const retryPayment = async (paymentId: number) => {
    try {
      const token = localStorage.getItem('smart-child-token')
      const response = await fetch(`http://127.0.0.1:8000/api/package-service/payment/${paymentId}/retry`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Retry payment response:', data)
        
        // Check if we have direct PayPOS URL
        if (data.payment_url && data.status === "redirect_to_paypos") {
          if (data.demo) {
            // Demo mode - redirect to payment page instead of auto-redirect
            showSuccess('Tạo link thanh toán thành công! Chuyển hướng đến trang thanh toán...')
            const paymentData = {
              payment_id: data.payment_id,
              amount: data.amount,
              package_name: data.package_name,
              order_id: data.transaction_id || data.order_id,
              status: 'Pending',
              payment_url: data.payment_url,
              demo: data.demo
            }
            sessionStorage.setItem('current-payment', JSON.stringify(paymentData))
            setTimeout(() => {
              window.location.href = `/payment/package/${data.package?.id || 'demo'}`
            }, 1000)
          } else {
            // Real PayPOS - redirect directly
            showSuccess('Chuyển hướng đến PayPOS...')
            setTimeout(() => {
              window.open(data.payment_url, '_blank')
            }, 1000)
          }
        } else if (data.redirect_url) {
          // Fallback to payment page
          showSuccess('Chuyển hướng đến trang thanh toán...')
          setTimeout(() => {
            window.location.href = data.redirect_url
          }, 1000)
        } else {
          showSuccess('Tạo link thanh toán thành công!')
        }
      } else {
        const error = await response.json()
        showError(error.detail || 'Không thể tạo link thanh toán')
      }
    } catch (error) {
      showError('Lỗi kết nối')
    }
  }

  const cancelPendingPayments = async () => {
    setCancelling(true)
    try {
      const token = localStorage.getItem('smart-child-token')
      
      // First try to force cleanup old pending payments
      const cleanupResponse = await fetch('/api/packages/force-cleanup-pending', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      // Then cancel remaining pending payments
      const response = await fetch('/api/payments/cancel-pending', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        showSuccess(data.message || 'Đã hủy các giao dịch đang chờ')
        fetchPaymentHistory() // Tải lại lịch sử để cập nhật
      } else {
        const error = await response.json()
        showError(error.detail || 'Không thể hủy giao dịch')
      }
    } catch (error) {
      showError('Lỗi kết nối')
    } finally {
      setCancelling(false)
    }
  }

  const cleanupInvalidPayments = async () => {
    try {
      const token = localStorage.getItem('smart-child-token')
      const response = await fetch('http://127.0.0.1:8000/api/packages/cleanup-invalid-payments', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        showSuccess(data.message || 'Đã dọn dẹp các giao dịch lỗi')
        fetchPaymentHistory()
      } else {
        const error = await response.json()
        showError(error.detail || 'Không thể dọn dẹp giao dịch')
      }
    } catch (error) {
      showError('Lỗi kết nối')
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      // Xóa fetchCurrentPackage khỏi Promise.all
      await Promise.all([fetchPackages(), fetchPaymentHistory(), fetchPendingPayment()])
      
      // Auto cleanup invalid and old pending payments
      try {
        const token = localStorage.getItem('smart-child-token')
        
        // Cleanup invalid payments
        await fetch('http://127.0.0.1:8000/api/packages/cleanup-invalid-payments', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        // Force cleanup old pending payments (older than 5 minutes)
        await fetch('http://127.0.0.1:8000/api/packages/force-cleanup-pending', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        // Refresh payment history after cleanup
        fetchPaymentHistory()
      } catch (error) {
        console.log('Auto cleanup failed:', error)
      }
      
      setLoading(false)
    }
    loadData()
  }, [])
  
  // --- Helper Functions ---
  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  const parseAIFeatures = (features: string) => { try { return JSON.parse(features) } catch { return [] } }
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Package className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Quản lý Gói Dịch Vụ 📦</h1>
            <p className="text-blue-100">Mua và quản lý các gói dịch vụ của bạn.</p>
          </div>
        </div>
      </div>

      {/* Pending Payment */}
      {pendingPayment && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-orange-800">Giao dịch đang chờ thanh toán</h3>
                <p className="text-orange-600 text-sm">Bạn có một giao dịch chưa hoàn tất</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-orange-800">{formatPrice(pendingPayment.amount)}</div>
              <div className="text-orange-600 text-sm">{pendingPayment.package.name}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3">
              <div className="text-sm text-gray-500">Mã giao dịch</div>
              <div className="font-mono text-sm">{pendingPayment.transaction_id}</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-sm text-gray-500">Ngày tạo</div>
              <div className="text-sm">{formatDate(pendingPayment.transaction_date)}</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="text-sm text-gray-500">Trạng thái</div>
              <div className="text-sm text-orange-600 font-medium">Đang chờ thanh toán</div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => retryPayment(pendingPayment.id)}
              className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Thanh toán lại</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn hủy giao dịch này?')) {
                  cancelPendingPayments()
                }
              }}
              className="px-6 py-3 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-medium"
            >
              Hủy giao dịch
            </button>
          </div>
        </div>
      )}

      {/* Available Packages */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Chọn gói dịch vụ</h2>
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {packages.map((pkg) => (
              <div key={pkg.id} className="flex flex-col border-2 border-gray-200 rounded-2xl p-6 bg-white hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{pkg.description || 'Gói dịch vụ giám sát thông minh'}</p>
                  <div className="text-4xl font-extrabold text-blue-600 mb-1">{formatPrice(pkg.price)}</div>
                  <div className="text-base text-gray-600">/ {pkg.duration_days} ngày</div>
                </div>
                <div className="space-y-3 mb-8 flex-grow">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg"><Camera className="w-5 h-5 text-blue-600 mr-3" /><span>Giới hạn <strong className="text-gray-900">{pkg.camera_limit} camera</strong></span></div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg"><HardDrive className="w-5 h-5 text-green-600 mr-3" /><span>Lưu trữ dữ liệu <strong className="text-gray-900">{pkg.storage_days} ngày</strong></span></div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg"><Brain className="w-5 h-5 text-purple-600 mr-3" /><span><strong className="text-gray-900">{parseAIFeatures(pkg.ai_features).length} tính năng AI</strong></span></div>
                </div>
                <div className="mb-6">
                  <div className="flex flex-wrap justify-center gap-2">
                    {parseAIFeatures(pkg.ai_features).map((feature: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{feature}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <button onClick={() => purchasePackage(pkg.id)} disabled={purchasing === pkg.id} className="w-full mt-auto bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {purchasing === pkg.id ? (
                      <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>Đang xử lý...</span></>
                    ) : (
                      <><CreditCard className="w-5 h-5" /><span>Chọn gói này</span></>
                    )}
                  </button>
                  
                  {/* Check if there's a pending payment for this package */}
                  {paymentHistory.some(p => p.package?.id === pkg.id && p.status === 'Pending') && (
                    <button 
                      onClick={() => {
                        // Find the pending payment for this package
                        const pendingPayment = paymentHistory.find(p => p.package?.id === pkg.id && p.status === 'Pending')
                        if (pendingPayment) {
                          // Create payment data for the pending payment
                          const paymentData = {
                            payment_id: pendingPayment.id,
                            amount: pendingPayment.amount,
                            package_name: pendingPayment.package?.name || pkg.name,
                            order_id: pendingPayment.transaction_id,
                            status: 'Pending'
                          }
                          // Store payment data in sessionStorage
                          sessionStorage.setItem('current-payment', JSON.stringify(paymentData))
                          console.log('Redirecting to complete pending payment:', paymentData)
                        }
                        window.location.href = `/payment/package/${pkg.id}`
                      }}
                      className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-all flex items-center justify-center space-x-2 text-sm"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Hoàn tất giao dịch hiện tại</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-xl"><Package className="w-16 h-16 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-medium">Hiện chưa có gói dịch vụ nào</h3></div>
        )}
      </div>

      {/* Payment History */}
      {paymentHistory.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
             <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">Lịch sử thanh toán</h2>
             <div className="flex space-x-2">
               {paymentHistory.some(p => p.status === 'Pending') && (
                 <button onClick={cancelPendingPayments} disabled={cancelling} className="flex items-center justify-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors disabled:opacity-50">
                   <XCircle className="w-5 h-5" />
                   <span>Hủy giao dịch chờ</span>
                 </button>
               )}
               {paymentHistory.some(p => p.status === 'Invalid') && (
                 <button onClick={cleanupInvalidPayments} className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                   <XCircle className="w-5 h-5" />
                   <span>Dọn dẹp lỗi</span>
                 </button>
               )}
             </div>
           </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b"><th className="text-left py-3 px-2 font-semibold text-gray-600">Gói</th><th className="text-left py-3 px-2 font-semibold text-gray-600">Số tiền</th><th className="text-left py-3 px-2 font-semibold text-gray-600">Trạng thái</th><th className="text-left py-3 px-2 font-semibold text-gray-600">Ngày giao dịch</th></tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100">
                    <td className="py-3 px-2"><div className="font-medium text-gray-800">{payment.package?.name || 'N/A'}</div><div className="text-sm text-gray-500">{payment.package?.duration_days} ngày</div></td>
                    <td className="py-3 px-2 font-medium text-gray-800">{formatPrice(payment.amount)}</td>
                     <td className="py-3 px-2">
                       <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                         payment.status === 'Success' ? 'bg-green-100 text-green-800' : 
                         payment.status === 'Failed' ? 'bg-red-100 text-red-800' : 
                         payment.status === 'Invalid' ? 'bg-gray-100 text-gray-800' :
                         'bg-yellow-100 text-yellow-800'
                       }`}>
                         {payment.status === 'Success' ? 'Thành công' : 
                          payment.status === 'Failed' ? 'Thất bại' : 
                          payment.status === 'Invalid' ? 'Lỗi' :
                          'Đang chờ'}
                       </span>
                     </td>
                    <td className="py-3 px-2 text-sm text-gray-600">{formatDate(payment.transaction_date)}</td>
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

export default ParentPackageManagement