'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useUserProfile } from '@/hooks/users/useUserProfile';
import { useToggleFollow } from '@/hooks/profile/useFollow';
import { useUserPosts } from '@/hooks/users/useUserPosts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PostDetail } from '@/components/site/post/ui/PostDetail';

// Types

interface ProfilePageProps {
  username: string;
}

type Tab = 'posts' | 'likes';

// Sub-components

function ProfileSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0e0e13]">
      <div className="size-6 rounded-full border-2 border-[#7c5cfc] border-t-transparent animate-spin" />
    </div>
  );
}

function ProfileNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0e0e13] text-neutral-400 text-sm">
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
      className="flex flex-col items-center gap-1 flex-1 py-3 disabled:cursor-default hover:bg-white/[0.03] transition-colors"
    >
      <span className="text-lg font-extrabold text-white">{formatted}</span>
      <span className="text-xs text-neutral-500">{label}</span>
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

/**
 * Public user profile page.
 * Shows avatar, bio, stats, follow button, and post grid.
 */
export function ProfilePage({ username }: ProfilePageProps) {
  const currentUser    = useAppSelector((s) => s.auth.user);
  const { data: profile, isLoading, isError } = useUserProfile(username);
  const toggleFollow   = useToggleFollow(username);
  const { data: posts } = useUserPosts(username);

  const [tab, setTab]               = useState<Tab>('posts');
  const [activePostId, setActivePostId] = useState<number | null>(null);

  if (isLoading) return <ProfileSkeleton />;
  if (isError || !profile) return <ProfileNotFound />;

  const isMe = currentUser?.username === username;

  return (
    <div className="min-h-screen bg-[#0e0e13] text-white">

      {/* ── Profile Header ── */}
      <div className="px-4 pt-6 pb-4 flex items-center gap-4">
        <Avatar className="size-20 border-2 border-[#7c5cfc]">
          <AvatarImage src={profile.avatarUrl ?? ''} alt={profile.name} />
          <AvatarFallback className="text-2xl font-bold">
            {profile.name[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <span className="text-lg font-extrabold truncate">{profile.name}</span>
          <span className="text-sm text-neutral-400">@{profile.username}</span>

          {!isMe && (
            <Button
              onClick={() => toggleFollow.mutate(profile.isFollowedByMe ?? false)}
              disabled={toggleFollow.isPending}
              variant="ghost"
              className={`mt-1 h-9 rounded-full font-bold text-sm w-fit px-6 transition-all ${
                profile.isFollowedByMe
                  ? 'border border-neutral-700 text-neutral-300 hover:bg-white/5'
                  : 'bg-primary-300 text-white hover:bg-primary-200'
              }`}
            >
              {toggleFollow.isPending
                ? '...'
                : profile.isFollowedByMe
                ? 'Following'
                : 'Follow'}
            </Button>
          )}

          {isMe && (
            <Link href="/editprofile">
              <Button
                variant="ghost"
                className="mt-1 h-9 rounded-full font-bold text-sm w-fit px-6 border border-neutral-700 text-neutral-300 hover:bg-white/5"
              >
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* ── Bio ── */}
      {profile.bio && (
        <p className="px-4 pb-4 text-sm text-neutral-300 leading-relaxed">
          {profile.bio}
        </p>
      )}

      {/* ── Stats ── */}
      <div className="flex border-y border-[rgba(255,255,255,0.06)]">
        <StatItem label="Posts"     value={profile.postsCount} />
        <StatItem label="Followers" value={profile.followersCount} />
        <StatItem label="Following" value={profile.followingCount} />
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-[rgba(255,255,255,0.06)]">
        {(['posts', 'likes'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors border-b-2 ${
              tab === t
                ? 'text-white border-[#7c5cfc]'
                : 'text-neutral-500 border-transparent hover:text-neutral-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Post Grid ── */}
      <div className="grid grid-cols-3 gap-0.5">
        {!posts?.length ? (
          <div className="col-span-3 py-16 text-center text-neutral-600 text-sm">
            No posts yet
          </div>
        ) : (
          posts.map((post) => (
            <button
              key={post.id}
              onClick={() => setActivePostId(post.id)}
              className="relative aspect-square overflow-hidden bg-neutral-900 group"
            >
              <Image
                src={post.imageUrl}
                alt={post.caption || ''}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="33vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  ♥ {post.likeCount}
                </span>
              </div>
            </button>
          ))
        )}
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