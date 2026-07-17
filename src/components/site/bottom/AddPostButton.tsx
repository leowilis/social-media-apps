'use client';

import Link from 'next/link';
import { IoAdd } from 'react-icons/io5';

interface AddPostButtonProps {
  onTap: () => void;
}

export default function AddPostButton({ onTap }: AddPostButtonProps) {
  return (
    <Link
      href='/addpost'
      aria-label='Create new post'
      onClick={onTap}
      className='
        group
        btn-shimmer
        relative
        flex
        h-11
        w-11
        md:h-[52px]
        md:w-[52px]
        items-center
        justify-center
        overflow-hidden
        rounded-full
        bg-gradient-to-br
        from-purple-300
        via-primary-400
        to-primary-700
        transition-all
        duration-300
        ease-out
        active:scale-95
        cursor-pointer
        outline-none
        hover:w-[148px]
        md:hover:w-[180px]
        shadow-[0_0_0_1px_rgba(167,139,255,.20),0_4px_14px_rgba(124,92,252,.45)]
        hover:shadow-[0_0_0_1px_rgba(192,132,252,.45),0_8px_28px_rgba(124,92,252,.70)]
        focus-visible:ring-2
        focus-visible:ring-primary-400/50
        focus-visible:ring-offset-2
        focus-visible:ring-offset-black
      '
    >
      {/* Highlight */}
      <div
        aria-hidden='true'
        className='
          pointer-events-none
          absolute
          inset-x-3
          top-1
          h-px
          rounded-full
          bg-gradient-to-r
          from-transparent
          via-white/40
          to-transparent
        '
      />

      {/* Icon */}
      <IoAdd
        aria-hidden='true'
        className='
          relative
          z-10
          size-5
          md:size-6
          shrink-0
          text-white
          transition-transform
          duration-300
          group-hover:rotate-90
        '
      />

      {/* Text */}
      <span
        className='
          relative
          z-10
          ml-0
          max-w-0
          overflow-hidden
          whitespace-nowrap
          text-sm
          font-bold
          tracking-tight
          text-white
          opacity-0
          transition-all
          duration-300
          ease-out
          group-hover:ml-2
          group-hover:max-w-[120px]
          group-hover:opacity-100
        '
      >
        Add New Post
      </span>
    </Link>
  );
}
