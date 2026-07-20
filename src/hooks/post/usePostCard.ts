'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSavePost } from './useSavePost';
import { useToggleLike } from '@/hooks/post/useLike';
import { useAppSelector } from '@/store/hooks';
import type { Post } from '@/types/post';

export function usePostCard(post: Post) {
  const router = useRouter();

  const toggleLike = useToggleLike(post.id);

  const { saved, handleSave, isPendingSave } = useSavePost({
    postId: post.id,
  });

  const liked = useAppSelector((state) =>
    state.likes.likedPostIds.includes(post.id),
  );

  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [showFull, setShowFull] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const handleLike = () => {
    if (toggleLike.isPending) return;

    toggleLike.mutate(liked);
  };

  const openDesktopPost = () => {
    router.push(
      `?postId=${post.id}&liked=${liked}&likeCount=${post.likeCount}&saved=${saved}`,
      {
        scroll: false,
      },
    );
  };

  const handleCommentClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      openDesktopPost();
      return;
    }

    setShowComments(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget == null) return;

    window.dispatchEvent(
      new CustomEvent('confirm-delete-comment', {
        detail: deleteTarget,
      }),
    );

    setDeleteTarget(null);
  };

  const toggleCaption = () => {
    setShowFull((prev) => !prev);
  };

  const incrementComment = () => {
    setCommentCount((prev) => prev + 1);
  };

  const decrementComment = () => {
    setCommentCount((prev) => Math.max(0, prev - 1));
  };

  const requestDeleteComment = (id: number) => {
    setDeleteTarget(id);
  };

  const openLikes = () => {
    setShowLikes(true);
  };

  const closeLikes = () => {
    setShowLikes(false);
  };

  const openComments = () => {
    setShowComments(true);
  };

  const closeComments = () => {
    setShowComments(false);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  return {
    // state
    liked,
    saved,
    commentCount,
    showFull,
    showComments,
    showLikes,
    deleteTarget,

    // loading
    isPendingLike: toggleLike.isPending,
    isPendingSave,

    // handlers
    handleLike,
    handleSave,
    handleCommentClick,
    handleDeleteConfirm,
    toggleCaption,

    // likes
    openLikes,
    closeLikes,

    // comments
    openComments,
    closeComments,
    incrementComment,
    decrementComment,
    requestDeleteComment,

    // delete
    cancelDelete,
  };
}
