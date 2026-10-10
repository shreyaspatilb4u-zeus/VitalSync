import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layout & Routing Guards
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/routing/ProtectedRoute';
import RoleRoute from './components/routing/RoleRoute';

// Public Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointmentPage from './pages/patient/BookAppointmentPage';
import MyAppointmentsPage from './pages/patient/MyAppointmentsPage';
import EmergencyPage from './pages/patient/EmergencyPage';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientsRosterPage from './pages/doctor/PatientsRosterPage';
import PatientDetailPage from './pages/doctor/PatientDetailPage';
import EmergencyQueuePage from './pages/doctor/EmergencyQueuePage';
import DoctorAvailabilityPage from './pages/doctor/DoctorAvailabilityPage';
import DoctorAttendancePage from './pages/doctor/DoctorAttendancePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffPage from './pages/admin/StaffPage';
import ShiftSchedulerPage from './pages/admin/ShiftSchedulerPage';
import AttendanceManagerPage from './pages/admin/AttendanceManagerPage';
import AdminEmergenciesPage from './pages/admin/AdminEmergenciesPage';

// Root Redirect Component
function RootRedirect() {
  const { user, role, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role === 'doctor') return <Navigate to="/doctor" replace />;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/patient" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<RootRedirect />} />

            {/* Patient Portal Routes */}
            <Route
              path="/patient"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="patient">
                    <AppLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<PatientDashboard />} />
              <Route path="book" element={<BookAppointmentPage />} />
              <Route path="appointments" element={<MyAppointmentsPage />} />
              <Route path="emergency" element={<EmergencyPage />} />
            </Route>

            {/* Doctor Workspace Routes */}
            <Route
              path="/doctor"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="doctor">
                    <AppLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<DoctorDashboard />} />
              <Route path="patients" element={<PatientsRosterPage />} />
              <Route path="patients/:id" element={<PatientDetailPage />} />
              <Route path="emergency" element={<EmergencyQueuePage />} />
              <Route path="availability" element={<DoctorAvailabilityPage />} />
              <Route path="attendance" element={<DoctorAttendancePage />} />
            </Route>

            {/* Admin Control Center Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="admin">
                    <AppLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="staff" element={<StaffPage />} />
              <Route path="shifts" element={<ShiftSchedulerPage />} />
              <Route path="attendance" element={<AttendanceManagerPage />} />
              <Route path="emergencies" element={<AdminEmergenciesPage />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
