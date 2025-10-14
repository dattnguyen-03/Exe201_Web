import React, { useState, useEffect } from 'react'
import { User, Edit, Camera, Calendar, Heart, Award, MapPin, Phone, Mail, X, Loader2 } from 'lucide-react'
import { parentApiService, Child } from '../../services/parentApiService'
import { authService } from '../../services/authService'

const ParentChildProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState(authService.getUser())

  // Load children data
  useEffect(() => {
    const loadChildren = async () => {
      try {
        setLoading(true)
        const data = await parentApiService.getChildren()
        setChildren(data)
        if (data.length > 0) {
          setSelectedChild(data[0])
        }
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
        console.error('Error loading children:', err)
      } finally {
        setLoading(false)
      }
    }

    loadChildren()
  }, [])

  // Mock data for additional info (không có API cho phần này)
  const additionalInfo = {
    class: 'Lớp Mẫu Giáo A',
    teacher: 'Cô Nguyễn Thị Lan',
    startDate: '01/09/2023',
    allergies: ['Đậu phộng', 'Sữa bò'],
    medicalNotes: 'Không có vấn đề sức khỏe đặc biệt',
    emergencyContacts: [
      { name: 'Nguyễn Văn Bình (Bố)', phone: '0901 234 567', relationship: 'Bố' },
      { name: 'Trần Thị Hoa (Mẹ)', phone: '0902 345 678', relationship: 'Mẹ' }
    ],
    achievements: [
      { title: 'Học sinh giỏi tháng 10', date: '31/10/2023', type: 'academic' },
      { title: 'Bé ngoan nhất tuần', date: '15/10/2023', type: 'behavior' },
      { title: 'Giải nhất cuộc thi vẽ', date: '20/09/2023', type: 'creativity' }
    ]
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  const calculateAge = (birthDate: string): number => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Đang tải thông tin con...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <User className="w-8 h-8 mx-auto mb-4 text-red-600" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  if (!selectedChild) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có thông tin con</h3>
          <p className="text-gray-500">Vui lòng liên hệ nhà trường để cập nhật thông tin</p>
        </div>
      </div>
    )
  }

  const childProfile = {
    name: selectedChild.full_name,
    age: calculateAge(selectedChild.date_of_birth),
    birthDate: formatDate(selectedChild.date_of_birth),
    class: additionalInfo.class,
    teacher: additionalInfo.teacher,
    startDate: additionalInfo.startDate,
    allergies: additionalInfo.allergies,
    medicalNotes: additionalInfo.medicalNotes,
    emergencyContacts: additionalInfo.emergencyContacts,
    achievements: additionalInfo.achievements
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">👶 Hồ sơ con em</h1>
            <p className="text-purple-100">Thông tin chi tiết và theo dõi phát triển</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
            title={isEditing ? 'Lưu thay đổi hồ sơ' : 'Chỉnh sửa thông tin hồ sơ'}
          >
            <Edit className="w-4 h-4" />
            <span>{isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}</span>
          </button>
        </div>
      </div>

      {/* Child Selector - nếu có nhiều con */}
      {children.length > 1 && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Chọn con để xem thông tin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedChild?.id === child.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-center">
                  <User className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-medium text-gray-900">{child.full_name}</h4>
                  <p className="text-sm text-gray-600">
                    {calculateAge(child.date_of_birth)} tuổi
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center">
                <User className="w-16 h-16 text-white" />
              </div>
              <button
                className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                title="Thay đổi ảnh đại diện"
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-1">{childProfile.name}</h2>
            <p className="text-gray-600 mb-4">{childProfile.class}</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Tuổi:</span>
                <span className="font-medium">{childProfile.age} tuổi</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Ngày sinh:</span>
                <span className="font-medium">{childProfile.birthDate}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Giáo viên:</span>
                <span className="font-medium">{childProfile.teacher}</span>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="card mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📞 Liên hệ khẩn cấp</h3>
            <div className="space-y-3">
              {childProfile.emergencyContacts.map((contact, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{contact.name}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {contact.relationship}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{contact.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Thông tin cơ bản</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input-field"
                    defaultValue={childProfile.name}
                    title="Nhập họ và tên đầy đủ của trẻ"
                    placeholder="Nhập họ và tên"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{childProfile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                {isEditing ? (
                  <input
                    type="date"
                    className="input-field"
                    title="Chọn ngày sinh của trẻ"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{childProfile.birthDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lớp học</label>
                {isEditing ? (
                  <select
                    className="input-field"
                    title="Chọn lớp học của trẻ"
                  >
                    <option>{childProfile.class}</option>
                    <option>Lớp Mẫu Giáo B</option>
                    <option>Lớp Chồi A</option>
                  </select>
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{childProfile.class}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày nhập học</label>
                {isEditing ? (
                  <input
                    type="date"
                    className="input-field"
                    title="Chọn ngày nhập học"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{childProfile.startDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🏥 Thông tin y tế</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dị ứng</label>
                {isEditing ? (
                  <div className="space-y-2">
                    {childProfile.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          className="input-field flex-1"
                          defaultValue={allergy}
                          title={`Chỉnh sửa dị ứng ${index + 1}`}
                          placeholder="Nhập loại dị ứng"
                        />
                        <button
                          className="text-red-500 hover:text-red-700"
                          title={`Xóa dị ứng ${allergy}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      title="Thêm dị ứng mới"
                    >
                      + Thêm dị ứng
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {childProfile.allergies.map((allergy, index) => (
                      <span key={index} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                        {allergy}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú y tế</label>
                {isEditing ? (
                  <textarea
                    className="input-field"
                    rows={3}
                    defaultValue={childProfile.medicalNotes}
                    title="Nhập ghi chú y tế"
                    placeholder="Nhập thông tin y tế quan trọng"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg">{childProfile.medicalNotes}</p>
                )}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 Thành tích và khen thưởng</h3>

            <div className="space-y-3">
              {childProfile.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex-shrink-0">
                    {achievement.type === 'academic' && (
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                    )}
                    {achievement.type === 'behavior' && (
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                    )}
                    {achievement.type === 'creativity' && (
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-500 flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{achievement.date}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentChildProfile
