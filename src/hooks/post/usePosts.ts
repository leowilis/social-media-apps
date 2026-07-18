'use client';

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { postsApi } from '@/lib/api/posts';
import { postKeys } from '@/hooks/post/key';
import type { PostsResponse } from '@/lib/api/posts';
import type { Post } from '@/types/post';

type PostsPage = PostsResponse['data'];
type PostsCache = InfiniteData<PostsPage>;

// Fetches explore posts using infinite scrolling.
export function useExplorePosts() {
  const query = useInfiniteQuery<PostsPage, Error, PostsCache>({
    queryKey: postKeys.explore,

    queryFn: async ({ pageParam = 1 }) => {
      const res = await postsApi.getAllPosts(pageParam as number);
      return res.data.data;
    },

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;

      return page < totalPages ? page + 1 : undefined;
    },
  });

  return {
    posts: query.data?.pages.flatMap((page) => page.posts) ?? ([] as Post[]),
    isLoading: query.isLoading,
    isError: query.isError,
    hasMore: query.hasNextPage,
    loadMore: query.fetchNextPage,
    isFetchingMore: query.isFetchingNextPage,
  };
}
