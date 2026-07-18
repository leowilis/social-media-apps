'use client';

import { useDeletePost } from './useDeletePost';
import { useLikePost } from './useLikePost';
import { useSavePost } from './useSavePost';

interface UsePostActionsProps {
  postId: number;
  initialLikeCount: number;
}

// Combines all post interaction hooks into a single interface.
export function usePostActions({
  postId,
  initialLikeCount,
}: UsePostActionsProps) {
  const like = useLikePost({
    postId,
    initialLikeCount,
  });

  const save = useSavePost({
    postId,
  });

  const remove = useDeletePost(postId);

  return {
    ...like,
    ...save,
    ...remove,
  };
}
