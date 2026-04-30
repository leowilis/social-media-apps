'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { meApi } from '@/lib/api/me';
import type { UpdateProfilePayload } from '@/lib/api/me';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { meKeys } from '@/hooks/profile/key';

// Types

// Profile data returned by GET /me.
export type MeData = {
  id: number;
  name: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
};

// Hooks

/**
 * Fetches the current authenticated user's profile.
 * Only runs when the user is authenticated.
 */
export function useMe() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  const query = useQuery({
    queryKey: meKeys.me,
    queryFn: async () => {
      const res = await meApi.getMe();
      return res.data.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    me: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

/**
 * Updates the current user's profile.
 * Syncs updated user to Redux store and invalidates me cache.
 */
export function useUpdateMe() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => meApi.updateMe(data),
    onSuccess: (res) => {
      dispatch(updateUser(res.data.data));
      queryClient.invalidateQueries({ queryKey: meKeys.me });
    },
  });
}
