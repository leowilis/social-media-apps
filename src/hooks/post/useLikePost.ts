'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { likesApi } from '@/lib/api/likes';
import { postKeys } from '@/hooks/post/key';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addLike, removeLike } from '@/store/slices/likeSlice';

interface UseLikePostProps {
  postId: number;
  initialLikeCount: number;
}

// Manages post like interactions with optimistic updates.
export function useLikePost({ postId, initialLikeCount }: UseLikePostProps) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const liked = useAppSelector((state) =>
    state.likes.likedPostIds.includes(postId),
  );

  const [likeCount, setLikeCount] = useState(() => initialLikeCount);

  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);

  const mutation = useMutation({
    mutationFn: (wasLiked: boolean) =>
      wasLiked ? likesApi.unlikePost(postId) : likesApi.likePost(postId),

    onMutate: (wasLiked) => {
      setLikeCount((count) => (wasLiked ? Math.max(0, count - 1) : count + 1));

      dispatch(wasLiked ? removeLike(postId) : addLike(postId));
    },

    onError: (_error, wasLiked) => {
      setLikeCount((count) => (wasLiked ? count + 1 : Math.max(0, count - 1)));

      dispatch(wasLiked ? addLike(postId) : removeLike(postId));
    },

    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: postKeys.detail(postId),
        }),
        queryClient.invalidateQueries({
          queryKey: postKeys.feed,
        }),
      ]);
    },
  });

  const handleLike = () => {
    if (mutation.isPending) return;

    mutation.mutate(liked);
  };

  return {
    liked,
    likeCount,
    isPendingLike: mutation.isPending,
    handleLike,
  };
}
