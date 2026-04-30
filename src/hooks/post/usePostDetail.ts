'use client';

import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/lib/api/posts';
import { postKeys } from './usePosts';
import type { Post } from '@/types/post';

/**
 * Fetches a single post by ID.
 * Query is skipped if postId is null.
 */
export function usePostDetail(postId: number | null) {
  const query = useQuery<Post>({
    queryKey: postKeys.detail(postId!),
    queryFn: async () => {
      const res = await postsApi.getPost(postId!);
      return res.data.data;
    },
    enabled: postId !== null,
  });

  return {
    post: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
