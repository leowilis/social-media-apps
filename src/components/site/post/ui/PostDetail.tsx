'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoArrowBack, IoCloseOutline } from 'react-icons/io5';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePostDetail } from '@/hooks/post/usePostDetail';
import { usePostActions } from '@/hooks/post/usePostActions';
import { PostToast } from '@/components/site/post/ui/PostToast';
import { DeleteDialog } from '@/components/site/post/ui/DeleteDialog';
import { PostMenuButton } from '@/components/site/post/ui/PostMenuButton';
import { PostActionsBar } from '@/components/site/post/ui/PostActionBar';
import { CommentSection } from '@/components/site/post/ui/CommentSection';
import { LikesSheet } from '@/components/features/likes/LikesSheet';
import type { Post } from '@/types/post';

// Helpers

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 604800)}w ago`;
}

// Sub Components

function PostDetailSkeleton() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-[#0e0e13]'>
      <div className='size-6 rounded-full border-2 border-[#7c5cfc] border-t-transparent animate-spin' />
    </div>
  );
}

function PostDetailError() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-[#0e0e13] text-neutral-400 text-sm'>
      Post not found
    </div>
  );
}

function AuthorHeader({ post }: { post: Post }) {
  return (
    <div className='flex items-center gap-3'>
      <Link href={`/profile/${post.author.username}`}>
        <Avatar className='size-10 border border-[rgba(126,145,183,0.32)]'>
          <AvatarImage
            src={post.author.avatarUrl ?? ''}
            alt={post.author.name}
          />
          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
        </Avatar>
      </Link>
      <div className='flex flex-col'>
        <Link href={`/profile/${post.author.username}`}>
          <span className='text-sm font-bold text-white'>
            {post.author.name}
          </span>
        </Link>
        <span className='text-xs text-neutral-400'>
          {timeAgo(post.createdAt)}
        </span>
      </div>
    </div>
  );
}

// Props

interface PostDetailProps {
  postId: number;
  currentUserId?: number;
  onClose?: () => void;
}

// Inner Component (renders after post data is available)

function PostDetailContent({
  post,
  postId,
  currentUserId,
  onClose,
}: {
  post: Post;
  postId: number;
  currentUserId?: number;
  onClose?: () => void;
}) {
  const router = useRouter();

  const {
    liked,
    likeCount,
    saved,
    toast,
    isPendingLike,
    isPendingSave,
    isDeletingPost,
    handleLike,
    handleSave,
    handleDeletePost,
  } = usePostActions({
    postId,
    initialLiked: Boolean(post.likedByMe),
    initialLikeCount: post.likeCount,
    initialSaved: Boolean(post.savedByMe),
  });

  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showDeletePost, setShowDeletePost] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);

  const handleClose = () => (onClose ? onClose() : router.back());
  const isOwner =
    currentUserId !== undefined && post.author.id === currentUserId;

  const actionsBar = (
    <PostActionsBar
      liked={liked}
      likeCount={likeCount}
      saved={saved}
      commentCount={post.commentCount + commentCount}
      isPendingLike={isPendingLike}
      isPendingSave={isPendingSave}
      onLike={handleLike}
      onSave={handleSave}
      onLikeCountClick={() => setShowLikes(true)}
      onCommentClick={() => setShowComments(true)}
    />
  );

  return (
    <>
      <PostToast message={toast.message} show={toast.show} />

      {showLikes && (
        <LikesSheet
          postId={postId}
          likeCount={likeCount}
          onClose={() => setShowLikes(false)}
        />
      )}

      {deleteCommentId !== null && (
        <DeleteDialog
          title='Delete Comment?'
          description='This comment will be permanently removed.'
          onConfirm={() => {
            window.dispatchEvent(
              new CustomEvent('confirm-delete-comment', {
                detail: deleteCommentId,
              }),
            );
            setDeleteCommentId(null);
          }}
          onCancel={() => setDeleteCommentId(null)}
        />
      )}

      {showDeletePost && (
        <DeleteDialog
          title='Delete Post?'
          description='This post will be permanently removed and cannot be undone.'
          loading={isDeletingPost}
          onConfirm={handleDeletePost}
          onCancel={() => setShowDeletePost(false)}
        />
      )}

      {/* ══ MOBILE ══ */}
      <div className='flex flex-col min-h-screen bg-[#0e0e13] text-white md:hidden'>
        <div className='flex items-center justify-between px-4 py-4'>
          <div className='flex items-center gap-2'>
            <button onClick={handleClose} className='text-white'>
              <IoArrowBack className='size-5' />
            </button>
            <span className='text-base font-bold'>Post</span>
          </div>
          {isOwner && (
            <PostMenuButton
              onDeleteClick={() => setShowDeletePost(true)}
              size='md'
            />
          )}
        </div>

        <div className='px-4 pb-3'>
          <AuthorHeader post={post} />
        </div>

        <div className='relative w-full aspect-square overflow-hidden'>
          <Image
            src={post.imageUrl}
            alt={post.caption || ''}
            fill
            className='object-cover'
            sizes='100vw'
          />
        </div>

        {actionsBar}

        <div className='px-4 py-3'>
          <span className='text-sm font-bold mr-2'>{post.author.name}</span>
          <span className='text-sm text-neutral-200'>{post.caption}</span>
        </div>

        <button
          onClick={() => setShowComments(true)}
          className='mx-4 mb-28 text-left text-sm text-neutral-500 rounded-2xl px-4 py-5'
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          Add a comment...
        </button>

        {showComments && (
          <CommentSection
            postId={postId}
            currentUserId={currentUserId}
            onClose={() => setShowComments(false)}
            onCommentAdded={() => setCommentCount((c) => c + 1)}
            onCommentDeleted={() => setCommentCount((c) => Math.max(0, c - 1))}
            onDeleteRequest={(id) => setDeleteCommentId(id)}
          />
        )}
      </div>

      {/* ══ DESKTOP ══ */}
      <div
        className='hidden md:flex fixed inset-0 z-30 items-center justify-center bg-black/70 backdrop-blur-xl'
        onClick={handleClose}
      >
        <div
          className='flex w-[1100px] max-w-[95vw] h-[700px] max-h-[92vh] rounded-2xl overflow-hidden bg-[#0e0e13] border border-[rgba(255,255,255,0.08)] shadow-2xl'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='relative w-[520px] shrink-0 bg-black'>
            <Image
              src={post.imageUrl}
              alt={post.caption || ''}
              fill
              className='object-cover'
              sizes='100vw'
            />
          </div>

          <div className='flex flex-col flex-1 min-w-0 bg-[#0e0e13]'>
            <div className='flex items-center justify-between px-4 py-3 shrink-0 border-b border-[rgba(255,255,255,0.06)]'>
              <AuthorHeader post={post} />
              <div className='flex items-center gap-1'>
                {isOwner && (
                  <PostMenuButton
                    onDeleteClick={() => setShowDeletePost(true)}
                    size='sm'
                  />
                )}
                <button
                  onClick={handleClose}
                  className='flex items-center justify-center size-8 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-colors'
                >
                  <IoCloseOutline className='size-5' />
                </button>
              </div>
            </div>

            <div className='px-4 py-3 shrink-0'>
              <span className='text-sm font-bold text-white mr-2'>
                {post.author.name}
              </span>
              <span className='text-sm text-neutral-200'>{post.caption}</span>
            </div>

            {actionsBar}

            <div className='flex-1 overflow-hidden'>
              <CommentSection
                postId={postId}
                currentUserId={currentUserId}
                inline
                onCommentAdded={() => setCommentCount((c) => c + 1)}
                onCommentDeleted={() =>
                  setCommentCount((c) => Math.max(0, c - 1))
                }
                onDeleteRequest={(id) => setDeleteCommentId(id)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Main Component

/**
 * Post detail page — fetches post data then renders PostDetailContent.
 * Separating fetch from render ensures usePostActions gets correct initial values.
 */
export function PostDetail({
  postId,
  currentUserId,
  onClose,
}: PostDetailProps) {
  const { post, isLoading, isError } = usePostDetail(postId);

  if (isLoading) return <PostDetailSkeleton />;
  if (isError || !post) return <PostDetailError />;

  return (
    <PostDetailContent
      post={post}
      postId={postId}
      currentUserId={currentUserId}
      onClose={onClose}
    />
  );
}
