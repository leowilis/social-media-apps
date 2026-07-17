'use client';

import { useToast } from '@/hooks/common/useToast';

import { useLikePost } from './useLikePost';
import { useSavePost } from './useSavePost';
import { useDeletePost } from './useDeletePost';

interface UsePostActionsProps {
  postId: number;
  initialLikeCount: number;
}

// Combines post action hooks into a single interface for the UI.
export function usePostActions({
  postId,
  initialLikeCount,
}: UsePostActionsProps) {
  const toast = useToast();

  const like = useLikePost({
    postId,
    initialLikeCount,
  });

  const save = useSavePost(
    {
      postId,
    },
    {
      onSuccess: toast.open,
    },
  );

  const remove = useDeletePost(postId);

  return {
    ...like,
    ...save,
    ...remove,
    toast,
  };
}
