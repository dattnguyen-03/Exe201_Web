import React, { useState } from 'react'
import { BarChart3, TrendingUp, Calendar, Download, Activity, Target } from 'lucide-react'

const ParentBehaviorReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week')
  const [reportType, setReportType] = useState('activity')

  const activityData = [
    { day: 'T2', active: 85, wandering: 10, climbing: 5, label: 'Thứ 2' },
    { day: 'T3', active: 90, wandering: 8, climbing: 2, label: 'Thứ 3' },
    { day: 'T4', active: 75, wandering: 15, climbing: 10, label: 'Thứ 4' },
    { day: 'T5', active: 88, wandering: 7, climbing: 5, label: 'Thứ 5' },
    { day: 'T6', active: 92, wandering: 5, climbing: 3, label: 'Thứ 6' },
    { day: 'T7', active: 80, wandering: 12, climbing: 8, label: 'Thứ 7' },
    { day: 'CN', active: 85, wandering: 10, climbing: 5, label: 'Chủ nhật' }
  ]

  const behaviorProfile = {
    frequentBehaviors: [
      { behavior: 'Chơi tích cực', percentage: 75, trend: 'up', description: 'Tham gia các hoạt động vui chơi' },
      { behavior: 'Hoạt động yên tĩnh', percentage: 60, trend: 'stable', description: 'Đọc sách, vẽ tranh' },
      { behavior: 'Tương tác xã hội', percentage: 85, trend: 'up', description: 'Chơi cùng bạn bè' },
      { behavior: 'Lang thang', percentage: 15, trend: 'down', description: 'Di chuyển không mục đích' },
      { behavior: 'Leo trèo', percentage: 8, trend: 'down', description: 'Leo lên các vật dụng' }
    ],
    riskFactors: [
      { factor: 'Khu vực không giám sát', level: 'Thấp', color: 'success' },
      { factor: 'Thời gian hoạt động cao', level: 'Trung bình', color: 'warning' },
      { factor: 'Tương tác với bạn bè', level: 'Thấp', color: 'success' }
    ]
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '📈'
    if (trend === 'down') return '📉'
    return '➡️'
  }

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">📊 Báo cáo hành vi</h1>
            <p className="text-purple-100">Phân tích chi tiết về mô hình hoạt động của con em</p>
          </div>
          <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">⚙️ Cài đặt báo cáo</h3>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng thời gian</label>
            <select
              className="input-field"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              title="Chọn khoảng thời gian báo cáo"
            >
              <option value="day">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="quarter">Quý này</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại báo cáo</label>
            <select
              className="input-field"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              title="Chọn loại báo cáo"
            >
              <option value="activity">Phân tích hoạt động</option>
              <option value="behavior">Mô hình hành vi</option>
              <option value="safety">Sự cố an toàn</option>
              <option value="social">Tương tác xã hội</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">So sánh</label>
            <select className="input-field" title="Chọn phương thức so sánh">
              <option value="none">Không so sánh</option>
              <option value="previous">Kỳ trước</option>
              <option value="average">Trung bình lớp</option>
              <option value="baseline">Chuẩn cá nhân</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">📈 Tổng quan hoạt động tuần</h3>
          <BarChart3 className="w-5 h-5 text-purple-500" />
        </div>

        <div className="space-y-4">
          {activityData.map((day) => (
            <div key={day.day} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{day.label}</span>
                <span className="text-sm text-gray-500">Tổng: {day.active + day.wandering + day.climbing}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className="h-full flex">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-500"
                    style={{ width: `${day.active}%` }}
                    title={`Chơi tích cực: ${day.active}%`}
                  />
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500"
                    style={{ width: `${day.wandering}%` }}
                    title={`Lang thang: ${day.wandering}%`}
                  />
                  <div
                    className="bg-gradient-to-r from-red-400 to-red-500"
                    style={{ width: `${day.climbing}%` }}
                    title={`Leo trèo: ${day.climbing}%`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Chơi tích cực</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Lang thang</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Leo trèo</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Assessment */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🛡️ Đánh giá rủi ro</h3>

          <div className="space-y-4">
            {behaviorProfile.riskFactors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">{factor.factor}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${factor.level === 'Thấp' ? 'bg-green-100 text-green-700' :
                    factor.level === 'Trung bình' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                  }`}>
                  Rủi ro {factor.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🤖 Khuyến nghị từ AI</h3>

          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">✅ Điểm tích cực</h4>
              <p className="text-sm text-blue-700">
                Em có kỹ năng tương tác xã hội tốt. Hãy tiếp tục khuyến khích các hoạt động nhóm và chơi cùng bạn bè.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">⚠️ Cần chú ý</h4>
              <p className="text-sm text-yellow-700">
                Theo dõi hành vi leo trèo trong giờ chơi. Cân nhắc tăng cường giám sát tại khu vực thiết bị chơi.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">📈 Tiến bộ đáng chú ý</h4>
              <p className="text-sm text-green-700">
                Cải thiện đáng kể trong việc ở trong khu vực được phép. Sự cố lang thang giảm 40%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentBehaviorReports
