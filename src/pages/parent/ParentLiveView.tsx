import React, { useRef, useState, useEffect } from "react";
import { Camera, Maximize, Volume2, VolumeX, Users, User, Wifi, WifiOff } from "lucide-react";

interface Detection {
  class: string;
  confidence: number;
  box: number[];
}

const ParentLiveView: React.FC = () => {
  const [viewMode, setViewMode] = useState<"single" | "full">("single");
  const [selectedCamera, setSelectedCamera] = useState("classroom-a");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [running, setRunning] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const cameras = [
    { id: "classroom-a", name: "Phòng học A", status: "Hoạt động", location: "Tầng 1" },
    { id: "playground", name: "Sân chơi", status: "Hoạt động", location: "Ngoài trời" },
    { id: "hallway", name: "Hành lang", status: "Bảo trì", location: "Tầng 1" },
    { id: "cafeteria", name: "Phòng ăn", status: "Hoạt động", location: "Tầng 1" },
  ];

  useEffect(() => {
    if (running) {
      startCamera();
      const interval = setInterval(() => {
        captureAndDetect();
      }, 2000); // gửi frame mỗi 2 giây
      return () => clearInterval(interval);
    }
  }, [running]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Không thể bật camera:", err);
    }
  };
  
  const drawDetections = (ctx: CanvasRenderingContext2D, detections: Detection[]) => {
  ctx.lineWidth = 2;
  detections.forEach((det) => {
    const [x1, y1, x2, y2] = det.box;
    ctx.strokeStyle = det.class.toLowerCase() === "violence" ? "red" : "green";
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = "16px Arial";
    ctx.fillText(
      `${det.class} (${(det.confidence * 100).toFixed(1)}%)`,
      x1 + 4,
      y1 - 4
    );
  });
};

  const captureAndDetect = async () => {
  if (!videoRef.current || !canvasRef.current) return;

  const video = videoRef.current;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  canvas.toBlob(async (blob) => {
    if (!blob) return;
    const formData = new FormData();
    formData.append("file", blob, "frame.jpg");

    try {
      const response = await fetch("http://127.0.0.1:8000/detect", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setDetections(data.detections || []);

      // Vẽ bounding box trực tiếp trên canvas
      drawDetections(ctx, data.detections || []);
    } catch (err) {
      console.error("Error calling API:", err);
    }
  }, "image/jpeg");
};

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theo dõi trực tiếp</h1>
          <p className="text-gray-600 mt-1">Quan sát hoạt động của con em trong thời gian thực</p>
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
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedCamera === camera.id
                      ? "bg-blue-50 border-2 border-blue-200 shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900 block">{camera.name}</span>
                      <span className="text-xs text-gray-500">{camera.location}</span>
                    </div>
                    <div className="flex items-center">
                      {camera.status === "Hoạt động" ? (
                        <Wifi className="w-4 h-4 text-green-500" />
                      ) : (
                        <WifiOff className="w-4 h-4 text-red-500" />
                      )}
                    </div>
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
                📹 {cameras.find((c) => c.id === selectedCamera)?.name}
              </h3>
              <button
                onClick={() => setRunning(!running)}
                className={`px-4 py-2 rounded ${
                  running ? "bg-red-500 text-white" : "bg-blue-600 text-white"
                }`}
              >
                {running ? "Dừng" : "Bắt đầu"}
              </button>
            </div>

            <div className="relative bg-black rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: "16/9" }}>
              <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
              <canvas ref={canvasRef} style={{ display: "none" }} />

              {/* Hiển thị kết quả detect */}
              {detections.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-white/80 text-black p-2 rounded shadow">
                  <p className="font-semibold">Kết quả AI:</p>
                  <ul className="text-sm">
                    {detections.map((d, i) => (
                      <li key={i}>
                        {d.class} - {(d.confidence * 100).toFixed(1)}%
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentLiveView;

