import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/axios';
import { setAuth, clearAuth } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';
import type { AuthUser } from '@/store/authSlice';
import type { LoginFormData, RegisterFormData } from '@/lib/validations/auth';

// Auth API response structure
interface AuthApiResponse {
  token: string;
  user: AuthUser;
}

/**
 * Auth hook
 * Handles login, register, and logout flows using React Query + Redux
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  //  Redirect target after login
  const returnTo = searchParams.get('returnTo') ?? '/feed';

  // Login

  const loginMutation = useMutation<AuthApiResponse, Error, LoginFormData>({
    mutationFn: async (data) => {
      const res = await api.post<AuthApiResponse>('/auth/login', data);
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(setAuth({ user: data.user, token: data.token }));
      router.push(returnTo);
    },
  });

  // Register

  const registerMutation = useMutation<
    AuthApiResponse,
    Error,
    RegisterFormData
  >({
    mutationFn: async (data) => {
      const { confirmPassword: _omit, ...body } = data;
      const res = await api.post<AuthApiResponse>('/auth/register', body);
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(setAuth({ user: data.user, token: data.token }));
      router.push('/feed');
    },
  });

  // Logout

  // Clears auth state and redirects to login page
  const logout = () => {
    dispatch(clearAuth());
    router.push('/login');
  };

  return {
    // actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,

    // login state
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error?.message ?? null,

    // register state
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error?.message ?? null,
  };
}
