import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

type Post = {
  id: number;
  imageUrl: string;
  caption: string;
};

export function useMyPosts(tab: "gallery" | "saved") {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const endpoint = tab === "gallery" ? "/me/posts" : "/me/saved";
    api.get(endpoint)
      .then((res) => setPosts(res.data.data.items ?? []))
      .catch(() => setPosts([]))
      .finally(() => setIsLoading(false));
  }, [tab]);

  return { posts, isLoading };
}