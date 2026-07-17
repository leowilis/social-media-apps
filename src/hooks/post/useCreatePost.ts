'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postsApi } from '@/lib/api/posts';
import { postKeys } from '@/hooks/post/key';

/**
 * Creates a new post and refreshes related post queries.
 */
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { image: File; caption?: string }) =>
      postsApi.createPost(payload),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: postKeys.feed,
        }),
        queryClient.invalidateQueries({
          queryKey: postKeys.me,
        }),
      ]);
    },
  });
}
