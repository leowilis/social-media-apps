import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';

interface UsePostActionsProps {
  postId: number;
  initialLiked: boolean;
  initialLikeCount: number;
  initialSaved: boolean;
}

/**
 * Handles all post actions: like, save, and delete.
 *
 * Each action uses optimistic updates — the UI updates immediately
 * and rolls back automatically if the request fails.
 * Related query caches are invalidated after each mutation settles.
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
  const [toast, setToast] = useState({ message: '', show: false });

  // Shows a toast notification for 2.5 seconds.
  const showToast = useCallback((message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500);
  }, []);

  // Like

  const likeMutation = useMutation({
    mutationFn: (wasLiked: boolean) =>
      wasLiked
        ? api.delete(`/posts/${postId}/like`)
        : api.post(`/posts/${postId}/like`),
    onMutate: (wasLiked) => {
      setLiked(!wasLiked);
      setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
    },
    onError: (_err, wasLiked) => {
      // Roll back on failure
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
    },
  });

  // Save

  const saveMutation = useMutation({
    mutationFn: (wasSaved: boolean) =>
      wasSaved
        ? api.delete(`/posts/${postId}/save`)
        : api.post(`/posts/${postId}/save`),
    onMutate: (wasSaved) => {
      setSaved(!wasSaved);
      showToast(wasSaved ? 'Removed from saved' : 'Post saved!');
    },
    onError: (_err, wasSaved) => {
      setSaved(wasSaved);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['my-posts', 'saved'] });
    },
  });

  // Delete post

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/posts/${postId}`),
    onSuccess: () => {
      // Remove from feed and my-posts without a full reload
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
      router.back();
    },
  });

  // Toggles like. No-op if a request is already in flight (idempotent).
  const handleLike = useCallback(() => {
    if (likeMutation.isPending) return;
    likeMutation.mutate(liked);
  }, [liked, likeMutation]);

  /** Toggles save */
  const handleSave = useCallback(() => {
    if (saveMutation.isPending) return;
    saveMutation.mutate(saved);
  }, [saved, saveMutation]);

  /** Deletes the post and navigates back on success. */
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
