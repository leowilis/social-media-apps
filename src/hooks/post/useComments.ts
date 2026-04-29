import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/axios";

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    name: string;
    avatarUrl?: string;
  };
}

interface RawComment {
  id: number;
  text: string;
  createdAt: string;
  author: Comment["author"];
}

interface CommentsResponse {
  data?: {
    comments?: RawComment[];
    pagination?: { total: number };
  } | RawComment[];
}

export function useComments(postId: number | string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchComments = useCallback(async (p = 1, replace = false) => {
    setIsLoading(true);
    try {
      const res = await api.get<CommentsResponse>(`/posts/${postId}/comments`, {
        params: { page: p, limit: 10 },
      });

      const raw: RawComment[] = (res.data.data as { comments?: RawComment[] })?.comments
        ?? (res.data.data as RawComment[])
        ?? [];
      const total: number = (res.data.data as { pagination?: { total: number } })?.pagination?.total ?? raw.length;

      const data: Comment[] = raw.map((c) => ({
        id:        c.id,
        content:   c.text,
        createdAt: c.createdAt,
        author:    c.author,
      }));

      setComments((prev) => replace ? data : [...prev, ...data]);
      setHasMore((replace ? data.length : comments.length + data.length) < total);
      setPage(p);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [postId, comments.length]);

  useEffect(() => {
    fetchComments(1, true);
  }, [postId]);

  const loadMore = () => {
    if (!isLoading && hasMore) fetchComments(page + 1);
  };

  const addComment = useCallback(async (content: string) => {
    if (!content.trim() || isSending) return;
    setIsSending(true);
    try {
      const res = await api.post<{ data?: RawComment } & RawComment>(
        `/posts/${postId}/comments`,
        { text: content }
      );
      const d = res.data.data ?? res.data;
      const newComment: Comment = {
        id:        d.id,
        content:   d.text ?? content,
        createdAt: d.createdAt ?? new Date().toISOString(),
        author:    d.author,
      };
      setComments((prev) => [newComment, ...prev]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  }, [postId, isSending]);

  const deleteComment = useCallback(async (commentId: number) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return { comments, isLoading, isSending, hasMore, loadMore, addComment, deleteComment };
}