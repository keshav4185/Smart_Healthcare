import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../../constants/apiEndpoints';

export const diagnosisService = {
  submitSymptoms: async (symptomsData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.SUBMIT_SYMPTOMS, symptomsData);
    return response.data;
  },

  getAIDiagnosis: async (symptomsData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AI_DIAGNOSIS, symptomsData);
    return response.data;
  },

  getDiagnosisHistory: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.DIAGNOSIS_HISTORY);
    return response.data;
  },
};
