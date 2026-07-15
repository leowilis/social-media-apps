'use client';

import { useCommentSection } from '@/hooks/post/useCommentSection';

import CommentHeader from './CommentHeader';
import CommentList from './CommentList';
import CommentInput from './CommentInput';

interface CommentSectionProps {
  postId: number | string;
  currentUserId?: number;
  onClose?: () => void;
  inline?: boolean;
  hideHeader?: boolean;
  hideInput?: boolean;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
  onDeleteRequest?: (commentId: number) => void;
}

export default function CommentSection({
  postId,
  currentUserId,
  onClose,
  inline = false,
  hideHeader = false,
  hideInput = false,
  onCommentAdded,
  onCommentDeleted,
  onDeleteRequest,
}: CommentSectionProps) {
  const numericPostId = Number(postId);

  const {
    comments,
    isLoading,
    hasMore,
    isSending,
    fetchNextPage,
    text,
    setText,
    showEmoji,
    setShowEmoji,
    inputRef,
    insertEmoji,
    handleSend,
    handleDelete,
  } = useCommentSection({
    postId: numericPostId,
    onCommentAdded,
    onCommentDeleted,
    onDeleteRequest,
  });

  const content = (
    <div className='flex h-full flex-col text-white select-none'>
      {!hideHeader && (
        <CommentHeader totalComments={comments.length} onClose={onClose} />
      )}

      <CommentList
        comments={comments}
        currentUserId={currentUserId}
        isLoading={isLoading}
        hasMore={hasMore}
        onDelete={handleDelete}
        onLoadMore={fetchNextPage}
      />

      {!hideInput && (
        <CommentInput
          text={text}
          isSending={isSending}
          showEmoji={showEmoji}
          inputRef={inputRef}
          onTextChange={setText}
          onToggleEmoji={() => setShowEmoji((prev) => !prev)}
          onInsertEmoji={insertEmoji}
          onSend={handleSend}
        />
      )}
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <>
      <div
        className='fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden'
        onClick={onClose}
        aria-hidden='true'
      />

      <div
        role='dialog'
        aria-modal='true'
        className='fixed bottom-0 left-0 right-0 z-50 h-[72vh] overflow-hidden rounded-t-3xl border-t border-white/5 bg-[#0e0e13] shadow-2xl md:hidden'
      >
        {content}
      </div>

      <div className='hidden h-full w-full md:flex md:flex-col'>{content}</div>
    </>
  );
}
