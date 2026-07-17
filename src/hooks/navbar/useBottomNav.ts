'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function useBottomNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [hoverAdd, setHoverAdd] = useState(false);
  const [tapped, setTapped] = useState<string | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHomeActive = pathname === '/' || pathname === '/home';
  const isProfileActive =
    pathname === '/myprofile' ||
    pathname === '/myProfile' ||
    pathname.startsWith('/profile/');

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onOpen = () => setSearchActive(true);
    const onClose = () => setSearchActive(false);

    window.addEventListener('search-open', onOpen);
    window.addEventListener('search-close', onClose);

    return () => {
      window.removeEventListener('search-open', onOpen);
      window.removeEventListener('search-close', onClose);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const tap = (key: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setTapped(key);

    timeoutRef.current = setTimeout(() => {
      setTapped(null);
    }, 400);
  };

  return {
    visible,
    hoverAdd,
    setHoverAdd,
    tapped,
    tap,
    searchActive,
    isHomeActive,
    isProfileActive,
  };
}