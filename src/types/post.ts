// Author information embedded in each post
export interface PostAuthor {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
}

// A single post returned by the API
export interface Post {
  id: number;
  imageUrl: string;
  caption?: string | null;
  createdAt: string;
  author: PostAuthor;
  likeCount: number;
  commentCount: number;
  likedByMe?: boolean;
  savedByMe?: boolean;
}
