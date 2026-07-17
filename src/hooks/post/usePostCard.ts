'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useToggleLike } from '@/hooks/post/useLike';
import { useToggleSave, useIsSaved } from '@/hooks/post/useSave';
import { useAppSelector } from '@/store/hooks';

import type { Post } from '@/types/post';

export function usePostCard(post: Post) {
  const router = useRouter();

  const toggleLike = useToggleLike(post.id);
  const toggleSave = useToggleSave(post.id);

  const liked = useAppSelector((state) =>
    state.likes.likedPostIds.includes(post.id),
  );

  const saved = useIsSaved(post.id);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [showFull, setShowFull] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const showNotif = (message: string) => {
    setToastMsg(message);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const handleLike = () => {
    toggleLike.mutate(liked);
  };

  const handleSave = () => {
    toggleSave.mutate(saved, {
      onSuccess: () => showNotif(saved ? 'Removed from saved' : 'Post saved!'),
      onError: () => showNotif('Something went wrong'),
    });
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
    if (window.innerWidth >= 768) {
      openDesktopPost();
      return;
    }

    openComments();
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
    liked,
    saved,
    commentCount,
    showFull,
    showComments,
    showLikes,
    toastMsg,
    showToast,
    deleteTarget,
    toggleLike,
    toggleSave,
    handleLike,
    handleSave,
    handleCommentClick,
    handleDeleteConfirm,
    toggleCaption,
    openLikes,
    closeLikes,
    openComments,
    closeComments,
    cancelDelete,
    incrementComment,
    decrementComment,
    requestDeleteComment,
  };
}
