"use client";

import { useState, useEffect, useRef } from "react";
import { useUserProfile } from "./hooks/useUserProfile";
import { api } from "@/lib/axios";
import { User } from "./types/userProfile";

function fmt(n = 0) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function Spinner({
  size = 28,
  color = "#7c5cfc",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: "3px solid #2a2a35",
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}

function Avatar({
  src,
  name,
  size = 44,
}: {
  src?: string | null;
  name: string;
  size?: number;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#7c5cfc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        color: "#fff",
        fontSize: size * 0.38,
        flexShrink: 0,
      }}
    >
      {name?.[0]?.toUpperCase()}
    </div>
  );
}

function Modal({
  title,
  onClose,
  loading,
  users,
}: {
  title: string;
  onClose: () => void;
  loading: boolean;
  users: User[];
}) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          maxHeight: "70vh",
          background: "#16161e",
          borderRadius: 16,
          border: "1px solid #2a2a35",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "fadeScale 0.2s ease",
        }}
      >
        <style>{`@keyframes fadeScale { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>
        <div
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #222230",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 16, color: "#f0f0f8" }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#666",
              fontSize: 24,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {loading ? (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 32 }}
            >
              <Spinner />
            </div>
          ) : users.length === 0 ? (
            <div
              style={{
                padding: 32,
                textAlign: "center",
                color: "#444",
                fontSize: 14,
              }}
            >
              No users found
            </div>
          ) : (
            users.map((u) => (
              <div
                key={String(u.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 20px",
                  borderBottom: "1px solid #1e1e28",
                }}
              >
                <Avatar src={u.avatar} name={u.name} size={44} />
                <div>
                  <div
                    style={{ fontWeight: 600, fontSize: 14, color: "#f0f0f8" }}
                  >
                    {u.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#555" }}>
                    @{u.username}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function PostModal({
  postId,
  onClose,
}: {
  postId: number | string;
  onClose: () => void;
}) {
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPost(null);
    setIsLoading(true);
    setIsError(false);
    setComments([]);

    api
      .get(`/posts/${postId}`)
      .then((res) => {
        const p = res.data.data;
        setPost(p);
        setLiked(Boolean(p.likedByMe));
        setLikeCount(p.likeCount ?? 0);
        setSaved(Boolean(p.savedByMe));
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));

    api
      .get(`/posts/${postId}/comments`)
      .then((res) => {
        const raw = res.data.data;
        setComments(Array.isArray(raw) ? raw : (raw?.comments ?? []));
      })
      .catch(() => setComments([]));
  }, [postId]);

  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => (wasLiked ? c - 1 : c + 1));
    try {
      if (wasLiked) {
        await api.delete(`/posts/${postId}/like`);
      } else {
        await api.post(`/posts/${postId}/like`);
      }
    } catch {
      setLiked(wasLiked);
      setLikeCount((c) => (wasLiked ? c + 1 : c - 1));
    }
  };

  const handleSave = async () => {
    const wasSaved = saved;
    setSaved(!wasSaved);
    try {
      if (wasSaved) {
        await api.delete(`/posts/${postId}/save`);
      } else {
        await api.post(`/posts/${postId}/save`);
      }
    } catch {
      setSaved(wasSaved);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/posts/${postId}/comments`, {
        content: commentText,
      });
      const newComment = res.data.data;
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        .pm-close:hover    { background: rgba(255,255,255,0.15) !important; }
        .pm-like:hover     { transform: scale(1.15); }
        .pm-send:hover     { opacity: 1 !important; }
        .pm-comment-item:last-child { border-bottom: none !important; }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 980,
          height: "88vh",
          background: "#111117",
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
          animation: "slideUp 0.22s ease",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          className="pm-close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 10,
            background: "rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            width: 36,
            height: 36,
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
        >
          ×
        </button>

        {/* LEFT — Image */}
        <div
          style={{
            flex: "0 0 58%",
            background: "#0a0a0f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {isLoading || !post ? (
            <Spinner size={36} />
          ) : (
            <img
              src={post.imageUrl}
              alt={post.caption ?? ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          )}
        </div>

        {/* RIGHT — detail + comments */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            background: "#111117",
            minWidth: 0,
          }}
        >
          {isLoading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Spinner />
            </div>
          ) : isError || !post ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                color: "#444",
                fontSize: 14,
              }}
            >
              Failed to load post
            </div>
          ) : (
            <>
              {/* Author header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "16px 18px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  flexShrink: 0,
                }}
              >
                <Avatar
                  src={post.author?.avatarUrl}
                  name={post.author?.name ?? "?"}
                  size={36}
                />
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 13.5,
                      color: "#f0f0f8",
                    }}
                  >
                    {post.author?.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#555", marginTop: 1 }}>
                    {timeAgo(post.createdAt)}
                  </div>
                </div>
              </div>

              {/* Caption */}
              {post.caption && (
                <div
                  style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    flexShrink: 0,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13.5,
                      color: "#d0d0e0",
                      lineHeight: 1.65,
                    }}
                  >
                    {post.caption}
                  </p>
                </div>
              )}

              {/* Like / Comment / Save row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 18px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {/* Like */}
                  <button
                    className="pm-like"
                    onClick={handleLike}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: liked ? "#ef4444" : "#666",
                      transition: "transform 0.15s",
                      padding: 0,
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={liked ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: liked ? "#ef4444" : "#666",
                      }}
                    >
                      {likeCount}
                    </span>
                  </button>

                  {/* Comment */}
                  <button
                    onClick={() => commentInputRef.current?.focus()}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#666",
                      padding: 0,
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    <span
                      style={{ fontSize: 13, fontWeight: 600, color: "#666" }}
                    >
                      {comments.length}
                    </span>
                  </button>
                </div>

                {/* Save */}
                <button
                  onClick={handleSave}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: saved ? "#7c5cfc" : "#666",
                    padding: 0,
                    transition: "color 0.2s",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={saved ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                  </svg>
                </button>
              </div>

              {/* Comments section */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "0",
                }}
              >
                {/* Comments header */}
                <div style={{ padding: "12px 18px 8px", flexShrink: 0 }}>
                  <span
                    style={{ fontWeight: 700, fontSize: 13, color: "#f0f0f8" }}
                  >
                    Comments
                  </span>
                </div>

                {comments.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "40px 20px",
                      gap: 8,
                    }}
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#333"
                      strokeWidth="1.5"
                    >
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13.5,
                        color: "#444",
                        fontWeight: 600,
                      }}
                    >
                      No comments yet
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: "#333" }}>
                      Be the first to say something
                    </p>
                  </div>
                ) : (
                  comments.map((c: any) => (
                    <div
                      key={String(c.id)}
                      className="pm-comment-item"
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "12px 18px",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <Avatar
                        src={c.author?.avatarUrl ?? c.user?.avatarUrl}
                        name={c.author?.name ?? c.user?.name ?? "?"}
                        size={32}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: 6,
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: 12.5,
                              color: "#f0f0f8",
                            }}
                          >
                            {c.author?.name ?? c.user?.name}
                          </span>
                          <span style={{ fontSize: 11, color: "#444" }}>
                            {timeAgo(c.createdAt)}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: "3px 0 0",
                            fontSize: 13,
                            color: "#aaa",
                            lineHeight: 1.5,
                          }}
                        >
                          {c.content ?? c.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment input */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  flexShrink: 0,
                }}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    color: "#555",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 13s1.5 2 4 2 4-2 4-2" />
                    <line
                      x1="9"
                      y1="9"
                      x2="9.01"
                      y2="9"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <line
                      x1="15"
                      y1="9"
                      x2="15.01"
                      y2="9"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <input
                  ref={commentInputRef}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleComment();
                    }
                  }}
                  placeholder="Write a comment..."
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 24,
                    padding: "9px 16px",
                    color: "#f0f0f8",
                    fontSize: 13,
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
                <button
                  className="pm-send"
                  onClick={handleComment}
                  disabled={!commentText.trim() || submitting}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: commentText.trim() ? "pointer" : "default",
                    color: commentText.trim() ? "#7c5cfc" : "#333",
                    opacity: 0.85,
                    transition: "opacity 0.2s, color 0.2s",
                    padding: 4,
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface UserProfileProps {
  username: string;
  onBack?: () => void;
}

