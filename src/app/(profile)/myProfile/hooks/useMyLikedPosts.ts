import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

type Post = {
  id: number;
  imageUrl: string;
  caption: string;
  likeCount: number;
};

async function fetchMyLikedPosts(): Promise<Post[]> {
  const res = await api.get('/me/liked');
  const raw =
    res.data.data?.posts ?? res.data.data?.items ?? res.data.data ?? [];
  return (Array.isArray(raw) ? raw : []).map(
    (p: {
      id: number;
      imageUrl: string;
      caption?: string;
      likeCount?: number;
    }) => ({
      id: p.id,
      imageUrl: p.imageUrl,
      caption: p.caption ?? '',
      likeCount: p.likeCount ?? 0,
    }),
  );
}

/** Fetches the current user's liked posts from `GET /me/liked`. */
export function useMyLikedPosts() {
  const query = useQuery({
    queryKey: ['my-liked'],
    queryFn: fetchMyLikedPosts,
  });

  return {
    posts: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
