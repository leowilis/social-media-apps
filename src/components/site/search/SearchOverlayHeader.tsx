'use client';

import { cn } from '@/lib/utils';
import { IoCloseOutline, IoSearchOutline } from 'react-icons/io5';

interface SearchOverlayHeaderProps {
  query: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onClear: () => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function SearchOverlayHeader({
  query,
  inputRef,
  onChange,
  onClear,
  onClose,
  onSubmit,
}: SearchOverlayHeaderProps) {
  return (
    <div className='flex items-center gap-3 border-b border-white/10 px-4 py-3'>
      {/* Search Field Element wrapper */}
      <div
        className={cn(
          'flex flex-1 items-center gap-2.5 rounded-2xl border bg-white/5 px-4 py-2.5 transition-colors',
          query ? 'border-primary-400/40' : 'border-white/10',
        )}
      >
        <IoSearchOutline
          className={cn(
            'size-[18px] transition-colors',
            query ? 'text-primary-400' : 'text-neutral-500',
          )}
        />

        <input
          ref={inputRef}
          type='text'
          role='searchbox'
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit();
            }
          }}
          placeholder='Search name or username...'
          className='flex-1 bg-transparent text-sm text-white placeholder:text-neutral-600 outline-none'
        />

        {query && (
          <button
            type='button'
            aria-label='Clear text query input field'
            onClick={onClear}
            className='flex size-5 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors'
          >
            <IoCloseOutline className='size-3.5 text-neutral-400' />
          </button>
        )}
      </div>

      {/* Dismiss Panel Overlay Button */}
      <button
        type='button'
        aria-label='Dismiss search panel overlay view'
        onClick={onClose}
        className='flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white'
      >
        <IoCloseOutline className='size-5 text-neutral-400' />
      </button>
    </div>
  );
}
