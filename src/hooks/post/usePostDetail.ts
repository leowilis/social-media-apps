'use client';

import { useQuery } from '@tanstack/react-query';

import { postsApi } from '@/lib/api/posts';
import { postKeys } from './key';
import { useAppSelector } from '@/store/hooks';

import type { Post } from '@/types/post';

/**
 * Fetches a single post by ID.
 * Query is skipped until a valid postId is provided.
 */
export function usePostDetail(postId: number | null) {
  const likedPostIds = useAppSelector((state) => state.likes.likedPostIds);
  const savedPostIds = useAppSelector((state) => state.saves.savedPostIds);

  const query = useQuery<Post>({
    queryKey: postId ? postKeys.detail(postId) : ['posts', 'detail', 'pending'],
    enabled: postId !== null,
    staleTime: 0,
    queryFn: async () => {
      if (postId === null) {
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
