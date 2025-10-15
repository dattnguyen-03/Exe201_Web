import React from 'react'
import { useNavigate } from 'react-router-dom'
import { XCircle, Package, Home, RefreshCw } from 'lucide-react'
import { showWarning } from '../utils/swal'

const PaymentCancelPage: React.FC = () => {
  const navigate = useNavigate()

  React.useEffect(() => {
    showWarning('Bạn đã hủy thanh toán')
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-orange-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-orange-600 mb-2">
            ⚠️ Thanh toán đã bị hủy
          </h1>
          
          <p className="text-gray-600">
            Bạn đã hủy quá trình thanh toán. Gói dịch vụ chưa được kích hoạt.
          </p>
        </div>

        {/* Information Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Gói dịch vụ chưa được kích hoạt</h3>
                <p className="text-sm text-gray-600">Bạn có thể thử thanh toán lại bất kỳ lúc nào</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                <RefreshCw className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Thanh toán an toàn</h3>
                <p className="text-sm text-gray-600">Không có khoản phí nào được tính khi hủy thanh toán</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/packages')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Package className="w-5 h-5" />
            <span>Chọn gói khác</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Về trang chủ</span>
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-medium text-blue-900 mb-3">Cần hỗ trợ?</h3>
          <p className="text-sm text-blue-700 mb-4">
            Nếu bạn gặp vấn đề trong quá trình thanh toán, vui lòng liên hệ với chúng tôi.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              📧 support@example.com
            </a>
            <span className="hidden sm:inline text-blue-300">•</span>
            <a
              href="tel:+84123456789"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              📞 +84 123 456 789
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancelPage
