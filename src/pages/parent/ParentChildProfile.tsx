import React, { useState } from 'react'
import { User, Camera, Edit, AlertTriangle, Activity, Calendar, Phone, Mail } from 'lucide-react'

const ParentChildProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)

  const childData = {
    name: 'Emma Johnson',
    age: 5,
    class: 'Kindergarten A',
    birthDate: '2019-03-15',
    parentContact: {
      phone: '+1 (555) 123-4567',
      email: 'parent@example.com'
    },
    emergencyContact: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 987-6543',
      relationship: 'Mother'
    },
    medicalInfo: {
      allergies: ['Peanuts', 'Shellfish'],
      medications: 'None',
      specialNeeds: 'None'
    }
  }

  const alertHistory = [
    { date: '2024-01-15', type: 'Climbing', severity: 'High', resolved: true },
    { date: '2024-01-14', type: 'Out of Zone', severity: 'Medium', resolved: true },
    { date: '2024-01-13', type: 'Wandering', severity: 'Low', resolved: true },
    { date: '2024-01-12', type: 'Collision Risk', severity: 'High', resolved: true },
    { date: '2024-01-11', type: 'Climbing', severity: 'Medium', resolved: true }
  ]

  const behaviorSummary = {
    totalAlerts: 45,
    resolvedAlerts: 42,
    averagePerWeek: 8,
    mostCommonBehavior: 'Active Play',
    riskLevel: 'Low'
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Child Profile</h1>
          <p className="text-gray-600 mt-2">Manage your child's information and view behavior summary</p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-primary flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <section className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <button
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors"
                  title="Upload profile photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{childData.name}</h2>
                <p className="text-gray-600">Age {childData.age} • {childData.class}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Born: {childData.birthDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Parent Phone</p>
                      <p className="font-medium">{childData.parentContact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Parent Email</p>
                      <p className="font-medium">{childData.parentContact.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{childData.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{childData.emergencyContact.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Relationship</p>
                    <p className="font-medium">{childData.emergencyContact.relationship}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Allergies</p>
                <div className="space-y-1">
                  {childData.medicalInfo.allergies.map((allergy, index) => (
                    <span key={index} className="inline-block bg-danger-100 text-danger-700 px-2 py-1 rounded-full text-xs font-medium mr-2">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Medications</p>
                <p className="font-medium">{childData.medicalInfo.medications}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Special Needs</p>
                <p className="font-medium">{childData.medicalInfo.specialNeeds}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Facial Recognition</h3>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">Update Recognition Data</h4>
              <p className="text-sm text-gray-500 mb-4">
                Upload new photos to improve AI recognition accuracy
              </p>
              <button className="btn-primary">Upload Photos</button>
            </div>
          </div>
        </section>

        {/* Behavior Summary */}
        <aside className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Behavior Summary</h3>
              <Activity className="w-5 h-5 text-primary-500" />
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{behaviorSummary.totalAlerts}</div>
                <div className="text-sm text-gray-500">Total Alerts</div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-success-600">{behaviorSummary.resolvedAlerts}</div>
                  <div className="text-xs text-gray-500">Resolved</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-warning-600">{behaviorSummary.averagePerWeek}</div>
                  <div className="text-xs text-gray-500">Per Week</div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Most Common:</span>
                  <span className="text-sm font-medium">{behaviorSummary.mostCommonBehavior}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Risk Level:</span>
                  <span className={`text-sm font-medium ${behaviorSummary.riskLevel === 'Low' ? 'text-success-600' :
                      behaviorSummary.riskLevel === 'Medium' ? 'text-warning-600' :
                        'text-danger-600'
                    }`}>
                    {behaviorSummary.riskLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
              <AlertTriangle className="w-5 h-5 text-warning-500" />
            </div>

            <div className="space-y-3">
              {alertHistory.slice(0, 5).map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.type}</p>
                    <p className="text-xs text-gray-500">{alert.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${alert.severity === 'High' ? 'bg-danger-100 text-danger-700' :
                        alert.severity === 'Medium' ? 'bg-warning-100 text-warning-700' :
                          'bg-gray-100 text-gray-700'
                      }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 btn-secondary">View All Alerts</button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ParentChildProfile
