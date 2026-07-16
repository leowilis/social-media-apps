'use client';

import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useUserProfile } from '@/hooks/users/useUserProfile';
import { useUserPosts } from '@/hooks/users/useUserPosts';
import { useUserLikes } from '@/hooks/users/useUserLikes';
import { useToggleFollow } from '@/hooks/profile/useFollow';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { PostDetail } from '@/components/site/post/ui/PostDetail';
import ProfileHeader from '../myProfile/ProfileHeader';
import ProfileStats from '../myProfile/ProfileStats';
import ProfilePostGrid from '../myProfile/ProfilePostGrid';
import UserProfileNavbar from './UserProfileNavbar';
import UserProfileActions from './UserProfileActions';
import UserProfileTabs, { type UserProfileTab } from './UserProfileTabs';

interface UserProfileProps {
  username: string;
}

export default function UserProfile({ username }: UserProfileProps) {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data: profile, isLoading, isError } = useUserProfile(username);
  const { data: posts, isLoading: postsLoading } = useUserPosts(username);
  const { data: likedPosts, isLoading: likesLoading } = useUserLikes(username);
  const toggleFollow = useToggleFollow();
  const [tab, setTab] = useState<UserProfileTab>('posts');
  const [activePostId, setActivePostId] = useState<number | null>(null);

  if (isLoading) {
    return <LoadingState text='Loading profile...' />;
  }

  if (isError || !profile) {
    return (
      <ErrorState
        title='User not found'
        description='The requested profile could not be found.'
      />
    );
  }

  const isMe = currentUser?.username === username;
  const gridLoading = tab === 'posts' ? postsLoading : likesLoading;
  const displayPosts = tab === 'posts' ? (posts ?? []) : (likedPosts ?? []);

  return (
    <div className='min-h-screen text-white'>
      <UserProfileNavbar
        username={profile.username}
        avatarUrl={profile.avatarUrl}
        name={profile.name}
      />

      <div className='md:mx-auto md:max-w-5xl'>
        <ProfileHeader
          mode={isMe ? 'self' : 'other'}
          name={profile.name}
          username={profile.username}
          avatarUrl={profile.avatarUrl}
          bio={profile.bio}
        />

        <UserProfileActions
          isMe={isMe}
          username={username}
          isFollowing={profile.isFollowing ?? false}
          isPending={toggleFollow.isPending}
          onFollow={() =>
            toggleFollow.mutate({
              username,
              isFollowing: profile.isFollowing ?? false,
            })
          }
        />

        <ProfileStats
          post={profile.counts?.post ?? 0}
          followers={profile.counts?.followers ?? 0}
          following={profile.counts?.following ?? 0}
          likes={profile.counts?.likes ?? 0}
        />

        <UserProfileTabs activeTab={tab} onTabChange={setTab} />

        {gridLoading ? (
          <LoadingState text='Loading posts...' />
        ) : displayPosts.length === 0 ? (
          <EmptyState
            title={tab === 'posts' ? 'No posts yet' : 'No liked posts yet'}
            description={
              tab === 'posts'
                ? 'This user has not shared any posts.'
                : 'No liked posts available.'
            }
          />
        ) : (
          <ProfilePostGrid
            posts={displayPosts}
            isSaved={false}
            onPostClick={setActivePostId}
          />
        )}
      </div>

      {activePostId !== null && (
        <PostDetail
          postId={activePostId}
          currentUserId={currentUser?.id}
          onClose={() => setActivePostId(null)}
        />
      )}
    </div>
  );
}
