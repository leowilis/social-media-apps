'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { meApi } from '@/lib/api/me';
import type { UpdateProfilePayload } from '@/lib/api/me';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import type { Post } from '@/types/post';
import type { User } from '@/types/user';

// Query Keys

export const meKeys = {
  me: ['me'] as const,
  posts: ['me', 'posts'] as const,
  likes: ['me', 'likes'] as const,
  saved: ['me', 'saved'] as const,
  followers: ['me', 'followers'] as const,
  following: ['me', 'following'] as const,
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
      const updated = res.data.data;
      dispatch(updateUser(updated));
      queryClient.invalidateQueries({ queryKey: meKeys.me });
    },
  });
}

// Fetches the current user's posts
export function useMyPosts(page = 1) {
  return useQuery<Post[]>({
    queryKey: [...meKeys.posts, page],
    queryFn: async () => {
      const res = await meApi.getMyPosts(page);
      return res.data.data.items;
    },
  });
}

// Fetches the current user's liked posts
export function useMyLikes(page = 1) {
  return useQuery<Post[]>({
    queryKey: [...meKeys.likes, page],
    queryFn: async () => {
      const res = await meApi.getMyLikes(page);
      return res.data.data.items;
    },
  });
}

// Fetches the current user's saved posts
export function useMySaved(page = 1) {
  return useQuery<Post[]>({
    queryKey: [...meKeys.saved, page],
    queryFn: async () => {
      const res = await meApi.getMySaved(page);
      return res.data.data.items;
    },
  });
}

// Fetches the current user's followers
export function useMyFollowers(enabled = true) {
  return useQuery<User[]>({
    queryKey: meKeys.followers,
    queryFn: async () => {
      const res = await meApi.getMyFollowers();
      return res.data.data.items;
    },
    enabled,
  });
}

// Fetches the list of users the current user is following
export function useMyFollowing(enabled = true) {
  return useQuery<User[]>({
    queryKey: meKeys.following,
    queryFn: async () => {
      const res = await meApi.getMyFollowing();
      return res.data.data.items;
    },
    enabled,
  });
}
