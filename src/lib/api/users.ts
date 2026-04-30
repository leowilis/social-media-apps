import { api } from '@/lib/axios';
import type { UserProfile } from '@/types/user';
import type { Post } from '@/types/post';
import type { PaginationMeta } from '@/types/pagination';

// Response Shapes

// Response returned by user search endpoint
export interface UsersSearchResponse {
  success: boolean;
  message: string;
  data: {
    users: UserProfile[];
    pagination: PaginationMeta;
  };
}

// Response returned by single user profile endpoint
export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

// Response returned by paginated user posts/likes endpoints
export interface UserPostsResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    pagination: PaginationMeta;
  };
}

// API

// Users API — wraps all user-related endpoints
export const usersApi = {
  // Searches users by name or username
  searchUsers: (q: string, page = 1, limit = 20) =>
    api.get<UsersSearchResponse>('/users/search', {
      params: { q, page, limit },
    }),

  // Fetches a user's public profile by username
  getUserProfile: (username: string) =>
    api.get<UserProfileResponse>(`/users/${username}`),

  // Fetches a paginated list of posts by a user
  getUserPosts: (username: string, page = 1, limit = 20) =>
    api.get<UserPostsResponse>(`/users/${username}/posts`, {
      params: { page, limit },
    }),

  // Fetches a paginated list of posts liked by a user
  getUserLikes: (username: string, page = 1, limit = 20) =>
    api.get<UserPostsResponse>(`/users/${username}/likes`, {
      params: { page, limit },
    }),
};
