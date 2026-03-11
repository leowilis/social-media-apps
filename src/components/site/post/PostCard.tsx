"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IoHeartOutline,
  IoHeart,
  IoChatbubbleOutline,
  IoPaperPlaneOutline,
  IoBookmarkOutline,
  IoBookmark,
  IoCheckmark,
  IoTrashOutline,
} from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/axios";
import { CommentSection } from "@/components/site/post/CommentSection";
import { LikesSheet } from "@/components/features/likes/LikesSheet";
import type { Post } from "./hooks/usePosts";

type PostCardProps = { post: Post; currentUserId?: number };

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  const m = Math.floor(diff / 60);
  if (m < 60) return m === 1 ? "1 minute ago" : `${m} minutes ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return h === 1 ? "1 hour ago" : `${h} hours ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return d === 1 ? "1 day ago" : `${d} days ago`;
  const w = Math.floor(d / 7);
  if (w < 4) return w === 1 ? "1 week ago" : `${w} weeks ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return mo === 1 ? "1 month ago" : `${mo} months ago`;
  const y = Math.floor(d / 365);
  return y === 1 ? "1 year ago" : `${y} years ago`;
}

// ── Toast 
function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div
      className="fixed top-5 left-1/2 z-[999] flex items-center gap-2 px-4 py-2.5 rounded-2xl pointer-events-none"
      style={{
        transform: `translateX(-50%) translateY(${show ? 0 : -20}px)`,
        opacity: show ? 1 : 0,
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        background:
          "linear-gradient(135deg, rgba(26,26,40,0.98) 0%, rgba(15,15,25,0.98) 100%)",
        border: "1px solid rgba(124,92,252,0.3)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        backdropFilter: "blur(16px)",
        whiteSpace: "nowrap",
      }}
    >
      <div
        className="flex items-center justify-center size-5 rounded-full shrink-0"
        style={{ background: "linear-gradient(135deg, #9b7dff, #7c5cfc)" }}
      >
        <IoCheckmark className="size-3 text-white" />
      </div>
      <span className="text-sm font-semibold text-white">{message}</span>
    </div>
  );
}

// ── Delete Dialog 
function DeleteDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-[998] bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999] w-[85vw] max-w-xs rounded-3xl overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(20,20,32,0.99) 0%, rgba(10,10,18,1) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
        }}
      >
        <div className="flex justify-center pt-6 pb-2">
          <div
            className="flex items-center justify-center size-14 rounded-2xl"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <IoTrashOutline className="size-7 text-red-400" />
          </div>
        </div>
        <div className="px-6 py-3 text-center">
          <p className="text-base font-bold text-white mb-1">Delete Comment?</p>
          <p className="text-sm text-neutral-500 leading-relaxed">
            This comment will be permanently removed.
          </p>
        </div>
        <div className="flex gap-2.5 px-5 pb-5 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
              boxShadow: "0 4px 16px rgba(239,68,68,0.35)",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

// Main components
export function PostCard({ post, currentUserId }: PostCardProps) {
  const [liked, setLiked] = useState(post.likedByMe);
const [likeCount, setLikeCount] = useState(post.likeCount);
const [commentCount, setCommentCount] = useState(post.commentCount);
const [saved, setSaved] = useState(post.savedByMe ?? false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  useEffect(() => {
  setLiked(Boolean(post.likedByMe));
  setLikeCount(post.likeCount);
  setCommentCount(post.commentCount);
  setSaved(Boolean(post.savedByMe));
}, [post]);

  const showNotif = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((p) => (wasLiked ? p - 1 : p + 1));
    try {
      if (wasLiked) await api.delete(`/posts/${post.id}/like`);
      else await api.post(`/posts/${post.id}/like`);
    } catch {
      setLiked(wasLiked);
      setLikeCount((p) => (wasLiked ? p + 1 : p - 1));
    } finally {
      setIsLiking(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const wasSaved = saved;
    setSaved(!wasSaved);
    try {
      if (wasSaved) {
        await api.delete(`/posts/${post.id}/save`);
        showNotif("Removed from saved");
      } else {
        await api.post(`/posts/${post.id}/save`);
        showNotif("Post saved!");
      }
    } catch {
      setSaved(wasSaved);
    } finally {
      setIsSaving(false);
    }
  };

  const isLong = post.caption.length > 100;
  const displayCaption =
    !showFull && isLong ? post.caption.slice(0, 100) + "..." : post.caption;

  return (
    <>
      <Toast message={toastMsg} show={showToast} />

      {deleteTarget !== null && (
        <DeleteDialog
          onConfirm={() => {
            const event = new CustomEvent("confirm-delete-comment", {
              detail: deleteTarget,
            });
            window.dispatchEvent(event);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

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
            <span className="text-xs text-neutral-400">
              {timeAgo(post.createdAt)}
            </span>
          </div>
        </div>

        {/* Image */}
        <Link href={`/post/${post.id}?liked=${liked}&likeCount=${likeCount}`}>
          <div className="relative w-full rounded-3xl aspect-square overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.caption}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <div className="flex items-center gap-3">
            {/* Like icon + count (separate buttons) */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className="text-white"
              >
                {liked ? (
                  <IoHeart className="size-6 text-red-500" />
                ) : (
                  <IoHeartOutline className="size-6" />
                )}
              </button>
              <button
                onClick={() => setShowLikes(true)}
                className="text-sm text-white hover:text-[#a78bff] transition-colors min-w-[16px] text-left"
              >
                {likeCount}
              </button>
            </div>

            {/* Comment icon + count */}
            <button
              onClick={() => setShowComments(true)}
              className="flex items-center gap-1 text-white"
            >
              <IoChatbubbleOutline className="size-6" />
              <span className="text-sm">{commentCount}</span>
            </button>

            <button className="text-white">
              <IoPaperPlaneOutline className="size-6" />
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`text-white transition-transform active:scale-90 ${isSaving ? "opacity-50" : ""}`}
          >
            {saved ? (
              <IoBookmark className="size-7 text-[#7c5cfc]" />
            ) : (
              <IoBookmarkOutline className="size-7" />
            )}
          </button>
        </div>

        {/* Caption */}
        <div className="px-4 pb-4">
          <p className="text-sm text-white font-bold">{post.author.name}</p>
          <p className="text-sm text-neutral-50">
            {displayCaption}
            {isLong && (
              <button
                onClick={() => setShowFull((p) => !p)}
                className="ml-1 text-[var(--primary-200)] font-semibold"
              >
                {showFull ? "Show Less" : "Show More"}
              </button>
            )}
          </p>
        </div>

        <div className="h-px w-full bg-[rgba(126,145,183,0.1)]" />
      </main>

      {showLikes && (
        <LikesSheet
          postId={post.id}
          likeCount={likeCount}
          onClose={() => setShowLikes(false)}
        />
      )}

      {showComments && (
        <CommentSection
          postId={post.id}
          currentUserId={currentUserId}
          onClose={() => setShowComments(false)}
          onCommentAdded={() => setCommentCount((p) => p + 1)}
          onCommentDeleted={() => setCommentCount((p) => Math.max(0, p - 1))}
          onDeleteRequest={(id) => setDeleteTarget(id)}
        />
      )}
    </>
  );
}
