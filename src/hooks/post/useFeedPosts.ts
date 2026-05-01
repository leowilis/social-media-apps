import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { postKeys } from '@/hooks/post/key';
import type { Post } from '@/types/post';

// Types

interface FeedPage {
  posts: Post[];
  pagination: {
    page: number;
    totalPages: number;
  };
}

type FeedCache = InfiniteData<FeedPage>;

// Fetcher

const fetchFeed = async (page: number): Promise<FeedPage> => {
  const res = await api.get('/feed', { params: { page, limit: 10 } });
  const { items, pagination } = res.data.data;
  return { posts: items, pagination }; 
};

// Hook

/**
 * Fetches the authenticated user's feed using infinite scroll.
 * Hits GET /api/feed (self + following posts).
 */
export function useFeedPosts() {
  const query = useInfiniteQuery<FeedPage, Error, FeedCache>({
    queryKey: postKeys.feed,
    queryFn: ({ pageParam = 1 }) => fetchFeed(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  return {
    posts: query.data?.pages.flatMap((p) => p.posts) ?? ([] as Post[]),
    isLoading: query.isLoading,
    isError: query.isError,
    hasMore: query.hasNextPage,
    loadMore: query.fetchNextPage,
    isFetchingMore: query.isFetchingNextPage,
  };
}
