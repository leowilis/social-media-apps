'use client';

import { useState } from 'react';
import { useMe } from '@/hooks/profile/useMe';
import { useMyPosts } from '@/hooks/profile/useMyPost';
import { useMyProfile } from '@/hooks/profile/useMyProfile';
import { ProfilePage } from '@/components/site/myProfile/ProfilePage';
import { PostDetail } from '@/components/site/post/detail/PostDetail';
import { ProfileHeaderSkeleton } from '@/components/ui/skeletons';

export default function MyProfilePage() {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'gallery' | 'saved'>('gallery');

  const { profile, isLoading } = useMyProfile();
  const { posts, isLoading: postsLoading } = useMyPosts(activeTab);
  const { me } = useMe();

  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  return (
    <>
      <ProfilePage
        mode='self'
        name={profile?.name ?? ''}
        username={profile?.username ?? ''}
        avatarUrl={profile?.avatarUrl}
        bio={profile?.bio}
        stats={{
          post: profile?.postCount ?? 0,
          followers: profile?.followerCount ?? 0,
          following: profile?.followingCount ?? 0,
          likes: profile?.likeCount ?? 0,
        }}
        galleryPosts={activeTab === 'gallery' ? posts : []}
        secondaryPosts={activeTab === 'saved' ? posts : []}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        postsLoading={postsLoading}
        onPostClick={setSelectedPostId}
      />

      {selectedPostId && (
        <PostDetail
          postId={selectedPostId}
          currentUserId={me?.id}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </>
  );
}
