'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoSend } from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface UserProfileActionsProps {
  isMe: boolean;
  username: string;
  isFollowing: boolean;
  isPending: boolean;
  onFollow: () => void;
}

export default function UserProfileActions({
  isMe,
  username,
  isFollowing,
  isPending,
  onFollow,
}: UserProfileActionsProps) {
  const router = useRouter();

  if (isMe) {
    return (
      <Link href='/editprofile'>
        <Button
          variant='ghost'
          className='mt-2 h-9 rounded-full border border-neutral-700 px-6 text-sm font-bold text-neutral-300 hover:bg-white/5 md:mt-5'
        >
          Edit Profile
        </Button>
      </Link>
    );
  }

  return (
    <div className='mt-2 flex items-center gap-2 md:mt-5 select-none'>
      <Button
        onClick={onFollow}
        disabled={isPending}
        variant={isFollowing ? 'ghost' : 'default'}
        className={`h-9 flex-1 rounded-full px-6 text-sm font-bold ${
          isFollowing
            ? 'border border-neutral-700 bg-transparent text-neutral-300 hover:bg-white/5'
            : ''
        }`}
      >
        {isPending ? (
          <Spinner size='size-3.5' />
        ) : isFollowing ? (
          'Following'
        ) : (
          'Follow'
        )}
      </Button>

      <Button
        type='button'
        variant='ghost'
        aria-label='Send message'
        className='size-9 rounded-full border border-neutral-700 p-0 text-neutral-300 hover:bg-white/5'
        onClick={() => router.push(`/messages/${username}`)}
      >
        <IoSend
          className='mb-0.5 ml-0.5 size-4 -rotate-45'
          aria-hidden='true'
        />
      </Button>
    </div>
  );
}
