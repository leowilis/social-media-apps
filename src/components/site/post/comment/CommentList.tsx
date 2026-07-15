'use client';

import CommentItem from './CommentItem';

import type { Comment } from '@/lib/api/comment';

interface CommentListProps {
  comments: Comment[];
  currentUserId?: number;
  isLoading: boolean;
  hasMore?: boolean;
  onDelete: (id: number) => void;
  onLoadMore: () => void;
}

export default function CommentList({
  comments,
  currentUserId,
  isLoading,
  hasMore,
  onDelete,
  onLoadMore,
}: CommentListProps) {
  if (isLoading && comments.length === 0) {
    return (
      <div
        role='status'
        aria-label='Loading discussion timeline comments'
        className='flex flex-1 flex-col items-center justify-center gap-3 py-16 select-none'
      >
        <div className='size-8 animate-spin rounded-full border-2 border-primary-400 border-t-transparent' />
        <p className='text-xs text-neutral-600'>Loading comments...</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className='flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center select-none'>
        <div aria-hidden='true' className='text-3xl'>
          💬
        </div>

        <p className='text-sm font-semibold text-neutral-300'>
          No comments yet
        </p>

        <p className='text-xs text-neutral-600'>
          Be the first to say something.
        </p>
      </div>
    );
  }

  return (
    <div
      role='feed'
      aria-label='User comments stream'
      className='flex-1 overflow-y-auto px-4 py-2 no-scrollbar'
    >
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onDelete={onDelete}
        />
      ))}

      {hasMore && (
        <button
          type='button'
          aria-label='Load previous historical comments text lines'
          onClick={onLoadMore}
          className='w-full py-2 text-xs text-primary-400 hover:underline'
        >
          Load more comments
        </button>
      )}
    </div>
  );
}
