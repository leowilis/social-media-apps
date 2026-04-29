import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAppSelector } from '@/store/hooks';

// Types

export interface MeData {
  id: number;
  username: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
}

// Query Key

/** Stable query key for /me — used for targeted invalidation after PATCH /me */
export const ME_QUERY_KEY = ['me'] as const;

// Fetcher

const fetchMe = async (): Promise<MeData> => {
  const res = await api.get<{ data: MeData } | MeData>('/me');
  const payload = res.data as { data?: MeData } & MeData;
  return payload.data ?? payload;
};

// Hook

/**
 * Returns current user's profile data from the API.
 * Exposes `me` directly (not wrapped in `data`) for ergonomic usage.
 */
export function useMe() {
  const isLoggedIn = useAppSelector((s) => s.auth.isLoggedIn);

  const query = useQuery<MeData, Error>({
    queryKey: ME_QUERY_KEY,
    queryFn: fetchMe,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    me: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
