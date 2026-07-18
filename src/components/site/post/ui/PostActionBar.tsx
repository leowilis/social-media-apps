import {
  IoHeartOutline,
  IoHeart,
  IoChatbubbleOutline,
  IoBookmarkOutline,
  IoBookmark,
} from 'react-icons/io5';

interface PostActionsBarProps {
  liked: boolean;
  likeCount: number;
  saved: boolean;
  commentCount: number;
  isPendingLike: boolean;
  isPendingSave: boolean;
  onLike: () => void;
  onSave: () => void;
  onLikeCountClick: () => void;
  onCommentClick?: () => void;
  showCommentButton?: boolean;
}

/**
 * Action bar shared by PostCard and PostDetail (mobile & desktop).
 * Contains like toggle, comment count, and save toggle.
 */
export function PostActionsBar({
  liked,
  likeCount,
  saved,
  commentCount,
  isPendingLike,
  isPendingSave,
  onLike,
  onSave,
  onLikeCountClick,
  onCommentClick,
  showCommentButton = true,
}: PostActionsBarProps) {
  return (
    <div className='flex items-center justify-between px-4 py-3 border-b border-white/5 select-none'>
      <div className='flex items-center gap-4'>
        {/* Like */}
        <div className='flex items-center gap-1'>
          <button
            type='button'
            onClick={onLike}
            disabled={isPendingLike}
            aria-label={liked ? 'Unlike post' : 'Like post'}
            className='text-white disabled:opacity-60 transition-all cursor-pointer'
          >
            {liked ? (
              <IoHeart
                className='size-6 text-red-500 animate-in heart-pop'
                aria-hidden='true'
              />
            ) : (
              <IoHeartOutline
                className='size-6 text-neutral-300 hover:text-white transition-colors'
                aria-hidden='true'
              />
            )}
          </button>
          <button
            type='button'
            aria-label='View likes'
            onClick={onLikeCountClick}
            className='text-xs font-bold text-neutral-200 tracking-tight cursor-pointer hover:text-primary-300 transition-colors outline-none focus-visible:underline disabled:cursor-default disabled:hover:text-neutral-200 tabular-nums shrink-0 pt-0.5'
          >
            {likeCount}
          </button>
        </div>

        {/* Comment */}
        {showCommentButton && (
          <button
            type='button'
            aria-label='View comments'
            onClick={onCommentClick}
            className='flex items-center gap-1 text-white cursor-pointer'
          >
            <IoChatbubbleOutline
              className='size-6 group-hover:text-white transition-colors'
              aria-hidden='true'
            />
            <span className='text-xs font-bold tracking-tight tabular-nums pt-0.5'>
              {commentCount}
            </span>
          </button>
        )}
      </div>

      {/* Save */}
      <button
        type='button'
        onClick={onSave}
        disabled={isPendingSave}
        aria-label={saved ? 'Remove from saved' : 'Save post'}
        className='text-white shrink-0 p-0.5 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-primary-400 transition-all hover:scale-105 active:scale-90 disabled:opacity-40 cursor-pointer'
      >
        {saved ? (
          <IoBookmark
            className='text-primary-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.3)] animate-in pop-in'
            aria-hidden='true'
          />
        ) : (
          <IoBookmarkOutline
            className='size-6 text-neutral-300 hover:text-white transition-colors'
            aria-hidden='true'
          />
        )}
      </button>
    </div>
  );
}
