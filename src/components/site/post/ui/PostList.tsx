'use client';

import { useEffect, useRef } from 'react';
import { useExplorePosts } from '@/hooks/post/usePosts';
import { useMe } from '@/hooks/profile/useMe';
import { PostCard } from './PostCard';
import { PostCardSkeleton } from '@/components/ui/skeletons';

// Empty State

function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center py-24 gap-2 text-center'>
      <p className='text-sm font-bold text-neutral-300'>No posts yet</p>
      <p className='text-xs text-neutral-600'>
        Follow someone to see their posts here
      </p>
    </div>
  );
}

// Error State

function ErrorState() {
  return (
    <div className='flex items-center justify-center py-20 text-neutral-500 text-sm'>
      Failed to load posts. Please try again.
    </div>
  );
}

// Component

/**
 * Renders an infinite-scrolling list of posts for the feed.
 * Handles loading, empty, and error states.
 */
export function PostList() {
  const { posts, isLoading, isError, hasMore, loadMore } = useExplorePosts();
  const { me } = useMe();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.5 },
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  if (isError) return <ErrorState />;

  if (isLoading && posts.length === 0) {
    return (
      <div className='flex flex-col md:max-w-[720px] md:mx-auto md:w-full'>
        {[1, 2, 3].map((i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!isLoading && posts.length === 0) return <EmptyState />;

  return (
    <div className='flex flex-col md:max-w-[720px] md:mx-auto md:w-full'>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={me?.id} />
      ))}

      <div ref={bottomRef} className='h-4' />

      {isLoading && (
        <div className='flex justify-center py-6'>
          <div className='size-6 rounded-full border-2 border-[var(--primary-200)] border-t-transparent animate-spin' />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className='text-center text-xs text-neutral-500 py-6'>
          No more posts
        </p>
      )}
    </div>
  );
}
