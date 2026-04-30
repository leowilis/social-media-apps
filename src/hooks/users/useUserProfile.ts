import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { userKeys } from '@/hooks/users/key';

/**
 * Fetches public profile data for a given username.
 * Only fires when username is non-empty.
 */
export function useUserProfile(username: string) {
  return useQuery({
    queryKey: userKeys.profile(username),
    queryFn: async () => {
      const res = await usersApi.getUserProfile(username);
      return res.data.data;
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}