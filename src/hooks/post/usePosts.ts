'use client';

import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { postsApi } from '@/lib/api/posts';
import type { PostsResponse } from '@/lib/api/posts';
import type { Post } from '@/types/post';

// Types

type PostsPage = PostsResponse['data'];
type PostsCache = InfiniteData<PostsPage>;

// Query Keys

export const postKeys = {
  feed: ['feed'] as const,
  explore: ['posts', 'explore'] as const,
  detail: (id: number) => ['posts', id] as const,
  me: ['me', 'posts'] as const,
};

// Hook

// Fetches all posts (explore) using infinite scroll
export function useExplorePosts() {
  const query = useInfiniteQuery<PostsPage, Error, PostsCache>({
    queryKey: postKeys.explore,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await postsApi.getAllPosts(pageParam as number);
      return res.data.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: PostsPage) => {
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
