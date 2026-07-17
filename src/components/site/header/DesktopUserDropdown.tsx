'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { IoLogOutOutline } from 'react-icons/io5';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/types/user';
import { DROPDOWN_ITEMS } from '@/config/dropdown.config';

interface DesktopUserDropdownProps {
  me: User | undefined;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
}

// Desktop user dropdown menu
export function DesktopUserDropdown({
  me,
  open,
  onToggle,
  onClose,
  onLogout,
}: DesktopUserDropdownProps) {
  const avatarFallback = getAvatarFallback(me?.name);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;

    firstItemRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        requestAnimationFrame(() => {
          triggerRef.current?.focus();
        });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  const handleClose = () => {
    onClose();
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  return (
    <div className='relative shrink-0'>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type='button'
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup='menu'
        aria-controls='user-menu'
        className='flex cursor-pointer items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-primary-400'
      >
        <Avatar className='size-12 border border-white/20'>
          <AvatarImage src={me?.avatarUrl ?? ''} alt={me?.name} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className='text-sm font-semibold text-white'>{me?.name}</span>
      </button>
      {open && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-40'
            onClick={handleClose}
            aria-hidden='true'
          />

          {/* Dropdown */}
          <div
            id='user-menu'
            role='menu'
            aria-label='User menu'
            className='absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/95 shadow-2xl backdrop-blur-md'
          >
            {/* Header */}
            <div className='flex items-center gap-3 border-b border-white/5 px-4 py-3'>
              <Avatar className='size-9 border border-white/20'>
                <AvatarImage src={me?.avatarUrl ?? ''} alt={me?.name} />

                <AvatarFallback className='text-sm font-bold'>
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>

              <div className='flex min-w-0 flex-col'>
                <span className='truncate text-sm font-bold text-white'>
                  {me?.name}
                </span>

                <span className='truncate text-xs text-neutral-500'>
                  @{me?.username}
                </span>
              </div>
            </div>

            {/* Menu */}
            <div className='px-2 py-2'>
              {DROPDOWN_ITEMS.map(({ href, label, icon: Icon }, index) => (
                <Link
                  key={label}
                  ref={index === 0 ? firstItemRef : undefined}
                  role='menuitem'
                  href={href}
                  onClick={handleClose}
                  className='flex items-center gap-3 rounded-xl px-3 py-2.5 text-white transition-colors hover:bg-white/5 focus:bg-white/5 focus:outline-none'
                >
                  <Icon className='size-4 text-neutral-500' />

                  <span className='text-sm font-semibold'>{label}</span>
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className='border-t border-white/5 px-2 pb-2 pt-2'>
              <button
                type='button'
                role='menuitem'
                onClick={onLogout}
                className='flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-400 transition-colors hover:bg-red-500/10 focus:bg-red-500/10 focus:outline-none'
              >
                <IoLogOutOutline className='size-4' />

                <span className='text-sm font-semibold'>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Returns avatar initials.
 */
function getAvatarFallback(name?: string) {
  return name?.trim().charAt(0).toUpperCase() || '?';
}
