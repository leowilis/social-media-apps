'use client';

import { useEffect, useRef, useState } from 'react';

import { useComments, useAddComment, useDeleteComment } from './useComments';
import { useMe } from '@/hooks/profile/useMe';

import type { Comment } from '@/lib/api/comment';

interface UseCommentSectionProps {
  postId: number;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
  onDeleteRequest?: (id: number) => void;
}

export function useCommentSection({
  postId,
  onCommentAdded,
  onCommentDeleted,
  onDeleteRequest,
}: UseCommentSectionProps) {
  const { me } = useMe();

  const commentsQuery = useComments(postId);
  const addMutation = useAddComment(postId, me as Comment['author']);
  const deleteMutation = useDeleteComment(postId);

  const comments = commentsQuery.data?.pages.flatMap((page) => page.comments) ?? [];
  const inputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const id = (event as CustomEvent<number>).detail;

      deleteMutation.mutate(id);
      onCommentDeleted?.();
    };

    window.addEventListener('confirm-delete-comment', handler);

    return () => {
      window.removeEventListener('confirm-delete-comment', handler);
    };
  }, [deleteMutation, onCommentDeleted]);

  const insertEmoji = (emoji: string) => {
    const input = inputRef.current;

    if (!input) {
      setText((prev) => prev + emoji);
      return;
    }

    const start = input.selectionStart ?? text.length;
    const end = input.selectionEnd ?? text.length;

    const value = text.slice(0, start) + emoji + text.slice(end);
    setText(value);

    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  const handleSend = () => {
    const value = text.trim();
    if (!value) return;
    addMutation.mutate(value);
    setText('');
    setShowEmoji(false);

    onCommentAdded?.();
  };

  const handleDelete = (id: number) => {
    if (onDeleteRequest) {
      onDeleteRequest(id);
      return;
    }

    deleteMutation.mutate(id);
    onCommentDeleted?.();
  };

  return {
    comments,
    isLoading: commentsQuery.isLoading,
    hasMore: commentsQuery.hasNextPage ?? false,
    isSending: addMutation.isPending,
    fetchNextPage: commentsQuery.fetchNextPage,
    text,
    setText,
    showEmoji,
    setShowEmoji,
    inputRef,
    insertEmoji,
    handleSend,
    handleDelete,
  };
}
