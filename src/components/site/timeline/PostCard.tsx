"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  IoHeartOutline,
  IoHeart,
  IoChatbubbleOutline,
  IoPaperPlaneOutline,
  IoBookmarkOutline,
} from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/axios";
import type { Post } from "./hooks/usePosts";

type PostCardProps = {
  post: Post;
};

// Time Ago Function
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const postTime = new Date(dateStr).getTime();
  const diffInSeconds = Math.floor((now - postTime) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1
      ? "1 minute ago"
      : `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? "1 week ago" : `${diffInWeeks} weeks ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? "1 month ago" : `${diffInMonths} months ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return diffInYears === 1 ? "1 year ago" : `${diffInYears} years ago`;
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showFull, setShowFull] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }

    const wasLiked = liked;
    // Optimistic update
    setLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      if (wasLiked) {
        await api.delete(`/posts/${post.id}/like`);
      } else {
        await api.post(`/posts/${post.id}/like`);
      }
    } catch (error) {
      console.error("Like error:", error); // Debug
      setLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    } finally {
      setIsLiking(false);
    }
  };

  const isLong = post.caption.length > 100;
  const displayCaption =
    !showFull && isLong ? post.caption.slice(0, 100) + "..." : post.caption;

  return (
    <main className="flex flex-col w-full">
      {/* Author */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Link href={`/profile/${post.author.username}`}>
          <Avatar className="size-10 border border-[rgba(126,145,183,0.32)]">
            <AvatarImage
              src={post.author.avatarUrl ?? ""}
              alt={post.author.name}
            />
            <AvatarFallback>{post.author.name[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <Link href={`/profile/${post.author.username}`}>
            <span className="text-sm font-bold text-white">
              {post.author.name}
            </span>
          </Link>
          {/* Show Time Ago */}
          <span className="text-xs text-neutral-400">
            {timeAgo(post.createdAt)}
          </span>
        </div>
      </div>

      {/* Image */}
      <div className="relative w-full rounded-3xl aspect-square overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.caption}
          fill
          className="object-cover"
          sizes="1000vw"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="flex items-center gap-1 text-white"
          >
            {liked ? (
              <IoHeart className="size-6 text-red-500" />
            ) : (
              <IoHeartOutline className="size-7" />
            )}
            <span className="text-sm">{likeCount}</span>
          </button>

          <Link
            href={`/post/${post.id}`}
            className="flex items-center gap-1 text-white"
          >
            <IoChatbubbleOutline className="size-6" />
            <span className="text-sm">{post.commentCount}</span>
          </Link>

          <button className="flex items-center gap-1 text-white">
            <IoPaperPlaneOutline className="size-6" />
          </button>
        </div>

        <button className="text-white">
          <IoBookmarkOutline className="size-7" />
        </button>
      </div>

      {/* Caption */}
      <div className="px-4 pb-4">
        <p className="text-sm text-white font-bold">{post.author.name}</p>
        <p className="text-sm text-neutral-50">
          {displayCaption}
          {isLong && (
            <button
              onClick={() => setShowFull((prev) => !prev)}
              className="ml-1 text-[var(--primary-200)] font-semibold"
            >
              {showFull ? "Show Less" : "Show More"}
            </button>
          )}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[rgba(126,145,183,0.1)]" />
    </main>
  );
}
