"use client";

import { createContext, useContext, useState } from "react";

type LikeState = {
  [postId: number]: {
    liked: boolean;
    likeCount: number;
  };
};

type LikeContextType = {
  likes: LikeState;
  setLike: (postId: number, liked: boolean, likeCount: number) => void;
};

const LikeContext = createContext<LikeContextType | null>(null);

export function LikeProvider({ children }: { children: React.ReactNode }) {
  const [likes, setLikes] = useState<LikeState>({});

  const setLike = (postId: number, liked: boolean, likeCount: number) => {
    setLikes((prev) => ({
      ...prev,
      [postId]: {
        liked,
        likeCount,
      },
    }));
  };

  return (
    <LikeContext.Provider value={{ likes, setLike }}>
      {children}
    </LikeContext.Provider>
  );
}

export function useLike() {
  const ctx = useContext(LikeContext);
  if (!ctx) throw new Error("useLike must be inside LikeProvider");
  return ctx;
}