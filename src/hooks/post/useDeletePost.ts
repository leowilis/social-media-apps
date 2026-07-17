'use client';

import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { postsApi } from '@/lib/api/posts';
import { postKeys } from '@/hooks/post/key';

// Deletes a post and refreshes related queries.
export function useDeletePost(postId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: () => postsApi.deletePost(postId),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: postKeys.feed,
        }),
        queryClient.invalidateQueries({
          queryKey: postKeys.me,
        }),
      ]);

      router.back();
    },
  });

  const handleDeletePost = useCallback(() => {
    if (mutation.isPending) return;

    mutation.mutate();
  }, [mutation]);

  return {
    isDeletingPost: mutation.isPending,
    handleDeletePost,
  };
}
