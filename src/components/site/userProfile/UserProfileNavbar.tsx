'use client';

import { useRouter } from 'next/navigation';
import { IoArrowBackOutline } from 'react-icons/io5';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProfileNavbarProps {
  username: string;
  avatarUrl?: string | null;
  name: string;
}

export default function UserProfileNavbar({
  username,
  avatarUrl,
  name,
}: UserProfileNavbarProps) {
  const router = useRouter();

  return (
    <header className='flex items-center justify-between border-b border-white/5 px-4 py-3 md:hidden'>
      <div className='flex items-center gap-3'>
        <button
          type='button'
          aria-label='Navigate back'
          onClick={() => router.back()}
          className='transition-colors hover:text-primary-300'
        >
          <IoArrowBackOutline className='size-5' aria-hidden='true' />
        </button>
        <h1 className='font-bold tracking-tight text-white text-sm truncate max-w-[180px]'>
          {username}
        </h1>
      </div>

      <div className='shrink-0 shadow-sm'>
        <Avatar className='size-9 border border-white/5'>
          <AvatarImage
            src={avatarUrl ?? ''}
            alt={`${name}'s profile picture`}
            className='object-cover'
          />
          <AvatarFallback className='bg-neutral-900 text-xs font-black text-primary-400 select-none'>
            {name ? name.charAt(0).toUpperCase() : '?'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
