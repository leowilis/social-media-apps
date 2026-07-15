'use client';

import { IoSearchOutline } from 'react-icons/io5';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import LoadingState from '@/components/common/LoadingState';
import SearchResults from './SearchResult';
import type { UserProfile } from '@/types/user';

interface SearchOverlayBodyProps {
  users: UserProfile[];
  query: string;
  searched: boolean;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  onSelectUser: () => void;
  onToggleFollow: (
    e: React.MouseEvent,
    username: string,
    isFollowing: boolean,
  ) => void;
}

export default function SearchOverlayBody({
  users,
  query,
  searched,
  isLoading,
  isError,
  onRetry,
  onSelectUser,
  onToggleFollow,
}: SearchOverlayBodyProps) {
  // Loading state
  if (isLoading) {
    return <LoadingState text='Searching...' />;
  }

  // Error state
  if (isError) {
    return (
      <ErrorState description='Failed to search users.' onRetry={onRetry} />
    );
  }

  // Initial State View
  if (!searched) {
    return (
      <EmptyState
        icon={<IoSearchOutline className='size-7 text-primary-400' />}
        title='Find people'
        description='Search by name or username'
      />
    );
  }

  // Empty Search Results State View
  if (users.length === 0) {
    return (
      <EmptyState
        icon={<IoSearchOutline className='size-7 text-neutral-500' />}
        title={`No results for "${query}"`}
        description='Try another name or username'
      />
    );
  }

  return (
    <SearchResults
      users={users}
      onSelectUser={onSelectUser}
      onToggleFollow={onToggleFollow}
    />
  );
}
