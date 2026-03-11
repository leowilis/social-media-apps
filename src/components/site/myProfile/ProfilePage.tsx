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
} from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Post = { id: number; imageUrl: string; caption: string; likeCount?: number };
type Stats = { post: number; followers: number; following: number; likes: number };
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
};

function GridItem({ post }: { post: Post }) {
  const [hovered, setHovered]     = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [liked, setLiked]         = useState(false);

  // Read latest like state from localStorage (updated by PostDetail after like/unlike)
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
    <Link href={`/post/${post.id}?liked=${liked}&likeCount=${likeCount}&saved=false`}>
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
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <span className="flex items-center gap-1.5 text-white font-bold text-sm">
            {liked
              ? <IoHeart className="size-4 text-red-500" />
              : <IoHeartOutline className="size-4 fill-white text-white" />}
            {likeCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProfilePage({
  mode, name, username, avatarUrl, bio, stats,
  galleryPosts, secondaryPosts, activeTab, onTabChange, postsLoading,
}: ProfilePageProps) {
  const posts = activeTab === "gallery" ? galleryPosts : secondaryPosts;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex flex-col gap-5 px-2 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="size-15 border border-[rgba(126,145,183,0.32)]">
            <AvatarImage src={avatarUrl ?? ""} alt={name} />
            <AvatarFallback className="text-xl font-bold">{name?.[0]?.toUpperCase() ?? ""}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-lg font-bold">{name}</span>
            <span className="text-sm text-[var(--neutral-500)]">{username}</span>
          </div>
        </div>

        {mode === "self" && (
          <div className="flex items-center gap-4 px-3">
            <Link href="/editprofile" className="flex-1">
              <Button className="w-full h-9 rounded-full border bg-neutral-950 border-gray-900 text-sm font-semibold text-white">
                Edit Profile
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="size-9 rounded-full border border-gray-900 text-white shrink-0">
              <IoPaperPlaneOutline className="size-4" />
            </Button>
          </div>
        )}

        {bio && <p className="text-sm text-neutral-300 tracking-normal overflow-hidden px-2">{bio}</p>}

        <div className="flex border-[rgba(126,145,183,0.2)]">
          {[
            { label: "Post",      value: stats.post },
            { label: "Followers", value: stats.followers },
            { label: "Following", value: stats.following },
            { label: "Likes",     value: stats.likes },
          ].map((s, i) => (
            <div key={s.label} className="flex flex-1 items-center">
              <div className="flex flex-1 flex-col items-center py-2 gap-2">
                <span className="text-base font-bold">{s.value}</span>
                <span className="text-sm text-neutral-400">{s.label}</span>
              </div>
              {i < 3 && <Separator orientation="vertical" className="h-5 bg-[rgba(126,145,183,0.2)]" />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex border-b border-[rgba(126,145,183,0.2)]">
        {[
          { key: "gallery", icon: <IoGridOutline className="size-4" />,    label: "Gallery" },
          { key: "saved",   icon: <IoBookmarkOutline className="size-4" />, label: "Saved"   },
        ].map((tab) => (
          <button key={tab.key} onClick={() => onTabChange(tab.key as "gallery" | "saved")}
            className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab.key ? "border-b-2 border-white text-white" : "text-[var(--neutral-500)]"
            }`}>
            {tab.icon}{tab.label}
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
            {activeTab === "saved" ? "No saved posts yet" : "Your story starts here"}
          </p>
          <p className="text-sm text-neutral-400 leading-loose tracking-wider">
            {activeTab === "saved"
              ? "Posts you save will appear here."
              : "Share your first post and let the world see your moments, passions, and memories. Make this space truly yours."}
          </p>
          {activeTab === "gallery" && (
            <Link href="/addpost">
              <Button className="rounded-full bg-primary-300 font-semibold px-18">Upload My First Post</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5">
          {posts.map((post) => <GridItem key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}