import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Play, 
  Pause, 
  Square, 
  Maximize, 
  Minimize,
  Volume2, 
  VolumeX, 
  Settings,
  Camera,
  AlertTriangle,
  Users,
  Activity,
  Eye,
  EyeOff,
  RotateCcw,
  Download,
  Share2,
  Bell,
  BellOff
} from 'lucide-react';
import { teacherApiService, Camera as CameraType, Alert } from '../../services/teacherApiService';

interface LiveStream {
  id: number;
  name: string;
  url: string;
  isActive: boolean;
  lastFrame?: string;
  detectedObjects: DetectedObject[];
  alerts: Alert[];
  class_id?: number;
}

interface DetectedObject {
  id: string;
  type: 'person' | 'child' | 'adult' | 'object';
  confidence: number;
  position: { x: number; y: number; width: number; height: number };
  label: string;
  timestamp: string;
}

interface StreamStats {
  totalStreams: number;
  activeStreams: number;
  totalAlerts: number;
  activeAlerts: number;
}

const TeacherLiveView: React.FC = () => {
  const [cameras, setCameras] = useState<CameraType[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [streamStats, setStreamStats] = useState<StreamStats>({
    totalStreams: 0,
    activeStreams: 0,
    totalAlerts: 0,
    activeAlerts: 0
  });

  useEffect(() => {
    loadData();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadData, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [camerasData, alertsData, classesData] = await Promise.all([
        teacherApiService.getCameras(),
        teacherApiService.getAlerts(),
        teacherApiService.getClasses()
      ]);
      
      setCameras(camerasData);
      setAlerts(alertsData);
      setClasses(classesData);
      
      // Convert cameras to live streams format
      const streams: LiveStream[] = camerasData.map(camera => ({
        id: camera.id,
        name: camera.name,
        url: camera.rtsp_url || '',
        isActive: camera.active,
        detectedObjects: [], // Real-time detection data would come from WebSocket
        alerts: alertsData.filter(alert => alert.camera_id === camera.id),
        class_id: camera.class_id
      }));
      
      setLiveStreams(streams);
      
      // Update stats
      setStreamStats({
        totalStreams: camerasData.length,
        activeStreams: camerasData.filter(c => c.active).length,
        totalAlerts: alertsData.length,
        activeAlerts: alertsData.filter(a => !a.acknowledged).length
      });
      
      if (camerasData.length > 0 && !selectedCamera) {
        setSelectedCamera(camerasData[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = (cameraId: number) => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    try {
      wsRef.current = teacherApiService.connectToCameraWebSocket(cameraId);
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket data:', data);
        // Handle real-time data updates
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const takeSnapshot = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        // Download the snapshot
        const link = document.createElement('a');
        link.download = `snapshot-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Hoạt động' : 'Offline';
  };

  const getClassName = (classId?: number): string => {
    if (!classId) return 'Chưa gán lớp';
    const classRoom = classes.find(c => c.id === classId);
    return classRoom?.name || 'Không xác định';
  };

  const selectedStream = liveStreams.find(stream => stream.id === selectedCamera);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Video className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Đang tải camera...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-blue-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <Video className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Xem Trực tiếp</h1>
                <p className="text-gray-600">Giám sát camera thời gian thực</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span>{autoRefresh ? 'Tự động BẬT' : 'Tự động TẮT'}</span>
              </button>
              
              <button
                onClick={() => setNotifications(!notifications)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  notifications 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {notifications ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                <span>Thông báo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng camera</p>
                <p className="text-2xl font-bold text-gray-900">{streamStats.totalStreams}</p>
              </div>
              <Camera className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{streamStats.activeStreams}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng cảnh báo</p>
                <p className="text-2xl font-bold text-red-600">{streamStats.totalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cảnh báo hoạt động</p>
                <p className="text-2xl font-bold text-yellow-600">{streamStats.activeAlerts}</p>
              </div>
              <Bell className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Camera List */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Danh sách Camera</h3>
            
            <div className="space-y-3">
              {liveStreams.length > 0 ? (
                liveStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedCamera === stream.id
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                    onClick={() => {
                      setSelectedCamera(stream.id);
                      connectWebSocket(stream.id);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{stream.name}</h4>
                        <p className="text-xs text-gray-500">{getClassName(stream.class_id)}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stream.isActive)}`}>
                        {getStatusLabel(stream.isActive)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      <p>Đối tượng: {stream.detectedObjects.length}</p>
                      <p>Cảnh báo: {stream.alerts.length}</p>
                      {stream.url && <p className="text-xs text-blue-600 truncate" title={stream.url}>RTSP: {stream.url}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Chưa có camera nào</p>
                  <p className="text-xs text-gray-400 mt-1">Thêm camera trong trang Quản lý Camera</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Video Area */}
          <div className="lg:col-span-3 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {selectedStream ? (
              <>
                {/* Video Controls */}
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h3 className="font-bold text-gray-900">{selectedStream.name}</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${selectedStream.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-sm text-gray-600">
                          {selectedStream.isActive ? 'TRỰC TIẾP' : 'OFFLINE'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>

                      <button
                        onClick={takeSnapshot}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Chụp ảnh"
                      >
                        <Camera className="w-5 h-5" />
                      </button>

                      <button
                        onClick={toggleFullscreen}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
                      >
                        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                      </button>

                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Cài đặt"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video Player */}
                <div className="relative bg-gray-900 h-96">
                  {selectedStream.url && selectedStream.isActive ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted={isMuted}
                      playsInline
                    >
                      <source src={selectedStream.url} type="application/x-rtsp" />
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center">
                          <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">Đang tải camera...</p>
                          <p className="text-sm text-gray-300">{selectedStream.name}</p>
                        </div>
                      </div>
                    </video>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">
                          {!selectedStream.isActive ? 'Camera Offline' : 'Chưa cấu hình RTSP'}
                        </p>
                        <p className="text-sm text-gray-300">{selectedStream.name}</p>
                        <p className="text-sm text-gray-400 mt-2">{getClassName(selectedStream.class_id)}</p>
                        {!selectedStream.url && (
                          <p className="text-xs text-yellow-400 mt-2">Cần cấu hình RTSP URL</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Detection Overlays */}
                  {selectedStream.detectedObjects.map((obj, index) => (
                    <div
                      key={index}
                      className="absolute border-2 border-blue-400 bg-blue-500 bg-opacity-20 rounded"
                      style={{
                        left: `${obj.position.x}px`,
                        top: `${obj.position.y}px`,
                        width: `${obj.position.width}px`,
                        height: `${obj.position.height}px`
                      }}
                    >
                      <div className="absolute -top-8 left-0 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                        {obj.label}
                        <br />
                        {obj.confidence}%
                      </div>
                    </div>
                  ))}

                  {/* Hidden canvas for snapshots */}
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Camera & Detection Info */}
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Thông tin Camera</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><span className="font-medium">Lớp học:</span> {getClassName(selectedStream.class_id)}</p>
                        <p><span className="font-medium">Trạng thái:</span> 
                          <span className={`ml-1 ${selectedStream.isActive ? 'text-green-600' : 'text-red-600'}`}>
                            {getStatusLabel(selectedStream.isActive)}
                          </span>
                        </p>
                        <p><span className="font-medium">RTSP:</span> {selectedStream.url ? 'Đã cấu hình' : 'Chưa có'}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Đối tượng phát hiện</h4>
                      <div className="space-y-1">
                        {selectedStream.detectedObjects.length > 0 ? (
                          selectedStream.detectedObjects.map((obj, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">{obj.label}</span>
                              <span className="text-blue-600 font-medium">{obj.confidence}%</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">Chưa có dữ liệu</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Thống kê</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Tổng đối tượng: {selectedStream.detectedObjects.length}</p>
                        <p>Học sinh: {selectedStream.detectedObjects.filter(obj => obj.type === 'child').length}</p>
                        <p>Người lớn: {selectedStream.detectedObjects.filter(obj => obj.type === 'adult').length}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Cảnh báo</h4>
                      <div className="space-y-1">
                        {selectedStream.alerts.length > 0 ? (
                          selectedStream.alerts.map((alert, index) => (
                            <div key={index} className="text-sm">
                              <div className={`${alert.severity >= 7 ? 'text-red-600' : alert.severity >= 4 ? 'text-yellow-600' : 'text-blue-600'}`}>
                                {alert.alert_type}
                              </div>
                              <div className="text-xs text-gray-500">
                                Mức độ: {alert.severity}/10
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-green-600">Không có cảnh báo</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Chọn camera</p>
                  <p className="text-sm">Chọn một camera để xem trực tiếp</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLiveView;
