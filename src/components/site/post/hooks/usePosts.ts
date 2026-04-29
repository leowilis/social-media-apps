import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

// Types

export type Post = {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    name: string;
    avatarUrl: string | null;
  };
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
};

// API

async function fetchFeed(page: number): Promise<Post[]> {
  const res = await api.get('/feed', { params: { page, limit: 10 } });
  return (res.data.data?.posts ?? []).map((p: Post) => ({
    ...p,
    likedByMe: Boolean(p.likedByMe),
    savedByMe: Boolean(p.savedByMe),
  }));
}

// Hook

/**
 * Fetches the user's feed using infinite pagination.
 *
 * Uses TanStack Query `useInfiniteQuery` as the single source of truth —
 * no local state duplication. Invalidate `['feed']` after create/delete
 * to keep all lists in sync automatically.
 */
export function usePosts() {
  const query = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => fetchFeed(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length + 1 : undefined,
  });

  const posts = query.data?.pages.flat() ?? [];

  return {
    posts,
    isLoading: query.isLoading,
    isError: query.isError,
    hasMore: query.hasNextPage,
    loadMore: query.fetchNextPage,
    isFetchingMore: query.isFetchingNextPage,
  };
}
