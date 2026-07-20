'use client';

import Link from 'next/link';
import { IoPaperPlaneOutline } from 'react-icons/io5';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  mode: 'self' | 'other';
  name: string;
  username: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

export default function ProfileHeader({
  mode,
  name,
  username,
  avatarUrl,
  bio,
}: ProfileHeaderProps) {
  return (
    <div className='flex flex-col gap-5 px-2 pt-4 pb-2 select-none'>
      <div className='flex items-center gap-3'>
        <Avatar className='size-20 border border-white/5 md:size-24 shrink-0 shadow-xs'>
          <AvatarImage
            src={avatarUrl ?? ''}
            alt={`${name} avatar`}
            className='object-cover'
          />

          <AvatarFallback className='text-2xl font-bold md:text-5xl'>
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className='flex flex-col md:m-2'>
          <span className='truncate text-lg font-extrabold md:mb-2 md:text-2xl'>
            {name}
          </span>

          <span className='text-sm md:text-base'>@{username}</span>
        </div>

        {mode === 'self' && (
          <div className='ml-auto hidden items-center gap-2 md:flex'>
            <Link href='/editprofile' passHref>
              <Button className='h-9.5 rounded-full border border-neutral-800 bg-neutral-950 px-10 text-xs font-bold text-white transition-colors hover:bg-neutral-900 cursor-pointer shadow-xs'>
                Edit Profile
              </Button>
            </Link>

            <Button
              variant='ghost'
              size='icon'
              aria-label='Share profile credentials'
              className='size-9 rounded-full border border-neutral-900 text-white'
            >
              <IoPaperPlaneOutline className='size-4.5' aria-hidden='true' />
            </Button>
          </div>
        )}
      </div>

      {mode === 'self' && (
        <div className='flex items-center gap-4 px-3 md:hidden'>
          <Link href='/editprofile' className='flex-1'>
            <Button className='h-9 w-full rounded-full border border-neutral-900 bg-neutral-950 text-sm font-semibold text-white'>
              Edit Profile
            </Button>
          </Link>

          <Button
            variant='ghost'
            size='icon'
            aria-label='Share profile credentials'
            className='size-9 rounded-full border border-neutral-900 text-white'
          >
            <IoPaperPlaneOutline className='size-4' aria-hidden='true' />
          </Button>
        </div>
      )}

      {bio && (
        <p className='overflow-hidden px-2 text-sm tracking-normal text-neutral-300'>
          {bio}
        </p>
      )}
    </div>
  );
}
