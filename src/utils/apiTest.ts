// API Test Utility
// Sử dụng file này để test kết nối API

import { teacherApiService } from '../services/teacherApiService';

export const testApiConnection = async () => {
  console.log('🧪 Testing API Connection...');
  
  try {
    // Test Dashboard
    console.log('📊 Testing Dashboard API...');
    const dashboard = await teacherApiService.getDashboard();
    console.log('✅ Dashboard API:', dashboard);
    
    // Test Students
    console.log('👥 Testing Students API...');
    const students = await teacherApiService.getStudents();
    console.log('✅ Students API:', students);
    
    // Test Classes
    console.log('🏫 Testing Classes API...');
    const classes = await teacherApiService.getClasses();
    console.log('✅ Classes API:', classes);
    
    // Test Alerts
    console.log('🚨 Testing Alerts API...');
    const alerts = await teacherApiService.getAlerts();
    console.log('✅ Alerts API:', alerts);
    
    // Test Cameras
    console.log('📹 Testing Cameras API...');
    const cameras = await teacherApiService.getCameras();
    console.log('✅ Cameras API:', cameras);
    
    console.log('🎉 All API tests passed!');
    return {
      success: true,
      data: {
        dashboard,
        students,
        classes,
        alerts,
        cameras
      }
    };
    
  } catch (error) {
    console.error('❌ API Test Failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Test function có thể gọi từ console
(window as any).testAPI = testApiConnection;
