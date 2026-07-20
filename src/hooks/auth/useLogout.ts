'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { useAppDispatch } from '@/store/hooks';
import { clearAuth } from '@/store/slices/authSlice';

interface UseLogoutOptions {
  /**
   * Called before logout.
   * Useful for closing sidebar/dropdown.
   */
  onBeforeLogout?: () => void;
}

/**
 * Clears authentication state and cached user data,
 * then redirects to the login page.
 */
export function useLogout({ onBeforeLogout }: UseLogoutOptions = {}) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = () => {
    onBeforeLogout?.();

    // Clear Redux auth (also removes localStorage + cookie)
    dispatch(clearAuth());

    // Remove all cached API data
    queryClient.clear();

    // Prevent navigating back into authenticated pages
    router.replace('/login');
  };

  return logout;
}
