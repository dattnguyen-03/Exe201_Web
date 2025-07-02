import React, { useState } from 'react'
import { BarChart3, TrendingUp, Calendar, Download, Activity } from 'lucide-react'

const ParentBehaviorReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week')
  const [reportType, setReportType] = useState('activity')

  const activityData = [
    { day: 'Mon', active: 85, wandering: 10, climbing: 5 },
    { day: 'Tue', active: 90, wandering: 8, climbing: 2 },
    { day: 'Wed', active: 75, wandering: 15, climbing: 10 },
    { day: 'Thu', active: 88, wandering: 7, climbing: 5 },
    { day: 'Fri', active: 92, wandering: 5, climbing: 3 },
    { day: 'Sat', active: 80, wandering: 12, climbing: 8 },
    { day: 'Sun', active: 85, wandering: 10, climbing: 5 }
  ]

  const behaviorProfile = {
    frequentBehaviors: [
      { behavior: 'Active Play', percentage: 75, trend: 'up' },
      { behavior: 'Quiet Activities', percentage: 60, trend: 'stable' },
      { behavior: 'Social Interaction', percentage: 85, trend: 'up' },
      { behavior: 'Wandering', percentage: 15, trend: 'down' },
      { behavior: 'Climbing', percentage: 8, trend: 'down' }
    ],
    riskFactors: [
      { factor: 'Unsupervised Areas', level: 'Low', color: 'success' },
      { factor: 'High Activity Periods', level: 'Medium', color: 'warning' },
      { factor: 'Peer Interactions', level: 'Low', color: 'success' }
    ]
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Behavior Reports</h1>
          <p className="text-gray-600 mt-2">Comprehensive analysis of your child's activity patterns</p>
        </div>

        <button className="btn-primary flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </header>

      {/* Report Controls */}
      <section className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Report Settings</h2>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              className="input-field"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              title="Select report type"
            >
              <option value="activity">Activity Analysis</option>
              <option value="behavior">Behavior Patterns</option>
              <option value="safety">Safety Incidents</option>
              <option value="social">Social Interactions</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comparison</label>
            <select className="input-field" title="Select comparison type">
              <option value="none">No Comparison</option>
              <option value="previous">Previous Period</option>
              <option value="average">Class Average</option>
              <option value="baseline">Personal Baseline</option>
            </select>
          </div>
        </div>
      </section>

      {/* Activity Chart */}
      <section className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Weekly Activity Overview</h2>
          <BarChart3 className="w-5 h-5 text-primary-500" />
        </div>

        <div className="space-y-4">
          {activityData.map((day) => (
            <div key={day.day} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{day.day}</span>
                <span className="text-sm text-gray-500">Total: {day.active + day.wandering + day.climbing}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className="h-full flex">
                  <div
                    className="bg-success-500"
                    style={{ width: `${day.active}%` }}
                    title={`Active: ${day.active}%`}
                  />
                  <div
                    className="bg-warning-500"
                    style={{ width: `${day.wandering}%` }}
                    title={`Wandering: ${day.wandering}%`}
                  />
                  <div
                    className="bg-danger-500"
                    style={{ width: `${day.climbing}%` }}
                    title={`Climbing: ${day.climbing}%`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Active Play</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Wandering</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Climbing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Behavior Profile */}
      <section className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Behavior Profile</h2>
          <TrendingUp className="w-5 h-5 text-primary-500" />
        </div>

        <div className="space-y-4">
          {behaviorProfile.frequentBehaviors.map((behavior, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{behavior.behavior}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{behavior.percentage}%</span>
                    <TrendingUp className={`w-4 h-4 ${behavior.trend === 'up' ? 'text-success-500' :
                      behavior.trend === 'down' ? 'text-danger-500' :
                        'text-gray-400'
                      }`} />
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${behavior.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Risk Assessment */}
      <section className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h2>

        <div className="space-y-4">
          {behaviorProfile.riskFactors.map((factor, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">{factor.factor}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${factor.level === 'Low' ? 'bg-success-100 text-success-700' :
                factor.level === 'Medium' ? 'bg-warning-100 text-warning-700' :
                  'bg-danger-100 text-danger-700'
                }`}>
                {factor.level} Risk
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h2>

        <div className="space-y-3">
          <div className="p-4 bg-primary-50 rounded-lg">
            <h3 className="font-medium text-primary-900 mb-2">Positive Reinforcement</h3>
            <p className="text-sm text-primary-700">
              Emma shows excellent social interaction skills. Continue encouraging group activities and collaborative play.
            </p>
          </div>

          <div className="p-4 bg-warning-50 rounded-lg">
            <h3 className="font-medium text-warning-900 mb-2">Areas for Attention</h3>
            <p className="text-sm text-warning-700">
              Monitor climbing behavior during playground time. Consider additional supervision near equipment areas.
            </p>
          </div>

          <div className="p-4 bg-success-50 rounded-lg">
            <h3 className="font-medium text-success-900 mb-2">Progress Noted</h3>
            <p className="text-sm text-success-700">
              Significant improvement in staying within designated areas. Wandering incidents have decreased by 40%.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ParentBehaviorReports
