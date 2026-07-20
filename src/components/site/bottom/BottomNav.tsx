'use client';

import { IoHome, IoPerson } from 'react-icons/io5';
import NavItem from './NavItem';
import AddPostButton from './AddPostButton';
import { useBottomNav } from '@/hooks/navbar/useBottomNav';

export function HomeBottomNav() {
  const { visible, tapped, tap, searchActive, isHomeActive, isProfileActive } =
    useBottomNav();

  return (
    <nav
      aria-label='Bottom navigation'
      className={`
        fixed
        inset-x-0
        bottom-4
        z-40
        flex
        justify-center
        px-6
        transition-all
        duration-500
        md:bottom-6
        ${
          visible && !searchActive
            ? 'translate-y-0 opacity-100'
            : 'translate-y-24 opacity-0'
        }
        animate-nav-slide
      `}
    >
      <div
        className='
        relative
        flex
        items-center
        justify-between
        w-[280px]
        md:w-[360px]
        rounded-full
        border
        border-white/10
        bg-black/95
        backdrop-blur-3xl
        px-3
        py-2
        md:px-7
        shadow-[0_12px_40px_rgba(0,0,0,.75)]
        transition-all
        duration-300
        ease-out
       '
      >
        {/* highlight */}
        <div className='pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent' />
        <NavItem
          href='/'
          label='Home'
          active={isHomeActive}
          tapped={tapped === 'home'}
          icon={IoHome}
          onTap={() => tap('home')}
        />

        <AddPostButton onTap={() => tap('add')} />

        <NavItem
          href='/myProfile'
          label='Profile'
          active={isProfileActive}
          tapped={tapped === 'profile'}
          icon={IoPerson}
          onTap={() => tap('profile')}
        />
      </div>
    </nav>
  );
}
