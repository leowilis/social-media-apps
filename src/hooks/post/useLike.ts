'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { likesApi } from '@/lib/api/likes';
import { addLike, removeLike } from '@/store/slices/likeSlice';
import { useAppDispatch } from '@/store/hooks';
import type { Post } from '@/types/post';
import type { FeedResponse } from '@/lib/api/feed';

// Types

type FeedPage = FeedResponse['data'];
type FeedCache = InfiniteData<FeedPage>;

// Helpers

// Updates a post in all feed pages using an updater function
function updateFeedPages(
  old: FeedCache | undefined,
  postId: number,
  updater: (post: Post) => Post,
): FeedCache | undefined {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      items: page.items.map((p) => (p.id === postId ? updater(p) : p)),
    })),
  };
}

// Query Keys

const likeKeys = {
  post: (postId: number) => ['posts', postId] as const,
  likes: (postId: number) => ['posts', postId, 'likes'] as const,
  feed: ['feed'] as const,
  myLikes: ['me', 'likes'] as const,
};

// Hooks

/**
 * Fetches users who liked a post.
 * Only runs when explicitly enabled (e.g. when modal is open).
 */
export function usePostLikes(postId: number, enabled = false) {
  return useQuery({
    queryKey: likeKeys.likes(postId),
    queryFn: async () => {
      const res = await likesApi.getPostLikes(postId);
      return res.data.data.users;
    },
    enabled: !!postId && enabled,
  });
}

/**
 * Toggles like/unlike on a post with optimistic update.
 * Also syncs with Redux likes slice for persistence.
 * Reverts on error and invalidates cache on settle.
 */
export function useToggleLike(postId: number) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (isLiked: boolean) =>
      isLiked ? likesApi.unlikePost(postId) : likesApi.likePost(postId),

    onMutate: async (isLiked: boolean) => {
      await queryClient.cancelQueries({ queryKey: likeKeys.post(postId) });
      await queryClient.cancelQueries({ queryKey: likeKeys.feed });

      const previous = queryClient.getQueryData<Post>(likeKeys.post(postId));

      // Sync Redux store
      dispatch(isLiked ? removeLike(postId) : addLike(postId));

      const updater = (post: Post): Post => ({
        ...post,
        likedByMe: !isLiked,
        likeCount: isLiked
          ? (post.likeCount ?? 0) - 1
          : (post.likeCount ?? 0) + 1,
      });

      // Update single post cache
      queryClient.setQueryData<Post>(likeKeys.post(postId), (old) =>
        old ? updater(old) : old,
      );

      // Update feed cache
      queryClient.setQueriesData<FeedCache>(
        { queryKey: likeKeys.feed },
        (old) => updateFeedPages(old, postId, updater),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(likeKeys.post(postId), context.previous);
      }
      queryClient.invalidateQueries({ queryKey: likeKeys.feed });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: likeKeys.feed });
      queryClient.invalidateQueries({ queryKey: likeKeys.myLikes });
    },
  });
}
