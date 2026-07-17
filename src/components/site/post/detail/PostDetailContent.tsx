'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { LikesSheet } from '@/components/features/likes/LikesSheet';
import { DeleteDialog } from '@/components/site/post/ui/DeleteDialog';
import { PostActionsBar } from '@/components/site/post/ui/PostActionBar';
import { PostToast } from '@/components/site/post/ui/PostToast';

import { usePostActions } from '@/hooks/post/usePostActions';

import type { Post } from '@/types/post';

import { PostDetailDesktop } from './PostDetailDesktop';
import { PostDetailMobile } from './PostDetailMobile';

interface PostDetailContentProps {
  post: Post;
  postId: number;
  currentUserId?: number;
  onClose?: () => void;
}

/**
 * Coordinates post interactions and shared dialog state
 * for both mobile and desktop post detail layouts.
 */
export function PostDetailContent({
  post,
  postId,
  currentUserId,
  onClose,
}: PostDetailContentProps) {
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
    initialLikeCount: post.likeCount,
  });

  const [showLikes, setShowLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showDeletePost, setShowDeletePost] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const [commentCount, setCommentCount] = useState(0);

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    router.back();
  };

  const isOwner =
    currentUserId !== undefined && currentUserId === post.author.id;

  const actionsBar = (
    <PostActionsBar
      liked={liked}
      saved={saved}
      likeCount={likeCount}
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
          description='This action cannot be undone.'
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
          description='This post will be permanently removed.'
          loading={isDeletingPost}
          onConfirm={handleDeletePost}
          onCancel={() => setShowDeletePost(false)}
        />
      )}

      <PostDetailMobile
        post={post}
        postId={postId}
        currentUserId={currentUserId}
        isOwner={isOwner}
        actionsBar={actionsBar}
        showComments={showComments}
        setShowComments={setShowComments}
        onClose={handleClose}
        onDeletePost={() => setShowDeletePost(true)}
        onDeleteComment={setDeleteCommentId}
        onCommentAdded={() => setCommentCount((count) => count + 1)}
        onCommentDeleted={() =>
          setCommentCount((count) => Math.max(0, count - 1))
        }
      />

      <PostDetailDesktop
        post={post}
        postId={postId}
        currentUserId={currentUserId}
        isOwner={isOwner}
        actionsBar={actionsBar}
        onClose={handleClose}
        onDeletePost={() => setShowDeletePost(true)}
        onDeleteComment={setDeleteCommentId}
        onCommentAdded={() => setCommentCount((count) => count + 1)}
        onCommentDeleted={() =>
          setCommentCount((count) => Math.max(0, count - 1))
        }
      />
    </>
  );
}
