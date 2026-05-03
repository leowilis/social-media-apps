'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { DesktopUserDropdown } from './DesktopUserDropdown';
import { SearchBar } from '../search/SearchBar';

import Logo from '@/public/assets/logo/Logo.svg';
import { User } from '@/types/user';
import { AuthUser } from '@/types/auth';


interface NavbarDesktopProps {
  isLoggedIn: boolean;
  me?: AuthUser | null;

  // search
  query: string;
  users: User[];
  loading: boolean;
  showResults: boolean;
  onQueryChange: (val: string) => void;
  onClear: () => void;

  // dropdown
  dropdownOpen: boolean;
  onToggleDropdown: () => void;
  onCloseDropdown: () => void;

  onLogout: () => void;
}

export function NavbarDesktop({
  isLoggedIn,
  me,
  query,
  users,
  loading,
  showResults,
  onQueryChange,
  onClear,
  dropdownOpen,
  onToggleDropdown,
  onCloseDropdown,
  onLogout,
}: NavbarDesktopProps) {
  return (
    <div className='hidden h-20 items-center justify-between px-16 md:flex'>
      {/* Logo */}
      <Link href='/' className='flex items-center gap-3 shrink-0'>
        <Image src={Logo} alt='logo' width={30} height={30} priority />
        <span className='text-2xl font-bold'>Sociality</span>
      </Link>

      {/* Search */}
      <SearchBar
        variant='desktop'
        query={query}
        users={users}
        loading={loading}
        showResults={showResults}
        onQueryChange={onQueryChange}
        onFocus={() => {}}
        onClear={onClear}
        onSelectUser={onClear}
      />

      {/* Right Side */}
      {isLoggedIn ? (
        <DesktopUserDropdown
          me={me ?? undefined}
          open={dropdownOpen}
          onToggle={onToggleDropdown}
          onClose={onCloseDropdown}
          onLogout={onLogout}
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
  );
}