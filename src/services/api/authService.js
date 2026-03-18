import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGOUT);
    localStorage.clear();
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });
    return response.data;
  },
};
