'use client';

import Link from 'next/link';
import { useEffect } from 'react';
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

/**
 * Desktop user dropdown menu
 * - Accessible
 * - Clean separation (config vs UI)
 * - Handles outside click & escape key
 */
export function DesktopUserDropdown({
  me,
  open,
  onToggle,
  onClose,
  onLogout,
}: DesktopUserDropdownProps) {
  const avatarFallback = getAvatarFallback(me?.name);

  // ESC to close
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <div className='relative shrink-0'>
      {/* Trigger */}
      <button
        type='button'
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup='menu'
        aria-controls='user-menu'
        className='flex items-center gap-3 cursor-pointer'
      >
        <Avatar className='size-12 border border-[rgba(126,145,183,0.32)]'>
          <AvatarImage src={me?.avatarUrl ?? ''} alt={me?.name} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className='text-sm font-semibold text-white'>{me?.name}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-40'
            onClick={onClose}
          />

          <div
            id='user-menu'
            role='menu'
            className='absolute right-0 top-14 z-50 w-56 rounded-2xl overflow-hidden'
            style={{
              background: 'rgba(10,10,18,0.98)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div className='flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]'>
              <Avatar className='size-9 border border-[rgba(126,145,183,0.32)]'>
                <AvatarImage src={me?.avatarUrl ?? ''} alt={me?.name} />
                <AvatarFallback className='text-sm font-bold'>
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>

              <div className='flex flex-col min-w-0'>
                <span className='font-bold text-white text-sm truncate'>
                  {me?.name}
                </span>
                <span className='text-xs text-neutral-500 truncate'>
                  @{me?.username}
                </span>
              </div>
            </div>

            {/* Menu items */}
            <div className='px-2 py-2'>
              {DROPDOWN_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  role='menuitem'
                  href={href}
                  onClick={onClose}
                  className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-white hover:bg-white/[0.05] transition-colors'
                >
                  <Icon className='size-4 text-neutral-500' />
                  <span className='text-sm font-semibold'>{label}</span>
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className='px-2 pb-2 border-t border-[rgba(255,255,255,0.06)] pt-2'>
              <button
                role='menuitem'
                type='button'
                onClick={onLogout}
                className='flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors'
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
 * Small helper
 */
function getAvatarFallback(name?: string) {
  return name?.[0]?.toUpperCase() ?? '';
}