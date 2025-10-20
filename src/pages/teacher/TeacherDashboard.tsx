import React, { useState, useEffect } from 'react';
import { showSuccess, showError, showWarning } from '../../utils/swal';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Camera,
  MessageSquare,
  Bell,
  FileText,
  Award,
  Activity,
  Eye,
  UserCheck,
  BarChart3,
  RefreshCw,
  Video
} from 'lucide-react';
import { teacherApiService, DashboardStats, Child, Alert as ApiAlert, ClassRoom, ChildStatus } from '../../services/teacherApiService';
import '../../utils/apiTest'; // Import API test utility

interface ClassStats {
  totalStudents: number;
  presentToday: number;
  attendanceRate: number;
  behaviorScore: number;
  averageGrade: number;
  completedAssignments: number;
  pendingTasks: number;
}

interface Student {
  id: number;
  full_name: string;
  status: 'present' | 'absent' | 'late';
  behaviorScore: number;
  lastActivity: string;
  avatar?: string;
}

interface Alert {
  id: string;
  type: 'behavior' | 'attendance' | 'safety' | 'academic';
  message: string;
  student: string;
  time: string;
  severity: 'low' | 'medium' | 'high';
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [students, setStudents] = useState<Child[]>([]);
  const [apiAlerts, setApiAlerts] = useState<ApiAlert[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  
  const [classStats] = useState<ClassStats>({
    totalStudents: 25,
    presentToday: 23,
    attendanceRate: 92,
    behaviorScore: 85,
    averageGrade: 8.5,
    completedAssignments: 18,
    pendingTasks: 3
  });

  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, studentsData, alertsData, classesData] = await Promise.all([
        teacherApiService.getDashboard(),
        teacherApiService.getStudents(),
        teacherApiService.getAlerts(),
        teacherApiService.getClasses()
      ]);
      
      setDashboardStats(statsData);
      setStudents(studentsData);
      setApiAlerts(alertsData);
      setClasses(classesData);
      
      // Get recent students with real status data
      let recentStudentsWithStatus: Student[] = [];
      
      if (studentsData.length > 0) {
        recentStudentsWithStatus = await Promise.all(
          studentsData.slice(0, 5).map(async (student) => {
            try {
              const childStatus = await teacherApiService.getChildStatus(student.id);
              return {
                id: student.id,
                full_name: student.full_name,
                status: childStatus.status,
                behaviorScore: Math.round(childStatus.behavior_score),
                lastActivity: childStatus.last_activity ? 
                  formatTimeAgo(new Date(childStatus.last_activity)) : 
                  'Chưa có hoạt động'
              };
            } catch (error) {
              console.warn(`Could not fetch status for student ${student.id}:`, error);
              return {
                id: student.id,
                full_name: student.full_name,
                status: 'absent' as const,
                behaviorScore: 0,
                lastActivity: 'Chưa có hoạt động'
              };
            }
          })
        );
      } else {
        // Fallback data if no students from API
        recentStudentsWithStatus = [
          { id: 1, full_name: 'Nguyễn Văn An', status: 'present', behaviorScore: 95, lastActivity: '2 phút trước' },
          { id: 2, full_name: 'Trần Thị Bình', status: 'present', behaviorScore: 88, lastActivity: '5 phút trước' },
          { id: 3, full_name: 'Lê Văn Cường', status: 'late', behaviorScore: 75, lastActivity: '10 phút trước' },
          { id: 4, full_name: 'Phạm Thị Dung', status: 'absent', behaviorScore: 92, lastActivity: '1 giờ trước' },
          { id: 5, full_name: 'Hoàng Văn Em', status: 'present', behaviorScore: 87, lastActivity: '3 phút trước' }
        ];
      }
      
      setRecentStudents(recentStudentsWithStatus);
      
      // Transform API alerts to UI alerts
      let transformedAlerts: Alert[] = [];
      
