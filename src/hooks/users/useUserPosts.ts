import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { userKeys } from '@/hooks/users/key';

/**
 * Fetches public posts for a given username.
 * Returns an empty array if the response shape is unexpected.
 */
export function useUserPosts(username: string) {
  return useQuery({
    queryKey: userKeys.posts(username),
    queryFn: async () => {
      const res = await usersApi.getUserPosts(username);
      const inner = res.data?.data;
      return Array.isArray(inner?.posts) ? inner.posts : [];
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
