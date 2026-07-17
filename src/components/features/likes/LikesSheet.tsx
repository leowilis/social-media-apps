'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoCheckmark, IoCloseOutline } from 'react-icons/io5';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '@/lib/axios';
import { useToggleFollow } from '@/hooks/profile/useFollow';

interface LikeUser {
  id: number;
  username: string;
  name: string;
  avatarUrl: string;
  isFollowedByMe: boolean;
  isMe: boolean;
  followsMe: boolean;
}

interface Props {
  postId: number | string;
  likeCount: number;
  onClose: () => void;
}

export function LikesSheet({ postId, likeCount, onClose }: Props) {
  const [users, setUsers] = useState<LikeUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const toggleFollow = useToggleFollow();

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadLikes() {
      try {
        const res = await api.get(`/posts/${postId}/likes`, {
          params: {
            page: 1,
            limit: 20,
          },
        });

        if (!mounted) return;

        setUsers(res.data.data?.users ?? []);
      } catch {
        if (!mounted) return;

        setUsers([]);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadLikes();

    return () => {
      mounted = false;
    };
  }, [postId]);

  const handleFollow = (user: LikeUser) => {
    if (user.isMe || toggleFollow.isPending) return;

    toggleFollow.mutate({
      username: user.username,
      isFollowing: user.isFollowedByMe,
    });

    setUsers((prev) =>
      prev.map((item) =>
        item.id === user.id
          ? {
              ...item,
              isFollowedByMe: !item.isFollowedByMe,
            }
          : item,
      ),
    );
  };

  return (
    <>
      <div
        className='fixed inset-0 z-40 bg-black/70 backdrop-blur-sm'
        onClick={onClose}
        aria-hidden='true'
      />

      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby='likes-title'
        className='fixed left-1/2 top-1/2 z-50 flex max-h-[70vh] w-[92vw] max-w-sm -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl'
      >
        {/* Header */}
        <div className='flex items-center justify-between border-b border-white/5 bg-neutral-950 px-5 py-4'>
          <div className='flex items-center gap-2'>
            <h2 id='likes-title' className='text-sm font-bold text-white'>
              Likes
            </h2>

            <span className='rounded-full bg-primary-500/10 px-2 py-0.5 text-[10px] font-bold text-primary-400'>
              {likeCount}
            </span>
          </div>

          <button
            type='button'
            aria-label='Close likes'
            onClick={onClose}
            className='flex size-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400'
          >
            <IoCloseOutline className='size-5' aria-hidden='true' />
          </button>
        </div>

        {/* Body */}
        <div className='flex-1 space-y-1 overflow-y-auto bg-neutral-950/95 px-4 py-3'>
          {isLoading ? (
            <div className='flex justify-center py-16'>
              <div className='size-6 animate-spin rounded-full border-2 border-primary-400 border-t-transparent' />
            </div>
          ) : users.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16'>
              <p className='text-sm font-semibold text-neutral-300'>
                No likes yet
              </p>

              <p className='text-xs text-neutral-500'>
                Be the first to like this post
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className='flex items-center gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-white/5'
              >
                <Link
                  href={`/profile/${user.username}`}
                  onClick={onClose}
                  className='shrink-0'
                >
                  <Avatar className='size-11 border border-white/10'>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />

                    <AvatarFallback className='bg-neutral-900 text-primary-400'>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <Link
                  href={`/profile/${user.username}`}
                  onClick={onClose}
                  className='min-w-0 flex-1'
                >
                  <p className='truncate text-sm font-bold text-white'>
                    {user.name}
                  </p>

                  <p className='truncate text-xs text-neutral-500'>
                    @{user.username}
                  </p>
                </Link>

                {!user.isMe && (
                  <button
                    type='button'
                    disabled={toggleFollow.isPending}
                    onClick={() => handleFollow(user)}
                    className={`flex min-w-[94px] items-center justify-center gap-1 rounded-full px-4 py-1.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                      user.isFollowedByMe
                        ? 'border border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    {toggleFollow.isPending ? (
                      <div className='size-3 animate-spin rounded-full border border-current border-t-transparent' />
                    ) : user.isFollowedByMe ? (
                      <>
                        <IoCheckmark className='size-3' aria-hidden='true' />
                        Following
                      </>
                    ) : (
                      'Follow'
                    )}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
