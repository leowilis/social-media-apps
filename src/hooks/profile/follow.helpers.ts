import type { QueryClient } from '@tanstack/react-query';
import type { UserProfile } from '@/types/user';
import { followKeys } from './followKeys';

export function updateFollowCache(
  queryClient: QueryClient,
  username: string,
  isFollowing: boolean,
) {
  const previous = queryClient.getQueryData<UserProfile>(
    followKeys.profile(username),
  );

  queryClient.setQueryData<UserProfile>(followKeys.profile(username), (old) => {
    if (!old) return old;

    return {
      ...old,
      isFollowedByMe: !isFollowing,
      counts: {
        ...old.counts,
        followers: isFollowing
          ? Math.max(0, (old.counts?.followers ?? 0) - 1)
          : (old.counts?.followers ?? 0) + 1,
      },
    };
  });

  return previous;
}

export function invalidateFollowQueries(
  queryClient: QueryClient,
  username: string,
) {
  queryClient.invalidateQueries({
    queryKey: followKeys.profile(username),
  });

  queryClient.invalidateQueries({
    queryKey: ['me'],
  });

  queryClient.invalidateQueries({
    queryKey: ['feed'],
  });
}
