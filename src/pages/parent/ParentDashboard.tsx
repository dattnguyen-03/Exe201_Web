import React from 'react'
import { MapPin, Activity, AlertTriangle, Camera, Clock, CheckCircle } from 'lucide-react'

const ParentDashboard: React.FC = () => {
  const childStatus = {
    name: 'Emma Johnson',
    location: 'Classroom A',
    activity: 'Reading Time',
    status: 'Safe'
  }

  const recentAlerts = [
    {
      id: 1,
      type: 'Climbing',
      time: '10:30 AM',
      location: 'Playground',
      severity: 'Medium',
      resolved: false
    },
    {
      id: 2,
      type: 'Out of Zone',
      time: '9:45 AM',
      location: 'Hallway',
      severity: 'Low',
      resolved: true
    },
    {
      id: 3,
      type: 'Collision Risk',
      time: '9:15 AM',
      location: 'Classroom A',
      severity: 'High',
      resolved: true
    }
  ]

  const cameraStatus = [
    { id: 1, location: 'Classroom A', status: 'Active', recording: true },
    { id: 2, location: 'Playground', status: 'Active', recording: true },
    { id: 3, location: 'Hallway', status: 'Disconnected', recording: false },
    { id: 4, location: 'Cafeteria', status: 'Active', recording: true }
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
        <p className="text-gray-600 mt-2">Real-time overview of your child's status and activities</p>
      </header>

      {/* Child Status Card */}
      <section className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Child Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-100 rounded-full">
              <MapPin className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Location</p>
              <p className="font-semibold text-gray-900">{childStatus.location}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-success-100 rounded-full">
              <Activity className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Activity</p>
              <p className="font-semibold text-gray-900">{childStatus.activity}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-success-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Safety Status</p>
              <p className="font-semibold text-success-600">{childStatus.status}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-warning-100 rounded-full">
              <Clock className="w-6 h-6 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Update</p>
              <p className="font-semibold text-gray-900">2 min ago</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <section className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Alerts</h2>
            <AlertTriangle className="w-5 h-5 text-warning-500" />
          </div>
          
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <article key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{alert.type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.severity === 'High' ? 'bg-danger-100 text-danger-700' :
                      alert.severity === 'Medium' ? 'bg-warning-100 text-warning-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{alert.location} • {alert.time}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {alert.resolved ? (
                    <CheckCircle className="w-5 h-5 text-success-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-warning-500" />
                  )}
                </div>
              </article>
            ))}
          </div>
          
          <div className="mt-4">
            <button className="w-full btn-secondary">View All Alerts</button>
          </div>
        </section>

        {/* Camera Status */}
        <section className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Camera & AI Status</h2>
            <Camera className="w-5 h-5 text-primary-500" />
          </div>
          
          <div className="space-y-3">
            {cameraStatus.map((camera) => (
              <article key={camera.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{camera.location}</p>
                  <p className="text-sm text-gray-500">
                    {camera.recording ? 'Recording' : 'Not Recording'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={camera.status === 'Active' ? 'status-active' : 'status-inactive'}>
                    {camera.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
          
          <div className="mt-4">
            <button className="w-full btn-secondary">View Live Feed</button>
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <section className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors">
            <Camera className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-primary-700">Live View</span>
          </button>
          
          <button className="p-4 bg-warning-50 hover:bg-warning-100 rounded-lg text-center transition-colors">
            <AlertTriangle className="w-6 h-6 text-warning-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-warning-700">View Alerts</span>
          </button>
          
          <button className="p-4 bg-success-50 hover:bg-success-100 rounded-lg text-center transition-colors">
            <Activity className="w-6 h-6 text-success-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-success-700">Behavior Report</span>
          </button>
          
          <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors">
            <MapPin className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">Danger Zones</span>
          </button>
        </div>
      </section>
    </div>
  )
}

export default ParentDashboard
