import { api } from '@/lib/axios';
import type { PaginationMeta } from '@/types/pagination';
import type { User } from '@/types/user';

// Types
export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  postId: number;
  author: User;
}

// Response Shapes
export interface CommentsResponse {
  success: boolean;
  message: string;
  data: {
    comments: Comment[];
    pagination: PaginationMeta;
  };
}

export interface CommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}

// API
export const commentsApi = {
  getComments: (postId: number, page = 1, limit = 10) =>
    api.get<CommentsResponse>(`/posts/${postId}/comments`, {
      params: { page, limit },
    }),

  addComment: (postId: number, text: string) =>
    api.post<CommentResponse>(`/posts/${postId}/comments`, {
      text,
    }),

  deleteComment: (commentId: number) => api.delete(`/comments/${commentId}`),
};