      if (alertsData.length > 0) {
        transformedAlerts = alertsData.slice(0, 3).map((alert, index) => ({
          id: alert.id.toString(),
          type: getAlertType(alert.alert_type),
          message: alert.alert_type,
          student: studentsData.find(s => s.id === alert.child_id)?.full_name || 'Học sinh',
          time: formatTimeAgo(new Date(alert.created_at)),
          severity: getSeverity(alert.severity)
        }));
      } else {
        // Fallback alerts if no alerts from API
        transformedAlerts = [
          {
            id: '1',
            type: 'behavior',
            message: 'Học sinh Lê Văn Cường có hành vi bất thường',
            student: 'Lê Văn Cường',
            time: '5 phút trước',
            severity: 'medium'
          },
          {
            id: '2',
            type: 'attendance',
            message: 'Phạm Thị Dung chưa đến lớp',
            student: 'Phạm Thị Dung',
            time: '10 phút trước',
            severity: 'high'
          },
          {
            id: '3',
            type: 'academic',
            message: 'Hoàng Văn Em hoàn thành bài tập xuất sắc',
            student: 'Hoàng Văn Em',
            time: '15 phút trước',
            severity: 'low'
          }
        ];
      }
      
      setAlerts(transformedAlerts);
      
      // Show success message
      console.log('✅ Dashboard data loaded successfully:', {
        stats: statsData,
        students: studentsData.length,
        alerts: alertsData.length,
        classes: classesData.length,
        recentStudents: recentStudentsWithStatus.length
      });
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      // Show error message to user
      showWarning('Không thể tải dữ liệu dashboard. Vui lòng kiểm tra kết nối API.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  const getAlertType = (alertType: string): 'behavior' | 'attendance' | 'safety' | 'academic' => {
    if (alertType.includes('hành vi') || alertType.includes('behavior')) return 'behavior';
    if (alertType.includes('điểm danh') || alertType.includes('attendance')) return 'attendance';
    if (alertType.includes('an toàn') || alertType.includes('safety')) return 'safety';
    return 'academic';
  };

