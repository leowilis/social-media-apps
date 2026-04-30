import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { userKeys } from '@/hooks/users/key';

/**
 * Fetches posts liked by a given user.
 * Returns an empty array if the response shape is unexpected.
 */
export function useUserLikes(username: string) {
  return useQuery({
    queryKey: userKeys.likes(username),
    queryFn: async () => {
      const res = await usersApi.getUserLikes(username);
      const inner = res.data?.data;
      return Array.isArray(inner?.posts) ? inner.posts : [];
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
