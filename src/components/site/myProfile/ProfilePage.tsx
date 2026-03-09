"use client";

import Image from "next/image";
import Link from "next/link";
import {
  IoBookmarkOutline,
  IoGridOutline,
  IoPaperPlaneOutline,
} from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Post = { id: number; imageUrl: string; caption: string };

type Stats = {
  post: number;
  followers: number;
  following: number;
  likes: number;
};

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
}: ProfilePageProps) {
  const posts = activeTab === "gallery" ? galleryPosts : secondaryPosts;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex flex-col gap-5 px-2 pt-4 pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border border-[rgba(126,145,183,0.32)]">
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
        </div>

        {bio && <p className="text-sm text-neutral-300">{bio}</p>}

        {mode === "self" && (
          <div className="flex items-center gap-4 px-3">
            <Link href="/editprofile" className="flex-1">
              <Button
                className="w-full h-9 rounded-full border bg-neutral-950 border-gray-900 text-sm font-semibold text-white"
              >
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

        <div className="flex border-[rgba(126,145,183,0.2)]">
  {[
    { label: "Post", value: stats.post },
    { label: "Followers", value: stats.followers },
    { label: "Following", value: stats.following },
    { label: "Likes", value: stats.likes },
  ].map((s, i) => (
    <div key={s.label} className="flex flex-1 items-center">
      <div className="flex flex-1 flex-col items-center py-2 gap-2">
        <span className="text-base font-bold">{s.value}</span>
        <span className="text-sm text-neutral-400 ">{s.label}</span>
      </div>
      {i < 3 && <Separator orientation="vertical" className="h-5 bg-[rgba(126,145,183,0.2)]" />}
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
          <p className="text-lg font-bold">Your story starts here</p>
          <p className="text-sm text-neutral-400 leading-loose tracking-wider">
            Share your first post and let the world see your moments, passions,
            and memories. Make this space truly yours.
          </p>
          <Link href="/addpost">
            <Button className="rounded-full bg-primary-300 font-semibold px-18">
              Upload My First Post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5">
          {posts.map((post) => (
            <Link key={post.id} href={`/post/${post.id}`}>
              <div className="relative aspect-square w-full">
                <Image
                  src={post.imageUrl}
                  alt={post.caption}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
