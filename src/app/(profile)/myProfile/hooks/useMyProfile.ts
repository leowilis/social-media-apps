import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

export type MyProfile = {
  id: number;
  name: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  postCount: number;
  followerCount: number;
  followingCount: number;
  likeCount: number;
};

export function useMyProfile() {
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get("/me")
      .then((res) => {
        const p = res.data.data.profile;
        const s = res.data.data.stats;
        setProfile({
          id:             p.id,
          name:           p.name,
          username:       p.username,
          avatarUrl:      p.avatarUrl ?? null,
          bio:            p.bio ?? null,
          postCount:      s.posts      ?? 0,
          followerCount:  s.followers  ?? 0,
          followingCount: s.following  ?? 0,
          likeCount:      s.likes      ?? 0,
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { profile, isLoading };
}