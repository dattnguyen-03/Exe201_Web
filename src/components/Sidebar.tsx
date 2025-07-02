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
    { to: '/parent', icon: Home, label: 'Tổng Quan', end: true },
    { to: '/parent/live-view', icon: Video, label: 'Theo Dõi Trực Tiếp' },
    { to: '/parent/alerts', icon: AlertTriangle, label: 'Trung Tâm Cảnh Báo' },
    { to: '/parent/reports', icon: BarChart3, label: 'Báo Cáo Hành Vi' },
    { to: '/parent/danger-zones', icon: Map, label: 'Bản Đồ Vùng Nguy Hiểm' },
    { to: '/parent/child-profile', icon: User, label: 'Hồ Sơ Con Em' },
    { to: '/parent/account', icon: Settings, label: 'Cài Đặt Tài Khoản' },
    { to: '/parent/notifications', icon: MessageSquare, label: 'Tin Nhắn & Thông Báo' },
  ]

  const adminNavItems = [
    { to: '/admin', icon: Home, label: 'Bảng Điều Khiển', end: true },
    { to: '/admin/live-view', icon: Video, label: 'Theo Dõi Trực Tiếp' },
    { to: '/admin/classes', icon: Users, label: 'Quản Lý Lớp Học' },
    { to: '/admin/accounts', icon: Shield, label: 'Quản Lý Tài Khoản' },
    { to: '/admin/reports', icon: FileText, label: 'Báo Cáo Hệ Thống' },
    { to: '/admin/playback', icon: Camera, label: 'Xem Lại Camera' },
    { to: '/admin/alerts', icon: AlertTriangle, label: 'Trung Tâm Cảnh Báo' },
    { to: '/admin/danger-zones', icon: MapPin, label: 'Quản Lý Vùng Nguy Hiểm' },
    { to: '/admin/communication', icon: Mail, label: 'Trung Tâm Liên Lạc' },
  ]

  const navItems = role === 'parent' ? parentNavItems : adminNavItems

  return (
    <aside className="bg-white w-72 min-h-screen shadow-lg border-r border-gray-200">
      <nav className="p-4">
        {/* Role Badge */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              {role === 'parent' ? (
                <Users className="w-5 h-5 text-white" />
              ) : (
                <Shield className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {role === 'parent' ? 'Cổng Phụ Huynh' : 'Cổng Quản Trị'}
              </h2>
              <p className="text-sm text-gray-600">
                {role === 'parent' ? 'Theo dõi con em của bạn' : 'Quản lý toàn hệ thống'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`
                }
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110`} />
                <span className="font-medium text-sm">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Thống Kê Nhanh</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cảnh báo hôm nay:</span>
              <span className="font-medium text-orange-600">3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Trạng thái camera:</span>
              <span className="font-medium text-green-600">Hoạt động</span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
