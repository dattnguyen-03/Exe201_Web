import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CreditCard, CheckCircle, XCircle, Clock, Package, User, Calendar } from 'lucide-react'
import { showSuccess, showError, showWarning } from '../utils/swal'
import PaymentStatusChecker from '../components/PaymentStatusChecker'
// import { usePayOS, PayOSConfig } from '@payos/payos-checkout' // Not needed for direct redirect

interface PackageData {
  id: number
  name: string
  price: number
  duration_days: number
  camera_limit: number
  ai_features: string
  storage_days: number
  description?: string
}

interface PaymentData {
  payment_id: number
  amount: number
  method: string
  package_name: string
  redirect_url?: string
  payment_url?: string
  qr_code?: string
  qr_data?: any
  order_id: string
  status: string
  demo?: boolean
  message?: string
  paypos_data?: {
    order_id: string
    amount: number
    description: string
    return_url: string
    cancel_url: string
  }
}

const PaymentPage: React.FC = () => {
  const { packageId, paymentId } = useParams<{ packageId?: string; paymentId?: string }>()
  const navigate = useNavigate()
  const [packageData, setPackageData] = useState<PackageData | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [retryCountdown, setRetryCountdown] = useState(0)
  const [paymentStatus, setPaymentStatus] = useState<string>('Pending')
  // const [payOSConfig, setPayOSConfig] = useState<PayOSConfig | null>(null) // Not needed for direct redirect

  // Fetch package details
  const fetchPackageDetails = async () => {
    try {
      const response = await fetch(`https://safenestai.onrender.com/api/packages/`)
      if (response.ok) {
        const packages = await response.json()
        const packageIdNum = parseInt(packageId || '0')
        const pkg = packages.find((p: PackageData) => p.id === packageIdNum)
        
        if (pkg) {
          setPackageData(pkg)
        } else {
          showError('Không tìm thấy gói dịch vụ')
          navigate('/packages')
        }
      } else {
        showError('Không thể tải thông tin gói dịch vụ')
        navigate('/packages')
      }
    } catch (error) {
      showError('Lỗi kết nối')
      navigate('/packages')
    } finally {
      setLoading(false)
    }
  }

  // Fetch payment details (for existing payments)
  const fetchPaymentDetails = async () => {
    try {
      const token = localStorage.getItem('smart-child-token')
      const response = await fetch(`https://safenestai.onrender.com/api/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        // Set package data from payment response
        setPackageData({
          id: data.package_id || 0,
          name: data.package_name || 'Unknown Package',
          price: data.amount || 0,
          duration_days: 0, // Will be filled from package details
          camera_limit: 0,
          ai_features: '[]',
          storage_days: 0,
          description: ''
        })
        
        // Set payment data
        setPaymentData({
          payment_id: data.id,
          amount: data.amount,
          method: data.method,
          package_name: data.package_name,
          order_id: data.transaction_id || '',
          status: data.status
        })
      } else {
        // If payment not found or no auth, redirect to packages page
        console.log('Payment not found or no auth, redirecting to packages')
        navigate('/packages')
      }
    } catch (error) {
      console.log('Error fetching payment details:', error)
      // If error, redirect to packages page
      navigate('/packages')
    } finally {
      setLoading(false)
    }
  }

  // Create PayPOS payment link
  const createPayPOSPayment = async () => {
    try {
      setProcessing(true)
      const token = localStorage.getItem('smart-child-token')
      
      // If we already have a payment from the purchase flow, use it
      if (paymentData?.payment_id) {
        console.log('Using existing payment:', paymentData.payment_id)
        
        // If we already have a payment_url from the purchase flow, use it directly
        if (paymentData.payment_url) {
          console.log('Using existing payment URL:', paymentData.payment_url)
          redirectToPayPOS({
            payment_id: paymentData.payment_id,
            amount: paymentData.amount,
            package_name: paymentData.package_name,
            order_id: paymentData.order_id,
            payment_url: paymentData.payment_url,
            demo: paymentData.demo || false
          })
          return
        }
        
        // If no payment_url, create PayOS order for existing payment
        // PayOS requires description to be max 25 characters
        const shortDescription = `Goi ${paymentData.package_name}`.substring(0, 25)
        
        const orderData = {
          order_id: paymentData.order_id,
          amount: paymentData.amount,
          description: shortDescription,
          package_name: paymentData.package_name,
          return_url: `${window.location.origin}/payment/success/${paymentData.payment_id}`,
          cancel_url: `${window.location.origin}/payment/cancel`
        }
        
        console.log('Creating PayOS order for existing payment:', orderData)
        const payosResponse = await fetch('https://safenestai.onrender.com/api/paypos/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        })
        
        if (payosResponse.ok) {
          const payosData = await payosResponse.json()
          console.log('PayOS order created:', payosData)
          redirectToPayPOS({
            payment_id: paymentData.payment_id,
            amount: paymentData.amount,
            package_name: paymentData.package_name,
            order_id: paymentData.order_id,
            payment_url: payosData.payment_url,
            demo: false
          })
        } else {
          // PayOS failed, show error
          const errorData = await payosResponse.json()
          showError(`Không thể tạo liên kết thanh toán PayOS: ${errorData.error || 'Lỗi không xác định'}`)
          return
        }
        return
      }
      
      // Check if there's already a pending payment for this package
      console.log('Checking for existing pending payments for package:', packageData?.id)
      const checkResponse = await fetch(`https://safenestai.onrender.com/api/payments/user/2`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (checkResponse.ok) {
        const payments = await checkResponse.json()
        const pendingPayment = payments.find((p: any) => 
          p.package?.id === packageData?.id && p.status === 'Pending'
        )
        
        if (pendingPayment) {
          console.log('Found existing pending payment:', pendingPayment)
          // Use existing payment instead of creating new one
          const paymentData = {
            payment_id: pendingPayment.id,
            amount: pendingPayment.amount,
            package_name: pendingPayment.package?.name || packageData?.name,
            order_id: pendingPayment.transaction_id,
            status: 'Pending',
            method: 'PayPOS'
          }
          sessionStorage.setItem('current-payment', JSON.stringify(paymentData))
          setPaymentData(paymentData)
          
          // Create PayOS order for existing payment
          // PayOS requires description to be max 25 characters
          const packageName = pendingPayment.package?.name || packageData?.name
          const shortDescription = `Goi ${packageName}`.substring(0, 25)
          
          const orderData = {
            order_id: pendingPayment.transaction_id,
            amount: pendingPayment.amount,
            description: shortDescription,
            package_name: packageName,
            return_url: `${window.location.origin}/payment/success/${pendingPayment.id}`,
            cancel_url: `${window.location.origin}/payment/cancel`
          }
          
          console.log('Creating PayOS order for existing payment:', orderData)
          const payosResponse = await fetch('https://safenestai.onrender.com/api/paypos/create-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
          })
          
          if (payosResponse.ok) {
            const payosData = await payosResponse.json()
            console.log('PayOS order created:', payosData)
            redirectToPayPOS({
              payment_id: pendingPayment.id,
              amount: pendingPayment.amount,
              package_name: pendingPayment.package?.name || packageData?.name,
              order_id: pendingPayment.transaction_id,
              payment_url: payosData.payment_url,
              demo: false
            })
          } else {
            // PayOS failed, show error
            const errorData = await payosResponse.json()
            showError(`Không thể tạo liên kết thanh toán PayOS: ${errorData.error || 'Lỗi không xác định'}`)
            return
          }
          return
        }
      }
      
      // No existing payment found, create new one
      const formData = new URLSearchParams()
      formData.append('package_id', packageData?.id.toString() || '')

      console.log('Creating new payment for package:', packageData?.id)
      console.log('Request URL:', '/api/paypos/create')
      console.log('Request body:', formData.toString())

      const response = await fetch('https://safenestai.onrender.com/api/paypos/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (response.ok) {
        const data = await response.json()
        console.log('Payment created successfully:', data)
        setPaymentData(prev => ({ ...prev, ...data }))
        // Redirect to PayPOS
        redirectToPayPOS(data)
      } else {
        const errorText = await response.text()
        console.error('Payment creation failed:', errorText)
        try {
          const error = JSON.parse(errorText)
          
          // Check if it's a pending payment error
          if (error.detail && error.detail.includes('đang chờ thanh toán')) {
            showWarning('Bạn đã có giao dịch đang chờ thanh toán. Vui lòng hoàn tất hoặc hủy giao dịch đó trước khi tạo giao dịch mới.')
            
            // Extract payment ID from error message
            const paymentIdMatch = error.detail.match(/ID: (\d+)/)
            if (paymentIdMatch) {
              const pendingPaymentId = paymentIdMatch[1]
              // Show option to cancel pending payment
              setTimeout(() => {
                if (confirm('Bạn có muốn hủy giao dịch đang chờ và tạo giao dịch mới không?')) {
                  cancelPendingPayment(pendingPaymentId)
                }
              }, 2000)
            }
            
          } else if (error.detail && error.detail.includes('already being processed')) {
            showWarning('Đã có giao dịch đang chờ xử lý cho gói này. Vui lòng hoàn tất giao dịch hiện tại hoặc chờ 30 giây để tạo giao dịch mới.')
            
            // Start countdown
            setRetryCountdown(30)
            const countdownInterval = setInterval(() => {
              setRetryCountdown(prev => {
                if (prev <= 1) {
                  clearInterval(countdownInterval)
                  showSuccess('Bạn có thể tạo giao dịch mới ngay bây giờ!')
                  return 0
                }
                return prev - 1
              })
            }, 1000)
            
            // Auto retry after 30 seconds
            setTimeout(() => {
              clearInterval(countdownInterval)
              setRetryCountdown(0)
              createPayPOSPayment()
            }, 30000)
            
          } else {
            showError(error.detail || 'Không thể tạo giao dịch thanh toán')
          }
        } catch {
          showError('Không thể tạo giao dịch thanh toán')
        }
      }
    } catch (error) {
      console.error('Network error:', error)
      showError('Lỗi kết nối')
    } finally {
      setProcessing(false)
    }
  }

  // PayOS SDK not needed for direct redirect approach

  // Redirect to PayPOS
  const redirectToPayPOS = (payposData: any) => {
    console.log('PayPOS Data received:', payposData)
    
    if (payposData.payment_url) {
      // Always redirect to PayOS URL directly
      console.log('Redirecting to PayOS URL:', payposData.payment_url)
      showSuccess('Đang chuyển hướng đến PayOS...')
      setTimeout(() => {
        window.location.href = payposData.payment_url
      }, 1000)
    } else {
      showError('Không thể tạo liên kết thanh toán PayPOS')
    }
  }

  // Cancel pending payment
  const cancelPendingPayment = async (paymentId: string) => {
    try {
      setProcessing(true)
      const token = localStorage.getItem('smart-child-token')
      
      const response = await fetch(`/api/paypos/cancel/${paymentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        showSuccess(result.message || 'Đã hủy giao dịch thành công')
        // Retry creating new payment
        setTimeout(() => {
          createPayPOSPayment()
        }, 1000)
      } else {
        const error = await response.json()
        showError(error.detail || 'Không thể hủy giao dịch')
      }
    } catch (error) {
      console.error('Error cancelling payment:', error)
      showError('Lỗi khi hủy giao dịch')
    } finally {
      setProcessing(false)
    }
  }

  // Simulate payment success (for demo)
  const simulatePaymentSuccess = () => {
    showSuccess('Thanh toán thành công! Gói dịch vụ đã được kích hoạt.')
    navigate('/')
  }

  useEffect(() => {
    if (packageId) {
      // Check if we have payment data from the purchase flow
      const storedPayment = sessionStorage.getItem('current-payment')
      if (storedPayment) {
        try {
          const paymentData = JSON.parse(storedPayment)
          setPaymentData(paymentData)
          // Clear the stored payment data
          sessionStorage.removeItem('current-payment')
        } catch (error) {
          console.error('Error parsing stored payment data:', error)
        }
      }
      fetchPackageDetails()
    } else if (paymentId) {
      fetchPaymentDetails()
    } else {
      navigate('/packages')
    }
  }, [packageId, paymentId])

  // Auto-redirect if we have paymentId but no packageData after loading
  useEffect(() => {
    if (!loading && paymentId && !packageData) {
      console.log('No package data found for paymentId, redirecting to packages')
      navigate('/packages')
    }
  }, [loading, paymentId, packageData, navigate])

  // Check for PayOS return parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const status = urlParams.get('status')
    const paymentId = urlParams.get('payment_id')
    
    if (status === 'success' && paymentId) {
      showSuccess('Thanh toán thành công! Gói dịch vụ đã được kích hoạt.')
      navigate(`/payment/success/${paymentId}`)
    } else if (status === 'cancel') {
      showWarning('Bạn đã hủy thanh toán')
      // Reset payment state
      setPaymentData(null)
      setProcessing(false)
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
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

  if (!packageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy gói dịch vụ</h2>
          <p className="text-gray-600 mb-4">Gói dịch vụ bạn đang tìm kiếm không tồn tại.</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* PayOS Checkout Container - Not needed for direct redirect */}
      {/* <div id="payos-checkout"></div> */}
      
      {/* Payment Status Checker - Auto check payment status */}
      {paymentData?.payment_id && (
        <PaymentStatusChecker 
          paymentId={paymentData.payment_id}
          onStatusChange={setPaymentStatus}
          autoRedirect={true}
        />
      )}
      
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💳 Thanh toán gói dịch vụ</h1>
          <p className="text-gray-600">Hoàn tất thanh toán để kích hoạt gói dịch vụ</p>
          
          {/* Payment Status Indicator */}
          {paymentData?.payment_id && (
            <div className="mt-4">
              {paymentStatus === 'Success' && (
                <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Thanh toán thành công
                </div>
              )}
              {paymentStatus === 'Failed' && (
                <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full">
                  <XCircle className="w-4 h-4 mr-2" />
                  Thanh toán thất bại
                </div>
              )}
              {paymentStatus === 'Pending' && (
                <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
                  <Clock className="w-4 h-4 mr-2" />
                  Đang chờ thanh toán
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Package Details */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Thông tin gói dịch vụ</h2>
                <p className="text-gray-600">Chi tiết gói bạn đang mua</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{packageData.name}</h3>
                {packageData.description && (
                  <p className="text-gray-600">{packageData.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-700">Thời hạn</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{packageData.duration_days} ngày</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-700">Camera</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{packageData.camera_limit} camera</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-gray-700">Lưu trữ</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{packageData.storage_days} ngày</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-gray-700">Tính năng AI</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {parseAIFeatures(packageData.ai_features).length} tính năng
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Tính năng AI bao gồm:</h4>
                <div className="flex flex-wrap gap-2">
                  {parseAIFeatures(packageData.ai_features).map((feature: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tóm tắt thanh toán</h2>
                <p className="text-gray-600">Xác nhận thông tin thanh toán</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatPrice(packageData.price)}
                  </div>
                  <div className="text-gray-600">Tổng thanh toán</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Gói dịch vụ:</span>
                  <span className="font-medium text-gray-900">{packageData.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Thời hạn:</span>
                  <span className="font-medium text-gray-900">{packageData.duration_days} ngày</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium text-gray-900">PayPOS</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                  <span className="text-lg font-bold text-green-600">{formatPrice(packageData.price)}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Bảo mật thanh toán</h4>
                    <p className="text-sm text-blue-700">
                      Giao dịch được bảo mật bởi PayPOS. Thông tin thanh toán của bạn được mã hóa và bảo vệ.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={createPayPOSPayment}
                  disabled={processing || retryCountdown > 0}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : retryCountdown > 0 ? (
                    <>
                      <Clock className="w-5 h-5" />
                      <span>Thử lại sau {retryCountdown}s</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Thanh toán với PayOS</span>
                    </>
                  )}
                </button>
                
                {retryCountdown > 0 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Đã có giao dịch đang chờ xử lý. Hệ thống sẽ tự động thử lại sau {retryCountdown} giây.
                    </p>
                    <button
                      onClick={() => {
                        setRetryCountdown(0)
                        createPayPOSPayment()
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Thử lại ngay
                    </button>
                  </div>
                )}
              </div>

              <div className="text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Hủy và quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
