import React, { useState, useEffect } from 'react'
import { MessageSquare, Send, Phone, Mail, Bell, Clock, User, AlertTriangle, Download, Loader2 } from 'lucide-react'
import { parentApiService, Alert } from '../../services/parentApiService'

const ParentNotifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState('messages')
  const [newMessage, setNewMessage] = useState('')
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  const getSeverityColor = (severity: number): string => {
    if (severity >= 3) return 'bg-red-100 text-red-700'
    if (severity >= 2) return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-700'
  }

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  const messages = [
    {
      id: 1,
      from: 'Cô Nguyễn Thị Lan',
      subject: 'Báo cáo tiến bộ của bé An',
      message: 'Hôm nay bé An có một ngày học rất tuyệt vời! Bé tham gia tích cực vào giờ đọc sách và có tiến bộ đáng kể trong giao tiếp với bạn bè.',
      timestamp: '2 giờ trước',
      read: false,
      type: 'message'
    },
    {
      id: 2,
      from: 'Hệ thống cảnh báo',
      subject: 'Cảnh báo leo trèo đã được xử lý',
      message: 'Cảnh báo leo trèo từ sân chơi đã được xem xét và đánh dấu đã giải quyết. Bé An đã được giám sát an toàn trong giờ chơi.',
      timestamp: '4 giờ trước',
      read: true,
      type: 'alert'
    },
    {
      id: 3,
      from: 'Ban giám hiệu',
      subject: 'Báo cáo tuần đã có',
      message: 'Báo cáo hành vi hàng tuần của con em đã sẵn sàng. Bạn có thể xem trong phần Báo cáo.',
      timestamp: '1 ngày trước',
      read: true,
      type: 'notification'
    },
    {
      id: 4,
      from: 'Cô Nguyễn Thị Lan',
      subject: 'Nhắc nhở đón con',
      message: 'Nhắc nhở thân thiện rằng giờ đón con hôm nay là 15:30. Bé An sẽ chờ ở lớp học chính.',
      timestamp: '2 ngày trước',
      read: true,
      type: 'message'
    }
  ]

  // Convert alerts to notifications format
  const notifications = alerts.map(alert => ({
    id: alert.id,
    title: alert.alert_type,
    message: `Cảnh báo từ hệ thống AI giám sát - Camera ID: ${alert.camera_id || 'N/A'}`,
    timestamp: formatTime(alert.created_at) + ' - ' + formatDate(alert.created_at),
    priority: alert.severity >= 3 ? 'high' : alert.severity >= 2 ? 'medium' : 'low',
    read: alert.acknowledged,
    alert: alert
  }))

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-danger-100 text-danger-700'
      case 'medium': return 'bg-warning-100 text-warning-700'
      case 'low': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-4 h-4" />
      case 'alert': return <Bell className="w-4 h-4" />
      case 'notification': return <Mail className="w-4 h-4" />
      default: return <Mail className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">💬 Thông báo & Tin nhắn</h1>
        <p className="text-green-100">Kết nối với giáo viên và nhận cập nhật quan trọng</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'messages'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Tin nhắn</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Bell className="w-4 h-4" />
            <span>Thông báo</span>
          </button>
        </nav>
      </div>

      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <section className="lg:col-span-2 space-y-4">
            {messages.map((message) => (
              <article key={message.id} className={`card cursor-pointer transition-colors hover:bg-gray-50 ${!message.read ? 'border-blue-200 bg-blue-50' : ''
                }`}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {getTypeIcon(message.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">{message.from}</h3>
                        {!message.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{message.timestamp}</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-medium text-gray-900 mt-1">{message.subject}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message.message}</p>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* Chat/Compose */}
          <aside className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Gửi tin nhắn</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gửi đến</label>
                  <select className="input-field" title="Chọn người nhận tin nhắn">
                    <option>Cô Nguyễn Thị Lan</option>
                    <option>Ban giám hiệu</option>
                    <option>Hiệu trưởng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                  <input type="text" className="input-field" placeholder="Nhập tiêu đề" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Nhập nội dung tin nhắn tại đây..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>

                <button className="w-full btn-primary flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Gửi tin nhắn</span>
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Thao tác nhanh</h3>

              <div className="space-y-3">
                <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Yêu cầu gọi điện</p>
                      <p className="text-xs text-blue-600">Lên lịch cuộc gọi</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-left transition-colors">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">Báo cáo vấn đề</p>
                      <p className="text-xs text-yellow-600">Báo cáo mối quan tâm</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Tin nhắn nhanh</p>
                      <p className="text-xs text-green-600">Gửi tin nhắn nhanh</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {/* Export Button */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Thông báo cảnh báo</h3>
            <button
              onClick={exportAlertsToCSV}
              disabled={exporting || alerts.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Xuất CSV</span>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Đang tải thông báo...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-600" />
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="btn-primary"
              >
                Thử lại
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo nào</h3>
              <p className="text-gray-500">Tất cả đều an toàn! 🎉</p>
            </div>
          ) : (
            notifications.map((notification) => (
            <article key={notification.id} className={`card cursor-pointer transition-colors hover:bg-gray-50 ${!notification.read ? 'border-blue-200 bg-blue-50' : ''
              }`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.priority === 'high' ? 'bg-red-100' :
                      notification.priority === 'medium' ? 'bg-yellow-100' :
                        'bg-gray-100'
                    }`}>
                    <Bell className={`w-5 h-5 ${notification.priority === 'high' ? 'text-red-600' :
                        notification.priority === 'medium' ? 'text-yellow-600' :
                          'text-gray-600'
                      }`} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{notification.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                        notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                      }`}>
                      Mức độ {notification.priority === 'high' ? 'cao' : notification.priority === 'medium' ? 'trung bình' : 'thấp'}
                    </span>
                    {!notification.read && notification.alert && (
                      <button
                        onClick={async () => {
                          try {
                            await parentApiService.acknowledgeAlert(notification.alert.id)
                            // Update local state
                            setAlerts(prev => prev.map(alert => 
                              alert.id === notification.alert.id ? { ...alert, acknowledged: true } : alert
                            ))
                          } catch (err) {
                            console.error('Error acknowledging alert:', err)
                          }
                        }}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs font-medium"
                      >
                        Xác nhận đã xử lý
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default ParentNotifications
