'use client';

import Link from 'next/link';
import type { Post } from '@/types/post';
import { Button } from '@/components/ui/button';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileTabs from './ProfileTabs';
import ProfilePostGrid from './ProfilePostGrid';
import FollowModal, { ModalUser } from './FollowModal';

type Stats = {
  post: number;
  followers: number;
  following: number;
  likes: number;
};

interface ProfilePageProps {
  mode: 'self' | 'other';
  name: string;
  username: string;
  avatarUrl?: string | null;
  bio?: string | null;
  stats: Stats;
  galleryPosts: Post[];
  secondaryPosts: Post[];
  activeTab: 'gallery' | 'saved';
  onTabChange: (tab: 'gallery' | 'saved') => void;
  postsLoading?: boolean;
  onPostClick?: (postId: number) => void;
  onOpenFollowers?: () => void;
  onOpenFollowing?: () => void;
  modal?: 'followers' | 'following' | null;
  modalUsers?: ModalUser[];
  modalLoading?: boolean;
  onCloseModal?: () => void;
}

/**
 * ProfilePage
 *
 * Layout orchestrator for profile page.
 * This component only arranges reusable UI sections and delegates
 * all rendering logic to child components.
 */
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
  postsLoading = false,
  onPostClick,
  onOpenFollowers,
  onOpenFollowing,
  modal,
  modalUsers = [],
  modalLoading = false,
  onCloseModal,
}: ProfilePageProps) {
  const isSavedTab = activeTab === 'saved';

  const posts = isSavedTab ? secondaryPosts : galleryPosts;

  if (postsLoading) {
    return <LoadingState />;
  }

  return (
    <div className='min-h-screen flex flex-col md:mt-3 md:items-center'>
      <div className='w-full md:max-w-270'>
        <ProfileHeader
          mode={mode}
          name={name}
          username={username}
          avatarUrl={avatarUrl}
          bio={bio}
        />

        <ProfileStats
          post={stats.post}
          followers={stats.followers}
          following={stats.following}
          likes={stats.likes}
          onOpenFollowers={onOpenFollowers}
          onOpenFollowing={onOpenFollowing}
        />

        <ProfileTabs activeTab={activeTab} onTabChange={onTabChange} />

        {posts.length === 0 ? (
          <EmptyState
            title={isSavedTab ? 'No saved posts yet' : 'Your story starts here'}
            description={
              isSavedTab
                ? 'Posts you save will appear here.'
                : 'Share your first post and let the world see your moments, passions, and memories.'
            }
            action={
              !isSavedTab ? (
                <Link href='/addpost'>
                  <Button className='rounded-full px-18 font-semibold'>
                    Upload My First Post
                  </Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <ProfilePostGrid
            posts={posts}
            isSaved={activeTab === 'saved'}
            onPostClick={onPostClick}
          />
        )}
      </div>

      {modal && onCloseModal && (
        <FollowModal
          title={modal === 'followers' ? 'Followers' : 'Following'}
          users={modalUsers}
          loading={modalLoading}
          onClose={onCloseModal}
        />
      )}
    </div>
  );
}
