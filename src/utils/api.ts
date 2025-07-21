import axios, { AxiosInstance } from 'axios';
import authService from '@/service/authService';

function createAPIClient(requireAuth: boolean): AxiosInstance {
  const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

  const apiClient = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 60000
  });

  if (requireAuth) {
    // Add request interceptor to inject the access token
    apiClient.interceptors.request.use(async (config) => {
      if (config.url !== '/auth/login' && config.url !== '/auth/refresh' && config.url !== '/register') {
        const isValid = await authService.validateTokens();
        if (!isValid) {
          // Redirect to login or handle invalid session
          throw new Error('Invalid session');
        }

        // Update the request header with the latest token
        const token = authService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });
  }

  return apiClient;
}

// Default authenticated API client
export const apiAuth = createAPIClient(true);

// Non-authenticated API client
export const apiOpen = createAPIClient(false);
