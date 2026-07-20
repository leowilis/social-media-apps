'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useIsLoggedIn } from '@/hooks/auth/useIsLoggedIn';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [isLoggedIn, pathname, router]);

  if (!isLoggedIn) return null;

  return <>{children}</>;
}