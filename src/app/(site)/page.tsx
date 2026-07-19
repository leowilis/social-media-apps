'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import LoadingState from '@/components/common/LoadingState';
import { PostListDynamic } from '@/components/site/post/ui/PostListDynamic';
import { PostDetail } from '@/components/site/post/detail/PostDetail';
import { useMe } from '@/hooks/profile/useMe';

function HomeContent() {
  const searchParams = useSearchParams();
  const { me } = useMe();

  const postId = Number(searchParams.get('postId'));
  const hasPostDetail = Number.isFinite(postId) && postId > 0;

  return (
    <>
      <PostListDynamic />
      {hasPostDetail && <PostDetail postId={postId} currentUserId={me?.id} />}
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingState text='Loading feed...' />}>
      <HomeContent />
    </Suspense>
  );
}
