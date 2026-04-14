import axiosInstance from './axiosInstance';

export const authService = {
  login: async (credentials) => {
    const res = await axiosInstance.post('/auth/login', credentials);
    return res.data.data;
  },

  register: async (userData, files = {}) => {
    if (userData.role === 'doctor') {
      const form = new FormData();
      Object.entries(userData).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') form.append(k, String(v));
      });
      ['profilePhoto', 'degreeCertificate', 'idProof', 'selfieWithId'].forEach(key => {
        if (files[key]) form.append(key, files[key]);
      });
      // Do NOT set Content-Type — browser sets it automatically with correct boundary
      const res = await axiosInstance.post('/auth/register', form, {
        transformRequest: [(data) => data],
        headers: { 'Content-Type': null },
      });
      return res.data.data;
    }
    const res = await axiosInstance.post('/auth/register', userData);
    return res.data.data;
  },

  logout: async (refreshToken) => {
    const res = await axiosInstance.post('/auth/logout', { refreshToken });
    return res.data;
  },

  refresh: async (refreshToken) => {
    const res = await axiosInstance.post('/auth/refresh', { refreshToken });
    return res.data.data;
  },
};
