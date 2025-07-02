import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  Video,
  AlertTriangle,
  BarChart3,
  Map,
  User,
  Settings,
  MessageSquare,
  Users,
  Shield,
  FileText,
  Camera,
  MapPin,
  Mail
} from 'lucide-react'

interface SidebarProps {
  role: 'parent' | 'admin'
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const parentNavItems = [
    { to: '/parent', icon: Home, label: 'Dashboard', end: true },
    { to: '/parent/live-view', icon: Video, label: 'Live View' },
    { to: '/parent/alerts', icon: AlertTriangle, label: 'Alerts Center' },
    { to: '/parent/reports', icon: BarChart3, label: 'Behavior Reports' },
    { to: '/parent/danger-zones', icon: Map, label: 'Danger Zone Map' },
    { to: '/parent/child-profile', icon: User, label: 'Child Profile' },
    { to: '/parent/account', icon: Settings, label: 'Account Settings' },
    { to: '/parent/notifications', icon: MessageSquare, label: 'Notifications' },
  ]

  const adminNavItems = [
    { to: '/admin', icon: Home, label: 'Admin Dashboard', end: true },
    { to: '/admin/live-view', icon: Video, label: 'Live View' },
    { to: '/admin/classes', icon: Users, label: 'Class Management' },
    { to: '/admin/accounts', icon: Shield, label: 'Account Management' },
    { to: '/admin/reports', icon: FileText, label: 'System Reports' },
    { to: '/admin/playback', icon: Camera, label: 'Camera Playback' },
    { to: '/admin/alerts', icon: AlertTriangle, label: 'Alerts Center' },
    { to: '/admin/danger-zones', icon: MapPin, label: 'Danger Zone Manager' },
    { to: '/admin/communication', icon: Mail, label: 'Communication Center' },
  ]

  const navItems = role === 'parent' ? parentNavItems : adminNavItems

  return (
    <aside className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <nav className="mt-8">
        <div className="px-4 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {role} Portal
          </h2>
        </div>

        <ul className="space-y-2 px-4">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
