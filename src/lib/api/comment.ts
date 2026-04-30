import { api } from '@/lib/axios';
import type { PaginationMeta } from '@/types/pagination';
import { User } from '@/types/user';

// Types
export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  postId: number;
  author: User;
}

// Response Shapes

// Response returned by the paginated comments endpoint
export interface CommentsResponse {
  success: boolean;
  message: string;
  data: {
    comments: Comment[];
    pagination: PaginationMeta;
  };
}

// Response returned by add comment endpoint.
export interface CommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}

// API

// Comments API — wraps all comment-related endpoints.
export const commentsApi = {
  // Fetches paginated comments for a post
  getComments: (postId: number, page = 1, limit = 10) =>
    api.get<CommentsResponse>(`/posts/${postId}/comments`, {
      params: { page, limit },
    }),

  // Adds a comment to a post.
  addComment: (postId: number, text: string) =>
    api.post<CommentResponse>(`/posts/${postId}/comments`, { text }),

  // Deletes a comment by ID.
  deleteComment: (commentId: number) => api.delete(`/comments/${commentId}`),
};
