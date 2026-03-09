import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

export type Post = {
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
};

type UsePostsReturn = {
  posts: Post[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  hasMore: boolean;
  loadMore: () => void;
};

export function usePosts(): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchPosts = async (currentPage: number) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const res = await api.get(`/posts?page=${currentPage}&limit=10`);
      const newPosts: Post[] = res.data.data.posts;
      

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => (currentPage === 1 ? newPosts : [...prev, ...newPosts]));
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return { posts, isLoading, isError, page, hasMore, loadMore };
}