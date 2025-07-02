import React, { useState } from 'react'
import { Mail, Send, Users, AlertTriangle, Calendar, MessageSquare, Bell } from 'lucide-react'

const AdminCommunicationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('compose')
  const [messageType, setMessageType] = useState('general')
  const [recipients, setRecipients] = useState('all-parents')

  const messageTemplates = [
    {
      id: 1,
      name: 'Emergency Alert',
      type: 'emergency',
      subject: 'URGENT: Emergency Situation',
      content: 'We are currently managing an emergency situation. Please follow the instructions provided by school staff.'
    },
    {
      id: 2,
      name: 'Weekly Report',
      type: 'report',
      subject: 'Weekly Safety Report - Week of [DATE]',
      content: 'This week\'s safety summary includes activity reports and any incidents that occurred.'
    },
    {
      id: 3,
      name: 'System Maintenance',
      type: 'maintenance',
      subject: 'Scheduled System Maintenance',
      content: 'Our monitoring system will undergo scheduled maintenance on [DATE] from [TIME] to [TIME].'
    }
  ]

  const recentMessages = [
    {
      id: 1,
      type: 'Emergency Alert',
      recipients: 'All Parents',
      subject: 'Weather Advisory',
      sentAt: '2 hours ago',
      status: 'delivered',
      readRate: 95
    },
    {
      id: 2,
      type: 'Weekly Report',
      recipients: 'Kindergarten A Parents',
      subject: 'Weekly Safety Summary',
      sentAt: '1 day ago',
      status: 'delivered',
      readRate: 87
    },
    {
      id: 3,
      type: 'Incident Report',
      recipients: 'Individual Parent',
      subject: 'Minor Incident Report - Emma Johnson',
      sentAt: '2 days ago',
      status: 'delivered',
      readRate: 100
    }
  ]

  const recipientGroups = [
    { id: 'all-parents', name: 'All Parents', count: 245 },
    { id: 'all-teachers', name: 'All Teachers', count: 12 },
    { id: 'kg-parents', name: 'Kindergarten Parents', count: 84 },
    { id: 'grade1-parents', name: 'Grade 1 Parents', count: 96 },
    { id: 'grade2-parents', name: 'Grade 2 Parents', count: 65 },
    { id: 'high-alert-parents', name: 'High Alert Parents', count: 15 }
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Communication Center</h1>
        <p className="text-gray-600 mt-2">Send alerts, reports, and messages to parents and staff</p>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('compose')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'compose'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Compose Message
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'templates'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Templates
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Message History
          </button>
        </nav>
      </div>

      {activeTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compose Form */}
          <section className="lg:col-span-2 card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Compose New Message</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
                  <select
                    className="input-field"
                    value={messageType}
                    onChange={(e) => setMessageType(e.target.value)}
                    title="Select message type"
                  >
                    <option value="general">General Update</option>
                    <option value="emergency">Emergency Alert</option>
                    <option value="report">Weekly Report</option>
                    <option value="incident">Incident Report</option>
                    <option value="maintenance">System Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                  <select
                    className="input-field"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    title="Select message recipients"
                  >
                    {recipientGroups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name} ({group.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter message subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
                <textarea
                  className="input-field"
                  rows={8}
                  placeholder="Type your message here..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="email" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="email" className="text-sm text-gray-700">Send via Email</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="sms" className="rounded border-gray-300" />
                  <label htmlFor="sms" className="text-sm text-gray-700">Send via SMS</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="app" className="rounded border-gray-300" defaultChecked />
                  <label htmlFor="app" className="text-sm text-gray-700">Send via App</label>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button className="btn-primary flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
                <button className="btn-secondary">Save as Draft</button>
                <button className="btn-secondary">Preview</button>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <aside className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button className="w-full p-3 bg-danger-50 hover:bg-danger-100 rounded-lg text-left transition-colors">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-danger-600" />
                    <div>
                      <p className="text-sm font-medium text-danger-900">Emergency Alert</p>
                      <p className="text-xs text-danger-600">Send immediate alert to all</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-3 bg-primary-50 hover:bg-primary-100 rounded-lg text-left transition-colors">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-primary-900">Weekly Report</p>
                      <p className="text-xs text-primary-600">Generate and send reports</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-3 bg-warning-50 hover:bg-warning-100 rounded-lg text-left transition-colors">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-warning-600" />
                    <div>
                      <p className="text-sm font-medium text-warning-900">System Notice</p>
                      <p className="text-xs text-warning-600">Maintenance or updates</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipient Statistics</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Parents:</span>
                  <span className="text-sm font-medium">245</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Teachers:</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">High Alert Parents:</span>
                  <span className="text-sm font-medium text-warning-600">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Email Delivery Rate:</span>
                  <span className="text-sm font-medium text-success-600">98%</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messageTemplates.map((template) => (
            <div key={template.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${template.type === 'emergency' ? 'bg-danger-100 text-danger-700' :
                    template.type === 'report' ? 'bg-primary-100 text-primary-700' :
                      'bg-gray-100 text-gray-700'
                  }`}>
                  {template.type}
                </span>
              </div>

              <p className="text-sm font-medium text-gray-900 mb-2">{template.subject}</p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{template.content}</p>

              <div className="flex space-x-2">
                <button className="btn-primary flex-1">Use Template</button>
                <button className="btn-secondary">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          {recentMessages.map((message) => (
            <div key={message.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{message.subject}</h3>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700">
                      {message.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Type:</span> {message.type}
                    </div>
                    <div>
                      <span className="font-medium">Recipients:</span> {message.recipients}
                    </div>
                    <div>
                      <span className="font-medium">Sent:</span> {message.sentAt}
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Read Rate:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                        <div
                          className="bg-success-500 h-2 rounded-full"
                          style={{ width: `${message.readRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{message.readRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button className="btn-secondary">View Details</button>
                  <button className="btn-secondary">Resend</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminCommunicationCenter
