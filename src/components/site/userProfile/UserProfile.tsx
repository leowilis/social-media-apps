'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useUserProfile } from '@/hooks/users/useUserProfile';
import { useToggleFollow } from '@/hooks/profile/useFollow';
import { useUserPosts } from '@/hooks/users/useUserPosts';
import { useUserLikes } from '@/hooks/users/useUserLikes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PostDetail } from '@/components/site/post/ui/PostDetail';
import { useRouter } from 'next/navigation';
import { IoArrowBackOutline, IoSend } from 'react-icons/io5';
import { Heart, LayoutGrid } from 'lucide-react';

// Types

interface ProfilePageProps {
  username: string;
}

type Tab = 'posts' | 'likes';

// Sub-components

function ProfileSkeleton() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-[#0e0e13]'>
      <div className='size-6 rounded-full border-2 border-[#7c5cfc] border-t-transparent animate-spin' />
    </div>
  );
}

function ProfileNotFound() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-[#0e0e13] text-neutral-400 text-sm'>
      User not found
    </div>
  );
}

function StatItem({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number;
  onClick?: () => void;
}) {
  const formatted =
    value >= 1_000_000
      ? (value / 1_000_000).toFixed(1) + 'M'
      : value >= 1_000
        ? (value / 1_000).toFixed(1) + 'K'
        : String(value);

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className='flex flex-col items-center gap-1 flex-1 py-3 disabled:cursor-default hover:bg-white/[0.03] transition-colors'
    >
      <span className='text-lg font-extrabold text-white'>{formatted}</span>
      <span className='text-xs text-neutral-500'>{label}</span>
    </button>
  );
}

// Main Component

/**
 * Public user profile page.
 * Shows avatar, bio, stats, follow button, and post grid.
 */
export function ProfilePage({ username }: ProfilePageProps) {
  const router = useRouter();
  const currentUser = useAppSelector((s) => s.auth.user);
  const { data: profile, isLoading, isError } = useUserProfile(username);
  const toggleFollow = useToggleFollow(username);
  const { data: posts } = useUserPosts(username);
  const { data: likedPosts } = useUserLikes(username);

  const [tab, setTab] = useState<Tab>('posts');
  const [activePostId, setActivePostId] = useState<number | null>(null);

  if (isLoading) return <ProfileSkeleton />;
  if (isError || !profile) return <ProfileNotFound />;

  const isMe = currentUser?.username === username;
  const displayPosts = tab === 'posts' ? (posts ?? []) : (likedPosts ?? []);

  return (
    <div className='min-h-screen text-white'>
      {/* ── Navbar Top ── */}
      <div className='flex items-center justify-between px-4 py-3 border-b border-white/5 md:hidden'>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => router.back()}
            className='hover:text-primary-300 transition-colors'
          >
            <IoArrowBackOutline size={20} />
          </button>
          <span className='font-bold text-lg'>{profile.username}</span>
        </div>
        <Avatar className='size-10'>
          <AvatarImage src={profile.avatarUrl ?? ''} />
          <AvatarFallback>{profile.name[0]}</AvatarFallback>
        </Avatar>
      </div>

      {/* ── Profile Header ── */}
      <div className='md:max-w-5xl md:mx-auto'>
        <div className='px-2 pt-6 pb-4 flex items-center gap-4 md:pt-10 md:pb-6 md:gap-3'>
          <Avatar className='size-20 md:size-23'>
            <AvatarImage src={profile.avatarUrl ?? ''} alt={profile.name} />
            <AvatarFallback className='text-2xl font-bold md:text-5xl'>
              {profile.name[0]}
            </AvatarFallback>
          </Avatar>

          <div className='flex flex-col gap-1 flex-1 min-w-0 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-y-0 md:gap-x-4'>
            <span className='text-lg font-extrabold truncate md:text-2xl'>
              {profile.name}
            </span>
            <span className='text-sm md:text-base md:order-3 md:basis-full'>
              @{profile.username}
            </span>

            {!isMe && (
              <div className='flex items-center gap-2 mt-1 md:w-auto md:order-1 md:mt-5'>
                <Button
                  onClick={() => toggleFollow.mutate(profile.isFollowing ?? false)}
                  disabled={toggleFollow.isPending}
                  variant='ghost'
                  className={`h-9 rounded-full font-bold text-sm flex-1 px-6 transition-all md:px-15 ${
                    profile.isFollowing
                      ? 'border border-neutral-700 text-neutral-300 hover:bg-white/5'
                      : 'bg-primary-300 text-white hover:bg-primary-200'
                  }`}
                >
                  {toggleFollow.isPending ? '...' : profile.isFollowing ? 'Following' : 'Follow'}
                </Button>

                <Button
                  variant='ghost'
                  className='h-9 w-9 rounded-full border border-neutral-700 text-neutral-300 hover:bg-white/5 p-0 flex items-center justify-center shrink-0'
                  onClick={() => router.push(`/messages/${username}`)}
                >
                  <IoSend size={16} className='rotate-[-45deg] mb-0.5 ml-0.5' />
                </Button>
              </div>
            )}

            {isMe && (
              <Link href='/editprofile' className='w-full md:w-auto'>
                <Button
                  variant='ghost'
                  className='mt-1 h-9 rounded-full font-bold text-sm w-fit px-6 border border-neutral-700 text-neutral-300 hover:bg-white/5'
                >
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* ── Bio ── */}
        {profile.bio && (
          <p className='px-4 pb-4 text-sm text-neutral-300 leading-relaxed'>
            {profile.bio}
          </p>
        )}

        {/* ── Stats ── */}
        <div className='flex border-y border-[rgba(255,255,255,0.06)]'>
          <StatItem label='Posts' value={profile.counts?.post ?? 0} />
          <StatItem label='Followers' value={profile.counts?.followers ?? 0} />
          <StatItem label='Following' value={profile.counts?.following ?? 0} />
          <StatItem label='Likes' value={profile.counts?.likes ?? 0} />
        </div>

        {/* ── Tabs ── */}
        <div className='flex border-b border-[rgba(255,255,255,0.06)]'>
          <button
            onClick={() => setTab('posts')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-semibold transition-colors border-b-2 ${
              tab === 'posts'
                ? 'text-white border-white'
                : 'text-neutral-500 border-transparent hover:text-neutral-300'
            }`}
          >
            <LayoutGrid size={16} /> Gallery
          </button>
          <button
            onClick={() => setTab('likes')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-semibold transition-colors border-b-2 ${
              tab === 'likes'
                ? 'text-white border-white'
                : 'text-neutral-500 border-transparent hover:text-neutral-300'
            }`}
          >
            <Heart size={16} /> Liked
          </button>
        </div>

        {/* ── Post Grid ── */}
        <div className='grid grid-cols-3 gap-0.5'>
          {!displayPosts.length ? (
            <div className='col-span-3 py-16 text-center text-neutral-600 text-sm'>
              {tab === 'posts' ? 'No posts yet' : 'No liked posts yet'}
            </div>
          ) : (
            displayPosts.map((post) => (
              <button
                key={post.id}
                onClick={() => setActivePostId(post.id)}
                className='relative aspect-square overflow-hidden bg-neutral-900 group'
              >
                <Image
                  src={post.imageUrl}
                  alt={post.caption || ''}
                  fill
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                  sizes='33vw'
                />
                <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                  <span className='text-white text-xs font-bold'>
                    {post.likeCount}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Post Detail Modal ── */}
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