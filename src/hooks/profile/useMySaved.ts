import { useQuery } from '@tanstack/react-query';
import { meApi } from '@/lib/api/me';
import { meKeys } from '@/hooks/profile/key';
import type { Post } from '@/types/post';

// Fetches the current user's saved posts from GET /me/saved
export function useMySaved(page = 1) {
  return useQuery<Post[]>({
    queryKey: [...meKeys.saved, page],
    queryFn: async () => {
      const res = await meApi.getMySaved(page);
      return res.data.data.items;
    },
    staleTime: 1000 * 60 * 2,
  });
}
