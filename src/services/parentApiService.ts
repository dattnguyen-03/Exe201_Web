// Parent API Service - Kết nối với backend SafeNest AI
import { authService } from './authService'

const API_BASE_URL = 'https://safenestai.onrender.com'

// Types cho Parent API
export interface Child {
  id: number
  full_name: string
  date_of_birth: string
  class_id?: number
  parent_id?: number
}

export interface Alert {
  id: number
  child_id: number
  camera_id?: number
  danger_zone_id?: number
  alert_type: string
  severity: number
  acknowledged: boolean
  created_at: string
}

export interface DashboardData {
  msg: string
  children_count: number
  recent_alerts_count: number
  children: Child[]
  recent_alerts: Alert[]
}

export interface ApiError {
  detail: string | Array<{
    loc: string[]
    msg: string
    type: string
  }>
}

export interface ParentProfile {
  id: number
  email: string
  full_name: string
  role: string
  phone?: string
  address?: string
  emergency_contact?: string
  relationship?: string
}

export interface ParentProfileUpdate {
  full_name?: string
  phone?: string
  address?: string
  emergency_contact?: string
  relationship?: string
}

export interface PasswordChange {
  current_password: string
  new_password: string
}

export interface NotificationSettings {
  email_notifications: boolean
  climbing_alerts: boolean
  wandering_alerts: boolean
  out_of_zone_alerts: boolean
  collision_alerts: boolean
  quiet_hours: boolean
}

export interface PrivacySettings {
  share_data_with_teachers: boolean
  allow_video_recording: boolean
  data_retention_30_days: boolean
}

class ParentApiService {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  /**
   * Tạo headers với authentication token
   */
  private getHeaders(): HeadersInit {
    const token = authService.getToken()
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  /**
   * Xử lý lỗi API
   */
  private handleError(error: any): never {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Network error occurred')
  }

  /**
   * Format error messages từ API
   */
  private formatErrorMessage(error: ApiError): string {
    if (typeof error.detail === 'string') {
      return error.detail
    }
    if (Array.isArray(error.detail)) {
      return error.detail.map(err => err.msg).join(', ')
    }
    return 'An error occurred'
  }

  /**
   * Lấy dashboard data cho parent
   */
  async getDashboard(): Promise<DashboardData> {
    try {
      const response = await fetch(`${this.baseURL}/api/parent/dashboard`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      return await response.json()
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Lấy danh sách con của parent
   */
  async getChildren(): Promise<Child[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/parent/children`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      return await response.json()
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Lấy thông tin chi tiết một đứa con
   */
  async getChild(childId: number): Promise<Child> {
    try {
      const response = await fetch(`${this.baseURL}/api/parent/children/${childId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 404) {
          throw new Error('Không tìm thấy trẻ')
        }
        if (response.status === 403) {
          throw new Error('Không có quyền truy cập')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      return await response.json()
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Lấy danh sách cảnh báo của parent
   */
  async getAlerts(): Promise<Alert[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/parent/alerts`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      return await response.json()
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Lấy thông tin chi tiết một cảnh báo
   */
  async getAlert(alertId: number): Promise<Alert> {
    try {
      const response = await fetch(`${this.baseURL}/api/parent/alerts/${alertId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 404) {
          throw new Error('Không tìm thấy cảnh báo')
        }
        if (response.status === 403) {
          throw new Error('Không có quyền truy cập')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      return await response.json()
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Xác nhận cảnh báo
   */
  async acknowledgeAlert(alertId: number): Promise<Alert> {
    try {
      const response = await fetch(`${this.baseURL}/api/parent/alerts/${alertId}/acknowledge`, {
        method: 'PUT',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 404) {
          throw new Error('Không tìm thấy cảnh báo')
        }
        if (response.status === 403) {
          throw new Error('Không có quyền truy cập')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      return await response.json()
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Kết nối WebSocket cho real-time alerts
   */
  connectAlertsWebSocket(): WebSocket {
    const token = authService.getToken()
    // Sử dụng wss:// cho production (HTTPS)
    const wsUrl = API_BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://')
    return new WebSocket(`${wsUrl}/api/streaming/alerts?token=${token}`)
  }

  /**
   * Kết nối WebSocket cho camera stream
   */
  connectCameraWebSocket(cameraId: number): WebSocket {
    const token = authService.getToken()
    // Sử dụng wss:// cho production (HTTPS)
    const wsUrl = API_BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://')
    return new WebSocket(`${wsUrl}/api/streaming/camera/${cameraId}?token=${token}`)
  }

  /**
   * Lấy thông tin profile của parent
   */
  async getProfile(): Promise<ParentProfile> {
    try {
      const response = await fetch(`${this.baseURL}/api/parent/profile`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      return await response.json()
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Cập nhật thông tin profile của parent
   */
  async updateProfile(profileData: ParentProfileUpdate): Promise<ParentProfile> {
    try {
      const response = await fetch(`${this.baseURL}/api/parent/profile`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      const result = await response.json()
      return result.profile
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Đổi mật khẩu của parent
   */
  async changePassword(passwordData: PasswordChange): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/api/parent/change-password`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(passwordData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      await response.json()
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Lấy cài đặt thông báo của parent
   */
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await fetch(`${this.baseURL}/api/parent/notification-settings`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      return await response.json()
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Cập nhật cài đặt thông báo của parent
   */
  async updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
    try {
      const response = await fetch(`${this.baseURL}/api/parent/notification-settings`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      const result = await response.json()
      return result.settings
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Lấy cài đặt riêng tư của parent
   */
  async getPrivacySettings(): Promise<PrivacySettings> {
    try {
      const response = await fetch(`${this.baseURL}/api/parent/privacy-settings`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      return await response.json()
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Cập nhật cài đặt riêng tư của parent
   */
  async updatePrivacySettings(settings: PrivacySettings): Promise<PrivacySettings> {
    try {
      const response = await fetch(`${this.baseURL}/api/parent/privacy-settings`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      const result = await response.json()
      return result.settings
    } catch (error) {
      this.handleError(error)
    }
  }
}

// Export singleton instance
export const parentApiService = new ParentApiService()
export default parentApiService
