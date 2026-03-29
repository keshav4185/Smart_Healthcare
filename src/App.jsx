import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppointmentProvider } from './context/AppointmentContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRedirect from './routes/RoleRedirect';
import MainLayout from './components/layout/MainLayout';
import { USER_ROLES } from './constants/roles';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PatientDashboard from './pages/patient/PatientDashboard';
import SymptomsPage from './pages/patient/SymptomsPage';
import AppointmentsPage from './pages/patient/AppointmentsPage';
import DoctorListPage from './pages/patient/DoctorListPage';
import DoctorProfilePage from './pages/patient/DoctorProfilePage';
import BookAppointmentPage from './pages/patient/BookAppointmentPage';
import MedicalRecordsPage from './pages/patient/MedicalRecordsPage';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatientsPage from './pages/doctor/DoctorPatientsPage';
import DoctorAppointmentsPage from './pages/doctor/DoctorAppointmentsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppointmentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route index element={<RoleRedirect />} />
                <Route path="patient/dashboard" element={<ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}><PatientDashboard /></ProtectedRoute>} />
                <Route path="patient/symptoms" element={<ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}><SymptomsPage /></ProtectedRoute>} />
                <Route path="patient/appointments" element={<ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}><AppointmentsPage /></ProtectedRoute>} />
                <Route path="patient/doctors" element={<ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}><DoctorListPage /></ProtectedRoute>} />
                <Route path="patient/doctor/:id" element={<ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}><DoctorProfilePage /></ProtectedRoute>} />
                <Route path="patient/book-appointment/:doctorId" element={<ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}><BookAppointmentPage /></ProtectedRoute>} />
                <Route path="patient/records" element={<ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}><MedicalRecordsPage /></ProtectedRoute>} />
                <Route path="doctor/dashboard" element={<ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]}><DoctorDashboard /></ProtectedRoute>} />
                <Route path="doctor/appointments" element={<ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]}><DoctorAppointmentsPage /></ProtectedRoute>} />
                <Route path="doctor/patients" element={<ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]}><DoctorPatientsPage /></ProtectedRoute>} />
                <Route path="doctor/diagnoses" element={<ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]}><div className="text-center py-12"><h2 className="text-2xl font-bold">Diagnoses</h2><p className="text-gray-600 mt-2">Coming soon...</p></div></ProtectedRoute>} />
                <Route path="admin/dashboard" element={<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}><AdminDashboard /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              </Route>
              <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-6xl font-bold text-red-600">403</h1><p className="text-2xl text-gray-800 mt-4">Unauthorized Access</p></div></div>} />
              <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-6xl font-bold text-gray-800">404</h1><p className="text-2xl text-gray-800 mt-4">Page Not Found</p></div></div>} />
            </Routes>
          </BrowserRouter>
        </AppointmentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
