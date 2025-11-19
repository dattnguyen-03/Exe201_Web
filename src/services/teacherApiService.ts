import { authService } from './authService';

const API_BASE_URL = 'https://safenestai.onrender.com';

// Types
export interface Teacher {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  experience?: string;
  education_level?: string;
  school_id?: number;
}

export interface Parent {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  emergency_contact?: string;
  relationship?: string;
  role: string;
}

export interface ChildStatus {
  child_id: number;
  status: 'present' | 'absent' | 'late';
  behavior_score: number;
  last_activity?: string;
  recent_alert?: string;
  alert_severity: number;
}

export interface ClassRoom {
  id: number;
  name: string;
  teacher_id?: number;
  school_id?: number;
}

export interface Child {
  id: number;
  full_name: string;
  date_of_birth?: string;
  class_id?: number;
  parent_id?: number;
}

export interface Camera {
  id: number;
  name: string;
  class_id?: number;
  rtsp_url?: string;
  active: boolean;
}

export interface Alert {
  id: number;
  child_id: number;
  camera_id?: number;
  danger_zone_id?: number;
  alert_type: string;
  severity: number;
  acknowledged: boolean;
  created_at: string;
}

export interface BehaviorLog {
  id: number;
  child_id: number;
  camera_id?: number;
  behavior_type: string;
  confidence: number;
  timestamp: string;
}

export interface DashboardStats {
  msg: string;
  stats: {
    students: number;
    present_today: number;
    avg_behavior_score: number;
    avg_class_score: number;
  };
}

// API Service Class
class TeacherApiService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = authService.getToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private async makeFormRequest(endpoint: string, formData: FormData) {
    const token = authService.getToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Dashboard
  async getDashboard(): Promise<DashboardStats> {
    return this.makeRequest('/api/school/dashboard');
  }

  // Classes
  async getClasses(): Promise<ClassRoom[]> {
    return this.makeRequest('/api/school/classes');
  }

  async createClass(name: string, teacherEmail?: string): Promise<ClassRoom> {
    const formData = new FormData();
    formData.append('name', name);
    if (teacherEmail) {
      formData.append('teacher_email', teacherEmail);
    }
    return this.makeFormRequest('/api/school/classes', formData);
  }

