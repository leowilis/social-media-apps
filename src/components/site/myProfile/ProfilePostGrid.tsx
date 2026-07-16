'use client';

import type { Post } from '@/types/post';
import GridItem from './GridItem';

interface ProfilePostGridProps {
  posts: Post[];
  isSaved: boolean;
  onPostClick?: (postId: number) => void;
}

export default function ProfilePostGrid({
  posts,
  isSaved,
  onPostClick,
}: ProfilePostGridProps) {
  return (
    <div className='grid grid-cols-3 gap-0.5'>
      {posts.map((post) => (
        <GridItem
          key={post.id}
          post={post}
          isSaved={isSaved}
          onPostClick={onPostClick}
        />
      ))}
    </div>
  );
}
