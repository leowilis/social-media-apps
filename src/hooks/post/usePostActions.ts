'use client';

import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { likesApi } from '@/lib/api/likes';
import { savesApi } from '@/lib/api/saves';
import { postsApi } from '@/lib/api/posts';
import { postKeys } from '@/hooks/post/key';
import { meKeys } from '@/hooks/profile/key';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addLike, removeLike } from '@/store/slices/likeSlice';
import { addSave, removeSave } from '@/store/slices/saveSlice';

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
 * Like and save use local state initialized from Redux for instant UI updates.
 * Redux is kept in sync for persistence across navigation.
 */
export function usePostActions({
  postId,
  initialLikeCount,
}: UsePostActionsProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Init from Redux (source of truth), but use local state for instant UI
  const likedFromStore = useAppSelector((s) =>
    s.likes.likedPostIds.includes(postId),
  );
  const savedFromStore = useAppSelector((s) =>
    s.saves.savedPostIds.includes(postId),
  );

  const [liked, setLiked] = useState(likedFromStore);
  const [saved, setSaved] = useState(savedFromStore);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [toast, setToast] = useState<ToastState>({ message: '', show: false });

  useEffect(() => {
    setSaved(savedFromStore);
  }, [savedFromStore]);

  useEffect(() => {
    setLiked(likedFromStore);
  }, [likedFromStore]);

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
      dispatch(wasLiked ? removeLike(postId) : addLike(postId));
    },

    onError: (_err, wasLiked) => {
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
      dispatch(wasLiked ? addLike(postId) : removeLike(postId));
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
      dispatch(wasSaved ? removeSave(postId) : addSave(postId));
      showToast(wasSaved ? 'Removed from saved' : 'Post saved!');
    },

    onError: (_err, wasSaved) => {
      setSaved(wasSaved);
      dispatch(wasSaved ? addSave(postId) : removeSave(postId));
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

// Create Post

/**
 * Creates a new post with image and caption.
 * Invalidates feed and profile post cache on success.
 */
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
