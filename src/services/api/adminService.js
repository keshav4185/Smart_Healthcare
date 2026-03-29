import axiosInstance from './axiosInstance';

export const adminService = {
  getDashboard: async () => {
    const res = await axiosInstance.get('/admin/dashboard');
    return res.data.data;
  },

  getDoctors: async (status = '') => {
    const res = await axiosInstance.get(`/admin/doctors${status ? `?status=${status}` : ''}`);
    return res.data.data;
  },

  updateDoctorStatus: async (id, status) => {
    const res = await axiosInstance.put(`/admin/doctors/${id}`, { status });
    return res.data.data;
  },
};
