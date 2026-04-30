import { api } from '@/lib/axios';
import type { Post } from '@/types/post';
import type { PaginationMeta } from '@/types/pagination';

// Response Shapes

// Response returned by the saved posts endpoint
export interface SavedPostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    pagination: PaginationMeta;
  };
}

// API

// Saves API — wraps all post save-related endpoints
export const savesApi = {
  // Saves a post by ID
  savePost: (id: number) => api.post(`/posts/${id}/save`),

  // Unsaves a post by ID
  unsavePost: (id: number) => api.delete(`/posts/${id}/save`),

  // Fetches a paginated list of posts saved by the current user
  getMySaved: (page = 1, limit = 20) =>
    api.get<SavedPostsResponse>('/me/saved', { params: { page, limit } }),
};
