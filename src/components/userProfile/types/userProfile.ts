export interface Profile {
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  likes_count: number;
  is_following: boolean;
}

export interface Post {
  id: number | string;
  image?: string;
  likes_count: number;
}

export interface User {
  id: number | string;
  username: string;
  name: string;
  avatar?: string;
}

export type TabType = "gallery" | "liked";
export type ModalType = "followers" | "following" | null;