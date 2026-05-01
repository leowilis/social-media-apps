import { api } from '@/lib/axios';
import type { AuthUser } from '@/types/auth';
import type { Post } from '@/types/post';
import type { User } from '@/types/user';
import type { PaginationMeta } from '@/types/pagination';

// Request Payloads

// Payload for updating the current user's profile. All fields are optional
export interface UpdateProfilePayload {
  name?: string;
  username?: string;
  phone?: string;
  bio?: string;
  avatar?: File;
}

// Response Shapes

// Response returned by GET /me endpoint
export interface MeResponse {
  success: boolean;
  message: string;
  data: {
    profile: AuthUser;
    stats: {
      posts: number;
      followers: number;
      following: number;
      likes: number;
    };
  };
}
// Response returned by paginated /me/* endpoints
export interface MeListResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
}

// API

// Me API — wraps all endpoints related to the current authenticated user
export const meApi = {
  // Fetches the current authenticated user's profile
  getMe: () => api.get<MeResponse>('/me'),

  /**
   * Updates the current user's profile.
   * Automatically uses multipart/form-data when an avatar file is provided.
   */
  updateMe: (data: UpdateProfilePayload) => {
    if (data.avatar) {
      const form = new FormData();
      Object.entries(data).forEach(([key, val]) => {
        if (val !== undefined) form.append(key, val as string | Blob);
      });
      return api.patch('/me', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.patch('/me', data);
  },

  // Fetches a paginated list of posts by the current user
  getMyPosts: (page = 1, limit = 20) =>
    api.get<MeListResponse<Post>>('/me/posts', { params: { page, limit } }),

  // Fetches a paginated list of posts liked by the current user
  getMyLikes: (page = 1, limit = 20) =>
    api.get<MeListResponse<Post>>('/me/likes', { params: { page, limit } }),

  // Fetches a paginated list of posts saved by the current user
  getMySaved: (page = 1, limit = 20) =>
    api.get<MeListResponse<Post>>('/me/saved', { params: { page, limit } }),

  // Fetches a paginated list of the current user's followers
  getMyFollowers: (page = 1, limit = 20) =>
    api.get<MeListResponse<User>>('/me/followers', { params: { page, limit } }),

  // Fetches a paginated list of users the current user is following
  getMyFollowing: (page = 1, limit = 20) =>
    api.get<MeListResponse<User>>('/me/following', { params: { page, limit } }),
};
