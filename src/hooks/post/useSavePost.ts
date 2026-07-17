'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { savesApi } from '@/lib/api/saves';
import { meKeys } from '@/hooks/profile/key';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addSave, removeSave } from '@/store/slices/saveSlice';

interface UseSavePostProps {
  postId: number;
}

interface UseSavePostOptions {
  onSuccess?: (message: string) => void;
}

// Handles save and unsave actions for a post.
export function useSavePost(
  { postId }: UseSavePostProps,
  { onSuccess }: UseSavePostOptions = {},
) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const saved = useAppSelector((state) =>
    state.saves.savedPostIds.includes(postId),
  );

  const mutation = useMutation({
    mutationFn: (wasSaved: boolean) =>
      wasSaved ? savesApi.unsavePost(postId) : savesApi.savePost(postId),

    onMutate: (wasSaved) => {
      dispatch(wasSaved ? removeSave(postId) : addSave(postId));
    },

    onSuccess: (_data, wasSaved) => {
      onSuccess?.(wasSaved ? 'Removed from saved' : 'Post saved!');
    },

    onError: (_error, wasSaved) => {
      dispatch(wasSaved ? addSave(postId) : removeSave(postId));
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: meKeys.saved,
      });
    },
  });

  const handleSave = () => {
    if (mutation.isPending) return;

    mutation.mutate(saved);
  };

  return {
    saved,
    isPendingSave: mutation.isPending,
    handleSave,
  };
}
