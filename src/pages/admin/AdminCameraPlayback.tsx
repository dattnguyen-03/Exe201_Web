import React, { useState } from 'react'
import { Camera, Play, Pause, SkipBack, SkipForward, Download, Calendar, Clock } from 'lucide-react'

const AdminCameraPlayback: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState('classroom-a')
  const [selectedDate, setSelectedDate] = useState('2024-01-15')
  const [selectedTime, setSelectedTime] = useState('10:30')
  const [isPlaying, setIsPlaying] = useState(false)

  const cameras = [
    { id: 'classroom-a', name: 'Classroom A', location: 'Building 1, Room 101' },
    { id: 'classroom-b', name: 'Classroom B', location: 'Building 1, Room 102' },
    { id: 'playground', name: 'Playground', location: 'Outdoor Area' },
    { id: 'hallway-1', name: 'Hallway 1', location: 'Building 1, Main Hall' },
    { id: 'cafeteria', name: 'Cafeteria', location: 'Building 2, Ground Floor' },
    { id: 'entrance', name: 'Main Entrance', location: 'Building 1, Front' }
  ]

  const alertEvents = [
    {
      id: 1,
      time: '10:30:15',
      type: 'Climbing Alert',
      severity: 'High',
      child: 'Emma Johnson',
      description: 'Child detected climbing on playground equipment'
    },
    {
      id: 2,
      time: '11:15:42',
      type: 'Out of Zone',
      severity: 'Medium',
      child: 'Michael Chen',
      description: 'Child moved outside designated safe area'
    },
    {
      id: 3,
      time: '14:22:18',
      type: 'Collision Risk',
      severity: 'High',
      child: 'Sofia Rodriguez',
      description: 'Potential collision detected with another child'
    }
  ]

  const timelineEvents = [
    { time: '09:00', event: 'Class Start', type: 'normal' },
    { time: '10:30', event: 'Climbing Alert', type: 'alert' },
    { time: '11:15', event: 'Out of Zone Alert', type: 'alert' },
    { time: '12:00', event: 'Lunch Break', type: 'normal' },
    { time: '14:22', event: 'Collision Risk', type: 'alert' },
    { time: '15:30', event: 'Class End', type: 'normal' }
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Camera Playback & Event Extraction</h1>
        <p className="text-gray-600 mt-2">Review past footage and extract event-related clips</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Camera Selection */}
        <aside className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Camera Selection</h2>

            <div className="space-y-2">
              {cameras.map((camera) => (
                <button
                  key={camera.id}
                  onClick={() => setSelectedCamera(camera.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${selectedCamera === camera.id
                      ? 'bg-primary-50 border-2 border-primary-200'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <Camera className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="font-medium text-gray-900 block">{camera.name}</span>
                      <span className="text-xs text-gray-500">{camera.location}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Date & Time</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  title="Select date for footage playback"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  className="input-field"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  title="Select time for footage playback"
                />
              </div>

              <button className="w-full btn-primary">Load Footage</button>
            </div>
          </div>
        </aside>

        {/* Video Player */}
        <main className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Video Playback</h2>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">{selectedDate} at {selectedTime}</span>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="w-16 h16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Playback Video</p>
                  <p className="text-sm opacity-75">Camera: {cameras.find(c => c.id === selectedCamera)?.name}</p>
                </div>
              </div>

              {/* AI Overlay Indicators */}
              <div className="absolute top-4 left-4 space-y-2">
                <div className="bg-success-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Child Tracked
                </div>
                <div className="bg-warning-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Danger Zone
                </div>
              </div>

              {/* Playback Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center space-x-4 bg-black bg-opacity-50 rounded-lg px-4 py-2">
                  <button
                    className="text-white hover:text-primary-300"
                    title="Skip backward"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    className="text-white hover:text-primary-300"
                    onClick={() => setIsPlaying(!isPlaying)}
                    title={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <button
                    className="text-white hover:text-primary-300"
                    title="Skip forward"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                  <button
                    className="text-white hover:text-primary-300"
                    title="Download video clip"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Timeline</span>
                <span className="text-sm text-gray-500">Duration: 8 hours</span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full">
                <div className="absolute h-2 bg-primary-500 rounded-full" style={{ width: '25%' }}></div>
                {timelineEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`absolute w-3 h-3 rounded-full -top-0.5 ${event.type === 'alert' ? 'bg-danger-500' : 'bg-gray-400'
                      }`}
                    style={{ left: `${(index / timelineEvents.length) * 100}%` }}
                    title={`${event.time}: ${event.event}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Event Timeline */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Timeline</h2>

            <div className="space-y-3">
              {timelineEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${event.type === 'alert' ? 'bg-danger-500' : 'bg-gray-400'
                      }`} />
                    <div>
                      <span className="font-medium text-gray-900">{event.event}</span>
                      <p className="text-sm text-gray-500">{event.time}</p>
                    </div>
                  </div>
                  <button className="btn-secondary">Jump to</button>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Event Details */}
        <aside className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert Events</h2>

            <div className="space-y-4">
              {alertEvents.map((alert) => (
                <div key={alert.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{alert.type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${alert.severity === 'High' ? 'bg-danger-100 text-danger-700' :
                        'bg-warning-100 text-warning-700'
                      }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{alert.child}</span>
                    <span>{alert.time}</span>
                  </div>
                  <button className="w-full mt-2 btn-secondary text-xs">Extract Clip</button>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h2>

            <div className="space-y-3">
              <button className="w-full btn-primary">Export Current View</button>
              <button className="w-full btn-secondary">Export Alert Clips</button>
              <button className="w-full btn-secondary">Export Full Day</button>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Export Settings</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Quality:</span>
                  <span>HD 720p</span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span>MP4</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Overlay:</span>
                  <span>Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default AdminCameraPlayback
