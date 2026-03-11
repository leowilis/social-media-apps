"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { PostDetail } from "@/components/site/post/PostDetail";
import { api } from "@/lib/axios";

export default function PostPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const postId = Number(params.id);

  const hasSearchParams = searchParams.has("liked");
  const hasLikedParam = searchParams.has("liked");
  const hasSavedParam = searchParams.has("saved");
  const initialLiked = searchParams.get("liked") === "true";
  const initialLikeCount = searchParams.get("likeCount")
    ? Number(searchParams.get("likeCount"))
    : undefined;
  const initialSaved = searchParams.get("saved") === "true";

  const [currentUserId, setCurrentUserId] = useState<number | undefined>(
    undefined,
  );
  const [likedByMe, setLikedByMe] = useState<boolean>(initialLiked);
  const [savedByMe, setSavedByMe] = useState<boolean>(initialSaved);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fetchMe = api
      .get("/me")
      .then((res) => {
        const profile = res.data.data?.profile ?? res.data.data;
        setCurrentUserId(profile?.id);
      })
      .catch(() => {});

    if (!hasSearchParams) {
      const fetchPost = api
        .get(`/posts/${postId}`)
        .then((res) => {
          const d = res.data.data ?? res.data;
          setLikedByMe(Boolean(d.likedByMe));
        })
        .catch(() => {});

      const fetchSaved = api
        .get("/me/saved")
        .then((res) => {
          const savedPosts: any[] = res.data.data?.posts ?? res.data.data ?? [];
          setSavedByMe(savedPosts.some((p: any) => Number(p.id) === postId));
        })
        .catch(() => {});

      Promise.all([fetchMe, fetchPost, fetchSaved]).finally(() =>
        setReady(true),
      );
    } else {
      fetchMe.finally(() => setReady(true));
    }
  }, [postId, hasSearchParams]);

  if (!ready)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0e0e13]">
        <div className="size-6 rounded-full border-2 border-[#7c5cfc] border-t-transparent animate-spin" />
      </div>
    );

  return (
    <PostDetail
      postId={postId}
      currentUserId={currentUserId}
      initialLiked={likedByMe}
      initialLikeCount={initialLikeCount}
      initialSaved={savedByMe}
    />
  );
}
