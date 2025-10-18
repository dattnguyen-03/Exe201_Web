import React, { useState, useEffect } from 'react'
import { Users, Camera, AlertTriangle, BarChart3, Activity, TrendingUp, Shield, Clock, CheckCircle } from 'lucide-react'
import { adminApiService } from '../../services/adminApiService'

const AdminDashboard: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<{
    users: number
    parents: number
    schools: number
    teachers: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const stats = await adminApiService.getDashboardStats()
        setDashboardStats(stats)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  // Dữ liệu tĩnh cho các phần khác (có thể thay thế bằng API khác sau)
  const systemStats = {
    totalChildren: 245,
    totalClasses: 12,
    activeCameras: 18,
    totalAlerts: 47,
    resolvedAlerts: 42,
    systemHealth: 96
  }

  const recentAlerts = [
    {
      id: 1,
      child: 'Nguyễn Minh An',
      class: 'Lớp Mẫu Giáo A',
      type: 'Leo trèo',
      severity: 'Cao',
      time: '10:30',
      location: 'Sân chơi',
      status: 'pending'
    },
    {
      id: 2,
      child: 'Trần Thị Bích',
      class: 'Lớp Mẫu Giáo B',
      type: 'Ra khỏi vùng an toàn',
      severity: 'Trung bình',
      time: '9:45',
      location: 'Hành lang',
      status: 'resolved'
    },
    {
      id: 3,
      child: 'Lê Văn Đức',
      class: 'Lớp Chồi A',
      type: 'Nguy cơ va chạm',
      severity: 'Cao',
      time: '9:15',
      location: 'Phòng ăn',
      status: 'confirmed'
    }
  ]

  const alertsByClass = [
    { class: 'Lớp Mẫu Giáo A', alerts: 12, trend: 'up', students: 22 },
    { class: 'Lớp Mẫu Giáo B', alerts: 8, trend: 'down', students: 20 },
    { class: 'Lớp Chồi A', alerts: 15, trend: 'up', students: 25 },
    { class: 'Lớp Chồi B', alerts: 6, trend: 'stable', students: 23 },
    { class: 'Lớp Lá A', alerts: 4, trend: 'down', students: 24 }
  ]

  const cameraStatus = [
    { location: 'Phòng học A', status: 'Hoạt động', health: 98, type: 'indoor' },
    { location: 'Sân chơi', status: 'Hoạt động', health: 95, type: 'outdoor' },
    { location: 'Hành lang 1', status: 'Bảo trì', health: 0, type: 'indoor' },
    { location: 'Phòng ăn', status: 'Hoạt động', health: 92, type: 'indoor' }
  ]

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '📈'
    if (trend === 'down') return '📉'
    return '➡️'
  }

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-red-600'
    if (trend === 'down') return 'text-green-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">🏫 Bảng điều khiển quản trị</h1>
            <p className="text-amber-100">Tổng quan và giám sát toàn hệ thống</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{systemStats.systemHealth}%</div>
            <div className="text-amber-200 text-sm">Sức khỏe hệ thống</div>
          </div>
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-25 to-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Tổng số người dùng</p>
              <p className="text-2xl font-bold text-blue-900">
                {loading ? '...' : dashboardStats?.users || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-25 to-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Phụ huynh</p>
              <p className="text-2xl font-bold text-green-900">
                {loading ? '...' : dashboardStats?.parents || 0}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-25 to-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Trường học</p>
              <p className="text-2xl font-bold text-purple-900">
                {loading ? '...' : dashboardStats?.schools || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-25 to-orange-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-medium">Giáo viên</p>
              <p className="text-2xl font-bold text-orange-900">
                {loading ? '...' : dashboardStats?.teachers || 0}
              </p>
            </div>
            <div className="p-3 bg-orange-500 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent System Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">🚨 Cảnh báo gần đây</h3>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{alert.child}</span>
                      <span className="text-sm text-gray-500">({alert.class})</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${alert.severity === 'Cao' ? 'bg-red-100 text-red-700' :
                        alert.severity === 'Trung bình' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{alert.type} • {alert.location} • {alert.time}</p>
                  </div>
                  <div className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${alert.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    alert.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                    {alert.status === 'resolved' ? 'Đã xử lý' :
                      alert.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xử lý'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 btn-secondary">
            Xem tất cả cảnh báo
          </button>
        </div>

        {/* Alert Statistics by Class */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">📊 Cảnh báo theo lớp</h3>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>

          <div className="space-y-3">
            {alertsByClass.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">{item.class}</span>
                    <span className={`text-xs ${getTrendColor(item.trend)}`}>
                      {getTrendIcon(item.trend)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{item.alerts} cảnh báo</span>
                    <span className="text-xs text-gray-400">({item.students} học sinh)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(item.alerts / 20) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Camera and AI System Health */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">📹 Tình trạng camera & hệ thống AI</h3>
          <Shield className="w-5 h-5 text-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {cameraStatus.map((camera, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{camera.location}</h4>
                <div className="flex items-center space-x-1">
                  {camera.type === 'outdoor' && <span className="text-xs">🌤️</span>}
                  {camera.type === 'indoor' && <span className="text-xs">🏠</span>}
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${camera.status === 'Hoạt động' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {camera.status}
                </span>
                <span className="text-sm font-medium">{camera.health}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${camera.health > 90 ? 'bg-green-500' :
                    camera.health > 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                  style={{ width: `${camera.health}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">94%</div>
            <div className="text-sm text-blue-700">Sức khỏe tổng thể</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">18/20</div>
            <div className="text-sm text-green-700">Camera trực tuyến</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">2</div>
            <div className="text-sm text-orange-700">Cần bảo trì</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Thao tác nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors group">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-blue-700">Quản lý lớp học</span>
          </button>

          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl text-center transition-colors group">
            <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-orange-700">Xem cảnh báo</span>
          </button>

          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors group">
            <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-green-700">Tạo báo cáo</span>
          </button>

          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors group">
            <Camera className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-purple-700">Xem lại camera</span>
          </button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center space-x-3 mb-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h4 className="font-bold text-green-900">Hiệu suất xuất sắc</h4>
              <p className="text-sm text-green-700">Hệ thống hoạt động ổn định</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-green-700">
            <div>• 99.2% thời gian hoạt động</div>
            <div>• {systemStats.resolvedAlerts}/{systemStats.totalAlerts} cảnh báo đã xử lý</div>
            <div>• 0 sự cố nghiêm trọng</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center space-x-3 mb-3">
            <Activity className="w-8 h-8 text-blue-600" />
            <div>
              <h4 className="font-bold text-blue-900">Hoạt động hôm nay</h4>
              <p className="text-sm text-blue-700">Tóm tắt các sự kiện</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-blue-700">
            <div>• {systemStats.totalAlerts} cảnh báo mới</div>
            <div>• 156 sự kiện được ghi nhận</div>
            <div>• 23 tương tác phụ huynh</div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center space-x-3 mb-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <h4 className="font-bold text-purple-900">Xu hướng tuần này</h4>
              <p className="text-sm text-purple-700">So với tuần trước</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-purple-700">
            <div>• 📈 Cảnh báo tăng 12%</div>
            <div>• 📉 Thời gian phản hồi giảm 8%</div>
            <div>• 📈 Độ chính xác AI tăng 2%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