export default function UserProfile({ username, onBack }: UserProfileProps) {
  
  const [activePostId, setActivePostId] = useState<number | string | null>(
    null,
  );

  const {
    profile,
    tab,
    loading,
    followLoading,
    modal,
    modalUsers,
    modalLoading,
    gridItems,
    setTab,
    toggleFollow,
    openModal,
    closeModal,
  } = useUserProfile(username);

  const handleGridClick = (itemId: number | string) => {
    if (window.innerWidth >= 768) {
      setActivePostId(itemId);
    } else {
      window.location.href = `/posts/${itemId}`;
    }
  };

  return (
    <div
      style={{
        background: "#0e0e13",
        minHeight: "100vh",
        color: "#f0f0f8",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
        .g-item:hover img   { transform: scale(1.06) !important; }
        .g-item:hover .g-ov { opacity: 1 !important; }
        .follow-btn:active  { transform: scale(0.97); }
        .stat-btn:hover     { background: #1a1a22 !important; }
        @media (min-width: 768px) {
          .up-inner          { max-width: 1200px !important; }
          .up-topbar         { display: none !important; }
          .up-spacer         { display: none !important; }
          .up-follow-mobile  { display: none !important; }
          .up-follow-desktop { display: flex !important; }
        }
        @media (max-width: 767px) {
          .up-follow-desktop { display: none !important; }
        }
      `}</style>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spinner />
        </div>
      ) : !profile ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            color: "#444",
          }}
        >
          User not found
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="up-inner"
            style={{ width: "100%", animation: "fadeUp 0.35s ease" }}
          >
            {/* Mobile top bar */}
            <div
              className="up-topbar"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 16px 0",
              }}
            >
              <button
                onClick={onBack ?? (() => window.history.back())}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#f0f0f8",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  padding: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                {profile.name}
              </button>
              <Avatar src={profile.avatar} name={profile.name} size={36} />
            </div>

            {/* Avatar + name */}
            <div
              style={{
                padding: "20px 16px 0",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    border: "2.5px solid #7c5cfc",
                    borderRadius: "50%",
                    padding: 2,
                  }}
                >
                  <Avatar src={profile.avatar} name={profile.name} size={70} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 3,
                    right: 3,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#22c55e",
                    border: "2px solid #0e0e13",
                  }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 18,
                    letterSpacing: "-0.3px",
                    lineHeight: 1.2,
                  }}
                >
                  {profile.name}
                </div>
                <div style={{ color: "#FDFDFD", fontSize: 13, marginTop: 2 }}>
                  {profile.username}
                </div>
              </div>

              {/* Follow + Message — desktop */}
              <div
                className="up-follow-desktop"
                style={{
                  marginLeft: "auto",
                  display: "none",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <button
                  className="follow-btn"
                  onClick={toggleFollow}
                  disabled={followLoading}
                  style={{
                    padding: "9px 20px",
                    borderRadius: 100,
                    border: profile.is_following ? "1px solid #2a2a38" : "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 700,
                    fontSize: 14,
                    transition: "all 0.2s",
                    background: profile.is_following ? "#1a1a24" : "#6936F2",
                    color: profile.is_following ? "#aaa" : "#fff",
                    opacity: followLoading ? 0.75 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {followLoading ? (
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: "2px solid rgba(255,255,255,0.25)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                  ) : profile.is_following ? (
                    <>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Following
                    </>
                  ) : (
                    "Follow"
                  )}
                </button>
                <button
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    flexShrink: 0,
                    background: "#1a1a22",
                    border: "1px solid #2a2a35",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#888"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Follow + Message — mobile */}
            <div
              className="up-follow-mobile"
              style={{ padding: "14px 20px 0", display: "flex", gap: 20 }}
            >
              <button
                className="follow-btn"
                onClick={toggleFollow}
                disabled={followLoading}
                style={{
                  flex: 1,
                  padding: "11px 0",
                  borderRadius: 100,
                  border: profile.is_following ? "1px solid #2a2a38" : "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 700,
                  fontSize: 15,
                  transition: "all 0.2s",
                  background: profile.is_following ? "#1a1a24" : "#6936F2",
                  color: profile.is_following ? "#aaa" : "#fff",
                  opacity: followLoading ? 0.75 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {followLoading ? (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.25)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                ) : profile.is_following ? (
                  <>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Following
                  </>
                ) : (
                  "Follow"
                )}
              </button>
              <button
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  flexShrink: 0,
                  background: "#1a1a22",
                  border: "1px solid #2a2a35",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#888"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </button>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p
                style={{
                  margin: "14px 16px 0",
                  padding: 0,
                  fontSize: 13.5,
                  color: "#9090a8",
                  lineHeight: 1.65,
                }}
              >
                {profile.bio}
              </p>
            )}

            {/* Stats */}
            <div style={{ display: "flex", margin: "16px 0 0" }}>
              {(
                [
                  {
                    label: "Post",
                    value: profile.posts_count,
                    click: undefined,
                  },
                  {
                    label: "Followers",
                    value: profile.followers_count,
                    click: () => openModal("followers"),
                  },
                  {
                    label: "Following",
                    value: profile.following_count,
                    click: () => openModal("following"),
                  },
                  {
                    label: "Likes",
                    value: profile.likes_count,
                    click: undefined,
                  },
                ] as { label: string; value: number; click?: () => void }[]
              ).map((s, i, arr) => (
                <button
                  key={s.label}
                  className="stat-btn"
                  onClick={s.click}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    cursor: s.click ? "pointer" : "default",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    padding: "14px 0",
                    borderRight:
                      i < arr.length - 1 ? "1px solid #1a1a22" : "none",
                    borderRadius: 0,
                    transition: "background 0.15s",
                    fontFamily: "inherit",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: 19,
                      color: "#f0f0f8",
                      letterSpacing: "-0.5px",
                      lineHeight: 1,
                    }}
                  >
                    {fmt(s.value)}
                  </span>
                  <span
                    style={{ fontSize: 11, color: "#555", fontWeight: 500 }}
                  >
                    {s.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #1a1a22" }}>
              {[
                {
                  key: "gallery" as const,
                  label: "Gallery",
                  icon: (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  ),
                },
                {
                  key: "liked" as const,
                  label: "Liked",
                  icon: (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill={tab === "liked" ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  ),
                },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 600,
                    fontSize: 14,
                    color: tab === t.key ? "#f0f0f8" : "#444",
                    padding: "13px 0 11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    borderBottom:
                      tab === t.key
                        ? "2px solid #7c5cfc"
                        : "2px solid transparent",
                    transition: "color 0.2s, border-color 0.2s",
                    marginBottom: -1,
                  }}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Photo Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 2,
              }}
            >
              {!Array.isArray(gridItems) || gridItems.length === 0 ? (
                <div
                  style={{
                    gridColumn: "1/-1",
                    padding: "56px 0",
                    textAlign: "center",
                    color: "#333",
                    fontSize: 14,
                  }}
                >
                  No posts yet
                </div>
              ) : (
                gridItems.map((item) => (
                  <div
                    key={String(item.id)}
                    className="g-item"
                    onClick={() => handleGridClick(item.id)}
                    style={{
                      position: "relative",
                      aspectRatio: "1/1",
                      overflow: "hidden",
                      background: "#1a1a22",
                      cursor: "pointer",
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          transition: "transform 0.3s ease",
                        }}
                      />
                    )}
                    <div
                      className="g-ov"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.42)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.2s",
                      }}
                    >
                      <span
                        style={{
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 13,
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {item.likes_count}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="up-spacer" style={{ height: 80 }} />
          </div>
        </div>
      )}

      {/* Followers/Following Modal */}
      {modal && (
        <Modal
          title={modal === "followers" ? "Followers" : "Following"}
          onClose={closeModal}
          loading={modalLoading}
          users={modalUsers}
        />
      )}

      {/* Post Modal */}
      {activePostId !== null && (
        <PostModal
          postId={activePostId}
          onClose={() => setActivePostId(null)}
        />
      )}
    </div>
  );
}
