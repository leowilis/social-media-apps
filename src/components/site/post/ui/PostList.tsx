'use client';

import { useEffect, useRef } from 'react';
import { useFeed } from '@/hooks/post/useFeed';
import { useMe } from '@/hooks/profile/useMe';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { FeedSkeleton } from '@/components/ui/skeletons';
import { PostCard } from './PostCard';

// Displays the authenticated user's feed with infinite scrolling.
export function PostList() {
  const { posts, isLoading, isError, hasMore, loadMore, isFetchingNextPage } =
    useFeed();

  const { me } = useMe();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = bottomRef.current;

    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isFetchingNextPage) {
          loadMore();
        }
      },
      {
        rootMargin: '120px',
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasMore, isFetchingNextPage, loadMore]);

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title='Failed to load posts'
        description='Please try again later.'
      />
    );
  }

  if (!posts.length) {
    return (
      <EmptyState
        title='Your feed is empty'
        description='Follow other users to start seeing posts here.'
      />
    );
  }

  return (
    <main
      role='feed'
      aria-label='Feed'
      className='flex flex-col md:mx-auto md:w-full md:max-w-[720px]'
    >
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={me?.id} />
      ))}

      <div ref={bottomRef} className='h-4' aria-hidden='true' />

      {isFetchingNextPage && (
        <div
          role='status'
          aria-label='Loading more posts'
          className='flex justify-center py-6'
        >
          <div className='size-5 rounded-full border-2 border-primary-400 border-t-transparent animate-spin' />
        </div>
      )}

      {!hasMore && (
        <p className='py-6 text-center text-xs text-neutral-500'>
          You&apos;re all caught up.
        </p>
      )}
    </main>
  );
}
