'use client';

import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';

import { feedApi, type FeedResponse } from '@/lib/api/feed';
import { postKeys } from '@/hooks/post/key';
import { useAppSelector } from '@/store/hooks';

type FeedPage = FeedResponse['data'];
type FeedCache = InfiniteData<FeedPage>;

// Fetches the authenticated user's feed with infinite pagination.
export function useFeed() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const query = useInfiniteQuery<FeedPage, Error, FeedCache>({
    queryKey: postKeys.feed,

    queryFn: ({ pageParam = 1 }) =>
      feedApi
        .getFeed(pageParam as number)
        .then((response) => response.data.data),

    initialPageParam: 1,
    enabled: isAuthenticated,

    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;

      return page < totalPages ? page + 1 : undefined;
    },
  });

  return {
    posts: query.data?.pages.flatMap((page) => page.items) ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    hasMore: query.hasNextPage ?? false,
    loadMore: query.fetchNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
