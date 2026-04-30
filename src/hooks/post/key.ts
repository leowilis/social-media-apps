// Centralized query keys for all post-related queries
export const postKeys = {
  feed: ['feed'] as const,
  explore: ['posts', 'explore'] as const,
  detail: (id: number) => ['posts', id] as const,
  me: ['me', 'posts'] as const,
};
