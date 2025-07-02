import React from 'react'
import { Users, Camera, AlertTriangle, BarChart3, Activity, TrendingUp, Shield } from 'lucide-react'

const AdminDashboard: React.FC = () => {
  const systemStats = {
    totalChildren: 245,
    totalClasses: 12,
    activeCameras: 18,
    totalAlerts: 47
  }

  const recentAlerts = [
    {
      id: 1,
      child: 'Emma Johnson',
      class: 'Kindergarten A',
      type: 'Climbing',
      severity: 'High',
      time: '10:30 AM',
      location: 'Playground'
    },
    {
      id: 2,
      child: 'Michael Chen',
      class: 'Grade 1B',
      type: 'Out of Zone',
      severity: 'Medium',
      time: '9:45 AM',
      location: 'Hallway'
    },
    {
      id: 3,
      child: 'Sofia Rodriguez',
      class: 'Kindergarten B',
      type: 'Collision Risk',
      severity: 'High',
      time: '9:15 AM',
      location: 'Cafeteria'
    }
  ]

  const alertsByClass = [
    { class: 'Kindergarten A', alerts: 12, trend: 'up' },
    { class: 'Kindergarten B', alerts: 8, trend: 'down' },
    { class: 'Grade 1A', alerts: 15, trend: 'up' },
    { class: 'Grade 1B', alerts: 6, trend: 'stable' },
    { class: 'Grade 2A', alerts: 4, trend: 'down' }
  ]

  const cameraStatus = [
    { location: 'Classroom A', status: 'Active', health: 98 },
    { location: 'Playground', status: 'Active', health: 95 },
    { location: 'Hallway 1', status: 'Maintenance', health: 0 },
    { location: 'Cafeteria', status: 'Active', health: 92 }
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System-wide overview and monitoring</p>
      </header>

      {/* System Statistics */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Children</p>
              <p className="text-3xl font-bold text-gray-900">{systemStats.totalChildren}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Classes</p>
              <p className="text-3xl font-bold text-gray-900">{systemStats.totalClasses}</p>
            </div>
            <div className="p-3 bg-success-100 rounded-full">
              <BarChart3 className="w-8 h-8 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Cameras</p>
              <p className="text-3xl font-bold text-gray-900">{systemStats.activeCameras}</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-full">
              <Camera className="w-8 h-8 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Alerts</p>
              <p className="text-3xl font-bold text-gray-900">{systemStats.totalAlerts}</p>
            </div>
            <div className="p-3 bg-danger-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-danger-600" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <section className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent System Alerts</h2>
            <AlertTriangle className="w-5 h-5 text-warning-500" />
          </div>
          
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{alert.child}</span>
                    <span className="text-sm text-gray-500">({alert.class})</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.severity === 'High' ? 'bg-danger-100 text-danger-700' :
                      alert.severity === 'Medium' ? 'bg-warning-100 text-warning-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{alert.type} • {alert.location} • {alert.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 btn-secondary">View All Alerts</button>
        </section>

        {/* Alert Statistics by Class */}
        <section className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Alerts by Class</h2>
            <BarChart3 className="w-5 h-5 text-primary-500" />
          </div>
          
          <div className="space-y-3">
            {alertsByClass.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.class}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{item.alerts} alerts</span>
                      <TrendingUp className={`w-4 h-4 ${
                        item.trend === 'up' ? 'text-danger-500' :
                        item.trend === 'down' ? 'text-success-500' :
                        'text-gray-400'
                      }`} />
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.alerts / 20) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Camera and AI System Health */}
      <section className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Camera & AI System Health</h2>
          <Shield className="w-5 h-5 text-primary-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cameraStatus.map((camera, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{camera.location}</h3>
                <span className={camera.status === 'Active' ? 'status-active' : 'status-inactive'}>
                  {camera.status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      camera.health > 90 ? 'bg-success-500' :
                      camera.health > 70 ? 'bg-warning-500' :
                      'bg-danger-500'
                    }`}
                    style={{ width: `${camera.health}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">{camera.health}%</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600">94%</div>
            <div className="text-sm text-gray-500">Overall System Health</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">18/20</div>
            <div className="text-sm text-gray-500">Cameras Online</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600">2</div>
            <div className="text-sm text-gray-500">Maintenance Required</div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors">
            <Users className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-primary-700">Manage Classes</span>
          </button>
          
          <button className="p-4 bg-warning-50 hover:bg-warning-100 rounded-lg text-center transition-colors">
            <AlertTriangle className="w-6 h-6 text-warning-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-warning-700">View Alerts</span>
          </button>
          
          <button className="p-4 bg-success-50 hover:bg-success-100 rounded-lg text-center transition-colors">
            <BarChart3 className="w-6 h-6 text-success-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-success-700">Generate Report</span>
          </button>
          
          <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors">
            <Camera className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">Camera Playback</span>
          </button>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard
