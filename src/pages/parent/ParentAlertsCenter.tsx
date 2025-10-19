import React, { useState, useEffect } from 'react'
import { AlertTriangle, Clock, MapPin, Camera, Filter, CheckCircle, X, Search, Loader2, Download } from 'lucide-react'
import { parentApiService, Alert } from '../../services/parentApiService'
import { authService } from '../../services/authService'

const ParentAlertsCenter: React.FC = () => {
  const [filterType, setFilterType] = useState('all')
  const [filterDate, setFilterDate] = useState('today')
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [acknowledging, setAcknowledging] = useState<number | null>(null)
  const [exporting, setExporting] = useState(false)

  // Load alerts data
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true)
        const data = await parentApiService.getAlerts()
        setAlerts(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
        console.error('Error loading alerts:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAlerts()
  }, [])

  // Handle acknowledge alert
  const handleAcknowledgeAlert = async (alertId: number) => {
    try {
      setAcknowledging(alertId)
      await parentApiService.acknowledgeAlert(alertId)
      // Update local state
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ))
    } catch (err) {
      console.error('Error acknowledging alert:', err)
      showError('Có lỗi khi xác nhận cảnh báo')
    } finally {
      setAcknowledging(null)
    }
  }

  // Export alerts to CSV
  const exportAlertsToCSV = async () => {
    try {
      setExporting(true)
      const csvContent = generateCSV(alerts)
      downloadCSV(csvContent, 'alerts-export.csv')
    } catch (err) {
      console.error('Error exporting alerts:', err)
    } finally {
      setExporting(false)
    }
  }

  // Generate CSV content
  const generateCSV = (alerts: Alert[]): string => {
    const headers = ['ID', 'Loại cảnh báo', 'Mức độ', 'Trạng thái', 'Thời gian tạo', 'Camera ID', 'Vùng nguy hiểm']
    const rows = alerts.map(alert => [
      alert.id,
      alert.alert_type,
      getSeverityText(alert.severity),
      alert.acknowledged ? 'Đã xử lý' : 'Chờ xử lý',
      new Date(alert.created_at).toLocaleString('vi-VN'),
      alert.camera_id || 'N/A',
      alert.danger_zone_id || 'N/A'
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  // Download CSV file
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Helper functions
  const getSeverityText = (severity: number): string => {
    if (severity >= 3) return 'Cao'
    if (severity >= 2) return 'Trung bình'
    return 'Thấp'
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 3) return 'bg-red-100 text-red-700 border-red-200'
    if (severity >= 2) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }

  const getStatusColor = (acknowledged: boolean) => {
    return acknowledged ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'
  }

  const getStatusText = (acknowledged: boolean) => {
    return acknowledged ? 'Đã xử lý' : 'Chờ xử lý'
  }

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  // Calculate stats
  const stats = {
    high: alerts.filter(alert => alert.severity >= 3).length,
    medium: alerts.filter(alert => alert.severity === 2).length,
    low: alerts.filter(alert => alert.severity === 1).length,
    resolved: alerts.filter(alert => alert.acknowledged).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải cảnh báo...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
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
            <div className="text-2xl font-bold text-red-700">{stats.high}</div>
            <div className="text-sm text-red-600">Mức độ cao</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-700">{stats.medium}</div>
            <div className="text-sm text-yellow-600">Mức độ trung bình</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{stats.low}</div>
            <div className="text-sm text-gray-600">Mức độ thấp</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">{stats.resolved}</div>
            <div className="text-sm text-green-600">Đã xử lý</div>
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
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className="card hover:shadow-xl transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertTriangle className={`w-5 h-5 ${alert.severity >= 3 ? 'text-red-500' :
                        alert.severity >= 2 ? 'text-yellow-500' :
                          'text-gray-500'
                      }`} />
                    <h4 className="text-lg font-bold text-gray-900">{alert.alert_type}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                      {getSeverityText(alert.severity)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(alert.acknowledged)}`}>
                      {getStatusText(alert.acknowledged)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3 leading-relaxed">
                    Cảnh báo từ hệ thống AI giám sát
                  </p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(alert.created_at)} - {formatDate(alert.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Camera ID: {alert.camera_id || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button className="btn-primary">
                    Xem chi tiết
                  </button>
                </div>
              </div>

              {!alert.acknowledged && (
                <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-gray-700">Xác nhận cảnh báo:</p>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        disabled={acknowledging === alert.id}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                      >
                        {acknowledging === alert.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        <span>Xác nhận đã xử lý</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có cảnh báo nào</h3>
            <p className="text-gray-500">Tất cả đều an toàn! 🎉</p>
          </div>
        )}
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

          <button 
            onClick={exportAlertsToCSV}
            disabled={exporting || alerts.length === 0}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <Loader2 className="w-8 h-8 text-green-600 mx-auto mb-2 animate-spin" />
            ) : (
              <Download className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-sm font-medium text-green-700">Xuất báo cáo</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ParentAlertsCenter
