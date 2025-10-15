import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CreditCard, CheckCircle, XCircle, Clock, Package, User, Calendar, AlertCircle } from 'lucide-react'
import { showSuccess, showError, showWarning } from '../utils/swal'

interface PaymentData {
  payment_id: number
  amount: number
  package_name: string
  order_id: string
  status: string
}

const PaymentDemoPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [countdown, setCountdown] = useState(10)

  // Simulate payment processing
  const simulatePayment = async () => {
    setProcessing(true)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate success (90% success rate)
    const isSuccess = Math.random() > 0.1
    
    if (isSuccess) {
      showSuccess('Thanh toán thành công! Gói dịch vụ đã được kích hoạt.')
      navigate('/')
    } else {
      showError('Thanh toán thất bại. Vui lòng thử lại.')
      setProcessing(false)
    }
  }

  // Auto redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      simulatePayment()
    }
  }, [countdown])

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💳 Demo Thanh toán</h1>
          <p className="text-gray-600">Trang demo thanh toán (PayOS không khả dụng)</p>
        </div>

        {/* Demo Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900 mb-2">Chế độ Demo</h3>
              <p className="text-sm text-yellow-700 mb-3">
                PayOS API hiện không khả dụng. Đây là trang demo để mô phỏng quá trình thanh toán.
              </p>
              <div className="text-sm text-yellow-700">
                <p><strong>Order ID:</strong> {orderId}</p>
                <p><strong>Trạng thái:</strong> Đang chờ xử lý</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="card mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Thông tin thanh toán</h2>
              <p className="text-gray-600">Chi tiết giao dịch demo</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Gói dịch vụ</span>
                </div>
                <div className="text-lg font-bold text-gray-900">Gói Dịch Vụ Trẻ Em</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-gray-700">Số tiền</span>
                </div>
                <div className="text-lg font-bold text-gray-900">{formatPrice(3000)}</div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-gray-700">Thời hạn</span>
              </div>
              <div className="text-lg font-bold text-gray-900">30 ngày</div>
            </div>
          </div>
        </div>

        {/* Payment Actions */}
        <div className="card">
          <div className="text-center">
            {processing ? (
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <h3 className="text-lg font-medium text-gray-900">Đang xử lý thanh toán...</h3>
                <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
              </div>
            ) : countdown > 0 ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-green-600">{countdown}</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Tự động xử lý thanh toán</h3>
                <p className="text-gray-600">Sẽ tự động xử lý sau {countdown} giây</p>
                <button
                  onClick={() => setCountdown(0)}
                  className="btn-primary"
                >
                  Xử lý ngay
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                <h3 className="text-lg font-medium text-gray-900">Thanh toán hoàn tất</h3>
                <p className="text-gray-600">Gói dịch vụ đã được kích hoạt thành công</p>
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary"
                >
                  Về trang chủ
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/packages')}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Quay lại chọn gói
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentDemoPage
