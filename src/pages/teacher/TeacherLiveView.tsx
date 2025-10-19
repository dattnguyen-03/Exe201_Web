import React, { useRef, useState, useEffect } from "react";
import { Users } from "lucide-react";
import { teacherApiService } from "../../services/teacherApiService";

interface Detection {
  class: string;
  confidence: number;
  box: number[];
}

interface ClassRoom {
  id: number;
  name: string;
  description?: string;
  capacity?: number;
  teacher_id?: number;
}

const TeacherLiveView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [detectionCount, setDetectionCount] = useState(0);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Class selection states
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [errorClasses, setErrorClasses] = useState<string | null>(null);

  // Load classes from API
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoadingClasses(true);
        setErrorClasses(null);
        const classesData = await teacherApiService.getClasses();
        setClasses(classesData);
        console.log("✅ Loaded classes:", classesData);
      } catch (error) {
        console.error("❌ Error loading classes:", error);
        setErrorClasses(error instanceof Error ? error.message : 'Có lỗi xảy ra khi tải danh sách lớp');
      } finally {
        setLoadingClasses(false);
      }
    };

    loadClasses();
  }, []);

  // Function để dừng camera và WebSocket
  const stopCamera = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
    
    // Dừng webcam
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setConnectionStatus('disconnected');
    setDetectionCount(0);
    setRetryCount(0);
  };

  useEffect(() => {
    if (!running) return;
  
    let stream: MediaStream | null = null;
    let ws: WebSocket | null = null;
  
    // Bật camera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((mediaStream) => {
        stream = mediaStream;
        setCameraStream(mediaStream);
      })
      .catch((err) => {
        console.error("Không thể bật camera:", err);
        setRunning(false);
      });
  
    // Mở WebSocket - sử dụng port 8888 (Violence Detection server)
    try {
      setConnectionStatus('connecting');
      ws = new WebSocket("ws://localhost:8888/ws/detect");
      
      // Set timeout để kiểm tra kết nối
      const connectionTimeout = setTimeout(() => {
        if (ws && ws.readyState === 0) { // WebSocket.CONNECTING
          console.warn("WebSocket connection timeout");
          ws.close();
          setConnectionStatus('disconnected');
          setRunning(false);
        }
      }, 5000); // 5 seconds timeout
      
      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log("✅ WebSocket connected to AI detection server");
        setConnectionStatus('connected');
        setRetryCount(0); // Reset retry count on successful connection
      };
      
      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log("❌ WebSocket closed", event.code, event.reason);
        setConnectionStatus('disconnected');
        
        // Retry connection if it was closed unexpectedly
        if (event.code !== 1000 && retryCount < 3) { // 1000 = normal closure
          console.log(`🔄 Retrying WebSocket connection (${retryCount + 1}/3)...`);
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            if (running) {
              // Retry connection
              const retryWs = new WebSocket("ws://localhost:8888/ws/detect");
              retryWs.onopen = () => {
                console.log("✅ WebSocket reconnected");
                setConnectionStatus('connected');
                setRetryCount(0);
                setSocket(retryWs);
              };
              retryWs.onclose = () => {
                console.log("❌ WebSocket retry failed");
                setConnectionStatus('disconnected');
              };
              retryWs.onerror = () => {
                console.log("❌ WebSocket retry error");
                setConnectionStatus('disconnected');
              };
              retryWs.onmessage = (event) => {
                try {
                  const data = JSON.parse(event.data);
                  const detections = data.detections || [];
                  setDetectionCount(detections.length);
                  drawDetections(detections);
                } catch (err) {
                  console.error("Error parsing WebSocket message:", err);
                }
              };
            }
          }, 2000); // Wait 2 seconds before retry
        }
      };
      
      ws.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error("WebSocket error:", error);
        setConnectionStatus('disconnected');
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const detections = data.detections || [];
          setDetectionCount(detections.length);
          drawDetections(detections);
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };
      
      setSocket(ws);
    } catch (err) {
      console.error("Không thể kết nối WebSocket:", err);
      setConnectionStatus('disconnected');
      setRunning(false);
    }
  
    return () => {
      if (ws) ws.close();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      // Dừng video element khi component unmount
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [running]);

  // useEffect để gán stream vào video element khi cameraStream thay đổi
  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      console.log("✅ Video stream assigned to video element", {
        stream: cameraStream,
        videoElement: videoRef.current,
        tracks: cameraStream.getTracks().length
      });
      
      // Thêm event listeners để debug
      videoRef.current.onloadedmetadata = () => {
        console.log("📹 Video metadata loaded", {
          videoWidth: videoRef.current?.videoWidth,
          videoHeight: videoRef.current?.videoHeight,
          readyState: videoRef.current?.readyState
        });
      };
      
      videoRef.current.oncanplay = () => {
        console.log("▶️ Video can play");
      };
    }
  }, [cameraStream]);
  
  // Gửi frame khi socket đã sẵn sàng
  useEffect(() => {
    if (!running || !socket) return;
  
    const interval = setInterval(() => {
      if (socket.readyState === 1) { // WebSocket.OPEN
        captureFrameAndSend(socket);
      }
    }, 1000); // Gửi 1 fps để giảm tải server
  
    return () => clearInterval(interval);
  }, [running, socket]);

  const captureFrameAndSend = (ws: WebSocket) => {
    if (!videoRef.current || !canvasRef.current) return;
    
    // Kiểm tra WebSocket state
    if (ws.readyState !== 1) { // WebSocket.OPEN
      console.warn("WebSocket not ready, state:", ws.readyState);
      return;
    }
    
    const video = videoRef.current;
      const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Kiểm tra video đã sẵn sàng chưa
    if (video.readyState !== 4) return; // HAVE_ENOUGH_DATA
  
    // resize nhỏ để gửi
    const w = 320, h = 240;
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(video, 0, 0, w, h);
  
    const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
    const base64Data = dataUrl.split(",")[1];
    
    // Gửi data theo format mà violence detection server expect
    const payload = {
      image: base64Data,
      child_id: 1, // Default child ID
      camera_id: 1 // Default camera ID
    };
    
    try {
      ws.send(JSON.stringify(payload));
    } catch (error) {
      console.warn("WebSocket send error:", error);
      // Nếu gửi lỗi, có thể WebSocket đã đóng
      if (ws && (ws.readyState as number) === 3) { // WebSocket.CLOSED
        setConnectionStatus('disconnected');
        setRunning(false);
      }
    }
  };
  

  const drawDetections = (detections: Detection[]) => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    detections.forEach((det) => {
      const [x1, y1, x2, y2] = det.box;
      ctx.strokeStyle = det.class.toLowerCase() === "violence" ? "red" : "lime";
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = "14px Arial";
      ctx.fillText(`${det.class} ${(det.confidence * 100).toFixed(1)}%`, x1 + 4, y1 - 4);
    });
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Đã kết nối';
      case 'connecting': return 'Đang kết nối...';
      default: return 'Chưa kết nối';
    }
  };

    return (
    <div className="flex h-screen bg-gray-50">
      {/* Class List Sidebar */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            Danh sách lớp
          </h2>
          <p className="text-sm text-gray-600">Chọn lớp để xem camera</p>
        </div>
        
        <div className="space-y-3">
          {/* All Classes Option */}
          <div
            onClick={() => setSelectedClass(null)}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              !selectedClass
                ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Tất cả lớp</h3>
                <p className="text-sm text-gray-600">Xem tất cả camera</p>
              </div>
              <div className="text-2xl">📹</div>
            </div>
          </div>
          
          {/* Loading State */}
          {loadingClasses && (
            <div className="p-4 rounded-xl bg-gray-50 border-2 border-transparent">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Đang tải danh sách lớp...</span>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {errorClasses && (
            <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
              <div className="text-center">
                <div className="text-red-600 text-sm mb-2">❌ Lỗi tải danh sách lớp</div>
                <p className="text-xs text-red-500">{errorClasses}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}
          
          {/* Individual Classes */}
          {!loadingClasses && !errorClasses && classes.map((cls) => (
            <div
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedClass === cls.id
                  ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{cls.name}</h3>
                  <p className="text-sm text-gray-600">
                    {cls.capacity ? `${cls.capacity} học sinh` : '2 camera'}
                  </p>
                  {cls.description && (
                    <p className="text-xs text-gray-500 mt-1">{cls.description}</p>
                  )}
                </div>
                <div className="text-2xl">🎓</div>
              </div>
            </div>
          ))}
          
          {/* Empty State */}
          {!loadingClasses && !errorClasses && classes.length === 0 && (
            <div className="p-4 rounded-xl bg-gray-50 border-2 border-transparent text-center">
              <div className="text-gray-400 text-4xl mb-2">🎓</div>
              <p className="text-sm text-gray-600">Chưa có lớp nào</p>
              <p className="text-xs text-gray-500 mt-1">Liên hệ admin để thêm lớp</p>
            </div>
          )}
        </div>
        
        {/* Class Info */}
        {selectedClass && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">
              {classes.find(c => c.id === selectedClass)?.name}
            </h4>
            <p className="text-sm text-blue-700">Đang xem camera của lớp này</p>
          </div>
        )}
          </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
              <div>
            <h1 className="text-2xl font-bold mb-2">📹 Theo dõi trực tiếp</h1>
            <p className="text-blue-100">Giám sát an toàn trẻ em với AI phát hiện bạo lực</p>
          </div>
          </div>


      {/* Status Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getStatusColor()}`}>
              {getStatusText()}
                      </div>
            <div className="text-sm text-gray-600">Trạng thái kết nối</div>
                    </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {detectionCount}
            </div>
            <div className="text-sm text-gray-600">Phát hiện hiện tại</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${running ? 'text-green-600' : 'text-gray-400'}`}>
              {running ? 'Đang chạy' : 'Đã dừng'}
                      </div>
            <div className="text-sm text-gray-600">Trạng thái camera</div>
                    </div>
                  </div>
                </div>

      {/* Video Container */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="relative bg-black rounded-xl overflow-hidden shadow-lg w-full max-w-4xl mx-auto" style={{ aspectRatio: '16/9' }}>
                    <video
                      ref={videoRef}
                      autoPlay
            muted 
            className="absolute top-0 left-0 w-full h-full object-cover" 
          />
          <canvas 
            ref={canvasRef} 
            className="absolute top-0 left-0 w-full h-full" 
          />
          
          {/* Màn hình đen khi camera tắt */}
          {!cameraStream && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📹</div>
                <div className="text-xl font-semibold">Camera chưa được bật</div>
                <div className="text-sm opacity-75">Nhấn "Bắt đầu" để bật camera và AI detection</div>
                      </div>
                    </div>
                  )}
                </div>

        {/* Control Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => {
              if (running) {
                stopCamera();
                setRunning(false);
              } else {
                setRunning(true);
              }
            }}
            className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
              running 
                ? "bg-red-500 hover:bg-red-600 shadow-lg" 
                : "bg-blue-600 hover:bg-blue-700 shadow-lg"
            }`}
          >
            {running ? "⏹️ Dừng giám sát" : "▶️ Bắt đầu giám sát"}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default TeacherLiveView;

