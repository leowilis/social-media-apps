'use client';

import { useState } from 'react';
import { IoHappyOutline } from 'react-icons/io5';
import { useAddComment } from '@/hooks/post/useComments';
import { useMe } from '@/hooks/profile/useMe';
import type { Comment } from '@/lib/api/comment';

interface DesktopCommentInputProps {
  postId: number;
  onCommentAdded?: () => void;
}

// DesktopCommentInput — Inline desktop comment input.
export default function DesktopCommentInput({
  postId,
  onCommentAdded,
}: DesktopCommentInputProps) {
  const { me } = useMe();
  const addMutation = useAddComment(postId, me as Comment['author']);
  const [text, setText] = useState('');
  const handleSend = () => {
    const trimmedValue = text.trim();

    if (!trimmedValue || addMutation.isPending) return;

    addMutation.mutate(trimmedValue, {
      onSuccess: () => {
        setText('');
        onCommentAdded?.();
      },
    });
  };

  return (
    <div className='flex shrink-0 select-none items-center gap-2.5 border-t border-white/5 bg-[#0e0e13] px-4 py-3'>
      {/* Emoji Button */}
      <button
        type='button'
        aria-label='Open emoji picker'
        className='flex size-9 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-all hover:bg-white/5 hover:text-white focus-visible:ring-1 focus-visible:ring-primary-400 active:scale-95'
      >
        <IoHappyOutline className='size-5' aria-hidden='true' />
      </button>

      {/* Comment Input */}
      <div className='min-w-0 flex-1'>
        <input
          type='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
          placeholder='Add a comment...'
          className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition-all placeholder:text-neutral-600 focus:border-primary-400/40 focus:bg-white/10 focus:ring-1 focus:ring-primary-400/20'
        />
      </div>

      {/* Submit Button */}
      <button
        type='button'
        onClick={handleSend}
        disabled={!text.trim() || addMutation.isPending}
        className='flex h-9 shrink-0 items-center justify-center rounded-full px-3 text-sm font-bold text-primary-400 transition-all hover:text-primary-300 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-primary-400 active:scale-95'
      >
        {addMutation.isPending ? (
          <div
            role='status'
            aria-label='Publishing comment'
            className='size-4 animate-spin rounded-full border-2 border-primary-400 border-t-transparent'
          />
        ) : (
          'Post'
        )}
      </button>
    </div>
  );
}
