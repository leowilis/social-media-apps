'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { meApi } from '@/lib/api/me';
import type { UpdateProfilePayload } from '@/lib/api/me';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { meKeys } from '@/hooks/profile/key';
import type { User } from '@/types/user';

// Types

export interface MeData extends User {
  bio?: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
}

// Hooks

export function useMe() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  const query = useQuery({
    queryKey: meKeys.me,

    queryFn: async () => {
      const res = await meApi.getMe();

      const { profile, stats } = res.data.data;

      return {
        ...profile,
        bio: profile.bio,
        postCount: stats.posts,
        followerCount: stats.followers,
        followingCount: stats.following,
      };
    },

    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  return {
    me: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => meApi.updateMe(data),

    onSuccess: (res) => {
      dispatch(updateUser(res.data.data));

      queryClient.invalidateQueries({
        queryKey: meKeys.me,
      });
    },
  });
}
