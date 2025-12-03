// Admin API Service - Kết nối với backend SafeNest AI
import { authService } from './authService'

const API_BASE_URL = 'http://127.0.0.1:8000'

// Types cho User Management
export interface User {
  id: number
  email: string
  full_name: string
  phone?: string
  role: string
  address?: string
  emergency_contact?: string
  relationship?: string
  status: string
  last_login?: string
  created_at?: string
  updated_at?: string
}

export interface CreateUserData {
  email: string
  full_name: string
  password: string
  role: string
  phone?: string
  address?: string
  emergency_contact?: string
  relationship?: string
}

export interface UpdateUserData {
  full_name?: string
  phone?: string
  address?: string
  emergency_contact?: string
  relationship?: string
  status?: string
}

// Types cho Admin API
export interface PackageData {
  id: number
  name: string
  price: number
  duration_days: number
  camera_limit: number
  ai_features: string
  storage_days: number
  description?: string
  is_active: boolean
  created_at: string
}

export interface PackageCreateData {
  name: string
  price: number
  duration_days: number
  camera_limit: number
  ai_features: string
  storage_days: number
  description?: string
}

export interface PackageUpdateData {
  name?: string
  price?: number
  duration_days?: number
  camera_limit?: number
  ai_features?: string
  storage_days?: number
  description?: string
  is_active?: boolean
}

// Types cho User Package Management
export interface UserPackageData {
  user_id: number
  user_email: string
  user_name: string
  user_role: string
  package_id: number
  package_name: string
  package_price: number
  package_expiry_date: string
  is_active_package: boolean
  days_remaining: number
}

export interface UserPackageDetail {
  user: {
    id: number
    email: string
    full_name: string
    role: string
    phone?: string
    address?: string
  }
  current_package: {
    id: number
    name: string
    price: number
    duration_days: number
    camera_limit: number
    ai_features: string
    storage_days: number
    description?: string
  }
  package_info: {
    expiry_date: string
    is_active: boolean
    days_remaining: number
  }
  payment_history: Array<{
    id: number
    amount: number
    method: string
    status: string
    transaction_id?: string
    transaction_date: string
    expiry_date?: string
  }>
}

export interface ExtendPackageData {
  package_id: number
  duration_days: number
}

export interface ApiError {
  detail: string | Array<{
    loc: string[]
    msg: string
    type: string
  }>
}

