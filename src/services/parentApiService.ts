// Parent API Service - Kết nối với backend SafeNest AI
import { authService } from './authService'

const API_BASE_URL = 'http://127.0.0.1:8000'

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
    const wsUrl = `ws://127.0.0.1:8000/api/streaming/alerts?token=${token}`
    return new WebSocket(wsUrl)
  }

  /**
   * Kết nối WebSocket cho camera stream
   */
  connectCameraWebSocket(cameraId: number): WebSocket {
    const token = authService.getToken()
    const wsUrl = `ws://127.0.0.1:8000/api/streaming/camera/${cameraId}?token=${token}`
    return new WebSocket(wsUrl)
  }
}

// Export singleton instance
export const parentApiService = new ParentApiService()
export default parentApiService
