// Base user information used across the app
export interface User {
  id: number;
  name: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
}

/**
 * Extended user profile with social stats and relationship context.
 * Used on profile pages and user detail views.
 */
export interface UserProfile extends User {
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowedByMe?: boolean;
  isMe?: boolean;
  followsMe?: boolean;
}
