import { api } from '@/lib/axios';
import type { AuthUser } from '@/types/auth';
import type { LoginFormData, RegisterFormData } from '@/schema/auth.schema';
export type { LoginFormData, RegisterFormData } from '@/schema/auth.schema';

// Response Shapes

// Shared auth response shape returned by login and register endpoints
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUser;
  };
}

// API Endpoints

// Auth API — wraps authentication-related endpoints (register, login)
export const authApi = {
  /** Registers a new user account and returns a token + user. */
  register: (data: Omit<RegisterFormData, 'confirmPassword'>) =>
    api.post<AuthResponse>('/auth/register', data),

  /** Authenticates an existing user and returns a token + user. */
  login: (data: LoginFormData) => api.post<AuthResponse>('/auth/login', data),
};
