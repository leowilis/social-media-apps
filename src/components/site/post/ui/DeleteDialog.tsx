'use client';

import { IoTrashOutline } from 'react-icons/io5';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * Accessible confirmation dialog for destructive actions.
 * Built on Radix AlertDialog for focus trapping and keyboard navigation.
 */
export function DeleteDialog({
  title,
  description,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteDialogProps) {
  return (
    <AlertDialog open onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className='w-[85vw] max-w-xs overflow-hidden rounded-3xl border border-white/10 bg-surface/95 p-0 shadow-2xl backdrop-blur-xl'>
        <div className='flex justify-center pt-6 pb-2'>
          <div className='flex size-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10'>
            <IoTrashOutline
              className='size-7 text-red-400'
              aria-hidden='true'
            />
          </div>
        </div>

        <div className='px-6 py-3 text-center'>
          <AlertDialogTitle className='mb-1 text-base font-bold text-white'>
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className='text-sm leading-relaxed text-neutral-500'>
            {description}
          </AlertDialogDescription>
        </div>

        <div className='flex gap-2.5 px-5 pt-2 pb-5'>
          <button
            type='button'
            onClick={onCancel}
            disabled={loading}
            className='flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Cancel
          </button>

          <button
            type='button'
            onClick={onConfirm}
            disabled={loading}
            className='flex flex-1 items-center justify-center rounded-2xl bg-red-500 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {loading ? (
              <div
                className='size-4 animate-spin rounded-full border-2 border-white border-t-transparent'
                aria-label='Deleting'
              />
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
