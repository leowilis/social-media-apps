'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { savesApi } from '@/lib/api/saves';
import { meKeys } from '@/hooks/profile/key';
import { useToast } from '@/hooks/common/useToast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addSave, removeSave } from '@/store/slices/saveSlice';

interface UseSavePostProps {
  postId: number;
}

// Handles save / unsave post with optimistic Redux updates.
export function useSavePost({ postId }: UseSavePostProps) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const saved = useAppSelector((state) =>
    state.saves.savedPostIds.includes(postId),
  );

  const mutation = useMutation({
    mutationFn: (wasSaved: boolean) =>
      wasSaved ? savesApi.unsavePost(postId) : savesApi.savePost(postId),

    onMutate: async (wasSaved) => {
      await queryClient.cancelQueries({
        queryKey: meKeys.saved,
      });

      dispatch(wasSaved ? removeSave(postId) : addSave(postId));
    },

    onSuccess: (_data, wasSaved) => {
      toast.success(wasSaved ? 'Removed from saved' : 'Post saved!');
    },

    onError: (_error, wasSaved) => {
      dispatch(wasSaved ? addSave(postId) : removeSave(postId));

      toast.error('Failed to update saved posts.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({
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
