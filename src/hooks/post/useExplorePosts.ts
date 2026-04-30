import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { postsApi } from '@/lib/api/posts';
import { postKeys } from '@/hooks/post/key';
import type { PostsResponse } from '@/lib/api/posts';
import type { Post } from '@/types/post';

// Types

type PostsPage = PostsResponse['data'];
type PostsCache = InfiniteData<PostsPage>;

// Hook

/**
 * Fetches all posts (explore) using infinite scroll.
 * Hits GET /api/posts.
 */
export function useExplorePosts() {
  const query = useInfiniteQuery<PostsPage, Error, PostsCache>({
    queryKey: postKeys.explore,
    queryFn: ({ pageParam = 1 }) =>
      postsApi.getAllPosts(pageParam as number).then((r) => r.data.data),
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