  const getSeverity = (severity: number): 'low' | 'medium' | 'high' => {
    if (severity >= 3) return 'high';
    if (severity >= 2) return 'medium';
    return 'low';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100';
      case 'absent': return 'text-red-600 bg-red-100';
      case 'late': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const quickActions = [
    { icon: UserCheck, label: 'Điểm danh', path: '/teacher/attendance', color: 'blue' },
    { icon: Video, label: 'Xem Trực tiếp', path: '/teacher/live-view', color: 'purple' },
    { icon: Users, label: 'Quản lý HS', path: '/teacher/students', color: 'green' },
    { icon: MessageSquare, label: 'Giao tiếp', path: '/teacher/messages', color: 'pink' },
    { icon: BarChart3, label: 'Báo cáo', path: '/teacher/reports', color: 'indigo' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6">
            <RefreshCw className="h-8 w-8 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang tải dữ liệu...</h2>
          <p className="text-gray-600">Kết nối với API backend</p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-blue-200/50 shadow-sm mx-6 mt-6 mb-8 rounded-2xl">
        <div className="flex justify-between items-center p-8">
          <div className="flex items-center space-x-6">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
                Dashboard Giáo viên
              </h1>
              <p className="text-gray-600 text-lg">Chào mừng trở lại! Hôm nay là {formatDate(currentTime)}</p>
              {dashboardStats && (
                <div className="mt-2 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">API Connected</span>
                  <span className="text-xs text-gray-500">({students.length} học sinh, {apiAlerts.length} cảnh báo)</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50/50 backdrop-blur-sm px-6 py-3 rounded-xl text-gray-700 border border-blue-200">
              <Clock className="w-5 h-5 inline mr-2" />
              {formatTime(currentTime)}
            </div>
            <button 
              onClick={loadDashboardData}
              disabled={loading}
              className="bg-blue-50/50 backdrop-blur-sm p-3 rounded-xl text-gray-700 hover:text-blue-600 border border-blue-200 hover:border-blue-300 transition-colors disabled:opacity-50"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => {
                console.log('🧪 Testing API from UI...');
                (window as any).testAPI?.();
              }}
              className="bg-green-50/50 backdrop-blur-sm p-3 rounded-xl text-gray-700 hover:text-green-600 border border-green-200 hover:border-green-300 transition-colors"
              title="Test API Connection"
            >
              <BarChart3 className="w-6 h-6" />
            </button>
            <button className="bg-blue-50/50 backdrop-blur-sm p-3 rounded-xl text-gray-700 hover:text-blue-600 border border-blue-200 hover:border-blue-300 transition-colors">
              <Bell className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* API Data Status */}
        {dashboardStats && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4"></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{dashboardStats.stats.students}</p>
                <p className="text-sm text-gray-600">Tổng học sinh</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{dashboardStats.stats.present_today}</p>
                <p className="text-sm text-gray-600">Có mặt hôm nay</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{dashboardStats.stats.avg_behavior_score}</p>
                <p className="text-sm text-gray-600">Điểm hành vi TB</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">{dashboardStats.stats.avg_class_score}</p>
                <p className="text-sm text-gray-600">Điểm lớp TB</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-800">
                <strong>Thông báo:</strong> {dashboardStats.msg}
              </p>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 hover:bg-white/90 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Tổng học sinh</p>
                <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
                  {dashboardStats ? dashboardStats.stats.students : classStats.totalStudents}
                </p>
              </div>
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-6">
              <span className="text-sm text-blue-600 font-semibold bg-blue-100 px-3 py-1 rounded-full">
                +2 học sinh mới
              </span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 hover:bg-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Có mặt hôm nay</p>
                <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                  {dashboardStats ? dashboardStats.stats.present_today : classStats.presentToday}
                </p>
              </div>
              <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-6">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                Tỷ lệ: {classStats.attendanceRate}%
              </span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 hover:bg-white/90 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Điểm hành vi TB</p>
                <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text">
                  {dashboardStats ? dashboardStats.stats.avg_behavior_score : classStats.behaviorScore}
                </p>
              </div>
              <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-6">
              <span className="text-sm text-indigo-600 font-semibold bg-indigo-100 px-3 py-1 rounded-full">
                Tăng 5 điểm
              </span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 hover:bg-white/90 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Điểm TB lớp</p>
                <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">{classStats.averageGrade}</p>
              </div>
              <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-6">
              <span className="text-sm text-purple-600 font-semibold bg-purple-100 px-3 py-1 rounded-full">
                Tăng 0.3 điểm
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all hover:scale-105 hover:border-blue-300 bg-white/50 hover:bg-white/80"
              >
                <div className={`p-3 rounded-lg bg-blue-100 mb-2`}>
                  <action.icon className={`h-6 w-6 text-blue-600`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Real Students from API */}
        {students.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">👥 Danh sách học sinh </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.slice(0, 6).map((student) => (
                <div key={student.id} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {student.full_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{student.full_name}</p>

                      {student.class_id && (
                        <p className="text-xs text-blue-600">Lớp: {student.class_id}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {students.length > 6 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Và {students.length - 6} học sinh khác...</p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Students Activity */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Hoạt động học sinh gần đây</h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Xem tất cả
              </button>
            </div>
            
            <div className="space-y-4">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {student.full_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.full_name}</p>
                      <p className="text-sm text-gray-600">{student.lastActivity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status === 'present' ? 'Có mặt' : 
                       student.status === 'absent' ? 'Vắng mặt' : 'Đến muộn'}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Hành vi: {student.behaviorScore}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Cảnh báo & Thông báo</h2>
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            

            {/* API Alerts styled like sample alerts */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">🚨 Cảnh báo & Thông báo</h3>
              {apiAlerts.length === 0 && (
                <div className="text-gray-500 text-sm">Không có cảnh báo nào.</div>
              )}
              {apiAlerts.slice(0, 3).map((alert) => {
                const studentName = students.find(s => s.id === alert.child_id)?.full_name || 'Học sinh';
                return (
                  <div
                    key={alert.id}
                    className={`p-4 border-l-4 rounded-r-lg ${
                      alert.severity === 3
                        ? 'border-l-red-500 bg-red-50'
                        : alert.severity === 2
                        ? 'border-l-yellow-500 bg-yellow-50'
                        : 'border-l-green-500 bg-green-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {alert.alert_type}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-600">{studentName}</p>
                          <p className="text-xs text-gray-500">{new Date(alert.created_at).toLocaleString('vi-VN')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
              Xem tất cả thông báo
            </button>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Bài tập đã hoàn thành</h3>
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(classStats.completedAssignments / classStats.totalStudents) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="ml-4 text-lg font-bold text-gray-900">
                {classStats.completedAssignments}/{classStats.totalStudents}
              </span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Nhiệm vụ đang chờ</h3>
              <Clock className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">{classStats.pendingTasks}</p>
              <p className="text-sm text-gray-600">nhiệm vụ cần xử lý</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Hiệu suất lớp học</h3>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">95%</p>
              <p className="text-sm text-gray-600">hiệu suất trung bình</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
