import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

type Post = {
  id: number;
  imageUrl: string;
  caption: string;
  likeCount?: number;
};

export function useMyPosts(tab: "gallery" | "saved") {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const endpoint = tab === "gallery" ? "/me/posts" : "/me/saved";

    api.get(endpoint)
      .then((res) => {
        const raw = res.data.data?.posts
          ?? res.data.data?.items
          ?? res.data.data
          ?? [];

        const mapped = (Array.isArray(raw) ? raw : []).map((p: any) => ({
          id:        p.id,
          imageUrl:  p.imageUrl,
          caption:   p.caption ?? "",
          likeCount: p.likeCount ?? 0,
        }));

        setPosts(mapped);
      })
      .catch(() => setPosts([]))
      .finally(() => setIsLoading(false));
  }, [tab]);

  return { posts, isLoading };
}