import React, { useState } from 'react'
import { AlertTriangle, Clock, MapPin, Camera, Filter, CheckCircle, X } from 'lucide-react'

const ParentAlertsCenter: React.FC = () => {
  const [filterType, setFilterType] = useState('all')
  const [filterDate, setFilterDate] = useState('today')

  const alerts = [
    {
      id: 1,
      type: 'Climbing',
      severity: 'High',
      time: '10:30 AM',
      date: '2024-01-15',
      location: 'Playground',
      description: 'Child detected climbing on unsafe equipment',
      status: 'pending',
      hasMedia: true,
      confirmed: null
    },
    {
      id: 2,
      type: 'Out of Zone',
      severity: 'Medium',
      time: '9:45 AM',
      date: '2024-01-15',
      location: 'Hallway',
      description: 'Child moved outside designated safe area',
      status: 'confirmed',
      hasMedia: false,
      confirmed: true
    },
    {
      id: 3,
      type: 'Collision Risk',
      severity: 'High',
      time: '9:15 AM',
      date: '2024-01-15',
      location: 'Classroom A',
      description: 'Potential collision detected with another child',
      status: 'resolved',
      hasMedia: true,
      confirmed: false
    },
    {
      id: 4,
      type: 'Wandering',
      severity: 'Low',
      time: '8:30 AM',
      date: '2024-01-14',
      location: 'Cafeteria',
      description: 'Child showing wandering behavior pattern',
      status: 'confirmed',
      hasMedia: false,
      confirmed: true
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-danger-100 text-danger-700'
      case 'Medium': return 'bg-warning-100 text-warning-700'
      case 'Low': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning-100 text-warning-700'
      case 'confirmed': return 'bg-primary-100 text-primary-700'
      case 'resolved': return 'bg-success-100 text-success-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Alerts Center</h1>
        <p className="text-gray-600 mt-2">Monitor and manage safety alerts for your child</p>
      </header>

      {/* Filters */}
      <section className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alert Type</label>
            <select
              className="input-field"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              title="Select alert type filter"
            >
              <option value="all">All Types</option>
              <option value="climbing">Climbing</option>
              <option value="out-of-zone">Out of Zone</option>
              <option value="collision">Collision Risk</option>
              <option value="wandering">Wandering</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              className="input-field"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              title="Select date range filter"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <select className="input-field" title="Select severity filter">
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select className="input-field" title="Select status filter">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </section>

      {/* Alerts List */}
      <section className="space-y-4">
        {alerts.map((alert) => (
          <article key={alert.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <AlertTriangle className={`w-5 h-5 ${alert.severity === 'High' ? 'text-danger-500' :
                      alert.severity === 'Medium' ? 'text-warning-500' :
                        'text-gray-500'
                    }`} />
                  <h3 className="text-lg font-semibold text-gray-900">{alert.type}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                    {alert.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-3">{alert.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{alert.time} - {alert.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{alert.location}</span>
                  </div>
                  {alert.hasMedia && (
                    <div className="flex items-center space-x-1">
                      <Camera className="w-4 h-4" />
                      <span>Media Available</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {alert.hasMedia && (
                  <button className="btn-secondary">
                    View Media
                  </button>
                )}
                <button className="btn-primary">
                  View Details
                </button>
              </div>
            </div>

            {alert.status === 'pending' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Confirm this alert and add notes:</p>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-1 bg-success-100 text-success-700 rounded-lg hover:bg-success-200 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1 bg-danger-100 text-danger-700 rounded-lg hover:bg-danger-200 transition-colors">
                      <X className="w-4 h-4" />
                      <span>False Alert</span>
                    </button>
                  </div>
                </div>
                <textarea
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Add notes about this alert..."
                  rows={2}
                  title="Add notes about this alert"
                />
              </div>
            )}
          </article>
        ))}
      </section>

      {/* Summary Stats */}
      <section className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-danger-600">3</div>
            <div className="text-sm text-gray-500">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600">5</div>
            <div className="text-sm text-gray-500">Medium Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">2</div>
            <div className="text-sm text-gray-500">Low Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600">8</div>
            <div className="text-sm text-gray-500">Resolved Today</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ParentAlertsCenter
