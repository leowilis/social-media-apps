'use client';

import { useState } from 'react';
import { useSearchUsers } from '@/hooks/users/useSearchUsers';
import { useDebounce } from '../useDebounce';

export function useSearch(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query);
  const searched = debouncedQuery.trim().length > 0;
  const searchQuery = debouncedQuery.trim();

  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useSearchUsers(searchQuery);

  const clearQuery = () => {
    setQuery('');
  };

  return {
    query,
    users,
    searched,
    isLoading: searched ? isLoading : false,
    isError,
    refetch,
    handleChange: setQuery,
    clearQuery,
  };
}
