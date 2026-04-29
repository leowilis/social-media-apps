import axios from 'axios';

/**
 * Preconfigured Axios instance for API calls
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Automatically injects Bearer token from Redux store into headers
 */
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
