'use client';

import { useEffect, useState } from 'react';
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

  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const mutation = useMutation({
    mutationFn: (wasLiked: boolean) =>
      wasLiked ? likesApi.unlikePost(postId) : likesApi.likePost(postId),

    onMutate: async (wasLiked) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: postKeys.detail(postId),
        }),
        queryClient.cancelQueries({
          queryKey: postKeys.feed,
        }),
      ]);

      setLikeCount((count) => (wasLiked ? Math.max(0, count - 1) : count + 1));

      dispatch(wasLiked ? removeLike(postId) : addLike(postId));
    },

    onError: (_error, wasLiked) => {
      setLikeCount((count) => (wasLiked ? count + 1 : Math.max(0, count - 1)));

      dispatch(wasLiked ? addLike(postId) : removeLike(postId));
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: postKeys.detail(postId),
      });

      queryClient.invalidateQueries({
        queryKey: postKeys.feed,
      });
    },
  });

  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);

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
