import { api } from '@/lib/axios';
import type { Post } from '@/types/post';
import type { PaginationMeta } from '@/types/pagination';

// Response Shapes

// Response returned by the feed endpoint
export interface FeedResponse {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
    pagination: PaginationMeta;
  };
}

// API Endpoints

// Feed API — wraps the paginated post feed endpoint
export const feedApi = {
  // Fetches a paginated list of posts for the current user's feed
  getFeed: (page = 1, limit = 20) =>
    api.get<FeedResponse>('/feed', { params: { page, limit } }),
};
