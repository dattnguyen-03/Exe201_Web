import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Printer,
  Share2,
  RefreshCw
} from 'lucide-react';
import { teacherApiService, Alert, BehaviorLog, Child, ClassRoom } from '../../services/teacherApiService';

interface ReportData {
  id: string;
  title: string;
  type: 'behavior' | 'attendance' | 'safety' | 'academic';
  dateRange: string;
  generatedAt: string;
  status: 'completed' | 'processing' | 'failed';
  fileUrl?: string;
  summary: {
    totalStudents: number;
    totalAlerts: number;
    avgBehaviorScore: number;
    attendanceRate: number;
  };
}

interface ReportFilter {
  dateFrom: string;
  dateTo: string;
  classId?: number;
  reportType: string;
  includeDetails: boolean;
}

const TeacherReports: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [students, setStudents] = useState<Child[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const [reportFilter, setReportFilter] = useState<ReportFilter>({
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    reportType: 'behavior',
    includeDetails: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsData, classesData, alertsData] = await Promise.all([
        teacherApiService.getStudents(),
        teacherApiService.getClasses(),
        teacherApiService.getAlerts()
      ]);
      
      setStudents(studentsData);
      setClasses(classesData);
      setAlerts(alertsData);
      
      // Generate sample reports
      generateSampleReports(studentsData, alertsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleReports = (studentsData: Child[], alertsData: Alert[]) => {
    const sampleReports: ReportData[] = [
      {
        id: '1',
        title: 'Báo cáo hành vi học sinh - Tháng 12/2024',
        type: 'behavior',
        dateRange: '01/12/2024 - 31/12/2024',
        generatedAt: '2024-12-31T10:30:00Z',
        status: 'completed',
        fileUrl: '/reports/behavior-dec-2024.pdf',
        summary: {
          totalStudents: studentsData.length,
          totalAlerts: alertsData.length,
          avgBehaviorScore: 8.5,
          attendanceRate: 95.2
        }
      },
      {
        id: '2',
        title: 'Báo cáo điểm danh - Tuần 4/12/2024',
        type: 'attendance',
        dateRange: '23/12/2024 - 29/12/2024',
        generatedAt: '2024-12-29T16:00:00Z',
        status: 'completed',
        fileUrl: '/reports/attendance-week4-dec-2024.pdf',
        summary: {
          totalStudents: studentsData.length,
          totalAlerts: 0,
          avgBehaviorScore: 0,
          attendanceRate: 97.8
        }
      },
      {
        id: '3',
        title: 'Báo cáo an toàn - Tháng 12/2024',
        type: 'safety',
        dateRange: '01/12/2024 - 31/12/2024',
        generatedAt: '2024-12-31T09:15:00Z',
        status: 'processing',
        summary: {
          totalStudents: studentsData.length,
          totalAlerts: alertsData.filter(a => a.severity >= 3).length,
          avgBehaviorScore: 0,
          attendanceRate: 0
        }
      },
      {
        id: '4',
        title: 'Báo cáo học tập - Học kỳ 1/2024',
        type: 'academic',
        dateRange: '01/09/2024 - 31/12/2024',
        generatedAt: '2024-12-30T14:20:00Z',
        status: 'completed',
        fileUrl: '/reports/academic-semester1-2024.pdf',
        summary: {
          totalStudents: studentsData.length,
          totalAlerts: 0,
          avgBehaviorScore: 8.2,
          attendanceRate: 96.5
        }
      }
    ];
    
    setReports(sampleReports);
  };

  const generateReport = async () => {
    try {
      setGenerating(true);
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport: ReportData = {
        id: Date.now().toString(),
        title: `Báo cáo ${reportFilter.reportType} - ${new Date().toLocaleDateString('vi-VN')}`,
        type: reportFilter.reportType as any,
        dateRange: `${reportFilter.dateFrom} - ${reportFilter.dateTo}`,
        generatedAt: new Date().toISOString(),
        status: 'completed',
        fileUrl: `/reports/${reportFilter.reportType}-${Date.now()}.pdf`,
        summary: {
          totalStudents: students.length,
          totalAlerts: alerts.length,
          avgBehaviorScore: 8.3,
          attendanceRate: 95.8
        }
      };
      
      setReports(prev => [newReport, ...prev]);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = (report: ReportData) => {
    if (report.fileUrl) {
      // Simulate download
      const link = document.createElement('a');
      link.href = report.fileUrl;
      link.download = `${report.title}.pdf`;
      link.click();
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'behavior': return 'bg-blue-100 text-blue-800';
      case 'attendance': return 'bg-green-100 text-green-800';
      case 'safety': return 'bg-red-100 text-red-800';
      case 'academic': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'behavior': return 'Hành vi';
      case 'attendance': return 'Điểm danh';
      case 'safety': return 'An toàn';
      case 'academic': return 'Học tập';
      default: return 'Khác';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'processing': return 'Đang xử lý';
      case 'failed': return 'Lỗi';
      default: return 'Không xác định';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-blue-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
                <p className="text-gray-600">Tạo và quản lý các báo cáo chi tiết</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={loadData}
                className="btn-secondary flex items-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Làm mới</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng báo cáo</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">
                  {reports.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đang xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reports.filter(r => r.status === 'processing').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng cảnh báo</p>
                <p className="text-2xl font-bold text-red-600">{alerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generate Report Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Tạo báo cáo mới</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại báo cáo
                </label>
                <select
                  value={reportFilter.reportType}
                  onChange={(e) => setReportFilter(prev => ({ ...prev, reportType: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="behavior">Báo cáo hành vi</option>
                  <option value="attendance">Báo cáo điểm danh</option>
                  <option value="safety">Báo cáo an toàn</option>
                  <option value="academic">Báo cáo học tập</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={reportFilter.dateFrom}
                  onChange={(e) => setReportFilter(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={reportFilter.dateTo}
                  onChange={(e) => setReportFilter(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lớp học
                </label>
                <select
                  value={reportFilter.classId || ''}
                  onChange={(e) => setReportFilter(prev => ({ ...prev, classId: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tất cả lớp</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeDetails"
                  checked={reportFilter.includeDetails}
                  onChange={(e) => setReportFilter(prev => ({ ...prev, includeDetails: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="includeDetails" className="ml-2 block text-sm text-gray-700">
                  Bao gồm chi tiết
                </label>
              </div>

              <button
                onClick={generateReport}
                disabled={generating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {generating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Đang tạo báo cáo...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Tạo báo cáo</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Reports List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm báo cáo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="behavior">Hành vi</option>
                  <option value="attendance">Điểm danh</option>
                  <option value="safety">An toàn</option>
                  <option value="academic">Học tập</option>
                </select>
              </div>
            </div>

            {/* Reports */}
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getReportTypeColor(report.type)}`}>
                          {getReportTypeLabel(report.type)}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
                          {getStatusLabel(report.status)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{report.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Thời gian: {report.dateRange} | Tạo lúc: {new Date(report.generatedAt).toLocaleString('vi-VN')}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{report.summary.totalStudents}</p>
                          <p className="text-xs text-gray-600">Học sinh</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">{report.summary.totalAlerts}</p>
                          <p className="text-xs text-gray-600">Cảnh báo</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{report.summary.avgBehaviorScore}</p>
                          <p className="text-xs text-gray-600">Điểm TB</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{report.summary.attendanceRate}%</p>
                          <p className="text-xs text-gray-600">Điểm danh</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {report.status === 'completed' && (
                        <>
                          <button
                            onClick={() => downloadReport(report)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Tải xuống"
                          >
                            <Download className="w-5 h-5 text-blue-600" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Xem"
                          >
                            <Eye className="w-5 h-5 text-gray-600" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                            title="In"
                          >
                            <Printer className="w-5 h-5 text-gray-600" />
                          </button>
                          <button
                            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Chia sẻ"
                          >
                            <Share2 className="w-5 h-5 text-gray-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredReports.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-500">Không có báo cáo nào</p>
                  <p className="text-sm text-gray-400">Tạo báo cáo đầu tiên của bạn</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherReports;
