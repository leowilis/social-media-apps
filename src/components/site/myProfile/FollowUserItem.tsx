'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FollowUserItemProps {
  user: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
}

export default function FollowUserItem({ user }: FollowUserItemProps) {
  return (
    <div
      role='listitem'
      className='flex items-center gap-3 border-b border-white/5 px-5 py-3 last:border-b-0'
    >
      <Avatar className='size-11 shrink-0 border border-primary-400/20'>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className='text-sm font-bold'>
          {user.name?.charAt(0).toUpperCase() ?? '?'}
        </AvatarFallback>
      </Avatar>

      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-semibold text-white'>{user.name}</p>

        <p className='truncate text-xs text-neutral-500'>@{user.username}</p>
      </div>
    </div>
  );
}
