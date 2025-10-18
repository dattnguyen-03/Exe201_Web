import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Auth Pages
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

// Parent Pages
import ParentDashboard from './pages/parent/ParentDashboard'
import ParentLiveView from './pages/parent/ParentLiveView'
import ParentAlertsCenter from './pages/parent/ParentAlertsCenter'
import ParentBehaviorReports from './pages/parent/ParentBehaviorReports'
import ParentDangerZoneMap from './pages/parent/ParentDangerZoneMap'
import ParentChildProfile from './pages/parent/ParentChildProfile'
import ParentPackageManagement from './pages/parent/ParentPackageManagement'
import ParentAccountSettings from './pages/parent/ParentAccountSettings'
import ParentNotifications from './pages/parent/ParentNotifications'

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherStudentManagement from './pages/teacher/TeacherStudentManagement'
import TeacherReports from './pages/teacher/TeacherReports'
import TeacherLiveView from './pages/teacher/TeacherLiveView'
import TeacherManagement from './pages/teacher/TeacherManagement'
import TeacherClassManagement from './pages/teacher/TeacherClassManagement'
import CameraManagement from './pages/teacher/CameraManagement'
import SchoolPackageManagement from './pages/teacher/SchoolPackageManagement'

// School Pages
import SchoolSettings from './pages/teacher/SchoolSettings'

// Payment Pages
import PaymentPage from './pages/PaymentPage'
import PaymentDemoPage from './pages/PaymentDemoPage'
import PackageSelectionPage from './pages/PackageSelectionPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import PaymentCancelPage from './pages/PaymentCancelPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAccountManagement from './pages/admin/AdminAccountManagement'
import AdminPackageManagement from './pages/admin/AdminPackageManagement'
import AdminUserPackageManagement from './pages/admin/AdminUserPackageManagement'
import AdminReports from './pages/admin/AdminReports'
function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/packages" element={<PackageSelectionPage />} />
          <Route path="/payment/package/:packageId" element={<PaymentPage />} />
          <Route path="/payment/:paymentId" element={<PaymentPage />} />
          <Route path="/payment/demo/:orderId" element={<PaymentDemoPage />} />
          <Route path="/payment/success/:paymentId" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel" element={<PaymentCancelPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Parent Routes */}
          <Route path="/parent" element={<ProtectedRoute role="parent" />}>
            <Route index element={<ParentDashboard />} />
            <Route path="live-view" element={<ParentLiveView />} />
            <Route path="alerts" element={<ParentAlertsCenter />} />
            <Route path="reports" element={<ParentBehaviorReports />} />
          <Route path="danger-zones" element={<ParentDangerZoneMap />} />
          <Route path="child-profile" element={<ParentChildProfile />} />
          <Route path="packages" element={<ParentPackageManagement />} />
          <Route path="account" element={<ParentAccountSettings />} />
          <Route path="notifications" element={<ParentNotifications />} />
          </Route>

          {/* Teacher Routes */}
          <Route path="/teacher" element={<ProtectedRoute role="teacher" />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="classes" element={<TeacherClassManagement />} />
            <Route path="students" element={<TeacherStudentManagement />} />
            <Route path="teachers" element={<TeacherManagement />} />
            <Route path="cameras" element={<CameraManagement />} />
            <Route path="packages" element={<SchoolPackageManagement />} />
            <Route path="reports" element={<TeacherReports />} />
            {/* <Route path="settings" element={<TeacherSettings />} /> */}
            <Route path="live-view" element={<TeacherLiveView />} />
                        <Route path="settings" element={<SchoolSettings />} />

          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="accounts" element={<AdminAccountManagement />} />
            <Route path="packages" element={<AdminPackageManagement />} />
            <Route path="user-packages" element={<AdminUserPackageManagement />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
