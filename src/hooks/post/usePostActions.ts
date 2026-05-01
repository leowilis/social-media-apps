'use client';

import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { likesApi } from '@/lib/api/likes';
import { savesApi } from '@/lib/api/saves';
import { postsApi } from '@/lib/api/posts';
import { postKeys } from './usePosts';
import { meKeys } from '@/hooks/profile/key';

// Types

interface UsePostActionsProps {
  postId: number;
  initialLiked: boolean;
  initialLikeCount: number;
  initialSaved: boolean;
}

interface ToastState {
  message: string;
  show: boolean;
}

// Hook

/**
 * Handles all post actions: like, save, and delete.
 * Each action uses optimistic updates — the UI updates immediately
 * and rolls back automatically if the request fails.
 */
export function usePostActions({
  postId,
  initialLiked,
  initialLikeCount,
  initialSaved,
}: UsePostActionsProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [saved, setSaved] = useState(initialSaved);
  const [toast, setToast] = useState<ToastState>({ message: '', show: false });

  // Sync local state when server data updates (e.g. from refetchInterval)
  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);
  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  const showToast = useCallback((message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500);
  }, []);

  // Like

  const likeMutation = useMutation({
    mutationFn: (wasLiked: boolean) =>
      wasLiked ? likesApi.unlikePost(postId) : likesApi.likePost(postId),

    onMutate: (wasLiked) => {
      setLiked(!wasLiked);
      setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
    },

    onError: (_err, wasLiked) => {
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.feed });
    },
  });
  // Save

  const saveMutation = useMutation({
    mutationFn: (wasSaved: boolean) =>
      wasSaved ? savesApi.unsavePost(postId) : savesApi.savePost(postId),
    onMutate: (wasSaved) => {
      setSaved(!wasSaved);
      showToast(wasSaved ? 'Removed from saved' : 'Post saved!');
    },
    onError: (_err, wasSaved) => {
      setSaved(wasSaved);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: meKeys.saved });
    },
  });

  // Delete

  const deleteMutation = useMutation({
    mutationFn: () => postsApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.feed });
      queryClient.invalidateQueries({ queryKey: postKeys.me });
      router.back();
    },
  });

  // Handlers

  const handleLike = useCallback(() => {
    if (likeMutation.isPending) return;
    likeMutation.mutate(liked);
  }, [liked, likeMutation]);

  const handleSave = useCallback(() => {
    if (saveMutation.isPending) return;
    saveMutation.mutate(saved);
  }, [saved, saveMutation]);

  const handleDeletePost = useCallback(() => {
    deleteMutation.mutate();
  }, [deleteMutation]);

  return {
    liked,
    likeCount,
    saved,
    toast,
    isPendingLike: likeMutation.isPending,
    isPendingSave: saveMutation.isPending,
    isDeletingPost: deleteMutation.isPending,
    handleLike,
    handleSave,
    handleDeletePost,
  };
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { image: File; caption?: string }) =>
      postsApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.feed });
      queryClient.invalidateQueries({ queryKey: postKeys.me });
    },
  });
}
