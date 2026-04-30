import axios from 'axios';

const TOKEN_KEY = 'auth_token';

/**
 * Preconfigured Axios instance for API calls.
 * Base URL is read from NEXT_PUBLIC_API_BASE_URL environment variable
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Automatically injects Bearer token from localStorage into every request header
 */
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
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
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
