import React, { useState } from 'react'
import { Map, AlertTriangle, Settings, Eye, EyeOff } from 'lucide-react'

const ParentDangerZoneMap: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<number | null>(null)
  const [showAlerts, setShowAlerts] = useState(true)

  const dangerZones = [
    {
      id: 1,
      name: 'Playground Equipment',
      type: 'Climbing Risk',
      severity: 'High',
      alertCount: 15,
      lastAlert: '2 hours ago',
      coordinates: { x: 150, y: 100, width: 80, height: 60 }
    },
    {
      id: 2,
      name: 'Staircase Area',
      type: 'Fall Risk',
      severity: 'High',
      alertCount: 8,
      lastAlert: '1 day ago',
      coordinates: { x: 300, y: 200, width: 60, height: 40 }
    },
    {
      id: 3,
      name: 'Kitchen Entrance',
      type: 'Restricted Area',
      severity: 'Medium',
      alertCount: 3,
      lastAlert: '3 days ago',
      coordinates: { x: 400, y: 150, width: 70, height: 50 }
    },
    {
      id: 4,
      name: 'Exit Door',
      type: 'Wandering Risk',
      severity: 'Medium',
      alertCount: 12,
      lastAlert: '5 hours ago',
      coordinates: { x: 50, y: 250, width: 40, height: 80 }
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'border-danger-500 bg-danger-100'
      case 'Medium': return 'border-warning-500 bg-warning-100'
      case 'Low': return 'border-gray-500 bg-gray-100'
      default: return 'border-gray-500 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Danger Zone Map</h1>
          <p className="text-gray-600 mt-2">Interactive classroom map with AI-identified danger zones</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showAlerts ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {showAlerts ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>Show Alerts</span>
          </button>
          
          <button className="btn-secondary flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <section className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Classroom Layout</h2>
            <Map className="w-5 h-5 text-primary-500" />
          </div>
          
          <div className="relative bg-gray-50 rounded-lg overflow-hidden" style={{ height: '400px' }}>
            {/* Classroom Layout Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
              {/* Room Elements */}
              <div className="absolute top-4 left-4 w-20 h-16 bg-blue-200 rounded opacity-50" title="Reading Corner" />
              <div className="absolute top-4 right-4 w-24 h-20 bg-yellow-200 rounded opacity-50" title="Art Station" />
              <div className="absolute bottom-4 left-4 w-32 h-24 bg-green-200 rounded opacity-50" title="Play Area" />
              <div className="absolute bottom-4 right-4 w-28 h-18 bg-purple-200 rounded opacity-50" title="Quiet Zone" />
            </div>
            
            {/* Danger Zones */}
            {dangerZones.map((zone) => (
              <div
                key={zone.id}
                className={`absolute border-2 border-dashed cursor-pointer transition-all duration-200 ${
                  getSeverityColor(zone.severity)
                } ${selectedZone === zone.id ? 'ring-2 ring-primary-500' : ''}`}
                style={{
                  left: `${zone.coordinates.x}px`,
                  top: `${zone.coordinates.y}px`,
                  width: `${zone.coordinates.width}px`,
                  height: `${zone.coordinates.height}px`
                }}
                onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                title={zone.name}
              >
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-danger-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-2 h-2 text-white" />
                </div>
                {showAlerts && (
                  <div className="absolute top-1 left-1 text-xs font-medium text-gray-700">
                    {zone.alertCount}
                  </div>
                )}
              </div>
            ))}
            
            {/* Child Position Indicator */}
            <div className="absolute top-32 left-32 w-3 h-3 bg-primary-500 rounded-full animate-pulse" title="Child Current Position">
              <div className="absolute -inset-1 bg-primary-300 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                <span>Child Position</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
                <span>High Risk Zone</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                <span>Medium Risk Zone</span>
              </div>
            </div>
            <span>Last updated: 2 minutes ago</span>
          </div>
        </section>

        {/* Zone Details */}
        <aside className="space-y-4">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Zone Details</h2>
            
            {selectedZone ? (
              <div className="space-y-4">
                {dangerZones
                  .filter(zone => zone.id === selectedZone)
                  .map(zone => (
                    <div key={zone.id}>
                      <h3 className="font-medium text-gray-900">{zone.name}</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Type:</span>
                          <span className="text-sm font-medium">{zone.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Severity:</span>
                          <span className={`text-sm font-medium ${
                            zone.severity === 'High' ? 'text-danger-600' :
                            zone.severity === 'Medium' ? 'text-warning-600' :
                            'text-gray-600'
                          }`}>
                            {zone.severity}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Alerts:</span>
                          <span className="text-sm font-medium">{zone.alertCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Last Alert:</span>
                          <span className="text-sm font-medium">{zone.lastAlert}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Click on a danger zone to view details
              </p>
            )}
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Zone Statistics</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Zones:</span>
                <span className="text-sm font-medium">{dangerZones.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">High Risk:</span>
                <span className="text-sm font-medium text-danger-600">
                  {dangerZones.filter(z => z.severity === 'High').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Medium Risk:</span>
                <span className="text-sm font-medium text-warning-600">
                  {dangerZones.filter(z => z.severity === 'Medium').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Alerts Today:</span>
                <span className="text-sm font-medium">
                  {dangerZones.reduce((sum, zone) => sum + zone.alertCount, 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Learning Status</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Learning Progress:</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                AI is continuously learning and updating danger zones based on observed patterns.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ParentDangerZoneMap
