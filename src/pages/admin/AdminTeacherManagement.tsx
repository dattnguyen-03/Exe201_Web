import React, { useState } from 'react'
import { Users, Plus, Edit, Trash2, Search, Filter, BookOpen, Clock, Award, Eye, UserCheck, Mail, Phone, X } from 'lucide-react'

const AdminTeacherManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  
  // Form state
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    class: '',
    experience: '',
    qualification: '',
    address: '',
    permissions: [] as string[]
  })

  const teachers = [
    {
      id: 1,
      name: 'Nguyễn Thị Lan',
      email: 'lan.nguyen@truongmam.edu.vn',
      phone: '0901 234 567',
      class: 'Lớp Mẫu Giáo A',
      students: 25,
      experience: '5 năm',
      qualification: 'Cử nhân Sư phạm Mầm non',
      status: 'active',
      joinDate: '2019-08-15',
      lastLogin: '2024-01-15 14:30',
      performance: 95,
      address: '123 Đường ABC, Quận 1, TP.HCM',
      permissions: ['view_class', 'manage_students', 'send_alerts']
    },
    {
      id: 2,
      name: 'Trần Văn Minh',
      email: 'minh.tran@truongmam.edu.vn',
      phone: '0902 345 678',
      class: 'Lớp Mẫu Giáo B',
      students: 23,
      experience: '3 năm',
      qualification: 'Cử nhân Sư phạm Mầm non',
      status: 'active',
      joinDate: '2021-01-10',
      lastLogin: '2024-01-15 13:45',
      performance: 92,
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      permissions: ['view_class', 'manage_students']
    },
    {
      id: 3,
      name: 'Lê Thị Hương',
      email: 'huong.le@truongmam.edu.vn',
      phone: '0903 456 789',
      class: 'Lớp Chồi A',
      students: 20,
      experience: '7 năm',
      qualification: 'Thạc sĩ Sư phạm Mầm non',
      status: 'active',
      joinDate: '2017-03-20',
      lastLogin: '2024-01-15 15:20',
      performance: 98,
      address: '789 Đường DEF, Quận 3, TP.HCM',
      permissions: ['view_class', 'manage_students', 'send_alerts', 'admin_access']
    },
    {
      id: 4,
      name: 'Phạm Thị Mai',
      email: 'mai.pham@truongmam.edu.vn',
      phone: '0904 567 890',
      class: 'Lớp Chồi B',
      students: 22,
      experience: '2 năm',
      qualification: 'Cử nhân Sư phạm Mầm non',
      status: 'inactive',
      joinDate: '2022-09-05',
      lastLogin: '2024-01-10 09:15',
      performance: 88,
      address: '321 Đường GHI, Quận 4, TP.HCM',
      permissions: ['view_class', 'manage_students']
    }
  ]

  const classes = [
    { id: 'kg-a', name: 'Lớp Mẫu Giáo A' },
    { id: 'kg-b', name: 'Lớp Mẫu Giáo B' },
    { id: 'g1-a', name: 'Lớp Chồi A' },
    { id: 'g1-b', name: 'Lớp Chồi B' }
  ]

  const teacherStats = {
    total: teachers.length,
    active: teachers.filter(t => t.status === 'active').length,
    inactive: teachers.filter(t => t.status === 'inactive').length,
    totalStudents: teachers.reduce((sum, t) => sum + t.students, 0),
    avgPerformance: Math.round(teachers.reduce((sum, t) => sum + t.performance, 0) / teachers.length)
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 95) return 'text-green-600'
    if (performance >= 90) return 'text-blue-600'
    if (performance >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-red-100 text-red-700 border-red-200'
  }

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newTeacher.password !== newTeacher.confirmPassword) {
      showWarning('Mật khẩu xác nhận không khớp!')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newTeacher.email)) {
      showWarning('Email không hợp lệ!')
      return
    }
    
    console.log('Adding teacher:', newTeacher)
    setShowAddTeacherModal(false)
    setNewTeacher({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      class: '',
      experience: '',
      qualification: '',
      address: '',
      permissions: []
    })
    showSuccess('Giáo viên đã được thêm thành công!')
  }

  const handleViewDetail = (teacher: any) => {
    setSelectedTeacher(teacher)
    setShowDetailModal(true)
  }

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.class.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = selectedClass === 'all' || teacher.class.includes(selectedClass)
    return matchesSearch && matchesClass
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">👨‍🏫 Quản lý giáo viên</h1>
            <p className="text-blue-100">Quản lý thông tin và hoạt động của đội ngũ giáo viên</p>
          </div>
          <button 
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
            onClick={() => setShowAddTeacherModal(true)}
          >
            <Plus className="w-4 h-4" />
            <span>Thêm giáo viên</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{teacherStats.total}</div>
            <div className="text-sm text-blue-600">Tổng giáo viên</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">{teacherStats.active}</div>
            <div className="text-sm text-green-600">Đang hoạt động</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-700">{teacherStats.inactive}</div>
            <div className="text-sm text-red-600">Tạm nghỉ</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-700">{teacherStats.totalStudents}</div>
            <div className="text-sm text-purple-600">Tổng học sinh</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-700">{teacherStats.avgPerformance}%</div>
            <div className="text-sm text-yellow-600">Hiệu suất TB</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">🔍 Tìm kiếm và bộ lọc</h3>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Tìm theo tên, email hoặc lớp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lớp</label>
            <select
              className="input-field"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="all">Tất cả lớp</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Teachers List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">👥 Danh sách giáo viên ({filteredTeachers.length})</h3>
          <Users className="w-5 h-5 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Giáo viên</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Lớp</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Học sinh</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Kinh nghiệm</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Hiệu suất</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Trạng thái</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-2">
                    <div>
                      <div className="font-medium text-gray-900">{teacher.name}</div>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <Mail className="w-3 h-3" />
                        <span>{teacher.email}</span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <Phone className="w-3 h-3" />
                        <span>{teacher.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">{teacher.class}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-sm font-medium">{teacher.students} học sinh</span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{teacher.experience}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className={`text-sm font-medium ${getPerformanceColor(teacher.performance)}`}>
                        {teacher.performance}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(teacher.status)}`}>
                      {teacher.status === 'active' ? 'Hoạt động' : 'Tạm nghỉ'}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleViewDetail(teacher)}
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Teacher Modal */}
      {showAddTeacherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">➕ Thêm giáo viên mới</h3>
              <button
                onClick={() => setShowAddTeacherModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    placeholder="teacher@truongmam.edu.vn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                    placeholder="0901 234 567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lớp phụ trách *
                  </label>
                  <select
                    required
                    className="input-field"
                    value={newTeacher.class}
                    onChange={(e) => setNewTeacher({ ...newTeacher, class: e.target.value })}
                  >
                    <option value="">Chọn lớp</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.name}>{cls.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kinh nghiệm
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newTeacher.experience}
                    onChange={(e) => setNewTeacher({ ...newTeacher, experience: e.target.value })}
                    placeholder="5 năm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trình độ học vấn
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={newTeacher.qualification}
                    onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                    placeholder="Cử nhân Sư phạm Mầm non"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={newTeacher.address}
                  onChange={(e) => setNewTeacher({ ...newTeacher, address: e.target.value })}
                  placeholder="123 Đường ABC, Quận 1, TP.HCM"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="input-field"
                    value={newTeacher.password}
                    onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu *
                  </label>
                  <input
                    type="password"
                    required
                    className="input-field"
                    value={newTeacher.confirmPassword}
                    onChange={(e) => setNewTeacher({ ...newTeacher, confirmPassword: e.target.value })}
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quyền truy cập
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newTeacher.permissions.includes('view_class')}
                      onChange={(e) => {
                        const perms = e.target.checked 
                          ? [...newTeacher.permissions, 'view_class']
                          : newTeacher.permissions.filter(p => p !== 'view_class')
                        setNewTeacher({ ...newTeacher, permissions: perms })
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Xem lớp học</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newTeacher.permissions.includes('manage_students')}
                      onChange={(e) => {
                        const perms = e.target.checked 
                          ? [...newTeacher.permissions, 'manage_students']
                          : newTeacher.permissions.filter(p => p !== 'manage_students')
                        setNewTeacher({ ...newTeacher, permissions: perms })
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Quản lý học sinh</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newTeacher.permissions.includes('send_alerts')}
                      onChange={(e) => {
                        const perms = e.target.checked 
                          ? [...newTeacher.permissions, 'send_alerts']
                          : newTeacher.permissions.filter(p => p !== 'send_alerts')
                        setNewTeacher({ ...newTeacher, permissions: perms })
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Gửi cảnh báo</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newTeacher.permissions.includes('admin_access')}
                      onChange={(e) => {
                        const perms = e.target.checked 
                          ? [...newTeacher.permissions, 'admin_access']
                          : newTeacher.permissions.filter(p => p !== 'admin_access')
                        setNewTeacher({ ...newTeacher, permissions: perms })
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Quyền quản trị</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTeacherModal(false)}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Thêm giáo viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Detail Modal */}
      {showDetailModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">👨‍🏫 Chi tiết giáo viên</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="card bg-blue-50 border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3">Thông tin cơ bản</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Họ tên:</span>
                    <p className="text-gray-900">{selectedTeacher.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-900">{selectedTeacher.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Điện thoại:</span>
                    <p className="text-gray-900">{selectedTeacher.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Địa chỉ:</span>
                    <p className="text-gray-900">{selectedTeacher.address}</p>
                  </div>
                </div>
              </div>

              {/* Work Info */}
              <div className="card bg-green-50 border-green-200">
                <h4 className="font-semibold text-gray-900 mb-3">Thông tin công việc</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Lớp phụ trách:</span>
                    <p className="text-gray-900">{selectedTeacher.class}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Số học sinh:</span>
                    <p className="text-gray-900">{selectedTeacher.students} học sinh</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Kinh nghiệm:</span>
                    <p className="text-gray-900">{selectedTeacher.experience}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Trình độ:</span>
                    <p className="text-gray-900">{selectedTeacher.qualification}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Ngày vào làm:</span>
                    <p className="text-gray-900">{new Date(selectedTeacher.joinDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Hiệu suất:</span>
                    <p className={`font-semibold ${getPerformanceColor(selectedTeacher.performance)}`}>
                      {selectedTeacher.performance}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="card bg-purple-50 border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quyền truy cập</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTeacher.permissions.map((permission: string) => (
                    <span key={permission} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {permission === 'view_class' && 'Xem lớp học'}
                      {permission === 'manage_students' && 'Quản lý học sinh'}
                      {permission === 'send_alerts' && 'Gửi cảnh báo'}
                      {permission === 'admin_access' && 'Quyền quản trị'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="card bg-yellow-50 border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-3">Hoạt động gần đây</h4>
                <div className="text-sm text-gray-600">
                  <p>Đăng nhập lần cuối: {selectedTeacher.lastLogin}</p>
                  <p className="mt-1">
                    Trạng thái: 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedTeacher.status)}`}>
                      {selectedTeacher.status === 'active' ? 'Đang hoạt động' : 'Tạm nghỉ'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="btn-secondary"
              >
                Đóng
              </button>
              <button className="btn-primary">
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTeacherManagement