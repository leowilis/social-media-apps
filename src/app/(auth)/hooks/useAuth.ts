import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/axios';
import { setAuth, clearAuth } from '@/store/authSlice';
import { useAppDispatch } from '@/store/hooks';
import type { AuthUser } from '@/store/authSlice';
import type { LoginFormData, RegisterFormData } from '@/lib/validations/auth';

// Types

interface AuthApiResponse {
  token: string;
  user: AuthUser;
}

// Hook

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? '/';

  // Login
  const loginMutation = useMutation<AuthApiResponse, Error, LoginFormData>({
    mutationFn: async (data: LoginFormData): Promise<AuthApiResponse> => {
      const res = await api.post<AuthApiResponse>('/auth/login', data);
      return res.data;
    },
    onSuccess: (data: AuthApiResponse): void => {
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
    mutationFn: async (data: RegisterFormData): Promise<AuthApiResponse> => {
      const { confirmPassword: _omit, ...body } = data;
      const res = await api.post<AuthApiResponse>('/auth/register', body);
      return res.data;
    },
    onSuccess: (): void => {
      router.push('/login');
    },
  });

  // ── Logout ─
  const logout = (): void => {
    dispatch(clearAuth());
    router.push('/login');
  };

  return {
    /**
     * Call login with form data.
     * Wrap in an arrow function when passing to React Hook Form handleSubmit:
     *   onSubmit={handleSubmit((data) => login(data))}
     *   OR define a typed onSubmit handler:
     *   const onSubmit = (data: LoginFormData): void => login(data);
     */
    login: (data: LoginFormData): void => {
      loginMutation.mutate(data);
    },
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error?.message ?? null,

    register: (data: RegisterFormData): void => {
      registerMutation.mutate(data);
    },
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error?.message ?? null,

    logout,
  };
}
