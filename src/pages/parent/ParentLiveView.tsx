import React, { useState } from 'react'
import { Camera, Maximize, Volume2, VolumeX, Users, User, Wifi, WifiOff } from 'lucide-react'

const ParentLiveView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'single' | 'full'>('single')
  const [selectedCamera, setSelectedCamera] = useState('classroom-a')
  const [audioEnabled, setAudioEnabled] = useState(false)

  const cameras = [
    { id: 'classroom-a', name: 'Phòng học A', status: 'Hoạt động', location: 'Tầng 1' },
    { id: 'playground', name: 'Sân chơi', status: 'Hoạt động', location: 'Ngoài trời' },
    { id: 'hallway', name: 'Hành lang', status: 'Bảo trì', location: 'Tầng 1' },
    { id: 'cafeteria', name: 'Phòng ăn', status: 'Hoạt động', location: 'Tầng 1' }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theo dõi trực tiếp</h1>
          <p className="text-gray-600 mt-1">Quan sát hoạt động của con em trong thời gian thực</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('single')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'single'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Theo dõi cá nhân
            </button>
            <button
              onClick={() => setViewMode('full')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'full'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Xem toàn lớp
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Camera Selection */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Chọn camera</h3>
            <div className="space-y-3">
              {cameras.map((camera) => (
                <button
                  key={camera.id}
                  onClick={() => setSelectedCamera(camera.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${selectedCamera === camera.id
                      ? 'bg-blue-50 border-2 border-blue-200 shadow-md'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900 block">{camera.name}</span>
                      <span className="text-xs text-gray-500">{camera.location}</span>
                    </div>
                    <div className="flex items-center">
                      {camera.status === 'Hoạt động' ? (
                        <Wifi className="w-4 h-4 text-green-500" />
                      ) : (
                        <WifiOff className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className={`mt-2 text-xs font-medium ${camera.status === 'Hoạt động' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {camera.status}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Video Feed */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                📹 {cameras.find(c => c.id === selectedCamera)?.name}
              </h3>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`p-2 rounded-lg transition-colors ${audioEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    } hover:bg-gray-200`}
                  title={audioEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
                >
                  {audioEnabled ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                </button>

                <button
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Xem toàn màn hình"
                >
                  <Maximize className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: '16/9' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Video trực tiếp</p>
                  <p className="text-sm opacity-75">Camera: {cameras.find(c => c.id === selectedCamera)?.name}</p>
                </div>
              </div>

              {/* AI Overlay Indicators */}
              <div className="absolute top-4 left-4 space-y-2">
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  ✓ Đã phát hiện trẻ
                </div>
                <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  ⚠ Vùng cảnh báo
                </div>
              </div>

              {/* Live Indicator */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">TRỰC TIẾP</span>
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Chất lượng:</span>
                <select
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1 bg-white"
                  title="Chọn chất lượng video"
                >
                  <option>HD (720p)</option>
                  <option>Full HD (1080p)</option>
                  <option>4K</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Hiển thị AI:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                    title="Bật/tắt hiển thị AI"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Panel */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🤖 Phân tích AI</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-green-900 mb-1">Theo dõi trẻ em</h4>
            <p className="text-sm text-green-700">Đã xác định và đang theo dõi</p>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-8 h-8 bg-yellow-600 rounded"></div>
            </div>
            <h4 className="font-bold text-yellow-900 mb-1">Vùng nguy hiểm</h4>
            <p className="text-sm text-yellow-700">2 vùng được đánh dấu</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-blue-900 mb-1">Phát hiện hoạt động</h4>
            <p className="text-sm text-blue-700">Đang vẽ tranh</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentLiveView
