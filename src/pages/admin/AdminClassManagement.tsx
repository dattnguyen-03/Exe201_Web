import React, { useState } from 'react'
import { Users, Plus, Edit, Trash2, Search, Filter, User, Camera } from 'lucide-react'

const AdminClassManagement: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const classes = [
    {
      id: 'kg-a',
      name: 'Lớp Mẫu Giáo A',
      teacher: 'Nguyễn Thị Lan',
      studentCount: 22,
      ageRange: '4-5 tuổi',
      room: 'Phòng 101'
    },
    {
      id: 'kg-b',
      name: 'Lớp Mẫu Giáo B',
      teacher: 'Trần Văn Minh',
      studentCount: 20,
      ageRange: '4-5 tuổi',
      room: 'Phòng 102'
    },
    {
      id: 'g1-a',
      name: 'Lớp Chồi A',
      teacher: 'Lê Thị Hạnh',
      studentCount: 25,
      ageRange: '5-6 tuổi',
      room: 'Phòng 201'
    },
    {
      id: 'g1-b',
      name: 'Lớp Chồi B',
      teacher: 'Phạm Văn Dũng',
      studentCount: 23,
      ageRange: '5-6 tuổi',
      room: 'Phòng 202'
    }
  ]

  const students = [
    {
      id: 1,
      name: 'Nguyễn Minh An',
      age: 5,
      class: 'kg-a',
      birthDate: '2019-03-15',
      parentName: 'Nguyễn Văn Bình',
      parentPhone: '0901 234 567',
      hasPhoto: true,
      alertCount: 12
    },
    {
      id: 2,
      name: 'Trần Thị Bích',
      age: 5,
      class: 'kg-a',
      birthDate: '2019-05-22',
      parentName: 'Trần Văn Minh',
      parentPhone: '0902 345 678',
      hasPhoto: true,
      alertCount: 8
    },
    {
      id: 3,
      name: 'Lê Văn Đức',
      age: 4,
      class: 'kg-a',
      birthDate: '2019-08-10',
      parentName: 'Lê Thị Hạnh',
      parentPhone: '0903 456 789',
      hasPhoto: false,
      alertCount: 15
    }
  ]

  const filteredStudents = selectedClass
    ? students.filter(student => student.class === selectedClass)
    : students

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý lớp học & học sinh</h1>
          <p className="text-gray-600 mt-2">Quản lý lớp, học sinh và hồ sơ cá nhân</p>
        </div>

        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Thêm học sinh mới</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Danh sách lớp */}
        <aside className="space-y-4">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Danh sách lớp</h2>

            <div className="space-y-2">
              <button
                onClick={() => setSelectedClass(null)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${selectedClass === null
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Tất cả học sinh</span>
                  <span className="text-sm text-gray-500">{students.length}</span>
                </div>
              </button>

              {classes.map((classItem) => (
                <button
                  key={classItem.id}
                  onClick={() => setSelectedClass(classItem.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${selectedClass === classItem.id
                      ? 'bg-blue-50 border-2 border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{classItem.name}</span>
                      <p className="text-xs text-gray-500">{classItem.teacher}</p>
                    </div>
                    <span className="text-sm text-gray-500">{classItem.studentCount}</span>
                  </div>
                </button>
              ))}
            </div>

            <button className="w-full mt-4 btn-secondary flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Thêm lớp học</span>
            </button>
          </div>
        </aside>

        {/* Quản lý học sinh */}
        <main className="lg:col-span-3 space-y-6">
          {/* Tìm kiếm và bộ lọc */}
          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm học sinh..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn-secondary flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Bộ lọc</span>
              </button>
            </div>
          </div>

          {/* Thông tin lớp */}
          {selectedClass && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {classes.find(c => c.id === selectedClass)?.name} - Thông tin lớp
                </h2>
                <button className="btn-secondary flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Chỉnh sửa lớp</span>
                </button>
              </div>

              {classes
                .filter(c => c.id === selectedClass)
                .map(classItem => (
                  <div key={classItem.id} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Giáo viên chủ nhiệm</p>
                      <p className="font-medium">{classItem.teacher}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sĩ số</p>
                      <p className="font-medium">{classItem.studentCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Độ tuổi</p>
                      <p className="font-medium">{classItem.ageRange}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phòng học</p>
                      <p className="font-medium">{classItem.room}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Danh sách học sinh */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedClass ? 'Học sinh trong lớp' : 'Tất cả học sinh'}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredStudents.length} học sinh
              </span>
            </div>

            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {student.hasPhoto ? (
                        <Camera className="w-6 h-6 text-gray-400" />
                      ) : (
                        <User className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-500">
                        Tuổi {student.age} • Ngày sinh: {student.birthDate}
                      </p>
                      <p className="text-sm text-gray-500">
                        Phụ huynh: {student.parentName} • {student.parentPhone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{student.alertCount} cảnh báo</p>
                      <p className="text-xs text-gray-500">Tháng này</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Chỉnh sửa học sinh"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Xóa học sinh"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trạng thái nhận diện khuôn mặt */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Trạng thái nhận diện khuôn mặt</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {students.filter(s => s.hasPhoto).length}
                </div>
                <div className="text-sm text-green-700">Có ảnh</div>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {students.filter(s => !s.hasPhoto).length}
                </div>
                <div className="text-sm text-yellow-700">Thiếu ảnh</div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((students.filter(s => s.hasPhoto).length / students.length) * 100)}%
                </div>
                <div className="text-sm text-blue-700">Sẵn sàng nhận diện</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminClassManagement
