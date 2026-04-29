import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * Shared logout hook.
 *
 * Clears the auth token from localStorage and cookies, purges all
 * TanStack Query cache, and redirects the user to the login page.
 *
 * Use this instead of inlining logout logic in every component
 * (e.g. Navbar, ProfileLayout, sidebar menus).
 */
export function useLogout({
  onBeforeLogout,
}: { onBeforeLogout?: () => void } = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = useCallback(() => {
    onBeforeLogout?.();
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; max-age=0';
    queryClient.clear();
    router.push('/login');
  }, [onBeforeLogout, queryClient, router]);

  return logout;
}
