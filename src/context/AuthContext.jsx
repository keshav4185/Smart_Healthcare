import { createContext, useContext, useState, useEffect } from 'react';
import { mockAuthService } from '../services/api/mockAuthService';
import { secureStorage } from '../utils/secureStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = secureStorage.get('accessToken');
    const userData = secureStorage.get('user');
    if (token && userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await mockAuthService.login(credentials);
      secureStorage.set('accessToken', data.accessToken);
      secureStorage.set('refreshToken', data.refreshToken);
      secureStorage.set('user', data.user);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const data = await mockAuthService.register(userData);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await mockAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      secureStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
