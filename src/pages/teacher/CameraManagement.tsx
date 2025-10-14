import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  ClassRoom, 
  teacherApiService 
} from '../../services/teacherApiService';
import { Video, Eye, Settings, Trash2, Plus, Search, AlertCircle } from 'lucide-react';

interface CameraFormData {
  name: string;
  class_name: string;
  rtsp_url: string;
}

const CameraManagement: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
  const [deletingCamera, setDeletingCamera] = useState<Camera | null>(null);

  // Form data
  const [cameraForm, setCameraForm] = useState<CameraFormData>({
    name: '',
    class_name: '',
    rtsp_url: ''
  });

  // Load data
  useEffect(() => {
    loadCameras();
    loadClasses();
  }, []);

  const loadCameras = async () => {
    try {
      setLoading(true);
      const data = await teacherApiService.getCameras();
      setCameras(data);
    } catch (err: any) {
      setError('Không thể tải danh sách camera');
      console.error('Error loading cameras:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      const data = await teacherApiService.getClasses();
      setClasses(data);
    } catch (err: any) {
      console.error('Không thể tải danh sách lớp học:', err);
    }
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Camera CRUD operations
  const handleCreateCamera = () => {
    setEditingCamera(null);
    setCameraForm({
      name: '',
      class_name: '',
      rtsp_url: ''
    });
    setShowCameraModal(true);
  };

  const handleEditCamera = (camera: Camera) => {
    setEditingCamera(camera);
    const assignedClass = classes.find(c => c.id === camera.class_id);
    setCameraForm({
      name: camera.name,
      class_name: assignedClass?.name || '',
      rtsp_url: camera.rtsp_url || ''
    });
    setShowCameraModal(true);
  };

  const handleDeleteCamera = (camera: Camera) => {
    setDeletingCamera(camera);
    setShowDeleteModal(true);
  };

  const submitCameraForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingCamera) {
        // Update existing camera
        await teacherApiService.updateCamera(
          editingCamera.id,
          cameraForm.name,
          cameraForm.class_name || undefined,
          cameraForm.rtsp_url || undefined,
          undefined // active status unchanged
        );
        setSuccessMessage('Cập nhật camera thành công');
      } else {
        // Create new camera
        await teacherApiService.createCamera(
          cameraForm.name,
          cameraForm.class_name || undefined,
          cameraForm.rtsp_url || undefined
        );
        setSuccessMessage('Thêm camera thành công');
      }
      
      setShowCameraModal(false);
      await loadCameras();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi lưu thông tin camera');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteCamera = async () => {
    if (!deletingCamera) return;

    setLoading(true);
    setError(null);

    try {
      await teacherApiService.deleteCamera(deletingCamera.id);
      setSuccessMessage('Xóa camera thành công');
      setShowDeleteModal(false);
      await loadCameras();
    } catch (err: any) {
      setError(err.message || 'Không thể xóa camera');
    } finally {
      setLoading(false);
      setDeletingCamera(null);
    }
  };

  const toggleCameraStatus = async (camera: Camera) => {
    setLoading(true);
    try {
      await teacherApiService.updateCamera(
        camera.id,
        undefined,
        undefined,
        undefined,
        !camera.active
      );
      setSuccessMessage(`Camera đã được ${!camera.active ? 'bật' : 'tắt'}`);
      await loadCameras();
    } catch (err: any) {
      setError(err.message || 'Không thể thay đổi trạng thái camera');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getClassName = (classId?: number): string => {
    if (!classId) return 'Chưa gán lớp';
    const classRoom = classes.find(c => c.id === classId);
    return classRoom?.name || 'Không xác định';
  };

  // Filter and pagination
  const filteredCameras = cameras.filter(camera =>
    camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getClassName(camera.class_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (camera.rtsp_url && camera.rtsp_url.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredCameras.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCameras = filteredCameras.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Camera</h1>
          <p className="text-gray-600">Quản lý hệ thống camera giám sát lớp học</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng camera
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {cameras.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đang hoạt động
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {cameras.filter(c => c.active).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tắt
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {cameras.filter(c => !c.active).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Chưa gán lớp
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {cameras.filter(c => !c.class_id).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Cameras Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Danh sách Camera</h2>
              <button
                onClick={handleCreateCamera}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center"
                disabled={loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm Camera
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="flex justify-between items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm camera..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full max-w-md px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              {filteredCameras.length > 0 && (
                <div className="text-sm text-gray-600">
                  {searchTerm && (
                    <>Tìm thấy {filteredCameras.length} kết quả | </>
                  )}
                  Trang {currentPage}/{totalPages}
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên Camera
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lớp học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RTSP URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Đang tải...
                    </td>
                  </tr>
                )}
                
                {!loading && cameras.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Chưa có camera nào
                    </td>
                  </tr>
                )}

                {!loading && searchTerm && filteredCameras.length === 0 && cameras.length > 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Không tìm thấy camera nào phù hợp với "{searchTerm}"
                    </td>
                  </tr>
                )}

                {paginatedCameras.map((camera) => (
                  <tr key={camera.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Video className="w-5 h-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{camera.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getClassName(camera.class_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono max-w-xs truncate">
                        {camera.rtsp_url || 'Chưa có'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleCameraStatus(camera)}
                        disabled={loading}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          camera.active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } transition-colors`}
                      >
                        {camera.active ? 'Hoạt động' : 'Tắt'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditCamera(camera)}
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-md text-xs font-medium"
                          disabled={loading}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteCamera(camera)}
                          className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md text-xs font-medium"
                          disabled={loading}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredCameras.length > itemsPerPage && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị{' '}
                    <span className="font-medium">{startIndex + 1}</span>
                    {' '}đến{' '}
                    <span className="font-medium">
                      {Math.min(endIndex, filteredCameras.length)}
                    </span>
                    {' '}trong{' '}
                    <span className="font-medium">{filteredCameras.length}</span>
                    {' '}kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Trang trước</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span
                            key={page}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Trang sau</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Camera Form Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCamera ? 'Sửa thông tin camera' : 'Thêm camera mới'}
              </h3>
              
              <form onSubmit={submitCameraForm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên camera *
                  </label>
                  <input
                    type="text"
                    required
                    value={cameraForm.name}
                    onChange={(e) => setCameraForm({ ...cameraForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ví dụ: Camera Lớp 5A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lớp học
                  </label>
                  <select
                    value={cameraForm.class_name}
                    onChange={(e) => setCameraForm({ ...cameraForm, class_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn lớp học --</option>
                    {classes.map((classRoom) => (
                      <option key={classRoom.id} value={classRoom.name}>
                        {classRoom.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RTSP URL
                  </label>
                  <input
                    type="url"
                    value={cameraForm.rtsp_url}
                    onChange={(e) => setCameraForm({ ...cameraForm, rtsp_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="rtsp://username:password@ip:port/stream"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL để kết nối với camera qua giao thức RTSP
                  </p>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCameraModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 hover:bg-gray-400 rounded-md"
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    disabled={loading}
                  >
                    {loading ? 'Đang lưu...' : (editingCamera ? 'Cập nhật' : 'Thêm mới')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingCamera && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Xác nhận xóa camera</h3>
              <p className="text-sm text-gray-500 mb-4">
                Bạn có chắc chắn muốn xóa camera <strong>{deletingCamera.name}</strong>? 
                Hành động này không thể hoàn tác.
              </p>
              
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-300 hover:bg-gray-400 rounded-md"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDeleteCamera}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                  disabled={loading}
                >
                  {loading ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraManagement;