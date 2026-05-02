'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSearch } from '@/hooks/search/useSearch';
import type { UserProfile } from '@/types/user';
// Types

interface SearchOverlayProps {
  onClose: () => void;
}

// Sub-components

function SearchEmpty() {
  return (
    <div className='flex flex-col items-center justify-center py-24 gap-2'>
      <div
        className='flex items-center justify-center size-16 rounded-2xl mb-2'
        style={{
          background: 'rgba(124,92,252,0.08)',
          border: '1px solid rgba(124,92,252,0.15)',
        }}
      >
        <IoSearchOutline className='size-7 text-[#7c5cfc]' />
      </div>
      <p className='text-sm font-semibold text-neutral-500'>Find people</p>
      <p className='text-xs text-neutral-600'>Search by name or username</p>
    </div>
  );
}

function SearchNoResults() {
  return (
    <div className='flex flex-col items-center justify-center py-24 gap-2'>
      <div
        className='flex items-center justify-center size-16 rounded-2xl mb-2'
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <IoSearchOutline className='size-7 text-neutral-600' />
      </div>
      <p className='text-sm font-bold text-neutral-300'>No results found</p>
      <p className='text-xs text-neutral-600'>Change your keyword</p>
    </div>
  );
}

function SearchLoading() {
  return (
    <div className='flex items-center justify-center gap-3 py-16'>
      <div className='size-5 rounded-full border-2 border-[#7c5cfc] border-t-transparent animate-spin' />
      <span className='text-xs text-neutral-600'>Searching...</span>
    </div>
  );
}

function UserResultItem({
  user,
  index,
  onClose,
}: {
  user: UserProfile;
  index: number;
  onClose: () => void;
}) {
  return (
    <Link
      href={`/profile/${user.username}`}
      onClick={onClose}
      className='search-item flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors hover:bg-white/[0.04] active:scale-[0.98]'
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <Avatar
        className='size-11 shrink-0'
        style={{ border: '1.5px solid rgba(124,92,252,0.2)' }}
      >
        <AvatarImage src={user.avatarUrl ?? ''} alt={user.name} />
        <AvatarFallback
          className='text-sm font-bold'
          style={{ background: '#1a1a2e', color: '#a78bff' }}
        >
          {user.name[0]}
        </AvatarFallback>
      </Avatar>

      <div className='flex-1 min-w-0'>
        <p className='text-sm font-bold text-white truncate'>{user.name}</p>
        <p className='text-xs text-neutral-500 truncate'>@{user.username}</p>
      </div>

      {user.isFollowing && (
        <span
          className='shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full'
          style={{
            background: 'rgba(124,92,252,0.15)',
            color: '#a78bff',
            border: '1px solid rgba(124,92,252,0.2)',
          }}
        >
          Following
        </span>
      )}
    </Link>
  );
}

// Main Component

/**
 * Full-screen search overlay.
 *
 * Sits just below the navbar (top-16 mobile / top-[81px] desktop).
 * Search logic is handled by `useSearch` — this component is UI-only.
 */
export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const { query, users, isLoading, searched, handleChange, clearQuery } =
    useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(timer);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleClear = () => {
    clearQuery();
    inputRef.current?.focus();
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes itemFadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .search-panel { animation: slideDown 0.2s ease forwards; }
        .search-item  { animation: itemFadeIn 0.18s ease forwards; }
      `}</style>

      <div
        className='search-panel fixed inset-x-0 top-16 md:top-[81px] bottom-0 z-[55] flex flex-col'
        style={{ background: '#08080f' }}
      >
        {/* Search bar */}
        <div
          className='flex items-center gap-3 px-4 py-3'
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className='flex flex-1 items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-colors duration-200'
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${query ? 'rgba(124,92,252,0.45)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <IoSearchOutline
              className='size-[18px] shrink-0 transition-colors duration-200'
              style={{ color: query ? '#a78bff' : 'rgba(255,255,255,0.3)' }}
            />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              placeholder='Search name or username...'
              className='flex-1 bg-transparent text-sm text-white placeholder:text-neutral-600 outline-none'
            />
            {query && (
              <button
                onClick={handleClear}
                className='shrink-0 flex items-center justify-center size-5 rounded-full'
                style={{ background: 'rgba(255,255,255,0.12)' }}
                aria-label='Clear search'
              >
                <IoCloseOutline className='size-3.5 text-neutral-400' />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className='shrink-0 flex items-center justify-center size-9 rounded-full text-neutral-400 hover:text-white transition-colors'
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            aria-label='Close search'
          >
            <IoCloseOutline className='size-5' />
          </button>
        </div>

        {/* Results */}
        <div className='flex-1 overflow-y-auto px-4 py-3'>
          {isLoading ? (
            <SearchLoading />
          ) : searched && users.length === 0 ? (
            <SearchNoResults />
          ) : !searched ? (
            <SearchEmpty />
          ) : (
            <div className='space-y-1'>
              {users.map((user, i) => (
                <UserResultItem
                  key={user.id}
                  user={user}
                  index={i}
                  onClose={onClose}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
