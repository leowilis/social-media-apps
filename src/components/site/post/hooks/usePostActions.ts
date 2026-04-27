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
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
      router.back();
    },
  });

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
