import { api } from '@/lib/axios';
import type { User } from '@/types/user';
import type { PaginationMeta } from '@/types/pagination';

// Response Shapes

// Response returned by paginated followers/following endpoints
export interface FollowListResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: PaginationMeta;
  };
}

// API

// Follow API — wraps all follow-related endpoints
export const followApi = {
  // Follows a user by username
  follow: (username: string) => api.post(`/follow/${username}`),

  /** Unfollows a user by username. */
  unfollow: (username: string) => api.delete(`/follow/${username}`),

  // Fetches a paginated list of followers for a user
  getUserFollowers: (username: string, page = 1, limit = 20) =>
    api.get<FollowListResponse>(`/users/${username}/followers`, {
      params: { page, limit },
    }),

  // Fetches a paginated list of users that a user is following
  getUserFollowing: (username: string, page = 1, limit = 20) =>
    api.get<FollowListResponse>(`/users/${username}/following`, {
      params: { page, limit },
    }),
};
