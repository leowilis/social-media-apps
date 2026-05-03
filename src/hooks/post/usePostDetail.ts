'use client';

import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@/lib/api/posts';
import { postKeys } from './usePosts';
import { useAppSelector } from '@/store/hooks';
import type { Post } from '@/types/post';

/**
 * Fetches a single post by ID.
 * Query is skipped if postId is null.
 * Overrides likedByMe from Redux likes slice
 * since backend always returns likedByMe: false.
 */
export function usePostDetail(postId: number | null) {
  const likedPostIds = useAppSelector((s) => s.likes.likedPostIds);
  const savedPostIds = useAppSelector((s) => s.saves.savedPostIds);

  const query = useQuery<Post>({
    queryKey: postKeys.detail(postId!),
    queryFn: async () => {
      const res = await postsApi.getPost(postId!);
      return res.data.data;
    },
    enabled: postId !== null,
    staleTime: 0,
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
  };
}
