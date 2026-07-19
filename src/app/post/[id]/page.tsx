'use client';

import { useParams } from 'next/navigation';

import { useAppSelector } from '@/store/hooks';
import { PostDetail } from '@/components/site/post/detail/PostDetail';
import ErrorState from '@/components/common/ErrorState';

/**
 * Post detail page.
 *
 * Renders the PostDetail component using the post ID from the route.
 * The post data itself is fetched inside PostDetail.
 */
export default function PostPage() {
  const { id } = useParams<{ id: string }>();

  const currentUser = useAppSelector((state) => state.auth.user);

  const postId = Number(id);

  if (!Number.isFinite(postId) || postId <= 0) {
    return (
      <ErrorState
        title='Invalid post'
        description='The requested post could not be found.'
      />
    );
  }

  return <PostDetail postId={postId} currentUserId={currentUser?.id} />;
}
