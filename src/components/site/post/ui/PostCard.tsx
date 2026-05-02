'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PostToast } from './PostToast';
import { DeleteDialog } from './DeleteDialog';
import { PostActionsBar } from './PostActionBar';
import { CommentSection } from './CommentSection';
import { LikesSheet } from '@/components/features/likes/LikesSheet';
import { useToggleLike } from '@/hooks/post/useLike';
import { useIsSaved, useToggleSave } from '@/hooks/post/useSave';
import type { Post } from '@/types/post';

// Types

interface PostCardProps {
  post: Post;
  currentUserId?: number;
}

// Helpers

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 2592000) return `${Math.floor(diff / 604800)}w ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
}

// Component

/**
 * Post card shown in the feed.
 * Handles like/save with optimistic UI, comments sheet, likes sheet,
 * and desktop overlay navigation.
 */
export function PostCard({ post, currentUserId }: PostCardProps) {
  const router = useRouter();

  const toggleLike = useToggleLike(post.id);
  const toggleSave = useToggleSave(post.id);
  const savedFromStore = useIsSaved(post.id);

  const [liked, setLiked] = useState(post.likedByMe ?? false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [saved, setSaved] = useState(savedFromStore || post.savedByMe || false);
  const [showFull, setShowFull] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  // Sync local state when post prop changes
  useEffect(() => {
    setLiked(Boolean(post.likedByMe));
    setLikeCount(post.likeCount);
    setCommentCount(post.commentCount);
    setSaved(Boolean(post.savedByMe));
  }, [post]);

  const showNotif = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleLike = () => {
    setLiked((p) => !p);
    setLikeCount((p) => (liked ? p - 1 : p + 1));
    toggleLike.mutate(liked, {
      onError: () => {
        setLiked(liked);
        setLikeCount((p) => (liked ? p + 1 : p - 1));
      },
    });
  };

  const handleSave = () => {
    const wasSaved = saved;
    setSaved((p) => !p);
    toggleSave.mutate(wasSaved, {
      onSuccess: () =>
        showNotif(wasSaved ? 'Removed from saved' : 'Post saved!'),
      onError: () => setSaved(wasSaved),
    });
  };

  const handleImageClickDesktop = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(
      `?postId=${post.id}&liked=${liked}&likeCount=${likeCount}&saved=${saved}`,
      { scroll: false },
    );
  };

  const caption = post.caption ?? '';
  const isLong = caption.length > 100;
  const displayCaption =
    !showFull && isLong ? caption.slice(0, 100) + '...' : caption;

  return (
    <>
      <PostToast message={toastMsg} show={showToast} />

      {deleteTarget !== null && (
        <DeleteDialog
          title='Delete Comment?'
          description='This comment will be permanently removed.'
          onConfirm={() => {
            window.dispatchEvent(
              new CustomEvent('confirm-delete-comment', {
                detail: deleteTarget,
              }),
            );
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <article className='flex flex-col w-full'>
        {/* Author */}
        <div className='flex items-center gap-3 px-4 py-3'>
          <Link href={`/profile/${post.author.username}`}>
            <Avatar className='size-10 border border-[rgba(126,145,183,0.32)]'>
              <AvatarImage
                src={post.author.avatarUrl ?? ''}
                alt={post.author.name}
              />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <div className='flex flex-col'>
            <Link href={`/profile/${post.author.username}`}>
              <span className='text-sm font-bold text-white'>
                {post.author.name}
              </span>
            </Link>
            <span className='text-xs text-neutral-400'>
              {timeAgo(post.createdAt)}
            </span>
          </div>
          <button className='ml-auto text-white'>
            <IoPaperPlaneOutline className='size-5' />
          </button>
        </div>

        {/* Image — mobile: navigate, desktop: overlay */}
        <Link
          href={`/post/${post.id}?liked=${liked}&likeCount=${likeCount}&saved=${saved}`}
          className='md:hidden'
        >
          <div className='relative w-full aspect-square overflow-hidden rounded-3xl'>
            <Image
              src={post.imageUrl}
              alt={caption}
              fill
              className='object-cover'
              sizes='100vw'
            />
          </div>
        </Link>

        <div
          className='relative w-full aspect-square overflow-hidden rounded-3xl cursor-pointer hidden md:block'
          onClick={handleImageClickDesktop}
        >
          <Image
            src={post.imageUrl}
            alt={caption}
            fill
            className='object-cover'
            sizes='(min-width: 768px) 600px, 100vw'
          />
        </div>

        {/* Actions */}
        <PostActionsBar
          liked={liked}
          likeCount={likeCount}
          saved={saved}
          commentCount={commentCount}
          isPendingLike={toggleLike.isPending}
          isPendingSave={toggleSave.isPending}
          onLike={handleLike}
          onSave={handleSave}
          onLikeCountClick={() => setShowLikes(true)}
          onCommentClick={() => setShowComments(true)}
        />

        {/* Caption */}
        <div className='px-4 py-2 pb-4'>
          <p className='text-sm text-white font-bold mb-1'>
            {post.author.name}
          </p>
          <p className='text-sm text-neutral-200'>
            {displayCaption}
            {isLong && (
              <button
                onClick={() => setShowFull((p) => !p)}
                className='block text-[var(--primary-200)] font-semibold mt-1'
              >
                {showFull ? 'Show Less' : 'Show More'}
              </button>
            )}
          </p>
        </div>

        <div className='h-px w-full bg-[rgba(126,145,183,0.1)]' />
      </article>

      {showLikes && (
        <LikesSheet
          postId={post.id}
          likeCount={likeCount}
          onClose={() => setShowLikes(false)}
        />
      )}

      {showComments && (
        <CommentSection
          postId={post.id}
          currentUserId={currentUserId}
          onClose={() => setShowComments(false)}
          onCommentAdded={() => setCommentCount((p) => p + 1)}
          onCommentDeleted={() => setCommentCount((p) => Math.max(0, p - 1))}
          onDeleteRequest={(id) => setDeleteTarget(id)}
        />
      )}
    </>
  );
}
