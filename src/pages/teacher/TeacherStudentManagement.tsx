import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/swal';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Phone, 
  Mail,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  X,
  Download,
  Upload,
  MoreVertical,
  UserPlus,
  MessageSquare,
  Trash2,
  Save,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { teacherApiService, Child, ClassRoom, Parent, ChildStatus } from '../../services/teacherApiService';

interface Student extends Child {
  class_name?: string;
  parent_email?: string;
  parent_name?: string;
  parent_phone?: string;
  status?: 'present' | 'absent' | 'late';
  attendance_rate?: number;
  behavior_score?: number;
  average_grade?: number;
  alerts?: number;
  last_update?: string;
  recent_activity?: string;
}

const TeacherStudentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    date_of_birth: '',
    class_name: '',
    parent_email: ''
  });
  const [editFormData, setEditFormData] = useState({
    full_name: '',
    date_of_birth: '',
    class_name: '',
    parent_email: ''
  });

  // Load data from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsData, classesData] = await Promise.all([
        teacherApiService.getStudents(),
        teacherApiService.getClasses()
      ]);
      
      // Get parent information and status for all students
      const studentsWithParents = await Promise.all(
        studentsData.map(async (student) => {
          let parentInfo: Parent | null = null;
          let childStatus: ChildStatus | null = null;
          
          // Get parent info
          if (student.parent_id) {
            try {
              parentInfo = await teacherApiService.getParent(student.parent_id);
            } catch (error) {
              console.warn(`Could not fetch parent info for student ${student.id}:`, error);
            }
          }
          
          // Get child status
          try {
            childStatus = await teacherApiService.getChildStatus(student.id);
          } catch (error) {
            console.warn(`Could not fetch status for student ${student.id}:`, error);
          }
          
          return {
            ...student,
            class_name: classesData.find(cls => cls.id === student.class_id)?.name,
            parent_email: parentInfo?.email,
            parent_name: parentInfo?.full_name,
            parent_phone: parentInfo?.phone,
            status: childStatus?.status || 'absent',
            attendance_rate: childStatus?.behavior_score || 0,
            behavior_score: childStatus?.behavior_score || 0,
            average_grade: childStatus?.behavior_score || 0, // Using behavior score as average grade for now
            alerts: childStatus?.alert_severity || 0,
            last_update: childStatus?.last_activity ? 'Hoạt động gần đây' : 'Chưa có hoạt động',
            recent_activity: childStatus?.recent_alert || 'Không có hoạt động gần đây'
          };
        })
      );
      
      setStudents(studentsWithParents);
      setClasses(classesData);
    } catch (error) {
      console.error('Error loading data:', error);
      showError('Không thể tải dữ liệu. Vui lòng kiểm tra kết nối API.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toString().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100';
      case 'absent': return 'text-red-600 bg-red-100';
      case 'late': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'present': return 'Có mặt';
      case 'absent': return 'Vắng mặt';
      case 'late': return 'Đến muộn';
      default: return 'Không rõ';
    }
  };

  const toggleStudentSelection = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  // Form handlers
  const convertDateToBackendFormat = (dateString: string): string => {
    // Convert YYYY-MM-DD to DD/MM/YYYY
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await teacherApiService.createStudent(
        formData.full_name,
        convertDateToBackendFormat(formData.date_of_birth),
        formData.class_name || undefined,
        formData.parent_email || undefined
      );
      
      setFormData({ full_name: '', date_of_birth: '', class_name: '', parent_email: '' });
      setShowAddModal(false);
      await loadData();
      showSuccess('Thêm học sinh thành công!');
    } catch (error) {
      console.error('Error adding student:', error);
      showError('Không thể thêm học sinh. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    
    try {
      setSaving(true);
      await teacherApiService.updateStudent(
        selectedStudent.id,
        editFormData.full_name,
        convertDateToBackendFormat(editFormData.date_of_birth),
        editFormData.class_name || undefined,
        editFormData.parent_email || undefined
      );
      
      setShowEditModal(false);
      setSelectedStudent(null);
      await loadData();
      showSuccess('Cập nhật học sinh thành công!');
    } catch (error) {
      console.error('Error updating student:', error);
      showError('Không thể cập nhật học sinh. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa học sinh này?')) return;
    
    try {
      await teacherApiService.deleteStudent(studentId);
      await loadData();
      showSuccess('Xóa học sinh thành công!');
    } catch (error) {
      console.error('Error deleting student:', error);
      showError('Không thể xóa học sinh. Vui lòng thử lại.');
    }
  };

  const convertDateFromBackend = (backendDate: string | null | undefined): string => {
    // Convert DD/MM/YYYY from backend or ISO date to YYYY-MM-DD for HTML input
    if (!backendDate) return '';
    
    // If it's already in ISO format (YYYY-MM-DD), return as is
    if (backendDate.includes('-') && backendDate.length === 10) {
      return backendDate;
    }
    
    // If it's in DD/MM/YYYY format, convert to YYYY-MM-DD
    if (backendDate.includes('/')) {
      const [day, month, year] = backendDate.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // If it's a full datetime string, extract date part
    try {
      const date = new Date(backendDate);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const handleViewStudent = async (studentId: number) => {
    try {
      const [student, childStatus] = await Promise.all([
        teacherApiService.getStudent(studentId),
        teacherApiService.getChildStatus(studentId)
      ]);
      
      // Find the student in our local state to get additional fields
      const localStudent = students.find(s => s.id === studentId);
      
      // Get parent information if parent_id exists
      let parentInfo: Parent | null = null;
      if (student.parent_id) {
        try {
          parentInfo = await teacherApiService.getParent(student.parent_id);
        } catch (error) {
          console.warn('Could not fetch parent info:', error);
        }
      }
      
      const studentWithExtras: Student = {
        ...student,
        class_name: localStudent?.class_name,
        parent_email: parentInfo?.email || localStudent?.parent_email,
        parent_name: parentInfo?.full_name || localStudent?.parent_name,
        parent_phone: parentInfo?.phone || localStudent?.parent_phone,
        status: childStatus?.status || 'absent',
        attendance_rate: childStatus?.behavior_score || 0,
        behavior_score: childStatus?.behavior_score || 0,
        average_grade: childStatus?.behavior_score || 0,
        alerts: childStatus?.alert_severity || 0,
        last_update: childStatus?.last_activity ? 'Hoạt động gần đây' : 'Chưa có hoạt động',
        recent_activity: childStatus?.recent_alert || 'Không có hoạt động gần đây'
      };
      setSelectedStudent(studentWithExtras);
      setEditFormData({
        full_name: student.full_name,
        date_of_birth: convertDateFromBackend(student.date_of_birth),
        class_name: localStudent?.class_name || '',
        parent_email: parentInfo?.email || localStudent?.parent_email || ''
      });
    } catch (error) {
      console.error('Error fetching student details:', error);
      showError('Không thể tải thông tin học sinh.');
    }
  };

  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    setEditFormData({
      full_name: student.full_name,
      date_of_birth: convertDateFromBackend(student.date_of_birth),
      class_name: student.class_name || '',
      parent_email: student.parent_email || ''
    });
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-blue-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Học sinh</h1>
                <p className="text-gray-600">Theo dõi và quản lý thông tin học sinh lớp 5A</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
             
              
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Thêm học sinh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng học sinh</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Có mặt hôm nay</p>
                <p className="text-2xl font-bold text-green-600">
                  {students.filter(s => s.status === 'present').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vắng mặt</p>
                <p className="text-2xl font-bold text-red-600">
                  {students.filter(s => s.status === 'absent').length}
                </p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đến muộn</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {students.filter(s => s.status === 'late').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm học sinh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="present">Có mặt</option>
                <option value="absent">Vắng mặt</option>
                <option value="late">Đến muộn</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              {selectedStudents.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    Đã chọn {selectedStudents.length} học sinh
                  </span>
                  <button className="btn-secondary text-sm">
                    Gửi thông báo
                  </button>
                </div>
              )}
              
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === filteredStudents.length}
                      onChange={selectAllStudents}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học sinh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Điểm danh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành vi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Điểm TB
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phụ huynh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {student.full_name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.full_name}</div>
                          <div className="text-sm text-gray-500">ID: {student.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                        {getStatusText(student.status)}
                      </span>
                      {(student.alerts || 0) > 0 && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {student.alerts} cảnh báo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.attendance_rate || 0}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${student.behavior_score || 0}%` }}
                          ></div>
                        </div>
                        <span>{student.behavior_score || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.average_grade || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{student.parent_name || 'Chưa có'}</div>
                        <div className="text-gray-500">{student.parent_phone || 'Chưa có'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewStudent(student.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEditModal(student)}
                          className="text-green-600 hover:text-green-900" 
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-900" 
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {student.parent_phone && (
                          <button className="text-green-600 hover:text-green-900" title="Gọi điện">
                            <Phone className="w-4 h-4" />
                          </button>
                        )}
                        {student.parent_email && (
                          <button className="text-purple-600 hover:text-purple-900" title="Gửi email">
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Thêm học sinh mới</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập họ tên học sinh"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lớp học</label>
                <select
                  value={formData.class_name}
                  onChange={(e) => setFormData({...formData, class_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn lớp học</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.name}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email phụ huynh</label>
                <input
                  type="email"
                  value={formData.parent_email}
                  onChange={(e) => setFormData({...formData, parent_email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@example.com"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Đang lưu...' : 'Thêm học sinh'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa học sinh</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.full_name}
                  onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                <input
                  type="date"
                  value={editFormData.date_of_birth}
                  onChange={(e) => setEditFormData({...editFormData, date_of_birth: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lớp học</label>
                <select
                  value={editFormData.class_name}
                  onChange={(e) => setEditFormData({...editFormData, class_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn lớp học</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.name}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email phụ huynh</label>
                <input
                  type="email"
                  value={editFormData.parent_email}
                  onChange={(e) => setEditFormData({...editFormData, parent_email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center space-x-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Đang lưu...' : 'Cập nhật'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && !showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Thông tin chi tiết học sinh</h2>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                    <p className="text-gray-900">{selectedStudent.full_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ID học sinh</label>
                    <p className="text-gray-900">{selectedStudent.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                    <p className="text-gray-900">{selectedStudent.date_of_birth || 'Chưa có'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lớp học</label>
                    <p className="text-gray-900">{selectedStudent.class_name || 'Chưa phân lớp'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin phụ huynh</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ tên phụ huynh</label>
                    <p className="text-gray-900">{selectedStudent.parent_name || 'Chưa có'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <p className="text-gray-900">{selectedStudent.parent_phone || 'Chưa có'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedStudent.parent_email || 'Chưa có'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê học tập</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedStudent.attendance_rate || 0}%</p>
                  <p className="text-sm text-gray-600">Tỷ lệ điểm danh</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{selectedStudent.behavior_score || 0}</p>
                  <p className="text-sm text-gray-600">Điểm hành vi</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selectedStudent.average_grade || 0}</p>
                  <p className="text-sm text-gray-600">Điểm trung bình</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="btn-secondary"
              >
                Đóng
              </button>
              <button 
                onClick={() => openEditModal(selectedStudent)}
                className="btn-primary"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudentManagement;
