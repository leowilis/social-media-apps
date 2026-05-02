'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { followApi } from '@/lib/api/follow';
import type { UserProfile } from '@/types/user';

// Query Keys

const followKeys = {
  profile: (username: string) => ['users', username] as const,
  followers: (username: string) => ['users', username, 'followers'] as const,
  following: (username: string) => ['users', username, 'following'] as const,
};

// Hooks

// Fetches a paginated list of followers for a user
export function useUserFollowers(username: string) {
  return useQuery({
    queryKey: followKeys.followers(username),
    queryFn: async () => {
      const res = await followApi.getUserFollowers(username);
      return res.data.data.users;
    },
    enabled: !!username,
  });
}

// Fetches a paginated list of users that a user is following
export function useUserFollowing(username: string) {
  return useQuery({
    queryKey: followKeys.following(username),
    queryFn: async () => {
      const res = await followApi.getUserFollowing(username);
      return res.data.data.users;
    },
    enabled: !!username,
  });
}

/**
 * Toggles follow/unfollow for a user with optimistic update.
 * Reverts on error and invalidates cache on settle.
 */
export function useToggleFollow(username: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isFollowing: boolean) =>
      isFollowing ? followApi.unfollow(username) : followApi.follow(username),

    onMutate: async (isFollowing: boolean) => {
      await queryClient.cancelQueries({
        queryKey: followKeys.profile(username),
      });
      const previous = queryClient.getQueryData<UserProfile>(
        followKeys.profile(username),
      );

      queryClient.setQueryData<UserProfile>(
        followKeys.profile(username),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            isFollowedByMe: !isFollowing,
            counts: {
              ...old.counts,
              followers: isFollowing
                ? Math.max(0, old.counts.followers - 1)
                : old.counts.followers + 1,
            },
          };
        },
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          followKeys.profile(username),
          context.previous,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: followKeys.profile(username) });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
