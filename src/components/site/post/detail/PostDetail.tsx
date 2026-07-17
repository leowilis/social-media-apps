'use client';

import { usePostDetail } from '@/hooks/post/usePostDetail';

import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';

import { PostDetailContent } from './PostDetailContent';

interface PostDetailProps {
  postId: number;
  currentUserId?: number;
  onClose?: () => void;
}

// Fetches post data before rendering the detail view.
export function PostDetail({
  postId,
  currentUserId,
  onClose,
}: PostDetailProps) {
  const { post, isLoading, isError } = usePostDetail(postId);

  if (isLoading) {
    return <LoadingState text='Loading post...' />;
  }

  if (isError || !post) {
    return (
      <ErrorState
        title='Post not found'
        description='The requested post could not be found.'
      />
    );
  }

  return (
    <PostDetailContent
      post={post}
      postId={postId}
      currentUserId={currentUserId}
      onClose={onClose}
    />
  );
}
