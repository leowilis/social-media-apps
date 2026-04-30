'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useCallback } from 'react';

import { useHeader } from '../../../hooks/header/useHeader';
import { useMe } from '../../../hooks/profile/useMe';
import { useLogout } from '@/hooks/auth/useLogout';
import { useIsLoggedIn } from '@/hooks/auth/useIsLoggedIn';
import { api } from '@/lib/axios';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { NavbarSkeleton } from '@/components/ui/skeletons';
import { SidebarMenu } from '@/components/site/header/SideBarMenu';
import { DesktopUserDropdown } from './DesktopUserDropdown';

import {
  IoArrowBackOutline,
  IoSearchOutline,
  IoMenuOutline,
  IoCloseOutline,
} from 'react-icons/io5';

import Logo from '@/public/assets/logo/Logo.svg';
import { SearchUser } from '../../../hooks/search/useSearch';
import { SearchBar } from '../search/SearchBar';

export default function Navbar() {
  const { isProfileRoute, profileTitle, handleBack } = useHeader();
  const { me } = useMe();
  const isLoggedIn = useIsLoggedIn();

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchUsers, setSearchUsers] = useState<SearchUser[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Logout
  const logout = useLogout({
    onBeforeLogout: () => {
      setSidebarOpen(false);
      setDesktopDropdown(false);
    },
  });

  // Search
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchUsers([]);
      return;
    }

    setSearchLoading(true);

    try {
      const res = await api.get('/users/search', {
        params: { q, page: 1, limit: 10 },
      });

      setSearchUsers(res.data?.data?.users ?? []);
    } catch {
      setSearchUsers([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSearch(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      doSearch(value);
    }, 350);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchUsers([]);
    setShowSearch(false);
  };

  // Derived
  const avatarFallback = me?.name?.[0]?.toUpperCase() ?? '';
  const headerTitle =
    profileTitle === 'My Profile' && me?.name ? me.name : profileTitle;

  // FIX HYDRATION (INI PENTING)
  if (isLoggedIn === null) return <NavbarSkeleton />;

  return (
    <>
      <SidebarMenu
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        me={me}
        onLogout={logout}
      />

      <header className='fixed inset-x-0 top-0 z-40 flex w-full flex-col bg-black text-white'>
        {/* DESKTOP */}
        <div className='hidden h-20 items-center justify-between px-16 md:flex'>
          <Link href='/' className='flex items-center gap-3 shrink-0'>
            <Image src={Logo} alt='logo' width={30} height={30} priority />
            <span className='text-2xl font-bold'>Sociality</span>
          </Link>

          <SearchBar
            variant='desktop'
            query={searchQuery}
            users={searchUsers}
            loading={searchLoading}
            showResults={showSearch && !!searchQuery.trim()}
            onQueryChange={handleSearchChange}
            onFocus={() => setShowSearch(true)}
            onClear={clearSearch}
            onSelectUser={clearSearch}
          />

          {isLoggedIn ? (
            <DesktopUserDropdown
              me={me}
              open={desktopDropdown}
              onToggle={() => setDesktopDropdown((p) => !p)}
              onClose={() => setDesktopDropdown(false)}
              onLogout={logout}
            />
          ) : (
            <div className='flex gap-2'>
              <Link href='/login'>
                <Button variant='ghost'>Login</Button>
              </Link>
              <Link href='/register'>
                <Button>Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE */}
        <div className='flex h-16 items-center justify-between px-4 md:hidden'>
          {isProfileRoute ? (
            <>
              <div className='flex items-center gap-2'>
                <Button onClick={handleBack} size='icon-sm'>
                  <IoArrowBackOutline />
                </Button>
                <span className='font-bold'>{headerTitle}</span>
              </div>

              <Avatar onClick={() => setSidebarOpen(true)}>
                <AvatarImage src={me?.avatarUrl ?? ''} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
            </>
          ) : showSearch ? (
            <div className='flex w-full gap-2'>
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder='Search...'
                className='flex-1 bg-transparent outline-none'
              />
              <button onClick={clearSearch}>Cancel</button>
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
                  <Avatar onClick={() => setSidebarOpen(true)}>
                    <AvatarImage src={me?.avatarUrl ?? ''} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  </Avatar>
                ) : (
                  <button onClick={() => setMenuOpen((p) => !p)}>
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

        <Separator />
      </header>

      <div className='md:h-[81px]' />
    </>
  );
}
