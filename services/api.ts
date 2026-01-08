import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token to all requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Request to:', config.url, 'with token:', token.substring(0, 20) + '...');
      } else {
        console.warn('⚠️ No auth token found in storage for request to:', config.url);
      }
    } catch (error) {
      console.error('❌ Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 and 403 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      console.error('401 Unauthorized - clearing auth storage');
      await AsyncStorage.multiRemove(['accessToken', 'user']);
    } else if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('403 Forbidden:', {
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data,
        hasAuthHeader: !!error.config?.headers?.Authorization
      });
    }
    return Promise.reject(error);
  }
);

export default api;