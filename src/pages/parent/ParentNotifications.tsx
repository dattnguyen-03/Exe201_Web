import React, { useState } from 'react'
import { MessageSquare, Send, Phone, Mail, Bell, Clock, User, AlertTriangle } from 'lucide-react'

const ParentNotifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState('messages')
  const [newMessage, setNewMessage] = useState('')

  const messages = [
    {
      id: 1,
      from: 'Teacher Sarah',
      subject: 'Emma\'s Progress Update',
      message: 'Emma had a wonderful day today! She participated actively in reading time and showed great improvement in her social interactions.',
      timestamp: '2 hours ago',
      read: false,
      type: 'message'
    },
    {
      id: 2,
      from: 'System Alert',
      subject: 'Climbing Alert Resolved',
      message: 'The climbing alert from playground has been reviewed and marked as resolved. Emma was safely supervised during play.',
      timestamp: '4 hours ago',
      read: true,
      type: 'alert'
    },
    {
      id: 3,
      from: 'School Admin',
      subject: 'Weekly Report Available',
      message: 'Your child\'s weekly behavior report is now available. You can view it in the Reports section.',
      timestamp: '1 day ago',
      read: true,
      type: 'notification'
    },
    {
      id: 4,
      from: 'Teacher Sarah',
      subject: 'Pickup Reminder',
      message: 'Just a friendly reminder that pickup time is 3:30 PM today. Emma will be waiting in the main classroom.',
      timestamp: '2 days ago',
      read: true,
      type: 'message'
    }
  ]

  const notifications = [
    {
      id: 1,
      title: 'High Priority Alert',
      message: 'Climbing behavior detected in playground area',
      timestamp: '1 hour ago',
      priority: 'high',
      read: false
    },
    {
      id: 2,
      title: 'Weekly Report Ready',
      message: 'Your child\'s weekly behavior analysis is available',
      timestamp: '3 hours ago',
      priority: 'medium',
      read: false
    },
    {
      id: 3,
      title: 'System Update',
      message: 'Camera system maintenance completed successfully',
      timestamp: '6 hours ago',
      priority: 'low',
      read: true
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-danger-100 text-danger-700'
      case 'medium': return 'bg-warning-100 text-warning-700'
      case 'low': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-4 h-4" />
      case 'alert': return <Bell className="w-4 h-4" />
      case 'notification': return <Mail className="w-4 h-4" />
      default: return <Mail className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Notifications & Chat</h1>
        <p className="text-gray-600 mt-2">Stay connected with teachers and receive important updates</p>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'messages'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Messages
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'notifications'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Bell className="w-4 h-4 inline mr-2" />
            Notifications
          </button>
        </nav>
      </div>

      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <section className="lg:col-span-2 space-y-4">
            {messages.map((message) => (
              <article key={message.id} className={`card cursor-pointer transition-colors hover:bg-gray-50 ${!message.read ? 'border-primary-200 bg-primary-50' : ''
                }`}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {getTypeIcon(message.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">{message.from}</h3>
                        {!message.read && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{message.timestamp}</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-medium text-gray-900 mt-1">{message.subject}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message.message}</p>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* Chat/Compose */}
          <aside className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Message</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <select className="input-field" title="Select message recipient">
                    <option>Teacher Sarah</option>
                    <option>School Admin</option>
                    <option>Principal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input type="text" className="input-field" placeholder="Enter subject" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    className="input-field"
                    rows={4}
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>

                <button className="w-full btn-primary flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button className="w-full p-3 bg-primary-50 hover:bg-primary-100 rounded-lg text-left transition-colors">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-primary-900">Request Call</p>
                      <p className="text-xs text-primary-600">Schedule a phone call</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-3 bg-warning-50 hover:bg-warning-100 rounded-lg text-left transition-colors">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-warning-600" />
                    <div>
                      <p className="text-sm font-medium text-warning-900">Report Issue</p>
                      <p className="text-xs text-warning-600">Report a concern or issue</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-3 bg-success-50 hover:bg-success-100 rounded-lg text-left transition-colors">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-success-600" />
                    <div>
                      <p className="text-sm font-medium text-success-900">Quick Message</p>
                      <p className="text-xs text-success-600">Send a quick message</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <article key={notification.id} className={`card cursor-pointer transition-colors hover:bg-gray-50 ${!notification.read ? 'border-primary-200 bg-primary-50' : ''
              }`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.priority === 'high' ? 'bg-danger-100' :
                      notification.priority === 'medium' ? 'bg-warning-100' :
                        'bg-gray-100'
                    }`}>
                    <Bell className={`w-5 h-5 ${notification.priority === 'high' ? 'text-danger-600' :
                        notification.priority === 'medium' ? 'text-warning-600' :
                          'text-gray-600'
                      }`} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{notification.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                      {notification.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default ParentNotifications
