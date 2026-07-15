'use client';

import {
  IoArrowBackOutline,
  IoCloseOutline,
  IoSearchOutline,
} from 'react-icons/io5';
import { cn } from '@/lib/utils';

interface SearchPageHeaderProps {
  query: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onBack: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export default function SearchPageHeader({
  query,
  onChange,
  onClear,
  onBack,
  inputRef,
}: SearchPageHeaderProps) {
  return (
    <div className='sticky top-0 z-10 flex items-center gap-3 border-b border-white/10 bg-surface px-4 py-3'>
      {/* Responsive Mobile Back Trigger */}
      <button
        type='button'
        aria-label='Navigate back to previous feed page'
        onClick={onBack}
        className='text-neutral-600 transition-colors hover:text-white md:hidden'
      >
        <IoArrowBackOutline className='size-5' />
      </button>

      {/* Primary Autocomplete Search Box Element wrapper */}
      <div
        className={cn(
          'flex flex-1 items-center gap-2 rounded-full bg-surface px-4 py-2.5 transition-colors',
          query ? 'border border-surface' : 'border border-white/10',
        )}
      >
        <IoSearchOutline
          aria-hidden='true'
          className={cn(
            'size-5 transition-colors',
            query ? 'text-primary-400' : 'text-white/30',
          )}
        />

        <input
          ref={inputRef}
          type='text'
          role='searchbox'
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder='Search name or username...'
          className='flex-1 bg-transparent text-sm text-white placeholder:text-neutral-600 outline-none'
        />

        {query && (
          <button
            type='button'
            aria-label='Clear text filter input'
            onClick={onClear}
            className='flex size-5 items-center justify-center rounded-full bg-white/10'
          >
            <IoCloseOutline className='size-3.5 text-neutral-400' />
          </button>
        )}
      </div>

      {/* Desktop Close/Dismiss Layout Button */}
      <button
        type='button'
        aria-label='Close search dashboard screen'
        onClick={onBack}
        className='text-neutral-400 transition-colors hover:text-white'
      >
        <IoCloseOutline className='size-6' aria-hidden='true' />
      </button>
    </div>
  );
}
