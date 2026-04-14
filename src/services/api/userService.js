import axiosInstance from './axiosInstance';

export const userService = {
  getProfile: async () => {
    const res = await axiosInstance.get('/user/profile');
    return res.data.data;
  },

  updateProfile: async (fields) => {
    const res = await axiosInstance.put('/user/update', fields);
    return res.data.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await axiosInstance.put('/user/change-password', { currentPassword, newPassword });
    return res.data;
  },

  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    const res = await axiosInstance.post('/upload/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
};
