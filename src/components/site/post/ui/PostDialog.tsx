'use client';

import CommentSection from '../comment/CommentSection';
import { DeleteDialog } from './DeleteDialog';
import { LikesSheet } from '@/components/features/likes/LikesSheet';

interface PostDialogsProps {
  postId: number;
  likeCount: number;
  currentUserId?: number;
  showLikes: boolean;
  showComments: boolean;
  deleteTarget: number | null;
  onCloseLikes: () => void;
  onCloseComments: () => void;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  onCommentAdded: () => void;
  onCommentDeleted: () => void;
  onDeleteRequest: (id: number) => void;
}

export default function PostDialogs({
  postId,
  likeCount,
  currentUserId,
  showLikes,
  showComments,
  deleteTarget,
  onCloseLikes,
  onCloseComments,
  onDeleteCancel,
  onDeleteConfirm,
  onCommentAdded,
  onCommentDeleted,
  onDeleteRequest,
}: PostDialogsProps) {
  return (
    <>
      {deleteTarget !== null && (
        <DeleteDialog
          title='Delete Comment?'
          description='This comment will be permanently removed.'
          onCancel={onDeleteCancel}
          onConfirm={onDeleteConfirm}
        />
      )}

      {showLikes && (
        <LikesSheet
          postId={postId}
          likeCount={likeCount}
          onClose={onCloseLikes}
        />
      )}

      {showComments && (
        <CommentSection
          postId={postId}
          currentUserId={currentUserId}
          onClose={onCloseComments}
          onCommentAdded={onCommentAdded}
          onCommentDeleted={onCommentDeleted}
          onDeleteRequest={onDeleteRequest}
        />
      )}
    </>
  );
}
