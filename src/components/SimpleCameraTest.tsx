import React, { useRef, useState, useEffect } from 'react';

const SimpleCameraTest: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      console.log("🎥 Starting camera...");
      setError(null);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      console.log("✅ Got stream:", mediaStream);
      setStream(mediaStream);
      setIsActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        console.log("✅ Assigned stream to video element");
      }
      
    } catch (err) {
      console.error("❌ Camera error:", err);
      setError(err instanceof Error ? err.message : 'Camera access failed');
    }
  };

  const stopCamera = () => {
    console.log("🛑 Stopping camera...");
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log("🛑 Stopped track:", track.kind);
      });
    }
    setStream(null);
    setIsActive(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Simple Camera Test</h2>
      
      <div className="mb-4">
        <button
          onClick={isActive ? stopCamera : startCamera}
          className={`px-4 py-2 rounded-lg font-semibold ${
            isActive 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isActive ? 'Stop Camera' : 'Start Camera'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ width: '640px', height: '480px' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white">
            <div className="text-center">
              <div className="text-4xl mb-2">📹</div>
              <p>Camera not active</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Status:</strong> {isActive ? 'Active' : 'Inactive'}</p>
        <p><strong>Stream:</strong> {stream ? 'Connected' : 'Not connected'}</p>
        <p><strong>Video Element:</strong> {videoRef.current ? 'Ready' : 'Not ready'}</p>
      </div>
    </div>
  );
};

export default SimpleCameraTest;
