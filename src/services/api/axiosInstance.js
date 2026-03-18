import axios from 'axios';
import { API_BASE_URL } from '../../constants/apiEndpoints';
import { secureStorage } from '../../utils/secureStorage';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = secureStorage.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = secureStorage.get('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken } = response.data;
        secureStorage.set('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        secureStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
