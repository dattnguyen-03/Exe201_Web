import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Check, Star, CreditCard, Calendar, Camera, HardDrive, Brain } from 'lucide-react'
import { showSuccess, showError } from '../utils/swal'

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

const PackageSelectionPage: React.FC = () => {
  const navigate = useNavigate()
  const [packages, setPackages] = useState<PackageData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null)

  // Fetch packages
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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  // Handle package selection
  const handleSelectPackage = (pkg: PackageData) => {
    setSelectedPackage(pkg)
  }

  // Handle purchase
  const handlePurchase = () => {
    if (selectedPackage) {
      navigate(`/payment/package/${selectedPackage.id}`)
    }
  }

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

  // Get package type color
  const getPackageTypeColor = (index: number) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600', 
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600'
    ]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải gói dịch vụ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">📦 Chọn gói dịch vụ</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chọn gói dịch vụ phù hợp với nhu cầu của bạn. Tất cả gói đều bao gồm tính năng AI tiên tiến.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer ${
                selectedPackage?.id === pkg.id
                  ? 'border-blue-500 shadow-xl scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
              }`}
              onClick={() => handleSelectPackage(pkg)}
            >
              {/* Popular Badge */}
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Phổ biến</span>
                  </div>
                </div>
              )}

              {/* Package Header */}
              <div className={`bg-gradient-to-r ${getPackageTypeColor(index)} text-white p-6 rounded-t-2xl`}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold mb-2">{formatPrice(pkg.price)}</div>
                  <div className="text-white/80">/ {pkg.duration_days} ngày</div>
                </div>
              </div>

              {/* Package Content */}
              <div className="p-6">
                {pkg.description && (
                  <p className="text-gray-600 mb-6 text-center">{pkg.description}</p>
                )}

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Thời hạn</div>
                      <div className="text-sm text-gray-600">{pkg.duration_days} ngày</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Camera className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Camera</div>
                      <div className="text-sm text-gray-600">{pkg.camera_limit} camera</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <HardDrive className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Lưu trữ</div>
                      <div className="text-sm text-gray-600">{pkg.storage_days} ngày</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Tính năng AI</div>
                      <div className="text-sm text-gray-600">
                        {parseAIFeatures(pkg.ai_features).length} tính năng
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Features */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Tính năng AI:</h4>
                  <div className="space-y-2">
                    {parseAIFeatures(pkg.ai_features).map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select Button */}
                <button
                  className={`w-full py-3 rounded-xl font-medium transition-colors ${
                    selectedPackage?.id === pkg.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedPackage?.id === pkg.id ? 'Đã chọn' : 'Chọn gói này'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Purchase Section */}
        {selectedPackage && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Bạn đã chọn: {selectedPackage.name}
                </h3>
                <p className="text-gray-600">
                  Tổng thanh toán: <span className="font-bold text-green-600">
                    {formatPrice(selectedPackage.price)}
                  </span>
                </p>
              </div>
              <button
                onClick={handlePurchase}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 shadow-lg"
              >
                <CreditCard className="w-5 h-5" />
                <span>Thanh toán ngay</span>
              </button>
            </div>
          </div>
        )}

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            So sánh các gói dịch vụ
          </h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Tính năng</th>
                    {packages.map((pkg) => (
                      <th key={pkg.id} className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                        {pkg.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Giá</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {formatPrice(pkg.price)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Thời hạn</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {pkg.duration_days} ngày
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Camera</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {pkg.camera_limit}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Lưu trữ</td>
                    {packages.map((pkg) => (
                      <td key={pkg.id} className="px-6 py-4 text-center text-sm text-gray-600">
                        {pkg.storage_days} ngày
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackageSelectionPage
