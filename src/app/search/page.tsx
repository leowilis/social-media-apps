'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IoSearchOutline } from 'react-icons/io5';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import SearchPageHeader from '@/components/site/search/SearchPageHeader';
import SearchResults from '@/components/site/search/SearchResult';
import { SearchResultsSkeleton } from '@/components/ui/skeletons';
import { useSearch } from '@/hooks/search/useSearch';
import { useToggleFollow } from '@/hooks/profile/useFollow';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialQuery = searchParams.get('q') ?? '';

  const {
    query,
    users,
    searched,
    isLoading,
    isError,
    refetch,
    handleChange,
    clearQuery,
  } = useSearch(initialQuery);

  const { mutate: toggleFollow } = useToggleFollow();

  // Initialize auto-focus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Synchronize input fields text
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }

    router.replace(`/search?${params.toString()}`, {
      scroll: false,
    });
  }, [query, router, searchParams]);

  const handleBack = () => {
    router.push('/');
  };

  const handleClear = () => {
    if (!query.trim()) {
      handleBack();
      return;
    }

    clearQuery();
    inputRef.current?.focus();
  };

  const handleToggleFollow = (
    e: React.MouseEvent,
    username: string,
    isFollowing: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    toggleFollow({
      username,
      isFollowing,
    });
  };

  return (
    <div className='flex min-h-screen flex-col bg-black text-white'>
      <SearchPageHeader
        query={query}
        inputRef={inputRef}
        onChange={handleChange}
        onClear={handleClear}
        onBack={handleBack}
      />

      <div className='flex-1 overflow-y-auto px-4 py-3'>
        {isLoading ? (
          <SearchResultsSkeleton count={5} />
        ) : isError ? (
          <ErrorState
            description='Failed to load search results.'
            onRetry={refetch}
          />
        ) : !searched ? (
          <EmptyState
            icon={<IoSearchOutline className='size-7 text-primary-400' />}
            title='Find people'
            description='Search by name or username'
          />
        ) : users.length === 0 ? (
          <EmptyState
            icon={<IoSearchOutline className='size-7 text-neutral-500' />}
            title={`No results for "${query}"`}
            description='Try another name or username'
          />
        ) : (
          <SearchResults users={users} onToggleFollow={handleToggleFollow} />
        )}
      </div>
    </div>
  );
}
