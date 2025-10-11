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

  useEffect(() => {
    if (!running) return;
  
    // bật camera
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    });
  
    // mở websocket
    // const ws = new WebSocket("ws://127.0.0.1:8888/ws/detect");
    const ws = new WebSocket("ws://localhost:8888/ws/detect");

    ws.onopen = () => console.log("✅ WebSocket connected");
    ws.onclose = () => console.log("❌ WebSocket closed");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      drawDetections(data.detections || []);
    };
    setSocket(ws);
  
    return () => ws.close();
  }, [running]);
  
  // gửi frame khi socket đã sẵn sàng
  useEffect(() => {
    if (!running || !socket) return;
  
    const interval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        captureFrameAndSend(socket);
      }
    }, 500); // gửi 2 fps
  
    return () => clearInterval(interval);
  }, [running, socket]);
  

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // gửi frame liên tục qua WebSocket
        const sendInterval = setInterval(() => {
          if (socket && socket.readyState === WebSocket.OPEN) {
            captureFrameAndSend(socket);
          }
        }, 300); // gửi mỗi 300ms
        return () => clearInterval(sendInterval);
      }
    } catch (err) {
      console.error("Không thể bật camera:", err);
    }
  };

  const captureFrameAndSend = (ws: WebSocket) => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    // resize nhỏ để gửi
    const w = 320, h = 240;
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(video, 0, 0, w, h);
  
    const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
    const base64Data = dataUrl.split(",")[1];
    ws.send(base64Data);
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Theo dõi trực tiếp (WebSocket)</h2>
      <div className="relative bg-black rounded-xl overflow-hidden shadow-lg w-[640px] h-[480px]">
        <video ref={videoRef} autoPlay muted className="absolute top-0 left-0 w-full h-full object-cover" />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      </div>
      <button
        onClick={() => setRunning(!running)}
        className={`mt-4 px-4 py-2 rounded ${running ? "bg-red-500" : "bg-blue-600"} text-white`}
      >
        {running ? "Dừng" : "Bắt đầu"}
      </button>
    </div>
  );
};

export default ParentLiveView;

