import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuth, clearAuth } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/hooks';
import {
  authApi,
  type AuthResponse,
  type LoginFormData,
  type RegisterFormData,
} from '@/lib/api/auth';

// Hook

/**
 * Provides login, register, and logout actions.
 *
 * - Token is persisted via Redux + localStorage (handled in authSlice).
 * - On login success, redirects to the `from` query param or `/`.
 * - On register success, redirects to `/login`.
 * - On logout, clears all auth state and redirects to `/login`.
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('from') ?? '/';

  // Login
  const loginMutation = useMutation<AuthResponse, Error, LoginFormData>({
    mutationFn: (data) => authApi.login(data).then((r) => r.data),
    onSuccess: (data) => {
      dispatch(setAuth({ user: data.data.user, token: data.data.token }));
      router.push(returnTo);
    },
  });

  // Register
  const registerMutation = useMutation<AuthResponse, Error, RegisterFormData>({
    mutationFn: (data) => {
      const body: Omit<RegisterFormData, 'confirmPassword'> = {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      };
      return authApi.register(body).then((r) => r.data);
    },
    onSuccess: () => router.push('/login'),
  });

  // ── Logout ─
  const logout = (): void => {
    dispatch(clearAuth());
    router.push('/login');
  };

  return {
    /**
     * Submits login credentials.
     * Pass directly to React Hook Form's handleSubmit:
     * `onSubmit={handleSubmit(login)}`
     */
    login: (data: LoginFormData): void => loginMutation.mutate(data),
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error?.message ?? null,

    /**
     * Submits registration data.
     * `confirmPassword` is stripped before sending to the API.
     */
    register: (data: RegisterFormData): void => registerMutation.mutate(data),
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error?.message ?? null,

    logout,
  };
}