  async updateClass(id: number, name?: string, teacherEmail?: string): Promise<ClassRoom> {
    const formData = new FormData();
    if (name !== undefined) formData.append('name', name);
    if (teacherEmail !== undefined) formData.append('teacher_email', teacherEmail);
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/school/classes/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async deleteClass(id: number): Promise<{ msg: string }> {
    return this.makeRequest(`/api/school/classes/${id}`, { method: 'DELETE' });
  }

  // Students
  async getStudents(): Promise<Child[]> {
    return this.makeRequest('/api/school/children');
  }

  async getStudent(id: number): Promise<Child> {
    return this.makeRequest(`/api/school/children/${id}`);
  }

  async createStudent(
    fullName: string,
    dateOfBirth: string,
    className?: string,
    parentEmail?: string
  ): Promise<Child> {
    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('date_of_birth', dateOfBirth);
    if (className) formData.append('class_name', className);
    if (parentEmail) formData.append('parent_email', parentEmail);
    
    return this.makeFormRequest('/api/school/children', formData);
  }

  async updateStudent(
    id: number,
    fullName?: string,
    dateOfBirth?: string,
    className?: string,
    parentEmail?: string
  ): Promise<Child> {
    const formData = new FormData();
    if (fullName !== undefined) formData.append('full_name', fullName);
    if (dateOfBirth !== undefined) formData.append('date_of_birth', dateOfBirth);
    if (className !== undefined) formData.append('class_name', className);
    if (parentEmail !== undefined) formData.append('parent_email', parentEmail);
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/school/children/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async deleteStudent(id: number): Promise<{ msg: string }> {
    return this.makeRequest(`/api/school/children/${id}`, { method: 'DELETE' });
  }

  // Parents
  async getParent(parentId: number): Promise<Parent> {
    return this.makeRequest(`/api/school/parents/${parentId}`);
  }

  // Child Status
  async getChildStatus(childId: number): Promise<ChildStatus> {
    return this.makeRequest(`/api/school/children/${childId}/status`);
  }

  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    return this.makeRequest('/api/school/teachers');
  }

  async createTeacher(teacherData: {
    email: string;
    full_name: string;
    phone?: string;
    address?: string;
    emergency_contact?: string;
    experience?: string;
    education_level?: string;
  }): Promise<Teacher> {
    const formData = new FormData();
    formData.append('email', teacherData.email);
    formData.append('full_name', teacherData.full_name);
    if (teacherData.phone) formData.append('phone', teacherData.phone);
    if (teacherData.address) formData.append('address', teacherData.address);
    if (teacherData.emergency_contact) formData.append('emergency_contact', teacherData.emergency_contact);
    if (teacherData.experience) formData.append('experience', teacherData.experience);
    if (teacherData.education_level) formData.append('education_level', teacherData.education_level);
    
    return this.makeFormRequest('/api/school/teachers', formData);
  }

  async updateTeacher(
    email: string,
    teacherData: {
      full_name?: string;
      phone?: string;
      address?: string;
      emergency_contact?: string;
      experience?: string;
      education_level?: string;
    }
  ): Promise<Teacher> {
    const formData = new FormData();
    if (teacherData.full_name !== undefined) formData.append('full_name', teacherData.full_name);
    if (teacherData.phone !== undefined) formData.append('phone', teacherData.phone);
    if (teacherData.address !== undefined) formData.append('address', teacherData.address);
    if (teacherData.emergency_contact !== undefined) formData.append('emergency_contact', teacherData.emergency_contact);
    if (teacherData.experience !== undefined) formData.append('experience', teacherData.experience);
    if (teacherData.education_level !== undefined) formData.append('education_level', teacherData.education_level);
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/school/teachers/${email}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async deleteTeacher(email: string): Promise<{ msg: string }> {
    return this.makeRequest(`/api/school/teachers/${email}`, { method: 'DELETE' });
  }

  // Class assignment
  async assignTeacherToClass(classId: number, teacherEmail: string): Promise<ClassRoom> {
    const formData = new FormData();
    formData.append('teacher_email', teacherEmail);
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/school/classes/${classId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Cameras
  async getCameras(): Promise<Camera[]> {
    return this.makeRequest('/api/school/cameras');
  }

  async createCamera(
    name: string,
    className?: string,
    rtspUrl?: string
  ): Promise<Camera> {
    const formData = new FormData();
    formData.append('name', name);
    if (className) formData.append('class_name', className);
    if (rtspUrl) formData.append('rtsp_url', rtspUrl);
    
    return this.makeFormRequest('/api/school/cameras', formData);
  }

  async updateCamera(
    id: number,
    name?: string,
    className?: string,
    rtspUrl?: string,
    active?: boolean
  ): Promise<Camera> {
    const formData = new FormData();
    if (name !== undefined) formData.append('name', name);
    if (className !== undefined) formData.append('class_name', className);
    if (rtspUrl !== undefined) formData.append('rtsp_url', rtspUrl);
    if (active !== undefined) formData.append('active', active.toString());
    
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/api/school/cameras/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async deleteCamera(id: number): Promise<{ msg: string }> {
    return this.makeRequest(`/api/school/cameras/${id}`, { method: 'DELETE' });
  }

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    return this.makeRequest('/api/school/alerts');
  }

  // AI Endpoints
  async uploadFaceRecognition(childId: number, file: File): Promise<{ id: number; path: string }> {
    const formData = new FormData();
    formData.append('child_id', childId.toString());
    formData.append('file', file);
    
    return this.makeFormRequest('/api/ai/face-recognition', formData);
  }

  async analyzeBehavior(videoFile: File): Promise<{ events: any[]; note: string }> {
    const formData = new FormData();
    formData.append('video_file', videoFile);
    
    return this.makeFormRequest('/api/ai/analyze-behavior', formData);
  }

  async detectDanger(streamId?: number): Promise<{ danger: boolean; note: string }> {
    const formData = new FormData();
    if (streamId) formData.append('stream_id', streamId.toString());
    
    return this.makeFormRequest('/api/ai/danger-detection', formData);
  }

  // WebSocket connections
  connectToAlertsWebSocket(): WebSocket {
    const token = authService.getToken();
    // Sử dụng wss:// cho production (HTTPS)
    const wsUrl = API_BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    return new WebSocket(`${wsUrl}/api/streaming/alerts?token=${token}`);
  }

  connectToCameraWebSocket(cameraId: number): WebSocket {
    const token = authService.getToken();
    // Sử dụng wss:// cho production (HTTPS)
    const wsUrl = API_BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://');
    return new WebSocket(`${wsUrl}/api/streaming/camera/${cameraId}?token=${token}`);
  }
}

export const teacherApiService = new TeacherApiService();
