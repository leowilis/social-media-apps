'use client';

import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import PostAuthorHeader from '../ui/PostAuthorHeader';
import CommentSection from '../comment/CommentSection';
import { PostMenuButton } from '@/components/site/post/ui/PostMenuButton';
import type { Post } from '@/types/post';

interface PostDetailMobileProps {
  post: Post;
  postId: number;
  currentUserId?: number;
  isOwner: boolean;
  actionsBar: React.ReactNode;
  showComments: boolean;
  setShowComments: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  onDeletePost: () => void;
  onDeleteComment: (id: number) => void;
  onCommentAdded: () => void;
  onCommentDeleted: () => void;
}

export function PostDetailMobile({
  post,
  postId,
  currentUserId,
  isOwner,
  actionsBar,
  showComments,
  setShowComments,
  onClose,
  onDeletePost,
  onDeleteComment,
  onCommentAdded,
  onCommentDeleted,
}: PostDetailMobileProps) {
  return (
    <div className='fixed inset-0 z-50 flex flex-col bg-black overflow-y-auto select-none md:hidden'>
      {/* Header */}
      <header className='flex items-center justify-between px-4 py-4'>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            aria-label='Navigate back'
            onClick={onClose}
            className='text-white'
          >
            <IoArrowBack className='size-5' aria-hidden='true' />
          </button>
          <h2 className='text-base font-bold'>Post</h2>
        </div>

        {isOwner && <PostMenuButton size='md' onDeleteClick={onDeletePost} />}
      </header>

      {/* Author */}
      <div className='px-4 pb-3'>
        <PostAuthorHeader post={post} />
      </div>

      {/* Image */}
      <div className='relative aspect-square w-full overflow-hidden'>
        <Image
          src={post.imageUrl}
          alt={post.caption || `${post.author.name}'s post`}
          fill
          className='object-cover'
          sizes='100vw'
        />
      </div>

      <div className='w-full shrink-0'>{actionsBar}</div>

      {/* Caption */}
      <section className='px-4 py-3'>
        <span className='mr-2 text-sm font-bold text-white'>
          {post.author.name}
        </span>
        <span className='text-sm text-neutral-200'>{post.caption}</span>
      </section>

      {/* Fake Input */}
      <button
        type='button'
        aria-haspopup='dialog'
        aria-label='Open interactive post'
        onClick={() => setShowComments(true)}
        className='mx-4 mb-28 rounded-2xl px-4 py-4 text-left text-sm text-neutral-500 font-medium bg-white/[0.04] border border-white/[0.06] transition-all hover:bg-white/[0.06] active:scale-[0.995] outline-none focus-visible:ring-1 focus-visible:ring-primary-400 cursor-pointer'
      >
        Add a comment...
      </button>

      {showComments && (
        <CommentSection
          postId={postId}
          currentUserId={currentUserId}
          onClose={() => setShowComments(false)}
          onCommentAdded={onCommentAdded}
          onCommentDeleted={onCommentDeleted}
          onDeleteRequest={onDeleteComment}
        />
      )}
    </div>
  );
}
