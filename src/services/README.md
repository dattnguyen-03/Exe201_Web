# SafeNest AI - Parent API Integration

## Tổng quan

Đây là hệ thống tích hợp API cho phần Parent của ứng dụng SafeNest AI, kết nối frontend React với backend FastAPI.

## Cấu trúc API Services

### 1. `authService.ts`
- **Chức năng**: Quản lý authentication và authorization
- **Tính năng**:
  - Login/Logout
  - Token management
  - User data storage
  - Password reset
  - Role mapping (admin, school, parent)

### 2. `parentApiService.ts`
- **Chức năng**: API calls cho Parent role
- **Endpoints**:
  - `getDashboard()` - Lấy dữ liệu dashboard
  - `getChildren()` - Lấy danh sách con
  - `getChild(id)` - Lấy thông tin chi tiết con
  - `getAlerts()` - Lấy danh sách cảnh báo
  - `getAlert(id)` - Lấy chi tiết cảnh báo
  - `acknowledgeAlert(id)` - Xác nhận cảnh báo
  - `connectAlertsWebSocket()` - Kết nối WebSocket cho alerts
  - `connectCameraWebSocket(id)` - Kết nối WebSocket cho camera

## Cách sử dụng

### 1. Authentication
```typescript
import { authService } from './services/authService'

// Login
const response = await authService.login('parent@example.com', 'password123')
authService.setToken(response.access_token)
authService.setUser(userData)

// Check authentication
if (authService.getToken()) {
  // User is authenticated
}

// Logout
authService.clearAuth()
```

### 2. Parent API Calls
```typescript
import { parentApiService } from './services/parentApiService'

// Get dashboard data
const dashboardData = await parentApiService.getDashboard()

// Get children
const children = await parentApiService.getChildren()

// Get alerts
const alerts = await parentApiService.getAlerts()

// Acknowledge alert
await parentApiService.acknowledgeAlert(alertId)
```

### 3. WebSocket Connections
```typescript
// Connect to alerts WebSocket
const alertsWs = parentApiService.connectAlertsWebSocket()
alertsWs.onmessage = (event) => {
  const data = JSON.parse(event.data)
  // Handle real-time alerts
}

// Connect to camera WebSocket
const cameraWs = parentApiService.connectCameraWebSocket(cameraId)
cameraWs.onmessage = (event) => {
  const data = JSON.parse(event.data)
  // Handle camera stream data
}
```

## Cấu hình Backend

### API Base URL
```typescript
const API_BASE_URL = 'http://127.0.0.1:8000'
```

### WebSocket URLs
- Alerts: `ws://127.0.0.1:8000/api/streaming/alerts`
- Camera: `ws://127.0.0.1:8000/api/streaming/camera/{camera_id}`

## Error Handling

Tất cả API calls đều có error handling:
- **401 Unauthorized**: Tự động redirect về login
- **403 Forbidden**: Hiển thị thông báo không có quyền
- **404 Not Found**: Hiển thị thông báo không tìm thấy
- **Network Error**: Hiển thị thông báo lỗi mạng

## Data Types

### Child
```typescript
interface Child {
  id: number
  full_name: string
  date_of_birth: string
  class_id?: number
  parent_id?: number
}
```

### Alert
```typescript
interface Alert {
  id: number
  child_id: number
  camera_id?: number
  danger_zone_id?: number
  alert_type: string
  severity: number
  acknowledged: boolean
  created_at: string
}
```

### DashboardData
```typescript
interface DashboardData {
  msg: string
  children_count: number
  recent_alerts_count: number
  children: Child[]
  recent_alerts: Alert[]
}
```

## Tích hợp với Components

### ParentDashboard
- Sử dụng `parentApiService.getDashboard()`
- Hiển thị loading states và error handling
- Real-time data từ API

### ParentAlertsCenter
- Sử dụng `parentApiService.getAlerts()`
- Chức năng acknowledge alerts
- Filtering và statistics

### ParentChildProfile
- Sử dụng `parentApiService.getChildren()`
- Hiển thị thông tin chi tiết con
- Support multiple children

### ParentLiveView
- Sử dụng WebSocket cho camera stream
- Real-time connection status
- Error handling cho camera access

## Lưu ý

1. **Authentication**: Tất cả API calls đều yêu cầu JWT token
2. **Error Handling**: Luôn có fallback UI cho error states
3. **Loading States**: Hiển thị loading indicators cho UX tốt hơn
4. **Real-time**: Sử dụng WebSocket cho alerts và camera stream
5. **Security**: Token được lưu trong localStorage, tự động clear khi logout

## Testing

Để test API integration:
1. Đảm bảo backend đang chạy trên `http://127.0.0.1:8000`
2. Login với tài khoản parent: `parent@example.com` / `parent123`
3. Kiểm tra các chức năng:
   - Dashboard hiển thị dữ liệu
   - Alerts có thể acknowledge
   - Child profile hiển thị thông tin
   - Live view kết nối WebSocket
