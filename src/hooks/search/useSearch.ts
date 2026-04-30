import { useState, useCallback, useRef } from 'react';
import { User } from '@/types/user';
import { usersApi } from '@/lib/api/users';

/**
 * Handles user search with debouncing.
 * Extracted from SearchOverlay so the component stays UI-only.
 */
export function useSearch() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setUsers([]);
      setSearched(false);
      return;
    }
    setIsLoading(true);
    setSearched(true);
    try {
      const res = await usersApi.searchUsers(q);
      setUsers(res.data.data.users);
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = useCallback(
    (val: string) => {
      setQuery(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => search(val), 350);
    },
    [search],
  );

  const clearQuery = useCallback(() => {
    setQuery('');
    setUsers([]);
    setSearched(false);
  }, []);

  return { query, users, isLoading, searched, handleChange, clearQuery };
}
