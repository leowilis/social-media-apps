'use client';

import Link from 'next/link';
import dayjs from '@/lib/dayjs';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import type { Post } from '@/types/post';

interface PostAuthorHeaderProps {
  post: Post;
}

export default function PostAuthorHeader({ post }: PostAuthorHeaderProps) {
  return (
    <div className='flex items-center gap-3 md:mb-2'>
      <Link
        href={`/profile/${post.author.username}`}
        aria-label={`View ${post.author.name} profile page directory`}
        className='shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black'
      >
        <Avatar className='size-10 border border-white/10 md:size-13'>
          <AvatarImage
            src={post.author.avatarUrl ?? ''}
            alt={post.author.name}
            className='object-cover'
          />
          <AvatarFallback>
            {post.author.name ? post.author.name.charAt(0).toUpperCase() : '?'}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className='flex flex-col md:gap-1'>
        <Link
          href={`/profile/${post.author.username}`}
          className='outline-none rounded-sm focus-visible:ring-1 focus-visible:ring-primary-400/50 hover:underline'
        >
          <span className='text-sm font-bold text-white'>
            {post.author.name}
          </span>
        </Link>

        <span
          className='text-xs text-neutral-400'
          title={dayjs(post.createdAt).format('DD MMM YYYY • HH:mm')}
        >
          {dayjs(post.createdAt).fromNow()}
        </span>
      </div>
    </div>
  );
}
