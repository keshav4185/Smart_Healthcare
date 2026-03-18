export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // User
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/update',
  
  // Patient
  PATIENT_DASHBOARD: '/patient/dashboard',
  PATIENT_APPOINTMENTS: '/patient/appointments',
  PATIENT_MEDICAL_RECORDS: '/patient/medical-records',
  SUBMIT_SYMPTOMS: '/patient/symptoms',
  
  // Doctor
  DOCTOR_DASHBOARD: '/doctor/dashboard',
  DOCTOR_APPOINTMENTS: '/doctor/appointments',
  DOCTOR_PATIENTS: '/doctor/patients',
  UPDATE_DIAGNOSIS: '/doctor/diagnosis',
  
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_DOCTORS: '/admin/doctors',
  ADMIN_PATIENTS: '/admin/patients',
  ADMIN_APPOINTMENTS: '/admin/appointments',
  
  // Appointments
  CREATE_APPOINTMENT: '/appointments/create',
  UPDATE_APPOINTMENT: '/appointments/update',
  CANCEL_APPOINTMENT: '/appointments/cancel',
  
  // Diagnosis
  AI_DIAGNOSIS: '/diagnosis/predict',
  DIAGNOSIS_HISTORY: '/diagnosis/history',
};
