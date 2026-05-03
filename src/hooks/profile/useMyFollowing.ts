import { useQuery } from '@tanstack/react-query';
import { meApi } from '@/lib/api/me';
import { meKeys } from '@/hooks/profile/key';
import type { User } from '@/types/user';

// Fetches the list of users the current user is following from GET /me/following
export function useMyFollowing(enabled = true) {
  return useQuery<User[]>({
    queryKey: meKeys.following,
    queryFn: async () => {
      const res = await meApi.getMyFollowing();
      return res.data.data.items;
    },
    enabled,
    staleTime: 1000 * 60 * 2,
  });
}