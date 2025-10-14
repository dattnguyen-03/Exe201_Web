import React, { useState, useEffect } from 'react';
import { 
  School, 
  Bell, 
  Shield, 
  Users, 
  Settings as SettingsIcon,
  Settings,
  Save,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  Edit,
  X
} from 'lucide-react';
import { showSuccess, showError } from '../../utils/swal';

interface SchoolProfile {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  emergency_contact: string;
  relationship: string;
  role: string;
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
}

interface SystemSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  dataRetention: number; // months
  enableAnalytics: boolean;
  enableReports: boolean;
  maxStudentsPerClass: number;
}

interface NotificationSettings {
  systemAlerts: boolean;
  parentNotifications: boolean;
  teacherNotifications: boolean;
  emergencyAlerts: boolean;
  maintenanceNotifications: boolean;
  reportReminders: boolean;
}

interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    expireDays: number;
  };
  sessionTimeout: number;
  loginAttempts: number;
  ipRestriction: boolean;
  auditLogging: boolean;
}

const SchoolSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'system' | 'notifications' | 'security'>('profile');
  const [loading, setLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingSystem, setEditingSystem] = useState(false);
  const [editingNotifications, setEditingNotifications] = useState(false);
  const [editingSecurity, setEditingSecurity] = useState(false);
  
  // Temporary states for editing
  const [tempProfile, setTempProfile] = useState<SchoolProfile | null>(null);
  const [tempSystemSettings, setTempSystemSettings] = useState<SystemSettings | null>(null);
  const [tempNotifications, setTempNotifications] = useState<NotificationSettings | null>(null);
  const [tempSecurity, setTempSecurity] = useState<SecuritySettings | null>(null);

  const [profile, setProfile] = useState<SchoolProfile>({
    full_name: 'Trường Tiểu học Nguyễn Du',
    email: 'contact@nguyendu.edu.vn',
    phone: '024-3825-1234',
    address: '123 Đường Nguyễn Du, Quận Hoàn Kiếm, Hà Nội',
    emergency_contact: '024-3825-9999',
    relationship: 'Trường học',
    role: 'school',
    totalStudents: 850,
    totalTeachers: 45,
    totalClasses: 24
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: 36,
    enableAnalytics: true,
    enableReports: true,
    maxStudentsPerClass: 35
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    systemAlerts: true,
    parentNotifications: true,
    teacherNotifications: true,
    emergencyAlerts: true,
    maintenanceNotifications: false,
    reportReminders: true
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    passwordPolicy: {
      minLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      expireDays: 90
    },
    sessionTimeout: 60,
    loginAttempts: 5,
    ipRestriction: false,
    auditLogging: true
  });

  const tabs = [
    { id: 'profile' as const, label: 'Thông Tin Trường', icon: School },
    { id: 'system' as const, label: 'Hệ Thống', icon: Settings },
    { id: 'notifications' as const, label: 'Thông Báo', icon: Bell },
    { id: 'security' as const, label: 'Bảo Mật', icon: Shield }
  ];

  // Load profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/school/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('smart-child-token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, []);

  // Edit handlers
  const handleEditProfile = () => {
    setTempProfile({...profile});
    setEditingProfile(true);
  };

  const handleCancelEditProfile = () => {
    setEditingProfile(false);
    setTempProfile(null);
  };

  const handleSaveProfile = async () => {
    if (!tempProfile) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/school/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('smart-child-token')}`
        },
        body: JSON.stringify(tempProfile)
      });

      if (response.ok) {
        setProfile(tempProfile);
        setEditingProfile(false);
        setTempProfile(null);
        showSuccess('Cập nhật thông tin trường thành công!');
      } else {
        throw new Error('Cập nhật thất bại');
      }
    } catch (error) {
      showError('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSystem = () => {
    setTempSystemSettings({...systemSettings});
    setEditingSystem(true);
  };

  const handleCancelEditSystem = () => {
    setEditingSystem(false);
    setTempSystemSettings(null);
  };

  const handleSaveSystemSettings = async () => {
    if (!tempSystemSettings) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/school/system-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('smart-child-token')}`
        },
        body: JSON.stringify(tempSystemSettings)
      });

      if (response.ok) {
        setSystemSettings(tempSystemSettings);
        setEditingSystem(false);
        setTempSystemSettings(null);
        showSuccess('Cập nhật cài đặt hệ thống thành công!');
      } else {
        throw new Error('Cập nhật thất bại');
      }
    } catch (error) {
      showError('Có lỗi xảy ra khi cập nhật cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNotifications = () => {
    setTempNotifications({...notifications});
    setEditingNotifications(true);
  };

  const handleCancelEditNotifications = () => {
    setEditingNotifications(false);
    setTempNotifications(null);
  };

  const handleSaveNotifications = async () => {
    if (!tempNotifications) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/school/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('smart-child-token')}`
        },
        body: JSON.stringify(tempNotifications)
      });

      if (response.ok) {
        setNotifications(tempNotifications);
        setEditingNotifications(false);
        setTempNotifications(null);
        showSuccess('Cập nhật cài đặt thông báo thành công!');
      } else {
        throw new Error('Cập nhật thất bại');
      }
    } catch (error) {
      showError('Có lỗi xảy ra khi cập nhật cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSecurity = () => {
    setTempSecurity({...security});
    setEditingSecurity(true);
  };

  const handleCancelEditSecurity = () => {
    setEditingSecurity(false);
    setTempSecurity(null);
  };

  const handleSaveSecurity = async () => {
    if (!tempSecurity) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/school/security-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('smart-child-token')}`
        },
        body: JSON.stringify(tempSecurity)
      });

      if (response.ok) {
        setSecurity(tempSecurity);
        setEditingSecurity(false);
        setTempSecurity(null);
        showSuccess('Cập nhật cài đặt bảo mật thành công!');
      } else {
        throw new Error('Cập nhật thất bại');
      }
    } catch (error) {
      showError('Có lỗi xảy ra khi cập nhật cài đặt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-blue-200/50 shadow-sm mx-6 pt-6 mb-8 rounded-2xl">
        <div className="flex items-center gap-4 p-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl">
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800">Cài Đặt Trường</h1>
            <p className="text-gray-600 font-medium">Quản lý thông tin và cấu hình hệ thống</p>
          </div>
        </div>
      </div>

      <div className="mx-6 mb-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-2xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Thông Tin Trường</h2>
                <button
                  onClick={handleEditProfile}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Chỉnh Sửa
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 bg-white/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <School className="inline h-4 w-4 mr-2" />
                    Tên Trường
                  </label>
                  <div className="text-lg font-medium text-gray-800">{profile.full_name}</div>
                </div>

                <div className="bg-white/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-2" />
                    Email Liên Hệ
                  </label>
                  <div className="text-lg font-medium text-gray-800">{profile.email}</div>
                </div>

                <div className="bg-white/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-2" />
                    Số Điện Thoại
                  </label>
                  <div className="text-lg font-medium text-gray-800">{profile.phone}</div>
                </div>

                <div className="md:col-span-2 bg-white/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    Địa Chỉ
                  </label>
                  <div className="text-lg font-medium text-gray-800">{profile.address}</div>
                </div>

                <div className="bg-white/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="inline h-4 w-4 mr-2" />
                    Liên Hệ Khẩn Cấp
                  </label>
                  <div className="text-lg font-medium text-gray-800">{profile.emergency_contact}</div>
                </div>

                <div className="bg-white/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-2" />
                    Mối Quan Hệ
                  </label>
                  <div className="text-lg font-medium text-gray-800">{profile.relationship}</div>
                </div>

                <div className="bg-white/50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <BookOpen className="inline h-4 w-4 mr-2" />
                    Vai Trò
                  </label>
                  <div className="text-lg font-medium text-gray-800">{profile.role}</div>
                </div>

                {/* Statistics - Read Only */}
                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{profile.totalStudents}</div>
                    <div className="text-sm text-gray-600">Tổng Học Sinh</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{profile.totalTeachers}</div>
                    <div className="text-sm text-gray-600">Tổng Giáo Viên</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">{profile.totalClasses}</div>
                    <div className="text-sm text-gray-600">Tổng Lớp Học</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Cài Đặt Hệ Thống</h2>
                <button
                  onClick={handleEditSystem}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Chỉnh Sửa
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Sao Lưu Dữ Liệu</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-gray-800">Tự động sao lưu</h4>
                      <p className="text-sm text-gray-600">Sao lưu dữ liệu định kỳ</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.autoBackup}
                        onChange={(e) => setSystemSettings({...systemSettings, autoBackup: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tần suất sao lưu
                    </label>
                    <select
                      value={systemSettings.backupFrequency}
                      onChange={(e) => setSystemSettings({...systemSettings, backupFrequency: e.target.value as any})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="daily">Hàng ngày</option>
                      <option value="weekly">Hàng tuần</option>
                      <option value="monthly">Hàng tháng</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Thời gian lưu trữ (tháng)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={systemSettings.dataRetention}
                      onChange={(e) => setSystemSettings({...systemSettings, dataRetention: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Tính Năng</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-gray-800">Phân tích dữ liệu</h4>
                      <p className="text-sm text-gray-600">Báo cáo và thống kê</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.enableAnalytics}
                        onChange={(e) => setSystemSettings({...systemSettings, enableAnalytics: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-gray-800">Báo cáo tự động</h4>
                      <p className="text-sm text-gray-600">Tạo báo cáo định kỳ</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={systemSettings.enableReports}
                        onChange={(e) => setSystemSettings({...systemSettings, enableReports: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số học sinh tối đa/lớp
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="50"
                      value={systemSettings.maxStudentsPerClass}
                      onChange={(e) => setSystemSettings({...systemSettings, maxStudentsPerClass: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Cài Đặt Thông Báo</h2>
                <button
                  onClick={handleEditNotifications}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Chỉnh Sửa
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { key: 'systemAlerts', label: 'Cảnh báo hệ thống', desc: 'Thông báo lỗi và bảo trì hệ thống' },
                  { key: 'parentNotifications', label: 'Thông báo phụ huynh', desc: 'Gửi thông báo tới phụ huynh' },
                  { key: 'teacherNotifications', label: 'Thông báo giáo viên', desc: 'Gửi thông báo tới giáo viên' },
                  { key: 'emergencyAlerts', label: 'Cảnh báo khẩn cấp', desc: 'Thông báo tình huống khẩn cấp' },
                  { key: 'maintenanceNotifications', label: 'Thông báo bảo trì', desc: 'Thông báo lịch bảo trì hệ thống' },
                  { key: 'reportReminders', label: 'Nhắc nhở báo cáo', desc: 'Nhắc nhở nộp báo cáo định kỳ' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.label}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      notifications[item.key as keyof NotificationSettings] 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {notifications[item.key as keyof NotificationSettings] ? 'Bật' : 'Tắt'}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Cài Đặt Bảo Mật</h2>
                <button
                  onClick={handleEditSecurity}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Chỉnh Sửa
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Chính Sách Mật Khẩu</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Độ dài tối thiểu
                      </label>
                      <input
                        type="number"
                        min="6"
                        max="20"
                        value={security.passwordPolicy.minLength}
                        onChange={(e) => setSecurity({
                          ...security,
                          passwordPolicy: {
                            ...security.passwordPolicy,
                            minLength: parseInt(e.target.value)
                          }
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Yêu cầu ký tự đặc biệt</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.passwordPolicy.requireSpecialChars}
                          onChange={(e) => setSecurity({
                            ...security,
                            passwordPolicy: {
                              ...security.passwordPolicy,
                              requireSpecialChars: e.target.checked
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Yêu cầu số</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.passwordPolicy.requireNumbers}
                          onChange={(e) => setSecurity({
                            ...security,
                            passwordPolicy: {
                              ...security.passwordPolicy,
                              requireNumbers: e.target.checked
                            }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Hết hạn sau (ngày)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="365"
                        value={security.passwordPolicy.expireDays}
                        onChange={(e) => setSecurity({
                          ...security,
                          passwordPolicy: {
                            ...security.passwordPolicy,
                            expireDays: parseInt(e.target.value)
                          }
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Cài Đặt Phiên</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Thời gian hết phiên (phút)
                      </label>
                      <select
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={30}>30 phút</option>
                        <option value={60}>1 giờ</option>
                        <option value={120}>2 giờ</option>
                        <option value={240}>4 giờ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Số lần đăng nhập sai tối đa
                      </label>
                      <input
                        type="number"
                        min="3"
                        max="10"
                        value={security.loginAttempts}
                        onChange={(e) => setSecurity({...security, loginAttempts: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-gray-700">Giới hạn IP</span>
                        <p className="text-xs text-gray-500">Chỉ cho phép truy cập từ IP cụ thể</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.ipRestriction}
                          onChange={(e) => setSecurity({...security, ipRestriction: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-gray-700">Ghi log kiểm toán</span>
                        <p className="text-xs text-gray-500">Lưu lại các hoạt động của người dùng</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.auditLogging}
                          onChange={(e) => setSecurity({...security, auditLogging: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Profile Edit Modal */}
      {editingProfile && tempProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Chỉnh Sửa Thông Tin Trường</h3>
              <button
                onClick={handleCancelEditProfile}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <School className="inline h-4 w-4 mr-2" />
                  Tên Trường
                </label>
                <input
                  type="text"
                  value={tempProfile.full_name}
                  onChange={(e) => setTempProfile({...tempProfile, full_name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email Liên Hệ
                </label>
                <input
                  type="email"
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Số Điện Thoại
                </label>
                <input
                  type="tel"
                  value={tempProfile.phone}
                  onChange={(e) => setTempProfile({...tempProfile, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Địa Chỉ
                </label>
                <textarea
                  value={tempProfile.address}
                  onChange={(e) => setTempProfile({...tempProfile, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Liên Hệ Khẩn Cấp
                </label>
                <input
                  type="tel"
                  value={tempProfile.emergency_contact}
                  onChange={(e) => setTempProfile({...tempProfile, emergency_contact: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Users className="inline h-4 w-4 mr-2" />
                  Mối Quan Hệ
                </label>
                <input
                  type="text"
                  value={tempProfile.relationship}
                  onChange={(e) => setTempProfile({...tempProfile, relationship: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={handleCancelEditProfile}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolSettings;