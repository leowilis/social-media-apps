'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserProfile } from '@/types/user';
import { cn, getFollowButtonClass } from '@/lib/utils';

interface SearchUserCardProps {
  user: UserProfile;
  onSelectUser?: () => void;
  onToggleFollow: (
    e: React.MouseEvent,
    username: string,
    isFollowing: boolean,
  ) => void;
}

export default function SearchUserCard({
  user,
  onSelectUser,
  onToggleFollow,
}: SearchUserCardProps) {
  return (
    <Link
      href={`/profile/${user.username}`}
      onClick={onSelectUser}
      role='option'
      aria-selected='false'
      className='animate-search-item flex items-center gap-3 rounded-2xl px-3 py-3 animate-search-item transition-colors hover:bg-white/[0.04] active:scale-[0.98]'
    >
      {/* User Photo Avatar Element */}
      <Avatar className='size-11 shrink-0 avatar-border border-primary-400/20 shadow-xs'>
        <AvatarImage src={user.avatarUrl ?? ''} alt={user.name} />
        <AvatarFallback className='text-sm font-bold bg-black text-primary-400 select-none'>
          {user.name ? user.name[0].toUpperCase() : '?'}
        </AvatarFallback>
      </Avatar>
      {/* Account Info */}
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-bold text-white'>{user.name}</p>
        <p className='truncate text-xs text-neutral-500'>@{user.username}</p>
      </div>

      {/* Follow / Unfollow Transaction Trigger Action button */}
      {onToggleFollow && (
        <button
          type='button'
          onClick={(e) => onToggleFollow(e, user.username, !!user.isFollowing)}
          className={cn(
            'shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all',
            getFollowButtonClass(!!user.isFollowing),
          )}
        >
          {user.isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </Link>
  );
}
