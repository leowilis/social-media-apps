import type { User } from './user';

// A single comment on a post.
export interface Comment {
  id: number;
  text: string;
  createdAt: string;
  /** The user who authored the comment. */
  author: User;
  postId: number;
}
