'use client';

import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { savesApi } from '@/lib/api/saves';
import { addSave, removeSave } from '@/store/slices/saveSlice';
import { useAppDispatch } from '@/store/hooks';
import { meKeys } from '@/hooks/profile/useMe';
import { postKeys } from '@/hooks/post/usePosts';
import type { Post } from '@/types/post';
import type { FeedResponse } from '@/lib/api/feed';

// Types

type FeedPage = FeedResponse['data'];
type FeedCache = InfiniteData<FeedPage>;

// Helpers

// Updates savedByMe on a post across all feed pages
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
      posts: page.posts.map((p) => (p.id === postId ? updater(p) : p)),
    })),
  };
}

// Hook

/**
 * Toggles save/unsave on a post with optimistic update.
 * Syncs with Redux saves slice for persistence.
 * NOTE: Post cache is not invalidated on settle due to a backend bug
 * where savedByMe is always returned as false.
 */
export function useToggleSave(postId: number) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (isSaved: boolean) =>
      isSaved ? savesApi.unsavePost(postId) : savesApi.savePost(postId),

    onMutate: async (isSaved: boolean) => {
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });
      await queryClient.cancelQueries({ queryKey: postKeys.feed });

      const previous = queryClient.getQueryData<Post>(postKeys.detail(postId));

      // Sync Redux store
      dispatch(isSaved ? removeSave(postId) : addSave(postId));

      const updater = (post: Post): Post => ({ ...post, savedByMe: !isSaved });

      // Update single post cache
      queryClient.setQueryData<Post>(postKeys.detail(postId), (old) =>
        old ? updater(old) : old,
      );

      // Update feed cache
      queryClient.setQueriesData<FeedCache>(
        { queryKey: postKeys.feed },
        (old) => updateFeedPages(old, postId, updater),
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(postKeys.detail(postId), context.previous);
      }
      queryClient.invalidateQueries({ queryKey: postKeys.feed });
    },

    onSettled: () => {
      // NOTE: intentionally not invalidating postKeys.detail(postId)
      // due to backend bug where savedByMe always returns false
      queryClient.invalidateQueries({ queryKey: meKeys.saved });
    },
  });
}
