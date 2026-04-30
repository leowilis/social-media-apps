import { useState, useEffect } from "react";

/**
 * SSR-safe hook that returns whether the user has a valid token.
 *
 * Reading `localStorage` directly during render causes a React hydration
 * mismatch because the server always renders as "logged out". This hook
 * defers the check to `useEffect` so the initial render matches the server,
 * and the value is corrected on the client after mount.
 */
export function useIsLoggedIn(): boolean | null {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(!!localStorage.getItem("auth_token"));
  }, []);

  return isLoggedIn;
}