import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser, AuthState } from '@/types/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Loads persisted authentication state.
 * Safe for SSR.
 */
function loadFromStorage(): AuthState {
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }

  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const rawUser = localStorage.getItem(USER_KEY);

    const user = rawUser ? (JSON.parse(rawUser) as AuthUser) : null;

    return {
      user,
      token,
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

const authSlice = createSlice({
  name: 'auth',
  initialState: loadFromStorage(),

  reducers: {
    /**
     * Login/Register success
     */
    setAuth(
      state,
      action: PayloadAction<{
        user: AuthUser;
        token: string;
      }>,
    ) {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;

      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        document.cookie = [
          `auth_token=${token}`,
          'Path=/',
          'Max-Age=604800',
          'SameSite=Lax',
        ].join('; ');
      }
    },

    /**
     * Logout
     */
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        document.cookie = [
          'auth_token=',
          'Path=/',
          'Max-Age=0',
          'SameSite=Lax',
        ].join('; ');
      }
    },

    /**
     * Update logged in user
     */
    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (!state.user) return;

      state.user = {
        ...state.user,
        ...action.payload,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(state.user));
      }
    },
  },
});

export const { setAuth, clearAuth, updateUser } = authSlice.actions;

export default authSlice.reducer;
