import { useState, useCallback } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiFunc, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunc(...args);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
};
