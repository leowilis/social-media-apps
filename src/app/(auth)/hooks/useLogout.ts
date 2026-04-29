import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { clearAuth } from "@/store/authSlice";

interface UseLogoutOptions {
  /** Called synchronously before the Redux state is cleared and redirect fires. */
  onBeforeLogout?: () => void;
}

/**
 * Returns a `logout` function that:
 * 1. Calls `onBeforeLogout` (e.g. close sidebar/dropdown)
 * 2. Clears Redux auth state (also clears localStorage + cookie via authSlice)
 * 3. Clears TanStack Query cache so stale user data doesn't persist
 * 4. Redirects to `/login`
 */
export function useLogout({ onBeforeLogout }: UseLogoutOptions = {}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = (): void => {
    onBeforeLogout?.();
    dispatch(clearAuth());
    queryClient.clear();
    router.push("/login");
  };

  return logout;
}