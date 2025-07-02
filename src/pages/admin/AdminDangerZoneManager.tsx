import React, { useState } from 'react'
import { MapPin, Plus, Edit, Trash2, Settings, Save, AlertTriangle } from 'lucide-react'

const AdminDangerZoneManager: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)

  const dangerZones = [
    {
      id: 1,
      name: 'Playground Equipment Area',
      type: 'Climbing Risk',
      severity: 'High',
      alertCount: 25,
      enabled: true,
      coordinates: { x: 150, y: 100, width: 120, height: 80 },
      description: 'High climbing equipment with fall risk',
      alertThreshold: 'Medium',
      autoUpdate: true
    },
    {
      id: 2,
      name: 'Main Staircase',
      type: 'Fall Risk',
      severity: 'High',
      alertCount: 12,
      enabled: true,
      coordinates: { x: 350, y: 200, width: 80, height: 60 },
      description: 'Staircase area with potential fall hazards',
      alertThreshold: 'High',
      autoUpdate: false
    },
    {
      id: 3,
      name: 'Kitchen Entrance',
      type: 'Restricted Area',
      severity: 'Medium',
      alertCount: 8,
      enabled: true,
      coordinates: { x: 450, y: 150, width: 90, height: 70 },
      description: 'Restricted access to kitchen area',
      alertThreshold: 'Low',
      autoUpdate: true
    },
    {
      id: 4,
      name: 'Emergency Exit',
      type: 'Wandering Risk',
      severity: 'Medium',
      alertCount: 15,
      enabled: true,
      coordinates: { x: 50, y: 250, width: 60, height: 100 },
      description: 'Emergency exit door monitoring',
      alertThreshold: 'Medium',
      autoUpdate: true
    },
    {
      id: 5,
      name: 'Storage Room',
      type: 'Restricted Area',
      severity: 'Low',
      alertCount: 3,
      enabled: false,
      coordinates: { x: 300, y: 50, width: 70, height: 50 },
      description: 'Storage area with cleaning supplies',
      alertThreshold: 'High',
      autoUpdate: false
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
          <h1 className="text-3xl font-bold text-gray-900">Danger Zone Manager</h1>
          <p className="text-gray-600 mt-2">Configure and manage safety zones across the school</p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${editMode ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-600'
              }`}
          >
            <Edit className="w-4 h-4" />
            <span>{editMode ? 'Exit Edit Mode' : 'Edit Zones'}</span>
          </button>

          <button className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add New Zone</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <section className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">School Layout</h2>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary-500" />
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="relative bg-gray-50 rounded-lg overflow-hidden" style={{ height: '500px' }}>
            {/* School Layout Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
              {/* Building Elements */}
              <div className="absolute top-8 left-8 w-32 h-24 bg-blue-200 rounded opacity-50" title="Main Building" />
              <div className="absolute top-8 right-8 w-28 h-32 bg-yellow-200 rounded opacity-50" title="Gymnasium" />
              <div className="absolute bottom-8 left-8 w-40 h-32 bg-green-200 rounded opacity-50" title="Playground" />
              <div className="absolute bottom-8 right-8 w-36 h-28 bg-purple-200 rounded opacity-50" title="Cafeteria" />

              {/* Pathways */}
              <div className="absolute top-1/2 left-0 right-0 h-4 bg-gray-300 opacity-30" title="Main Hallway" />
              <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-gray-300 opacity-30" title="Cross Hallway" />
            </div>

            {/* Danger Zones */}
            {dangerZones.map((zone) => (
              <div
                key={zone.id}
                className={`absolute border-2 border-dashed cursor-pointer transition-all duration-200 ${getSeverityColor(zone.severity)
                  } ${selectedZone === zone.id ? 'ring-2 ring-primary-500' : ''} ${!zone.enabled ? 'opacity-50' : ''
                  }`}
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
                <div className="absolute top-1 left-1 text-xs font-medium text-gray-700">
                  {zone.alertCount}
                </div>
                {editMode && (
                  <div className="absolute -top-1 -right-1 flex space-x-1">
                    <button
                      className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center"
                      title="Edit zone"
                    >
                      <Edit className="w-2 h-2 text-white" />
                    </button>
                    <button
                      className="w-4 h-4 bg-danger-500 rounded-full flex items-center justify-center"
                      title="Delete zone"
                    >
                      <Trash2 className="w-2 h-2 text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
                <span>High Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                <span>Medium Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span>Low Risk</span>
              </div>
            </div>
            <span>Last updated: 5 minutes ago</span>
          </div>
        </section>

        {/* Zone Configuration */}
        <aside className="space-y-6">
          {selectedZone ? (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Zone Configuration</h2>

              {dangerZones
                .filter(zone => zone.id === selectedZone)
                .map(zone => (
                  <div key={zone.id} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Zone Name</label>
                      <input
                        type="text"
                        className="input-field"
                        defaultValue={zone.name}
                        title="Enter zone name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Zone Type</label>
                      <select className="input-field" defaultValue={zone.type} title="Select zone type">
                        <option value="Climbing Risk">Climbing Risk</option>
                        <option value="Fall Risk">Fall Risk</option>
                        <option value="Restricted Area">Restricted Area</option>
                        <option value="Wandering Risk">Wandering Risk</option>
                        <option value="Collision Risk">Collision Risk</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                      <select className="input-field" defaultValue={zone.severity} title="Select severity level">
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alert Threshold</label>
                      <select className="input-field" defaultValue={zone.alertThreshold} title="Select alert threshold">
                        <option value="Low">Low Sensitivity</option>
                        <option value="Medium">Medium Sensitivity</option>
                        <option value="High">High Sensitivity</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        className="input-field"
                        rows={3}
                        defaultValue={zone.description}
                        title="Enter zone description"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Enable Zone</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={zone.enabled}
                            title="Toggle zone enabled status"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Auto-Update with AI</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            defaultChecked={zone.autoUpdate}
                            title="Toggle auto-update with AI"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Alerts:</span>
                        <span className="font-medium">{zone.alertCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">This Week:</span>
                        <span className="font-medium">{Math.floor(zone.alertCount * 0.3)}</span>
                      </div>
                    </div>

                    <button className="w-full btn-primary flex items-center justify-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Zone Overview</h2>
              <p className="text-gray-500 text-center py-8">
                Click on a danger zone to configure its settings
              </p>
            </div>
          )}

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Zone Statistics</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Zones:</span>
                <span className="text-sm font-medium">{dangerZones.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Active Zones:</span>
                <span className="text-sm font-medium text-success-600">
                  {dangerZones.filter(z => z.enabled).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">High Risk:</span>
                <span className="text-sm font-medium text-danger-600">
                  {dangerZones.filter(z => z.severity === 'High').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Auto-Learning:</span>
                <span className="text-sm font-medium text-primary-600">
                  {dangerZones.filter(z => z.autoUpdate).length}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Learning Status</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Learning Progress:</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                AI continuously analyzes patterns and suggests zone updates based on observed behaviors.
              </p>

              <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-700 font-medium">Recent AI Suggestions:</p>
                <ul className="text-xs text-primary-600 mt-1 space-y-1">
                  <li>• Expand playground equipment zone by 15%</li>
                  <li>• Add new zone near water fountain</li>
                  <li>• Reduce sensitivity for storage room</li>
                </ul>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default AdminDangerZoneManager
