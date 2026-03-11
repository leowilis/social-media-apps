"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PostList } from "@/components/site/post/PostList";
import { PostDetail } from "@/components/site/post/PostDetail";
import { api } from "@/lib/axios";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postId = searchParams.get("postId") ? Number(searchParams.get("postId")) : null;

  const [currentUserId, setCurrentUserId] = useState<number | undefined>(undefined);
  const [initialLiked, setInitialLiked]   = useState<boolean>(false);
  const [initialSaved, setInitialSaved]   = useState<boolean>(false);
  const [initialLikeCount, setInitialLikeCount] = useState<number>(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api.get("/me").then((res) => {
      const profile = res.data.data?.profile ?? res.data.data;
      setCurrentUserId(profile?.id);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!postId) { setReady(false); return; }
    setInitialLiked(searchParams.get("liked") === "true");
    setInitialSaved(searchParams.get("saved") === "true");
    setInitialLikeCount(Number(searchParams.get("likeCount")) || 0);
    setReady(true);
  }, [postId]);

  const handleClose = () => {
    router.push("?", { scroll: false });
  };

  return (
    <>
      <PostList />

      {/* Desktop post overlay */}
      {postId && ready && (
        <div className="hidden md:block">
          <PostDetail
            postId={postId}
            currentUserId={currentUserId}
            initialLiked={initialLiked}
            initialLikeCount={initialLikeCount}
            initialSaved={initialSaved}
            onClose={handleClose}
          />
        </div>
      )}
    </>
  );
}