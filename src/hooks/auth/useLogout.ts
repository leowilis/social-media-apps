'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { useAppDispatch } from '@/store/hooks';
import { clearAuth } from '@/store/slices/authSlice';

interface UseLogoutOptions {
  onBeforeLogout?: () => void;
}

export function useLogout({ onBeforeLogout }: UseLogoutOptions = {}) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = () => {
    onBeforeLogout?.();

    dispatch(clearAuth());

    // clear localStorage
    localStorage.removeItem('auth');

    // clear cookie
    document.cookie =
      'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

    queryClient.clear();

    router.replace('/login');
  };

  return logout;
}