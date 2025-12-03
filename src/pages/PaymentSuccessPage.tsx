import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, Package, Calendar, CreditCard, Home } from 'lucide-react'
import { showSuccess, showError } from '../utils/swal'

const PaymentSuccessPage: React.FC = () => {
  const { paymentId } = useParams<{ paymentId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [paymentInfo, setPaymentInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Đọc status và orderCode từ URL params (PayOS redirect về)
  const urlStatus = searchParams.get('status') // PAID, CANCELLED, etc.
  const orderCode = searchParams.get('orderCode')
  const payosCode = searchParams.get('code') // PayOS response code

  // Check payment status by orderCode nếu có từ PayOS
  const checkPaymentByOrderCode = async (orderCode: string) => {
    try {
      const token = localStorage.getItem('smart-child-token')
      const response = await fetch(`http://127.0.0.1:8000/api/paypos/status/${orderCode}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.payment) {
          // Update paymentInfo với thông tin mới nhất
          setPaymentInfo({
            ...data.payment,
            status: data.payment.status === 'Success' ? 'Success' : 
                    data.payment.status === 'Failed' ? 'Failed' : 'Pending'
          })
          return data.payment
        }
      }
    } catch (error) {
      console.error('Error checking payment by orderCode:', error)
    }
    return null
  }

  // Fetch payment status
  const fetchPaymentStatus = async () => {
    try {
      const token = localStorage.getItem('smart-child-token')
      
      // Nếu có orderCode từ URL (PayOS redirect), check bằng orderCode trước
      let payment = null
      if (orderCode) {
        payment = await checkPaymentByOrderCode(orderCode)
      }
      
      // Nếu không tìm thấy hoặc không có orderCode, fetch bằng paymentId
      if (!payment && paymentId) {
        const response = await fetch(`http://127.0.0.1:8000/api/payments/${paymentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          payment = await response.json()
        }
      }
      
      if (payment && typeof payment === 'object') {
        const paymentData: any = payment
        
        // Nếu URL có status=PAID nhưng DB chưa update, hiển thị success tạm thời
        if (urlStatus === 'PAID' && payosCode === '00' && paymentData.status !== 'Success') {
          // PayOS đã confirm thanh toán thành công, nhưng webhook chưa chạy
          // Cập nhật status tạm thời để hiển thị success ngay
          const updatedPayment = { ...paymentData, status: 'Success' }
          setPaymentInfo(updatedPayment)
          // Trigger refresh để check lại sau 2 giây
          setTimeout(() => {
            fetchPaymentStatus()
          }, 2000)
          return
        }
        
        setPaymentInfo(paymentData)
        
        if (paymentData.status === 'Success') {
          showSuccess('Thanh toán thành công! Gói dịch vụ đã được kích hoạt.')
        } else if (paymentData.status === 'Failed') {
          showError('Thanh toán thất bại. Vui lòng thử lại.')
        } else if (urlStatus === 'PAID' && payosCode === '00') {
          // URL confirm success nhưng DB chưa update - đang chờ webhook
          console.log('Payment confirmed by PayOS, waiting for webhook update...')
        }
      } else {
        showError('Không thể tải thông tin thanh toán')
      }
    } catch (error) {
      console.error('Error fetching payment status:', error)
      showError('Lỗi kết nối')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!paymentId && !orderCode) {
      navigate('/')
      return
    }
    
    fetchPaymentStatus()
  }, [paymentId, orderCode, urlStatus, payosCode])
  
  // Auto-refresh nếu payment đang pending hoặc URL confirm success nhưng DB chưa update
  useEffect(() => {
    if (!paymentInfo || paymentInfo.status === 'Pending' || (urlStatus === 'PAID' && payosCode === '00' && paymentInfo.status !== 'Success')) {
      const interval = setInterval(() => {
        fetchPaymentStatus()
      }, 3000) // Refresh mỗi 3 giây
      
      return () => clearInterval(interval)
    }
  }, [paymentInfo, urlStatus, payosCode])

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra trạng thái thanh toán...</p>
        </div>
      </div>
    )
  }

  if (!paymentInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy giao dịch</h2>
          <p className="text-gray-600 mb-4">Giao dịch thanh toán không tồn tại.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    )
  }

  const isSuccess = paymentInfo.status === 'Success'
  const isFailed = paymentInfo.status === 'Failed'
  const isPending = paymentInfo.status === 'Pending'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isSuccess ? 'bg-green-100' : isFailed ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            {isSuccess ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : isFailed ? (
              <CreditCard className="w-10 h-10 text-red-600" />
            ) : (
              <Calendar className="w-10 h-10 text-yellow-600" />
            )}
          </div>
          
          <h1 className={`text-3xl font-bold mb-2 ${
            isSuccess ? 'text-green-600' : isFailed ? 'text-red-600' : 'text-yellow-600'
          }`}>
            {isSuccess ? '🎉 Thanh toán thành công!' : 
             isFailed ? '❌ Thanh toán thất bại' : 
             '⏳ Đang xử lý thanh toán'}
          </h1>
          
          <p className="text-gray-600">
            {isSuccess ? 'Gói dịch vụ của bạn đã được kích hoạt thành công' :
             isFailed ? 'Có lỗi xảy ra trong quá trình thanh toán' :
             'Thanh toán đang được xử lý, vui lòng chờ...'}
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Chi tiết giao dịch</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Mã giao dịch:</span>
              <span className="font-medium text-gray-900">{paymentInfo.transaction_id}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Số tiền:</span>
              <span className="font-bold text-green-600">{formatPrice(paymentInfo.amount)}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Phương thức:</span>
              <span className="font-medium text-gray-900">{paymentInfo.method}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Trạng thái:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isSuccess ? 'bg-green-100 text-green-700' :
                isFailed ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {isSuccess ? 'Thành công' : isFailed ? 'Thất bại' : 'Đang xử lý'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Thời gian:</span>
              <span className="font-medium text-gray-900">{formatDate(paymentInfo.created_at)}</span>
            </div>
            
            {paymentInfo.expiry_date && (
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Hết hạn:</span>
                <span className="font-medium text-gray-900">{formatDate(paymentInfo.expiry_date)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isFailed && (
            <button
              onClick={() => navigate('/packages')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Package className="w-5 h-5" />
              <span>Thử lại thanh toán</span>
            </button>
          )}
          
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Về trang chủ</span>
          </button>
        </div>

        {/* Auto refresh for pending payments */}
        {isPending && (
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Trang sẽ tự động cập nhật trạng thái...</p>
            <div className="animate-pulse">
              <div className="w-4 h-4 bg-blue-600 rounded-full mx-auto"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentSuccessPage
