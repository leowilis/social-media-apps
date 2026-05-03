'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  IoArrowBackOutline,
  IoSearchOutline,
  IoMenuOutline,
  IoCloseOutline,
} from 'react-icons/io5';

import Logo from '@/public/assets/logo/Logo.svg';
import { AuthUser } from '@/types/auth';

// Props
interface NavbarMobileProps {
  isLoggedIn: boolean;
  me?: AuthUser | null;
  isProfileRoute: boolean;
  headerTitle: string;
  onBack: () => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
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
  const router = useRouter();
  const avatarFallback = me?.name?.[0]?.toUpperCase() ?? '';

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      setShowSearch(false);
      onClear();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    if (e.key === 'Escape') {
      setShowSearch(false);
      onClear();
    }
  };

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
          <div className='flex w-full gap-3 items-center'>
            <input
              autoFocus
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder='Search name or username...'
              className='flex-1 bg-transparent outline-none text-sm text-white placeholder:text-neutral-600'
            />
            <button
              onClick={() => {
                setShowSearch(false);
                onClear();
              }}
              className='text-sm text-neutral-400 shrink-0'
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <div className='flex items-center gap-2'>
              <Image src={Logo} alt='logo' width={30} height={30} />
              <span className='text-xl font-bold'>Sociality</span>
            </div>

            <div className='flex items-center gap-3'>
              <button onClick={() => router.push('/search')}>
                <IoSearchOutline className='size-6' />
              </button>

              {isLoggedIn ? (
                <Avatar onClick={onOpenSidebar}>
                  <AvatarImage src={me?.avatarUrl ?? ''} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              ) : (
                <button onClick={() => setMenuOpen(!menuOpen)}>
                  {menuOpen ? (
                    <IoCloseOutline className='size-7' />
                  ) : (
                    <IoMenuOutline className='size-8' />
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {!isLoggedIn && menuOpen && (
        <div className='flex gap-4 p-4 md:hidden'>
          <Link href='/login' className='flex-1'>
            <Button className='w-full rounded-full bg-transparent border border-neutral-900'>
              Login
            </Button>
          </Link>
          <Link href='/register' className='flex-1'>
            <Button className='w-full rounded-full bg-primary-300'>
              Register
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
