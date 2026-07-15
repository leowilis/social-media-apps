'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/search/useSearch';
import SearchOverlayHeader from './SearchOverlayHeader';
import SearchOverlayBody from './SearchOverlayBody';
import { useToggleFollow } from '@/hooks/profile/useFollow';

interface SearchOverlayProps {
  onClose: () => void;
}

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const router = useRouter();
  const { mutate: toggleFollow } = useToggleFollow();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    query,
    users,
    searched,
    isLoading,
    isError,
    refetch,
    handleChange,
    clearQuery,
  } = useSearch();

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

  // High-Performance UX: Prevent double background scroll leaks while overlay stream is mounted
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Responsive device auto-focus timing configuration layer
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 80);

    return () => clearTimeout(timer);
  }, []);

  // Escape keystroke listener boundary guard
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Transaction form text submission router trigger
  const handleSubmit = () => {
    const trimmedValue = query.trim();
    if (!trimmedValue) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(trimmedValue)}`);
    clearQuery();
  };

  const handleClear = () => {
    clearQuery();
    inputRef.current?.focus();
  };

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-label='Search panel overlay'
      className='animate-search-overlay fixed inset-x-0 bottom-0 top-16 z-55 flex flex-col bg-[#08080f] md:top-20.25'
    >
      <SearchOverlayHeader
        query={query}
        inputRef={inputRef}
        onChange={handleChange}
        onClear={handleClear}
        onClose={onClose}
        onSubmit={handleSubmit}
      />

      <div className='flex-1 overflow-y-auto px-4 py-3'>
        <SearchOverlayBody
          users={users}
          query={query}
          searched={searched}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          onSelectUser={onClose}
          onToggleFollow={handleToggleFollow}
        />
      </div>
    </div>
  );
}
