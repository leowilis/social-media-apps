import api from '@/lib/axios';
import type { AuthUser } from '@/types/auth';

// Request Payloads

// Payload for creating a new user account
export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
}

// Payload for authenticating an existing user
export interface LoginPayload {
  email: string;
  password: string;
}

// Response Shapes

/** Response returned by the login endpoint. */
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
}

// API Endpoints

// Auth API — wraps all authentication-related endpoints
export const authApi = {
  // Registers a new user account
  register: (data: RegisterPayload) => api.post('/api/auth/register', data),

  // Authenticates a user and returns a JWT token
  login: (data: LoginPayload) =>
    api.post<LoginResponse>('/api/auth/login', data),
};
