/**
 * Represents an authenticated user returned by the API.
 * Used across auth state, profile, and session contexts.
 */
export interface AuthUser {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

/**
 * Shape of the authentication slice in the Redux store.
 * Tracks the current user, token, and loading/auth status.
 */
export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
