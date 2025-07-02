import React, { useState } from 'react'
import { BarChart3, Download, Calendar, Filter, TrendingUp, Users, AlertTriangle } from 'lucide-react'

const AdminReports: React.FC = () => {
  const [reportType, setReportType] = useState('behavior')
  const [timeRange, setTimeRange] = useState('week')

  const reportData = {
    behavior: {
      totalAlerts: 156,
      resolvedAlerts: 142,
      averagePerDay: 22,
      mostCommonType: 'Climbing'
    },
    class: {
      totalClasses: 12,
      averageStudents: 21,
      highestAlerts: 'Kindergarten A',
      lowestAlerts: 'Grade 2B'
    },
    safety: {
      incidentRate: 2.3,
      responseTime: '3.2 min',
      resolutionRate: 91,
      criticalAlerts: 8
    }
  }

  const classComparison = [
    { class: 'Kindergarten A', alerts: 45, trend: 'up', students: 22 },
    { class: 'Kindergarten B', alerts: 32, trend: 'down', students: 20 },
    { class: 'Grade 1A', alerts: 28, trend: 'stable', students: 25 },
    { class: 'Grade 1B', alerts: 19, trend: 'down', students: 23 },
    { class: 'Grade 2A', alerts: 15, trend: 'down', students: 24 },
    { class: 'Grade 2B', alerts: 12, trend: 'stable', students: 21 }
  ]

  const behaviorTrends = [
    { type: 'Climbing', count: 67, percentage: 43, trend: 'up' },
    { type: 'Out of Zone', count: 34, percentage: 22, trend: 'down' },
    { type: 'Wandering', count: 28, percentage: 18, trend: 'stable' },
    { type: 'Collision Risk', count: 19, percentage: 12, trend: 'up' },
    { type: 'Other', count: 8, percentage: 5, trend: 'down' }
  ]

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Reports & Analysis</h1>
          <p className="text-gray-600 mt-2">Comprehensive analytics and reporting</p>
        </div>

        <button className="btn-primary flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </header>

      {/* Report Controls */}
      <section className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Report Configuration</h2>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              className="input-field"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              title="Select report type"
            >
              <option value="behavior">Behavior Analysis</option>
              <option value="class">Class Comparison</option>
              <option value="safety">Safety Metrics</option>
              <option value="system">System Performance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              className="input-field"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              title="Select time range"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class Filter</label>
            <select className="input-field" title="Select class filter">
              <option value="all">All Classes</option>
              <option value="kg">Kindergarten Only</option>
              <option value="grade1">Grade 1 Only</option>
              <option value="grade2">Grade 2 Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select className="input-field" title="Select export format">
              <option value="pdf">PDF Report</option>
              <option value="excel">Excel Spreadsheet</option>
              <option value="csv">CSV Data</option>
            </select>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Alerts</p>
              <p className="text-3xl font-bold text-gray-900">{reportData.behavior.totalAlerts}</p>
              <p className="text-sm text-success-600">+12% from last week</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <AlertTriangle className="w-8 h-8 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Resolution Rate</p>
              <p className="text-3xl font-bold text-gray-900">91%</p>
              <p className="text-sm text-success-600">+3% improvement</p>
            </div>
            <div className="p-3 bg-success-100 rounded-full">
              <TrendingUp className="w-8 h-8 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Response Time</p>
              <p className="text-3xl font-bold text-gray-900">3.2m</p>
              <p className="text-sm text-warning-600">-0.5m faster</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-full">
              <BarChart3 className="w-8 h-8 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Students</p>
              <p className="text-3xl font-bold text-gray-900">245</p>
              <p className="text-sm text-gray-600">Across 12 classes</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <Users className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Comparison */}
        <section className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Class Comparison</h2>
            <BarChart3 className="w-5 h-5 text-primary-500" />
          </div>

          <div className="space-y-4">
            {classComparison.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.class}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{item.alerts} alerts</span>
                      <TrendingUp className={`w-4 h-4 ${item.trend === 'up' ? 'text-danger-500' :
                        item.trend === 'down' ? 'text-success-500' :
                          'text-gray-400'
                        }`} />
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.alerts / 50) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.students} students</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Behavior Trends */}
        <section className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Behavior Trends</h2>
            <AlertTriangle className="w-5 h-5 text-warning-500" />
          </div>

          <div className="space-y-4">
            {behaviorTrends.map((behavior, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{behavior.type}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{behavior.count} ({behavior.percentage}%)</span>
                      <TrendingUp className={`w-4 h-4 ${behavior.trend === 'up' ? 'text-danger-500' :
                        behavior.trend === 'down' ? 'text-success-500' :
                          'text-gray-400'
                        }`} />
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-warning-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${behavior.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Detailed Analysis */}
      <section className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Analysis</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-primary-50 rounded-lg">
            <h3 className="font-medium text-primary-900 mb-2">Peak Activity Times</h3>
            <ul className="text-sm text-primary-700 space-y-1">
              <li>• 10:00 AM - 11:00 AM (Playground time)</li>
              <li>• 2:00 PM - 3:00 PM (Afternoon activities)</li>
              <li>• 11:30 AM - 12:30 PM (Lunch period)</li>
            </ul>
          </div>

          <div className="p-4 bg-warning-50 rounded-lg">
            <h3 className="font-medium text-warning-900 mb-2">Areas of Concern</h3>
            <ul className="text-sm text-warning-700 space-y-1">
              <li>• Playground equipment climbing</li>
              <li>• Hallway wandering during transitions</li>
              <li>• Cafeteria collision risks</li>
            </ul>
          </div>

          <div className="p-4 bg-success-50 rounded-lg">
            <h3 className="font-medium text-success-900 mb-2">Improvements</h3>
            <ul className="text-sm text-success-700 space-y-1">
              <li>• 15% reduction in out-of-zone alerts</li>
              <li>• Faster response times</li>
              <li>• Better parent communication</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Export Options */}
      <section className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Options</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors">
            <Download className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-primary-700">Weekly Report</span>
          </button>

          <button className="p-4 bg-success-50 hover:bg-success-100 rounded-lg text-center transition-colors">
            <BarChart3 className="w-6 h-6 text-success-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-success-700">Monthly Analysis</span>
          </button>

          <button className="p-4 bg-warning-50 hover:bg-warning-100 rounded-lg text-center transition-colors">
            <Users className="w-6 h-6 text-warning-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-warning-700">Class Summary</span>
          </button>

          <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors">
            <AlertTriangle className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">Safety Report</span>
          </button>
        </div>
      </section>
    </div>
  )
}

export default AdminReports
