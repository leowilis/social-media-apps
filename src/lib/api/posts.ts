import { api } from '@/lib/axios';
import type { Post } from '@/types/post';
import type { PaginationMeta } from '@/types/pagination';

// Request Payloads

// Payload for creating a new post
export interface CreatePostPayload {
  image: File;
  caption?: string;
}

// Response Shapes

// Response returned by paginated posts endpoints
export interface PostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    pagination: PaginationMeta;
  };
}

// Response returned by single post endpoints
export interface PostResponse {
  success: boolean;
  message: string;
  data: Post;
}

// API

// Posts API — wraps all post-related endpoints
export const postsApi = {
  // Fetches a paginated list of all posts
  getAllPosts: (page = 1, limit = 20) =>
    api.get<PostsResponse>('/posts', { params: { page, limit } }),

  // Fetches a single post by ID
  getPost: (id: number) => api.get<PostResponse>(`/posts/${id}`),

  /**
   * Creates a new post with an image and optional caption.
   * Uses multipart/form-data for file upload.
   */
  createPost: (data: CreatePostPayload) => {
    const form = new FormData();
    form.append('image', data.image);
    if (data.caption) form.append('caption', data.caption);
    return api.post<PostResponse>('/posts', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Deletes a post by ID
  deletePost: (id: number) => api.delete(`/posts/${id}`),
};
