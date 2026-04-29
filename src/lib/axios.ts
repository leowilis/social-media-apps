import axios, { type InternalAxiosRequestConfig } from 'axios';
import { clearAuth } from '@/store/authSlice';
import { store } from '@/store/store';

/**
 * Preconfigured Axios instance for API calls
 * Uses a base URL and default JSON header
 */
export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Request interceptor
 * Automatically injects Bearer token from Redux store into headers
 */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = store.getState().auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Response interceptor
 * Handles authentication errors globally
 *
 * - On 401 Unauthorized:
 *   - Clears auth state from Redux
 *   - Redirects user to login page (client-side only)
 */
api.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      store.dispatch(clearAuth());

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);
