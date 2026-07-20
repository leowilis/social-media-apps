'use client';

import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { savesApi } from '@/lib/api/saves';
import { useToast } from '@/hooks/common/useToast';
import { meKeys } from '@/hooks/profile/key';
import { postKeys } from '@/hooks/post/key';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addSave, removeSave } from '@/store/slices/saveSlice';

import type { FeedResponse } from '@/lib/api/feed';
import type { Post } from '@/types/post';

interface UseSavePostProps {
  postId: number;
}

type FeedPage = FeedResponse['data'];
type FeedCache = InfiniteData<FeedPage>;

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

/**
 * Handles save / unsave post with optimistic updates.
 * Syncs Redux, Post Detail cache, Feed cache and Saved Posts cache.
 */
export function useSavePost({ postId }: UseSavePostProps) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const saved = useAppSelector((state) =>
    state.saves.savedPostIds.includes(postId),
  );

  const mutation = useMutation({
    mutationFn: (wasSaved: boolean) =>
      wasSaved ? savesApi.unsavePost(postId) : savesApi.savePost(postId),

    onMutate: async (wasSaved) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: postKeys.detail(postId),
        }),
        queryClient.cancelQueries({
          queryKey: postKeys.feed,
        }),
        queryClient.cancelQueries({
          queryKey: meKeys.saved,
        }),
      ]);

      const previousPost = queryClient.getQueryData<Post>(
        postKeys.detail(postId),
      );

      dispatch(wasSaved ? removeSave(postId) : addSave(postId));

      const updater = (post: Post): Post => ({
        ...post,
        savedByMe: !wasSaved,
      });

      queryClient.setQueryData<Post>(postKeys.detail(postId), (old) =>
        old ? updater(old) : old,
      );

      queryClient.setQueriesData<FeedCache>(
        {
          queryKey: postKeys.feed,
        },
        (old) => updateFeedPages(old, postId, updater),
      );

      return {
        previousPost,
      };
    },

    onSuccess: (_data, wasSaved) => {
      toast.success(
        wasSaved ? 'Removed from saved.' : 'Post saved successfully.',
      );
    },

    onError: (_error, wasSaved, context) => {
      dispatch(wasSaved ? addSave(postId) : removeSave(postId));

      if (context?.previousPost) {
        queryClient.setQueryData(postKeys.detail(postId), context.previousPost);
      }

      queryClient.invalidateQueries({
        queryKey: postKeys.feed,
      });

      toast.error('Failed to update saved posts.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: meKeys.saved,
      });
    },
  });

  const handleSave = () => {
    if (mutation.isPending) return;

    mutation.mutate(saved);
  };

  return {
    saved,
    isPendingSave: mutation.isPending,
    handleSave,
  };
}

/**
 * Returns whether a post is currently saved.
 */
export function useIsSaved(postId: number) {
  return useAppSelector((state) => state.saves.savedPostIds.includes(postId));
}
