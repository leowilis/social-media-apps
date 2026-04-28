import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

// Full post data including the current user's like/save status
export type PostDetailData = {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    name: string;
    avatarUrl: string | null;
  };
  likeCount: number;
  commentCount: number;
  // Whether the current user has liked this post
  likedByMe: boolean;
  // Whether the current user has saved this post
  savedByMe: boolean;
};

// Fetches a single post from `GET /posts/:postId`
async function fetchPostDetail(postId: number | string): Promise<PostDetailData> {
  const res = await api.get(`/posts/${postId}`);
  const p = res.data.data;
  return {
    ...p,
    likedByMe: Boolean(p.likedByMe),
    savedByMe: Boolean(p.savedByMe),
  };
}

/**
 * Fetches post detail data by `postId`
 * Query is skipped if `postId` is null
 */
export function usePostDetail(postId: number | string | null) {
  const query = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostDetail(postId!),
    enabled: postId !== null,
  });

  return {
    post: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}