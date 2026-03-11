"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  IoBookmarkOutline,
  IoGridOutline,
  IoPaperPlaneOutline,
  IoHeartOutline,
  IoHeart,
  IoCloseOutline,
} from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Post = {
  id: number;
  imageUrl: string;
  caption: string;
  likeCount?: number;
};
type Stats = {
  post: number;
  followers: number;
  following: number;
  likes: number;
};
type ModalUser = { id: number; name: string; username: string; avatar: string };

type ProfilePageProps = {
  mode: "self" | "other";
  name: string;
  username: string;
  avatarUrl?: string | null;
  bio?: string | null;
  stats: Stats;
  galleryPosts: Post[];
  secondaryPosts: Post[];
  activeTab: "gallery" | "saved";
  onTabChange: (tab: "gallery" | "saved") => void;
  postsLoading?: boolean;
  onOpenFollowers?: () => void;
  onOpenFollowing?: () => void;
  modal?: "followers" | "following" | null;
  modalUsers?: ModalUser[];
  modalLoading?: boolean;
  onCloseModal?: () => void;
};

function GridItem({
  post,
  isSaved = false,
}: {
  post: Post;
  isSaved?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`post_like_${post.id}`);
    if (stored) {
      try {
        const { liked: l, likeCount: c } = JSON.parse(stored);
        setLiked(Boolean(l));
        setLikeCount(Number(c));
      } catch {}
    } else {
      setLikeCount(post.likeCount ?? 0);
    }
  }, [post.id, post.likeCount]);

  return (
    <Link
      href={`/post/${post.id}?liked=${liked}&likeCount=${likeCount}&saved=${isSaved}`}
    >
      <div
        className="relative aspect-square w-full overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={post.imageUrl}
          alt={post.caption}
          fill
          className={`object-cover transition-transform duration-300 ${hovered ? "scale-105" : "scale-100"}`}
          sizes="33vw"
        />
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}
        >
          <span className="flex items-center gap-1.5 text-white font-bold text-sm">
            {liked ? (
              <IoHeart className="size-4 text-red-500" />
            ) : (
              <IoHeartOutline className="size-4 fill-white text-white" />
            )}
            {likeCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

function FollowModal({
  title,
  users,
  loading,
  onClose,
}: {
  title: string;
  users: ModalUser[];
  loading: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-[400px] max-h-[70vh] bg-[#16161e] rounded-2xl border border-[#2a2a35] flex flex-col overflow-hidden"
        style={{ animation: "fadeScale 0.2s ease" }}
      >
        <style>{`@keyframes fadeScale { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }`}</style>

        <div className="flex items-center justify-between px-5 py-4 border-b border-[#222230]">
          <span className="font-bold text-base text-white">{title}</span>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <IoCloseOutline className="size-6" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="size-5 rounded-full border-2 border-[#7c5cfc] border-t-transparent animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-neutral-500 text-sm">
              No users found
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-3 px-5 py-3 border-b border-[#1e1e28]"
              >
                <Avatar className="size-11 shrink-0 border border-[rgba(126,145,183,0.2)]">
                  <AvatarImage src={u.avatar} alt={u.name} />
                  <AvatarFallback className="text-sm font-bold">
                    {u.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-white">{u.name}</p>
                  <p className="text-xs text-neutral-500">@{u.username}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function ProfilePage({
  mode,
  name,
  username,
  avatarUrl,
  bio,
  stats,
  galleryPosts,
  secondaryPosts,
  activeTab,
  onTabChange,
  postsLoading,
  onOpenFollowers,
  onOpenFollowing,
  modal,
  modalUsers = [],
  modalLoading = false,
  onCloseModal,
}: ProfilePageProps) {
  const posts = activeTab === "gallery" ? galleryPosts : secondaryPosts;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white md:items-center">
      <div className="w-full md:max-w-[1200px]">
        <div className="flex flex-col gap-5 px-2 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="size-15 border border-[rgba(126,145,183,0.32)]">
              <AvatarImage src={avatarUrl ?? ""} alt={name} />
              <AvatarFallback className="text-xl font-bold">
                {name?.[0]?.toUpperCase() ?? ""}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-lg font-bold">{name}</span>
              <span className="text-sm text-[var(--neutral-500)]">
                {username}
              </span>
            </div>
            {mode === "self" && (
              <div className="hidden md:flex items-center gap-2 ml-auto">
                <Link href="/editprofile">
                  <Button className="h-9 rounded-full border bg-neutral-950 border-gray-900 text-sm font-semibold text-white px-4">
                    Edit Profile
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full border border-gray-900 text-white shrink-0"
                >
                  <IoPaperPlaneOutline className="size-4" />
                </Button>
              </div>
            )}
          </div>

          {mode === "self" && (
            <div className="flex items-center gap-4 px-3 md:hidden">
              <Link href="/editprofile" className="flex-1">
                <Button className="w-full h-9 rounded-full border bg-neutral-950 border-gray-900 text-sm font-semibold text-white">
                  Edit Profile
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full border border-gray-900 text-white shrink-0"
              >
                <IoPaperPlaneOutline className="size-4" />
              </Button>
            </div>
          )}

          {bio && (
            <p className="text-sm text-neutral-300 tracking-normal overflow-hidden px-2">
              {bio}
            </p>
          )}

          <div className="flex border-[rgba(126,145,183,0.2)]">
            {[
              { label: "Post", value: stats.post, onClick: undefined },
              {
                label: "Followers",
                value: stats.followers,
                onClick: onOpenFollowers,
              },
              {
                label: "Following",
                value: stats.following,
                onClick: onOpenFollowing,
              },
              { label: "Likes", value: stats.likes, onClick: undefined },
            ].map((s, i) => (
              <div key={s.label} className="flex flex-1 items-center">
                <button
                  onClick={s.onClick}
                  disabled={!s.onClick}
                  className={`flex flex-1 flex-col items-center py-2 gap-2 ${s.onClick ? "cursor-pointer hover:opacity-70 transition-opacity" : "cursor-default"}`}
                >
                  <span className="text-base font-bold">{s.value}</span>
                  <span className="text-sm text-neutral-400">{s.label}</span>
                </button>
                {i < 3 && (
                  <Separator
                    orientation="vertical"
                    className="h-5 bg-[rgba(126,145,183,0.2)]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex border-b border-[rgba(126,145,183,0.2)]">
          {[
            {
              key: "gallery",
              icon: <IoGridOutline className="size-4" />,
              label: "Gallery",
            },
            {
              key: "saved",
              icon: <IoBookmarkOutline className="size-4" />,
              label: "Saved",
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key as "gallery" | "saved")}
              className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-white text-white"
                  : "text-[var(--neutral-500)]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {postsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="size-6 rounded-full border-2 border-[var(--primary-200)] border-t-transparent animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-50 px-8 text-center">
            <p className="text-lg font-bold">
              {activeTab === "saved"
                ? "No saved posts yet"
                : "Your story starts here"}
            </p>
            <p className="text-sm text-neutral-400 leading-loose tracking-wider">
              {activeTab === "saved"
                ? "Posts you save will appear here."
                : "Share your first post and let the world see your moments, passions, and memories. Make this space truly yours."}
            </p>
            {activeTab === "gallery" && (
              <Link href="/addpost">
                <Button className="rounded-full bg-primary-300 font-semibold px-18">
                  Upload My First Post
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {posts.map((post) => (
              <GridItem
                key={post.id}
                post={post}
                isSaved={activeTab === "saved"}
              />
            ))}
          </div>
        )}
      </div>

      {modal && onCloseModal && (
        <FollowModal
          title={modal === "followers" ? "Followers" : "Following"}
          users={modalUsers}
          loading={modalLoading}
          onClose={onCloseModal}
        />
      )}
    </div>
  );
}
