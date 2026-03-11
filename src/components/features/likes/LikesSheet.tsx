"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IoCloseOutline, IoCheckmark } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/axios";

interface LikeUser {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
  isFollowedByMe: boolean;
  isMe: boolean;
  followsMe: boolean;
}

interface Props {
  postId: number | string;
  likeCount: number;
  onClose: () => void;
}

export function LikesSheet({ postId, likeCount, onClose }: Props) {
  const [users, setUsers]             = useState<LikeUser[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [following, setFollowing]     = useState<Record<number, boolean>>({});
  const [loadingFollow, setLoadingFollow] = useState<Record<number, boolean>>({});

  useEffect(() => {
    api.get(`/posts/${postId}/likes`, { params: { page: 1, limit: 20 } })
      .then((res) => {
        const raw: LikeUser[] = res.data.data?.users ?? [];
        setUsers(raw);
        const init: Record<number, boolean> = {};
        raw.forEach((u) => { init[u.id] = u.isFollowedByMe; });
        setFollowing(init);
      })
      .catch(() => setUsers([]))
      .finally(() => setIsLoading(false));
  }, [postId]);

  const toggleFollow = async (user: LikeUser) => {
    if (user.isMe || loadingFollow[user.id]) return;
    setLoadingFollow((p) => ({ ...p, [user.id]: true }));
    const wasFollowing = following[user.id];
    setFollowing((p) => ({ ...p, [user.id]: !wasFollowing }));
    try {
      if (wasFollowing) await api.delete(`/follow/${user.username}`);
      else              await api.post(`/follow/${user.username}`);
    } catch {
      setFollowing((p) => ({ ...p, [user.id]: wasFollowing }));
    } finally {
      setLoadingFollow((p) => ({ ...p, [user.id]: false }));
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal center */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-3xl overflow-hidden w-[90vw] max-w-sm flex flex-col"
        style={{
          maxHeight: "70vh",
          background: "linear-gradient(160deg, rgba(18,18,28,0.99) 0%, rgba(10,10,18,1) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.06)] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">Likes</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full text-[#a78bff]"
              style={{ background: "rgba(124,92,252,0.15)" }}
            >
              {likeCount}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center size-8 rounded-full text-neutral-400 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <IoCloseOutline className="size-5" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 px-4 py-3 space-y-1">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="size-6 rounded-full border-2 border-[#7c5cfc] border-t-transparent animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <p className="text-sm font-semibold text-neutral-300">No likes yet</p>
              <p className="text-xs text-neutral-500">Be the first to like this post</p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 px-2 py-2.5 rounded-2xl transition-colors hover:bg-[rgba(255,255,255,0.03)]"
              >
                <Link href={`/profile/${user.username}`} onClick={onClose} className="shrink-0">
                  <Avatar className="size-11 border border-[rgba(126,145,183,0.2)]">
                    <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
                    <AvatarFallback className="text-sm bg-[#1a1a2e] text-[#a78bff]">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <Link href={`/profile/${user.username}`} onClick={onClose} className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-neutral-500 truncate">@{user.username}</p>
                </Link>

                {!user.isMe && (
                  <button
                    onClick={() => toggleFollow(user)}
                    disabled={loadingFollow[user.id]}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95"
                    style={
                      following[user.id]
                        ? {
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            color: "rgba(255,255,255,0.6)",
                          }
                        : {
                            background: "linear-gradient(135deg, #9b7dff 0%, #7c5cfc 100%)",
                            boxShadow: "0 2px 12px rgba(124,92,252,0.4)",
                            color: "white",
                            border: "none",
                          }
                    }
                  >
                    {loadingFollow[user.id] ? (
                      <div className="size-3 rounded-full border border-current border-t-transparent animate-spin" />
                    ) : following[user.id] ? (
                      <>
                        <IoCheckmark className="size-3" />
                        Following
                      </>
                    ) : (
                      "Follow"
                    )}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}