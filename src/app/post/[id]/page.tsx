'use client';

import { useParams } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { PostDetail } from '@/components/site/post/ui/PostDetail';

/**
 * Post detail page — renders PostDetail with the current user's ID.
 * All post data (liked, saved, etc.) is fetched inside PostDetail itself.
 */
export default function PostPage() {
  const params = useParams();
  const postId = Number(params.id);
  const currentUser = useAppSelector((s) => s.auth.user);

  return <PostDetail postId={postId} currentUserId={currentUser?.id} />;
}
