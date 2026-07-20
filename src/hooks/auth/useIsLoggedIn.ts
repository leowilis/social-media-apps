'use client';

import { useAppSelector } from '@/store/hooks';

/**
 * Returns authentication status from Redux.
 * Redux is the single source of truth for auth state.
 */
export function useIsLoggedIn(): boolean {
  return useAppSelector((state) => state.auth.isAuthenticated);
}
