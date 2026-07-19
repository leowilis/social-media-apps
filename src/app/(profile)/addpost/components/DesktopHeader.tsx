'use client';

import { IoArrowBack } from 'react-icons/io5';

interface DesktopHeaderProps {
  onBack: () => void;
}

export function DesktopHeader({ onBack }: DesktopHeaderProps) {
  return (
    <div className='hidden items-center gap-3 select-none md:flex'>
      <button
        type='button'
        aria-label='Navigate back'
        onClick={onBack}
        className='text-white transition-colors hover:text-neutral-400'
      >
        <IoArrowBack className='size-5' aria-hidden='true' />
      </button>

      <h1 className='text-2xl font-bold'>Add Post</h1>
    </div>
  );
}
