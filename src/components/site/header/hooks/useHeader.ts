import { useRouter, usePathname } from 'next/navigation';

// Route helpers

const PROFILE_ROUTES = ['/myProfile', '/editprofile', '/addpost', '/profile/'];

/**
 * Returns whether the current path is a "profile-like" route
 * that should show a back button instead of the logo.
 */
function getIsProfileRoute(pathname: string): boolean {
  return PROFILE_ROUTES.some((r) => pathname.startsWith(r));
}

/**
 * Derives the header title from the current pathname.
 * Falls back to an empty string for unknown routes.
 */
function getProfileTitle(pathname: string): string {
  if (pathname === '/editprofile') return 'Edit Profile';
  if (pathname === '/addpost') return 'Add Post';
  if (pathname === '/myProfile') return 'My Profile';
  return '';
}

// Hook

export function useHeader() {
  const router = useRouter();
  const pathname = usePathname();

  return {
    isProfileRoute: getIsProfileRoute(pathname),
    profileTitle: getProfileTitle(pathname),
    handleBack: () => router.back(),
  };
}
