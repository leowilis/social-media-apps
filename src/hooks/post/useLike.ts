'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';

import { likesApi } from '@/lib/api/likes';
import { addLike, removeLike } from '@/store/slices/likeSlice';
import { useAppDispatch } from '@/store/hooks';

import { likeKeys } from './key';

import type { Post } from '@/types/post';
import type { FeedResponse } from '@/lib/api/feed';

// Types

type FeedPage = FeedResponse['data'];
type FeedCache = InfiniteData<FeedPage>;

// Helpers

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
      items: page.items.map((post) =>
        post.id === postId ? updater(post) : post,
      ),
    })),
  };
}

// Fetch likes

export function usePostLikes(postId: number, enabled = false) {
  return useQuery({
    queryKey: likeKeys.likes(postId),

    queryFn: async () => {
      const res = await likesApi.getPostLikes(postId);
      return res.data.data.users;
    },

    enabled: enabled && !!postId,
  });
}

// Toggle Like

export function useToggleLike(postId: number) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (isLiked: boolean) =>
      isLiked ? likesApi.unlikePost(postId) : likesApi.likePost(postId),

    onMutate: async (isLiked) => {
      await queryClient.cancelQueries({
        queryKey: likeKeys.post(postId),
      });

      await queryClient.cancelQueries({
        queryKey: likeKeys.feed,
      });

      const previous = queryClient.getQueryData<Post>(likeKeys.post(postId));

      dispatch(isLiked ? removeLike(postId) : addLike(postId));

      const updater = (post: Post): Post => ({
        ...post,
        likedByMe: !isLiked,
        likeCount: isLiked
          ? Math.max((post.likeCount ?? 0) - 1, 0)
          : (post.likeCount ?? 0) + 1,
      });

      queryClient.setQueryData<Post>(likeKeys.post(postId), (old) =>
        old ? updater(old) : old,
      );

      queryClient.setQueriesData<FeedCache>(
        {
          queryKey: likeKeys.feed,
        },
        (old) => updateFeedPages(old, postId, updater),
      );

      return { previous };
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(likeKeys.post(postId), context.previous);
      }

      queryClient.invalidateQueries({
        queryKey: likeKeys.feed,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: likeKeys.myLikes,
      });
    },
  });
}
