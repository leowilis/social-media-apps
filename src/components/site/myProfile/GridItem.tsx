'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  IoBookmark,
  IoChatbubbleOutline,
  IoHeart,
  IoHeartOutline,
} from 'react-icons/io5';

import type { Post } from '@/types/post';

interface GridItemProps {
  post: Post;
  isSaved?: boolean;
  onPostClick?: (postId: number) => void;
  priority?: boolean;
}

export default function GridItem({
  post,
  isSaved = false,
  onPostClick,
  priority = false,
}: GridItemProps) {
  const content = (
    <div className='group relative aspect-square overflow-hidden bg-neutral-900'>
      <Image
        src={post.imageUrl}
        alt={post.caption ?? 'Post image'}
        fill
        priority={priority}
        sizes='(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw'
        className='object-cover transition-transform duration-300 group-hover:scale-105'
      />

      <div className='absolute inset-0 flex items-center justify-center gap-5 bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
        <span className='flex items-center gap-1.5 text-sm font-semibold text-white'>
          {post.likedByMe ? (
            <IoHeart className='size-4 text-red-500' />
          ) : (
            <IoHeartOutline className='size-4' />
          )}

          {post.likeCount ?? 0}
        </span>

        <span className='flex items-center gap-1.5 text-sm font-semibold text-white'>
          <IoChatbubbleOutline className='size-4' />
          {post.commentCount ?? 0}
        </span>

        {isSaved && (
          <span className='absolute right-3 top-3 rounded-md bg-black/40 p-1.5'>
            <IoBookmark className='size-3.5 text-primary-400' />
          </span>
        )}
      </div>
    </div>
  );

  if (onPostClick) {
    return (
      <button
        type='button'
        onClick={() => onPostClick(post.id)}
        aria-label='Open post'
        className='block w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black'
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={`/post/${post.id}?liked=${post.likedByMe}&likeCount=${post.likeCount}&saved=${isSaved}`}
      aria-label='View post'
      className='block w-full outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black'
    >
      {content}
    </Link>
  );
}
