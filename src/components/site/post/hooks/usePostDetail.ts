import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

export type PostDetail = {
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
  likedByMe: boolean;
  savedByMe: boolean;
};

export function usePostDetail(postId: number | string | null) {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!postId) return;
    setPost(null);
    setIsLoading(true);
    setIsError(false);

    api
      .get(`/posts/${postId}`)
      .then((res) => {
        const p = res.data.data;
        setPost({
          ...p,
          likedByMe: Boolean(p.likedByMe),
          savedByMe: Boolean(p.savedByMe),
        });
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, [postId]);

  return { post, isLoading, isError };
}