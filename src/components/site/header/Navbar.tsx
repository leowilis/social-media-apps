'use client';

import { useState } from 'react';

import { useHeader } from '@/hooks/header/useHeader';
import { useMe } from '@/hooks/profile/useMe';
import { useLogout } from '@/hooks/auth/useLogout';
import { useIsLoggedIn } from '@/hooks/auth/useIsLoggedIn';
import { useSearch } from '@/hooks/search/useSearch';

import { NavbarDesktop } from './NavbarDesktop';
import { NavbarMobile } from './NavbarMobile';
import { SidebarMenu } from '@/components/site/header/SideBarMenu';
import { Separator } from '@/components/ui/separator';
import { NavbarSkeleton } from '@/components/ui/skeletons';


/**
 * Main Navbar container
 * Handles orchestration only (NO business logic inside UI)
 */
export default function Navbar() {
  const { isProfileRoute, profileTitle, handleBack } = useHeader();
  const { me } = useMe();
  const isLoggedIn = useIsLoggedIn();

  const {
    query,
    users,
    isLoading,
    searched,
    handleChange,
    clearQuery,
  } = useSearch();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const logout = useLogout({
    onBeforeLogout: () => {
      setSidebarOpen(false);
      setDropdownOpen(false);
    },
  });

  const headerTitle =
    profileTitle === 'My Profile' && me?.name ? me.name : profileTitle;

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
        <NavbarDesktop
          isLoggedIn={!!isLoggedIn}
          me={me}
          query={query}
          users={users}
          loading={isLoading}
          showResults={searched && !!query.trim()}
          onQueryChange={handleChange}
          onClear={clearQuery}
          dropdownOpen={dropdownOpen}
          onToggleDropdown={() => setDropdownOpen((p) => !p)}
          onCloseDropdown={() => setDropdownOpen(false)}
          onLogout={logout}
        />

        <NavbarMobile
          isLoggedIn={!!isLoggedIn}
          me={me}
          isProfileRoute={isProfileRoute}
          headerTitle={headerTitle}
          onBack={handleBack}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          query={query}
          onQueryChange={handleChange}
          onClear={clearQuery}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <Separator />
      </header>

      <div className='md:h-[81px]' />
    </>
  );
}