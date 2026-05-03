import { useQuery } from '@tanstack/react-query';
import { meApi } from '@/lib/api/me';
import { meKeys } from '@/hooks/profile/key';
import type { User } from '@/types/user';

// Fetches the current user's followers from GET /me/followers
export function useMyFollowers(enabled = true) {
  return useQuery<User[]>({
    queryKey: meKeys.followers,
    queryFn: async () => {
      const res = await meApi.getMyFollowers();
      return res.data.data.items;
    },
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}