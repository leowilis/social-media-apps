'use client';

import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/lib/api/posts';
import { postKeys } from './key';
import { useAppSelector } from '@/store/hooks';
import type { Post } from '@/types/post';

/**
 * Fetches a single post by ID.
 * Query is skipped until a valid post ID is available.
 */
export function usePostDetail(postId: number | null) {
  const likedPostIds = useAppSelector((state) => state.likes.likedPostIds);
  const savedPostIds = useAppSelector((state) => state.saves.savedPostIds);
  const enabled = postId !== null;

  const query = useQuery<Post>({
    queryKey: enabled ? postKeys.detail(postId) : ['posts', 'detail'],
    enabled,
    staleTime: 0,

    queryFn: async () => {
      if (!enabled || postId === null) {
        throw new Error('Post ID is required.');
      }

      const res = await postsApi.getPost(postId);
      return res.data.data;
    },
  });

  const post = query.data
    ? {
        ...query.data,
        likedByMe: likedPostIds.includes(query.data.id),
        savedByMe: savedPostIds.includes(query.data.id),
      }
    : null;

  return {
    post,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
