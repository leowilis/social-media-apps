'use client';

import Link from 'next/link';
import { IoCloseOutline, IoSearchOutline } from 'react-icons/io5';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SearchResultsSkeleton } from '@/components/ui/skeletons';
import EmptyState from '@/components/common/EmptyState';

interface SearchUser {
  id: number;
  username: string;
  name: string;
  avatarUrl?: string;
}

interface SearchBarProps {
  query: string;
  users: SearchUser[];
  loading: boolean;
  showResults: boolean;
  onQueryChange: (value: string) => void;
  onFocus: () => void;
  onClear: () => void;
  onSelectUser: () => void;
}

export default function SearchBar({
  query,
  users,
  loading,
  showResults,
  onQueryChange,
  onFocus,
  onClear,
  onSelectUser,
}: SearchBarProps) {
  return (
    <div className='relative mx-8 w-full max-w-[490px]'>
      <div
        className={cn(
          'flex h-12 items-center gap-2 rounded-full bg-neutral-950 px-4 transition-colors',
          showResults && query
            ? 'border border-primary-400/40'
            : 'border border-neutral-800',
        )}
      >
        <IoSearchOutline className='size-[18px] shrink-0 text-neutral-500' />
        <input
          type='text'
          role='searchbox'
          value={query}
          onFocus={onFocus}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClear();
          }}
          placeholder='Search users...'
          className='flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none'
        />

        {query && (
          <button
            type='button'
            aria-label='Clear search'
            onClick={onClear}
            className='rounded-full p-1 transition-colors hover:bg-white/10'
          >
            <IoCloseOutline className='size-4 text-neutral-500' />
          </button>
        )}
      </div>

      {showResults && (
        <>
          <div
            aria-hidden='true'
            className='fixed inset-0 z-30'
            onClick={onClear}
          />
          <div className='absolute left-0 right-0 top-14 z-40 overflow-hidden rounded-2xl border border-white/10 bg-black/95 shadow-2xl'>
            {loading ? (
              <SearchResultsSkeleton count={4} />
            ) : users.length === 0 ? (
              <EmptyState
                title='No results found'
                description='Try another keyword'
              />
            ) : (
              <div className='max-h-80 space-y-0.5 overflow-y-auto px-2 py-2'>
                {users.map((user) => (
                  <Link
                    key={user.id}
                    href={`/profile/${user.username}`}
                    onClick={onSelectUser}
                    className='flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5'
                  >
                    <Avatar className='size-9 shrink-0 border border-primary-400/20'>
                      <AvatarImage src={user.avatarUrl ?? ''} alt={user.name} />
                      <AvatarFallback className='bg-black text-sm font-bold text-primary-400'>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className='min-w-0'>
                      <p className='truncate text-sm font-bold text-white'>
                        {user.name}
                      </p>

                      <p className='truncate text-xs text-neutral-500'>
                        @{user.username}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
