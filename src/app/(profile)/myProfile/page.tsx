"use client";

import { useState } from "react";
import { useMyProfile } from "@/hooks/profile/useMyProfile";
import { useMyPosts } from "@/hooks/profile/useMyPost";
import { useMe } from "@/hooks/profile/useMe";
import { ProfilePage } from "@/components/site/myProfile/ProfilePage";
import { PostDetail } from "@/components/site/post/ui/PostDetail";
import { ProfileHeaderSkeleton } from "@/components/ui/skeletons";

/**
 * My Profile page — displays the authenticated user's profile,
 * posts, and saved posts with tab switching.
 */
export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState<"gallery" | "saved">("gallery");
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const { profile, isLoading } = useMyProfile();
  const { posts, isLoading: postsLoading } = useMyPosts(activeTab);
  const { me } = useMe();

  if (isLoading) return <ProfileHeaderSkeleton />;

  return (
    <>
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
        onPostClick={(postId) => setActivePostId(postId)}
      />

      {activePostId !== null && (
        <PostDetail
          postId={activePostId}
          currentUserId={me?.id}
          onClose={() => setActivePostId(null)}
        />
      )}
    </>
  );
}