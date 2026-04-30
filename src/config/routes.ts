/**
 * Routes that require an authenticated user.
 * Unauthenticated visitors are redirected to /login.
 */
export const PRIVATE_PATHS = ['/myProfile', '/addpost', '/editprofile', '/post'] as const;

/**
 * Routes only accessible when logged out.
 * Authenticated users are redirected to the feed.
 */
export const AUTH_PATHS = ['/login', '/register'] as const;

/**
 * Routes that show a back button instead of the logo in the header.
 */
export const PROFILE_ROUTES = ['/myProfile', '/editprofile', '/addpost', '/profile/'] as const;