"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IoHeartOutline,
  IoHeart,
  IoChatbubbleOutline,
  IoBookmarkOutline,
  IoBookmark,
  IoArrowBack,
  IoCheckmark,
  IoTrashOutline,
  IoCloseOutline,
  IoEllipsisVertical,
} from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/axios";
import { CommentSection } from "@/components/site/post/CommentSection";
import { LikesSheet } from "@/components/features/likes/LikesSheet";

interface PostDetailData {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
  author: { id: number; username: string; name: string; avatarUrl?: string };
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 604800)}w ago`;
}

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
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,92,252,0.1)",
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

function DeleteCommentDialog({
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
            This comment will be permanently removed and cannot be undone.
          </p>
        </div>
        <div className="flex gap-2.5 px-5 pb-5 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-95"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-95"
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

function DeletePostDialog({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
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
          <p className="text-base font-bold text-white mb-1">Delete Post?</p>
          <p className="text-sm text-neutral-500 leading-relaxed">
            This post will be permanently removed and cannot be undone.
          </p>
        </div>
        <div className="flex gap-2.5 px-5 pb-5 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-95"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
              boxShadow: "0 4px 16px rgba(239,68,68,0.35)",
            }}
          >
            {loading ? (
              <div className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export function PostDetail({
  postId,
  currentUserId,
  initialLiked,
  initialLikeCount,
  initialSaved,
  onClose,
}: {
  postId: number;
  currentUserId?: number;
  initialLiked?: boolean;
  initialLikeCount?: number;
  initialSaved?: boolean;
  onClose?: () => void;
}) {
  const router = useRouter();
  const [post, setPost] = useState<PostDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(initialLiked ?? false);
  const [likeCount, setLikeCount] = useState(initialLikeCount ?? 0);
  const [saved, setSaved] = useState(initialSaved ?? false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [showLikes, setShowLikes] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [showDeletePost, setShowDeletePost] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);

  const showNotif = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  useEffect(() => {
    Promise.all([
      api.get(`/posts/${postId}`),
      api.get(`/me/saved`).catch(() => null),
    ])
      .then(([postRes, savedRes]) => {
        const d = postRes.data.data ?? postRes.data;
        setPost(d);
        if (initialLiked === undefined) setLiked(Boolean(d.likedByMe));
        if (initialLikeCount === undefined)
          setLikeCount(Number(d.likeCount) || 0);
        setCommentCount(Number(d.commentCount) || 0);
        if (initialSaved === undefined) {
          if (d.savedByMe !== undefined) {
            setSaved(Boolean(d.savedByMe));
          } else if (savedRes) {
            const savedPosts: any[] =
              savedRes.data.data?.posts ?? savedRes.data.data ?? [];
            setSaved(savedPosts.some((p: any) => p.id === postId));
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId]);

  const handleLike = async () => {
    const wasLiked = liked;
    const newLikeCount = wasLiked ? likeCount - 1 : likeCount + 1;
    setLiked(!wasLiked);
    setLikeCount(newLikeCount);
    try {
      if (wasLiked) await api.delete(`/posts/${postId}/like`);
      else await api.post(`/posts/${postId}/like`);
      localStorage.setItem(
        `post_like_${postId}`,
        JSON.stringify({ liked: !wasLiked, likeCount: newLikeCount }),
      );
    } catch {
      setLiked(wasLiked);
      setLikeCount(likeCount);
      localStorage.removeItem(`post_like_${postId}`);
    }
  };

  const handleSave = async () => {
    const wasSaved = saved;
    setSaved(!wasSaved);
    try {
      if (wasSaved) {
        await api.delete(`/posts/${postId}/save`);
        showNotif("Removed from saved");
      } else {
        await api.post(`/posts/${postId}/save`);
        showNotif("Post saved!");
      }
    } catch {
      setSaved(wasSaved);
    }
  };

  const handleDeletePost = async () => {
    setDeletingPost(true);
    try {
      await api.delete(`/posts/${postId}`);
      router.back();
    } catch {
      setDeletingPost(false);
      setShowDeletePost(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0e0e13]">
        <div className="size-6 rounded-full border-2 border-[#7c5cfc] border-t-transparent animate-spin" />
      </div>
    );

  if (!post)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0e0e13] text-neutral-400 text-sm">
        Post not found
      </div>
    );

  // ── SHARED: actions bar (used in both mobile & desktop)
  const actionsBar = (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <button onClick={handleLike} className="text-white">
            {liked ? (
              <IoHeart className="size-6 text-red-500" />
            ) : (
              <IoHeartOutline className="size-6" />
            )}
          </button>
          <button
            onClick={() => setShowLikes(true)}
            className="text-sm text-white"
          >
            {likeCount}
          </button>
        </div>
        <button
          onClick={() => setShowComments(true)}
          className="flex items-center gap-1 text-white md:hidden"
        >
          <IoChatbubbleOutline className="size-6" />
          <span className="text-sm">{commentCount}</span>
        </button>
        <div className="hidden md:flex items-center gap-1 text-white">
          <IoChatbubbleOutline className="size-6" />
          <span className="text-sm">{commentCount}</span>
        </div>
      </div>
      <button
        onClick={handleSave}
        className="text-white transition-transform active:scale-90"
      >
        {saved ? (
          <IoBookmark
            className="size-6"
            style={{
              color: "#a78bff",
              filter: "drop-shadow(0 0 6px rgba(167,139,255,0.7))",
            }}
          />
        ) : (
          <IoBookmarkOutline className="size-6" />
        )}
      </button>
    </div>
  );

  return (
    <>
      <Toast message={toastMsg} show={showToast} />
      {showLikes && (
        <LikesSheet
          postId={postId}
          likeCount={likeCount}
          onClose={() => setShowLikes(false)}
        />
      )}
      {deleteTarget !== null && (
        <DeleteCommentDialog
          onConfirm={() => {
            window.dispatchEvent(
              new CustomEvent("confirm-delete-comment", {
                detail: deleteTarget,
              }),
            );
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {showDeletePost && (
        <DeletePostDialog
          onConfirm={handleDeletePost}
          onCancel={() => setShowDeletePost(false)}
          loading={deletingPost}
        />
      )}

      {/* ══════════════ MOBILE ══════════════ */}
      <div className="flex flex-col min-h-screen bg-[#0e0e13] text-white md:hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-5">
          <button onClick={() => router.back()} className="text-white">
            <IoArrowBack className="size-5" />
          </button>
          <span className="text-md font-bold">Post</span>
        </div>
        {/* Author */}
        <div className="flex items-center gap-3 px-4 pb-3">
          <Link href={`/profile/${post.author.username}`}>
            <Avatar className="size-12 border border-[rgba(126,145,183,0.32)]">
              <AvatarImage
                src={post.author.avatarUrl ?? ""}
                alt={post.author.name}
              />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <Link href={`/profile/${post.author.username}`}>
              <span className="text-sm font-bold">{post.author.name}</span>
            </Link>
            <span className="text-xs text-neutral-400">
              {timeAgo(post.createdAt)}
            </span>
          </div>
        </div>
        {/* Image */}
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.caption}
            fill
            className="object-cover"
            sizes="100vw"
          />
          {currentUserId !== undefined && currentUserId === post.author.id && (
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={() => setShowPostMenu((p) => !p)}
                className="flex items-center justify-center size-9 rounded-full"
                style={{
                  background: "rgba(10,10,18,0.65)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <IoEllipsisVertical className="size-5 text-white" />
              </button>
              {showPostMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowPostMenu(false)}
                  />
                  <div
                    className="absolute right-0 top-11 z-20 rounded-2xl overflow-hidden min-w-[140px]"
                    style={{
                      background:
                        "linear-gradient(160deg, rgba(26,26,40,0.99) 0%, rgba(15,15,25,1) 100%)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                    }}
                  >
                    <button
                      onClick={() => {
                        setShowPostMenu(false);
                        setShowDeletePost(true);
                      }}
                      className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                    >
                      <IoTrashOutline className="size-4" />
                      Delete Post
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {/* Actions */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button onClick={handleLike} className="text-white">
                {liked ? (
                  <IoHeart className="size-6 text-red-500" />
                ) : (
                  <IoHeartOutline className="size-6" />
                )}
              </button>
              <button
                onClick={() => setShowLikes(true)}
                className="text-sm text-white"
              >
                {likeCount}
              </button>
            </div>
            <button
              onClick={() => setShowComments(true)}
              className="flex items-center gap-1 text-white"
            >
              <IoChatbubbleOutline className="size-6" />
              <span className="text-sm">{commentCount}</span>
            </button>
          </div>
          <button
            onClick={handleSave}
            className="text-white transition-transform active:scale-90"
          >
            {saved ? (
              <IoBookmark
                className="size-6"
                style={{
                  color: "#a78bff",
                  filter: "drop-shadow(0 0 6px rgba(167,139,255,0.7))",
                }}
              />
            ) : (
              <IoBookmarkOutline className="size-6" />
            )}
          </button>
        </div>
        {/* Caption */}
        <div className="px-4 pb-6">
          <span className="text-sm font-bold mr-2">{post.author.name}</span>
          <br />
          <span className="text-sm text-neutral-200">{post.caption}</span>
        </div>
        {/* Comment trigger */}
        <button
          onClick={() => setShowComments(true)}
          className="mx-4 mb-28 text-left text-sm text-neutral-500 rounded-2xl px-4 py-6"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          Add Comment...
        </button>
        {/* Mobile comment sheet */}
        {showComments && (
          <CommentSection
            postId={postId}
            currentUserId={currentUserId}
            onClose={() => setShowComments(false)}
            onCommentAdded={() => setCommentCount((p) => p + 1)}
            onCommentDeleted={() => setCommentCount((p) => Math.max(0, p - 1))}
            onDeleteRequest={(id) => setDeleteTarget(id)}
          />
        )}
      </div>

      {/* ══════════════ DESKTOP ══════════════ */}
      <div
        className="hidden md:flex fixed inset-0 z-30 items-center justify-center bg-black/70 backdrop-blur-xl"
        onClick={() => (onClose ? onClose() : router.back())}
      >
        <div
          className="flex w-[1100px] max-w-[95vw] h-[700px] max-h-[92vh] rounded-2xl overflow-hidden bg-[#0e0e13] border border-[rgba(255,255,255,0.08)] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* LEFT: image only */}
          <div className="relative w-[580px] shrink-0 bg-black">
            <Image
              src={post.imageUrl}
              alt={post.caption}
              fill
              className="object-cover"
              sizes="480px"
            />
          </div>

          {/* RIGHT: author + caption + comments + actions */}
          <div className="flex flex-col flex-1 min-w-0 bg-[#0e0e13]">
            {/* Author row + close + 3-dot */}
            <div className="flex items-center justify-between px-4 py-2 shrink-0">
              <div className="flex items-center gap-3">
                <Link
                  href={`/profile/${post.author.username}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Avatar className="size-9 border border-[rgba(126,145,183,0.32)]">
                    <AvatarImage
                      src={post.author.avatarUrl ?? ""}
                      alt={post.author.name}
                    />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col">
                  <Link
                    href={`/profile/${post.author.username}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-sm font-bold text-white">
                      {post.author.name}
                    </span>
                  </Link>
                  <span className="text-xs text-neutral-400">
                    {timeAgo(post.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {currentUserId !== undefined &&
                  currentUserId === post.author.id && (
                    <div className="relative">
                      <button
                        onClick={() => setShowPostMenu((p) => !p)}
                        className="flex items-center justify-center size-8 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <IoEllipsisVertical className="size-4" />
                      </button>
                      {showPostMenu && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowPostMenu(false)}
                          />
                          <div
                            className="absolute right-0 top-9 z-20 rounded-2xl overflow-hidden min-w-[140px]"
                            style={{
                              background:
                                "linear-gradient(160deg, rgba(26,26,40,0.99) 0%, rgba(15,15,25,1) 100%)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                            }}
                          >
                            <button
                              onClick={() => {
                                setShowPostMenu(false);
                                setShowDeletePost(true);
                              }}
                              className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                            >
                              <IoTrashOutline className="size-4" />
                              Delete Post
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                <button
                  onClick={() => (onClose ? onClose() : router.back())}
                  className="flex items-center justify-center size-8 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <IoCloseOutline className="size-5" />
                </button>
              </div>
            </div>

            {/* Caption */}
            <div className="px-4 py-3 shrink-0">
              <span className="text-sm text-neutral-200">{post.caption}</span>
            </div>

            {actionsBar}

            {/* Comments — fills remaining space */}
            <div className="flex-1 overflow-hidden">
              <CommentSection
                postId={postId}
                currentUserId={currentUserId}
                inline
                onCommentAdded={() => setCommentCount((p) => p + 1)}
                onCommentDeleted={() =>
                  setCommentCount((p) => Math.max(0, p - 1))
                }
                onDeleteRequest={(id) => setDeleteTarget(id)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
