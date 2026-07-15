'use client';

import { IoCloseOutline } from 'react-icons/io5';

interface CommentHeaderProps {
  totalComments: number;
  onClose?: () => void;
}

export default function CommentHeader({
  totalComments,
  onClose,
}: CommentHeaderProps) {
  return (
    <div className='flex shrink-0 items-center justify-between border-b border-white/5 px-5 py-3'>
      <div className='flex items-center gap-2'>
        <span className='text-sm font-bold tracking-wide'>Comments</span>

        {totalComments > 0 && (
          <span
            aria-label={`${totalComments} comments active`}
            className='rounded-full px-2 py-0.5 text-[10px] font-bold text-primary-400'
          >
            {totalComments}
          </span>
        )}
      </div>

      {onClose && (
        <button
          type='button'
          aria-label='Dismiss comments sheet'
          onClick={onClose}
          className='flex size-7 items-center justify-center rounded-full bg-white/5 text-neutral-500 transition hover:text-white'
        >
          <IoCloseOutline className='size-4' aria-hidden='true' />
        </button>
      )}
    </div>
  );
}
