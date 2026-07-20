import { useAppSelector } from "@/store/hooks";

export function useIsLoggedIn(): boolean | null {
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isLoading) return null;
  return isAuthenticated;
}