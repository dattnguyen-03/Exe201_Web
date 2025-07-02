import React, { useState } from 'react'
import { Camera, Maximize, Volume2, VolumeX, Users, User } from 'lucide-react'

const ParentLiveView: React.FC = () => {
    const [viewMode, setViewMode] = useState<'single' | 'full'>('single')
    const [selectedCamera, setSelectedCamera] = useState('classroom-a')
    const [audioEnabled, setAudioEnabled] = useState(false)

    const cameras = [
        { id: 'classroom-a', name: 'Classroom A', status: 'active' },
        { id: 'playground', name: 'Playground', status: 'active' },
        { id: 'hallway', name: 'Hallway', status: 'inactive' },
        { id: 'cafeteria', name: 'Cafeteria', status: 'active' }
    ]

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Live View</h1>
                    <p className="text-gray-600 mt-2">Real-time monitoring of classroom activities</p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('single')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'single'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <User className="w-4 h-4 inline mr-2" />
                            Single Child
                        </button>
                        <button
                            onClick={() => setViewMode('full')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'full'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Users className="w-4 h-4 inline mr-2" />
                            Full Class
                        </button>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Camera Selection */}
                <aside className="lg:col-span-1">
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
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">{camera.name}</span>
                                        <span className={camera.status === 'active' ? 'status-active' : 'status-inactive'}>
                                            {camera.status}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Video Feed */}
                <main className="lg:col-span-3">
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Live Feed - {cameras.find(c => c.id === selectedCamera)?.name}
                            </h2>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setAudioEnabled(!audioEnabled)}
                                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    title={audioEnabled ? "Mute audio" : "Enable audio"}
                                >
                                    {audioEnabled ? (
                                        <Volume2 className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <VolumeX className="w-5 h-5 text-gray-600" />
                                    )}
                                </button>

                                <button
                                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    title="Fullscreen video"
                                >
                                    <Maximize className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Video Container */}
                        <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium">Live Video Feed</p>
                                    <p className="text-sm opacity-75">Camera: {cameras.find(c => c.id === selectedCamera)?.name}</p>
                                </div>
                            </div>

                            {/* AI Overlay Indicators */}
                            <div className="absolute top-4 left-4 space-y-2">
                                <div className="bg-success-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Child Detected
                                </div>
                                <div className="bg-warning-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Danger Zone Alert
                                </div>
                            </div>

                            {/* Recording Indicator */}
                            <div className="absolute top-4 right-4">
                                <div className="flex items-center space-x-2 bg-danger-500 text-white px-3 py-1 rounded-full">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium">LIVE</span>
                                </div>
                            </div>
                        </div>

                        {/* Video Controls */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">Quality:</span>
                                <select
                                    className="text-sm border border-gray-300 rounded px-2 py-1"
                                    title="Select video quality"
                                >
                                    <option>HD (720p)</option>
                                    <option>Full HD (1080p)</option>
                                    <option>4K</option>
                                </select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">AI Overlay:</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        defaultChecked
                                        title="Toggle AI overlay display"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* AI Analysis Panel */}
            <section className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <User className="w-8 h-8 text-success-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">Child Tracking</h3>
                        <p className="text-sm text-gray-500 mt-1">Active and visible</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <div className="w-8 h-8 bg-warning-600 rounded"></div>
                        </div>
                        <h3 className="font-medium text-gray-900">Danger Zones</h3>
                        <p className="text-sm text-gray-500 mt-1">2 zones highlighted</p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Camera className="w-8 h-8 text-primary-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">Activity Detection</h3>
                        <p className="text-sm text-gray-500 mt-1">Reading activity</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ParentLiveView
