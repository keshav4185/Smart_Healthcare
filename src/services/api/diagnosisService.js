import axiosInstance from './axiosInstance';

export const diagnosisService = {
  predict: async ({ symptoms, severity, duration }) => {
    const res = await axiosInstance.post('/diagnosis/predict', { symptoms, severity, duration });
    return res.data.data;
  },

  getHistory: async () => {
    const res = await axiosInstance.get('/diagnosis/history');
    return res.data.data;
  },
};
