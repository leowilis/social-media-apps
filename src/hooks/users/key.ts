// Centralized query keys for all user-related queries.
export const userKeys = {
  all: ['users'] as const,

  lists: () => [...userKeys.all, 'list'] as const,

  list: (filters?: unknown) => [...userKeys.lists(), filters] as const,

  detail: (username: string) => [...userKeys.all, 'detail', username] as const,

  profile: (username: string) =>
    [...userKeys.all, 'profile', username] as const,

  posts: (username: string) => [...userKeys.all, 'posts', username] as const,

  likes: (username: string) => [...userKeys.all, 'likes', username] as const,

  search: (query: string, page: number, limit: number) =>
    [...userKeys.all, 'search', query, page, limit] as const,
};
