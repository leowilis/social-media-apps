'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { postsApi } from '@/lib/api/posts';
import { postKeys } from '@/hooks/post/key';

interface CreatePostPayload {
  image: File;
  caption?: string;
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof postsApi.createPost>>,
    AxiosError,
    CreatePostPayload
  >({
    mutationFn: (payload) => postsApi.createPost(payload),

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
