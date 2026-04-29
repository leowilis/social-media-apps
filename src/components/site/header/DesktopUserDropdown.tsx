'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  IoPersonOutline,
  IoBookmarkOutline,
  IoSettingsOutline,
  IoLogOutOutline,
} from 'react-icons/io5';

// Types

interface Me {
  name?: string;
  username?: string;
  avatarUrl?: string;
}

interface DesktopUserDropdownProps {
  me?: Me;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
}

// Component

/**
 * Desktop avatar button + dropdown menu.
 *
 * Extracted from Navbar to keep that file focused on layout logic.
 * The parent owns the open/close state and passes `onLogout` so
 * this component stays presentation-only.
 */
export function DesktopUserDropdown({
  me,
  open,
  onToggle,
  onClose,
  onLogout,
}: DesktopUserDropdownProps) {
  const avatarFallback = me?.name?.[0]?.toUpperCase() ?? '';

  return (
    <div className='relative shrink-0'>
      {/* Trigger */}
      <button
        className='flex items-center gap-3 cursor-pointer'
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup='menu'
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
          {/* Click-away backdrop */}
          <div className='fixed inset-0 z-40' onClick={onClose} />

          <div
            role='menu'
            className='absolute right-0 top-14 z-50 w-56 rounded-2xl overflow-hidden'
            style={{
              background: 'rgba(10,10,18,0.98)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            }}
          >
            {/* User info header */}
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

            {/* Links */}
            <div className='px-2 py-2'>
              {[
                {
                  href: '/myProfile',
                  icon: <IoPersonOutline className='size-4 text-neutral-500' />,
                  label: 'My Profile',
                },
                {
                  href: '/myProfile',
                  icon: (
                    <IoBookmarkOutline className='size-4 text-neutral-500' />
                  ),
                  label: 'Saved Posts',
                },
                {
                  href: '/editprofile',
                  icon: (
                    <IoSettingsOutline className='size-4 text-neutral-500' />
                  ),
                  label: 'Edit Profile',
                },
              ].map(({ href, icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  role='menuitem'
                  onClick={onClose}
                  className='flex items-center gap-3 px-3 py-2.5 rounded-xl text-white hover:bg-white/[0.05] transition-colors'
                >
                  {icon}
                  <span className='text-sm font-semibold'>{label}</span>
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className='px-2 pb-2 border-t border-[rgba(255,255,255,0.06)] pt-2'>
              <button
                role='menuitem'
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
