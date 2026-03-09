"use client";

import { ProfilePage } from "@/components/site/myProfile/ProfilePage";

import { useState } from "react";
import { useMyProfile } from "./hooks/useMyProfile";
import { useMyPosts } from "./hooks/useMyPost";

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState<"gallery" | "saved">("gallery");
  const { profile, isLoading } = useMyProfile();
  const { posts, isLoading: postsLoading } = useMyPosts(activeTab);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 rounded-full border-2 border-[var(--primary-200)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <ProfilePage
      mode="self"
      name={profile?.name ?? ""}
      username={profile?.username ?? ""}
      avatarUrl={profile?.avatarUrl}
      bio={profile?.bio}
      stats={{
        post: profile?.postCount ?? 0,
        followers: profile?.followerCount ?? 0,
        following: profile?.followingCount ?? 0,
        likes: profile?.likeCount ?? 0,
      }}
      galleryPosts={activeTab === "gallery" ? posts : []}
      secondaryPosts={activeTab === "saved" ? posts : []}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      postsLoading={postsLoading}
    />
  );
}