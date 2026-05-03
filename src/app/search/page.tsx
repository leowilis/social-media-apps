'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

type SearchUser = {
  id: number;
  username: string;
  name: string;
  avatarUrl?: string;
  isFollowedByMe?: boolean;
};

function UserRowSkeleton() {
  return (
    <div className='flex items-center gap-3 px-3 py-3 animate-pulse'>
      <div className='size-11 rounded-full bg-neutral-800 shrink-0' />
      <div className='flex flex-col gap-1.5 flex-1'>
        <div className='h-3 w-28 rounded bg-neutral-800' />
        <div className='h-2.5 w-20 rounded bg-neutral-800' />
      </div>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
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
      <p className='text-sm font-bold text-neutral-300'>
        No results for &quot;{query}&quot;
      </p>
      <p className='text-xs text-neutral-600'>
        Try a different name or username
      </p>
    </div>
  );
}

function IdleState() {
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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(initialQuery);
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setUsers([]);
      setSearched(false);
      return;
    }
    setIsLoading(true);
    setSearched(true);
    try {
      const res = await api.get('/users/search', {
        params: { q, page: 1, limit: 20 },
      });
      setUsers(res.data.data?.users ?? []);
    } catch {
      setUsers([]);
      toast.error("Failed to load search results.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-search if query param exists on mount
  useEffect(() => {
    if (initialQuery) {
      search(initialQuery);
    }
  }, [initialQuery, search]);

  const handleChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 350);
  };

  const clearQuery = () => {
    if (!query.trim()) {
      router.push('/');
      return;
    }

    setQuery('');
    setUsers([]);
    setSearched(false);
    inputRef.current?.focus();
  };

  const toggleFollow = async (
    e: React.MouseEvent,
    username: string,
    isFollowed: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isFollowed) {
        await api.delete(`/follow/${username}`);
      } else {
        await api.post(`/follow/${username}`);
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.username === username
            ? { ...user, isFollowedByMe: !isFollowed }
            : user,
        ),
      );
    } catch {
      toast.error("Failed to perform action. Please try again.");
    }
  };

  return (
    <div className='flex flex-col min-h-screen bg-[#08080f] text-white'>
      {/* Search bar */}
      <div
        className='flex items-center gap-3 px-4 py-3 sticky top-0 z-10'
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: '#08080f',
        }}
      >
        <button
          onClick={() => router.back()}
          className='text-neutral-600 hover:text-white transition-colors shrink-0 md:hidden'
        ></button>
        <div
          className='flex flex-1 items-center gap-2 px-4 py-2.5 rounded-full'
          style={{
            background: 'rgba(11,13,18,1)',
            border: `1px solid ${query ? 'rgba(20,24,32,1)' : 'rgba(255,255,255,0.08)'}`,
            transition: 'border-color 0.2s',
          }}
        >
          <IoSearchOutline
            className='size-[20px] shrink-0 transition-colors duration-200'
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
              onClick={clearQuery}
              className='shrink-0 flex items-center justify-center size-5 rounded-full'
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <IoCloseOutline className='size-3.5 text-neutral-400' />
            </button>
          )}
        </div>

        {/* Close Button -> Redirect to feed */}
        <button onClick={() => router.push('/')}>
          <IoCloseOutline className='size-6' />
        </button>
      </div>

      {/* Results */}
      <div className='flex-1 overflow-y-auto px-4 py-3'>
        {isLoading ? (
          <div className='space-y-1'>
            {[1, 2, 3, 4, 5].map((i) => (
              <UserRowSkeleton key={i} />
            ))}
          </div>
        ) : searched && users.length === 0 ? (
          <EmptyState query={query} />
        ) : !searched ? (
          <IdleState />
        ) : (
          <div className='space-y-1'>
            {users.map((user, i) => (
              <Link
                key={user.id}
                href={`/profile/${user.username}`}
                className='flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors hover:bg-white/[0.04] active:scale-[0.98]'
                style={{ animationDelay: `${i * 30}ms` }}
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
                  <p className='text-sm font-bold text-white truncate'>
                    {user.name}
                  </p>
                  <p className='text-xs text-neutral-500 truncate'>
                    @{user.username}
                  </p>
                </div>
                <button
                  type='button'
                  onClick={(e) =>
                    toggleFollow(e, user.username, !!user.isFollowedByMe)
                  }
                  className='shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full transition-all'
                  style={
                    user.isFollowedByMe
                      ? {
                          background: 'rgba(124,92,252,0.15)',
                          color: '#a78bff',
                          border: '1px solid rgba(124,92,252,0.2)',
                        }
                      : {
                          background: 'rgba(255,255,255,0.06)',
                          color: '#ffffff',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }
                  }
                >
                  {user.isFollowedByMe ? 'Following' : 'Follow'}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
