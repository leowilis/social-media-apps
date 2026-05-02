'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PostListDynamic } from '@/components/site/post/ui/PostListDynamic';
import { PostDetail } from '@/components/site/post/ui/PostDetail';
import { useMe } from '@/hooks/profile/useMe';

function HomeContent() {
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId');
  const { me } = useMe();

  return (
    <>
      <PostListDynamic />
      {postId && (
        <PostDetail
          postId={Number(postId)}
          currentUserId={me?.id}
        />
      )}
    </>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}