import React, { useRef, useState, useEffect } from "react";

interface Detection {
  class: string;
  confidence: number;
  box: number[];
}

const ParentLiveView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [detectionCount, setDetectionCount] = useState(0);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [retryCount, setRetryCount] = useState(0);

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">📹 Theo dõi trực tiếp</h1>
        <p className="text-blue-100">Giám sát an toàn trẻ em với AI phát hiện bạo lực</p>
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
  );
};

export default ParentLiveView;

