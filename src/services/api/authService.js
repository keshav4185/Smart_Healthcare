import axiosInstance from './axiosInstance';

export const authService = {
  login: async (credentials) => {
    const res = await axiosInstance.post('/auth/login', credentials);
    return res.data.data;
  },

  register: async (userData) => {
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
