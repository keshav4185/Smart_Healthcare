import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const appointmentService = {
  getAppointments: async (role) => {
    const endpoint = role === 'patient' 
      ? API_ENDPOINTS.PATIENT_APPOINTMENTS 
      : API_ENDPOINTS.DOCTOR_APPOINTMENTS;
    const response = await axiosInstance.get(endpoint);
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.CREATE_APPOINTMENT, appointmentData);
    return response.data;
  },

  updateAppointment: async (id, appointmentData) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.UPDATE_APPOINTMENT}/${id}`, appointmentData);
    return response.data;
  },

  cancelAppointment: async (id) => {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.CANCEL_APPOINTMENT}/${id}`);
    return response.data;
  },
};
