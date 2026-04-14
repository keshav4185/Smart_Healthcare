import axiosInstance from './axiosInstance';

export const patientService = {
  getDashboard: async () => {
    const res = await axiosInstance.get('/patient/dashboard');
    return res.data.data;
  },

  getMedicalRecords: async () => {
    const res = await axiosInstance.get('/patient/medical-records');
    return res.data.data;
  },

  getPrescriptions: async () => {
    const res = await axiosInstance.get('/patient/prescriptions');
    return res.data.data;
  },

  uploadScan: async (file, type, symptoms) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('symptoms', symptoms);
    const res = await axiosInstance.post('/upload/scan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
};
