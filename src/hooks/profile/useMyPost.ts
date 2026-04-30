import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { Post } from '@/types/post';

const fetchMyPosts = async (): Promise<Post[]> => {
  const res = await api.get('/me/posts');
  return res.data.data?.items ?? res.data.data ?? [];
};

const fetchMySavedPosts = async (): Promise<Post[]> => {
  const res = await api.get('/me/saved');
  return res.data.data?.items ?? res.data.data ?? [];
};

/**
 * Fetches the current user's posts or saved posts based on the active tab.
 * Uses TanStack Query for caching and background refetching.
 */
export function useMyPosts(tab: 'gallery' | 'saved') {
  const query = useQuery({
    queryKey: ['me', tab],
    queryFn: tab === 'gallery' ? fetchMyPosts : fetchMySavedPosts,
    staleTime: 1000 * 60 * 2,
  });

  return {
    posts: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}