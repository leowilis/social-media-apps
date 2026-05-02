import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useUserLikedPosts(username: string) {
  return useQuery({
    queryKey: ['posts', 'liked', username],
    queryFn: async () => {
      const res = await api.get(`/users/${username}/likes`); 
      return res.data.data.posts;
    },
    enabled: !!username,
  });
}