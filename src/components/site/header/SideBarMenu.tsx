import Link from 'next/link';
import {
  IoCloseOutline,
  IoPersonOutline,
  IoBookmarkOutline,
  IoSettingsOutline,
  IoLogOutOutline,
} from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { MeData } from '@/components/site/header/hooks/useMe';

// Types

interface SidebarMenuProps {
  open: boolean;
  onClose: () => void;
  me: MeData | undefined;
  onLogout: () => void;
}

// Nav items config

const NAV_ITEMS = [
  { href: '/myProfile', label: 'My Profile', icon: IoPersonOutline },
  { href: '/myProfile', label: 'Saved Posts', icon: IoBookmarkOutline },
  { href: '/editprofile', label: 'Edit Profile', icon: IoSettingsOutline },
] as const;

// Component

/**
 * Mobile sidebar menu that slides in from the right.
 * Renders a backdrop overlay that closes the sidebar on click.
 */
export function SidebarMenu({ open, onClose, me, onLogout }: SidebarMenuProps) {
  const avatarFallback = me?.name?.[0]?.toUpperCase() ?? '';

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden'
          onClick={onClose}
          aria-hidden='true'
        />
      )}

      {/* Drawer */}
      <aside
        aria-label='Navigation menu'
        aria-hidden={!open}
        className={`
          fixed top-0 right-0 z-50 h-full w-72 bg-neutral-950
          border-l border-[rgba(126,145,183,0.2)]
          flex flex-col transition-transform duration-300 ease-in-out md:hidden
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-5 py-5 border-b border-[rgba(126,145,183,0.2)]'>
          <span className='font-bold text-white text-lg'>Menu</span>
          <Button
            variant='ghost'
            size='icon-sm'
            aria-label='Close menu'
            onClick={onClose}
            className='size-8 rounded-full text-white hover:bg-[rgba(126,145,183,0.18)]'
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
            <span className='text-xs text-neutral-500 truncate'>
              @{me?.username}
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className='flex flex-col gap-1 px-3 py-4 flex-1'>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={`${href}-${label}`}
              href={href}
              onClick={onClose}
              className='flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[rgba(126,145,183,0.12)] transition-colors'
            >
              <Icon className='size-5 text-neutral-400' />
              <span className='text-sm font-semibold'>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className='px-3 py-4 border-t border-[rgba(126,145,183,0.2)]'>
          <button
            type='button'
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
