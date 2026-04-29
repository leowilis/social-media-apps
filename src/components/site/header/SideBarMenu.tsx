'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  IoCloseOutline,
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

interface SidebarMenuProps {
  // Whether the sidebar is visible
  open: boolean;
  // Called when the user dismisses the sidebar (overlay click or close button)
  onClose: () => void;
  // Current user data
  me?: Me;
  // Logout handler — provided by the parent to keep auth logic centralised
  onLogout: () => void;
}

// Nav item helper

function SidebarLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className='flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[rgba(126,145,183,0.12)] transition-colors'
    >
      {icon}
      <span className='text-sm font-semibold'>{label}</span>
    </Link>
  );
}

// Component

/**
 * Mobile slide-in sidebar menu.
 *
 * Shared between `Navbar` and `ProfileLayout` so logout logic and nav links
 * are defined in one place. The parent passes `onLogout` so this component
 * stays presentation-only.
 */
export function SidebarMenu({ open, onClose, me, onLogout }: SidebarMenuProps) {
  const avatarFallback = me?.name?.[0]?.toUpperCase() ?? '';

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden'
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-neutral-950 border-l border-[rgba(126,145,183,0.2)] flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-5 py-5 border-b border-[rgba(126,145,183,0.2)]'>
          <span className='font-bold text-white text-lg'>Menu</span>
          <Button
            variant='ghost'
            size='icon-sm'
            className='size-8 rounded-full text-white hover:bg-[rgba(126,145,183,0.18)]'
            onClick={onClose}
          >
            <IoCloseOutline className='size-5' />
          </Button>
        </div>

        {/* User info */}
        <div className='flex items-center gap-3 px-5 py-4 border-b border-[rgba(126,145,183,0.2)]'>
          <Avatar className='size-12 border border-[rgba(126,145,183,0.32)]'>
            <AvatarImage src={me?.avatarUrl ?? ''} alt={me?.name} />
            <AvatarFallback className='text-base font-bold'>
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col min-w-0'>
            <span className='font-bold text-white text-sm truncate'>
              {me?.name}
            </span>
            <span className='text-xs text-neutral-400 truncate'>
              @{me?.username}
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className='flex flex-col gap-1 px-3 py-4 flex-1'>
          <SidebarLink
            href='/myProfile'
            icon={<IoPersonOutline className='size-5 text-neutral-400' />}
            label='My Profile'
            onClick={onClose}
          />
          <SidebarLink
            href='/myProfile'
            icon={<IoBookmarkOutline className='size-5 text-neutral-400' />}
            label='Saved Posts'
            onClick={onClose}
          />
          <SidebarLink
            href='/editprofile'
            icon={<IoSettingsOutline className='size-5 text-neutral-400' />}
            label='Edit Profile'
            onClick={onClose}
          />
        </nav>

        {/* Logout */}
        <div className='px-3 py-4 border-t border-[rgba(126,145,183,0.2)]'>
          <button
            onClick={onLogout}
            className='flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors'
          >
            <IoLogOutOutline className='size-5' />
            <span className='text-sm font-semibold'>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
