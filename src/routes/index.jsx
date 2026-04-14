import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import { USER_ROLES } from '../constants/roles';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Patient Pages
import PatientDashboard from '../pages/patient/PatientDashboard';
import SymptomsPage from '../pages/patient/SymptomsPage';
import AppointmentsPage from '../pages/patient/AppointmentsPage';
import DoctorListPage from '../pages/patient/DoctorListPage';
import DoctorProfilePage from '../pages/patient/DoctorProfilePage';
import BookAppointmentPage from '../pages/patient/BookAppointmentPage';
import MedicalRecordsPage from '../pages/patient/MedicalRecordsPage';

// Doctor Pages
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorPatientsPage from '../pages/doctor/DoctorPatientsPage';
import DoctorAppointmentsPage from '../pages/doctor/DoctorAppointmentsPage';
import DoctorDiagnosesPage from '../pages/doctor/DoctorDiagnosesPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';

// Profile
import ProfilePage from '../pages/ProfilePage';
import RoleRedirect from './RoleRedirect';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <RoleRedirect /> },
      {
        path: 'patient/dashboard',
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}>
            <PatientDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'patient/doctors',
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}>
            <DoctorListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'patient/doctor/:id',
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}>
            <DoctorProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'patient/book-appointment/:doctorId',
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}>
            <BookAppointmentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'patient/symptoms',
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}>
            <SymptomsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'patient/appointments',
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}>
            <AppointmentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'patient/records',
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.PATIENT]}>
            <MedicalRecordsPage />
          </ProtectedRoute>
        ),
      },

      // Profile Route (all roles)
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },

      // Admin Routes
      {
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },

      // Doctor Routes
      {
        path: 'doctor/dashboard',
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]}>
            <DoctorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'doctor/appointments',
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]}>
            <DoctorAppointmentsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'doctor/patients',
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]}>
            <DoctorPatientsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'doctor/diagnoses',
        element: (
          <ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]}>
            <DoctorDiagnosesPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/unauthorized',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-600">403</h1>
          <p className="text-2xl text-gray-800 mt-4">Unauthorized Access</p>
          <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    ),
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800">404</h1>
          <p className="text-2xl text-gray-800 mt-4">Page Not Found</p>
        </div>
      </div>
    ),
  },
]);

export default router;
