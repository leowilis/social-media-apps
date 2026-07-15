'use client';

import Link from 'next/link';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import dayjs from '@/lib/dayjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PostHeaderProps {
  author: {
    id: number;
    username: string;
    name: string;
    avatarUrl?: string | null;
  };
  createdAt: string;
}

export default function PostHeader({ author, createdAt }: PostHeaderProps) {
  const created = dayjs(createdAt);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: author.name,
        url: window.location.href,
      });
    }
  };

  return (
    <div className='flex items-center gap-3 px-4 py-3 select-none'>
      {/* Profile Photo Link Wrapper */}
      <Link
        href={`/profile/${author.username}`}
        aria-label={`View ${author.name} profile page`}
      >
        <Avatar className='size-10 border border-primary-400/20'>
          <AvatarImage src={author.avatarUrl ?? ''} alt={author.name} />
          <AvatarFallback>
            {author.name.trim().charAt(0).toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
      </Link>

      {/* Account Info Details Context */}
      <div className='flex flex-col'>
        <Link href={`/profile/${author.username}`}>
          <span className='text-sm font-bold text-white'>{author.name}</span>
        </Link>

        <span
          title={dayjs(createdAt).format('DD MMM YYYY • HH:mm')}
          className='text-xs text-neutral-400'
        >
          {created.fromNow()}
        </span>
      </div>

      {/* Share feature */}
      <button
        type='button'
        onClick={handleShare}
        aria-label={`Share post by ${author.name}`}
        className='ml-auto text-white transition-opacity hover:opacity-70'
      >
        <IoPaperPlaneOutline className='size-5' />
      </button>
    </div>
  );
}
