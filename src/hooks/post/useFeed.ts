'use client';

import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { feedApi, type FeedResponse } from '@/lib/api/feed';
import { useAppSelector } from '@/store/hooks';
import { postKeys } from '@/hooks/post/key';

// Types

type FeedPage = FeedResponse['data'];
type FeedCache = InfiniteData<FeedPage>;

// Hook

/**
 * Fetches the authenticated user's feed using infinite scroll.
 * Only runs when the user is authenticated.
 */
export function useFeed() {
  const isLoggedIn = useAppSelector((s) => s.auth.isAuthenticated);

  const query = useInfiniteQuery<FeedPage, Error, FeedCache>({
    queryKey: postKeys.feed,
    queryFn: ({ pageParam = 1 }) =>
      feedApi.getFeed(pageParam as number).then((r) => r.data.data),
    initialPageParam: 1,
    enabled: isLoggedIn,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  return {
    posts: query.data?.pages.flatMap((p) => p.items) ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    hasMore: query.hasNextPage,
    loadMore: query.fetchNextPage,
    isFetchingMore: query.isFetchingNextPage,
  };
}
