import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import ParentDashboard from './pages/parent/ParentDashboard'
import ParentLiveView from './pages/parent/ParentLiveView'
import ParentAlertsCenter from './pages/parent/ParentAlertsCenter'
import ParentBehaviorReports from './pages/parent/ParentBehaviorReports'
import ParentDangerZoneMap from './pages/parent/ParentDangerZoneMap'
import ParentChildProfile from './pages/parent/ParentChildProfile'
import ParentAccountSettings from './pages/parent/ParentAccountSettings'
import ParentNotifications from './pages/parent/ParentNotifications'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminClassManagement from './pages/admin/AdminClassManagement'
import AdminAccountManagement from './pages/admin/AdminAccountManagement'
import AdminReports from './pages/admin/AdminReports'
import AdminCameraPlayback from './pages/admin/AdminCameraPlayback'
import AdminAlertsCenter from './pages/admin/AdminAlertsCenter'
import AdminDangerZoneManager from './pages/admin/AdminDangerZoneManager'
import AdminCommunicationCenter from './pages/admin/AdminCommunicationCenter'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLiveView from './pages/admin/AdminLiveView'
function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Parent Routes */}
          <Route path="/parent" element={<ProtectedRoute role="parent" />}>
            <Route index element={<ParentDashboard />} />
            <Route path="live-view" element={<ParentLiveView />} />
            <Route path="alerts" element={<ParentAlertsCenter />} />
            <Route path="reports" element={<ParentBehaviorReports />} />
            <Route path="danger-zones" element={<ParentDangerZoneMap />} />
            <Route path="child-profile" element={<ParentChildProfile />} />
            <Route path="account" element={<ParentAccountSettings />} />
            <Route path="notifications" element={<ParentNotifications />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="classes" element={<AdminClassManagement />} />
            <Route path="accounts" element={<AdminAccountManagement />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="live-view" element={<AdminLiveView />} />
            <Route path="playback" element={<AdminCameraPlayback />} />
            <Route path="alerts" element={<AdminAlertsCenter />} />
            <Route path="danger-zones" element={<AdminDangerZoneManager />} />
            <Route path="communication" element={<AdminCommunicationCenter />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
