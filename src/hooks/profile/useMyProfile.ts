import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface MyProfile {
  id: number;
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  postCount: number;
  followerCount: number;
  followingCount: number;
  likeCount: number;
}

const fetchMyProfile = async (): Promise<MyProfile> => {
  const res = await api.get('/me');
  const p = res.data.data?.profile ?? res.data.data;
  const s = res.data.data?.stats ?? {};

  return {
    id: p.id,
    name: p.name,
    username: p.username,
    avatarUrl: p.avatarUrl ?? null,
    bio: p.bio ?? null,
    postCount: s.posts ?? p.postCount ?? 0,
    followerCount: s.followers ?? p.followerCount ?? 0,
    followingCount: s.following ?? p.followingCount ?? 0,
    likeCount: s.likes ?? p.likeCount ?? 0,
  };
};

/**
 * Fetches the current authenticated user's profile and stats from GET /me.
 * Uses TanStack Query for caching and background refetching.
 */
export function useMyProfile() {
  const query = useQuery({
    queryKey: ['me', 'profile'],
    queryFn: fetchMyProfile,
    staleTime: 1000 * 60 * 5,
  });

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
