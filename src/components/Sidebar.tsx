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
  Mail,
  GraduationCap,
  UserCheck,
  Scan,
  Package,
  CreditCard
} from 'lucide-react'

interface SidebarProps {
  role: 'parent' | 'admin' | 'teacher'
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const parentNavItems = [
    { to: '/parent', icon: Home, label: 'Tổng Quan', end: true },
    { to: '/parent/live-view', icon: Video, label: 'Theo Dõi Trực Tiếp' },
    { to: '/parent/alerts', icon: AlertTriangle, label: 'Trung Tâm Cảnh Báo' },
    { to: '/parent/reports', icon: BarChart3, label: 'Báo Cáo Hành Vi' },
    { to: '/parent/danger-zones', icon: Map, label: 'Bản Đồ Vùng Nguy Hiểm' },
    { to: '/parent/child-profile', icon: User, label: 'Hồ Sơ Con Em' },
    { to: '/parent/packages', icon: Package, label: 'Gói Dịch Vụ' },
    { to: '/parent/account', icon: Settings, label: 'Cài Đặt Tài Khoản' },
    { to: '/parent/notifications', icon: MessageSquare, label: 'Tin Nhắn & Thông Báo' },
  ]

  const teacherNavItems = [
    { to: '/teacher', icon: Home, label: 'Dashboard Giáo viên', end: true },
    { to: '/teacher/live-view', icon: Video, label: 'Xem Trực tiếp' },
    { to: '/teacher/classes', icon: Users, label: 'Quản lý Lớp học' },
    { to: '/teacher/students', icon: UserCheck, label: 'Quản lý Học sinh' },
    { to: '/teacher/teachers', icon: GraduationCap, label: 'Quản lý Giáo viên' },
    { to: '/teacher/cameras', icon: Camera, label: 'Quản lý Camera' },
    { to: '/teacher/packages', icon: Package, label: 'Gói Dịch Vụ' },
    // { to: '/teacher/messages', icon: MessageSquare, label: 'Giao tiếp PH' },
    { to: '/teacher/settings', icon: Settings, label: 'Cài đặt' },
  ]

  const adminNavItems = [
    { to: '/admin', icon: Home, label: 'Bảng Điều Khiển', end: true },
    { to: '/admin/accounts', icon: Shield, label: 'Quản Lý Tài Khoản' },
    { to: '/admin/packages', icon: Package, label: 'Quản Lý Gói Dịch Vụ' },
    { to: '/admin/user-packages', icon: Users, label: 'Quản Lý Gói Người Dùng' },
    { to: '/admin/reports', icon: FileText, label: 'Báo Cáo Hệ Thống' },
  ]

  const navItems = role === 'parent' ? parentNavItems : role === 'teacher' ? teacherNavItems : adminNavItems

  return (
    <aside className="bg-white/80 backdrop-blur-sm w-72 min-h-screen shadow-lg border-r border-blue-200">
      <nav className="p-4">
        {/* Role Badge */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              {role === 'parent' ? (
                <Users className="w-5 h-5 text-white" />
              ) : role === 'teacher' ? (
                <GraduationCap className="w-5 h-5 text-white" />
              ) : (
                <Shield className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {role === 'parent' ? 'Cổng Phụ Huynh' : 
                 role === 'teacher' ? 'Cổng Giáo Viên' : 'Cổng Quản Trị'}
              </h2>
              <p className="text-sm text-gray-700">
                {role === 'parent' ? 'Theo dõi con em của bạn' : 
                 role === 'teacher' ? 'Quản lý lớp học của bạn' : 'Quản lý toàn hệ thống'}
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
                    : 'text-gray-800 hover:bg-blue-50 hover:text-blue-700'
                  }`
                }
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110`} />
                <span className="font-medium text-sm">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        
      </nav>
    </aside>
  )
}

export default Sidebar
