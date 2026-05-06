import axiosInstance from './axiosInstance';

export const doctorService = {
  getDashboard: async () => {
    const res = await axiosInstance.get('/doctor/dashboard');
    return res.data.data;
  },

  getPatients: async () => {
    const res = await axiosInstance.get('/doctor/patients');
    return res.data.data?.patients || [];
  },

  saveDiagnosis: async (payload) => {
    const res = await axiosInstance.put('/doctor/diagnosis', payload);
    return res.data.data;
  },

  toggleAvailability: async () => {
    const res = await axiosInstance.put('/doctor/toggle-availability');
    return res.data.data;
  },
};
