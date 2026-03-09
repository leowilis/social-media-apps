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
    api
      .get("/me")
      .then((res) => {
        setProfile(res.data.data.profile);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { profile, isLoading };
}
