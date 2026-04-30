import Link from 'next/link';
import {
  IoPersonOutline,
  IoBookmarkOutline,
  IoSettingsOutline,
  IoLogOutOutline,
} from 'react-icons/io5';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { MeData } from '@/hooks/profile/useMe';

// Types

interface DesktopUserDropdownProps {
  me: MeData | undefined;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
}

// Nav items config

const DROPDOWN_ITEMS = [
  { href: '/myProfile', label: 'My Profile', icon: IoPersonOutline },
  { href: '/myProfile', label: 'Saved Posts', icon: IoBookmarkOutline },
  { href: '/editprofile', label: 'Edit Profile', icon: IoSettingsOutline },
] as const;

// Component

/**
 * Avatar + name button that toggles a dropdown with user actions.
 * Closes when clicking the backdrop or selecting a link.
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
        type='button'
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup='menu'
        aria-label='Open user menu'
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
            aria-hidden='true'
          />

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
              {DROPDOWN_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={`${href}-${label}`}
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
