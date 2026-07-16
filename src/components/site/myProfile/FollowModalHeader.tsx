'use client';

import { IoCloseOutline } from 'react-icons/io5';

interface FollowModalHeaderProps {
  title: string;
  onClose: () => void;
}

export default function FollowModalHeader({
  title,
  onClose,
}: FollowModalHeaderProps) {
  return (
    <div className='flex items-center justify-between border-b border-black px-5 py-4 select-none'>
      <h2 id='modal-title' className='text-base font-bold text-white'>
        {title}
      </h2>

      <button
        type='button'
        aria-label={`Dismiss ${title} list overlay panel`}
        onClick={onClose}
        className='text-neutral-500 transition-colors hover:text-white'
      >
        <IoCloseOutline className='size-6' aria-hidden='true' />
      </button>
    </div>
  );
}
