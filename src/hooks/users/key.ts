// Centralized query keys for all user-related queries.
export const userKeys = {
  all: ['users'] as const,
  search: (q: string, page: number) => ['users', 'search', q, page] as const,
  profile: (username: string) => ['users', username] as const,
  posts: (username: string) => ['users', username, 'posts'] as const,
  likes: (username: string) => ['users', username, 'likes'] as const,
};
