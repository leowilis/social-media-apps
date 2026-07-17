'use client';

import Image from 'next/image';
import { IoCloseOutline } from 'react-icons/io5';

import CommentSection from '../comment/CommentSection';
import DesktopCommentInput from '../ui/DesktopCommentInput';
import PostAuthorHeader from '../ui/PostAuthorHeader';

import { PostMenuButton } from '@/components/site/post/ui/PostMenuButton';

import type { Post } from '@/types/post';

interface PostDetailDesktopProps {
  post: Post;
  postId: number;
  currentUserId?: number;
  isOwner: boolean;
  actionsBar: React.ReactNode;
  onClose: () => void;
  onDeletePost: () => void;
  onDeleteComment: (id: number) => void;
  onCommentAdded: () => void;
  onCommentDeleted: () => void;
}

export function PostDetailDesktop({
  post,
  postId,
  currentUserId,
  isOwner,
  actionsBar,
  onClose,
  onDeletePost,
  onDeleteComment,
  onCommentAdded,
  onCommentDeleted,
}: PostDetailDesktopProps) {
  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='desktop-author-header'
      className='fixed inset-0 z-50 hidden items-center justify-center p-8 select-none md:flex'
    >
      <div
        aria-hidden='true'
        onClick={onClose}
        className='absolute inset-0 bg-black/75 backdrop-blur-md'
      />

      <div className='relative z-20 flex h-full max-h-[700px] w-full max-w-[1240px] overflow-hidden rounded-2xl border border-white/10 bg-[#08080f] shadow-2xl'>
        {/* Image */}
        <div className='relative w-[680px] shrink-0 border-r border-white/5 bg-neutral-900 lg:w-[740px]'>
          <Image
            src={post.imageUrl}
            alt={post.caption || `${post.author.name} post`}
            fill
            priority
            sizes='(min-width:1024px) 740px, 680px'
            className='object-cover'
          />
        </div>

        {/* Right Panel */}
        <div className='flex min-w-0 flex-1 flex-col bg-[#0e0e13]'>
          {/* Header */}
          <div className='flex shrink-0 items-center justify-between border-b border-white/5 px-5 py-3.5'>
            <div id='desktop-author-header' className='min-w-0 flex-1'>
              <PostAuthorHeader post={post} />
            </div>

            <div className='ml-4 flex shrink-0 items-center gap-1.5'>
              {isOwner && (
                <PostMenuButton size='sm' onDeleteClick={onDeletePost} />
              )}

              <button
                type='button'
                aria-label='Close post'
                onClick={onClose}
                className='flex size-8 items-center justify-center rounded-full text-neutral-400 transition-all hover:bg-white/5 hover:text-white focus-visible:ring-1 focus-visible:ring-primary-400 active:scale-95'
              >
                <IoCloseOutline className='size-5' aria-hidden='true' />
              </button>
            </div>
          </div>

          {/* Caption */}
          {post.caption && (
            <div className='max-h-24 shrink-0 overflow-y-auto border-b border-white/[0.03] px-6 py-3 text-sm font-medium leading-relaxed text-neutral-200 no-scrollbar'>
              <p className='whitespace-pre-line break-words'>{post.caption}</p>
            </div>
          )}

          {/* Comments */}
          <div className='relative flex-1 overflow-hidden bg-[#08080f]/40'>
            <CommentSection
              inline
              hideHeader
              hideInput
              postId={postId}
              currentUserId={currentUserId}
              onCommentAdded={onCommentAdded}
              onCommentDeleted={onCommentDeleted}
              onDeleteRequest={onDeleteComment}
            />
          </div>

          {/* Actions */}
          <div className='w-full shrink-0 border-t border-white/[0.03] bg-[#0e0e13]'>
            {actionsBar}
          </div>

          {/* Input */}
          <div className='w-full shrink-0'>
            <DesktopCommentInput
              postId={postId}
              onCommentAdded={onCommentAdded}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
