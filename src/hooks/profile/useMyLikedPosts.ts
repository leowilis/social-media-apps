import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Post } from '@/types/post';

const fetchMyLikedPosts = async (): Promise<Post[]> => {
  const res = await api.get('/me/liked');
  const raw =
    res.data.data?.posts ?? res.data.data?.items ?? res.data.data ?? [];
  return Array.isArray(raw) ? raw : [];
};

/**
 * Fetches the current user's liked posts from GET /me/liked.
 * Uses TanStack Query for caching and background refetching.
 */
export function useMyLikedPosts() {
  const query = useQuery<Post[]>({
    queryKey: ['me', 'liked'],
    queryFn: fetchMyLikedPosts,
    staleTime: 1000 * 60 * 2,
  });

  return {
    posts: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
