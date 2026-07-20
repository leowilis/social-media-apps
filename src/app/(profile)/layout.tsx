'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMe } from '@/hooks/profile/useMe';

import Navbar from '@/components/site/header/Navbar';
import { HomeBottomNav } from '@/components/site/bottom/BottomNav';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import {
  IoArrowBackOutline,
  IoBookmarkOutline,
  IoCloseOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoSettingsOutline,
} from 'react-icons/io5';
import { useLogout } from '@/hooks/auth/useLogout';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { me } = useMe();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const avatarFallback = me?.name?.charAt(0).toUpperCase() ?? '';
  const logout = useLogout({
    onBeforeLogout: () => setSidebarOpen(false),
  });
  const isUserProfile = pathname.startsWith('/profile/');
  const hideBottomNav = pathname === '/editprofile' || pathname === '/addpost';

  const showMobileHeader = !isUserProfile;

  const headerTitle = (() => {
    switch (pathname) {
      case '/editprofile':
        return 'Edit Profile';

      case '/addpost':
        return 'Add Post';

      default:
        return me?.name ?? '';
    }
  })();

  return (
    <div className='min-h-screen bg-black text-white'>
      {/* Desktop Navbar */}
      <div className='hidden md:block'>
        <Navbar />
      </div>

      {/* Mobile */}
      <div className='md:hidden'>
        {/* Overlay */}
        {sidebarOpen && (
          <div
            className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm'
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 right-0 z-50 h-full w-72 border-l border-[rgba(126,145,183,0.2)] bg-neutral-950 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className='flex items-center justify-between border-b border-[rgba(126,145,183,0.2)] px-4 py-5'>
            <span className='text-lg font-bold'>Menu</span>

            <Button
              variant='ghost'
              size='icon-sm'
              className='size-8 rounded-full text-white hover:bg-[rgba(126,145,183,0.18)]'
              onClick={() => setSidebarOpen(false)}
            >
              <IoCloseOutline className='size-5' />
            </Button>
          </div>

          {/* User */}
          <div className='flex items-center gap-3 border-b border-[rgba(126,145,183,0.2)] px-3 py-4'>
            <Avatar className='size-12 border border-[rgba(126,145,183,0.32)]'>
              <AvatarImage src={me?.avatarUrl ?? ''} alt={me?.name} />

              <AvatarFallback className='font-bold'>
                {avatarFallback}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className='font-bold'>{me?.name}</p>
              <p className='text-xs text-neutral-400'>{me?.username}</p>
            </div>
          </div>

          {/* Menu */}
          <nav className='flex flex-1 flex-col gap-1 py-4'>
            <Link
              href='/myProfile'
              onClick={() => setSidebarOpen(false)}
              className='flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-[rgba(126,145,183,0.12)]'
            >
              <IoPersonOutline className='size-5 text-neutral-400' />
              <span className='text-sm font-semibold'>My Profile</span>
            </Link>

            <Link
              href='/myProfile'
              onClick={() => setSidebarOpen(false)}
              className='flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-[rgba(126,145,183,0.12)]'
            >
              <IoBookmarkOutline className='size-5 text-neutral-400' />
              <span className='text-sm font-semibold'>Saved Posts</span>
            </Link>

            <Link
              href='/editprofile'
              onClick={() => setSidebarOpen(false)}
              className='flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-[rgba(126,145,183,0.12)]'
            >
              <IoSettingsOutline className='size-5 text-neutral-400' />
              <span className='text-sm font-semibold'>Edit Profile</span>
            </Link>
          </nav>

          {/* Logout */}
          <div className='border-t border-[rgba(126,145,183,0.2)] px-3 py-4'>
            <button
              onClick={logout}
              className='flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition-colors hover:bg-red-500/10'
            >
              <IoLogOutOutline className='size-5' />
              <span className='text-sm font-semibold'>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        {showMobileHeader && (
          <header className='fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-[rgba(126,145,183,0.2)] bg-black px-4'>
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='icon-lg'
                className='size-8 rounded-full text-white hover:bg-[rgba(126,145,183,0.18)]'
                onClick={() => router.back()}
              >
                <IoArrowBackOutline className='size-6' />
              </Button>

              <span className='font-bold'>{headerTitle}</span>
            </div>

            {!hideBottomNav && (
              <Avatar
                className='size-11 cursor-pointer border border-[rgba(126,145,183,0.32)]'
                onClick={() => setSidebarOpen(true)}
              >
                <AvatarImage src={me?.avatarUrl ?? ''} alt={me?.name} />

                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
            )}
          </header>
        )}

        {!hideBottomNav && <HomeBottomNav />}
      </div>

      <main
        className={[
          showMobileHeader ? 'pt-16 md:pt-0' : 'pt-0',
          hideBottomNav ? 'pb-8' : 'pb-24 md:pb-8',
        ].join(' ')}
      >
        {children}
      </main>
    </div>
  );
}
