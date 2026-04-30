'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  IoArrowBackOutline,
  IoSearchOutline,
  IoMenuOutline,
  IoCloseOutline,
} from 'react-icons/io5';

import Logo from '@/public/assets/logo/Logo.svg';
import type { User } from '@/types/user';

interface NavbarMobileProps {
  isLoggedIn: boolean;
  me?: User | null;

  isProfileRoute: boolean;
  headerTitle: string;
  onBack: () => void;

  // UI state
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;

  showSearch: boolean;
  setShowSearch: (v: boolean) => void;

  // search
  query: string;
  onQueryChange: (val: string) => void;
  onClear: () => void;

  onOpenSidebar: () => void;
}

export function NavbarMobile({
  isLoggedIn,
  me,
  isProfileRoute,
  headerTitle,
  onBack,
  menuOpen,
  setMenuOpen,
  showSearch,
  setShowSearch,
  query,
  onQueryChange,
  onClear,
  onOpenSidebar,
}: NavbarMobileProps) {
  const avatarFallback = me?.name?.[0]?.toUpperCase() ?? '';

  return (
    <>
      <div className='flex h-16 items-center justify-between px-4 md:hidden'>
        {isProfileRoute ? (
          <>
            <div className='flex items-center gap-2'>
              <Button onClick={onBack} size='icon-sm'>
                <IoArrowBackOutline />
              </Button>
              <span className='font-bold'>{headerTitle}</span>
            </div>

            <Avatar onClick={onOpenSidebar}>
              <AvatarImage src={me?.avatarUrl ?? ''} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </>
        ) : showSearch ? (
          <div className='flex w-full gap-2'>
            <input
              autoFocus
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder='Search...'
              className='flex-1 bg-transparent outline-none'
            />
            <button onClick={onClear}>Cancel</button>
          </div>
        ) : (
          <>
            <div className='flex items-center gap-3'>
              <Image src={Logo} alt='logo' width={30} height={30} />
              <span className='text-xl font-bold'>Sociality</span>
            </div>

            <div className='flex items-center gap-3'>
              <button onClick={() => setShowSearch(true)}>
                <IoSearchOutline />
              </button>

              {isLoggedIn ? (
                <Avatar onClick={onOpenSidebar}>
                  <AvatarImage src={me?.avatarUrl ?? ''} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              ) : (
                <button onClick={() => setMenuOpen(!menuOpen)}>
                  {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {!isLoggedIn && menuOpen && (
        <div className='flex gap-4 p-4 md:hidden'>
          <Link href='/login' className='flex-1'>
            <Button className='w-full'>Login</Button>
          </Link>
          <Link href='/register' className='flex-1'>
            <Button className='w-full'>Register</Button>
          </Link>
        </div>
      )}
    </>
  );
}
