import React, { useState } from 'react'
import { AlertTriangle, Clock, MapPin, Camera, Filter, CheckCircle, X, Search } from 'lucide-react'

const ParentAlertsCenter: React.FC = () => {
  const [filterType, setFilterType] = useState('all')
  const [filterDate, setFilterDate] = useState('today')

  const alerts = [
    {
      id: 2,
      type: 'Ra khỏi vùng an toàn',
      severity: 'Trung bình',
      time: '9:45',
      date: '2024-01-15',
      location: 'Hành lang',
      description: 'Bé đã di chuyển ra ngoài khu vực được phép trong giờ học',
      status: 'confirmed',
      hasMedia: false,
      confirmed: true
    },
    {
      id: 3,
      type: 'Nguy cơ va chạm',
      severity: 'Cao',
      time: '9:15',
      date: '2024-01-15',
      location: 'Phòng học A',
      description: 'Phát hiện nguy cơ va chạm với bạn khác trong lớp học',
      status: 'resolved',
      hasMedia: true,
      confirmed: false
    },
    
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Cao': return 'bg-red-100 text-red-700 border-red-200'
      case 'Trung bình': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Thấp': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý'
      case 'confirmed': return 'Đã xác nhận'
      case 'resolved': return 'Đã giải quyết'
      default: return status
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">🚨 Trung tâm cảnh báo</h1>
        <p className="text-orange-100">Theo dõi và quản lý các cảnh báo an toàn của con em</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-700">3</div>
            <div className="text-sm text-red-600">Mức độ cao</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-700">5</div>
            <div className="text-sm text-yellow-600">Mức độ trung bình</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">2</div>
            <div className="text-sm text-gray-600">Mức độ thấp</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">8</div>
            <div className="text-sm text-green-600">Đã xử lý hôm nay</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">🔍 Bộ lọc</h3>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại cảnh báo</label>
            <select
              className="input-field"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              title="Chọn loại cảnh báo để lọc"
            >
              <option value="all">Tất cả loại</option>
              <option value="climbing">Leo trèo</option>
              <option value="out-of-zone">Ra khỏi vùng an toàn</option>
              <option value="collision">Nguy cơ va chạm</option>
              <option value="wandering">Lang thang</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng thời gian</label>
            <select
              className="input-field"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              title="Chọn khoảng thời gian để lọc"
            >
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="all">Tất cả</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ</label>
            <select className="input-field" title="Chọn mức độ nghiêm trọng">
              <option value="all">Tất cả mức độ</option>
              <option value="high">Cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select className="input-field" title="Chọn trạng thái xử lý">
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="resolved">Đã giải quyết</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="card hover:shadow-xl transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <AlertTriangle className={`w-5 h-5 ${alert.severity === 'Cao' ? 'text-red-500' :
                      alert.severity === 'Trung bình' ? 'text-yellow-500' :
                        'text-gray-500'
                    }`} />
                  <h4 className="text-lg font-bold text-gray-900">{alert.type}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(alert.status)}`}>
                    {getStatusText(alert.status)}
                  </span>
                </div>

                <p className="text-gray-600 mb-3 leading-relaxed">{alert.description}</p>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{alert.time} - {new Date(alert.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{alert.location}</span>
                  </div>
                  {alert.hasMedia && (
                    <div className="flex items-center space-x-2">
                      <Camera className="w-4 h-4" />
                      <span>Có hình ảnh</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {alert.hasMedia && (
                  <button className="btn-secondary flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Xem hình ảnh</span>
                  </button>
                )}
                <button className="btn-primary">
                  Xem chi tiết
                </button>
              </div>
            </div>

            {alert.status === 'pending' && (
              <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700">Xác nhận cảnh báo và thêm ghi chú:</p>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      <span>Xác nhận đúng</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                      <X className="w-4 h-4" />
                      <span>Cảnh báo sai</span>
                    </button>
                  </div>
                </div>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Thêm ghi chú về cảnh báo này..."
                  rows={2}
                  title="Thêm ghi chú về cảnh báo"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors group">
            <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-blue-700">Đánh dấu tất cả đã xem</span>
          </button>

          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors group">
            <Search className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-purple-700">Tìm kiếm nâng cao</span>
          </button>

          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors group">
            <Filter className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-green-700">Xuất báo cáo</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ParentAlertsCenter
