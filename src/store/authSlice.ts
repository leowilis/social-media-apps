import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Represents the authenticated user stored in client state
export interface AuthUser {
  id: number;
  username: string;
  name: string;
  avatarUrl?: string;
}

// Authentication slice state structure
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Loads persisted auth state from localStorage
 * Falls back to a logged-out state if unavailable or invalid
 */
function loadFromStorage(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isLoggedIn: false };
  }
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    const user: AuthUser | null = raw ? (JSON.parse(raw) as AuthUser) : null;
    return { token, user, isLoggedIn: Boolean(token && user) };
  } catch {
    return { user: null, token: null, isLoggedIn: false };
  }
}

// Redux slice handling authentication state and persistence
const authSlice = createSlice({
  name: 'auth',
  initialState: loadFromStorage,
  reducers: {
    /**
     * Sets authentication state after successful login
     * Persists token and user data to localStorage and cookies
     */
    setAuth(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;

      localStorage.setItem(TOKEN_KEY, action.payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));

      document.cookie = `auth_token=${action.payload.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
    },

    /**
     * Clears authentication state on logout
     * Removes all persisted auth data
     */
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      document.cookie = 'auth_token=; path=/; max-age=0';
    },

    /**
     * Partially updates the current user object
     * Only applies if a user is already authenticated
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
