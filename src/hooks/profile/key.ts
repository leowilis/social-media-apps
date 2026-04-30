/** Centralized query keys for all me-related queries. */
export const meKeys = {
  me: ['me'] as const,
  posts: ['me', 'posts'] as const,
  likes: ['me', 'likes'] as const,
  saved: ['me', 'saved'] as const,
  followers: ['me', 'followers'] as const,
  following: ['me', 'following'] as const,
} as const;