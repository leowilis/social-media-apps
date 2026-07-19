'use client';

import { IoArrowBack } from 'react-icons/io5';

interface DesktopHeaderProps {
  onBack: () => void;
}

export function DesktopHeader({ onBack }: DesktopHeaderProps) {
  return (
    <div className='hidden md:flex items-center gap-3 select-none border-b border-white/5 pb-4 mb-6 text-left w-full'>
      <button
        type='button'
        onClick={onBack}
        aria-label='Navigate back'
        className='text-white hover:text-neutral-400 transition-colors'
      >
        <IoArrowBack className='size-5' aria-hidden='true' />
      </button>

      <h1 className='text-xl font-black tracking-tight text-white md:text-2xl'>
        Edit Profile
      </h1>
    </div>
  );
}
