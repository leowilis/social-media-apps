import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { userKeys } from '@/hooks/users/key';

/**
 * Searches users by query string with pagination.
 * Only fires when query has at least 1 non-whitespace character.
 */
export function useSearchUsers(q: string, page = 1) {
  return useQuery({
    queryKey: userKeys.search(q, page),
    queryFn: async () => {
      const res = await usersApi.searchUsers(q, page);
      return res.data?.data ?? res.data;
    },
    enabled: q.trim().length > 0,
    staleTime: 1000 * 30, // 30 seconds
  });
}
