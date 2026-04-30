import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser, AuthState } from '@/types/auth';

// Constants

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Persistence

/**
 * Loads persisted auth state from localStorage.
 * Falls back to a logged-out state if unavailable or invalid.
 * SSR-safe: returns empty state when window is undefined.
 */
function loadFromStorage(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isAuthenticated: false, isLoading: true };
  }
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    const user = raw ? (JSON.parse(raw) as AuthUser) : null;
    return {
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isLoading: false,
    };
  } catch {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }
}

// Slice

const authSlice = createSlice({
  name: 'auth',
  initialState: loadFromStorage,
  reducers: {
    /**
     * Sets auth state after successful login or register.
     * Persists token and user to localStorage and cookie.
     */
    setAuth(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;

      localStorage.setItem(TOKEN_KEY, action.payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));

      document.cookie = `auth_token=${action.payload.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
    },

    /**
     * Clears auth state on logout.
     * Removes all persisted auth data from localStorage and cookie.
     */
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      document.cookie = 'auth_token=; path=/; max-age=0';
    },

    /**
     * Partially updates the current user object.
     * Only applies if a user is already authenticated.
     */
    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem(USER_KEY, JSON.stringify(state.user));
      }
    },
  },
});

export const { setAuth, clearAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
