'use client';

import type { Post } from '@/types/post';

import { usePostCard } from '@/hooks/post/usePostCard';

import { PostActionsBar } from './PostActionBar';
import PostHeader from './PostHeader';
import PostImage from './PostImage';
import PostCaption from './PostCaption';
import PostDialogs from './PostDialog';

interface PostCardProps {
  post: Post;
  currentUserId?: number;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const {
    liked,
    saved,
    commentCount,
    showFull,
    showComments,
    showLikes,
    deleteTarget,
    isPendingLike,
    isPendingSave,
    handleLike,
    handleSave,
    handleCommentClick,
    handleDeleteConfirm,
    toggleCaption,
    openLikes,
    closeLikes,
    closeComments,
    cancelDelete,
    incrementComment,
    decrementComment,
    requestDeleteComment,
  } = usePostCard(post);

  return (
    <>
      <article className='flex w-full flex-col'>
        {/* Post Owner Meta Header Cell */}
        <PostHeader author={post.author} createdAt={post.createdAt} />

        {/* Responsive Multi-Device Media Viewport */}
        <PostImage post={post} liked={liked} saved={saved} />

        {/* Interactive Social Engagement Actions */}
        <PostActionsBar
          liked={liked}
          saved={saved}
          likeCount={post.likeCount}
          commentCount={commentCount}
          isPendingLike={isPendingLike}
          isPendingSave={isPendingSave}
          onLike={handleLike}
          onSave={handleSave}
          onLikeCountClick={openLikes}
          onCommentClick={handleCommentClick}
        />

        {/* Caption */}
        <PostCaption
          authorName={post.author.name}
          caption={post.caption ?? ''}
          showFull={showFull}
          onToggle={toggleCaption}
        />

        <div className='h-px w-full bg-white/10' aria-hidden='true' />
      </article>

      <PostDialogs
        postId={post.id}
        likeCount={post.likeCount}
        currentUserId={currentUserId}
        showLikes={showLikes}
        showComments={showComments}
        deleteTarget={deleteTarget}
        onCloseLikes={closeLikes}
        onCloseComments={closeComments}
        onDeleteCancel={cancelDelete}
        onDeleteConfirm={handleDeleteConfirm}
        onCommentAdded={incrementComment}
        onCommentDeleted={decrementComment}
        onDeleteRequest={requestDeleteComment}
      />
    </>
  );
}
