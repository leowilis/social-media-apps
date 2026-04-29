'use client';

import { useEffect, useRef } from 'react';
import { usePosts } from '@/hooks/post/usePosts';
import { PostCard } from './PostCard';
import { useMe } from '@/hooks/header/useMe';

export function PostList() {
  const { posts, isLoading, isError, hasMore, loadMore } = usePosts();
  const { me } = useMe();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 1 },
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  if (isError) {
    return (
      <div className='flex items-center justify-center py-20 text-[var(--neutral-500)] text-sm'>
        Failed to load posts.
      </div>
    );
  }

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
        <p className='text-center text-xs text-[var(--neutral-500)] py-6'>
          No more posts
        </p>
      )}
    </div>
  );
}
