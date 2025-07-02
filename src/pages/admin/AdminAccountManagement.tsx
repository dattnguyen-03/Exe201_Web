import React, { useState } from 'react'
import { Users, Plus, Edit, Trash2, Search, Filter, Shield, Mail, Phone } from 'lucide-react'

const AdminAccountManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const accounts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      phone: '+1 (555) 123-4567',
      role: 'teacher',
      class: 'Kindergarten A',
      status: 'active',
      lastLogin: '2 hours ago'
    },
    {
      id: 2,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 234-5678',
      role: 'parent',
      class: 'Kindergarten A',
      status: 'active',
      lastLogin: '1 day ago'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael.chen@school.edu',
      phone: '+1 (555) 345-6789',
      role: 'teacher',
      class: 'Grade 1B',
      status: 'active',
      lastLogin: '3 hours ago'
    },
    {
      id: 4,
      name: 'Lisa Rodriguez',
      email: 'lisa.rodriguez@email.com',
      phone: '+1 (555) 456-7890',
      role: 'parent',
      class: 'Kindergarten B',
      status: 'inactive',
      lastLogin: '1 week ago'
    },
    {
      id: 5,
      name: 'Emily Davis',
      email: 'emily.davis@school.edu',
      phone: '+1 (555) 567-8901',
      role: 'teacher',
      class: 'Grade 1A',
      status: 'active',
      lastLogin: '1 hour ago'
    }
  ]

  const permissions = [
    {
      role: 'parent',
      permissions: [
        'View own child data',
        'Receive alerts',
        'Access live view',
        'View reports', 'Send messages to teachers'
      ]
    },
    {
      role: 'teacher',
      permissions: [
        'View class data',
        'Manage student profiles',
        'Access live view',
        'Generate reports',
        'Send messages to parents',
        'Confirm alerts'
      ]
    },
    {
      role: 'admin',
      permissions: [
        'Full system access',
        'Manage all accounts',
        'System configuration',
        'Generate all reports',
        'Camera management',
        'Send system-wide alerts'
      ]
    }
  ]

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || account.role === activeTab
    return matchesSearch && matchesTab
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-danger-100 text-danger-700'
      case 'teacher': return 'bg-primary-100 text-primary-700'
      case 'parent': return 'bg-success-100 text-success-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
          <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
        </div>

        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Account</span>
        </button>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['all', 'teacher', 'parent', 'admin'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab === 'all' ? 'All Accounts' : `${tab}s`}
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {tab === 'all' ? accounts.length : accounts.filter(a => a.role === tab).length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Account List */}
        <main className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn-secondary flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Account List */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">User Accounts</h2>
              <span className="text-sm text-gray-500">
                {filteredAccounts.length} accounts
              </span>
            </div>

            <div className="space-y-4">
              {filteredAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{account.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(account.role)}`}>
                          {account.role}
                        </span>
                        <span className={account.status === 'active' ? 'status-active' : 'status-inactive'}>
                          {account.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{account.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{account.phone}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {account.class} • Last login: {account.lastLogin}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="btn-secondary">
                      Send Message
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Edit account"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-danger-600 transition-colors"
                      title="Delete account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bulk Actions</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors"
                title="Send group message to selected accounts"
              >
                <Mail className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-primary-700">Send Group Message</span>
              </button>

              <button
                className="p-4 bg-warning-50 hover:bg-warning-100 rounded-lg text-center transition-colors"
                title="Update permissions for selected accounts"
              >
                <Shield className="w-6 h-6 text-warning-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-warning-700">Update Permissions</span>
              </button>

              <button
                className="p-4 bg-success-50 hover:bg-success-100 rounded-lg text-center transition-colors"
                title="Export account data to file"
              >
                <Users className="w-6 h-6 text-success-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-success-700">Export Accounts</span>
              </button>
            </div>
          </div>
        </main>

        {/* Permissions Panel */}
        <aside className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h2>

            <div className="space-y-4">
              {permissions.map((rolePermission) => (
                <div key={rolePermission.role}>
                  <h3 className={`font-medium mb-2 px-2 py-1 rounded text-sm ${getRoleColor(rolePermission.role)}`}>
                    {rolePermission.role.charAt(0).toUpperCase() + rolePermission.role.slice(1)}
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {rolePermission.permissions.map((permission, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span>{permission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Accounts:</span>
                <span className="text-sm font-medium">{accounts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Active Users:</span>
                <span className="text-sm font-medium text-success-600">
                  {accounts.filter(a => a.status === 'active').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Teachers:</span>
                <span className="text-sm font-medium text-primary-600">
                  {accounts.filter(a => a.role === 'teacher').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Parents:</span>
                <span className="text-sm font-medium text-success-600">
                  {accounts.filter(a => a.role === 'parent').length}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default AdminAccountManagement
