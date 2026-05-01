'use client';

import dynamic from 'next/dynamic';
import { PostCardSkeleton } from '@/components/ui/skeletons';

export const PostListDynamic = dynamic(
  () => import('./PostList').then((m) => ({ default: m.PostList })),
  {
    ssr: false,
    loading: () => (
      <div className='flex flex-col md:max-w-[720px] md:mx-auto md:w-full'>
        {[1, 2, 3].map((i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    ),
  }
);