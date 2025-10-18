import React, { useState, useEffect } from 'react'
import { Users, Plus, Edit, Trash2, Search, Filter, UserCheck, Shield, Mail, Phone, X, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { showSuccess, showError, showWarning, showConfirm } from '../../utils/swal'
import { adminApiService, User, CreateUserData } from '../../services/adminApiService'

const AdminAccountManagement: React.FC = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // API state
  const [accounts, setAccounts] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal state
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)
  
  // Form state
  const [newAccount, setNewAccount] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirmPassword: '',
    address: '',
    permissions: [] as string[]
  })

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const users = await adminApiService.getAllUsers()
      setAccounts(users)
    } catch (error) {
      console.error('Error fetching users:', error)
      showError('Không thể tải danh sách tài khoản')
    } finally {
      setLoading(false)
    }
  }

  // Load users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const roleStats = {
    total: accounts.length,
    admin: 1, // Admin hiện tại
    school: accounts.filter(acc => acc.role === 'school').length,
    parent: accounts.filter(acc => acc.role === 'parent').length,
    active: accounts.filter(acc => acc.status === 'active').length
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'school': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'parent': return 'bg-amber-100 text-amber-700 border-amber-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Quản trị viên'
      case 'school': return 'Trường học'
      case 'parent': return 'Phụ huynh'
      default: return role
    }
  }

  // Handle form submission
  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate password match
    if (newAccount.password !== newAccount.confirmPassword) {
      showWarning('Mật khẩu xác nhận không khớp!')
      return
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newAccount.email)) {
      showWarning('Email không hợp lệ!')
      return
    }
    
    try {
      const createUserData: CreateUserData = {
        email: newAccount.email,
        full_name: newAccount.name,
        password: newAccount.password,
        role: newAccount.role,
        phone: newAccount.phone || undefined,
        address: newAccount.address || undefined
      }
      
      await adminApiService.createUser(createUserData)
      
      setShowAddAccountModal(false)
      setNewAccount({
        name: '',
        email: '',
        phone: '',
        role: '',
        password: '',
        confirmPassword: '',
        address: '',
        permissions: []
      })
      
      showSuccess('Tài khoản đã được tạo thành công!')
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error('Error creating user:', error)
      showError(error instanceof Error ? error.message : 'Không thể tạo tài khoản')
    }
  }

  // Handle delete user
  const handleDeleteUser = async (email: string, name: string) => {
    const confirmed = await showConfirm(
      `Bạn có chắc chắn muốn xóa tài khoản "${name}"?`,
      'Xác nhận xóa tài khoản'
    )
    
    if (confirmed.isConfirmed) {
      try {
        await adminApiService.deleteUser(email)
        showSuccess('Tài khoản đã được xóa thành công!')
        fetchUsers() // Refresh the list
      } catch (error) {
        console.error('Error deleting user:', error)
        showError(error instanceof Error ? error.message : 'Không thể xóa tài khoản')
      }
    }
  }

  const filteredAccounts = accounts.filter(account => {
    const matchesRole = selectedRole === 'all' || account.role === selectedRole
    const matchesSearch = account.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesRole && matchesSearch
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">👥 Quản lý tài khoản</h1>
            <p className="text-amber-100">Quản lý tài khoản trường học, phụ huynh và phân quyền</p>
          </div>
          <button 
            className="bg-white text-amber-600 px-4 py-2 rounded-lg font-medium hover:bg-amber-50 transition-colors flex items-center space-x-2"
            onClick={() => setShowAddAccountModal(true)}
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tài khoản</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card bg-gradient-to-br from-amber-25 to-amber-50 border-amber-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-700">{roleStats.total}</div>
            <div className="text-sm text-amber-600">Tổng số tài khoản</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-orange-25 to-orange-50 border-orange-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-700">{roleStats.admin}</div>
            <div className="text-sm text-orange-600">Quản trị viên</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-blue-25 to-blue-50 border-blue-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">{roleStats.school}</div>
            <div className="text-sm text-blue-600">Trường học</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-yellow-25 to-yellow-50 border-yellow-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-700">{roleStats.parent}</div>
            <div className="text-sm text-yellow-600">Phụ huynh</div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-emerald-25 to-emerald-50 border-emerald-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-700">{roleStats.active}</div>
            <div className="text-sm text-emerald-600">Đang hoạt động</div>
          </div>
        </div>
      </div>


      {/* Filters and Search */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">🔍 Tìm kiếm và bộ lọc</h3>
          <Filter className="w-5 h-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc email..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
            <select
              className="input-field"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              title="Chọn vai trò để lọc"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="school">Trường học</option>
              <option value="parent">Phụ huynh</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select className="input-field" title="Chọn trạng thái tài khoản">
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="suspended">Tạm khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">📋 Danh sách tài khoản</h3>
          <span className="text-sm text-gray-500">{filteredAccounts.length} tài khoản</span>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              <p className="mt-2 text-gray-500">Đang tải danh sách tài khoản...</p>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không có tài khoản nào</p>
            </div>
          ) : (
            filteredAccounts.map((account) => (
            <div key={account.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {account.role === 'admin' ? (
                      <Shield className="w-6 h-6 text-purple-600" />
                    ) : account.role === 'school' ? (
                      <UserCheck className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Users className="w-6 h-6 text-green-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{account.full_name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(account.role)}`}>
                        {getRoleText(account.role)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        account.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {account.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{account.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{account.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Đăng nhập cuối: </span>
                        <span>{account.last_login ? new Date(account.last_login).toLocaleString('vi-VN') : 'Chưa đăng nhập'}</span>
                      </div>
                    </div>

                    {account.address && account.role === 'school' && (
                      <div className="mt-2">
                        <span className="text-sm text-blue-600 font-medium">Địa chỉ: {account.address}</span>
                      </div>
                    )}

                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Chỉnh sửa tài khoản"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Xóa tài khoản"
                    onClick={() => handleDeleteUser(account.email, account.full_name)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>


      {/* Modal thêm tài khoản */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Tạo tài khoản mới</h2>
              <button
                onClick={() => setShowAddAccountModal(false)}
                className="p-2 text-gray-600 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAccount} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-5 py-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={newAccount.email}
                    onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                    placeholder="example@truongmam.edu.vn"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-5 py-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={newAccount.phone}
                    onChange={(e) => setNewAccount({ ...newAccount, phone: e.target.value })}
                    placeholder="0901 234 567"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Vai trò *
                  </label>
                  <select
                    required
                    className="w-full px-5 py-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-gray-900 text-base"
                    value={newAccount.role}
                    onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value })}
                  >
                    <option value="">Chọn vai trò</option>
                    <option value="school">Trường học</option>
                    <option value="parent">Phụ huynh</option>
                  </select>
                </div>

                {newAccount.role === 'school' && (
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-3">
                      Địa chỉ trường
                    </label>
                    <input
                      type="text"
                      className="w-full px-5 py-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                      value={newAccount.address}
                      onChange={(e) => setNewAccount({ ...newAccount, address: e.target.value })}
                      placeholder="Nhập địa chỉ trường học"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-5 py-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={newAccount.password}
                    onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-800 mb-3">
                    Xác nhận mật khẩu *
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-5 py-4 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-200 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-gray-900 text-base"
                    value={newAccount.confirmPassword}
                    onChange={(e) => setNewAccount({ ...newAccount, confirmPassword: e.target.value })}
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>
              </div>

              {/* Permissions Section */}
              {newAccount.role && (
                <div>
                  <label className="block text-base font-medium text-gray-800 mb-4">
                    Quyền truy cập
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {newAccount.role === 'admin' && (
                      <div className="col-span-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newAccount.permissions.includes('full_access')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewAccount({ ...newAccount, permissions: ['full_access'] })
                              } else {
                                setNewAccount({ ...newAccount, permissions: [] })
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">Toàn quyền truy cập</span>
                        </label>
                      </div>
                    )}
                    
                    {newAccount.role === 'teacher' && (
                      <>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newAccount.permissions.includes('view_class')}
                            onChange={(e) => {
                              const perms = e.target.checked 
                                ? [...newAccount.permissions, 'view_class']
                                : newAccount.permissions.filter(p => p !== 'view_class')
                              setNewAccount({ ...newAccount, permissions: perms })
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">Xem lớp học</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newAccount.permissions.includes('manage_students')}
                            onChange={(e) => {
                              const perms = e.target.checked 
                                ? [...newAccount.permissions, 'manage_students']
                                : newAccount.permissions.filter(p => p !== 'manage_students')
                              setNewAccount({ ...newAccount, permissions: perms })
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">Quản lý học sinh</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newAccount.permissions.includes('send_alerts')}
                            onChange={(e) => {
                              const perms = e.target.checked 
                                ? [...newAccount.permissions, 'send_alerts']
                                : newAccount.permissions.filter(p => p !== 'send_alerts')
                              setNewAccount({ ...newAccount, permissions: perms })
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">Gửi cảnh báo</span>
                        </label>
                      </>
                    )}
                    
                    {newAccount.role === 'parent' && (
                      <>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newAccount.permissions.includes('view_child')}
                            onChange={(e) => {
                              const perms = e.target.checked 
                                ? [...newAccount.permissions, 'view_child']
                                : newAccount.permissions.filter(p => p !== 'view_child')
                              setNewAccount({ ...newAccount, permissions: perms })
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">Xem thông tin con</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newAccount.permissions.includes('receive_alerts')}
                            onChange={(e) => {
                              const perms = e.target.checked 
                                ? [...newAccount.permissions, 'receive_alerts']
                                : newAccount.permissions.filter(p => p !== 'receive_alerts')
                              setNewAccount({ ...newAccount, permissions: perms })
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">Nhận cảnh báo</span>
                        </label>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAccountManagement

