// Centralized query keys for all post-related queries
export const postKeys = {
  feed: ['feed'] as const,
  explore: ['posts', 'explore'] as const,
  detail: (id: number) => ['posts', id] as const,
  me: ['me', 'posts'] as const,
};

export const likeKeys = {
  post: (postId: number) => ['posts', postId] as const,
  likes: (postId: number) => ['posts', postId, 'likes'] as const,
  feed: ['feed'] as const,
  myLikes: ['me', 'likes'] as const,
};