class AdminApiService {
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
   * Tạo headers cho FormData (không có Content-Type)
   */
  private getFormHeaders(): HeadersInit {
    const token = authService.getToken()
    return {
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
   * Lấy tất cả packages (admin only - bao gồm inactive)
   */
  async getAllPackages(): Promise<PackageData[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/packages/admin`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản admin.')
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
   * Lấy danh sách packages public (chỉ active)
   */
  async getPublicPackages(): Promise<PackageData[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/packages/`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      return await response.json()
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Lấy thông tin chi tiết một package
   */
  async getPackage(packageId: number): Promise<PackageData> {
    try {
      const response = await fetch(`${this.baseURL}/api/packages/${packageId}`, {
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
          throw new Error('Không tìm thấy gói dịch vụ')
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
   * Tạo package mới (admin only)
   */
  async createPackage(packageData: PackageCreateData): Promise<PackageData> {
    try {
      const formData = new FormData()
      
      // Append all form data
      Object.entries(packageData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      })

      const response = await fetch(`${this.baseURL}/api/packages/`, {
        method: 'POST',
        headers: this.getFormHeaders(),
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập với tài khoản admin.')
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
   * Cập nhật package (admin only)
   */
  async updatePackage(packageId: number, packageData: PackageUpdateData): Promise<PackageData> {
    try {
      const formData = new FormData()
      
      // Append all form data
      Object.entries(packageData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      })

      const response = await fetch(`${this.baseURL}/api/packages/${packageId}`, {
        method: 'PUT',
        headers: this.getFormHeaders(),
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập với tài khoản admin.')
        }
        if (response.status === 404) {
          throw new Error('Không tìm thấy gói dịch vụ')
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
   * Xóa package (admin only)
   */
  async deletePackage(packageId: number): Promise<{ msg: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/packages/${packageId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập với tài khoản admin.')
        }
        if (response.status === 404) {
          throw new Error('Không tìm thấy gói dịch vụ')
        }
        if (response.status === 400) {
          const errorData: ApiError = await response.json()
          throw new Error(this.formatErrorMessage(errorData))
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
   * Cleanup invalid payments (parent only)
   */
  async cleanupInvalidPayments(): Promise<{ message: string; cleaned_count: number }> {
    try {
      const response = await fetch(`${this.baseURL}/api/packages/cleanup-invalid-payments`, {
        method: 'POST',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền thực hiện thao tác này.')
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
   * Force cleanup pending payments (parent only)
   */
  async forceCleanupPending(): Promise<{ message: string; cleaned_count: number }> {
    try {
      const response = await fetch(`${this.baseURL}/api/packages/force-cleanup-pending`, {
        method: 'POST',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền thực hiện thao tác này.')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      return await response.json()
    } catch (error) {
      this.handleError(error)
    }
  }

  // DASHBOARD METHODS

  /**
   * Lấy thống kê dashboard (admin only)
   */
  async getDashboardStats(): Promise<{
    users: number
    parents: number
    schools: number
    teachers: number
  }> {
    try {
      const response = await fetch(`${this.baseURL}/api/admin/dashboard`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Phiên đăng nhập đã hết hạn')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền truy cập dashboard')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      return await response.json()
    } catch (error) {
      this.handleError(error)
    }
  }

  // USER MANAGEMENT METHODS

  /**
   * Lấy tất cả users (admin only)
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/admin/users`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản admin.')
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
   * Tạo user mới (admin only)
   */
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const formData = new FormData()
      formData.append('email', userData.email)
      formData.append('full_name', userData.full_name)
      formData.append('password', userData.password)
      formData.append('role', userData.role)
      
      if (userData.phone) formData.append('phone', userData.phone)
      if (userData.address) formData.append('address', userData.address)
      if (userData.emergency_contact) formData.append('emergency_contact', userData.emergency_contact)
      if (userData.relationship) formData.append('relationship', userData.relationship)

      const response = await fetch(`${this.baseURL}/api/admin/users`, {
        method: 'POST',
        headers: this.getFormHeaders(),
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập với tài khoản admin.')
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
   * Cập nhật user (admin only)
   */
  async updateUser(email: string, userData: UpdateUserData): Promise<User> {
    try {
      const formData = new FormData()
      
      if (userData.full_name) formData.append('full_name', userData.full_name)
      if (userData.phone) formData.append('phone', userData.phone)
      if (userData.address) formData.append('address', userData.address)
      if (userData.emergency_contact) formData.append('emergency_contact', userData.emergency_contact)
      if (userData.relationship) formData.append('relationship', userData.relationship)
      if (userData.status) formData.append('status', userData.status)

      const response = await fetch(`${this.baseURL}/api/admin/users/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: this.getFormHeaders(),
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập với tài khoản admin.')
        }
        if (response.status === 404) {
          throw new Error('Không tìm thấy user')
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
   * Xóa user (admin only)
   */
  async deleteUser(email: string): Promise<{ msg: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/admin/users/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập với tài khoản admin.')
        }
        if (response.status === 404) {
          throw new Error('Không tìm thấy user')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      return await response.json()
    } catch (error) {
      this.handleError(error)
    }
  }


  // USER PACKAGE MANAGEMENT METHODS

  /**
   * Lấy danh sách tất cả user packages (admin only)
   */
  async getUserPackages(): Promise<UserPackageData[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/admin/user-packages`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản admin.')
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
   * Lấy chi tiết package của một user (admin only)
   */
  async getUserPackageDetail(userId: number): Promise<UserPackageDetail> {
    try {
      const response = await fetch(`${this.baseURL}/api/admin/user-packages/${userId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản admin.')
        }
        if (response.status === 404) {
          throw new Error('Không tìm thấy user')
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
   * Gia hạn/thay đổi package cho user (admin only)
   */
  async extendUserPackage(userId: number, extendData: ExtendPackageData): Promise<{
    message: string
    user_id: number
    package_id: number
    new_expiry_date: string
    days_remaining: number
  }> {
    try {
      const formData = new FormData()
      formData.append('package_id', extendData.package_id.toString())
      formData.append('duration_days', extendData.duration_days.toString())

      const response = await fetch(`${this.baseURL}/api/admin/user-packages/${userId}/extend`, {
        method: 'POST',
        headers: this.getFormHeaders(),
        body: formData,
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập với tài khoản admin.')
        }
        if (response.status === 404) {
          throw new Error('Không tìm thấy user hoặc package')
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
   * Tạm dừng package của user (admin only)
   */
  async deactivateUserPackage(userId: number): Promise<{
    message: string
    user_id: number
    is_active: boolean
  }> {
    try {
      const response = await fetch(`${this.baseURL}/api/admin/user-packages/${userId}/deactivate`, {
        method: 'POST',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập với tài khoản admin.')
        }
        if (response.status === 404) {
          throw new Error('Không tìm thấy user')
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
   * Kích hoạt lại package của user (admin only)
   */
  async activateUserPackage(userId: number): Promise<{
    message: string
    user_id: number
    is_active: boolean
  }> {
    try {
      const response = await fetch(`${this.baseURL}/api/admin/user-packages/${userId}/activate`, {
        method: 'POST',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.clearAuth()
          window.location.href = '/login'
          throw new Error('Unauthorized')
        }
        if (response.status === 403) {
          throw new Error('Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập với tài khoản admin.')
        }
        if (response.status === 404) {
          throw new Error('Không tìm thấy user')
        }
        if (response.status === 400) {
          throw new Error('User chưa có package nào')
        }
        const errorData: ApiError = await response.json()
        throw new Error(this.formatErrorMessage(errorData))
      }

      return await response.json()
    } catch (error) {
      this.handleError(error)
    }
  }
}

// Export singleton instance
export const adminApiService = new AdminApiService()
export default adminApiService

