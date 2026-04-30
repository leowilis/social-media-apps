'use client';

import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { feedApi, FeedResponse } from '@/lib/api/feed';
import { useAppSelector } from '@/store/hooks';

// Types

type FeedPage = FeedResponse['data'];
type FeedCache = InfiniteData<FeedPage>;

// Hook

/**
 * Fetches the authenticated user's feed using infinite scroll.
 * Only runs when the user is authenticated.
 */
export function useFeed() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  return useInfiniteQuery<FeedPage, Error, FeedCache>({
    queryKey: ['feed'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await feedApi.getFeed(pageParam as number);
      return res.data.data;
    },
    initialPageParam: 1,
    enabled: isAuthenticated,
    getNextPageParam: (lastPage: FeedPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}
