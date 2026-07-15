'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followApi } from '@/lib/api/follow';
import { invalidateFollowQueries, updateFollowCache } from './follow.helpers';
import { followKeys } from './followKeys';
import type { UserProfile } from '@/types/user';

type ToggleFollowVariables = {
  username: string;
  isFollowing: boolean;
};

type ToggleFollowContext = {
  previous?: UserProfile;
};

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    ToggleFollowVariables,
    ToggleFollowContext
  >({
    mutationFn: ({ username, isFollowing }) =>
      isFollowing ? followApi.unfollow(username) : followApi.follow(username),

    onMutate: async ({ username, isFollowing }) => {
      await queryClient.cancelQueries({
        queryKey: followKeys.profile(username),
      });

      const previous = updateFollowCache(queryClient, username, isFollowing);

      return { previous };
    },

    onError: (_, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          followKeys.profile(variables.username),
          context.previous,
        );
      }
    },

    onSettled: (_, __, variables) => {
      invalidateFollowQueries(queryClient, variables.username);
    },
  });
}
