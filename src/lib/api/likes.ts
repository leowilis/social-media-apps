import { api } from '@/lib/axios';
import type { User } from '@/types/user';
import type { PaginationMeta } from '@/types/pagination';

// Response Shapes

/** Response returned by paginated likes endpoints. */
export interface LikesListResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: PaginationMeta;
  };
}

// API

// Likes API — wraps all post like-related endpoints
export const likesApi = {
  // Likes a post by ID
  likePost: (id: number) => api.post(`/posts/${id}/like`),

  // Unlikes a post by ID
  unlikePost: (id: number) => api.delete(`/posts/${id}/like`),

  // Fetches a paginated list of users who liked a post
  getPostLikes: (id: number, page = 1, limit = 20) =>
    api.get<LikesListResponse>(`/posts/${id}/likes`, {
      params: { page, limit },
    }),

  // Fetches a paginated list of posts liked by the current user
  getMyLikes: (page = 1, limit = 20) =>
    api.get(`/me/likes`, { params: { page, limit } }),
};
