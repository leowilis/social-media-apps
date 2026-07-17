'use client';

import Link from 'next/link';
import type { IconType } from 'react-icons';

interface NavItemProps {
  href: string;
  label: string;
  active: boolean;
  tapped: boolean;
  icon: IconType;
  onTap: () => void;
}

export default function NavItem({
  href,
  label,
  active,
  tapped,
  icon: Icon,
  onTap,
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onTap}
      role='tab'
      aria-selected={active}
      aria-current={active ? 'location' : undefined}
      className='relative flex w-14 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 select-none md:w-20 md:py-2'
    >
      {active && (
        <div
          className='absolute inset-0 rounded-2xl bg-[radial-gradient(circle,rgba(124,92,252,.15)_0%,transparent_70%)] pointer-events-none'
          aria-hidden='true'
        />
      )}

      <Icon
        aria-hidden='true'
        className={`
          size-[18px]
          md:size-5
          transition-all
          duration-200
          ${
            active
              ? 'text-primary-300 drop-shadow-[0_0_5px_rgba(180,159,255,.8)]'
              : 'text-white/30'
          }
          ${tapped ? 'animate-icon-bounce' : ''}
        `}
      />

      <span
        className={`
          text-[9px]
          md:text-[11px]
          font-semibold
          tracking-[0.05em]
          ${active ? 'text-primary-300' : 'text-white/25'}
        `}
      >
        {label}
      </span>

      {active && (
        <div
          className='
          absolute
          bottom-0.5
          left-1/2
          h-0.5
          w-4
          -translate-x-1/2
          rounded-full
          bg-gradient-to-r
          from-primary-400
          to-primary-200
          shadow-primary-400
          animate-dot-pop
        '
          aria-hidden='true'
        />
      )}
    </Link>
  );
}
