import React, { useState } from 'react'
import { Users, Plus, Edit, Trash2, Search, Filter, User, Camera } from 'lucide-react'

const AdminClassManagement: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const classes = [
    {
      id: 'kg-a',
      name: 'Kindergarten A',
      teacher: 'Sarah Johnson',
      studentCount: 22,
      ageRange: '4-5 years',
      room: 'Room 101'
    },
    {
      id: 'kg-b',
      name: 'Kindergarten B',
      teacher: 'Michael Chen',
      studentCount: 20,
      ageRange: '4-5 years',
      room: 'Room 102'
    },
    {
      id: 'g1-a',
      name: 'Grade 1A',
      teacher: 'Emily Davis',
      studentCount: 25,
      ageRange: '5-6 years',
      room: 'Room 201'
    },
    {
      id: 'g1-b',
      name: 'Grade 1B',
      teacher: 'David Wilson',
      studentCount: 23,
      ageRange: '5-6 years',
      room: 'Room 202'
    }
  ]

  const students = [
    {
      id: 1,
      name: 'Emma Johnson',
      age: 5,
      class: 'kg-a',
      birthDate: '2019-03-15',
      parentName: 'John Johnson',
      parentPhone: '+1 (555) 123-4567',
      hasPhoto: true,
      alertCount: 12
    },
    {
      id: 2,
      name: 'Michael Chen',
      age: 5,
      class: 'kg-a',
      birthDate: '2019-05-22',
      parentName: 'Lisa Chen',
      parentPhone: '+1 (555) 234-5678',
      hasPhoto: true,
      alertCount: 8
    },
    {
      id: 3,
      name: 'Sofia Rodriguez',
      age: 4,
      class: 'kg-a',
      birthDate: '2019-08-10',
      parentName: 'Carlos Rodriguez',
      parentPhone: '+1 (555) 345-6789',
      hasPhoto: false,
      alertCount: 15
    }
  ]

  const filteredStudents = selectedClass
    ? students.filter(student => student.class === selectedClass)
    : students

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Class & Student Management</h1>
          <p className="text-gray-600 mt-2">Manage classes, students, and their profiles</p>
        </div>

        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Class List */}
        <aside className="space-y-4">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Classes</h2>

            <div className="space-y-2">
              <button
                onClick={() => setSelectedClass(null)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${selectedClass === null
                    ? 'bg-primary-50 border-2 border-primary-200'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">All Students</span>
                  <span className="text-sm text-gray-500">{students.length}</span>
                </div>
              </button>

              {classes.map((classItem) => (
                <button
                  key={classItem.id}
                  onClick={() => setSelectedClass(classItem.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${selectedClass === classItem.id
                      ? 'bg-primary-50 border-2 border-primary-200'
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
              <span>Add Class</span>
            </button>
          </div>
        </aside>

        {/* Student Management */}
        <main className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn-secondary flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Class Details */}
          {selectedClass && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {classes.find(c => c.id === selectedClass)?.name} Details
                </h2>
                <button className="btn-secondary flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Edit Class</span>
                </button>
              </div>

              {classes
                .filter(c => c.id === selectedClass)
                .map(classItem => (
                  <div key={classItem.id} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Teacher</p>
                      <p className="font-medium">{classItem.teacher}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Students</p>
                      <p className="font-medium">{classItem.studentCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Age Range</p>
                      <p className="font-medium">{classItem.ageRange}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Room</p>
                      <p className="font-medium">{classItem.room}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Student List */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedClass ? 'Class Students' : 'All Students'}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredStudents.length} students
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
                        Age {student.age} • Born: {student.birthDate}
                      </p>
                      <p className="text-sm text-gray-500">
                        Parent: {student.parentName} • {student.parentPhone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{student.alertCount} alerts</p>
                      <p className="text-xs text-gray-500">This month</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Edit student profile"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-danger-600 transition-colors"
                        title="Delete student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Facial Recognition Status */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Facial Recognition Status</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-success-50 rounded-lg">
                <div className="text-2xl font-bold text-success-600">
                  {students.filter(s => s.hasPhoto).length}
                </div>
                <div className="text-sm text-success-700">Photos Available</div>
              </div>

              <div className="text-center p-4 bg-warning-50 rounded-lg">
                <div className="text-2xl font-bold text-warning-600">
                  {students.filter(s => !s.hasPhoto).length}
                </div>
                <div className="text-sm text-warning-700">Photos Missing</div>
              </div>

              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">
                  {Math.round((students.filter(s => s.hasPhoto).length / students.length) * 100)}%
                </div>
                <div className="text-sm text-primary-700">Recognition Ready</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminClassManagement
